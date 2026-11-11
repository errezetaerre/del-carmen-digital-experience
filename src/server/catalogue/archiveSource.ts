import "server-only";
import { connection } from "next/server";
import { locales } from "@/i18n/config";
import { readFileCatalogue } from "./fileReader";
import { CatalogueError, requireCatalogue } from "./snapshot";
import type { CatalogueEnvironment } from "./postgresClient.mjs";

export function artworkArchiveSource(env: CatalogueEnvironment): "files" | "postgres" {
    // Production activation is a separate reviewed increment, even if someone
    // accidentally adds the Preview flag to the Production environment.
    if (env.VERCEL_ENV === "production") return "files";
    const source = env.CATALOGUE_ARTWORKS_SOURCE ?? "files";
    requireCatalogue(source === "files" || source === "postgres", "invalid_catalogue_artworks_source");
    return source;
}

export async function getArtworkArchiveArtworks() {
    if (artworkArchiveSource(process.env) === "files") return readFileCatalogue().getArtworkViews(locales);
    // Keep Next's prerender bailout OUTSIDE the error sanitizer. No connection,
    // schema check, query or snapshot can run during the opted-in static build.
    await connection();
    try {
        const { readArtworkArchiveCatalogue } = await import("./archiveRuntime");
        const repository = await readArtworkArchiveCatalogue();
        return repository.getArtworkViews(locales);
    } catch {
        // Provider errors may contain query/row/connection details. Do not pass
        // those to the framework logger or an error page, and never fall back.
        throw new CatalogueError("catalogue_archive_read_failed");
    }
}
