"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";

export default function ArtistHeroMotion() {
    useLayoutEffect(() => {
        const root = document.querySelector<HTMLElement>("#artist-hero");

        if (!root) return;

        const ctx = gsap.context(() => {
            const media = root.querySelector("[data-artist-hero-media]");
            const eyebrow = root.querySelector("[data-artist-hero-eyebrow]");
            const name = root.querySelector("[data-artist-hero-name]");
            const statement = root.querySelector(
                "[data-artist-hero-statement]"
            );
            const supporting = root.querySelector(
                "[data-artist-hero-supporting]"
            );
            const divider = root.querySelector(
                "[data-artist-hero-divider]"
            );
            const scroll = root.querySelector(
                "[data-artist-hero-scroll]"
            );

            const motionTargets = [
                media,
                eyebrow,
                name,
                statement,
                divider,
                supporting,
                scroll,
            ].filter(Boolean);

            const reducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            /*
             * CSS keeps motion elements hidden before hydration.
             * Once JavaScript is ready, reveal them.
             */
            gsap.set(motionTargets, {
                visibility: "visible",
            });
            gsap.set(divider, {
                autoAlpha: 0,
                scaleX: 0,
                transformOrigin: "left center",
            });

            if (reducedMotion) {
                gsap.set(motionTargets, {
                    clearProps: "opacity,transform",
                });

                return;
            }

            /*
             * Initial states
             */
            gsap.set(media, {
                autoAlpha: 0,
                scale: 1.015,
                transformOrigin: "center center",
            });

            gsap.set(eyebrow, {
                autoAlpha: 0,
                y: 12,
            });

            gsap.set(name, {
                autoAlpha: 0,
                y: 24,
            });

            gsap.set(statement, {
                autoAlpha: 0,
                y: 18,
            });

            gsap.set(supporting, {
                autoAlpha: 0,
                y: 14,
            });

            gsap.set(scroll, {
                autoAlpha: 0,
                y: 10,
            });

            /*
             * Opening sequence
             */
            const tl = gsap.timeline({
                defaults: {
                    ease: "power3.out",
                },
            });

            tl.to(media, {
                autoAlpha: 1,
                scale: 1,
                duration: 1.35,
                ease: "power2.out",
            })

                .to(
                    eyebrow,
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.65,
                    },
                    0.25
                )

                .to(
                    name,
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.95,
                    },
                    0.42
                )

                .to(
                    statement,
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.85,
                    },
                    0.67
                )

                .to(
                    divider,
                    {
                        autoAlpha: 1,
                        scaleX: 1,
                        duration: 0.8,
                        ease: "power2.out",
                    },
                    0.82
                )

                .to(
                    supporting,
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.75,
                    },
                    0.88
                )

                .to(
                    scroll,
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.65,
                    },
                    1.03
                );
        }, root);

        return () => {
            ctx.revert();
        };
    }, []);

    return null;
}