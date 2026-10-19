import { isCoverArtwork } from "@/domains/artworks/presentation/getArtworkPresentation";
import { artworkHaloSymbol } from "@/shared/ui/artwork/artworkHaloSymbols";
import styles from "@/shared/ui/artwork/ArtworkBadges.module.css";
import { useTranslations } from "next-intl";

// A Home cover choice does not imply a release date, award or Featured status.
export default function CoverArtworkBadge({ artworkId }: { artworkId: string }) {
    const t = useTranslations("Artwork");
    if (!isCoverArtwork({ id: artworkId })) return null;
    return <span className={`${styles.root} ${styles.coverTag}`} data-cover-artwork={artworkId}>
        <span className={styles.symbol} dangerouslySetInnerHTML={{ __html: artworkHaloSymbol("cover") }} />
        <span className={styles.label}>{t("cover")}</span>
    </span>;
}
