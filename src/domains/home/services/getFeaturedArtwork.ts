import { getArtworkById } from "@/domains/artworks";

export function getFeaturedArtwork() {
  return getArtworkById("epifania_nupcial");
}