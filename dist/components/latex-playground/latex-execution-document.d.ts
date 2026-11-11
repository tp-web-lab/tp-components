import type { TpExecutionDocument } from "../playground/playground.js";
import type { TpLatexProject } from "./latex-project.js";
/** Builds a browser document using the same renderer as tp-latex-viewer. */
export declare function buildLatexExecutionDocument(project: TpLatexProject): Promise<TpExecutionDocument>;
