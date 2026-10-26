import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import net from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { once } from "node:events";
import test from "node:test";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";

// Explicit optional test: starts its OWN non-persistent Redis on loopback.
// Never reads Upstash credentials or connects to an existing database.
test("newsletter Lua transitions on an isolated Redis server", async t => {
    const reserve = net.createServer();
    reserve.listen(0, "127.0.0.1"); await once(reserve, "listening");
    const port = reserve.address().port;
    await new Promise(resolve => reserve.close(resolve));
    const directory = mkdtempSync(join(tmpdir(), "del-carmen-redis-test-"));
    const server = spawn(process.env.REDIS_SERVER || "redis-server", ["--bind", "127.0.0.1", "--port", String(port), "--save", "", "--appendonly", "no", "--dir", directory, "--loglevel", "warning"], { stdio: ["ignore", "pipe", "pipe"] });
    let launchError;
    server.on("error", error => { launchError = error; });
    function parse(buffer, offset = 0) {
        const end = buffer.indexOf("\r\n", offset);
        if (end < 0) return null;
        const type = String.fromCharCode(buffer[offset]);
        const line = buffer.subarray(offset + 1, end).toString();
        const next = end + 2;
        if (type === "-") return { error: new Error(line), end: next };
        if (type === "+") return { value: line, end: next };
        if (type === ":") return { value: Number(line), end: next };
        if (type === "$") {
            const length = Number(line);
            if (length < 0) return { value: null, end: next };
            if (buffer.length < next + length + 2) return null;
            return { value: buffer.subarray(next, next + length).toString(), end: next + length + 2 };
        }
        throw new Error("Unexpected Redis test protocol response");
    }
    function command(...args) {
        return new Promise((resolve, reject) => {
            const socket = net.createConnection({ host: "127.0.0.1", port });
            const timeout = setTimeout(() => { socket.destroy(); reject(new Error("Redis test command timed out")); }, 5000);
            let buffer = Buffer.alloc(0);
            socket.on("error", error => { clearTimeout(timeout); reject(error); });
            socket.on("connect", () => {
                const parts = [Buffer.from(`*${args.length}\r\n`)];
                for (const value of args) { const bytes = Buffer.from(String(value)); parts.push(Buffer.from(`$${bytes.length}\r\n`), bytes, Buffer.from("\r\n")); }
                socket.write(Buffer.concat(parts));
            });
            socket.on("data", bytes => {
                buffer = Buffer.concat([buffer, bytes]);
                const result = parse(buffer);
                if (!result) return;
                clearTimeout(timeout); socket.end();
                if (result.error) reject(result.error); else resolve(result.value);
            });
        });
    }
    try {
        let ready = false;
        for (let i = 0; i < 100; i++) {
            if (launchError) throw new Error("Redis test server unavailable. Install Redis or set REDIS_SERVER to its executable.");
            try { if (await command("PING") === "PONG") { ready = true; break; } } catch {}
            await new Promise(resolve => setTimeout(resolve, 20));
        }
        assert.ok(ready, "Isolated Redis failed to start");
        const info = await command("INFO", "server");
        assert.match(info, new RegExp(`process_id:${server.pid}\\r?\\n`), "Refuse to write to any Redis process other than the test child");
        const redis = { get: key => command("GET", key), eval: (script, keys, args) => command("EVAL", script, keys.length, ...keys, ...args) };
        const lifecycle = serverModules()("src/domains/newsletter/server/subscriberLifecycle.ts");
        const hash = value => createHash("sha256").update(value).digest("hex");
        const email = "reader@example.invalid", first = hash("first"), second = hash("second"), unsubscribe = hash("unsubscribe");
        const recordKey = `newsletter:subscriber:${email}`, audience = "newsletter:subscribers";
        const record = async () => JSON.parse(await command("GET", recordKey));
        const pending = (token = first, locale = "es") => lifecycle.requestPendingSubscription(redis, email, "home", token, "2026-10-24T12:00:00.000Z", locale);
        const confirm = (token = first, stop = unsubscribe) => lifecycle.confirmSubscription(redis, token, stop, "2026-10-24T12:01:00.000Z");
        const stop = () => lifecycle.unsubscribeSubscription(redis, unsubscribe, "2026-10-24T12:02:00.000Z");

        await t.test("pending request stores exact locale/consent and 24h expiries", async () => {
            assert.equal(await pending(), "pending");
            const current = await record();
            assert.equal(current.status, "pending"); assert.equal(current.consent.language, "es");
            assert.equal(current.confirmationTokenHash, first);
            for (const key of [recordKey, `newsletter:confirmation:${first}`]) {
                const ttl = await command("TTL", key); assert.ok(ttl <= 86400 && ttl > 86300);
            }
            assert.equal(await command("SISMEMBER", audience, email), 0);
        });
        await t.test("confirmation is atomic, persistent and consumes its lookup", async () => {
            assert.equal(await confirm(), true);
            assert.equal((await record()).status, "active");
            assert.equal((await record()).consent.language, "es");
            assert.equal(await command("TTL", recordKey), -1);
            assert.equal(await command("TTL", `newsletter:unsubscribe:${unsubscribe}`), -1);
            assert.equal(await command("GET", `newsletter:confirmation:${first}`), null);
            assert.equal(await command("SISMEMBER", audience, email), 1);
            assert.equal(await confirm(), false);
        });
        await t.test("unsubscribe keeps only the approved minimal 30-day record", async () => {
            assert.equal(await stop(), true);
            assert.deepEqual(Object.keys(await record()).sort(), ["email", "status", "unsubscribedAt"]);
            const ttl = await command("TTL", recordKey); assert.ok(ttl <= 2592000 && ttl > 2591900);
            assert.equal(await command("SISMEMBER", audience, email), 0);
            assert.equal(await command("GET", `newsletter:unsubscribe:${unsubscribe}`), null);
            assert.equal(await stop(), false);
        });
        await t.test("fresh consent after unsubscribe resets pending/active expiry", async () => {
            assert.equal(await pending(second, "en"), "pending");
            assert.equal((await record()).consent.language, "en");
            assert.ok(await command("TTL", recordKey) <= 86400);
            assert.equal(await confirm(second), true);
            assert.equal(await command("TTL", recordKey), -1);
            assert.equal(await command("SISMEMBER", audience, email), 1);
        });
        await t.test("superseded/failed delivery cannot remove a newer or active subscription", async () => {
            await command("FLUSHDB"); await pending(first); await pending(second);
            assert.equal(await confirm(first), false);
            await lifecycle.cleanFailedSubscriptionRequest(redis, email, first);
            assert.equal((await record()).confirmationTokenHash, second);
            assert.equal(await confirm(second), true);
            await lifecycle.cleanFailedSubscriptionRequest(redis, email, second);
            assert.equal((await record()).status, "active");
        });
        await t.test("a stale lookup cannot activate a newer pending request", async () => {
            await command("FLUSHDB"); await pending(first);
            let replace = true;
            const racing = { ...redis, get: async key => { const value = await redis.get(key); if (replace) { replace = false; await pending(second); } return value; } };
            assert.equal(await lifecycle.confirmSubscription(racing, first, unsubscribe, "2026-10-24T12:03:00.000Z"), false);
            assert.equal((await record()).confirmationTokenHash, second);
            assert.equal(await command("SISMEMBER", audience, email), 0);
        });
        await t.test("wrong audience key type fails before partial lifecycle writes", async () => {
            await command("FLUSHDB"); await command("SET", audience, "corrupt-test-value");
            await assert.rejects(pending(), /audience key type/);
            assert.equal(await command("GET", recordKey), null);
            assert.equal(await command("GET", `newsletter:confirmation:${first}`), null);
        });
        await t.test("expired lookup never activates a pending record", async () => {
            await command("FLUSHDB"); await pending();
            await command("EXPIREAT", `newsletter:confirmation:${first}`, 1);
            assert.equal(await confirm(), false);
            assert.equal((await record()).status, "pending");
        });
    } finally {
        if (server.pid && server.exitCode === null) { server.kill("SIGTERM"); await once(server, "exit"); }
        rmSync(directory, { recursive: true, force: true });
    }
});
