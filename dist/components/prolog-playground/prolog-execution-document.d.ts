/**
 * @module components/prolog-playground/prolog-execution-document
 * @summary Scryer Prolog execution document builder.
 */
import type { TpExecutionDocument } from '../playground/playground.js';
import type { TpPrologProject } from './prolog-project.js';
/** Options for building a Prolog execution document. */
export interface BuildPrologExecutionDocumentOptions {
    /** Entry Prolog source file. */
    entry?: string;
    /** Query Prolog source file. */
    query?: string;
    scope?: string;
    index?: number;
}
/** Builds the Scryer Prolog execution document. */
export declare function buildPrologExecutionDocument(project: TpPrologProject, options?: BuildPrologExecutionDocumentOptions): Promise<TpExecutionDocument>;
/** Returns a small escaped source preview for diagnostics. */
export declare function createPrologSourcePreview(source: string): string;
