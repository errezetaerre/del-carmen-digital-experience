import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const project = fileURLToPath(new URL("../", import.meta.url));

// Load the actual server code; replace only external services. No test sends
// email, accesses Redis, or requires private environment configuration.
function serverModules(mocks = new Map()) {
    const cache = new Map();
    function load(path) {
        const filename = [path, `${path}.ts`, `${path}.tsx`, `${path}.json`, resolve(path, "index.ts")]
            .find(candidate => existsSync(candidate) && statSync(candidate).isFile());
        assert.ok(filename, `Missing module: ${path}`);
        if (cache.has(filename)) return cache.get(filename).exports;
        const source = readFileSync(filename, "utf8");
        if (filename.endsWith(".json")) return JSON.parse(source);
        const output = ts.transpileModule(source, { compilerOptions: {
            module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true,
        } }).outputText;
        const compiledModule = { exports: {} };
        cache.set(filename, compiledModule);
        const dependency = name => {
            if (mocks.has(name)) return mocks.get(name);
            if (name.startsWith("@/")) return load(resolve(project, "src", name.slice(2)));
            if (name.startsWith(".")) return load(resolve(dirname(filename), name));
            return require(name);
        };
        new Function("require", "module", "exports", output)(dependency, compiledModule, compiledModule.exports);
        return compiledModule.exports;
    }
    return path => load(resolve(project, path));
}

const { readFormJson, MAX_FORM_BODY_BYTES } = serverModules()("src/shared/lib/server/readFormJson.ts");
const { getFormPrivacy } = serverModules()("src/i18n/formPrivacyCopy.ts");
const origin = "https://portfolio.example.invalid";

function rawRequest(body, headers = {}) {
    return new Request(`${origin}/api/contact`, {
        method: "POST", body, headers: { "Content-Type": "application/json", ...headers },
        ...(body instanceof ReadableStream ? { duplex: "half" } : {}),
    });
}

function routeFixture(kind, scenario = {}) {
    const calls = { rate: 0, send: [], pending: [], cleanup: [] };
    const mocks = new Map([
        ["next/server", { NextResponse: { json: (body, init) => Response.json(body, init) } }],
        ["resend", { Resend: class {
            emails = { send: async payload => {
                calls.send.push(payload);
                return { error: scenario.sendError ? { message: "Test delivery failure" } : null };
            } };
        } }],
        ["@upstash/redis", { Redis: class { static fromEnv() { return {}; } } }],
        ["@upstash/ratelimit", { Ratelimit: class {
            static slidingWindow() { return {}; }
            async limit() {
                calls.rate++;
                if (scenario.rateError) throw new Error("Test rate service failure");
                return { success: !scenario.rateDenied, limit: 5, remaining: 4, reset: 123456 };
            }
        } }],
        ["@/domains/newsletter/server/subscriberLifecycle", {
            requestPendingSubscription: async (...args) => {
                calls.pending.push(args);
                return scenario.active ? "active" : "pending";
            },
            cleanFailedSubscriptionRequest: async (...args) => { calls.cleanup.push(args); },
        }],
    ]);
    const { POST } = serverModules(mocks)(`src/app/api/${kind}/route.ts`);
    return { POST, calls };
}

function formBody(kind, locale = "en") {
    return {
        email: "reader@example.invalid", locale, consent: true,
        consentVersion: getFormPrivacy(locale).version,
        ...(kind === "contact" ? { name: "María O’Rojas", subject: "artworks", message: "Una consulta sobre la obra." } : { source: "home" }),
    };
}

test("accepts same-origin JSON, media parameters and intact multibyte chunks", async () => {
    const bytes = new TextEncoder().encode(JSON.stringify({ message: "Óleo · 日本語" }));
    const body = new ReadableStream({ start(controller) {
        for (const byte of bytes) controller.enqueue(new Uint8Array([byte]));
        controller.close();
    } });
    const result = await readFormJson(rawRequest(body, {
        Origin: origin, "Sec-Fetch-Site": "same-origin", "Content-Type": "Application/JSON; charset=utf-8",
    }));
    assert.equal(result.ok, true);
    assert.equal(result.body.message, "Óleo · 日本語");
});

test("accepts Next's forwarded public origin instead of the internal listening URL", async () => {
    const request = new Request("http://internal-server:3000/api/contact", {
        method: "POST", body: "{}", headers: {
            Origin: origin, Host: "internal-server:3000", "Content-Type": "application/json",
            "X-Forwarded-Host": "portfolio.example.invalid", "X-Forwarded-Proto": "https",
        },
    });
    assert.equal((await readFormJson(request)).ok, true);
});

for (const headers of [
    { Host: "different.example.invalid" },
    { "X-Forwarded-Host": "different.example.invalid" },
    { "X-Forwarded-Proto": "http" },
    { Origin: `${origin}/path` },
    { Origin: "https://user:password@portfolio.example.invalid" },
]) {
    test(`rejects a mismatched or non-origin public address: ${JSON.stringify(headers)}`, async () => {
        assert.equal((await readFormJson(rawRequest("{}", { Origin: origin, ...headers }))).status, 403);
    });
}

for (const type of ["text/plain", "application/x-www-form-urlencoded", "text/json", ""]) {
    test(`rejects unsupported media type ${type || "(missing)"}`, async () => {
        const result = await readFormJson(rawRequest("{}", { "Content-Type": type }));
        assert.equal(result.status, 415);
    });
}

for (const headers of [{ Origin: "https://other.example.invalid" }, { Origin: "null" }, { "Sec-Fetch-Site": "cross-site" }]) {
    test(`rejects a foreign browser origin: ${JSON.stringify(headers)}`, async () => {
        assert.equal((await readFormJson(rawRequest("{}", headers))).status, 403);
    });
}

