import assert from "node:assert/strict";
import test from "node:test";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";

function hub() {
    const listeners = new Map();
    return {
        addEventListener(name, callback) {
            const callbacks = listeners.get(name) ?? new Set();
            callbacks.add(callback); listeners.set(name, callbacks);
        },
        removeEventListener(name, callback) { listeners.get(name)?.delete(callback); },
        emit(name, values = {}) {
            const event = { type: name, defaultPrevented: false, ...values,
                preventDefault() { this.defaultPrevented = true; } };
            for (const callback of listeners.get(name) ?? []) callback(event);
            return event;
        },
        get listenerCount() { return [...listeners.values()].reduce((sum, callbacks) => sum + callbacks.size, 0); },
    };
}

function fixture({ fine = true, reduced = false, naturalWidth = 400, naturalHeight = 200, position = "", visibilityObserver = true } = {}) {
    const timelines = [], tweens = [], observers = [], timers = new Map();
    class Motion {
        constructor(options) { this.options = options; this.steps = []; this.state = "paused"; }
        to(target, options) { this.steps.push({ target, options }); return this; }
        play() { this.state = "playing"; return this; }
        pause() { this.state = "paused"; return this; }
        kill() { this.state = "killed"; return this; }
        finish() { this.options.onComplete?.(); }
    }
    const gsap = {
        timeline(options) { const motion = new Motion(options); timelines.push(motion); return motion; },
        to(_target, options) { const motion = new Motion(options); tweens.push(motion); return motion; },
    };
    const load = serverModules(new Map([["gsap", { __esModule: true, default: gsap }]]));
    const controller = load("src/shared/ui/artwork/artworkThumbnailPan.ts");
    const media = { fine: Object.assign(hub(), { matches: fine }), reduced: Object.assign(hub(), { matches: reduced }) };
    const style = new Map([["transform", "scale(1.035)"]]);
    if (position) style.set("object-position", position);
    const image = Object.assign(hub(), {
        complete: true, clientWidth: 200, clientHeight: 250, naturalWidth, naturalHeight,
        style: {
            getPropertyValue: name => style.get(name) ?? "",
            getPropertyPriority: () => "",
            setProperty: (name, value) => style.set(name, value),
            removeProperty: name => style.delete(name),
        },
    });
    let blocked = false, nextTimer = 0;
    const doc = Object.assign(hub(), { hidden: false, activeElement: null });
    class Observer {
        constructor(callback) { this.callback = callback; this.disconnected = false; observers.push(this); }
        observe() {}
        disconnect() { this.disconnected = true; }
    }
    const view = Object.assign(hub(), {
        matchMedia: query => query.includes("reduced-motion") ? media.reduced : media.fine,
        getComputedStyle: () => ({ objectFit: "cover", objectPosition: style.get("object-position") ?? "50% 50%" }),
        IntersectionObserver: visibilityObserver ? class extends Observer {
            constructor(callback) { super(callback); this.kind = "intersection"; }
        } : undefined,
        ResizeObserver: class extends Observer { constructor(callback) { super(callback); this.kind = "resize"; } },
        MutationObserver: class extends Observer { constructor(callback) { super(callback); this.kind = "ancestry"; } },
        setTimeout(callback) { const id = ++nextTimer; timers.set(id, callback); return id; },
        clearTimeout(id) { timers.delete(id); },
    });
    doc.defaultView = view;
    const child = {}, root = Object.assign(hub(), {
        ownerDocument: doc, parentElement: null, querySelector: () => image,
        matches: () => false, contains: node => node === child, closest: () => blocked ? {} : null,
    });
    const stop = controller.bindArtworkThumbnailPan(root);
    return {
        ...controller, root, doc, image, view, media, style, timelines, tweens, observers, stop, child,
        visible(ratio = 1) { observers.find(observer => observer.kind === "intersection")?.callback([{ target: image, isIntersecting: ratio > 0, intersectionRatio: ratio }]); },
        block(value) { blocked = value; observers.find(observer => observer.kind === "ancestry").callback([]); },
        resize() {
            observers.find(observer => observer.kind === "resize").callback([]);
            for (const [id, callback] of [...timers]) { timers.delete(id); callback(); }
        },
    };
}

test("cover geometry detects horizontal/vertical crop and preserves the other focal coordinate", () => {
    const { getArtworkThumbnailPanPlan } = fixture();
    const wide = getArtworkThumbnailPanPlan({ width: 200, height: 250, naturalWidth: 400, naturalHeight: 200 }, "35% 60%");
    assert.equal(wide.axis, "x");
    assert.equal(wide.overflow, 300);
    assert.equal(wide.far, "100% 60%");
    assert.equal(wide.near, "0% 60%");
    const tall = getArtworkThumbnailPanPlan({ width: 200, height: 250, naturalWidth: 100, naturalHeight: 400 }, "35% 60%");
    assert.equal(tall.axis, "y");
    assert.equal(tall.overflow, 550);
    assert.equal(tall.far, "35% 100%");
    assert.equal(tall.near, "35% 0%");
    for (const dimensions of [
        { width: 200, height: 250, naturalWidth: 800, naturalHeight: 1000 },
        { width: 0, height: 250, naturalWidth: 400, naturalHeight: 200 },
        { width: 200, height: 250, naturalWidth: 0, naturalHeight: 0 },
    ]) assert.equal(getArtworkThumbnailPanPlan(dimensions), null);
});

