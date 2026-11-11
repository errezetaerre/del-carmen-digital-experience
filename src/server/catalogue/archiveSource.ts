import "server-only";
import { connection } from "next/server";
import { locales } from "@/i18n/config";
import { readFileCatalogue } from "./fileReader";
import { CatalogueError, requireCatalogue } from "./snapshot";
import type { CatalogueEnvironment } from "./postgresClient.mjs";

// Print only controlled categories, never the original driver error or its fields.
const productionDiagnostics = new Map<string, string>([
    ["production_catalogue_reader_secret_missing", "secret_missing"],
    ["missing_or_malformed_database_url", "secret_format"],
    ["invalid_database_url", "secret_format"],
    ["not_a_neon_database", "target_mismatch"],
    ["production_catalogue_target_mismatch", "target_mismatch"],
    ["production_catalogue_reader_role_required", "wrong_role"],
    ...["database_tls_required", "CHANNEL_BINDING_REQUIRED", "ERR_TLS_CERT_ALTNAME_INVALID", "CERT_HAS_EXPIRED",
        "UNABLE_TO_VERIFY_LEAF_SIGNATURE", "SELF_SIGNED_CERT_IN_CHAIN", "DEPTH_ZERO_SELF_SIGNED_CERT"]
        .map(code => [code, "tls_or_channel_binding"] as const),
    ...["28P01", "28000", "SASL_SIGNATURE_MISMATCH"].map(code => [code, "authentication"] as const),
    ...["CONNECT_TIMEOUT", "ETIMEDOUT", "ENOTFOUND", "EAI_AGAIN", "ECONNREFUSED", "ECONNRESET", "08001", "08006", "57P03", "53300"]
        .map(code => [code, "connection"] as const),
    ["42501", "permissions"],
    ...["42P01", "3F000", "3D000", "schema_version_mismatch", "schema_column_mismatch"]
        .map(code => [code, "schema"] as const),
    ["catalogue_not_equivalent", "catalogue_equivalence"],
    ["XX000", "provider_error"],
    ["ERR_MODULE_NOT_FOUND", "runtime_module"],
    ["MODULE_NOT_FOUND", "runtime_module"],
]);
let reportedProductionFailure: string | undefined;

function reportProductionArchiveFailure(error: unknown) {
    if (process.env.VERCEL_ENV !== "production") return;
    const code = typeof error === "object" && error !== null && "code" in error ? error.code : undefined;
    const reason = (typeof code === "string" && productionDiagnostics.get(code)) || "unexpected";
    if (reportedProductionFailure === reason) return;
    reportedProductionFailure = reason;
    console.warn(`Catalogue Production archive read failed: ${reason}`);
}

export function artworkArchiveSource(env: CatalogueEnvironment): "files" | "postgres" {
    // A saved secret is not an opt-in. Preview and Production have independent switches.
    const production = env.VERCEL_ENV === "production";
    const source = (production ? env.CATALOGUE_PRODUCTION_SOURCE : env.CATALOGUE_ARTWORKS_SOURCE) ?? "files";
    requireCatalogue(source === "files" || source === "postgres",
        production ? "invalid_catalogue_production_source" : "invalid_catalogue_artworks_source");
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
        const artworks = repository.getArtworkViews(locales);
        reportedProductionFailure = undefined;
        return artworks;
    } catch (error) {
        // Provider errors may contain query/row/connection details. Do not pass
        // those to the framework logger or an error page, and never fall back.
        reportProductionArchiveFailure(error);
        throw new CatalogueError("catalogue_archive_read_failed");
    }
}
