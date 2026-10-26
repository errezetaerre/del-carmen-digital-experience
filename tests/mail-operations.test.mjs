import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import test from "node:test";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";

const config = serverModules()("src/config/mail.ts");
const site = "https://studio.example.invalid";
const env = {
    NODE_ENV: "production", RESEND_API_KEY: "re_unit_test_only", MAIL_FROM: "Del Carmen <studio@example.invalid>",
    MAIL_REPLY_TO: "replies@example.invalid", CONTACT_EMAIL_TO: "owner@example.invalid", SITE_URL: site,
    UPSTASH_REDIS_REST_URL: "https://redis.example.invalid", UPSTASH_REDIS_REST_TOKEN: "redis_unit_test_only",
};
const request = new Request(`${site}/api/newsletter`);
const token = "ab".repeat(32);
const digest = value => createHash("sha256").update(value).digest("hex");

test("sender overrides, reply address and temporary destination are separate", () => {
    assert.equal(config.getContactMailSettings(env).from, env.MAIL_FROM);
    assert.equal(config.getContactMailSettings(env).to, env.CONTACT_EMAIL_TO);
    assert.equal(config.getNewsletterMailSettings(env).replyTo, env.MAIL_REPLY_TO);
    assert.equal(config.getNewsletterMailSettings({ ...env, NEWSLETTER_EMAIL_FROM: "Newsletter <news@example.invalid>" }).from, "Newsletter <news@example.invalid>");
    assert.equal(config.getContactMailSettings({ ...env, CONTACT_EMAIL_FROM: "Enquiries <contact@example.invalid>" }).from, "Enquiries <contact@example.invalid>");
});

test("bare sender addresses use the approved identity while explicit names remain intact", () => {
    const address = "no-reply@example.invalid";
    assert.equal(config.getContactMailSettings({ ...env, MAIL_FROM: address }).from, `Rolando Del Carmen <${address}>`);
    assert.equal(config.getContactMailSettings({ ...env, CONTACT_EMAIL_FROM: address }).from, `Rolando Del Carmen <${address}>`);
    assert.equal(config.getNewsletterMailSettings({ ...env, NEWSLETTER_EMAIL_FROM: address }).from, `Rolando Del Carmen <${address}>`);
    assert.equal(config.getNewsletterMailSettings({ ...env, NEWSLETTER_EMAIL_FROM: `Studio News <${address}>` }).from, `Studio News <${address}>`);
});

for (const update of [
    { RESEND_API_KEY: "" }, { CONTACT_EMAIL_TO: "" }, { CONTACT_EMAIL_TO: "bad" },
    { MAIL_FROM: "" }, { MAIL_FROM: "Del Carmen <onboarding@resend.dev>" },
    { MAIL_FROM: "Bad\r\nBcc: victim@example.invalid" }, { MAIL_REPLY_TO: "bad\nvalue" },
]) {
    test(`invalid mail configuration is rejected: ${Object.keys(update).join()}`, () => {
        const check = "MAIL_REPLY_TO" in update ? config.getNewsletterMailSettings : config.getContactMailSettings;
        assert.throws(() => check({ ...env, ...update }), config.MailConfigurationError);
    });
}

test("testing sender is available only outside production", () => {
    assert.match(config.getContactMailSettings({ ...env, NODE_ENV: "development", MAIL_FROM: "" }).from, /onboarding@resend.dev/);
    assert.throws(() => config.getContactMailSettings({ ...env, VERCEL_ENV: "production", NODE_ENV: "development", MAIL_FROM: "" }));
});

test("links use SITE_URL, retain the validated legacy fallback and ignore forged Host", () => {
    assert.equal(config.getNewsletterOrigin(request, { ...env, NEXT_PUBLIC_SITE_URL: "https://legacy.example.invalid" }), site);
    assert.equal(config.getNewsletterOrigin(request, { ...env, SITE_URL: "", NEXT_PUBLIC_SITE_URL: "https://legacy.example.invalid" }), "https://legacy.example.invalid");
    const hostile = new Request("https://attacker.example.invalid/api/newsletter", { headers: { Host: "attacker.example.invalid" } });
    assert.equal(config.getNewsletterOrigin(hostile, env), site);
    assert.equal(config.getNewsletterOrigin(hostile, { NODE_ENV: "production" }), "https://rolandodelcarmen.com");
});

test("Preview links stay on their own deployment even with production SITE_URL", () => {
    assert.equal(config.getNewsletterOrigin(request, { ...env, VERCEL_ENV: "preview", VERCEL_URL: "preview.example.invalid" }), "https://preview.example.invalid");
    assert.throws(() => config.getNewsletterOrigin(request, { ...env, VERCEL_ENV: "preview" }), config.MailConfigurationError);
});

