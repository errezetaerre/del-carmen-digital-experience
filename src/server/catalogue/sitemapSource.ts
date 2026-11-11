import "server-only";
import { connection } from "next/server";
import { artworkArchiveSource } from "./archiveSource";
import { readFileCatalogue } from "./fileReader";
import type { CatalogueRepository } from "./reader";
import { CatalogueError } from "./snapshot";

// A sitemap has no editorial/physical row-order contract. Stable paths need no
// additional stored order, translated payloads or per-record SQL queries.
export function catalogueSitemapPaths(repository: Pick<CatalogueRepository, "getArtworks" | "getSeries">): string[] {
    return [
        ...repository.getArtworks().map(work => `/artworks/${work.slug}`),
        ...repository.getSeries().filter(series => series.publicationStatus === "published").map(series => `/series/${series.slug}`),
    ].sort();
}

export async function getCatalogueSitemapPaths(): Promise<string[]> {
    if (artworkArchiveSource(process.env) === "files") return catalogueSitemapPaths(readFileCatalogue());
    await connection(); // Next's request boundary must escape the sanitizer.
    try {
        const { readArtworkArchiveCatalogue } = await import("./archiveRuntime");
        return catalogueSitemapPaths(await readArtworkArchiveCatalogue("sitemap"));
    } catch {
        throw new CatalogueError("catalogue_sitemap_read_failed");
    }
}
