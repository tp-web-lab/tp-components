/**
 * @module components/playground/browser-test-document
 * @summary Browser test document builder for playground projects.
 */
import type { ImportMap } from "../../utilities/importmap/importmap-types.js";
import type { TpExecutionDocument } from "./playground.js";
import type { TpProject } from "./project.js";
/** Options for building a browser test document. */
export interface BuildBrowserTestDocumentOptions {
    kind?: "javascript" | "typescript";
    defaultTest?: string;
    importmap?: ImportMap;
}
/** Builds the browser-based test execution document. */
export declare function buildBrowserTestDocument(project: TpProject, options?: BuildBrowserTestDocumentOptions): Promise<TpExecutionDocument>;
