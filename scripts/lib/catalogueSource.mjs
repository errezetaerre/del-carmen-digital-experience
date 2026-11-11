import { serverModules } from "./loadProjectModule.mjs";

// Seed/verify and the staged page gate use the same current-file mapping.
export function loadCatalogueSource() {
    return serverModules()("src/server/catalogue/fileSource.ts").loadCatalogueFiles();
}
