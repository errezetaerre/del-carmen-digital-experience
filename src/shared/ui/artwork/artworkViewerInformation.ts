import type { Artwork } from "@/domains/artworks/model/artwork";
import { getArtworkPresentation } from "@/domains/artworks/presentation/getArtworkPresentation";
import { artworkTextLocale, formatArtworkTechnique } from "@/i18n/artworkCopy";
import { localizeHref, type SiteLocale } from "@/i18n/config";
import { getSiteMessages } from "@/i18n/messages";
import { glassSeparatorMarkup } from "./glassAccents";
import reading from "./ArtworkReadingPanel.module.css";

export function escapeArtworkHtml(value: unknown) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

export function artworkViewerInformation(artwork: Artwork, locale: SiteLocale, options: {
    id: string; detailsQuery?: string; detailsLabel: string; showDetails: boolean; showAllWorks: boolean;
}) {
    const escape = escapeArtworkHtml;
    const query = new URLSearchParams(options.detailsQuery);
    query.set("experience", "glass");
    const details = localizeHref(`/artworks/${artwork.slug}?${query.toString()}`, locale);
    const copy = getSiteMessages(locale).Artwork;
    return `<section class="${reading.information}" data-gallery-information><div class="${reading.normal}" data-reader-normal><small class="font-sans text-[10px] font-medium uppercase tracking-[0.30em] text-brand-gold/90 md:text-xs">${escape(getArtworkPresentation(artwork, locale).yearLabel)}</small>
        <h2 class="font-display text-2xl font-light leading-[1.05] tracking-[0.01em] text-white md:text-3xl">${escape(artwork.title)}</h2>
        <p class="mt-4 font-sans text-[9px] uppercase tracking-[0.18em] text-white/45 md:text-[10px]">${escape(formatArtworkTechnique(artwork, locale))} · ${artwork.dimensions.width} × ${artwork.dimensions.height} ${escape(artwork.dimensions.unit)}</p>
        <div class="rule" aria-hidden="true">${glassSeparatorMarkup(options.id)}</div>
        <p lang="${artworkTextLocale(artwork, locale)}" class="${reading.preview} font-sans text-sm font-light leading-7 text-white/45">${escape(artwork.description)}</p>
        <button type="button" class="${reading.toggle} font-sans" data-artwork-reading-toggle data-lightbox-description-toggle aria-expanded="false" aria-controls="${escape(options.id)}-reading">${escape(copy.readMore)}</button>
        ${options.showDetails ? `<div data-gallery-actions class="mt-6 flex flex-wrap items-center gap-5 font-sans text-[10px] uppercase tracking-[0.18em] text-white/60"><a class="inline-flex min-h-11 items-center transition-colors hover:text-brand-gold" href="${escape(details)}">${escape(options.detailsLabel)} →</a>${options.showAllWorks ? `<a class="inline-flex min-h-11 items-center transition-colors hover:text-brand-gold" href="${escape(localizeHref("/artworks", locale))}">${escape(copy.viewAll)}</a>` : ""}</div>` : ""}</div>
        <div id="${escape(options.id)}-reading" class="${reading.panel}" data-artwork-reading-panel hidden>
            <div class="${reading.backdrop}" aria-hidden="true"></div>
            <div class="${reading.scroll} font-sans" role="region" aria-label="${escape(copy.descriptionOf.replace("{title}", artwork.title))}" tabindex="0" data-lightbox-native-scroll lang="${artworkTextLocale(artwork, locale)}">
                <p>${escape(artwork.description)}</p><button type="button" class="${reading.close}" data-artwork-reading-toggle>${escape(copy.readLess)}</button>
            </div>
        </div></section>`;
}
