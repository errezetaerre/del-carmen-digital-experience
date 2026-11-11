import "server-only";
import { artworks } from "@/domains/artworks/data/artworks";
import { artworkSeries } from "@/domains/artworks/series/artworkSeries";
import { artworkRecognitions } from "@/domains/artworks/data/artworkRecognitions";
import { homeCuration } from "@/domains/home/curation/homeCuration";
import artworkCopy from "@/i18n/content/artworks.es.json";
import seriesCopyData from "@/i18n/content/series.es.json";
import { assertCatalogueSnapshot, requireCatalogue, type CatalogueSnapshot } from "./snapshot";

interface SeriesCopy {
    description?: string;
    statement?: string;
    featuredAlt?: string;
    hero?: { desktopAlt?: string; mobileAlt?: string; videoAlt?: string };
}
const seriesCopy: Readonly<Record<string, SeriesCopy>> = seriesCopyData;

// One mapping of the CURRENT owner-maintained files, shared by seed tooling and
// the temporary runtime parity gate. This is not a frozen copy of an older seed.
export function loadCatalogueFiles(): CatalogueSnapshot {
    const snapshot = structuredClone({
        artworks, series: artworkSeries, recognitions: [...artworkRecognitions], homeCuration,
        artworkTranslations: Object.entries(artworkCopy).map(([artworkId, copy]) => ({ artworkId, locale: "es", ...copy })),
        seriesTranslations: Object.entries(seriesCopy).map(([seriesId, copy]) => {
            requireCatalogue(Object.keys(copy).every(key => ["description", "statement", "featuredAlt", "hero"].includes(key)) && Object.keys(copy.hero ?? {}).every(key => ["desktopAlt", "mobileAlt", "videoAlt"].includes(key)), "unmapped_series_translation_attribute");
            const mediaAlts: Record<string, string> = {};
            if (copy.featuredAlt !== undefined) mediaAlts["images.featured.alt"] = copy.featuredAlt;
            if (copy.hero?.desktopAlt !== undefined) mediaAlts["hero.media.desktop.alt"] = copy.hero.desktopAlt;
            if (copy.hero?.mobileAlt !== undefined) mediaAlts["hero.media.mobile.alt"] = copy.hero.mobileAlt;
            if (copy.hero?.videoAlt !== undefined) mediaAlts["hero.media.alt"] = copy.hero.videoAlt;
            return { seriesId, locale: "es", ...(copy.description === undefined ? {} : { description: copy.description }), ...(copy.statement === undefined ? {} : { statement: copy.statement }), ...(Object.keys(mediaAlts).length ? { mediaAlts } : {}) };
        }),
    });
    assertCatalogueSnapshot(snapshot);
    return snapshot;
}
