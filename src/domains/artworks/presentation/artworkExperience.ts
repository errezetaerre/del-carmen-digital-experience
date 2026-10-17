export const MOBILE_LANDSCAPE_ENTRY_QUERY = "(pointer: coarse) and (orientation: landscape) and (min-width: 640px) and (min-height: 300px) and (max-height: 600px)";

export function artworkExperienceHref(slug: string, navigationQuery: string, experience: "glass" | "standard") {
    const query = new URLSearchParams(navigationQuery);
    query.set("experience", experience);
    return `/artworks/${slug}?${query.toString()}`;
}
