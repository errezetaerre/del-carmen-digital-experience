"use client";

import {
    useEffect,
    useRef,
    useState,
    useTransition,
} from "react";

import { useRouter } from "@/i18n/navigation";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { Artwork } from "@/domains/artworks";
import dynamic from "next/dynamic";
import useArtworkViewerSelection from "@/shared/ui/artwork/useArtworkViewerSelection";
const ArtworkExperienceViewer = dynamic(() => import("@/shared/ui/artwork/ArtworkExperienceViewer"), { ssr: false });

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

    detailQuery?: string;
    className?: string;
    artworkPresentation?: "default" | "archive";
}

export default function CollectionGallery({
    artworks,
    interaction = "lightbox",
    imageVariant = "thumbnail",
    detailQuery,
    className,
    artworkPresentation = "default",
}: CollectionGalleryProps) {
    const router = useRouter();

    const galleryRef =
        useRef<HTMLDivElement | null>(null);

    const viewer = useArtworkViewerSelection(artworks);
    const { selectedIndex } = viewer;
    const [isPending, startTransition] = useTransition();
    const [pendingArtworkId, setPendingArtworkId] = useState<string | null>(null);
    const pendingArtworkRef = useRef<string | null>(null);
    const revealedArchiveArtworks = useRef(new Set<string>());

    useEffect(() => {
        if (!isPending) {
            pendingArtworkRef.current = null;
        }
    }, [isPending]);

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
                const artworkId = card.dataset.collectionArtwork ?? "";
                if (artworkPresentation === "archive" && revealedArchiveArtworks.current.has(artworkId)) {
                    gsap.set(card, { clearProps: "opacity,visibility,transform" });
                    return;
                }
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
                        onComplete: () => {
                            if (artworkPresentation === "archive") revealedArchiveArtworks.current.add(artworkId);
                        },

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
    }, [artworks, artworkPresentation]);

    const handleOpen = (
        artwork: Artwork,
    ) => {
        if (interaction === "detail") {
            if (pendingArtworkRef.current === artwork.id) return;
            pendingArtworkRef.current = artwork.id;
            setPendingArtworkId(artwork.id);
            const query =
                detailQuery
                    ? `?${detailQuery}`
                    : "";

            startTransition(() => router.push(`/artworks/${artwork.slug}${query}`));

            return;
        }

        viewer.open(artwork);
    };

    return (
        <>
            <div
                ref={galleryRef}
                className={className ?? `
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
        `}
            >
                {artworks.map(
                    (artwork) => (
                        <div
                            key={artwork.id}
                            data-collection-artwork={artwork.id}
                            className="w-full"
                        >
                            <CollectionArtwork
                                artwork={artwork}
                                presentation={artworkPresentation}
                                loading={isPending && pendingArtworkId === artwork.id}
                                imageVariant={imageVariant}
                                onOpen={() =>
                                    handleOpen(
                                        artwork,
                                    )
                                }
                            />
                        </div>
                    ),
                )}
            </div>

            {interaction === "lightbox" && selectedIndex !== null && (
                <ArtworkExperienceViewer
                    artworks={artworks}
                    initialIndex={selectedIndex}
                    onClose={viewer.close}
                    showDetailsCta
                />
            )}
        </>
    );
}
