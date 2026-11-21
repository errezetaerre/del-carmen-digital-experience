import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createTranslator } from "next-intl";
import ts from "typescript";
import { serverModules } from "../scripts/lib/loadProjectModule.mjs";

const require = createRequire(import.meta.url);
const load = serverModules();
const experience = load("src/domains/artworks/presentation/artworkExperience.ts");
const archive = load("src/domains/artworks/presentation/artworkArchive.ts");
const services = load("src/domains/artworks/services/index.ts");
const seriesServices = load("src/domains/artworks/series/services.ts");
const artworks = services.getArtworks();
const messages = Object.fromEntries(["en", "es"].map(locale => [locale,
    JSON.parse(readFileSync(new URL("../src/i18n/messages/" + locale + ".json", import.meta.url), "utf8")),
]));
const ids = records => records.map(record => record.id);
const defaultExport = value => ({ __esModule: true, default: value });

// Exercise the real page/components with their data contract. Only framework
// context and heavy visual children are substituted; hooks use real React SSR.
function component(relative, dependencies) {
    const fileName = fileURLToPath(new URL("../" + relative, import.meta.url));
    const code = ts.transpileModule(readFileSync(fileName, "utf8"), {
        fileName, compilerOptions: {
            module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
            jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
        },
    }).outputText;
    const compiled = { exports: {} };
    new Function("require", "module", "exports", code)(name => {
        if (Object.hasOwn(dependencies, name)) return dependencies[name];
        if (name.startsWith("@/") || name.startsWith("."))
            throw new Error("Unspecified page dependency: " + name);
        return require(name);
    }, compiled, compiled.exports);
    return compiled.exports.default;
}

for (const locale of ["en", "es"]) {
    for (const state of archive.artworkArchiveCreationStatuses) {
        test(locale + ": sidebar and mobile drawer render the selected creation state with accurate counts (" + state + ")", () => {
            let shown;
            const ArtworkArchive = component("src/app/[locale]/artworks/ArtworkArchive.tsx", {
                "next/navigation": { useSearchParams: () => new URLSearchParams(state === "completed" ? "" : "creationStatus=" + state) },
                "next-intl": {
                    useLocale: () => locale,
                    useTranslations: namespace => createTranslator({ locale, messages: messages[locale], namespace }),
                },
                "@/i18n/navigation": defaultExport("a"),
                "@/i18n/artworkCopy": load("src/i18n/artworkCopy.ts"),
                "@/domains/artworks/presentation/artworkArchive": archive,
                "@/domains/home/sections/collection/CollectionGallery": defaultExport(props => {
                    shown = props.artworks;
                    return React.createElement("div", { "data-gallery": "true" });
                }),
                "./ArtworkArchive.module.css": defaultExport(new Proxy({}, { get: (_target, key) => String(key) })),
            });
            const html = renderToStaticMarkup(React.createElement(ArtworkArchive, { artworks }));
            assert.match(html, /href="\/artbook(?:\?[^"]*)?"/);
            assert.ok(html.includes("experience=glass"));
            assert.ok(html.includes(messages[locale].ArchiveBook.enter));
            assert.ok(!html.includes("data-gallery-book"));
            const label = messages[locale].Archive.creationStatus;
            const groups = [...html.matchAll(new RegExp('role="group" aria-label="' + label + '">([\\s\\S]*?)</div>', "g"))];
            assert.equal(groups.length, 2, "same control in desktop sidebar and touch drawer");
            const keys = { completed: "completed", "in-progress": "inProgress", planned: "comingSoon" };
            const expected = archive.artworkArchiveCreationStatuses.map(value => [
                String(value === state), messages[locale].Archive[keys[value]],
                String(artworks.filter(work => work.creationStatus === value).length),
            ]);
            for (const group of groups) {
                const options = [...group[1].matchAll(/aria-pressed="(true|false)"[^>]*><span>([^<]+)<\/span><span[^>]*>(\d+)<\/span>/g)];
                assert.deepEqual(options.map(match => match.slice(1)), expected);
            }
            const count = artworks.filter(work => work.creationStatus === state).length;
            if (count) {
                assert.equal(shown.length, Math.min(12, count));
                assert.ok(shown.every(work => work.creationStatus === state));
            } else {
                assert.equal(shown, undefined);
                assert.ok(html.includes(messages[locale].Archive.emptyTitle));
            }
        });
    }
}

