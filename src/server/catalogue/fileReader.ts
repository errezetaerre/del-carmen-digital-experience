import "server-only";
import { loadCatalogueFiles } from "./fileSource";
import { createCatalogueRepository } from "./reader";

// File mode uses the same read projection as PostgreSQL. No provider, cache of
// request-specific state, connection, migration or write is initialized here.
export function readFileCatalogue() {
    return createCatalogueRepository(loadCatalogueFiles());
}
