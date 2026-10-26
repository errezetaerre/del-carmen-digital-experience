import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import { getNewsletterMailSettings, getNewsletterOrigin, getRedisSettings, logMailConfigurationError } from "@/config/mail";
import { getFormPrivacy, resolveFormLocale } from "@/i18n/formPrivacyCopy";
import { readFormJson } from "@/shared/lib/server/readFormJson";
import { createNewsletterConfirmationEmail } from "@/domains/newsletter/server/confirmationEmail";
import { cleanFailedSubscriptionRequest, requestPendingSubscription } from "@/domains/newsletter/server/subscriberLifecycle";

export async function POST(request: Request) {
    const payload = await readFormJson(request);
    if (!payload.ok) return NextResponse.json({ error: payload.error, code: payload.code }, { status: payload.status });
    const body = payload.body;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const source = typeof body.source === "string" ? body.source.trim().toLowerCase() : "unknown";
    const honeypot = typeof body.contactField === "string" ? body.contactField.trim() : "";
    if (honeypot) return NextResponse.json({ success: true });
    const locale = resolveFormLocale(body.locale);
    if (!locale) return NextResponse.json({ error: "Invalid language.", code: "invalid_locale" }, { status: 400 });
    const privacy = getFormPrivacy(locale);
    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    if (body.consent !== true) return NextResponse.json({ error: "Consent is required to request a subscription.", code: "consent_required" }, { status: 400 });
    if (body.consentVersion !== privacy.version) return NextResponse.json({ error: "Please reload the form and review the current privacy notice.", code: "consent_outdated" }, { status: 400 });

    let settings: ReturnType<typeof getNewsletterMailSettings>;
    let origin: string;
    let redis: Redis;
    try {
        settings = getNewsletterMailSettings();
        origin = getNewsletterOrigin(request);
        redis = new Redis(getRedisSettings());
    } catch (error) {
        logMailConfigurationError("Newsletter", error);
        return NextResponse.json({ error: "Newsletter service is temporarily unavailable." }, { status: 503 });
    }
    const ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "10 m"), analytics: false, prefix: "del-carmen:newsletter" });
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    try {
        const { success, limit, remaining, reset } = await ratelimit.limit(ip);
        if (!success) return NextResponse.json({ error: "Too many requests." }, {
            status: 429, headers: { "X-RateLimit-Limit": String(limit), "X-RateLimit-Remaining": String(remaining), "X-RateLimit-Reset": String(reset) },
        });
    } catch {
        console.error("Newsletter: rate limit service unavailable.");
        return NextResponse.json({ error: "Newsletter service is temporarily unavailable." }, { status: 503 });
    }
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    try {
        const status = await requestPendingSubscription(redis, email, source, tokenHash, new Date().toISOString(), locale);
        if (status === "active") return NextResponse.json({ error: "Already subscribed." }, { status: 409 });
    } catch {
        console.error("Newsletter: pending request could not be saved.");
        return NextResponse.json({ error: "Unable to subscribe." }, { status: 503 });
    }
    const confirmationUrl = `${origin}/api/newsletter/confirm?token=${encodeURIComponent(token)}` + (locale === "es" ? "&locale=es" : "");
    const confirmation = createNewsletterConfirmationEmail(locale, confirmationUrl);
    try {
        const { error } = await new Resend(settings.apiKey).emails.send({
            from: settings.from, replyTo: settings.replyTo, to: email,
            subject: confirmation.subject, html: confirmation.html, text: confirmation.text,
        });
        if (error) throw new Error("Delivery rejected.");
    } catch {
        console.error("Newsletter: confirmation email could not be sent.");
        try { await cleanFailedSubscriptionRequest(redis, email, tokenHash); }
        catch { console.error("Newsletter: failed-request cleanup unavailable; pending TTL remains bounded."); }
        return NextResponse.json({ error: "Unable to send confirmation email." }, { status: 502 });
    }
    return NextResponse.json({ success: true, status: "pending" }, { status: 201 });
}
