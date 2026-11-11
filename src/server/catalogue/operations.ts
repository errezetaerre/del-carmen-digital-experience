import "server-only";
import { createHash } from "node:crypto";
import { catalogueFromRows, catalogueTables, catalogueToRows, emptyCatalogueRows, type CatalogueRow, type CatalogueRows, type CatalogueTable } from "./rows";
import { requireCatalogue, type CatalogueSnapshot } from "./snapshot";

export interface CatalogueSession {
    query(text: string, parameters?: unknown[]): Promise<CatalogueRow[]>;
    execute(trustedSql: string): Promise<void>;
}
export interface CatalogueDatabase extends CatalogueSession {
    transaction<T>(run: (session: CatalogueSession) => Promise<T>, readOnly?: boolean): Promise<T>;
}
export interface CatalogueMigration { id: string; checksum: string; sql: string }

function canonical(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(canonical);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, item]) => [key, canonical(item)]));
}
// SQL row order is not an artwork fact. Category and Home curated sequences ARE.
export function catalogueFingerprint(snapshot: CatalogueSnapshot): string {
    const rows = catalogueToRows(snapshot);
    for (const records of Object.values(rows)) records.sort((a, b) => {
        const first = JSON.stringify(canonical(a)), second = JSON.stringify(canonical(b));
        return first < second ? -1 : first > second ? 1 : 0;
    });
    return createHash("sha256").update(JSON.stringify(canonical(rows))).digest("hex");
}
export function assertCatalogueEquivalent(expected: CatalogueSnapshot, actual: CatalogueSnapshot): void {
    requireCatalogue(catalogueFingerprint(expected) === catalogueFingerprint(actual), "catalogue_not_equivalent");
}

export async function migrateCatalogue(database: CatalogueDatabase, migrations: readonly CatalogueMigration[]): Promise<"applied" | "unchanged"> {
    requireCatalogue(migrations.length > 0 && new Set(migrations.map(item => item.id)).size === migrations.length, "invalid_migration_metadata");
    for (const [index, migration] of migrations.entries()) {
        requireCatalogue(/^[0-9]{4}_[a-z_]+$/.test(migration.id) && /^[a-f0-9]{64}$/.test(migration.checksum) && (index === 0 || migrations[index - 1].id < migration.id), "invalid_migration_metadata");
        requireCatalogue(createHash("sha256").update(migration.sql).digest("hex") === migration.checksum, "migration_checksum_mismatch");
    }
    return database.transaction(async session => {
        await session.query("select pg_advisory_xact_lock(734048210)");
        await session.execute("create schema if not exists catalogue; revoke all on schema catalogue from public; create table if not exists catalogue.schema_migration (id text primary key, checksum text not null, applied_at timestamptz not null default current_timestamp)");
        const applied = await session.query("select id, checksum from catalogue.schema_migration order by id");
        for (const [index, existing] of applied.entries()) {
            requireCatalogue(migrations[index]?.id === existing.id, "unexpected_schema_version");
            requireCatalogue(migrations[index].checksum === existing.checksum, "applied_migration_changed");
        }
        for (const migration of migrations.slice(applied.length)) {
            await session.execute(migration.sql);
            await session.query("insert into catalogue.schema_migration (id, checksum) values ($1, $2)", [migration.id, migration.checksum]);
        }
        return applied.length === migrations.length ? "unchanged" : "applied";
    });
}

export async function readCatalogueRows(session: CatalogueSession): Promise<CatalogueRows> {
    const rows = emptyCatalogueRows();
    for (const [table, columns] of Object.entries(catalogueTables)) rows[table as CatalogueTable] = await session.query(`select ${columns.join(", ")} from catalogue.${table}`);
    return rows;
}
export async function verifyCatalogueSchema(session: CatalogueSession, migrations: readonly Pick<CatalogueMigration, "id" | "checksum">[]): Promise<void> {
    const applied = await session.query("select id, checksum from catalogue.schema_migration order by id");
    requireCatalogue(applied.length === migrations.length && applied.every((row, index) => row.id === migrations[index].id && row.checksum === migrations[index].checksum), "schema_version_mismatch");
    const columns = await session.query("select table_name, column_name from information_schema.columns where table_schema = 'catalogue' and table_name <> 'schema_migration'");
    const actual = columns.map(row => `${row.table_name}.${row.column_name}`).sort();
    const expected = Object.entries(catalogueTables).flatMap(([table, fields]) => fields.map(field => `${table}.${field}`)).sort();
    requireCatalogue(JSON.stringify(actual) === JSON.stringify(expected), "schema_column_mismatch");
}
export async function readCatalogueSnapshot(database: CatalogueDatabase): Promise<CatalogueSnapshot> {
    return database.transaction(async session => catalogueFromRows(await readCatalogueRows(session)), true);
}
export async function seedCatalogue(database: CatalogueDatabase, source: CatalogueSnapshot): Promise<"imported" | "unchanged"> {
    const imported = catalogueToRows(source);
    return database.transaction(async session => {
        await session.query("select pg_advisory_xact_lock(734048210)");
        const current = await readCatalogueRows(session);
        if (Object.values(current).some(records => records.length > 0)) {
            assertCatalogueEquivalent(source, catalogueFromRows(current));
            return "unchanged";
        }
        for (const [table, columns] of Object.entries(catalogueTables)) {
            const records = imported[table as CatalogueTable];
            if (!records.length) continue;
            const parameters: unknown[] = [];
            const values = records.map(row => `(${columns.map(column => {
                const item = row[column];
                requireCatalogue(item !== undefined, "missing_import_column");
                // The driver owns JSONB serialization. Pre-stringifying here
                // makes Postgres.js 4 encode an object as a JSON string instead.
                parameters.push(item);
                return `$${parameters.length}`;
            }).join(", ")})`).join(", ");
            await session.query(`insert into catalogue.${table} (${columns.join(", ")}) values ${values}`, parameters);
        }
        // Verify every persisted field inside the SAME transaction before commit.
        const actual = catalogueFromRows(await readCatalogueRows(session));
        assertCatalogueEquivalent(source, actual);
        return "imported";
    });
}
