"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import ArtworkLoading from "@/shared/ui/artwork/ArtworkLoading";
import { MOBILE_LANDSCAPE_ENTRY_QUERY } from "../presentation/artworkExperience";
import styles from "./ArtworkDetailResponsiveEntry.module.css";

export default function ArtworkDetailResponsiveEntry({
    children, glassHref, standardHref, enabled = true,
}: { children: ReactNode; glassHref?: string; standardHref?: string; enabled?: boolean }) {
    const router = useRouter();
    const checked = useRef(false);
    const [phase, setPhase] = useState<"checking" | "opening" | "standard">("checking");

    useEffect(() => {
        if (checked.current) return;
        checked.current = true;
        if (!enabled || !glassHref || !window.matchMedia(MOBILE_LANDSCAPE_ENTRY_QUERY).matches) {
            setPhase("standard");
            return;
        }
        setPhase("opening");
        router.replace(glassHref, { scroll: false });
    }, [enabled, glassHref, router]);

    if (!enabled || !glassHref) return children;

    return <div className={styles.entry} data-entry-phase={phase}>
        {phase !== "opening" && <div className={styles.standard}>{children}</div>}
        <div className={styles.loading}>
            <ArtworkLoading label="Opening Artbook…" />
            {standardHref && <noscript><a href={standardHref} className="font-sans text-sm text-white/60">Continue in standard view →</a></noscript>}
        </div>
    </div>;
}
