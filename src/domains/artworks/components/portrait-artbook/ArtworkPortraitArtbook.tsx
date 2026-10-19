"use client";

import { useId, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import Link, { usePathname, useRouter } from "@/i18n/navigation";
import { localizeHref } from "@/i18n/config";
import { artworkExperienceHref } from "../../presentation/artworkExperience";
import { getArtworkPresentation } from "../../presentation/getArtworkPresentation";
import ArtworkDetailScene from "../ArtworkDetailScene";
import ArtworkLoading from "@/shared/ui/artwork/ArtworkLoading";
import { glassRimMarkup } from "@/shared/ui/artwork/glassAccents";
import { burstArtworkDust } from "@/shared/ui/particle-field/dust";
import type { ArtworkGlassArtbookProps, GlassArtbookLoadState } from "../glass-artbook/types";
import { createPortraitArtbookMotion, type PortraitArtbookController } from "./portraitArtbookMotion";
import styles from "./ArtworkPortraitArtbook.module.css";

let portraitHintLearned = false;
// Like Standard, learning lasts for this document, including client-side
// artwork navigation. A new visit/reload teaches again; old stored flags
// must not suppress the visible lesson on the production domain forever.

function PortraitMaterial() {
    const host = useRef<HTMLDivElement>(null);
    const id = `portrait${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
    useLayoutEffect(() => {
        const element = host.current;
        if (!element?.parentElement) return;
        let geometry = "";
        const measure = () => {
            const { width, height } = element.parentElement!.getBoundingClientRect();
            const next = `${width}/${height}`;
            if (!width || !height || next === geometry) return;
            geometry = next;
            element.innerHTML = glassRimMarkup(`${id}-left`, width, height, -1) + glassRimMarkup(`${id}-right`, width, height, 1);
        };
        const observer = new ResizeObserver(measure);
        observer.observe(element.parentElement); measure();
        return () => observer.disconnect();
    }, [id]);
    return <><div className={styles.reflection} aria-hidden="true" /><div ref={host} className={styles.rim} aria-hidden="true" /></>;
}

export default function ArtworkPortraitArtbook({ artworks, initialArtworkId, navigationQuery, backHref, backLabel }: ArtworkGlassArtbookProps) {
    const locale = useLocale();
    const t = useTranslations("Artwork");
    const glass = useTranslations("Glass");
    const pathname = usePathname();
    const router = useRouter();
    let routeSlug = "";
    try { routeSlug = decodeURIComponent(pathname.replace(/^\/artworks\//, "").replace(/\/$/, "")); } catch { /* Keep the canonical initial ID. */ }
    const routeIndex = artworks.findIndex(artwork => artwork.slug === routeSlug);
    const index = routeIndex >= 0 ? routeIndex : Math.max(0, artworks.findIndex(artwork => artwork.id === initialArtworkId));
    const currentArtwork = artworks[index];
    const previous = artworks[index - 1];
    const next = artworks[index + 1];
    const rootRef = useRef<HTMLElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const bubbleRef = useRef<HTMLDivElement>(null);
    const dockRef = useRef<HTMLSpanElement>(null);
    const controllerRef = useRef<PortraitArtbookController | null>(null);
    const presentedRef = useRef(false);
    const [learnedAtMount] = useState(() => portraitHintLearned);
    const [loadState, setLoadState] = useState<GlassArtbookLoadState>({ status: "loading", artworkId: initialArtworkId, kind: "entrance" });

    useLayoutEffect(() => {
        const root = rootRef.current, frame = frameRef.current, overlay = overlayRef.current;
        if (!root || !frame || !overlay || !currentArtwork) return;
        const page = (id: string | undefined) => id ? Array.from(frame.querySelectorAll<HTMLElement>("[data-portrait-page]")).find(node => node.dataset.portraitPage === id) ?? null : null;
        const current = page(currentArtwork.id);
        if (!current) return;
        const hintBubble = bubbleRef.current;
        let loadingTimer: number | undefined;
        let stopDust: (() => void) | undefined;
        const controller = createPortraitArtbookMotion({
            root, frame, overlay, current,
            previous: page(artworks[index - 1]?.id), next: page(artworks[index + 1]?.id),
            onLoad(state) {
                window.clearTimeout(loadingTimer);
                if (state.status === "ready") {
                    presentedRef.current = true;
                    setLoadState(state);
                } else if (state.status === "loading" && presentedRef.current) {
                    loadingTimer = window.setTimeout(() => setLoadState({ ...state, kind: "turn" }), 120);
                } else setLoadState(state);
            },
            onActivity() {
                stopDust?.(); stopDust = undefined;
            },
            onInteraction() {
                if (portraitHintLearned) return;
                portraitHintLearned = true;
                root.dataset.portraitLearned = "";
                const bubble = bubbleRef.current, dock = dockRef.current;
                if (!bubble || !dock) return;
                bubble.dataset.sealing = "";
                gsap.set(bubble, { opacity: 1, filter: "blur(0px)", visibility: "visible" });
                const from = bubble.getBoundingClientRect(), to = dock.getBoundingClientRect();
                gsap.to(bubble, {
                    x: to.left + to.width / 2 - from.left - from.width / 2,
                    y: to.top + to.height / 2 - from.top - from.height / 2,
                    scale: .65, opacity: 0,
                    duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : .7,
                    ease: "power3.inOut",
                    onComplete() { delete bubble.dataset.sealing; bubble.style.visibility = "hidden"; },
                });
            },
            onLand(direction) {
                const artwork = artworks[index + direction];
                if (artwork) window.history.pushState(null, "", localizeHref(artworkExperienceHref(artwork.slug, navigationQuery, "glass"), locale));
            },
            onExit() { router.push(artworkExperienceHref(currentArtwork.slug, navigationQuery, "standard"), { scroll: false }); },
            onArrival() {
                const badges = getArtworkPresentation(currentArtwork, locale).badges;
                if (currentArtwork.creationStatus !== "completed" || !badges.some(badge => badge.kind !== "planned" && badge.kind !== "in-progress") ||
                    window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.querySelector('[role="dialog"][aria-modal="true"]')) return;
                const ribbon = current.querySelector<HTMLElement>("[data-artwork-highlights]");
                if (!ribbon) return;
                const origin = frame.getBoundingClientRect(), badge = ribbon.getBoundingClientRect();
                if (!badge.width || !badge.height) return;
                stopDust = burstArtworkDust(frame, { x: 1, y: 1, width: origin.width - 2, height: origin.height - 2, radius: 13 },
                    { x: badge.left - origin.left, y: badge.top - origin.top, width: badge.width, height: badge.height });
            },
        });
        controllerRef.current = controller;
        return () => {
            window.clearTimeout(loadingTimer); stopDust?.(); controller.dispose(); controllerRef.current = null;
            if (hintBubble) {
                gsap.killTweensOf(hintBubble);
                delete hintBubble.dataset.sealing;
                gsap.set(hintBubble, { clearProps: "transform,opacity,filter,visibility" });
            }
        };
    }, [artworks, index, currentArtwork, locale, navigationQuery, router]);

    function navigate(event: MouseEvent<HTMLAnchorElement>, direction: -1 | 1) {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
        event.preventDefault(); controllerRef.current?.navigate(direction);
    }

    if (!currentArtwork) return null;
    return <main ref={rootRef} className={styles.experience} data-portrait-artbook data-portrait-current={currentArtwork.id}
        data-portrait-learned={learnedAtMount || undefined} data-lenis-prevent aria-label={glass("viewer")}>
        <div className={styles.toolbar}>
            <Link href={backHref} className={`${styles.back} font-sans text-[10px] uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-brand-gold focus-visible:outline focus-visible:outline-brand-gold`}>
                <span>← {backLabel}</span>
            </Link>
            <Link href={artworkExperienceHref(currentArtwork.slug, navigationQuery, "standard")} className={`${styles.exit} font-sans text-[9px] uppercase tracking-[0.22em] text-white/60 transition-colors hover:text-brand-gold`} aria-label={glass("exitLabel")}>
                {glass("exit")} <span aria-hidden="true">×</span>
            </Link>
        </div>
        <div ref={frameRef} className={styles.frame} data-portrait-frame aria-busy={loadState.status === "loading"}>
            {artworks.slice(Math.max(0, index - 1), index + 2).map(artwork => {
                const active = artwork.id === currentArtwork.id;
                return <div key={artwork.id} className={`${styles.slot} ${active ? "" : styles.cached}`} data-portrait-slot={active ? "current" : "cached"} inert={!active} aria-hidden={!active || undefined}>
                    <div className={styles.page} data-portrait-page={artwork.id}>
                        <div className={styles.reading} data-portrait-reading data-lenis-prevent tabIndex={active ? 0 : -1} role="region" aria-label={t("information", { title: artwork.title })}>
                            <ArtworkDetailScene artwork={artwork} navigationQuery={navigationQuery} editorialOnly />
                        </div>
                        <PortraitMaterial />
                    </div>
                </div>;
            })}
            <div ref={overlayRef} className={styles.overlay} data-portrait-overlay hidden inert aria-hidden="true" />
        </div>
        <nav className={styles.controls} aria-label={glass("viewer")}>
            {previous ? <Link href={artworkExperienceHref(previous.slug, navigationQuery, "glass")} onClick={event => navigate(event, -1)}
                className="group font-sans text-white/50 transition-colors hover:text-brand-gold focus-visible:outline focus-visible:outline-brand-gold">
                <span className="text-[9px] uppercase tracking-[0.2em]">← {t("previous")}</span>
                <span className={`${styles.title} font-display text-sm font-light md:text-base`}>{previous.title}</span>
            </Link> : <div />}
            <div className={styles.center}>
                <span className="font-sans text-[9px] tracking-[0.2em] text-white/35" role="status" aria-label={t("position", { index: index + 1, total: artworks.length })}>{String(index + 1).padStart(2, "0")} / {String(artworks.length).padStart(2, "0")}</span>
                <span ref={dockRef} className={`${styles.hintDock} font-sans text-[7px] uppercase tracking-[0.08em] text-white/35`} aria-hidden="true">‹ {t("swipe")} ›</span>
            </div>
            {next ? <Link href={artworkExperienceHref(next.slug, navigationQuery, "glass")} onClick={event => navigate(event, 1)}
                className={`${styles.next} group font-sans text-white/50 transition-colors hover:text-brand-gold focus-visible:outline focus-visible:outline-brand-gold`}>
                <span className="text-[9px] uppercase tracking-[0.2em]">{t("next")} →</span>
                <span className={`${styles.title} font-display text-sm font-light md:text-base`}>{next.title}</span>
            </Link> : <div />}
        </nav>
        <div ref={bubbleRef} data-portrait-hint className={`${styles.reminder} font-sans text-[9px] uppercase tracking-[0.15em] text-white/70`} aria-hidden="true">{glass("swipeGlass")}</div>
        {loadState.status !== "ready" && <div className={styles.status}>
            {loadState.status === "loading" ? <ArtworkLoading label={glass(loadState.kind === "entrance" ? "preparing" : "loadingArtwork")} /> : <div className={styles.error}>
                <p role="alert" className="font-sans text-xs text-white/65">{glass("error")}</p>
                <button type="button" className="font-sans text-[10px] uppercase tracking-[0.15em] text-brand-gold" onClick={() => controllerRef.current?.retry()}>{glass("retry")}</button>
            </div>}
        </div>}
    </main>;
}
