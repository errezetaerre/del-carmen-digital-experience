import type { Artwork } from "../model/artwork";
import { compareArtworkDates, getArtworkYear } from "../model/artworkDate";
import type { SiteLocale } from "@/i18n/config";
import { isFeaturedArtwork } from "./getArtworkPresentation";

export const artworkArchiveSorts = ["newest", "oldest", "title"] as const;
export type ArtworkArchiveSort = (typeof artworkArchiveSorts)[number];
export const defaultArtworkArchiveSort: ArtworkArchiveSort = "newest";
export const artworkArchiveCreationStatuses = ["completed", "in-progress", "planned"] as const satisfies readonly Artwork["creationStatus"][];
export const defaultArtworkArchiveCreationStatus: Artwork["creationStatus"] = "completed";
export type ArtworkArchiveFacet = "category" | "year" | "medium" | "creationStatus";

export interface ArtworkArchiveFilters {
    creationStatus: Artwork["creationStatus"];
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

// Keep the filter vocabulary across states so changing creation status does not
// silently clear another selected facet. Counts use the current selection.
export function getArtworkArchiveOptions(artworks: readonly Artwork[]) {
    return {
        categories: [...new Set(artworks.flatMap((artwork) => artwork.categories))].sort((a, b) => preferredOrder(a, b, categoryOrder)),
        years: [...new Set(artworks.map((artwork) => getArtworkYear(artwork.date)))].sort((a, b) => b - a),
        mediums: [...new Set(artworks.map((artwork) => artwork.medium))].sort((a, b) => preferredOrder(a, b, mediumOrder)),
    };
}

export function readArtworkArchiveFilters(artworks: readonly Artwork[], query: { get: (key: string) => string | null }): ArtworkArchiveFilters {
    const options = getArtworkArchiveOptions(artworks);
    const category = query.get("category"), year = Number(query.get("year")), medium = query.get("medium"), sort = query.get("sort");
    const creationStatus = query.get("creationStatus");
    return {
        creationStatus: artworkArchiveCreationStatuses.includes(creationStatus as Artwork["creationStatus"]) ? creationStatus as Artwork["creationStatus"] : defaultArtworkArchiveCreationStatus,
        category: category && options.categories.includes(category) ? category : "all",
        year: options.years.includes(year) ? year : "all",
        medium: medium && options.mediums.includes(medium as Artwork["medium"]) ? medium as Artwork["medium"] : "all",
        featured: query.get("featured") === "true",
        search: (query.get("q") ?? "").slice(0, 120),
        sort: artworkArchiveSorts.includes(sort as ArtworkArchiveSort) ? sort as ArtworkArchiveSort : defaultArtworkArchiveSort,
    };
}

function searchableTitle(value: string) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim().replace(/\s+/g, " ");
}

export function matchesArtworkArchive(artwork: Artwork, filters: ArtworkArchiveFilters, except?: ArtworkArchiveFacet) {
    return (except === "creationStatus" || artwork.creationStatus === filters.creationStatus) &&
        (except === "category" || filters.category === "all" || artwork.categories.includes(filters.category)) &&
        (except === "year" || filters.year === "all" || getArtworkYear(artwork.date) === filters.year) &&
        (except === "medium" || filters.medium === "all" || artwork.medium === filters.medium) &&
        (!filters.featured || isFeaturedArtwork(artwork)) &&
        searchableTitle(artwork.title).includes(searchableTitle(filters.search));
}

// Completed is the default; other creation states require explicit selection.
// The archive and its detail Previous / Next share this selection/order contract.
// Series detail keeps its own complete membership sequence.
// Canonical arrays and owner-entered records are never sorted in place.
export function selectArtworkArchive(artworks: readonly Artwork[], filters: ArtworkArchiveFilters, locale: SiteLocale): Artwork[] {
    const selected = artworks.filter((artwork) => matchesArtworkArchive(artwork, filters));
    const titles = new Intl.Collator(locale, { sensitivity: "base", numeric: true });
    selected.sort((a, b) => {
        const byDate = filters.sort === "title" ? 0 : compareArtworkDates(a.date, b.date, filters.sort);
        return byDate || titles.compare(a.title, b.title) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    });
    return selected;
}

export function artworkArchiveQuery(filters: ArtworkArchiveFilters) {
    const query = new URLSearchParams();
    if (filters.creationStatus !== defaultArtworkArchiveCreationStatus) query.set("creationStatus", filters.creationStatus);
    if (filters.category !== "all") query.set("category", filters.category);
    if (filters.year !== "all") query.set("year", String(filters.year));
    if (filters.medium !== "all") query.set("medium", filters.medium);
    if (filters.featured) query.set("featured", "true");
    if (filters.search) query.set("q", filters.search);
    if (filters.sort !== defaultArtworkArchiveSort) query.set("sort", filters.sort);
    return query;
}
