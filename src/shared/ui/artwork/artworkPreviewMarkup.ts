import type { Artwork } from "@/domains/artworks/model/artwork";
import { artworkHaloSymbol } from "./artworkHaloSymbols";
import styles from "./ArtworkComingSoon.module.css";

function escape(value: string): string {
    return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}

// One markup path ensures that the book uses the same approved icon placement.
export function artworkPreviewMarkup(artwork: Artwork): string {
    if (artwork.creationStatus === "completed") return "";
    const planned = artwork.creationStatus === "planned";
    const label = planned ? "Coming Soon" : "In Progress";
    const kind = planned ? "planned" : "in-progress";
    return `<div class="${styles.preview}" data-artwork-preview role="img" aria-label="${escape(`${artwork.title} — ${label}. Planned for ${artwork.year}. Preview colours behind frosted glass.`)}"><div class="${styles.fog}" aria-hidden="true"><img src="${escape(artwork.images.primary.src)}" alt="" loading="lazy" decoding="async" draggable="false"/></div><div class="${styles.mark}" aria-hidden="true"><span class="${styles.symbol}">${artworkHaloSymbol(kind)}</span><strong class="${styles.label}">${label}</strong></div></div>`;
}
