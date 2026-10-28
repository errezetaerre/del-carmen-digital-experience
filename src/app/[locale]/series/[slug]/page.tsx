import { activateLocale } from "@/i18n/server";
import { getTranslations } from "next-intl/server";
import { localizeArtworkSeries } from "@/i18n/seriesCopy";
import { createPageMetadata } from "@/shared/lib/metadata";
import { notFound } from "next/navigation";
import { getArtworkSeries, getArtworkSeriesBySlug, getArtworksBySeriesId } from "@/domains/artworks";
import SeriesExperience from "@/domains/artworks/series/components/experience/SeriesExperience";

interface SeriesPageProps {
    params: Promise<{ locale: string; slug: string }>;
    searchParams: Promise<{ artwork?: string | string[]; view?: string | string[] }>;
}

export function generateStaticParams() {
    return getArtworkSeries().map(
        (series) => ({
            slug: series.slug,
        }),
    );
}

export async function generateMetadata({ params }: Pick<SeriesPageProps, "params">) {
    const locale = await activateLocale(params);
    const { slug } = await params;
    const sourceSeries = getArtworkSeriesBySlug(slug);
    if (!sourceSeries) notFound();
    const series = localizeArtworkSeries(sourceSeries, locale);
    const t = await getTranslations({ locale, namespace: "Series" });
    const cover = getArtworksBySeriesId(series.id).find((artwork) =>
        artwork.id === series.coverArtworkId && artwork.creationStatus === "completed");
    return createPageMetadata({ locale, pathname: `/series/${series.slug}`, image: cover?.images.primary, title: series.title,
        description: series.description || series.statement || t("metadataFallback", { title: series.title }) });
}

export default async function SeriesPage({ params, searchParams }: SeriesPageProps) {
    const locale = await activateLocale(params);
    const { slug } = await params;
    const requested = await searchParams;
    const source = getArtworkSeriesBySlug(slug);
    if (!source) notFound();
    const entries = getArtworkSeries().map(series => ({
        series: localizeArtworkSeries(series, locale),
        artworks: getArtworksBySeriesId(series.id),
    }));
    const artworks = getArtworksBySeriesId(source.id);
    const initialArtworkSlug = typeof requested.artwork === "string" && artworks.some(artwork => artwork.slug === requested.artwork)
        ? requested.artwork : undefined;
    return <SeriesExperience entries={entries} initialSeriesSlug={source.slug} initialArtworkSlug={initialArtworkSlug}
        initialView={requested.view === "glass" ? "glass" : "standard"} />;
}
