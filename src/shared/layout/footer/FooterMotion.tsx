"use client";

import { useEffect } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FooterMotion() {
    useEffect(() => {
        const footer = document.querySelector(
            "[data-footer]",
        );

        if (!footer) {
            return;
        }

        const context = gsap.context(() => {
            const prefersReducedMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                ).matches;

            const line = "[data-footer-line]";
            const identity = "[data-footer-identity]";
            const secondary = "[data-footer-secondary]";
            const copyright = "[data-footer-copyright]";

            if (prefersReducedMotion) {
                gsap.set(
                    [
                        line,
                        identity,
                        secondary,
                        copyright,
                    ],
                    {
                        clearProps: "all",
                    },
                );

                return;
            }

            /*
             * ======================================================
             * 01 — CLOSING LINE
             * ======================================================
             */

            gsap.fromTo(
                line,
                {
                    scaleX: 0,
                    transformOrigin: "center center",
                    autoAlpha: 0,
                },
                {
                    scaleX: 1,
                    autoAlpha: 1,
                    duration: 1.1,
                    ease: "power2.out",

                    scrollTrigger: {
                        trigger: footer,
                        start: "top 92%",
                        once: true,
                    },
                },
            );

            /*
             * ======================================================
             * 02 — FOOTER CONTENT
             * ======================================================
             */

            gsap.fromTo(
                identity,
                {
                    autoAlpha: 0,
                    y: 20,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.85,
                    ease: "power2.out",

                    scrollTrigger: {
                        trigger: identity,
                        start: "top 88%",
                        once: true,
                    },
                },
            );

            gsap.fromTo(
                secondary,
                {
                    autoAlpha: 0,
                    y: 20,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.85,
                    ease: "power2.out",

                    scrollTrigger: {
                        trigger: secondary,
                        start: "top 88%",
                        once: true,
                    },
                },
            );

            /*
             * ======================================================
             * 03 — COPYRIGHT
             * ======================================================
             */

            gsap.fromTo(
                copyright,
                {
                    autoAlpha: 0,
                    y: 14,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.75,
                    ease: "power2.out",

                    scrollTrigger: {
                        trigger: copyright,
                        start: "top 92%",
                        once: true,
                    },
                },
            );
        }, footer);

        return () => {
            context.revert();
        };
    }, []);

    return null;
}