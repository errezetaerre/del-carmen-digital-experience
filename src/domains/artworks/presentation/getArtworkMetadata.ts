import type { Artwork } from "../model/artwork";
import { createPageMetadata } from "@/shared/lib/metadata";
import type { SiteLocale } from "@/i18n/config";
import { formatArtworkAuthorship, formatArtworkTechnique, localizeArtwork } from "@/i18n/artworkCopy";
import { getSiteMessages } from "@/i18n/messages";

export function getArtworkMetadata(sourceArtwork: Artwork, locale: SiteLocale = "en") {
    const artwork = localizeArtwork(sourceArtwork, locale);
    if (locale === "es") {
        const copy = getSiteMessages(locale).Artwork;
        const state = artwork.creationStatus === "planned" ? copy.comingSoon : artwork.creationStatus === "in-progress" ? copy.inProgress : null;
        const title = state ? `${artwork.title} — ${state}` : artwork.title;
        const status = state ? `${state}. ${artwork.title} es una ${artwork.creationStatus === "planned" ? "obra prevista" : "obra en proceso"}.` : `${artwork.title} (${artwork.year}), ${formatArtworkAuthorship(artwork, locale).toLocaleLowerCase("es")}.`;
        return createPageMetadata({ locale, title, description: `${status} ${artwork.description?.trim() || artwork.quote?.trim() || formatArtworkTechnique(artwork, locale) + "."}` });
    }
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
