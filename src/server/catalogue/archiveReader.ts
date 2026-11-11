import "server-only";
import { assertCatalogueEquivalent, verifyCatalogueSchema, type CatalogueDatabase } from "./operations";
import { createCatalogueReader } from "./reader";
import { catalogueSchemaVersion } from "./schemaVersion";
import { requireCatalogue, type CatalogueSnapshot } from "./snapshot";

export function createArtworkArchiveReader(database: CatalogueDatabase, expected: CatalogueSnapshot, options: { ttlMs?: number; now?: () => number } = {}) {
    const baseline = structuredClone(expected);
    const checked: CatalogueDatabase = {
        query: database.query.bind(database),
        execute: database.execute.bind(database),
        transaction(run, readOnly) {
            requireCatalogue(readOnly === true, "catalogue_archive_read_only");
            return database.transaction(async session => {
                // Schema and data are checked in the same consistent snapshot.
                await verifyCatalogueSchema(session, catalogueSchemaVersion);
                return run(session);
            }, true);
        },
    };
    return createCatalogueReader(checked, {
        ...options,
        // Facts, editorial, curation, badges and navigation consume this snapshot.
        // Actual isolated Preview and controlled release/activation still need
        // full parity; independent database edits are not enabled here.
        validate: actual => assertCatalogueEquivalent(baseline, actual),
    });
}
