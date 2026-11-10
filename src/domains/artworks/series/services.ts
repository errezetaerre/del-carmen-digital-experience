import { artworks } from "@/domains/artworks/data/artworks";

import { artworkSeries } from "./artworkSeries";
import type { ArtworkSeries } from "./types";

// Publication controls public selection; it does not change artistic progress.
// The canonical data export remains complete for internal catalogue tooling.
export function getArtworkSeries(): ArtworkSeries[] {
    return artworkSeries.filter(
        (series) => series.publicationStatus === "published",
    );
}

export function getArtworkSeriesById(
    id: string,
) {
    return artworkSeries.find(
        (series) => series.publicationStatus === "published" && series.id === id,
    );
}

export function getArtworkSeriesBySlug(
    slug: string,
) {
    return artworkSeries.find(
        (series) => series.publicationStatus === "published" && series.slug === slug,
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
