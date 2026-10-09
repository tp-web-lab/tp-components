/**
 * @module components/python-playground/python-execution-document
 * @summary Python execution document builder.
 */
import type { TpExecutionDocument } from '../playground/playground.js';
import type { TpProject } from '../playground/project.js';
/** Options for building a Python execution document. */
export interface BuildPythonExecutionDocumentOptions {
    entry?: string;
    libs?: string[];
    scope?: string;
}
/** Builds the Python execution document. */
export declare function buildPythonExecutionDocument(project: TpProject, options?: BuildPythonExecutionDocumentOptions): Promise<TpExecutionDocument>;
