import "server-only";
import { catalogueProductionReaderConfig, catalogueReaderConfig, createCatalogueClient } from "./postgresClient.mjs";
import { createArtworkArchiveReader } from "./archiveReader";
import { loadCatalogueFiles } from "./fileSource";
import type { CatalogueRepository } from "./reader";

let reader: ReturnType<typeof createArtworkArchiveReader> | undefined;
type CatalogueReadScope = "archive" | "detail" | "collections" | "series" | "home" | "sitemap";
const reported: Partial<Record<CatalogueReadScope, CatalogueRepository>> = {};
const messages: Record<CatalogueReadScope, string> = {
    sitemap: "Catalogue /sitemap.xml: PostgreSQL verified",
    home: "Catalogue /: PostgreSQL verified",
    archive: "Catalogue /artworks: PostgreSQL verified",
    detail: "Catalogue /artworks/[slug]: PostgreSQL verified",
    collections: "Catalogue /collections: PostgreSQL verified",
    series: "Catalogue /series/[slug]: PostgreSQL verified",
};

// Lazily initialized only AFTER the page opts in and waits for a real request.
// Reuse the bounded reader/pool across requests in this server instance.
export function readArtworkArchiveCatalogue(scope: CatalogueReadScope = "archive") {
    if (!reader) {
        const config = process.env.VERCEL_ENV === "production"
            ? catalogueProductionReaderConfig(process.env)
            : catalogueReaderConfig(process.env);
        const expected = loadCatalogueFiles();
        reader = createArtworkArchiveReader(createCatalogueClient(config), expected);
    }
    return reader.read().then(repository => {
        if (reported[scope] !== repository) {
            // Redacted operational evidence, once per successful cache refresh.
            // Never include credentials, endpoint, SQL or record contents.
            console.info(messages[scope]);
            reported[scope] = repository;
        }
        return repository;
    });
}
