import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";

const load = serverModules();
const location = load("src/domains/artworks/series/components/experience/seriesExperienceLocation.ts");
const artworkLocation = load("src/shared/ui/artwork/artworkViewerLocation.ts");
const { createPortraitPageCache } = load("src/domains/artworks/components/portrait-artbook/portraitPageCache.ts");
const material = load("src/domains/artworks/components/glass-artbook/glassMaterial.mjs");
const { sampleSeriesGlassReflection } = load("src/domains/artworks/series/components/experience/seriesGlassReflection.ts");

function browser(href) {
    const events = new EventTarget(), changes = [];
    let url = new URL(href);
    const previous = globalThis.window;
    const window = Object.assign(events, {
        history: {
            pushState(_state, _title, href) { url = new URL(href, url); changes.push("push"); },
            replaceState(_state, _title, href) { url = new URL(href, url); changes.push("replace"); },
        },
    });
    Object.defineProperty(window, "location", { get: () => url });
    globalThis.window = window;
    return { window, changes, restore() { if (previous === undefined) delete globalThis.window; else globalThis.window = previous; } };
}

test("collection navigation retains locale and campaign query but removes stale artwork selection", () => {
    const b = browser("https://rolandodelcarmen.com/es/series/yasemi?artwork=yasemi-ii&experience=glass&utm_source=gallery#old");
    try {
        location.selectSeries("epifanias", "glass", "es");
        assert.equal(b.window.location.pathname, "/es/series/epifanias");
        assert.equal(b.window.location.searchParams.get("view"), "glass");
        assert.equal(b.window.location.searchParams.get("utm_source"), "gallery");
        assert.equal(b.window.location.searchParams.has("artwork"), false);
        assert.equal(b.window.location.searchParams.has("experience"), false);
        assert.equal(b.window.location.hash, "");
        assert.deepEqual(b.changes, ["push"]);
    } finally { b.restore(); }
});

test("changing collection mode replaces history and English retains its canonical unprefixed URL", () => {
    const b = browser("https://rolandodelcarmen.com/series/yasemi?view=glass");
    try {
        location.selectSeries("yasemi", "standard", "en", false);
        assert.equal(b.window.location.pathname + b.window.location.search, "/series/yasemi?view=standard");
        assert.deepEqual(b.changes, ["replace"]);
        location.selectSeries("yasemi", "standard", "en", false);
        assert.deepEqual(b.changes, ["replace"], "a repeated selection must not add duplicate history entries");
    } finally { b.restore(); }
});

for (const [locale, mode, oldMode] of [["en", "standard", "glass"], ["es", "glass", "standard"]]) {
    test(`Discover inherits ${mode}, keeps ${locale} and returns to the same collection mode`, () => {
        const prefix = locale === "es" ? "/es" : "";
        const b = browser(`https://rolandodelcarmen.com${prefix}/series/yasemi?view=${mode}&experience=${oldMode}&utm_source=collection`);
        try {
            let changes = 0;
            const stop = location.subscribeSeriesExperience(() => changes++);
            location.openSeriesArtwork({ slug: "yasemi-ii" }, mode);
            assert.equal(b.window.location.pathname, `${prefix}/series/yasemi`);
            assert.equal(b.window.location.searchParams.get("view"), mode);
            assert.equal(b.window.location.searchParams.get("experience"), mode, "collection choice overrides a stale viewer mode");
            assert.equal(b.window.location.searchParams.get("artwork"), "yasemi-ii");
            assert.equal(b.window.location.searchParams.get("utm_source"), "collection");
            assert.deepEqual(b.changes, ["push"]);
            assert.equal(changes, 1);

            artworkLocation.selectArtworkInViewer({ slug: "yasemi-iii" }, mode);
            assert.equal(b.window.location.searchParams.get("experience"), mode);
            assert.equal(b.window.location.searchParams.get("artwork"), "yasemi-iii");
            artworkLocation.closeArtworkViewerLocation();
            assert.equal(b.window.location.searchParams.get("view"), mode);
            assert.equal(b.window.location.searchParams.has("artwork"), false);
            assert.equal(b.window.location.searchParams.has("experience"), false);
            assert.equal(b.window.location.searchParams.get("utm_source"), "collection");
            assert.deepEqual(b.changes, ["push", "replace", "replace"]);
            assert.equal(changes, 3);
            stop();
        } finally { b.restore(); }
    });
}

test("collection location subscriptions include artwork events and are completely disposed", () => {
    const b = browser("https://rolandodelcarmen.com/series/yasemi");
    try {
        let count = 0;
        const stop = location.subscribeSeriesExperience(() => count++);
        for (const event of ["popstate", "del-carmen:artwork-viewer-location", "del-carmen:series-experience-location"]) b.window.dispatchEvent(new Event(event));
        assert.equal(count, 3);
        stop();
        for (const event of ["popstate", "del-carmen:artwork-viewer-location", "del-carmen:series-experience-location"]) b.window.dispatchEvent(new Event(event));
        assert.equal(count, 3);
    } finally { b.restore(); }
});

