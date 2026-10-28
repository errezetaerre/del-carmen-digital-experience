"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import Link from "@/i18n/navigation";
import { localizeHref, type SiteLocale } from "@/i18n/config";
import type { Artwork } from "@/domains/artworks";
import type { GlassArtbookLoadState } from "@/domains/artworks/components/glass-artbook/types";
import { createPortraitArtbookMotion, type PortraitArtbookController } from "@/domains/artworks/components/portrait-artbook/portraitArtbookMotion";
import portraitStyles from "@/domains/artworks/components/portrait-artbook/ArtworkPortraitArtbook.module.css";
import { bindArtworkTouchNavigation } from "@/domains/artworks/components/artworkTouchNavigation";
import { bindArtworkStandardNavigation, type ArtworkStandardNavigation } from "@/shared/ui/artwork/artworkStandardNavigation";
import { hasBlockingArtworkDialog } from "@/shared/ui/artwork/hasBlockingArtworkDialog";
import useArtworkGestureBoundary from "@/shared/ui/artwork/useArtworkGestureBoundary";
import useArtworkViewerSelection from "@/shared/ui/artwork/useArtworkViewerSelection";
import useDialogFocus from "@/shared/hooks/useDialogFocus";
import ArtworkExperienceToolbar from "@/shared/ui/artwork/ArtworkExperienceToolbar";
import useArtworkExperience from "@/shared/ui/artwork/useArtworkExperience";
import { setArtworkExperiencePreference } from "@/shared/ui/artwork/artworkExperiencePreference";
import { createPortraitPageCache } from "@/domains/artworks/components/portrait-artbook/portraitPageCache";
import ArtworkLoading from "@/shared/ui/artwork/ArtworkLoading";
import { burstArtworkDust } from "@/shared/ui/particle-field/dust";
import { isFeaturedArtworkSeries } from "@/domains/artworks/presentation/getArtworkPresentation";
import SeriesPageSurface, { type SeriesExperienceEntry } from "./SeriesPageSurface";
import { openSeriesArtwork, selectSeries, seriesExperienceLocation, seriesHref, seriesSpread, subscribeSeriesExperience, subscribeSeriesSpread,
    visibleSeriesImages, synchronizeSeriesView, type SeriesView } from "./seriesExperienceLocation";
import styles from "./SeriesExperience.module.css";
import { createSeriesGlassReflection } from "./seriesGlassReflection";

function PreparingViewer() {
    const t = useTranslations("Artwork");
    return <div className={styles.viewerLoading}><ArtworkLoading label={t("opening")} /></div>;
}
const ArtworkExperienceViewer = dynamic(() => import("@/shared/ui/artwork/ArtworkExperienceViewer"), { ssr: false, loading: PreparingViewer });
const singleColumnOnServer = () => false;
let lessonLearned = false;

