import type gsap from "gsap";
import type { Artwork } from "@/domains/artworks";
import type { SiteLocale } from "@/i18n/config";
import type { ArtworkPresentation } from "../../presentation/getArtworkPresentation";

export interface ArtworkGlassArtbookProps {
    artworks: Artwork[];
    initialArtworkId: string;
    navigationQuery: string;
    backHref: string;
    backLabel: string;
}

export interface GlassArtbookOptions {
    locale?: SiteLocale;
    artworks: readonly Artwork[];
    initialArtworkId: string;
    instanceId: string;
    motion?: typeof gsap;
    getPresentation?: (artwork: Artwork) => ArtworkPresentation;
    renderPreview?: (artwork: Artwork) => string;
    onHighlightArtwork?: (slot: 0 | 1, artwork: Artwork) => void;
    onNavigate?: (artwork: Artwork) => void;
    onLoadStateChange?: (state: GlassArtbookLoadState) => void;
}

export interface GlassArtbookLoadState {
    status: "loading" | "ready" | "error";
    artworkId: string;
    kind: "entrance" | "turn" | "selection";
}

export interface GlassArtbookController {
    navigate(direction: -1 | 1): void;
    select(id: string): void;
    retry(): void;
    dispose(): void;
}
