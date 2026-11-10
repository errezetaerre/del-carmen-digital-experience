import assert from "node:assert/strict";
import test from "node:test";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";

const load = serverModules();
const { artworkArchiveSorts, defaultArtworkArchiveSort, artworkArchiveCreationStatuses, defaultArtworkArchiveCreationStatus, getArtworkArchiveOptions, matchesArtworkArchive, readArtworkArchiveFilters, selectArtworkArchive, artworkArchiveQuery } = load("src/domains/artworks/presentation/artworkArchive.ts");
const { artworks } = load("src/domains/artworks/data/artworks.ts");
const { homeCuration } = load("src/domains/home/curation/homeCuration.ts");
const base = artworks[0];
const fixture = Object.freeze([
    { id: "d", title: "Zeta", date: "2025" },
    { id: "b", title: "Álfa", date: "2025" },
    { id: "a", title: "alfa", date: "2025" },
    { id: "e", title: "Alfa 10", date: "2024" },
    { id: "c", title: "Alfa 2", date: "2024" },
].map(record => Object.freeze({ ...base, ...record })));

function filters(query = "", records = fixture) {
    return readArtworkArchiveFilters(records, new URLSearchParams(query));
}
const ids = records => records.map(record => record.id);

test("newest replaces archive as the default, including legacy and invalid sort values", () => {
    assert.deepEqual(artworkArchiveSorts, ["newest", "oldest", "title"]);
    assert.equal(defaultArtworkArchiveSort, "newest");
    for (const query of ["", "sort=archive", "sort=unknown", "sort=", "sort=newest"])
        assert.equal(filters(query).sort, "newest");
    for (const sort of ["oldest", "title"])
        assert.equal(filters(`sort=${sort}`).sort, sort);
    assert.equal(artworkArchiveQuery(filters()).has("sort"), false);
});

test("creation status defaults to completed and accepts only the existing artwork lifecycle values", () => {
    assert.deepEqual(artworkArchiveCreationStatuses, ["completed", "in-progress", "planned"]);
    assert.equal(defaultArtworkArchiveCreationStatus, "completed");
    for (const value of ["", "unknown", "ongoing", "upcoming", "draft", "published"])
        assert.equal(filters(`creationStatus=${value}`).creationStatus, "completed");
    for (const value of artworkArchiveCreationStatuses)
        assert.equal(filters(`creationStatus=${value}`).creationStatus, value);
    assert.equal(artworkArchiveQuery(filters()).has("creationStatus"), false);
});

for (const locale of ["en", "es"]) {
    for (const [sort, expected] of [["newest", ["a", "b", "d", "c", "e"]], ["oldest", ["c", "e", "a", "b", "d"]], ["title", ["a", "b", "c", "e", "d"]]]) {
        test(`${locale}: ${sort} uses title and stable ID tie-breakers without mutating records`, () => {
            const before = structuredClone(fixture);
            const selected = selectArtworkArchive(fixture, filters(`sort=${sort}`), locale);
            assert.deepEqual(ids(selected), expected);
            assert.deepEqual(ids(selectArtworkArchive([...fixture].reverse(), filters(`sort=${sort}`), locale)), expected);
            assert.deepEqual(fixture, before);
            assert.notEqual(selected, fixture);
        });
    }
}

test("category, year, medium, title search and Featured still compose", () => {
    const records = [
        { ...base, id: homeCuration.featuredWork.artworkId, title: "Álfa visible", date: "2025", medium: "oil", categories: ["portrait"] },
        { ...base, id: "not-featured", title: "Alfa visible", date: "2025", medium: "oil", categories: ["portrait"] },
        { ...base, id: "wrong-year", title: "Alfa visible", date: "2024", medium: "oil", categories: ["portrait"] },
        { ...base, id: "wrong-medium", title: "Alfa visible", date: "2025", medium: "graphite", categories: ["portrait"] },
        { ...base, id: "wrong-category", title: "Alfa visible", date: "2025", medium: "oil", categories: ["spiritual"] },
    ];
    const selection = filters("category=portrait&year=2025&medium=oil&q=ALFA&featured=true&sort=oldest", records);
    assert.deepEqual(ids(selectArtworkArchive(records, selection, "es")), [homeCuration.featuredWork.artworkId]);
    assert.equal(selectArtworkArchive(records, { ...selection, featured: false }, "es").length, 2);
});

test("selection and navigation round-trip the same ordering and filter context", () => {
    for (const locale of ["en", "es"]) {
        for (const sort of artworkArchiveSorts) {
            const selection = filters(`q=alfa&sort=${sort}`);
            const query = artworkArchiveQuery(selection);
            const detail = readArtworkArchiveFilters(fixture, query);
            assert.deepEqual(detail, selection);
            assert.deepEqual(ids(selectArtworkArchive(fixture, detail, locale)), ids(selectArtworkArchive(fixture, selection, locale)));
            assert.equal(query.get("sort"), sort === "newest" ? null : sort);
        }
    }
    const selection = filters("creationStatus=planned&category=portrait&year=2025&medium=oil&featured=true&q=alfa&sort=title");
    const query = artworkArchiveQuery(selection);
    assert.deepEqual(readArtworkArchiveFilters(fixture, query), selection);
});

