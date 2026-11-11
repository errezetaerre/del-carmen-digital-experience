import assert from "node:assert/strict";
import test from "node:test";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";
import { loadCatalogueSource } from "../scripts/lib/catalogueSource.mjs";

const load = serverModules(), source = loadCatalogueSource();
const { createCatalogueRepository } = load("src/server/catalogue/reader.ts");
const { localizeArtwork, artworkTextLocale } = load("src/i18n/artworkCopy.ts");
const { localizeArtworkSeries, seriesTextLocale } = load("src/i18n/seriesCopy.ts");
const { getArtworkMetadata } = load("src/domains/artworks/presentation/getArtworkMetadata.ts");
const { catalogueToRows } = load("src/server/catalogue/rows.ts");
const { createArtworkDetailCatalogue } = load("src/server/catalogue/detailCatalogue.ts");
const { createArtworkSeriesCatalogue } = load("src/server/catalogue/seriesCatalogue.ts");
const { createHomeCatalogue } = load("src/server/catalogue/homeCatalogue.ts");
const { getHomeBookContent } = load("src/domains/home/experience/homeBookContent.ts");
const repository = createCatalogueRepository(source);
const locales = ["en", "es"];
function domain(record) { const facts = { ...record }; delete facts.catalogueEditorial; delete facts.cataloguePresentation; return facts; }

test("editorial read DTOs preserve every approved EN/ES value, original title, date, state and media fact", () => {
    const works = repository.getArtworkViews(locales), series = repository.getSeriesViews(locales);
    for (const locale of locales) {
        for (const record of works) {
            const original = source.artworks.find(work => work.id === record.id);
            const translated = localizeArtwork(record, locale);
            assert.deepEqual(domain(translated), localizeArtwork(original, locale));
            assert.deepEqual(getArtworkMetadata(record, locale), getArtworkMetadata(original, locale));
            assert.equal(artworkTextLocale(record, locale), artworkTextLocale(original, locale));
            assert.equal(translated.title, original.title); assert.equal(translated.date, original.date);
            assert.equal(translated.creationStatus, original.creationStatus); assert.equal(translated.availability, original.availability);
        }
        for (const record of series) {
            const original = source.series.find(item => item.id === record.id);
            assert.deepEqual(domain(localizeArtworkSeries(record, locale)), localizeArtworkSeries(original, locale));
            assert.equal(seriesTextLocale(record, locale), seriesTextLocale(original, locale));
        }
    }
});

test("database editorial edits reach existing UI helpers without being replaced by static Spanish copy", () => {
    const edited = structuredClone(source), id = source.artworks[0].id, seriesId = "yasemi";
    const copy = edited.artworkTranslations.find(item => item.artworkId === id && item.locale === "es");
    copy.description = "Descripción guardada en PostgreSQL"; copy.quote = "Cita de la base";
    copy.images = { ...copy.images, primary: "Alternativa de la base" };
    const seriesCopy = edited.seriesTranslations.find(item => item.seriesId === seriesId && item.locale === "es");
    seriesCopy.description = "Descripción de serie desde PostgreSQL"; seriesCopy.statement = "Statement desde PostgreSQL";
    seriesCopy.mediaAlts = { ...seriesCopy.mediaAlts, "hero.media.desktop.alt": "Panorama de la base", "hero.media.mobile.alt": "Retrato de la base", "images.featured.alt": "Destacada de la base" };
    const repo = createCatalogueRepository(edited);
    const work = JSON.parse(JSON.stringify(repo.getArtworkViews(locales).find(record => record.id === id)));
    const series = JSON.parse(JSON.stringify(repo.getSeriesViews(locales).find(record => record.id === seriesId)));
    assert.equal(localizeArtwork(work, "es").description, copy.description);
    assert.equal(localizeArtwork(work, "es").quote, copy.quote);
    assert.equal(localizeArtwork(work, "es").images.primary.alt, copy.images.primary);
    assert.equal(localizeArtworkSeries(series, "es").description, seriesCopy.description);
    assert.equal(localizeArtworkSeries(series, "es").statement, seriesCopy.statement);
    assert.equal(localizeArtworkSeries(series, "es").hero.media.desktop.alt, "Panorama de la base");
    assert.equal(localizeArtworkSeries(series, "es").hero.media.mobile.alt, "Retrato de la base");
    assert.equal(localizeArtworkSeries(series, "es").images.featured.alt, "Destacada de la base");
    for (let i = 0; i < 3; i++) {
        assert.deepEqual(domain(localizeArtwork(localizeArtwork(work, "es"), "en")), repo.getArtworkById(id));
        assert.deepEqual(domain(localizeArtworkSeries(localizeArtworkSeries(series, "es"), "en")), repo.getSeriesById(seriesId));
    }
});

test("missing database translations fall back to the supplied English record, never an unrelated static Spanish entry", () => {
    const edited = structuredClone(source), id = source.artworks[0].id, seriesId = "yasemi";
    edited.artworkTranslations = edited.artworkTranslations.filter(item => item.artworkId !== id);
    edited.seriesTranslations = edited.seriesTranslations.filter(item => item.seriesId !== seriesId);
    const repo = createCatalogueRepository(edited);
    const work = repo.getArtworkViews(locales).find(record => record.id === id);
    const series = repo.getSeriesViews(locales).find(record => record.id === seriesId);
    assert.deepEqual(domain(localizeArtwork(work, "es")), repo.getArtworkById(id)); assert.equal(artworkTextLocale(work, "es"), "en");
    assert.deepEqual(domain(localizeArtworkSeries(series, "es")), repo.getSeriesById(seriesId)); assert.equal(seriesTextLocale(series, "es"), "en");
});

