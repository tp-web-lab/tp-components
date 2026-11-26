/** @module components/scheme-viewer-question */
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
 * @tp-dependency tp-scheme-viewer
 * @summary Compact Scheme code viewer and runner.
 */
// tp-docgen:dependencies:end

import { TpPlaygroundQuestion } from "../playground-question/playground-question.js";
import { TpSchemeViewer } from "../scheme-viewer/scheme-viewer.js";

/**
 * The custom `<tp-scheme-viewer-question>` element presents and grades Scheme programming exercises.
 *
 * @summary Presents and grades Scheme programming exercises.
 * @tagname tp-scheme-viewer-question
 * @accessibility Reuses TpQuestion's disclosure, actions and feedback tabs.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-scheme-viewer-question open src="/docs/components/scheme-playground/examples/double.scm">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Edit the source, then submit to run the tests.</dd>
 *     <dt>Feedback</dt><dd>/docs/components/scheme-playground/examples/double.test.scm</dd>
 *     <dt>Solution</dt><dd>Return (* x 2).</dd>
 *   </dl>
 * </tp-scheme-viewer-question>
 */
export class TpSchemeViewerQuestion extends TpPlaygroundQuestion<TpSchemeViewer> {
	/** Creates the fixed scheme viewer; no language or mode attributes are needed. */
	protected override createPlayground(): TpSchemeViewer {
		return new TpSchemeViewer();
	}
}
if (!customElements.get("tp-scheme-viewer-question"))
	customElements.define("tp-scheme-viewer-question", TpSchemeViewerQuestion);
declare global {
	interface HTMLElementTagNameMap {
		"tp-scheme-viewer-question": TpSchemeViewerQuestion;
	}
}
