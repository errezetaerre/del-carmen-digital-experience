import assert from "node:assert/strict";
import test from "node:test";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";

const { bindArtworkDockPointer } = serverModules()("src/domains/artworks/components/archive-book/artworkBookDockPointer.ts");

function dock({ reduced = false, fine = true } = {}) {
    const view = new EventTarget(), doc = new EventTarget(), rail = new EventTarget();
    const frames = new Map();
    let time = 0, id = 0;
    view.requestAnimationFrame = callback => { frames.set(++id, callback); return id; };
    view.cancelAnimationFrame = token => frames.delete(token);
    view.matchMedia = query => Object.assign(new EventTarget(), { matches: query.includes("reduced-motion") ? reduced : fine });
    doc.defaultView = view;
    Object.assign(rail, { ownerDocument: doc, dataset: {}, clientHeight: 400, scrollHeight: 1800, scrollTop: 0,
        getBoundingClientRect: () => ({ top: 0, bottom: 400, height: 400 }) });
    const slots = Array.from({ length: 10 }, (_, index) => {
        const values = new Map();
        return { values, style: { setProperty: (key, value) => values.set(key, value), removeProperty: key => values.delete(key) },
            getBoundingClientRect: () => ({ top: index * 180 - rail.scrollTop, height: 180 }) };
    });
    rail.querySelectorAll = () => slots;
    const dispose = bindArtworkDockPointer(rail);
    function advance(count = 1) {
        for (let n = 0; n < count; n++) {
            time += 16;
            const next = [...frames.values()];
            frames.clear();
            next.forEach(callback => callback(time));
        }
    }
    function move(y, type = "mouse", x = 32) {
        rail.dispatchEvent(Object.assign(new Event("pointermove"), { pointerType: type, clientX: x, clientY: y, buttons: 0 }));
    }
    return { rail, view, frames, slots, advance, move, dispose };
}

test("a stationary pointer at either end reveals more thumbnails and stops at the catalogue limits", () => {
    const { rail, frames, advance, move, dispose } = dock();
    move(386); advance(30);
    const halfway = rail.scrollTop;
    assert.ok(halfway > 0);
    advance(30);
    assert.ok(rail.scrollTop > halfway);
    advance(300);
    assert.equal(rail.scrollTop, 1400);
    assert.equal(frames.size, 0);
    move(14); advance(30);
    assert.ok(rail.scrollTop < 1400);
    advance(300);
    assert.equal(rail.scrollTop, 0);
    assert.equal(frames.size, 0);
    dispose();
});

test("the middle, native input, loss of focus and unmount release hover scrolling", () => {
    const { rail, view, frames, slots, advance, move, dispose } = dock();
    move(390); advance(20); move(200); advance();
    const stopped = rail.scrollTop;
    advance(50);
    assert.equal(rail.scrollTop, stopped);
    assert.equal(frames.size, 0);
    for (const [target, name] of [[rail, "pointercancel"], [rail, "focusout"], [rail, "pointerleave"], [rail, "pointerdown"], [view, "blur"]]) {
        move(390); advance(4); target.dispatchEvent(new Event(name));
        const y = rail.scrollTop;
        advance(10);
        assert.equal(rail.scrollTop, y);
        assert.ok(slots.every(slot => !slot.values.size));
    }
    move(390); dispose(); move(390);
    assert.equal(frames.size, 0);
});

test("touch keeps native scrolling and reduced motion slows explicit hover travel without magnification", () => {
    for (const fine of [true, false]) {
        const fixture = dock({ fine });
        fixture.move(397, fine ? "touch" : "mouse"); fixture.advance(45);
        assert.equal(fixture.rail.scrollTop, 0);
        fixture.dispose();
    }
    const standard = dock(), reduced = dock({ reduced: true });
    for (const fixture of [standard, reduced]) { fixture.move(395); fixture.advance(30); }
    assert.ok(reduced.rail.scrollTop > 0 && reduced.rail.scrollTop < standard.rail.scrollTop);
    assert.ok(reduced.slots.every(slot => !slot.values.size));
    assert.ok(standard.slots.some(slot => slot.values.size));
    standard.dispose(); reduced.dispose();
});

test("crossing the centre of a magnified thumbnail moves its neighbours continuously", () => {
    const { slots, move, advance, dispose } = dock();
    const card = slots[1];
    const lift = y => {
        move(y); advance();
        return Number.parseFloat(card.values.get("--lift"));
    };
    const before = lift(269), center = lift(270), after = lift(271);
    assert.equal(center, 0);
    assert.ok(before > 0 && after < 0 && Math.abs(before - after) < 3);
    assert.ok(Number(card.values.get("--wave")) > .999);
    assert.ok(Number.parseFloat(slots[2].values.get("--lift")) > 8);
    dispose();
});

test("trackpad and inertial scroll move the peak under a stationary pointer without competing with the wheel", () => {
    const { rail, slots, advance, move, dispose } = dock();
    move(270); advance();
    assert.equal(slots[1].values.get("--wave"), "1.000");
    rail.dispatchEvent(Object.assign(new Event("wheel", { cancelable: true }), { clientX: 32, clientY: 270 }));
    for (let i = 1; i <= 4; i++) {
        rail.scrollTop = i * 180;
        rail.dispatchEvent(new Event("scroll"));
        advance(4);
        assert.equal(slots[i + 1].values.get("--wave"), "1.000");
        assert.equal(rail.scrollTop, i * 180);
    }
    move(390); advance(5);
    rail.dispatchEvent(Object.assign(new Event("wheel"), { clientY: 390 }));
    const top = rail.scrollTop;
    advance(30);
    assert.equal(rail.scrollTop, top, "edge autoscroll yields to the trackpad");
    assert.ok(slots.some(slot => Number(slot.values.get("--wave")) > .8));
    dispose();
});

test("the magnified edge retains the wheel target through gaps until the pointer leaves or moves", () => {
    const { rail, move, advance, dispose } = dock();
    move(200, "mouse", 96);
    rail.dispatchEvent(Object.assign(new Event("wheel"), { clientX: 96, clientY: 200 }));
    rail.scrollTop = 140;
    rail.dispatchEvent(new Event("scroll")); advance();
    move(200, "mouse", 96);
    assert.equal(rail.dataset.wheel, "");
    move(200, "mouse", 98);
    assert.equal(rail.dataset.wheel, undefined);
    rail.dispatchEvent(Object.assign(new Event("wheel"), { clientX: 98, clientY: 200 }));
    rail.dispatchEvent(new Event("pointerleave"));
    assert.equal(rail.dataset.wheel, undefined);
    dispose();
});
