"use client";
import Link from "next/link";

import type {
    FeaturedCollectionItem,
} from "@/domains/home/services";

import CollectionArtwork from "./CollectionArtwork";
import CollectionArtworkFrame from "./CollectionArtworkFrame";

interface CollectionEntryProps {
    item: FeaturedCollectionItem;
    onOpenArtwork?: (
        artworkId: string,
    ) => void;
}

export default function CollectionEntry({
    item,
    onOpenArtwork,
}: CollectionEntryProps) {
    if (item.type === "artwork") {
        return (
            <CollectionArtwork
                artwork={item.artwork}
                onOpen={() =>
                    onOpenArtwork?.(
                        item.artwork.id,
                    )
                }
            />
        );
    }

    const collectionImage =
        item.coverArtwork.images.thumbnail ??
        item.coverArtwork.images.primary;

    return (
        <article
            className="
        group
        relative
        w-full
        max-w-[200px]
      "
        >
            <Link
                href={`/series/${item.series.slug}`}
                className="
    block
    w-full
    text-left
  "
                aria-label={`Explore ${item.series.title} series`}
            >
                <CollectionArtworkFrame>
                    <div
                        className="
              relative
              aspect-[4/5]
              overflow-hidden
              bg-black
            "
                    >
                        <img
                            src={collectionImage.src}
                            alt={collectionImage.alt}
                            className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-1000
                ease-out

                group-hover:scale-[1.035]
              "
                        />

                        <div
                            className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/90
                via-black/10
                to-transparent
                opacity-75
                transition-opacity
                duration-700

                group-hover:opacity-90
              "
                        />

                        <div
                            className="
                absolute
                inset-x-0
                bottom-0
                p-4

                md:p-5
              "
                        >
                            <p
                                className="
                  mb-2
                  text-[9px]
                  uppercase
                  tracking-[0.3em]
                  text-brand-gold
                "
                            >
                                Series · {item.artworkCount}{" "}
                                {item.artworkCount === 1
                                    ? "work"
                                    : "works"}
                            </p>

                            <h3
                                className="
                  font-serif
                  text-lg
                  font-light
                  leading-tight
                  text-white
                "
                            >
                                {item.series.title}
                            </h3>

                            {item.series.description && (
                                <p
                                    className="
                    mt-3
                    line-clamp-3
                    font-sans
                    text-[10px]
                    font-light
                    leading-5
                    text-white/55
                  "
                                >
                                    {item.series.description}
                                </p>
                            )}

                            <span
                                className="
                  mt-4
                  inline-block
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  text-brand-gold
                "
                            >
                                Explore series →
                            </span>
                        </div>
                    </div>
                </CollectionArtworkFrame>
            </Link>
        </article>
    );
}