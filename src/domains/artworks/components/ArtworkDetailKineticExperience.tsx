"use client";

import { useLocale, useTranslations } from "next-intl";
import { localizeHref } from "@/i18n/config";

import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { useRouter } from "@/i18n/navigation";
import gsap from "gsap";
import { ARTWORK_KINETICS, artworkKineticTween, artworkPointerDirection, artworkPointerOffset, artworkPointerVelocity, artworkWheelOffset, artworkWheelVelocity } from "@/shared/ui/artwork/artworkKinetics";
import { LinkButton } from "@/shared/ui/button";
import glassStyles from "./glass-artbook/ArtworkGlassArtbook.module.css";
import sceneStyles from "./ArtworkDetailScene.module.css";
import { captureStandardNavigation, finishStandardNavigation } from "../presentation/artworkNavigationContinuity";
import { bindArtworkTouchNavigation, type ArtworkDragInput } from "./artworkTouchNavigation";

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

const { axisLockRatio: AXIS_LOCK_RATIO, wheelTrigger: WHEEL_TRIGGER,
    wheelGestureEndMs: WHEEL_GESTURE_END_MS } = ARTWORK_KINETICS;

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

// The reading pane owns vertical input; horizontal gestures explore scenes.
// A mouse press in the pane stays native until horizontal intent is established.
function isReadingPane(target: EventTarget | null) {
    const pane = (target as HTMLElement | null)?.closest?.<HTMLElement>("[data-artwork-detail-reading]");
    return Boolean(pane && getComputedStyle(pane).overflowY === "auto");
}

