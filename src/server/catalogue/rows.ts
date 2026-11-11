import "server-only";
import type { Artwork, ArtworkImages } from "@/domains/artworks/model/artwork";
import type { ArtworkSeries } from "@/domains/artworks/series/types";
import type { ArtworkRecognition } from "@/domains/artworks/model/artworkRecognition";
import { assertArtworkDate } from "@/domains/artworks/model/artworkDate";
import { assertCatalogueSnapshot, requireCatalogue, setMediaAlt, type CatalogueSnapshot } from "./snapshot";

// Identifiers/columns come exclusively from this allowlist, never from inputs.
export const catalogueTables = {
    locale: ["code"],
    artwork_series: ["id", "slug", "title", "artistic_status", "publication_status", "year_start", "year_end", "cover_artwork_id", "visuals"],
    artwork: ["id", "slug", "title", "date", "creation_status", "authorship", "context", "medium", "support", "series_id", "dimension_width", "dimension_height", "dimension_unit", "availability", "price_amount", "price_currency"],
    category: ["id"],
    artwork_category: ["artwork_id", "category_id", "ordinal"],
    artwork_image: ["artwork_id", "role", "src", "width", "height"],
    artwork_translation: ["artwork_id", "locale", "quote", "description", "image_alts"],
    series_translation: ["series_id", "locale", "description", "statement", "media_alts"],
    artwork_recognition: ["id", "artwork_id", "kind", "title", "event", "year"],
    home_curation: ["id", "hero_artwork_id", "featured_artwork_id", "featured_series_id"],
    home_selected_artwork: ["artwork_id", "ordinal"],
} as const;
export type CatalogueTable = keyof typeof catalogueTables;
export type CatalogueRow = Record<string, unknown>;
export type CatalogueRows = Record<CatalogueTable, CatalogueRow[]>;
export function emptyCatalogueRows(): CatalogueRows {
    return { locale: [], artwork_series: [], artwork: [], category: [], artwork_category: [], artwork_image: [], artwork_translation: [], series_translation: [], artwork_recognition: [], home_curation: [], home_selected_artwork: [] };
}

function separateAlts(value: object) {
    const metadata = structuredClone(value) as Record<string, unknown>;
    const alts: Record<string, string> = {};
    function visit(node: Record<string, unknown>, prefix: string) {
        for (const [key, child] of Object.entries(node)) {
            const path = prefix ? `${prefix}.${key}` : key;
            if (key === "alt" && typeof child === "string") { alts[path] = child; delete node[key]; }
            else if (child && typeof child === "object" && !Array.isArray(child)) visit(child as Record<string, unknown>, path);
        }
    }
    visit(metadata, "");
    return { metadata, alts };
}

