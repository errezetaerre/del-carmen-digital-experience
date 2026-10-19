"use client";

import { useLinkStatus } from "next/link";
import { useLocale, useTranslations } from "next-intl";
import ArtworkLoading from "./ArtworkLoading";
import styles from "./ArtworkNavigationFeedback.module.css";

export default function ArtworkLinkFeedback({ overlay = false, label }: { overlay?: boolean; label?: string }) {
    const locale = useLocale();
    const t = useTranslations("Artwork");
    const message = label ?? t(overlay ? "opening" : "openingArtwork");
    const { pending } = useLinkStatus();
    if (overlay) return pending ? <span className={styles.overlay}><ArtworkLoading label={message} /></span> : null;
    return <span lang={locale} className={styles.linkHint} data-pending={pending || undefined} aria-hidden={!pending}>
        <span className={styles.spinner} aria-hidden="true" />
        <span className={styles.srOnly} role="status" aria-live="polite">{pending ? message : ""}</span>
    </span>;
}
