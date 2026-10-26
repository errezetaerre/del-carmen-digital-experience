import { createHash, randomBytes } from "crypto";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";
import { getNewsletterOrigin, getRedisSettings, logMailConfigurationError } from "@/config/mail";
import { newsletterActionHeaders } from "@/config/newsletterHttp";
import { localizeHref, type SiteLocale } from "@/i18n/config";
import { resolveFormLocale } from "@/i18n/formPrivacyCopy";
import { hasAllowedRequestOrigin, readFormText } from "@/shared/lib/server/readFormJson";
import { confirmSubscription, unsubscribeSubscription } from "./subscriberLifecycle";
import { newsletterActionPage, type NewsletterAction } from "./actionPage";

const validToken = (token: string) => /^[a-f0-9]{64}$/i.test(token);
const hash = (token: string) => createHash("sha256").update(token).digest("hex");
const presentationLocale = (request: Request) => resolveFormLocale(new URL(request.url).searchParams.get("locale") ?? undefined) ?? "en";

function result(request: Request, action: NewsletterAction, success: boolean, locale: SiteLocale) {
    const state = action === "confirm" ? success ? "success" : "invalid" : success ? "unsubscribed" : "invalid-unsubscribe";
    try {
        const url = new URL(localizeHref(`/?newsletter=${state}#invitation`, locale), getNewsletterOrigin(request));
        return NextResponse.redirect(url, { status: 303, headers: newsletterActionHeaders });
    } catch (error) {
        logMailConfigurationError("Newsletter result", error);
        return newsletterActionPage(action, locale, "unavailable", undefined, 503);
    }
}

export function newsletterActionGet(request: Request, action: NewsletterAction): Response {
    const token = new URL(request.url).searchParams.get("token")?.trim() ?? "";
    const locale = presentationLocale(request);
    if (!validToken(token)) return result(request, action, false, locale);
    // GET (and Next's automatic HEAD) never reads/writes subscriber state.
    return newsletterActionPage(action, locale, "action", token);
}

export async function newsletterActionPost(request: Request, action: NewsletterAction): Promise<Response> {
    let locale: SiteLocale = presentationLocale(request);
    if (!hasAllowedRequestOrigin(request)) return newsletterActionPage(action, locale, "invalidRequest", undefined, 403);
    const mediaType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
    if (mediaType !== "application/x-www-form-urlencoded") return newsletterActionPage(action, locale, "invalidRequest", undefined, 415);
    const body = await readFormText(request, 2048);
    if (!body.ok) return newsletterActionPage(action, locale, "invalidRequest", undefined, body.status);
    const fields = new URLSearchParams(body.text);
    const oneClick = action === "unsubscribe" && fields.get("List-Unsubscribe") === "One-Click";
    const allowed = oneClick ? ["List-Unsubscribe"] : ["token", "locale"];
    if (Array.from(fields.keys()).some(key => !allowed.includes(key) || fields.getAll(key).length !== 1)) return newsletterActionPage(action, locale, "invalidRequest", undefined, 400);
    const selectedLocale = resolveFormLocale(fields.get("locale") ?? undefined);
    if (!selectedLocale) return newsletterActionPage(action, locale, "invalidRequest", undefined, 400);
    if (!oneClick) locale = selectedLocale;
    const token = (oneClick ? new URL(request.url).searchParams.get("token") : fields.get("token"))?.trim() ?? "";
    if (!validToken(token)) return oneClick ? NextResponse.json({ error: "Invalid request." }, { status: 400 }) : result(request, action, false, locale);

    let redis: Redis;
    try {
        // A broken origin must not consume a confirmation before redirecting.
        getNewsletterOrigin(request);
        redis = new Redis(getRedisSettings());
    } catch (error) {
        logMailConfigurationError("Newsletter action", error);
        return oneClick ? NextResponse.json({ error: "Service unavailable." }, { status: 503 }) : newsletterActionPage(action, locale, "unavailable", token, 503);
    }
    try {
        // Provider one-click requests can share an egress IP across many
        // recipients. Never impose the per-visitor form quota on that flow.
        if (!oneClick) {
            const limiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "10 m"), analytics: false, prefix: `del-carmen:newsletter-action:${action}` });
            const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
            const rate = await limiter.limit(ip);
            if (!rate.success) {
                const retry = String(Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000)));
                return newsletterActionPage(action, locale, "rateLimited", token, 429, { "Retry-After": retry });
            }
        }
        const success = action === "confirm"
            ? await confirmSubscription(redis, hash(token), hash(randomBytes(32).toString("hex")), new Date().toISOString())
            : await unsubscribeSubscription(redis, hash(token), new Date().toISOString());
        // One-click receivers get a direct, idempotent response, never redirect.
        if (oneClick) return NextResponse.json({ success: true });
        return result(request, action, success, locale);
    } catch {
        console.error("Newsletter action: subscription service unavailable.");
        return oneClick ? NextResponse.json({ error: "Service unavailable." }, { status: 503 }) : newsletterActionPage(action, locale, "unavailable", token, 503);
    }
}
