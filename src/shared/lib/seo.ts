import { isIndexableDeployment, siteOrigin } from "@/config/seo";
import { localizeHref, spanishReleaseReady, type SiteLocale } from "@/i18n/config";

export function publicPageUrl(pathname: string, locale: SiteLocale): string {
    // Experience, filters and selected artwork do not create another canonical page.
    const cleanPath = pathname.split(/[?#]/, 1)[0];
    if (!cleanPath.startsWith("/") || cleanPath.startsWith("//")) {
        throw new Error("SEO paths must be internal absolute paths.");
    }
    return new URL(localizeHref(cleanPath, locale), siteOrigin).href;
}

export function isIndexablePage(pathname: string, locale: SiteLocale): boolean {
    const path = new URL(publicPageUrl(pathname, "en")).pathname;
    return isIndexableDeployment && (locale !== "es" || spanishReleaseReady) &&
        path !== "/privacy" && path !== "/terms";
}

export function pageLanguageAlternates(pathname: string): Record<string, string> | undefined {
    // Never advertise the Spanish pilot or draft legal pages as released alternates.
    if (!spanishReleaseReady || !isIndexablePage(pathname, "en")) return undefined;
    return {
        en: publicPageUrl(pathname, "en"),
        es: publicPageUrl(pathname, "es"),
        "x-default": publicPageUrl(pathname, "en"),
    };
}
