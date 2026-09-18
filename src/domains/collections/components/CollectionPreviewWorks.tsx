"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import gsap from "gsap";

import type { Artwork } from "@/domains/artworks";

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
    const trackRef =
        useRef<HTMLDivElement>(null);

    const dragStartXRef = useRef(0);
    const dragLastXRef = useRef(0);
    const dragLastTimeRef = useRef(0);
    const dragVelocityRef = useRef(0);

    const draggingRef = useRef(false);
    const movedRef = useRef(false);

    const [isDragging, setIsDragging] =
        useState(false);

    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [isAnimating, setIsAnimating] =
        useState(false);

    if (artworks.length === 0) {
        return null;
    }

    const hasCarousel =
        artworks.length >
        VISIBLE_ARTWORKS;

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
                        className="
                            grid
                            h-7
                            grid-cols-4
                            gap-2

                            transition-[height]
                            duration-700
                            ease-[cubic-bezier(0.22,1,0.36,1)]

                            group-hover/works:h-52

                            xl:group-hover/works:h-56
                        "
                    >
                        {artworks.map(
                            (artwork) => (
                                <CollectionPreviewArtwork
                                    key={
                                        artwork.id
                                    }
                                    artwork={
                                        artwork
                                    }
                                    seriesSlug={
                                        seriesSlug
                                    }
                                />
                            ),
                        )}
                    </div>
                </div>
            </div>
        );
    }

    /*
     * ------------------------------------------------
     * INFINITE WINDOW
     * ------------------------------------------------
     *
     * Always render exactly four artworks
     * using the same grid geometry.
     */
    const visibleArtworks =
        Array.from(
            {
                length:
                    VISIBLE_ARTWORKS,
            },
            (_, offset) => {
                const index =
                    (currentIndex +
                        offset) %
                    artworks.length;

                return artworks[index];
            },
        );

    const move = (
        direction:
            | "previous"
            | "next",
    ) => {
        if (
            isAnimating ||
            !trackRef.current
        ) {
            return;
        }

        const track =
            trackRef.current;

        setIsAnimating(true);

        const distance =
            direction === "next"
                ? -28
                : 28;

        gsap.to(track, {
            x: distance,
            opacity: 0.72,
            duration: 0.22,
            ease: "power2.in",

            onComplete: () => {
                setCurrentIndex(
                    (current) => {
                        if (
                            direction ===
                            "next"
                        ) {
                            return (
                                (current + 1) %
                                artworks.length
                            );
                        }

                        return (
                            (current -
                                1 +
                                artworks.length) %
                            artworks.length
                        );
                    },
                );

                gsap.set(track, {
                    x:
                        direction ===
                            "next"
                            ? 28
                            : -28,
                    opacity: 0.72,
                });

                requestAnimationFrame(
                    () => {
                        gsap.to(
                            track,
                            {
                                x: 0,
                                opacity: 1,
                                duration: 0.48,
                                ease: "power3.out",

                                onComplete:
                                    () => {
                                        setIsAnimating(
                                            false,
                                        );
                                    },
                            },
                        );
                    },
                );
            },
        });
    };

    const handlePointerDown = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (
            isAnimating ||
            !trackRef.current
        ) {
            return;
        }

        gsap.killTweensOf(trackRef.current);

        draggingRef.current = true;
        movedRef.current = false;

        dragStartXRef.current =
            event.clientX;

        dragLastXRef.current =
            event.clientX;

        dragLastTimeRef.current =
            performance.now();

        dragVelocityRef.current = 0;

        setIsDragging(true);

        event.currentTarget.setPointerCapture(
            event.pointerId,
        );
    };

    const handlePointerMove = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (
            !draggingRef.current ||
            !trackRef.current
        ) {
            return;
        }

        const deltaX =
            event.clientX -
            dragStartXRef.current;

        if (Math.abs(deltaX) > 6) {
            movedRef.current = true;
        }

        const now =
            performance.now();

        const elapsed =
            Math.max(
                1,
                now -
                dragLastTimeRef.current,
            );

        dragVelocityRef.current =
            ((event.clientX -
                dragLastXRef.current) /
                elapsed) *
            1000;

        dragLastXRef.current =
            event.clientX;

        dragLastTimeRef.current =
            now;

        gsap.set(trackRef.current, {
            x: deltaX * 0.32,
        });
    };

    const finishDrag = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (
            !draggingRef.current ||
            !trackRef.current
        ) {
            return;
        }

        draggingRef.current = false;
        setIsDragging(false);

        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId,
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId,
            );
        }

        const distance =
            event.clientX -
            dragStartXRef.current;

        const velocity =
            dragVelocityRef.current;

        const shouldMove =
            Math.abs(distance) > 42 ||
            Math.abs(velocity) > 320;

        if (!shouldMove) {
            gsap.to(trackRef.current, {
                x: 0,
                duration: 0.45,
                ease: "power3.out",
            });

            return;
        }

        /*
         * Return to neutral before handing
         * control to the existing infinite
         * carousel transition.
         */
        gsap.set(trackRef.current, {
            x: 0,
        });

        const direction =
            distance < 0 ||
                (
                    Math.abs(distance) <= 42 &&
                    velocity < 0
                )
                ? "next"
                : "previous";

        move(direction);
    };

    const handleClickCapture = (
        event: React.MouseEvent<HTMLDivElement>,
    ) => {
        if (!movedRef.current) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        movedRef.current = false;
    };

    /*
     * Make sure an interrupted/unmounted
     * animation leaves no GSAP tween behind.
     */
    useEffect(() => {
        const track =
            trackRef.current;

        return () => {
            if (track) {
                gsap.killTweensOf(
                    track,
                );
            }
        };
    }, []);

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
                <div
                    className="
                        mb-3
                        flex
                        items-center
                        justify-between
                        gap-6
                    "
                >
                    <p
                        className="
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
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >
                        <button
                            type="button"
                            onClick={() =>
                                move(
                                    "previous",
                                )
                            }
                            aria-label="Previous artwork"
                            className="
                                flex
                                h-6
                                w-6
                                items-center
                                justify-center

                                text-sm
                                text-white/50

                                transition-colors
                                duration-300

                                hover:text-brand-gold
                            "
                        >
                            ←
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                move(
                                    "next",
                                )
                            }
                            aria-label="Next artwork"
                            className="
                                flex
                                h-6
                                w-6
                                items-center
                                justify-center

                                text-sm
                                text-white/50

                                transition-colors
                                duration-300

                                hover:text-brand-gold
                            "
                        >
                            →
                        </button>
                    </div>
                </div>

                {/*
                 * Critical:
                 * this is still the exact
                 * working four-column grid.
                 */}
                <div
                    ref={trackRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={finishDrag}
                    onPointerCancel={finishDrag}
                    onClickCapture={handleClickCapture}
                    className={`
                        grid
                        h-7
                        grid-cols-4
                        gap-2

                        select-none
                        touch-pan-y

                        transition-[height]
                        duration-700
                        ease-[cubic-bezier(0.22,1,0.36,1)]

                        group-hover/works:h-52

                        xl:group-hover/works:h-56

                        will-change-transform

                        ${isDragging
                            ? "cursor-grabbing"
                            : "cursor-grab"
                        }
                    `}
                >
                    {visibleArtworks.map(
                        (
                            artwork,
                            position,
                        ) => (
                            <CollectionPreviewArtwork
                                key={`${artwork.id}-${position}`}
                                artwork={
                                    artwork
                                }
                                seriesSlug={
                                    seriesSlug
                                }
                            />
                        ),
                    )}
                </div>
            </div>
        </div>
    );
}