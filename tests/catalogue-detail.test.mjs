import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";
import { loadCatalogueSource } from "../scripts/lib/catalogueSource.mjs";

const require = createRequire(import.meta.url);
const load = serverModules();
const source = loadCatalogueSource();
const editorialRepository = serverModules()("src/server/catalogue/reader.ts").createCatalogueRepository(source);
const editorialArtworks = editorialRepository.getArtworkViews(["en", "es"]);
const editorialSeries = editorialRepository.getSeriesViews(["en", "es"]);
const { createArtworkDetailCatalogue } = load("src/server/catalogue/detailCatalogue.ts");
const archive = load("src/domains/artworks/presentation/artworkArchive.ts");
const ids = records => records.map(work => work.id);
const referenceView = () => createArtworkDetailCatalogue(source.artworks, source.series);

test("detail projection uses supplied records and preserves Series-context order independently of SQL row order", () => {
    const shuffled = structuredClone(source.artworks).reverse();
    shuffled[0].description = "Database projection proof";
    const view = createArtworkDetailCatalogue(shuffled, source.series);
    assert.deepEqual(ids(view.artworks).sort(), ids(source.artworks).sort());
    assert.equal(view.getArtworkBySlug(shuffled[0].slug).description, "Database projection proof");
    for (const series of source.series) {
        assert.deepEqual(ids(view.getArtworksBySeriesId(series.id)), ids(source.artworks.filter(work => work.seriesId === series.id)));
    }
    assert.equal(view.getArtworkBySlug("missing"), undefined);
    assert.equal(view.getArtworkSeriesBySlug("missing"), undefined);
    assert.deepEqual(view.getArtworksBySeriesId("missing"), []);
});

