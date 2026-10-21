"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./ArtworkReadingPanel.module.css";

/** One reading surface below the painting, or over the right information page. */
export default function ArtworkReadingPanel({ id, title, description, lang, expanded, landscape = false, onClose }: {
    id: string; title: string; description?: string; lang?: string; expanded: boolean; landscape?: boolean; onClose(): void;
}) {
    const t = useTranslations("Artwork");
    const panel = useRef<HTMLDivElement>(null);
    const [bounds, setBounds] = useState({ top: 0, left: 0, height: 0 });
    useLayoutEffect(() => {
        const region = panel.current, parent = region?.parentElement;
        if (!expanded || !region || !parent) return;
        const scroller = parent.querySelector<HTMLElement>("[data-lightbox-interior]") ?? parent.closest<HTMLElement>("[data-portrait-reading]");
        const previousScroll = scroller?.scrollTop ?? 0;
        const previousOverflow = scroller?.style.overflowY ?? "";
        if (scroller) { scroller.scrollTop = 0; scroller.style.overflowY = "hidden"; }
        const boundary = parent.querySelector<HTMLElement>("[data-artwork-reading-boundary]");
        const caption = parent.querySelector<HTMLElement>("[data-lightbox-caption]");
        const coveredBadges = landscape ? [] : Array.from(parent.querySelectorAll<HTMLElement>("[data-artwork-highlights]"))
            .map(node => ({ node, inert: node.inert, hidden: node.getAttribute("aria-hidden") }));
        coveredBadges.forEach(({ node }) => { node.inert = true; node.setAttribute("aria-hidden", "true"); });
        const measure = () => {
            const origin = parent.getBoundingClientRect();
            const lowerEdge = Math.min(origin.bottom, scroller?.getBoundingClientRect().bottom ?? origin.bottom);
            let paintingBottom = boundary?.getBoundingClientRect().bottom ?? origin.top;
            const image = boundary?.querySelector<HTMLImageElement>("img");
            if (image?.naturalWidth && image.naturalHeight && getComputedStyle(image).objectFit === "contain") {
                const box = image.getBoundingClientRect();
                const scale = Math.min(box.width / image.naturalWidth, box.height / image.naturalHeight);
                paintingBottom = box.top + (box.height + image.naturalHeight * scale) / 2;
            }
            const top = landscape ? 0 : Math.max(0, paintingBottom - origin.top);
            const left = landscape ? Math.max(0, (caption?.getBoundingClientRect().left ?? origin.left) - origin.left) : 0;
            setBounds({ top, left, height: Math.max(44, lowerEdge - origin.top - top) });
        };
        const observer = new ResizeObserver(measure);
        observer.observe(parent); if (boundary) observer.observe(boundary);
        measure(); region.querySelector<HTMLElement>("[data-lightbox-native-scroll]")?.focus({ preventScroll: true });
        return () => {
            observer.disconnect();
            if (scroller) { scroller.style.overflowY = previousOverflow; scroller.scrollTop = previousScroll; }
            coveredBadges.forEach(({ node, inert, hidden }) => {
                node.inert = inert;
                if (hidden === null) node.removeAttribute("aria-hidden"); else node.setAttribute("aria-hidden", hidden);
            });
        };
    }, [expanded, landscape]);
    return <div ref={panel} id={id} className={styles.panel} hidden={!expanded} style={{ top: bounds.top, left: bounds.left, height: bounds.height }} data-artwork-reading-panel>
        {expanded && <>
            <div className={styles.backdrop} aria-hidden="true" />
            <div className={`${styles.scroll} font-sans`} role="region" aria-label={t("descriptionOf", { title })} tabIndex={0}
                data-lightbox-native-scroll lang={lang} onPointerDown={event => event.stopPropagation()} onClick={event => event.stopPropagation()}>
                <p>{description}</p>
                <button type="button" className={styles.close} onClick={onClose} data-artwork-reading-close>{t("readLess")}</button>
            </div>
        </>}
    </div>;
}
