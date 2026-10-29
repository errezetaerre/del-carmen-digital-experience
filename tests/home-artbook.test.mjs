import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url), ts = require("typescript");
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Evaluate the real TypeScript data/navigation modules; no web or provider calls.
function projectLoader(window, runtime = {}, external = {}) {
    const cache = new Map();
    const context = vm.createContext({ console, URL, Event, window, process, setTimeout, clearTimeout, ...runtime });
    function load(file) {
        if (file.endsWith(".css")) return {};
        const target = [file, `${file}.ts`, `${file}.tsx`, `${file}.json`, path.join(file, "index.ts"), path.join(file, "index.tsx")].find(name => fs.existsSync(name) && fs.statSync(name).isFile());
        if (!target) throw Error(`Module missing: ${path.relative(project, file)}`);
        if (target.endsWith(".json")) return JSON.parse(fs.readFileSync(target, "utf8"));
        if (cache.has(target)) return cache.get(target).exports;
        const loadedModule = { exports: {} }; cache.set(target, loadedModule);
        // The data barrel also re-exports UI. Those unused re-exports are tree-shaken
        // by Next; keep Node's data tests independent of Next's browser router.
        if (target === path.join(project, "src/domains/artworks/index.ts")) {
            loadedModule.exports = { ...load(path.join(project, "src/domains/artworks/services/index.ts")),
                ...load(path.join(project, "src/domains/artworks/series/index.ts")) };
            return loadedModule.exports;
        }
        if (target.endsWith(".mjs")) return require(target);
        const code = ts.transpileModule(fs.readFileSync(target, "utf8"), { compilerOptions: {
            target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
        }, fileName: target }).outputText;
        const localRequire = specifier => Object.hasOwn(external, specifier) ? external[specifier] : specifier.startsWith("@/") ? load(path.join(project, "src", specifier.slice(2))) :
            specifier.startsWith(".") ? load(path.resolve(path.dirname(target), specifier)) : require(specifier);
        vm.runInContext(`(function(require,module,exports){${code}\n})`, context, { filename: target })(localRequire, loadedModule, loadedModule.exports);
        return loadedModule.exports;
    }
    return relative => load(path.join(project, relative));
}
function browser(href) {
    const listeners = new Map(), changes = [];
    return {
        location: { href }, changes,
        history: { replaceState(_state, _unused, next) { this.browser.location.href = new URL(next, this.browser.location.href).href; changes.push(next); } },
        addEventListener(name, listener) { const set = listeners.get(name) ?? new Set(); set.add(listener); listeners.set(name, set); },
        removeEventListener(name, listener) { listeners.get(name)?.delete(listener); },
        dispatchEvent(event) { for (const listener of listeners.get(event.type) ?? []) listener(event); },
        get listenerCount() { return [...listeners.values()].reduce((count, set) => count + set.size, 0); },
    };
}

test("Home content follows the real curation, creation state and public Journal", () => {
    const load = projectLoader();
    const { getHomeBookContent } = load("src/domains/home/experience/homeBookContent.ts");
    const { homeCuration } = load("src/domains/home/curation/homeCuration.ts");
    const content = getHomeBookContent("en");
    assert.equal(content.hero.id, homeCuration.hero.artworkId);
    assert.equal(content.featured.id, homeCuration.featuredWork.artworkId);
    assert.equal(content.collection.series.id, homeCuration.featuredCollection.seriesId);
    assert.deepEqual(Array.from(content.selected, work => work.id), Array.from(homeCuration.selectedWorks));
    assert.equal(content.collection.artworkCount, content.collection.artworks.length);
    assert.deepEqual(Array.from(content.journal, entry => entry.slug), Array.from(load("src/domains/journal/data/journalEntries.ts").getJournalEntries().slice(0, 4), entry => entry.slug));
});

test("Journal has a title spread and a turn per published entry only in landscape", () => {
    const load = projectLoader();
    const { getHomeBookContent } = load("src/domains/home/experience/homeBookContent.ts");
    const { homeBookPages, resolveHomeBookPage } = load("src/domains/home/experience/homeBookChapters.ts");
    for (const locale of ["en", "es"]) {
        const content = getHomeBookContent(locale);
        const portrait = homeBookPages(content.chapters, content.journal, false);
        const spread = Array.from(homeBookPages(content.chapters, content.journal, true));
        assert.deepEqual(Array.from(portrait), Array.from(content.chapters));
        const journalIndex = spread.indexOf("journal");
        assert.deepEqual(spread.slice(journalIndex + 1, journalIndex + 1 + content.journal.length),
            Array.from(content.journal, entry => `journal:${entry.slug}`));
        assert.equal(spread[journalIndex + 1 + content.journal.length], "invitation");
        assert.equal(portrait.at(-1), "credits");
        assert.equal(spread.at(-1), "credits");
        assert.equal(resolveHomeBookPage("credits", portrait), "credits");
        assert.equal(resolveHomeBookPage("credits", spread), "credits");
        assert.equal(resolveHomeBookPage(`journal:${content.journal[0].slug}`, portrait), "journal");
        assert.equal(resolveHomeBookPage("journal:unpublished-entry", spread), "journal");
    }
});

