/** @module components/latex-playground/latex-inputs */
import type { TpLatexProject } from "./latex-project.js";
/** Expand literal input paths from the entry directory, using only project files. */
export declare function resolveLatexInputs(project: TpLatexProject, entryPath: string): string;
