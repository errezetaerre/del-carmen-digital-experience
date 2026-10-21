import type { Artwork } from "@/domains/artworks/model/artwork";

export type ArtworkViewerMode = "standard" | "glass";
const locationEvent = "del-carmen:artwork-viewer-location";

export function subscribeArtworkViewerLocation(listener: () => void) {
    window.addEventListener("popstate", listener);
    window.addEventListener(locationEvent, listener);
    return () => {
        window.removeEventListener("popstate", listener);
        window.removeEventListener(locationEvent, listener);
    };
}

export function artworkViewerLocation() {
    return window.location.pathname + window.location.search + window.location.hash;
}

export function artworkViewerHref(slug: string, mode?: ArtworkViewerMode) {
    const url = new URL(window.location.href);
    url.searchParams.set("artwork", slug);
    if (mode) url.searchParams.set("experience", mode);
    else url.searchParams.delete("experience");
    return url.pathname + url.search + url.hash;
}

export function selectArtworkInViewer(artwork: Artwork, mode?: ArtworkViewerMode, open = false) {
    const href = artworkViewerHref(artwork.slug, mode);
    if (href === artworkViewerLocation()) return;
    if (open) window.history.pushState(null, "", href);
    else window.history.replaceState(null, "", href);
    window.dispatchEvent(new Event(locationEvent));
}

export function closeArtworkViewerLocation() {
    const url = new URL(window.location.href);
    url.searchParams.delete("artwork");
    url.searchParams.delete("experience");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    window.dispatchEvent(new Event(locationEvent));
}
