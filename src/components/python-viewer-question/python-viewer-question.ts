/** @module components/python-viewer-question */

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
 * @tp-dependency tp-python-viewer
 * @summary Compact Python code viewer and runner.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
// tp-docgen:dependencies:end

import { TpPlaygroundQuestion } from "../playground-question/playground-question.js";
import { TpPythonViewer } from "../python-viewer/python-viewer.js";

/**
 * @summary checks a Python exercise using the viewer and an external test file.
 * @tagname tp-python-viewer-question
 * @accessibility Reuses TpQuestion's disclosure, actions and feedback tabs.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-python-viewer-question open src="/docs/components/playground-question/examples/python/double.py" test="/docs/components/playground-question/examples/python/double.test.py">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Open Code to edit, then submit to run the tests.</dd>
 *     <dt>Solution</dt><dd>Return value * 2.</dd>
 *   </dl>
 * </tp-python-viewer-question>
 */
export class TpPythonViewerQuestion extends TpPlaygroundQuestion<TpPythonViewer> {
	/** Creates the fixed python viewer; no language or mode attributes are needed. */
	protected override createPlayground(): TpPythonViewer {
		return new TpPythonViewer();
	}
}
if (!customElements.get("tp-python-viewer-question"))
	customElements.define("tp-python-viewer-question", TpPythonViewerQuestion);
declare global {
	interface HTMLElementTagNameMap {
		"tp-python-viewer-question": TpPythonViewerQuestion;
	}
}
