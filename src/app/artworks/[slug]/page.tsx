import { notFound } from "next/navigation";

import {
    getArtworks,
    getArtworkBySlug,
    getArtworkSeriesBySlug,
    getArtworksBySeriesId,
} from "@/domains/artworks";

import ArtworkDetailKineticExperience from "@/domains/artworks/components/ArtworkDetailKineticExperience";
import ArtworkDetailScene from "@/domains/artworks/components/ArtworkDetailScene";

interface ArtworkPageProps {
    params: Promise<{
        slug: string;
    }>;

    searchParams: Promise<{
        category?: string;
        year?: string;
        medium?: string;
        series?: string;
    }>;
}

export function generateStaticParams() {
    return getArtworks().map((artwork) => ({
        slug: artwork.slug,
    }));
}

export default async function ArtworkPage({
    params,
    searchParams,
}: ArtworkPageProps) {
    const { slug } = await params;

    const {
        category,
        year,
        medium,
        series: seriesSlug,
    } = await searchParams;

    const artwork = getArtworkBySlug(slug);

    if (!artwork) {
        notFound();
    }

    const artworks = getArtworks();

    const requestedSeries = seriesSlug
        ? getArtworkSeriesBySlug(seriesSlug)
        : undefined;

    const seriesArtworks = requestedSeries
        ? getArtworksBySeriesId(requestedSeries.id)
        : [];

    const isArtworkInSeries = requestedSeries
        ? seriesArtworks.some(
              (item) => item.id === artwork.id,
          )
        : false;

    const activeSeries =
        requestedSeries && isArtworkInSeries
            ? requestedSeries
            : undefined;

    const activeCategory =
        category &&
        artwork.categories.includes(category)
            ? category
            : undefined;

    const parsedYear = year
        ? Number(year)
        : undefined;

    const activeYear =
        parsedYear &&
        artworks.some(
            (item) => item.year === parsedYear,
        )
            ? parsedYear
            : undefined;

    const activeMedium =
        medium &&
        artworks.some(
            (item) => item.medium === medium,
        )
            ? medium
            : undefined;

    const navigationArtworks = activeSeries
        ? seriesArtworks
        : artworks.filter((item) => {
              const matchesCategory =
                  !activeCategory ||
                  item.categories.includes(
                      activeCategory,
                  );

              const matchesYear =
                  !activeYear ||
                  item.year === activeYear;

              const matchesMedium =
                  !activeMedium ||
                  item.medium === activeMedium;

              return (
                  matchesCategory &&
                  matchesYear &&
                  matchesMedium
              );
          });

    const currentIndex =
        navigationArtworks.findIndex(
            (item) => item.id === artwork.id,
        );

    const previousArtwork =
        currentIndex > 0
            ? navigationArtworks[currentIndex - 1]
            : undefined;

    const nextArtwork =
        currentIndex >= 0 &&
        currentIndex <
            navigationArtworks.length - 1
            ? navigationArtworks[currentIndex + 1]
            : undefined;

    const previousPreviousArtwork =
        currentIndex > 1
            ? navigationArtworks[currentIndex - 2]
            : undefined;

    const nextNextArtwork =
        currentIndex >= 0 &&
        currentIndex <
            navigationArtworks.length - 2
            ? navigationArtworks[currentIndex + 2]
            : undefined;

    const archiveParams = new URLSearchParams();

    if (activeSeries) {
        archiveParams.set(
            "series",
            activeSeries.slug,
        );
    }

    if (activeCategory) {
        archiveParams.set(
            "category",
            activeCategory,
        );
    }

    if (activeYear) {
        archiveParams.set(
            "year",
            String(activeYear),
        );
    }

    if (activeMedium) {
        archiveParams.set(
            "medium",
            activeMedium,
        );
    }

    const navigationQuery =
        archiveParams.toString();

    const backHref = activeSeries
        ? `/series/${activeSeries.slug}`
        : navigationQuery
            ? `/artworks?${navigationQuery}`
            : "/artworks";

    const backLabel = activeSeries
        ? `Back to ${activeSeries.title}`
        : "Back to artworks";

    const createArtworkHref = (
        targetArtwork:
            | (typeof navigationArtworks)[number]
            | undefined,
    ) => {
        if (!targetArtwork) {
            return undefined;
        }

        return `/artworks/${targetArtwork.slug}${
            navigationQuery
                ? `?${navigationQuery}`
                : ""
        }`;
    };

    const previousHref =
        createArtworkHref(previousArtwork);

    const nextHref =
        createArtworkHref(nextArtwork);

    const previousScene = previousArtwork ? (
        <ArtworkDetailScene
            artwork={previousArtwork}
            previousArtwork={
                previousPreviousArtwork
            }
            nextArtwork={artwork}
            navigationQuery={navigationQuery}
        />
    ) : undefined;

    const currentScene = (
        <ArtworkDetailScene
            artwork={artwork}
            previousArtwork={previousArtwork}
            nextArtwork={nextArtwork}
            navigationQuery={navigationQuery}
            priority
        />
    );

    const nextScene = nextArtwork ? (
        <ArtworkDetailScene
            artwork={nextArtwork}
            previousArtwork={artwork}
            nextArtwork={nextNextArtwork}
            navigationQuery={navigationQuery}
        />
    ) : undefined;

    return (
        <ArtworkDetailKineticExperience
            previousScene={previousScene}
            currentScene={currentScene}
            nextScene={nextScene}
            previousHref={previousHref}
            nextHref={nextHref}
            backHref={backHref}
            backLabel={backLabel}
        />
    );
}
