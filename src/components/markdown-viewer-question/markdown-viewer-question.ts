/** @module components/markdown-viewer-question */
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
 * @tp-dependency tp-markdown-viewer
 * @summary Interactive Markdown viewer with editable source and parser outputs.
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

import type { TpMarkdownViewer } from "../markdown-viewer/markdown-viewer.js";
import "../markdown-viewer/markdown-viewer.js";
import { TpMarkupViewerQuestion } from "../markup-viewer-question/markup-viewer-question.js";
/**
 * @summary checks rendered Markdown using a viewer and external JavaScript DOM tests.
 * @tagname tp-markdown-viewer-question
 * @accessibility Reuses question actions, feedback tabs and the editable markup viewer.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-markdown-viewer-question open src="/docs/components/markup-viewer-question/examples/emphasis.md" test="/docs/components/markup-viewer-question/examples/emphasis.test.js">
 *   <dl>
 *     <dt>Title</dt><dd>Semantic emphasis</dd>
 *     <dt>Prompt</dt><dd>Mark Hello with strong emphasis. Open Code to edit, then submit.</dd>
 *     <dt>Solution</dt><dd>Use the language's strong-emphasis syntax.</dd>
 *   </dl>
 * </tp-markdown-viewer-question>
 */
export class TpMarkdownViewerQuestion extends TpMarkupViewerQuestion<TpMarkdownViewer> {
	/** Creates the fixed Markdown response viewer. */
	protected override createViewer(): TpMarkdownViewer {
		return document.createElement("tp-markdown-viewer") as TpMarkdownViewer;
	}
}
if (!customElements.get("tp-markdown-viewer-question"))
	customElements.define(
		"tp-markdown-viewer-question",
		TpMarkdownViewerQuestion,
	);
declare global {
	interface HTMLElementTagNameMap {
		"tp-markdown-viewer-question": TpMarkdownViewerQuestion;
	}
}
