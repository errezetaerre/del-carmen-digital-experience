import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import React from "react";
import ts from "typescript";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";
import { loadCatalogueSource } from "../scripts/lib/catalogueSource.mjs";
import { catalogueConnectionConfig, catalogueProductionReaderConfig, catalogueReaderConfig } from "../src/server/catalogue/postgresClient.mjs";

const require = createRequire(import.meta.url);
const source = loadCatalogueSource();
const editorialRepository = serverModules()("src/server/catalogue/reader.ts").createCatalogueRepository(source);
const editorialArtworks = editorialRepository.getArtworkViews(["en", "es"]);

async function withSourceEnvironment(values, run) {
    const keys = ["VERCEL_ENV", "CATALOGUE_ARTWORKS_SOURCE", "CATALOGUE_PRODUCTION_SOURCE", "CATALOGUE_PRODUCTION_READ_URL"];
    const previous = Object.fromEntries(keys.map(key => [key, process.env[key]]));
    try {
        for (const key of keys) {
            if (values[key] === undefined) delete process.env[key];
            else process.env[key] = values[key];
        }
        return await run();
    } finally {
        for (const key of keys) {
            if (previous[key] === undefined) delete process.env[key];
            else process.env[key] = previous[key];
        }
    }
}

function archiveLoader({ wait = async () => {}, read = async () => ({ getArtworkViews: () => editorialArtworks }) } = {}) {
    const calls = { wait: 0, read: 0 };
    const load = serverModules(new Map([
        ["next/server", { connection: async () => { calls.wait++; return wait(); } }],
        ["./archiveRuntime", { readArtworkArchiveCatalogue: async () => { calls.read++; return read(); } }],
    ]));
    return { ...load("src/server/catalogue/archiveSource.ts"), calls };
}

test("the runtime schema manifest matches every actual versioned migration", () => {
    const folder = new URL("../database/migrations/", import.meta.url);
    const expected = readdirSync(folder).filter(name => /^[0-9]{4}_[a-z_]+\.sql$/.test(name)).sort().map(name => ({
        id: name.slice(0, -4), checksum: createHash("sha256").update(readFileSync(new URL(name, folder))).digest("hex"),
    }));
    assert.deepEqual(serverModules()("src/server/catalogue/schemaVersion.ts").catalogueSchemaVersion, expected);
});

test("Production and Preview require their own explicit source opt-ins", () => {
    const { artworkArchiveSource } = archiveLoader();
    assert.equal(artworkArchiveSource({}), "files");
    assert.equal(artworkArchiveSource({ VERCEL_ENV: "preview" }), "files");
    assert.equal(artworkArchiveSource({ CATALOGUE_ARTWORKS_SOURCE: "postgres" }), "postgres");
    assert.equal(artworkArchiveSource({ VERCEL_ENV: "preview", CATALOGUE_ARTWORKS_SOURCE: "postgres" }), "postgres");
    assert.equal(artworkArchiveSource({ NODE_ENV: "production", CATALOGUE_ARTWORKS_SOURCE: "postgres" }), "postgres");
    for (const value of ["postgres", "files", "invalid"]) assert.equal(artworkArchiveSource({ VERCEL_ENV: "production", CATALOGUE_ARTWORKS_SOURCE: value }), "files");
    assert.equal(artworkArchiveSource({ VERCEL_ENV: "production", CATALOGUE_PRODUCTION_READ_URL: "configured" }), "files");
    assert.equal(artworkArchiveSource({ VERCEL_ENV: "production", CATALOGUE_PRODUCTION_SOURCE: "postgres" }), "postgres");
    assert.equal(artworkArchiveSource({ VERCEL_ENV: "preview", CATALOGUE_PRODUCTION_SOURCE: "postgres" }), "files");
    assert.equal(artworkArchiveSource({ VERCEL_ENV: "production", CATALOGUE_PRODUCTION_SOURCE: "files", CATALOGUE_ARTWORKS_SOURCE: "postgres" }), "files");
    assert.throws(() => artworkArchiveSource({ VERCEL_ENV: "production", CATALOGUE_PRODUCTION_SOURCE: "invalid" }), { code: "invalid_catalogue_production_source" });
    assert.throws(() => artworkArchiveSource({ CATALOGUE_ARTWORKS_SOURCE: "invalid" }), { code: "invalid_catalogue_artworks_source" });
});

