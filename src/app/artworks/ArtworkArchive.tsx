"use client";

import {
    useMemo,
} from "react";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

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

const preferredMediumOrder = [
    "oil",
    "graphite",
    "charcoal",
    "mixed-media",
];

function formatLabel(
    value: string,
) {
    return value
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
    const router = useRouter();

    const searchParams =
        useSearchParams();

    /* =====================================================
       AVAILABLE FILTER VALUES
       ===================================================== */

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

    const years = useMemo(() => {
        return Array.from(
            new Set(
                artworks.map(
                    (artwork) =>
                        artwork.year,
                ),
            ),
        ).sort(
            (a, b) => b - a,
        );
    }, [artworks]);

    const mediums = useMemo(() => {
        const uniqueMediums =
            Array.from(
                new Set(
                    artworks.map(
                        (artwork) =>
                            artwork.medium,
                    ),
                ),
            );

        return uniqueMediums.sort(
            (a, b) => {
                const aIndex =
                    preferredMediumOrder.indexOf(a);

                const bIndex =
                    preferredMediumOrder.indexOf(b);

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

    /* =====================================================
       ACTIVE FILTERS
       ===================================================== */

    const requestedCategory =
        searchParams.get("category");

    const requestedYear =
        searchParams.get("year");

    const requestedMedium =
        searchParams.get("medium");

    const activeCategory =
        requestedCategory &&
            categories.includes(
                requestedCategory,
            )
            ? requestedCategory
            : "all";

    const parsedYear =
        requestedYear
            ? Number(requestedYear)
            : null;

    const activeYear =
        parsedYear &&
            years.includes(
                parsedYear,
            )
            ? parsedYear
            : "all";

    const activeMedium =
        requestedMedium &&
            mediums.includes(
                requestedMedium as Artwork["medium"],
            )
            ? requestedMedium as Artwork["medium"]
            : "all";

    const hasActiveFilters =
        activeCategory !== "all" ||
        activeYear !== "all" ||
        activeMedium !== "all";

    /* =====================================================
       FILTERED ARTWORKS
       ===================================================== */

    const filteredArtworks =
        useMemo(() => {
            return artworks.filter(
                (artwork) => {
                    const matchesCategory =
                        activeCategory === "all" ||
                        artwork.categories.includes(
                            activeCategory,
                        );

                    const matchesYear =
                        activeYear === "all" ||
                        artwork.year ===
                        activeYear;

                    const matchesMedium =
                        activeMedium === "all" ||
                        artwork.medium ===
                        activeMedium;

                    return (
                        matchesCategory &&
                        matchesYear &&
                        matchesMedium
                    );
                },
            );
        }, [
            activeCategory,
            activeYear,
            activeMedium,
            artworks,
        ]);

    /* =====================================================
       URL FILTER MANAGEMENT
       ===================================================== */

    const updateFilter = (
        key:
            | "category"
            | "year"
            | "medium",
        value: string,
    ) => {
        const params =
            new URLSearchParams(
                searchParams.toString(),
            );

        if (value === "all") {
            params.delete(key);
        } else {
            params.set(
                key,
                value,
            );
        }

        const query =
            params.toString();

        router.replace(
            query
                ? `/artworks?${query}`
                : "/artworks",
            {
                scroll: false,
            },
        );
    };

    const clearFilters = () => {
        router.replace(
            "/artworks",
            {
                scroll: false,
            },
        );
    };

    /* =====================================================
       FILTER BUTTON
       ===================================================== */

    const filterButtonClass = (
        isActive: boolean,
    ) =>
        [
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
        ].join(" ");

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
                "
            >
                {/* ================================================
                    CATEGORY
                   ================================================ */}

                <div
                    className="
                        md:flex
                        md:items-start
                        md:justify-between
                        md:gap-10
                    "
                >
                    <p
                        className="
                            mb-5
                            font-sans
                            text-[9px]
                            uppercase
                            tracking-[0.28em]
                            text-white/35

                            md:mb-0
                            md:w-24
                            md:shrink-0
                            md:pt-[2px]
                        "
                    >
                        Category
                    </p>

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-x-6
                            gap-y-3

                            md:flex-1
                        "
                    >
                        <button
                            type="button"
                            onClick={() =>
                                updateFilter(
                                    "category",
                                    "all",
                                )
                            }
                            className={
                                filterButtonClass(
                                    activeCategory ===
                                    "all",
                                )
                            }
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
                                        key={
                                            category
                                        }
                                        type="button"
                                        onClick={() =>
                                            updateFilter(
                                                "category",
                                                category,
                                            )
                                        }
                                        className={
                                            filterButtonClass(
                                                isActive,
                                            )
                                        }
                                    >
                                        {formatLabel(
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

                {/* ================================================
                    YEAR
                   ================================================ */}

                <div
                    className="
                        mt-7
                        border-t
                        border-white/[0.05]
                        pt-6

                        md:flex
                        md:items-start
                        md:justify-between
                        md:gap-10
                    "
                >
                    <p
                        className="
                            mb-5
                            font-sans
                            text-[9px]
                            uppercase
                            tracking-[0.28em]
                            text-white/35

                            md:mb-0
                            md:w-24
                            md:shrink-0
                            md:pt-[2px]
                        "
                    >
                        Year
                    </p>

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-x-6
                            gap-y-3

                            md:flex-1
                        "
                    >
                        <button
                            type="button"
                            onClick={() =>
                                updateFilter(
                                    "year",
                                    "all",
                                )
                            }
                            className={
                                filterButtonClass(
                                    activeYear ===
                                    "all",
                                )
                            }
                        >
                            All
                        </button>

                        {years.map(
                            (year) => (
                                <button
                                    key={year}
                                    type="button"
                                    onClick={() =>
                                        updateFilter(
                                            "year",
                                            String(
                                                year,
                                            ),
                                        )
                                    }
                                    className={
                                        filterButtonClass(
                                            activeYear ===
                                            year,
                                        )
                                    }
                                >
                                    {year}
                                </button>
                            ),
                        )}
                    </div>
                </div>

                {/* ================================================
                    MEDIUM
                   ================================================ */}

                <div
                    className="
                        mt-7
                        border-t
                        border-white/[0.05]
                        pt-6

                        md:flex
                        md:items-start
                        md:justify-between
                        md:gap-10
                    "
                >
                    <p
                        className="
                            mb-5
                            font-sans
                            text-[9px]
                            uppercase
                            tracking-[0.28em]
                            text-white/35

                            md:mb-0
                            md:w-24
                            md:shrink-0
                            md:pt-[2px]
                        "
                    >
                        Medium
                    </p>

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-x-6
                            gap-y-3

                            md:flex-1
                        "
                    >
                        <button
                            type="button"
                            onClick={() =>
                                updateFilter(
                                    "medium",
                                    "all",
                                )
                            }
                            className={
                                filterButtonClass(
                                    activeMedium ===
                                    "all",
                                )
                            }
                        >
                            All
                        </button>

                        {mediums.map(
                            (medium) => (
                                <button
                                    key={medium}
                                    type="button"
                                    onClick={() =>
                                        updateFilter(
                                            "medium",
                                            medium,
                                        )
                                    }
                                    className={
                                        filterButtonClass(
                                            activeMedium ===
                                            medium,
                                        )
                                    }
                                >
                                    {formatLabel(
                                        medium,
                                    )}
                                </button>
                            ),
                        )}
                    </div>
                </div>

                {/* ================================================
                    RESULT SUMMARY
                   ================================================ */}

                <div
                    className="
                        mt-7
                        flex
                        items-center
                        justify-between
                        gap-6
                        border-t
                        border-white/[0.05]
                        pt-6
                    "
                >
                    <p
                        className="
                            font-sans
                            text-[9px]
                            uppercase
                            tracking-[0.28em]
                            text-white/35
                        "
                    >
                        {filteredArtworks.length}{" "}
                        {filteredArtworks.length ===
                            1
                            ? "work"
                            : "works"}
                    </p>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={
                                clearFilters
                            }
                            className="
                                font-sans
                                text-[9px]
                                uppercase
                                tracking-[0.22em]
                                text-white/35
                                transition-colors
                                duration-300
                                hover:text-brand-gold
                            "
                        >
                            Clear filters
                        </button>
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
                    imageVariant="thumbnail"
                    detailQuery={
                        searchParams.toString() ||
                        undefined
                    }
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
                    No works match the
                    selected filters.
                </div>
            )}
        </div>
    );
}