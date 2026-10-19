"use client";

import { useLocale, useTranslations } from "next-intl";
import { localizeHref } from "@/i18n/config";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "@/i18n/navigation";
import ArtworkLoading from "@/shared/ui/artwork/ArtworkLoading";
import { LANDSCAPE_ARTBOOK_ENTRY_QUERY } from "../presentation/artworkExperience";
import styles from "./ArtworkDetailResponsiveEntry.module.css";

const subscribe = () => () => {};
const serverViewport = () => null;

function createEntryViewportReader() {
    let snapshot: boolean | null = null;
    // Entry is a single decision. Later rotations belong to ArtworkPortraitEntry.
    return () => snapshot ?? (snapshot = window.matchMedia(LANDSCAPE_ARTBOOK_ENTRY_QUERY).matches);
}

export default function ArtworkDetailResponsiveEntry({
    children, glassHref, standardHref, enabled = true,
}: { children: ReactNode; glassHref?: string; standardHref?: string; enabled?: boolean }) {
    const locale = useLocale();
    const t = useTranslations("Glass");
    const router = useRouter();
    const checked = useRef(false);
    const [entryViewport] = useState(createEntryViewportReader);
    const landscape = useSyncExternalStore(subscribe, entryViewport, serverViewport);
    const phase = landscape === null ? "checking" : landscape ? "opening" : "standard";

    useEffect(() => {
        if (checked.current || landscape === null) return;
        checked.current = true;
        if (!enabled || !glassHref || !landscape) return;
        router.replace(glassHref, { scroll: false });
    }, [enabled, glassHref, router, landscape]);

    if (!enabled || !glassHref) return children;

    return <div className={styles.entry} data-entry-phase={phase}>
        {phase !== "opening" && <div className={styles.standard}>{children}</div>}
        <div className={styles.loading}>
            <ArtworkLoading label={t("opening")} />
            {standardHref && <noscript><a href={localizeHref(standardHref, locale)} className="font-sans text-sm text-white/60">{t("standard")}</a></noscript>}
        </div>
    </div>;
}
