"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { Artwork } from "@/domains/artworks";
import { ArtworkLightbox } from "@/shared/ui/artwork";

import CollectionArtwork from "./CollectionArtwork";

gsap.registerPlugin(ScrollTrigger);

type ArtworkInteraction =
    | "lightbox"
    | "detail";

type ArtworkImageVariant =
    | "collection"
    | "thumbnail";

interface CollectionGalleryProps {
    artworks: Artwork[];

    interaction?: ArtworkInteraction;
    imageVariant?: ArtworkImageVariant;

    detailCategory?: string;
}

export default function CollectionGallery({
    artworks,
    interaction = "lightbox",
    imageVariant = "thumbnail",
    detailCategory,
}: CollectionGalleryProps) {
    const router = useRouter();

    const galleryRef =
        useRef<HTMLDivElement | null>(null);

    const [selectedIndex, setSelectedIndex] =
        useState<number | null>(null);

    /*
     * ==========================================================
     * ARTWORK REVEAL
     *
     * Every artwork responds to its own physical position
     * in the viewport.
     *
     * There is deliberately no shared stagger timeline.
     * ==========================================================
     */

    useEffect(() => {
        const gallery = galleryRef.current;

        if (!gallery) {
            return;
        }

        const context = gsap.context(() => {
            const prefersReducedMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                ).matches;

            const cards =
                gsap.utils.toArray<HTMLElement>(
                    "[data-collection-artwork]",
                );

            if (prefersReducedMotion) {
                gsap.set(cards, {
                    clearProps: "all",
                });

                return;
            }

            cards.forEach((card) => {
                gsap.fromTo(
                    card,
                    {
                        autoAlpha: 0,
                        y: 34,
                        scale: 0.985,
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        scale: 1,
                        duration: 1,
                        ease: "power2.out",

                        scrollTrigger: {
                            trigger: card,
                            start: "top 88%",
                            once: true,
                        },
                    },
                );
            });
        }, gallery);

        return () => {
            context.revert();
        };
    }, [artworks]);

    const handleOpen = (
        artwork: Artwork,
        index: number,
    ) => {
        if (interaction === "detail") {
            const categoryQuery =
                detailCategory
                    ? `?category=${encodeURIComponent(
                        detailCategory,
                    )}`
                    : "";

            router.push(
                `/artworks/${artwork.slug}${categoryQuery}`,
            );

            return;
        }

        setSelectedIndex(index);
    };

    return (
        <>
            <div
                ref={galleryRef}
                className="
          grid
          grid-cols-2
          items-start
          justify-items-center
          gap-x-6
          gap-y-14

          md:grid-cols-4
          md:gap-x-5

          xl:gap-x-8

          [@media(orientation:landscape)_and_(max-height:600px)]:!grid-cols-3
          [@media(orientation:landscape)_and_(max-height:600px)]:!gap-x-4
          [@media(orientation:landscape)_and_(max-height:600px)]:!gap-y-8
        "
            >
                {artworks.map(
                    (artwork, index) => (
                        <div
                            key={artwork.id}
                            data-collection-artwork
                            className="w-full"
                        >
                            <CollectionArtwork
                                artwork={artwork}
                                imageVariant={imageVariant}
                                onOpen={() =>
                                    handleOpen(
                                        artwork,
                                        index,
                                    )
                                }
                            />
                        </div>
                    ),
                )}
            </div>

            {interaction === "lightbox" && (
                <ArtworkLightbox
                    artworks={artworks}
                    initialIndex={
                        selectedIndex ?? 0
                    }
                    isOpen={
                        selectedIndex !== null
                    }
                    onClose={() => {
                        setSelectedIndex(null);
                    }}
                    showDetailsCta
                />
            )}
        </>
    );
}