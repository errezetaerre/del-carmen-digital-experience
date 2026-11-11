import { getArtworkSeries, getArtworksBySeriesId } from "@/domains/artworks/series/services";
import { createCollectionEntries, type CollectionEntry } from "./collectionEntries";
export type { CollectionEntry } from "./collectionEntries";

export function getCollections(): CollectionEntry[] {
    return createCollectionEntries(getArtworkSeries(), getArtworksBySeriesId);
}
