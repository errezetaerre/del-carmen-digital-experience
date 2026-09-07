"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutEcosystemMotion() {
    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (reducedMotion) {
            gsap.set(".about-ecosystem-motion", {
                visibility: "visible",
            });

            return;
        }

        const ctx = gsap.context(() => {
            /*
             * Initial states are established while the wrapper
             * remains protected by CSS.
             */
            gsap.set(".about-ecosystem-eyebrow", {
                opacity: 0,
            });

            gsap.set(".about-ecosystem-heading", {
                opacity: 0,
                y: 18,
            });

            gsap.set(".about-ecosystem-parent", {
                opacity: 0,
                y: 12,
            });

            gsap.set(".about-ecosystem-line-parent", {
                scaleY: 0,
            });

            gsap.set(".about-ecosystem-line-horizontal", {
                scaleX: 0,
            });

            gsap.set(
                [
                    ".about-ecosystem-line-left",
                    ".about-ecosystem-line-right",
                ],
                {
                    scaleY: 0,
                },
            );

            gsap.set(".about-ecosystem-child", {
                opacity: 0,
                y: 18,
            });

            /*
             * Safe to expose the scene now.
             */
            gsap.set(".about-ecosystem-motion", {
                visibility: "visible",
            });

            const timeline = gsap.timeline({
                paused: true,
                defaults: {
                    ease: "power3.out",
                },
            });

            timeline
                /*
                 * 01 — Context
                 */
                .to(".about-ecosystem-eyebrow", {
                    opacity: 1,
                    duration: 0.65,
                })

                .to(
                    ".about-ecosystem-heading",
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                    },
                    0.12,
                )

                /*
                 * 02 — Parent identity
                 */
                .to(
                    ".about-ecosystem-parent",
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.85,
                    },
                    0.45,
                )

                /*
                 * 03 — Architecture is constructed
                 */
                .to(
                    ".about-ecosystem-line-parent",
                    {
                        scaleY: 1,
                        duration: 0.45,
                        ease: "power2.inOut",
                    },
                    0.9,
                )

                .to(
                    ".about-ecosystem-line-horizontal",
                    {
                        scaleX: 1,
                        duration: 0.65,
                        ease: "power2.inOut",
                    },
                    1.2,
                )

                .to(
                    [
                        ".about-ecosystem-line-left",
                        ".about-ecosystem-line-right",
                    ],
                    {
                        scaleY: 1,
                        duration: 0.45,
                        ease: "power2.inOut",
                    },
                    1.65,
                )

                /*
                 * 04 — Two expressions emerge
                 */
                .to(
                    ".about-ecosystem-child",
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.85,
                        stagger: 0.14,
                    },
                    1.85,
                );

            ScrollTrigger.create({
                trigger: ".about-ecosystem-architecture",
                start: "top 62%",
                once: true,

                onEnter: () => {
                    timeline.play();
                },

                // markers: true,
            });
        }, ".about-ecosystem-scene");

        return () => {
            ctx.revert();
        };
    }, []);

    return null;
}