export default function SeriesExperience({ entries, initialSeriesSlug, initialArtworkSlug, initialView = "standard" }: {
    entries: SeriesExperienceEntry[]; initialSeriesSlug: string; initialArtworkSlug?: string; initialView?: SeriesView;
}) {
    const locale = useLocale() as SiteLocale, t = useTranslations("SeriesExperience"), seriesT = useTranslations("Series"), artworkT = useTranslations("Artwork"), glass = useTranslations("Glass");
    const serverLocation = useCallback(() => localizeHref(seriesHref(initialSeriesSlug, initialView), locale), [initialSeriesSlug, initialView, locale]);
    const location = useSyncExternalStore(subscribeSeriesExperience, seriesExperienceLocation, serverLocation);
    const url = new URL(location, "https://series.invalid");
    let slug = initialSeriesSlug;
    try { slug = decodeURIComponent(url.pathname.split("/series/")[1]?.replace(/\/$/, "") ?? initialSeriesSlug); } catch { /* Canonical server selection is retained. */ }
    const index = Math.max(0, entries.findIndex(entry => entry.series.slug === slug));
    const current = entries[index], previous = entries[(index + entries.length - 1) % entries.length], next = entries[(index + 1) % entries.length];
    const requestedView = url.searchParams.get("view");
    const preference = useArtworkExperience();
    const mode: SeriesView = preference ?? initialView;
    useEffect(() => {
        if (preference && requestedView !== preference) synchronizeSeriesView(preference);
    }, [preference, requestedView]);
    const wide = useSyncExternalStore(subscribeSeriesSpread, seriesSpread, singleColumnOnServer);
    const viewer = useArtworkViewerSelection(current.artworks, initialArtworkSlug);
    const selectedIndex = viewer.selectedIndex;
    const rootRef = useRef<HTMLElement>(null), frameRef = useRef<HTMLDivElement>(null), trackRef = useRef<HTMLDivElement>(null), overlayRef = useRef<HTMLDivElement>(null);
    const controllerRef = useRef<PortraitArtbookController | ArtworkStandardNavigation | null>(null);
    const openingFrame = useRef(0), arrivalKey = useRef("");
    const presentedRef = useRef(false);
    const [learnedAtMount] = useState(() => lessonLearned);
    const [pageCache] = useState(createPortraitPageCache);
    const [material] = useState(createSeriesGlassReflection);
    const [openingId, setOpeningId] = useState<string | null>(null);
    const [switching, setSwitching] = useState<SeriesView | null>(null);
    const [loadState, setLoadState] = useState<GlassArtbookLoadState>({ status: "ready", artworkId: current.series.id, kind: "entrance" });
    useArtworkGestureBoundary(rootRef);
    useDialogFocus(rootRef, mode === "glass" && selectedIndex === null, { onEscape() { changeMode("standard"); } });
    useEffect(() => () => cancelAnimationFrame(openingFrame.current), []);
    useEffect(() => () => material.dispose(), [material]);
    useEffect(() => { document.title = `${current.series.title} — Del Carmen`; }, [current.series.title]);

    useLayoutEffect(() => {
        const root = rootRef.current, frame = frameRef.current, track = trackRef.current, overlay = overlayRef.current;
        if (!root || !frame || !track || !overlay || selectedIndex !== null) return;
        const page = (id: string) => Array.from(track.querySelectorAll<HTMLElement>("[data-series-page]")).find(node => node.dataset.portraitPage === id) ?? null;
        const active = page(current.series.id);
        if (!active) return;
        if (lessonLearned) { root.dataset.seriesLearned = ""; root.dataset.portraitLearned = ""; }
        let disposed = false, timer = 0, animation: gsap.core.Timeline | null = null, stopAccent: (() => void) | undefined;
        let arrivalFrame = 0, loadingTimer = 0;
        const stops: Array<() => void> = [];
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        function stopDemo() { window.clearTimeout(timer); animation?.kill(); animation = null; delete root!.dataset.standardHintVisible; }
        function learn() {
            lessonLearned = true; root!.dataset.seriesLearned = ""; root!.dataset.portraitLearned = ""; stopDemo();
        }
        function stopArrival() { cancelAnimationFrame(arrivalFrame); stopAccent?.(); stopAccent = undefined; }
        function arrive() {
            const key = `${current.series.id}/${mode}`;
            if (disposed || arrivalKey.current === key || reduced.matches || document.hidden || hasBlockingArtworkDialog(root!)) return;
            arrivalKey.current = key;
            // Record every visit, so leaving a featured series rearms its next arrival.
            if (!isFeaturedArtworkSeries(current.series.id)) return;
            arrivalFrame = requestAnimationFrame(() => {
                if (disposed || hasBlockingArtworkDialog(root!) || document.hidden) return;
                const featured = active!.querySelector<HTMLElement>("[data-featured-series]");
                if (featured) {
                    const origin = frame!.getBoundingClientRect(), badge = featured.getBoundingClientRect();
                    stopAccent = burstArtworkDust(frame!, { x: 1, y: 1, width: origin.width - 2, height: origin.height - 2, radius: 13 },
                        { x: badge.left - origin.left, y: badge.top - origin.top, width: badge.width, height: badge.height });
                }
            });
        }
        function land(direction: -1 | 1) {
            const entry = direction === 1 ? next : previous;
            selectSeries(entry.series.slug, mode, locale);
        }
        function scheduleDemo() {
            window.clearTimeout(timer);
            if (entries.length < 2 || lessonLearned || mode !== "standard" || document.hidden || hasBlockingArtworkDialog(root!)) return;
            timer = window.setTimeout(() => {
                if (disposed || lessonLearned || hasBlockingArtworkDialog(root!)) return;
                root!.dataset.standardHintVisible = "";
                if (reduced.matches) { timer = window.setTimeout(() => { delete root!.dataset.standardHintVisible; scheduleDemo(); }, 2400); return; }
                const point = { x: 0 }, standard = controllerRef.current as ArtworkStandardNavigation;
                standard.begin();
                animation = gsap.timeline({ onComplete() { standard.reset(); delete root!.dataset.standardHintVisible; scheduleDemo(); } })
                    .to(point, { x: -30, duration: .8, ease: "power2.out", onUpdate: () => standard.preview(point.x) })
                    .to(point, { x: 0, duration: 1, ease: "power3.in", onUpdate: () => standard.preview(point.x) }, "+=.5");
            }, 5000);
        }
        if (mode === "glass") {
            const controller = createPortraitArtbookMotion({ root, frame, overlay, current: active,
                previous: entries.length > 1 ? page(previous.series.id) : null, next: entries.length > 1 ? page(next.series.id) : null,
                imagesForPage: visibleSeriesImages, pageCache, renderSurface: material.render,
                onLoad(state) {
                    window.clearTimeout(loadingTimer);
                    // Once visible, layout changes and dialog return also keep
                    // the existing book on screen while rechecking readiness.
                    const displayState = presentedRef.current && state.kind === "entrance" ? { ...state, kind: "turn" as const } : state;
                    if (state.status === "ready") presentedRef.current = true;
                    const update = () => setLoadState(previous => previous.status === displayState.status && previous.artworkId === displayState.artworkId && previous.kind === displayState.kind ? previous : displayState);
                    if (displayState.status === "loading" && displayState.kind === "turn") loadingTimer = window.setTimeout(update, 160);
                    else update();
                }, onActivity: stopArrival, onInteraction: learn, onLand: land,
                onExit() { setArtworkExperiencePreference("standard"); selectSeries(current.series.slug, "standard", locale, false); }, onArrival: arrive });
            controllerRef.current = controller;
        } else {
            const controller = bindArtworkStandardNavigation(frame, track, { navigate: land, zoomed: () => entries.length < 2 || hasBlockingArtworkDialog(root), onInteraction() { stopArrival(); learn(); } });
            controllerRef.current = controller;
            let grip: { x: number; y: number; horizontal: boolean } | null = null;
            stops.push(bindArtworkTouchNavigation(frame, {
                start(input) {
                    if (entries.length < 2 || hasBlockingArtworkDialog(root) || (input.target as Element | null)?.closest("a,button,input,textarea,select,[contenteditable],[data-lightbox-native-scroll]")) return false;
                    learn(); stopArrival(); controller.begin(); grip = { x: input.clientX, y: input.clientY, horizontal: false }; return true;
                },
                move(input) {
                    if (!grip) return;
                    const dx = input.clientX - grip.x, dy = input.clientY - grip.y;
                    if (!grip.horizontal) {
                        if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
                        if (Math.abs(dx) < Math.abs(dy) * 1.05) { grip = null; controller.reset(); return; }
                        grip.horizontal = true;
                    }
                    input.preventDefault(); controller.preview(dx);
                },
                end(input) {
                    if (!grip) return;
                    const horizontal = grip.horizontal; grip = null;
                    if (input.type === "pointercancel" || !horizontal) controller.reset(); else controller.release();
                },
            }));
            const keydown = (event: KeyboardEvent) => {
                if (entries.length < 2 || hasBlockingArtworkDialog(root) || event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey ||
                    (event.target as Element | null)?.closest("input,textarea,select,[data-lightbox-native-scroll]")) return;
                if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); controller.navigate(event.key === "ArrowRight" ? 1 : -1); }
            };
            window.addEventListener("keydown", keydown); stops.push(() => window.removeEventListener("keydown", keydown));
            const media = visibleSeriesImages(active).map(image => image.complete && image.naturalWidth ? image.decode().catch(() => {}) : new Promise<void>(resolve => {
                const finish = () => { image.removeEventListener("load", finish); image.removeEventListener("error", finish); resolve(); };
                image.addEventListener("load", finish, { once: true }); image.addEventListener("error", finish, { once: true }); stops.push(finish);
            }));
            void Promise.all([...media, document.fonts?.ready]).then(() => { if (!disposed) arrive(); });
            scheduleDemo();
        }
        function visibility() { if (document.hidden) { stopDemo(); stopArrival(); } else scheduleDemo(); }
        document.addEventListener("visibilitychange", visibility);
        return () => {
            disposed = true; window.clearTimeout(loadingTimer); stopDemo(); stopArrival(); stops.forEach(stop => stop());
            document.removeEventListener("visibilitychange", visibility); controllerRef.current?.dispose(); controllerRef.current = null;
        };
    }, [current, entries.length, locale, mode, next, previous, selectedIndex, wide, pageCache, material]);

    function changeMode(view: SeriesView) {
        if (view === mode) return;
        flushSync(() => { setSwitching(view); setLoadState({ status: "loading", artworkId: current.series.id, kind: "entrance" }); });
        openingFrame.current = requestAnimationFrame(() => { openingFrame.current = requestAnimationFrame(() => {
            flushSync(() => { setArtworkExperiencePreference(view); selectSeries(current.series.slug, view, locale, false); setSwitching(null); });
        }); });
    }
    function openArtwork(artwork: Artwork) {
        flushSync(() => setOpeningId(artwork.id));
        openingFrame.current = requestAnimationFrame(() => { openingFrame.current = requestAnimationFrame(() => { openSeriesArtwork(artwork, mode); setOpeningId(null); }); });
    }
    function navigate(event: MouseEvent<HTMLAnchorElement>, direction: -1 | 1) {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
        event.preventDefault(); controllerRef.current?.navigate(direction);
    }
    // Identity belongs to the collection, not its current slot. React promotes
    // the already-decoded neighbour, retaining cards, scroll and material IDs.
    const slots = [{ slot: "current", entry: current }, ...(entries.length > 1 ? [{ slot: "previous", entry: previous }, { slot: "next", entry: next }] : [])]
        .filter(({ entry }, index, all) => all.findIndex(candidate => candidate.entry.series.id === entry.series.id) === index);
    return <main ref={rootRef} className={styles.experience} data-series-experience data-series-view={mode} data-series-current={current.series.id}
        data-series-learned={learnedAtMount || undefined} data-portrait-learned={learnedAtMount || undefined} data-lenis-prevent>
        {mode === "glass" ? <ArtworkExperienceToolbar backHref="/collections" backLabel={seriesT("back")}
            onExit={() => changeMode("standard")} className={styles.toolbar} /> : <div className={styles.toolbar}>
            <Link href="/collections" className={styles.back}>{seriesT("back")}</Link>
            <div className={styles.modeSwitch}><button type="button" disabled={switching !== null}
                onClick={() => changeMode("glass")}>{artworkT("openArtbook")}</button></div>
        </div>}
        <div className={styles.workspace}>
            <div ref={frameRef} className={styles.frame} data-series-frame aria-label={t("viewer")} aria-busy={switching !== null || (mode === "glass" && loadState.status === "loading")}>
                <div ref={trackRef} className={styles.track}>
                    {slots.map(({ slot, entry }) => <div key={entry.series.id} className={styles.slot} data-series-slot={slot} inert={slot !== "current"} aria-hidden={slot !== "current" || undefined}>
                        <SeriesPageSurface entry={entry} active={slot === "current"} wide={wide} openingId={openingId} onOpen={openArtwork} material={material} glass={mode === "glass"} />
                    </div>)}
                </div>
                <div ref={overlayRef} className={portraitStyles.overlay} hidden inert aria-hidden="true" />
            </div>
            <div className={styles.bubble} aria-hidden="true"><span>↔</span>{t(mode === "glass" ? "glassHint" : "standardHint")}</div>
            {(switching !== null || (mode === "glass" && loadState.status !== "ready")) && <div className={`${styles.status} ${switching === null && loadState.kind === "turn" ? styles.turnStatus : ""}`}
                data-series-load-kind={switching !== null ? "entrance" : loadState.kind}>
                {switching !== null || loadState.status === "loading" ? <ArtworkLoading label={glass(switching === null && loadState.kind === "turn" ? "loadingArtwork" : "preparing")} /> : <div><p role="alert">{t("error")}</p><button type="button" onClick={() => { if (controllerRef.current && "retry" in controllerRef.current) controllerRef.current.retry(); }}>{glass("retry")}</button><button type="button" onClick={() => changeMode("standard")}>{glass("standard")}</button></div>}
            </div>}
        </div>
        <nav className={styles.navigator} aria-label={t("navigation")}>
            {entries.length > 1 ? <Link prefetch={false} href={seriesHref(previous.series.slug, mode)} onClick={event => navigate(event, -1)} className={styles.navLink}>
                <span className={styles.navAction}>← {artworkT("previous")}</span><span className={styles.navName}>{previous.series.title}</span>
            </Link> : <div />}
            <div className={styles.position}>
                <span className={styles.count} role="status" aria-label={t("position", { index: index + 1, total: entries.length })}>{String(index + 1).padStart(2, "0")} / {String(entries.length).padStart(2, "0")}</span>
                <div className={styles.dots}>{entries.map(entry => <button key={entry.series.id} type="button" aria-label={seriesT("exploreNamed", { title: entry.series.title })}
                    aria-current={entry.series.id === current.series.id} onClick={() => { if (entry.series.id !== current.series.id) { lessonLearned = true; selectSeries(entry.series.slug, mode, locale); } }} />)}</div>
                <span className={styles.hint} aria-hidden="true">{t("dockHint")}</span>
            </div>
            {entries.length > 1 ? <Link prefetch={false} href={seriesHref(next.series.slug, mode)} onClick={event => navigate(event, 1)} className={`${styles.navLink} ${styles.next}`}>
                <span className={styles.navAction}>{artworkT("next")} →</span><span className={styles.navName}>{next.series.title}</span>
            </Link> : <div />}
        </nav>
        {selectedIndex !== null && <ArtworkExperienceViewer artworks={current.artworks} initialIndex={selectedIndex} onClose={viewer.close}
            backLabel={artworkT("backToSeries", { title: current.series.title })} showDetailsCta showAllWorksCta={false} detailsCtaLabel={artworkT("exploreDetail")} detailsQuery={`series=${current.series.slug}`} />}
    </main>;
}