test("book readiness includes the panorama and visible thumbnails, excluding clipped and zero-size images", () => {
    const bounds = { left: 0, top: 0, right: 1200, bottom: 700 };
    const clip = { left: 30, top: 100, right: 550, bottom: 650 };
    const image = (name, box, atmosphere = false) => ({ name,
        closest(selector) { return selector === "[data-series-atmosphere]" ? atmosphere : { getBoundingClientRect: () => clip }; },
        getBoundingClientRect: () => box,
    });
    const panorama = image("panorama", bounds, true);
    const current = image("current", { left: 50, top: 200, right: 300, bottom: 500, width: 250, height: 300 });
    const clipped = image("next group", { left: 620, top: 200, right: 900, bottom: 500, width: 280, height: 300 });
    const below = image("below viewport", { left: 50, top: 800, right: 300, bottom: 1100, width: 250, height: 300 });
    const empty = image("empty", { left: 50, top: 200, right: 50, bottom: 200, width: 0, height: 0 });
    const page = { getBoundingClientRect: () => bounds, querySelectorAll: () => [panorama, current, clipped, below, empty] };
    assert.deepEqual(location.visibleSeriesImages(page).map(image => image.name), ["panorama", "current"]);
});

test("a decoded neighbour remains ready when the same DOM page becomes current", () => {
    const cache = createPortraitPageCache(), page = {};
    const images = [{ src: "/artworks/yasemi_II.webp", currentSrc: "/artworks/yasemi_II.webp", complete: true, naturalWidth: 640, naturalHeight: 800 }];
    const viewport = { width: 700, height: 900, fontsLoaded: true };
    assert.equal(cache.ready(page, images, viewport), false);
    cache.remember(page, images, viewport);
    assert.equal(cache.ready(page, images, viewport), true);
    assert.equal(cache.ready({}, images, viewport), false, "a replacement page must be prepared separately");
    assert.equal(cache.ready(page, images, { ...viewport, height: 700 }), false, "a viewport change invalidates the prepared layout");
    assert.equal(cache.ready(page, [{ ...images[0] }], viewport), false, "a new image DOM node cannot inherit another node's decode");
    images[0].currentSrc = "/_next/image?url=yasemi_II.webp&w=1080&q=75";
    assert.equal(cache.ready(page, images, viewport), false, "a responsive source change requires decoding");
});

test("page readiness rejects incomplete images, loading fonts and an explicit retry", () => {
    const cache = createPortraitPageCache(), page = {};
    const image = { src: "a.webp", complete: true, naturalWidth: 640, naturalHeight: 800 };
    const view = { width: 390, height: 628, fontsLoaded: true };
    cache.remember(page, [image], view);
    image.complete = false;
    assert.equal(cache.ready(page, [image], view), false);
    image.complete = true;
    assert.equal(cache.ready(page, [image], { ...view, fontsLoaded: false }), false);
    assert.equal(cache.ready(page, [image], view), true);
    cache.invalidate(page);
    assert.equal(cache.ready(page, [image], view), false);
});

test("the shared material preserves both approved 11B-23 shaders byte for byte", () => {
    const hash = source => createHash("sha256").update(source).digest("hex");
    assert.equal(hash(material.GLASS_MATERIAL_VERTEX), "10fb8cc5a05da31668df3387970d9a0e39dc8d835405367f1da072ce95843d69");
    assert.equal(hash(material.GLASS_MATERIAL_FRAGMENT), "3d5c5f3e9a83567f3911d1c69eefa76d1b8da9ae3b7f729507336f271712ce90");
});

test("the shared painter keeps the approved optical controls and skips identical frames", () => {
    const uniforms = {}, values = new Map(); let draws = 0, lost = false;
    for (const key of ["uAngle", "uLight", "uStrength", "uCornerStrength", "uArt", "uPalette", "uSide", "uSize", "uPixelRatio", "uRadii"]) uniforms[key] = key;
    const gl = { isContextLost: () => lost, viewport() {}, useProgram() {},
        uniform1f(key, value) { values.set(key, value); }, uniform2f(key, x, y) { values.set(key, [x, y]); },
        drawArrays() { draws++; }, TRIANGLES: 4 };
    const resource = { gl, program: {}, uniforms }, canvas = { width: 0, height: 0 };
    const frame = { width: 610, height: 700, pixelRatio: 2, angle: -18, side: 1 };
    assert.equal(material.paintGlassMaterial(resource, canvas, frame), true);
    assert.equal(values.get("uLight"), 35);
    assert.equal(values.get("uStrength"), .6);
    assert.equal(values.get("uCornerStrength"), .9);
    assert.deepEqual(values.get("uSize"), [1220, 1400]);
    assert.deepEqual(values.get("uRadii"), [13, 1]);
    assert.equal(material.paintGlassMaterial(resource, canvas, frame), true);
    assert.equal(draws, 1);
    material.paintGlassMaterial(resource, canvas, { ...frame, angle: -19 });
    assert.equal(draws, 2);
    lost = true;
    assert.equal(material.paintGlassMaterial(resource, canvas, frame), false);
    assert.equal(draws, 2);
});

test("the no-WebGL reflection stays bounded and catches the information page's negative-angle light", () => {
    const rest = sampleSeriesGlassReflection(.5, .75, 0, 1);
    const catchLight = sampleSeriesGlassReflection(.5, .75, -18, 1);
    assert.ok(catchLight > rest * 2, "rotating into the source must produce a broad specular catch");
    for (const side of [-1, 1]) for (const angle of [-180, -90, -30, 0, 30, 90, 180]) {
        const value = sampleSeriesGlassReflection(.3, .7, angle, side);
        assert.ok(Number.isFinite(value) && value >= 0 && value <= 1);
    }
});
