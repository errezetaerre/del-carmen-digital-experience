import type { Artwork } from "@/domains/artworks/model/artwork";
import { artworkHaloSymbol } from "./artworkHaloSymbols";
import styles from "./ArtworkComingSoon.module.css";
import type { SiteLocale } from "@/i18n/config";
import { getSiteMessages } from "@/i18n/messages";

function escape(value: string): string {
    return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}

// One markup path ensures that the book uses the same approved icon placement.
export function artworkPreviewMarkup(artwork: Artwork, locale: SiteLocale = "en"): string {
    if (artwork.creationStatus === "completed") return "";
    const planned = artwork.creationStatus === "planned";
    const copy = getSiteMessages(locale).Artwork;
    const label = locale === "en" ? (planned ? "Coming Soon" : "In Progress") : planned ? copy.comingSoon : copy.inProgress;
    const description = copy.previewDescription.replace("{title}", artwork.title).replace("{label}", label).replace("{year}", String(artwork.year));
    const kind = planned ? "planned" : "in-progress";
    return `<div class="${styles.preview}" data-artwork-preview role="img" aria-label="${escape(description)}"><div class="${styles.fog}" aria-hidden="true"><img src="${escape(artwork.images.primary.src)}" alt="" loading="lazy" decoding="async" draggable="false"/></div><div class="${styles.mark}" aria-hidden="true"><span class="${styles.symbol}">${artworkHaloSymbol(kind)}</span><strong class="${styles.label}">${label}</strong></div></div>`;
}
