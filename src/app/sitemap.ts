import type { MetadataRoute } from "next";
import { isIndexableDeployment } from "@/config/seo";
import { getCatalogueSitemapPaths } from "@/server/catalogue/sitemapSource";
import { getJournalEntries } from "@/domains/journal/data/journalEntries";
import { locales } from "@/i18n/config";
import { isIndexablePage, pageLanguageAlternates, publicPageUrl } from "@/shared/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    if (!isIndexableDeployment) return [];
    const paths = [
        "/", "/about", "/artist", "/artworks", "/collections", "/contact", "/journal",
        ...await getCatalogueSitemapPaths(),
        ...getJournalEntries().map((entry) => `/journal/${entry.slug}`),
    ];
    return locales.flatMap((locale) => paths.filter((path) => isIndexablePage(path, locale)).map((path) => {
        const languages = pageLanguageAlternates(path);
        return { url: publicPageUrl(path, locale), ...(languages ? { alternates: { languages } } : {}) };
    }));
}
