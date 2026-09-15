"use client";

import {
    useLayoutEffect,
    useRef,
    type ReactNode,
} from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CollectionHeroMotionProps {
    children: ReactNode;
}

export default function CollectionHeroMotion({
    children,
}: CollectionHeroMotionProps) {
    const rootRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const wrapper = rootRef.current;

        if (!wrapper) {
            return;
        }

        const root = wrapper.querySelector(
            "[data-collection-hero]",
        );

        if (!(root instanceof HTMLElement)) {
            return;
        }

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (reducedMotion) {
            return;
        }

        const context = gsap.context(() => {
            const media = root.querySelector(
                "[data-collection-hero-media]",
            );

            const content = root.querySelector(
                "[data-collection-hero-content]",
            );

            if (
                !(media instanceof HTMLElement) ||
                !(content instanceof HTMLElement)
            ) {
                return;
            }

            /*
             * --------------------------------------------------
             * HERO ENTRANCE
             * --------------------------------------------------
             *
             * Existing approved motion.
             *
             * Runs once when the Collection approaches
             * the viewport.
             */

            const entranceTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: root,
                    start: "top 82%",
                    once: true,
                },
            });

            entranceTimeline.fromTo(
                media,
                {
                    opacity: 0.82,
                    scale: 1.025,
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1.4,
                    ease: "power2.out",
                },
                0,
            );

            entranceTimeline.fromTo(
                content,
                {
                    opacity: 0,
                    y: 18,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power2.out",
                },
                0.15,
            );

            /*
             * --------------------------------------------------
             * COLLECTION DEPARTURE
             * --------------------------------------------------
             *
             * Once the Collection reaches the top of the
             * viewport, its media begins to recede subtly.
             *
             * This creates visual depth between consecutive
             * Collections without changing natural scrolling.
             */

            gsap.to(media, {
                scale: 0.985,
                opacity: 0.72,
                yPercent: -1.5,
                ease: "none",

                scrollTrigger: {
                    trigger: root,
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.8,
                },
            });
        }, root);

        return () => {
            context.revert();
        };
    }, []);

    return (
        <div
            ref={rootRef}
            className="contents"
        >
            {children}
        </div>
    );
}