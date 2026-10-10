/**
 * @module components/restructuredtext-playground/restructuredtext-execution-document
 * @summary reStructuredText execution document builder.
 */
import type { TpExecutionDocument } from '../playground/playground.js';
import type { TpRestructuredTextProject } from './restructuredtext-project.js';
/** Options for building a reStructuredText execution document. */
export interface BuildRestructuredTextExecutionDocumentOptions {
    entry?: string;
    libs?: string[];
}
/** Builds the reStructuredText execution document. */
export declare function buildRestructuredTextExecutionDocument(project: TpRestructuredTextProject, options?: BuildRestructuredTextExecutionDocumentOptions): Promise<TpExecutionDocument>;
