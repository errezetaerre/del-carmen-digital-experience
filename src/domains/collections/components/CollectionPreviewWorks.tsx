"use client";

import type { Artwork } from "@/domains/artworks";
import { KineticCarousel } from "@/shared/ui/kinetic-carousel";

import CollectionPreviewArtwork from "./CollectionPreviewArtwork";

interface CollectionPreviewWorksProps {
    artworks: Artwork[];
    seriesSlug: string;
}

const VISIBLE_ARTWORKS = 4;

export default function CollectionPreviewWorks({
    artworks,
    seriesSlug,
}: CollectionPreviewWorksProps) {
    if (artworks.length === 0) {
        return null;
    }

    const hasCarousel =
        artworks.length > VISIBLE_ARTWORKS;

    /*
     * ------------------------------------------------
     * STANDARD GRID
     * ------------------------------------------------
     *
     * 1–4 artworks preserve the approved
     * implementation exactly.
     */
    if (!hasCarousel) {
        return (
            <div
                className="
                    group/works
                    relative
                    z-20
                    hidden
                    h-64
                    w-full
                    max-w-3xl
                    lg:block
                "
            >
                <div
                    className="
                        absolute
                        inset-x-0
                        bottom-0
                    "
                >
                    <p
                        className="
                            mb-3
                            font-sans
                            text-[9px]
                            uppercase
                            tracking-[0.26em]
                            text-white/35
                        "
                    >
                        Works in this collection
                    </p>
                    <div
                        className={`
                            grid
                            h-7
                            gap-2
                            transition-[height]
                            duration-700
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                            group-hover/works:h-52
                            xl:group-hover/works:h-56
                            ${artworks.length === 1
                                ? "grid-cols-[repeat(3,minmax(0,1fr))] [&>*]:col-start-2"
                                : "grid-cols-4"
                            }
    `}
                    >
                        {artworks.map((artwork) => (
                            <CollectionPreviewArtwork
                                key={artwork.id}
                                artwork={artwork}
                                seriesSlug={seriesSlug}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    /*
     * ------------------------------------------------
     * KINETIC CAROUSEL
     * ------------------------------------------------
     *
     * 5+ artworks use the shared kinetic engine.
     * The collection keeps its own editorial card
     * geometry and hover expansion.
     */
    return (
        <div
            className="
                group/works
                relative
                z-20
                hidden
                h-64
                w-full
                max-w-3xl
                lg:block
            "
        >
            <div
                className="
                    absolute
                    inset-x-0
                    bottom-0
                "
            >
                <p
                    className="
                        mb-3
                        font-sans
                        text-[9px]
                        uppercase
                        tracking-[0.26em]
                        text-white/35
                    "
                >
                    Works in this collection
                </p>

                <KineticCarousel
                    itemCount={artworks.length}
                    viewportClassName="
                        h-7
                        transition-[height]
                        duration-700
                        ease-[cubic-bezier(0.22,1,0.36,1)]
                        group-hover/works:h-52
                        xl:group-hover/works:h-56
                    "
                    trackClassName="
                        h-full
                        gap-2
                    "
                    previousLabel="Previous artworks"
                    nextLabel="Next artworks"
                    previousButtonClassName="
                        left-2
                        top-1/2
                        h-8
                        w-8
                        text-lg
                    "
                    nextButtonClassName="
                        right-2
                        top-1/2
                        h-8
                        w-8
                        text-lg
                    "
                >
                    {artworks.map((artwork) => (
                        <div
                            key={artwork.id}
                            className="
                                h-full
                                w-[11.625rem]
                                min-w-0
                                shrink-0
                                [&>a]:h-full
                                [&>a]:w-full
                            "
                        >
                            <CollectionPreviewArtwork
                                artwork={artwork}
                                seriesSlug={seriesSlug}
                            />
                        </div>
                    ))}
                </KineticCarousel>
            </div>
        </div>
    );
}
