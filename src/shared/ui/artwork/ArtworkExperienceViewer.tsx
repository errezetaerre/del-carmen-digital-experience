"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal, flushSync } from "react-dom";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { localizeArtwork } from "@/i18n/artworkCopy";
import { localizeHref } from "@/i18n/config";
import { artworkBookViewport, subscribeArtworkBookViewport } from "@/domains/artworks/presentation/artworkBookViewport";
import type { ArtworkBookHost } from "@/domains/artworks/components/glass-artbook/types";
import useDialogFocus from "@/shared/hooks/useDialogFocus";
import type { ArtworkLightboxProps } from "./ArtworkLightbox";
import useArtworkExperience from "./useArtworkExperience";
import { setArtworkExperiencePreference } from "./artworkExperiencePreference";
import ArtworkExperienceToolbar from "./ArtworkExperienceToolbar";
import ArtworkLoading from "./ArtworkLoading";
import ArtworkViewerEditorial from "./ArtworkViewerEditorial";
import { hasBlockingArtworkDialog } from "./hasBlockingArtworkDialog";
import { artworkViewerInformation } from "./artworkViewerInformation";
import { artworkViewerHref, artworkViewerLocation, selectArtworkInViewer, subscribeArtworkViewerLocation, type ArtworkViewerMode } from "./artworkViewerLocation";
import styles from "./ArtworkExperienceViewer.module.css";
import useArtworkGestureBoundary from "./useArtworkGestureBoundary";

function Preparing() {
    const t = useTranslations("Glass");
    return <div className={styles.checking}><ArtworkLoading label={t("preparing")} /></div>;
}
const StandardViewer = dynamic(() => import("./ArtworkLightbox"), { ssr: false, loading: Preparing });
const PortraitBook = dynamic(() => import("@/domains/artworks/components/portrait-artbook/ArtworkPortraitArtbook"), { ssr: false, loading: Preparing });
const LandscapeBook = dynamic(() => import("@/domains/artworks/components/glass-artbook/ArtworkGlassArtbook"), { ssr: false, loading: Preparing });
function checkingViewport(): "checking" { return "checking"; }

