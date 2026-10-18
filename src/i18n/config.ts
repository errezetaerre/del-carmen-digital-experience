export const locales = ["en", "es"] as const;
export type SiteLocale = (typeof locales)[number];
export const defaultLocale: SiteLocale = "en";

export function isSiteLocale(value: unknown): value is SiteLocale {
    return value === "en" || value === "es";
}

// Spanish is a reviewed pilot until the remaining editorial/legal content is localized.
export const spanishReleaseReady = false;

export function stripLocalePrefix(pathname: string): string {
    return pathname.replace(/^\/(?:en|es)(?=\/|$)/, "") || "/";
}

// Native history and plain anchors need the same paths as the localized Link/router.
export function localizeHref(href: string, locale: SiteLocale): string {
    if (!href.startsWith("/") || href.startsWith("//")) return href;
    const boundary = href.search(/[?#]/);
    const pathname = boundary < 0 ? href : href.slice(0, boundary);
    const suffix = boundary < 0 ? "" : href.slice(boundary);
    if (/^\/(?:api|_next|_vercel)(?:\/|$)/.test(pathname) || /\.[^/]+$/.test(pathname)) return href;
    const path = stripLocalePrefix(pathname);
    return (locale === "es" ? `/es${path === "/" ? "" : path}` : path) + suffix;
}
