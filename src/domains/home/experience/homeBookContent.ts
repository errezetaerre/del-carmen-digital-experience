import type { SiteLocale } from "@/i18n/config";
import { localizeArtwork } from "@/i18n/artworkCopy";
import { localizeArtworkSeries } from "@/i18n/seriesCopy";
import { localizeJournalEntry } from "@/i18n/journalCopy";
import { getJournalEntries } from "@/domains/journal/data/journalEntries";
import { getFeaturedCollection, getFeaturedWorkArtwork, getHeroArtwork, getSelectedWorks } from "../services";

import { HOME_BOOK_CHAPTERS } from "./homeBookChapters";
import { homeVisualAssets } from "../curation/homeVisualAssets";
import type { ArtworkImage } from "@/domains/artworks/model/artwork";
export { HOME_BOOK_CHAPTERS, type HomeBookChapter } from "./homeBookChapters";

/** A presentation of the existing catalogue, never a second Home catalogue. */
export function getHomeBookContent(locale: SiteLocale) {
    const hero = getHeroArtwork(), featured = getFeaturedWorkArtwork(), collection = getFeaturedCollection();
    const selected = getSelectedWorks().map(work => localizeArtwork(work, locale));
    const journal = getJournalEntries().slice(0, 4).map(entry => localizeJournalEntry(entry, locale));
    return {
        hero: hero ? localizeArtwork(hero, locale) : undefined,
        featured: featured ? localizeArtwork(featured, locale) : undefined,
        collection: collection ? {
            ...collection,
            series: localizeArtworkSeries(collection.series, locale),
            coverArtwork: localizeArtwork(collection.coverArtwork, locale),
            artworks: collection.artworks.map(work => localizeArtwork(work, locale)),
            landscapeImage: (homeVisualAssets.collectionSpread as Record<string, ArtworkImage>)[collection.series.id] ??
                collection.series.images?.featured ?? collection.coverArtwork.images.collection ?? collection.coverArtwork.images.primary,
            portraitImage: collection.coverArtwork.images.collection ?? collection.coverArtwork.images.primary,
        } : undefined,
        selected, journal,
        chapters: HOME_BOOK_CHAPTERS.filter(chapter => chapter === "cover" ? !!hero : chapter === "featured" ? !!featured :
            chapter === "collections" ? !!collection : chapter === "artworks" ? selected.length > 0 : chapter === "journal" ? journal.length > 0 : true),
    };
}
export type HomeBookContent = ReturnType<typeof getHomeBookContent>;

/** Decode the visible portion and the adjacent leaf, not a full offscreen gallery. */
export function visibleHomeBookImages(page: HTMLElement): HTMLImageElement[] {
    const bounds = page.getBoundingClientRect();
    return Array.from(page.querySelectorAll<HTMLImageElement>("img")).filter(image => {
        const rect = image.getBoundingClientRect();
        const scroll = image.closest<HTMLElement>("[data-home-native-scroll], [data-lightbox-native-scroll]")?.getBoundingClientRect() ?? bounds;
        return rect.width > 0 && rect.height > 0 && rect.right > Math.max(bounds.left, scroll.left) &&
            rect.left < Math.min(bounds.right, scroll.right) && rect.bottom > Math.max(bounds.top, scroll.top) &&
            rect.top < Math.min(bounds.bottom, scroll.bottom);
    });
}
