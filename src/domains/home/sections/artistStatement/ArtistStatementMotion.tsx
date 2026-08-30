"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ArtistStatementMotion() {
  useEffect(() => {
    const section = document.querySelector(
      "[data-artist-statement]",
    );

    if (!section) {
      return;
    }

    const context = gsap.context(() => {
      const prefersReducedMotion =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

      const portrait =
        "[data-artist-portrait]";

      const title =
        "[data-artist-title]";

      const paragraphs =
        "[data-artist-paragraph]";

      const signature =
        "[data-artist-signature]";

      const cta =
        "[data-artist-cta]";

      if (prefersReducedMotion) {
        gsap.set(
          [
            portrait,
            title,
            paragraphs,
            signature,
            cta,
          ],
          {
            clearProps: "all",
          },
        );

        return;
      }

      /*
       * ======================================================
       * 01 — PORTRAIT
       *
       * First encounter with the artist.
       * ======================================================
       */

      gsap.fromTo(
        portrait,
        {
          autoAlpha: 0,
          y: 34,
          scale: 0.99,
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",

          scrollTrigger: {
            trigger: portrait,
            start: "top 82%",
            once: true,
          },
        },
      );

      /*
       * ======================================================
       * 02 — PHILOSOPHY TITLE
       *
       * Independent scroll moment.
       * ======================================================
       */

      gsap.fromTo(
        title,
        {
          autoAlpha: 0,
          y: 26,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.95,
          ease: "power3.out",

          scrollTrigger: {
            trigger: title,
            start: "top 78%",
            once: true,
          },
        },
      );

      /*
       * ======================================================
       * 03 — STATEMENT
       *
       * Each paragraph responds to its own position in
       * the viewport. Waiting does not reveal the next one.
       * ======================================================
       */

      gsap.utils
        .toArray<HTMLElement>(paragraphs)
        .forEach((paragraph) => {
          gsap.fromTo(
            paragraph,
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
                trigger: paragraph,
                start: "top 82%",
                once: true,
              },
            },
          );
        });

      /*
       * ======================================================
       * 04 — SIGNATURE + CTA
       *
       * Final gesture of the scene.
       * ======================================================
       */

      gsap
        .timeline({
          scrollTrigger: {
            trigger: signature,
            start: "top 84%",
            once: true,
          },
        })
        .fromTo(
          signature,
          {
            autoAlpha: 0,
            y: 18,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
          },
        )
        .fromTo(
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
          },
          "-=0.25",
        );
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  return null;
}