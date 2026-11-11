import "server-only";
import type { Artwork } from "@/domains/artworks/model/artwork";
import type { ArtworkRecognition } from "@/domains/artworks/model/artworkRecognition";
import type { ArtworkSeries } from "@/domains/artworks/series/types";
import type { HomeCuration } from "@/domains/home/curation/types";
import { assertArtworkDate } from "@/domains/artworks/model/artworkDate";

export interface ArtworkEditorialTranslation {
    artworkId: string;
    locale: string;
    quote?: string;
    description?: string;
    images?: Partial<Record<keyof Artwork["images"], string>>;
}
export interface SeriesEditorialTranslation {
    seriesId: string;
    locale: string;
    description?: string;
    statement?: string;
    mediaAlts?: Record<string, string>;
}
export interface CatalogueSnapshot {
    artworks: Artwork[];
    series: ArtworkSeries[];
    recognitions: ArtworkRecognition[];
    artworkTranslations: ArtworkEditorialTranslation[];
    seriesTranslations: SeriesEditorialTranslation[];
    homeCuration: HomeCuration;
}

export class CatalogueError extends Error {
    constructor(public readonly code: string) { super(code); this.name = "CatalogueError"; }
}
export function requireCatalogue(condition: unknown, code: string): asserts condition {
    if (!condition) throw new CatalogueError(code);
}

