"use client";

import { useEffect } from "react";

import gsap from "gsap";

const PARALLAX_STRENGTH = 0.55;

export default function JournalIndexMotion() {
    useEffect(() => {
        const section =
            document.querySelector<HTMLElement>(
                "[data-journal-index]",
            );

        if (!section) {
            return;
        }

        const prefersReducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches;

        /*
         * ========================================
         * INTRO
         * ========================================
         */

        const context = gsap.context(() => {
            const intro =
                section.querySelector<HTMLElement>(
                    "[data-journal-index-intro]",
                );

            if (!intro || prefersReducedMotion) {
                return;
            }

            gsap.fromTo(
                intro,
                {
                    autoAlpha: 0,
                    y: 42,
                    filter: "blur(12px)",
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 1.8,
                    ease: "power3.out",
                },
            );
        }, section);

        /*
         * ========================================
         * IMAGE PLANES
         * ========================================
         */

        const mediaElements =
            Array.from(
                section.querySelectorAll<HTMLElement>(
                    "[data-journal-index-media]",
                ),
            );

        const planes = mediaElements
            .map((media) => {
                const plane =
                    media.querySelector<HTMLElement>(
                        "[data-journal-index-image-plane]",
                    );

                if (!plane) {
                    return null;
                }

                return {
                    media,
                    plane,
                    setY: gsap.quickSetter(
                        plane,
                        "y",
                        "px",
                    ),
                };
            })
            .filter(
                (
                    item,
                ): item is {
                    media: HTMLElement;
                    plane: HTMLElement;
                    setY: (
                        value: number,
                    ) => void;
                } => item !== null,
            );

        let frameId: number | null = null;

        /*
         * ========================================
         * PARALLAX
         * ========================================
         *
         * No accumulated scroll delta.
         * No easing.
         * No interpolation.
         *
         * Every frame is derived directly from
         * the media window's current position.
         */

        const render = () => {
            frameId = null;

            if (prefersReducedMotion) {
                return;
            }

            const viewportHeight =
                window.innerHeight;

            planes.forEach(
                ({
                    media,
                    setY,
                }) => {
                    const rect =
                        media.getBoundingClientRect();



                    /*
                     * progress:
                     *
                     * -1 = media below viewport center
                     *  0 = media centered
                     *  1 = media above viewport center
                     */

                    const mediaCenter =
                        rect.top +
                        rect.height / 2;

                    const viewportCenter =
                        viewportHeight / 2;

                    const distance =
                        viewportCenter -
                        mediaCenter;

                    const offset =
                        distance *
                        PARALLAX_STRENGTH;

                    setY(offset);
                },
            );
        };

        const requestRender = () => {
            if (
                prefersReducedMotion ||
                frameId !== null
            ) {
                return;
            }

            frameId =
                window.requestAnimationFrame(
                    render,
                );
        };

        if (!prefersReducedMotion) {
            render();

            window.addEventListener(
                "scroll",
                requestRender,
                {
                    passive: true,
                },
            );

            window.addEventListener(
                "resize",
                requestRender,
            );
        }

        return () => {
            context.revert();

            window.removeEventListener(
                "scroll",
                requestRender,
            );

            window.removeEventListener(
                "resize",
                requestRender,
            );

            if (frameId !== null) {
                window.cancelAnimationFrame(
                    frameId,
                );
            }
        };
    }, []);

    return null;
}