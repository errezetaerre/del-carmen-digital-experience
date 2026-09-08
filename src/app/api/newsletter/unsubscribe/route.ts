import { createHash } from "crypto";

import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

type NewsletterSubscriber = {
    email: string;
    requestedAt: string;
    confirmedAt: string | null;
    unsubscribedAt?: string | null;
    source: string;
    status: "pending" | "active" | "unsubscribed";
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

function redirectToResult(
    request: Request,
    result: "unsubscribed" | "invalid-unsubscribe",
) {
    const url = new URL(
        `/?newsletter=${result}#invitation`,
        getBaseUrl(request),
    );

    return NextResponse.redirect(url);
}

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);

    const token =
        requestUrl.searchParams
            .get("token")
            ?.trim() || "";

    /*
     * ======================================================
     * 01 — TOKEN VALIDATION
     * ======================================================
     */

    if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
        return redirectToResult(
            request,
            "invalid-unsubscribe",
        );
    }

    const tokenHash = hashToken(token);

    const unsubscribeKey =
        `newsletter:unsubscribe:${tokenHash}`;

    /*
     * ======================================================
     * 02 — RESOLVE TOKEN
     * ======================================================
     */

    const email =
        await redis.get<string>(unsubscribeKey);

    if (!email) {
        return redirectToResult(
            request,
            "invalid-unsubscribe",
        );
    }

    const subscriberKey =
        `newsletter:subscriber:${email}`;

    const subscriber =
        await redis.get<NewsletterSubscriber>(
            subscriberKey,
        );

    if (!subscriber) {
        await redis.del(unsubscribeKey);

        return redirectToResult(
            request,
            "invalid-unsubscribe",
        );
    }

    /*
     * ======================================================
     * 03 — UNSUBSCRIBE
     * ======================================================
     */

    const unsubscribedSubscriber: NewsletterSubscriber = {
        ...subscriber,
        status: "unsubscribed",
        unsubscribedAt: new Date().toISOString(),
    };

    try {
        await redis.set(
            subscriberKey,
            unsubscribedSubscriber,
        );

        await redis.srem(
            "newsletter:subscribers",
            email,
        );

        /*
         * Unsubscribe token is one-time only.
         */

        await redis.del(unsubscribeKey);
    } catch (error) {
        console.error(
            "Newsletter unsubscribe error:",
            error,
        );

        return redirectToResult(
            request,
            "invalid-unsubscribe",
        );
    }

    return redirectToResult(
        request,
        "unsubscribed",
    );
}