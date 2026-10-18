import type { ArtworkSeries, ArtworkSeriesStatus } from "@/domains/artworks/series/types";
import type { SiteLocale } from "./config";
import { getSiteMessages } from "./messages";
import translations from "./content/series.es.json";

interface SeriesTranslation {
    description?: string;
    statement?: string;
    featuredAlt?: string;
    hero?: { desktopAlt?: string; mobileAlt?: string; videoAlt?: string };
}

const spanishSeriesCopy: Readonly<Record<string, SeriesTranslation>> = translations;

function getCopy(id: string): SeriesTranslation | undefined {
    return Object.prototype.hasOwnProperty.call(spanishSeriesCopy, id) ? spanishSeriesCopy[id] : undefined;
}

export function seriesTextLocale(series: ArtworkSeries, locale: SiteLocale): SiteLocale {
    return locale === "es" && getCopy(series.id) ? "es" : "en";
}

// Only editorial text/alt changes: the canonical series name, layout, media,
// membership, year and status continue to come from ArtworkSeries.
export function localizeArtworkSeries(series: ArtworkSeries, locale: SiteLocale): ArtworkSeries {
    const copy = locale === "es" ? getCopy(series.id) : undefined;
    if (!copy) return series;
    const featured = series.images?.featured;
    const media = series.hero?.media;
    const hero = media && series.hero && copy.hero ? {
        ...series.hero,
        media: media.type === "image" ? {
            ...media,
            desktop: { ...media.desktop, alt: copy.hero.desktopAlt ?? media.desktop.alt },
            mobile: { ...media.mobile, alt: copy.hero.mobileAlt ?? media.mobile.alt },
        } : { ...media, ...(copy.hero.videoAlt ? { alt: copy.hero.videoAlt } : {}) },
    } : series.hero;
    return {
        ...series,
        ...(copy.description !== undefined ? { description: copy.description } : {}),
        ...(copy.statement !== undefined ? { statement: copy.statement } : {}),
        ...(featured && copy.featuredAlt ? { images: { ...series.images, featured: { ...featured, alt: copy.featuredAlt } } } : {}),
        ...(hero ? { hero } : {}),
    };
}

export function formatSeriesStatus(status: ArtworkSeriesStatus, locale: SiteLocale): string {
    return getSiteMessages(locale).Series[status];
}
