import type { Artwork } from "@/domains/artworks/model/artwork";
import type { ArtworkSeries } from "@/domains/artworks/series/types";

export interface ArtworkEditorialCopy {
    quote?: string;
    description?: string;
    imageAlts: Partial<Record<keyof Artwork["images"], string>>;
}

export interface SeriesEditorialCopy {
    description?: string;
    statement?: string;
    featuredAlt?: string;
    atmosphereAlt?: string;
    hero?: { type: "image"; desktopAlt: string; mobileAlt: string } |
        { type: "video"; alt?: string; posterDesktopAlt: string; posterMobileAlt?: string };
}

// Public read DTOs only. These copies are derived from a server snapshot;
// catalogueEditorial is never part of Artwork/ArtworkSeries or a SQL column.
export type CatalogueArtwork = Artwork & {
    readonly catalogueEditorial: { readonly kind: "artwork"; readonly copies: Readonly<Record<string, ArtworkEditorialCopy>> };
};
export type CatalogueSeries = ArtworkSeries & {
    readonly catalogueEditorial: { readonly kind: "series"; readonly copies: Readonly<Record<string, SeriesEditorialCopy>> };
};

export function extractArtworkEditorial(artwork: Artwork): ArtworkEditorialCopy {
    const imageAlts: ArtworkEditorialCopy["imageAlts"] = {};
    for (const role of Object.keys(artwork.images) as Array<keyof Artwork["images"]>) {
        const image = artwork.images[role];
        if (image) imageAlts[role] = image.alt;
    }
    return {
        ...(artwork.quote === undefined ? {} : { quote: artwork.quote }),
        ...(artwork.description === undefined ? {} : { description: artwork.description }),
        imageAlts,
    };
}

export function extractSeriesEditorial(series: ArtworkSeries): SeriesEditorialCopy {
    const media = series.hero?.media;
    return {
        ...(series.description === undefined ? {} : { description: series.description }),
        ...(series.statement === undefined ? {} : { statement: series.statement }),
        ...(series.images?.featured ? { featuredAlt: series.images.featured.alt } : {}),
        ...(series.atmosphere ? { atmosphereAlt: series.atmosphere.alt } : {}),
        ...(media ? { hero: media.type === "image" ? { type: "image" as const, desktopAlt: media.desktop.alt, mobileAlt: media.mobile.alt } : {
            type: "video" as const, ...(media.alt === undefined ? {} : { alt: media.alt }), posterDesktopAlt: media.posterDesktop.alt,
            ...(media.posterMobile ? { posterMobileAlt: media.posterMobile.alt } : {}),
        } } : {}),
    };
}

function copyFor<T>(editorial: { kind: string; copies: Readonly<Record<string, T>> } | undefined, kind: string, locale: string) {
    if (editorial === undefined) return undefined;
    if (editorial.kind !== kind || !editorial.copies || !Object.hasOwn(editorial.copies, "en")) throw new Error("invalid_catalogue_editorial");
    const textLocale = Object.hasOwn(editorial.copies, locale) ? locale : "en";
    const copy = editorial.copies[textLocale];
    if (!copy || typeof copy !== "object" || Array.isArray(copy)) throw new Error("invalid_catalogue_editorial");
    return { copy, textLocale };
}

export function artworkEditorial(artwork: Artwork, locale: string) {
    return copyFor((artwork as Partial<CatalogueArtwork>).catalogueEditorial, "artwork", locale);
}
export function seriesEditorial(series: ArtworkSeries, locale: string) {
    return copyFor((series as Partial<CatalogueSeries>).catalogueEditorial, "series", locale);
}

export function applyArtworkEditorial(artwork: Artwork, copy: ArtworkEditorialCopy): Artwork {
    const images = { ...artwork.images };
    for (const role of Object.keys(images) as Array<keyof Artwork["images"]>) {
        const image = images[role], alt = copy.imageAlts[role];
        if (image && alt !== undefined) images[role] = { ...image, alt };
    }
    const result = { ...artwork, images };
    if (copy.quote === undefined) delete result.quote; else result.quote = copy.quote;
    if (copy.description === undefined) delete result.description; else result.description = copy.description;
    return result;
}

export function applySeriesEditorial(series: ArtworkSeries, copy: SeriesEditorialCopy): ArtworkSeries {
    const result = { ...series };
    if (copy.description === undefined) delete result.description; else result.description = copy.description;
    if (copy.statement === undefined) delete result.statement; else result.statement = copy.statement;
    if (series.images?.featured && copy.featuredAlt !== undefined) result.images = { ...series.images, featured: { ...series.images.featured, alt: copy.featuredAlt } };
    if (series.atmosphere && copy.atmosphereAlt !== undefined) result.atmosphere = { ...series.atmosphere, alt: copy.atmosphereAlt };
    const media = series.hero?.media, hero = copy.hero;
    if (series.hero && media && hero) {
        if (media.type !== hero.type) throw new Error("invalid_catalogue_editorial_media");
        if (media.type === "image" && hero.type === "image") result.hero = { ...series.hero, media: {
            ...media, desktop: { ...media.desktop, alt: hero.desktopAlt }, mobile: { ...media.mobile, alt: hero.mobileAlt },
        } };
        if (media.type === "video" && hero.type === "video") {
            const video = { ...media, posterDesktop: { ...media.posterDesktop, alt: hero.posterDesktopAlt },
                ...(media.posterMobile && hero.posterMobileAlt !== undefined ? { posterMobile: { ...media.posterMobile, alt: hero.posterMobileAlt } } : {}),
            };
            if (hero.alt === undefined) delete video.alt; else video.alt = hero.alt;
            result.hero = { ...series.hero, media: video };
        }
    }
    return result;
}
