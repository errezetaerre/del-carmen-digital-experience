import type { Artwork } from "@/domains/artworks";

import CollectionPreviewArtwork from "./CollectionPreviewArtwork";

interface CollectionPreviewWorksProps {
    artworks: Artwork[];
    seriesSlug: string;
}

export default function CollectionPreviewWorks({
    artworks,
    seriesSlug,
}: CollectionPreviewWorksProps) {
    const previewArtworks =
        artworks.slice(0, 4);

    if (previewArtworks.length === 0) {
        return null;
    }

    return (
        <div
            className="
                group/works
                relative
                z-20
                hidden
                h-64
                w-full
                max-w-3xl

                lg:block
            "
        >
            <div
                className="
                    absolute
                    inset-x-0
                    bottom-0
                "
            >
                <p
                    className="
                        mb-3
                        font-sans
                        text-[9px]
                        uppercase
                        tracking-[0.26em]
                        text-white/35
                    "
                >
                    Works in this collection
                </p>

                <div
                    className="
                        grid
                        h-7
                        grid-cols-4
                        gap-2

                        transition-[height]
                        duration-700
                        ease-[cubic-bezier(0.22,1,0.36,1)]

                        group-hover/works:h-52

                        xl:group-hover/works:h-56
                    "
                >
                    {previewArtworks.map(
                        (artwork) => (
                            <CollectionPreviewArtwork
                                key={artwork.id}
                                artwork={artwork}
                                seriesSlug={
                                    seriesSlug
                                }
                            />
                        ),
                    )}
                </div>
            </div>
        </div>
    );
}