for (const body of ["", "{", "null", "[]", "true", "42", '"text"']) {
    test(`rejects malformed or non-object JSON: ${body || "(empty)"}`, async () => {
        assert.equal((await readFormJson(rawRequest(body))).status, 400);
    });
}

test("rejects invalid UTF-8 and interrupted streams", async () => {
    assert.equal((await readFormJson(rawRequest(new Uint8Array([0xff])))).status, 400);
    const stream = new ReadableStream({ start(controller) { controller.error(new Error("Test disconnect")); } });
    assert.equal((await readFormJson(rawRequest(stream))).status, 400);
});

test("enforces the actual byte limit, accepts its boundary and cancels oversized streams", async () => {
    const boundary = JSON.stringify({ message: "x".repeat(MAX_FORM_BODY_BYTES - 14) });
    assert.equal(new TextEncoder().encode(boundary).length, MAX_FORM_BODY_BYTES);
    assert.equal((await readFormJson(rawRequest(boundary))).ok, true);
    assert.equal((await readFormJson(rawRequest(`${boundary} `, { "Content-Length": "2" }))).status, 413);
    assert.equal((await readFormJson(rawRequest("{}", { "Content-Length": String(MAX_FORM_BODY_BYTES + 1) }))).status, 413);
    assert.equal((await readFormJson(rawRequest("{}", { "Content-Length": "NaN" }))).status, 400);
    assert.equal((await readFormJson(rawRequest(JSON.stringify({ message: "é".repeat(MAX_FORM_BODY_BYTES / 2) })))).status, 413);
    let cancelled = false;
    const stream = new ReadableStream({
        start(controller) { controller.enqueue(new Uint8Array(MAX_FORM_BODY_BYTES + 1)); },
        cancel() { cancelled = true; },
    });
    assert.equal((await readFormJson(rawRequest(stream))).status, 413);
    assert.equal(cancelled, true);
});

for (const kind of ["contact", "newsletter"]) {
    for (const [label, body, headers, expected] of [
        ["wrong media", "{}", { "Content-Type": "text/plain" }, 415],
        ["foreign origin", "{}", { Origin: "https://other.example.invalid" }, 403],
        ["invalid JSON", "{", {}, 400],
        ["oversized body", "x".repeat(MAX_FORM_BODY_BYTES + 1), {}, 413],
    ]) {
        test(`${kind}: ${label} is rejected before rate limiting, persistence or mail`, async () => {
            const { POST, calls } = routeFixture(kind);
            const response = await POST(rawRequest(body, headers));
            assert.equal(response.status, expected);
            assert.equal(calls.rate, 0);
            assert.equal(calls.pending.length + calls.send.length, 0);
        });
    }

    for (const locale of ["en", "es"]) {
        test(`${kind}: preserves accepted ${locale} consent and successful service flow`, async () => {
            const previous = process.env.CONTACT_EMAIL_TO;
            process.env.CONTACT_EMAIL_TO = "owner@example.invalid";
            try {
                const { POST, calls } = routeFixture(kind);
                const response = await POST(rawRequest(JSON.stringify(formBody(kind, locale))));
                assert.equal(response.status, kind === "newsletter" ? 201 : 200);
                assert.equal((await response.json()).success, true);
                assert.equal(calls.send.length, 1);
                if (kind === "newsletter") {
                    assert.equal(calls.pending[0][5], locale);
                    assert.match(calls.send[0].html, locale === "es" ? /locale=es/ : /confirm\?token=/);
                } else {
                    assert.ok(calls.send[0].text.includes(`Consent language: ${locale}`));
                }
            } finally {
                if (previous === undefined) delete process.env.CONTACT_EMAIL_TO;
                else process.env.CONTACT_EMAIL_TO = previous;
            }
        });
    }

    for (const update of [{ consent: false }, { consentVersion: "old" }, { locale: "fr" }, { email: "invalid" }]) {
        test(`${kind}: retains field/consent rejection ${JSON.stringify(update)}`, async () => {
            const { POST, calls } = routeFixture(kind);
            const response = await POST(rawRequest(JSON.stringify({ ...formBody(kind), ...update })));
            assert.equal(response.status, 400);
            assert.equal(calls.pending.length + calls.send.length, 0);
        });
    }

    test(`${kind}: honeypot and rate limit still prevent side effects`, async () => {
        const bot = routeFixture(kind);
        assert.equal((await bot.POST(rawRequest(JSON.stringify({ contactField: "bot" })))).status, 200);
        assert.equal(bot.calls.pending.length + bot.calls.send.length, 0);
        const blocked = routeFixture(kind, { rateDenied: true });
        const response = await blocked.POST(rawRequest(JSON.stringify(formBody(kind))));
        assert.equal(response.status, 429);
        assert.equal(response.headers.get("X-RateLimit-Limit"), "5");
        assert.equal(blocked.calls.pending.length + blocked.calls.send.length, 0);
    });

    test(`${kind}: rate service failure returns a controlled response`, async t => {
        t.mock.method(console, "error", () => {});
        const { POST, calls } = routeFixture(kind, { rateError: true });
        const response = await POST(rawRequest(JSON.stringify(formBody(kind))));
        assert.equal(response.status, kind === "newsletter" ? 503 : 500);
        assert.equal(calls.pending.length + calls.send.length, 0);
        assert.doesNotMatch(JSON.stringify(await response.json()), /Test rate service failure|stack|redis/i);
    });
}
