import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import test from "node:test";
import React from "react";
import { createTranslator } from "next-intl";
import ts from "typescript";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";
import { loadCatalogueSource } from "../scripts/lib/catalogueSource.mjs";

const require = createRequire(import.meta.url);
const load = serverModules();
const source = loadCatalogueSource();
const editorialRepository = serverModules()("src/server/catalogue/reader.ts").createCatalogueRepository(source);
const editorialArtworks = editorialRepository.getArtworkViews(["en", "es"]);
const editorialSeries = editorialRepository.getSeriesViews(["en", "es"]);
const services = load("src/domains/artworks/series/services.ts");
const { createArtworkSeriesCatalogue } = load("src/server/catalogue/seriesCatalogue.ts");
const { createCollectionEntries } = load("src/domains/collections/services/collectionEntries.ts");
const { getCollections } = load("src/domains/collections/services/getCollections.ts");
const { localizeArtworkSeries } = load("src/i18n/seriesCopy.ts");
const { getSiteMessages } = load("src/i18n/messages.ts");
const ids = values => values.map(value => value.id);
const view = (artworks = source.artworks, series = source.series) => createArtworkSeriesCatalogue(artworks, series);

test("SQL row order cannot change the approved Series cycle, member sequence or Collections year ordering", () => {
    const result = view([...source.artworks].reverse(), [...source.series].reverse());
    assert.deepEqual(ids(result.getArtworkSeries()), ids(services.getArtworkSeries()));
    assert.deepEqual(result.getCollections(), getCollections());
    assert.deepEqual(result.getCollections().map(item => item.series.id), ["epifanias", "yasemi", "the_inner_treasury", "the_discipline_of_seeing"]);
    for (const series of source.series) {
        assert.deepEqual(result.getArtworkSeriesBySlug(series.slug), series);
        assert.deepEqual(result.getArtworksBySeriesId(series.id), services.getArtworksBySeriesId(series.id));
    }
    const yasemi = result.getArtworkSeriesBySlug("yasemi");
    assert.equal(yasemi.yearStart, 2025); assert.equal(yasemi.yearEnd, undefined); assert.equal(yasemi.artisticStatus, "ongoing");
});

test("Collections keeps stable year ties, missing-year fallback and input immutability", () => {
    const base = source.series[0];
    const series = [{ ...base, id: "second", yearStart: 2025 }, { ...base, id: "unknown", yearStart: undefined }, { ...base, id: "first", yearStart: 2025 }, { ...base, id: "later", yearStart: 2027 }];
    const snapshot = structuredClone(series);
    const entries = createCollectionEntries(series, id => [{ id }]);
    assert.deepEqual(entries.map(entry => entry.series.id), ["later", "second", "first", "unknown"]);
    assert.deepEqual(entries.map(entry => entry.artworks[0].id), ["later", "second", "first", "unknown"]);
    assert.deepEqual(series, snapshot);
});

test("publication filtering, projection membership checks and detached outputs preserve independent artwork state", () => {
    const edited = structuredClone(source.series);
    edited[0].publicationStatus = "draft"; edited[1].publicationStatus = "archived";
    const reference = edited.filter(item => item.publicationStatus === "published");
    const result = createArtworkSeriesCatalogue(source.artworks, edited);
    assert.equal(result.getArtworkSeries().length, reference.length);
    assert.equal(result.getArtworkSeriesBySlug(edited[0].slug), undefined);
    assert.equal(result.getArtworkSeriesBySlug("missing"), undefined);
    for (const series of source.series) assert.deepEqual(result.getArtworksBySeriesId(series.id), services.getArtworksBySeriesId(series.id));
    assert.throws(() => view(source.artworks, source.series.map((series, index) => index === 1 ? { ...series, slug: source.series[0].slug } : series)), { code: "series_catalogue_membership_mismatch" });
    assert.throws(() => view(source.artworks, [...source.series, source.series[0]]), { code: "series_catalogue_membership_mismatch" });
    result.getArtworkSeries()[0].description = "consumer edit";
    assert.notEqual(source.series.find(item => item.id === reference[0].id).description, "consumer edit");
});

async function withSource(values, run) {
    const keys = ["VERCEL_ENV", "CATALOGUE_ARTWORKS_SOURCE"];
    const previous = Object.fromEntries(keys.map(key => [key, process.env[key]]));
    try {
        for (const key of keys) { if (values[key] === undefined) delete process.env[key]; else process.env[key] = values[key]; }
        return await run();
    } finally {
        for (const key of keys) { if (previous[key] === undefined) delete process.env[key]; else process.env[key] = previous[key]; }
    }
}

