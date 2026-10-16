import { createHash } from "crypto";

import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

import { unsubscribeSubscription } from "@/domains/newsletter/server/subscriberLifecycle";

const redis = Redis.fromEnv();

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

    try {
        const unsubscribed = await unsubscribeSubscription(
            redis,
            hashToken(token),
            new Date().toISOString(),
        );

        return redirectToResult(
            request,
            unsubscribed ? "unsubscribed" : "invalid-unsubscribe",
        );
    } catch (error) {
        console.error("Newsletter unsubscribe error:", error);
        return redirectToResult(request, "invalid-unsubscribe");
    }
}