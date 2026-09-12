import Image from "next/image";

import type { ArtworkSeriesHeroMedia } from "@/domains/artworks/series";

interface CollectionHeroMediaProps {
    media: ArtworkSeriesHeroMedia;
}

export default function CollectionHeroMedia({
    media,
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

    return (
        <div className="absolute inset-0 overflow-hidden">
            <picture>
                <source
                    media="(max-width: 767px)"
                    srcSet={media.mobile.src}
                />

                <Image
                    src={media.desktop.src}
                    alt={media.desktop.alt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={false}
                />
            </picture>
        </div>
    );
}