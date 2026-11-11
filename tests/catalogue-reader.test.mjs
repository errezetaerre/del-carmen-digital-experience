import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";
import { loadCatalogueSource } from "../scripts/lib/catalogueSource.mjs";
import { catalogueReaderConfig } from "../scripts/lib/catalogueClient.mjs";

const load = serverModules();
const { createCatalogueReader, createCatalogueRepository } = load("src/server/catalogue/reader.ts");
const { catalogueToRows } = load("src/server/catalogue/rows.ts");
const { localizeArtwork } = load("src/i18n/artworkCopy.ts");
const { localizeArtworkSeries } = load("src/i18n/seriesCopy.ts");
const archive = load("src/domains/artworks/presentation/artworkArchive.ts");
const source = loadCatalogueSource();

test("repository projects the actual EN/ES catalogue, original titles, curation and archive results", () => {
    const repository = createCatalogueRepository(source);
    for (const locale of ["en", "es"]) {
        for (const work of source.artworks) {
            assert.deepEqual(repository.getArtworkById(work.id, locale), localizeArtwork(work, locale));
            assert.deepEqual(repository.getArtworkBySlug(work.slug, locale), localizeArtwork(work, locale));
        }
        for (const series of source.series) {
            assert.deepEqual(repository.getSeriesById(series.id, locale), localizeArtworkSeries(series, locale));
            assert.deepEqual(repository.getSeriesBySlug(series.slug, locale), localizeArtworkSeries(series, locale));
        }
        for (const sort of archive.artworkArchiveSorts) {
            const filters = archive.readArtworkArchiveFilters(source.artworks, new URLSearchParams({ sort }));
            assert.deepEqual(archive.selectArtworkArchive(repository.getArtworks(locale), filters, locale), archive.selectArtworkArchive(source.artworks, filters, locale).map(work => localizeArtwork(work, locale)));
        }
    }
    assert.deepEqual(repository.getHomeCuration(), source.homeCuration);
    assert.deepEqual(repository.getRecognitions(), source.recognitions);
    assert.equal(repository.getArtworkById("missing"), undefined);
    assert.equal(repository.getSeriesBySlug("missing"), undefined);
});

test("repository uses database editorial rows instead of static Spanish fallback and accepts another locale", () => {
    const edited = structuredClone(source);
    const id = edited.artworks[0].id;
    edited.artworkTranslations.find(row => row.artworkId === id && row.locale === "es").description = "Texto editado en PostgreSQL";
    edited.artworkTranslations.push({ artworkId: id, locale: "fr", description: "Texte du catalogue" });
    const repository = createCatalogueRepository(edited);
    assert.equal(repository.getArtworkById(id, "es").description, "Texto editado en PostgreSQL");
    assert.equal(repository.getArtworkById(id, "fr").description, "Texte du catalogue");
    assert.deepEqual(repository.getArtworkById(id, "de"), edited.artworks[0]);
    assert.equal(repository.getArtworkById(id, "fr").title, edited.artworks[0].title);
});

test("draft/archived series are excluded without conflating artwork creation status or availability", () => {
    const edited = structuredClone(source);
    edited.series[1].publicationStatus = "draft";
    edited.series[2].publicationStatus = "archived";
    const repository = createCatalogueRepository(edited);
    assert.equal(repository.getSeries().length, 2);
    assert.equal(repository.getSeriesById(edited.series[1].id), undefined);
    assert.equal(repository.getSeriesBySlug(edited.series[2].slug), undefined);
    assert.deepEqual(repository.getArtworks(), edited.artworks);
});

test("returned records and inputs cannot mutate another request's cached catalogue", () => {
    const input = structuredClone(source);
    const repository = createCatalogueRepository(input);
    const id = input.artworks[0].id;
    input.artworks[0].title = "mutated input";
    repository.getArtworkById(id).images.primary.src = "/mutated.webp";
    repository.getArtworks()[0].categories.push("mutated");
    repository.getHomeCuration().selectedWorks.length = 0;
    repository.getRecognitions()[0].event = "mutated";
    assert.deepEqual(repository.getArtworks(), source.artworks);
    assert.deepEqual(repository.getHomeCuration(), source.homeCuration);
    assert.deepEqual(repository.getRecognitions(), source.recognitions);
});

