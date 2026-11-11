import "server-only";
import type { Artwork } from "@/domains/artworks/model/artwork";
import type { ArtworkSeries } from "@/domains/artworks/series/types";
import { orderSeriesArtworks } from "@/domains/artworks/presentation/seriesNavigationOrder";
import { requireCatalogue } from "./snapshot";

export interface ArtworkDetailCatalogue {
    readonly artworks: Artwork[];
    getArtworkBySlug(slug: string): Artwork | undefined;
    getArtworkSeriesBySlug(slug: string): ArtworkSeries | undefined;
    getArtworksBySeriesId(seriesId: string): Artwork[];
}

export function createArtworkDetailCatalogue(artworks: readonly Artwork[], series: readonly ArtworkSeries[]): ArtworkDetailCatalogue {
    const byId = new Map(structuredClone([...artworks]).map(work => [work.id, work]));
    requireCatalogue(byId.size === artworks.length && new Set(artworks.map(work => work.slug)).size === artworks.length, "detail_catalogue_membership_mismatch");
    // Raw enumeration has no UI order. Archive applies its selected sort;
    // Series membership is filtered from these supplied facts before ordering.
    const records = [...byId.values()];
    const published = structuredClone([...series]).filter(item => item.publicationStatus === "published");
    return Object.freeze({
        artworks: records,
        getArtworkBySlug: (slug: string) => records.find(work => work.slug === slug),
        getArtworkSeriesBySlug: (slug: string) => published.find(item => item.slug === slug),
        getArtworksBySeriesId: (seriesId: string) => orderSeriesArtworks(records.filter(work => work.seriesId === seriesId)),
    });
}
