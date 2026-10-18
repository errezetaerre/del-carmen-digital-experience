import type { Artwork } from "@/domains/artworks/model/artwork";
import type { SiteLocale } from "./config";
import { getSiteMessages } from "./messages";
import spanishArtworkCopyData from "./content/artworks.es.json";

// Editorial translations are keyed to canonical IDs. Facts, titles and asset paths
// continue to come from the owner's single catalogue.
interface ArtworkTranslation {
    quote?: string;
    description?: string;
    images?: Partial<Record<keyof Artwork["images"], string>>;
}

const spanishArtworkCopy: Readonly<Record<string, ArtworkTranslation>> = spanishArtworkCopyData;

export function artworkTextLocale(artwork: Artwork, locale: SiteLocale): SiteLocale {
    return locale === "es" && spanishArtworkCopy[artwork.id] ? "es" : "en";
}

export function localizeArtwork(artwork: Artwork, locale: SiteLocale): Artwork {
    const copy = locale === "es" ? spanishArtworkCopy[artwork.id] : undefined;
    if (!copy) return artwork;
    const images = { ...artwork.images };
    for (const variant of Object.keys(copy.images ?? {}) as Array<keyof Artwork["images"]>) {
        const image = images[variant];
        const alt = copy.images?.[variant];
        if (image && alt) images[variant] = { ...image, alt };
    }
    return {
        ...artwork,
        ...(copy.quote !== undefined ? { quote: copy.quote } : {}),
        ...(copy.description !== undefined ? { description: copy.description } : {}),
        images,
    };
}

export function formatArtworkAuthorship(artwork: Artwork, locale: SiteLocale): string {
    const copy = getSiteMessages(locale).Artwork;
    return { original: copy.original, "master-copy": copy.masterCopy, "study-after": copy.studyAfter }[artwork.authorship];
}

export function formatArtworkMedium(medium: Artwork["medium"], locale: SiteLocale): string {
    const copy = getSiteMessages(locale).Artwork;
    return { oil: copy.oil, graphite: copy.graphite, charcoal: copy.charcoal, "mixed-media": copy.mixedMedia }[medium];
}

export function formatArtworkTechnique(artwork: Artwork, locale: SiteLocale): string {
    const format = (value: string) => value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
    if (locale === "en") return `${format(artwork.medium)} on ${format(artwork.support)}`;
    const copy = getSiteMessages(locale).Artwork;
    const medium = formatArtworkMedium(artwork.medium, locale);
    const support = { canvas: copy.canvas, paper: copy.paper, "tonal paper Strathmore": copy.tonalStrathmore, "tonal paper Canson": copy.tonalCanson, "using white pencil": copy.whitePencil, "using color pencils": copy.colorPencils }[artwork.support];
    const label = support.replace(/^Con /, "con ");
    return artwork.support.startsWith("using ") ? `${medium} ${label}` : `${medium} ${copy.on} ${label.charAt(0).toLocaleLowerCase("es") + label.slice(1)}`;
}

export function formatArtworkCategory(category: string, locale: SiteLocale): string {
    const labels = getSiteMessages(locale).Categories;
    return Object.prototype.hasOwnProperty.call(labels, category) ? labels[category as keyof typeof labels] : category.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
