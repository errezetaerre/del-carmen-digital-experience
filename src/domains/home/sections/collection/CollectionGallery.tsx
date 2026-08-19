"use client";

import {
    useMemo,
    useState,
} from "react";

import type {
    FeaturedCollectionItem,
} from "@/domains/home/services";

import {
    ArtworkLightbox,
} from "@/shared/ui/artwork";

import CollectionEntry from "./CollectionEntry";

interface CollectionGalleryProps {
    items: FeaturedCollectionItem[];
}

export default function CollectionGallery({
    items,
}: CollectionGalleryProps) {
    const artworks = useMemo(
        () =>
            items
                .filter(
                    (
                        item,
                    ): item is Extract<
                        FeaturedCollectionItem,
                        { type: "artwork" }
                    > =>
                        item.type === "artwork",
                )
                .map(
                    (item) =>
                        item.artwork,
                ),
        [items],
    );

    const [
        selectedArtworkId,
        setSelectedArtworkId,
    ] = useState<string | null>(null);

    const selectedIndex =
        selectedArtworkId === null
            ? null
            : artworks.findIndex(
                (artwork) =>
                    artwork.id ===
                    selectedArtworkId,
            );

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
                {items.map((item) => (
                    <CollectionEntry
                        key={
                            item.type === "artwork"
                                ? `artwork-${item.artwork.id}`
                                : `series-${item.series.id}`
                        }
                        item={item}
                        onOpenArtwork={
                            setSelectedArtworkId
                        }
                    />
                ))}
            </div>

            <ArtworkLightbox
                artworks={artworks}
                initialIndex={
                    selectedIndex !== null &&
                        selectedIndex >= 0
                        ? selectedIndex
                        : 0
                }
                isOpen={
                    selectedIndex !== null &&
                    selectedIndex >= 0
                }
                onClose={() => {
                    setSelectedArtworkId(null);
                }}
            />
        </>
    );
}