function sourceLoader({ wait = async () => {}, read = async () => ({ getArtworkViews: () => [...editorialArtworks].reverse(), getSeriesViews: () => [...editorialSeries].reverse() }) } = {}) {
    const calls = { wait: 0, scopes: [] };
    const modules = serverModules(new Map([
        ["next/server", { connection: async () => { calls.wait++; return wait(); } }],
        ["./archiveRuntime", { readArtworkArchiveCatalogue: async scope => { calls.scopes.push(scope); return read(); } }],
    ]));
    return { ...modules("src/server/catalogue/seriesSource.ts"), calls };
}

test("default and Production Series/Collections reads never initialize PostgreSQL", async () => {
    for (const env of [{}, { VERCEL_ENV: "preview" }, { VERCEL_ENV: "production", CATALOGUE_ARTWORKS_SOURCE: "postgres" }]) await withSource(env, async () => {
        const api = sourceLoader({ read: async () => assert.fail("database must remain lazy") });
        for (const scope of ["collections", "series"]) assert.deepEqual((await api.getArtworkSeriesCatalogue(scope)).getCollections(), view(editorialArtworks, editorialSeries).getCollections());
        assert.deepEqual(api.calls, { wait: 0, scopes: [] });
    });
});

test("opt-in requests use each fixed reader scope and preserve the supplied database records", async () => {
    await withSource({ CATALOGUE_ARTWORKS_SOURCE: "postgres" }, async () => {
        const api = sourceLoader();
        for (const scope of ["collections", "series"]) assert.deepEqual((await api.getArtworkSeriesCatalogue(scope)).getCollections(), view(editorialArtworks, editorialSeries).getCollections());
        assert.deepEqual(api.calls, { wait: 2, scopes: ["collections", "series"] });
    });
});

test("Series/Collections propagate Next prerender signals and sanitize failures without file fallback", async () => {
    await withSource({ CATALOGUE_ARTWORKS_SOURCE: "postgres" }, async () => {
        const bailout = new Error("fixture prerender signal");
        const stopped = sourceLoader({ wait: async () => { throw bailout; } });
        await assert.rejects(stopped.getArtworkSeriesCatalogue(), error => error === bailout); assert.equal(stopped.calls.scopes.length, 0);
        const failed = sourceLoader({ read: async () => { throw new Error("private-sentinel URL/SQL/row"); } });
        for (const scope of ["collections", "series"]) await assert.rejects(failed.getArtworkSeriesCatalogue(scope), error => {
            assert.equal(error.code, `catalogue_${scope}_read_failed`);
            assert.ok(!`${error.stack}${JSON.stringify(error)}`.includes("private-sentinel")); return true;
        });
    });
});

function pageModule(kind, catalogue) {
    const scopes = [];
    const exported = value => ({ __esModule: true, default: value });
    const dependencies = {
        "@/i18n/server": { activateLocale: async params => (await params).locale },
        "@/i18n/messages": { getSiteMessages },
        "next-intl/server": { getTranslations: async ({ locale, namespace }) => createTranslator({ locale, messages: getSiteMessages(locale), namespace }) },
        "@/i18n/seriesCopy": { localizeArtworkSeries },
        "@/shared/lib/metadata": load("src/shared/lib/metadata.ts"),
        "@/server/catalogue/seriesSource": { getArtworkSeriesCatalogue: async (scope = "series") => { scopes.push(scope); return catalogue; } },
        "next/navigation": { notFound: () => { throw Object.assign(new Error("not found"), { code: "fixture_not_found" }); } },
        "@/server/catalogue/staticParams": load("src/server/catalogue/staticParams.ts"),
        "@/domains/collections": { CollectionHero: "collection-hero", CollectionsIntro: "collections-intro" },
        "@/shared/layout/footer": exported("site-footer"),
        "@/domains/artworks/series/components/experience/SeriesExperience": exported("series-experience"),
    };
    const path = kind === "series" ? "../src/app/[locale]/series/[slug]/page.tsx" : "../src/app/[locale]/collections/page.tsx";
    const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
        fileName: `${kind}.tsx`, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    const compiled = { exports: {} };
    new Function("require", "module", "exports", code)(name => {
        if (Object.hasOwn(dependencies, name)) return dependencies[name];
        if (name.startsWith("@/") || name.startsWith(".")) throw new Error("Unspecified dependency: " + name);
        return require(name);
    }, compiled, compiled.exports);
    return { ...compiled.exports, scopes };
}

