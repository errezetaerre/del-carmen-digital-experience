"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";

export default function AboutHeroMotion() {
    useLayoutEffect(() => {
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (reducedMotion) {
            return;
        }

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            /*
             * MOBILE PORTRAIT
             * Sequential reveal
             */
            mm.add(
                "(max-width: 767px) and (orientation: portrait)",
                () => {
                    gsap.set(".about-hero-media", {
                        scale: 1.04,
                        opacity: 0,
                    });

                    gsap.set(".about-hero-eyebrow", {
                        opacity: 0,
                        y: 8,
                    });

                    gsap.set(".about-hero-line-inner", {
                        yPercent: 115,
                    });

                    gsap.set(".about-hero-copy", {
                        opacity: 0,
                        y: 14,
                    });

                    gsap.set(".about-hero-film-cta", {
                        opacity: 0,
                        scale: 0.9,
                    });

                    gsap.set(".about-hero-light", {
                        opacity: 0,
                        scale: 0.9,
                    });

                    const timeline = gsap.timeline({
                        defaults: {
                            ease: "power3.out",
                        },
                    });

                    timeline
                        /*
                         * 01 — Background
                         */
                        .to(".about-hero-media", {
                            opacity: 1,
                            scale: 1,
                            duration: 1.15,
                            ease: "power2.out",
                        })

                        /*
                         * 02 — Eyebrow
                         */
                        .to(".about-hero-eyebrow", {
                            opacity: 1,
                            y: 0,
                            duration: 0.55,
                        })

                        /*
                         * 03 — First headline line
                         */
                        .to(
                            ".about-hero-line-inner",
                            {
                                yPercent: 0,
                                duration: 0.85,
                                stagger: 0.32,
                            },
                        )

                        /*
                         * 04 — Supporting copy
                         */
                        .to(".about-hero-copy", {
                            opacity: 1,
                            y: 0,
                            duration: 0.7,
                        })

                        /*
                         * 05 — Play
                         */
                        .to(".about-hero-film-cta", {
                            opacity: 1,
                            scale: 1,
                            duration: 0.65,
                            ease: "back.out(1.35)",
                        })

                        /*
                         * Atmospheric light after content
                         */
                        .to(
                            ".about-hero-light",
                            {
                                opacity: 0.24,
                                scale: 1,
                                duration: 1.2,
                                ease: "power2.out",
                            },
                            "-=0.45",
                        );
                },
            );

            /*
             * TABLET / DESKTOP / MOBILE LANDSCAPE
             * Keep the approved cinematic behavior
             */
            mm.add(
                "(min-width: 768px), (orientation: landscape)",
                () => {
                    gsap.set(".about-hero-media", {
                        scale: 1.04,
                        opacity: 0,
                    });

                    gsap.set(".about-hero-eyebrow", {
                        opacity: 0,
                    });

                    gsap.set(".about-hero-line-inner", {
                        yPercent: 110,
                    });

                    gsap.set(".about-hero-copy", {
                        opacity: 0,
                        y: 10,
                    });

                    gsap.set(".about-hero-film-cta", {
                        opacity: 0,
                        y: 10,
                    });

                    gsap.set(".about-hero-light", {
                        opacity: 0,
                        xPercent: 0,
                        scale: 0.85,
                    });

                    const timeline = gsap.timeline({
                        defaults: {
                            ease: "power3.out",
                        },
                    });

                    timeline
                        .to(".about-hero-media", {
                            opacity: 1,
                            scale: 1,
                            duration: 1.6,
                            ease: "power2.out",
                        })

                        .to(
                            ".about-hero-light",
                            {
                                opacity: 1,
                                xPercent: 135,
                                scale: 1.1,
                                duration: 2.7,
                                ease: "power2.inOut",
                            },
                            0.1,
                        )

                        .to(
                            ".about-hero-eyebrow",
                            {
                                opacity: 1,
                                duration: 0.65,
                            },
                            0.3,
                        )

                        .to(
                            ".about-hero-line-inner",
                            {
                                yPercent: 0,
                                duration: 1.1,
                                stagger: 0.15,
                            },
                            0.45,
                        )

                        .to(
                            ".about-hero-copy",
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.85,
                            },
                            1.2,
                        )

                        .to(
                            ".about-hero-film-cta",
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.8,
                            },
                            1.45,
                        )

                        .to(
                            ".about-hero-light",
                            {
                                opacity: 0.22,
                                duration: 1.4,
                            },
                            1.8,
                        );
                },
            );

            return () => {
                mm.revert();
            };
        }, ".about-hero-scene");

        return () => {
            ctx.revert();
        };
    }, []);

    return null;
}