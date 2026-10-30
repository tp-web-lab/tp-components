/** @module components/javascript-playground-question */
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
 * @tp-dependency tp-javascript-playground
 * @summary JavaScript playground component.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
// tp-docgen:dependencies:end

import { TpJavascriptPlayground } from "../javascript-playground/javascript-playground.js";
import { TpPlaygroundQuestion } from "../playground-question/playground-question.js";

/**
 * @summary checks a JavaScript exercise using the playground and an external test file.
 * @tagname tp-javascript-playground-question
 * @accessibility Reuses TpQuestion's disclosure, actions and feedback tabs.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-javascript-playground-question open src="/docs/components/playground-question/examples/javascript/double.js" test="/docs/components/playground-question/examples/javascript/double.test.js">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Edit the source, then submit to run the tests.</dd>
 *     <dt>Solution</dt><dd>Return value * 2.</dd>
 *   </dl>
 * </tp-javascript-playground-question>
 */
export class TpJavascriptPlaygroundQuestion extends TpPlaygroundQuestion<TpJavascriptPlayground> {
	/** Creates the fixed javascript playground; no language or mode attributes are needed. */
	protected override createPlayground(): TpJavascriptPlayground {
		return new TpJavascriptPlayground();
	}
}
if (!customElements.get("tp-javascript-playground-question"))
	customElements.define(
		"tp-javascript-playground-question",
		TpJavascriptPlaygroundQuestion,
	);
declare global {
	interface HTMLElementTagNameMap {
		"tp-javascript-playground-question": TpJavascriptPlaygroundQuestion;
	}
}
