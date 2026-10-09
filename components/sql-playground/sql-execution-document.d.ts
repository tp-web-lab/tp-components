import type { TpExecutionDocument } from "../playground/playground.js";
import type { TpSqlProject } from "./sql-project.js";
export declare function createSqlStorageKey(project: {
    name?: string;
}): string;
export interface BuildSqlExecutionDocumentOptions {
    entry?: string;
    scope?: string;
}
export declare function buildSqlExecutionDocument(project: TpSqlProject, options?: BuildSqlExecutionDocumentOptions): Promise<TpExecutionDocument>;