function unique(values: string[], code: string) {
    requireCatalogue(values.every(value => typeof value === "string" && value.length > 0) && new Set(values).size === values.length, code);
}
function localeValid(locale: string) {
    try { return /^[a-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/.test(locale) && Intl.getCanonicalLocales(locale).length === 1; }
    catch { return false; }
}
function keys(value: object, allowed: readonly string[]) {
    requireCatalogue(Object.keys(value).every(key => allowed.includes(key)), "unmapped_catalogue_attribute");
}
function optionalTextFields(value: object, fields: readonly string[]) {
    for (const field of fields) {
        const item = (value as Record<string, unknown>)[field];
        requireCatalogue(item === undefined || typeof item === "string", "invalid_editorial_text");
    }
}
function imageShape(image: Artwork["images"]["primary"]) {
    keys(image, ["src", "alt", "width", "height"]);
    requireCatalogue(typeof image.src === "string" && typeof image.alt === "string", "invalid_image_metadata");
    for (const size of [image.width, image.height]) requireCatalogue(size === undefined || (Number.isInteger(size) && size > 0), "invalid_image_dimension");
}
function seriesVisualShape(series: ArtworkSeries) {
    if (series.images) { keys(series.images, ["featured"]); if (series.images.featured) imageShape(series.images.featured); }
    if (series.atmosphere) {
        keys(series.atmosphere, ["src", "portraitSrc", "alt"]);
        requireCatalogue(typeof series.atmosphere.src === "string" && typeof series.atmosphere.alt === "string", "invalid_atmosphere");
        optionalTextFields(series.atmosphere, ["portraitSrc"]);
    }
    if (series.hero) {
        keys(series.hero, ["layout", "media"]);
        if (series.hero.layout) {
            keys(series.hero.layout, ["mobile", "tablet", "desktop"]);
            for (const layout of Object.values(series.hero.layout)) {
                keys(layout, ["media", "content"]);
                requireCatalogue(layout.media === undefined || ["portrait", "landscape"].includes(layout.media), "invalid_hero_layout");
                requireCatalogue(layout.content === undefined || ["top", "bottom", "left", "right"].includes(layout.content), "invalid_hero_layout");
            }
        }
        const media = series.hero.media;
        requireCatalogue(media && ["image", "video"].includes(media.type), "invalid_hero_media");
        if (media.type === "image") {
            keys(media, ["type", "desktop", "mobile"]); imageShape(media.desktop); imageShape(media.mobile);
        } else {
            keys(media, ["type", "desktopSrc", "mobileSrc", "posterDesktop", "posterMobile", "alt", "autoplay", "loop", "muted"]);
            requireCatalogue(typeof media.desktopSrc === "string", "invalid_hero_media");
            optionalTextFields(media, ["mobileSrc", "alt"]); imageShape(media.posterDesktop); if (media.posterMobile) imageShape(media.posterMobile);
            for (const field of ["autoplay", "loop", "muted"] as const) requireCatalogue(media[field] === undefined || typeof media[field] === "boolean", "invalid_video_setting");
        }
    }
}
export function validateMedia(value: unknown): void {
    if (!value || typeof value !== "object") return;
    for (const [key, item] of Object.entries(value)) {
        if ((key === "src" || key.endsWith("Src")) && typeof item === "string") {
            requireCatalogue(/^(\/[^/]|https?:\/\/)/.test(item) && !/\s/.test(item), "invalid_media_reference");
        }
        if (typeof item === "string") requireCatalogue(!/^data:/i.test(item), "binary_media_not_allowed");
        else validateMedia(item);
    }
}
export function assertCatalogueSnapshot(snapshot: CatalogueSnapshot): void {
    unique(snapshot.artworks.map(work => work.id), "duplicate_artwork_id");
    unique(snapshot.artworks.map(work => work.slug), "duplicate_artwork_slug");
    unique(snapshot.series.map(series => series.id), "duplicate_series_id");
    unique(snapshot.series.map(series => series.slug), "duplicate_series_slug");
    unique(snapshot.recognitions.map(recognition => recognition.id), "duplicate_recognition_id");
    unique(snapshot.artworkTranslations.map(copy => `${copy.artworkId}:${copy.locale}`), "duplicate_artwork_translation");
    unique(snapshot.seriesTranslations.map(copy => `${copy.seriesId}:${copy.locale}`), "duplicate_series_translation");
    const artworks = new Map(snapshot.artworks.map(work => [work.id, work]));
    const seriesIds = new Set(snapshot.series.map(series => series.id));
    for (const work of snapshot.artworks) {
        assertArtworkDate(work.date);
        requireCatalogue(!Object.hasOwn(work, "year"), "legacy_artwork_year");
        keys(work, ["id", "slug", "title", "date", "creationStatus", "authorship", "context", "medium", "support", "categories", "seriesId", "dimensions", "images", "quote", "description", "availability", "price"]);
        optionalTextFields(work, ["quote", "description"]);
        keys(work.dimensions, ["width", "height", "unit"]);
        if (work.price) keys(work.price, ["amount", "currency"]);
        requireCatalogue(!work.seriesId || seriesIds.has(work.seriesId), "unknown_artwork_series");
        requireCatalogue(["available", "reserved", "sold", "unavailable"].includes(work.availability), "invalid_availability");
        requireCatalogue(["planned", "in-progress", "completed"].includes(work.creationStatus), "invalid_creation_status");
        unique(work.categories, "duplicate_artwork_category");
        requireCatalogue(Boolean(work.images.primary), "missing_primary_image");
        keys(work.images, ["primary", "heroPortrait", "heroLandscape", "thumbnail", "collection"]);
        for (const image of Object.values(work.images)) imageShape(image);
        validateMedia(work.images);
    }
    for (const series of snapshot.series) {
        keys(series, ["id", "slug", "title", "description", "statement", "coverArtworkId", "images", "hero", "artisticStatus", "publicationStatus", "yearStart", "yearEnd", "atmosphere"]);
        optionalTextFields(series, ["description", "statement"]);
        requireCatalogue(["upcoming", "ongoing", "completed"].includes(series.artisticStatus), "invalid_artistic_status");
        requireCatalogue(["draft", "published", "archived"].includes(series.publicationStatus), "invalid_publication_status");
        requireCatalogue(artworks.has(series.coverArtworkId), "unknown_cover_artwork");
        for (const field of ["status", "artworkIds", "worksCount"]) requireCatalogue(!Object.hasOwn(series, field), "redundant_series_attribute");
        validateMedia({ images: series.images, hero: series.hero, atmosphere: series.atmosphere });
        seriesVisualShape(series);
    }
    for (const recognition of snapshot.recognitions) {
        keys(recognition, ["id", "artworkId", "kind", "title", "event", "year"]);
        requireCatalogue(artworks.has(recognition.artworkId), "unknown_recognition_artwork");
    }
    for (const copy of snapshot.artworkTranslations) {
        keys(copy, ["artworkId", "locale", "quote", "description", "images"]); optionalTextFields(copy, ["quote", "description"]);
        requireCatalogue(artworks.has(copy.artworkId) && copy.locale !== "en" && localeValid(copy.locale), "invalid_artwork_translation");
        for (const [role, alt] of Object.entries(copy.images ?? {})) requireCatalogue(role in artworks.get(copy.artworkId)!.images && typeof alt === "string", "invalid_image_translation");
    }
    for (const copy of snapshot.seriesTranslations) {
        keys(copy, ["seriesId", "locale", "description", "statement", "mediaAlts"]); optionalTextFields(copy, ["description", "statement"]);
        requireCatalogue(seriesIds.has(copy.seriesId) && copy.locale !== "en" && localeValid(copy.locale), "invalid_series_translation");
        const translated = structuredClone(snapshot.series.find(series => series.id === copy.seriesId)!);
        for (const [path, alt] of Object.entries(copy.mediaAlts ?? {})) {
            requireCatalogue(typeof alt === "string", "invalid_media_alt"); setMediaAlt(translated, path, alt);
        }
    }
    const home = snapshot.homeCuration;
    keys(home, ["hero", "featuredWork", "featuredCollection", "selectedWorks"]);
    keys(home.hero, ["artworkId"]); keys(home.featuredWork, ["artworkId"]); keys(home.featuredCollection, ["seriesId"]);
    for (const id of [home.hero.artworkId, home.featuredWork.artworkId, ...home.selectedWorks]) requireCatalogue(artworks.has(id), "unknown_curated_artwork");
    requireCatalogue(seriesIds.has(home.featuredCollection.seriesId), "unknown_curated_series");
    unique(home.selectedWorks, "duplicate_selected_work");
}

export function localizeCatalogueArtwork(snapshot: CatalogueSnapshot, id: string, locale: string): Artwork | undefined {
    const original = snapshot.artworks.find(work => work.id === id);
    if (!original) return undefined;
    const copy = snapshot.artworkTranslations.find(item => item.artworkId === id && item.locale === locale);
    if (!copy) return original;
    const localized = structuredClone(original);
    if (copy.quote !== undefined) localized.quote = copy.quote;
    if (copy.description !== undefined) localized.description = copy.description;
    for (const [role, alt] of Object.entries(copy.images ?? {})) {
        const image = localized.images[role as keyof Artwork["images"]];
        if (image && alt) image.alt = alt;
    }
    return localized;
}

export function setMediaAlt(root: object, path: string, alt: string): void {
    const parts = path.split(".");
    requireCatalogue(parts.at(-1) === "alt" && parts.every(part => !["__proto__", "prototype", "constructor"].includes(part)), "invalid_media_alt_path");
    let target: Record<string, unknown> = root as Record<string, unknown>;
    for (const part of parts.slice(0, -1)) {
        const child = target[part];
        requireCatalogue(Object.hasOwn(target, part) && child && typeof child === "object" && !Array.isArray(child), "unknown_media_alt_path");
        target = child as Record<string, unknown>;
    }
    target.alt = alt;
}
export function localizeCatalogueSeries(snapshot: CatalogueSnapshot, id: string, locale: string): ArtworkSeries | undefined {
    const original = snapshot.series.find(series => series.id === id);
    if (!original) return undefined;
    const copy = snapshot.seriesTranslations.find(item => item.seriesId === id && item.locale === locale);
    if (!copy) return original;
    const localized = structuredClone(original);
    if (copy.description !== undefined) localized.description = copy.description;
    if (copy.statement !== undefined) localized.statement = copy.statement;
    for (const [path, alt] of Object.entries(copy.mediaAlts ?? {})) setMediaAlt(localized, path, alt);
    return localized;
}
