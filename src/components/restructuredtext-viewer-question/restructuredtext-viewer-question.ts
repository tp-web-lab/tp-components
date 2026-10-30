/** @module components/restructuredtext-viewer-question */

// tp-docgen:dependencies:start
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
 * @tp-dependency tp-restructuredtext-viewer
 * @summary Interactive reStructuredText viewer with editable source and parser outputs.
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

import { TpMarkupViewerQuestion } from "../markup-viewer-question/markup-viewer-question.js";
import type { TpRestructuredTextViewer } from "../restructuredtext-viewer/restructuredtext-viewer.js";
import "../restructuredtext-viewer/restructuredtext-viewer.js";
/**
 * @summary checks rendered reStructuredText using a viewer and external JavaScript DOM tests.
 * @tagname tp-restructuredtext-viewer-question
 * @accessibility Reuses question actions, feedback tabs and the editable markup viewer.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-restructuredtext-viewer-question open src="/docs/components/markup-viewer-question/examples/emphasis.rst" test="/docs/components/markup-viewer-question/examples/emphasis.test.js">
 *   <dl>
 *     <dt>Title</dt><dd>Semantic emphasis</dd>
 *     <dt>Prompt</dt><dd>Mark Hello with strong emphasis. Open Code to edit, then submit.</dd>
 *     <dt>Solution</dt><dd>Use the language's strong-emphasis syntax.</dd>
 *   </dl>
 * </tp-restructuredtext-viewer-question>
 */
export class TpRestructuredTextViewerQuestion extends TpMarkupViewerQuestion<TpRestructuredTextViewer> {
	/** Creates the fixed reStructuredText response viewer. */
	protected override createViewer(): TpRestructuredTextViewer {
		return document.createElement(
			"tp-restructuredtext-viewer",
		) as TpRestructuredTextViewer;
	}
}
if (!customElements.get("tp-restructuredtext-viewer-question"))
	customElements.define(
		"tp-restructuredtext-viewer-question",
		TpRestructuredTextViewerQuestion,
	);
declare global {
	interface HTMLElementTagNameMap {
		"tp-restructuredtext-viewer-question": TpRestructuredTextViewerQuestion;
	}
}
