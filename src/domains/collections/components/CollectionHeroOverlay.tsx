import type {
    ArtworkSeriesHeroLayout,
} from "@/domains/artworks/series";

interface CollectionHeroOverlayProps {
    layout?: ArtworkSeriesHeroLayout;
}

export default function CollectionHeroOverlay({
    layout = "default",
}: CollectionHeroOverlayProps) {
    const gradient =
        layout === "content-left"
            ? `
                bg-gradient-to-l
                from-black/70
                via-black/55
                via-45%
                to-transparent
                to-75%
            `
            : `
                bg-gradient-to-r
                from-black/70
                via-black/55
                via-45%
                to-transparent
                to-75%
            `;

    return (
        <>
            <div
                aria-hidden="true"
                className={`
                    absolute
                    inset-0
                    z-10
                    ${gradient}
                `}
            />

            <div
                aria-hidden="true"
                className="
                    absolute
                    inset-0
                    z-10
                    bg-gradient-to-t
                    from-black/35
                    via-transparent
                    to-black/15
                "
            />
        </>
    );
}