import "server-only";

// Reviewed migration identity only; no DDL executes in the application.
// The test checks this manifest against every actual migration file.
export const catalogueSchemaVersion = [{
    id: "0001_catalogue",
    checksum: "62650759a8f40de1f8c38d321278cc3ed341947f11f55e177330da68f7edb69a",
}] as const;
