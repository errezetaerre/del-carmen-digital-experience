import styles from "./ArtworkNavigationFeedback.module.css";

export default function ArtworkLoading({ label = "Loading artwork…" }: { label?: string }) {
    return <span className={styles.status} role="status" aria-live="polite">
        <span className={styles.spinner} aria-hidden="true" />
        <span className={styles.label}>{label}</span>
    </span>;
}
