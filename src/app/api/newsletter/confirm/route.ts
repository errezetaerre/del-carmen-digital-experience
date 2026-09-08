import { createHash, randomBytes } from "crypto";

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
    confirmationTokenHash?: string;
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
    result: "success" | "invalid",
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
        requestUrl.searchParams.get("token")?.trim() || "";

    /*
     * ======================================================
     * 01 — TOKEN VALIDATION
     * ======================================================
     */

    if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
        return redirectToResult(request, "invalid");
    }

    const tokenHash = hashToken(token);

    const confirmationKey =
        `newsletter:confirmation:${tokenHash}`;

    /*
     * ======================================================
     * 02 — RESOLVE TOKEN
     * ======================================================
     */

    const email =
        await redis.get<string>(confirmationKey);

    if (!email) {
        return redirectToResult(request, "invalid");
    }

    const subscriberKey =
        `newsletter:subscriber:${email}`;

    const subscriber =
        await redis.get<NewsletterSubscriber>(
            subscriberKey,
        );

    if (!subscriber) {
        await redis.del(confirmationKey);

        return redirectToResult(request, "invalid");
    }

    /*
     * ======================================================
     * 03 — CREATE UNSUBSCRIBE TOKEN
     * ======================================================
     */

    const unsubscribeToken =
        randomBytes(32).toString("hex");

    const unsubscribeTokenHash =
        hashToken(unsubscribeToken);

    const unsubscribeKey =
        `newsletter:unsubscribe:${unsubscribeTokenHash}`;

    /*
     * ======================================================
     * 04 — ACTIVATE SUBSCRIBER
     * ======================================================
     */

    const activeSubscriber: NewsletterSubscriber = {
        ...subscriber,
        status: "active",
        confirmedAt: new Date().toISOString(),
        unsubscribedAt: null,
        unsubscribeTokenHash,
        confirmationTokenHash: undefined,
    };

    try {
        await redis.set(
            subscriberKey,
            activeSubscriber,
        );

        await redis.set(
            unsubscribeKey,
            email,
        );

        await redis.sadd(
            "newsletter:subscribers",
            email,
        );

        /*
         * Confirmation token is one-time only.
         */

        await redis.del(confirmationKey);
    } catch (error) {
        console.error(
            "Newsletter confirmation error:",
            error,
        );

        return redirectToResult(request, "invalid");
    }

    /*
     * ======================================================
     * DEVELOPMENT ONLY
     *
     * Allows us to test unsubscribe locally.
     * We will remove this after testing.
     * ======================================================
     */

    // if (process.env.NODE_ENV === "development") {
    //     console.log(
    //         "Newsletter unsubscribe test URL:",
    //         `${getBaseUrl(request)}` +
    //         `/api/newsletter/unsubscribe?token=` +
    //         unsubscribeToken,
    //     );
    // }

    /*
     * ======================================================
     * 05 — RETURN TO HOME
     * ======================================================
     */

    return redirectToResult(request, "success");
}