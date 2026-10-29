"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal, flushSync } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { SiteLocale } from "@/i18n/config";
import { homeBookCopy } from "@/i18n/homeBookCopy";
import type { Artwork } from "@/domains/artworks";
import { createPortraitArtbookMotion, type PortraitArtbookController } from "@/domains/artworks/components/portrait-artbook/portraitArtbookMotion";
import { createPortraitPageCache } from "@/domains/artworks/components/portrait-artbook/portraitPageCache";
import portraitStyles from "@/domains/artworks/components/portrait-artbook/ArtworkPortraitArtbook.module.css";
import { createSeriesGlassReflection } from "@/domains/artworks/series/components/experience/seriesGlassReflection";
import type { GlassArtbookLoadState } from "@/domains/artworks/components/glass-artbook/types";
import { burstArtworkDust } from "@/shared/ui/particle-field/dust";
import { hasBlockingArtworkDialog } from "@/shared/ui/artwork/hasBlockingArtworkDialog";
import useArtworkGestureBoundary from "@/shared/ui/artwork/useArtworkGestureBoundary";
import ArtworkExperienceToolbar from "@/shared/ui/artwork/ArtworkExperienceToolbar";
import ArtworkLoading from "@/shared/ui/artwork/ArtworkLoading";
import useDialogFocus from "@/shared/hooks/useDialogFocus";
import { getHomeBookContent, visibleHomeBookImages } from "./homeBookContent";
import { homeBookChapter, homeBookLayout, selectHomeBookChapter, subscribeHomeBookChapter, subscribeHomeBookLayout } from "./homeBookLocation";
import HomeBookPage from "./HomeBookPage";
import { homeBookPages, journalPageSlug, resolveHomeBookPage, type HomeBookPageId } from "./homeBookChapters";
import { bindHomeBookLinkDrag, homeBookAllowsDrag } from "./homeBookGestures";
import styles from "./HomeGlassArtbook.module.css";

const serverChapter = () => "cover" as const, serverLayout = () => "portrait" as const;
let lessonLearned = false;

