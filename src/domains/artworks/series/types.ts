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

export type ArtworkSeriesHeroContentPosition =
    | "top"
    | "bottom"
    | "left"
    | "right";

export type ArtworkSeriesHeroMediaVariant =
    | "portrait"
    | "landscape";

export interface ArtworkSeriesHeroResponsiveLayout {
    media?: ArtworkSeriesHeroMediaVariant;
    content?: ArtworkSeriesHeroContentPosition;
}

export interface ArtworkSeriesHeroLayout {
    mobile?: ArtworkSeriesHeroResponsiveLayout;
    tablet?: ArtworkSeriesHeroResponsiveLayout;
    desktop?: ArtworkSeriesHeroResponsiveLayout;
}

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
    atmosphere?: ArtworkSeriesAtmosphere;

}

export interface ArtworkSeriesAtmosphere {
    src: string;
    alt: string;
}
