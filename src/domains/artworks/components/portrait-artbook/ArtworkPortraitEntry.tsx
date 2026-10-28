"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { artworkExperienceHref } from "../../presentation/artworkExperience";
import { artworkBookViewport, subscribeArtworkBookViewport } from "../../presentation/artworkBookViewport";
import useArtworkExperience from "@/shared/ui/artwork/useArtworkExperience";
import { setArtworkExperiencePreference } from "@/shared/ui/artwork/artworkExperiencePreference";
import ArtworkLoading from "@/shared/ui/artwork/ArtworkLoading";
import type { ArtworkGlassArtbookProps } from "../glass-artbook/types";
import styles from "./ArtworkPortraitArtbook.module.css";

function PortraitLoading() {
    const t = useTranslations("Glass");
    return <div className={styles.entryLoading}><ArtworkLoading label={t("preparing")} /></div>;
}
const PortraitArtbook = dynamic(() => import("./ArtworkPortraitArtbook"), { loading: PortraitLoading });
const LandscapeArtbook = dynamic(() => import("../glass-artbook"), { loading: PortraitLoading });
const serverViewport = () => "checking" as const;

/** Both route presentations are available; native book turns never refetch a page. */
export default function ArtworkPortraitEntry({ children, book }: { children: ReactNode; book: ArtworkGlassArtbookProps }) {
    const preference = useArtworkExperience();
    const viewport = useSyncExternalStore(subscribeArtworkBookViewport, artworkBookViewport, serverViewport);
    const pathname = usePathname(), search = useSearchParams(), router = useRouter();
    let slug = "";
    try { slug = decodeURIComponent(pathname.replace(/^\/artworks\//, "").replace(/\/$/, "")); } catch { /* Keep the initial ID. */ }
    const selected = book.artworks.find(artwork => artwork.slug === slug) ?? book.artworks.find(artwork => artwork.id === book.initialArtworkId);
    const mode = viewport === "unsupported" ? "standard" : preference;
    // Standard is server-rendered. After native Glass turns, obtain the new
    // selected work's server scenes before revealing Standard, never the old one.
    const staleStandard = mode === "standard" && selected?.id !== book.initialArtworkId;
    useEffect(() => {
        if (!mode || viewport === "checking" || !selected) return;
        if (staleStandard) {
            router.replace(artworkExperienceHref(selected.slug, book.navigationQuery, "standard"), { scroll: false });
            return;
        }
        if (search.get("experience") === mode) return;
        const url = new URL(window.location.href);
        url.searchParams.set("experience", mode);
        window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }, [mode, viewport, selected, staleStandard, book.navigationQuery, search, router]);
    function exit() { setArtworkExperiencePreference("standard"); }
    if (!preference || viewport === "checking") return <div className={styles.entryChecking}>
        <div className={styles.entryFallback}>{children}</div><div className={styles.entryPortrait}><PortraitLoading /></div>
    </div>;
    if (staleStandard) return <PortraitLoading />;
    if (mode === "standard") return children;
    const props = { ...book, initialArtworkId: selected?.id ?? book.initialArtworkId, onExit: exit };
    return viewport === "portrait" ? <PortraitArtbook {...props} /> : <LandscapeArtbook {...props} />;
}
