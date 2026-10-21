import { LANDSCAPE_ARTBOOK_ENTRY_QUERY } from "./artworkExperience";
import { PORTRAIT_ARTBOOK_QUERY } from "../components/portrait-artbook/portraitArtbookViewport";

export const GLASS_BOOK_QUERY = "(min-width:1024px) and (hover:hover) and (pointer:fine), (min-width:640px) and (min-height:300px) and (orientation:landscape)";
// A resized desktop must switch both Standard and Artbook at the same width.
// Short landscape phones keep the approved two-page composition.
const COMPACT_DESKTOP_QUERY = "(max-width:1119px) and (min-height:600px) and (hover:hover) and (pointer:fine), (max-width:799px) and (min-height:601px)";

export function artworkBookViewport(): "portrait" | "landscape" | "unsupported" {
    if (window.matchMedia(PORTRAIT_ARTBOOK_QUERY).matches || window.matchMedia(COMPACT_DESKTOP_QUERY).matches) return "portrait";
    return window.matchMedia(GLASS_BOOK_QUERY).matches ? "landscape" : "unsupported";
}

export function subscribeArtworkBookViewport(listener: () => void) {
    const queries = [PORTRAIT_ARTBOOK_QUERY, COMPACT_DESKTOP_QUERY, GLASS_BOOK_QUERY].map(query => window.matchMedia(query));
    queries.forEach(query => query.addEventListener("change", listener));
    return () => queries.forEach(query => query.removeEventListener("change", listener));
}

export function defaultArtworkViewerMode(): "glass" | "standard" {
    return window.matchMedia(PORTRAIT_ARTBOOK_QUERY).matches || window.matchMedia(LANDSCAPE_ARTBOOK_ENTRY_QUERY).matches
        ? "glass" : "standard";
}
