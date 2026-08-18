import { getArtworkById } from "@/domains/artworks";

export function getHeroArtwork() {
  return getArtworkById("epifania_nupcial");
}


export function getFeaturedWorkArtwork() {
  return getArtworkById("sendero_del_sol");
}