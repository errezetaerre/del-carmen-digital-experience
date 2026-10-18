"use client";

import { useLocale, useTranslations } from "next-intl";
import { localizeHref } from "@/i18n/config";
import { localizeArtwork } from "@/i18n/artworkCopy";
import LanguageSwitcher from "@/i18n/LanguageSwitcher";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "@/i18n/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import gsap from "gsap";
import type { Artwork } from "@/domains/artworks";
import { getArtworkPresentation } from "../../presentation/getArtworkPresentation";
import { artworkExperienceHref } from "../../presentation/artworkExperience";
import ArtworkDetailViewer from "../ArtworkDetailViewer";
import ArtworkBadges from "@/shared/ui/artwork/ArtworkBadges";
import ArtworkLoading from "@/shared/ui/artwork/ArtworkLoading";
import { artworkPreviewMarkup } from "@/shared/ui/artwork/artworkPreviewMarkup";
import { createGlassArtbook, GLASS_BOOK_QUERY } from "./runtime.mjs";
import type { ArtworkGlassArtbookProps, GlassArtbookController, GlassArtbookLoadState } from "./types";
import styles from "./ArtworkGlassArtbook.module.css";

export default function ArtworkGlassArtbook({
    artworks: sourceArtworks, initialArtworkId, navigationQuery,
}: ArtworkGlassArtbookProps) {
    const locale = useLocale();
    const t = useTranslations("Glass");
    const artworks = useMemo(() => sourceArtworks.map((artwork) => localizeArtwork(artwork, locale)), [sourceArtworks, locale]);
    const pathname = usePathname();
    const router = useRouter();
    const id = useId();
    const instanceId = `glass${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const hostRef = useRef<HTMLDivElement>(null);
    const experienceRef = useRef<HTMLElement>(null);
    const controllerRef = useRef<GlassArtbookController | null>(null);
    const initialIdRef = useRef(initialArtworkId);
    const onNavigateRef = useRef<(artwork: Artwork) => void>(() => {});
    const dataKey = useMemo(() => JSON.stringify(artworks), [artworks]);
    const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
    const [bookEligible, setBookEligible] = useState<boolean | null>(null);
    const [actionsHost, setActionsHost] = useState<HTMLElement | null>(null);
    const [highlightsHosts, setHighlightsHosts] = useState<HTMLElement[]>([]);
    const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(
        () => artworks.find((item) => item.id === initialArtworkId) ?? artworks[0] ?? null,
    );
    const [highlightArtworks, setHighlightArtworks] = useState<[Artwork | null, Artwork | null]>([null, null]);
    const [loadState, setLoadState] = useState<GlassArtbookLoadState>({ status: "loading", artworkId: initialArtworkId, kind: "entrance" });
    const standardHref = selectedArtwork
        ? artworkExperienceHref(selectedArtwork.slug, navigationQuery, "standard")
        : "/artworks";

    useEffect(() => { setPortalHost(document.body); }, []);

    useEffect(() => {
        const viewport = window.matchMedia(GLASS_BOOK_QUERY);
        let pendingDialog: MutationObserver | null = null;
        const update = () => {
            if (!viewport.matches && document.querySelector('[role="dialog"][aria-modal="true"]')) {
                if (!pendingDialog) {
                    pendingDialog = new MutationObserver(update);
                    pendingDialog.observe(document.body, { childList: true, subtree: true });
                }
                return;
            }
            pendingDialog?.disconnect();
            pendingDialog = null;
            setBookEligible(viewport.matches);
        };
        update();
        viewport.addEventListener("change", update);
        return () => {
            viewport.removeEventListener("change", update);
            pendingDialog?.disconnect();
        };
    }, []);

    useEffect(() => {
        if (bookEligible === false) router.replace(standardHref, { scroll: false });
    }, [bookEligible, router, standardHref]);

    useEffect(() => {
        if (!portalHost || !bookEligible) return;
        const previousOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";
        const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const siblings = Array.from(document.body.children)
            .filter((node): node is HTMLElement => node instanceof HTMLElement && node !== experienceRef.current && node.tagName !== "SCRIPT")
            .map((node) => ({ node, inert: node.inert }));
        siblings.forEach(({ node }) => { node.inert = true; });
        experienceRef.current?.querySelector<HTMLAnchorElement>("[data-glass-exit]")?.focus({ preventScroll: true });
        return () => {
            document.documentElement.style.overflow = previousOverflow;
            siblings.forEach(({ node, inert }) => { node.inert = inert; });
            if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
        };
    }, [portalHost, bookEligible]);

    useEffect(() => {
        onNavigateRef.current = (artwork) => {
            setSelectedArtwork(artwork);
            const query = new URLSearchParams(navigationQuery);
            query.set("experience", "glass");
            window.history.pushState(null, "", localizeHref(`/artworks/${artwork.slug}?${query.toString()}`, locale));
        };
    }, [navigationQuery, locale]);

    useLayoutEffect(() => {
        const host = hostRef.current;
        const items: Artwork[] = JSON.parse(dataKey);
        if (!portalHost || !bookEligible || !host || !items.length) return;
        // Establish the gate before a new native tree can paint, including
        // catalogue/filter rebuilds after this component was already ready.
        setLoadState({ status: "loading", artworkId: initialIdRef.current, kind: "entrance" });
        const controller = createGlassArtbook(host, {
            artworks: items,
            initialArtworkId: initialIdRef.current,
            instanceId,
            locale,
            motion: gsap,
            getPresentation: (artwork) => getArtworkPresentation(artwork, locale),
            renderPreview: (artwork) => artworkPreviewMarkup(artwork, locale),
            onHighlightArtwork: (slot, artwork) => setHighlightArtworks((previous) => {
                const next: [Artwork | null, Artwork | null] = [...previous];
                next[slot] = artwork;
                return next;
            }),
            onNavigate: (artwork) => onNavigateRef.current(artwork),
            onLoadStateChange: setLoadState,
        });
        controllerRef.current = controller;
        setActionsHost(host.querySelector<HTMLElement>("[data-glass-artwork-actions]"));
        setHighlightsHosts(Array.from(host.querySelectorAll<HTMLElement>("[data-glass-artwork-highlights]")));
        return () => { controller.dispose(); controllerRef.current = null; setActionsHost(null); setHighlightsHosts([]); setHighlightArtworks([null, null]); };
    }, [dataKey, instanceId, portalHost, bookEligible, locale]);

    useEffect(() => {
        if (!pathname?.startsWith("/artworks/")) return;
        let slug: string;
        try { slug = decodeURIComponent(pathname.slice("/artworks/".length).replace(/\/$/, "")); }
        catch { return; }
        const item = artworks.find((artwork) => artwork.slug === slug);
        if (!item) return;
        initialIdRef.current = item.id;
        controllerRef.current?.select(item.id);
        setSelectedArtwork(item);
    }, [pathname, dataKey, artworks]);

    useEffect(() => {
        if (!portalHost || !bookEligible) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape" || document.querySelector('[role="dialog"][aria-modal="true"]')) return;
            event.preventDefault();
            router.push(standardHref, { scroll: false });
        };
        document.addEventListener("keydown", onKeyDown);
        return () => { document.removeEventListener("keydown", onKeyDown); };
    }, [portalHost, bookEligible, router, standardHref]);

    if (!selectedArtwork) return null;
    if (!portalHost || !bookEligible) {
        return (
            <main className="min-h-screen bg-surface-deep text-white">
                <h1 className="sr-only">{selectedArtwork.title}</h1>
                {bookEligible !== false && <div className="grid min-h-screen place-items-center px-6 py-20"><ArtworkLoading label={t("opening")} /></div>}
                {bookEligible === false && <Link href={standardHref} className="block px-6 py-12 font-sans text-sm text-white/60">{t("standard")}</Link>}
                <noscript><a href={localizeHref(standardHref, locale)}>{t("openStandard", { title: selectedArtwork.title })}</a></noscript>
            </main>
        );
    }

    return createPortal(
        <main ref={experienceRef} className={`${styles.experience} bg-surface-deep text-white`} data-lenis-prevent aria-label={t("immersive")}>
            <div className={`${styles.exit} flex items-center gap-5`}>
                <LanguageSwitcher className="text-white/60" />
                <Link href={standardHref} data-glass-exit className="font-sans text-[10px] uppercase tracking-[0.28em] text-white/60 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold/60" aria-label={t("exitLabel")}>
                    {t("exit")} <span aria-hidden="true">×</span>
                </Link>
            </div>
            <h1 className="sr-only">{selectedArtwork.title}</h1>
            <div className={styles.bookViewport} data-lenis-prevent aria-busy={loadState.status === "loading"}>
                <div ref={hostRef} className={`${styles.root} font-sans`} inert={loadState.status !== "ready" && !(loadState.status === "loading" && loadState.kind === "turn")} aria-label={t("viewer")} />
            </div>
            {loadState.status !== "ready" && <div className={`${styles.loadingPanel} ${loadState.kind === "turn" ? styles.turnLoading : ""}`}>
                {loadState.status === "loading" ? <ArtworkLoading label={t(loadState.kind === "turn" ? "loadingArtwork" : "preparing")} /> : <div className={styles.loadError}>
                    <p role="alert" className="font-sans text-sm text-white/70">{t("error")}</p>
                    <button type="button" onClick={() => controllerRef.current?.retry()} className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-gold transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold/60">{t("retry")}</button>
                    <Link href={standardHref} className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-brand-gold">{t("standard")}</Link>
                </div>}
            </div>}
            {actionsHost && experienceRef.current && createPortal(
                <ArtworkDetailViewer artwork={selectedArtwork} triggerOnly portalTarget={experienceRef.current} />,
                actionsHost,
            )}
            {highlightsHosts.map((host, slot) => {
                const artwork = highlightArtworks[slot];
                return artwork ? createPortal(
                    <div key={artwork.id} data-glass-highlight-artwork={artwork.id}>
                        <ArtworkBadges artwork={artwork} />
                    </div>,
                    host,
                    `highlights-${slot}`,
                ) : null;
            })}
        </main>,
        portalHost,
    );
}
