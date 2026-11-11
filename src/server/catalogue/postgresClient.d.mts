import type { CatalogueDatabase } from "./operations";

export interface CatalogueConnectionConfig {
    url: string;
    endpoint: string;
    host: string;
    identity: string;
}
export class CatalogueConfigError extends Error {
    readonly code: string;
    constructor(code: string);
}
export type CatalogueEnvironment = Readonly<Record<string, string | undefined>>;
export interface CatalogueClient extends CatalogueDatabase { close(): Promise<void> }
export function catalogueConnectionConfig(env: CatalogueEnvironment, write?: boolean): CatalogueConnectionConfig;
export function catalogueReaderConfig(env: CatalogueEnvironment): CatalogueConnectionConfig;
export function catalogueProductionReaderConfig(env: CatalogueEnvironment): CatalogueConnectionConfig;
export function createCatalogueClient(config: CatalogueConnectionConfig): CatalogueClient;
export function catalogueClientFromSql(sql: unknown): CatalogueClient;