test("detail projection rejects duplicate IDs/slugs and keeps publication independent of artwork creation state", () => {
    for (const records of [[...source.artworks, source.artworks[0]], source.artworks.map((work, index) => index === 1 ? { ...work, slug: source.artworks[0].slug } : work)]) assert.throws(() => createArtworkDetailCatalogue(records, source.series), { code: "detail_catalogue_membership_mismatch" });
    const edited = structuredClone(source.series);
    edited[1].publicationStatus = "draft"; edited[2].publicationStatus = "archived";
    const view = createArtworkDetailCatalogue(source.artworks, edited);
    assert.equal(view.getArtworkSeriesBySlug(edited[1].slug), undefined);
    assert.equal(view.getArtworkSeriesBySlug(edited[2].slug), undefined);
    assert.deepEqual(view.artworks, source.artworks);
    view.artworks[0].images.primary.src = "/consumer-edit.webp";
    assert.notEqual(source.artworks[0].images.primary.src, "/consumer-edit.webp");
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

function detailLoader({ wait = async () => {}, read = async () => ({ getArtworkViews: () => structuredClone(editorialArtworks).reverse(), getSeriesViews: () => editorialSeries }) } = {}) {
    const calls = { wait: 0, read: 0 };
    const load = serverModules(new Map([
        ["next/server", { connection: async () => { calls.wait++; return wait(); } }],
        ["./archiveRuntime", { readArtworkArchiveCatalogue: async scope => { assert.equal(scope, "detail"); calls.read++; return read(); } }],
    ]));
    return { ...load("src/server/catalogue/detailSource.ts"), calls };
}

test("detail default/Production paths keep files without opening the reader or awaiting a request", async () => {
    for (const env of [{}, { VERCEL_ENV: "preview" }, { VERCEL_ENV: "production", CATALOGUE_ARTWORKS_SOURCE: "postgres" }]) await withSource(env, async () => {
        const api = detailLoader({ read: async () => assert.fail("database must stay uninitialized") });
        assert.deepEqual((await api.getArtworkDetailCatalogue()).artworks, editorialArtworks);
        assert.deepEqual(api.calls, { wait: 0, read: 0 });
    });
});

test("opt-in detail reads after the request boundary and restores the approved record sequence", async () => {
    await withSource({ CATALOGUE_ARTWORKS_SOURCE: "postgres" }, async () => {
        const api = detailLoader();
        const result = await api.getArtworkDetailCatalogue();
        assert.deepEqual([...result.artworks].sort((a, b) => a.id.localeCompare(b.id)), [...editorialArtworks].sort((a, b) => a.id.localeCompare(b.id)));
        assert.deepEqual(api.calls, { wait: 1, read: 1 });
    });
});

test("detail keeps Next's prerender signal and sanitizes connection failures without file fallback", async () => {
    await withSource({ CATALOGUE_ARTWORKS_SOURCE: "postgres" }, async () => {
        const bailout = new Error("fixture prerender signal");
        const stopped = detailLoader({ wait: async () => { throw bailout; } });
        await assert.rejects(stopped.getArtworkDetailCatalogue(), error => error === bailout);
        assert.equal(stopped.calls.read, 0);
        const failed = detailLoader({ read: async () => { throw Object.assign(new Error("private-sentinel URL/SQL/row"), { query: "private-sentinel" }); } });
        await assert.rejects(failed.getArtworkDetailCatalogue(), error => {
            assert.equal(error.code, "catalogue_detail_read_failed");
            assert.ok(!`${error.stack}${JSON.stringify(error)}`.includes("private-sentinel"));
            return true;
        });
    });
});

function detailPage(view) {
    const counter = { reads: 0 };
    const exported = value => ({ __esModule: true, default: value });
    const dependencies = {
        "@/i18n/server": { activateLocale: async params => (await params).locale },
        "@/i18n/messages": load("src/i18n/messages.ts"),
        "@/server/catalogue/staticParams": load("src/server/catalogue/staticParams.ts"),
        "@/server/catalogue/detailSource": { getArtworkDetailCatalogue: async () => { counter.reads++; return view; } },
        "@/domains/artworks/presentation/getArtworkMetadata": load("src/domains/artworks/presentation/getArtworkMetadata.ts"),
        "@/domains/artworks/model/artworkDate": load("src/domains/artworks/model/artworkDate.ts"),
        "next/navigation": { notFound: () => { throw Object.assign(new Error("not found"), { code: "fixture_not_found" }); } },
        "@/domains/artworks/components/ArtworkDetailKineticExperience": exported("kinetic-experience"),
        "@/domains/artworks/components/ArtworkDetailScene": exported("artwork-scene"),
        "@/domains/artworks/presentation/getArtworkPresentation": load("src/domains/artworks/presentation/getArtworkPresentation.ts"),
        "@/domains/artworks/presentation/artworkArchive": archive,
        "@/domains/artworks/presentation/artworkExperience": load("src/domains/artworks/presentation/artworkExperience.ts"),
        "@/domains/artworks/components/portrait-artbook/ArtworkPortraitEntry": exported("portrait-entry"),
    };
    const output = ts.transpileModule(readFileSync(new URL("../src/app/[locale]/artworks/[slug]/page.tsx", import.meta.url), "utf8"), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    const compiled = { exports: {} };
    new Function("require", "module", "exports", output)(name => {
        if (Object.hasOwn(dependencies, name)) return dependencies[name];
        if (name.startsWith("@/") || name.startsWith(".")) throw new Error("Unspecified page dependency: " + name);
        return require(name);
    }, compiled, compiled.exports);
    return { ...compiled.exports, counter };
}

test("actual EN/ES detail page preserves Standard/Glass scene data, filters, neighbours, Series order and metadata", async () => {
    const files = detailPage(referenceView());
    const database = detailPage(createArtworkDetailCatalogue([...source.artworks].reverse(), [...source.series].reverse()));
    for (const locale of ["en", "es"]) {
        const cases = [];
        for (const creationStatus of archive.artworkArchiveCreationStatuses) for (const sort of archive.artworkArchiveSorts) {
            const query = { creationStatus, sort };
            const records = archive.selectArtworkArchive(source.artworks, archive.readArtworkArchiveFilters(source.artworks, new URLSearchParams(query)), locale);
            if (records.length) cases.push({ work: records[Math.floor(records.length / 2)], query });
        }
        for (const query of [{ category: "spiritual" }, { medium: "oil" }, { featured: "true" }, { year: "2025", sort: "oldest" }, { q: "Yasemi" }]) {
            const records = archive.selectArtworkArchive(source.artworks, archive.readArtworkArchiveFilters(source.artworks, new URLSearchParams(query)), locale);
            if (records.length) cases.push({ work: records[Math.floor(records.length / 2)], query });
        }
        for (const series of source.series) {
            const members = source.artworks.filter(work => work.seriesId === series.id);
            if (members.length) cases.push({ work: members[Math.floor(members.length / 2)], query: { series: series.slug, creationStatus: "planned", sort: "title" } });
        }
        cases.push({ work: source.artworks.find(work => work.creationStatus === "planned"), query: {} });
        for (const { work, query } of cases) for (const experience of ["standard", "glass"]) {
            const params = Promise.resolve({ locale, slug: work.slug });
            const props = { params, searchParams: Promise.resolve({ ...query, experience }) };
            assert.deepEqual(await database.default(props), await files.default(props));
            assert.deepEqual(await database.generateMetadata({ params }), await files.generateMetadata({ params }));
        }
    }
});

test("detail page takes its artwork from the data source, keeps notFound handling and never reads the database in static params", async () => {
    const edited = structuredClone(source.artworks); edited[0].quote = "Database detail data proof";
    const api = detailPage(createArtworkDetailCatalogue(edited, source.series));
    const entry = await api.default({ params: Promise.resolve({ locale: "en", slug: edited[0].slug }), searchParams: Promise.resolve({}) });
    assert.equal(entry.props.children.props.currentScene.props.artwork.quote, "Database detail data proof");
    const before = api.counter.reads;
    assert.deepEqual(api.generateStaticParams(), source.artworks.map(work => ({ slug: work.slug })));
    assert.equal(api.counter.reads, before);
    const params = Promise.resolve({ locale: "es", slug: "missing-artwork" });
    await assert.rejects(api.generateMetadata({ params }), { code: "fixture_not_found" });
    await assert.rejects(api.default({ params, searchParams: Promise.resolve({}) }), { code: "fixture_not_found" });
});

test("a supplied future detail slug resolves on demand in both languages even when PostgreSQL static params are empty", async () => {
    await withSource({ CATALOGUE_ARTWORKS_SOURCE: "postgres" }, async () => {
        const added = { ...source.artworks[0], id: "future-work", slug: "future-work", title: "Future original title", date: "2028", quote: "Future detail proof" };
        const api = detailPage(createArtworkDetailCatalogue([...source.artworks, added], source.series));
        assert.equal(api.dynamic, "force-dynamic");
        assert.deepEqual(api.generateStaticParams(), []);
        for (const locale of ["en", "es"]) {
            const params = Promise.resolve({ locale, slug: added.slug });
            const tree = await api.default({ params, searchParams: Promise.resolve({ experience: "glass" }) });
            assert.equal(tree.props.children.props.currentScene.props.artwork.id, added.id);
            assert.ok((await api.generateMetadata({ params })).title.includes(added.title));
        }
    });
});
