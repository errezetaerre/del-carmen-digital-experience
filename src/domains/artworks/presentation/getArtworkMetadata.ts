import type { Artwork } from "../model/artwork";
import { createPageMetadata } from "@/shared/lib/metadata";

export function getArtworkMetadata(artwork: Artwork) {
    const state = artwork.creationStatus === "planned" ? "Coming soon" :
        artwork.creationStatus === "in-progress" ? "In progress" : null;
    const title = state ? `${artwork.title} — ${state}` : artwork.title;
    const authorship = { original: "original artwork", "master-copy": "master copy", "study-after": "study after" }[artwork.authorship];
    const status = state ? `${state}. ${artwork.title} is a ${artwork.creationStatus === "planned" ? "planned artwork" : "work in progress"}.` :
        `${artwork.title} (${artwork.year}), ${authorship}.`;
    const detail = artwork.description?.trim() || artwork.quote?.trim() ||
        `${artwork.medium.replace(/-/g, " ")} on ${artwork.support}.`;
    return createPageMetadata({ title, description: `${status} ${detail}` });
}
