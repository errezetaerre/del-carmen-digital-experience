import { createHash, randomBytes } from "crypto";

import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";

const redis = Redis.fromEnv();

const resend = new Resend(process.env.RESEND_API_KEY);

const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    analytics: true,
    prefix: "del-carmen:newsletter",
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONFIRMATION_TTL_SECONDS = 60 * 60 * 24;

type NewsletterRequestBody = {
    email?: unknown;
    contactField?: unknown;
    source?: unknown;
};

type NewsletterSubscriber = {
    email: string;
    requestedAt: string;
    confirmedAt: string | null;
    unsubscribedAt?: string | null;
    source: string;
    status: "pending" | "active" | "unsubscribed";
    confirmationTokenHash?: string;
    unsubscribeTokenHash?: string;
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

    const { success, limit, remaining, reset } =
        await ratelimit.limit(ip);

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

    /*
     * ======================================================
     * 02 — REQUEST BODY
     * ======================================================
     */

    let body: NewsletterRequestBody;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            {
                error: "Invalid request.",
            },
            {
                status: 400,
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

    const subscriberKey =
        `newsletter:subscriber:${email}`;

    /*
     * ======================================================
     * 05 — EXISTING SUBSCRIBER
     * ======================================================
     */

    const existingSubscriber =
        await redis.get<NewsletterSubscriber>(
            subscriberKey,
        );

    if (existingSubscriber?.status === "active") {
        return NextResponse.json(
            {
                error: "Already subscribed.",
            },
            {
                status: 409,
            },
        );
    }

    /*
     * ======================================================
     * 06 — CONFIRMATION TOKEN
     * ======================================================
     */

    const token =
        randomBytes(32).toString("hex");

    const tokenHash =
        hashToken(token);

    const confirmationKey =
        `newsletter:confirmation:${tokenHash}`;

    const requestedAt =
        new Date().toISOString();

    const subscriber: NewsletterSubscriber = {
        email,
        requestedAt,
        confirmedAt: null,
        unsubscribedAt: null,
        source,
        status: "pending",
        confirmationTokenHash: tokenHash,
    };

    /*
     * ======================================================
     * 07 — PERSIST PENDING SUBSCRIBER
     * ======================================================
     */

    try {
        /*
         * If this address already has a pending
         * confirmation, invalidate the old token.
         */

        if (
            existingSubscriber?.status === "pending" &&
            existingSubscriber.confirmationTokenHash
        ) {
            await redis.del(
                `newsletter:confirmation:${existingSubscriber.confirmationTokenHash}`,
            );
        }

        await redis.set(
            subscriberKey,
            subscriber,
        );

        await redis.set(
            confirmationKey,
            email,
            {
                ex: CONFIRMATION_TTL_SECONDS,
            },
        );
    } catch (error) {
        console.error(
            "Newsletter persistence error:",
            error,
        );

        return NextResponse.json(
            {
                error: "Unable to subscribe.",
            },
            {
                status: 500,
            },
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
        encodeURIComponent(token);

    /*
     * ======================================================
     * 09 — SEND CONFIRMATION EMAIL
     * ======================================================
     */

    try {
        const { error } =
            await resend.emails.send({
                from:
                    process.env
                        .NEWSLETTER_EMAIL_FROM ||
                    "Del Carmen <onboarding@resend.dev>",
                to: email,
                subject:
                    "Confirm your subscription — Del Carmen",
                html: `
                    <!doctype html>
                    <html lang="en">
                        <body
                            style="
                                margin:0;
                                padding:0;
                                background:#0B0B0B;
                                color:#f5f5f5;
                                font-family:Arial,sans-serif;
                            "
                        >
                            <div
                                style="
                                    max-width:600px;
                                    margin:0 auto;
                                    padding:64px 32px;
                                "
                            >
                                <p
                                    style="
                                        margin:0 0 24px;
                                        color:#C9A35A;
                                        font-size:11px;
                                        letter-spacing:4px;
                                        text-transform:uppercase;
                                    "
                                >
                                    Del Carmen
                                </p>

                                <h1
                                    style="
                                        margin:0 0 24px;
                                        color:#f5f5f5;
                                        font-family:Georgia,serif;
                                        font-size:36px;
                                        font-weight:400;
                                        line-height:1.15;
                                    "
                                >
                                    Continue the journey.
                                </h1>

                                <p
                                    style="
                                        margin:0 0 36px;
                                        color:#A1A1AA;
                                        font-size:16px;
                                        line-height:1.7;
                                    "
                                >
                                    Confirm your email address
                                    to receive occasional news
                                    about new artworks,
                                    exhibitions and studio
                                    updates.
                                </p>

                                <a
                                    href="${confirmationUrl}"
                                    style="
                                        display:inline-block;
                                        border:1px solid rgba(201,163,90,0.65);
                                        padding:14px 22px;
                                        color:#C9A35A;
                                        font-size:12px;
                                        font-weight:600;
                                        letter-spacing:2px;
                                        text-decoration:none;
                                        text-transform:uppercase;
                                    "
                                >
                                    Confirm subscription
                                </a>

                                <p
                                    style="
                                        margin:36px 0 0;
                                        color:#6f6f73;
                                        font-size:12px;
                                        line-height:1.6;
                                    "
                                >
                                    This confirmation link
                                    expires in 24 hours. If you
                                    did not request this
                                    subscription, you can
                                    ignore this email.
                                </p>
                            </div>
                        </body>
                    </html>
                `,
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
         * Don't leave an unusable pending record if
         * confirmation delivery fails.
         */

        await Promise.allSettled([
            redis.del(subscriberKey),
            redis.del(confirmationKey),
        ]);

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