test("The book panorama and the original portrait artwork use independent assets", () => {
    const load = projectLoader();
    const { getHomeBookContent } = load("src/domains/home/experience/homeBookContent.ts");
    const content = getHomeBookContent("en");
    assert.equal(content.collection.landscapeImage.src, "/series/yasemi/yasemi_I_hero_landscape.webp");
    assert.equal(content.collection.portraitImage.src, content.collection.coverArtwork.images.collection.src);
    assert.notEqual(content.collection.landscapeImage.src, content.collection.portraitImage.src);
});

test("A Journal entry URL survives language changes and resolves to the same real entry", () => {
    const window = browser("https://example.invalid/es?campaign=studio&experience=glass"); window.history.browser = window;
    const load = projectLoader(window);
    const location = load("src/domains/home/experience/homeBookLocation.ts");
    const content = load("src/domains/home/experience/homeBookContent.ts").getHomeBookContent("es");
    const key = `journal:${content.journal[0].slug}`;
    location.selectHomeBookChapter(key);
    assert.equal(location.homeBookChapter(), key);
    assert.equal(new URL(window.location.href).searchParams.get("campaign"), "studio");
    assert.equal(new URL(window.location.href).pathname, "/es");
    location.selectHomeBookChapter("credits");
    assert.equal(location.homeBookChapter(), "credits");
    assert.equal(new URL(window.location.href).searchParams.get("campaign"), "studio");
});

function eventHub() {
    const listeners = new Map();
    return {
        addEventListener(name, listener) { const set = listeners.get(name) ?? new Set(); set.add(listener); listeners.set(name, set); },
        removeEventListener(name, listener) { listeners.get(name)?.delete(listener); },
        emit(name, values = {}) {
            const event = { type: name, cancelable: true, defaultPrevented: false,
                preventDefault() { this.defaultPrevented = true; }, stopImmediatePropagation() { this.stopped = true; }, ...values };
            for (const listener of listeners.get(name) ?? []) { listener(event); if (event.stopped) break; }
            return event;
        },
        get listenerCount() { return [...listeners.values()].reduce((sum, set) => sum + set.size, 0); },
    };
}

function motorFixture(home = true) {
    const view = { ...eventHub(), performance, setTimeout, clearTimeout,
        matchMedia: () => ({ ...eventHub(), matches: true }) };
    const doc = { ...eventHub(), defaultView: view, hidden: false, fonts: { status: "loaded" }, querySelectorAll: () => [] };
    const root = { ownerDocument: doc, dataset: {}, hasAttribute: name => name === "data-portrait-learned", ...eventHub() };
    const page = id => ({ dataset: { portraitPage: id }, querySelectorAll: () => [], querySelector: () => null,
        style: { removeProperty() {} }, contains: () => false });
    const frame = { ...eventHub(), ownerDocument: doc, clientWidth: 1000, clientHeight: 700, getBoundingClientRect: () => ({ width: 1000 }) };
    const overlay = { style: { removeProperty() {} }, replaceChildren() {} }, changes = [];
    const load = projectLoader(view, { performance, ResizeObserver: class { observe() {} disconnect() {} } });
    const policy = load("src/domains/home/experience/homeBookGestures.ts");
    const motor = load("src/domains/artworks/components/portrait-artbook/portraitArtbookMotion.ts").createPortraitArtbookMotion({
        root, frame, overlay, current: page("a"), next: page("b"), previous: page("c"),
        pageCache: { ready: () => true }, onLoad() {}, onActivity() {}, onInteraction() {}, onArrival() {}, onExit() {},
        onLand: direction => changes.push(direction), ...(home ? { canStartDrag: policy.homeBookAllowsDrag } : {}),
    });
    const target = { closest: selector => selector.startsWith("a,") ? {} : null };
    return { view, frame, target, changes, motor };
}

