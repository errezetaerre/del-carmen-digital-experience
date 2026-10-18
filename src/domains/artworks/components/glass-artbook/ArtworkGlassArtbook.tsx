"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
    artworks, initialArtworkId, navigationQuery,
}: ArtworkGlassArtbookProps) {
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
        experienceRef.current?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
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
            window.history.pushState(null, "", `/artworks/${artwork.slug}?${query.toString()}`);
        };
    }, [navigationQuery]);

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
            motion: gsap,
            getPresentation: getArtworkPresentation,
            renderPreview: artworkPreviewMarkup,
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
    }, [dataKey, instanceId, portalHost, bookEligible]);

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
                {bookEligible !== false && <div className="grid min-h-screen place-items-center px-6 py-20"><ArtworkLoading label="Opening Artbook…" /></div>}
                {bookEligible === false && <Link href={standardHref} className="block px-6 py-12 font-sans text-sm text-white/60">Continue in standard view →</Link>}
                <noscript><a href={standardHref}>Open {selectedArtwork.title} in standard view</a></noscript>
            </main>
        );
    }

    return createPortal(
        <main ref={experienceRef} className={`${styles.experience} bg-surface-deep text-white`} data-lenis-prevent aria-label="Immersive Glass Artbook">
            <Link href={standardHref} className={`${styles.exit} font-sans text-[10px] uppercase tracking-[0.28em] text-white/60 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold/60`} aria-label="Exit Artbook and return to standard view">
                Exit <span aria-hidden="true">×</span>
            </Link>
            <h1 className="sr-only">{selectedArtwork.title}</h1>
            <div className={styles.bookViewport} data-lenis-prevent aria-busy={loadState.status === "loading"}>
                <div ref={hostRef} className={`${styles.root} font-sans`} inert={loadState.status !== "ready" && !(loadState.status === "loading" && loadState.kind === "turn")} aria-label="Glass Artbook artwork viewer" />
            </div>
            {loadState.status !== "ready" && <div className={`${styles.loadingPanel} ${loadState.kind === "turn" ? styles.turnLoading : ""}`}>
                {loadState.status === "loading" ? <ArtworkLoading label={loadState.kind === "turn" ? "Loading artwork…" : "Preparing Artbook…"} /> : <div className={styles.loadError}>
                    <p role="alert" className="font-sans text-sm text-white/70">This artwork could not finish loading.</p>
                    <button type="button" onClick={() => controllerRef.current?.retry()} className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-gold transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold/60">Try again</button>
                    <Link href={standardHref} className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-brand-gold">Continue in standard view →</Link>
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
