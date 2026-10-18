import { isFeaturedArtworkSeries } from "@/domains/artworks/presentation/getArtworkPresentation";
import { artworkHaloSymbol } from "./artworkHaloSymbols";
import styles from "./ArtworkBadges.module.css";
import { useLocale, useTranslations } from "next-intl";

// A curatorial marker, independent of awards, artwork availability and sales.
// Its inline footprint preserves the existing editorial eyebrow positions.
export default function FeaturedSeriesBadge({ seriesId }: { seriesId: string }) {
    const locale = useLocale();
    const t = useTranslations("Artwork");
    if (!isFeaturedArtworkSeries(seriesId)) return null;
    return <span lang={locale} className={`${styles.root} ${styles.seriesTag}`} data-featured-series={seriesId}>
        <span className={styles.symbol} dangerouslySetInnerHTML={{ __html: artworkHaloSymbol("featured") }} />
        <span className={styles.label}>{t("featuredCollection")}</span>
    </span>;
}
