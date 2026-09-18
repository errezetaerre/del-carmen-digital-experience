import type {
    ArtworkSeries,
    ArtworkSeriesHeroContentPosition,
} from "@/domains/artworks/series";

import type { Artwork } from "@/domains/artworks";

import { Container } from "@/shared/layout";

import CollectionHeroContent from "./CollectionHeroContent";
import CollectionHeroMedia from "./CollectionHeroMedia";
import CollectionHeroMotion from "./CollectionHeroMotion";
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

    const layout = series.hero.layout;

    const mobileContent =
        layout?.mobile?.content ?? "bottom";
    const tabletContent =
        layout?.tablet?.content ?? mobileContent;
    const desktopContent =
        layout?.desktop?.content ?? "left";

    const verticalClass = (
        position: ArtworkSeriesHeroContentPosition,
        prefix = "",
    ) => {
        if (position === "top") {
            return `${prefix}justify-start`;
        }

        if (position === "bottom") {
            return `${prefix}justify-end`;
        }

        return `${prefix}justify-center`;
    };

    const alignmentClass = (
        position: ArtworkSeriesHeroContentPosition,
        prefix: "md:" | "lg:",
    ) => {
        if (position === "right") {
            return `${prefix}ml-auto ${prefix}items-end ${prefix}text-right`;
        }

        return `${prefix}mr-auto ${prefix}items-start ${prefix}text-left`;
    };

    return (
        <CollectionHeroMotion>
            <section
                data-collection-hero
                className="
                    relative
                    min-h-[78svh]
                    overflow-hidden
                    bg-background

                    md:min-h-[82svh]
                "
            >
                <div
                    data-collection-hero-media
                    className="absolute inset-0"
                >
                    <CollectionHeroMedia
                        media={series.hero.media}
                        layout={layout}
                    />
                </div>

                <CollectionHeroOverlay />

                <CollectionHighlight />

                <Container
                    size="wide"
                    className={`
                        relative
                        z-20
                        flex
                        min-h-[78svh]
                        flex-col
                        py-12

                        md:min-h-[82svh]
                        md:py-16

                        ${verticalClass(mobileContent)}
                        ${verticalClass(tabletContent, "md:")}
                        ${verticalClass(desktopContent, "lg:")}
                    `}
                >
                    <div
                        className={`
                            flex
                            w-full
                            flex-col
                            gap-10

                            md:max-w-[58%]
lg:max-w-[55%]

                            ${alignmentClass(tabletContent, "md:")}
                            ${alignmentClass(desktopContent, "lg:")}
                        `}
                    >
                        <div data-collection-hero-content>
                            <CollectionHeroContent
                                series={series}
                                artworkCount={artworks.length}
                            />
                        </div>

                        <CollectionPreviewWorks
                            artworks={artworks}
                            seriesSlug={series.slug}
                        />
                    </div>
                </Container>
            </section>
        </CollectionHeroMotion>
    );
}
