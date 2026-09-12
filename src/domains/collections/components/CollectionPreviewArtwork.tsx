import Image from "next/image";
import Link from "next/link";

import type { Artwork } from "@/domains/artworks";

interface CollectionPreviewArtworkProps {
    artwork: Artwork;
    seriesSlug: string;
}

export default function CollectionPreviewArtwork({
    artwork,
    seriesSlug,
}: CollectionPreviewArtworkProps) {
    const image =
        artwork.images.collection ??
        artwork.images.thumbnail ??
        artwork.images.primary;

    return (
        <Link
            href={`/series/${seriesSlug}?artwork=${encodeURIComponent(
                artwork.slug,
            )}`}
            className="
                group/artwork
                relative
                block
                min-w-0
                overflow-hidden
            "
        >
            <div
                className="
                    relative
                    h-full
                    w-full
                    overflow-hidden
                    bg-white/[0.03]
                "
            >
                <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="18vw"
                    className="
                        object-cover
                        transition-transform
                        duration-700
                        ease-out

                        group-hover/artwork:scale-[1.025]
                    "
                />

                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/65
                        via-transparent
                        to-transparent
                        opacity-0
                        transition-opacity
                        duration-500

                        group-hover/artwork:opacity-100
                    "
                />

                <div
                    className="
                        absolute
                        inset-x-0
                        bottom-0
                        translate-y-3
                        px-4
                        pb-4
                        opacity-0
                        transition-all
                        duration-500

                        group-hover/artwork:translate-y-0
                        group-hover/artwork:opacity-100
                    "
                >
                    <p
                        className="
                            font-display
                            text-lg
                            font-light
                            leading-none
                            text-white
                        "
                    >
                        {artwork.title}
                    </p>

                    <p
                        className="
                            mt-1
                            font-sans
                            text-[9px]
                            uppercase
                            tracking-[0.18em]
                            text-white/50
                        "
                    >
                        {artwork.year}
                    </p>
                </div>
            </div>
        </Link>
    );
}