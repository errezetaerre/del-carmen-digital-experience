import {
  getArtworkById,
} from "@/domains/artworks";

import {
  homeCuration,
} from "@/domains/home/curation";

export function getHeroArtwork() {
  return getArtworkById(
    homeCuration.hero.artworkId,
  );
}

export function getFeaturedWorkArtwork() {
  return getArtworkById(
    homeCuration.featuredWork.artworkId,
  );
}