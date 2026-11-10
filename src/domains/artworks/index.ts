export type { Artwork, ArtworkDate } from "./model";

export {
    getArtworkById,
    getArtworkBySlug,
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
    ArtworkSeriesPublicationStatus,
} from "./series";
