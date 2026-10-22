import type { Artwork } from "../model/artwork";
import type { SiteLocale } from "@/i18n/config";
import { isFeaturedArtwork } from "./getArtworkPresentation";

export const artworkArchiveSorts = ["archive", "newest", "oldest", "title"] as const;
export type ArtworkArchiveSort = (typeof artworkArchiveSorts)[number];
export type ArtworkArchiveFacet = "category" | "year" | "medium";

export interface ArtworkArchiveFilters {
    category: string;
    year: number | "all";
    medium: Artwork["medium"] | "all";
    featured: boolean;
    search: string;
    sort: ArtworkArchiveSort;
}

const categoryOrder = ["portrait", "figurative", "spiritual", "symbolic", "still-life"];
const mediumOrder = ["oil", "graphite", "charcoal", "mixed-media"];

function preferredOrder(a: string, b: string, preferred: readonly string[]) {
    const first = preferred.indexOf(a), second = preferred.indexOf(b);
    if (first >= 0 || second >= 0) return (first < 0 ? preferred.length : first) - (second < 0 ? preferred.length : second);
    return a.localeCompare(b);
}

export function getArtworkArchiveOptions(artworks: readonly Artwork[]) {
    return {
        categories: [...new Set(artworks.flatMap((artwork) => artwork.categories))].sort((a, b) => preferredOrder(a, b, categoryOrder)),
        years: [...new Set(artworks.map((artwork) => artwork.year))].sort((a, b) => b - a),
        mediums: [...new Set(artworks.map((artwork) => artwork.medium))].sort((a, b) => preferredOrder(a, b, mediumOrder)),
    };
}

export function readArtworkArchiveFilters(artworks: readonly Artwork[], query: { get: (key: string) => string | null }): ArtworkArchiveFilters {
    const options = getArtworkArchiveOptions(artworks);
    const category = query.get("category"), year = Number(query.get("year")), medium = query.get("medium"), sort = query.get("sort");
    return {
        category: category && options.categories.includes(category) ? category : "all",
        year: options.years.includes(year) ? year : "all",
        medium: medium && options.mediums.includes(medium as Artwork["medium"]) ? medium as Artwork["medium"] : "all",
        featured: query.get("featured") === "true",
        search: (query.get("q") ?? "").slice(0, 120),
        sort: artworkArchiveSorts.includes(sort as ArtworkArchiveSort) ? sort as ArtworkArchiveSort : "archive",
    };
}

function searchableTitle(value: string) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim().replace(/\s+/g, " ");
}

export function matchesArtworkArchive(artwork: Artwork, filters: ArtworkArchiveFilters, except?: ArtworkArchiveFacet) {
    return (except === "category" || filters.category === "all" || artwork.categories.includes(filters.category)) &&
        (except === "year" || filters.year === "all" || artwork.year === filters.year) &&
        (except === "medium" || filters.medium === "all" || artwork.medium === filters.medium) &&
        (!filters.featured || isFeaturedArtwork(artwork)) &&
        searchableTitle(artwork.title).includes(searchableTitle(filters.search));
}

// One selection/order contract serves the archive and detail Previous / Next.
// Canonical arrays and owner-entered records are never sorted in place.
export function selectArtworkArchive(artworks: readonly Artwork[], filters: ArtworkArchiveFilters, locale: SiteLocale): Artwork[] {
    const selected = artworks.filter((artwork) => matchesArtworkArchive(artwork, filters));
    if (filters.sort === "newest") selected.sort((a, b) => b.year - a.year);
    else if (filters.sort === "oldest") selected.sort((a, b) => a.year - b.year);
    else if (filters.sort === "title") {
        const titles = new Intl.Collator(locale, { sensitivity: "base", numeric: true });
        selected.sort((a, b) => titles.compare(a.title, b.title));
    }
    return selected;
}

export function artworkArchiveQuery(filters: ArtworkArchiveFilters) {
    const query = new URLSearchParams();
    if (filters.category !== "all") query.set("category", filters.category);
    if (filters.year !== "all") query.set("year", String(filters.year));
    if (filters.medium !== "all") query.set("medium", filters.medium);
    if (filters.featured) query.set("featured", "true");
    if (filters.search) query.set("q", filters.search);
    if (filters.sort !== "archive") query.set("sort", filters.sort);
    return query;
}
