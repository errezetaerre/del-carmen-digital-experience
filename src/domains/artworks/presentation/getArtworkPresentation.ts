import { getArtworkYear } from "@/domains/artworks/model/artworkDate";
import type { Artwork } from "../model/artwork";
import { artworkRecognitions } from "../data/artworkRecognitions";
import { homeCuration } from "@/domains/home/curation/homeCuration";
import type { SiteLocale } from "@/i18n/config";
import { getSiteMessages } from "@/i18n/messages";
import type { ArtworkSeries } from "../series/types";
import { catalogueArtworkPresentation, catalogueSeriesPresentation } from "./cataloguePresentation";

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
    return catalogueArtworkPresentation(artwork)?.featured ?? homeCuration.featuredWork.artworkId === artwork.id;
}

export function isCoverArtwork(artwork: Pick<Artwork, "id">): boolean {
    return catalogueArtworkPresentation(artwork)?.cover ?? homeCuration.hero.artworkId === artwork.id;
}

export function isFeaturedArtworkSeries(series: Pick<ArtworkSeries, "id"> | string): boolean {
    if (typeof series !== "string") {
        const context = catalogueSeriesPresentation(series);
        if (context) return context.featured;
    }
    return homeCuration.featuredCollection.seriesId === (typeof series === "string" ? series : series.id);
}

// This derived presentation joins existing Home curation with artwork state/history.
// Featured is not duplicated as a persisted boolean on Artwork.
export function getArtworkPresentation(artwork: Artwork, locale: SiteLocale = "en"): ArtworkPresentation {
    const copy = getSiteMessages(locale).Artwork;
    const plannedFor = copy.plannedFor.replace("{year}", String(getArtworkYear(artwork.date)));
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

    // Empty supplied history is authoritative too; never restore a file award.
    for (const recognition of catalogueArtworkPresentation(artwork)?.recognitions ?? artworkRecognitions) {
        if (recognition.artworkId !== artwork.id) continue;
        const translatedEvents = getSiteMessages(locale).Recognitions;
        const englishEvents = getSiteMessages("en").Recognitions;
        // The existing event dictionary is a reviewed EN/ES display adapter,
        // not authority for changed/new event names stored in the catalogue.
        const knownEvent = Object.prototype.hasOwnProperty.call(englishEvents, recognition.id)
            ? englishEvents[recognition.id as keyof typeof englishEvents].event : undefined;
        const event = locale === "es" && recognition.event === knownEvent && Object.prototype.hasOwnProperty.call(translatedEvents, recognition.id)
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
        yearLabel: planned || inProgress ? plannedFor : String(getArtworkYear(artwork.date)),
        previewLabel: planned ? copy.plannedPreview : inProgress ? copy.progressPreview : undefined,
    };
}
