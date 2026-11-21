"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import ArtworkLoading from "@/shared/ui/artwork/ArtworkLoading";
import useArtworkExperience from "@/shared/ui/artwork/useArtworkExperience";
import { setArtworkExperiencePreference, type ArtworkExperienceMode } from "@/shared/ui/artwork/artworkExperiencePreference";
import { artworkArchiveHref } from "../../presentation/artworkExperience";
import styles from "../portrait-artbook/ArtworkPortraitArtbook.module.css";

/** The grid and the standalone reader are two routes for one archive. */
export default function ArchiveModeRoute({ mode, children }: { mode: ArtworkExperienceMode; children: ReactNode }) {
    const preference = useArtworkExperience();
    const router = useRouter();
    const t = useTranslations("Glass");
    useLayoutEffect(() => {
        if (!preference) return;
        const url = new URL(window.location.href);
        // An explicit Open link also works in a new tab. Consume it once so Back
        // cannot reactivate the book after the reader has chosen Exit.
        if (mode === "glass" && url.searchParams.get("experience") === "glass") {
            url.searchParams.delete("experience");
            window.history.replaceState(null, "", url.pathname + url.search + url.hash);
            if (preference !== "glass") setArtworkExperiencePreference("glass");
            return;
        }
        if (preference !== mode) router.replace(artworkArchiveHref(preference, url.search), { scroll: false });
    }, [mode, preference, router]);

    if (preference && preference !== mode) return <div className={styles.entryLoading}><ArtworkLoading label={t("preparing")} /></div>;
    return children;
}
