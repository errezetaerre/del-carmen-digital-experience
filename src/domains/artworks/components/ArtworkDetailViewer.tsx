"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
    useEffect,
    useRef,
    useState,
    type PointerEvent,
} from "react";

import type {
    Artwork,
} from "@/domains/artworks";

interface ArtworkDetailViewerProps {
    artwork: Artwork;

    previousArtwork?: Artwork;
    nextArtwork?: Artwork;

    activeCategory?: string;
}

const SWIPE_THRESHOLD = 70;
const AXIS_LOCK_RATIO = 1.25;

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.5;

const PINCH_EPSILON = 0.001;

interface PanPosition {
    x: number;
    y: number;
}

export default function ArtworkDetailViewer({
    artwork,
    previousArtwork,
    nextArtwork,
    activeCategory,
}: ArtworkDetailViewerProps) {
    const router = useRouter();

    /* ============================================================
       ARTWORK SWIPE
       ============================================================ */

    const startX = useRef(0);
    const startY = useRef(0);

    const activePointerId =
        useRef<number | null>(null);

    /* ============================================================
       SWIPE HINT
       ============================================================ */

    const [
        showSwipeHint,
        setShowSwipeHint,
    ] = useState(false);

    /* ============================================================
       ZOOM VIEWER
       ============================================================ */

    const [
        isZoomOpen,
        setIsZoomOpen,
    ] = useState(false);

    const [
        zoom,
        setZoom,
    ] = useState(MIN_ZOOM);

    const [
        pan,
        setPan,
    ] = useState<PanPosition>({
        x: 0,
        y: 0,
    });

    const zoomPointerId =
        useRef<number | null>(null);

    const panStartPointer =
        useRef<PanPosition>({
            x: 0,
            y: 0,
        });

    const panStartPosition =
        useRef<PanPosition>({
            x: 0,
            y: 0,
        });

    const zoomPointers = useRef<
        Map<number, PanPosition>
    >(new Map());

    const pinchStartDistance =
        useRef(0);

    const pinchStartZoom =
        useRef(MIN_ZOOM);

    const isPinching =
        useRef(false);
    const zoomCanvasRef =
        useRef<HTMLDivElement | null>(null);

    const zoomImageRef =
        useRef<HTMLImageElement | null>(null);
    /* ============================================================
       SWIPE HINT
       ============================================================ */

    useEffect(() => {
        const isTouchDevice =
            window.matchMedia(
                "(pointer: coarse)",
            ).matches;

        if (!isTouchDevice) {
            return;
        }

        setShowSwipeHint(true);

        const timer =
            window.setTimeout(() => {
                setShowSwipeHint(false);
            }, 3000);

        return () => {
            window.clearTimeout(timer);
        };
    }, [artwork.id]);

    /* ============================================================
       RESET ZOOM WHEN ARTWORK CHANGES
       ============================================================ */

    useEffect(() => {
        setIsZoomOpen(false);
        setZoom(MIN_ZOOM);

        setPan({
            x: 0,
            y: 0,
        });
        zoomPointers.current.clear();
        zoomPointerId.current = null;
        isPinching.current = false;
    }, [artwork.id]);


    /* ============================================================
       VIEWER SIDE EFFECTS
       ============================================================ */

    useEffect(() => {
        if (!isZoomOpen) {
            return;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        const handleKeyDown = (
            event: KeyboardEvent,
        ) => {
            if (event.key === "Escape") {
                setIsZoomOpen(false);

                setZoom(MIN_ZOOM);

                setPan({
                    x: 0,
                    y: 0,
                });
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [isZoomOpen]);

    useEffect(() => {
        if (!isZoomOpen) {
            return;
        }

        const handleResize = () => {
            setPan((currentPan) =>
                clampPan(
                    currentPan,
                    zoom,
                ),
            );
        };

        window.addEventListener(
            "resize",
            handleResize,
        );

        return () => {
            window.removeEventListener(
                "resize",
                handleResize,
            );
        };
    }, [isZoomOpen, zoom]);

    /* ============================================================
       ROUTING
       ============================================================ */

    const createArtworkHref = (
        targetArtwork: Artwork,
    ) => {
        const categoryQuery =
            activeCategory
                ? `?category=${encodeURIComponent(
                    activeCategory,
                )}`
                : "";

        return `/artworks/${targetArtwork.slug}${categoryQuery}`;
    };

    /* ============================================================
       ARTWORK SWIPE
       ============================================================ */

    const handlePointerDown = (
        event: PointerEvent<HTMLDivElement>,
    ) => {
        /*
         * Mouse dragging is intentionally ignored.
         * Previous / Next remains desktop navigation.
         */

        if (event.pointerType === "mouse") {
            return;
        }

        setShowSwipeHint(false);

        activePointerId.current =
            event.pointerId;

        startX.current =
            event.clientX;

        startY.current =
            event.clientY;
    };

    const handlePointerUp = (
        event: PointerEvent<HTMLDivElement>,
    ) => {
        if (
            activePointerId.current !==
            event.pointerId
        ) {
            return;
        }

        activePointerId.current = null;

        const deltaX =
            event.clientX -
            startX.current;

        const deltaY =
            event.clientY -
            startY.current;

        const horizontalDistance =
            Math.abs(deltaX);

        const verticalDistance =
            Math.abs(deltaY);

        if (
            horizontalDistance <
            SWIPE_THRESHOLD
        ) {
            return;
        }

        /*
         * Protect normal vertical scrolling.
         */

        if (
            horizontalDistance <
            verticalDistance *
            AXIS_LOCK_RATIO
        ) {
            return;
        }

        /*
         * Swipe left → next.
         */

        if (
            deltaX < 0 &&
            nextArtwork
        ) {
            router.push(
                createArtworkHref(
                    nextArtwork,
                ),
            );

            return;
        }

        /*
         * Swipe right → previous.
         */

        if (
            deltaX > 0 &&
            previousArtwork
        ) {
            router.push(
                createArtworkHref(
                    previousArtwork,
                ),
            );
        }
    };

    const handlePointerCancel = () => {
        activePointerId.current = null;
    };

    /* ============================================================
       OPEN / CLOSE ZOOM
       ============================================================ */

    const openZoomViewer = (
        initialZoom = MIN_ZOOM,
    ) => {
        setShowSwipeHint(false);

        setZoom(initialZoom);

        setPan({
            x: 0,
            y: 0,
        });

        setIsZoomOpen(true);
    };

    const closeZoomViewer = () => {
        setIsZoomOpen(false);

        setZoom(MIN_ZOOM);

        setPan({
            x: 0,
            y: 0,
        });

        zoomPointerId.current = null;
        zoomPointers.current.clear();

        isPinching.current = false;

        pinchStartDistance.current = 0;
        pinchStartZoom.current = MIN_ZOOM;
    };

    /* ============================================================
       ZOOM
       ============================================================ */

    const updateZoom = (
        nextZoom: number,
    ) => {
        const clampedZoom =
            Math.min(
                MAX_ZOOM,
                Math.max(
                    MIN_ZOOM,
                    nextZoom,
                ),
            );

        setZoom(clampedZoom);

        setPan((currentPan) =>
            clampPan(
                currentPan,
                clampedZoom,
            ),
        );
    };

    const zoomIn = () => {
        updateZoom(
            zoom + ZOOM_STEP,
        );
    };

    const zoomOut = () => {
        updateZoom(
            zoom - ZOOM_STEP,
        );
    };

    const getPointerDistance = (
        first: PanPosition,
        second: PanPosition,
    ) => {
        return Math.hypot(
            second.x - first.x,
            second.y - first.y,
        );
    };

    const getPanBounds = (
        targetZoom: number,
    ) => {
        const canvas =
            zoomCanvasRef.current;

        const image =
            zoomImageRef.current;

        if (!canvas || !image) {
            return {
                maxX: 0,
                maxY: 0,
            };
        }

        const canvasRect =
            canvas.getBoundingClientRect();

        /*
         * offsetWidth / offsetHeight give us
         * the rendered image dimensions before
         * the CSS transform is applied.
         */
        const imageWidth =
            image.offsetWidth;

        const imageHeight =
            image.offsetHeight;

        const scaledWidth =
            imageWidth * targetZoom;

        const scaledHeight =
            imageHeight * targetZoom;

        /*
         * If the enlarged artwork is still
         * smaller than the viewport on one axis,
         * that axis remains centered.
         *
         * Otherwise the available movement is
         * half of the overflow.
         */
        const maxX =
            Math.max(
                0,
                (scaledWidth -
                    canvasRect.width) /
                2,
            );

        const maxY =
            Math.max(
                0,
                (scaledHeight -
                    canvasRect.height) /
                2,
            );

        return {
            maxX,
            maxY,
        };
    };

    const clampPan = (
        position: PanPosition,
        targetZoom: number,
    ): PanPosition => {
        if (targetZoom <= MIN_ZOOM) {
            return {
                x: 0,
                y: 0,
            };
        }

        const {
            maxX,
            maxY,
        } = getPanBounds(targetZoom);

        return {
            x: Math.min(
                maxX,
                Math.max(
                    -maxX,
                    position.x,
                ),
            ),

            y: Math.min(
                maxY,
                Math.max(
                    -maxY,
                    position.y,
                ),
            ),
        };
    };

    /* ============================================================
       PAN
       ============================================================ */

    const handleZoomPointerDown = (
        event: PointerEvent<HTMLDivElement>,
    ) => {
        event.currentTarget.setPointerCapture(
            event.pointerId,
        );

        zoomPointers.current.set(
            event.pointerId,
            {
                x: event.clientX,
                y: event.clientY,
            },
        );

        /*
         * Two pointers → pinch begins.
         */
        if (zoomPointers.current.size === 2) {
            const pointers =
                Array.from(
                    zoomPointers.current.values(),
                );

            pinchStartDistance.current =
                Math.max(
                    getPointerDistance(
                        pointers[0],
                        pointers[1],
                    ),
                    PINCH_EPSILON,
                );

            pinchStartZoom.current =
                zoom;

            isPinching.current = true;

            zoomPointerId.current = null;

            return;
        }

        /*
         * One pointer → pan, but only
         * while the artwork is enlarged.
         */
        if (zoom > MIN_ZOOM) {
            zoomPointerId.current =
                event.pointerId;

            panStartPointer.current = {
                x: event.clientX,
                y: event.clientY,
            };

            panStartPosition.current = {
                x: pan.x,
                y: pan.y,
            };
        }
    };

    const handleZoomPointerMove = (
        event: PointerEvent<HTMLDivElement>,
    ) => {
        if (
            !zoomPointers.current.has(
                event.pointerId,
            )
        ) {
            return;
        }

        zoomPointers.current.set(
            event.pointerId,
            {
                x: event.clientX,
                y: event.clientY,
            },
        );

        /*
         * PINCH
         */
        if (
            isPinching.current &&
            zoomPointers.current.size >= 2
        ) {
            const pointers =
                Array.from(
                    zoomPointers.current.values(),
                );

            const currentDistance =
                Math.max(
                    getPointerDistance(
                        pointers[0],
                        pointers[1],
                    ),
                    PINCH_EPSILON,
                );

            const scaleRatio =
                currentDistance /
                pinchStartDistance.current;

            const nextZoom =
                pinchStartZoom.current *
                scaleRatio;

            const clampedZoom =
                Math.min(
                    MAX_ZOOM,
                    Math.max(
                        MIN_ZOOM,
                        nextZoom,
                    ),
                );

            setZoom(clampedZoom);

            setPan((currentPan) =>
                clampPan(
                    currentPan,
                    clampedZoom,
                ),
            );
            return;
        }

        /*
         * PAN
         */
        if (
            zoomPointerId.current !==
            event.pointerId
        ) {
            return;
        }

        const deltaX =
            event.clientX -
            panStartPointer.current.x;

        const deltaY =
            event.clientY -
            panStartPointer.current.y;

        const nextPan = {
            x:
                panStartPosition.current.x +
                deltaX,

            y:
                panStartPosition.current.y +
                deltaY,
        };

        setPan(
            clampPan(
                nextPan,
                zoom,
            ),
        );
    };

    const handleZoomPointerUp = (
        event: PointerEvent<HTMLDivElement>,
    ) => {
        zoomPointers.current.delete(
            event.pointerId,
        );

        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId,
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId,
            );
        }

        /*
         * Pinch has ended.
         */
        if (isPinching.current) {
            if (
                zoomPointers.current.size < 2
            ) {
                isPinching.current = false;

                /*
                 * If one finger remains after
                 * pinch, prepare it for pan.
                 */
                const remaining =
                    Array.from(
                        zoomPointers.current.entries(),
                    )[0];

                if (
                    remaining &&
                    zoom > MIN_ZOOM
                ) {
                    const [
                        pointerId,
                        position,
                    ] = remaining;

                    zoomPointerId.current =
                        pointerId;

                    panStartPointer.current = {
                        x: position.x,
                        y: position.y,
                    };

                    panStartPosition.current = {
                        x: pan.x,
                        y: pan.y,
                    };
                } else {
                    zoomPointerId.current =
                        null;
                }
            }

            return;
        }

        if (
            zoomPointerId.current ===
            event.pointerId
        ) {
            zoomPointerId.current = null;
        }
    };

    const handleZoomPointerCancel = (
        event: PointerEvent<HTMLDivElement>,
    ) => {
        zoomPointers.current.delete(
            event.pointerId,
        );

        if (
            zoomPointerId.current ===
            event.pointerId
        ) {
            zoomPointerId.current = null;
        }

        if (
            zoomPointers.current.size < 2
        ) {
            isPinching.current = false;
        }
    };

    /* ============================================================
       DOUBLE CLICK / DOUBLE TAP
       ============================================================ */

    const handleArtworkDoubleClick = () => {
        openZoomViewer(2);
    };

    const handleZoomDoubleClick = () => {
        if (zoom > MIN_ZOOM) {
            updateZoom(MIN_ZOOM);

            return;
        }

        updateZoom(2);
    };

    /* ============================================================
       RENDER
       ============================================================ */

    return (
        <>
            {/* ====================================================
                STANDARD ARTWORK VIEW
               ==================================================== */}

            <div
                className="
                    relative
                    flex
                    min-h-[42svh]
                    items-center
                    justify-center

                    sm:min-h-[48svh]

                    md:min-h-[52svh]

                    lg:min-h-[70vh]

                    [@media(orientation:landscape)_and_(max-height:600px)]:!min-h-[72svh]
                "
                onPointerDown={
                    handlePointerDown
                }
                onPointerUp={
                    handlePointerUp
                }
                onPointerCancel={
                    handlePointerCancel
                }
                style={{
                    touchAction: "pan-y",
                }}
            >
                {/* Ambient glow */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-1/2
                        h-[70%]
                        w-[70%]
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-brand-gold/[0.06]
                        blur-[90px]
                    "
                />

                {/* Artwork */}

                <Image
                    src={
                        artwork.images.primary.src
                    }
                    alt={
                        artwork.images.primary.alt
                    }
                    width={
                        artwork.images.primary.width ??
                        1200
                    }
                    height={
                        artwork.images.primary.height ??
                        1200
                    }
                    priority
                    draggable={false}
                    onDoubleClick={
                        handleArtworkDoubleClick
                    }
                    className="
                        relative
                        z-10
                        h-auto
                        max-h-[58svh]
                        w-auto
                        max-w-full
                        select-none
                        object-contain
                        shadow-[0_35px_100px_rgba(0,0,0,0.45)]

                        md:max-h-[64svh]

                        lg:max-h-[75vh]

                        [@media(orientation:landscape)_and_(max-height:600px)]:!max-h-[78svh]
                        [@media(orientation:landscape)_and_(max-height:600px)]:!max-w-[94vw]
                    "
                />

                {/* Expand */}

                <button
                    type="button"
                    aria-label="Expand artwork"
                    onClick={() =>
                        openZoomViewer(
                            MIN_ZOOM,
                        )
                    }
                    className="
                        absolute
                        right-2
                        top-2
                        z-30
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/10
                        bg-black/25
                        text-white/55
                        backdrop-blur-md
                        transition-all
                        duration-300

                        hover:border-brand-gold/35
                        hover:bg-black/40
                        hover:text-brand-gold

                        focus-visible:outline-none
                        focus-visible:ring-1
                        focus-visible:ring-brand-gold/60

                        md:right-4
                        md:top-4
                    "
                >
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="
                            h-[15px]
                            w-[15px]
                        "
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M8 3H3v5" />
                        <path d="M16 3h5v5" />
                        <path d="M8 21H3v-5" />
                        <path d="M16 21h5v-5" />
                    </svg>
                </button>

                {/* Swipe hint */}

                {showSwipeHint && (
                    <div
                        aria-hidden
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            z-20
                            flex
                            items-center
                            justify-center

                            lg:hidden
                        "
                    >
                        <div
                            className="
                                artwork-swipe-hint
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

                {/* Scroll affordance */}

                <div
                    aria-hidden
                    className="
                        pointer-events-none
                        absolute
                        bottom-1
                        left-1/2
                        z-20
                        -translate-x-1/2

                        lg:hidden
                    "
                >
                    <span
                        className="
                            artwork-scroll-cue
                            block
                            font-display
                            text-[22px]
                            font-light
                            leading-none
                            text-brand-gold/70

                            motion-reduce:animate-none
                        "
                    >
                        ↓
                    </span>
                </div>
            </div>

            {/* ====================================================
                FULLSCREEN ZOOM VIEWER
               ==================================================== */}

            {isZoomOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Zoomed view of ${artwork.title}`}
                    className="
                        fixed
                        inset-0
                        z-[100]
                        overflow-hidden
                        bg-[#080807]/[0.97]
                        text-white
                        backdrop-blur-xl
                    "
                >
                    {/* Atmospheric field */}

                    <div
                        aria-hidden
                        className="
                            pointer-events-none
                            absolute
                            left-1/2
                            top-1/2
                            h-[60vw]
                            max-h-[800px]
                            w-[60vw]
                            max-w-[800px]
                            -translate-x-1/2
                            -translate-y-1/2
                            rounded-full
                            bg-brand-gold/[0.045]
                            blur-[120px]
                        "
                    />

                    {/* Header */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            left-0
                            right-0
                            top-0
                            z-40
                            flex
                            items-center
                            justify-between
                            px-5
                            py-5

                            md:px-8
                            md:py-7
                        "
                    >
                        <div
                            className="
                                min-w-0
                                pr-8
                            "
                        >
                            <p
                                className="
                                    truncate
                                    font-display
                                    text-sm
                                    font-light
                                    tracking-[0.02em]
                                    text-white/45

                                    md:text-base
                                "
                            >
                                {artwork.title}
                            </p>
                        </div>

                        <button
                            type="button"
                            aria-label="Close zoom viewer"
                            onClick={
                                closeZoomViewer
                            }
                            className="
                                pointer-events-auto
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-white/10
                                bg-black/20
                                font-sans
                                text-lg
                                font-light
                                text-white/55
                                backdrop-blur-md
                                transition-all
                                duration-300

                                hover:border-brand-gold/35
                                hover:text-brand-gold

                                focus-visible:outline-none
                                focus-visible:ring-1
                                focus-visible:ring-brand-gold/60
                            "
                        >
                            ×
                        </button>
                    </div>

                    {/* Interactive canvas */}

                    <div
                        ref={zoomCanvasRef}
                        className="
                            absolute
                            inset-0
                            flex
                            items-center
                            justify-center
                            overflow-hidden
                        "
                        onPointerDown={
                            handleZoomPointerDown
                        }
                        onPointerMove={
                            handleZoomPointerMove
                        }
                        onPointerUp={
                            handleZoomPointerUp
                        }
                        onPointerCancel={
                            handleZoomPointerCancel
                        }
                        onDoubleClick={
                            handleZoomDoubleClick
                        }
                        style={{
                            touchAction: "none",

                            cursor:
                                zoom > MIN_ZOOM
                                    ? "grab"
                                    : "zoom-in",
                        }}
                    >
                        <Image
                            ref={zoomImageRef}
                            src={
                                artwork.images
                                    .primary.src
                            }
                            alt={
                                artwork.images
                                    .primary.alt
                            }
                            width={
                                artwork.images
                                    .primary
                                    .width ??
                                1600
                            }
                            height={
                                artwork.images
                                    .primary
                                    .height ??
                                1600
                            }
                            priority
                            draggable={false}
                            className="
                                pointer-events-none
                                max-h-[82svh]
                                max-w-[90vw]
                                select-none
                                object-contain
                                shadow-[0_40px_140px_rgba(0,0,0,0.65)]

                                md:max-h-[86vh]
                                md:max-w-[88vw]
                            "
                            style={{
                                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                                transformOrigin:
                                    "center center",

                                transition:
                                    zoomPointerId.current ===
                                        null
                                        ? "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)"
                                        : "none",
                            }}
                        />
                    </div>

                    {/* Zoom controls */}

                    <div
                        className="
                            absolute
                            bottom-6
                            left-1/2
                            z-40
                            -translate-x-1/2

                            md:bottom-8
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-1
                                rounded-full
                                border
                                border-white/[0.09]
                                bg-black/35
                                p-1.5
                                shadow-[0_15px_50px_rgba(0,0,0,0.25)]
                                backdrop-blur-xl
                            "
                        >
                            <button
                                type="button"
                                aria-label="Zoom out"
                                disabled={
                                    zoom <=
                                    MIN_ZOOM
                                }
                                onClick={
                                    zoomOut
                                }
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    font-sans
                                    text-lg
                                    font-light
                                    text-white/60
                                    transition-colors
                                    duration-200

                                    hover:text-brand-gold

                                    disabled:cursor-default
                                    disabled:text-white/15

                                    focus-visible:outline-none
                                    focus-visible:ring-1
                                    focus-visible:ring-brand-gold/60
                                "
                            >
                                −
                            </button>

                            <button
                                type="button"
                                aria-label="Reset zoom"
                                onClick={() =>
                                    updateZoom(
                                        MIN_ZOOM,
                                    )
                                }
                                className="
                                    min-w-[62px]
                                    rounded-full
                                    px-3
                                    py-2
                                    font-sans
                                    text-[9px]
                                    font-medium
                                    uppercase
                                    tracking-[0.2em]
                                    text-white/45
                                    transition-colors
                                    duration-200

                                    hover:text-white/80

                                    focus-visible:outline-none
                                    focus-visible:ring-1
                                    focus-visible:ring-brand-gold/60
                                "
                            >
                                {zoom.toFixed(1)}×
                            </button>

                            <button
                                type="button"
                                aria-label="Zoom in"
                                disabled={
                                    zoom >=
                                    MAX_ZOOM
                                }
                                onClick={
                                    zoomIn
                                }
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    font-sans
                                    text-lg
                                    font-light
                                    text-white/60
                                    transition-colors
                                    duration-200

                                    hover:text-brand-gold

                                    disabled:cursor-default
                                    disabled:text-white/15

                                    focus-visible:outline-none
                                    focus-visible:ring-1
                                    focus-visible:ring-brand-gold/60
                                "
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Interaction hint */}

                    {zoom > MIN_ZOOM && (
                        <div
                            aria-hidden
                            className="
                                pointer-events-none
                                absolute
                                bottom-20
                                left-1/2
                                z-30
                                -translate-x-1/2

                                md:bottom-24
                            "
                        >
                            <p
                                className="
                                    whitespace-nowrap
                                    font-sans
                                    text-[8px]
                                    uppercase
                                    tracking-[0.28em]
                                    text-white/25
                                "
                            >
                                Drag to explore
                            </p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}