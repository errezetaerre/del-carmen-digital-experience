import assert from "node:assert/strict";
import test from "node:test";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";

const load = serverModules();
const { assertArtworkDate, compareArtworkDates, getArtworkYear, isArtworkDate } = load("src/domains/artworks/model/artworkDate.ts");
const archive = load("src/domains/artworks/presentation/artworkArchive.ts");
const { artworks } = load("src/domains/artworks/data/artworks.ts");
const { getArtworkPresentation } = load("src/domains/artworks/presentation/getArtworkPresentation.ts");

test("dates accept only year or real calendar day strings, including Gregorian leap-century rules", () => {
    const valid = [
        "0001", "1900", "2000", "2025", "9999",
        "0001-01-01", "9999-12-31", "2025-11-09", "2025-04-30",
        "1900-02-28", "2000-02-29", "2024-02-29", "2100-02-28", "2400-02-29",
    ];
    for (const value of valid) {
        assert.equal(isArtworkDate(value), true, value);
        assert.doesNotThrow(() => assertArtworkDate(value));
    }
    const invalid = [
        undefined, null, 2025, {}, [], new Date(0), "", "202", "20250", "0000", "0000-01-01",
        "2e03", "2025.0", "+2025", "-2025", "2025-11", "2025-1-09", "2025-11-9",
        "2025/11/09", "09-11-2025", "2025-00-10", "2025-13-01", "2025-01-00", "2025-01-32",
        "2025-04-31", "2025-06-31", "2025-09-31", "2025-11-31", "2025-02-29", "2024-02-30",
        "1900-02-29", "2100-02-29", "2025-11-09T00:00:00Z", "2025-11-09Z",
        " 2025", "2025 ", "2025\n", "2025-11-09\n", "2025-11-09\r", "2025-11-09 ",
    ];
    for (const value of invalid) {
        assert.equal(isArtworkDate(value), false, String(value));
        assert.throws(() => assertArtworkDate(value), RangeError);
        assert.throws(() => getArtworkYear(value), RangeError);
    }
});

test("the shared year getter retains both precisions without Date/time-zone normalization", () => {
    assert.equal(getArtworkYear("2025"), 2025);
    assert.equal(getArtworkYear("2025-11-09"), 2025);
    assert.equal(getArtworkYear("0001-01-01"), 1);
    assert.equal(getArtworkYear("9999"), 9999);
    for (const order of ["newest", "oldest"]) {
        assert.equal(compareArtworkDates("2025", "2025", order), 0);
        assert.equal(compareArtworkDates("2025-11-09", "2025-11-09", order), 0);
        assert.ok(compareArtworkDates("2025-01-02", "2025", order) < 0, "exact-date group precedes unknown days in either order");
        assert.ok(compareArtworkDates("2025", "2025-01-02", order) > 0);
        assert.throws(() => compareArtworkDates("2025-02-29", "2024", order), RangeError);
        assert.throws(() => compareArtworkDates("2024", "2025-02-29", order), RangeError);
    }
});

const fixture = Object.freeze([
    { id: "year-alpha-b", title: "Álfa", date: "2025" },
    { id: "day-tie-b", title: "Álfa", date: "2025-06-01" },
    { id: "early", title: "Early", date: "2025-01-02" },
    { id: "year-z", title: "Zeta", date: "2025" },
    { id: "old", title: "Older", date: "2024-12-31" },
    { id: "late", title: "Late", date: "2025-12-31" },
    { id: "day-tie-a", title: "alfa", date: "2025-06-01" },
    { id: "year-alpha-a", title: "alfa", date: "2025" },
    { id: "new", title: "Newer", date: "2026" },
].map(work => Object.freeze({ ...artworks[0], ...work, creationStatus: "completed" })));
const ids = works => works.map(work => work.id);

for (const locale of ["en", "es"]) {
    for (const [sort, expected] of [
        ["newest", ["new", "late", "day-tie-a", "day-tie-b", "early", "year-alpha-a", "year-alpha-b", "year-z", "old"]],
        ["oldest", ["old", "early", "day-tie-a", "day-tie-b", "late", "year-alpha-a", "year-alpha-b", "year-z", "new"]],
        ["title", ["day-tie-a", "day-tie-b", "year-alpha-a", "year-alpha-b", "early", "late", "new", "old", "year-z"]],
    ]) {
        test(locale + ": " + sort + " orders mixed precision with original-title/ID ties and never mutates the catalogue", () => {
            const selection = archive.readArtworkArchiveFilters(fixture, new URLSearchParams("sort=" + sort));
            const before = structuredClone(fixture);
            assert.deepEqual(ids(archive.selectArtworkArchive(fixture, selection, locale)), expected);
            assert.deepEqual(ids(archive.selectArtworkArchive([...fixture].reverse(), selection, locale)), expected);
            assert.deepEqual(fixture, before);
        });
    }
}

test("year filters and URL navigation include every precision in the requested year", () => {
    assert.deepEqual(archive.getArtworkArchiveOptions(fixture).years, [2026, 2025, 2024]);
    const selection = archive.readArtworkArchiveFilters(fixture, new URLSearchParams("year=2025&sort=oldest"));
    const selected = archive.selectArtworkArchive(fixture, selection, "en");
    assert.equal(selected.length, 7);
    assert.ok(selected.every(work => getArtworkYear(work.date) === 2025));
    assert.ok(selected.some(work => work.date === "2025"));
    assert.ok(selected.some(work => work.date.length === 10));
    const query = archive.artworkArchiveQuery(selection);
    assert.equal(query.get("year"), "2025");
    assert.deepEqual(archive.readArtworkArchiveFilters(fixture, query), selection);
});

test("creation state remains independent of a precise artistic or anticipated date", () => {
    for (const locale of ["en", "es"]) {
        for (const creationStatus of ["completed", "planned", "in-progress"]) {
            const record = { ...artworks[0], date: "2025-11-09", creationStatus };
            const yearOnly = getArtworkPresentation({ ...record, date: "2025" }, locale);
            assert.deepEqual(getArtworkPresentation(record, locale), yearOnly);
            assert.equal(record.creationStatus, creationStatus);
        }
    }
    assert.equal(getArtworkPresentation({ ...artworks[0], date: "2099-12-31", creationStatus: "completed" }).yearLabel, "2099");
});

test("the live catalogue contains only validated date strings and no persisted Artwork.year", () => {
    for (const artwork of artworks) {
        assert.equal(isArtworkDate(artwork.date), true, artwork.id);
        assert.equal(Object.hasOwn(artwork, "year"), false, artwork.id);
        assert.equal(typeof getArtworkYear(artwork.date), "number");
    }
});
