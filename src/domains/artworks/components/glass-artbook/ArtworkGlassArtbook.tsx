"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import type { Artwork } from "@/domains/artworks";
import ArtworkDetailViewer from "../ArtworkDetailViewer";
import { createGlassArtbook, GLASS_BOOK_QUERY } from "./runtime.mjs";
import type { ArtworkGlassArtbookProps, GlassArtbookController } from "./types";
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
    const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(
        () => artworks.find((item) => item.id === initialArtworkId) ?? artworks[0] ?? null,
    );
    const standardHref = selectedArtwork
        ? `/artworks/${selectedArtwork.slug}${navigationQuery ? `?${navigationQuery}` : ""}`
        : "/artworks";
    const exitQuery = new URLSearchParams(navigationQuery);
    exitQuery.set("experience", "standard");
    const exitHref = selectedArtwork
        ? `/artworks/${selectedArtwork.slug}?${exitQuery.toString()}`
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

    useEffect(() => {
        const host = hostRef.current;
        const items: Artwork[] = JSON.parse(dataKey);
        if (!portalHost || !bookEligible || !host || !items.length) return;
        const controller = createGlassArtbook(host, {
            artworks: items,
            initialArtworkId: initialIdRef.current,
            instanceId,
            motion: gsap,
            onNavigate: (artwork) => onNavigateRef.current(artwork),
        });
        controllerRef.current = controller;
        setActionsHost(host.querySelector<HTMLElement>("[data-glass-artwork-actions]"));
        return () => { controller.dispose(); controllerRef.current = null; setActionsHost(null); };
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
            router.push(exitHref, { scroll: false });
        };
        document.addEventListener("keydown", onKeyDown);
        return () => { document.removeEventListener("keydown", onKeyDown); };
    }, [portalHost, bookEligible, router, exitHref]);

    if (!selectedArtwork) return null;
    if (!portalHost || !bookEligible) {
        return (
            <main className="min-h-screen bg-surface-deep text-white">
                <h1 className="sr-only">{selectedArtwork.title}</h1>
                {bookEligible === false && <Link href={standardHref} className="block px-6 py-12 font-sans text-sm text-white/60">Continue in standard view →</Link>}
                <noscript><a href={standardHref}>Open {selectedArtwork.title} in standard view</a></noscript>
            </main>
        );
    }

    return createPortal(
        <main ref={experienceRef} className={`${styles.experience} bg-surface-deep text-white`} aria-label="Immersive Glass Artbook">
            <Link href={exitHref} className={`${styles.exit} font-sans text-[10px] uppercase tracking-[0.28em] text-white/60 transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold/60`} aria-label="Exit Artbook and return to standard view">
                Exit <span aria-hidden="true">×</span>
            </Link>
            <h1 className="sr-only">{selectedArtwork.title}</h1>
            <div ref={hostRef} className={`${styles.root} font-sans`} aria-label="Glass Artbook artwork viewer" />
            {actionsHost && experienceRef.current && createPortal(
                <ArtworkDetailViewer artwork={selectedArtwork} triggerOnly portalTarget={experienceRef.current} />,
                actionsHost,
            )}
        </main>,
        portalHost,
    );
}
