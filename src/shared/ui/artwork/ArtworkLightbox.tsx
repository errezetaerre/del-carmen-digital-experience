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
            className="
        fixed
        inset-0
        z-[100]
        overflow-hidden
        bg-[#030303]
        text-white
      "
            role="dialog"
            aria-modal="true"
            aria-label={`Artwork viewer — ${artwork.title}`}
        >
            {/* =====================================================
          ATMOSPHERE
         ===================================================== */}

            <div
                aria-hidden
                className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
            >
                {/* Central warm aura */}

                <div
                    aria-hidden
                    className="
    artwork-lightbox-aura
    absolute
    left-1/2
    top-[42%]
    z-10
    h-[720px]
    w-[1050px]
    -translate-x-1/2
    -translate-y-1/2
    rounded-[50%]
    bg-[radial-gradient(ellipse_at_center,rgba(190,145,72,0.34)_0%,rgba(125,91,52,0.20)_28%,rgba(71,55,39,0.10)_48%,transparent_72%)]
    blur-[35px]
  "
                />

                {/* Smoke layer A */}

                <div
                    aria-hidden
                    className="
    artwork-lightbox-smoke-a
    absolute
    left-[-18%]
    top-[24%]
    z-10
    h-[170px]
    w-[95%]
    rotate-[-5deg]

    rounded-[50%]

    border-t
    border-white/[0.10]

    bg-[linear-gradient(100deg,transparent_0%,rgba(117,157,166,0.06)_18%,rgba(220,210,190,0.12)_38%,rgba(190,147,82,0.12)_55%,rgba(205,221,223,0.06)_72%,transparent_100%)]

    shadow-[0_-10px_35px_rgba(191,211,215,0.05),0_12px_45px_rgba(190,145,78,0.07)]

    blur-[18px]
  "
                />

                {/* Smoke layer B */}

                <div
                    aria-hidden
                    className="
    artwork-lightbox-smoke-b
    absolute
    bottom-[18%]
    right-[-20%]
    z-10
    h-[190px]
    w-[100%]
    rotate-[6deg]

    rounded-[50%]

    border-b
    border-white/[0.08]

    bg-[linear-gradient(80deg,transparent_0%,rgba(190,211,215,0.05)_20%,rgba(220,208,187,0.10)_38%,rgba(188,143,77,0.13)_56%,rgba(214,228,229,0.05)_76%,transparent_100%)]

    shadow-[0_10px_40px_rgba(191,211,215,0.04),0_-10px_45px_rgba(190,145,78,0.06)]

    blur-[20px]
  "
                />
                <div
                    aria-hidden
                    className="
    artwork-lightbox-thread
    absolute
    left-[8%]
    top-[58%]
    z-10
    h-px
    w-[84%]

    bg-gradient-to-r
    from-transparent
    via-white/20
    to-transparent

    shadow-[0_0_18px_rgba(215,198,170,0.20)]
  "
                />

                {/* Floating soft particles */}

                <span className="artwork-particle artwork-particle-1" />
                <span className="artwork-particle artwork-particle-2" />
                <span className="artwork-particle artwork-particle-3" />
                <span className="artwork-particle artwork-particle-4" />
                <span className="artwork-particle artwork-particle-5" />

                {/* Vignette */}

                <div
                    className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.35)_68%,rgba(0,0,0,0.82)_100%)]
          "
                />
            </div>

            {/* =====================================================
          COUNTER
         ===================================================== */}

            <div
                className="
          fixed
          left-5
          top-6
          z-[140]
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
          CLOSE
         ===================================================== */}

            <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                onPointerDown={(event) =>
                    event.stopPropagation()
                }
                aria-label="Close artwork viewer"
                className="
          fixed
          right-4
          top-4
          z-[150]
          flex
          h-11
          w-11
          items-center
          justify-center
          font-sans
          text-[32px]
          font-light
          leading-none
          text-white/75
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
          FIXED NAVIGATION

          IMPORTANT:
          These arrows are now fixed to the viewport.
          Description height can never move them.
         ===================================================== */}

            {total > 1 && (
                <>
                    <button
                        type="button"
                        onClick={goPrevious}
                        onPointerDown={(event) =>
                            event.stopPropagation()
                        }
                        aria-label="Previous artwork"
                        className="
              fixed
              left-3
              top-1/2
              z-[145]
              hidden
              h-14
              w-14
              -translate-y-1/2
              items-center
              justify-center
              font-display
              text-4xl
              font-light
              text-white/30
              transition-all
              duration-300

              hover:scale-110
              hover:text-brand-gold

              md:flex
              md:left-6

              lg:left-10
            "
                    >
                        ‹
                    </button>

                    <button
                        type="button"
                        onClick={goNext}
                        onPointerDown={(event) =>
                            event.stopPropagation()
                        }
                        aria-label="Next artwork"
                        className="
              fixed
              right-3
              top-1/2
              z-[145]
              hidden
              h-14
              w-14
              -translate-y-1/2
              items-center
              justify-center
              font-display
              text-4xl
              font-light
              text-white/30
              transition-all
              duration-300

              hover:scale-110
              hover:text-brand-gold

              md:flex
              md:right-6

              lg:right-10
            "
                    >
                        ›
                    </button>
                </>
            )}

            {/* =====================================================
          VIEWER
         ===================================================== */}

            <div
                className="
          relative
          z-20
          flex
          h-full
          w-full
          touch-none
          items-center
          justify-center
          overflow-hidden
          px-4
          py-4

          md:px-20
          md:py-8

          [@media(orientation:landscape)_and_(max-height:600px)]:px-16
          [@media(orientation:landscape)_and_(max-height:600px)]:py-3
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
            GLASS ARTWORK CARD
           =================================================== */}

                <div
                    className="
    relative
    flex
    h-[calc(100svh-32px)]
    w-full
    max-w-[1100px]
    flex-col
    overflow-hidden
    rounded-[26px]

    border
    border-white/[0.16]

    bg-[linear-gradient(145deg,rgba(255,255,255,0.075)_0%,rgba(255,255,255,0.025)_32%,rgba(8,8,8,0.32)_68%,rgba(178,132,65,0.045)_100%)]

    shadow-[0_45px_180px_rgba(0,0,0,0.78),0_0_80px_rgba(190,145,78,0.09)]

    backdrop-blur-[18px]

    md:h-[min(90vh,900px)]

    [@media(orientation:landscape)_and_(max-height:600px)]:h-[calc(100svh-24px)]
    [@media(orientation:landscape)_and_(max-height:600px)]:max-w-[900px]
  "
                >
                    {/* Glass highlight — top */}

                    {/* Moving glass reflection */}

                    <div
                        aria-hidden
                        className="
                            artwork-glass-reflection
                            pointer-events-none
                            absolute
                            -left-[35%]
                            -top-[20%]
                            z-20
                            h-[140%]
                            w-[35%]
                            rotate-[16deg]
                            bg-gradient-to-r
                            from-transparent
                            via-white/[0.065]
                            to-transparent
                            blur-[12px]
                        "
                    />

                    <div
                        aria-hidden
                        className="
              pointer-events-none
              absolute
              inset-x-[7%]
              top-0
              z-40
              h-px
              bg-gradient-to-r
              from-transparent
              via-white/55
              to-transparent
            "
                    />

                    {/* Glass highlight — bottom */}

                    <div
                        aria-hidden
                        className="
              pointer-events-none
              absolute
              inset-x-[15%]
              bottom-0
              z-40
              h-px
              bg-gradient-to-r
              from-transparent
              via-brand-gold/60
              to-transparent
            "
                    />

                    {/* Soft edge light */}

                    <div
                        aria-hidden
                        className="
              pointer-events-none
              absolute
              inset-0
              z-30
              rounded-[22px]
              shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035),inset_0_1px_18px_rgba(255,255,255,0.035)]
            "
                    />

                    {/* =================================================
    ARTWORK AREA
   ================================================= */}

                    <div
                        className="
    relative
    flex
    min-h-0
    flex-1
    items-center
    justify-center
    overflow-hidden

    px-5
    pb-3
    pt-5

    md:px-8
    md:pb-4
    md:pt-7

    [@media(orientation:landscape)_and_(max-height:600px)]:px-7
    [@media(orientation:landscape)_and_(max-height:600px)]:py-3
  "
                    >
                        {/* =================================================
      INNER GLASS ARTWORK FRAME

      This creates the margin between the image
      and its luminous border.
     ================================================= */}

                        <div
                            className="
      relative
      flex
      h-full
      max-h-full
      w-full
      items-center
      justify-center
      overflow-hidden
      rounded-[18px]

      border
      border-white/[0.10]

      bg-black/20

      p-[10px]

      shadow-[inset_0_0_25px_rgba(255,255,255,0.025),0_24px_80px_rgba(0,0,0,0.42)]

      md:p-[14px]
    "
                        >
                            {/* Inner glass glow */}

                            <div
                                aria-hidden
                                className="
        pointer-events-none
        absolute
        inset-0
        z-30
        rounded-[18px]

        bg-[linear-gradient(135deg,rgba(255,255,255,0.055)_0%,transparent_28%,transparent_72%,rgba(190,145,78,0.045)_100%)]
      "
                            />

                            {/* =================================================
        LUMINOUS FRAME

        These lines sit in the FRAME MARGIN,
        not over the artwork.
       ================================================= */}

                            <div
                                aria-hidden
                                className="
        pointer-events-none
        absolute
        inset-[5px]
        z-40
        rounded-[14px]
      "
                            >



                            </div>

                            {/* =================================================
        ZOOMABLE ARTWORK
       ================================================= */}

                            <div
                                ref={zoomLayerRef}
                                className="
        relative
        z-10
        flex
        h-full
        max-h-full
        w-full
        max-w-full
        origin-center
        items-center
        justify-center
        overflow-hidden
        rounded-[12px]
        will-change-transform
      "
                            >
                                <img
                                    key={artwork.id}
                                    src={primaryImage.src}
                                    alt={primaryImage.alt}
                                    draggable={false}
                                    className="
          relative
          z-10
          h-full
          max-h-full
          w-full
          max-w-full
          select-none
          object-contain
        "
                                />

                                {/* =================================================
          ARTWORK INTEGRATION MASK

          Softens the hard photographic rectangle and
          visually merges it with the surrounding glass.
         ================================================= */}

                                <div
                                    aria-hidden
                                    className="
          pointer-events-none
          absolute
          inset-0
          z-20

          shadow-[inset_0_0_55px_20px_rgba(0,0,0,0.50)]
        "
                                />

                                {/* Top integration */}

                                <div
                                    aria-hidden
                                    className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          z-20
          h-[12%]

          bg-gradient-to-b
          from-black/40
          to-transparent
        "
                                />

                                {/* Bottom integration */}

                                <div
                                    aria-hidden
                                    className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-20
          h-[15%]

          bg-gradient-to-t
          from-black/45
          to-transparent
        "
                                />

                                {/* Left integration */}

                                <div
                                    aria-hidden
                                    className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          top-0
          z-20
          w-[7%]

          bg-gradient-to-r
          from-black/30
          to-transparent
        "
                                />

                                {/* Right integration */}

                                <div
                                    aria-hidden
                                    className="
          pointer-events-none
          absolute
          bottom-0
          right-0
          top-0
          z-20
          w-[7%]

          bg-gradient-to-l
          from-black/30
          to-transparent
        "
                                />

                                {/* Glass reflection */}

                                <div
                                    aria-hidden
                                    className="
          artwork-glass-reflection
          pointer-events-none
          absolute
          -left-[30%]
          -top-[20%]
          z-30
          h-[140%]
          w-[28%]
          rotate-[14deg]

          bg-gradient-to-r
          from-transparent
          via-white/[0.055]
          to-transparent

          blur-[10px]
        "
                                />
                            </div>
                        </div>
                    </div>

                    {/* =================================================
              INFORMATION PANEL

              This section has a predictable height.

              Result:
              1 line description  = same artwork position
              2 line description  = same artwork position
              3 line description  = same artwork position
             ================================================= */}

                    <div
                        className="
              relative
              z-30
              h-[205px]
              w-full
              shrink-0
              border-t
