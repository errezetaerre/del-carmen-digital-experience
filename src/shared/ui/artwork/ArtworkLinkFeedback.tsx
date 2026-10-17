"use client";

import { useLinkStatus } from "next/link";
import ArtworkLoading from "./ArtworkLoading";
import styles from "./ArtworkNavigationFeedback.module.css";

export default function ArtworkLinkFeedback({ overlay = false, label = overlay ? "Opening…" : "Opening artwork…" }: { overlay?: boolean; label?: string }) {
    const { pending } = useLinkStatus();
    if (overlay) return pending ? <span className={styles.overlay}><ArtworkLoading label={label} /></span> : null;
    return <span className={styles.linkHint} data-pending={pending || undefined} aria-hidden={!pending}>
        <span className={styles.spinner} aria-hidden="true" />
        <span className={styles.srOnly} role="status" aria-live="polite">{pending ? label : ""}</span>
    </span>;
}
