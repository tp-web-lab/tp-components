/**
 * @module components/asciidoc-playground/asciidoc-execution-document
 * @summary AsciiDoc execution document builder.
 */
import type { TpExecutionDocument } from '../playground/playground.js';
import type { TpAsciidocProject } from './asciidoc-project.js';
/** Options for building an AsciiDoc execution document. */
export interface BuildAsciidocExecutionDocumentOptions {
    entry?: string;
}
/** Builds the AsciiDoc execution document. */
export declare function buildAsciidocExecutionDocument(project: TpAsciidocProject, options?: BuildAsciidocExecutionDocumentOptions): Promise<TpExecutionDocument>;
