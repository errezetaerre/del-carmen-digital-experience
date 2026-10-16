import type { Artwork } from "../model/artwork";
import { artworkRecognitions } from "../data/artworkRecognitions";
import { homeCuration } from "@/domains/home/curation/homeCuration";

export interface ArtworkBadge {
    id: string;
    label: string;
    detail?: string;
}

export interface ArtworkPresentation {
    badges: readonly ArtworkBadge[];
    statusLabel: string;
    yearLabel: string;
    previewLabel?: string;
}

export function isArtworkAvailable(artwork: Artwork): boolean {
    return artwork.creationStatus === "completed" && artwork.availability === "available";
}

// This derived presentation joins existing Home curation with artwork state/history.
// Featured is not duplicated as a persisted boolean on Artwork.
export function getArtworkPresentation(artwork: Artwork): ArtworkPresentation {
    const planned = artwork.creationStatus === "planned";
    const inProgress = artwork.creationStatus === "in-progress";
    const badges: ArtworkBadge[] = [];

    if (planned || inProgress) {
        badges.push({
            id: "creation-status",
            label: planned ? "Coming soon" : "In progress",
            detail: `Planned for ${artwork.year}`,
        });
    }

    for (const recognition of artworkRecognitions) {
        if (recognition.artworkId !== artwork.id) continue;

        const label = recognition.kind === "selection"
            ? "Official Selection"
            : recognition.kind === "honourable-mention" ? "Honourable Mention" : "Award-winning";

        badges.push({
            id: recognition.id,
            label,
            detail: [recognition.title === label ? "" : recognition.title, recognition.event, recognition.year]
                .filter(Boolean).join(" · "),
        });
    }

    if (homeCuration.featuredWork.artworkId === artwork.id) {
        badges.push({ id: "featured", label: "Featured" });
    }

    const availability = {
        available: "Available",
        reserved: "Reserved",
        sold: "Sold",
        unavailable: "Not available",
    };

    return {
        badges,
        statusLabel: planned ? "Coming soon" : inProgress ? "In progress" : availability[artwork.availability],
        yearLabel: planned || inProgress ? `Planned for ${artwork.year}` : String(artwork.year),
        previewLabel: planned ? "Planned artwork preview" : inProgress ? "Work in progress" : undefined,
    };
}
