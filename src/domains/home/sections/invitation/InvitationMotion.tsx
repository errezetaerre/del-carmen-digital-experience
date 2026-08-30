"use client";

import { useEffect } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function InvitationMotion() {
    useEffect(() => {
        const section = document.querySelector(
            "[data-invitation]",
        );

        if (!section) {
            return;
        }

        const context = gsap.context(() => {
            const prefersReducedMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                ).matches;

            const brand = "[data-invitation-brand]";
            const statement = "[data-invitation-statement]";
            const journey = "[data-invitation-journey]";
            const newsletter = "[data-invitation-newsletter]";
            const actions = "[data-invitation-actions]";

            if (prefersReducedMotion) {
                gsap.set(
                    [
                        brand,
                        statement,
                        journey,
                        newsletter,
                        actions,
                    ],
                    {
                        clearProps: "all",
                    },
                );

                return;
            }

            /*
             * ======================================================
             * 01 — DEL CARMEN
             * ======================================================
             */

            gsap.fromTo(
                brand,
                {
                    autoAlpha: 0,
                    y: 12,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "power2.out",

                    scrollTrigger: {
                        trigger: brand,
                        start: "top 82%",
                        once: true,
                    },
                },
            );

            /*
             * ======================================================
             * 02 — CLOSING STATEMENT
             * ======================================================
             */

            gsap.fromTo(
                statement,
                {
                    autoAlpha: 0,
                    y: 28,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 1.05,
                    ease: "power3.out",

                    scrollTrigger: {
                        trigger: statement,
                        start: "top 80%",
                        once: true,
                    },
                },
            );

            /*
             * ======================================================
             * 03 — CONTINUE THE JOURNEY
             * ======================================================
             */

            gsap.fromTo(
                journey,
                {
                    autoAlpha: 0,
                    y: 20,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power2.out",

                    scrollTrigger: {
                        trigger: journey,
                        start: "top 82%",
                        once: true,
                    },
                },
            );

            /*
             * ======================================================
             * 04 — NEWSLETTER
             * ======================================================
             */

            gsap.fromTo(
                newsletter,
                {
                    autoAlpha: 0,
                    y: 22,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.85,
                    ease: "power2.out",

                    scrollTrigger: {
                        trigger: newsletter,
                        start: "top 84%",
                        once: true,
                    },
                },
            );

            /*
             * ======================================================
             * 05 — ACTIONS
             * ======================================================
             */

            gsap.fromTo(
                actions,
                {
                    autoAlpha: 0,
                    y: 16,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.75,
                    ease: "power2.out",

                    scrollTrigger: {
                        trigger: actions,
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