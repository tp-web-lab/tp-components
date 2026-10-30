/** @module components/html-viewer-question */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-console
 * @summary Displays structured console output.
 */
/**
 * @tp-dependency tp-html-viewer
 * @summary Interactive HTML viewer with editable source, live rendering, and DOM inspection.
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

import type { TpHtmlViewer } from "../html-viewer/html-viewer.js";
import "../html-viewer/html-viewer.js";
import { TpMarkupViewerQuestion } from "../markup-viewer-question/markup-viewer-question.js";
/**
 * @summary checks rendered HTML using a viewer and external JavaScript DOM tests.
 * @tagname tp-html-viewer-question
 * @accessibility Reuses question actions, feedback tabs and the editable markup viewer.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-html-viewer-question open src="/docs/components/markup-viewer-question/examples/emphasis.html" test="/docs/components/markup-viewer-question/examples/emphasis.test.js">
 *   <dl>
 *     <dt>Title</dt><dd>Semantic emphasis</dd>
 *     <dt>Prompt</dt><dd>Mark Hello with strong emphasis. Open Code to edit, then submit.</dd>
 *     <dt>Solution</dt><dd>Use the language's strong-emphasis syntax.</dd>
 *   </dl>
 * </tp-html-viewer-question>
 */
export class TpHtmlViewerQuestion extends TpMarkupViewerQuestion<TpHtmlViewer> {
	/** Creates the fixed HTML response viewer. */
	protected override createViewer(): TpHtmlViewer {
		return document.createElement("tp-html-viewer") as TpHtmlViewer;
	}
}
if (!customElements.get("tp-html-viewer-question"))
	customElements.define("tp-html-viewer-question", TpHtmlViewerQuestion);
declare global {
	interface HTMLElementTagNameMap {
		"tp-html-viewer-question": TpHtmlViewerQuestion;
	}
}
