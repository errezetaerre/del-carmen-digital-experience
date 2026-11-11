import "server-only";
import type { Artwork } from "@/domains/artworks/model/artwork";
import type { ArtworkSeries } from "@/domains/artworks/series/types";
import type { HomeCuration } from "@/domains/home/curation/types";
import type { HomeCatalogue } from "@/domains/home/model/homeCatalogue";
import { createArtworkDetailCatalogue } from "./detailCatalogue";

/** Resolve existing Home curation against supplied records, never SQL row order. */
export function createHomeCatalogue(artworks: readonly Artwork[], series: readonly ArtworkSeries[], curation: HomeCuration): HomeCatalogue {
    const detail = createArtworkDetailCatalogue(artworks, series);
    const byId = new Map(detail.artworks.map(work => [work.id, work]));
    const featuredSeries = series.find(item => item.id === curation.featuredCollection.seriesId && item.publicationStatus === "published");
    const coverArtwork = featuredSeries ? byId.get(featuredSeries.coverArtworkId) : undefined;
    const members = featuredSeries ? detail.getArtworksBySeriesId(featuredSeries.id) : [];
    return {
        hero: byId.get(curation.hero.artworkId),
        featured: byId.get(curation.featuredWork.artworkId),
        collection: featuredSeries && coverArtwork ? {
            series: structuredClone(featuredSeries), coverArtwork, artworks: members, artworkCount: members.length,
        } : undefined,
        selected: curation.selectedWorks.map(id => byId.get(id)).filter((work): work is Artwork => work !== undefined),
    };
}
