"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutContinueMotion() {
    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (reducedMotion) {
            gsap.set(".about-continue-motion", {
                visibility: "visible",
            });

            return;
        }

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            /*
             * MOBILE PORTRAIT
             * Narrative sequence:
             * heading -> first path -> second path
             */
            mm.add(
                "(max-width: 767px) and (orientation: portrait)",
                () => {
                    const paths = gsap.utils.toArray<HTMLElement>(
                        ".about-continue-path",
                    );

                    gsap.set(".about-continue-eyebrow", {
                        opacity: 0,
                    });

                    gsap.set(".about-continue-heading", {
                        opacity: 0,
                        y: 18,
                    });

                    gsap.set(".about-continue-line", {
                        scaleX: 0,
                        transformOrigin: "left center",
                    });

                    gsap.set(".about-continue-title", {
                        opacity: 0,
                        x: -12,
                    });

                    gsap.set(".about-continue-copy", {
                        opacity: 0,
                        y: 10,
                    });

                    gsap.set(".about-continue-arrow", {
                        opacity: 0,
                        x: -8,
                    });

                    gsap.set(".about-continue-motion", {
                        visibility: "visible",
                    });

                    const timeline = gsap.timeline({
                        paused: true,
                        defaults: {
                            ease: "power3.out",
                        },
                    });

                    /*
                     * 01 — Section identity
                     */
                    timeline.to(".about-continue-eyebrow", {
                        opacity: 1,
                        duration: 0.5,
                    });

                    /*
                     * 02 — The encounter continues.
                     */
                    timeline.to(".about-continue-heading", {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                    });

                    /*
                     * 03 — First path
                     */
                    if (paths[0]) {
                        timeline
                            .to(
                                paths[0].querySelector(".about-continue-line"),
                                {
                                    scaleX: 1,
                                    duration: 0.65,
                                    ease: "power2.inOut",
                                },
                            )

                            .to(
                                paths[0].querySelector(".about-continue-title"),
                                {
                                    opacity: 1,
                                    x: 0,
                                    duration: 0.65,
                                },
                                "-=0.15",
                            )

                            .to(
                                paths[0].querySelector(".about-continue-copy"),
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.55,
                                },
                                "-=0.25",
                            )

                            .to(
                                paths[0].querySelector(".about-continue-arrow"),
                                {
                                    opacity: 1,
                                    x: 0,
                                    duration: 0.45,
                                },
                                "-=0.2",
                            );
                    }

                    /*
                     * 04 — Second path
                     */
                    if (paths[1]) {
                        timeline
                            .to(
                                paths[1].querySelector(".about-continue-line"),
                                {
                                    scaleX: 1,
                                    duration: 0.65,
                                    ease: "power2.inOut",
                                },
                                "+=0.2",
                            )

                            .to(
                                paths[1].querySelector(".about-continue-title"),
                                {
                                    opacity: 1,
                                    x: 0,
                                    duration: 0.65,
                                },
                                "-=0.15",
                            )

                            .to(
                                paths[1].querySelector(".about-continue-copy"),
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.55,
                                },
                                "-=0.25",
                            )

                            .to(
                                paths[1].querySelector(".about-continue-arrow"),
                                {
                                    opacity: 1,
                                    x: 0,
                                    duration: 0.45,
                                },
                                "-=0.2",
                            );
                    }

                    ScrollTrigger.create({
                        trigger: ".about-continue-pathways",
                        start: "top 58%",
                        once: true,

                        onEnter: () => {
                            timeline.play();
                        },
                    });
                },
            );

            /*
             * TABLET / DESKTOP / MOBILE LANDSCAPE
             * Keep approved behavior unchanged
             */
            mm.add(
                "(min-width: 768px), (orientation: landscape)",
                () => {
                    gsap.set(".about-continue-eyebrow", {
                        opacity: 0,
                    });

                    gsap.set(".about-continue-heading", {
                        opacity: 0,
                        y: 18,
                    });

                    gsap.set(".about-continue-line", {
                        scaleX: 0,
                        transformOrigin: "left center",
                    });

                    gsap.set(".about-continue-title", {
                        opacity: 0,
                        x: -12,
                    });

                    gsap.set(".about-continue-copy", {
                        opacity: 0,
                        y: 10,
                    });

                    gsap.set(".about-continue-arrow", {
                        opacity: 0,
                        x: -8,
                    });

                    gsap.set(".about-continue-motion", {
                        visibility: "visible",
                    });

                    const timeline = gsap.timeline({
                        paused: true,
                        defaults: {
                            ease: "power3.out",
                        },
                    });

                    timeline
                        .to(".about-continue-eyebrow", {
                            opacity: 1,
                            duration: 0.6,
                        })

                        .to(
                            ".about-continue-heading",
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.95,
                            },
                            0.12,
                        )

                        .to(
                            ".about-continue-line",
                            {
                                scaleX: 1,
                                duration: 0.9,
                                stagger: 0.12,
                                ease: "power2.inOut",
                            },
                            0.55,
                        )

                        .to(
                            ".about-continue-title",
                            {
                                opacity: 1,
                                x: 0,
                                duration: 0.8,
                                stagger: 0.14,
                            },
                            0.85,
                        )

                        .to(
                            ".about-continue-copy",
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.75,
                                stagger: 0.12,
                            },
                            1.05,
                        )

                        .to(
                            ".about-continue-arrow",
                            {
                                opacity: 1,
                                x: 0,
                                duration: 0.65,
                                stagger: 0.12,
                            },
                            1.2,
                        );

                    ScrollTrigger.create({
                        trigger: ".about-continue-pathways",
                        start: "top 58%",
                        once: true,

                        onEnter: () => {
                            timeline.play();
                        },
                    });
                },
            );

            return () => {
                mm.revert();
            };
        }, ".about-continue-scene");

        return () => {
            ctx.revert();
        };
    }, []);

    return null;
}