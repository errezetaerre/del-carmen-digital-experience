"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useKineticCarousel } from "./useKineticCarousel";

interface KineticCarouselProps {
    children: ReactNode;
    itemCount: number;
    viewportProps?: Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">;
    viewportClassName?: string;
    trackClassName?: string;
    previousLabel?: string;
    nextLabel?: string;
    previousButtonClassName?: string;
    nextButtonClassName?: string;
}

const buttonClassName = `
    absolute z-20 flex h-11 w-11 -translate-y-1/2
    items-center justify-center rounded-full border border-white/10
    bg-black/20 font-display text-2xl text-white/55 backdrop-blur-md
    transition-all duration-500 hover:border-brand-gold/30
    hover:bg-black/35 hover:text-brand-gold
`;

export default function KineticCarousel({
    children,
    itemCount,
    viewportProps,
    viewportClassName = "",
    trackClassName = "",
    previousLabel = "Explore previous items",
    nextLabel = "Explore more items",
    previousButtonClassName = "left-3 top-[40%]",
    nextButtonClassName = "right-5 top-[40%]",
}: KineticCarouselProps) {
    const kinetic = useKineticCarousel(itemCount);

    return (
        <div className="relative min-w-0">
            <div
                {...viewportProps}
                ref={kinetic.viewportRef}
                onPointerDown={kinetic.handlePointerDown}
                onPointerMove={kinetic.handlePointerMove}
                onPointerUp={kinetic.handlePointerUp}
                onPointerCancel={kinetic.handlePointerUp}
                onWheel={kinetic.handleWheel}
                onClickCapture={kinetic.handleClickCapture}
                className={[
                    "relative select-none overflow-hidden overscroll-x-contain touch-pan-y",
                    kinetic.dragging ? "cursor-grabbing" : "cursor-grab",
                    viewportClassName,
                ].join(" ")}
            >
                <div
                    ref={kinetic.trackRef}
                    className={[
                        "flex w-max items-start will-change-transform",
                        trackClassName,
                    ].join(" ")}
                >
                    {children}
                </div>
            </div>

            <button
                type="button"
                aria-label={previousLabel}
                onClick={() => kinetic.move(-1)}
                className={[
                    buttonClassName,
                    previousButtonClassName,
                    kinetic.canMoveLeft
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0",
                ].join(" ")}
            >
                ‹
            </button>

            <button
                type="button"
                aria-label={nextLabel}
                onClick={() => kinetic.move(1)}
                className={[
                    buttonClassName,
                    nextButtonClassName,
                    kinetic.canMoveRight
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0",
                ].join(" ")}
            >
                ›
            </button>
        </div>
    );
}
