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
             * Explicitly starts from the final entrance state.
             * immediateRender:false prevents this tween from
             * interfering with the entrance before departure.
             */

            gsap.fromTo(
                media,
                {
                    scale: 1,
                    opacity: 1,
                    filter: "brightness(1)",
                },
                {
                    scale: 0.94,
                    opacity: 0.35,
                    filter: "brightness(0.45)",
                    ease: "none",
                    immediateRender: false,
                    scrollTrigger: {
                        trigger: root,
                        start: "top top",
                        end: "bottom 20%",
                        scrub: 1.5,
                        invalidateOnRefresh: true,
                    },
                },
            );
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