import "server-only";
import { locales } from "@/i18n/config";
import { readFileCatalogue } from "./fileReader";
import { connection } from "next/server";
import { artworkArchiveSource } from "./archiveSource";
import { createArtworkSeriesCatalogue } from "./seriesCatalogue";
import { CatalogueError } from "./snapshot";

export async function getArtworkSeriesCatalogue(scope: "collections" | "series" = "series") {
    if (artworkArchiveSource(process.env) === "files") {
        const repository = readFileCatalogue();
        return createArtworkSeriesCatalogue(repository.getArtworkViews(locales), repository.getSeriesViews(locales));
    }
    await connection();
    try {
        const { readArtworkArchiveCatalogue } = await import("./archiveRuntime");
        const repository = await readArtworkArchiveCatalogue(scope);
        return createArtworkSeriesCatalogue(repository.getArtworkViews(locales), repository.getSeriesViews(locales));
    } catch {
        throw new CatalogueError(scope === "collections" ? "catalogue_collections_read_failed" : "catalogue_series_read_failed");
    }
}
