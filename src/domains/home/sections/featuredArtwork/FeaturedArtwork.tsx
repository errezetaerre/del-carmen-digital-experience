"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { getFeaturedWorkArtwork } from "@/domains/home/services";
import { Container } from "@/shared/layout";
import {
  ArtworkFrame,
  ArtworkImage,
} from "@/shared/ui/artwork";
import { LinkButton } from "@/shared/ui/button";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedArtwork() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const artwork = getFeaturedWorkArtwork();

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const context = gsap.context(() => {
      const prefersReducedMotion =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            "[data-featured-eyebrow]",
            "[data-featured-title]",
            "[data-featured-artwork]",
            "[data-featured-info]",
          ],
          {
            clearProps: "all",
          },
        );

        return;
      }

      /*
      * ============================================================
      * 01 — EDITORIAL INTRODUCTION
      *
      * Featured Work + artwork title.
      * ============================================================
      */

      gsap
        .timeline({
          defaults: {
            ease: "power3.out",
          },

          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            once: true,
          },
        })
        .fromTo(
          "[data-featured-eyebrow]",
          {
            autoAlpha: 0,
            y: 14,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
          },
        )
        .fromTo(
          "[data-featured-title]",
          {
            autoAlpha: 0,
            y: 24,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.95,
          },
          "-=0.42",
        );

      /*
       * ============================================================
       * 02 — ARTWORK REVEAL
       *
       * Independent scroll moment.
       * The artwork returns to the original subtle vertical reveal.
       * ============================================================
       */

      gsap.fromTo(
        "[data-featured-artwork]",
        {
          autoAlpha: 0,
          y: 40,
          scale: 0.885,
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.25,
          ease: "power2.out",

          scrollTrigger: {
            trigger: "[data-featured-artwork]",
            start: "top 82%",
            once: true,
          },
        },
      );

      /*
       * ============================================================
       * 03 — ARTWORK INFORMATION
       *
       * Completely independent from the artwork animation.
       *
       * Nothing happens while the visitor pauses to contemplate
       * the painting. The information is revealed only after
       * scrolling farther down the artwork.
       * ============================================================
       */

      gsap.fromTo(
        "[data-featured-info]",
        {
          autoAlpha: 0,
          y: 24,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",

          scrollTrigger: {
            trigger: "[data-featured-artwork]",
            start: "bottom 78%",
            once: true,
          },
        },
      );
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  if (!artwork) {
    return null;
  }

  const primaryImage = artwork.images.primary;

  const techniqueLabel =
    `${artwork.medium} on ${artwork.support}`;

  return (
    <section
      ref={sectionRef}
      className="
        relative
        overflow-hidden
        bg-background-alternate
        text-white

        lg:min-h-screen
      "
    >
      {/* Subtle transition from Hero */}
      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-40
          bg-gradient-to-b
          from-black/35
          to-transparent

          md:h-52
          lg:h-64
        "
      />

      {/* Ambient field */}
      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[48%]
          h-[58%]
          w-[76%]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full

          bg-[radial-gradient(ellipse_at_center,rgba(201,163,90,0.075)_0%,rgba(201,163,90,0.035)_38%,transparent_72%)]

          blur-[80px]

          md:h-[62%]
          md:w-[64%]
          md:blur-[100px]

          lg:h-[66%]
          lg:w-[58%]
          lg:blur-[120px]
        "
      />

      <Container
        className="
          relative
          z-10
          flex
          flex-col
          items-center
          justify-start

          py-16

          md:py-24

          lg:min-h-screen
          lg:justify-center
          lg:py-28
        "
      >
        {/* Editorial heading */}
        <header
          className="
            mb-10
            text-center

            md:mb-12
            lg:mb-14
          "
        >
          <p
            data-featured-eyebrow
            className="
              mb-4
              font-sans
              text-[10px]
              font-medium
              uppercase
              tracking-[0.35em]
              text-brand-gold

              md:text-xs
            "
          >
            Featured Work
          </p>

          <h2
            data-featured-title
            className="
              font-display
              text-4xl
              font-light
              leading-[0.95]
              tracking-[0.01em]
              text-white

              md:text-5xl
              lg:text-6xl
              xl:text-7xl
            "
          >
            {artwork.title}
          </h2>
        </header>

        {/* Artwork presentation */}
        <div
          className="
            flex
            w-full
            flex-col
            items-center
          "
        >
          <div data-featured-artwork>
            <ArtworkFrame
              aspectRatio={`${artwork.dimensions.width} / ${artwork.dimensions.height}`}
              className="
                mb-10
                w-[min(82vw,380px)]

                md:mb-12
                md:w-[500px]

                lg:w-[560px]

                xl:w-[620px]
              "
            >
              <ArtworkImage
                src={primaryImage.src}
                alt={primaryImage.alt}
                fill
                sizes="
                  (min-width: 1280px) 620px,
                  (min-width: 1024px) 560px,
                  (min-width: 768px) 500px,
                  82vw
                "
                className="object-contain"
              />
            </ArtworkFrame>
          </div>

          {/* Artwork information */}
          <div
            data-featured-info
            className="
              flex
              max-w-xl
              flex-col
              items-center
              text-center
            "
          >
            <p
              className="
                font-sans
                text-[10px]
                font-medium
                uppercase
                tracking-[0.28em]
                text-white/45

                md:text-xs
              "
            >
              {techniqueLabel}

              <span className="mx-3 text-brand-gold/45">
                ·
              </span>

              {artwork.year}
            </p>

            <div
              aria-hidden
              className="
                my-6
                h-px
                w-20
                bg-gradient-to-r
                from-transparent
                via-brand-gold/45
                to-transparent

                md:my-7
                md:w-24
              "
            />

            {artwork.description && (
              <p
                className="
                  max-w-lg
                  font-sans
                  text-sm
                  font-light
                  leading-7
                  text-white/55

                  md:text-base
                  md:leading-8
                "
              >
                {artwork.description}
              </p>
            )}

            <div className="mt-8 md:mt-10">
              <LinkButton
                href={`/artworks/${artwork.slug}`}
                variant="bronzeUnderline"
              >
                Discover the work
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}