"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import Link from "@/i18n/navigation";
import LanguageSwitcher from "@/i18n/LanguageSwitcher";
import styles from "./ArtworkExperienceToolbar.module.css";

/** The same three controls serve every immersive book. Image zoom is separate. */
export default function ArtworkExperienceToolbar({ backHref, backLabel, onBack, onExit, className = "" }: {
    backHref?: string; backLabel: ReactNode; onBack?(): void; onExit(): void; className?: string;
}) {
    const t = useTranslations("Glass");
    return <div className={`${styles.toolbar} ${className}`} data-artbook-toolbar>
        {backHref ? <Link href={backHref} className={styles.back}>← {backLabel}</Link> :
            <button type="button" onClick={onBack} className={styles.back}>← {backLabel}</button>}
        <div className={styles.actions}>
            <LanguageSwitcher className={styles.language} />
            <button type="button" onClick={onExit} data-glass-exit className={styles.exit} aria-label={t("exitLabel")}>
                {t("exit")} <span aria-hidden="true">×</span>
            </button>
        </div>
    </div>;
}
