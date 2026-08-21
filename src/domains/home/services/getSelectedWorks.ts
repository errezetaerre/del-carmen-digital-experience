import {
    getArtworkById,
} from "@/domains/artworks";

import {
    homeCuration,
} from "@/domains/home/curation";

import type {
    Artwork,
} from "@/domains/artworks";

export function getSelectedWorks():
    Artwork[] {
    return homeCuration.selectedWorks
        .map((artworkId) =>
            getArtworkById(artworkId),
        )
        .filter(
            (
                artwork,
            ): artwork is Artwork =>
                artwork !== undefined,
        );
}