function readFixture() {
    const state = { transactions: 0, queries: 0, fail: false, before: async () => {}, rows: catalogueToRows(source) };
    const database = {
        async transaction(run, readOnly) { state.transactions++; assert.equal(readOnly, true); await state.before(); return run(this); },
        async query(sql) {
            state.queries++;
            assert.match(sql, /^select /);
            if (state.fail) throw new Error("fixture connection failure");
            const table = sql.match(/from catalogue\.([a-z_]+)$/)?.[1];
            assert.ok(table && state.rows[table]);
            return structuredClone(state.rows[table]);
        },
        execute() { assert.fail("reader must never execute DDL or writes"); },
    };
    return { state, database };
}

test("concurrent reads and both languages share one transaction; idle time performs no work", async () => {
    const { state, database } = readFixture();
    let resume;
    state.before = () => new Promise(resolve => { resume = resolve; });
    let now = 1;
    const reader = createCatalogueReader(database, { ttlMs: 30, now: () => now });
    const requests = Array.from({ length: 12 }, () => reader.read());
    assert.equal(state.transactions, 1);
    resume();
    const repositories = await Promise.all(requests);
    assert.ok(repositories.every(item => item === repositories[0]));
    const count = state.queries;
    for (const locale of ["en", "es"]) {
        repositories[0].getArtworks(locale);
        repositories[0].getArtworkViews([locale]);
        repositories[0].getSeriesViews([locale]);
    }
    load("src/server/catalogue/verifyReadModel.ts").verifyCatalogueReadModel(repositories[0], source);
    now = 30; await reader.read();
    assert.equal(state.queries, count);
    now = 32; // Expiration starts no background refresh.
    assert.equal(state.transactions, 1);
    state.before = async () => {};
    await reader.read();
    assert.equal(state.transactions, 2);
});

test("expired/failed reads refuse stale or file fallback, recover on retry, and validate cache bounds", async () => {
    const { state, database } = readFixture();
    let now = 1;
    const reader = createCatalogueReader(database, { ttlMs: 10, now: () => now });
    await reader.read(); now = 12; state.fail = true;
    await assert.rejects(reader.read(), /fixture connection failure/);
    state.fail = false;
    assert.equal((await reader.read()).getArtworks().length, 45);
    assert.equal(state.transactions, 3);
    for (const ttlMs of [-1, Infinity, NaN, 60_001]) assert.throws(() => createCatalogueReader(database, { ttlMs }), { code: "invalid_catalogue_cache_ttl" });
});

test("read preparation accepts isolated development/Preview and refuses Production or mixed endpoints", () => {
    const env = { DATABASE_URL: "postgresql://owner:private-sentinel@ep-development-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require", CATALOGUE_DB_TARGET: "development", CATALOGUE_DB_ENDPOINT: "ep-development" };
    assert.equal(catalogueReaderConfig(env).endpoint, "ep-development");
    assert.equal(catalogueReaderConfig({ DATABASE_URL: env.DATABASE_URL, VERCEL: "1", VERCEL_ENV: "preview" }).endpoint, "ep-development");
    assert.throws(() => catalogueReaderConfig({ ...env, VERCEL_ENV: "production" }), { code: "production_catalogue_reads_not_activated" });
    assert.throws(() => catalogueReaderConfig({ ...env, CATALOGUE_DB_TARGET: undefined }), { code: "development_read_target_required" });
    assert.throws(() => catalogueReaderConfig({ ...env, CATALOGUE_DB_ENDPOINT: "ep-other" }), { code: "development_endpoint_mismatch" });
    assert.throws(() => catalogueReaderConfig({ ...env, DATABASE_URL_UNPOOLED: "postgresql://owner:private-sentinel@ep-other.us-east-1.aws.neon.tech/neondb?sslmode=require" }), { code: "database_urls_disagree" });
    const result = spawnSync(process.execPath, ["scripts/catalogue-db.mjs", "read"], { encoding: "utf8", env: { ...process.env, ...env, VERCEL_ENV: "production" } });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /production_catalogue_reads_not_activated/);
    assert.ok(!`${result.stdout}${result.stderr}`.includes("private-sentinel"));
});
