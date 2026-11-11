import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createTranslator } from "next-intl";
import ts from "typescript";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";
import { loadCatalogueSource } from "../scripts/lib/catalogueSource.mjs";

const require = createRequire(import.meta.url), load = serverModules(), source = loadCatalogueSource();
const { createCatalogueRepository } = load("src/server/catalogue/reader.ts");
const presentation = load("src/domains/artworks/presentation/getArtworkPresentation.ts");
const { getSiteMessages } = load("src/i18n/messages.ts");
const { localizeArtwork } = load("src/i18n/artworkCopy.ts");
const { localizeArtworkSeries } = load("src/i18n/seriesCopy.ts");
const { catalogueToRows } = load("src/server/catalogue/rows.ts");
const archive = load("src/domains/artworks/presentation/artworkArchive.ts");
const { createHomeCatalogue } = load("src/server/catalogue/homeCatalogue.ts");
const { createArtworkSeriesCatalogue } = load("src/server/catalogue/seriesCatalogue.ts");
const { getHomeBookContent } = load("src/domains/home/experience/homeBookContent.ts");
const ids = records => records.map(item => item.id);
const json = value => JSON.parse(JSON.stringify(value));
const views = snapshot => {
    const repository = createCatalogueRepository(snapshot);
    return { repository, artworks: repository.getArtworkViews(["en", "es"]), series: repository.getSeriesViews(["en", "es"]) };
};
const badgeKinds = work => presentation.getArtworkPresentation(work).badges.map(badge => badge.kind);

function editedCuration() {
    const edited = structuredClone(source);
    edited.homeCuration.hero.artworkId = "el_misionero";
    edited.homeCuration.featuredWork.artworkId = "captura_de_jesucristo";
    edited.homeCuration.featuredCollection.seriesId = "the_inner_treasury";
    return edited;
}

