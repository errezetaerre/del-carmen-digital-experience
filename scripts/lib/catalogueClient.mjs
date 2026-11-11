// Keep existing operator/test imports stable; the server owns the shared driver.
export {
    CatalogueConfigError,
    catalogueConnectionConfig,
    catalogueReaderConfig,
    createCatalogueClient,
    catalogueClientFromSql,
} from "../../src/server/catalogue/postgresClient.mjs";
