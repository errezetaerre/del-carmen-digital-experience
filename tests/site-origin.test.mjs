import assert from "node:assert/strict";
import test from "node:test";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";

const official = "https://rolandodelcarmen.com";

function configured(values, check) {
    const keys = ["SITE_URL", "NODE_ENV", "VERCEL_ENV"];
    const original = Object.fromEntries(keys.map(key => [key, process.env[key]]));
    try {
        for (const key of keys) {
            if (values[key] === undefined) delete process.env[key];
            else process.env[key] = values[key];
        }
        return check(serverModules());
    } finally {
        for (const key of keys) {
            if (original[key] === undefined) delete process.env[key];
            else process.env[key] = original[key];
        }
    }
}

test("production canonical, social URLs, robots and sitemap share the approved fallback", () => {
    configured({ NODE_ENV: "production", VERCEL_ENV: "production" }, load => {
        const metadata = load("src/shared/lib/metadata.ts").createPageMetadata({ pathname: "/contact?view=glass#form", locale: "en" });
        assert.equal(metadata.alternates.canonical, `${official}/contact`);
        assert.equal(metadata.openGraph.url, `${official}/contact`);
        assert.equal(metadata.robots.index, true);
        const robots = load("src/app/robots.ts").default();
        assert.equal(robots.sitemap, `${official}/sitemap.xml`);
        const entries = load("src/app/sitemap.ts").default();
        assert.ok(entries.length > 0);
        for (const entry of entries) {
            assert.equal(new URL(entry.url).origin, official);
            assert.ok(!/[?#]/.test(entry.url));
            assert.ok(!/\/(?:privacy|terms)$/.test(entry.url));
        }
    });
});

test("an explicit approved SITE_URL consistently overrides the shared fallback", () => {
    configured({ NODE_ENV: "production", VERCEL_ENV: "production", SITE_URL: "https://studio.example.invalid/" }, load => {
        const seo = load("src/shared/lib/seo.ts");
        assert.equal(seo.publicPageUrl("/artworks/work?experience=glass", "en"), "https://studio.example.invalid/artworks/work");
        assert.equal(load("src/app/robots.ts").default().sitemap, "https://studio.example.invalid/sitemap.xml");
    });
});

test("Preview and local development remain non-indexable on the new public domain", () => {
    for (const environment of [{ NODE_ENV: "production", VERCEL_ENV: "preview" }, { NODE_ENV: "development" }]) {
        configured({ ...environment, SITE_URL: official }, load => {
            const metadata = load("src/shared/lib/metadata.ts").createPageMetadata({ pathname: "/contact", locale: "en" });
            assert.equal(metadata.alternates.canonical, `${official}/contact`);
            assert.equal(metadata.robots.index, false);
            assert.equal(metadata.robots.follow, false);
            assert.deepEqual(load("src/app/sitemap.ts").default(), []);
            assert.deepEqual(load("src/app/robots.ts").default(), { rules: { userAgent: "*", disallow: "/" } });
        });
    }
});

test("domain migration preserves the existing Spanish and draft-legal indexing gates", () => {
    configured({ NODE_ENV: "production", VERCEL_ENV: "production", SITE_URL: official }, load => {
        const seo = load("src/shared/lib/seo.ts");
        assert.equal(seo.publicPageUrl("/contact", "es"), `${official}/es/contact`);
        assert.equal(seo.isIndexablePage("/contact", "es"), false);
        assert.equal(seo.isIndexablePage("/privacy", "en"), false);
        assert.equal(seo.isIndexablePage("/terms", "en"), false);
        assert.equal(seo.pageLanguageAlternates("/contact"), undefined);
    });
});
