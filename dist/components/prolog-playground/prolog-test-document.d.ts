/**
 * @module components/prolog-playground/prolog-test-document
 * @summary Scryer Prolog test document builder.
 */
import type { TpExecutionDocument } from '../playground/playground.js';
import type { TpPrologProject } from './prolog-project.js';
/** Options for building a Prolog test document. */
export interface BuildPrologTestDocumentOptions {
    /** Default test file path. */
    defaultTest?: string;
}
/** Builds the Scryer Prolog test execution document. */
export declare function buildPrologTestDocument(project: TpPrologProject, options?: BuildPrologTestDocumentOptions): Promise<TpExecutionDocument>;
