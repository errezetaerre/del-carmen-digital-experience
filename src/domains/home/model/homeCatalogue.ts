import type { Artwork } from "@/domains/artworks/model/artwork";
import type { FeaturedCollection } from "../services/types";

/** Public Home selection only; no repository, connection or translation registry. */
export interface HomeCatalogue {
    hero: Artwork | undefined;
    featured: Artwork | undefined;
    collection: FeaturedCollection | undefined;
    selected: Artwork[];
}