for (const locale of ["en", "es"]) {
    test(locale + ": the book index lists the full filtered selection and numbers pages at the chosen density", () => {
        const filters = archive.readArtworkArchiveFilters(artworks, new URLSearchParams("sort=title"));
        const nextIntl = {
            useLocale: () => locale,
            useTranslations: namespace => createTranslator({ locale, messages: messages[locale], namespace }),
        };
        const BookFilterIndex = component("src/domains/artworks/components/archive-book/BookFilterIndex.tsx", {
            "next-intl": nextIntl,
            "@/i18n/artworkCopy": load("src/i18n/artworkCopy.ts"),
            "../../model/artworkDate": load("src/domains/artworks/model/artworkDate.ts"),
            "../../presentation/artworkArchive": archive,
            "@/i18n/navigation": defaultExport(props => React.createElement("a", { href: props.href }, props.children)),
            "../../presentation/artworkExperience": experience,
            "./BookFilterIndex.module.css": defaultExport({}),
        });
        const works = archive.selectArtworkArchive(artworks, filters, locale);
        for (const spread of [true, false]) {
            const html = renderToStaticMarkup(React.createElement(BookFilterIndex, {
                id: "index", artworks, filters, density: 2, spread, onClose() {}, onApply() {},
            }));
            const rows = [...html.matchAll(/<li><a href="([^"]+)"[^>]*><strong>([^<]+)<\/strong><small>([^<]+)/g)];
            assert.equal(rows.length, works.length);
            for (const index of [0, 3, works.length - 1]) {
                assert.equal(rows[index][2], works[index].title);
                const href = new URL(rows[index][1].replaceAll("&amp;", "&"), "https://example.invalid");
                assert.equal(href.pathname, "/artworks/" + works[index].slug);
                assert.equal(href.searchParams.get("sort"), "title");
                assert.equal(href.searchParams.get("experience"), "glass");
                const page = Math.floor(index / (spread ? 4 : 2)) + 1;
                assert.match(rows[index][3], new RegExp(messages[locale].ArchiveBook[spread ? "indexSpread" : "indexPage"].replace("{page}", page) + " · "));
            }
        }
        const empty = renderToStaticMarkup(React.createElement(BookFilterIndex, {
            id: "index", artworks, filters: { ...filters, search: "zzzz-absent" }, density: 2, spread: false, onClose() {}, onApply() {},
        }));
        assert.ok(empty.includes(messages[locale].Archive.empty));
        assert.match(empty, /type="submit"[^>]*disabled/);
    });
}

const pageDependencies = {
    "@/i18n/server": { activateLocale: async params => (await params).locale },
    "@/i18n/messages": { getSiteMessages: locale => messages[locale] },
    "@/domains/artworks/presentation/getArtworkMetadata": { getArtworkMetadata: () => ({}) },
    "@/domains/artworks/model/artworkDate": load("src/domains/artworks/model/artworkDate.ts"),
    "next/navigation": { notFound: () => { throw new Error("Unexpected 404"); } },
    "@/server/catalogue/staticParams": load("src/server/catalogue/staticParams.ts"),
    "@/domains/artworks": { ...services, ...seriesServices },
    "@/server/catalogue/detailSource": { getArtworkDetailCatalogue: async () => ({
        artworks, ...services, ...seriesServices,
    }) },
    "@/domains/artworks/components/ArtworkDetailKineticExperience": defaultExport("kinetic-experience"),
    "@/domains/artworks/components/ArtworkDetailScene": defaultExport("artwork-scene"),
    "@/domains/artworks/presentation/getArtworkPresentation": load("src/domains/artworks/presentation/getArtworkPresentation.ts"),
    "@/domains/artworks/presentation/artworkArchive": archive,
    "@/domains/artworks/presentation/artworkExperience": load("src/domains/artworks/presentation/artworkExperience.ts"),
    "@/domains/artworks/components/portrait-artbook/ArtworkPortraitEntry": defaultExport("portrait-entry"),
};
const page = component("src/app/[locale]/artworks/[slug]/page.tsx", pageDependencies);

