import "server-only";
import { locales } from "@/i18n/config";
import { readFileCatalogue } from "./fileReader";
import { connection } from "next/server";
import { artworkArchiveSource } from "./archiveSource";
import { createHomeCatalogue } from "./homeCatalogue";
import { CatalogueError } from "./snapshot";

export async function getHomeCatalogue() {
    if (artworkArchiveSource(process.env) === "files") {
        const repository = readFileCatalogue();
        return createHomeCatalogue(repository.getArtworkViews(locales), repository.getSeriesViews(locales), repository.getHomeCuration());
    }
    await connection();
    try {
        const { readArtworkArchiveCatalogue } = await import("./archiveRuntime");
        const repository = await readArtworkArchiveCatalogue("home");
        return createHomeCatalogue(repository.getArtworkViews(locales), repository.getSeriesViews(locales), repository.getHomeCuration());
    } catch {
        throw new CatalogueError("catalogue_home_read_failed");
    }
}
