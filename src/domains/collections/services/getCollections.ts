import {
    getArtworkSeries,
    getArtworksBySeriesId,
    type ArtworkSeries,
} from "@/domains/artworks";

import type { Artwork } from "@/domains/artworks";

export interface CollectionEntry {
    series: ArtworkSeries;
    artworks: Artwork[];
}

export function getCollections(): CollectionEntry[] {
    return [...getArtworkSeries()]
        .sort((a, b) => {
            const yearA = a.yearStart ?? 0;
            const yearB = b.yearStart ?? 0;

            return yearB - yearA;
        })
        .map((series) => ({
            series,
            artworks: getArtworksBySeriesId(
                series.id,
            ),
        }));
}