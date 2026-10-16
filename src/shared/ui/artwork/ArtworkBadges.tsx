import type { Artwork } from "@/domains/artworks/model/artwork";
import { getArtworkPresentation } from "@/domains/artworks/presentation/getArtworkPresentation";

interface Props {
    artwork: Artwork;
    detailed?: boolean;
    className?: string;
}

export default function ArtworkBadges({ artwork, detailed = false, className = "" }: Props) {
    const { badges } = getArtworkPresentation(artwork);
    if (!badges.length) return null;

    return (
        <ul aria-label="Artwork highlights" className={`flex flex-wrap gap-2 ${className}`}>
            {badges.map((badge) => (
                <li key={badge.id} className="max-w-full border border-brand-gold/30 bg-black/35 px-2 py-1 font-sans text-[9px] font-medium uppercase leading-4 tracking-[0.12em] text-brand-gold">
                    <span>{badge.label}</span>
                    {badge.detail && (
                        <span className={detailed
                            ? "mt-1 block font-normal normal-case tracking-normal text-white/60"
                            : "sr-only"}>
                            {badge.detail}
                        </span>
                    )}
                </li>
            ))}
        </ul>
    );
}