const production = { VERCEL_ENV: "production", CATALOGUE_PRODUCTION_SOURCE: "postgres" };
const fixtureProductionUrl = "postgresql://catalogue_reader:fixture-secret@ep-lingering-silence-bbokbc7w-pooler.c-15.us-east-1.aws.neon.tech/neondb?sslmode=require";

test("Production uses only the scoped pooled reader and keeps operator writes unavailable", () => {
    const url = new URL(fixtureProductionUrl);
    const config = catalogueProductionReaderConfig({ ...production,
        CATALOGUE_PRODUCTION_READ_URL: `${fixtureProductionUrl}&options=fixture`, DATABASE_URL: "not-the-production-credential" });
    const accepted = new URL(config.url);
    assert.equal(accepted.host, url.host);
    assert.equal(accepted.username, "catalogue_reader");
    assert.equal(accepted.password, url.password);
    assert.equal(accepted.pathname, "/neondb");
    assert.equal(accepted.search, "?sslmode=verify-full&channel_binding=require");

    assert.throws(() => catalogueProductionReaderConfig({ ...production, DATABASE_URL: fixtureProductionUrl }), { code: "production_catalogue_reader_secret_missing" });
    for (const target of [fixtureProductionUrl.replace("-pooler.", "."),
        fixtureProductionUrl.replace("ep-lingering-silence-bbokbc7w", "ep-shy-field-bb3b04uz"),
        fixtureProductionUrl.replace("/neondb?", "/wrong?"), fixtureProductionUrl.replace(".tech/", ".tech:9876/")]) {
        assert.throws(() => catalogueProductionReaderConfig({ ...production, CATALOGUE_PRODUCTION_READ_URL: target }), { code: "production_catalogue_target_mismatch" });
    }
    assert.throws(() => catalogueProductionReaderConfig({ ...production, CATALOGUE_PRODUCTION_READ_URL: fixtureProductionUrl.replace("catalogue_reader", "neondb_owner") }), { code: "production_catalogue_reader_role_required" });
    assert.throws(() => catalogueProductionReaderConfig({ ...production, CATALOGUE_PRODUCTION_READ_URL: fixtureProductionUrl.replace("sslmode=require", "sslmode=disable") }), { code: "database_tls_required" });
    for (const values of [{ VERCEL_ENV: "preview" }, { CATALOGUE_PRODUCTION_SOURCE: "files" }]) {
        assert.throws(() => catalogueProductionReaderConfig({ ...production, ...values, CATALOGUE_PRODUCTION_READ_URL: fixtureProductionUrl }), { code: "production_catalogue_read_not_requested" });
    }
    assert.throws(() => catalogueReaderConfig({ ...production, DATABASE_URL: fixtureProductionUrl }), { code: "production_catalogue_reads_not_activated" });
    assert.throws(() => catalogueConnectionConfig({ ...production, DATABASE_URL: fixtureProductionUrl }, true), { code: "local_development_writes_only" });
});

test("file paths never initialize a reader even when a Production URL is saved", async () => {
    for (const env of [{}, { VERCEL_ENV: "preview" }, { VERCEL_ENV: "production", CATALOGUE_ARTWORKS_SOURCE: "postgres", CATALOGUE_PRODUCTION_READ_URL: "fixture-secret" }]) {
        await withSourceEnvironment(env, async () => {
            const api = archiveLoader({ read: async () => { assert.fail("database reader must stay lazy"); } });
            assert.deepEqual(await api.getArtworkArchiveArtworks(), editorialArtworks);
            assert.deepEqual(api.calls, { wait: 0, read: 0 });
        });
    }
});

test("opt-in request returns repository records after Next's request boundary, without file substitution", async () => {
    for (const env of [{ VERCEL_ENV: "preview", CATALOGUE_ARTWORKS_SOURCE: "postgres" }, production]) await withSourceEnvironment(env, async () => {
        let waiting = true;
        const rows = structuredClone(editorialArtworks).reverse();
        const api = archiveLoader({ wait: async () => { waiting = false; }, read: async () => {
            assert.equal(waiting, false);
            return { getArtworkViews: () => rows };
        } });
        assert.strictEqual(await api.getArtworkArchiveArtworks(), rows);
        assert.deepEqual(api.calls, { wait: 1, read: 1 });
    });
});