test("detail year context preserves mixed-precision date ordering in Standard neighbours and Glass data", async () => {
    const base = artworks[0];
    const records = [
        { ...base, id: "unknown", slug: "unknown-day", title: "A year only", date: "2025" },
        { ...base, id: "early", slug: "early-day", title: "Early", date: "2025-01-02" },
        { ...base, id: "late", slug: "late-day", title: "Late", date: "2025-11-09" },
        { ...base, id: "outside", slug: "other-year", title: "Outside", date: "2026-01-01" },
    ];
    const datedPage = component("src/app/[locale]/artworks/[slug]/page.tsx", {
        ...pageDependencies,
        "@/domains/artworks": {
            ...services, ...seriesServices,
            getArtworks: () => records,
            getArtworkBySlug: slug => records.find(work => work.slug === slug),
        },
        "@/server/catalogue/detailSource": { getArtworkDetailCatalogue: async () => ({
            artworks: records, ...seriesServices,
            getArtworkBySlug: slug => records.find(work => work.slug === slug),
        }) },
    });
    const entry = await datedPage({
        params: Promise.resolve({ locale: "en", slug: "late-day" }),
        searchParams: Promise.resolve({ year: "2025", sort: "oldest" }),
    });
    assert.deepEqual(ids(entry.props.book.artworks), ["early", "late", "unknown"]);
    const standard = entry.props.children.props;
    for (const [href, target] of [[standard.previousHref, "early-day"], [standard.nextHref, "unknown-day"]]) {
        const url = new URL(href, "https://example.invalid");
        assert.equal(url.pathname, "/artworks/" + target);
        assert.equal(url.searchParams.get("year"), "2025");
        assert.equal(url.searchParams.get("sort"), "oldest");
    }
    assert.equal(new URLSearchParams(entry.props.book.navigationQuery).get("year"), "2025");
});

for (const locale of ["en", "es"]) {
    test(locale + ": Coming soon detail preserves its ordered sequence, neighbours and return link in Standard and Glass data", async () => {
        const query = new URLSearchParams("creationStatus=planned&sort=oldest");
        const expected = archive.selectArtworkArchive(artworks, archive.readArtworkArchiveFilters(artworks, query), locale);
        assert.ok(expected.length > 2);
        const index = Math.floor(expected.length / 2);
        const entry = await page({
            params: Promise.resolve({ locale, slug: expected[index].slug }),
            searchParams: Promise.resolve(Object.fromEntries(query)),
        });
        assert.deepEqual(ids(entry.props.book.artworks), ids(expected));
        const standard = entry.props.children.props;
        for (const [href, target] of [[standard.previousHref, expected[index - 1]], [standard.nextHref, expected[index + 1]]]) {
            const url = new URL(href, "https://example.invalid");
            assert.equal(url.pathname, "/artworks/" + target.slug);
            assert.equal(url.searchParams.get("creationStatus"), "planned");
            assert.equal(url.searchParams.get("sort"), "oldest");
            assert.equal(url.searchParams.get("experience"), "standard");
        }
        assert.equal(new URL(standard.backHref, "https://example.invalid").searchParams.get("creationStatus"), "planned");
        assert.equal(new URLSearchParams(entry.props.book.navigationQuery).get("creationStatus"), "planned");
        assert.equal(standard.currentScene.props.artwork.id, expected[index].id);
    });
}

test("Series detail retains full membership when an unrelated creation-state query is present", async () => {
    const series = seriesServices.getArtworkSeriesById("yasemi");
    const members = seriesServices.getArtworksBySeriesId(series.id);
    assert.ok(members.some(work => work.creationStatus === "planned"));
    const entry = await page({
        params: Promise.resolve({ locale: "en", slug: members[0].slug }),
        searchParams: Promise.resolve({ series: series.slug, creationStatus: "planned" }),
    });
    assert.deepEqual(ids(entry.props.book.artworks), ids(members));
    assert.equal(entry.props.book.backHref, "/series/" + series.slug);
    assert.equal(new URLSearchParams(entry.props.book.navigationQuery).has("creationStatus"), false);
});

