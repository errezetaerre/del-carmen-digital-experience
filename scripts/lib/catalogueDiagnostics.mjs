const tables = new Set(["locale", "artwork_series", "artwork", "category", "artwork_category", "artwork_image", "artwork_translation", "series_translation", "artwork_recognition", "home_curation", "home_selected_artwork", "schema_migration"]);

// Never print raw errors, rows, messages, URLs or query parameters. Only known
// catalogue object identifiers can be returned as operational diagnostics.
export function safeCatalogueConstraint(error) {
    const table = error?.table_name, constraint = error?.constraint_name;
    if (error?.schema_name !== "catalogue" || !tables.has(table) || typeof constraint !== "string" || !/^[a-z_][a-z0-9_]{0,62}$/.test(constraint)) return undefined;
    if (!constraint.startsWith(`${table}_`) && constraint !== "series_cover_artwork_fk") return undefined;
    return `catalogue.${table}.${constraint}`;
}
