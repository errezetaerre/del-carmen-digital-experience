import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";
import { loadCatalogueSource } from "../scripts/lib/catalogueSource.mjs";
import { catalogueConnectionConfig } from "../scripts/lib/catalogueClient.mjs";

const load = serverModules();
const operations = load("src/server/catalogue/operations.ts");
const model = load("src/server/catalogue/snapshot.ts");
const { isArtworkDate } = load("src/domains/artworks/model/artworkDate.ts");
const archive = load("src/domains/artworks/presentation/artworkArchive.ts");
const { localizeArtwork } = load("src/i18n/artworkCopy.ts");
const { localizeArtworkSeries } = load("src/i18n/seriesCopy.ts");
const source = loadCatalogueSource();
const sql = readFileSync(new URL("../database/migrations/0001_catalogue.sql", import.meta.url), "utf8");
const migration = { id: "0001_catalogue", sql, checksum: createHash("sha256").update(sql).digest("hex") };

function adapter(pg) {
    const session = target => ({ query: async (sql, params = []) => (await target.query(sql, params)).rows, execute: async sql => { await target.exec(sql); } });
    return { ...session(pg), transaction: (run, readOnly = false) => pg.transaction(async tx => {
        if (readOnly) await tx.exec("set transaction isolation level repeatable read read only");
        return run(session(tx));
    }) };
}

