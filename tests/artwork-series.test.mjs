import assert from "node:assert/strict";
import test from "node:test";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";

const load = serverModules();
const { artworkSeries } = load("src/domains/artworks/series/artworkSeries.ts");
const services = load("src/domains/artworks/series/services.ts");
const { localizeArtworkSeries, formatSeriesStatus } = load("src/i18n/seriesCopy.ts");

test("the four current series remain published and individually addressable", () => {
    assert.deepEqual(artworkSeries.map(series => series.id), ["yasemi", "epifanias", "the_inner_treasury", "the_discipline_of_seeing"]);
    assert.deepEqual(services.getArtworkSeries(), artworkSeries);
    for (const series of artworkSeries) {
        assert.equal(series.publicationStatus, "published");
        assert.ok(["upcoming", "ongoing", "completed"].includes(series.artisticStatus));
        assert.equal(Object.hasOwn(series, "status"), false);
        assert.equal(services.getArtworkSeriesById(series.id), series);
        assert.equal(services.getArtworkSeriesBySlug(series.slug), series);
    }
    assert.equal(services.getArtworkSeriesById("missing"), undefined);
    assert.equal(services.getArtworkSeriesBySlug("missing"), undefined);
});

test("the owner's Yasemi correction remains ongoing from 2025 without an end year", () => {
    const yasemi = services.getArtworkSeriesById("yasemi");
    assert.equal(yasemi.artisticStatus, "ongoing");
    assert.equal(yasemi.yearStart, 2025);
    assert.equal(Object.hasOwn(yasemi, "yearEnd"), false);
});

test("public selectors use publication status independently of artistic status and chronology", () => {
    const records = Object.freeze(["draft", "published", "archived"].flatMap(publicationStatus =>
        ["upcoming", "ongoing", "completed"].map(artisticStatus => Object.freeze({
            ...artworkSeries[0], id: `${publicationStatus}-${artisticStatus}`, slug: `${publicationStatus}-${artisticStatus}`,
            publicationStatus, artisticStatus, yearStart: 2000, yearEnd: 2001,
        }))));
    const members = Object.freeze([{ id: "member", seriesId: "published-ongoing" }, { id: "unrelated", seriesId: "other" }]);
    const read = serverModules(new Map([
        ["./artworkSeries", { artworkSeries: records }],
        ["@/domains/artworks/data/artworks", { artworks: members }],
    ]))("src/domains/artworks/series/services.ts");
    assert.deepEqual(read.getArtworkSeries().map(series => series.id), ["published-upcoming", "published-ongoing", "published-completed"]);
    for (const record of records) {
        const expected = record.publicationStatus === "published" ? record : undefined;
        assert.equal(read.getArtworkSeriesById(record.id), expected);
        assert.equal(read.getArtworkSeriesBySlug(record.slug), expected);
    }
    assert.deepEqual(read.getArtworksBySeriesId("published-ongoing"), [members[0]]);
    assert.equal(records.length, 9, "public selection must not remove canonical records");
});

test("EN/ES localization preserves both states, years, references and the source record", () => {
    for (const series of artworkSeries) {
        const before = structuredClone(series);
        assert.equal(localizeArtworkSeries(series, "en"), series);
        const translated = localizeArtworkSeries(series, "es");
        for (const field of ["id", "slug", "title", "artisticStatus", "publicationStatus", "yearStart", "yearEnd", "coverArtworkId", "atmosphere"])
            assert.deepEqual(translated[field], series[field], `${series.id}: ${field}`);
        if (series.hero?.media.type === "image") {
            for (const variant of ["desktop", "mobile"])
                for (const field of ["src", "width", "height"])
                    assert.equal(translated.hero.media[variant][field], series.hero.media[variant][field]);
        }
        assert.deepEqual(series, before);
    }
});

test("public labels describe the artistic lifecycle in both languages", () => {
    for (const [status, en, es] of [["upcoming", "upcoming", "próxima"], ["ongoing", "ongoing", "en curso"], ["completed", "completed", "completada"]]) {
        assert.equal(formatSeriesStatus(status, "en"), en);
        assert.equal(formatSeriesStatus(status, "es"), es);
    }
});