test("local testing retains loopback port instead of linking to production", () => {
    const local = new Request("http://localhost:3010/api/newsletter", { headers: { Host: "localhost:3010" } });
    assert.equal(config.getNewsletterOrigin(local, { ...env, NODE_ENV: "development" }), "http://localhost:3010");
    assert.equal(config.getNewsletterOrigin(local, env), site);
});

for (const value of ["http://public.example.invalid", "https://user:secret@public.example.invalid", "https://public.example.invalid/path", "https://public.example.invalid?token=secret", "javascript:alert(1)"]) {
    test("invalid configured origins fail without including their contents in errors", () => {
        try { config.getNewsletterOrigin(request, { ...env, SITE_URL: value }); assert.fail("Should reject origin"); }
        catch (error) { assert.ok(error instanceof config.MailConfigurationError); assert.ok(!error.message.includes(value)); }
    });
}

for (const value of ["", "http://redis.example.invalid", "https://user:secret@redis.example.invalid", "https://redis.example.invalid/path"]) {
    test("Redis settings require a credential and an HTTPS origin", () => {
        assert.throws(() => config.getRedisSettings({ ...env, UPSTASH_REDIS_REST_URL: value }), config.MailConfigurationError);
    });
}

function fixture(scenario = {}) {
    const calls = { get: [], eval: [], rate: [], send: [], pending: [], cleanup: [], clients: 0 };
    const settings = {
        ...config,
        getContactMailSettings() { if (scenario.configError) throw new config.MailConfigurationError("missing_sender", ["MAIL_FROM"]); return config.getContactMailSettings(env); },
        getNewsletterMailSettings() { if (scenario.configError) throw new config.MailConfigurationError("missing_sender", ["MAIL_FROM"]); return config.getNewsletterMailSettings(env); },
        getRedisSettings: () => config.getRedisSettings(env),
        getNewsletterOrigin() { if (scenario.originError) throw new config.MailConfigurationError("invalid_site_origin", ["SITE_URL"]); return site; },
        logMailConfigurationError() {},
    };
    const mocks = new Map([
        ["@/config/mail", settings],
        ["next/server", { NextResponse: {
            json: (body, init) => Response.json(body, init),
            redirect: (url, init) => new Response(null, { ...init, headers: { ...init?.headers, Location: String(url) } }),
        } }],
        ["@upstash/redis", { Redis: class {
            constructor() { calls.clients++; }
            async get(key) { calls.get.push(key); if (scenario.databaseError) throw new Error("Private data must not be logged"); return scenario.missing ? null : "reader@example.invalid"; }
            async eval(...args) { calls.eval.push(args); return scenario.expired ? 0 : 1; }
        } }],
        ["@upstash/ratelimit", { Ratelimit: class {
            constructor(options) { this.options = options; }
            static slidingWindow() { return {}; }
            async limit(key) { calls.rate.push([key, this.options.prefix]); return { success: !scenario.rateDenied, reset: Date.now() + 5000, limit: 5, remaining: 4 }; }
        } }],
        ["resend", { Resend: class { emails = { send: async mail => { calls.send.push(mail); return { error: scenario.sendError ? { message: "rejected" } : null }; } }; } }],
    ]);
    if (!scenario.realLifecycle) mocks.set("@/domains/newsletter/server/subscriberLifecycle", {
        requestPendingSubscription: async (...args) => { calls.pending.push(args); return scenario.active ? "active" : "pending"; },
        cleanFailedSubscriptionRequest: async (...args) => { calls.cleanup.push(args); },
    });
    return { load: serverModules(mocks), calls };
}

function actionRequest(action, fields = { token, locale: "es" }, headers = {}) {
    return new Request(`${site}/api/newsletter/${action}`, { method: "POST", headers: { Origin: site, "Content-Type": "application/x-www-form-urlencoded", ...headers }, body: new URLSearchParams(fields) });
}