export function catalogueToRows(snapshot: CatalogueSnapshot): CatalogueRows {
    assertCatalogueSnapshot(snapshot);
    const rows = emptyCatalogueRows();
    const locales = new Set(["en", ...snapshot.artworkTranslations.map(copy => copy.locale), ...snapshot.seriesTranslations.map(copy => copy.locale)]);
    rows.locale = [...locales].sort().map(code => ({ code }));
    rows.category = [...new Set(snapshot.artworks.flatMap(work => work.categories))].sort().map(id => ({ id }));
    for (const work of snapshot.artworks) {
        rows.artwork.push({
            id: work.id, slug: work.slug, title: work.title, date: work.date,
            creation_status: work.creationStatus, authorship: work.authorship, context: work.context,
            medium: work.medium, support: work.support, series_id: work.seriesId ?? null,
            dimension_width: work.dimensions.width, dimension_height: work.dimensions.height, dimension_unit: work.dimensions.unit,
            availability: work.availability, price_amount: work.price?.amount ?? null, price_currency: work.price?.currency ?? null,
        });
        work.categories.forEach((category_id, ordinal) => rows.artwork_category.push({ artwork_id: work.id, category_id, ordinal }));
        const image_alts: Record<string, string> = {};
        for (const [role, image] of Object.entries(work.images)) {
            rows.artwork_image.push({ artwork_id: work.id, role, src: image.src, width: image.width ?? null, height: image.height ?? null });
            image_alts[role] = image.alt;
        }
        rows.artwork_translation.push({ artwork_id: work.id, locale: "en", quote: work.quote ?? null, description: work.description ?? null, image_alts });
    }
    for (const series of snapshot.series) {
        const visuals = Object.fromEntries(["images", "hero", "atmosphere"].filter(key => Object.hasOwn(series, key)).map(key => [key, series[key as keyof ArtworkSeries]]));
        const { metadata, alts } = separateAlts(visuals);
        rows.artwork_series.push({
            id: series.id, slug: series.slug, title: series.title, artistic_status: series.artisticStatus,
            publication_status: series.publicationStatus, year_start: series.yearStart ?? null,
            year_end: series.yearEnd ?? null, cover_artwork_id: series.coverArtworkId, visuals: metadata,
        });
        rows.series_translation.push({ series_id: series.id, locale: "en", description: series.description ?? null, statement: series.statement ?? null, media_alts: alts });
    }
    for (const copy of snapshot.artworkTranslations) rows.artwork_translation.push({ artwork_id: copy.artworkId, locale: copy.locale, quote: copy.quote ?? null, description: copy.description ?? null, image_alts: copy.images ?? {} });
    for (const copy of snapshot.seriesTranslations) rows.series_translation.push({ series_id: copy.seriesId, locale: copy.locale, description: copy.description ?? null, statement: copy.statement ?? null, media_alts: copy.mediaAlts ?? {} });
    for (const recognition of snapshot.recognitions) rows.artwork_recognition.push({ id: recognition.id, artwork_id: recognition.artworkId, kind: recognition.kind, title: recognition.title, event: recognition.event, year: recognition.year });
    rows.home_curation.push({ id: "home", hero_artwork_id: snapshot.homeCuration.hero.artworkId, featured_artwork_id: snapshot.homeCuration.featuredWork.artworkId, featured_series_id: snapshot.homeCuration.featuredCollection.seriesId });
    snapshot.homeCuration.selectedWorks.forEach((artwork_id, ordinal) => rows.home_selected_artwork.push({ artwork_id, ordinal }));
    return rows;
}

function text(row: CatalogueRow, field: string): string {
    requireCatalogue(typeof row[field] === "string", "invalid_database_text");
    return row[field] as string;
}
function number(row: CatalogueRow, field: string): number {
    const value = row[field];
    requireCatalogue((typeof value === "number" || (typeof value === "string" && value.trim() !== "")) && Number.isFinite(Number(value)), "invalid_database_number");
    return Number(value);
}
function optionalText(row: CatalogueRow, field: string, property = field) {
    return row[field] === null ? {} : { [property]: text(row, field) };
}
function alts(row: CatalogueRow, field: string): Record<string, string> {
    const value = row[field];
    requireCatalogue(value && typeof value === "object" && !Array.isArray(value) && Object.values(value).every(alt => typeof alt === "string"), "invalid_database_alts");
    return value as Record<string, string>;
}
function grouped(rows: CatalogueRow[], field: string): Map<string, CatalogueRow[]> {
    const groups = new Map<string, CatalogueRow[]>();
    for (const row of rows) { const id = text(row, field); const group = groups.get(id) ?? []; group.push(row); groups.set(id, group); }
    return groups;
}

