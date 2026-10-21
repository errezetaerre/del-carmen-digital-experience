"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { useTranslations } from "next-intl";
import { bindArtworkReadingMotion } from "./artworkReadingMotion";
import styles from "./ArtworkReadingPanel.module.css";

export default function ArtworkMovingDescription({ id, title, description, lang, expanded, previewSlot, onClose, onActiveChange }: {
    id: string; title: string; description?: string; lang: string; expanded: boolean;
    previewSlot: RefObject<HTMLDivElement | null>; onClose(): void; onActiveChange(active: boolean): void;
}) {
    const t = useTranslations("Artwork");
    const panel = useRef<HTMLDivElement>(null);
    const controller = useRef<ReturnType<typeof bindArtworkReadingMotion> | null>(null);
    const callbacks = useRef({ onClose, onActiveChange });
    useLayoutEffect(() => { callbacks.current = { onClose, onActiveChange }; });
    useLayoutEffect(() => {
        if (!panel.current || !previewSlot.current) return;
        const motion = bindArtworkReadingMotion(panel.current, previewSlot.current,
            () => callbacks.current.onClose(), active => callbacks.current.onActiveChange(active));
        controller.current = motion;
        return () => { motion.dispose(); controller.current = null; };
    }, [previewSlot]);
    useLayoutEffect(() => { controller.current?.setExpanded(expanded); }, [expanded]);
    return <div ref={panel} id={id} className={`${styles.panel} ${styles.moving}`} data-artwork-reading-panel data-reading-state="preview">
        <div className={styles.backdrop} data-artwork-reading-backdrop aria-hidden="true" />
        <div className={`${styles.scroll} font-sans`} data-artwork-reading-scroll role="region" aria-label={t("descriptionOf", { title })}
            lang={lang} tabIndex={-1}>
            <p className={styles.movingCopy} data-artwork-description>{description}</p>
            {expanded && <button type="button" className={styles.close} onClick={onClose} data-artwork-reading-close>{t("readLess")}</button>}
        </div>
    </div>;
}