border-white/[0.045]

bg-[linear-gradient(180deg,rgba(10,10,10,0.22)_0%,rgba(5,5,5,0.48)_100%)]
              px-5
              py-4
              text-center
              backdrop-blur-[18px]

              md:h-[220px]
              md:px-10
              md:py-5

              [@media(orientation:landscape)_and_(max-height:600px)]:h-[105px]
              [@media(orientation:landscape)_and_(max-height:600px)]:px-6
              [@media(orientation:landscape)_and_(max-height:600px)]:py-2
            "
                    >
                        {/* Year */}

                        <p
                            className="
                font-sans
                text-[10px]
                font-medium
                uppercase
                tracking-[0.30em]
                text-brand-gold/90

                md:text-xs

                [@media(orientation:landscape)_and_(max-height:600px)]:text-[9px]
              "
                        >
                            {artwork.year}
                        </p>

                        {/* Title */}

                        <h2
                            className="
                mt-1.5
                font-display
                text-2xl
                font-light
                leading-[1.05]
                tracking-[0.01em]

                md:text-3xl

                [@media(orientation:landscape)_and_(max-height:600px)]:mt-1
                [@media(orientation:landscape)_and_(max-height:600px)]:text-xl
              "
                        >
                            {artwork.title}
                        </h2>

                        {/* Metadata */}

                        <div
                            className="
                mt-2.5
                font-sans
                text-[9px]
                uppercase
                tracking-[0.18em]
                text-white/45

                md:text-[10px]

                [@media(orientation:landscape)_and_(max-height:600px)]:mt-1
                [@media(orientation:landscape)_and_(max-height:600px)]:text-[8px]
              "
                        >
                            <span>
                                {techniqueLabel}
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

                        {/* Decorative divider */}

                        <div
                            aria-hidden
                            className="
                mx-auto
                mt-3
                h-px
                w-16
                bg-gradient-to-r
                from-transparent
                via-brand-gold/65
                to-transparent

                [@media(orientation:landscape)_and_(max-height:600px)]:mt-1.5
              "
                        />

                        {/* Description — RESERVED AREA */}

                        <div
                            className="
                mx-auto
                mt-3
                h-[72px]
                max-w-xl
                overflow-hidden

                [@media(orientation:landscape)_and_(max-height:600px)]:hidden
              "
                        >
                            {artwork.description && (
                                <p
                                    className="
                    line-clamp-3
                    font-sans
                    text-sm
                    font-light
                    leading-6
                    text-white/45
                  "
                                >
                                    {artwork.description}
                                </p>
                            )}
                        </div>

                        {/* Mobile gesture hint */}

                        {/* Artwork details CTA */}

                        {/* Artwork navigation CTAs */}

                        <div
                            className="
    absolute
    bottom-6
    left-1/2
    flex
    -translate-x-1/2
    items-center
    gap-6
    whitespace-nowrap

    md:bottom-5

    [@media(orientation:landscape)_and_(max-height:600px)]:bottom-3
    [@media(orientation:landscape)_and_(max-height:600px)]:gap-4
  "
                        >
                            <Link
                                href={`/artworks/${artwork.slug}`}
                                onPointerDown={(event) =>
                                    event.stopPropagation()
                                }
                                className="
      font-sans
      text-[10px]
      font-medium
      uppercase
      tracking-[0.22em]
      text-brand-gold/80

      transition-all
      duration-300

      hover:text-brand-gold

      focus-visible:outline-none
      focus-visible:text-brand-gold

      [@media(orientation:landscape)_and_(max-height:600px)]:text-[9px]
    "
                            >
                                View artwork details
                                <span
                                    aria-hidden
                                    className="
        ml-2
        inline-block
        transition-transform
        duration-300
      "
                                >
                                    →
                                </span>
                            </Link>

                            <span
                                aria-hidden
                                className="
      h-3
      w-px
      bg-white/15
    "
                            />

                            <Link
                                href="/artworks"
                                onPointerDown={(event) =>
                                    event.stopPropagation()
                                }
                                className="
      font-sans
      text-[10px]
      font-medium
      uppercase
      tracking-[0.22em]
      text-white/45

      transition-colors
      duration-300

      hover:text-white/80

      focus-visible:outline-none
      focus-visible:text-white/80

      [@media(orientation:landscape)_and_(max-height:600px)]:text-[9px]
    "
                            >
                                View all works
                                <span
                                    aria-hidden
                                    className="
        ml-2
        inline-block
        transition-transform
        duration-300
      "
                                >
                                    →
                                </span>
                            </Link>
                        </div>

                        {total > 1 && (
                            <p
                                className="
                  absolute
                  bottom-1
                  left-1/2
                  -translate-x-1/2
                  whitespace-nowrap
                  font-sans
                  text-[8px]
                  uppercase
                  tracking-[0.24em]
                  text-white/20

                  md:hidden

                  [@media(orientation:landscape)_and_(max-height:600px)]:bottom-1
                "
                            >
                                Swipe to explore
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* =====================================================
          ATMOSPHERE ANIMATION
         ===================================================== */}

            <style>{`
            @keyframes lightThread {
  0% {
    transform:
      translate3d(-5%, 0, 0)
      scaleX(0.92);
    opacity: 0.2;
  }

  50% {
    transform:
      translate3d(5%, -16px, 0)
      scaleX(1.08);
    opacity: 0.65;
  }

  100% {
    transform:
      translate3d(-2%, 8px, 0)
      scaleX(0.98);
    opacity: 0.3;
  }
}

.artwork-lightbox-thread {
  animation:
    lightThread
    18s
    ease-in-out
    infinite
    alternate;
}
            @keyframes glassReflection {
  0% {
    transform:
      translate3d(-30%, 0, 0)
      rotate(16deg);
    opacity: 0;
  }

  20% {
    opacity: 0.6;
  }

  70% {
    opacity: 0.35;
  }

  100% {
    transform:
      translate3d(430%, 0, 0)
      rotate(16deg);
    opacity: 0;
  }
}

.artwork-glass-reflection {
  animation:
    glassReflection
    14s
    cubic-bezier(0.4, 0, 0.2, 1)
    infinite;
}
        @keyframes artworkAura {
          0% {
            transform:
              translate(-50%, -50%)
              scale(0.96);
            opacity: 0.6;
          }

          50% {
            transform:
              translate(-48%, -52%)
              scale(1.04);
            opacity: 0.9;
          }

          100% {
            transform:
              translate(-52%, -49%)
              scale(1);
            opacity: 0.7;
          }
        }

        @keyframes smokeA {
          0% {
            transform:
              translate3d(-4%, 0, 0)
              rotate(-8deg)
              scaleX(0.94);
          }

          50% {
            transform:
              translate3d(8%, -8%, 0)
              rotate(-4deg)
              scaleX(1.06);
          }

          100% {
            transform:
              translate3d(16%, 3%, 0)
              rotate(-10deg)
              scaleX(1);
          }
        }

        @keyframes smokeB {
          0% {
            transform:
              translate3d(6%, 2%, 0)
              rotate(7deg)
              scaleX(1);
          }

          50% {
            transform:
              translate3d(-7%, -8%, 0)
              rotate(3deg)
              scaleX(1.08);
          }

          100% {
            transform:
              translate3d(-15%, 2%, 0)
              rotate(9deg)
              scaleX(0.96);
          }
        }

        @keyframes particleFloat {
          0% {
            transform:
              translate3d(0, 0, 0)
              scale(0.8);
            opacity: 0;
          }

          25% {
            opacity: 0.45;
          }

          75% {
            opacity: 0.2;
          }

          100% {
            transform:
              translate3d(18px, -70px, 0)
              scale(1.2);
            opacity: 0;
          }
        }

        .artwork-lightbox-aura {
          animation:
            artworkAura
            16s
            ease-in-out
            infinite
            alternate;
        }

        .artwork-lightbox-smoke-a {
          animation:
            smokeA
            22s
            ease-in-out
            infinite
            alternate;
        }

        .artwork-lightbox-smoke-b {
          animation:
            smokeB
            27s
            ease-in-out
            infinite
            alternate;
        }

        .artwork-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 9999px;
          background:
            rgba(
              203,
              158,
              83,
              0.85
            );
          box-shadow:
            0 0 14px
            rgba(
              203,
              158,
              83,
              0.45
            );
          opacity: 0;
          animation:
            particleFloat
            12s
            ease-in-out
            infinite;
        }

        .artwork-particle-1 {
          left: 13%;
          top: 63%;
          animation-delay: 0s;
        }

        .artwork-particle-2 {
          left: 28%;
          top: 35%;
          animation-delay: 3s;
        }

        .artwork-particle-3 {
          right: 19%;
          top: 58%;
          animation-delay: 6s;
        }

        .artwork-particle-4 {
          right: 31%;
          top: 27%;
          animation-delay: 9s;
        }

        .artwork-particle-5 {
          left: 53%;
          top: 78%;
          animation-delay: 4.5s;
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {
          .artwork-lightbox-aura,
          .artwork-lightbox-smoke-a,
          .artwork-lightbox-smoke-b,
          .artwork-particle,
          .artwork-glass-reflection,
          lightThread {
            animation: none;
          }
        }
      `}</style>
        </div>
    );
}