test("the Production request runtime passes the scoped connection to the shared reader", async () => {
    await withSourceEnvironment({ ...production, CATALOGUE_PRODUCTION_READ_URL: fixtureProductionUrl }, async () => {
        const session = {};
        let clientCalls = 0;
        const load = serverModules(new Map([
            ["./postgresClient.mjs", { catalogueProductionReaderConfig, catalogueReaderConfig: () => assert.fail("must not use Preview config"), createCatalogueClient: config => {
                assert.equal(new URL(config.url).username, "catalogue_reader");
                assert.equal(new URL(config.url).searchParams.get("channel_binding"), "require");
                clientCalls++;
                return session;
            } }],
            ["./archiveReader", { createArtworkArchiveReader: (db, baseline) => {
                assert.equal(db, session);
                assert.deepEqual(baseline, source);
                return { read: async () => editorialRepository };
            } }],
        ]));
        const { readArtworkArchiveCatalogue } = load("src/server/catalogue/archiveRuntime.ts");
        assert.equal(clientCalls, 0);
        assert.equal(await readArtworkArchiveCatalogue("home"), editorialRepository);
        assert.equal(await readArtworkArchiveCatalogue("sitemap"), editorialRepository);
        assert.equal(clientCalls, 1);
    });
});

test("Next prerender bailout propagates untouched and never triggers database initialization", async () => {
    await withSourceEnvironment({ CATALOGUE_ARTWORKS_SOURCE: "postgres" }, async () => {
        const bailout = new Error("fixture prerender bailout");
        const api = archiveLoader({ wait: async () => { throw bailout; } });
        await assert.rejects(api.getArtworkArchiveArtworks(), error => error === bailout);
        assert.deepEqual(api.calls, { wait: 1, read: 0 });
    });
});

test("database/configuration/parity errors are sanitized, never rendered from stale or file data", async () => {
    await withSourceEnvironment({ CATALOGUE_ARTWORKS_SOURCE: "postgres" }, async () => {
        const api = archiveLoader({ read: async () => { throw Object.assign(new Error("private-sentinel connection/SQL/row"), { query: "private-sentinel", code: "private-sentinel" }); } });
        await assert.rejects(api.getArtworkArchiveArtworks(), error => {
            assert.equal(error.code, "catalogue_archive_read_failed");
            assert.ok(!`${error.stack}${JSON.stringify(error)}`.includes("private-sentinel"));
            return true;
        });
        assert.deepEqual(api.calls, { wait: 1, read: 1 });
    });
});

test("Production archive diagnosis distinguishes failure categories without logging provider details", async () => {
    const warn = console.warn;
    const lines = [];
    console.warn = message => lines.push(message);
    try {
        await withSourceEnvironment(production, async () => {
            let code = "production_catalogue_reader_secret_missing";
            const api = archiveLoader({ read: async () => { throw Object.assign(new Error("fixture-private-password"), { code, detail: "fixture-private-endpoint" }); } });
            const fail = () => assert.rejects(api.getArtworkArchiveArtworks(), { code: "catalogue_archive_read_failed" });
            await fail();
            await fail();
            code = "28P01";
            await fail();
            code = "catalogue_not_equivalent";
            await fail();
            code = "fixture-private-code";
            await fail();
        });
        assert.deepEqual(lines, ["secret_missing", "authentication", "catalogue_equivalence", "unexpected"]
            .map(reason => `Catalogue Production archive read failed: ${reason}`));
    } finally {
        console.warn = warn;
    }
});

