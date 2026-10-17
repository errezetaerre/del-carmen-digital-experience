// Viewport-sized emulators do not always emulate a coarse primary pointer.
// Larger touch tablets can also report a fine pointer when a mouse is paired.
export const LANDSCAPE_ARTBOOK_ENTRY_QUERY = "(orientation: landscape) and (min-width: 640px) and (min-height: 300px) and (max-width: 1366px), (orientation: landscape) and (min-width: 640px) and (min-height: 300px) and (any-pointer: coarse)";

export function artworkExperienceHref(slug: string, navigationQuery: string, experience: "glass" | "standard") {
    const query = new URLSearchParams(navigationQuery);
    query.set("experience", experience);
    return `/artworks/${slug}?${query.toString()}`;
}
