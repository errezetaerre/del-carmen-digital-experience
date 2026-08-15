import { artworks } from "../data";

export function getArtworkById(id: string) {
  return artworks.find((artwork) => artwork.id === id);
}