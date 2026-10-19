import styles from "./ArtworkNavigationFeedback.module.css";
import { useLocale, useTranslations } from "next-intl";

export default function ArtworkLoading({ label }: { label?: string }) {
    const locale = useLocale();
    const t = useTranslations("Artwork");
    return <span lang={locale} className={styles.status} role="status" aria-live="polite">
        <span className={styles.spinner} aria-hidden="true" />
        <span className={styles.label}>{label ?? t("loading")}</span>
    </span>;
}
