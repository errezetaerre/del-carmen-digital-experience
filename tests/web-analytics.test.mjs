import test from "node:test";
import assert from "node:assert/strict";
import { publicAnalyticsUrl, createAnalyticsFilter } from "../src/shared/analytics/analyticsPrivacy.mjs";

test("only public EN/ES routes can produce a page view", () => {
    for (const path of ["/", "/es", "/es/collections", "/en/artworks", "/series/yasemi", "/series/the_discipline_of_seeing", "/es/series/the_inner_treasury", "/artworks/epifania-nupcial", "/es/journal/inside-the-studio", "/privacy", "/es/terms"])
        assert.equal(publicAnalyticsUrl(`https://rolandodelcarmen.com${path}`), `https://rolandodelcarmen.com${path}`);
    for (const path of ["/api/newsletter/confirm", "/api/newsletter/unsubscribe", "/admin", "/account/invoice/123", "/labs", "/contact/private/123", "/es/account", "/unknown"])
        assert.equal(publicAnalyticsUrl(`https://rolandodelcarmen.com${path}?token=private`), null);
});

test("query strings, hashes and share parameters are removed without changing the public route", () => {
    const url = "https://rolandodelcarmen.com/es/artworks/epifania-nupcial?token=private&email=person%40example.invalid&_vercel_share=private#private";
    assert.equal(publicAnalyticsUrl(url), "https://rolandodelcarmen.com/es/artworks/epifania-nupcial");
    assert.equal(publicAnalyticsUrl("not-a-url"), null);
    assert.equal(publicAnalyticsUrl("https://user:secret@example.invalid/"), null);
    assert.equal(publicAnalyticsUrl("javascript:alert(1)"), null);
});

test("book turns and mode changes do not inflate page views; genuine navigation still counts", () => {
    const filter = createAnalyticsFilter();
    const pageview = url => ({ type: "pageview", url });
    const first = pageview("https://rolandodelcarmen.com/?chapter=cover");
    assert.deepEqual(filter(first), pageview("https://rolandodelcarmen.com/"));
    assert.equal(filter(pageview("https://rolandodelcarmen.com/?chapter=journal&experience=glass")), null);
    assert.equal(first.url, "https://rolandodelcarmen.com/?chapter=cover");
    assert.ok(filter(pageview("https://rolandodelcarmen.com/artworks")));
    assert.ok(filter(pageview("https://rolandodelcarmen.com/?chapter=cover")));
    assert.ok(filter(pageview("https://rolandodelcarmen.com/es")));
    assert.equal(filter({ type: "event", url: "https://rolandodelcarmen.com/" }), null);
    assert.equal(filter(pageview("https://rolandodelcarmen.com/api/newsletter/confirm?token=private")), null);
    assert.ok(createAnalyticsFilter()(pageview("https://rolandodelcarmen.com/")), "a new document owns a new filter");
});