test("runtime initialization is lazy, reuses its reader, and reports each loaded snapshot without private values", async () => {
    let clients = 0, readers = 0;
    let repository = { private: "private-sentinel" };
    const messages = [];
    const originalInfo = console.info;
    const load = serverModules(new Map([
        ["./postgresClient.mjs", { catalogueReaderConfig: () => ({ url: "private-sentinel" }), createCatalogueClient: () => { clients++; return {}; } }],
        ["./archiveReader", { createArtworkArchiveReader: () => { readers++; return { read: async () => repository }; } }],
        ["./fileSource", { loadCatalogueFiles: () => source }],
    ]));
    const { readArtworkArchiveCatalogue } = load("src/server/catalogue/archiveRuntime.ts");
    assert.equal(clients, 0);
    try {
        console.info = text => messages.push(text);
        const results = await Promise.all([readArtworkArchiveCatalogue(), readArtworkArchiveCatalogue()]);
        assert.ok(results.every(item => item === repository));
        assert.equal(clients, 1); assert.equal(readers, 1);
        assert.deepEqual(messages, ["Catalogue /artworks: PostgreSQL verified"]);
        await readArtworkArchiveCatalogue("detail");
        await readArtworkArchiveCatalogue("detail");
        assert.equal(clients, 1); assert.equal(readers, 1);
        assert.deepEqual(messages, ["Catalogue /artworks: PostgreSQL verified", "Catalogue /artworks/[slug]: PostgreSQL verified"]);
        await readArtworkArchiveCatalogue("collections");
        await readArtworkArchiveCatalogue("series");
        assert.equal(clients, 1); assert.equal(readers, 1);
        assert.deepEqual(messages.slice(-2), ["Catalogue /collections: PostgreSQL verified", "Catalogue /series/[slug]: PostgreSQL verified"]);
        await readArtworkArchiveCatalogue("home");
        await readArtworkArchiveCatalogue("home");
        assert.equal(clients, 1); assert.equal(readers, 1);
        assert.equal(messages.at(-1), "Catalogue /: PostgreSQL verified");
        repository = { private: "another-private-sentinel" };
        await readArtworkArchiveCatalogue();
        assert.equal(messages.length, 6);
        assert.ok(!messages.join(" ").includes("private-sentinel"));
    } finally { console.info = originalInfo; }
});

function pageModule(getArtworks) {
    const archive = () => null;
    const dependencies = {
        "@/i18n/server": { activateLocale: async params => (await params).locale },
        "@/i18n/messages": serverModules()("src/i18n/messages.ts"),
        "@/shared/lib/metadata": { createPageMetadata: value => value },
        "@/server/catalogue/archiveSource": { getArtworkArchiveArtworks: getArtworks },
        "@/shared/layout": { Container: () => null },
        "@/shared/layout/footer": { __esModule: true, default: () => null },
        "./ArtworkArchive": { __esModule: true, default: archive },
        "./ArtworkArchive.module.css": { __esModule: true, default: new Proxy({}, { get: (_target, key) => String(key) }) },
    };
    const code = ts.transpileModule(readFileSync(new URL("../src/app/[locale]/artworks/page.tsx", import.meta.url), "utf8"), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    const compiled = { exports: {} };
    new Function("require", "module", "exports", code)(name => {
        if (Object.hasOwn(dependencies, name)) return dependencies[name];
        if (name.startsWith("@/") || name.startsWith(".")) throw new Error("Unspecified dependency: " + name);
        return require(name);
    }, compiled, compiled.exports);
    return { page: compiled.exports.default, archive };
}

function locate(node, predicate) {
    if (!node || typeof node !== "object") return undefined;
    if (predicate(node)) return node;
    for (const child of React.Children.toArray(node.props?.children)) {
        const result = locate(child, predicate);
        if (result) return result;
    }
}

test("actual EN/ES page passes the async data-source result through the existing Suspense/gallery boundary", async () => {
    for (const locale of ["en", "es"]) {
        const rows = structuredClone(editorialArtworks).reverse();
        let reads = 0;
        const { page, archive } = pageModule(async () => { reads++; return rows; });
        const tree = await page({ params: Promise.resolve({ locale }) });
        const suspense = locate(tree, node => node.type === React.Suspense);
        assert.ok(suspense);
        assert.equal(reads, 0);
        const gallery = await suspense.props.children.type();
        assert.equal(gallery.type, archive);
        assert.strictEqual(gallery.props.artworks, rows);
        assert.equal(reads, 1);
    }
});
