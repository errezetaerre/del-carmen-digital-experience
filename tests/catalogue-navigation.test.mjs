import assert from "node:assert/strict";
import test from "node:test";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";
import { loadCatalogueSource } from "../scripts/lib/catalogueSource.mjs";

const load = serverModules(), source = loadCatalogueSource();
const { orderSeriesArtworks, orderArtworkSeries } = load("src/domains/artworks/presentation/seriesNavigationOrder.ts");
const { createArtworkDetailCatalogue } = load("src/server/catalogue/detailCatalogue.ts");
const { createArtworkSeriesCatalogue } = load("src/server/catalogue/seriesCatalogue.ts");
const { createHomeCatalogue } = load("src/server/catalogue/homeCatalogue.ts");
const { createCatalogueRepository } = load("src/server/catalogue/reader.ts");
const { verifyCatalogueReadModel } = load("src/server/catalogue/verifyReadModel.ts");
const archive = load("src/domains/artworks/presentation/artworkArchive.ts");
const ids = records => records.map(record => record.id);
const permutations = values => [values, [...values].reverse(), [...values.slice(2), ...values.slice(0, 2)], [...values].sort((a, b) => a.title.localeCompare(b.title))];

test("editorial policy preserves all four approved Series cycles and 17 member positions independently of entity row order", () => {
    for (const works of permutations(source.artworks)) for (const series of permutations(source.series)) {
        const grouped = createArtworkSeriesCatalogue(works, series);
        assert.deepEqual(ids(grouped.getArtworkSeries()), ids(source.series));
        for (const item of source.series) assert.deepEqual(ids(grouped.getArtworksBySeriesId(item.id)), ids(source.artworks.filter(work => work.seriesId === item.id)));
        for (const locale of ["en", "es"]) for (const creationStatus of archive.artworkArchiveCreationStatuses) for (const sort of archive.artworkArchiveSorts) {
            const filters = archive.readArtworkArchiveFilters(works, new URLSearchParams({ creationStatus, sort }));
            assert.deepEqual(ids(archive.selectArtworkArchive(works, filters, locale)), ids(archive.selectArtworkArchive(source.artworks, filters, locale)));
        }
    }
});

test("order preferences never define membership or hide new records; new works have stable date precision/title/ID ties", () => {
    const old = source.artworks.filter(work => work.seriesId === "yasemi");
    const base = old[0];
    const added = [
        { ...base, id: "unknown-year", title: "Year only", date: "2028" },
        { ...base, id: "tie-b", title: "New work", date: "2028-02-29" },
        { ...base, id: "tie-a", title: "New work", date: "2028-02-29" },
        { ...base, id: "older", title: "Earlier", date: "2027" },
    ].map(record => ({ ...record, slug: record.id }));
    const snapshot = structuredClone([...old, ...added]);
    for (const input of permutations(snapshot)) assert.deepEqual(ids(orderSeriesArtworks(input)), [...ids(old), "tie-a", "tie-b", "unknown-year", "older"]);
    assert.deepEqual([...old, ...added], snapshot);
    const moved = source.artworks.map(work => work.id === "yasemi_ii" ? { ...work, seriesId: undefined } : work);
    const detail = createArtworkDetailCatalogue([...moved, ...added], source.series);
    assert.ok(!ids(detail.getArtworksBySeriesId("yasemi")).includes("yasemi_ii"));
    assert.equal(detail.getArtworkBySlug("yasemi-ii").seriesId, undefined);
    assert.equal(detail.artworks.length, source.artworks.length + added.length);
    assert.deepEqual(orderSeriesArtworks([]), []);
});

test("new published series follow the existing cycle deterministically and publication remains independent of curation", () => {
    const base = source.series[0], added = [
        { ...base, id: "new-b", slug: "new-b", title: "New series", yearStart: 2028 },
        { ...base, id: "new-a", slug: "new-a", title: "New series", yearStart: 2028 },
        { ...base, id: "no-year", slug: "no-year", title: "No year", yearStart: undefined },
    ];
    for (const input of permutations([...source.series, ...added])) assert.deepEqual(ids(orderArtworkSeries(input)), [...ids(source.series), "new-a", "new-b", "no-year"]);
    const edited = source.series.map(item => item.id === "yasemi" ? { ...item, publicationStatus: "draft" } : item);
    const result = createArtworkSeriesCatalogue(source.artworks, [...edited, ...added]);
    assert.ok(!ids(result.getArtworkSeries()).includes("yasemi"));
    assert.ok(!result.getArtworkSeriesBySlug("yasemi"));
    assert.equal(result.getArtworkSeries().length, 6);
});

