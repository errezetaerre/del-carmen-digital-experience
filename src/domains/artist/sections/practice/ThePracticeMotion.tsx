"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ThePracticeMotion() {
    useLayoutEffect(() => {
        const root =
            document.querySelector<HTMLElement>("#the-practice");

        if (!root) return;

        const ctx = gsap.context(() => {
            const eyebrow =
                root.querySelector<HTMLElement>(
                    "[data-practice-eyebrow]"
                );

            const titleLines =
                gsap.utils.toArray<HTMLElement>(
                    "[data-practice-title-line]"
                );

            const intro =
                root.querySelector<HTMLElement>(
                    "[data-practice-intro]"
                );

            const introCopy =
                gsap.utils.toArray<HTMLElement>(
                    "[data-practice-copy]"
                );

            const environment =
                root.querySelector<HTMLElement>(
                    "[data-practice-environment]"
                );

            const material =
                root.querySelector<HTMLElement>(
                    "[data-practice-material]"
                );

            const work =
                root.querySelector<HTMLElement>(
                    "[data-practice-work]"
                );

            const labels =
                gsap.utils.toArray<HTMLElement>(
                    "[data-practice-label]"
                );

            const processCopy =
                gsap.utils.toArray<HTMLElement>(
                    "[data-practice-process]"
                );

            const pauseLine =
                root.querySelector<HTMLElement>(
                    "[data-practice-pause-line]"
                );

            const highlightLines =
                gsap.utils.toArray<HTMLElement>(
                    "[data-practice-highlight-line]"
                );

            const reducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            const visibilityTargets = [
                eyebrow,
                ...titleLines,
                intro,
                ...introCopy,
                ...labels,
                ...processCopy,
                pauseLine,
                ...highlightLines,
            ].filter(Boolean);

            gsap.set(visibilityTargets, {
                visibility: "visible",
            });

            if (reducedMotion) {
                gsap.set(visibilityTargets, {
                    clearProps: "opacity,transform",
                });

                return;
            }

            /* =====================================================
                INITIAL STATES
            ====================================================== */

            gsap.set(eyebrow, {
                autoAlpha: 0,
                y: 12,
            });

            gsap.set(titleLines, {
                autoAlpha: 0,
                y: 24,
            });

            gsap.set(intro, {
                autoAlpha: 0,
                y: 20,
            });

            gsap.set(introCopy, {
                autoAlpha: 0,
                y: 18,
            });

            gsap.set(labels, {
                autoAlpha: 0,
                y: 8,
            });

            gsap.set(processCopy, {
                autoAlpha: 0,
                y: 18,
            });

            gsap.set(pauseLine, {
                autoAlpha: 0,
                scaleX: 0,
                transformOrigin: "left center",
            });

            gsap.set(highlightLines, {
                autoAlpha: 0,
                y: 18,
            });

            /* =====================================================
                INTRO
            ====================================================== */

            if (eyebrow) {
                gsap.to(eyebrow, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.65,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: eyebrow,
                        start: "top 72%",
                        once: true,
                    },
                });
            }

            if (titleLines.length) {
                gsap.to(titleLines, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.9,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: titleLines[0],
                        start: "top 64%",
                        once: true,
                    },
                });
            }

            if (intro) {
                gsap.to(intro, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: intro,
                        start: "top 66%",
                        once: true,
                    },
                });
            }

            introCopy.forEach((paragraph) => {
                gsap.to(paragraph, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.85,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: paragraph,
                        start: "top 68%",
                        once: true,
                    },
                });
            });

            /* =====================================================
                MEDIA REVEAL
            ====================================================== */

            const revealMedia = (
                element: HTMLElement | null,
                fromClip: string,
                start: string
            ) => {
                if (!element) return;

                gsap.set(element, {
                    clipPath: fromClip,
                });

                gsap.to(element, {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 1.35,
                    ease: "power3.inOut",
                    scrollTrigger: {
                        trigger: element,
                        start,
                        once: true,
                    },
                });
            };

            /*
                ENVIRONMENT

                Opens horizontally from the center.
            */

            revealMedia(
                environment,
                "inset(0% 40% 0% 80%)",
                "top 78%"
            );

            /*
                MATERIAL

                Reveals upward, like approaching the surface
                of the palette.
            */

            revealMedia(
                material,
                "inset(100% 0% 0% 0%)",
                "top 78%"
            );

            /*
                WORK

                Reveals vertically from top toward bottom.
            */

            revealMedia(
                work,
                "inset(0% 0% 100% 0%)",
                "top 78%"
            );

            /* =====================================================
                MEDIA LABELS
            ====================================================== */

            labels.forEach((label) => {
                gsap.to(label, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.65,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: label,
                        start: "top 82%",
                        once: true,
                    },
                });
            });

            /* =====================================================
                PROCESS COPY
            ====================================================== */

            processCopy.forEach((paragraph) => {
                gsap.to(paragraph, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: paragraph,
                        start: "top 68%",
                        once: true,
                    },
                });
            });

            /* =====================================================
                DISCIPLINE + INTUITION
            ====================================================== */

            if (pauseLine && highlightLines.length) {
                const highlightTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: pauseLine,
                        start: "top 66%",
                        once: true,
                    },
                });

                highlightTimeline
                    .to(pauseLine, {
                        autoAlpha: 1,
                        scaleX: 1,
                        duration: 0.7,
                        ease: "power3.out",
                    })
                    .to(
                        highlightLines,
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.85,
                            stagger: 0.11,
                            ease: "power3.out",
                        },
                        "-=0.3"
                    );
            }
        }, root);

        return () => ctx.revert();
    }, []);

    return null;
}