test("The real page motor accepts a Home link drag while existing callers keep their policy", () => {
    for (const home of [false, true]) {
        const { view, frame, target, changes, motor } = motorFixture(home);
        frame.emit("pointerdown", { target, button: 0, pointerId: 1, pointerType: "mouse", clientX: 800, clientY: 200 });
        view.emit("pointermove", { target, pointerId: 1, pointerType: "mouse", clientX: 300, clientY: 202 });
        view.emit("pointerup", { target, pointerId: 1, pointerType: "mouse", clientX: 300, clientY: 202 });
        assert.deepEqual(changes, home ? [1] : []);
        motor.dispose();
        assert.equal(frame.listenerCount, 0); assert.equal(view.listenerCount, 0);
    }
});

test("Returning to the previous page uses the same release and link guard", () => {
    const { view, frame, target, changes, motor } = motorFixture();
    frame.emit("pointerdown", { target, button: 0, pointerId: 1, pointerType: "mouse", clientX: 200, clientY: 200 });
    view.emit("pointermove", { target, pointerId: 1, pointerType: "mouse", clientX: 700, clientY: 202 });
    view.emit("pointerup", { target, pointerId: 1, pointerType: "mouse", clientX: 700, clientY: 202 });
    assert.deepEqual(changes, [-1]); motor.dispose();
});

test("Both stationary reflections are painted with visible dimensions and persist throughout either turn", () => {
    // Hidden DOM has zero layout dimensions, just as the browser's overlay does.
    // Run the real non-reduced-motion controller, only controlling its GSAP clock.
    for (const direction of [1, -1]) {
        const view = { ...eventHub(), performance, setTimeout, clearTimeout,
            matchMedia: () => ({ ...eventHub(), matches: false }) };
        let doc;
        class Surface {
            constructor(tag = "div") {
                this.tagName = tag.toUpperCase(); this.dataset = {}; this.children = []; this.attributes = [];
                this.id = ""; this.className = ""; this.hidden = false;
                this.scrollTop = 0; this.scrollLeft = 0; this.ownerDocument = doc;
                this.style = { setProperty(name, value) { this[name] = value; }, removeProperty(name) { delete this[name]; } };
                this.classList = { add: value => { this.className += ` ${value}`; } };
                Object.assign(this, eventHub());
            }
            get clientWidth() { return this.hidden || this.parentElement?.clientWidth === 0 ? 0 : 1000; }
            get clientHeight() { return this.clientWidth ? 700 : 0; }
            get firstElementChild() { return this.children[0] ?? null; }
            getBoundingClientRect() { return { width: this.clientWidth, height: this.clientHeight }; }
            append(child) { child.remove(); this.children.push(child); child.parentElement = this; }
            remove() { if (this.parentElement) this.parentElement.children = this.parentElement.children.filter(node => node !== this); this.parentElement = null; }
            replaceChildren(...children) { for (const child of [...this.children]) child.remove(); for (const child of children) this.append(child); }
            querySelectorAll(selector) {
                const all = this.children.flatMap(child => [child, ...child.querySelectorAll("*")]);
                return selector === "*" ? all : selector === "canvas" ? all.filter(node => node.tagName === "CANVAS") : [];
            }
            querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; }
            closest(selector) { return selector === "[data-portrait-half]" && this.dataset.portraitHalf ? this : this.parentElement?.closest(selector) ?? null; }
            setAttribute(name, value) { this.attributes = this.attributes.filter(item => item.name !== name); this.attributes.push({ name, value }); }
            hasAttribute(name) { return name === "data-portrait-learned" || this.attributes.some(item => item.name === name); }
            cloneNode(deep) {
                const copy = new Surface(this.tagName); copy.dataset = { ...this.dataset }; copy.attributes = this.attributes.map(item => ({ ...item }));
                if (deep) for (const child of this.children) copy.append(child.cloneNode(true));
                return copy;
            }
        }
        doc = { ...eventHub(), defaultView: view, hidden: false, fonts: { status: "loaded" }, querySelectorAll: () => [],
            getSelection: () => ({ removeAllRanges() {} }), createElement: tag => new Surface(tag) };
        const frame = new Surface(), root = new Surface(), overlay = new Surface(); overlay.hidden = true; frame.append(overlay);
        const page = id => { const element = new Surface(); element.dataset.portraitPage = id; element.append(new Surface("canvas")); return element; };
        const current = page("a"), previous = page("c"), next = page("b"), paints = [], tweens = [], landed = [];
        const clock = { __esModule: true, default: { killTweensOf() {}, utils: { clamp: (min, max, value) => Math.max(min, Math.min(max, value)) },
            to(target, settings) { tweens.push({ target, settings }); return { kill() {} }; } } };
        const load = projectLoader(view, { performance, ResizeObserver: class { observe() {} disconnect() {} } }, { gsap: clock });
        const controller = load("src/domains/artworks/components/portrait-artbook/portraitArtbookMotion.ts").createPortraitArtbookMotion({
            root, frame, overlay, current, previous, next, pageCache: { ready: () => true },
            onLoad() {}, onActivity() {}, onInteraction() {}, onArrival() {}, onExit() {}, onLand: value => landed.push(value),
            renderSurface(surface, angle, moving = false) {
                const width = surface.clientWidth;
                paints.push({ half: surface.closest("[data-portrait-half]")?.dataset.portraitHalf, source: surface.dataset.portraitPage,
                    stationary: surface.parentElement?.parentElement === overlay, moving, width, angle });
                if (width) surface.dataset.paintedReflection = "visible";
            },
        });
        controller.navigate(direction);
        const stationary = paints.filter(paint => paint.stationary);
        assert.equal(stationary.length, 2);
        assert.deepEqual(stationary.map(paint => paint.half), ["left", "right"]);
        assert.deepEqual(stationary.map(paint => paint.source), direction === 1 ? ["a", "b"] : ["c", "a"]);
        assert.ok(stationary.every(paint => paint.width > 0), "The fixed reflections must be measured after showing the overlay");
        const fixed = overlay.children.slice(0, 2).map(half => half.firstElementChild);
        const tween = tweens[0];
        for (const progress of [.1, .45, .7, 1]) {
            tween.target.progress = progress; tween.settings.onUpdate();
            assert.ok(fixed.every(surface => surface.dataset.paintedReflection === "visible"));
        }
        tween.settings.onComplete(); assert.deepEqual(landed, [direction]);
        controller.dispose();
    }
});

