import "server-only";

import { legalContact } from "./legal";
import { currentPublicOrigin, resolveSiteOrigin } from "./siteOrigin";

type Environment = Record<string, string | undefined>;

export class MailConfigurationError extends Error {
    constructor(public readonly code: string, public readonly fields: string[]) {
        super("Mail service configuration is incomplete or invalid.");
        this.name = "MailConfigurationError";
    }
}

function required(env: Environment, field: string) {
    const value = env[field]?.trim();
    if (!value) throw new MailConfigurationError("missing", [field]);
    return value;
}

function mailbox(value: string, field: string, displayName = false) {
    const match = displayName ? /^[^<>\r\n]+<([^<>]+)>$/.exec(value) : null;
    const address = match ? match[1] : value;
    if (/[\r\n]/.test(value) || address.length > 254 ||
        !/^[^\s@<>,]+@[^\s@<>,]+\.[^\s@<>,]+$/.test(address)) {
        throw new MailConfigurationError("invalid_mailbox", [field]);
    }
    return address;
}

function isProduction(env: Environment) {
    return env.VERCEL_ENV ? env.VERCEL_ENV === "production" : env.NODE_ENV === "production";
}

function sender(env: Environment, field: string) {
    const from = env[field]?.trim() || env.MAIL_FROM?.trim() ||
        (!isProduction(env) ? "Del Carmen <onboarding@resend.dev>" : "");
    if (!from) throw new MailConfigurationError("missing_sender", [field, "MAIL_FROM"]);
    const address = mailbox(from, env[field]?.trim() ? field : env.MAIL_FROM?.trim() ? "MAIL_FROM" : field, true);
    if (isProduction(env) && address.toLowerCase().endsWith("@resend.dev")) {
        throw new MailConfigurationError("test_sender_in_production", [field, "MAIL_FROM"]);
    }
    // Preserve explicit display names; give bare configured addresses the
    // approved sender identity without changing recipients or Reply-To.
    return from.includes("<") ? from : `Rolando Del Carmen <${address}>`;
}

export function getContactMailSettings(env: Environment = process.env) {
    const to = required(env, "CONTACT_EMAIL_TO");
    mailbox(to, "CONTACT_EMAIL_TO");
    return { apiKey: required(env, "RESEND_API_KEY"), from: sender(env, "CONTACT_EMAIL_FROM"), to };
}

export function getNewsletterMailSettings(env: Environment = process.env) {
    const replyTo = env.MAIL_REPLY_TO?.trim() || legalContact.email;
    mailbox(replyTo, "MAIL_REPLY_TO");
    return { apiKey: required(env, "RESEND_API_KEY"), from: sender(env, "NEWSLETTER_EMAIL_FROM"), replyTo };
}

export function getRedisSettings(env: Environment = process.env) {
    const value = required(env, "UPSTASH_REDIS_REST_URL");
    try {
        const url = new URL(value);
        if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error();
    } catch {
        throw new MailConfigurationError("invalid_redis_url", ["UPSTASH_REDIS_REST_URL"]);
    }
    return { url: value, token: required(env, "UPSTASH_REDIS_REST_TOKEN") };
}

export function getNewsletterOrigin(request: Request, env: Environment = process.env): string {
    if (env.VERCEL_ENV === "preview") {
        const host = required(env, "VERCEL_URL");
        try { return resolveSiteOrigin(host.includes("://") ? host : `https://${host}`); }
        catch { throw new MailConfigurationError("invalid_site_origin", ["VERCEL_URL"]); }
    }
    if (!isProduction(env)) {
        // Local email tests may use HTTP loopback. Arbitrary request/Host
        // values must never become a link in an outgoing email.
        const host = request.headers.get("host") || new URL(request.url).host;
        try {
            const protocol = request.headers.get("x-forwarded-proto")?.split(",", 1)[0].trim() || new URL(request.url).protocol.slice(0, -1);
            const local = new URL(`${protocol}://${host}`);
            if (["localhost", "127.0.0.1", "[::1]"].includes(local.hostname) &&
                ["http:", "https:"].includes(local.protocol) && !local.username && !local.password && local.pathname === "/" && !local.search && !local.hash) return local.origin;
        } catch { /* Use the known public origin. */ }
    }
    const configured = env.SITE_URL?.trim() || env.NEXT_PUBLIC_SITE_URL?.trim();
    if (configured) {
        try { return resolveSiteOrigin(configured); }
        catch { throw new MailConfigurationError("invalid_site_origin", [env.SITE_URL?.trim() ? "SITE_URL" : "NEXT_PUBLIC_SITE_URL"]); }
    }
    return currentPublicOrigin;
}

export function logMailConfigurationError(scope: string, error: unknown) {
    // Never log credentials, mail bodies, tokens or the URL that failed parsing.
    console.error(`${scope}: service configuration unavailable`, error instanceof MailConfigurationError
        ? { code: error.code, fields: error.fields } : { code: "unavailable" });
}
