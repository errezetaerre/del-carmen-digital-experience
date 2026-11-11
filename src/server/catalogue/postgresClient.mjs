import postgres from "postgres";

// Approved Neon main compute, never the integration's Preview or owner URL.
const productionCatalogueHost = "ep-lingering-silence-bbokbc7w-pooler.c-15.us-east-1.aws.neon.tech";

export class CatalogueConfigError extends Error {
    constructor(code) { super(code); this.name = "CatalogueConfigError"; this.code = code; }
}
function requireConfig(condition, code) { if (!condition) throw new CatalogueConfigError(code); }
function connection(value) {
    requireConfig(typeof value === "string" && value.length > 0 && !/[\s\u201c\u201d\u2018\u2019]/.test(value), "missing_or_malformed_database_url");
    let url;
    try { url = new URL(value); } catch { throw new CatalogueConfigError("missing_or_malformed_database_url"); }
    requireConfig(["postgres:", "postgresql:"].includes(url.protocol) && url.username && url.password && url.pathname.length > 1 && !url.hash, "invalid_database_url");
    requireConfig(/^ep-[a-z0-9-]+\.[a-z0-9.-]+\.neon\.tech$/.test(url.hostname), "not_a_neon_database");
    requireConfig(["require", "verify-ca", "verify-full"].includes(url.searchParams.get("sslmode")), "database_tls_required");
    const endpoint = url.hostname.split(".")[0].replace(/-pooler$/, "");
    return { url: url.toString(), endpoint, host: url.hostname, identity: `${url.hostname.replace('-pooler.', '.')}${url.pathname}:${url.username}` };
}
export function catalogueConnectionConfig(env, write = false) {
    const pooled = connection(env.DATABASE_URL);
    const direct = env.DATABASE_URL_UNPOOLED ? connection(env.DATABASE_URL_UNPOOLED) : undefined;
    if (direct) requireConfig(direct.identity === pooled.identity && !direct.host.split(".")[0].endsWith("-pooler"), "database_urls_disagree");
    if (write) {
        requireConfig(!env.VERCEL && !env.VERCEL_ENV && env.NODE_ENV !== "production", "local_development_writes_only");
        requireConfig(env.CATALOGUE_DB_TARGET === "development", "development_target_required");
        requireConfig(/^ep-[a-z0-9-]+$/.test(env.CATALOGUE_DB_ENDPOINT ?? "") && env.CATALOGUE_DB_ENDPOINT === pooled.endpoint, "development_endpoint_mismatch");
        requireConfig(direct, "unpooled_database_url_required");
    }
    return write ? direct : pooled;
}

// Non-production read configuration shared by tools and the server-only DAL.
export function catalogueReaderConfig(env) {
    requireConfig(env.VERCEL_ENV !== "production", "production_catalogue_reads_not_activated");
    const config = catalogueConnectionConfig(env);
    if (env.VERCEL_ENV === "preview") return config;
    requireConfig(!env.VERCEL && !env.VERCEL_ENV && env.CATALOGUE_DB_TARGET === "development", "development_read_target_required");
    requireConfig(env.CATALOGUE_DB_ENDPOINT === config.endpoint, "development_endpoint_mismatch");
    return config;
}

// Production is available to the request reader only. Operator commands keep
// their existing non-production guards and cannot use this configuration.
export function catalogueProductionReaderConfig(env) {
    requireConfig(env.VERCEL_ENV === "production" && env.CATALOGUE_PRODUCTION_SOURCE === "postgres",
        "production_catalogue_read_not_requested");
    const value = env.CATALOGUE_PRODUCTION_READ_URL;
    requireConfig(typeof value === "string" && value.length > 0, "production_catalogue_reader_secret_missing");
    const config = connection(value);
    const url = new URL(config.url);
    requireConfig(url.hostname === productionCatalogueHost && (!url.port || url.port === "5432") && url.pathname === "/neondb",
        "production_catalogue_target_mismatch");
    requireConfig(url.username === "catalogue_reader", "production_catalogue_reader_role_required");
    // Use only canonical TLS/authentication options, without inherited URL options.
    url.search = "";
    url.searchParams.set("sslmode", "verify-full");
    url.searchParams.set("channel_binding", "require");
    return { ...config, url: url.toString() };
}

export function createCatalogueClient(config) {
    // Explicit CA/hostname verification overrides sslmode=require's weaker default.
    // Lazy one-connection pool, used only after an explicit operator/server read.
    const sql = postgres(config.url, { max: 1, ssl: "verify-full", connect_timeout: 15, idle_timeout: 5, prepare: false, onnotice() {}, connection: { application_name: "del-carmen-catalogue-tools", statement_timeout: 60000 } });
    return catalogueClientFromSql(sql);
}

// The same adapter is exercised by the real-driver PostgreSQL protocol test.
export function catalogueClientFromSql(sql) {
    const session = client => ({
        // Trusted constant SQL/identifiers; all catalogue values are parameters.
        query: async (text, parameters = []) => Array.from(await client.unsafe(text, parameters)),
        execute: async trustedSql => { await client.unsafe(trustedSql).simple(); },
    });
    return {
        ...session(sql),
        transaction: (run, readOnly = false) => sql.begin(readOnly ? "isolation level repeatable read read only" : "", transaction => run(session(transaction))),
        close: () => sql.end({ timeout: 5 }),
    };
}
