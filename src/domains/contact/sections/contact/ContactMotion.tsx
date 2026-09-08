"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";

export default function ContactMotion() {
    useLayoutEffect(() => {
        const context = gsap.context(() => {
            const reducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            if (reducedMotion) {
                gsap.set(".contact-motion", {
                    visibility: "visible",
                });

                gsap.set(
                    [
                        ".contact-eyebrow",
                        ".contact-title-line-1",
                        ".contact-title-line-2",
                        ".contact-intro",
                        ".contact-form-motion",
                    ],
                    {
                        clearProps: "all",
                    }
                );

                return;
            }

            /*
             * Initial state
             */

            gsap.set(".contact-motion", {
                visibility: "visible",
            });

            gsap.set(".contact-form-motion", {
                opacity: 0,
                y: 28,
            });

            /*
             * Editorial entrance
             */

            const timeline = gsap.timeline({
                defaults: {
                    ease: "power3.out",
                },
            });

            timeline
                .from(".contact-eyebrow", {
                    opacity: 0,
                    y: 10,
                    duration: 0.5,
                })

                .from(
                    ".contact-title-line-1",
                    {
                        opacity: 0,
                        y: 30,
                        duration: 0.75,
                    },
                    "-=0.18"
                )

                .from(
                    ".contact-title-line-2",
                    {
                        opacity: 0,
                        y: 34,
                        duration: 0.85,
                    },
                    "-=0.5"
                )

                .from(
                    ".contact-intro",
                    {
                        opacity: 0,
                        y: 14,
                        duration: 0.65,
                    },
                    "-=0.38"
                )

                /*
                 * Form enters after the invitation has been established.
                 */

                .to(
                    ".contact-form-motion",
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        ease: "power2.out",
                    },
                    "-=0.32"
                );
        });

        return () => {
            context.revert();
        };
    }, []);

    return null;
}