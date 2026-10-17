import { isFeaturedArtworkSeries } from "@/domains/artworks/presentation/getArtworkPresentation";
import { artworkHaloSymbol } from "./artworkHaloSymbols";
import styles from "./ArtworkBadges.module.css";

// A curatorial marker, independent of awards, artwork availability and sales.
// Its inline footprint preserves the existing editorial eyebrow positions.
export default function FeaturedSeriesBadge({ seriesId }: { seriesId: string }) {
    if (!isFeaturedArtworkSeries(seriesId)) return null;
    return <span className={`${styles.root} ${styles.seriesTag}`} data-featured-series={seriesId}>
        <span className={styles.symbol} dangerouslySetInnerHTML={{ __html: artworkHaloSymbol("featured") }} />
        <span className={styles.label}>Featured Collection</span>
    </span>;
}
