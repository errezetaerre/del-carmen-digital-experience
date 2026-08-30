"use client";

import { useEffect } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

export default function JournalPreviewMotion() {
    useEffect(() => {
        const section = document.querySelector(
            "[data-journal-preview]",
        );

        if (!section) {
            return;
        }

        const context = gsap.context(() => {
            const prefersReducedMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                ).matches;

            const eyebrow = "[data-journal-eyebrow]";
            const title = "[data-journal-title]";

            const entries =
                gsap.utils.toArray<HTMLElement>(
                    "[data-journal-entry]",
                );

            if (prefersReducedMotion) {
                gsap.set(
                    [
                        eyebrow,
                        title,
                        "[data-journal-image]",
                        "[data-journal-heading]",
                        "[data-journal-copy]",
                        "[data-journal-cta]",
                    ],
                    {
                        clearProps: "all",
                    },
                );

                return;
            }

            /*
             * ======================================================
             * 01 — JOURNAL INTRODUCTION
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
                        y: 26,
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.95,
                    },
                    "-=0.35",
                );

            /*
             * ======================================================
             * 02 — JOURNAL ENTRIES
             *
             * Every article owns its own scroll narrative.
             * ======================================================
             */

            entries.forEach((entry) => {
                const image = entry.querySelector(
                    "[data-journal-image]",
                );

                const heading = entry.querySelector(
                    "[data-journal-heading]",
                );

                const copy = entry.querySelector(
                    "[data-journal-copy]",
                );

                const cta = entry.querySelector(
                    "[data-journal-cta]",
                );

                if (image) {
                    gsap.fromTo(
                        image,
                        {
                            autoAlpha: 0,
                            y: 30,
                            scale: 0.99,
                        },
                        {
                            autoAlpha: 1,
                            y: 0,
                            scale: 1,
                            duration: 1.1,
                            ease: "power2.out",

                            scrollTrigger: {
                                trigger: image,
                                start: "top 84%",
                                once: true,
                            },
                        },
                    );
                }

                if (heading) {
                    gsap.fromTo(
                        heading,
                        {
                            autoAlpha: 0,
                            y: 20,
                        },
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.85,
                            ease: "power3.out",

                            scrollTrigger: {
                                trigger: heading,
                                start: "top 82%",
                                once: true,
                            },
                        },
                    );
                }

                if (copy) {
                    gsap.fromTo(
                        copy,
                        {
                            autoAlpha: 0,
                            y: 18,
                        },
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power2.out",

                            scrollTrigger: {
                                trigger: copy,
                                start: "top 86%",
                                once: true,
                            },
                        },
                    );
                }

                if (cta) {
                    gsap.fromTo(
                        cta,
                        {
                            autoAlpha: 0,
                            y: 14,
                        },
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.7,
                            ease: "power2.out",

                            scrollTrigger: {
                                trigger: cta,
                                start: "top 90%",
                                once: true,
                            },
                        },
                    );
                }
            });
        }, section);

        return () => {
            context.revert();
        };
    }, []);

    return null;
}