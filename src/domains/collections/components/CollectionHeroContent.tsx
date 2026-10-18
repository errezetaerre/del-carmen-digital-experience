import { LinkButton } from "@/shared/ui/button";
import FeaturedSeriesBadge from "@/shared/ui/artwork/FeaturedSeriesBadge";
import { isFeaturedArtworkSeries } from "@/domains/artworks/presentation/getArtworkPresentation";
import { useLocale, useTranslations } from "next-intl";
import { localizeArtworkSeries, seriesTextLocale } from "@/i18n/seriesCopy";

import type { ArtworkSeries } from "@/domains/artworks/series";

interface CollectionHeroContentProps {
    series: ArtworkSeries;
    artworkCount: number;
}

export default function CollectionHeroContent({
    series: sourceSeries,
    artworkCount,
}: CollectionHeroContentProps) {
    const locale = useLocale();
    const t = useTranslations("Series");
    const series = localizeArtworkSeries(sourceSeries, locale);
    const yearLabel = series.yearStart
        ? series.yearEnd
            ? `${series.yearStart} — ${series.yearEnd}`
            : series.status === "ongoing"
                ? `${series.yearStart} — ${t("ongoing")}`
                : `${series.yearStart}`
        : null;

    return (
        <div
            className="
                relative
                z-20
                max-w-2xl
            "
        >
            <p
                className="
                    mb-25
                    font-sans
                    text-[10px]
                    uppercase
                    tracking-[0.38em]
                    text-brand-gold
                "
            >
                {isFeaturedArtworkSeries(series.id) ? <FeaturedSeriesBadge seriesId={series.id} /> : t("label")}
            </p>

            <h2
                className="
                    font-display
                    text-5xl
                    font-light
                    leading-[0.92]
                    tracking-[0.01em]
                    text-white

                    md:text-7xl
                    lg:text-8xl
                "
            >
                {series.title}
            </h2>

            {series.description && (
                <p
                    lang={seriesTextLocale(series, locale)}
                    className="
                        mt-6
                        max-w-lg
                        font-sans
                        text-sm
                        font-light
                        leading-7
                        text-white/65

                        md:text-base
                    "
                >
                    {series.description}
                </p>
            )}

            <div
                className="
                    mt-7
                    flex
                    flex-wrap
                    items-center
                    gap-x-3
                    gap-y-2
                    font-sans
                    text-[10px]
                    uppercase
                    tracking-[0.24em]
                    text-white/40
                "
            >
                {yearLabel && (
                    <span>
                        {yearLabel}
                    </span>
                )}

                {yearLabel && (
                    <span className="text-brand-gold/45">
                        ·
                    </span>
                )}

                <span>
                    {t("workCount", { count: artworkCount })}
                </span>
            </div>

            <div className="mt-9">
                <LinkButton
                    href={`/series/${series.slug}`}
                    variant="goldUnderline"
                >
                    {t("exploreCollection")}
                </LinkButton>
            </div>
        </div>
    );
}
