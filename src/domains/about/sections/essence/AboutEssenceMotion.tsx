"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutEssenceMotion() {
    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (reducedMotion) {
            gsap.set(".about-essence-motion", {
                visibility: "visible",
            });

            return;
        }

        const ctx = gsap.context(() => {
            /*
             * Establish the initial state while the entire scene
             * is still protected by visibility:hidden in CSS.
             */
            gsap.set(".about-essence-rule", {
                scaleX: 0,
                transformOrigin: "left center",
            });

            gsap.set(".about-essence-eyebrow", {
                opacity: 0,
                y: 10,
            });

            gsap.set(".about-essence-word", {
                opacity: 0.16,
            });

            gsap.set(".about-essence-copy", {
                opacity: 0,
                y: 18,
            });

            /*
             * GSAP has established all initial states.
             * The wrapper can now safely exist in the document.
             */
            gsap.set(".about-essence-motion", {
                visibility: "visible",
            });

            const timeline = gsap.timeline({
                paused: true,
            });

            timeline
                .to(".about-essence-rule", {
                    scaleX: 1,
                    duration: 1,
                    ease: "power3.out",
                })

                .to(
                    ".about-essence-eyebrow",
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power3.out",
                    },
                    0.15,
                )

                .to(
                    ".about-essence-word",
                    {
                        opacity: 1,
                        duration: 0.9,
                        stagger: 0.075,
                        ease: "power2.out",
                    },
                    0.35,
                )

                .to(
                    ".about-essence-copy",
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power3.out",
                    },
                    "-=0.35",
                );

            ScrollTrigger.create({
                trigger: ".about-essence-content",

                // El headline debe haber entrado bastante en pantalla.
                start: "top 75%",

                once: true,

                onEnter: () => {
                    timeline.play();
                },

                // Para probar visualmente el trigger:
                // markers: true,
            });
        }, ".about-essence-scene");

        return () => {
            ctx.revert();
        };
    }, []);

    return null;
}