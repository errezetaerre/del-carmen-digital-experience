"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Artwork } from "@/domains/artworks";
import { ArtworkLightbox } from "@/shared/ui/artwork";

import CollectionArtwork from "./CollectionArtwork";

type ArtworkInteraction =
    | "lightbox"
    | "detail";

interface CollectionGalleryProps {
    artworks: Artwork[];

    interaction?: ArtworkInteraction;
}

export default function CollectionGallery({
    artworks,
    interaction = "lightbox",
}: CollectionGalleryProps) {
    const router = useRouter();

    const [selectedIndex, setSelectedIndex] =
        useState<number | null>(null);

    const handleOpen = (
        artwork: Artwork,
        index: number,
    ) => {
        if (interaction === "detail") {
            router.push(
                `/artworks/${artwork.slug}`,
            );

            return;
        }

        setSelectedIndex(index);
    };

    return (
        <>
            <div
                className="
          grid
          grid-cols-2
          items-start
          justify-items-center
          gap-x-6
          gap-y-14

          md:grid-cols-4
          md:gap-x-5

          xl:gap-x-8

          [@media(orientation:landscape)_and_(max-height:600px)]:!grid-cols-3
          [@media(orientation:landscape)_and_(max-height:600px)]:!gap-x-4
          [@media(orientation:landscape)_and_(max-height:600px)]:!gap-y-8
        "
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

            {interaction ===
                "lightbox" && (
                    <ArtworkLightbox
                        artworks={artworks}
                        initialIndex={
                            selectedIndex ?? 0
                        }
                        isOpen={
                            selectedIndex !== null
                        }
                        onClose={() => {
                            setSelectedIndex(
                                null,
                            );
                        }}
                    />
                )}
        </>
    );
}