import Image from "next/image";

import type {
    ArtworkSeriesHeroLayout,
    ArtworkSeriesHeroMedia,
    ArtworkSeriesHeroMediaVariant,
} from "@/domains/artworks/series";

interface CollectionHeroMediaProps {
    media: ArtworkSeriesHeroMedia;
    layout?: ArtworkSeriesHeroLayout;
}

export default function CollectionHeroMedia({
    media,
    layout,
}: CollectionHeroMediaProps) {
    if (media.type === "video") {
        return (
            <div className="absolute inset-0 overflow-hidden">
                <video
                    className="h-full w-full object-cover"
                    autoPlay={media.autoplay ?? true}
                    loop={media.loop ?? true}
                    muted={media.muted ?? true}
                    playsInline
                    poster={media.posterDesktop.src}
                    aria-label={media.alt}
                >
                    {media.mobileSrc && (
                        <source
                            src={media.mobileSrc}
                            media="(max-width: 767px)"
                        />
                    )}
                    <source src={media.desktopSrc} />
                </video>
            </div>
        );
    }

    const mobileVariant = layout?.mobile?.media ?? "portrait";
    const tabletVariant = layout?.tablet?.media ?? mobileVariant;
    const desktopVariant = layout?.desktop?.media ?? "landscape";

    const getImage = (
        variant: ArtworkSeriesHeroMediaVariant,
    ) =>
        variant === "portrait"
            ? media.mobile
            : media.desktop;

    const mobileImage = getImage(mobileVariant);
    const tabletImage = getImage(tabletVariant);
    const desktopImage = getImage(desktopVariant);

    return (
        <div className="absolute inset-0 overflow-hidden">
            <picture>
                <source
                    media="(min-width: 1024px)"
                    srcSet={desktopImage.src}
                />
                <source
                    media="(min-width: 768px)"
                    srcSet={tabletImage.src}
                />
                <source srcSet={mobileImage.src} />
                <Image
                    src={desktopImage.src}
                    alt={desktopImage.alt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={false}
                />
            </picture>
        </div>
    );
}
