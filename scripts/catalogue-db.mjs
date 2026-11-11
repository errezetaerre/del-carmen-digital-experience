import nextEnv from "@next/env";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { serverModules } from "./lib/loadProjectModule.mjs";
import { loadCatalogueSource } from "./lib/catalogueSource.mjs";
import { catalogueConnectionConfig, catalogueReaderConfig, createCatalogueClient } from "./lib/catalogueClient.mjs";
import { safeCatalogueConstraint } from "./lib/catalogueDiagnostics.mjs";

const command = process.argv[2];
let client;
try {
    if (!["check", "migrate", "seed", "verify", "read"].includes(command) || process.argv.length !== 3) throw Object.assign(new Error(), { code: "usage_check_migrate_seed_verify_read" });
    // Load existing env files without rewriting them or printing their contents.
    const project = fileURLToPath(new URL("../", import.meta.url));
    nextEnv.loadEnvConfig(project, true, { info() {}, error() {} });
    const config = command === "read" ? catalogueReaderConfig(process.env)
        : catalogueConnectionConfig(process.env, command === "migrate" || command === "seed");
    client = createCatalogueClient(config);
    const load = serverModules();
    const operations = load("src/server/catalogue/operations.ts");
    const folder = new URL("../database/migrations/", import.meta.url);
    const migrations = readdirSync(folder).filter(name => /^[0-9]{4}_[a-z_]+\.sql$/.test(name)).sort().map(name => {
        const sql = readFileSync(new URL(name, folder), "utf8");
        return { id: name.slice(0, -4), sql, checksum: createHash("sha256").update(sql).digest("hex") };
    });
    if (command === "check") {
        const rows = await client.query("select 1 as connected, to_regclass('catalogue.schema_migration') is not null as migrated");
        console.log("PostgreSQL connection: OK (read-only probe)");
        console.log(`Catalogue migration journal: ${rows[0].migrated ? "present" : "not created yet"}`);
    } else if (command === "migrate") {
        console.log(`Catalogue migrations: ${await operations.migrateCatalogue(client, migrations)}`);
    } else {
        const source = loadCatalogueSource();
        if (command === "read") {
            // Reuse the application reader: version, all canonical fields and
            // public projections are verified from one read-only snapshot.
            const { createArtworkArchiveReader } = load("src/server/catalogue/archiveReader.ts");
            const { verifyCatalogueReadModel } = load("src/server/catalogue/verifyReadModel.ts");
            const repository = await createArtworkArchiveReader(client, source, { ttlMs: 0 }).read();
            const result = verifyCatalogueReadModel(repository, source);
            console.log(`Catalogue read repository: OK (${result.artworks} artworks, ${result.publishedSeries} published series, EN/ES)`);
            console.log("Catalogue consumers: OK (editorial, badges, curation, navigation, filters, sitemap)");
        } else {
            await operations.verifyCatalogueSchema(client, migrations);
            if (command === "seed") console.log(`Catalogue import: ${await operations.seedCatalogue(client, source)}`);
            const actual = await operations.readCatalogueSnapshot(client);
            operations.assertCatalogueEquivalent(source, actual);
        }
        console.log(`Catalogue equivalence: OK (${source.artworks.length} artworks, ${source.series.length} series, ${source.recognitions.length} recognition records)`);
        console.log(`Catalogue SHA-256: ${operations.catalogueFingerprint(source)}`);
    }
} catch (error) {
    const known = ["CatalogueError", "CatalogueConfigError"].includes(error?.name);
    const state = typeof error?.code === "string" && /^[0-9A-Z]{5}$/.test(error.code) ? error.code : undefined;
    console.error(`Catalogue ${command ?? "command"}: FAILED (${known ? error.code : state ? `SQLSTATE ${state}` : "configuration_or_connection_error"})`);
    const constraint = safeCatalogueConstraint(error);
    if (constraint) console.error(`Catalogue constraint: ${constraint}`);
    console.error("No URL, password, row data or query parameters were printed.");
    process.exitCode = 1;
} finally {
    if (client) { try { await client.close(); } catch { process.exitCode = 1; } }
}