export default function ArtworkDetailKineticExperience({
    previousScene,
    currentScene,
    nextScene,
    previousHref,
    nextHref,
    backHref,
    backLabel,
}: ArtworkDetailKineticExperienceProps) {
    const locale = useLocale();
    const t = useTranslations("Artwork");
    const router = useRouter();
    const [nativePortrait, setNativePortrait] = useState(false);
    useEffect(() => {
        const viewport = window.matchMedia("(orientation:portrait) and (max-width:1366px), (orientation:portrait) and (any-pointer:coarse)");
        const update = () => setNativePortrait(viewport.matches);
        update();
        viewport.addEventListener("change", update);
        return () => viewport.removeEventListener("change", update);
    }, []);

    const viewportRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const currentPanelRef = useRef<HTMLDivElement>(null);
    const onboardingSlideRef = useRef<gsap.core.Timeline | null>(null);

    const baseXRef = useRef(0);
    const positionRef = useRef(0);
    const viewportWidthRef = useRef(1);

    const draggingRef = useRef(false);
    const horizontalDragRef = useRef(false);
    const pointerIdRef = useRef<number | null>(null);
    const pointerTypeRef = useRef<string | null>(null);
    const nativeTouchActiveRef = useRef(false);
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
    const onboardingLearnedRef = useRef(artworkOnboardingLearnedInCurrentDocument);
    const onboardingSealUntilRef = useRef(0);
    const navigationRouteTimerRef = useRef<number | null>(null);
    const [onboardingPhase, setOnboardingPhase] =
        useState<OnboardingPhase>(() => artworkOnboardingLearnedInCurrentDocument ? "learned" : "reminding");

    const hasPrevious = Boolean(previousScene && previousHref);
    const hasNext = Boolean(nextScene && nextHref);

    const releaseTextSelection = useCallback(() => {
        viewportRef.current?.removeAttribute("data-artwork-dragging");
    }, []);

    const clearOnboardingTimers = useCallback(() => {
        if (onboardingIntervalRef.current !== null) {
            window.clearInterval(onboardingIntervalRef.current);
            onboardingIntervalRef.current = null;
        }
    }, []);

    const stopOnboardingSlide = useCallback(() => {
        onboardingSlideRef.current?.kill();
        onboardingSlideRef.current = null;
        const panel = currentPanelRef.current;
        if (panel) gsap.set(panel, { clearProps: "transform" });
        viewportRef.current?.removeAttribute("data-standard-demonstrating");
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
        stopOnboardingSlide();
        setOnboardingPhase("sealing");

        const viewport = viewportRef.current;
        const bubble = onboardingBubbleRef.current;
        const target = onboardingTargetRef.current;

        if (!viewport || !bubble || !target) {
            setOnboardingPhase("learned");
            return;
        }
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
    }, [clearOnboardingTimers, positionOnboardingBubble, stopOnboardingSlide]);

    useEffect(() => {
        if (onboardingLearnedRef.current) return;

        const bubble = onboardingBubbleRef.current;
        const viewport = viewportRef.current;
        if (!bubble || !viewport) return;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

        const playReminder = () => {
            if (onboardingLearnedRef.current || onboardingSlideRef.current || document.hidden || draggingRef.current || navigatingRef.current ||
                document.querySelector('[role="dialog"][aria-modal="true"]')) return;

            const currentBubble = onboardingBubbleRef.current;
            if (!currentBubble) return;

            gsap.killTweensOf(currentBubble);
            positionOnboardingBubble();
            stopOnboardingSlide();

            // This is a teaching offset on the current editorial panel only.
            // The real track, its position and release velocity stay untouched.
            const panel = currentPanelRef.current;
            if (panel && (hasNext || hasPrevious) && !reducedMotion.matches &&
                !document.getSelection()?.toString()) {
                const distance = Math.min(26, viewport.clientWidth * .055) * (hasNext ? -1 : 1);
                viewport.dataset.standardDemonstrating = "";
                onboardingSlideRef.current = gsap.timeline({ onComplete: stopOnboardingSlide })
                    .to(panel, { x: distance, duration: .7, ease: "power2.out" })
                    .to(panel, { x: 0, duration: .9, ease: "power3.inOut" }, "+=.2");
            }

            if (reducedMotion.matches) {
                gsap.set(currentBubble, { opacity: 1, filter: "none", scale: 1 });
                gsap.to(currentBubble, { opacity: 0, delay: ONBOARDING_VISIBLE_MS / 1000, duration: .1 });
                return;
            }

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

        const firstReminder = requestAnimationFrame(playReminder);
        onboardingIntervalRef.current = window.setInterval(
            playReminder,
            ONBOARDING_REPEAT_MS,
        );

        const interrupt = () => stopOnboardingSlide();
        const resized = () => { stopOnboardingSlide(); positionOnboardingBubble(); };
        viewport.addEventListener("pointerdown", interrupt, true);
        viewport.addEventListener("touchstart", interrupt, { passive: true, capture: true });
        viewport.addEventListener("wheel", interrupt, { passive: true, capture: true });
        viewport.addEventListener("scroll", interrupt, true);
        viewport.addEventListener("focusin", interrupt);
        document.addEventListener("visibilitychange", interrupt);
        reducedMotion.addEventListener("change", interrupt);
        window.addEventListener("resize", resized);

        return () => {
            cancelAnimationFrame(firstReminder);
            clearOnboardingTimers();
            stopOnboardingSlide();
            gsap.killTweensOf(bubble);
            if (navigationRouteTimerRef.current !== null) {
                window.clearTimeout(navigationRouteTimerRef.current);
                navigationRouteTimerRef.current = null;
            }
            viewport.removeEventListener("pointerdown", interrupt, true);
            viewport.removeEventListener("touchstart", interrupt, true);
            viewport.removeEventListener("wheel", interrupt, true);
            viewport.removeEventListener("scroll", interrupt, true);
            viewport.removeEventListener("focusin", interrupt);
            document.removeEventListener("visibilitychange", interrupt);
            reducedMotion.removeEventListener("change", interrupt);
            window.removeEventListener("resize", resized);
        };
    }, [clearOnboardingTimers, hasNext, hasPrevious, positionOnboardingBubble, stopOnboardingSlide]);

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
                duration: ARTWORK_KINETICS.resetDuration,
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
            const timing = artworkKineticTween(remainingDistance, releaseVelocity, preserveReleaseVelocity);

            gsap.to(track, {
                x: destination,
                ...timing,
                overwrite: true,
                onUpdate() {
                    positionRef.current =
                        Number(gsap.getProperty(track, "x")) || 0;
                },
                onComplete() {
                    // Navigation timing belongs to the artwork motion itself.
                    // Never hold the route for onboarding decoration.
                    if (viewportRef.current) captureStandardNavigation(viewportRef.current, localizeHref(href, locale));
                    router.replace(href, { scroll: false });
                },
            });
        },
        [
            getDestination,
            getHref,
            resetToCurrent,
            router,
            locale,
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

            // Mobile browser chrome can change height during a live gesture.
            // A height-only observation must not reset its horizontal position.
            if ((draggingRef.current || inputModeRef.current === "wheel") &&
                Math.abs(width - viewportWidthRef.current) < .5) return;

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
    useLayoutEffect(() => {
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
        pointerTypeRef.current = null;
        nativeTouchActiveRef.current = false;
        inputModeRef.current = "idle";
        releaseTextSelection();

        const viewport = viewportRef.current;
        const width = viewport?.getBoundingClientRect().width ?? window.innerWidth;
        viewportWidthRef.current = Math.max(width, 1);
        baseXRef.current = hasPrevious ? -viewportWidthRef.current : 0;
        setTrackX(baseXRef.current);
        return viewport ? finishStandardNavigation(viewport) : undefined;
    }, [
        hasPrevious,
        previousHref,
        nextHref,
        setTrackX,
        clearWheelState,
        releaseTextSelection,
    ]);

    useEffect(() => {
        // Prefetch only the two neighbours, never the full catalogue.
        if (previousHref) router.prefetch(previousHref);
        if (nextHref) router.prefetch(nextHref);
    }, [previousHref, nextHref, router]);

    useEffect(() => {
        const cancelDrag = () => {
            const viewport = viewportRef.current;
            const pointerId = pointerIdRef.current;
            const wasDragging = draggingRef.current;
            draggingRef.current = false;
            horizontalDragRef.current = false;
            pointerIdRef.current = null;
            pointerTypeRef.current = null;
            nativeTouchActiveRef.current = false;
            inputModeRef.current = "idle";
            releaseTextSelection();
            try { if (viewport && pointerId !== null && viewport.hasPointerCapture(pointerId)) viewport.releasePointerCapture(pointerId); } catch {}
            if (wasDragging) resetToCurrent();
        };
        window.addEventListener("blur", cancelDrag);
        return () => { window.removeEventListener("blur", cancelDrag); cancelDrag(); };
    }, [releaseTextSelection, resetToCurrent]);

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
            if ((event.target as HTMLElement | null)?.closest("[data-artwork-highlights]")) return;
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
                (absX > 0 &&
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

            if (delta === 0) return;

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
                wheelVelocityRef.current = artworkWheelVelocity(
                    wheelVelocityRef.current, delta, now - previousWheelTime,
                );
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
            const hasDestination = Boolean(getHref(direction));

            const previewOffset = artworkWheelOffset(accumulated, width, hasDestination);

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
        event: ArtworkDragInput,
    ) {
        if (navigatingRef.current || draggingRef.current) return;

        if (
            event.pointerType === "mouse" &&
            event.button !== 0
        ) {
            return;
        }

        const target = event.target as HTMLElement;

        const readingPane = isReadingPane(target);

        if (
            target.closest(
                "a, button, input, textarea, select, [contenteditable='true'], [data-artwork-highlights], [data-artwork-kinetic-ignore]",
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
        pointerTypeRef.current = event.pointerType;

        startXRef.current = event.clientX;
        startYRef.current = event.clientY;
        lastXRef.current = event.clientX;
        lastTimeRef.current = performance.now();
        velocityRef.current = 0;

        if (!readingPane || event.pointerType !== "mouse") event.currentTarget.setAttribute("data-artwork-dragging", "");
        if (event.pointerType === "mouse" && !readingPane) event.preventDefault();

        // Native touch panning owns the vertical axis; mouse regrab stays immediate.
        if (event.pointerType === "mouse" && !readingPane) {
            try {
                event.currentTarget.setPointerCapture(
                    event.pointerId,
                );
            } catch {
                // Pointer capture may not be available.
            }
        }
    }

    function handlePointerMove(
        event: ArtworkDragInput,
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
                Math.abs(deltaX) < ARTWORK_KINETICS.intentDistance &&
                Math.abs(deltaY) < ARTWORK_KINETICS.intentDistance
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
                releaseTextSelection();
                try {
                    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
                } catch {}
                return;
            }

            horizontalDragRef.current = true;
            event.currentTarget.setAttribute("data-artwork-dragging", "");
            const selection = window.getSelection();
            if (selection && ((selection.anchorNode && event.currentTarget.contains(selection.anchorNode)) || (selection.focusNode && event.currentTarget.contains(selection.focusNode)))) selection.removeAllRanges();
            try { event.currentTarget.setPointerCapture(event.pointerId); } catch {}
            sealOnboardingHint();
        }

        event.preventDefault();

        const offset = artworkPointerOffset(deltaX, Boolean(previousHref), Boolean(nextHref));

        setTrackX(baseXRef.current + offset);

        const now = performance.now();
        velocityRef.current = artworkPointerVelocity(
            velocityRef.current, event.clientX - lastXRef.current, now - lastTimeRef.current,
        );

        lastXRef.current = event.clientX;
        lastTimeRef.current = now;
    }

    function finishPointer(
        event: ArtworkDragInput,
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
        releaseTextSelection();

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

        if (event.type === "pointercancel" || event.type === "lostpointercapture") {
            horizontalDragRef.current = false;
            resetToCurrent();
            return;
        }

        if (!horizontalDragRef.current) {
            return;
        }

        const displacement =
            positionRef.current - baseXRef.current;

        const velocity = velocityRef.current;
        const direction = artworkPointerDirection(displacement, velocity, viewportWidthRef.current,
            Boolean(previousHref), Boolean(nextHref));
        if (direction) { navigate(direction, velocity); return; }

        resetToCurrent();
    }

    useLayoutEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        return bindArtworkTouchNavigation(viewport, {
            start(input) {
                if (draggingRef.current) {
                    // Pointer down can precede native touchstart. Adopt that
                    // same gesture without resetting its position or velocity.
                    if (pointerTypeRef.current !== "touch" || nativeTouchActiveRef.current) return false;
                    pointerIdRef.current = input.pointerId;
                } else handlePointerDown(input);
                const accepted = draggingRef.current && pointerIdRef.current === input.pointerId;
                nativeTouchActiveRef.current = accepted;
                return accepted;
            },
            move: handlePointerMove,
            end(input) {
                try { finishPointer(input); }
                finally { nativeTouchActiveRef.current = false; }
            },
        });
    }, [clearWheelState, navigate, nextHref, previousHref, releaseTextSelection, resetToCurrent, sealOnboardingHint, setTrackX]);

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
            data-lenis-prevent={nativePortrait || undefined}
            data-artwork-native-scroll={nativePortrait || undefined}
            className={`
                ${glassStyles.standardViewport}
                ${sceneStyles.viewport}
                relative
                w-full
                overflow-x-hidden
                overscroll-x-contain
                touch-pan-y
            `}
            onPointerDown={(event) => { if (event.pointerType !== "touch" || !nativeTouchActiveRef.current) handlePointerDown(event); }}
            onPointerMove={(event) => { if (event.pointerType !== "touch" || !nativeTouchActiveRef.current) handlePointerMove(event); }}
            onPointerUp={(event) => { if (event.pointerType !== "touch" || !nativeTouchActiveRef.current) finishPointer(event); }}
            onPointerCancel={(event) => { if (event.pointerType !== "touch" || !nativeTouchActiveRef.current) finishPointer(event); }}
            onLostPointerCapture={(event) => { if (event.pointerType !== "touch" || !nativeTouchActiveRef.current) finishPointer(event); }}
            onClickCapture={(event) => {
                if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
                if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;

                const action = link.getAttribute("data-artwork-navigation");
                if (action === "previous" || action === "next") {
                    // Footer links use the same rendered neighbour and motion as
                    // dragging. Keep their href for native/new-tab navigation.
                    const panel = link.closest("[data-artwork-kinetic-panel]");
                    if (panel?.getAttribute("data-artwork-kinetic-panel") !== "current") {
                        event.preventDefault();
                        return;
                    }
                    const direction: Direction = action === "next" ? 1 : -1;
                    if (getHref(direction)) {
                        event.preventDefault();
                        if (navigatingRef.current || draggingRef.current) return;
                        clearWheelState();
                        sealOnboardingHint();
                        navigate(direction);
                        return;
                    }
                }

                captureStandardNavigation(event.currentTarget, link.href);
            }}
        >
            <div className={`${glassStyles.standardToolbar} pointer-events-none absolute inset-x-0 top-0 z-40`}>
                <div className={`${glassStyles.standardToolbarRow} ${sceneStyles.toolbarRow} mx-auto flex w-full max-w-[var(--container-wide)] items-center justify-between px-6 pt-10 md:px-10 md:pt-20 lg:px-12 lg:pt-28`}>
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
                        <span className="md:hidden">‹&nbsp; {t("swipe")} &nbsp;›</span>
                        <span className="hidden md:inline">‹&nbsp;&nbsp; {t("swipeDragDock")} &nbsp;&nbsp;›</span>
                    </div>
                </div>
            </div>

            {onboardingPhase !== "learned" && (
                <div
                    ref={onboardingBubbleRef}
                    data-artwork-onboarding
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
                            <span className="md:hidden">{t("swipe")}</span>
                            <span className="hidden md:inline">{t("swipeDrag")}</span>
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
                        ref={panel.key === "current" ? currentPanelRef : undefined}
                        data-artwork-kinetic-panel={panel.key}
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
