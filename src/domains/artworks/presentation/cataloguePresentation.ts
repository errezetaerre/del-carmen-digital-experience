import type { Artwork } from "../model/artwork";
import type { ArtworkRecognition } from "../model/artworkRecognition";
import type { ArtworkSeries } from "../series/types";

// Public read metadata, derived from one catalogue snapshot. These flags are
// never persistent Artwork/Series fields or columns, and contain no connection.
export interface CatalogueArtworkPresentation {
    readonly cataloguePresentation: {
        readonly kind: "artwork";
        readonly cover: boolean;
        readonly featured: boolean;
        readonly recognitions: readonly ArtworkRecognition[];
    };
}
export interface CatalogueSeriesPresentation {
    readonly cataloguePresentation: { readonly kind: "series"; readonly featured: boolean };
}

export function catalogueArtworkPresentation(artwork: Pick<Artwork, "id">) {
    const context = (artwork as Partial<CatalogueArtworkPresentation>).cataloguePresentation;
    if (context === undefined) return undefined; // Plain-record compatibility only.
    if (!context || context.kind !== "artwork" || typeof context.cover !== "boolean" ||
        typeof context.featured !== "boolean" || !Array.isArray(context.recognitions) ||
        context.recognitions.some(item => !item || item.artworkId !== artwork.id)) {
        throw new Error("invalid_catalogue_presentation");
    }
    return context;
}

export function catalogueSeriesPresentation(series: Pick<ArtworkSeries, "id">) {
    const context = (series as Partial<CatalogueSeriesPresentation>).cataloguePresentation;
    if (context === undefined) return undefined;
    if (!context || context.kind !== "series" || typeof context.featured !== "boolean") {
        throw new Error("invalid_catalogue_presentation");
    }
    return context;
}
