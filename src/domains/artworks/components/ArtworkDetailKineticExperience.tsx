"use client";

import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type PointerEvent,
    type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { LinkButton } from "@/shared/ui/button";

interface ArtworkDetailKineticExperienceProps {
    previousScene?: ReactNode;
    currentScene: ReactNode;
    nextScene?: ReactNode;
    previousHref?: string;
    nextHref?: string;
    backHref: string;
    backLabel: string;
}

type Direction = -1 | 1;

const AXIS_LOCK_RATIO = 1.05;
const EDGE_RESISTANCE = 0.18;
const MOMENTUM_FACTOR = 0.24;
const SNAP_DISTANCE_RATIO = 0.12;
const SNAP_VELOCITY = 420;
const WHEEL_TRIGGER = 72;
const WHEEL_PREVIEW_MULTIPLIER = 1;
const WHEEL_GESTURE_END_MS = 140;

/*
 * Trackpad momentum can survive a client-side route handoff. Keep this
 * lock at module scope so the inertial tail of one physical gesture cannot
 * trigger a second artwork after the next route mounts. The lock releases
 * only after the wheel stream has gone quiet.
 */
let wheelNavigationMomentumLocked = false;
let wheelNavigationUnlockTimer: number | null = null;
const ONBOARDING_REPEAT_MS = 5000;
const ONBOARDING_VISIBLE_MS = 2600;
/*
 * Module-scoped on purpose: survives client-side artwork navigation,
 * but resets on a real page refresh / new document load.
 */
let artworkOnboardingLearnedInCurrentDocument = false;

type OnboardingPhase = "reminding" | "sealing" | "learned";