test("One-finger horizontal swipe reaches the same motor without consuming vertical reading", () => {
    for (const vertical of [false, true]) {
        const { frame, target, changes, motor } = motorFixture();
        const touch = (clientX, clientY) => ({ identifier: 5, clientX, clientY });
        frame.emit("touchstart", { target, touches: [touch(800, 200)] });
        const moved = frame.emit("touchmove", { target, touches: [touch(vertical ? 802 : 300, vertical ? 500 : 202)] });
        frame.emit("touchend", { target, touches: [], changedTouches: [touch(vertical ? 802 : 300, vertical ? 500 : 202)] });
        assert.deepEqual(changes, vertical ? [] : [1]);
        assert.equal(moved.defaultPrevented, !vertical);
        motor.dispose();
    }
});

test("Horizontal trackpad wheel turns once; vertical wheel and pinch retain their native behavior", () => {
    for (const values of [{ deltaX: 90, deltaY: 2 }, { deltaX: 3, deltaY: 90 }, { deltaX: 90, deltaY: 2, ctrlKey: true }]) {
        const { frame, target, changes, motor } = motorFixture();
        const event = frame.emit("wheel", { target, deltaMode: 0, ...values });
        assert.deepEqual(changes, values.deltaX === 90 && !values.ctrlKey ? [1] : []);
        assert.equal(event.defaultPrevented, changes.length > 0);
        motor.dispose();
    }
});

