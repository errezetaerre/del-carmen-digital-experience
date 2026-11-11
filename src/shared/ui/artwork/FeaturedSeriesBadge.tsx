import { isFeaturedArtworkSeries } from "@/domains/artworks/presentation/getArtworkPresentation";
import type { ArtworkSeries } from "@/domains/artworks/series/types";
import { artworkHaloSymbol } from "./artworkHaloSymbols";
import styles from "./ArtworkBadges.module.css";
import { useLocale, useTranslations } from "next-intl";

// A curatorial marker, independent of awards, artwork availability and sales.
// Its inline footprint preserves the existing editorial eyebrow positions.
export default function FeaturedSeriesBadge({ series }: { series: ArtworkSeries }) {
    const locale = useLocale();
    const t = useTranslations("Artwork");
    if (!isFeaturedArtworkSeries(series)) return null;
    return <span lang={locale} className={`${styles.root} ${styles.seriesTag}`} data-featured-series={series.id}>
        <span className={styles.symbol} dangerouslySetInnerHTML={{ __html: artworkHaloSymbol("featured") }} />
        <span className={styles.label}>{t("featuredCollection")}</span>
    </span>;
}
