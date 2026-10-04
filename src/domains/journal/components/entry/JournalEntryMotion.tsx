"use client";

import { useEffect } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function JournalEntryMotion() {
    useEffect(() => {
        const root = document.querySelector(
            "[data-journal-entry-experience]",
        );

        if (!root) {
            return;
        }

        const context = gsap.context(() => {
            const reducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches;

            const hero =
                root.querySelector<HTMLElement>(
                    "[data-journal-entry-hero]",
                );

            const scenes =
                gsap.utils.toArray<HTMLElement>(
                    "[data-journal-scene]",
                    root,
                );

            const journalCollection =
                root.querySelector<HTMLElement>(
                    "[data-journal-collection]",
                );

            const journalCollectionViewport =
                root.querySelector<HTMLElement>(
                    "[data-journal-collection-viewport]",
                );

            if (reducedMotion) {
                gsap.set(
                    [
                        hero,
                        journalCollection,
                        journalCollectionViewport,
                        ...root.querySelectorAll(
                            "[data-journal-scene-media]",
                        ),
                        ...root.querySelectorAll(
                            "[data-journal-scene-copy]",
                        ),
                        ...root.querySelectorAll(
                            "[data-journal-scene-light]",
                        ),
                        ...root.querySelectorAll(
                            "[data-journal-scene-light-core]",
                        ),
                        ...root.querySelectorAll(
                            "[data-journal-scene-light-haze]",
                        ),
                    ],
                    {
                        clearProps: "all",
                    },
                );

                return;
            }

            /*
             * HERO
             */
            if (hero) {
                gsap.fromTo(
                    hero,
                    {
                        autoAlpha: 0,
                        y: 42,
                        filter: "blur(12px)",
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 2,
                        ease: "power3.out",
                    },
                );
            }

            /*
             * SCENES
             */
            scenes.forEach((scene) => {
                const media =
                    scene.querySelector<HTMLElement>(
                        "[data-journal-scene-media]",
                    );

                const copy =
                    scene.querySelector<HTMLElement>(
                        "[data-journal-scene-copy]",
                    );

                const light =
                    scene.querySelector<HTMLElement>(
                        "[data-journal-scene-light]",
                    );

                const lightCore =
                    scene.querySelector<HTMLElement>(
                        "[data-journal-scene-light-core]",
                    );

                const lightHaze =
                    scene.querySelector<HTMLElement>(
                        "[data-journal-scene-light-haze]",
                    );

                if (media) {
                    gsap.set(media, {
                        autoAlpha: 0,
                        scale: 1.09,
                        filter:
                            "blur(22px) brightness(0.52)",
                    });
                }

                if (copy) {
                    gsap.set(copy, {
                        autoAlpha: 0,
                        y: 48,
                        filter: "blur(14px)",
                    });
                }

                if (light) {
                    gsap.set(light, {
                        autoAlpha: 0,
                    });
                }

                const reveal = gsap.timeline({
                    scrollTrigger: {
                        trigger: scene,
                        start: "top 92%",
                        toggleActions:
                            "play none none none",
                        once: true,
                    },
                });

                if (media) {
                    reveal.to(media, {
                        autoAlpha: 1,
                        scale: 1.025,
                        filter:
                            "blur(0px) brightness(1)",
                        duration: 2.8,
                        ease: "power3.out",
                    });
                }

                if (light) {
                    reveal.to(
                        light,
                        {
                            autoAlpha: 1,
                            duration: 2.6,
                            ease: "sine.inOut",
                        },
                        media ? "-=2.15" : 0,
                    );
                }

                if (copy) {
                    reveal.to(
                        copy,
                        {
                            autoAlpha: 1,
                            y: 0,
                            filter: "blur(0px)",
                            duration: 1.8,
                            ease: "power3.out",
                        },
                        media ? "-=1.15" : 0,
                    );
                }

                if (media) {
                    gsap.fromTo(
                        media,
                        {
                            yPercent: -3,
                            scale: 1.025,
                        },
                        {
                            yPercent: 3,
                            scale: 1.065,
                            ease: "none",
                            scrollTrigger: {
                                trigger: scene,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 2.4,
                            },
                        },
                    );
                }

                if (lightCore) {
                    gsap.fromTo(
                        lightCore,
                        {
                            xPercent: -20,
                            yPercent: -12,
                            scale: 0.78,
                            autoAlpha: 0.35,
                        },
                        {
                            xPercent: 24,
                            yPercent: 15,
                            scale: 1.28,
                            autoAlpha: 1,
                            ease: "none",
                            scrollTrigger: {
                                trigger: scene,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 3,
                            },
                        },
                    );
                }

                if (lightHaze) {
                    gsap.fromTo(
                        lightHaze,
                        {
                            xPercent: 20,
                            yPercent: 12,
                            scale: 1.18,
                            autoAlpha: 0.25,
                        },
                        {
                            xPercent: -18,
                            yPercent: -14,
                            scale: 0.88,
                            autoAlpha: 0.75,
                            ease: "none",
                            scrollTrigger: {
                                trigger: scene,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 3.6,
                            },
                        },
                    );
                }
            });

            /*
 * ========================================
 * ATMOSPHERIC CONTINUITY V2
 * ========================================
 *
 * The current scene dissolves into atmosphere
 * while the next scene begins to exist before
 * fully entering the viewport.
 *
 * Normal document scroll is preserved.
 * No pinning.
 * No scroll hijacking.
 */

            scenes.forEach((scene, index) => {
                const nextScene = scenes[index + 1];

                if (!nextScene) {
                    return;
                }

                const currentMedia =
                    scene.querySelector<HTMLElement>(
                        "[data-journal-scene-media]",
                    );

                const currentCopy =
                    scene.querySelector<HTMLElement>(
                        "[data-journal-scene-copy]",
                    );

                const currentLight =
                    scene.querySelector<HTMLElement>(
                        "[data-journal-scene-light]",
                    );

                const nextMedia =
                    nextScene.querySelector<HTMLElement>(
                        "[data-journal-scene-media]",
                    );

                const nextLight =
                    nextScene.querySelector<HTMLElement>(
                        "[data-journal-scene-light]",
                    );

                const nextLightCore =
                    nextScene.querySelector<HTMLElement>(
                        "[data-journal-scene-light-core]",
                    );

                /*
                 * ----------------------------------------
                 * CURRENT SCENE — DISSOLUTION
                 * ----------------------------------------
                 */

                const portalOut = gsap.timeline({
                    scrollTrigger: {
                        trigger: scene,
                        start: "bottom 42%",
                        end: "bottom top",
                        scrub: 2.2,
                    },
                });

                if (currentCopy) {
                    portalOut.to(
                        currentCopy,
                        {
                            y: -22,
                            autoAlpha: 0.16,
                            filter: "blur(8px)",
                            ease: "none",
                        },
                        0,
                    );
                }

                if (currentMedia) {
                    portalOut.to(
                        currentMedia,
                        {
                            scale: 1.085,
                            filter:
                                "blur(9px) brightness(0.48)",
                            ease: "none",
                        },
                        0,
                    );
                }

                if (currentLight) {
                    portalOut.to(
                        currentLight,
                        {
                            autoAlpha: 0.1,
                            ease: "none",
                        },
                        0,
                    );
                }

                /*
                 * ----------------------------------------
                 * NEXT SCENE — ATMOSPHERIC PRE-ECHO
                 * ----------------------------------------
                 *
                 *
                 *
                 * The next scene begins to exist while it
                 * is still approaching from below.
                 */

                const preEcho = gsap.timeline({
                    scrollTrigger: {
                        trigger: nextScene,
                        start: "top 112%",
                        end: "top 76%",
                        scrub: 2.4,
                    },
                });

                if (nextLight) {
                    preEcho.fromTo(
                        nextLight,
                        {
                            autoAlpha: 0,
                        },
                        {
                            autoAlpha: 0.55,
                            ease: "none",
                        },
                        0,
                    );
                }

                if (nextLightCore) {
                    preEcho.fromTo(
                        nextLightCore,
                        {
                            xPercent: -38,
                            yPercent: -22,
                            scale: 0.48,
                            autoAlpha: 0.2,
                        },
                        {
                            xPercent: -20,
                            yPercent: -12,
                            scale: 0.78,
                            autoAlpha: 0.7,
                            ease: "none",
                        },
                        0,
                    );
                }

                /*
                 * Media presence is deliberately restrained.
                 * We do NOT reveal the next copy early.
                 */

                if (nextMedia) {
                    preEcho.fromTo(
                        nextMedia,
                        {
                            autoAlpha: 0,
                            scale: 1.075,
                            filter:
                                "blur(18px) brightness(0.38)",
                        },
                        {
                            autoAlpha: 0.32,
                            scale: 1.055,
                            filter:
                                "blur(10px) brightness(0.58)",
                            ease: "none",
                        },
                        0,
                    );
                }
            });

            /*
             * JOURNAL COLLECTION ARRIVAL
             *
             * The rail enters physically from RIGHT → LEFT.
             * We animate the viewport, never the track, so
             * drag / wheel / momentum remain untouched.
             */
            if (journalCollection) {
                const divider =
                    journalCollection.firstElementChild as
                    | HTMLElement
                    | null;

                const collectionContent =
                    journalCollection.children[1] as
                    | HTMLElement
                    | undefined;

                if (divider) {
                    gsap.set(divider, {
                        autoAlpha: 0,
                        scaleX: 0.12,
                        transformOrigin: "left center",
                    });
                }

                if (collectionContent) {
                    gsap.set(collectionContent, {
                        autoAlpha: 0,
                    });
                }

                if (journalCollectionViewport) {
                    gsap.set(
                        journalCollectionViewport,
                        {
                            xPercent: 38,
                            autoAlpha: 0,
                            filter: "blur(10px)",
                        },
                    );
                }

                const collectionReveal =
                    gsap.timeline({
                        scrollTrigger: {
                            trigger:
                                journalCollection,
                            start: "top 88%",
                            once: true,
                        },
                    });

                if (divider) {
                    collectionReveal.to(divider, {
                        autoAlpha: 1,
                        scaleX: 1,
                        duration: 1.25,
                        ease: "power3.out",
                    });
                }

                if (collectionContent) {
                    collectionReveal.to(
                        collectionContent,
                        {
                            autoAlpha: 1,
                            duration: 1.15,
                            ease: "power2.out",
                        },
                        "-=0.7",
                    );
                }

                if (journalCollectionViewport) {
                    collectionReveal.to(
                        journalCollectionViewport,
                        {
                            xPercent: 0,
                            autoAlpha: 1,
                            filter: "blur(0px)",
                            duration: 2.8,
                            ease: "power4.out",
                        },
                        "-=0.9",
                    );
                }
            }
        }, root);

        return () => {
            context.revert();
        };
    }, []);

    return null;
}
