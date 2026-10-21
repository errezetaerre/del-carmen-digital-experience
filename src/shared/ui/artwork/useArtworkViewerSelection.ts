"use client";

import { useSyncExternalStore } from "react";
import type { Artwork } from "@/domains/artworks/model/artwork";
import { closeArtworkViewerLocation, selectArtworkInViewer, subscribeArtworkViewerLocation } from "./artworkViewerLocation";

function selectedSlug() { return new URLSearchParams(window.location.search).get("artwork") ?? ""; }

export default function useArtworkViewerSelection(artworks: Artwork[], initialSlug = "") {
    const slug = useSyncExternalStore(subscribeArtworkViewerLocation, selectedSlug, () => initialSlug);
    const index = artworks.findIndex(artwork => artwork.slug === slug);
    return {
        selectedIndex: index < 0 ? null : index,
        open: (artwork: Artwork) => selectArtworkInViewer(artwork, undefined, true),
        close: closeArtworkViewerLocation,
    };
}
