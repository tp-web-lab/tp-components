/**
 * @module components/markdown-playground/markdown-execution-document
 * @summary Markdown execution document builder.
 */
import type { TpExecutionDocument } from '../playground/playground.js';
import type { TpMarkdownProject } from './markdown-project.js';
/** Options for building a Markdown execution document. */
export interface BuildMarkdownExecutionDocumentOptions {
    entry?: string;
}
/** Builds the Markdown execution document. */
export declare function buildMarkdownExecutionDocument(project: TpMarkdownProject, options?: BuildMarkdownExecutionDocumentOptions): Promise<TpExecutionDocument>;
