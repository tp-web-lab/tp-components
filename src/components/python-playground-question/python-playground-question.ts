/** @module components/python-playground-question */

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
 * @tp-dependency tp-python-playground
 * @summary Python playground component.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
// tp-docgen:dependencies:end

import { TpPlaygroundQuestion } from "../playground-question/playground-question.js";
import { TpPythonPlayground } from "../python-playground/python-playground.js";

/**
 * @summary checks a Python exercise using the playground and an external test file.
 * @tagname tp-python-playground-question
 * @accessibility Reuses TpQuestion's disclosure, actions and feedback tabs.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-python-playground-question open src="/docs/components/playground-question/examples/python/double.py" test="/docs/components/playground-question/examples/python/double.test.py">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Edit the source, then submit to run the tests.</dd>
 *     <dt>Solution</dt><dd>Return value * 2.</dd>
 *   </dl>
 * </tp-python-playground-question>
 */
export class TpPythonPlaygroundQuestion extends TpPlaygroundQuestion<TpPythonPlayground> {
	/** Creates the fixed python playground; no language or mode attributes are needed. */
	protected override createPlayground(): TpPythonPlayground {
		return new TpPythonPlayground();
	}
}
if (!customElements.get("tp-python-playground-question"))
	customElements.define(
		"tp-python-playground-question",
		TpPythonPlaygroundQuestion,
	);
declare global {
	interface HTMLElementTagNameMap {
		"tp-python-playground-question": TpPythonPlaygroundQuestion;
	}
}
