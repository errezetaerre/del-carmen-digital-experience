import {
    getArtworkById,
    getArtworkSeriesById,
    getArtworksBySeriesId,
} from "@/domains/artworks";

import {
    homeCuration,
} from "@/domains/home/curation";

import type {
    FeaturedCollection,
} from "./types";

export function getFeaturedCollection():
    FeaturedCollection | undefined {
    const series =
        getArtworkSeriesById(
            homeCuration.featuredCollection.seriesId,
        );

    if (!series) {
        return undefined;
    }

    const coverArtwork =
        getArtworkById(
            series.coverArtworkId,
        );

    if (!coverArtwork) {
        return undefined;
    }

    const artworks =
        getArtworksBySeriesId(
            series.id,
        );

    return {
        series,
        coverArtwork,
        artworks,
        artworkCount: artworks.length,
    };
}