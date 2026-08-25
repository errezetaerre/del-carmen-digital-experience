"use client";

import {
    useMemo,
    useState,
} from "react";

import type {
    Artwork,
} from "@/domains/artworks";

import CollectionGallery from "@/domains/home/sections/collection/CollectionGallery";

interface ArtworkArchiveProps {
    artworks: Artwork[];
}

const preferredCategoryOrder = [
    "portrait",
    "figurative",
    "spiritual",
    "symbolic",
    "still-life",
];

function formatCategory(
    category: string,
) {
    return category
        .replace(/[-_]/g, " ")
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase(),
        );
}

export default function ArtworkArchive({
    artworks,
}: ArtworkArchiveProps) {
    const [activeCategory, setActiveCategory] =
        useState("all");

    const categories = useMemo(() => {
        const uniqueCategories =
            Array.from(
                new Set(
                    artworks.flatMap(
                        (artwork) =>
                            artwork.categories ?? [],
                    ),
                ),
            );

        return uniqueCategories.sort(
            (a, b) => {
                const aIndex =
                    preferredCategoryOrder.indexOf(a);

                const bIndex =
                    preferredCategoryOrder.indexOf(b);

                if (
                    aIndex !== -1 &&
                    bIndex !== -1
                ) {
                    return aIndex - bIndex;
                }

                if (aIndex !== -1) {
                    return -1;
                }

                if (bIndex !== -1) {
                    return 1;
                }

                return a.localeCompare(b);
            },
        );
    }, [artworks]);

    const filteredArtworks =
        useMemo(() => {
            if (
                activeCategory === "all"
            ) {
                return artworks;
            }

            return artworks.filter(
                (artwork) =>
                    artwork.categories?.includes(
                        activeCategory,
                    ),
            );
        }, [
            activeCategory,
            artworks,
        ]);

    return (
        <div>
            {/* =====================================================
          ARCHIVE CONTROLS
         ===================================================== */}

            <div
                className="
          mb-14
          border-y
          border-white/[0.06]
          py-6

          md:mb-16
          md:flex
          md:items-center
          md:justify-between
          md:gap-10
        "
            >
                {/* Count */}

                <p
                    className="
            mb-5
            font-sans
            text-[9px]
            uppercase
            tracking-[0.28em]
            text-white/35

            md:mb-0
            md:shrink-0
          "
                >
                    {filteredArtworks.length}{" "}
                    {filteredArtworks.length === 1
                        ? "work"
                        : "works"}
                </p>

                {/* Categories */}

                <div
                    className="
            flex
            flex-wrap
            items-center
            gap-x-6
            gap-y-3

            md:justify-end
          "
                >
                    <button
                        type="button"
                        onClick={() =>
                            setActiveCategory(
                                "all",
                            )
                        }
                        className={[
                            "relative",
                            "font-sans",
                            "text-[10px]",
                            "uppercase",
                            "tracking-[0.24em]",
                            "transition-colors",
                            "duration-300",

                            activeCategory === "all"
                                ? "text-brand-gold"
                                : "text-white/40 hover:text-white/75",
                        ].join(" ")}
                    >
                        All Works

                        {activeCategory ===
                            "all" && (
                                <span
                                    className="
                  absolute
                  -bottom-2
                  left-0
                  h-px
                  w-full
                  bg-gradient-to-r
                  from-brand-gold
                  to-transparent
                "
                                />
                            )}
                    </button>

                    {categories.map(
                        (category) => {
                            const isActive =
                                activeCategory ===
                                category;

                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() =>
                                        setActiveCategory(
                                            category,
                                        )
                                    }
                                    className={[
                                        "relative",
                                        "font-sans",
                                        "text-[10px]",
                                        "uppercase",
                                        "tracking-[0.24em]",
                                        "transition-colors",
                                        "duration-300",

                                        isActive
                                            ? "text-brand-gold"
                                            : "text-white/40 hover:text-white/75",
                                    ].join(" ")}
                                >
                                    {formatCategory(
                                        category,
                                    )}

                                    {isActive && (
                                        <span
                                            className="
                        absolute
                        -bottom-2
                        left-0
                        h-px
                        w-full
                        bg-gradient-to-r
                        from-brand-gold
                        to-transparent
                      "
                                        />
                                    )}
                                </button>
                            );
                        },
                    )}
                </div>
            </div>

            {/* =====================================================
          ARTWORKS
         ===================================================== */}

            {filteredArtworks.length >
                0 ? (
                <CollectionGallery
                    artworks={filteredArtworks}
                    interaction="detail"
                />
            ) : (
                <div
                    className="
            py-24
            text-center
            font-sans
            text-sm
            font-light
            text-white/35
          "
                >
                    No works are currently
                    available in this category.
                </div>
            )}
        </div>
    );
}