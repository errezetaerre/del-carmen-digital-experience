import { homeCuration } from "@/domains/home/curation";
import { artworkHaloSymbol } from "@/shared/ui/artwork/artworkHaloSymbols";
import styles from "@/shared/ui/artwork/ArtworkBadges.module.css";

// A Home cover choice does not imply a release date, award or Featured status.
export default function CoverArtworkBadge({ artworkId }: { artworkId: string }) {
    if (artworkId !== homeCuration.hero.artworkId) return null;
    return <span className={`${styles.root} ${styles.coverTag}`} data-cover-artwork={artworkId}>
        <span className={styles.symbol} dangerouslySetInnerHTML={{ __html: artworkHaloSymbol("cover") }} />
        <span className={styles.label}>Cover Artwork</span>
    </span>;
}