test("another locale is selectable without a schema change, while DTOs include only requested locales and English fallback", () => {
    const edited = structuredClone(source), id = source.artworks[0].id;
    edited.artworkTranslations.push({ artworkId: id, locale: "fr", description: "Texte français" });
    edited.seriesTranslations.push({ seriesId: "yasemi", locale: "fr", description: "Série française" });
    const repo = createCatalogueRepository(edited);
    const work = repo.getArtworkViews(["fr"]).find(record => record.id === id);
    const series = repo.getSeriesViews(["fr"]).find(record => record.id === "yasemi");
    assert.deepEqual(Object.keys(work.catalogueEditorial.copies), ["en", "fr"]);
    assert.equal(localizeArtwork(work, "fr").description, "Texte français"); assert.equal(artworkTextLocale(work, "fr"), "fr");
    assert.equal(localizeArtworkSeries(series, "fr").description, "Série française");
    assert.equal(localizeArtwork(work, "fr").title, source.artworks[0].title);
    assert.ok(!Object.hasOwn(repo.getArtworkViews(locales).find(record => record.id === id).catalogueEditorial.copies, "fr"));
});

test("video posters, optional video alternative and atmosphere copy survive language reversal", () => {
    const edited = structuredClone(source), item = edited.series[0];
    item.hero = { media: { type: "video", desktopSrc: "/film.mp4", posterDesktop: { src: "/poster.webp", alt: "English poster" }, posterMobile: { src: "/portrait.webp", alt: "English portrait poster" } } };
    const copy = edited.seriesTranslations.find(row => row.seriesId === item.id && row.locale === "es");
    copy.mediaAlts = { "hero.media.alt": "Vídeo", "hero.media.posterDesktop.alt": "Cartel", "hero.media.posterMobile.alt": "Cartel vertical", "atmosphere.alt": "Atmósfera" };
    const repo = createCatalogueRepository(edited), view = repo.getSeriesViews(locales).find(row => row.id === item.id);
    const spanish = localizeArtworkSeries(view, "es");
    assert.deepEqual(domain(spanish), repo.getSeriesById(item.id, "es"));
    assert.deepEqual(domain(localizeArtworkSeries(spanish, "en")), item);
    assert.equal(localizeArtworkSeries(spanish, "en").hero.media.alt, undefined);
});

test("editorial DTOs are detached public data and cannot silently become canonical import fields", () => {
    const works = repository.getArtworkViews(locales), series = repository.getSeriesViews(locales);
    const before = structuredClone(works[0]);
    localizeArtwork(works[0], "es"); assert.deepEqual(works[0], before);
    works[0].catalogueEditorial.copies.es.description = "Consumer edit";
    assert.notEqual(repository.getArtworkViews(locales)[0].catalogueEditorial.copies.es.description, "Consumer edit");
    assert.deepEqual(repository.getArtworks(), source.artworks);
    assert.throws(() => catalogueToRows({ ...source, artworks: works }), { code: "unmapped_catalogue_attribute" });
    assert.throws(() => catalogueToRows({ ...source, series }), { code: "unmapped_catalogue_attribute" });
    for (const work of works) {
        assert.deepEqual(Object.keys(work.catalogueEditorial).sort(), ["copies", "kind"]);
        for (const copy of Object.values(work.catalogueEditorial.copies)) assert.ok(Object.keys(copy).every(key => ["description", "quote", "imageAlts"].includes(key)));
    }
});

test("corrupt read metadata is rejected instead of silently substituting file translations", () => {
    const work = repository.getArtworkViews(locales)[0], series = repository.getSeriesViews(locales)[0];
    work.catalogueEditorial = { kind: "artwork", copies: {} };
    series.catalogueEditorial = { kind: "artwork", copies: { en: {} } };
    assert.throws(() => localizeArtwork(work, "es"), /invalid_catalogue_editorial/);
    assert.throws(() => localizeArtworkSeries(series, "es"), /invalid_catalogue_editorial/);
});

test("detail, Series/Collections and Home book projections retain supplied editorial DTOs through JSON and both languages", () => {
    const works = JSON.parse(JSON.stringify(repository.getArtworkViews(locales))).reverse();
    const series = JSON.parse(JSON.stringify(repository.getSeriesViews(locales))).reverse();
    const detail = createArtworkDetailCatalogue(works, series);
    const grouped = createArtworkSeriesCatalogue(works, series);
    const home = createHomeCatalogue(works, series, repository.getHomeCuration());
    const original = createHomeCatalogue(source.artworks, source.series, source.homeCuration);
    for (const locale of locales) {
        for (const work of detail.artworks) assert.deepEqual(domain(localizeArtwork(work, locale)), repository.getArtworkById(work.id, locale));
        for (const entry of grouped.getCollections()) {
            assert.deepEqual(domain(localizeArtworkSeries(entry.series, locale)), repository.getSeriesById(entry.series.id, locale));
            for (const work of entry.artworks) assert.deepEqual(domain(localizeArtwork(work, locale)), repository.getArtworkById(work.id, locale));
        }
        const book = getHomeBookContent(locale, home), expected = getHomeBookContent(locale, original);
        assert.deepEqual(domain(book.hero), expected.hero); assert.deepEqual(domain(book.featured), expected.featured);
        assert.deepEqual(book.selected.map(domain), expected.selected);
        assert.deepEqual(domain(book.collection.series), expected.collection.series);
        assert.deepEqual(book.chapters, expected.chapters); assert.deepEqual(book.journal, expected.journal);
    }
});
