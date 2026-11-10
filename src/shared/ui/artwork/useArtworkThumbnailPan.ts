"use client";

import { useEffect, type RefObject } from "react";
import { bindArtworkThumbnailPan } from "./artworkThumbnailPan";

// A source key rebinds only when the actual media changes, not on rollover state.
export default function useArtworkThumbnailPan(root: RefObject<HTMLElement | null>, source: string | undefined) {
    useEffect(() => {
        if (source && root.current) return bindArtworkThumbnailPan(root.current);
    }, [root, source]);
}
