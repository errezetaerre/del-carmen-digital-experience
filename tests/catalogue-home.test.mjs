import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import test from "node:test";
import React from "react";
import ts from "typescript";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";
import { loadCatalogueSource } from "../scripts/lib/catalogueSource.mjs";

const require = createRequire(import.meta.url);
const base = serverModules(), source = loadCatalogueSource();
const editorialRepository = serverModules()("src/server/catalogue/reader.ts").createCatalogueRepository(source);
const editorialArtworks = editorialRepository.getArtworkViews(["en", "es"]);
const editorialSeries = editorialRepository.getSeriesViews(["en", "es"]);
const artworkServices = { ...base("src/domains/artworks/services/index.ts"), ...base("src/domains/artworks/series/services.ts") };
const load = serverModules(new Map([["@/domains/artworks", artworkServices]]));
const legacy = load("src/domains/home/services/index.ts");
const { createHomeCatalogue } = load("src/server/catalogue/homeCatalogue.ts");
const { getHomeBookContent } = load("src/domains/home/experience/homeBookContent.ts");
const view = (artworks = source.artworks, series = source.series, curation = source.homeCuration) => createHomeCatalogue(artworks, series, curation);
const expected = () => ({ hero: legacy.getHeroArtwork(), featured: legacy.getFeaturedWorkArtwork(), collection: legacy.getFeaturedCollection(), selected: legacy.getSelectedWorks() });

test("Home projection preserves existing curation, members and derived counts regardless of SQL row order", () => {
    const home = view([...source.artworks].reverse(), [...source.series].reverse());
    assert.deepEqual(home, expected());
    assert.equal(home.hero.id, "epifania_nupcial"); assert.equal(home.featured.id, "sendero_del_sol");
    assert.equal(home.collection.series.id, "yasemi"); assert.equal(home.collection.series.yearStart, 2025);
    assert.equal(home.collection.series.yearEnd, undefined); assert.equal(home.collection.series.artisticStatus, "ongoing");
    assert.equal(home.collection.artworkCount, home.collection.artworks.length);
    assert.deepEqual(home.selected.map(work => work.id), source.homeCuration.selectedWorks);
    assert.equal(home.collection.artworks.filter(work => work.creationStatus === "planned").length, 3);
});

test("Home uses supplied records and curated IDs, preserving original titles, dates and detached outputs", () => {
    const artworks = structuredClone(source.artworks), curation = structuredClone(source.homeCuration);
    curation.hero.artworkId = "el_misionero"; curation.featuredWork.artworkId = "epifania_nupcial";
    curation.featuredCollection.seriesId = "the_inner_treasury"; curation.selectedWorks = ["yasemi_ii", "el_misionero"];
    const proof = artworks.find(work => work.id === "el_misionero"); proof.description = "Supplied catalogue proof";
    const result = view(artworks.reverse(), [...source.series].reverse(), curation);
    assert.equal(result.hero.id, curation.hero.artworkId); assert.equal(result.hero.description, proof.description);
    assert.equal(result.hero.title, proof.title); assert.equal(result.hero.date, proof.date);
    assert.equal(result.featured.id, curation.featuredWork.artworkId);
    assert.equal(result.collection.series.id, curation.featuredCollection.seriesId);
    assert.deepEqual(result.selected.map(work => work.id), curation.selectedWorks); assert.equal(result.selected[0].creationStatus, "planned");
    assert.equal(legacy.getHeroArtwork().id, source.homeCuration.hero.artworkId);
    result.hero.description = "Consumer mutation"; result.collection.series.description = "Consumer mutation";
    assert.notEqual(proof.description, "Consumer mutation");
    assert.notEqual(source.series.find(item => item.id === curation.featuredCollection.seriesId).description, "Consumer mutation");
});

test("Home keeps published-Series selection and optional-section behavior without dropping catalogue artworks", () => {
    const series = structuredClone(source.series); series.find(item => item.id === "yasemi").publicationStatus = "draft";
    assert.equal(view(source.artworks, series).collection, undefined);
    const curation = { ...source.homeCuration, hero: { artworkId: "missing" }, selectedWorks: ["missing"] };
    assert.equal(view(source.artworks, source.series, curation).hero, undefined);
    assert.deepEqual(view(source.artworks, source.series, curation).selected, []);
    assert.throws(() => view([...source.artworks, source.artworks[0]]), { code: "detail_catalogue_membership_mismatch" });
});

