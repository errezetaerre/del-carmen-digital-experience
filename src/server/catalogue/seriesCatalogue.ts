import "server-only";
import type { Artwork } from "@/domains/artworks/model/artwork";
import type { ArtworkSeries } from "@/domains/artworks/series/types";
import { createCollectionEntries, type CollectionEntry } from "@/domains/collections/services/collectionEntries";
import { createArtworkDetailCatalogue } from "./detailCatalogue";
import { orderArtworkSeries } from "@/domains/artworks/presentation/seriesNavigationOrder";
import { requireCatalogue } from "./snapshot";

export interface ArtworkSeriesCatalogue {
    getArtworkSeries(): ArtworkSeries[];
    getArtworkSeriesBySlug(slug: string): ArtworkSeries | undefined;
    getArtworksBySeriesId(seriesId: string): Artwork[];
    getCollections(): CollectionEntry[];
}

export function createArtworkSeriesCatalogue(artworks: readonly Artwork[], series: readonly ArtworkSeries[]): ArtworkSeriesCatalogue {
    const detail = createArtworkDetailCatalogue(artworks, series);
    const published = structuredClone([...series]).filter(item => item.publicationStatus === "published");
    const byId = new Map(published.map(item => [item.id, item]));
    requireCatalogue(byId.size === published.length && new Set(published.map(item => item.slug)).size === published.length, "series_catalogue_membership_mismatch");
    // Series page turns retain the current editorial sequence, independently of
    // SQL order. Collections retains its separate year-start ordering rule.
    const ordered = orderArtworkSeries(published);
    return Object.freeze({
        getArtworkSeries: () => ordered,
        getArtworkSeriesBySlug: (slug: string) => ordered.find(item => item.slug === slug),
        getArtworksBySeriesId: detail.getArtworksBySeriesId,
        getCollections: () => createCollectionEntries(ordered, detail.getArtworksBySeriesId),
    });
}