for (const action of ["confirm", "unsubscribe"]) {
    for (const locale of ["en", "es"]) {
        test(`${action} ${locale}: GET only presents a button and never accesses services`, async () => {
            const { load, calls } = fixture();
            const { GET } = load(`src/app/api/newsletter/${action}/route.ts`);
            const response = GET(new Request(`${site}/api/newsletter/${action}?token=${token}&locale=${locale}`));
            const html = await response.text();
            assert.equal(response.status, 200);
            assert.match(html, new RegExp(`<html lang="${locale}">`));
            assert.match(html, /method="post"/);
            assert.doesNotMatch(html, /<script|<img|<iframe/);
            assert.equal(response.headers.get("cache-control"), "no-store");
            assert.equal(response.headers.get("referrer-policy"), "strict-origin");
            assert.match(response.headers.get("content-security-policy"), /default-src 'none'/);
            assert.equal(calls.clients + calls.get.length + calls.eval.length + calls.rate.length + calls.send.length, 0);
        });
    }

    test(`${action}: explicit POST hashes the token and returns a GET redirect`, async () => {
        const { load, calls } = fixture();
        const { POST } = load(`src/app/api/newsletter/${action}/route.ts`);
        const response = await POST(actionRequest(action));
        assert.equal(response.status, 303);
        assert.equal(new URL(response.headers.get("location")).pathname, "/es");
        assert.match(response.headers.get("location"), action === "confirm" ? /newsletter=success/ : /newsletter=unsubscribed/);
        assert.equal(calls.eval[0][2][1], digest(token));
        assert.equal(calls.send.length, 0);
    });

    test(`${action}: wrong origin/media, duplicate fields and oversized payload cannot access services`, async () => {
        for (const [fields, headers, expected] of [
            [{ token, locale: "es" }, { Origin: "https://other.example.invalid" }, 403],
            [{ token, locale: "es" }, { "Content-Type": "application/json" }, 415],
            [[['token',token],['token',token]], {}, 400],
            [{ token: "a".repeat(3000) }, {}, 413],
            [{ token, locale: "fr" }, {}, 400],
        ]) {
            const { load, calls } = fixture();
            const { POST } = load(`src/app/api/newsletter/${action}/route.ts`);
            assert.equal((await POST(actionRequest(action, fields, headers))).status, expected);
            assert.equal(calls.clients + calls.eval.length, 0);
        }
    });

    test(`${action}: unavailable persistence can retry; configuration failure does not consume a token`, async t => {
        t.mock.method(console, "error", () => {});
        for (const scenario of [{ databaseError: true, realLifecycle: true }, { originError: true }]) {
            const { load, calls } = fixture(scenario);
            const { POST } = load(`src/app/api/newsletter/${action}/route.ts`);
            const response = await POST(actionRequest(action));
            assert.equal(response.status, 503);
            assert.match(await response.text(), /name="token"/);
            assert.equal(calls.eval.length, 0);
        }
    });

    test(`${action}: rate denial is retryable, while expired/used links return their existing result`, async () => {
        const denied = fixture({ rateDenied: true });
        const response = await denied.load(`src/app/api/newsletter/${action}/route.ts`).POST(actionRequest(action));
        assert.equal(response.status, 429);
        assert.ok(Number(response.headers.get("retry-after")) > 0);
        assert.equal(denied.calls.eval.length, 0);
        const expired = fixture({ expired: true });
        const result = await expired.load(`src/app/api/newsletter/${action}/route.ts`).POST(actionRequest(action));
        assert.match(result.headers.get("location"), /newsletter=invalid/);
    });
}