test("archive eligibility uses completion status, not year, image availability or sale status", () => {
    const records = [
        { ...base, id: "finished-future", date: "2027", creationStatus: "completed", availability: "sold" },
        { ...base, id: "planned-past", date: "2024", creationStatus: "planned" },
        { ...base, id: "in-progress", date: "2025", creationStatus: "in-progress" },
    ];
    for (const locale of ["en", "es"])
        for (const sort of artworkArchiveSorts)
            for (const [creationStatus, expected] of [["completed", "finished-future"], ["planned", "planned-past"], ["in-progress", "in-progress"]])
                assert.deepEqual(ids(selectArtworkArchive(records, filters(`sort=${sort}&creationStatus=${creationStatus}`, records), locale)), [expected]);
});

test("facet vocabulary preserves selections across creation states; counts and search use the selected state", () => {
    const records = [
        { ...base, id: "finished", title: "Finished", date: "2025", medium: "oil", categories: ["portrait"] },
        { ...base, id: "planned", title: "Coming soon", date: "2027", medium: "charcoal", categories: ["spiritual"], creationStatus: "planned" },
        { ...base, id: "in-progress", title: "In progress", date: "2026", medium: "graphite", categories: ["symbolic"], creationStatus: "in-progress" },
    ];
    assert.deepEqual(getArtworkArchiveOptions(records), { categories: ["portrait", "spiritual", "symbolic"], years: [2027, 2026, 2025], mediums: ["oil", "graphite", "charcoal"] });
    const selection = filters("", records);
    for (const except of [undefined, "category", "year", "medium"])
        assert.deepEqual(ids(records.filter(record => matchesArtworkArchive(record, selection, except))), ["finished"]);
    assert.equal(selectArtworkArchive(records, filters("q=coming", records), "en").length, 0);
    assert.deepEqual(ids(selectArtworkArchive(records, filters("q=coming&creationStatus=planned", records), "en")), ["planned"]);
    const query = "category=spiritual&year=2027&medium=charcoal";
    const completed = filters(query, records);
    const planned = filters(query + "&creationStatus=planned", records);
    assert.deepEqual({ ...completed, creationStatus: "planned" }, planned);
    assert.equal(selectArtworkArchive(records, completed, "en").length, 0);
    assert.deepEqual(ids(selectArtworkArchive(records, planned, "en")), ["planned"]);
});

test("creation-state counts compose with category, year, medium, search and Featured", () => {
    const record = { ...base, title: "Alfa", date: "2025", medium: "oil", categories: ["portrait"] };
    const records = [
        { ...record, id: "finished", creationStatus: "completed" },
        { ...record, id: "progress", creationStatus: "in-progress" },
        { ...record, id: "planned", creationStatus: "planned" },
        { ...record, id: homeCuration.featuredWork.artworkId, creationStatus: "planned" },
        { ...record, id: "wrong-category", creationStatus: "completed", categories: ["spiritual"] },
    ];
    const selection = filters("category=portrait&year=2025&medium=oil&q=alfa&creationStatus=planned", records);
    const candidates = records.filter(record => matchesArtworkArchive(record, selection, "creationStatus"));
    assert.deepEqual(artworkArchiveCreationStatuses.map(state => candidates.filter(record => record.creationStatus === state).length), [1, 1, 2]);
    assert.deepEqual(ids(selectArtworkArchive(records, { ...selection, featured: true }, "en")), [homeCuration.featuredWork.artworkId]);
    assert.deepEqual(ids(records.filter(record => matchesArtworkArchive(record, { ...selection, featured: true }, "creationStatus"))), [homeCuration.featuredWork.artworkId]);
});

test("explicit lifecycle queries survive default-sort serialization and reset without stale state", () => {
    for (const state of artworkArchiveCreationStatuses) {
        const selection = filters(`creationStatus=${state}&sort=oldest&q=alfa`);
        const query = artworkArchiveQuery(selection);
        assert.equal(query.get("creationStatus"), state === "completed" ? null : state);
        assert.deepEqual(readArtworkArchiveFilters(fixture, query), selection);
        const cleared = artworkArchiveQuery({ ...selection, creationStatus: defaultArtworkArchiveCreationStatus });
        assert.equal(cleared.has("creationStatus"), false);
        assert.equal(cleared.get("sort"), "oldest");
        assert.equal(cleared.get("q"), "alfa");
    }
    assert.equal(artworkArchiveQuery(filters()).toString(), "");
});

test("unfinished catalogue records remain accessible in direct detail and Series membership", () => {
    const { getArtworks, getArtworkBySlug } = load("src/domains/artworks/services/index.ts");
    const { getArtworksBySeriesId } = load("src/domains/artworks/series/services.ts");
    const unfinished = artworks.filter(record => record.creationStatus !== "completed");
    assert.ok(unfinished.length > 0);
    assert.equal(getArtworks().length, artworks.length);
    for (const work of unfinished) {
        assert.deepEqual(getArtworkBySlug(work.slug), work);
        assert.ok(getArtworksBySeriesId(work.seriesId).some(record => record.id === work.id));
    }
});

test("the actual catalogue is not rewritten by any order or filter", () => {
    const before = structuredClone(artworks);
    for (const locale of ["en", "es"])
        for (const sort of artworkArchiveSorts)
            for (const state of artworkArchiveCreationStatuses) {
                const selected = selectArtworkArchive(artworks, filters(`sort=${sort}&creationStatus=${state}`, artworks), locale);
                assert.equal(selected.length, artworks.filter(record => record.creationStatus === state).length);
                assert.ok(selected.every(record => record.creationStatus === state));
            }
    assert.deepEqual(artworks, before);
});
