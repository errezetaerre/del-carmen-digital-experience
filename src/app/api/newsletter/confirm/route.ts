import { localizeHref } from "@/i18n/config";
import { resolveFormLocale } from "@/i18n/formPrivacyCopy";
import { createHash, randomBytes } from "crypto";

import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

import { confirmSubscription } from "@/domains/newsletter/server/subscriberLifecycle";

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
    result: "success" | "invalid",
) {
    const locale = resolveFormLocale(new URL(request.url).searchParams.get("locale") ?? undefined) ?? "en";
    const url = new URL(
        localizeHref("/?newsletter=" + result + "#invitation", locale),
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
    const unsubscribeToken = randomBytes(32).toString("hex");

    try {
        const confirmed = await confirmSubscription(
            redis,
            tokenHash,
            hashToken(unsubscribeToken),
            new Date().toISOString(),
        );

        return redirectToResult(request, confirmed ? "success" : "invalid");
    } catch (error) {
        console.error("Newsletter confirmation error:", error);
        return redirectToResult(request, "invalid");
    }
}