"use client";

import type { Artwork } from "@/domains/artworks";
import CollectionArtwork from "../sections/collection/CollectionArtwork";

/** Retain the site's actual frame, badges, Coming Soon, rollover and optimized Image. */
export default function HomeBookGallery({ artworks, onOpen, compact = false }: {
    artworks: Artwork[]; onOpen(work: Artwork): void; compact?: boolean;
}) {
    return <div className={compact ? "collection-thumbs" : "paintings-grid"} data-home-native-scroll>
        {artworks.map(work => <div className="home-artwork-card" data-home-book-card key={work.id}>
            <CollectionArtwork artwork={work} presentation="series" onOpen={() => onOpen(work)} />
        </div>)}
    </div>;
}
