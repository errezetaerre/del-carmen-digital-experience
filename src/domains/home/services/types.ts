import type {
    Artwork,
    ArtworkSeries,
} from "@/domains/artworks";

export interface FeaturedCollection {
    series: ArtworkSeries;

    coverArtwork: Artwork;

    artworks: Artwork[];

    artworkCount: number;
}