export function catalogueFromRows(rows: CatalogueRows): CatalogueSnapshot {
    const imagesByWork = grouped(rows.artwork_image, "artwork_id");
    const categoriesByWork = grouped(rows.artwork_category, "artwork_id");
    const englishWork = new Map(rows.artwork_translation.filter(row => row.locale === "en").map(row => [text(row, "artwork_id"), row]));
    const englishSeries = new Map(rows.series_translation.filter(row => row.locale === "en").map(row => [text(row, "series_id"), row]));
    const artworks: Artwork[] = rows.artwork.map(row => {
        const id = text(row, "id"), copy = englishWork.get(id);
        requireCatalogue(copy, "missing_english_artwork_copy");
        const imageAlts = alts(copy, "image_alts");
        const images = Object.fromEntries((imagesByWork.get(id) ?? []).map(image => {
            const role = text(image, "role");
            requireCatalogue(typeof imageAlts[role] === "string", "missing_english_image_alt");
            return [role, { src: text(image, "src"), alt: imageAlts[role], ...(image.width === null ? {} : { width: number(image, "width") }), ...(image.height === null ? {} : { height: number(image, "height") }) }];
        })) as unknown as ArtworkImages;
        const date = text(row, "date"); assertArtworkDate(date);
        return {
            id, slug: text(row, "slug"), title: text(row, "title"), date,
            creationStatus: text(row, "creation_status") as Artwork["creationStatus"],
            authorship: text(row, "authorship") as Artwork["authorship"], context: text(row, "context") as Artwork["context"],
            medium: text(row, "medium") as Artwork["medium"], support: text(row, "support") as Artwork["support"],
            ...optionalText(row, "series_id", "seriesId"),
            dimensions: { width: number(row, "dimension_width"), height: number(row, "dimension_height"), unit: text(row, "dimension_unit") as "cm" | "in" },
            availability: text(row, "availability") as Artwork["availability"],
            categories: [...(categoriesByWork.get(id) ?? [])].sort((a, b) => number(a, "ordinal") - number(b, "ordinal")).map(category => text(category, "category_id")),
            images, ...optionalText(copy, "quote"), ...optionalText(copy, "description"),
            ...(row.price_amount === null ? {} : { price: { amount: number(row, "price_amount"), currency: text(row, "price_currency") as "USD" | "CRC" } }),
        };
    });
    const series: ArtworkSeries[] = rows.artwork_series.map(row => {
        const id = text(row, "id"), copy = englishSeries.get(id);
        requireCatalogue(copy && row.visuals && typeof row.visuals === "object" && !Array.isArray(row.visuals), "invalid_series_visuals");
        const visuals = structuredClone(row.visuals) as Record<string, unknown>;
        requireCatalogue(Object.keys(visuals).every(key => ["hero", "images", "atmosphere"].includes(key)), "unknown_series_visual_field");
        for (const [path, alt] of Object.entries(alts(copy, "media_alts"))) setMediaAlt(visuals, path, alt);
        return {
            id, slug: text(row, "slug"), title: text(row, "title"), coverArtworkId: text(row, "cover_artwork_id"),
            artisticStatus: text(row, "artistic_status") as ArtworkSeries["artisticStatus"],
            publicationStatus: text(row, "publication_status") as ArtworkSeries["publicationStatus"],
            ...(row.year_start === null ? {} : { yearStart: number(row, "year_start") }),
            ...(row.year_end === null ? {} : { yearEnd: number(row, "year_end") }),
            ...optionalText(copy, "description"), ...optionalText(copy, "statement"), ...visuals,
        };
    });
    const home = rows.home_curation[0]; requireCatalogue(home && rows.home_curation.length === 1 && home.id === "home", "missing_home_curation");
    const snapshot: CatalogueSnapshot = {
        artworks, series,
        recognitions: rows.artwork_recognition.map(row => ({ id: text(row, "id"), artworkId: text(row, "artwork_id"), kind: text(row, "kind") as ArtworkRecognition["kind"], title: text(row, "title"), event: text(row, "event"), year: number(row, "year") })),
        artworkTranslations: rows.artwork_translation.filter(row => row.locale !== "en").map(row => ({ artworkId: text(row, "artwork_id"), locale: text(row, "locale"), ...optionalText(row, "quote"), ...optionalText(row, "description"), ...(Object.keys(alts(row, "image_alts")).length ? { images: alts(row, "image_alts") } : {}) })),
        seriesTranslations: rows.series_translation.filter(row => row.locale !== "en").map(row => ({ seriesId: text(row, "series_id"), locale: text(row, "locale"), ...optionalText(row, "description"), ...optionalText(row, "statement"), ...(Object.keys(alts(row, "media_alts")).length ? { mediaAlts: alts(row, "media_alts") } : {}) })),
        homeCuration: { hero: { artworkId: text(home, "hero_artwork_id") }, featuredWork: { artworkId: text(home, "featured_artwork_id") }, featuredCollection: { seriesId: text(home, "featured_series_id") }, selectedWorks: [...rows.home_selected_artwork].sort((a, b) => number(a, "ordinal") - number(b, "ordinal")).map(row => text(row, "artwork_id")) },
    };
    assertCatalogueSnapshot(snapshot);
    return snapshot;
}