test("real PostgreSQL migration, import, constraints and exact catalogue round-trip", async t => {
    const pg = await PGlite.create();
    const database = adapter(pg);
    t.after(() => pg.close());
    await t.test("versioned migration applies once and refuses modified history", async () => {
        assert.equal(await operations.migrateCatalogue(database, [migration]), "applied");
        assert.equal(await operations.migrateCatalogue(database, [migration]), "unchanged");
        const changedSql = sql + "\n-- changed history\n";
        await assert.rejects(operations.migrateCatalogue(database, [{ ...migration, sql: changedSql, checksum: createHash("sha256").update(changedSql).digest("hex") }]), { code: "applied_migration_changed" });
        assert.equal((await database.query("select count(*)::int as count from catalogue.schema_migration"))[0].count, 1);
        await operations.verifyCatalogueSchema(database, [migration]);
        await database.execute("alter table catalogue.artwork add column year integer");
        await assert.rejects(operations.verifyCatalogueSchema(database, [migration]), { code: "schema_column_mismatch" });
        await database.execute("alter table catalogue.artwork drop column year");
    });
    await t.test("a failed later migration rolls back its DDL and version journal together", async () => {
        const sql = "create table catalogue.failed_migration (id text); select 1 / 0";
        const broken = { id: "0002_failure_fixture", sql, checksum: createHash("sha256").update(sql).digest("hex") };
        await assert.rejects(operations.migrateCatalogue(database, [migration, broken]), { code: "22012" });
        const [{ absent }] = await database.query("select to_regclass('catalogue.failed_migration') is null as absent");
        assert.equal(absent, true);
        assert.equal((await database.query("select count(*)::int as count from catalogue.schema_migration"))[0].count, 1);
    });
    await t.test("schema persists only Artwork.date and no duplicate series membership/count or gallery ordering", async () => {
        const columns = await database.query("select table_name, column_name, data_type from information_schema.columns where table_schema = 'catalogue'");
        const workColumns = columns.filter(row => row.table_name === "artwork").map(row => row.column_name);
        assert.ok(workColumns.includes("date"));
        for (const forbidden of ["year", "sort_order", "position", "archive_order", "created_at", "completed_at"]) assert.ok(!workColumns.includes(forbidden), forbidden);
        const seriesColumns = columns.filter(row => row.table_name === "artwork_series").map(row => row.column_name);
        for (const field of ["artistic_status", "publication_status", "year_start", "year_end"]) assert.ok(seriesColumns.includes(field));
        for (const field of ["status", "artwork_ids", "works_count"]) assert.ok(!seriesColumns.includes(field));
        assert.ok(columns.every(row => row.data_type !== "bytea"));
        assert.ok(!columns.some(row => /contact|newsletter|subscriber/.test(row.table_name)));
    });
    await t.test("SQL and TypeScript agree on strict dates, leap years and invalid precisions", async () => {
        const values = ["0001", "9999", "2025", "2000-02-29", "2024-02-29", "2400-02-29", "1900-02-28", "0001-01-01", "9999-12-31", "0000", "0000-01-01", "1900-02-29", "2100-02-29", "2025-02-29", "2025-04-31", "2025-00-10", "2025-13-01", "2025-01-00", "2025-01-32", "2025-11", "2025-1-09", "2025-11-9", "2025-11-09T00:00:00Z", "2025\n", "2025-11-09\n", " 2025", "2025 ", "20250", "", "2e03"];
        for (let year = 1896; year <= 2104; year += 4) values.push(`${year}-02-29`);
        for (let month = 0; month <= 13; month++) for (const day of [0, 28, 29, 30, 31, 32]) values.push(`2024-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
        for (const value of values) {
            const [{ valid }] = await database.query("select catalogue.valid_artwork_date($1) as valid", [value]);
            assert.equal(valid, isArtworkDate(value), value);
        }
    });
    await t.test("imports current source atomically and is idempotent without updates", async () => {
        assert.equal(await operations.seedCatalogue(database, source), "imported");
        assert.equal(await operations.seedCatalogue(database, source), "unchanged");
        const actual = await operations.readCatalogueSnapshot(database);
        operations.assertCatalogueEquivalent(source, actual);
        const byId = rows => [...rows].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
        assert.deepEqual(byId(actual.artworks), byId(source.artworks));
        assert.deepEqual(byId(actual.series), byId(source.series));
        assert.deepEqual(byId(actual.recognitions), byId(source.recognitions));
        assert.deepEqual(actual.homeCuration, source.homeCuration);
        assert.equal(actual.artworks.length, 45);
        assert.equal(actual.series.length, 4);
        const yasemi = actual.series.find(series => series.id === "yasemi");
        assert.equal(yasemi.yearStart, 2025); assert.equal(yasemi.artisticStatus, "ongoing"); assert.ok(!Object.hasOwn(yasemi, "yearEnd"));
    });
    await t.test("all EN/ES editorial outputs equal the actual existing localization functions", async () => {
        const actual = await operations.readCatalogueSnapshot(database);
        for (const locale of ["en", "es"]) {
            for (const artwork of source.artworks) assert.deepEqual(model.localizeCatalogueArtwork(actual, artwork.id, locale), localizeArtwork(artwork, locale));
            for (const series of source.series) assert.deepEqual(model.localizeCatalogueSeries(actual, series.id, locale), localizeArtworkSeries(series, locale));
        }
    });
    await t.test("existing filters, defaults and all chronological/alphabetic orders remain equivalent", async () => {
        const actual = await operations.readCatalogueSnapshot(database);
        const options = archive.getArtworkArchiveOptions(source.artworks);
        assert.deepEqual(archive.getArtworkArchiveOptions(actual.artworks), options);
        const queries = ["", "featured=true", "q=sol", ...["newest", "oldest", "title"].map(sort => `sort=${sort}`), ...["completed", "in-progress", "planned"].map(status => `creationStatus=${status}`), ...options.years.map(year => `year=${year}`), ...options.categories.map(category => `category=${category}`), ...options.mediums.map(medium => `medium=${medium}`), "creationStatus=planned&year=2027&sort=title"];
        for (const locale of ["en", "es"]) for (const query of queries) {
            const expectedFilters = archive.readArtworkArchiveFilters(source.artworks, new URLSearchParams(query));
            const actualFilters = archive.readArtworkArchiveFilters(actual.artworks, new URLSearchParams(query));
            assert.deepEqual(actualFilters, expectedFilters);
            assert.deepEqual(archive.selectArtworkArchive(actual.artworks, actualFilters, locale), archive.selectArtworkArchive(source.artworks, expectedFilters, locale));
        }
    });
    await t.test("constraints reject invalid dates/states, broken foreign keys and duplicate slugs", async () => {
        const cases = [
            ["update catalogue.artwork set date = $1 where id = 'yasemi_i'", ["2025-02-29"], "23514"],
            ["update catalogue.artwork set creation_status = $1 where id = 'yasemi_i'", ["finished"], "23514"],
            ["update catalogue.artwork set availability = $1 where id = 'yasemi_i'", ["sold-out"], "23514"],
            ["update catalogue.artwork_series set artistic_status = $1 where id = 'yasemi'", ["archived"], "23514"],
            ["update catalogue.artwork_series set publication_status = $1 where id = 'yasemi'", ["ongoing"], "23514"],
            ["update catalogue.artwork set series_id = $1 where id = 'yasemi_i'", ["missing"], "23503"],
            ["update catalogue.artwork_series set cover_artwork_id = $1 where id = 'yasemi'", ["missing"], "23503"],
            ["update catalogue.artwork set slug = (select slug from catalogue.artwork where id = 'sendero_del_sol') where id = 'yasemi_i'", [], "23505"],
            ["update catalogue.artwork_image set src = $1 where artwork_id = 'yasemi_i'", ["data:image/webp;base64,AAAA"], "23514"],
            ["update catalogue.artwork_series set visuals = $1 where id = 'yasemi'", [JSON.stringify({ hero: { src: "data:image/webp;base64,AAAA" } })], "23514"],
            ["update catalogue.artwork_translation set image_alts = $1 where artwork_id = 'yasemi_i'", [JSON.stringify({ primary: 42 })], "23514"],
        ];
        for (const [sql, params, code] of cases) await assert.rejects(database.transaction(tx => tx.query(sql, params)), { code });
        for (const availability of ["available", "reserved", "sold", "unavailable"]) {
            await pg.transaction(async tx => { await tx.query("update catalogue.artwork set availability=$1 where id='yasemi_i'", [availability]); await tx.rollback(); });
        }
        operations.assertCatalogueEquivalent(source, await operations.readCatalogueSnapshot(database));
    });
    await t.test("a third locale adds translations without schema change or title replacement", async () => {
        await pg.transaction(async tx => {
            await tx.query("insert into catalogue.locale(code) values ($1)", ["fr"]);
            await tx.query("insert into catalogue.artwork_translation(artwork_id,locale,quote,description,image_alts) values ($1,$2,$3,$4,$5)", ["yasemi_i", "fr", null, "Une œuvre contemplative.", JSON.stringify({ primary: "Yasemi, peinture" })]);
            const actual = await databaseSnapshotInTransaction(tx);
            const original = source.artworks.find(work => work.id === "yasemi_i");
            const localized = model.localizeCatalogueArtwork(actual, "yasemi_i", "fr");
            assert.equal(localized.title, original.title); assert.equal(localized.description, "Une œuvre contemplative."); assert.equal(localized.images.primary.alt, "Yasemi, peinture");
            await tx.rollback();
        });
    });
    await t.test("reseed refuses to overwrite later catalogue edits", async () => {
        await database.query("update catalogue.artwork set title=$1 where id='yasemi_i'", ["Owner revision"]);
        await assert.rejects(operations.seedCatalogue(database, source), { code: "catalogue_not_equivalent" });
        assert.equal((await database.query("select title from catalogue.artwork where id='yasemi_i'"))[0].title, "Owner revision");
        await database.query("update catalogue.artwork set title=$1 where id='yasemi_i'", [source.artworks.find(work => work.id === "yasemi_i").title]);
    });
});

test("new canonical fields cannot be silently lost by an older migration mapper", () => {
    const fixture = structuredClone(source); fixture.artworks[0].newCanonicalFact = "requires a migration";
    assert.throws(() => model.assertCatalogueSnapshot(fixture), { code: "unmapped_catalogue_attribute" });
    const image = structuredClone(source); image.artworks[0].images.primary.binary = "not a reference";
    assert.throws(() => model.assertCatalogueSnapshot(image), { code: "unmapped_catalogue_attribute" });
});

async function databaseSnapshotInTransaction(tx) {
    const rows = await operations.readCatalogueRows({ query: async (sql, params = []) => (await tx.query(sql, params)).rows });
    const { catalogueFromRows } = load("src/server/catalogue/rows.ts");
    return catalogueFromRows(rows);
}

test("failed import rolls back all records and catalog values remain query parameters", async t => {
    const pg = await PGlite.create(); t.after(() => pg.close());
    const database = adapter(pg);
    await operations.migrateCatalogue(database, [migration]);
    const invalid = structuredClone(source); invalid.artworks[0].dimensions.width = -1;
    await assert.rejects(operations.seedCatalogue(database, invalid), { code: "23514" });
    const counts = await operations.readCatalogueRows(database);
    assert.ok(Object.values(counts).every(rows => rows.length === 0));
    const hostile = structuredClone(source);
    hostile.artworks[0].title = "Quote '; DROP SCHEMA catalogue CASCADE; -- ñ é";
    await operations.seedCatalogue(database, hostile);
    operations.assertCatalogueEquivalent(hostile, await operations.readCatalogueSnapshot(database));
});

test("complete dates and independent creation/publication states survive PostgreSQL unchanged", async t => {
    const pg = await PGlite.create(); t.after(() => pg.close());
    const database = adapter(pg); await operations.migrateCatalogue(database, [migration]);
    const fixture = structuredClone(source);
    fixture.artworks[0].date = "2024-02-29";
    fixture.artworks[1].creationStatus = "in-progress";
    fixture.series[0].publicationStatus = "draft";
    fixture.series[1].publicationStatus = "archived";
    await operations.seedCatalogue(database, fixture);
    const actual = await operations.readCatalogueSnapshot(database);
    operations.assertCatalogueEquivalent(fixture, actual);
    assert.equal(actual.artworks.find(work => work.id === fixture.artworks[0].id).date, "2024-02-29");
    assert.equal(actual.series.find(series => series.id === "yasemi").artisticStatus, "ongoing");
    assert.equal(actual.series.find(series => series.id === "yasemi").publicationStatus, "draft");
});

test("database configuration rejects production writes, mixed endpoints, missing TLS and malformed values", () => {
    const base = { DATABASE_URL: "postgresql://test:dummy@ep-test-pooler.us-east-1.aws.neon.tech/catalogue?sslmode=require", DATABASE_URL_UNPOOLED: "postgresql://test:dummy@ep-test.us-east-1.aws.neon.tech/catalogue?sslmode=require", CATALOGUE_DB_TARGET: "development", CATALOGUE_DB_ENDPOINT: "ep-test" };
    assert.equal(catalogueConnectionConfig(base, true).endpoint, "ep-test");
    for (const patch of [{ VERCEL: "1" }, { VERCEL_ENV: "production" }, { VERCEL_ENV: "preview" }, { NODE_ENV: "production" }, { CATALOGUE_DB_TARGET: "production" }, { CATALOGUE_DB_ENDPOINT: "ep-other" }, { DATABASE_URL_UNPOOLED: undefined }, { DATABASE_URL_UNPOOLED: base.DATABASE_URL_UNPOOLED.replace("ep-test.", "ep-other.") }, { DATABASE_URL: base.DATABASE_URL.replace("sslmode=require", "sslmode=disable") }, { DATABASE_URL: "“postgresql://example”" }, { DATABASE_URL: undefined }]) {
        assert.throws(() => catalogueConnectionConfig({ ...base, ...patch }, true), error => error.name === "CatalogueConfigError" && !error.message.includes("postgresql://"));
    }
    assert.equal(catalogueConnectionConfig({ DATABASE_URL: base.DATABASE_URL }, false).endpoint, "ep-test");
});

test("operator CLI refuses a production write without exposing its URL or password", () => {
    const result = spawnSync(process.execPath, ["scripts/catalogue-db.mjs", "migrate"], {
        cwd: new URL("../", import.meta.url), encoding: "utf8",
        env: { ...process.env, NODE_ENV: "production", VERCEL_ENV: "production", DATABASE_URL: "postgresql://test:secret-sentinel@ep-test-pooler.us-east-1.aws.neon.tech/catalogue?sslmode=require", DATABASE_URL_UNPOOLED: "postgresql://test:secret-sentinel@ep-test.us-east-1.aws.neon.tech/catalogue?sslmode=require", CATALOGUE_DB_TARGET: "development", CATALOGUE_DB_ENDPOINT: "ep-test" },
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /local_development_writes_only/);
    for (const forbidden of ["secret-sentinel", "postgresql://", "ep-test."]) assert.ok(!(result.stdout + result.stderr).includes(forbidden));
});