test("desktop starts on hover only while visible and returns to the approved crop on leave", () => {
    const f = fixture();
    f.root.emit("pointerenter", { pointerType: "mouse" });
    assert.equal(f.timelines.length, 0);
    f.visible();
    assert.equal(f.timelines.length, 1);
    assert.equal(f.timelines[0].state, "playing");
    f.style.set("object-position", "72% 50%");
    f.root.emit("pointerleave");
    assert.equal(f.timelines[0].state, "paused");
    assert.equal(f.tweens[0].options.objectPosition, "50% 50%");
    f.tweens[0].finish();
    assert.equal(f.style.has("object-position"), false);
    assert.equal(f.style.get("transform"), "scale(1.035)");
    f.stop();
});

test("touch starts automatically in view, pauses offscreen/background and resumes the same pan", () => {
    const f = fixture({ fine: false });
    f.visible();
    assert.equal(f.timelines.length, 1);
    f.visible(.1);
    assert.equal(f.timelines[0].state, "paused");
    f.visible();
    assert.equal(f.timelines.length, 1);
    assert.equal(f.timelines[0].state, "playing");
    f.doc.hidden = true; f.doc.emit("visibilitychange");
    assert.equal(f.timelines[0].state, "paused");
    f.doc.hidden = false; f.doc.emit("visibilitychange");
    assert.equal(f.timelines[0].state, "playing");
    assert.equal(f.root.emit("pointerdown").defaultPrevented, false);
    assert.equal(f.root.emit("wheel").defaultPrevented, false);
    f.stop();
});

test("keyboard focus activates the pan and focus changes inside the card do not stop it", () => {
    const f = fixture();
    f.visible(); f.root.emit("focusin");
    assert.equal(f.timelines[0].state, "playing");
    f.root.emit("focusout", { relatedTarget: f.child });
    assert.equal(f.timelines[0].state, "playing");
    f.root.emit("focusout", { relatedTarget: null });
    assert.equal(f.timelines[0].state, "paused");
    assert.equal(f.tweens.length, 1);
    f.stop();
});

test("moving/inert book pages retain their exact inline crop for cloned leaves", () => {
    const f = fixture({ fine: false });
    f.visible();
    f.style.set("object-position", "72% 50%");
    f.block(true);
    assert.equal(f.timelines[0].state, "paused");
    assert.equal(f.style.get("object-position"), "72% 50%");
    f.block(false);
    assert.equal(f.timelines.length, 1);
    assert.equal(f.timelines[0].state, "playing");
    assert.equal(f.style.get("object-position"), "72% 50%");
    f.stop();
});

test("reduced motion, an uncropped image and missing visibility support stay static", () => {
    for (const options of [
        { reduced: true, fine: false },
        { naturalWidth: 800, naturalHeight: 1000, fine: false },
        { visibilityObserver: false, fine: false },
        { naturalWidth: 0, naturalHeight: 0, fine: false },
    ]) {
        const f = fixture(options);
        f.visible(); f.root.emit("pointerenter", { pointerType: "mouse" });
        assert.equal(f.timelines.length, 0);
        f.stop();
    }
    const f = fixture({ fine: false });
    f.visible();
    f.media.reduced.matches = true; f.media.reduced.emit("change");
    assert.equal(f.timelines[0].state, "killed");
    assert.equal(f.style.has("object-position"), false);
    f.stop();
});

test("resize recalculates the crop axis and cleanup restores only the image property it owns", () => {
    const f = fixture({ fine: false, position: "35% 60%" });
    f.visible();
    assert.equal(f.timelines[0].steps[0].options.objectPosition, "100% 60%");
    f.image.naturalWidth = 100; f.image.naturalHeight = 400; f.resize();
    assert.equal(f.timelines[0].state, "killed");
    assert.equal(f.timelines[1].steps[0].options.objectPosition, "35% 100%");
    f.stop();
    assert.ok(f.observers.every(observer => observer.disconnected));
    assert.equal(f.style.get("object-position"), "35% 60%");
    assert.equal(f.style.get("transform"), "scale(1.035)");
    assert.equal([f.root, f.doc, f.image, f.media.fine, f.media.reduced].reduce((sum, target) => sum + target.listenerCount, 0), 0);
});
