"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
import { localizeHref } from "@/i18n/config";
import { artworkExperienceHref } from "../../presentation/artworkExperience";
import ArtworkLoading from "@/shared/ui/artwork/ArtworkLoading";
import type { ArtworkGlassArtbookProps } from "../glass-artbook/types";
import { portraitViewportSnapshot, serverPortraitSnapshot, subscribePortraitViewport } from "./portraitArtbookViewport";
import styles from "./ArtworkPortraitArtbook.module.css";

const PortraitArtbook = dynamic(() => import("./ArtworkPortraitArtbook"), {
    loading: () => <PortraitLoading />,
});
const LandscapeArtbook = dynamic(() => import("../glass-artbook"), {
    loading: () => <PortraitLoading />,
});

function PortraitLoading() {
    const t = useTranslations("Glass");
    return <div className={styles.entryLoading}><ArtworkLoading label={t("preparing")} /></div>;
}

// Explicit Standard remains available. The old landscape/desktop component
// is passed through unchanged; it never mounts while portrait owns the book.
export default function ArtworkPortraitEntry({ children, book, explicitGlass = false }: {
    children: ReactNode;
    book: ArtworkGlassArtbookProps;
    explicitGlass?: boolean;
}) {
    const viewport = useSyncExternalStore(subscribePortraitViewport, portraitViewportSnapshot, serverPortraitSnapshot);
    const locale = useLocale();
    const t = useTranslations("Glass");
    const search = useSearchParams();
    const pathname = usePathname();
    if (viewport === "portrait") return <PortraitArtbook {...book} />;
    if (viewport === "other") {
        // Native book history intentionally does not refetch the route. After
        // a portrait turn, rotation must open the selected work, not the old
        // server payload's initial artwork.
        if (!explicitGlass && search.get("experience") === "glass") {
            let slug = "";
            try { slug = decodeURIComponent(pathname.replace(/^\/artworks\//, "").replace(/\/$/, "")); } catch { /* Use the initial artwork. */ }
            const selected = book.artworks.find(artwork => artwork.slug === slug);
            return <LandscapeArtbook {...book} initialArtworkId={selected?.id ?? book.initialArtworkId} />;
        }
        return children;
    }
    const initial = book.artworks.find(artwork => artwork.id === book.initialArtworkId) ?? book.artworks[0];
    const standardHref = initial ? artworkExperienceHref(initial.slug, book.navigationQuery, "standard") : "/artworks";
    const fallback = <noscript><a className={`${styles.noScript} font-sans text-sm text-white/70`} href={localizeHref(standardHref, locale)}>{t("standard")}</a></noscript>;
    if (explicitGlass) return <><PortraitLoading />{fallback}</>;
    return <><div className={styles.entryChecking}>
        <div className={styles.entryFallback}>{children}</div>
        <div className={styles.entryPortrait}><PortraitLoading /></div>
    </div>{fallback}</>;
}
