"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Artwork } from "../../model/artwork";
import { bindHomeBookLinkDrag, homeBookAllowsDrag } from "@/domains/home/experience/homeBookGestures";
import { createSeriesGlassReflection } from "../../series/components/experience/seriesGlassReflection";
import { createPortraitArtbookMotion, type PortraitArtbookController } from "../portrait-artbook/portraitArtbookMotion";
import { createPortraitPageCache } from "../portrait-artbook/portraitPageCache";
import type { GlassArtbookLoadState } from "../glass-artbook/types";
import ArtworkLoading from "@/shared/ui/artwork/ArtworkLoading";
import GalleryBookPage from "./GalleryBookPage";
import ArtworkBookDock from "./ArtworkBookDock";
import { createGalleryTurnQueue, subscribeGallerySpread, type PageDirection } from "./galleryBookNavigation";
import portraitStyles from "../portrait-artbook/ArtworkPortraitArtbook.module.css";
import styles from "./GalleryBook.module.css";

function galleryMaterial() {
    const material = createSeriesGlassReflection();
    const sampledFaces = new WeakMap<HTMLElement, number>();
    return {
        ...material,
        render(page: HTMLElement, angle = 0, moving = false) {
            // Keep the catalogue's shared glass; avoid re-sampling the CPU
            // fallback for imperceptible angle changes while a sheet moves.
            const previous = sampledFaces.get(page);
            if (moving && previous !== undefined && Math.abs(angle - previous) < 4) return;
            material.render(page, angle, moving);
            if (moving && page.querySelector('[data-series-renderer="fallback"]')) sampledFaces.set(page, angle);
        },
    };
}

/** Replace the source entry so Back and the language switch return to this leaf. */
function rememberFolio(slug: string | null) {
    const url = new URL(window.location.href);
    if (url.searchParams.get("artwork") === slug) return;
    if (slug) url.searchParams.set("artwork", slug);
    else url.searchParams.delete("artwork");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
}

interface Props {
    artworks: Artwork[]; cover?: Artwork; query: string; density: number; spread: boolean; initialSlug: string | null; startOnFolio: boolean; onExit(): void;
}