test("new supplied artwork/Series records flow through detail, Collections and Home without an obsolete reference length gate", () => {
    const newWork = { ...source.artworks[0], id: "new-work", slug: "new-work", seriesId: "new-series", date: "2028", title: "New original title" };
    const newSeries = { ...source.series[0], id: "new-series", slug: "new-series", title: "New series", coverArtworkId: newWork.id };
    const works = [...source.artworks, newWork], series = [...source.series, newSeries];
    const detail = createArtworkDetailCatalogue(works, series);
    assert.equal(detail.getArtworkBySlug(newWork.slug).title, newWork.title);
    const grouped = createArtworkSeriesCatalogue(works, series);
    assert.deepEqual(ids(grouped.getArtworksBySeriesId(newSeries.id)), [newWork.id]);
    assert.equal(grouped.getCollections().find(entry => entry.series.id === newSeries.id).artworks.length, 1);
    const curation = { ...source.homeCuration, hero: { artworkId: newWork.id }, featuredCollection: { seriesId: newSeries.id }, selectedWorks: [newWork.id] };
    const home = createHomeCatalogue(works, series, curation);
    assert.equal(home.hero.id, newWork.id); assert.equal(home.collection.series.id, newSeries.id); assert.deepEqual(ids(home.selected), [newWork.id]);
});

test("read-model operator verification checks detached projections without SQL and rejects corrupted editorial/role/sitemap outputs", () => {
    const shuffled = { ...source, artworks: [...source.artworks].reverse(), series: [...source.series].reverse() };
    const repository = createCatalogueRepository(shuffled);
    assert.deepEqual(verifyCatalogueReadModel(repository, source), { artworks: 45, publishedSeries: 4, recognitions: 1, locales: ["en", "es"] });
    for (const patch of [
        { getArtworkViews: () => repository.getArtworkViews(["en", "es"]).map((work, index) => index ? work : { ...work, quote: "corrupt" }) },
        { getArtworkViews: () => repository.getArtworkViews(["en", "es"]).map((work, index) => index ? work : { ...work, cataloguePresentation: { ...work.cataloguePresentation, featured: !work.cataloguePresentation.featured } }) },
        { getArtworks: () => repository.getArtworks().map((work, index) => index ? work : { ...work, slug: "corrupt" }) },
        { getHomeCuration: () => ({ ...source.homeCuration, selectedWorks: [] }) },
    ]) assert.throws(() => verifyCatalogueReadModel({ ...repository, ...patch }, source), { code: "catalogue_read_model_not_equivalent" });
});

async function withSource(values, run) {
    const keys = ["CATALOGUE_ARTWORKS_SOURCE", "VERCEL_ENV"], previous = Object.fromEntries(keys.map(key => [key, process.env[key]]));
    try { for (const key of keys) { if (values[key] === undefined) delete process.env[key]; else process.env[key] = values[key]; } return await run(); }
    finally { for (const key of keys) { if (previous[key] === undefined) delete process.env[key]; else process.env[key] = previous[key]; } }
}

test("PostgreSQL static params enumerate no files and open no database/request; default and Production retain approved file paths", async () => {
    let fileReads = 0;
    const api = serverModules(new Map([
        ["./fileReader", { readFileCatalogue() { fileReads++; return createCatalogueRepository(source); } }],
        ["next/server", { connection() { assert.fail("static params must not wait for request"); } }],
        ["./archiveRuntime", { readArtworkArchiveCatalogue() { assert.fail("no database at build time"); } }],
    ]))("src/server/catalogue/staticParams.ts");
    for (const VERCEL_ENV of [undefined, "preview"]) await withSource({ VERCEL_ENV, CATALOGUE_ARTWORKS_SOURCE: "postgres" }, async () => {
        assert.deepEqual(api.artworkStaticParams(), []); assert.deepEqual(api.seriesStaticParams(), []);
    });
    assert.equal(fileReads, 0);
    for (const env of [{}, { VERCEL_ENV: "production", CATALOGUE_ARTWORKS_SOURCE: "postgres" }]) await withSource(env, async () => {
        assert.deepEqual(api.artworkStaticParams(), source.artworks.map(({ slug }) => ({ slug })));
        assert.deepEqual(api.seriesStaticParams(), source.series.map(({ slug }) => ({ slug })));
    });
    assert.equal(fileReads, 4);
});
