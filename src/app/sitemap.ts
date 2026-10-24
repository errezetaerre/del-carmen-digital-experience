import type { MetadataRoute } from "next";
import { isIndexableDeployment } from "@/config/seo";
import { getArtworks } from "@/domains/artworks/services/getArtworks";
import { getArtworkSeries } from "@/domains/artworks/series/services";
import { getJournalEntries } from "@/domains/journal/data/journalEntries";
import { locales } from "@/i18n/config";
import { isIndexablePage, pageLanguageAlternates, publicPageUrl } from "@/shared/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
    if (!isIndexableDeployment) return [];
    const paths = [
        "/", "/about", "/artist", "/artworks", "/collections", "/contact", "/journal",
        ...getArtworks().map((artwork) => `/artworks/${artwork.slug}`),
        ...getArtworkSeries().map((series) => `/series/${series.slug}`),
        ...getJournalEntries().map((entry) => `/journal/${entry.slug}`),
    ];
    return locales.flatMap((locale) => paths.filter((path) => isIndexablePage(path, locale)).map((path) => {
        const languages = pageLanguageAlternates(path);
        return { url: publicPageUrl(path, locale), ...(languages ? { alternates: { languages } } : {}) };
    }));
}
