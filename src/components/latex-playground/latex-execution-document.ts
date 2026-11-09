/** @module components/latex-playground/latex-execution-document */
import { buildIframeDocument } from "../html-viewer/html-viewer.js";
import type { TpExecutionDocument } from "../playground/playground.js";
import {
	createCommonRuntimeScript,
	createConsoleBridgeScript,
	resolveEntryFile,
} from "../playground/playground-build-utils.js";
import { resolveLatexInputs } from "./latex-inputs.js";
import type { TpLatexProject } from "./latex-project.js";
/** Builds a browser document using the same renderer as tp-latex-viewer. */
export async function buildLatexExecutionDocument(
	project: TpLatexProject,
): Promise<TpExecutionDocument> {
	const entry = resolveEntryFile(project, {
		priorityPaths: ["/main.tex", "/index.tex"],
		extensions: [".tex", ".latex"],
		fallbackToFirstFile: false,
	});
	if (!entry) throw new Error("No LaTeX entry file found.");
	const latex = document.createElement("tp-latex");
	latex.setAttribute("value", resolveLatexInputs(project, entry.path));
	const scripts =
		createCommonRuntimeScript() +
		createConsoleBridgeScript() +
		`<script>
 document.addEventListener('tp-latex-error', event => console.error(event.detail.message));
 document.addEventListener('tp-tikz-error', event => console.error(event.detail.message));
 </script>`;
	return {
		html: buildIframeDocument(scripts + latex.outerHTML, document.baseURI),
	};
}
