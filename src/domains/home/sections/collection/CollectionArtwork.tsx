"use client";

import { useRef } from "react";
import gsap from "gsap";

import type { Artwork } from "@/domains/artworks";

import CollectionArtworkFrame from "./CollectionArtworkFrame";

type CollectionImageVariant =
  | "collection"
  | "thumbnail";

interface CollectionArtworkProps {
  artwork: Artwork;
  onOpen?: () => void;

  imageVariant?: CollectionImageVariant;
}

export default function CollectionArtwork({
  artwork,
  onOpen,
  imageVariant = "thumbnail",
}: CollectionArtworkProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const initialRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const detailsTitleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const displayImage =
    imageVariant === "collection"
      ? artwork.images.collection ??
      artwork.images.primary
      : artwork.images.thumbnail ??
      artwork.images.primary;
  console.log(
    artwork.title,
    imageVariant,
    displayImage.src,
  );
  const techniqueLabel = `${artwork.medium} on ${artwork.support}`;

  const animateIn = () => {
    if (
      !initialRef.current ||
      !detailsRef.current ||
      !detailsTitleRef.current ||
      !metaRef.current ||
      !footerRef.current
    ) {
      return;
    }

    gsap.killTweensOf([
      initialRef.current,
      detailsRef.current,
      detailsTitleRef.current,
      metaRef.current,
      footerRef.current,
    ]);

    const timeline = gsap.timeline();

    timeline.to(initialRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
    });

    timeline.fromTo(
      detailsRef.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      },
      "-=0.05",
    );

    timeline.fromTo(
      detailsTitleRef.current,
      {
        y: 18,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
      },
      "-=0.15",
    );

    timeline.fromTo(
      metaRef.current,
      {
        y: 10,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      },
      "-=0.2",
    );

    timeline.fromTo(
      footerRef.current,
      {
        y: 8,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      },
      "-=0.15",
    );
  };

  const animateOut = () => {
    if (
      !initialRef.current ||
      !detailsRef.current ||
      !detailsTitleRef.current ||
      !metaRef.current ||
      !footerRef.current
    ) {
      return;
    }

    gsap.killTweensOf([
      initialRef.current,
      detailsRef.current,
      detailsTitleRef.current,
      metaRef.current,
      footerRef.current,
    ]);

    const timeline = gsap.timeline();

    timeline.to(
      [
        detailsTitleRef.current,
        metaRef.current,
        footerRef.current,
      ],
      {
        y: 8,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        stagger: 0.03,
      },
    );

    timeline.to(
      detailsRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      },
      "-=0.05",
    );

    timeline.to(
      initialRef.current,
      {
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      },
      "-=0.05",
    );
  };

  return (
    <article
      ref={cardRef}
      className="group relative w-full max-w-[200px]"
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
    >
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left"
        aria-label={`View ${artwork.title}`}
      >
        <CollectionArtworkFrame>
          <div className="relative aspect-[4/5] overflow-hidden bg-black">
            <img
              src={displayImage.src}
              alt={displayImage.alt}

              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-1000
                ease-out
                group-hover:scale-[1.035]
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/90
                via-black/10
                to-transparent
                opacity-70
                transition-opacity
                duration-700
                group-hover:opacity-90
              "
            />

            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              {/* Estado inicial */}
              <div ref={initialRef}>
                <p className="mb-2 text-[9px] uppercase tracking-[0.3em] text-brand-gold">
                  {artwork.year}
                </p>

                <h3 className="font-serif text-lg font-light leading-tight text-white">
                  {artwork.title}
                </h3>
              </div>

              {/* Estado revelado */}
              <div
                ref={detailsRef}
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  p-4
                  opacity-0

                  md:p-5
                "
              >
                <h3
                  ref={detailsTitleRef}
                  className="font-serif text-lg font-light leading-tight text-white"
                >
                  {artwork.title}
                </h3>

                <div
                  ref={metaRef}
                  className="
                    mt-3
                    space-y-1
                    text-[8px]
                    uppercase
                    tracking-[0.2em]
                    text-white/55
                  "
                >
                  <p>{techniqueLabel}</p>

                  <p>
                    {artwork.dimensions.width} ×{" "}
                    {artwork.dimensions.height}{" "}
                    {artwork.dimensions.unit}
                  </p>
                </div>

                <div
                  ref={footerRef}
                  className="mt-4 flex items-center justify-between"
                >
                  <span className="text-[9px] uppercase tracking-[0.3em] text-brand-gold">
                    {artwork.year}
                  </span>

                  <span className="text-[9px] uppercase tracking-[0.25em] text-brand-gold">
                    Discover →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CollectionArtworkFrame>
      </button>
    </article>
  );
}