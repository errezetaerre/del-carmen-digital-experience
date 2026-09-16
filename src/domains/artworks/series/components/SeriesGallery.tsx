"use client";

import {
    useEffect,
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

    return (
        <>
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