test("Dragging an editorial link cannot accidentally open it, and cleanup removes every guard", () => {
    const view = { ...eventHub(), performance }, frame = { ...eventHub(), ownerDocument: { defaultView: view } };
    const target = { closest: () => null };
    const { bindHomeBookLinkDrag, homeBookAllowsDrag } = projectLoader()("src/domains/home/experience/homeBookGestures.ts");
    const stop = bindHomeBookLinkDrag(frame);
    frame.emit("pointerdown", { target, button: 0, pointerId: 2, clientX: 600, clientY: 200 });
    view.emit("pointermove", { pointerId: 2, clientX: 240, clientY: 201 });
    view.emit("pointerup", { pointerId: 2 });
    assert.equal(frame.emit("click", { target }).defaultPrevented, true);
    frame.emit("pointerdown", { target, button: 0, pointerId: 3, clientX: 600, clientY: 200 });
    view.emit("pointerup", { pointerId: 3 });
    assert.equal(frame.emit("click", { target }).defaultPrevented, false);
    assert.equal(homeBookAllowsDrag({ closest: () => ({ tagName: "INPUT" }) }), false);
    stop(); assert.equal(frame.listenerCount + view.listenerCount, 0);
});
test("Spanish changes editorial copy while keeping work identity and asset paths", () => {
    const { getHomeBookContent } = projectLoader()("src/domains/home/experience/homeBookContent.ts");
    const english = getHomeBookContent("en"), spanish = getHomeBookContent("es");
    assert.equal(spanish.hero.id, english.hero.id);
    assert.equal(spanish.hero.images.primary.src, english.hero.images.primary.src);
    assert.notEqual(spanish.hero.description, english.hero.description);
    assert.equal(spanish.collection.series.id, english.collection.series.id);
    assert.notEqual(spanish.collection.series.description, english.collection.series.description);
    assert.notEqual(spanish.journal[0].title, english.journal[0].title);
});
test("Chapter changes remain local and retain language, filters and hash", () => {
    const window = browser("https://example.invalid/es?campaign=studio&experience=glass#journal"); window.history.browser = window;
    const navigation = projectLoader(window)("src/domains/home/experience/homeBookLocation.ts");
    let notifications = 0;
    const stop = navigation.subscribeHomeBookChapter(() => notifications++);
    navigation.selectHomeBookChapter("featured");
    assert.equal(navigation.homeBookChapter(), "featured");
    assert.equal(new URL(window.location.href).pathname, "/es");
    assert.equal(new URL(window.location.href).searchParams.get("campaign"), "studio");
    assert.equal(new URL(window.location.href).hash, "#journal");
    assert.equal(notifications, 1);
    navigation.clearHomeBookLocation();
    const result = new URL(window.location.href);
    assert.equal(result.searchParams.has("chapter"), false);
    assert.equal(result.searchParams.has("experience"), false);
    assert.equal(result.searchParams.get("campaign"), "studio");
    stop(); assert.equal(window.listenerCount, 0);
});
test("Invalid chapter names safely return to the cover", () => {
    const window = browser("https://example.invalid/?chapter=unknown");
    assert.equal(projectLoader(window)("src/domains/home/experience/homeBookLocation.ts").homeBookChapter(), "cover");
});
test("Portrait phones, portrait tablets and every landscape select distinct compositions", () => {
    let viewport = "phone";
    const window = { matchMedia(query) { return { matches: query === "(orientation: landscape)" ? viewport === "spread" : viewport === "phone" }; } };
    const navigation = projectLoader(window)("src/domains/home/experience/homeBookLocation.ts");
    assert.equal(navigation.homeBookLayout(), "phone");
    viewport = "tablet"; assert.equal(navigation.homeBookLayout(), "portrait");
    viewport = "spread"; assert.equal(navigation.homeBookLayout(), "spread");
});
test("Readiness excludes offscreen gallery images but includes visible images", () => {
    const { visibleHomeBookImages } = projectLoader()("src/domains/home/experience/homeBookContent.ts");
    const rect = (left, top, width, height) => ({ left, top, width, height, right: left + width, bottom: top + height });
    const image = (box, clip) => ({ getBoundingClientRect: () => box, closest: () => clip ? { getBoundingClientRect: () => clip } : null });
    const visible = image(rect(20, 30, 80, 90)), below = image(rect(20, 700, 80, 90)), clipped = image(rect(20, 350, 80, 90), rect(0, 0, 300, 300));
    const page = { getBoundingClientRect: () => rect(0, 0, 400, 600), querySelectorAll: () => [visible, below, clipped] };
    assert.deepEqual(Array.from(visibleHomeBookImages(page)), [visible]);
});

test("Startup preparation respects the saved mode and never writes storage", () => {
    const { HOME_BOOK_BOOTSTRAP } = projectLoader()("src/domains/home/experience/homeBookBootstrap.ts");
    for (const [saved, query, blocked, expected] of [
        [null, "", false, false], ["standard", "?experience=glass", false, false],
        ["glass", "", false, true], [null, "?experience=glass", false, true], [null, "?view=glass", false, true],
        [null, "?experience=glass", true, false],
    ]) {
        let pending = false;
        vm.runInNewContext(HOME_BOOK_BOOTSTRAP, { URL, location: { href: `https://example.invalid/es${query}` },
            localStorage: { getItem() { if (blocked) throw Error("Unavailable"); return saved; }, setItem() { throw Error("Must not write"); } },
            document: { currentScript: { parentElement: { setAttribute(name) { assert.equal(name, "data-home-glass-pending"); pending = true; } } } },
        });
        assert.equal(pending, expected, `Saved=${saved}, query=${query}, blocked=${blocked}`);
    }
});
