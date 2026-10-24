import { createNewsletterConfirmationEmail } from "@/domains/newsletter/server/confirmationEmail";
import { createHash, randomBytes } from "crypto";

import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";

import { getFormPrivacy, resolveFormLocale } from "@/i18n/formPrivacyCopy";
import { readFormJson } from "@/shared/lib/server/readFormJson";

import {
    cleanFailedSubscriptionRequest,
    requestPendingSubscription,
} from "@/domains/newsletter/server/subscriberLifecycle";

const redis = Redis.fromEnv();

const resend = new Resend(process.env.RESEND_API_KEY);

const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    analytics: false,
    prefix: "del-carmen:newsletter",
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type NewsletterRequestBody = {
    email?: unknown;
    contactField?: unknown;
    source?: unknown;
    consent?: unknown;
    consentVersion?: unknown;
    locale?: unknown;
};

function hashToken(token: string) {
    return createHash("sha256")
        .update(token)
        .digest("hex");
}

function getBaseUrl(request: Request) {
    const configuredUrl =
        process.env.NEXT_PUBLIC_SITE_URL?.trim();

    if (configuredUrl) {
        return configuredUrl.replace(/\/$/, "");
    }

    return new URL(request.url).origin;
}

export async function POST(request: Request) {
    const payload = await readFormJson(request);
    if (!payload.ok) {
        return NextResponse.json({ error: payload.error, code: payload.code }, { status: payload.status });
    }
    const body: NewsletterRequestBody = payload.body;
    /*
     * ======================================================
     * 01 — RATE LIMIT
     * ======================================================
     */

    const forwardedFor =
        request.headers.get("x-forwarded-for");

    const ip =
        forwardedFor?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";

    let rate;
    try {
        rate = await ratelimit.limit(ip);
    } catch (error) {
        console.error("Newsletter rate limit service error:", error);
        return NextResponse.json({ error: "Newsletter service is temporarily unavailable." }, { status: 503 });
    }
    const { success, limit, remaining, reset } = rate;

    if (!success) {
        return NextResponse.json(
            {
                error: "Too many requests.",
            },
            {
                status: 429,
                headers: {
                    "X-RateLimit-Limit": String(limit),
                    "X-RateLimit-Remaining":
                        String(remaining),
                    "X-RateLimit-Reset": String(reset),
                },
            },
        );
    }

    const email =
        typeof body.email === "string"
            ? body.email.trim().toLowerCase()
            : "";

    const contactField =
        typeof body.contactField === "string"
            ? body.contactField.trim()
            : "";

    const source =
        typeof body.source === "string"
            ? body.source.trim().toLowerCase()
            : "unknown";

    /*
     * ======================================================
     * 03 — HONEYPOT
     * ======================================================
     */

    if (contactField) {
        return NextResponse.json(
            {
                success: true,
            },
            {
                status: 200,
            },
        );
    }

    /*
     * ======================================================
     * 04 — VALIDATION
     * ======================================================
     */

    const locale = resolveFormLocale(body.locale);
    if (!locale) return NextResponse.json({ error: "Invalid language.", code: "invalid_locale" }, { status: 400 });
    const privacy = getFormPrivacy(locale);

    if (
        !email ||
        email.length > 254 ||
        !EMAIL_PATTERN.test(email)
    ) {
        return NextResponse.json(
            {
                error:
                    "A valid email address is required.",
            },
            {
                status: 400,
            },
        );
    }

    /*
     * ======================================================
     * 05 — CREATE PENDING REQUEST ATOMICALLY
     * ======================================================
     */

    if (body.consent !== true) {
        return NextResponse.json(
            { error: "Consent is required to request a subscription.", code: "consent_required" },
            { status: 400 },
        );
    }

    if (body.consentVersion !== privacy.version) {
        return NextResponse.json(
            { error: "Please reload the form and review the current privacy notice.", code: "consent_outdated" },
            { status: 400 },
        );
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);

    try {
        const status = await requestPendingSubscription(
            redis,
            email,
            source,
            tokenHash,
            new Date().toISOString(),
            locale,
        );

        if (status === "active") {
            return NextResponse.json(
                { error: "Already subscribed." },
                { status: 409 },
            );
        }
    } catch (error) {
        console.error("Newsletter persistence error:", error);

        return NextResponse.json(
            { error: "Unable to subscribe." },
            { status: 500 },
        );
    }

    /*
     * ======================================================
     * 08 — CONFIRMATION URL
     * ======================================================
     */

    const confirmationUrl =
        `${getBaseUrl(request)}` +
        `/api/newsletter/confirm?token=` +
        encodeURIComponent(token) + (locale === "es" ? "&locale=es" : "");

    /*
     * ======================================================
     * 09 — SEND CONFIRMATION EMAIL
     * ======================================================
     */

    const confirmationEmail = createNewsletterConfirmationEmail(locale, confirmationUrl);

    try {
        const { error } =
            await resend.emails.send({
                from:
                    process.env
                        .NEWSLETTER_EMAIL_FROM ||
                    "Del Carmen <onboarding@resend.dev>",
                to: email,
                subject: confirmationEmail.subject,
                html: confirmationEmail.html,
            });

        if (error) {
            throw new Error(error.message);
        }
    } catch (error) {
        console.error(
            "Newsletter confirmation email error:",
            error,
        );

        /*
         * Remove only this failed request; a later request
         * or a confirmed subscription must survive.
         */

        try {
            await cleanFailedSubscriptionRequest(redis, email, tokenHash);
        } catch (cleanupError) {
            // Both pending keys still have a 24-hour maximum lifetime.
            console.error("Newsletter failed-request cleanup error:", cleanupError);
        }

        return NextResponse.json(
            {
                error:
                    "Unable to send confirmation email.",
            },
            {
                status: 500,
            },
        );
    }

    /*
     * ======================================================
     * 10 — SUCCESS
     * ======================================================
     */

    return NextResponse.json(
        {
            success: true,
            status: "pending",
        },
        {
            status: 201,
        },
    );
}
