"use client";

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
}: ArtworkLightboxProps) {
    /* =========================================================
       STATE
       ========================================================= */

    const [currentIndex, setCurrentIndex] =
        useState(initialIndex);

    /* =========================================================
       REFS
       ========================================================= */

    const closeButtonRef =
        useRef<HTMLButtonElement | null>(null);

    const zoomLayerRef =
        useRef<HTMLDivElement | null>(null);

    const activePointersRef =
        useRef<Map<number, Point>>(new Map());

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

    /* =========================================================
       DATA
       ========================================================= */

    const artwork =
        artworks[currentIndex];

    const total = artworks.length;

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

        if (!layer || scale <= 1) {
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

        layer.style.transition = animate
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

        panGestureRef.current = null;
        pinchGestureRef.current = null;

        applyTransform(
            1,
            0,
            0,
            animate,
        );
    };

    /* =========================================================
       RESET WHEN OPENING / CHANGING ARTWORK
       ========================================================= */

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setCurrentIndex(initialIndex);
    }, [
        initialIndex,
        isOpen,
    ]);

    useEffect(() => {
        activePointersRef.current.clear();

        swipeStartRef.current = null;
        panGestureRef.current = null;
        pinchGestureRef.current = null;

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
            if (event.key === "Escape") {
                onClose();
            }

            if (
                event.key === "ArrowRight"
            ) {
                setCurrentIndex(
                    (index) =>
                        (index + 1) % total,
                );
            }

            if (
                event.key === "ArrowLeft"
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
       RENDER GUARD
       ========================================================= */

    if (
        !isOpen ||
        !artwork
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
                (index + 1) % total,
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
  
       1 finger:
       - swipe if scale = 1
       - pan if scale > 1
  
       2 fingers:
       - pinch zoom
       ========================================================= */

    const handlePointerDown = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (
            event.pointerType !== "touch" &&
            event.pointerType !== "pen"
        ) {
            return;
        }

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

        /* ---------------------------------------------------------
           One pointer
           --------------------------------------------------------- */

        if (pointers.size === 1) {
            hadMultiTouchRef.current =
                false;

            swipeStartRef.current = {
                x: event.clientX,
                y: event.clientY,
            };

            panGestureRef.current = {
                startX: event.clientX,
                startY: event.clientY,
                startPanX:
                    panXRef.current,
                startPanY:
                    panYRef.current,
            };

            return;
        }

        /* ---------------------------------------------------------
           Two pointers = pinch
           --------------------------------------------------------- */

        if (pointers.size === 2) {
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

        /* ---------------------------------------------------------
           PINCH — TWO POINTERS
           --------------------------------------------------------- */

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

            /*
             * Moving both fingers together also
             * moves the enlarged artwork.
             */

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

        /* ---------------------------------------------------------
           PAN — ONE POINTER WHILE ZOOMED
           --------------------------------------------------------- */

        if (
            pointers.size === 1 &&
            scaleRef.current > SNAP_SCALE &&
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
            // Pointer may already have been released.
        }

        /* ---------------------------------------------------------
           Finishing pinch
           --------------------------------------------------------- */

        if (
            hadMultiTouchRef.current
        ) {
            pinchGestureRef.current =
                null;

            /*
             * If we're practically at 1×,
             * snap cleanly back to 1×.
             */

            if (
                scaleRef.current <=
                SNAP_SCALE
            ) {
                resetZoom(true);
            }

            /*
             * If one finger remains after pinch,
             * immediately allow panning from its
             * current position.
             */

            if (pointers.size === 1) {
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

            if (pointers.size === 0) {
                hadMultiTouchRef.current =
                    false;

                panGestureRef.current =
                    null;
            }

            return;
        }

        /* ---------------------------------------------------------
           No navigation while zoomed.
           --------------------------------------------------------- */

        if (
            scaleRef.current >
            SNAP_SCALE
        ) {
            panGestureRef.current =
                null;

            return;
        }

        /* ---------------------------------------------------------
           Normal one-finger swipe
           --------------------------------------------------------- */

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

        if (distance < 0) {
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

        swipeStartRef.current = null;
        panGestureRef.current = null;
        pinchGestureRef.current = null;

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
            className="
        fixed
        inset-0
        z-[100]
        bg-[#050505]/98
        text-white
      "
            role="dialog"
            aria-modal="true"
            aria-label={`Artwork viewer — ${artwork.title}`}
        >
            {/* =====================================================
          CLOSE
         ===================================================== */}

            <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close artwork viewer"
                className="
          absolute
          right-4
          top-4
          z-50
          flex
          h-11
          w-11
          items-center
          justify-center
          font-sans
          text-[32px]
          font-light
          leading-none
          text-white/80
          transition-colors
          duration-300
          hover:text-brand-gold
          focus-visible:text-brand-gold
          focus-visible:outline-none

          md:right-8
          md:top-6
        "
            >
                ×
            </button>

            {/* =====================================================
          COUNTER
         ===================================================== */}

            <div
                className="
          absolute
          left-5
          top-6
          z-40
          font-sans
          text-[10px]
          uppercase
          tracking-[0.22em]
          text-white/35

          md:left-8
          md:top-8
        "
            >
                {String(
                    currentIndex + 1,
                ).padStart(2, "0")}

                {" / "}

                {String(total).padStart(
                    2,
                    "0",
                )}
            </div>

            {/* =====================================================
          VIEWER
         ===================================================== */}

            <div
                className="
          flex
          h-full
          w-full
          touch-none
          flex-col
          items-center
          justify-center
          overflow-hidden
          px-5
          pb-8
          pt-16

          md:px-16
          md:pb-10
          md:pt-12
        "
                onPointerDown={
                    handlePointerDown
                }
                onPointerMove={
                    handlePointerMove
                }
                onPointerUp={
                    handlePointerUp
                }
                onPointerCancel={
                    handlePointerCancel
                }
            >
                {/* ===================================================
            ARTWORK
           =================================================== */}

                <div
                    className="
            relative
            flex
            min-h-0
            w-full
            flex-1
            items-center
            justify-center
          "
                >
                    {/* =================================================
              ZOOMABLE ARTWORK

              Image + decorative lines are transformed
              together as one visual object.
             ================================================= */}

                    <div
                        ref={zoomLayerRef}
                        className="
              relative
              flex
              max-h-full
              max-w-full
              origin-center
              items-center
              justify-center
              will-change-transform
            "
                    >
                        <img
                            key={artwork.id}
                            src={artwork.image.src}
                            alt={artwork.image.alt}
                            draggable={false}
                            className="
                relative
                z-10
                max-h-[62svh]
                max-w-full
                select-none
                object-contain
                shadow-[0_30px_100px_rgba(0,0,0,0.65)]

                md:max-h-[68vh]

                [@media(orientation:landscape)_and_(max-height:600px)]:max-h-[58svh]
              "
                        />

                        {/* =================================================
                EDGE ACCENTS

                Portrait:
                left + right

                Landscape:
                top + bottom
               ================================================= */}

                        <div
                            aria-hidden
                            className="
                pointer-events-none
                absolute
                inset-0
                z-20
              "
                        >
                            {isPortrait ? (
                                <>
                                    {/* Left */}
                                    <span
                                        className="
                      absolute
                      bottom-[7%]
                      left-[-10px]
                      top-[7%]
                      w-px
                      bg-gradient-to-b
                      from-transparent
                      via-brand-gold/55
                      to-transparent
                    "
                                    />

                                    {/* Right */}
                                    <span
                                        className="
                      absolute
                      bottom-[7%]
                      right-[-10px]
                      top-[7%]
                      w-px
                      bg-gradient-to-b
                      from-transparent
                      via-brand-gold/55
                      to-transparent
                    "
                                    />
                                </>
                            ) : (
                                <>
                                    {/* Top */}
                                    <span
                                        className="
                      absolute
                      left-[7%]
                      right-[7%]
                      top-[-10px]
                      h-px
                      bg-gradient-to-r
                      from-transparent
                      via-brand-gold/55
                      to-transparent
                    "
                                    />

                                    {/* Bottom */}
                                    <span
                                        className="
                      absolute
                      bottom-[-10px]
                      left-[7%]
                      right-[7%]
                      h-px
                      bg-gradient-to-r
                      from-transparent
                      via-brand-gold/55
                      to-transparent
                    "
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* =================================================
              PREVIOUS
             ================================================= */}

                    {total > 1 && (
                        <button
                            type="button"
                            onClick={
                                goPrevious
                            }
                            aria-label="Previous artwork"
                            className="
                absolute
                left-0
                z-40
                hidden
                h-14
                w-14
                items-center
                justify-center
                font-display
                text-4xl
                font-light
                text-white/35
                transition-colors
                duration-300
                hover:text-brand-gold

                md:flex
              "
                        >
                            ‹
                        </button>
                    )}

                    {/* =================================================
              NEXT
             ================================================= */}

                    {total > 1 && (
                        <button
                            type="button"
                            onClick={goNext}
                            aria-label="Next artwork"
                            className="
                absolute
                right-0
                z-40
                hidden
                h-14
                w-14
                items-center
                justify-center
                font-display
                text-4xl
                font-light
                text-white/35
                transition-colors
                duration-300
                hover:text-brand-gold

                md:flex
              "
                        >
                            ›
                        </button>
                    )}
                </div>

                {/* ===================================================
            INFORMATION
           =================================================== */}

                <div
                    className="
            mt-6
            w-full
            max-w-2xl
            shrink-0
            text-center

            [@media(orientation:landscape)_and_(max-height:600px)]:mt-3
          "
                >
                    {/* Year */}

                    <p
                        className="
              font-sans
              text-xs
              font-medium
              uppercase
              tracking-[0.30em]
              text-brand-gold/90

              md:text-sm

              [@media(orientation:landscape)_and_(max-height:600px)]:text-[11px]
            "
                    >
                        {artwork.year}
                    </p>

                    {/* Title */}

                    <h2
                        className="
              mt-2
              font-display
              text-3xl
              font-light
              leading-[1.05]
              tracking-[0.01em]

              md:text-4xl

              [@media(orientation:landscape)_and_(max-height:600px)]:text-2xl
            "
                    >
                        {artwork.title}
                    </h2>

                    {/* Metadata */}

                    <div
                        className="
              mt-3
              font-sans
              text-[10px]
              uppercase
              tracking-[0.18em]
              text-white/45
            "
                    >
                        <span>
                            {artwork.technique}
                        </span>

                        <span className="mx-3 text-brand-gold/40">
                            ·
                        </span>

                        <span>
                            {artwork.dimensions.width}{" "}
                            ×{" "}
                            {artwork.dimensions.height}{" "}
                            {artwork.dimensions.unit}
                        </span>
                    </div>

                    {/* Description */}

                    {artwork.description && (
                        <p
                            className="
                mx-auto
                mt-4
                max-w-lg
                font-sans
                text-sm
                font-light
                leading-6
                text-white/45

                [@media(orientation:landscape)_and_(max-height:600px)]:hidden
              "
                        >
                            {artwork.description}
                        </p>
                    )}

                    {/* Mobile gesture hint */}

                    {total > 1 && (
                        <p
                            className="
                mt-5
                font-sans
                text-[9px]
                uppercase
                tracking-[0.24em]
                text-white/25

                md:hidden

                [@media(orientation:landscape)_and_(max-height:600px)]:mt-2
              "
                        >
                            Swipe to explore
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}