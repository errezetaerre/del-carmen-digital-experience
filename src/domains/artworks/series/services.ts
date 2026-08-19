import { artworks } from "@/domains/artworks/data/artworks";

import { artworkSeries } from "./artworkSeries";

export function getArtworkSeries() {
    return artworkSeries;
}

export function getArtworkSeriesById(
    id: string,
) {
    return artworkSeries.find(
        (series) => series.id === id,
    );
}

export function getArtworkSeriesBySlug(
    slug: string,
) {
    return artworkSeries.find(
        (series) => series.slug === slug,
    );
}

export function getArtworksBySeriesId(
    seriesId: string,
) {
    return artworks.filter(
        (artwork) =>
            artwork.seriesId === seriesId,
    );
}