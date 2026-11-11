import "server-only";
import { extractArtworkEditorial, extractSeriesEditorial, type CatalogueArtwork, type CatalogueSeries } from "@/i18n/catalogueEditorial";
import type { Artwork } from "@/domains/artworks/model/artwork";
import type { ArtworkRecognition } from "@/domains/artworks/model/artworkRecognition";
import type { ArtworkSeries } from "@/domains/artworks/series/types";
import type { CatalogueArtworkPresentation, CatalogueSeriesPresentation } from "@/domains/artworks/presentation/cataloguePresentation";
import type { HomeCuration } from "@/domains/home/curation/types";
import { readCatalogueSnapshot, type CatalogueDatabase } from "./operations";
import { assertCatalogueSnapshot, localizeCatalogueArtwork, localizeCatalogueSeries, requireCatalogue, type CatalogueSnapshot } from "./snapshot";

// Server-side methods, not a Client Component prop. Each method returns detached
// domain records or selected public editorial DTOs only; connections stay here.
export interface CatalogueRepository {
    getArtworks(locale?: string): Artwork[];
    getArtworkViews(locales: readonly string[]): (CatalogueArtwork & CatalogueArtworkPresentation)[];
    getSeriesViews(locales: readonly string[]): (CatalogueSeries & CatalogueSeriesPresentation)[];
    getArtworkById(id: string, locale?: string): Artwork | undefined;
    getArtworkBySlug(slug: string, locale?: string): Artwork | undefined;
    getSeries(locale?: string): ArtworkSeries[];
    getSeriesById(id: string, locale?: string): ArtworkSeries | undefined;
    getSeriesBySlug(slug: string, locale?: string): ArtworkSeries | undefined;
    getRecognitions(artworkId?: string): ArtworkRecognition[];
    getHomeCuration(): HomeCuration;
}

export function createCatalogueRepository(source: CatalogueSnapshot): CatalogueRepository {
    assertCatalogueSnapshot(source);
    const snapshot = structuredClone(source);
    const published = snapshot.series.filter(series => series.publicationStatus === "published");
    const recognitions = new Map<string, ArtworkRecognition[]>();
    for (const recognition of snapshot.recognitions) {
        const items = recognitions.get(recognition.artworkId) ?? [];
        items.push(recognition);
        recognitions.set(recognition.artworkId, items);
    }
    const artwork = (id: string, locale = "en") => structuredClone(localizeCatalogueArtwork(snapshot, id, locale));
    const series = (id: string, locale = "en") => published.some(item => item.id === id)
        ? structuredClone(localizeCatalogueSeries(snapshot, id, locale)) : undefined;
    return Object.freeze({
        // Entity enumeration has no UI order contract. Archive sorting remains
        // in selectArtworkArchive; Series navigation is not switched here.
        getArtworks: (locale = "en") => snapshot.artworks.map(item => artwork(item.id, locale)!),
        getArtworkViews: (locales: readonly string[]) => snapshot.artworks.map(record => ({
            ...artwork(record.id)!,
            cataloguePresentation: { kind: "artwork" as const,
                cover: record.id === snapshot.homeCuration.hero.artworkId,
                featured: record.id === snapshot.homeCuration.featuredWork.artworkId,
                recognitions: structuredClone(recognitions.get(record.id) ?? []),
            },
            catalogueEditorial: { kind: "artwork" as const, copies: Object.fromEntries([...new Set(["en", ...locales])]
                .filter(locale => locale === "en" || snapshot.artworkTranslations.some(copy => copy.artworkId === record.id && copy.locale === locale))
                .map(locale => [locale, extractArtworkEditorial(artwork(record.id, locale)!)])) },
        })),
        getSeriesViews: (locales: readonly string[]) => published.map(record => ({
            ...series(record.id)!,
            cataloguePresentation: { kind: "series" as const, featured: record.id === snapshot.homeCuration.featuredCollection.seriesId },
            catalogueEditorial: { kind: "series" as const, copies: Object.fromEntries([...new Set(["en", ...locales])]
                .filter(locale => locale === "en" || snapshot.seriesTranslations.some(copy => copy.seriesId === record.id && copy.locale === locale))
                .map(locale => [locale, extractSeriesEditorial(series(record.id, locale)!)])) },
        })),
        getArtworkById: artwork,
        getArtworkBySlug: (slug: string, locale = "en") => {
            const record = snapshot.artworks.find(item => item.slug === slug);
            return record ? artwork(record.id, locale) : undefined;
        },
        getSeries: (locale = "en") => published.map(item => series(item.id, locale)!),
        getSeriesById: series,
        getSeriesBySlug: (slug: string, locale = "en") => {
            const record = published.find(item => item.slug === slug);
            return record ? series(record.id, locale) : undefined;
        },
        getRecognitions: (artworkId?: string) => structuredClone(snapshot.recognitions.filter(item => artworkId === undefined || item.artworkId === artworkId)),
        getHomeCuration: () => structuredClone(snapshot.homeCuration),
    });
}

export function createCatalogueReader(database: CatalogueDatabase, options: { ttlMs?: number; now?: () => number; validate?: (snapshot: CatalogueSnapshot) => void } = {}) {
    const ttlMs = options.ttlMs ?? 30_000;
    requireCatalogue(Number.isFinite(ttlMs) && ttlMs >= 0 && ttlMs <= 60_000, "invalid_catalogue_cache_ttl");
    const now = options.now ?? Date.now;
    let cached: CatalogueRepository | undefined;
    let expiresAt = 0;
    let pending: Promise<CatalogueRepository> | undefined;

    return Object.freeze({
        async read(): Promise<CatalogueRepository> {
            if (cached && now() < expiresAt) return cached;
            if (pending) return pending;
            cached = undefined;
            pending = (async () => {
                try {
                    // One consistent read-only transaction per cache refresh,
                    // never a query per record, language or book gesture.
                    const snapshot = await readCatalogueSnapshot(database);
                    options.validate?.(snapshot);
                    const repository = createCatalogueRepository(snapshot);
                    cached = repository;
                    expiresAt = now() + ttlMs;
                    return repository;
                } finally {
                    // A failed load is retriable. No stale/file fallback, polling
                    // or background timer hides a failed database verification.
                    pending = undefined;
                }
            })();
            return pending;
        },
    });
}
