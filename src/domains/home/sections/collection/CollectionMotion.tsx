"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CollectionMotion() {
    useEffect(() => {
        const section = document.querySelector(
            "[data-featured-collection]",
        );

        if (!section) {
            return;
        }

        const context = gsap.context(() => {
            const prefersReducedMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                ).matches;

            const eyebrow =
                "[data-collection-eyebrow]";

            const title =
                "[data-collection-title]";

            const description =
                "[data-collection-description]";

            const metadata =
                "[data-collection-metadata]";

            const cta =
                "[data-collection-cta]";

            const visual =
                "[data-collection-visual]";

            if (prefersReducedMotion) {
                gsap.set(
                    [
                        eyebrow,
                        title,
                        description,
                        metadata,
                        cta,
                        visual,
                    ],
                    {
                        clearProps: "all",
                    },
                );

                return;
            }

            /*
             * ======================================================
             * 01 — EDITORIAL INTRODUCTION
             *
             * The collection introduces itself before
             * revealing its visual world.
             * ======================================================
             */

            gsap
                .timeline({
                    defaults: {
                        ease: "power3.out",
                    },

                    scrollTrigger: {
                        trigger: section,
                        start: "top 68%",
                        once: true,
                    },
                })
                .fromTo(
                    eyebrow,
                    {
                        autoAlpha: 0,
                        y: 14,
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.65,
                    },
                )
                .fromTo(
                    title,
                    {
                        autoAlpha: 0,
                        y: 24,
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.9,
                    },
                    "-=0.35",
                )
                .fromTo(
                    description,
                    {
                        autoAlpha: 0,
                        y: 18,
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.8,
                    },
                    "-=0.3",
                )
                .fromTo(
                    metadata,
                    {
                        autoAlpha: 0,
                        y: 14,
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.7,
                    },
                    "-=0.25",
                )
                .fromTo(
                    cta,
                    {
                        autoAlpha: 0,
                        y: 12,
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.65,
                    },
                    "-=0.2",
                );

            /*
             * ======================================================
             * 02 — COLLECTION VISUAL
             *
             * Independent scroll event.
             *
             * The visitor must continue downward before the
             * featured series visual enters the scene.
             * ======================================================
             */

            gsap.fromTo(
                visual,
                {
                    autoAlpha: 0,
                    y: 36,
                    scale: 0.985,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: "power2.out",

                    scrollTrigger: {
                        trigger: visual,
                        start: "top 78%",
                        once: true,
                    },
                },
            );
        }, section);

        return () => {
            context.revert();
        };
    }, []);

    return null;
}