export default function ArtworkDetailKineticExperience({
    previousScene,
    currentScene,
    nextScene,
    previousHref,
    nextHref,
    backHref,
    backLabel,
}: ArtworkDetailKineticExperienceProps) {
    const router = useRouter();

    const viewportRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const baseXRef = useRef(0);
    const positionRef = useRef(0);
    const viewportWidthRef = useRef(1);

    const draggingRef = useRef(false);
    const horizontalDragRef = useRef(false);
    const pointerIdRef = useRef<number | null>(null);
    const startXRef = useRef(0);
    const startYRef = useRef(0);
    const lastXRef = useRef(0);
    const lastTimeRef = useRef(0);
    const velocityRef = useRef(0);

    const wheelDistanceRef = useRef(0);
    const wheelVelocityRef = useRef(0);
    const wheelLastEventTimeRef = useRef(0);
    const wheelResetRef = useRef<number | null>(null);
    const navigatingRef = useRef(false);
    const inputModeRef = useRef<"idle" | "wheel" | "pointer">("idle");

    const onboardingBubbleRef = useRef<HTMLDivElement>(null);
    const onboardingTargetRef = useRef<HTMLDivElement>(null);
    const onboardingIntervalRef = useRef<number | null>(null);
    const onboardingLearnedRef = useRef(false);
    const onboardingSealUntilRef = useRef(0);
    const navigationRouteTimerRef = useRef<number | null>(null);
    const [onboardingPhase, setOnboardingPhase] =
        useState<OnboardingPhase>("reminding");

    const hasPrevious = Boolean(previousScene && previousHref);
    const hasNext = Boolean(nextScene && nextHref);

    const clearOnboardingTimers = useCallback(() => {
        if (onboardingIntervalRef.current !== null) {
            window.clearInterval(onboardingIntervalRef.current);
            onboardingIntervalRef.current = null;
        }
    }, []);

    const positionOnboardingBubble = useCallback(() => {
        const viewport = viewportRef.current;
        const bubble = onboardingBubbleRef.current;
        if (!viewport || !bubble) return;

        const viewportRect = viewport.getBoundingClientRect();
        const anchors = Array.from(
            viewport.querySelectorAll<HTMLElement>(
                "[data-artwork-swipe-hint-anchor]",
            ),
        );

        const viewportCenterX = viewportRect.left + viewportRect.width / 2;
        const activeAnchor = anchors
            .map((anchor) => ({ anchor, rect: anchor.getBoundingClientRect() }))
            .sort(
                (a, b) =>
                    Math.abs(a.rect.left + a.rect.width / 2 - viewportCenterX) -
                    Math.abs(b.rect.left + b.rect.width / 2 - viewportCenterX),
            )[0];

        const left = activeAnchor
            ? activeAnchor.rect.left - viewportRect.left + activeAnchor.rect.width / 2
            : viewportRect.width / 2;
        const top = activeAnchor
            ? activeAnchor.rect.top - viewportRect.top + activeAnchor.rect.height / 2
            : Math.min(window.innerHeight * 0.46, 430);

        gsap.set(bubble, {
            left,
            top,
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            clearProps: "backgroundColor,borderColor",
        });
    }, []);

    const sealOnboardingHint = useCallback(() => {
        if (onboardingLearnedRef.current) return;

        onboardingLearnedRef.current = true;
        artworkOnboardingLearnedInCurrentDocument = true;
        onboardingSealUntilRef.current = performance.now() + 1050;
        clearOnboardingTimers();
        setOnboardingPhase("sealing");

        const viewport = viewportRef.current;
        const bubble = onboardingBubbleRef.current;
        const target = onboardingTargetRef.current;

        if (!viewport || !bubble || !target) {
            setOnboardingPhase("learned");
            return;
        }

        /*
         * The reminder may currently be in its faded/resting state.
         * Cancel that animation and rematerialize it before beginning the
         * spatial hand-off to the permanent navigation copy.
         */
        gsap.killTweensOf(bubble);
        positionOnboardingBubble();
        gsap.set(bubble, {
            opacity: 1,
            filter: "blur(0px)",
            visibility: "visible",
        });

        const bubbleRect = bubble.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        const targetX =
            targetRect.left + targetRect.width / 2 -
            (bubbleRect.left + bubbleRect.width / 2);
        const targetY =
            targetRect.top + targetRect.height / 2 -
            (bubbleRect.top + bubbleRect.height / 2);

        gsap.timeline({
            defaults: { overwrite: true },
            onComplete() {
                setOnboardingPhase("learned");

                gsap.fromTo(
                    target,
                    {
                        opacity: 0.5,
                        filter: "brightness(1.65)",
                        textShadow: "0 0 12px rgba(214,184,120,0.34)",
                    },
                    {
                        opacity: 1,
                        filter: "brightness(1)",
                        textShadow: "0 0 0 rgba(214,184,120,0)",
                        duration: 0.72,
                        ease: "power2.out",
                        clearProps: "filter,opacity,textShadow",
                    },
                );
            },
        })
            .to(bubble, {
                x: `+=${targetX}`,
                y: `+=${targetY}`,
                scale: 0.7,
                backgroundColor: "rgba(0,0,0,0)",
                borderColor: "rgba(255,255,255,0)",
                backdropFilter: "blur(0px)",
                duration: 0.9,
                ease: "power3.inOut",
            })
            .to(
                bubble,
                {
                    opacity: 0,
                    filter: "blur(5px)",
                    duration: 0.22,
                    ease: "power1.out",
                },
                "-=0.18",
            );
    }, [clearOnboardingTimers, positionOnboardingBubble]);

    useLayoutEffect(() => {
        if (artworkOnboardingLearnedInCurrentDocument) {
            onboardingLearnedRef.current = true;
            setOnboardingPhase("learned");
        }
    }, []);

    useEffect(() => {
        if (onboardingLearnedRef.current) return;

        const bubble = onboardingBubbleRef.current;
        if (!bubble) return;

        const playReminder = () => {
            if (onboardingLearnedRef.current) return;

            const currentBubble = onboardingBubbleRef.current;
            if (!currentBubble) return;

            gsap.killTweensOf(currentBubble);
            positionOnboardingBubble();

            /*
             * Atmospheric reminder: materialize through blur + opacity,
             * rest long enough to be read, then dissolve again. The five
             * second cadence never remounts the component and therefore
             * cannot produce a hard blink.
             */
            gsap.timeline({ overwrite: true })
                .fromTo(
                    currentBubble,
                    {
                        opacity: 0,
                        filter: "blur(8px)",
                        scale: 0.97,
                    },
                    {
                        opacity: 1,
                        filter: "blur(0px)",
                        scale: 1,
                        duration: 0.65,
                        ease: "power2.out",
                    },
                )
                .to(currentBubble, {
                    opacity: 1,
                    duration: Math.max(
                        (ONBOARDING_VISIBLE_MS - 1200) / 1000,
                        0.6,
                    ),
                })
                .to(currentBubble, {
                    opacity: 0,
                    filter: "blur(12px)",
                    x: 16,
                    y: -4,
                    scale: 1.01,
                    duration: 1.35,
                    ease: "power1.out",
                });
        };

        requestAnimationFrame(playReminder);
        onboardingIntervalRef.current = window.setInterval(
            playReminder,
            ONBOARDING_REPEAT_MS,
        );

        window.addEventListener("resize", positionOnboardingBubble);

        return () => {
            clearOnboardingTimers();
            gsap.killTweensOf(bubble);
            if (navigationRouteTimerRef.current !== null) {
                window.clearTimeout(navigationRouteTimerRef.current);
                navigationRouteTimerRef.current = null;
            }
            window.removeEventListener("resize", positionOnboardingBubble);
        };
    }, [clearOnboardingTimers, positionOnboardingBubble]);

    const getHref = useCallback(
        (direction: Direction) =>
            direction === 1 ? nextHref : previousHref,
        [nextHref, previousHref],
    );

    const getDestination = useCallback(
        (direction: Direction) => {
            const width = viewportWidthRef.current;

            if (direction === 1) {
                return baseXRef.current - width;
            }

            return baseXRef.current + width;
        },
        [],
    );

    const setTrackX = useCallback((x: number) => {
        const track = trackRef.current;
        if (!track) return;

        positionRef.current = x;
        gsap.set(track, { x });
    }, []);

    const resetToCurrent = useCallback(
        (animate = true) => {
            const track = trackRef.current;
            if (!track) return;

            gsap.killTweensOf(track);

            if (!animate) {
                setTrackX(baseXRef.current);
                return;
            }

            gsap.to(track, {
                x: baseXRef.current,
                duration: 0.55,
                ease: "power3.out",
                overwrite: true,
                onUpdate() {
                    positionRef.current =
                        Number(gsap.getProperty(track, "x")) || 0;
                },
                onComplete() {
                    positionRef.current = baseXRef.current;
                },
            });
        },
        [setTrackX],
    );

    const clearWheelState = useCallback(() => {
        if (wheelResetRef.current !== null) {
            window.clearTimeout(wheelResetRef.current);
            wheelResetRef.current = null;
        }

        wheelDistanceRef.current = 0;
        wheelVelocityRef.current = 0;
        wheelLastEventTimeRef.current = 0;

        /*
         * A trackpad gesture and a pointer drag are separate input
         * sessions. Never let a delayed wheel callback/tween survive
         * into the next mouse drag.
         */
        if (inputModeRef.current === "wheel") {
            inputModeRef.current = "idle";
        }
    }, []);

    const navigate = useCallback(
        (direction: Direction, releaseVelocity = 0, preserveReleaseVelocity = false) => {
            if (navigatingRef.current) return;

            const href = getHref(direction);
            const track = trackRef.current;

            if (!href || !track) {
                resetToCurrent();
                return;
            }

            navigatingRef.current = true;

            /*
             * Land exactly on the neighbouring panel.
             * Do not overshoot: the neighbour is already rendered,
             * so an overshoot followed by route reconstruction reads
             * visually as a backwards snap.
             */
            const destination =
                getDestination(direction);

            const remainingDistance = Math.abs(
                destination - positionRef.current,
            );

            /*
             * Wheel release must preserve the speed the fingers handed us.
             * power1.out starts at 2x its average velocity, so choosing the
             * duration from 2 * distance / releaseSpeed makes the first frame
             * of the release continuous with the measured trackpad velocity
             * instead of producing the old post-release acceleration spike.
             * Pointer drag keeps the already-approved timing below.
             */
            const releaseSpeed = Math.abs(releaseVelocity);
            const kineticDuration =
                preserveReleaseVelocity && releaseSpeed > 1
                    ? gsap.utils.clamp(
                          0.14,
                          0.95,
                          (2 * remainingDistance) / releaseSpeed,
                      )
                    : gsap.utils.clamp(
                          0.38,
                          0.72,
                          remainingDistance / 1500 + 0.28,
                      );

            gsap.to(track, {
                x: destination,
                duration: kineticDuration,
                ease: preserveReleaseVelocity ? "power1.out" : "power3.out",
                overwrite: true,
                onUpdate() {
                    positionRef.current =
                        Number(gsap.getProperty(track, "x")) || 0;
                },
                onComplete() {
                    // Navigation timing belongs to the artwork motion itself.
                    // Never hold the route for onboarding decoration.
                    router.replace(href, { scroll: false });
                },
            });
        },
        [
            getDestination,
            getHref,
            resetToCurrent,
            router,
        ],
    );

    useLayoutEffect(() => {
        const updateGeometry = () => {
            const viewport = viewportRef.current;
            const track = trackRef.current;

            if (!viewport || !track) return;

            const width = Math.max(
                viewport.getBoundingClientRect().width,
                1,
            );

            viewportWidthRef.current = width;

            /*
             * When Previous exists, Current is the second panel.
             * Otherwise Current is the first panel.
             */
            baseXRef.current = hasPrevious ? -width : 0;

            if (!navigatingRef.current) {
                gsap.killTweensOf(track);
                setTrackX(baseXRef.current);
            }
        };

        updateGeometry();

        const observer = new ResizeObserver(updateGeometry);
        if (viewportRef.current) {
            observer.observe(viewportRef.current);
        }

        window.addEventListener("resize", updateGeometry);

        return () => {
            observer.disconnect();
            window.removeEventListener(
                "resize",
                updateGeometry,
            );
        };
    }, [hasPrevious, setTrackX]);

    /*
     * A route change remounts/rebuilds the three-panel window.
     * Reset immediately onto the new Current panel.
     */
    useEffect(() => {
        /*
         * previousHref / nextHref identify the new three-scene window
         * after App Router has completed the route handoff.
         * Reset without animation so there is no visible recoil.
         */
        navigatingRef.current = false;
        clearWheelState();
        draggingRef.current = false;
        horizontalDragRef.current = false;
        pointerIdRef.current = null;
        inputModeRef.current = "idle";

        const frame = requestAnimationFrame(() => {
            const width =
                viewportRef.current?.getBoundingClientRect()
                    .width ?? window.innerWidth;

            viewportWidthRef.current = Math.max(width, 1);
            baseXRef.current = hasPrevious
                ? -viewportWidthRef.current
                : 0;

            setTrackX(baseXRef.current);
        });

        return () => cancelAnimationFrame(frame);
    }, [
        hasPrevious,
        previousHref,
        nextHref,
        setTrackX,
        clearWheelState,
    ]);

    /*
     * Native capture listener is deliberate.
     * MacBook trackpad gestures arrive as WheelEvent, not PointerEvent.
     * Listening on the viewport in capture phase avoids React/passive
     * wheel handling swallowing the horizontal gesture.
     */
    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const handleWheel = (event: WheelEvent) => {
            if (
                inputModeRef.current === "pointer" ||
                draggingRef.current
            ) {
                return;
            }

            const absX = Math.abs(event.deltaX);
            const absY = Math.abs(event.deltaY);

            const horizontalIntent =
                event.shiftKey ||
                (absX > 1.5 &&
                    absX >= absY * AXIS_LOCK_RATIO);

            if (!horizontalIntent) {
                return;
            }

            event.preventDefault();

            /*
             * Consume the inertial tail of the gesture that already caused
             * navigation. Each new tail event extends the quiet-period lock;
             * a genuinely new swipe works normally once the stream stops.
             */
            if (wheelNavigationMomentumLocked) {
                if (wheelNavigationUnlockTimer !== null) {
                    window.clearTimeout(wheelNavigationUnlockTimer);
                }

                wheelNavigationUnlockTimer = window.setTimeout(() => {
                    wheelNavigationMomentumLocked = false;
                    wheelNavigationUnlockTimer = null;
                }, WHEEL_GESTURE_END_MS);

                return;
            }

            if (navigatingRef.current) {
                return;
            }

            const delta = event.shiftKey
                ? event.deltaY
                : event.deltaX;

            if (Math.abs(delta) < 0.1) return;

            inputModeRef.current = "wheel";
            sealOnboardingHint();

            /*
             * Measure the velocity actually supplied by the trackpad. Keep a
             * short exponential average so one noisy WheelEvent cannot create
             * a release kick. Units are px/s in the track's visual direction.
             */
            const now = performance.now();
            const previousWheelTime = wheelLastEventTimeRef.current;
            if (previousWheelTime > 0) {
                const dt = Math.max(now - previousWheelTime, 8);
                const instantaneousVelocity =
                    (-delta * WHEEL_PREVIEW_MULTIPLIER * 1000) / dt;
                wheelVelocityRef.current =
                    wheelVelocityRef.current * 0.68 +
                    instantaneousVelocity * 0.32;
            }
            wheelLastEventTimeRef.current = now;

            /*
             * Keep one direction per physical wheel session. If the sign
             * genuinely reverses, begin a new accumulation from that event
             * instead of letting momentum cancel the gesture.
             */
            if (
                wheelDistanceRef.current !== 0 &&
                Math.sign(wheelDistanceRef.current) !== Math.sign(delta)
            ) {
                wheelDistanceRef.current = delta;
            } else {
                wheelDistanceRef.current += delta;
            }

            const accumulated = wheelDistanceRef.current;
            const direction: Direction = accumulated > 0 ? 1 : -1;
            const width = viewportWidthRef.current;
            const previewLimit = width * 0.42;
            const hasDestination = Boolean(getHref(direction));

            let previewOffset = gsap.utils.clamp(
                -previewLimit,
                previewLimit,
                -accumulated * WHEEL_PREVIEW_MULTIPLIER,
            );

            if (!hasDestination) {
                previewOffset *= EDGE_RESISTANCE;
            }

            /*
             * Direct rendering is intentional: wheel/trackpad movement must
             * stay under the fingers. A tween here adds perceptible latency.
             */
            const track = trackRef.current;
            if (track) {
                gsap.killTweensOf(track);
                const nextX = baseXRef.current + previewOffset;
                gsap.set(track, { x: nextX });
                positionRef.current = nextX;
            }

            if (wheelResetRef.current !== null) {
                window.clearTimeout(wheelResetRef.current);
            }

            /*
             * Successful navigation commits while the gesture is still alive.
             * Waiting for the wheel stream to become quiet created the visible
             * brake -> pause -> continue sequence. The momentum lock below is
             * what prevents the remaining inertial tail from navigating twice.
             */
            if (hasDestination && Math.abs(accumulated) >= WHEEL_TRIGGER) {
                const releaseVelocity = wheelVelocityRef.current;

                wheelNavigationMomentumLocked = true;
                wheelDistanceRef.current = 0;
                wheelVelocityRef.current = 0;
                wheelLastEventTimeRef.current = 0;
                inputModeRef.current = "idle";

                if (wheelResetRef.current !== null) {
                    window.clearTimeout(wheelResetRef.current);
                    wheelResetRef.current = null;
                }

                if (wheelNavigationUnlockTimer !== null) {
                    window.clearTimeout(wheelNavigationUnlockTimer);
                }

                wheelNavigationUnlockTimer = window.setTimeout(() => {
                    wheelNavigationMomentumLocked = false;
                    wheelNavigationUnlockTimer = null;
                }, WHEEL_GESTURE_END_MS);

                navigate(direction, releaseVelocity, true);
                return;
            }

            /* Only an incomplete gesture waits for quiet, then springs home. */
            wheelResetRef.current = window.setTimeout(() => {
                wheelResetRef.current = null;
                wheelDistanceRef.current = 0;
                wheelVelocityRef.current = 0;
                wheelLastEventTimeRef.current = 0;
                inputModeRef.current = "idle";
                resetToCurrent();
            }, WHEEL_GESTURE_END_MS);
        };

        viewport.addEventListener(
            "wheel",
            handleWheel,
            {
                passive: false,
                capture: true,
            },
        );

        return () => {
            viewport.removeEventListener(
                "wheel",
                handleWheel,
                true,
            );

            clearWheelState();
        };
    }, [
        clearWheelState,
        getHref,
        hasNext,
        hasPrevious,
        navigate,
        resetToCurrent,
        sealOnboardingHint,
    ]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;

            if (
                target?.closest(
                    "input, textarea, select, button, [contenteditable='true'], [data-artwork-kinetic-ignore]",
                )
            ) {
                return;
            }

            if (event.key === "ArrowRight" && nextHref) {
                event.preventDefault();
                sealOnboardingHint();
                navigate(1);
            }

            if (
                event.key === "ArrowLeft" &&
                previousHref
            ) {
                event.preventDefault();
                sealOnboardingHint();
                navigate(-1);
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [navigate, nextHref, previousHref, sealOnboardingHint]);

    function handlePointerDown(
        event: PointerEvent<HTMLDivElement>,
    ) {
        if (navigatingRef.current) return;

        if (
            event.pointerType === "mouse" &&
            event.button !== 0
        ) {
            return;
        }

        const target = event.target as HTMLElement;

        if (
            target.closest(
                "a, button, input, textarea, select, [contenteditable='true']",
            )
        ) {
            return;
        }

        /*
         * Mouse/touch takes ownership immediately. Cancel every pending
         * wheel timer and wheel preview tween first, then synchronize the
         * logical position with the track's actual rendered position.
         */
        clearWheelState();

        const track = trackRef.current;
        if (track) {
            gsap.killTweensOf(track);
            positionRef.current =
                Number(gsap.getProperty(track, "x")) ||
                baseXRef.current;
        }

        inputModeRef.current = "pointer";
        draggingRef.current = true;
        horizontalDragRef.current = false;
        pointerIdRef.current = event.pointerId;

        startXRef.current = event.clientX;
        startYRef.current = event.clientY;
        lastXRef.current = event.clientX;
        lastTimeRef.current = performance.now();
        velocityRef.current = 0;

        try {
            event.currentTarget.setPointerCapture(
                event.pointerId,
            );
        } catch {
            // Pointer capture may not be available.
        }
    }

    function handlePointerMove(
        event: PointerEvent<HTMLDivElement>,
    ) {
        if (
            !draggingRef.current ||
            pointerIdRef.current !== event.pointerId
        ) {
            return;
        }

        const deltaX =
            event.clientX - startXRef.current;

        const deltaY =
            event.clientY - startYRef.current;

        if (!horizontalDragRef.current) {
            if (
                Math.abs(deltaX) < 8 &&
                Math.abs(deltaY) < 8
            ) {
                return;
            }

            if (
                Math.abs(deltaX) <
                Math.abs(deltaY) * AXIS_LOCK_RATIO
            ) {
                draggingRef.current = false;
                pointerIdRef.current = null;
                inputModeRef.current = "idle";
                return;
            }

            horizontalDragRef.current = true;
            sealOnboardingHint();
        }

        event.preventDefault();

        let offset = deltaX;

        if (offset > 0 && !previousHref) {
            offset *= EDGE_RESISTANCE;
        }

        if (offset < 0 && !nextHref) {
            offset *= EDGE_RESISTANCE;
        }

        setTrackX(baseXRef.current + offset);

        const now = performance.now();
        const elapsed = Math.max(
            now - lastTimeRef.current,
            1,
        );

        const pointerDelta =
            event.clientX - lastXRef.current;

        const instantaneousVelocity =
            (pointerDelta / elapsed) * 1000;

        velocityRef.current =
            velocityRef.current * 0.72 +
            instantaneousVelocity * 0.28;

        lastXRef.current = event.clientX;
        lastTimeRef.current = now;
    }

    function finishPointer(
        event: PointerEvent<HTMLDivElement>,
    ) {
        if (
            !draggingRef.current ||
            pointerIdRef.current !== event.pointerId
        ) {
            return;
        }

        draggingRef.current = false;
        pointerIdRef.current = null;
        inputModeRef.current = "idle";

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

        if (!horizontalDragRef.current) {
            return;
        }

        const displacement =
            positionRef.current - baseXRef.current;

        const velocity = velocityRef.current;

        const projected =
            displacement +
            velocity * MOMENTUM_FACTOR;

        const threshold =
            viewportWidthRef.current *
            SNAP_DISTANCE_RATIO;

        if (
            nextHref &&
            (projected <= -threshold ||
                velocity <= -SNAP_VELOCITY)
        ) {
            navigate(1, velocity);
            return;
        }

        if (
            previousHref &&
            (projected >= threshold ||
                velocity >= SNAP_VELOCITY)
        ) {
            navigate(-1, velocity);
            return;
        }

        resetToCurrent();
    }

    const panels = [
        ...(hasPrevious
            ? [
                  {
                      key: "previous",
                      content: previousScene,
                  },
              ]
            : []),
        {
            key: "current",
            content: currentScene,
        },
        ...(hasNext
            ? [
                  {
                      key: "next",
                      content: nextScene,
                  },
              ]
            : []),
    ];

    return (
        <div
            ref={viewportRef}
            className="
                relative
                w-full
                overflow-x-hidden
                overscroll-x-contain
                touch-pan-y
            "
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPointer}
            onPointerCancel={finishPointer}
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 z-40">
                <div className="mx-auto flex w-full max-w-[var(--container-wide)] items-center justify-between px-6 pt-10 md:px-10 md:pt-20 lg:px-12 lg:pt-28">
                    <LinkButton
                        href={backHref}
                        variant="goldUnderline"
                        data-artwork-kinetic-ignore
                        className="pointer-events-auto text-[10px] tracking-[0.28em] text-white/60"
                    >
                        ← {backLabel}
                    </LinkButton>

                    <div
                        ref={onboardingTargetRef}
                        aria-hidden
                        className="font-sans text-[8px] uppercase tracking-[0.22em] text-white/30 md:text-[9px] md:tracking-[0.26em]"
                    >
                        <span className="md:hidden">‹&nbsp; Swipe to explore &nbsp;›</span>
                        <span className="hidden md:inline">‹&nbsp;&nbsp; Swipe / Drag to explore &nbsp;&nbsp;›</span>
                    </div>
                </div>
            </div>

            {onboardingPhase !== "learned" && (
                <div
                    ref={onboardingBubbleRef}
                    aria-hidden
                    className="
                        pointer-events-none
                        absolute
                        z-50
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        border
                        border-white/[0.08]
                        bg-black/30
                        px-5
                        py-3
                        backdrop-blur-md
                    "
                >
                    <div className="flex items-center gap-5 whitespace-nowrap">
                        <span className="font-display text-lg text-white/40">‹</span>
                        <span className="font-sans text-[9px] font-medium uppercase tracking-[0.3em] text-white/70">
                            <span className="md:hidden">Swipe to explore</span>
                            <span className="hidden md:inline">Swipe / drag to explore</span>
                        </span>
                        <span className="font-display text-lg text-white/40">›</span>
                    </div>
                </div>
            )}

            <div
                ref={trackRef}
                className="
                    flex
                    w-max
                    items-start
                    will-change-transform
                "
            >
                {panels.map((panel) => (
                    <div
                        key={panel.key}
                        className="
                            w-screen
                            shrink-0
                        "
                    >
                        {panel.content}
                    </div>
                ))}
            </div>
        </div>
    );
}
