import { activateLocale } from "@/i18n/server";
import { getSiteMessages } from "@/i18n/messages";
import { getArtworkMetadata } from "@/domains/artworks/presentation/getArtworkMetadata";
import { notFound } from "next/navigation";

import {
    getArtworks,
    getArtworkBySlug,
    getArtworkSeriesBySlug,
    getArtworksBySeriesId,
} from "@/domains/artworks";

import ArtworkDetailKineticExperience from "@/domains/artworks/components/ArtworkDetailKineticExperience";
import ArtworkDetailResponsiveEntry from "@/domains/artworks/components/ArtworkDetailResponsiveEntry";
import ArtworkGlassArtbook from "@/domains/artworks/components/glass-artbook";
import ArtworkDetailScene from "@/domains/artworks/components/ArtworkDetailScene";
import { isFeaturedArtwork } from "@/domains/artworks/presentation/getArtworkPresentation";
import { artworkArchiveQuery, readArtworkArchiveFilters, selectArtworkArchive } from "@/domains/artworks/presentation/artworkArchive";
import { artworkExperienceHref } from "@/domains/artworks/presentation/artworkExperience";
import ArtworkPortraitEntry from "@/domains/artworks/components/portrait-artbook/ArtworkPortraitEntry";

interface ArtworkPageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;

    searchParams: Promise<{
        category?: string;
        year?: string;
        medium?: string;
        featured?: string;
        q?: string | string[];
        sort?: string | string[];
        series?: string;
        experience?: string;
    }>;
}

export function generateStaticParams() {
    return getArtworks().map((artwork) => ({
        slug: artwork.slug,
    }));
}

export async function generateMetadata({ params }: Pick<ArtworkPageProps, "params">) {
    const { slug } = await params;
    const artwork = getArtworkBySlug(slug);
    if (!artwork) notFound();
    return getArtworkMetadata(artwork, await activateLocale(params));
}

export default async function ArtworkPage({
    params,
    searchParams,
}: ArtworkPageProps) {
    const locale = await activateLocale(params);
    const { slug } = await params;

    const {
        category,
        year,
        medium,
        featured,
        q,
        sort,
        series: seriesSlug,
        experience,
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

    const featuredOnly = featured === "true" && isFeaturedArtwork(artwork);

    const archiveFilters = readArtworkArchiveFilters(artworks, new URLSearchParams({
        category: activeCategory ?? "",
        year: activeYear ? String(activeYear) : "",
        medium: activeMedium ?? "",
        featured: featuredOnly && !activeSeries ? "true" : "",
        q: !activeSeries && typeof q === "string" ? q : "",
        sort: !activeSeries && typeof sort === "string" ? sort : "",
    }));
    const navigationArtworks = activeSeries
        ? seriesArtworks
        : selectArtworkArchive(artworks, archiveFilters, locale);

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

    const archiveParams = artworkArchiveQuery(archiveFilters);
    if (activeSeries) archiveParams.set("series", activeSeries.slug);

    const navigationQuery =
        archiveParams.toString();

    const standardParams = new URLSearchParams(archiveParams);
    standardParams.set("experience", "standard");
    const standardNavigationQuery = standardParams.toString();

    const backHref = activeSeries
        ? `/series/${activeSeries.slug}`
        : navigationQuery
            ? `/artworks?${navigationQuery}`
            : "/artworks";

    const backLabel = activeSeries
        ? getSiteMessages(locale).Artwork.backToSeries.replace("{title}", activeSeries.title)
        : getSiteMessages(locale).Artwork.back;

    const createArtworkHref = (
        targetArtwork:
            | (typeof navigationArtworks)[number]
            | undefined,
    ) => {
        if (!targetArtwork) {
            return undefined;
        }

        return artworkExperienceHref(targetArtwork.slug, navigationQuery, "standard");
    };

    const previousHref =
        createArtworkHref(previousArtwork);

    const nextHref =
        createArtworkHref(nextArtwork);

    const portraitBook = {
        artworks: currentIndex >= 0 ? navigationArtworks : [artwork],
        initialArtworkId: artwork.id,
        navigationQuery,
        backHref,
        backLabel,
    };

    if (experience === "glass") {
        return (
            <ArtworkPortraitEntry book={portraitBook} explicitGlass>
                <ArtworkGlassArtbook
                    artworks={currentIndex >= 0 ? navigationArtworks : [artwork]}
                    initialArtworkId={artwork.id}
                    navigationQuery={navigationQuery}
                    backHref={backHref}
                    backLabel={backLabel}
                />
            </ArtworkPortraitEntry>
        );
    }

    const previousScene = previousArtwork ? (
        <ArtworkDetailScene
            artwork={previousArtwork}
            previousArtwork={
                previousPreviousArtwork
            }
            nextArtwork={artwork}
            navigationQuery={standardNavigationQuery}
        />
    ) : undefined;

    const currentScene = (
        <ArtworkDetailScene
            artwork={artwork}
            previousArtwork={previousArtwork}
            nextArtwork={nextArtwork}
            navigationQuery={standardNavigationQuery}
            priority
        />
    );

    const nextScene = nextArtwork ? (
        <ArtworkDetailScene
            artwork={nextArtwork}
            previousArtwork={artwork}
            nextArtwork={nextNextArtwork}
            navigationQuery={standardNavigationQuery}
        />
    ) : undefined;

    const standardExperience = (
        <ArtworkDetailResponsiveEntry
            glassHref={artworkExperienceHref(artwork.slug, navigationQuery, "glass")}
            standardHref={artworkExperienceHref(artwork.slug, navigationQuery, "standard")}
            enabled={experience !== "standard"}
        >
        <ArtworkDetailKineticExperience
            previousScene={previousScene}
            currentScene={currentScene}
            nextScene={nextScene}
            previousHref={previousHref}
            nextHref={nextHref}
            backHref={backHref}
            backLabel={backLabel}
        />
        </ArtworkDetailResponsiveEntry>
    );

    return experience === "standard" ? standardExperience : (
        <ArtworkPortraitEntry book={portraitBook}>{standardExperience}</ArtworkPortraitEntry>
    );
}
