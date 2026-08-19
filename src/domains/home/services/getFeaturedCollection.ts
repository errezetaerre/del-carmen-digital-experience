import {
    getArtworkById,
    getArtworkSeriesById,
    getArtworksBySeriesId,
} from "@/domains/artworks";

import {
    homeCuration,
} from "@/domains/home/curation";

import type {
    FeaturedCollectionItem,
} from "./types";

export function getFeaturedCollection():
    FeaturedCollectionItem[] {
    return homeCuration.featuredCollection
        .map((entry) => {
            if (entry.type === "artwork") {
                const artwork =
                    getArtworkById(entry.id);

                if (!artwork) {
                    return null;
                }

                return {
                    type: "artwork",
                    artwork,
                } satisfies FeaturedCollectionItem;
            }

            const series =
                getArtworkSeriesById(entry.id);

            if (!series) {
                return null;
            }

            const coverArtwork =
                getArtworkById(
                    series.coverArtworkId,
                );

            if (!coverArtwork) {
                return null;
            }

            const seriesArtworks =
                getArtworksBySeriesId(
                    series.id,
                );

            return {
                type: "series",
                series,
                coverArtwork,
                artworkCount:
                    seriesArtworks.length,
            } satisfies FeaturedCollectionItem;
        })
        .filter(
            (
                item,
            ): item is FeaturedCollectionItem =>
                item !== null,
        );
}