test("provider one-click unsubscribe has no redirect, cookie, account or shared-IP form limit", async () => {
    const { load, calls } = fixture({ expired: true, rateDenied: true });
    const { POST } = load("src/app/api/newsletter/unsubscribe/route.ts");
    const response = await POST(new Request(`${site}/api/newsletter/unsubscribe?token=${token}`, {
        method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "List-Unsubscribe=One-Click",
    }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("location"), null);
    assert.equal(response.headers.get("set-cookie"), null);
    assert.equal(calls.rate.length, 0);
    assert.equal(calls.eval[0][2][1], digest(token));
});

for (const kind of ["contact", "newsletter"]) {
    test(`${kind}: incomplete configuration does not contact providers`, async () => {
        const { load, calls } = fixture({ configError: true });
        const privacy = load("src/i18n/formPrivacyCopy.ts").getFormPrivacy("es");
        const body = { name: "María", email: "reader@example.invalid", subject: "artworks", message: "Una consulta", consent: true, consentVersion: privacy.version, locale: "es" };
        const response = await load(`src/app/api/${kind}/route.ts`).POST(new Request(`${site}/api/${kind}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }));
        assert.equal(response.status, 503);
        assert.equal(calls.clients + calls.send.length + calls.pending.length, 0);
    });
}

test("confirmation delivery failure cleans only its pending token; email has HTML, text and a monitored reply address", async t => {
    t.mock.method(console, "error", () => {});
    const { load, calls } = fixture({ sendError: true });
    const privacy = load("src/i18n/formPrivacyCopy.ts").getFormPrivacy("es");
    const body = { email: "reader@example.invalid", consent: true, consentVersion: privacy.version, locale: "es" };
    const response = await load("src/app/api/newsletter/route.ts").POST(new Request(`${site}/api/newsletter`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }));
    assert.equal(response.status, 502);
    assert.equal(calls.send.length, 1);
    assert.equal(calls.send[0].replyTo, env.MAIL_REPLY_TO);
    assert.ok(calls.send[0].text.includes("locale=es"));
    const href = /href="([^"]+)"/.exec(calls.send[0].html)[1].replaceAll("&amp;", "&");
    const raw = new URL(href).searchParams.get("token");
    assert.equal(new URL(href).origin, site);
    assert.equal(calls.cleanup[0][2], digest(raw));
    assert.equal(calls.pending[0][3], digest(raw));
});

test("mail preflight validates actual configuration without printing secret or personal values", () => {
    // Set optional overrides as well: .env* and the caller's environment must
    // not supply real mail settings to this isolated command-line test.
    const fixtureEnv = {
        ...process.env, ...env,
        CONTACT_EMAIL_FROM: "", NEWSLETTER_EMAIL_FROM: "",
        NEXT_PUBLIC_SITE_URL: "", VERCEL_ENV: "production", VERCEL_URL: "",
    };
    const result = spawnSync(process.execPath, ["scripts/check-mail-config.mjs", "--production"], { encoding: "utf8", env: fixtureEnv });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, "");
    for (const value of [env.RESEND_API_KEY, env.UPSTASH_REDIS_REST_TOKEN, env.CONTACT_EMAIL_TO, env.MAIL_REPLY_TO]) assert.ok(!(result.stdout + result.stderr).includes(value));
});

test("Contact uses the configured sender and keeps Reply-To pointed at the visitor", async () => {
    const { load, calls } = fixture();
    const privacy = load("src/i18n/formPrivacyCopy.ts").getFormPrivacy("en");
    const body = { name: "Reader", email: "reader@example.invalid", subject: "artworks", message: "A question", consent: true, consentVersion: privacy.version, locale: "en" };
    const response = await load("src/app/api/contact/route.ts").POST(new Request(`${site}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }));
    assert.equal(response.status, 200);
    assert.equal(calls.send[0].from, env.MAIL_FROM);
    assert.equal(calls.send[0].replyTo, body.email);
    assert.deepEqual(calls.send[0].to, [env.CONTACT_EMAIL_TO]);
    assert.equal(calls.send[0].subject, "[Rolando Del Carmen] Artworks Inquiry — Reader");
});

for (const [locale, subjects] of Object.entries({
    en: { artworks: "Artworks Inquiry", collaboration: "Collaboration Inquiry", general: "General Inquiry" },
    es: { artworks: "Consulta sobre obras", collaboration: "Consulta de colaboración", general: "Consulta general" },
})) {
    test(`Contact ${locale}: each subject keeps the sender identity, visitor and consent language`, async () => {
        for (const [subject, label] of Object.entries(subjects)) {
            const { load, calls } = fixture();
            const privacy = load("src/i18n/formPrivacyCopy.ts").getFormPrivacy(locale);
            const body = { name: "María O’Rojas", email: "reader@example.invalid", subject, message: "A question", consent: true, consentVersion: privacy.version, locale };
            const response = await load("src/app/api/contact/route.ts").POST(new Request(`${site}/api/contact`, {
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
            }));
            assert.equal(response.status, 200);
            assert.equal(calls.send[0].subject, `[Rolando Del Carmen] ${label} — ${body.name}`);
            assert.equal(calls.send[0].replyTo, body.email);
            assert.ok(calls.send[0].text.includes(`Consent language: ${locale}`));
        }
    });
}

test("Contact rejects line breaks in a subject-bound visitor name before service access", async () => {
    for (const name of ["Reader\rBcc: another@example.invalid", "Reader\nExtra subject"]) {
        const { load, calls } = fixture();
        const privacy = load("src/i18n/formPrivacyCopy.ts").getFormPrivacy("en");
        const body = { name, email: "reader@example.invalid", subject: "artworks", message: "A question", consent: true, consentVersion: privacy.version, locale: "en" };
        const response = await load("src/app/api/contact/route.ts").POST(new Request(`${site}/api/contact`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
        }));
        assert.equal(response.status, 400);
        assert.equal(calls.clients + calls.rate.length + calls.send.length, 0);
    }
});

test("an existing subscriber is not sent another confirmation; a broken origin cannot create a pending record", async () => {
    for (const scenario of [{ active: true }, { originError: true }]) {
        const { load, calls } = fixture(scenario);
        const privacy = load("src/i18n/formPrivacyCopy.ts").getFormPrivacy("en");
        const body = { email: "reader@example.invalid", consent: true, consentVersion: privacy.version, locale: "en" };
        const response = await load("src/app/api/newsletter/route.ts").POST(new Request(`${site}/api/newsletter`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }));
        assert.equal(response.status, scenario.active ? 409 : 503);
        assert.equal(calls.send.length, 0);
        if (scenario.originError) assert.equal(calls.pending.length, 0);
    }
});
