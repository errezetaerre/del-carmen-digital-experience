"use client";

import { useId, useRef, useState, type ReactNode, type RefObject } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "@/i18n/navigation";
import { artworkTextLocale, formatArtworkTechnique } from "@/i18n/artworkCopy";
import type { Artwork } from "@/domains/artworks/model/artwork";
import { getArtworkPresentation } from "@/domains/artworks/presentation/getArtworkPresentation";
import ArtworkDetailViewer from "@/domains/artworks/components/ArtworkDetailViewer";
import ArtworkImageHighlights from "./ArtworkImageHighlights";
import ArtworkComingSoon from "./ArtworkComingSoon";
import ArtworkLinkFeedback from "./ArtworkLinkFeedback";
import ArtworkMovingDescription from "./ArtworkMovingDescription";
import ArtworkArrivalAccent from "./ArtworkArrivalEffect";
import { glassSeparatorMarkup } from "./glassAccents";
import glass from "./ArtworkLightbox.module.css";
import styles from "./ArtworkExperienceViewer.module.css";

/** One portrait composition supplies identical geometry to both gallery modes. */
export default function ArtworkViewerEditorial({ artwork, portalTarget, detailsQuery, detailsLabel, showDetails, showAllWorks,
    standard = false, positionDots, zoomLayerRef, readingExpanded, onReadingChange, hint }: {
    artwork: Artwork; portalTarget: HTMLElement | null; detailsQuery?: string; detailsLabel: string; showDetails: boolean; showAllWorks: boolean;
    standard?: boolean; positionDots?: ReactNode; zoomLayerRef?: RefObject<HTMLDivElement | null>;
    readingExpanded?: boolean; onReadingChange?(expanded: boolean): void; hint?: ReactNode;
}) {
    const locale = useLocale(), t = useTranslations("Artwork");
    const [ownExpanded, setOwnExpanded] = useState(false), [readingActive, setReadingActive] = useState(false);
    const expanded = readingExpanded ?? ownExpanded;
    const setExpanded = onReadingChange ?? setOwnExpanded;
    const readButton = useRef<HTMLButtonElement>(null), previewSlot = useRef<HTMLDivElement>(null);
    const id = `gallery${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const query = new URLSearchParams(detailsQuery);
    query.set("experience", standard ? "standard" : "glass");
    const hasHighlights = getArtworkPresentation(artwork, locale).badges.some(badge => badge.kind !== "planned" && badge.kind !== "in-progress");
    function closeReading() {
        setExpanded(false);
        // Focus returns after the reverse motion, without scrolling the page.
    }
    return <div className={styles.editorial} data-gallery-editorial data-portrait-sheet>
        <div className={styles.artwork} data-artwork-reading-boundary>
            <ArtworkImageHighlights artwork={artwork} className={glass.imageWrapper}>
                <div className={glass.imageMask}>
                    <div ref={zoomLayerRef} className={glass.zoomViewport} data-artwork-arrival-zoom data-lightbox-content="true">
                        {artwork.creationStatus !== "completed" ? <ArtworkComingSoon artwork={artwork} /> :
                            // The rigid-page controller decodes and clones this same approved source.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={artwork.images.primary.src} alt={artwork.images.primary.alt} draggable={false} decoding="async" className={glass.primaryImage} data-artwork-arrival-photo />}
                        <div className={glass.imageShade} aria-hidden="true" />
                        {standard && <div className={glass.imageReflection} aria-hidden="true" />}
                    </div>
                </div>
                {standard && hasHighlights && artwork.creationStatus === "completed" && <ArtworkArrivalAccent key={artwork.id} artworkId={artwork.id} surface="lightbox" />}
            </ArtworkImageHighlights>
            {!standard && <ArtworkDetailViewer artwork={artwork} triggerOnly portalTarget={portalTarget} />}
            {hint}
        </div>
        {positionDots ?? <div className={styles.positionSpacer} data-lightbox-position-dots aria-hidden="true" />}
        <div className={styles.caption} data-lightbox-caption data-description-expanded={expanded || readingActive || undefined} inert={expanded || readingActive}>
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.30em] text-brand-gold/90 md:text-xs">{getArtworkPresentation(artwork, locale).yearLabel}</p>
            <h2 className="font-display text-2xl font-light leading-[1.05] tracking-[0.01em] md:text-3xl">{artwork.title}</h2>
            <div className={`${styles.metadata} font-sans text-[9px] uppercase tracking-[0.18em] text-white/45 md:text-[10px]`}>
                <span>{formatArtworkTechnique(artwork, locale)}</span><span className="mx-3 text-brand-gold/40">·</span>
                <span>{artwork.dimensions.width} × {artwork.dimensions.height} {artwork.dimensions.unit}</span>
            </div>
            <div className={styles.separator} aria-hidden="true" dangerouslySetInnerHTML={{ __html: glassSeparatorMarkup(id) }} />
            <div className={styles.descriptionSlot}>
                <div ref={previewSlot} className={styles.descriptionPlaceholder} data-artwork-description-slot aria-hidden="true" />
                <button ref={readButton} className={`${styles.readButton} font-sans text-[9px] uppercase tracking-[0.18em] text-white/60 hover:text-brand-gold`}
                    type="button" data-lightbox-description-toggle aria-expanded={expanded} aria-controls={`${id}-description`}
                    onClick={() => setExpanded(!expanded)}>{t(expanded ? "readLess" : "readMore")}</button>
            </div>
            <div className={`${styles.actions} font-sans text-[9px] uppercase tracking-[0.16em] text-white/55 md:text-[10px] md:tracking-[0.22em]`}>
                {showDetails && <Link href={`/artworks/${artwork.slug}?${query.toString()}`}>{detailsLabel} →<ArtworkLinkFeedback /></Link>}
                {showAllWorks && <><span aria-hidden="true" className="h-3 w-px bg-white/15" /><Link href="/artworks">{t("viewAll")} →</Link></>}
            </div>
        </div>
        <ArtworkMovingDescription id={`${id}-description`} title={artwork.title} description={artwork.description}
            lang={artworkTextLocale(artwork, locale)} expanded={expanded} previewSlot={previewSlot} onClose={closeReading}
            onActiveChange={active => { setReadingActive(active); if (!active && readingActive) requestAnimationFrame(() => readButton.current?.focus({ preventScroll: true })); }} />
    </div>;
}
