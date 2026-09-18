"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    usePathname,
    useRouter,
} from "next/navigation";

import type { Artwork } from "@/domains/artworks";
import { ArtworkLightbox } from "@/shared/ui/artwork";

import CollectionArtwork from "@/domains/home/sections/collection/CollectionArtwork";

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
    const router = useRouter();
    const pathname = usePathname();

    const carouselRef =
        useRef<HTMLDivElement>(null);

    const getArtworkIndex = (
        artworkSlug?: string,
    ) => {
        if (!artworkSlug) {
            return null;
        }

        const index = artworks.findIndex(
            (artwork) =>
                artwork.slug === artworkSlug,
        );

        return index >= 0
            ? index
            : null;
    };

    const [selectedIndex, setSelectedIndex] =
        useState<number | null>(() =>
            getArtworkIndex(
                initialArtworkSlug,
            ),
        );

    /*
     * Keep the lightbox synchronized with
     * artwork supplied by the Series route.
     */
    useEffect(() => {
        setSelectedIndex(
            getArtworkIndex(
                initialArtworkSlug,
            ),
        );
    }, [
        initialArtworkSlug,
        artworks,
    ]);

    const handleOpen = (
        artwork: Artwork,
        index: number,
    ) => {
        setSelectedIndex(index);

        router.replace(
            `${pathname}?artwork=${encodeURIComponent(
                artwork.slug,
            )}`,
            {
                scroll: false,
            },
        );
    };

    const handleClose = () => {
        setSelectedIndex(null);

        /*
         * Remove ?artwork= while remaining
         * inside the current ArtworkSeries.
         */
        router.replace(
            `/series/${seriesSlug}`,
            {
                scroll: false,
            },
        );
    };

    const handleCarouselScroll = (
        direction: "previous" | "next",
    ) => {
        const carousel =
            carouselRef.current;

        if (!carousel) {
            return;
        }

        const scrollAmount =
            Math.min(
                carousel.clientWidth * 0.7,
                696,
            );

        carousel.scrollBy({
            left:
                direction === "next"
                    ? scrollAmount
                    : -scrollAmount,
            behavior: "smooth",
        });
    };

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
                    (artwork, index) => (
                        <CollectionArtwork
                            key={artwork.id}
                            artwork={artwork}
                            onOpen={() =>
                                handleOpen(
                                    artwork,
                                    index,
                                )
                            }
                        />
                    ),
                )}
            </div>

            {/*
             * ------------------------------------------------
             * DESKTOP CAROUSEL
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
                    <div
                        ref={carouselRef}
                        className="
                            flex
                            w-full
                            snap-x
                            snap-mandatory
                            gap-5
                            overflow-x-auto
                            scroll-smooth
                            px-[max(2rem,calc((100%-896px)/2))]

                            xl:gap-8

                            [scrollbar-width:none]
                            [&::-webkit-scrollbar]:hidden
                        "
                    >
                        {artworks.map(
                            (
                                artwork,
                                index,
                            ) => (
                                <div
                                    key={
                                        artwork.id
                                    }
                                    className="
                                        w-[200px]
                                        shrink-0
                                        snap-start
                                    "
                                >
                                    <CollectionArtwork
                                        artwork={
                                            artwork
                                        }
                                        onOpen={() =>
                                            handleOpen(
                                                artwork,
                                                index,
                                            )
                                        }
                                    />
                                </div>
                            ),
                        )}
                    </div>

                    <div
                        className="
                            mt-8
                            flex
                            items-center
                            justify-center
                            gap-8
                        "
                    >
                        <button
                            type="button"
                            onClick={() =>
                                handleCarouselScroll(
                                    "previous",
                                )
                            }
                            className="
                                font-sans
                                text-[10px]
                                uppercase
                                tracking-[0.24em]
                                text-white/45
                                transition-colors
                                duration-300

                                hover:text-brand-gold
                            "
                            aria-label="Previous artworks"
                        >
                            ← Previous
                        </button>

                        <span
                            className="
                                h-px
                                w-10
                                bg-white/15
                            "
                            aria-hidden="true"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                handleCarouselScroll(
                                    "next",
                                )
                            }
                            className="
                                font-sans
                                text-[10px]
                                uppercase
                                tracking-[0.24em]
                                text-white/45
                                transition-colors
                                duration-300

                                hover:text-brand-gold
                            "
                            aria-label="Next artworks"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}

            <ArtworkLightbox
                artworks={artworks}
                initialIndex={
                    selectedIndex ?? 0
                }
                isOpen={
                    selectedIndex !== null
                }
                onClose={handleClose}
                showDetailsCta
                showAllWorksCta={false}
                detailsCtaLabel="Explore in detail"
                detailsQuery={`series=${seriesSlug}`}
            />
        </>
    );
}