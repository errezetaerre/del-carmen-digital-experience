export type ArtworkSeriesStatus =
    | "ongoing"
    | "completed"
    | "archived";

export interface ArtworkSeries {
    id: string;

    slug: string;

    title: string;

    description?: string;

    statement?: string;

    coverArtworkId: string;

    status: ArtworkSeriesStatus;

    yearStart?: number;

    yearEnd?: number;
}