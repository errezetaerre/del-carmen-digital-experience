import type { Artwork } from "@/domains/artworks/model/artwork";
import type { ArtworkSeries } from "@/domains/artworks/series/types";

export interface CollectionEntry {
    series: ArtworkSeries;
    artworks: Artwork[];
}

// One existing presentation rule for both file and database consumers. Stable
// year ties retain the supplied editorial Series sequence; no persisted order.
export function createCollectionEntries(series: readonly ArtworkSeries[], artworksForSeries: (seriesId: string) => Artwork[]): CollectionEntry[] {
    return [...series]
        .sort((a, b) => (b.yearStart ?? 0) - (a.yearStart ?? 0))
        .map(series => ({ series, artworks: artworksForSeries(series.id) }));
}
