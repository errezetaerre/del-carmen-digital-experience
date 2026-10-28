import { artworkViewerLocation, selectArtworkInViewer, subscribeArtworkViewerLocation } from "@/shared/ui/artwork/artworkViewerLocation";
import type { Artwork } from "@/domains/artworks/model/artwork";
import { localizeHref, type SiteLocale } from "@/i18n/config";

export type SeriesView = "standard" | "glass";
export const SERIES_SPREAD_QUERY = "(min-width:1024px) and (min-height:640px) and (orientation:landscape)";
const eventName = "del-carmen:series-experience-location";

export const seriesExperienceLocation = artworkViewerLocation;
/** Thumbnail/Discover inherits the collection mode instead of the viewport default. */
export function openSeriesArtwork(artwork: Artwork, view: SeriesView) {
    selectArtworkInViewer(artwork, view, true);
}
export function subscribeSeriesExperience(listener: () => void) {
    const unsubscribe = subscribeArtworkViewerLocation(listener);
    window.addEventListener(eventName, listener);
    return () => { unsubscribe(); window.removeEventListener(eventName, listener); };
}
export function seriesHref(slug: string, view: SeriesView) {
    return `/series/${encodeURIComponent(slug)}?view=${view}`;
}
export function selectSeries(slug: string, view: SeriesView, locale: SiteLocale, push = true) {
    const url = new URL(window.location.href);
    url.pathname = localizeHref(`/series/${encodeURIComponent(slug)}`, locale);
    url.searchParams.set("view", view);
    url.searchParams.delete("artwork"); url.searchParams.delete("experience"); url.hash = "";
    const href = url.pathname + url.search;
    if (href === artworkViewerLocation()) return;
    if (push) window.history.pushState(null, "", href); else window.history.replaceState(null, "", href);
    window.dispatchEvent(new Event(eventName));
}
/** Preference synchronization must not dismiss an open artwork dialog. */
export function synchronizeSeriesView(view: SeriesView) {
    const url = new URL(window.location.href);
    if (url.searchParams.get("view") === view) return;
    url.searchParams.set("view", view);
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    window.dispatchEvent(new Event(eventName));
}
export function subscribeSeriesSpread(listener: () => void) {
    const media = window.matchMedia(SERIES_SPREAD_QUERY);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
}
export function seriesSpread() { return window.matchMedia(SERIES_SPREAD_QUERY).matches; }

/** Readiness is limited to the panorama and the visible row, never every gallery image. */
export function visibleSeriesImages(page: HTMLElement): HTMLImageElement[] {
    const bounds = page.getBoundingClientRect();
    return Array.from(page.querySelectorAll<HTMLImageElement>("img")).filter(image => {
        if (image.closest("[data-series-atmosphere]")) return true;
        const box = image.getBoundingClientRect();
        const clip = image.closest<HTMLElement>("[data-series-gallery-viewport]")?.getBoundingClientRect() ?? bounds;
        return box.width > 0 && box.height > 0 && box.right > bounds.left && box.left < bounds.right &&
            box.bottom > bounds.top && box.top < bounds.bottom && box.right > clip.left && box.left < clip.right &&
            box.bottom > clip.top && box.top < clip.bottom;
    });
}
