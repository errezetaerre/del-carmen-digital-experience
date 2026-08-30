"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SelectedWorksMotion() {
    useEffect(() => {
        const section = document.querySelector(
            "[data-selected-works]",
        );

        if (!section) {
            return;
        }

        const context = gsap.context(() => {
            const prefersReducedMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                ).matches;

            const eyebrow = "[data-selected-eyebrow]";
            const title = "[data-selected-title]";
            const description = "[data-selected-description]";
            const cta = "[data-selected-cta]";

            if (prefersReducedMotion) {
                gsap.set(
                    [eyebrow, title, description, cta],
                    {
                        clearProps: "all",
                    },
                );

                return;
            }

            /*
             * ======================================================
             * 01 — EDITORIAL INTRODUCTION
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
                );

            /*
             * ======================================================
             * 03 — VIEW ALL WORKS
             *
             * Independent from the gallery.
             * ======================================================
             */

            gsap.fromTo(
                cta,
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
                        trigger: cta,
                        start: "top 88%",
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