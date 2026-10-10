/**
 * @module components/python-playground/python-test-document
 * @summary Python test document builder.
 */
import type { TpExecutionDocument } from '../playground/playground.js';
import type { TpProject } from '../playground/project.js';
/** Options for building a Python test document. */
export interface BuildPythonTestDocumentOptions {
    defaultTest?: string;
    libs?: string[];
}
/** Builds the Python test execution document. */
export declare function buildPythonTestDocument(project: TpProject, options?: BuildPythonTestDocumentOptions): Promise<TpExecutionDocument>;
