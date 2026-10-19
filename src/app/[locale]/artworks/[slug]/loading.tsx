"use client";

import useClientReady from "@/shared/hooks/useClientReady";
import ArtworkLoading from "@/shared/ui/artwork/ArtworkLoading";
import { hasStandardNavigationSnapshot } from "@/domains/artworks/presentation/artworkNavigationContinuity";
import styles from "@/shared/ui/artwork/ArtworkNavigationFeedback.module.css";

export default function ArtworkRouteLoading() {
    const clientReady = useClientReady();
    const continuing = clientReady && hasStandardNavigationSnapshot();
    if (continuing) return <div className={styles.continuityStatus}><ArtworkLoading /></div>;
    return <main className="grid min-h-screen place-items-center bg-surface-deep px-6 py-20 text-white">
        <ArtworkLoading />
    </main>;
}
