import type {
    ArtworkSeries,
} from "@/domains/artworks/series";

import type { Artwork } from "@/domains/artworks";

import { Container } from "@/shared/layout";

import CollectionHeroContent from "./CollectionHeroContent";
import CollectionHeroMedia from "./CollectionHeroMedia";
import CollectionHeroOverlay from "./CollectionHeroOverlay";
import CollectionPreviewWorks from "./CollectionPreviewWorks";
import CollectionHighlight from "./CollectionHighlight";

interface CollectionHeroProps {
    series: ArtworkSeries;
    artworks: Artwork[];
}

export default function CollectionHero({
    series,
    artworks,
}: CollectionHeroProps) {
    if (!series.hero) {
        return null;
    }

    const layout =
        series.hero.layout ?? "default";

    const contentRight =
        layout === "content-left";

    return (
        <section
            className="
                relative
                min-h-[78svh]
                overflow-hidden
                bg-background

                md:min-h-[82svh]
            "
        >
            <CollectionHeroMedia
                media={series.hero.media}
            />

            <CollectionHeroOverlay
                layout={layout}
            />

            <CollectionHighlight />

            <Container
                size="wide"
                className="
                    relative
                    z-20
                    flex
                    min-h-[78svh]
                    flex-col
                    justify-end
                    py-12

                    md:min-h-[82svh]
                    md:justify-center
                    md:py-16
                "
            >
                <div
                    className={`
                        flex
                        w-full
                        flex-col
                        gap-10

                        md:max-w-[48%]

                        ${contentRight
                            ? "md:ml-auto md:items-end md:text-right"
                            : ""
                        }
                    `}
                >
                    <CollectionHeroContent
                        series={series}
                        artworkCount={
                            artworks.length
                        }
                    />

                    <CollectionPreviewWorks
                        artworks={artworks}
                        seriesSlug={series.slug}
                    />
                </div>
            </Container>
        </section>
    );
}   