export default function ArtworkExperienceViewer({ artworks: sourceArtworks, initialIndex, onClose, showDetailsCta = false,
    showAllWorksCta = true, detailsCtaLabel, detailsQuery, backLabel }: Omit<ArtworkLightboxProps, "isOpen" | "presentation" | "embedded" | "onIndexChange"> & { backLabel?: string }) {
    const locale = useLocale();
    const t = useTranslations("Artwork");
    const artworks = useMemo(() => sourceArtworks.map(artwork => localizeArtwork(artwork, locale)), [sourceArtworks, locale]);
    const artwork = artworks[initialIndex];
    const viewport = useSyncExternalStore(subscribeArtworkBookViewport, artworkBookViewport, checkingViewport);
    const location = useSyncExternalStore(subscribeArtworkViewerLocation, artworkViewerLocation, () => "");
    const preference = useArtworkExperience();
    const requested = new URL(location || "/", "https://viewer.invalid").searchParams.get("experience");
    const mode = viewport === "unsupported" ? "standard" : preference ?? "standard";
    const root = useRef<HTMLDivElement>(null);
    useArtworkGestureBoundary(root);
    const closeButton = useRef<HTMLButtonElement>(null);
    const returnFocus = useRef<HTMLElement | null>(null);
    const [switching, setSwitching] = useState<"glass" | "standard" | null>(null);
    const switchFrame = useRef(0);
    const finishSwitch = useCallback(() => setSwitching(null), []);
    useEffect(() => () => cancelAnimationFrame(switchFrame.current), []);
    const switchMode = useCallback((next: ArtworkViewerMode) => {
        if (!artwork) return;
        // Paint feedback before a cached book's layout/WebGL work starts.
        flushSync(() => setSwitching(next));
        switchFrame.current = requestAnimationFrame(() => {
            switchFrame.current = requestAnimationFrame(() => {
                flushSync(() => {
                    setArtworkExperiencePreference(next);
                    selectArtworkInViewer(artwork, next);
                });
            });
        });
    }, [artwork]);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
    const captureRoot = useCallback((element: HTMLDivElement | null) => { root.current = element; setPortalTarget(element); }, []);
    useDialogFocus(root, true, { initialFocusRef: closeButton, onEscape() {
        const description = root.current?.querySelector<HTMLButtonElement>('[data-lightbox-description-toggle][aria-expanded="true"]');
        if (description) description.click(); else if (mode === "glass") switchMode("standard"); else onClose();
    } });
    useLayoutEffect(() => {
        const element = root.current;
        if (!element) return;
        returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }, []);
    useEffect(() => () => {
        // Wait until React has removed every portal and focus trap. Restoring
        // during teardown lets the closing zoom steal focus back again.
        const previousFocus = returnFocus.current;
        previousFocus?.ownerDocument.defaultView?.requestAnimationFrame(() => {
            if (previousFocus.isConnected && !previousFocus.closest("[inert]") && !hasBlockingArtworkDialog(previousFocus)) {
                previousFocus.focus({ preventScroll: true });
            }
        });
    }, []);
    useLayoutEffect(() => {
        if (artwork && preference && viewport !== "checking" && requested !== mode) selectArtworkInViewer(artwork, mode);
    }, [artwork, mode, requested, viewport, preference]);

    const detailsLabel = detailsCtaLabel ?? t("viewDetails");
    const host = useMemo<ArtworkBookHost>(() => ({
        artworkId: artwork?.id ?? "",
        onNavigate: next => selectArtworkInViewer(next, "glass"),
        onStandardView: () => switchMode("standard"),
        onLoadStateChange: state => { if (state.status !== "loading") finishSwitch(); },
        // Localized Link supplies its own locale prefix.
        hrefFor: next => localizeHref(artworkViewerHref(next.slug, "glass"), "en"),
        renderEditorial: next => <ArtworkViewerEditorial artwork={next} portalTarget={portalTarget} detailsQuery={detailsQuery}
            detailsLabel={detailsLabel} showDetails={showDetailsCta} showAllWorks={showAllWorksCta} />,
        renderInformation: (next, id) => artworkViewerInformation(next, locale, { id, detailsQuery, detailsLabel, showDetails: showDetailsCta, showAllWorks: showAllWorksCta }),
    }), [artwork, portalTarget, detailsQuery, detailsLabel, showDetailsCta, showAllWorksCta, locale, finishSwitch, switchMode]);
    if (!artwork) return null;
    const bookProps = { artworks, initialArtworkId: artwork.id, navigationQuery: detailsQuery ?? "", backHref: "/artworks", backLabel: t("back"), host };
    return createPortal(<div ref={captureRoot} className={styles.dialog} role="dialog" aria-modal="true" aria-label={t("information", { title: artwork.title })}
        data-lenis-prevent data-gallery-layout={viewport} data-artwork-experience={mode} data-gallery-artwork={artwork.id}>
        {mode === "glass" ? <ArtworkExperienceToolbar backLabel={backLabel ?? t("backToGallery")} onBack={onClose}
            onExit={() => switchMode("standard")} className={styles.glassToolbar} /> : <div className={`${styles.toolbar} font-sans`}>
            <button type="button" className={styles.mode} onClick={() => switchMode("glass")} aria-busy={Boolean(switching)}
                disabled={Boolean(switching) || viewport === "checking" || viewport === "unsupported"}>{t("openArtbook")}</button>
            <button ref={closeButton} type="button" className={styles.close} onClick={onClose} aria-label={t("closeViewer")}>×</button>
        </div>}
        {viewport === "checking" || !preference ? <Preparing /> : mode === "standard" ? <StandardViewer artworks={artworks} initialIndex={initialIndex} isOpen onClose={onClose}
            embedded onIndexChange={index => selectArtworkInViewer(artworks[index], "standard")} presentation="glass"
            layout={viewport === "landscape" ? "landscape" : "portrait"} onReady={finishSwitch}
            showDetailsCta={showDetailsCta} showAllWorksCta={showAllWorksCta} detailsCtaLabel={detailsLabel}
            detailsQuery={`${detailsQuery ? `${detailsQuery}&` : ""}experience=standard`} /> : viewport === "portrait" ?
                <PortraitBook {...bookProps} /> : <LandscapeBook {...bookProps} />}
        {switching && <div className={styles.switching} data-gallery-mode-loading aria-busy="true"><Preparing /></div>}
    </div>, document.body);
}
