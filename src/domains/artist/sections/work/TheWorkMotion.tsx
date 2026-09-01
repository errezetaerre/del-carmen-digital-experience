"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TheWorkMotion() {
    useLayoutEffect(() => {
        const root =
            document.querySelector<HTMLElement>("#the-work");

        if (!root) return;

        const ctx = gsap.context(() => {
            const eyebrow =
                root.querySelector<HTMLElement>(
                    "[data-work-eyebrow]"
                );

            const title =
                root.querySelector<HTMLElement>(
                    "[data-work-title]"
                );

            const copy =
                gsap.utils.toArray<HTMLElement>(
                    root.querySelectorAll("[data-work-copy]")
                );

            const cta =
                root.querySelector<HTMLElement>(
                    "[data-work-cta]"
                );

            const artwork =
                root.querySelector<HTMLElement>(
                    "[data-work-artwork]"
                );

            const reducedMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches;

            if (reducedMotion) {
                gsap.set(
                    [
                        eyebrow,
                        title,
                        ...copy,
                        cta,
                        artwork,
                    ],
                    {
                        clearProps: "all",
                    }
                );

                return;
            }

            /* =============================================
                TEXT
            ============================================== */

            if (eyebrow) {
                gsap.fromTo(
                    eyebrow,
                    {
                        autoAlpha: 0,
                        y: 14,
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.65,
                        ease: "power2.out",

                        scrollTrigger: {
                            trigger: eyebrow,
                            start: "top 84%",
                            once: true,
                        },
                    }
                );
            }

            if (title) {
                gsap.fromTo(
                    title,
                    {
                        autoAlpha: 0,
                        y: 28,
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.95,
                        ease: "power2.out",

                        scrollTrigger: {
                            trigger: title,
                            start: "top 80%",
                            once: true,
                        },
                    }
                );
            }

            copy.forEach((paragraph) => {
                gsap.fromTo(
                    paragraph,
                    {
                        autoAlpha: 0,
                        y: 20,
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out",

                        scrollTrigger: {
                            trigger: paragraph,
                            start: "top 84%",
                            once: true,
                        },
                    }
                );
            });

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
                            start: "top 88%",
                            once: true,
                        },
                    }
                );
            }

            /* =============================================
                ARTWORK

                Independent, slower reveal.
            ============================================== */

            if (artwork) {
                gsap.fromTo(
                    artwork,
                    {
                        autoAlpha: 0,
                        y: 34,
                        scale: 0.985,
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        scale: 1,
                        duration: 1.35,
                        ease: "power2.out",

                        scrollTrigger: {
                            trigger: artwork,
                            start: "top 82%",
                            once: true,
                        },
                    }
                );
            }

            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
            });
        }, root);

        return () => {
            ctx.revert();
        };
    }, []);

    return null;
}