test("one supplied Home selection preserves EN/ES book copy, chapters, responsive images and journal data", () => {
    const home = view([...source.artworks].reverse(), [...source.series].reverse());
    for (const locale of ["en", "es"]) {
        const book = getHomeBookContent(locale, home);
        assert.deepEqual(book, getHomeBookContent(locale, expected()));
        assert.equal(book.hero.id, home.hero.id); assert.equal(book.featured.id, home.featured.id);
        assert.deepEqual(book.selected.map(work => work.id), home.selected.map(work => work.id));
        assert.equal(book.collection.landscapeImage.src, "/images/series/yasemi_I_hero_landscape.webp");
        assert.equal(book.collection.portraitImage.src, home.collection.coverArtwork.images.collection.src);
        assert.equal(book.chapters.at(-1), "credits"); assert.ok(book.journal.length > 0);
    }
    assert.notEqual(getHomeBookContent("en", home).hero.description, getHomeBookContent("es", home).hero.description);
    const altered = view(source.artworks, source.series, { ...source.homeCuration, selectedWorks: [] });
    assert.ok(!getHomeBookContent("es", altered).chapters.includes("artworks"));
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

function sourceLoader({ wait = async () => {}, read = async () => ({ getArtworkViews: () => [...editorialArtworks].reverse(), getSeriesViews: () => [...editorialSeries].reverse(), getHomeCuration: () => source.homeCuration }) } = {}) {
    const calls = { wait: 0, scopes: [] };
    const modules = serverModules(new Map([
        ["next/server", { connection: async () => { calls.wait++; return wait(); } }],
        ["./archiveRuntime", { readArtworkArchiveCatalogue: async scope => { calls.scopes.push(scope); return read(); } }],
    ]));
    return { ...modules("src/server/catalogue/homeSource.ts"), calls };
}

test("Home default and enforced Production keep files without initializing or contacting PostgreSQL", async () => {
    for (const env of [{}, { VERCEL_ENV: "preview" }, { VERCEL_ENV: "production", CATALOGUE_ARTWORKS_SOURCE: "postgres" }]) await withSource(env, async () => {
        const api = sourceLoader({ read: async () => assert.fail("No database in this mode") });
        assert.deepEqual(await api.getHomeCatalogue(), view(editorialArtworks, editorialSeries)); assert.deepEqual(api.calls, { wait: 0, scopes: [] });
    });
});

test("local/Preview Home opt-in waits for a real request and uses repository records and curation", async () => {
    for (const VERCEL_ENV of [undefined, "preview"]) await withSource({ VERCEL_ENV, CATALOGUE_ARTWORKS_SOURCE: "postgres" }, async () => {
        let waiting = true;
        const curation = { ...source.homeCuration, hero: { artworkId: "el_misionero" }, selectedWorks: ["sendero_del_sol"] };
        const api = sourceLoader({ wait: async () => { waiting = false; }, read: async () => {
            assert.equal(waiting, false);
            return { getArtworkViews: () => editorialArtworks, getSeriesViews: () => editorialSeries, getHomeCuration: () => curation };
        } });
        const result = await api.getHomeCatalogue();
        assert.equal(result.hero.id, "el_misionero"); assert.deepEqual(result.selected.map(work => work.id), ["sendero_del_sol"]);
        assert.deepEqual(api.calls, { wait: 1, scopes: ["home"] });
    });
});

test("Home preserves Next prerender signals and sanitizes failures without a file or stale fallback", async () => {
    await withSource({ CATALOGUE_ARTWORKS_SOURCE: "postgres" }, async () => {
        const bailout = new Error("fixture prerender signal");
        const stopped = sourceLoader({ wait: async () => { throw bailout; } });
        await assert.rejects(stopped.getHomeCatalogue(), error => error === bailout); assert.equal(stopped.calls.scopes.length, 0);
        const failed = sourceLoader({ read: async () => { throw new Error("private-sentinel SQL/row/password"); } });
        await assert.rejects(failed.getHomeCatalogue(), error => {
            assert.equal(error.code, "catalogue_home_read_failed");
            assert.ok(!`${error.stack}${JSON.stringify(error)}`.includes("private-sentinel")); return true;
        });
    });
});

const exported = value => ({ __esModule: true, default: value });
function component(path, dependencies) {
    const code = ts.transpileModule(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"), {
        fileName: path, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    const compiled = { exports: {} };
    new Function("require", "module", "exports", code)(name => {
        if (Object.hasOwn(dependencies, name)) return dependencies[name];
        if (name.startsWith("@/") || name.startsWith(".")) throw new Error("Unexpected dependency: " + name);
        return require(name);
    }, compiled, compiled.exports);
    return compiled.exports;
}

test("actual Home page and SEO resolve the supplied catalogue in both languages", async () => {
    const home = view(source.artworks, source.series, { ...source.homeCuration, hero: { artworkId: "el_misionero" } });
    let reads = 0;
    const page = component("src/app/[locale]/page.tsx", {
        "@/i18n/server": { activateLocale: async params => (await params).locale },
        "@/shared/lib/metadata": load("src/shared/lib/metadata.ts"),
        "@/i18n/artworkCopy": load("src/i18n/artworkCopy.ts"),
        "@/server/catalogue/homeSource": { getHomeCatalogue: async () => { reads++; return home; } },
        "@/domains/home": exported("home-composition"),
    });
    for (const locale of ["en", "es"]) {
        const params = Promise.resolve({ locale }); const tree = await page.default({ params });
        assert.equal(tree.type, "home-composition"); assert.strictEqual(tree.props.catalogue, home);
        const metadata = await page.generateMetadata({ params }); assert.ok(JSON.stringify(metadata).includes(home.hero.images.primary.src));
    }
    assert.equal(reads, 4);
});

test("actual Standard Home and the lazy book receive one selection without section-owned static lookups", () => {
    const paths = {
        "./sections/hero": "hero", "./sections/featuredArtwork": "featured", "./sections/collection": "collection",
        "./sections/artistStatement": "artist", "./sections/selectedWorks": "selected", "./sections/journal": "journal",
        "./sections/invitation": "invitation", "@/shared/layout/footer": "footer", "./experience/HomeExperience": "experience",
    };
    const Home = component("src/domains/home/index.tsx", Object.fromEntries(Object.entries(paths).map(([path, tag]) => [path, exported(tag)]))).default;
    const home = view(), tree = Home({ catalogue: home });
    assert.equal(tree.type, "experience"); assert.strictEqual(tree.props.catalogue, home);
    const sections = React.Children.toArray(tree.props.children.props.children);
    assert.deepEqual(sections.map(node => node.type), ["hero", "featured", "artist", "collection", "selected", "journal", "invitation", "footer"]);
    assert.strictEqual(sections[0].props.artwork, home.hero); assert.strictEqual(sections[1].props.artwork, home.featured);
    assert.strictEqual(sections[3].props.featuredCollection, home.collection); assert.strictEqual(sections[4].props.artworks, home.selected);
});
