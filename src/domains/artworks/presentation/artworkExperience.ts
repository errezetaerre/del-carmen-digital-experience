// Viewport-sized emulators do not always emulate a coarse primary pointer.
// Larger touch tablets can also report a fine pointer when a mouse is paired.
export const LANDSCAPE_ARTBOOK_ENTRY_QUERY = "(orientation: landscape) and (min-width: 640px) and (min-height: 300px) and (max-width: 1366px), (orientation: landscape) and (min-width: 640px) and (min-height: 300px) and (any-pointer: coarse)";

export function artworkExperienceHref(slug: string, navigationQuery: string, experience: "glass" | "standard") {
    const query = new URLSearchParams(navigationQuery);
    query.set("experience", experience);
    return `/artworks/${encodeURIComponent(slug)}?${query.toString()}`;
}

/** Only the reader keeps its bookmark and page density. Archive filters travel in both directions. */
export function artworkArchiveHref(mode: "glass" | "standard", navigationQuery: string, bookmark?: string) {
    const params = new URLSearchParams(navigationQuery);
    params.delete("experience");
    if (mode === "standard") {
        params.delete("artwork");
        params.delete("perPage");
    } else if (bookmark) params.set("artwork", bookmark);
    const query = params.toString();
    return (mode === "glass" ? "/artbook" : "/artworks") + (query ? "?" + query : "");
}

/** next-intl supplies the pathname without its locale prefix. */
export function isNativeArtbookRoute(pathname: string) {
    return /^\/(?:artbook|artworks(?:\/[^/]+)?|series\/[^/]+)?\/?$/.test(pathname);
}
