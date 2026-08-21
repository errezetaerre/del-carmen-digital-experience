export type ArtworkSeriesStatus =
    | "ongoing"
    | "completed"
    | "archived";

export interface ArtworkSeriesImage {
    src: string;

    alt: string;

    width?: number;

    height?: number;
}

export interface ArtworkSeriesImages {
    featured?: ArtworkSeriesImage;
}

export interface ArtworkSeries {
    id: string;

    slug: string;

    title: string;

    description?: string;

    statement?: string;

    coverArtworkId: string;

    images?: ArtworkSeriesImages;

    status: ArtworkSeriesStatus;

    yearStart?: number;

    yearEnd?: number;
}