test("actual Collections page preserves all current EN/ES hero data, counts, media and ordering", async () => {
    const api = pageModule("collections", view([...source.artworks].reverse(), [...source.series].reverse()));
    for (const locale of ["en", "es"]) {
        const tree = await api.default({ params: Promise.resolve({ locale }) });
        const heroes = React.Children.toArray(tree.props.children).filter(child => child.type === "collection-hero");
        assert.deepEqual(heroes.map(child => child.props), getCollections().map(entry => ({ series: localizeArtworkSeries(entry.series, locale), artworks: entry.artworks })));
        const before = api.scopes.length;
        const metadata = await api.generateMetadata({ params: Promise.resolve({ locale }) });
        assert.equal(api.scopes.length, before); assert.ok(metadata.title);
    }
    assert.deepEqual(api.scopes, ["collections", "collections"]);
});

test("actual Series page preserves every EN/ES entry, both modes, artwork selection and SEO", async () => {
    const files = pageModule("series", view());
    const database = pageModule("series", view([...source.artworks].reverse(), [...source.series].reverse()));
    for (const locale of ["en", "es"]) for (const series of source.series) {
        const members = services.getArtworksBySeriesId(series.id);
        const requested = [undefined, members[0]?.slug, [members[0]?.slug], "foreign-artwork"];
        for (const mode of ["standard", "glass", ["glass"]]) for (const artwork of requested) {
            const params = Promise.resolve({ locale, slug: series.slug });
            const props = { params, searchParams: Promise.resolve({ view: mode, artwork }) };
            const result = await database.default(props);
            assert.deepEqual(result, await files.default(props));
            assert.deepEqual(result.props.entries, services.getArtworkSeries().map(item => ({ series: localizeArtworkSeries(item, locale), artworks: services.getArtworksBySeriesId(item.id) })));
            assert.equal(result.props.initialView, mode === "glass" ? "glass" : "standard");
            assert.equal(result.props.initialArtworkSlug, typeof artwork === "string" && members.some(work => work.slug === artwork) ? artwork : undefined);
        }
        const params = Promise.resolve({ locale, slug: series.slug });
        assert.deepEqual(await database.generateMetadata({ params }), await files.generateMetadata({ params }));
    }
});

test("Series metadata and page use supplied records, reject missing/unpublished series and keep static params database-free", async () => {
    const edited = structuredClone(source.series); edited[0].description = "Database series proof";
    const api = pageModule("series", view(source.artworks, edited));
    const params = Promise.resolve({ locale: "en", slug: edited[0].slug });
    assert.equal((await api.generateMetadata({ params })).description, "Database series proof");
    assert.equal((await api.default({ params, searchParams: Promise.resolve({}) })).props.entries[0].series.description, "Database series proof");
    const before = api.scopes.length; assert.deepEqual(api.generateStaticParams(), services.getArtworkSeries().map(series => ({ slug: series.slug }))); assert.equal(api.scopes.length, before);
    const missing = Promise.resolve({ locale: "es", slug: "missing-series" });
    await assert.rejects(api.generateMetadata({ params: missing }), { code: "fixture_not_found" });
    await assert.rejects(api.default({ params: missing, searchParams: Promise.resolve({}) }), { code: "fixture_not_found" });
    edited[0].publicationStatus = "draft";
    const hidden = createArtworkSeriesCatalogue(source.artworks, edited);
    await assert.rejects(pageModule("series", hidden).default({ params, searchParams: Promise.resolve({}) }), { code: "fixture_not_found" });
});

test("a supplied future published Series resolves on demand without an old build slug list", async () => {
    await withSource({ CATALOGUE_ARTWORKS_SOURCE: "postgres" }, async () => {
        const added = { ...source.series[0], id: "future-series", slug: "future-series", title: "Future series" };
        const api = pageModule("series", view(source.artworks, [...source.series, added]));
        assert.equal(api.dynamic, "force-dynamic");
        assert.deepEqual(api.generateStaticParams(), []);
        for (const locale of ["en", "es"]) {
            const params = Promise.resolve({ locale, slug: added.slug });
            const tree = await api.default({ params, searchParams: Promise.resolve({ view: "glass" }) });
            assert.equal(tree.props.initialSeriesSlug, added.slug);
            assert.ok(tree.props.entries.some(entry => entry.series.id === added.id));
            assert.ok((await api.generateMetadata({ params })).title.includes(added.title));
        }
    });
});
