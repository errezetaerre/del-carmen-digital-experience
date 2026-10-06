"use client";

import {
    useEffect,
    useRef,
    useState,
    type MouseEvent,
    type PointerEvent,
    type WheelEvent,
} from "react";
import gsap from "gsap";

const EDGE_RESISTANCE = 0.18;
const MOMENTUM_FACTOR = 0.24;
const MAX_MOMENTUM = 700;
const DRAG_THRESHOLD = 8;

export function useKineticCarousel(itemCount: number) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const positionRef = useRef(0);
    const minXRef = useRef(0);
    const draggingRef = useRef(false);
    const movedRef = useRef(false);
    const pointerStartRef = useRef(0);
    const positionStartRef = useRef(0);
    const lastPointerRef = useRef(0);
    const lastTimeRef = useRef(0);
    const velocityRef = useRef(0);
    const momentumRef = useRef<gsap.core.Tween | null>(null);
    const wheelTargetRef = useRef(0);
    const wheelTweenRef = useRef<gsap.core.Tween | null>(null);
    const [dragging, setDragging] = useState(false);
    const [canMoveLeft, setCanMoveLeft] = useState(false);
    const [canMoveRight, setCanMoveRight] = useState(false);

    function updateDirectionState(position: number) {
        const tolerance = 2;
        setCanMoveLeft(position < -tolerance);
        setCanMoveRight(position > minXRef.current + tolerance);
    }

    useEffect(() => {
        const viewport = viewportRef.current;
        const track = trackRef.current;
        if (!viewport || !track) return;

        const updateBounds = () => {
            const viewportWidth = viewport.getBoundingClientRect().width;
            minXRef.current = Math.min(0, viewportWidth - track.scrollWidth);
            const next = gsap.utils.clamp(
                minXRef.current,
                0,
                positionRef.current,
            );
            positionRef.current = next;
            wheelTargetRef.current = next;
            gsap.set(track, { x: next });
            updateDirectionState(next);
        };

        updateBounds();

        const observer = new ResizeObserver(updateBounds);
        observer.observe(viewport);
        observer.observe(track);

        return () => {
            observer.disconnect();
            momentumRef.current?.kill();
            wheelTweenRef.current?.kill();
        };
    }, [itemCount]);

    function stopMotion() {
        momentumRef.current?.kill();
        momentumRef.current = null;
        wheelTweenRef.current?.kill();
        wheelTweenRef.current = null;
    }

    function renderPosition(
        nextPosition: number,
        allowResistance = false,
    ) {
        const track = trackRef.current;
        if (!track) return;

        let next = nextPosition;

        if (allowResistance) {
            if (next > 0) {
                next *= EDGE_RESISTANCE;
            }

            if (next < minXRef.current) {
                const overflow = next - minXRef.current;
                next =
                    minXRef.current +
                    overflow * EDGE_RESISTANCE;
            }
        } else {
            next = gsap.utils.clamp(
                minXRef.current,
                0,
                next,
            );
        }

        positionRef.current = next;
        wheelTargetRef.current = next;
        gsap.set(track, { x: next });
        updateDirectionState(next);
    }

    function animateTo(
        destination: number,
        duration: number,
    ) {
        const track = trackRef.current;
        if (!track) return;

        momentumRef.current = gsap.to(track, {
            x: destination,
            duration,
            ease: "power3.out",
            onUpdate() {
                const current =
                    Number(
                        gsap.getProperty(track, "x"),
                    ) || destination;

                positionRef.current = current;
                updateDirectionState(current);
            },
            onComplete() {
                positionRef.current = destination;
                wheelTargetRef.current = destination;
                updateDirectionState(destination);
                momentumRef.current = null;
            },
        });
    }

    function settle() {
        animateTo(
            gsap.utils.clamp(
                minXRef.current,
                0,
                positionRef.current,
            ),
            0.55,
        );
    }

    function releaseWithMomentum() {
        const projectedVelocity = gsap.utils.clamp(
            -MAX_MOMENTUM,
            MAX_MOMENTUM,
            velocityRef.current * MOMENTUM_FACTOR,
        );

        const destination = gsap.utils.clamp(
            minXRef.current,
            0,
            positionRef.current + projectedVelocity,
        );

        const distance = Math.abs(
            destination - positionRef.current,
        );

        if (distance < 2) {
            settle();
            return;
        }

        animateTo(
            destination,
            gsap.utils.clamp(
                0.45,
                1.15,
                distance / 850 + 0.45,
            ),
        );
    }

    function move(direction: -1 | 1) {
        const viewport = viewportRef.current;

        if (!viewport || !trackRef.current) {
            return;
        }

        stopMotion();

        const distance =
            viewport.getBoundingClientRect().width *
            0.72;

        const destination = gsap.utils.clamp(
            minXRef.current,
            0,
            positionRef.current -
                distance * direction,
        );

        animateTo(destination, 0.85);
    }

    function handlePointerDown(
        event: PointerEvent<HTMLDivElement>,
    ) {
        if (
            event.pointerType === "mouse" &&
            event.button !== 0
        ) {
            return;
        }

        stopMotion();

        /*
         * Every new pointer sequence starts clean.
         * This is critical: a drag from a previous interaction must
         * never suppress a later, genuine thumbnail click.
         */
        movedRef.current = false;
        draggingRef.current = true;
        setDragging(true);

        pointerStartRef.current = event.clientX;
        positionStartRef.current =
            positionRef.current;
        lastPointerRef.current = event.clientX;
        lastTimeRef.current = performance.now();
        velocityRef.current = 0;

    }

    function handlePointerMove(
        event: PointerEvent<HTMLDivElement>,
    ) {
        if (!draggingRef.current) {
            return;
        }

        const delta =
            event.clientX - pointerStartRef.current;

        if (
            Math.abs(delta) > DRAG_THRESHOLD &&
            !movedRef.current
        ) {
            movedRef.current = true;

            /*
             * Do not capture the pointer on pointerdown.
             * Capturing immediately retargets a normal click away from
             * child links/buttons and prevents thumbnail activation.
             *
             * Capture only after the gesture has become a real drag.
             */
            try {
                event.currentTarget.setPointerCapture(
                    event.pointerId,
                );
            } catch {
                // Pointer capture is optional.
            }
        }

        renderPosition(
            positionStartRef.current + delta,
            true,
        );

        const now = performance.now();

        const elapsed = Math.max(
            now - lastTimeRef.current,
            1,
        );

        const pointerDelta =
            event.clientX -
            lastPointerRef.current;

        const instantaneousVelocity =
            (pointerDelta / elapsed) * 1000;

        velocityRef.current =
            velocityRef.current * 0.72 +
            instantaneousVelocity * 0.28;

        lastPointerRef.current = event.clientX;
        lastTimeRef.current = now;
    }

    function handlePointerUp(
        event: PointerEvent<HTMLDivElement>,
    ) {
        if (!draggingRef.current) {
            return;
        }

        draggingRef.current = false;
        setDragging(false);

        try {
            if (
                event.currentTarget.hasPointerCapture(
                    event.pointerId,
                )
            ) {
                event.currentTarget.releasePointerCapture(
                    event.pointerId,
                );
            }
        } catch {
            // Ignore pointer-capture cleanup failures.
        }

        releaseWithMomentum();

        /*
         * Do NOT leave movedRef armed indefinitely.
         *
         * Browsers normally dispatch the click belonging to this same
         * pointer sequence immediately after pointerup. We keep the drag
         * flag alive only through that event turn, then clear it.
         *
         * Result:
         * - drag -> immediate synthetic click is suppressed;
         * - next genuine click -> always passes;
         * - trackpad wheel -> never arms click suppression.
         */
        if (movedRef.current) {
            window.setTimeout(() => {
                movedRef.current = false;
            }, 0);
        }
    }

    function handleWheel(
        event: WheelEvent<HTMLDivElement>,
    ) {
        if (minXRef.current === 0) {
            return;
        }

        const horizontalIntent =
            Math.abs(event.deltaX) >
                Math.abs(event.deltaY) * 1.25 ||
            event.shiftKey;

        if (!horizontalIntent) {
            return;
        }

        event.preventDefault();

        momentumRef.current?.kill();
        momentumRef.current = null;

        wheelTweenRef.current?.kill();

        const track = trackRef.current;
        if (!track) return;

        const delta = event.shiftKey
            ? event.deltaY
            : event.deltaX;

        wheelTargetRef.current =
            gsap.utils.clamp(
                minXRef.current,
                0,
                wheelTargetRef.current -
                    delta * 0.72,
            );

        wheelTweenRef.current = gsap.to(
            track,
            {
                x: wheelTargetRef.current,
                duration: 0.65,
                ease: "power3.out",
                overwrite: true,
                onUpdate() {
                    const current =
                        Number(
                            gsap.getProperty(
                                track,
                                "x",
                            ),
                        ) || 0;

                    positionRef.current =
                        current;

                    updateDirectionState(
                        current,
                    );
                },
                onComplete() {
                    positionRef.current =
                        wheelTargetRef.current;

                    updateDirectionState(
                        wheelTargetRef.current,
                    );

                    wheelTweenRef.current =
                        null;
                },
            },
        );
    }

    function handleClickCapture(
        event: MouseEvent<HTMLDivElement>,
    ) {
        /*
         * Suppress only the click generated by an actual pointer drag.
         * A plain click starts with pointerdown -> movedRef=false and
         * therefore reaches the thumbnail Link/button normally.
         */
        if (!movedRef.current) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        movedRef.current = false;
    }

    return {
        viewportRef,
        trackRef,
        dragging,
        canMoveLeft,
        canMoveRight,
        move,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handleWheel,
        handleClickCapture,
    };
}
