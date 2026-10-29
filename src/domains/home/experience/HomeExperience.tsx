"use client";

import { Component, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { createPortal, flushSync } from "react-dom";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import useArtworkExperience from "@/shared/ui/artwork/useArtworkExperience";
import { setArtworkExperiencePreference } from "@/shared/ui/artwork/artworkExperiencePreference";
import ArtworkLoading from "@/shared/ui/artwork/ArtworkLoading";
import { clearHomeBookLocation, homeBookChapter, selectHomeBookChapter } from "./homeBookLocation";
import type { HomeBookPageId } from "./homeBookChapters";
import styles from "./HomeExperience.module.css";
import { HOME_BOOK_BOOTSTRAP } from "./homeBookBootstrap";

function PreparingHome() {
    const t = useTranslations("Glass");
    return typeof document === "undefined" ? null : createPortal(<div className={styles.preparing} role="status">
        <div><ArtworkLoading label={t("preparing")} /><button type="button" onClick={() => { clearHomeBookLocation(); setArtworkExperiencePreference("standard"); }}>{t("standard")}</button></div>
    </div>, document.body);
}
const HomeGlassArtbook = dynamic(() => import("./HomeGlassArtbook"), { ssr: false, loading: PreparingHome });

function FailedHome() {
    const t = useTranslations("Glass");
    return createPortal(<div className={styles.preparing} role="alert"><div><p>{t("error")}</p>
        <button type="button" onClick={() => { clearHomeBookLocation(); setArtworkExperiencePreference("standard"); }}>{t("standard")}</button>
    </div></div>, document.body);
}

class BookBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() { return { failed: true }; }
    render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

/** Standard remains the original server composition; only the additional book is lazy. */
export default function HomeExperience({ children }: { children: ReactNode }) {
    const preference = useArtworkExperience(), t = useTranslations("Artwork"), glass = useTranslations("Glass");
    const active = preference === "glass";
    const shell = useRef<HTMLDivElement>(null);
    const savedScroll = useRef<number | null>(null), paintFrame = useRef(0);
    const lastChapter = useRef<HomeBookPageId>("cover");
    const openButton = useRef<HTMLButtonElement>(null);
    useLayoutEffect(() => { if (preference !== null) shell.current?.removeAttribute("data-home-glass-pending"); }, [preference]);
    useEffect(() => {
        if (active) { savedScroll.current ??= window.scrollY; return; }
        if (savedScroll.current !== null) {
            const top = savedScroll.current; savedScroll.current = null;
            paintFrame.current = requestAnimationFrame(() => { window.scrollTo({ top, behavior: "instant" }); openButton.current?.focus({ preventScroll: true }); });
        }
        return () => cancelAnimationFrame(paintFrame.current);
    }, [active]);
    useEffect(() => () => cancelAnimationFrame(paintFrame.current), []);
    function open() {
        // Let the loading indicator paint before preparing WebGL and the editorial surfaces.
        savedScroll.current = window.scrollY;
        if (lastChapter.current !== "cover") selectHomeBookChapter(lastChapter.current);
        flushSync(() => setArtworkExperiencePreference("glass"));
    }
    function exit() {
        lastChapter.current = homeBookChapter();
        clearHomeBookLocation();
        flushSync(() => setArtworkExperiencePreference("standard"));
    }
    return <div ref={shell} className={styles.shell} suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: HOME_BOOK_BOOTSTRAP }} />
        <div className={`${styles.preparing} ${styles.bootstrap}`} role="status"><ArtworkLoading label={glass("preparing")} /></div>
        {active ? <div className={styles.placeholder} aria-hidden="true" /> : <div className={styles.standard} data-home-standard>{children}</div>}
        {active ? <BookBoundary fallback={<FailedHome />}><HomeGlassArtbook onExit={exit} /></BookBoundary> :
            <button ref={openButton} type="button" className={styles.open} onClick={open}>{t("openArtbook")}</button>}
    </div>;
}
