import type { ArtworkSeriesStatus, ArtworkSeriesPublicationStatus } from "../src/domains/artworks";

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Expect<T extends true> = T;

export type SeriesLifecycleContract = [
    Expect<Equal<ArtworkSeriesStatus, "upcoming" | "ongoing" | "completed">>,
    Expect<Equal<ArtworkSeriesPublicationStatus, "draft" | "published" | "archived">>,
];
