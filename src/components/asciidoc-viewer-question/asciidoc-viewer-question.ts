/** @module components/asciidoc-viewer-question */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-asciidoc-viewer
 * @summary Interactive AsciiDoc viewer with editable source and parser outputs.
 */
/**
 * @tp-dependency tp-console
 * @summary Displays structured console output.
 */
/**
 * @tp-dependency tp-iframe
 * @summary Controlled iframe component.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
/**
 * @credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
 * @summary Shared parsers, games and rendering utilities.
 */
/**
 * @credit es-module-lexer https://github.com/guybedford/es-module-lexer
 * @summary ECMAScript module import analysis.
 */
/**
 * @credit Chai https://www.chaijs.com/
 * @summary Assertions in browser tests.
 */
/**
 * @credit Lit https://lit.dev/
 * @summary Web-component examples and import maps.
 */
/**
 * @credit Mocha https://mochajs.org/
 * @summary Browser test execution.
 */
// tp-docgen:dependencies:end

import type { TpAsciidocViewer } from "../asciidoc-viewer/asciidoc-viewer.js";
import "../asciidoc-viewer/asciidoc-viewer.js";
import { TpMarkupViewerQuestion } from "../markup-viewer-question/markup-viewer-question.js";
/**
 * @summary checks rendered AsciiDoc using a viewer and external JavaScript DOM tests.
 * @tagname tp-asciidoc-viewer-question
 * @accessibility Reuses question actions, feedback tabs and the editable markup viewer.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-asciidoc-viewer-question open src="/docs/components/markup-viewer-question/examples/emphasis.adoc" test="/docs/components/markup-viewer-question/examples/emphasis.test.js">
 *   <dl>
 *     <dt>Title</dt><dd>Semantic emphasis</dd>
 *     <dt>Prompt</dt><dd>Mark Hello with strong emphasis. Open Code to edit, then submit.</dd>
 *     <dt>Solution</dt><dd>Use the language's strong-emphasis syntax.</dd>
 *   </dl>
 * </tp-asciidoc-viewer-question>
 */
export class TpAsciidocViewerQuestion extends TpMarkupViewerQuestion<TpAsciidocViewer> {
	/** Creates the fixed AsciiDoc response viewer. */
	protected override createViewer(): TpAsciidocViewer {
		return document.createElement("tp-asciidoc-viewer") as TpAsciidocViewer;
	}
}
if (!customElements.get("tp-asciidoc-viewer-question"))
	customElements.define(
		"tp-asciidoc-viewer-question",
		TpAsciidocViewerQuestion,
	);
declare global {
	interface HTMLElementTagNameMap {
		"tp-asciidoc-viewer-question": TpAsciidocViewerQuestion;
	}
}
