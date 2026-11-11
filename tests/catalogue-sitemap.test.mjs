import assert from "node:assert/strict";
import test from "node:test";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";
import { loadCatalogueSource } from "../scripts/lib/catalogueSource.mjs";

const source = loadCatalogueSource(), load = serverModules();
const { createCatalogueRepository } = load("src/server/catalogue/reader.ts");
const { catalogueSitemapPaths } = load("src/server/catalogue/sitemapSource.ts");
const expectedPaths = [ ...source.artworks.map(item => `/artworks/${item.slug}`), ...source.series.map(item => `/series/${item.slug}`) ].sort();

async function withEnv(values, run) {
    const keys = ["VERCEL_ENV", "CATALOGUE_ARTWORKS_SOURCE", "NODE_ENV", "SITE_URL"];
    const previous = Object.fromEntries(keys.map(key => [key, process.env[key]]));
    try {
        for (const key of keys) { if (values[key] === undefined) delete process.env[key]; else process.env[key] = values[key]; }
        return await run();
    } finally { for (const key of keys) { if (previous[key] === undefined) delete process.env[key]; else process.env[key] = previous[key]; } }
}
function boundary({ wait = async () => {}, read = async () => createCatalogueRepository(source) } = {}) {
    const calls = { wait: 0, scopes: [] };
    const api = serverModules(new Map([
        ["next/server", { connection: async () => { calls.wait++; return wait(); } }],
        ["./archiveRuntime", { readArtworkArchiveCatalogue: async scope => { calls.scopes.push(scope); return read(); } }],
    ]))("src/server/catalogue/sitemapSource.ts");
    return { ...api, calls };
}

test("sitemap uses supplied slugs and published series, retains every artwork state and ignores SQL row order", () => {
    assert.deepEqual(catalogueSitemapPaths(createCatalogueRepository(source)), expectedPaths);
    const edited = structuredClone(source);
    edited.artworks[0].slug = "catalogue-slug-proof";
    edited.series[1].publicationStatus = "draft"; edited.series[2].publicationStatus = "archived";
    const paths = catalogueSitemapPaths(createCatalogueRepository(edited));
    assert.ok(paths.includes("/artworks/catalogue-slug-proof")); assert.ok(!paths.includes(`/artworks/${source.artworks[0].slug}`));
    for (const item of edited.artworks) assert.ok(paths.includes(`/artworks/${item.slug}`));
    assert.ok(!paths.includes(`/series/${edited.series[1].slug}`)); assert.ok(!paths.includes(`/series/${edited.series[2].slug}`));
    assert.deepEqual(catalogueSitemapPaths({ getArtworks: () => [...source.artworks].reverse(), getSeries: () => [...source.series].reverse() }), expectedPaths);
});

test("default and enforced Production sitemap reads remain file-backed with no database initialization", async () => {
    for (const env of [{}, { VERCEL_ENV: "preview" }, { VERCEL_ENV: "production", CATALOGUE_ARTWORKS_SOURCE: "postgres" }]) await withEnv(env, async () => {
        const api = boundary({ read: async () => assert.fail("unexpected database initialization") });
        assert.deepEqual(await api.getCatalogueSitemapPaths(), expectedPaths);
        assert.deepEqual(api.calls, { wait: 0, scopes: [] });
    });
});

test("opt-in sitemap shares the read repository at a real-request boundary, with sanitization and no fallback", async () => {
    await withEnv({ CATALOGUE_ARTWORKS_SOURCE: "postgres" }, async () => {
        let waited = false;
        const edited = structuredClone(source); edited.artworks[0].slug = "database-slug";
        const api = boundary({ wait: async () => { waited = true; }, read: async () => { assert.equal(waited, true); return createCatalogueRepository(edited); } });
        assert.ok((await api.getCatalogueSitemapPaths()).includes("/artworks/database-slug"));
        assert.deepEqual(api.calls, { wait: 1, scopes: ["sitemap"] });
        const bailout = new Error("prerender signal"), stopped = boundary({ wait: async () => { throw bailout; } });
        await assert.rejects(stopped.getCatalogueSitemapPaths(), error => error === bailout); assert.equal(stopped.calls.scopes.length, 0);
        const failed = boundary({ read: async () => { throw new Error("private-sentinel URL/SQL/row"); } });
        await assert.rejects(failed.getCatalogueSitemapPaths(), error => {
            assert.equal(error.code, "catalogue_sitemap_read_failed"); assert.ok(!`${error.stack}${JSON.stringify(error)}`.includes("private-sentinel")); return true;
        });
    });
});

test("non-indexable Preview/development return an empty sitemap without reading any catalogue", async () => {
    for (const env of [{ VERCEL_ENV: "preview", NODE_ENV: "production", CATALOGUE_ARTWORKS_SOURCE: "postgres" }, { NODE_ENV: "development", CATALOGUE_ARTWORKS_SOURCE: "postgres" }]) await withEnv(env, async () => {
        const api = serverModules(new Map([["@/server/catalogue/sitemapSource", { getCatalogueSitemapPaths: async () => assert.fail("non-indexable sitemap must not read") }]]))("src/app/sitemap.ts");
        assert.deepEqual(await api.default(), []);
    });
});

test("actual sitemap preserves the public URL set and language/legal gates; supplied slugs replace file paths", async () => {
    await withEnv({ VERCEL_ENV: "production", NODE_ENV: "production", SITE_URL: "https://rolandodelcarmen.com" }, async () => {
        const current = await serverModules()("src/app/sitemap.ts").default();
        const journals = load("src/domains/journal/data/journalEntries.ts").getJournalEntries();
        const original = ["/", "/about", "/artist", "/artworks", "/collections", "/contact", "/journal", ...expectedPaths, ...journals.map(item => `/journal/${item.slug}`)];
        assert.deepEqual(current.map(item => item.url).sort(), original.map(path => `https://rolandodelcarmen.com${path === "/" ? "/" : path}`).sort());
        let calls = 0;
        const api = serverModules(new Map([["@/server/catalogue/sitemapSource", { getCatalogueSitemapPaths: async () => { calls++; return ["/artworks/supplied-only", "/series/published-only"]; } }]]))("src/app/sitemap.ts");
        const entries = await api.default(); assert.equal(calls, 1);
        assert.ok(entries.some(item => item.url.endsWith("/artworks/supplied-only")));
        assert.ok(!entries.some(item => item.url.endsWith(`/artworks/${source.artworks[0].slug}`)));
        for (const entry of entries) {
            assert.equal(new URL(entry.url).origin, "https://rolandodelcarmen.com");
            assert.ok(!/\/(?:es|api|privacy|terms)(?:\/|$)|[?#]/.test(new URL(entry.url).pathname));
            assert.equal(entry.alternates, undefined);
        }
    });
});
