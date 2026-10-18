"use client";

import { useEffect, useRef } from "react";
import { bindArtworkArrivalAccent } from "./artworkArrivalLifecycle";

export default function ArtworkArrivalAccent({ artworkId, surface = "standard" }: { artworkId: string; surface?: "standard" | "lightbox" }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) return bindArtworkArrivalAccent(ref.current, surface);
    }, [artworkId, surface]);

    return <div ref={ref} data-artwork-arrival-accent data-artwork-standard-accent={surface === "standard" ? "" : undefined} aria-hidden="true"
        style={{ position: "absolute", inset: 0, pointerEvents: "none", userSelect: "none", zIndex: 46 }} />;
}
