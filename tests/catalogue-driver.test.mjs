import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import postgres from "postgres";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";
import { loadCatalogueSource } from "../scripts/lib/catalogueSource.mjs";
import { catalogueClientFromSql } from "../scripts/lib/catalogueClient.mjs";
import { safeCatalogueConstraint } from "../scripts/lib/catalogueDiagnostics.mjs";

test("actual Postgres.js protocol preserves JSONB objects through catalogue import and persisted read", async t => {
    // Disposable loopback server; real production client keeps verify-full TLS.
    // No env files, real credentials, Neon or Redis are used by this test.
    const pg = await PGlite.create();
    const server = new PGLiteSocketServer({ db: pg, host: "127.0.0.1", port: 0, inspect: false });
    let database;
    t.after(async () => { if (database) await database.close(); await server.stop(); await pg.close(); });
    await server.start();
    const connection = `postgresql://postgres:postgres@${server.getServerConn()}/postgres`;
    const client = () => catalogueClientFromSql(postgres(connection, { max: 1, ssl: false, prepare: false, connect_timeout: 5, onnotice() {} }));
    database = client();
    const [{ originalEncoding, correctEncoding }] = await database.query('select jsonb_typeof($1::jsonb) as "originalEncoding", jsonb_typeof($2::jsonb) as "correctEncoding"', [JSON.stringify({ proof: true }), { proof: true }]);
    assert.equal(originalEncoding, "string"); assert.equal(correctEncoding, "object");
    const load = serverModules();
    const operations = load("src/server/catalogue/operations.ts");
    const ddl = readFileSync(new URL("../database/migrations/0001_catalogue.sql", import.meta.url), "utf8");
    const migrations = [{ id: "0001_catalogue", sql: ddl, checksum: createHash("sha256").update(ddl).digest("hex") }];
    assert.equal(await operations.migrateCatalogue(database, migrations), "applied");
    const source = loadCatalogueSource();
    assert.equal(await operations.seedCatalogue(database, source), "imported");
    // Verify persistence after closing and opening the driver connection.
    await database.close(); database = client();
    await operations.verifyCatalogueSchema(database, migrations);
    operations.assertCatalogueEquivalent(source, await operations.readCatalogueSnapshot(database));
    const { createCatalogueReader } = load("src/server/catalogue/reader.ts");
    const reader = createCatalogueReader(database, { ttlMs: 0 });
    const { createArtworkArchiveReader } = load("src/server/catalogue/archiveReader.ts");
    const archiveReader = createArtworkArchiveReader(database, source, { ttlMs: 0 });
    assert.equal((await archiveReader.read()).getArtworks().length, 45);
    const { createArtworkDetailCatalogue } = load("src/server/catalogue/detailCatalogue.ts");
    const persisted = await archiveReader.read();
    assert.equal(load("src/server/catalogue/verifyReadModel.ts").verifyCatalogueReadModel(persisted, source).artworks, 45);
    const detail = createArtworkDetailCatalogue(persisted.getArtworks().reverse(), persisted.getSeries());
    assert.deepEqual([...detail.artworks].sort((a, b) => a.id.localeCompare(b.id)), [...source.artworks].sort((a, b) => a.id.localeCompare(b.id)));
    for (const series of source.series) {
        assert.deepEqual(detail.getArtworksBySeriesId(series.id), source.artworks.filter(work => work.seriesId === series.id));
    }
    const { createArtworkSeriesCatalogue } = load("src/server/catalogue/seriesCatalogue.ts");
    const grouped = createArtworkSeriesCatalogue(persisted.getArtworks().reverse(), persisted.getSeries().reverse());
    assert.deepEqual(grouped.getArtworkSeries(), source.series);
    assert.deepEqual(grouped.getCollections(), load("src/domains/collections/services/getCollections.ts").getCollections());
    const { createHomeCatalogue } = load("src/server/catalogue/homeCatalogue.ts");
    const home = createHomeCatalogue(persisted.getArtworks().reverse(), persisted.getSeries().reverse(), persisted.getHomeCuration());
    const expectedHome = createHomeCatalogue(source.artworks, source.series, source.homeCuration);
    assert.deepEqual(home, expectedHome);
    const { getHomeBookContent } = load("src/domains/home/experience/homeBookContent.ts");
    for (const locale of ["en", "es"]) assert.deepEqual(getHomeBookContent(locale, home), getHomeBookContent(locale, expectedHome));
    const repository = await reader.read();
    assert.equal(repository.getArtworks().length, 45);
    assert.equal(repository.getSeries().length, 4);
    assert.equal(repository.getSeriesById("yasemi").yearStart, 2025);
    assert.deepEqual(repository.getHomeCuration(), source.homeCuration);
    // A real persisted edit must be returned, not replaced by the static JSON.
    await database.query("update catalogue.artwork_translation set description = $1 where artwork_id = $2 and locale = $3", ["Driver read proof", source.artworks[0].id, "es"]);
    assert.equal((await reader.read()).getArtworkById(source.artworks[0].id, "es").description, "Driver read proof");
    const persistedView = (await reader.read()).getArtworkViews(["en", "es"]).find(work => work.id === source.artworks[0].id);
    const { localizeArtwork } = load("src/i18n/artworkCopy.ts");
    const serializedView = JSON.parse(JSON.stringify(persistedView));
    assert.equal(localizeArtwork(serializedView, "es").description, "Driver read proof");
    assert.equal(localizeArtwork(localizeArtwork(serializedView, "en"), "es").description, "Driver read proof");
    await assert.rejects(archiveReader.read(), { code: "catalogue_not_equivalent" });
    await database.query("update catalogue.artwork_translation set description = $1 where artwork_id = $2 and locale = $3", [source.artworkTranslations.find(row => row.artworkId === source.artworks[0].id && row.locale === "es").description ?? null, source.artworks[0].id, "es"]);
    assert.equal((await archiveReader.read()).getArtworks().length, 45);
    // Curation/recognitions read through the actual driver reach the same
    // public predicates used by filters, badges and both book experiences.
    await database.query("update catalogue.home_curation set hero_artwork_id = $1, featured_artwork_id = $2, featured_series_id = $3 where id = $4", ["el_misionero", "captura_de_jesucristo", "the_inner_treasury", "home"]);
    const recognition = source.recognitions[0];
    await database.query("update catalogue.artwork_recognition set kind = $1, title = $2, event = $3, year = $4 where id = $5", ["award", "Driver prize", "Driver event", 2025, recognition.id]);
    const changed = await reader.read(), changedWorks = json(changed.getArtworkViews(["en", "es"]));
    const presentation = load("src/domains/artworks/presentation/getArtworkPresentation.ts");
    assert.equal(presentation.isCoverArtwork(changedWorks.find(work => work.id === "el_misionero")), true);
    assert.equal(presentation.isCoverArtwork(changedWorks.find(work => work.id === source.homeCuration.hero.artworkId)), false);
    assert.equal(presentation.isFeaturedArtwork(changedWorks.find(work => work.id === "captura_de_jesucristo")), true);
    assert.equal(presentation.isFeaturedArtwork(changedWorks.find(work => work.id === "sendero_del_sol")), false);
    assert.equal(presentation.isFeaturedArtworkSeries(json(changed.getSeriesViews(["en", "es"])).find(series => series.id === "the_inner_treasury")), true);
    const badge = presentation.getArtworkPresentation(changedWorks.find(work => work.id === recognition.artworkId), "es").badges.find(badge => badge.id === recognition.id);
    assert.equal(badge.kind, "award"); assert.equal(badge.detail, "Driver prize · Driver event · 2025");
    await database.query("update catalogue.artwork set slug = $1 where id = $2", ["driver-slug-proof", source.artworks[0].id]);
    const { catalogueSitemapPaths } = load("src/server/catalogue/sitemapSource.ts");
    assert.ok(catalogueSitemapPaths(await reader.read()).includes("/artworks/driver-slug-proof"));
    await assert.rejects(archiveReader.read(), { code: "catalogue_not_equivalent" });
    await database.query("update catalogue.artwork set slug = $1 where id = $2", [source.artworks[0].slug, source.artworks[0].id]);
    await database.query("update catalogue.artwork_recognition set kind = $1, title = $2, event = $3, year = $4 where id = $5", [recognition.kind, recognition.title, recognition.event, recognition.year, recognition.id]);
    await database.query("update catalogue.home_curation set hero_artwork_id = $1, featured_artwork_id = $2, featured_series_id = $3 where id = $4", [source.homeCuration.hero.artworkId, source.homeCuration.featuredWork.artworkId, source.homeCuration.featuredCollection.seriesId, "home"]);
    assert.equal((await archiveReader.read()).getArtworks().length, 45);
    await database.execute("alter table catalogue.artwork add column unexpected_fixture text");
    await assert.rejects(archiveReader.read(), { code: "schema_column_mismatch" });
    await database.execute("alter table catalogue.artwork drop column unexpected_fixture");
    assert.equal((await archiveReader.read()).getArtworks().length, 45);
    assert.equal(await operations.seedCatalogue(database, source), "unchanged");
    const [{ rows }] = await database.query("select count(*)::int as rows from catalogue.artwork");
    assert.equal(rows, 45);
});

const json = value => JSON.parse(JSON.stringify(value));

test("constraint diagnostics expose only approved schema object names", () => {
    const error = { schema_name: "catalogue", table_name: "artwork_series", constraint_name: "artwork_series_visuals_check", message: "secret-sentinel", detail: "secret-sentinel", query: "secret-sentinel" };
    assert.equal(safeCatalogueConstraint(error), "catalogue.artwork_series.artwork_series_visuals_check");
    for (const patch of [{ schema_name: "private" }, { table_name: "password" }, { constraint_name: "secret-sentinel" }, { constraint_name: "https://example.test/token" }]) assert.equal(safeCatalogueConstraint({ ...error, ...patch }), undefined);
    assert.ok(!safeCatalogueConstraint(error).includes("secret-sentinel"));
});
