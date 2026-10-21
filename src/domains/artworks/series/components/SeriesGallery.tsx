"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

import useArtworkViewerSelection from "@/shared/ui/artwork/useArtworkViewerSelection";

import type { Artwork } from "@/domains/artworks";
import { KineticCarousel } from "@/shared/ui/kinetic-carousel";

import CollectionArtwork from "@/domains/home/sections/collection/CollectionArtwork";

// The selected-work deep link can open this portal on the first render.
// Its document.body target exists only in the browser.
const ArtworkExperienceViewer = dynamic(() => import("@/shared/ui/artwork/ArtworkExperienceViewer"), { ssr: false });

interface SeriesGalleryProps {
    artworks: Artwork[];
    seriesSlug: string;
    initialArtworkSlug?: string;
}

export default function SeriesGallery({
    artworks,
    seriesSlug,
    initialArtworkSlug,
}: SeriesGalleryProps) {
    const t = useTranslations("Series");
    const artworkT = useTranslations("Artwork");
    const viewer = useArtworkViewerSelection(artworks, initialArtworkSlug);
    const { selectedIndex } = viewer;

    const mobileColumns =
        artworks.length === 1
            ? "grid-cols-1"
            : "grid-cols-2";

    const desktopColumns =
        artworks.length >= 4
            ? "md:grid-cols-4"
            : artworks.length === 3
                ? "md:grid-cols-3"
                : artworks.length === 2
                    ? "md:grid-cols-2"
                    : "md:grid-cols-1";

    const useDesktopCarousel =
        artworks.length > 4;

    return (
        <>
            {/*
             * ------------------------------------------------
             * STANDARD GALLERY
             * ------------------------------------------------
             *
             * Mobile / tablet always use the existing grid.
             * Desktop uses this layout for 1–4 artworks.
             */}
            <div
                className={`
                    mx-auto
                    w-fit
                    -mt-35
                    grid
                    grid-cols-2
                    items-start
                    justify-items-center
                    gap-x-6
                    gap-y-14

                    md:gap-x-5

                    xl:gap-x-8

                    ${mobileColumns}
                    ${desktopColumns}

                    ${useDesktopCarousel
                        ? "lg:hidden"
                        : ""
                    }

                    [@media(orientation:landscape)_and_(max-height:600px)]:!grid-cols-3
                    [@media(orientation:landscape)_and_(max-height:600px)]:!gap-x-4
                    [@media(orientation:landscape)_and_(max-height:600px)]:!gap-y-8
                `}
            >
                {artworks.map(
                    (artwork) => (
                        <CollectionArtwork
                            key={artwork.id}
                            artwork={artwork}
                            presentation="series"
                            onOpen={() =>
                                viewer.open(
                                    artwork,
                                )
                            }
                        />
                    ),
                )}
            </div>

            {/*
             * ------------------------------------------------
             * DESKTOP KINETIC CAROUSEL
             * ------------------------------------------------
             *
             * Activated only when the Series contains
             * more than four artworks.
             */}
            {useDesktopCarousel && (
                <div
                    className="
                        relative
                        mx-auto
                        -mt-35
                        hidden
                        w-full
                        lg:block
                    "
                >
                    <KineticCarousel
                        itemCount={artworks.length}
                        viewportClassName="
                            w-full
                            px-[max(2rem,calc((100%-1136px)/2))]
                        "
                        trackClassName="
                            gap-5
                            xl:gap-8
                        "
                        previousLabel={t("previousArtworks")}
                        nextLabel={t("nextArtworks")}
                        previousButtonClassName="
                            left-6
                            top-[40%]
                        "
                        nextButtonClassName="
                            right-6
                            top-[40%]
                        "
                    >
                        {artworks.map(
                            (
                                artwork,
                            ) => (
                                <div
                                    key={artwork.id}
                                    className="
                                        w-[260px]
                                        shrink-0
                                    "
                                >
                                    <CollectionArtwork
                                        artwork={artwork}
                                        presentation="series"
                                        onOpen={() =>
                                            viewer.open(
                                                artwork,
                                            )
                                        }
                                    />
                                </div>
                            ),
                        )}
                    </KineticCarousel>
                </div>
            )}

            {selectedIndex !== null && <ArtworkExperienceViewer
                artworks={artworks}
                initialIndex={selectedIndex}
                onClose={viewer.close}
                showDetailsCta
                showAllWorksCta={false}
                detailsCtaLabel={artworkT("exploreDetail")}
                detailsQuery={`series=${seriesSlug}`}
            />}
        </>
    );
}
