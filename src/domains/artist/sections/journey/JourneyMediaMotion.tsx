"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";

export default function JourneyMediaMotion() {
    useLayoutEffect(() => {
        const root =
            document.querySelector<HTMLElement>(
                "[data-journey-media]"
            );

        if (!root) return;

        const ctx = gsap.context(() => {
            const track =
                root.querySelector<HTMLElement>(
                    "[data-journey-media-track]"
                );

            if (!track) return;

            const reducedMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches;

            if (reducedMotion) {
                gsap.set(track, {
                    clearProps: "transform",
                });

                return;
            }

            const getDistance = () => {
                const overflow =
                    track.scrollWidth - root.clientWidth;

                if (overflow <= 0) {
                    return 0;
                }

                return Math.min(
                    overflow * 0.42,
                    window.innerWidth * 1.5
                );
            };

            gsap.set(track, {
                x: 0,
                willChange: "transform",
            });

            gsap.to(track, {
                x: () => -getDistance(),

                duration: 24,

                ease: "none",

                repeat: -1,

                yoyo: true,

                repeatRefresh: true,
            });
        }, root);

        return () => {
            ctx.revert();
        };
    }, []);

    return null;
}