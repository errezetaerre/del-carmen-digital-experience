"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ArtistPhilosophyMotion() {
    useLayoutEffect(() => {
        const root =
            document.querySelector<HTMLElement>(
                "#artist-philosophy"
            );

        if (!root) return;

        const ctx = gsap.context(() => {
            const stage =
                root.querySelector<HTMLElement>(
                    "[data-philosophy-stage]"
                );

            const sticky =
                root.querySelector<HTMLElement>(
                    "[data-philosophy-sticky]"
                );

            const eyebrow =
                root.querySelector<HTMLElement>(
                    "[data-philosophy-eyebrow]"
                );

            const eyebrowLines =
                gsap.utils.toArray<HTMLElement>(
                    "[data-philosophy-eyebrow-line]"
                );

            const statement =
                root.querySelector<HTMLElement>(
                    "[data-philosophy-statement]"
                );

            const verticalLine =
                root.querySelector<HTMLElement>(
                    "[data-philosophy-line]"
                );

            const readingWindow =
                root.querySelector<HTMLElement>(
                    "[data-philosophy-reading-window]"
                );

            const column =
                root.querySelector<HTMLElement>(
                    "[data-philosophy-column]"
                );

            const paragraphs =
                gsap.utils.toArray<HTMLElement>(
                    "[data-philosophy-paragraph]"
                );

            if (
                !stage ||
                !sticky ||
                !readingWindow ||
                !column ||
                !paragraphs.length
            ) {
                return;
            }

            const reducedMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches;

            if (reducedMotion) return;

            /* =====================================================
                HYDRATION-SAFE INITIALIZATION
            ====================================================== */

            const motionTargets = [
                eyebrow,
                ...eyebrowLines,
                statement,
                verticalLine,
                ...paragraphs,
            ].filter(Boolean);

            gsap.set(motionTargets, {
                visibility: "visible",
            });

            /* =====================================================
                INTRO STATES
            ====================================================== */

            gsap.set(eyebrow, {
                autoAlpha: 0,
                y: 12,
            });

            gsap.set(eyebrowLines, {
                scaleX: 0,
            });

            gsap.set(statement, {
                autoAlpha: 0,
                y: 24,
            });

            gsap.set(verticalLine, {
                autoAlpha: 0,
                scaleY: 0,
                transformOrigin: "top center",
            });

            /*
                Paragraphs remain present.

                They are deliberately NOT initialized at opacity 0.

                Their visual depth will be calculated according
                to their physical position inside the chamber.
            */

            gsap.set(paragraphs, {
                autoAlpha: 1,
                scale: 1,
                transformOrigin: "center center",
            });

            /* =====================================================
                INTRO
            ====================================================== */

            const introTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: root,
                    start: "top 70%",
                    once: true,
                },
            });

            introTimeline
                .to(eyebrow, {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "power3.out",
                })
                .to(
                    eyebrowLines,
                    {
                        scaleX: 1,
                        duration: 0.75,
                        ease: "power3.out",
                    },
                    "-=0.48"
                )
                .to(
                    statement,
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 1,
                        ease: "power3.out",
                    },
                    "-=0.4"
                )
                .to(
                    verticalLine,
                    {
                        autoAlpha: 1,
                        scaleY: 1,
                        duration: 0.9,
                        ease: "power2.out",
                    },
                    "-=0.25"
                );

            /* =====================================================
                DEPTH MODEL

                0%  → opacity .45 / scale .90
                30% → opacity 1   / scale 1
                70% → opacity 1   / scale 1
                100%→ opacity .45 / scale .90

                The gradient masks perform the final disappearance.
            ====================================================== */

            const updateParagraphDepth = () => {
                const windowRect =
                    readingWindow.getBoundingClientRect();

                const windowHeight = windowRect.height;

                if (!windowHeight) return;

                paragraphs.forEach((paragraph) => {
                    const rect =
                        paragraph.getBoundingClientRect();

                    const center =
                        rect.top +
                        rect.height / 2 -
                        windowRect.top;

                    const position =
                        center / windowHeight;

                    let opacity = 1;
                    let scale = 1;

                    /* =============================================
                        ABOVE / TOP TRANSITION
                    ============================================== */

                    if (position < 0.3) {
                        const progress =
                            gsap.utils.clamp(
                                0,
                                1,
                                position / 0.3
                            );

                        opacity = gsap.utils.interpolate(
                            0.45,
                            1,
                            progress
                        );

                        scale = gsap.utils.interpolate(
                            0.9,
                            1,
                            progress
                        );
                    }

                    /* =============================================
                        CENTRAL READING BAND — 30% → 70%

                        Full opacity.
                        Full scale.
                    ============================================== */

                    else if (position <= 0.7) {
                        opacity = 1;
                        scale = 1;
                    }

                    /* =============================================
                        LOWER TRANSITION
                    ============================================== */

                    else {
                        const progress =
                            gsap.utils.clamp(
                                0,
                                1,
                                (position - 0.7) / 0.3
                            );

                        opacity = gsap.utils.interpolate(
                            1,
                            0.45,
                            progress
                        );

                        scale = gsap.utils.interpolate(
                            1,
                            0.9,
                            progress
                        );
                    }

                    gsap.set(paragraph, {
                        opacity,
                        scale,
                    });
                });
            };

            /* =====================================================
                COLUMN POSITION
            ====================================================== */

            const getColumnTravel = () => {
                const first = paragraphs[0];
                const last =
                    paragraphs[paragraphs.length - 1];

                const windowHeight =
                    readingWindow.clientHeight;

                /*
                    Start:
                    first paragraph centered around 50%
                    of the reading chamber.
                */

                const startY =
                    windowHeight * 0.5 -
                    (first.offsetTop +
                        first.offsetHeight / 2);

                /*
                    End:
                    last paragraph centered around 50%
                    of the reading chamber.

                    This means the final thought receives the same
                    full reading position as the first.
                */

                const endY =
                    windowHeight * 0.5 -
                    (last.offsetTop +
                        last.offsetHeight / 2);

                return {
                    startY,
                    endY,
                };
            };

            /* =====================================================
                SCROLL-DRIVEN CONTEMPLATION
            ====================================================== */

            let scrollTween: gsap.core.Tween | null = null;

            const buildScrollExperience = () => {
                scrollTween?.kill();

                const { startY, endY } =
                    getColumnTravel();

                gsap.set(column, {
                    y: startY,
                });

                updateParagraphDepth();

                scrollTween = gsap.to(column, {
                    y: endY,

                    /*
                        Linear relationship between physical scroll
                        and column position.

                        No temporal easing.
                    */

                    ease: "none",

                    scrollTrigger: {
                        trigger: stage,

                        /*
                            The reading experience begins after the
                            Philosophy scene has entered the viewport.
                        */

                        start: "top top",

                        /*
                            The end is the natural end of the
                            scroll stage.
                        */

                        end: "bottom bottom",

                        scrub: true,

                        invalidateOnRefresh: true,

                        onUpdate: () => {
                            updateParagraphDepth();
                        },

                        onRefresh: () => {
                            updateParagraphDepth();
                        },
                    },
                });
            };

            buildScrollExperience();

            /* =====================================================
                RESPONSIVE RECALCULATION
            ====================================================== */

            const handleRefresh = () => {
                buildScrollExperience();
            };

            ScrollTrigger.addEventListener(
                "refreshInit",
                handleRefresh
            );

            ScrollTrigger.refresh();

            return () => {
                ScrollTrigger.removeEventListener(
                    "refreshInit",
                    handleRefresh
                );

                scrollTween?.kill();
            };
        }, root);

        return () => {
            ctx.revert();
        };
    }, []);

    return null;
}