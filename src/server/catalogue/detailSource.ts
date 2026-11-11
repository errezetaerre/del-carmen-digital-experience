import "server-only";
import { locales } from "@/i18n/config";
import { readFileCatalogue } from "./fileReader";
import { connection } from "next/server";
import { artworkArchiveSource } from "./archiveSource";
import { createArtworkDetailCatalogue } from "./detailCatalogue";
import { CatalogueError } from "./snapshot";

export async function getArtworkDetailCatalogue() {
    if (artworkArchiveSource(process.env) === "files") {
        const repository = readFileCatalogue();
        return createArtworkDetailCatalogue(repository.getArtworkViews(locales), repository.getSeriesViews(locales));
    }
    // Metadata and page rendering may call this concurrently. They share the
    // existing lazy reader/cache; Next's prerender signal must not be caught.
    await connection();
    try {
        const { readArtworkArchiveCatalogue } = await import("./archiveRuntime");
        const repository = await readArtworkArchiveCatalogue("detail");
        return createArtworkDetailCatalogue(repository.getArtworkViews(locales), repository.getSeriesViews(locales));
    } catch {
        throw new CatalogueError("catalogue_detail_read_failed");
    }
}
