"use client";

import Link from "next/link";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import type { Artwork } from "@/domains/artworks/model";

interface ArtworkLightboxProps {
    artworks: Artwork[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
    showDetailsCta?: boolean;
}

type Point = {
    x: number;
    y: number;
};

type PanGesture = {
    startX: number;
    startY: number;
    startPanX: number;
    startPanY: number;
};

type PinchGesture = {
    startDistance: number;
    startScale: number;
    startCenterX: number;
    startCenterY: number;
    startPanX: number;
    startPanY: number;
};

const SWIPE_THRESHOLD = 55;

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const SNAP_SCALE = 1.03;

export default function ArtworkLightbox({
    artworks,
    initialIndex,
    isOpen,
    onClose,
    showDetailsCta = false,
}: ArtworkLightboxProps) {
    /* =========================================================
       STATE
       ========================================================= */

    const [currentIndex, setCurrentIndex] =
        useState(initialIndex);

    const [swipeHintPhase, setSwipeHintPhase] =
        useState<"primary" | "reminder" | null>(null);

    /* =========================================================
       REFS
       ========================================================= */

    const closeButtonRef =
        useRef<HTMLButtonElement | null>(null);

    const zoomLayerRef =
        useRef<HTMLDivElement | null>(null);

    const activePointersRef =
        useRef<Map<number, Point>>(
            new Map(),
        );

    const swipeStartRef =
        useRef<Point | null>(null);

    const panGestureRef =
        useRef<PanGesture | null>(null);

    const pinchGestureRef =
        useRef<PinchGesture | null>(null);

    const scaleRef =
        useRef(1);

    const panXRef =
        useRef(0);

    const panYRef =
        useRef(0);

    const hadMultiTouchRef =
        useRef(false);

    const swipeHintInteractedRef =
        useRef(false);

    /* =========================================================
       DATA
       ========================================================= */

    const artwork =
        artworks[currentIndex];

    const total =
        artworks.length;

    const primaryImage =
        artwork?.images.primary;

    const techniqueLabel =
        artwork
            ? `${artwork.medium} on ${artwork.support}`
            : "";

    /* =========================================================
       HELPERS
       ========================================================= */

    const clamp = (
        value: number,
        min: number,
        max: number,
    ) => {
        return Math.min(
            Math.max(value, min),
            max,
        );
    };

    const getDistance = (
        a: Point,
        b: Point,
    ) => {
        return Math.hypot(
            b.x - a.x,
            b.y - a.y,
        );
    };

    const getCenter = (
        a: Point,
        b: Point,
    ) => {
        return {
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2,
        };
    };

    const clampPan = (
        x: number,
        y: number,
        scale: number,
    ) => {
        const layer =
            zoomLayerRef.current;

        if (
            !layer ||
            scale <= 1
        ) {
            return {
                x: 0,
                y: 0,
            };
        }

        const width =
            layer.offsetWidth;

        const height =
            layer.offsetHeight;

        const maxX =
            (width * (scale - 1)) / 2;

        const maxY =
            (height * (scale - 1)) / 2;

        return {
            x: clamp(
                x,
                -maxX,
                maxX,
            ),

            y: clamp(
                y,
                -maxY,
                maxY,
            ),
        };
    };

    const applyTransform = (
        scale = scaleRef.current,
        x = panXRef.current,
        y = panYRef.current,
        animate = false,
    ) => {
        const layer =
            zoomLayerRef.current;

        if (!layer) {
            return;
        }

        const safeScale =
            clamp(
                scale,
                MIN_SCALE,
                MAX_SCALE,
            );

        const safePan =
            clampPan(
                x,
                y,
                safeScale,
            );

        scaleRef.current =
            safeScale;

        panXRef.current =
            safePan.x;

        panYRef.current =
            safePan.y;

        layer.style.transition =
            animate
                ? "transform 260ms cubic-bezier(0.22, 0.61, 0.36, 1)"
                : "none";

        layer.style.transform = `
      translate3d(
        ${safePan.x}px,
        ${safePan.y}px,
        0
      )
      scale(${safeScale})
    `;
    };

    const resetZoom = (
        animate = true,
    ) => {
        scaleRef.current = 1;

        panXRef.current = 0;
        panYRef.current = 0;

        panGestureRef.current =
            null;

        pinchGestureRef.current =
            null;

        applyTransform(
            1,
            0,
            0,
            animate,
        );
    };

    /* =========================================================
       RESET WHEN OPENING
       ========================================================= */

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setCurrentIndex(
            initialIndex,
        );
    }, [
        initialIndex,
        isOpen,
    ]);

    useEffect(() => {
        activePointersRef.current.clear();

        swipeStartRef.current =
            null;

        panGestureRef.current =
            null;

        pinchGestureRef.current =
            null;

        hadMultiTouchRef.current =
            false;

        scaleRef.current = 1;

        panXRef.current = 0;
        panYRef.current = 0;

        const layer =
            zoomLayerRef.current;

        if (layer) {
            layer.style.transition =
                "none";

            layer.style.transform =
                "translate3d(0px, 0px, 0) scale(1)";
        }
    }, [currentIndex]);

    /* =========================================================
       BODY LOCK + KEYBOARD
       ========================================================= */

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const originalOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        closeButtonRef.current?.focus();

        const handleKeyDown = (
            event: KeyboardEvent,
        ) => {
            if (
                event.key ===
                "Escape"
            ) {
                onClose();
            }

            if (
                event.key ===
                "ArrowRight"
            ) {
                setCurrentIndex(
                    (index) =>
                        (index + 1) %
                        total,
                );
            }

            if (
                event.key ===
                "ArrowLeft"
            ) {
                setCurrentIndex(
                    (index) =>
                        (index - 1 + total) %
                        total,
                );
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            document.body.style.overflow =
                originalOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [
        isOpen,
        onClose,
        total,
    ]);

    /* =========================================================
       SWIPE INTRODUCTION
       ========================================================= */

    useEffect(() => {
        if (!isOpen) {
            setSwipeHintPhase(null);
            return;
        }

        swipeHintInteractedRef.current = false;
        setSwipeHintPhase("primary");

        const hidePrimary = window.setTimeout(() => {
            setSwipeHintPhase(null);
        }, 3200);

        const showReminder = window.setTimeout(() => {
            if (!swipeHintInteractedRef.current) {
                setSwipeHintPhase("reminder");
            }
        }, 9000);

        const hideReminder = window.setTimeout(() => {
            setSwipeHintPhase(null);
        }, 11400);

        return () => {
            window.clearTimeout(hidePrimary);
            window.clearTimeout(showReminder);
            window.clearTimeout(hideReminder);
        };
    }, [isOpen]);

    const dismissSwipeHint = () => {
        swipeHintInteractedRef.current = true;
        setSwipeHintPhase(null);
    };

    /* =========================================================
       RENDER GUARD
       ========================================================= */

    if (
        !isOpen ||
        !artwork ||
        !primaryImage
    ) {
        return null;
    }

    /* =========================================================
       ORIENTATION
       ========================================================= */

    const isPortrait =
        artwork.dimensions.height >
        artwork.dimensions.width;

    /* =========================================================
       NAVIGATION
       ========================================================= */

    const goNext = () => {
        resetZoom(false);

        setCurrentIndex(
            (index) =>
                (index + 1) %
                total,
        );
    };

    const goPrevious = () => {
        resetZoom(false);

        setCurrentIndex(
            (index) =>
                (index - 1 + total) %
                total,
        );
    };

    /* =========================================================
       POINTER DOWN
       ========================================================= */

    const handlePointerDown = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (
            event.pointerType !==
            "touch" &&
            event.pointerType !==
            "pen"
        ) {
            return;
        }

        dismissSwipeHint();

        const pointers =
            activePointersRef.current;

        pointers.set(
            event.pointerId,
            {
                x: event.clientX,
                y: event.clientY,
            },
        );

        try {
            event.currentTarget.setPointerCapture(
                event.pointerId,
            );
        } catch {
            // Pointer capture may not be available.
        }

        if (
            pointers.size === 1
        ) {
            hadMultiTouchRef.current =
                false;

            swipeStartRef.current = {
                x: event.clientX,
                y: event.clientY,
            };

            panGestureRef.current = {
                startX:
                    event.clientX,

                startY:
                    event.clientY,

                startPanX:
                    panXRef.current,

                startPanY:
                    panYRef.current,
            };

            return;
        }

        if (
            pointers.size === 2
        ) {
            hadMultiTouchRef.current =
                true;

            swipeStartRef.current =
                null;

            const [
                first,
                second,
            ] = Array.from(
                pointers.values(),
            );

            const center =
                getCenter(
                    first,
                    second,
                );

            pinchGestureRef.current = {
                startDistance:
                    getDistance(
                        first,
                        second,
                    ),

                startScale:
                    scaleRef.current,

                startCenterX:
                    center.x,

                startCenterY:
                    center.y,

                startPanX:
                    panXRef.current,

                startPanY:
                    panYRef.current,
            };
        }
    };

    /* =========================================================
       POINTER MOVE
       ========================================================= */

    const handlePointerMove = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        const pointers =
            activePointersRef.current;

        if (
            !pointers.has(
                event.pointerId,
            )
        ) {
            return;
        }

        pointers.set(
            event.pointerId,
            {
                x: event.clientX,
                y: event.clientY,
            },
        );

        /* Pinch */

        if (
            pointers.size >= 2 &&
            pinchGestureRef.current
        ) {
            const [
                first,
                second,
            ] = Array.from(
                pointers.values(),
            );

            const gesture =
                pinchGestureRef.current;

            const distance =
                getDistance(
                    first,
                    second,
                );

            const center =
                getCenter(
                    first,
                    second,
                );

            const ratio =
                distance /
                gesture.startDistance;

            const nextScale =
                clamp(
                    gesture.startScale *
                    ratio,

                    MIN_SCALE,
                    MAX_SCALE,
                );

            const centerDeltaX =
                center.x -
                gesture.startCenterX;

            const centerDeltaY =
                center.y -
                gesture.startCenterY;

            const nextPanX =
                gesture.startPanX +
                centerDeltaX;

            const nextPanY =
                gesture.startPanY +
                centerDeltaY;

            applyTransform(
                nextScale,
                nextPanX,
                nextPanY,
            );

            return;
        }

        /* Pan */

        if (
            pointers.size === 1 &&
            scaleRef.current >
            SNAP_SCALE &&
            panGestureRef.current
        ) {
            const gesture =
                panGestureRef.current;

            const nextPanX =
                gesture.startPanX +
                event.clientX -
                gesture.startX;

            const nextPanY =
                gesture.startPanY +
                event.clientY -
                gesture.startY;

            applyTransform(
                scaleRef.current,
                nextPanX,
                nextPanY,
            );
        }
    };

    /* =========================================================
       POINTER UP
       ========================================================= */

    const handlePointerUp = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        const pointers =
            activePointersRef.current;

        const releasedPoint =
            pointers.get(
                event.pointerId,
            );

        pointers.delete(
            event.pointerId,
        );

        try {
            event.currentTarget.releasePointerCapture(
                event.pointerId,
            );
        } catch {
            // Already released.
        }

        if (
            hadMultiTouchRef.current
        ) {
            pinchGestureRef.current =
                null;

            if (
                scaleRef.current <=
                SNAP_SCALE
            ) {
                resetZoom(true);
            }

            if (
                pointers.size === 1
            ) {
                const remaining =
                    Array.from(
                        pointers.values(),
                    )[0];

                panGestureRef.current = {
                    startX:
                        remaining.x,

                    startY:
                        remaining.y,

                    startPanX:
                        panXRef.current,

                    startPanY:
                        panYRef.current,
                };
            }

            if (
                pointers.size === 0
            ) {
                hadMultiTouchRef.current =
                    false;

                panGestureRef.current =
                    null;
            }

            return;
        }

        if (
            scaleRef.current >
            SNAP_SCALE
        ) {
            panGestureRef.current =
                null;

            return;
        }

        if (
            !releasedPoint ||
            !swipeStartRef.current
        ) {
            return;
        }

        const distance =
            releasedPoint.x -
            swipeStartRef.current.x;

        swipeStartRef.current =
            null;

        panGestureRef.current =
            null;

        if (
            Math.abs(distance) <
            SWIPE_THRESHOLD
        ) {
            return;
        }

        if (
            distance < 0
        ) {
            goNext();
        } else {
            goPrevious();
        }
    };

    /* =========================================================
       POINTER CANCEL
       ========================================================= */

    const handlePointerCancel = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        activePointersRef.current.delete(
            event.pointerId,
        );

        swipeStartRef.current =
            null;

        panGestureRef.current =
            null;

        pinchGestureRef.current =
            null;

        hadMultiTouchRef.current =
            false;

        if (
            scaleRef.current <=
            SNAP_SCALE
        ) {
            resetZoom(true);
        }
    };

    /* =========================================================
       RENDER
       ========================================================= */

    return (
        <div
            className="fixed inset-0 z-[100] overflow-hidden bg-[#030303] text-white"
            role="dialog"
            aria-modal="true"
            aria-label={`Artwork viewer — ${artwork.title}`}
        >
            {/* Fullscreen atmosphere — intentionally subtle */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="artwork-lightbox-aura absolute left-1/2 top-[43%] h-[58vh] w-[78vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(190,145,72,0.18)_0%,rgba(125,91,52,0.10)_34%,rgba(71,55,39,0.04)_54%,transparent_74%)] blur-[42px]" />
                <div className="artwork-lightbox-smoke-a absolute left-[-16%] top-[29%] h-[120px] w-[88%] rotate-[-4deg] rounded-[50%] bg-[linear-gradient(100deg,transparent_0%,rgba(117,157,166,0.025)_20%,rgba(220,210,190,0.06)_42%,rgba(190,147,82,0.055)_60%,transparent_100%)] blur-[24px]" />
                <div className="artwork-lightbox-smoke-b absolute bottom-[22%] right-[-18%] h-[140px] w-[90%] rotate-[5deg] rounded-[50%] bg-[linear-gradient(80deg,transparent_0%,rgba(190,211,215,0.025)_20%,rgba(220,208,187,0.05)_42%,rgba(188,143,77,0.06)_62%,transparent_100%)] blur-[26px]" />
                <span className="artwork-particle artwork-particle-1" />
                <span className="artwork-particle artwork-particle-2" />
                <span className="artwork-particle artwork-particle-3" />
                <span className="artwork-particle artwork-particle-4" />
                <span className="artwork-particle artwork-particle-5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_28%,rgba(0,0,0,0.28)_68%,rgba(0,0,0,0.80)_100%)]" />
            </div>

            {/* Counter — inset from viewport edges */}
            <div className="fixed left-7 top-7 z-[140] font-sans text-[10px] uppercase tracking-[0.22em] text-white/35 md:left-10 md:top-9">
                {String(currentIndex + 1).padStart(2, "0")}
                {" / "}
                {String(total).padStart(2, "0")}
            </div>

            {/* Close */}
            <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                onPointerDown={(event) => event.stopPropagation()}
                aria-label="Close artwork viewer"
                className="fixed right-4 top-4 z-[150] flex h-11 w-11 items-center justify-center font-sans text-[32px] font-light leading-none text-white/75 transition-colors duration-300 hover:text-brand-gold focus-visible:text-brand-gold focus-visible:outline-none md:right-8 md:top-6"
            >
                ×
            </button>

            {/* Fixed artwork navigation — visible on mobile too */}
            {total > 1 && (
                <>
                    <button
                        type="button"
                        onClick={goPrevious}
                        onPointerDown={(event) => event.stopPropagation()}
                        aria-label="Previous artwork"
                        className="fixed left-1 top-[42%] z-[145] flex h-12 w-12 -translate-y-1/2 items-center justify-center font-display text-4xl font-light text-white/45 transition-all duration-300 hover:scale-110 hover:text-brand-gold md:left-5 md:top-1/2 md:h-14 md:w-14 lg:left-10"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        onPointerDown={(event) => event.stopPropagation()}
                        aria-label="Next artwork"
                        className="fixed right-1 top-[42%] z-[145] flex h-12 w-12 -translate-y-1/2 items-center justify-center font-display text-4xl font-light text-white/45 transition-all duration-300 hover:scale-110 hover:text-brand-gold md:right-5 md:top-1/2 md:h-14 md:w-14 lg:right-10"
                    >
                        ›
                    </button>
                </>
            )}

            {/* Viewer */}
            <div
                className="relative z-20 flex h-full w-full touch-none items-center justify-center overflow-hidden px-3 py-3 md:px-20 md:py-8 [@media(orientation:landscape)_and_(max-height:600px)]:px-3 [@media(orientation:landscape)_and_(max-height:600px)]:py-2"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
            >
                <div className="relative flex h-[calc(100svh-24px)] w-full max-w-[1040px] flex-col md:h-[min(90vh,900px)] [@media(orientation:landscape)_and_(max-height:600px)]:h-[calc(100svh-16px)] [@media(orientation:landscape)_and_(max-height:600px)]:max-w-none">
                    {/* Artwork stage */}
                    <div className="relative flex min-h-0 flex-1 items-center justify-center px-7 pb-2 pt-12 md:px-10 md:pb-3 md:pt-8 [@media(orientation:landscape)_and_(max-height:600px)]:px-12 [@media(orientation:landscape)_and_(max-height:600px)]:pb-1 [@media(orientation:landscape)_and_(max-height:600px)]:pt-3">
                        {/* Glow belongs to the artwork, not the canvas */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[32px] bg-[radial-gradient(ellipse_at_center,rgba(198,151,79,0.16)_0%,rgba(198,151,79,0.07)_36%,transparent_72%)] blur-[28px] [@media(orientation:landscape)_and_(max-height:600px)]:h-[94%] [@media(orientation:landscape)_and_(max-height:600px)]:w-[88%]"
                        />

                        {/* Zoomable artwork — no visible frame/border */}
                        <div
                            ref={zoomLayerRef}
                            className="relative z-10 flex h-full max-h-full w-full max-w-full origin-center items-center justify-center overflow-hidden will-change-transform"
                        >
                            <img
                                key={artwork.id}
                                src={primaryImage.src}
                                alt={primaryImage.alt}
                                draggable={false}
                                className="relative z-10 h-full max-h-full w-full max-w-full select-none object-contain"
                            />

                            {/* Subtle image-only integration */}
                            <div
                                aria-hidden
                                className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_42px_10px_rgba(0,0,0,0.28)]"
                            />

                            {/* Image-only moving reflection */}
                            <div
                                aria-hidden
                                className="artwork-glass-reflection pointer-events-none absolute -left-[30%] -top-[20%] z-30 h-[140%] w-[24%] rotate-[14deg] bg-gradient-to-r from-transparent via-white/[0.045] to-transparent blur-[10px]"
                            />
                        </div>

                        {/* Ephemeral touch guidance — visual only */}
                        {swipeHintPhase && (
                            <div
                                key={swipeHintPhase}
                                aria-hidden
                                className={[
                                    "pointer-events-none absolute inset-0 z-40 hidden items-center justify-center [@media(pointer:coarse)]:flex",
                                    swipeHintPhase === "primary"
                                        ? "artwork-swipe-hint-primary"
                                        : "artwork-swipe-hint-reminder",
                                ].join(" ")}
                            >
                                <div
                                    className="
                                artwork-swipe-hint-content
                                flex
                                items-center
                                gap-5
                                rounded-full
                                bg-black/30
                                px-5
                                py-3
                                backdrop-blur-md
                            "
                                >
                                    <span
                                        className="
                                font-display
                                text-lg
                                text-white/40
                                "
                                    >
                                        ‹
                                    </span>

                                    <span
                                        className="
                                font-sans
                                text-[9px]
                                font-medium
                                uppercase
                                tracking-[0.3em]
                                text-white/70
                                "
                                    >
                                        Swipe to explore
                                    </span>

                                    <span
                                        className="
                                font-display
                                text-lg
                                text-white/40
                                "
                                    >
                                        ›
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Position dots */}
                    {total > 1 && (
                        <div
                            className="relative z-40 flex h-5 shrink-0 items-center justify-center gap-2 md:h-6 [@media(orientation:landscape)_and_(max-height:600px)]:h-4"
                            aria-label={`Artwork ${currentIndex + 1} of ${total}`}
                        >
                            {artworks.map((item, index) => {
                                const isActive = index === currentIndex;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => {
                                            resetZoom(false);
                                            setCurrentIndex(index);
                                        }}
                                        onPointerDown={(event) => event.stopPropagation()}
                                        aria-label={`View artwork ${index + 1}`}
                                        aria-current={isActive ? "true" : undefined}
                                        className="group flex h-5 w-5 items-center justify-center focus-visible:outline-none"
                                    >
                                        <span
                                            className={[
                                                "block h-[5px] w-[5px] rounded-full border transition-all duration-300",
                                                isActive
                                                    ? "scale-110 border-white/80 bg-white/80"
                                                    : "border-white/35 bg-transparent group-hover:border-white/65",
                                            ].join(" ")}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Information panel */}
                    <div className="relative z-30 h-[205px] w-full shrink-0 px-5 pb-4 pt-3 text-center md:h-[220px] md:px-10 md:pb-5 md:pt-4 [@media(orientation:landscape)_and_(max-height:600px)]:h-[92px] [@media(orientation:landscape)_and_(max-height:600px)]:px-6 [@media(orientation:landscape)_and_(max-height:600px)]:pb-2 [@media(orientation:landscape)_and_(max-height:600px)]:pt-1">
                        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.30em] text-brand-gold/90 md:text-xs [@media(orientation:landscape)_and_(max-height:600px)]:text-[8px]">
                            {artwork.year}
                        </p>

                        <h2 className="mt-1.5 font-display text-2xl font-light leading-[1.05] tracking-[0.01em] md:text-3xl [@media(orientation:landscape)_and_(max-height:600px)]:mt-0.5 [@media(orientation:landscape)_and_(max-height:600px)]:text-lg">
                            {artwork.title}
                        </h2>

                        <div className="mt-2.5 font-sans text-[9px] uppercase tracking-[0.18em] text-white/45 md:text-[10px] [@media(orientation:landscape)_and_(max-height:600px)]:mt-0.5 [@media(orientation:landscape)_and_(max-height:600px)]:text-[7px]">
                            <span>{techniqueLabel}</span>
                            <span className="mx-3 text-brand-gold/40">·</span>
                            <span>
                                {artwork.dimensions.width} × {artwork.dimensions.height} {artwork.dimensions.unit}
                            </span>
                        </div>

                        <div aria-hidden className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-brand-gold/45 to-transparent [@media(orientation:landscape)_and_(max-height:600px)]:mt-1" />

                        <div className="mx-auto mt-3 h-[58px] max-w-xl overflow-hidden [@media(orientation:landscape)_and_(max-height:600px)]:hidden">
                            {artwork.description && (
                                <p className="line-clamp-2 font-sans text-sm font-light leading-6 text-white/45 md:line-clamp-3">
                                    {artwork.description}
                                </p>
                            )}
                        </div>

                        {/* Equal-weight CTAs */}
                        {showDetailsCta && (
                            <div className="absolute bottom-3 left-1/2 flex w-[calc(100%-32px)] -translate-x-1/2 items-center justify-center gap-4 whitespace-nowrap md:bottom-4 md:w-auto md:gap-7 [@media(orientation:landscape)_and_(max-height:600px)]:bottom-1 [@media(orientation:landscape)_and_(max-height:600px)]:gap-4">
                                <Link
                                    href={`/artworks/${artwork.slug}`}
                                    onPointerDown={(event) => event.stopPropagation()}
                                    className="font-sans text-[9px] font-medium uppercase tracking-[0.16em] text-white/55 transition-colors duration-300 hover:text-brand-gold focus-visible:text-brand-gold focus-visible:outline-none md:text-[10px] md:tracking-[0.22em] [@media(orientation:landscape)_and_(max-height:600px)]:text-[8px]"
                                >
                                    View details
                                    <span aria-hidden className="ml-1.5 inline-block">→</span>
                                </Link>

                                <span aria-hidden className="h-3 w-px bg-white/15" />

                                <Link
                                    href="/artworks"
                                    onPointerDown={(event) => event.stopPropagation()}
                                    className="font-sans text-[9px] font-medium uppercase tracking-[0.16em] text-white/55 transition-colors duration-300 hover:text-brand-gold focus-visible:text-brand-gold focus-visible:outline-none md:text-[10px] md:tracking-[0.22em] [@media(orientation:landscape)_and_(max-height:600px)]:text-[8px]"
                                >
                                    View all works
                                    <span aria-hidden className="ml-1.5 inline-block">→</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes glassReflection {
                    0% { transform: translate3d(-30%, 0, 0) rotate(14deg); opacity: 0; }
                    20% { opacity: 0.42; }
                    70% { opacity: 0.22; }
                    100% { transform: translate3d(520%, 0, 0) rotate(14deg); opacity: 0; }
                }

                .artwork-glass-reflection {
                    animation: glassReflection 16s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }

                @keyframes artworkAura {
                    0% { transform: translate(-50%, -50%) scale(0.97); opacity: 0.52; }
                    50% { transform: translate(-48%, -52%) scale(1.035); opacity: 0.76; }
                    100% { transform: translate(-52%, -49%) scale(1); opacity: 0.58; }
                }

                @keyframes smokeA {
                    0% { transform: translate3d(-4%, 0, 0) rotate(-7deg) scaleX(0.96); }
                    50% { transform: translate3d(7%, -7%, 0) rotate(-3deg) scaleX(1.04); }
                    100% { transform: translate3d(14%, 3%, 0) rotate(-8deg) scaleX(1); }
                }

                @keyframes smokeB {
                    0% { transform: translate3d(5%, 2%, 0) rotate(6deg) scaleX(1); }
                    50% { transform: translate3d(-6%, -7%, 0) rotate(3deg) scaleX(1.05); }
                    100% { transform: translate3d(-13%, 2%, 0) rotate(8deg) scaleX(0.97); }
                }

                @keyframes particleFloat {
                    0% { transform: translate3d(0, 0, 0) scale(0.8); opacity: 0; }
                    25% { opacity: 0.32; }
                    75% { opacity: 0.14; }
                    100% { transform: translate3d(18px, -70px, 0) scale(1.15); opacity: 0; }
                }

                .artwork-lightbox-aura { animation: artworkAura 18s ease-in-out infinite alternate; }
                .artwork-lightbox-smoke-a { animation: smokeA 24s ease-in-out infinite alternate; }
                .artwork-lightbox-smoke-b { animation: smokeB 29s ease-in-out infinite alternate; }

                .artwork-particle {
                    position: absolute;
                    width: 3px;
                    height: 3px;
                    border-radius: 9999px;
                    background: rgba(203, 158, 83, 0.68);
                    box-shadow: 0 0 12px rgba(203, 158, 83, 0.32);
                    opacity: 0;
                    animation: particleFloat 14s ease-in-out infinite;
                }

                .artwork-particle-1 { left: 13%; top: 63%; animation-delay: 0s; }
                .artwork-particle-2 { left: 28%; top: 35%; animation-delay: 3s; }
                .artwork-particle-3 { right: 19%; top: 58%; animation-delay: 6s; }
                .artwork-particle-4 { right: 31%; top: 27%; animation-delay: 9s; }
                .artwork-particle-5 { left: 53%; top: 78%; animation-delay: 4.5s; }

                @keyframes swipeHintPrimary {
                    0% { opacity: 0; filter: blur(12px); transform: translate3d(10px, 0, 0) scale(0.985); }
                    14% { opacity: 1; filter: blur(0); transform: translate3d(0, 0, 0) scale(1); }
                    58% { opacity: 0.92; filter: blur(0); transform: translate3d(0, 0, 0) scale(1); }
                    76% { opacity: 0.58; filter: blur(2px); transform: translate3d(-8px, 0, 0) scale(1.005); }
                    100% { opacity: 0; filter: blur(14px); transform: translate3d(-34px, 0, 0) scale(1.02); letter-spacing: 0.42em; }
                }

                @keyframes swipeHintReminder {
                    0%, 100% { opacity: 0; filter: blur(5px); }
                    24%, 68% { opacity: 0.55; filter: blur(0); }
                }

                @keyframes swipeHintArrowBreath {
                    0%, 100% { transform: scaleX(0.92); opacity: 0.45; }
                    50% { transform: scaleX(1.08); opacity: 0.82; }
                }

                .artwork-swipe-hint-primary {
                    animation: swipeHintPrimary 3.2s cubic-bezier(0.22, 1, 0.36, 1) both;
                }

                .artwork-swipe-hint-reminder {
                    animation: swipeHintReminder 2.4s ease-in-out both;
                }

                .artwork-swipe-hint-content > span:last-child {
                    animation: swipeHintArrowBreath 1.45s ease-in-out infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .artwork-lightbox-aura,
                    .artwork-lightbox-smoke-a,
                    .artwork-lightbox-smoke-b,
                    .artwork-particle,
                    .artwork-glass-reflection,
                    .artwork-swipe-hint-primary,
                    .artwork-swipe-hint-reminder,
                    .artwork-swipe-hint-content > span:last-child {
                        animation: none;
                    }
                }
            `}</style>
        </div>
    );
}
