import assert from "node:assert/strict";
import test from "node:test";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";

const { createGalleryTurnQueue } = serverModules()("src/domains/artworks/components/archive-book/galleryBookNavigation.ts");

test("every forward and reverse press is kept while the glass is moving", () => {
    const queue = createGalleryTurnQueue();
    const visits = [];
    let page = 0;
    const start = direction => { visits.push(page + direction); return true; };
    for (const direction of [1, 1, 1, 1, -1, -1]) {
        assert.equal(queue.request(page, 4, direction), true);
        queue.dispatch(page, start);
    }
    assert.deepEqual(visits, [1]);
    while (visits.length && page !== visits.at(-1)) {
        page = visits.at(-1);
        queue.dispatch(page, start);
    }
    assert.deepEqual(visits, [1, 2, 3, 4, 3, 2]);
});

test("decoding, both catalogue limits and direct selection preserve a valid destination", () => {
    const queue = createGalleryTurnQueue();
    assert.equal(queue.request(0, 1, -1), false);
    assert.equal(queue.request(0, 1, 1), true);
    assert.equal(queue.request(0, 1, 1), false);
    queue.dispatch(0, () => false);
    assert.equal(queue.end(0), 1);
    let count = 0;
    queue.dispatch(0, () => { count++; return true; });
    queue.dispatch(0, () => { count++; return true; });
    assert.equal(count, 1);
    queue.clear();
    assert.equal(queue.end(0), 0);
});
