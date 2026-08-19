export type { Artwork } from "./model";

export {
    getArtworkById,
    getArtworks,
} from "./services";

export {
    Artwork as ArtworkComponent,
    ArtworkHero,
    ArtworkMetadata,
} from "./components";

export {
    artworkSeries,
    getArtworkSeries,
    getArtworkSeriesById,
    getArtworkSeriesBySlug,
    getArtworksBySeriesId,
} from "./series";

export type {
    ArtworkSeries,
    ArtworkSeriesStatus,
} from "./series";