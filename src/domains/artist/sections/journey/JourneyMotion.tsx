"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function JourneyMotion() {
    useLayoutEffect(() => {
        const root =
            document.querySelector<HTMLElement>(
                "#the-journey",
            );

        if (!root) return;

        const ctx = gsap.context(() => {
            const intro =
                root.querySelector<HTMLElement>(
                    "[data-journey-intro]",
                );

            const introEyebrow =
                root.querySelector<HTMLElement>(
                    "[data-journey-intro-eyebrow]",
                );

            const introTitle =
                root.querySelector<HTMLElement>(
                    "[data-journey-intro-title]",
                );

            const introLead =
                root.querySelector<HTMLElement>(
                    "[data-journey-intro-lead]",
                );

            const introCopy =
                gsap.utils.toArray<HTMLElement>(
                    root.querySelectorAll(
                        "[data-journey-intro-copy]",
                    ),
                );

            const stage =
                root.querySelector<HTMLElement>(
                    "[data-journey-stage]",
                );

            const pin =
                root.querySelector<HTMLElement>(
                    "[data-journey-pin]",
                );

            const track =
                root.querySelector<HTMLElement>(
                    "[data-journey-track]",
                );

            const milestones =
                gsap.utils.toArray<HTMLElement>(
                    root.querySelectorAll(
                        "[data-journey-milestone]",
                    ),
                );

            const closing =
                root.querySelector<HTMLElement>(
                    "[data-journey-closing]",
                );

            const closingLine =
                root.querySelector<HTMLElement>(
                    "[data-journey-closing-line]",
                );

            const closingCopy =
                root.querySelector<HTMLElement>(
                    "[data-journey-closing-copy]",
                );

            if (
                !stage ||
                !pin ||
                !track ||
                milestones.length === 0
            ) {
                return;
            }

            const groups = milestones.map(
                (milestone) => ({
                    milestone,

                    meta:
                        milestone.querySelector<HTMLElement>(
                            "[data-journey-meta]",
                        ),

                    headline:
                        milestone.querySelector<HTMLElement>(
                            "[data-journey-headline]",
                        ),

                    copy:
                        gsap.utils.toArray<HTMLElement>(
                            milestone.querySelectorAll(
                                "[data-journey-copy]",
                            ),
                        ),
                }),
            );

            const reducedMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                ).matches;

            /* ==========================================
               REDUCED MOTION
            ========================================== */

            if (reducedMotion) {
                if (introEyebrow) {
                    gsap.set(introEyebrow, {
                        autoAlpha: 1,
                        y: 0,
                    });
                }

                if (introTitle) {
                    gsap.set(introTitle, {
                        autoAlpha: 1,
                        y: 0,
                    });
                }

                if (introLead) {
                    gsap.set(introLead, {
                        autoAlpha: 1,
                        y: 0,
                    });
                }

                gsap.set(introCopy, {
                    autoAlpha: 1,
                    y: 0,
                });

                gsap.set(track, {
                    clearProps: "transform",
                });

                groups.forEach((group) => {
                    gsap.set(
                        [
                            group.meta,
                            group.headline,
                            ...group.copy,
                        ],
                        {
                            autoAlpha: 1,
                            y: 0,
                        },
                    );
                });

                if (closingLine) {
                    gsap.set(closingLine, {
                        scaleX: 1,
                    });
                }

                if (closingCopy) {
                    gsap.set(closingCopy, {
                        autoAlpha: 1,
                        y: 0,
                    });
                }

                return;
            }

            /* ==========================================
               INTRO
            ========================================== */

            if (
                intro &&
                introEyebrow &&
                introTitle &&
                introLead
            ) {
                gsap.set(introEyebrow, {
                    autoAlpha: 0,
                    y: 14,
                });

                gsap.set(introTitle, {
                    autoAlpha: 0,
                    y: 28,
                });

                gsap.set(introLead, {
                    autoAlpha: 0,
                    y: 24,
                });

                gsap.set(introCopy, {
                    autoAlpha: 0,
                    y: 20,
                });

                const introTl =
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: intro,
                            start: "top 76%",
                            once: true,
                        },
                    });

                introTl
                    .to(introEyebrow, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power2.out",
                    })
                    .to(
                        introTitle,
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.9,
                            ease: "power2.out",
                        },
                        "-=0.32",
                    )
                    .to(
                        introLead,
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power2.out",
                        },
                        "-=0.38",
                    )
                    .to(
                        introCopy,
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.72,
                            stagger: 0.12,
                            ease: "power2.out",
                        },
                        "-=0.32",
                    );
            }

            /* ==========================================
               RESPONSIVE JOURNEY
            ========================================== */

            const mm = gsap.matchMedia();

            /* ------------------------------------------
               MOBILE + TABLET
               Natural document flow
            ------------------------------------------ */

            mm.add(
                "(max-width: 1023px)",
                () => {
                    gsap.set(track, {
                        clearProps: "transform",
                    });

                    groups.forEach((group) => {
                        if (group.meta) {
                            gsap.fromTo(
                                group.meta,
                                {
                                    autoAlpha: 0,
                                    y: 18,
                                },
                                {
                                    autoAlpha: 1,
                                    y: 0,
                                    duration: 0.65,
                                    ease: "power2.out",
                                    scrollTrigger: {
                                        trigger: group.meta,
                                        start: "top 86%",
                                        once: true,
                                    },
                                },
                            );
                        }

                        if (group.headline) {
                            gsap.fromTo(
                                group.headline,
                                {
                                    autoAlpha: 0,
                                    y: 22,
                                },
                                {
                                    autoAlpha: 1,
                                    y: 0,
                                    duration: 0.75,
                                    ease: "power2.out",
                                    scrollTrigger: {
                                        trigger:
                                            group.headline,
                                        start: "top 84%",
                                        once: true,
                                    },
                                },
                            );
                        }

                        group.copy.forEach(
                            (paragraph) => {
                                gsap.fromTo(
                                    paragraph,
                                    {
                                        autoAlpha: 0,
                                        y: 20,
                                    },
                                    {
                                        autoAlpha: 1,
                                        y: 0,
                                        duration: 0.72,
                                        ease: "power2.out",
                                        scrollTrigger: {
                                            trigger:
                                                paragraph,
                                            start: "top 88%",
                                            once: true,
                                        },
                                    },
                                );
                            },
                        );
                    });
                },
            );

            /* ------------------------------------------
               DESKTOP
               Pinned chapters + navigator + snap
            ------------------------------------------ */

            mm.add(
                "(min-width: 1024px)",
                () => {
                    gsap.set(track, {
                        yPercent: 0,
                    });

                    groups.forEach((group) => {
                        gsap.set(
                            [
                                group.meta,
                                group.headline,
                                ...group.copy,
                            ],
                            {
                                autoAlpha: 0,
                                y: 36,
                            },
                        );
                    });

                    let lastActiveIndex:
                        | number
                        | null = null;

                    const emitActiveMilestone = (
                        index: number | null,
                    ) => {
                        if (
                            index ===
                            lastActiveIndex
                        ) {
                            return;
                        }

                        lastActiveIndex = index;

                        window.dispatchEvent(
                            new CustomEvent(
                                "journey:progress",
                                {
                                    detail: {
                                        index,
                                    },
                                },
                            ),
                        );
                    };

                    /*
                     * These labels represent the stable,
                     * readable resting position of each
                     * chapter.
                     */
                    const ACTIVE_LABEL_PREFIX =
                        "journey-active-";

                    const tl = gsap.timeline({
                        defaults: {
                            ease: "none",
                        },

                        scrollTrigger: {
                            trigger: stage,
                            start: "top top",

                            end: () =>
                                `+=${window.innerHeight * 4.2}`,

                            pin: stage,
                            pinSpacing: true,
                            scrub: 0.55,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,

                            snap: {
                                snapTo: (value) => {
                                    const duration =
                                        tl.duration();

                                    if (!duration) {
                                        return value;
                                    }

                                    const points =
                                        groups
                                            .map(
                                                (
                                                    _,
                                                    index,
                                                ) => {
                                                    const label =
                                                        tl.labels[
                                                        `${ACTIVE_LABEL_PREFIX}${index}`
                                                        ];

                                                    return typeof label ===
                                                        "number"
                                                        ? label /
                                                        duration
                                                        : null;
                                                },
                                            )
                                            .filter(
                                                (
                                                    point,
                                                ): point is number =>
                                                    point !==
                                                    null,
                                            );

                                    if (
                                        points.length ===
                                        0
                                    ) {
                                        return value;
                                    }

                                    return points.reduce(
                                        (
                                            closest,
                                            point,
                                        ) =>
                                            Math.abs(
                                                point -
                                                value,
                                            ) <
                                                Math.abs(
                                                    closest -
                                                    value,
                                                )
                                                ? point
                                                : closest,
                                        points[0],
                                    );
                                },

                                duration: {
                                    min: 0.25,
                                    max: 0.6,
                                },

                                delay: 0.15,
                                ease: "power2.inOut",
                            },
                        },
                    });

                    /* ======================================
                       CHAPTER 01
                    ====================================== */

                    const first = groups[0];

                    if (first.meta) {
                        tl.to(first.meta, {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.35,
                        });
                    }

                    if (first.headline) {
                        tl.to(
                            first.headline,
                            {
                                autoAlpha: 1,
                                y: 0,
                                duration: 0.35,
                            },
                            "<0.10",
                        );
                    }

                    if (first.copy.length) {
                        tl.to(
                            first.copy,
                            {
                                autoAlpha: 1,
                                y: 0,
                                duration: 0.4,
                                stagger: 0.1,
                            },
                            "<0.10",
                        );
                    }

                    /*
                     * Chapter 01 is now completely
                     * readable.
                     */
                    tl.addLabel(
                        `${ACTIVE_LABEL_PREFIX}0`,
                    );

                    tl.to({}, {
                        duration: 0.7,
                    });

                    /* ======================================
                       CHAPTER TRANSITIONS
                    ====================================== */

                    for (
                        let index = 0;
                        index <
                        groups.length - 1;
                        index++
                    ) {
                        const current =
                            groups[index];

                        const next =
                            groups[index + 1];

                        const transition =
                            `journey-track-${index}`;

                        tl.addLabel(transition);

                        if (current.meta) {
                            tl.to(
                                current.meta,
                                {
                                    autoAlpha: 0,
                                    y: -36,
                                    duration: 0.32,
                                    ease: "power1.in",
                                },
                                transition,
                            );
                        }

                        if (
                            current.headline
                        ) {
                            tl.to(
                                current.headline,
                                {
                                    autoAlpha: 0,
                                    y: -36,
                                    duration: 0.32,
                                    ease: "power1.in",
                                },
                                `${transition}+=0.10`,
                            );
                        }

                        if (
                            current.copy.length
                        ) {
                            tl.to(
                                current.copy,
                                {
                                    autoAlpha: 0,
                                    y: -36,
                                    duration: 0.36,
                                    stagger: 0.08,
                                    ease: "power1.in",
                                },
                                `${transition}+=0.20`,
                            );
                        }

                        tl.to(
                            track,
                            {
                                yPercent:
                                    -(index + 1) *
                                    100,

                                duration: 0.9,
                                ease:
                                    "power1.inOut",
                            },
                            `${transition}+=0.68`,
                        );

                        if (next.meta) {
                            tl.fromTo(
                                next.meta,
                                {
                                    autoAlpha: 0,
                                    y: 36,
                                },
                                {
                                    autoAlpha: 1,
                                    y: 0,
                                    duration: 0.32,
                                    ease:
                                        "power1.out",
                                },
                                `${transition}+=1.58`,
                            );
                        }

                        if (
                            next.headline
                        ) {
                            tl.fromTo(
                                next.headline,
                                {
                                    autoAlpha: 0,
                                    y: 36,
                                },
                                {
                                    autoAlpha: 1,
                                    y: 0,
                                    duration: 0.32,
                                    ease:
                                        "power1.out",
                                },
                                `${transition}+=1.68`,
                            );
                        }

                        if (
                            next.copy.length
                        ) {
                            tl.fromTo(
                                next.copy,
                                {
                                    autoAlpha: 0,
                                    y: 36,
                                },
                                {
                                    autoAlpha: 1,
                                    y: 0,
                                    duration: 0.36,
                                    stagger: 0.08,
                                    ease:
                                        "power1.out",
                                },
                                `${transition}+=1.78`,
                            );
                        }

                        /*
                         * The next chapter has now
                         * completed its entrance.
                         */
                        tl.addLabel(
                            `${ACTIVE_LABEL_PREFIX}${index + 1
                            }`,
                        );

                        tl.to({}, {
                            duration: 0.85,
                        });
                    }

                    /* ======================================
                       FINAL HOLD
                    ====================================== */

                    const last =
                        groups[
                        groups.length - 1
                        ];

                    if (last.meta) {
                        tl.set(last.meta, {
                            autoAlpha: 1,
                            y: 0,
                        });
                    }

                    if (last.headline) {
                        tl.set(
                            last.headline,
                            {
                                autoAlpha: 1,
                                y: 0,
                            },
                        );
                    }

                    if (last.copy.length) {
                        tl.set(last.copy, {
                            autoAlpha: 1,
                            y: 0,
                        });
                    }

                    tl.to({}, {
                        duration: 1.4,
                    });

                    /* ======================================
                       NAVIGATOR STATE
                    ====================================== */

                    const getActivePoints =
                        () => {
                            const duration =
                                tl.duration();

                            if (!duration) {
                                return [];
                            }

                            return groups
                                .map(
                                    (_, index) => {
                                        const time =
                                            tl.labels[
                                            `${ACTIVE_LABEL_PREFIX}${index}`
                                            ];

                                        if (
                                            typeof time !==
                                            "number"
                                        ) {
                                            return null;
                                        }

                                        return {
                                            index,
                                            time,
                                            progress:
                                                time /
                                                duration,
                                        };
                                    },
                                )
                                .filter(
                                    (
                                        point,
                                    ): point is {
                                        index: number;
                                        time: number;
                                        progress: number;
                                    } =>
                                        point !== null,
                                );
                        };

                    /*
                     * Navigator follows the nearest
                     * chapter resting point.
                     *
                     * This is intentionally symmetrical:
                     * it behaves the same while scrolling
                     * down or back up.
                     */
                    tl.eventCallback(
                        "onUpdate",
                        () => {
                            const points =
                                getActivePoints();

                            if (
                                points.length === 0
                            ) {
                                return;
                            }

                            const currentTime =
                                tl.time();

                            const nearest =
                                points.reduce(
                                    (
                                        closest,
                                        point,
                                    ) =>
                                        Math.abs(
                                            point.time -
                                            currentTime,
                                        ) <
                                            Math.abs(
                                                closest.time -
                                                currentTime,
                                            )
                                            ? point
                                            : closest,
                                    points[0],
                                );

                            emitActiveMilestone(
                                nearest.index,
                            );
                        },
                    );

                    /* ======================================
                       NAVIGATOR CLICK
                    ====================================== */

                    const handleJourneyNavigate =
                        (event: Event) => {
                            const customEvent =
                                event as CustomEvent<{
                                    index: number;
                                }>;

                            const targetIndex =
                                customEvent.detail
                                    .index;

                            const point =
                                getActivePoints().find(
                                    (candidate) =>
                                        candidate.index ===
                                        targetIndex,
                                );

                            const scrollTrigger =
                                tl.scrollTrigger;

                            if (
                                !point ||
                                !scrollTrigger
                            ) {
                                return;
                            }

                            const targetScroll =
                                scrollTrigger.start +
                                (
                                    scrollTrigger.end -
                                    scrollTrigger.start
                                ) *
                                point.progress;

                            /*
                             * Update immediately so the
                             * selected destination is clear
                             * while smooth scrolling begins.
                             */
                            emitActiveMilestone(
                                targetIndex,
                            );

                            window.scrollTo({
                                top: targetScroll,
                                behavior: "smooth",
                            });
                        };

                    window.addEventListener(
                        "journey:navigate",
                        handleJourneyNavigate,
                    );

                    return () => {
                        window.removeEventListener(
                            "journey:navigate",
                            handleJourneyNavigate,
                        );
                    };
                },
            );

            /* ==========================================
               CLOSING
            ========================================== */

            if (
                closing &&
                closingLine &&
                closingCopy
            ) {
                gsap.set(closingLine, {
                    scaleX: 0,
                    transformOrigin:
                        "center center",
                });

                gsap.set(closingCopy, {
                    autoAlpha: 0,
                    y: 20,
                });

                const closingTl =
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: closing,
                            start: "top 82%",
                            once: true,
                        },
                    });

                closingTl
                    .to(closingLine, {
                        scaleX: 1,
                        duration: 0.8,
                        ease: "power2.out",
                    })
                    .to(
                        closingCopy,
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.9,
                            ease: "power2.out",
                        },
                        "-=0.34",
                    );
            }

            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
            });

            return () => {
                mm.revert();
            };
        }, root);

        return () => {
            ctx.revert();
        };
    }, []);

    return null;
}