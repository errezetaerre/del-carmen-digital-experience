import assert from "node:assert/strict";
import test from "node:test";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";

function browser(href, stored, blocked = false) {
    const previous = globalThis.window;
    const values = new Map(stored ? [["del-carmen:artwork-experience", stored]] : []);
    const events = new EventTarget();
    const window = Object.assign(events, { location: new URL(href), localStorage: {
        getItem(key) { if (blocked) throw Error("Blocked"); return values.get(key) ?? null; },
        setItem(key, value) { if (blocked) throw Error("Blocked"); values.set(key, value); },
    } });
    globalThis.window = window;
    const fresh = () => serverModules()("src/shared/ui/artwork/artworkExperiencePreference.ts");
    return { window, values, fresh, restore() { if (previous === undefined) delete globalThis.window; else globalThis.window = previous; } };
}

test("Standard is the default across locale and orientation-independent routes", () => {
    for (const path of ["/", "/es/series/yasemi", "/artworks/yasemi-ii"]) {
        const b = browser(`https://rolandodelcarmen.com${path}`);
        try { assert.equal(b.fresh().artworkExperiencePreference(), "standard"); } finally { b.restore(); }
    }
});

test("a first explicit Glass deep link is accepted in a fresh browser", () => {
    for (const path of ["/series/yasemi?view=glass", "/es/artworks/yasemi-ii?experience=glass"]) {
        const b = browser(`https://rolandodelcarmen.com${path}`);
        try { assert.equal(b.fresh().artworkExperiencePreference(), "glass"); } finally { b.restore(); }
    }
});

test("Glass survives route, language, reload and stale Standard URL parameters", () => {
    const b = browser("https://rolandodelcarmen.com/series/yasemi");
    try {
        const store = b.fresh();
        store.setArtworkExperiencePreference("glass");
        b.window.location = new URL("https://rolandodelcarmen.com/es/artworks/yasemi-ii?experience=standard&series=yasemi");
        assert.equal(store.artworkExperiencePreference(), "glass");
        assert.equal(b.fresh().artworkExperiencePreference(), "glass", "a fresh document reads the persisted choice");
        assert.equal(b.values.size, 1, "only the presentation choice is stored");
    } finally { b.restore(); }
});

test("Exit resets the global preference even if an old Glass URL is restored", () => {
    const b = browser("https://rolandodelcarmen.com/es/series/yasemi?view=glass", "glass");
    try {
        const store = b.fresh();
        store.setArtworkExperiencePreference("standard");
        assert.equal(store.artworkExperiencePreference(), "standard");
        assert.equal(b.fresh().artworkExperiencePreference(), "standard");
    } finally { b.restore(); }
});

test("denied browser storage keeps navigation functional in memory", () => {
    const b = browser("https://rolandodelcarmen.com/artworks/yasemi-ii", null, true);
    try {
        const store = b.fresh();
        assert.equal(store.artworkExperiencePreference(), "standard");
        store.setArtworkExperiencePreference("glass");
        assert.equal(store.artworkExperiencePreference(), "glass");
        store.setArtworkExperiencePreference("standard");
        assert.equal(store.artworkExperiencePreference(), "standard");
    } finally { b.restore(); }
});

test("same-document changes and other-tab changes notify subscribers; cleanup removes both", () => {
    const b = browser("https://rolandodelcarmen.com/series/yasemi");
    try {
        const store = b.fresh(); let calls = 0;
        const stop = store.subscribeArtworkExperiencePreference(() => calls++);
        store.setArtworkExperiencePreference("glass");
        assert.equal(calls, 1);
        const unrelated = Object.assign(new Event("storage"), { key: "another-setting", newValue: "standard" });
        b.window.dispatchEvent(unrelated);
        assert.equal(calls, 1);
        const changed = Object.assign(new Event("storage"), { key: store.ARTWORK_EXPERIENCE_KEY, newValue: "standard" });
        b.window.dispatchEvent(changed);
        assert.equal(calls, 2); assert.equal(store.artworkExperiencePreference(), "standard");
        stop(); store.setArtworkExperiencePreference("glass"); b.window.dispatchEvent(changed);
        assert.equal(calls, 2);
    } finally { b.restore(); }
});

test("server rendering has no cross-request browser preference", () => {
    assert.equal(serverModules()("src/shared/ui/artwork/artworkExperiencePreference.ts").artworkExperiencePreference(), "standard");
});

test("synchronizing a collection preference keeps its open artwork, locale, filters and hash", () => {
    const b = browser("https://rolandodelcarmen.com/es/series/yasemi?artwork=yasemi-ii&experience=glass&utm_source=collection#focus", "glass");
    let changes = 0;
    b.window.history = { replaceState(_state, _title, href) { b.window.location = new URL(href, b.window.location); changes++; } };
    try {
        const location = serverModules()("src/domains/artworks/series/components/experience/seriesExperienceLocation.ts");
        location.synchronizeSeriesView("glass");
        assert.equal(b.window.location.pathname, "/es/series/yasemi");
        assert.equal(b.window.location.searchParams.get("view"), "glass");
        assert.equal(b.window.location.searchParams.get("artwork"), "yasemi-ii");
        assert.equal(b.window.location.searchParams.get("experience"), "glass");
        assert.equal(b.window.location.searchParams.get("utm_source"), "collection");
        assert.equal(b.window.location.hash, "#focus");
        location.synchronizeSeriesView("glass"); assert.equal(changes, 1);
        location.synchronizeSeriesView("standard");
        assert.equal(b.window.location.searchParams.get("artwork"), "yasemi-ii", "Exit changes presentation without closing the viewer");
    } finally { b.restore(); }
});