export default function HomeGlassArtbook({ onExit }: { onExit(): void }) {
    const locale = useLocale() as SiteLocale, g = useTranslations("Glass"), a = useTranslations("Artwork"), router = useRouter();
    const copy = homeBookCopy(locale), content = useMemo(() => getHomeBookContent(locale), [locale]);
    const chapter = useSyncExternalStore(subscribeHomeBookChapter, homeBookChapter, serverChapter);
    const layout = useSyncExternalStore(subscribeHomeBookLayout, homeBookLayout, serverLayout);
    const pages = useMemo(() => homeBookPages(content.chapters, content.journal, layout === "spread"), [content, layout]);
    const current = resolveHomeBookPage(chapter, pages), index = pages.indexOf(current);
    const previous = pages[index - 1], next = pages[index + 1];
    const pageLabel = (key: HomeBookPageId) => {
        const slug = journalPageSlug(key);
        return slug ? content.journal.find(entry => entry.slug === slug)?.title ?? copy.chapter.journal : copy.chapter[key as keyof typeof copy.chapter];
    };
    const root = useRef<HTMLElement>(null), frame = useRef<HTMLDivElement>(null), track = useRef<HTMLDivElement>(null), overlay = useRef<HTMLDivElement>(null);
    const controller = useRef<PortraitArtbookController | null>(null), navigationFrame = useRef(0), openingRef = useRef(false), presented = useRef(false);
    const [cache] = useState(createPortraitPageCache), [material] = useState(createSeriesGlassReflection);
    const [load, setLoad] = useState<GlassArtbookLoadState>({ status: "loading", artworkId: current, kind: "entrance" });
    const [opening, setOpening] = useState(false);
    const [learned] = useState(() => lessonLearned);
    useArtworkGestureBoundary(root);
    useDialogFocus(root, true, { onEscape: onExit });
    useEffect(() => {
        const before = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = before; cancelAnimationFrame(navigationFrame.current); material.dispose(); };
    }, [material]);
    const openArtwork = useCallback((work: Artwork) => {
        if (openingRef.current) return;
        openingRef.current = true;
        flushSync(() => setOpening(true));
        navigationFrame.current = requestAnimationFrame(() => { navigationFrame.current = requestAnimationFrame(() => {
            router.push(`/artworks/${work.slug}?experience=glass`);
        }); });
    }, [router]);
    useLayoutEffect(() => {
        const element = root.current, viewport = frame.current, surfaces = track.current, moving = overlay.current;
        if (!element || !viewport || !surfaces || !moving) return;
        const page = (key: string | undefined) => key ? Array.from(surfaces.querySelectorAll<HTMLElement>("[data-portrait-page]")).find(node => node.dataset.portraitPage === key) ?? null : null;
        const active = page(current);
        if (!active) return;
        let disposed = false, loadTimer = 0, arrivalFrame = 0, stopDust: (() => void) | undefined;
        function stopArrival() { cancelAnimationFrame(arrivalFrame); stopDust?.(); stopDust = undefined; }
        if (lessonLearned) element.dataset.portraitLearned = "";
        const stopLinkDrag = bindHomeBookLinkDrag(viewport);
        controller.current = createPortraitArtbookMotion({ root: element, frame: viewport, overlay: moving, current: active,
            previous: page(previous), next: page(next), pageCache: cache, imagesForPage: visibleHomeBookImages,
            canStartDrag: homeBookAllowsDrag,
            renderSurface: material.render,
            onLoad(state) {
                if (disposed) return;
                clearTimeout(loadTimer);
                const visible = presented.current && state.kind === "entrance" ? { ...state, kind: "turn" as const } : state;
                if (state.status === "ready") presented.current = true;
                const update = () => { if (!disposed) setLoad(visible); };
                if (visible.status === "loading" && visible.kind === "turn") loadTimer = window.setTimeout(update, 160); else update();
            },
            onInteraction() { lessonLearned = true; element.dataset.portraitLearned = ""; }, onActivity: stopArrival,
            onLand(direction) { const destination = pages[index + direction]; if (destination) selectHomeBookChapter(destination); },
            onExit,
            onArrival() {
                stopArrival();
                if (window.matchMedia("(prefers-reduced-motion:reduce)").matches || document.hidden || hasBlockingArtworkDialog(element)) return;
                const badge = active.querySelector<HTMLElement>("[data-badged]");
                if (!badge) return;
                arrivalFrame = requestAnimationFrame(() => {
                    if (disposed || hasBlockingArtworkDialog(element)) return;
                    const border = viewport.getBoundingClientRect(), tag = badge.getBoundingClientRect();
                    stopDust = burstArtworkDust(viewport, { x: 1, y: 1, width: border.width - 2, height: border.height - 2, radius: 13 },
                        { x: tag.left - border.left, y: tag.top - border.top, width: tag.width, height: tag.height });
                });
            },
        });
        return () => { disposed = true; clearTimeout(loadTimer); stopArrival(); stopLinkDrag(); controller.current?.dispose(); controller.current = null; };
    }, [cache, current, index, layout, material, next, onExit, pages, previous]);

    const slots = pages.filter((_, slot) => Math.abs(slot - index) <= 1);
    const label = copy.position.replace("{index}", String(index + 1)).replace("{total}", String(pages.length));
    return createPortal(<div className={styles.root}>
        <section ref={root} className="experience" role="dialog" aria-modal="true" aria-label={copy.title} data-home-artbook data-portrait-learned={learned || undefined} data-lenis-prevent>
            <ArtworkExperienceToolbar className="home-toolbar" backLabel={copy.back} onBack={() => onExit()} onExit={() => onExit()} />
            <div className="workspace">
                <div ref={frame} className="frame" aria-busy={opening || load.status === "loading"}>
                    <div className="slots" ref={track}>
                        {slots.map(key => <div key={key} className={`slot${key !== current ? " cached" : ""}`} inert={key !== current} aria-hidden={key !== current || undefined}>
                            <HomeBookPage chapter={key} content={content} layout={layout} active={key === current} material={material}
                                onOpen={openArtwork} onJump={selectHomeBookChapter} />
                        </div>)}
                    </div><div ref={overlay} className={portraitStyles.overlay} hidden inert aria-hidden="true" />
                </div>
                <div className="bubble" aria-hidden="true"><span>↔</span>{g("swipeGlass")}</div>
                {(opening || load.status !== "ready") && <div className={`loading${opening || load.kind === "entrance" ? " entrance-loading" : ""}`}>
                    {opening || load.status === "loading" ? <ArtworkLoading label={opening ? a("openingArtwork") : g("preparing")} /> : <div role="alert"><p>{g("error")}</p>
                        <button type="button" onClick={() => controller.current?.retry()}>{g("retry")}</button><button type="button" onClick={() => onExit()}>{g("standard")}</button></div>}
                </div>}
            </div>
            <nav className="book-navigation" aria-label={copy.navigation}>
                <button type="button" className="page-nav" disabled={!previous || opening} onClick={() => controller.current?.navigate(-1)}>
                    <small>← {a("previous")}</small><strong>{previous ? pageLabel(previous) : "—"}</strong></button>
                <div className="book-position"><span className="counter" role="status" aria-label={label}>{String(index + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}</span>
                    <div className="dots">{pages.map(key => <button key={key} type="button" aria-label={pageLabel(key)} aria-current={current === key}
                        onClick={() => { lessonLearned = true; root.current?.setAttribute("data-portrait-learned", ""); selectHomeBookChapter(key); }} />)}</div>
                    <span className="guide" aria-hidden="true">{g("dragDock")}</span>
                </div>
                <button type="button" className="page-nav next" disabled={!next || opening} onClick={() => controller.current?.navigate(1)}>
                    <small>{a("next")} →</small><strong>{next ? pageLabel(next) : "—"}</strong></button>
            </nav>
        </section>
    </div>, document.body);
}