test("direct planned detail stays accessible and repeated status query values use the safe default", async () => {
    const planned = artworks.find(work => work.creationStatus === "planned");
    const direct = await page({
        params: Promise.resolve({ locale: "en", slug: planned.slug }),
        searchParams: Promise.resolve({}),
    });
    assert.deepEqual(ids(direct.props.book.artworks), [planned.id]);
    assert.equal(direct.props.children.props.currentScene.props.artwork.id, planned.id);
    const completed = artworks.find(work => work.creationStatus === "completed");
    const repeated = await page({
        params: Promise.resolve({ locale: "en", slug: completed.slug }),
        searchParams: Promise.resolve({ creationStatus: ["planned", "in-progress"] }),
    });
    assert.ok(repeated.props.book.artworks.every(work => work.creationStatus === "completed"));
    assert.equal(new URLSearchParams(repeated.props.book.navigationQuery).has("creationStatus"), false);
});

test("return to the gallery keeps filters and the active bookmark; Exit restores the same grid selection", () => {
    const state = "year=2017&sort=title&perPage=1&experience=glass";
    const book = experience.artworkArchiveHref("glass", state, "hugh-jackman");
    assert.equal(book, "/artbook?year=2017&sort=title&perPage=1&artwork=hugh-jackman");
    assert.equal(experience.artworkArchiveHref("standard", book.split("?")[1]), "/artworks?year=2017&sort=title");
});

test("cover, page links and the final imprint in either orientation use the same archive and brand", () => {
    const deps = {
        "next/image": defaultExport(() => null),
        "@/i18n/navigation": defaultExport(props => React.createElement("a", { href: props.href }, props.children)),
        "../../presentation/artworkExperience": experience,
        "@/config/brand": load("src/config/brand.ts"),
        "@/shared/ui/artwork/ArtworkThumbnailMotion.module.css": defaultExport({}),
        "../../model/artworkDate": load("src/domains/artworks/model/artworkDate.ts"),
        "../../presentation/getArtworkPresentation": load("src/domains/artworks/presentation/getArtworkPresentation.ts"),
        "@/i18n/artworkCopy": load("src/i18n/artworkCopy.ts"),
        "@/shared/ui/artwork/ArtworkComingSoon": defaultExport(() => null),
        "@/shared/ui/artwork/useArtworkThumbnailPan": defaultExport(() => {}),
        "../glass-artbook/GlassBookMaterial": defaultExport(() => null),
        "./BookThumbnail": defaultExport(() => null),
        "./GalleryBook.module.css": defaultExport({}),
    };
    for (const locale of ["en", "es"]) {
        const Page = component("src/domains/artworks/components/archive-book/GalleryBookPage.tsx", {
            ...deps, "next-intl": { useLocale: () => locale, useTranslations: namespace => createTranslator({ locale, messages: messages[locale], namespace }) },
        });
        const render = (index, works, perLeaf, spread) => renderToStaticMarkup(React.createElement(Page, {
            index, artworks: works, perLeaf, spread, material: {}, query: "year=2017", onFollow() {}, onStart() {},
        })).replaceAll("<!-- -->", "");
        const copy = messages[locale].Archive;
        const cover = render(0, artworks, 2, true);
        for (const value of [copy.eyebrow, copy.titleFirst, copy.titleSecond, copy.description]) assert.ok(cover.includes(value));
        for (const count of [1, 2, 3, 4, 5, 8]) for (const spread of [false, true]) for (const density of [1, 2]) {
            const works = artworks.slice(0, count);
            const last = Math.ceil(count / (density * (spread ? 2 : 1)));
            const final = render(last, works, density, spread);
            assert.equal((final.match(/by Rõ Visual/g) ?? []).length, 1);
            assert.ok(!final.includes(copy.gallery));
            assert.ok(final.includes("/artworks/" + works.at(-1).slug + "?year=2017&amp;experience=glass"));
            if (last > 1) assert.ok(!render(last - 1, works, density, spread).includes("by Rõ Visual"));
        }
    }
});
