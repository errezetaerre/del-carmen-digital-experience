"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TheArtistMotion() {
    useLayoutEffect(() => {
        const root = document.querySelector<HTMLElement>("#the-artist");

        if (!root) return;

        const ctx = gsap.context(() => {
            const divider = root.querySelector("[data-the-artist-divider]");
            const eyebrow = root.querySelector("[data-the-artist-eyebrow]");

            const titleLines = gsap.utils.toArray<HTMLElement>(
                "[data-the-artist-title-line]"
            );

            const paragraphs = gsap.utils.toArray<HTMLElement>(
                "[data-the-artist-paragraph]"
            );

            const highlight = root.querySelector<HTMLElement>(
                "[data-the-artist-highlight]"
            );

            const reducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            const targets = [
                divider,
                eyebrow,
                ...titleLines,
                ...paragraphs,
                highlight,
            ].filter(Boolean);

            /*
             * Reveal elements once JS is ready.
             */
            gsap.set(targets, {
                visibility: "visible",
            });

            if (reducedMotion) {
                gsap.set(targets, {
                    clearProps: "opacity,transform",
                });

                return;
            }

            /* =====================================================
                INITIAL STATES
            ====================================================== */

            gsap.set(divider, {
                autoAlpha: 0,
                scaleX: 0,
                transformOrigin: "center center",
            });

            gsap.set(eyebrow, {
                autoAlpha: 0,
                y: 14,
            });

            /*
             * Title:
             * subtle movement from LEFT
             */
            gsap.set(titleLines, {
                autoAlpha: 0,
                x: -10,
            });

            /*
             * Narrative:
             * subtle movement from RIGHT
             */
            gsap.set(paragraphs, {
                autoAlpha: 0,
                x: 10,
            });

            gsap.set(highlight, {
                autoAlpha: 0,
                x: 10,
            });

            /* =====================================================
                DIVIDER
            ====================================================== */

            gsap.to(divider, {
                autoAlpha: 1,
                scaleX: 1,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: divider,
                    start: "top 88%",
                    once: true,
                },
            });

            /* =====================================================
                EYEBROW
            ====================================================== */

            gsap.to(eyebrow, {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: eyebrow,
                    start: "top 88%",
                    once: true,
                },
            });

            /* =====================================================
                TITLE — SINGLE SCROLL EVENT / LINE SWEEP
            ====================================================== */

            if (titleLines.length) {
                gsap.to(titleLines, {
                    autoAlpha: 1,
                    x: 0,
                    duration: 0.9,
                    stagger: 0.1,
                    ease: "power3.out",

                    scrollTrigger: {
                        trigger: titleLines[0],
                        start: "top 78%",
                        once: true,
                    },
                });
            }

            /* =====================================================
                NARRATIVE PARAGRAPHS

                Each paragraph continues to respond to its own
                physical scroll position.
            ====================================================== */

            paragraphs.forEach((paragraph) => {
                gsap.to(paragraph, {
                    autoAlpha: 1,
                    x: 0,
                    duration: 0.9,
                    ease: "power3.out",

                    scrollTrigger: {
                        trigger: paragraph,
                        start: "top 84%",
                        once: true,
                    },
                });
            });

            /* =====================================================
                HIGHLIGHT
            ====================================================== */

            if (highlight) {
                gsap.to(highlight, {
                    autoAlpha: 1,
                    x: 0,
                    duration: 1,
                    ease: "power3.out",

                    scrollTrigger: {
                        trigger: highlight,
                        start: "top 74%",
                        once: true,
                    },
                });
            }
        }, root);

        return () => {
            ctx.revert();
        };
    }, []);

    return null;
}