"use client";

import { useLocale, useTranslations } from "next-intl";
import { localizeHref } from "@/i18n/config";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "@/i18n/navigation";
import ArtworkLoading from "@/shared/ui/artwork/ArtworkLoading";
import { LANDSCAPE_ARTBOOK_ENTRY_QUERY } from "../presentation/artworkExperience";
import styles from "./ArtworkDetailResponsiveEntry.module.css";

export default function ArtworkDetailResponsiveEntry({
    children, glassHref, standardHref, enabled = true,
}: { children: ReactNode; glassHref?: string; standardHref?: string; enabled?: boolean }) {
    const locale = useLocale();
    const t = useTranslations("Glass");
    const router = useRouter();
    const checked = useRef(false);
    const [phase, setPhase] = useState<"checking" | "opening" | "standard">("checking");

    useEffect(() => {
        if (checked.current) return;
        checked.current = true;
        if (!enabled || !glassHref || !window.matchMedia(LANDSCAPE_ARTBOOK_ENTRY_QUERY).matches) {
            setPhase("standard");
            return;
        }
        setPhase("opening");
        router.replace(glassHref, { scroll: false });
    }, [enabled, glassHref, router]);

    if (!enabled || !glassHref) return children;

    return <div className={styles.entry} data-entry-phase={phase}>
        {phase !== "opening" && <div className={styles.standard}>{children}</div>}
        <div className={styles.loading}>
            <ArtworkLoading label={t("opening")} />
            {standardHref && <noscript><a href={localizeHref(standardHref, locale)} className="font-sans text-sm text-white/60">{t("standard")}</a></noscript>}
        </div>
    </div>;
}
