import type { Artwork } from "../model/artwork";
import { artworkRecognitions } from "../data/artworkRecognitions";
import { homeCuration } from "@/domains/home/curation/homeCuration";
import type { SiteLocale } from "@/i18n/config";
import { getSiteMessages } from "@/i18n/messages";

export interface ArtworkBadge {
    id: string;
    kind: "cover" | "featured" | "award" | "honourable-mention" | "selection" | "planned" | "in-progress";
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

export function isFeaturedArtwork(artwork: Artwork): boolean {
    return homeCuration.featuredWork.artworkId === artwork.id;
}

export function isCoverArtwork(artwork: Pick<Artwork, "id">): boolean {
    return homeCuration.hero.artworkId === artwork.id;
}

export function isFeaturedArtworkSeries(seriesId: string): boolean {
    return homeCuration.featuredCollection.seriesId === seriesId;
}

// This derived presentation joins existing Home curation with artwork state/history.
// Featured is not duplicated as a persisted boolean on Artwork.
export function getArtworkPresentation(artwork: Artwork, locale: SiteLocale = "en"): ArtworkPresentation {
    const copy = getSiteMessages(locale).Artwork;
    const plannedFor = copy.plannedFor.replace("{year}", String(artwork.year));
    const planned = artwork.creationStatus === "planned";
    const inProgress = artwork.creationStatus === "in-progress";
    const badges: ArtworkBadge[] = [];

    if (planned || inProgress) {
        badges.push({
            id: "creation-status",
            kind: planned ? "planned" : "in-progress",
            label: planned ? copy.comingSoon : copy.inProgress,
            detail: plannedFor,
        });
    }

    if (isCoverArtwork(artwork)) {
        badges.push({ id: "cover", kind: "cover", label: copy.cover, detail: copy.coverDetail });
    }

    if (isFeaturedArtwork(artwork)) {
        badges.push({ id: "featured", kind: "featured", label: copy.featured, detail: copy.curatorial });
    }

    for (const recognition of artworkRecognitions) {
        if (recognition.artworkId !== artwork.id) continue;
        const translatedEvents = getSiteMessages(locale).Recognitions;
        const event = locale === "es" && Object.prototype.hasOwnProperty.call(translatedEvents, recognition.id)
            ? translatedEvents[recognition.id as keyof typeof translatedEvents].event
            : recognition.event;

        const label = recognition.kind === "selection"
            ? copy.selection
            : recognition.kind === "honourable-mention" ? copy.honourableMention : copy.award;
        const originalLabel = recognition.kind === "selection" ? "Official Selection" : recognition.kind === "honourable-mention" ? "Honourable Mention" : "Award";

        badges.push({
            id: recognition.id,
            kind: recognition.kind,
            label,
            detail: [recognition.title === originalLabel ? "" : recognition.title, event, recognition.year]
                .filter(Boolean).join(" · "),
        });
    }

    const availability = {
        available: copy.available,
        reserved: copy.reserved,
        sold: copy.sold,
        unavailable: copy.unavailable,
    };

    return {
        badges,
        statusLabel: planned ? copy.comingSoon : inProgress ? copy.inProgress : availability[artwork.availability],
        yearLabel: planned || inProgress ? plannedFor : String(artwork.year),
        previewLabel: planned ? copy.plannedPreview : inProgress ? copy.progressPreview : undefined,
    };
}
