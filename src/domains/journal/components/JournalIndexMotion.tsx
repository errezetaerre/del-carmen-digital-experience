"use client";

import { useEffect } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function JournalIndexMotion() {
    useEffect(() => {
        const section = document.querySelector("[data-journal-index]");

        if (!section) {
            return;
        }

        const context = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches;

            const intro = "[data-journal-index-intro]";

            const entries = gsap.utils.toArray<HTMLElement>(
                "[data-journal-index-entry]",
            );

            if (prefersReducedMotion) {
                gsap.set(
                    [
                        intro,
                        "[data-journal-index-media]",
                        "[data-journal-index-content]",
                    ],
                    {
                        clearProps: "all",
                    },
                );

                return;
            }

            gsap.fromTo(
                intro,
                {
                    autoAlpha: 0,
                    y: 28,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                },
            );

            entries.forEach((entry) => {
                const media = entry.querySelector(
                    "[data-journal-index-media]",
                );

                const content = entry.querySelector(
                    "[data-journal-index-content]",
                );

                if (media) {
                    gsap.fromTo(
                        media,
                        {
                            autoAlpha: 0,
                            scale: 1.025,
                        },
                        {
                            autoAlpha: 1,
                            scale: 1,
                            duration: 1.2,
                            ease: "power2.out",

                            scrollTrigger: {
                                trigger: entry,
                                start: "top 82%",
                                once: true,
                            },
                        },
                    );
                }

                if (content) {
                    gsap.fromTo(
                        content,
                        {
                            autoAlpha: 0,
                            y: 24,
                        },
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.9,
                            ease: "power3.out",

                            scrollTrigger: {
                                trigger: entry,
                                start: "top 76%",
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