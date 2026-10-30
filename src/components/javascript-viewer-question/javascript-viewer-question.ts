/** @module components/javascript-viewer-question */
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
 * @tp-dependency tp-javascript-viewer
 * @summary Compact JavaScript code viewer and runner.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
// tp-docgen:dependencies:end

import { TpJavascriptViewer } from "../javascript-viewer/javascript-viewer.js";
import { TpPlaygroundQuestion } from "../playground-question/playground-question.js";

/**
 * @summary checks a JavaScript exercise using the viewer and an external test file.
 * @tagname tp-javascript-viewer-question
 * @accessibility Reuses TpQuestion's disclosure, actions and feedback tabs.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-javascript-viewer-question open src="/docs/components/playground-question/examples/javascript/double.js" test="/docs/components/playground-question/examples/javascript/double.test.js">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Open Code to edit, then submit to run the tests.</dd>
 *     <dt>Solution</dt><dd>Return value * 2.</dd>
 *   </dl>
 * </tp-javascript-viewer-question>
 */
export class TpJavascriptViewerQuestion extends TpPlaygroundQuestion<TpJavascriptViewer> {
	/** Creates the fixed javascript viewer; no language or mode attributes are needed. */
	protected override createPlayground(): TpJavascriptViewer {
		return new TpJavascriptViewer();
	}
}
if (!customElements.get("tp-javascript-viewer-question"))
	customElements.define(
		"tp-javascript-viewer-question",
		TpJavascriptViewerQuestion,
	);
declare global {
	interface HTMLElementTagNameMap {
		"tp-javascript-viewer-question": TpJavascriptViewerQuestion;
	}
}
