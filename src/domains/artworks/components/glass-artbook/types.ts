import type gsap from "gsap";
import type { Artwork } from "@/domains/artworks";
import type { ArtworkPresentation } from "../../presentation/getArtworkPresentation";

export interface ArtworkGlassArtbookProps {
    artworks: Artwork[];
    initialArtworkId: string;
    navigationQuery: string;
    backHref: string;
    backLabel: string;
}

export interface GlassArtbookOptions {
    artworks: readonly Artwork[];
    initialArtworkId: string;
    instanceId: string;
    motion?: typeof gsap;
    getPresentation?: (artwork: Artwork) => ArtworkPresentation;
    onNavigate?: (artwork: Artwork) => void;
}

export interface GlassArtbookController {
    navigate(direction: -1 | 1): void;
    select(id: string): void;
    dispose(): void;
}
