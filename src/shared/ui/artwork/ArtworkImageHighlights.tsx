"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { Artwork } from "@/domains/artworks/model/artwork";
import { getArtworkPresentation } from "@/domains/artworks/presentation/getArtworkPresentation";
import ArtworkBadges from "./ArtworkBadges";
import styles from "./ArtworkImageHighlights.module.css";

// Measure the painted rectangle, including object-contain letterboxing, so the
// insignia follows the image's left edge rather than its surrounding column.
export default function ArtworkImageHighlights({ artwork, children, className = "" }: { artwork: Artwork; children: ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const hasHighlights = getArtworkPresentation(artwork).badges.some((badge) => badge.kind !== "planned" && badge.kind !== "in-progress");

    useEffect(() => {
        const root = ref.current;
        const image = root?.querySelector<HTMLImageElement>("img");
        const preview = root?.querySelector<HTMLElement>("[data-artwork-preview]");
        const anchor = preview ?? image;
        if (!root || !anchor || !hasHighlights) return;
        const panel = root.closest<HTMLElement>("[data-lightbox-panel]");
        const measure = () => {
            const parent = root.getBoundingClientRect(), box = anchor.getBoundingClientRect();
            if (!box.width || !box.height || (!preview && (!image?.naturalWidth || !image.naturalHeight))) return;
            const contained = !preview && image ? getComputedStyle(image).objectFit === "contain" : false;
            const scale = image ? Math.min(box.width / image.naturalWidth, box.height / image.naturalHeight) : 1;
            const width = contained && image ? image.naturalWidth * scale : box.width;
            const height = contained && image ? image.naturalHeight * scale : box.height;
            const bottom = box.top + (box.height + height) / 2;
            root.style.setProperty("--halo-left", `${Math.max(0, box.left - parent.left + (box.width - width) / 2)}px`);
            root.style.setProperty("--halo-top", `${bottom - parent.top + 3}px`);
            root.style.setProperty("--halo-width", `${Math.min(width, parent.width)}px`);
            root.dataset.haloReady = "true";
            if (panel) {
                const dots = panel.querySelector<HTMLElement>("[data-lightbox-position-dots]");
                const caption = panel.querySelector<HTMLElement>("[data-lightbox-caption]");
                const gap = (dots?.getBoundingClientRect().top ?? caption?.getBoundingClientRect().top ?? parent.bottom) - bottom;
                // Add only missing space below the painting. The panel and dots
                // grow equally, keeping the image stage's dimensions unchanged.
                panel.style.setProperty("--halo-clearance", panel.dataset.lightboxLayout === "landscape" ? "0px" : `${Math.ceil(Math.max(0, 48 - gap))}px`);
            } else {
                root.style.setProperty("--halo-reserve", `${Math.ceil(Math.max(0, 48 - (parent.bottom - bottom)))}px`);
            }
        };
        const observer = new ResizeObserver(measure);
        observer.observe(root); observer.observe(anchor);
        image?.addEventListener("load", measure); measure();
        return () => {
            observer.disconnect(); image?.removeEventListener("load", measure);
            panel?.style.removeProperty("--halo-clearance");
            root.style.removeProperty("--halo-reserve"); delete root.dataset.haloReady;
        };
    }, [artwork.id, hasHighlights]);

    return <div ref={ref} className={`${styles.root} ${className}`}>
        {children}
        {hasHighlights && <div className={styles.highlights} data-lightbox-content="true"><ArtworkBadges key={artwork.id} artwork={artwork} /></div>}
    </div>;
}
