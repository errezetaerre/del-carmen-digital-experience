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

export type ArtworkSeriesHeroLayout =
    | "default"
    | "content-left";

export interface ArtworkSeriesHeroImageMedia {
    type: "image";

    desktop: ArtworkSeriesImage;
    mobile: ArtworkSeriesImage;
}

export interface ArtworkSeriesHeroVideoMedia {
    type: "video";

    desktopSrc: string;
    mobileSrc?: string;

    posterDesktop: ArtworkSeriesImage;
    posterMobile?: ArtworkSeriesImage;

    alt?: string;

    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
}

export type ArtworkSeriesHeroMedia =
    | ArtworkSeriesHeroImageMedia
    | ArtworkSeriesHeroVideoMedia;

export interface ArtworkSeriesHero {
    layout?: ArtworkSeriesHeroLayout;

    media: ArtworkSeriesHeroMedia;
}

export interface ArtworkSeries {
    id: string;

    slug: string;

    title: string;

    description?: string;

    statement?: string;

    coverArtworkId: string;

    images?: ArtworkSeriesImages;

    hero?: ArtworkSeriesHero;

    status: ArtworkSeriesStatus;

    yearStart?: number;

    yearEnd?: number;
}