export default function ArchiveGlassBook({ artworks, cover, query, density, spread, initialSlug, startOnFolio, onExit }: Props) {
    const t = useTranslations("ArchiveBook"), glass = useTranslations("Glass"), archive = useTranslations("Archive");
    const [anchor, setAnchor] = useState<number | null>(() => {
        const index = artworks.findIndex(work => work.slug === initialSlug);
        return index >= 0 ? index : startOnFolio ? 0 : null;
    });
    const perView = (spread ? 2 : 1) * density, last = Math.ceil(artworks.length / perView);
    const page = anchor === null ? 0 : 1 + Math.floor(anchor / perView);
    const [queue] = useState(createGalleryTurnQueue);
    const [requested, setRequested] = useState<number | null>(null);
    const [load, setLoad] = useState<GlassArtbookLoadState | null>(null);
    const [cache] = useState(createPortraitPageCache), [material] = useState(galleryMaterial);
    const root = useRef<HTMLElement>(null), frame = useRef<HTMLDivElement>(null), track = useRef<HTMLDivElement>(null), overlay = useRef<HTMLDivElement>(null);
    const controller = useRef<PortraitArtbookController | null>(null);
    const pendingFrame = useRef(0);
    const pump = useCallback(() => {
        cancelAnimationFrame(pendingFrame.current);
        pendingFrame.current = requestAnimationFrame(() => {
            if (controller.current) queue.dispatch(page, direction => controller.current!.navigate(direction));
        });
    }, [page, queue]);
    const request = useCallback((direction: PageDirection) => {
        if (!queue.request(page, last, direction)) return false;
        setRequested(queue.end(page)); pump();
        return true;
    }, [last, page, pump, queue]);
    const resetTurns = useCallback(() => { queue.clear(); setRequested(null); }, [queue]);

    useEffect(() => subscribeGallerySpread(resetTurns), [resetTurns]);
    useEffect(() => () => material.dispose(), [material]);

    useLayoutEffect(() => {
        const element = root.current, viewport = frame.current, slots = track.current, moving = overlay.current;
        if (!element || !viewport || !slots || !moving) return;
        const find = (index: number) => slots.querySelector<HTMLElement>('[data-portrait-page="' + index + '"]');
        const current = find(page);
        if (!current) return;
        const unbindDrag = bindHomeBookLinkDrag(viewport);
        controller.current = createPortraitArtbookMotion({
            root: element, frame: viewport, overlay: moving, current, previous: find(page - 1), next: find(page + 1),
            pageCache: cache, renderSurface: material.render, canStartDrag: homeBookAllowsDrag, requestStep: request,
            acceptsKeyboard(target) {
                if (!(target instanceof Element) || target.closest("[data-artwork-dock],dialog")) return false;
                if (element.contains(target)) return true;
                const bounds = viewport.getBoundingClientRect();
                return target === document.body && bounds.top < innerHeight * .8 && bounds.bottom > innerHeight * .2;
            },
            onActivity() {}, onInteraction() {}, onCancel: resetTurns,
            onLoad(state) {
                setLoad(state);
                if (state.status === "error") resetTurns();
                if (state.status === "ready") pump();
            },
            onArrival: pump, onExit,
            onLand(direction) {
                const next = page + direction;
                if (viewport.contains(document.activeElement)) viewport.focus({ preventScroll: true });
                const index = next === 0 ? null : (next - 1) * perView;
                setAnchor(index);
                rememberFolio(index === null ? null : artworks[index].slug);
                setRequested(queue.end(next));
            },
        });
        return () => {
            unbindDrag(); cancelAnimationFrame(pendingFrame.current);
            controller.current?.dispose(); controller.current = null;
        };
    }, [artworks, cache, last, material, onExit, page, perView, pump, queue, request, resetTurns]);

    function retry() { controller.current?.retry(); }
    const goal = Math.min(last, requested ?? page);
    const position = page === 0 ? t("cover") : t(spread ? "position" : "pagePosition", { current: page, total: last });
    const slots = [page - 1, page, page + 1].filter(i => i >= 0 && i <= last);

    return <section ref={root} className={styles.book} data-gallery-book="" data-portrait-learned="" aria-label={t("navigation")}>
        <div className={styles.desk}>
            <div ref={frame} className={styles.frame} tabIndex={-1} aria-label={position} aria-busy={load?.status === "loading"} data-gallery-frame="">
                <div ref={track} className={styles.track}>
                    {slots.map(i => <div key={i} className={portraitStyles.slot + (i === page ? "" : " " + portraitStyles.cached)}
                        aria-hidden={i !== page || undefined} inert={i !== page} data-active-page={i === page ? i : undefined}>
                        <GalleryBookPage index={i} artworks={artworks} cover={cover} perLeaf={density} spread={spread}
                            material={material} query={query} onFollow={rememberFolio} onStart={() => request(1)} />
                    </div>)}
                </div>
                {spread && <span className={styles.spine} aria-hidden="true" />}
                <div ref={overlay} className={portraitStyles.overlay} hidden inert aria-hidden="true" />
            </div>
            {load?.status === "loading" && <div className={styles.loading}><ArtworkLoading label={glass("preparing")} /></div>}
        </div>
        <ArtworkBookDock works={artworks} selected={anchor ?? 0} query={query} onFollow={rememberFolio} />
        {load?.status === "error" && <div role="alert" className={styles.error}>{glass("error")} <button onClick={retry}>{glass("retry")}</button></div>}
        <nav className={styles.navigation} aria-label={t("navigation")}>
            <button type="button" disabled={goal <= 0} onClick={() => request(-1)}><span aria-hidden="true">←</span> {glass("previous")}</button>
            <span className={styles.position} role="status">{position}<small>{archive("resultCount", { count: artworks.length })}</small></span>
            <button type="button" disabled={goal >= last} onClick={() => request(1)}>{glass("next")} <span aria-hidden="true">→</span></button>
        </nav>
    </section>;
}
