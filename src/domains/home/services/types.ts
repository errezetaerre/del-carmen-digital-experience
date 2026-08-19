import type {
    Artwork,
    ArtworkSeries,
} from "@/domains/artworks";

export type FeaturedCollectionItem =
    | {
        type: "artwork";
        artwork: Artwork;
    }
    | {
        type: "series";
        series: ArtworkSeries;
        coverArtwork: Artwork;
        artworkCount: number;
    };