function renderBadge(path, props, locale) {
    const code = ts.transpileModule(readFileSync(path, "utf8"), { fileName: path, compilerOptions: {
        module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    } }).outputText;
    const compiled = { exports: {} };
    new Function("require", "module", "exports", code)(name => {
        if (name === "next-intl") return { useLocale: () => locale, useTranslations: namespace => createTranslator({ locale, messages: getSiteMessages(locale), namespace }) };
        if (name.endsWith(".module.css")) return { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
        if (name === "@/domains/artworks/presentation/getArtworkPresentation") return presentation;
        if (name.endsWith("artworkHaloSymbols")) return load("src/shared/ui/artwork/artworkHaloSymbols.ts");
        return require(name);
    }, compiled, compiled.exports);
    return renderToStaticMarkup(React.createElement(compiled.exports.default, props));
}

test("all approved EN/ES badges, labels and curatorial roles equal the existing catalogue presentation", () => {
    const { artworks, series } = views(source);
    for (const locale of ["en", "es"]) {
        for (const work of artworks) {
            const original = source.artworks.find(item => item.id === work.id);
            assert.deepEqual(presentation.getArtworkPresentation(work, locale), presentation.getArtworkPresentation(original, locale));
            assert.equal(presentation.isCoverArtwork(work), presentation.isCoverArtwork(original));
            assert.equal(presentation.isFeaturedArtwork(work), presentation.isFeaturedArtwork(original));
        }
        for (const item of series) assert.equal(presentation.isFeaturedArtworkSeries(item), presentation.isFeaturedArtworkSeries(item.id));
    }
});

test("supplied curation drives cover, Featured filters, Home selection and published Series without stale file roles", () => {
    const edited = editedCuration(), { repository, artworks, series } = views(edited);
    assert.equal(presentation.isCoverArtwork(artworks.find(item => item.id === "el_misionero")), true);
    assert.equal(presentation.isCoverArtwork(artworks.find(item => item.id === "epifania_nupcial")), false);
    assert.equal(presentation.isFeaturedArtwork(artworks.find(item => item.id === "captura_de_jesucristo")), true);
    assert.equal(presentation.isFeaturedArtwork(artworks.find(item => item.id === "sendero_del_sol")), false);
    assert.equal(presentation.isFeaturedArtworkSeries(series.find(item => item.id === "yasemi")), false);
    assert.equal(presentation.isFeaturedArtworkSeries(series.find(item => item.id === "the_inner_treasury")), true);
    for (const locale of ["en", "es"]) for (const sort of archive.artworkArchiveSorts) {
        const filters = archive.readArtworkArchiveFilters(artworks, new URLSearchParams({ featured: "true", sort }));
        assert.deepEqual(ids(archive.selectArtworkArchive(artworks, filters, locale)), ["captura_de_jesucristo"]);
    }
    const home = createHomeCatalogue(artworks, series, repository.getHomeCuration());
    assert.equal(presentation.isCoverArtwork(home.hero), true); assert.equal(presentation.isFeaturedArtwork(home.featured), true);
    assert.equal(presentation.isFeaturedArtworkSeries(home.collection.series), true);
    for (const locale of ["en", "es"]) {
        const book = json(getHomeBookContent(locale, home));
        assert.equal(presentation.isCoverArtwork(book.hero), true);
        assert.equal(presentation.isFeaturedArtwork(book.featured), true);
        assert.equal(presentation.isFeaturedArtworkSeries(book.collection.series), true);
    }
});

test("empty or reassigned database recognition history is authoritative and cannot resurrect a file award", () => {
    const edited = structuredClone(source);
    edited.recognitions = [];
    const without = views(edited).artworks.find(item => item.id === "sendero_del_sol");
    assert.ok(!badgeKinds(without).includes("honourable-mention"));
    assert.ok(badgeKinds(without).includes("featured"));
    edited.recognitions = [{ ...source.recognitions[0], artworkId: "el_misionero" }];
    const moved = views(edited).artworks;
    assert.ok(badgeKinds(moved.find(item => item.id === "el_misionero")).includes("honourable-mention"));
    assert.ok(!badgeKinds(moved.find(item => item.id === "sendero_del_sol")).includes("honourable-mention"));
});

test("changed recognition kind/title/event/year reach badges and the EN/ES adapter never masks a changed event", () => {
    const edited = structuredClone(source);
    Object.assign(edited.recognitions[0], { kind: "award", title: "Catalogue prize", event: "Catalogue event", year: 2025 });
    const work = views(edited).artworks.find(item => item.id === edited.recognitions[0].artworkId);
    for (const locale of ["en", "es"]) {
        const badge = presentation.getArtworkPresentation(json(work), locale).badges.find(item => item.id === edited.recognitions[0].id);
        assert.equal(badge.kind, "award");
        assert.equal(badge.label, getSiteMessages(locale).Artwork.award);
        assert.equal(badge.detail, "Catalogue prize · Catalogue event · 2025");
    }
    edited.recognitions.push({ id: "second-fixture", artworkId: work.id, kind: "selection", title: "Official Selection", event: "New original event", year: 2024 });
    const badge = presentation.getArtworkPresentation(views(edited).artworks.find(item => item.id === work.id), "es").badges.at(-1);
    assert.equal(badge.detail, "New original event · 2024");
});

test("actual cover/Featured Series components consume supplied records in Home and Collections without changed markup", () => {
    const { artworks, series } = views(editedCuration());
    for (const locale of ["en", "es"]) {
        const coverPath = "src/domains/home/sections/hero/CoverArtworkBadge.tsx";
        const featuredPath = "src/shared/ui/artwork/FeaturedSeriesBadge.tsx";
        const cover = renderBadge(coverPath, { artwork: json(localizeArtwork(artworks.find(item => item.id === "el_misionero"), locale)) }, locale);
        assert.match(cover, /data-cover-artwork="el_misionero"/); assert.ok(cover.includes(getSiteMessages(locale).Artwork.cover));
        assert.equal(renderBadge(coverPath, { artwork: artworks.find(item => item.id === "epifania_nupcial") }, locale), "");
        const featured = renderBadge(featuredPath, { series: json(localizeArtworkSeries(series.find(item => item.id === "the_inner_treasury"), locale)) }, locale);
        assert.match(featured, /data-featured-series="the_inner_treasury"/); assert.ok(featured.includes(getSiteMessages(locale).Artwork.featuredCollection));
        assert.equal(renderBadge(featuredPath, { series: series.find(item => item.id === "yasemi") }, locale), "");
    }
});

test("serialized/localized page projections preserve roles, history and state without mutating the snapshot or persisting flags", () => {
    const edited = editedCuration(), before = structuredClone(edited), { repository, artworks, series } = views(edited);
    const grouped = createArtworkSeriesCatalogue(artworks, series);
    const home = createHomeCatalogue(artworks, series, repository.getHomeCuration());
    for (const locale of ["en", "es"]) {
        for (const item of json(grouped.getArtworkSeries())) assert.equal(presentation.isFeaturedArtworkSeries(localizeArtworkSeries(item, locale)), item.id === edited.homeCuration.featuredCollection.seriesId);
        for (const item of json(grouped.getArtworksBySeriesId("epifanias"))) assert.deepEqual(presentation.getArtworkPresentation(localizeArtwork(item, locale), locale), presentation.getArtworkPresentation(item, locale));
        assert.equal(presentation.isCoverArtwork(json(home.hero)), true);
    }
    assert.deepEqual(edited, before);
    artworks[0].cataloguePresentation.recognitions.push({ id: "consumer edit" });
    assert.deepEqual(repository.getRecognitions(), source.recognitions);
    assert.ok(!repository.getArtworkViews(["en"])[0].cataloguePresentation.recognitions.some(item => item.id === "consumer edit"));
    const work = { ...repository.getArtworkViews(["en"])[0] }; delete work.catalogueEditorial;
    assert.throws(() => catalogueToRows({ ...source, artworks: [work, ...source.artworks.slice(1)] }), { code: "unmapped_catalogue_attribute" });
    const item = { ...series[0] }; delete item.catalogueEditorial;
    assert.throws(() => catalogueToRows({ ...source, series: [item, ...source.series.slice(1)] }), { code: "unmapped_catalogue_attribute" });
    assert.deepEqual(Object.keys(work.cataloguePresentation).sort(), ["cover", "featured", "kind", "recognitions"]);
    assert.deepEqual(repository.getArtworks(), source.artworks); assert.deepEqual(repository.getSeries(), source.series);
});

test("malformed or cross-artwork presentation metadata fails instead of silently returning static roles/history", () => {
    const { artworks, series } = views(source), work = artworks[0], item = series[0];
    for (const context of [null, {}, { ...work.cataloguePresentation, kind: "series" }, { ...work.cataloguePresentation, featured: "true" }, { ...work.cataloguePresentation, recognitions: [{ artworkId: "other" }] }]) {
        assert.throws(() => presentation.getArtworkPresentation({ ...work, cataloguePresentation: context }), /invalid_catalogue_presentation/);
    }
    for (const context of [null, {}, { kind: "artwork", featured: true }, { kind: "series", featured: "true" }]) assert.throws(() => presentation.isFeaturedArtworkSeries({ ...item, cataloguePresentation: context }), /invalid_catalogue_presentation/);
});
