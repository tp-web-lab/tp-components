/** @module components/javascript-interpreter-question */

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
 * @tp-dependency tp-javascript
 * @summary Provides an interactive JavaScript interpreter.
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

import { TpInterpreterQuestion } from "../interpreter-question/interpreter-question.js";
import { TpJavascript } from "../javascript/javascript.js";
import { TpJavascriptPlayground } from "../javascript-playground/javascript-playground.js";
/**
 * The custom `<tp-javascript-interpreter-question>` element presents and grades JavaScript exercises in an interactive interpreter.
 *
 * @summary Presents and grades JavaScript exercises in an interactive interpreter.
 * @tagname tp-javascript-interpreter-question
 * @attr {string} query = "" - Initial query for exploring the program; required to run the interpreter.
 * @attr {string} value = "" - Initial program when src is absent.
 * @keyboard {Enter / Shift+Enter} Reloads changed source and executes the query from its input.
 * @example
 * <tp-javascript-interpreter-question query="double(3)" open="" src="/docs/components/javascript-interpreter-question/examples/double.js">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Run the query to explore the program, then submit to run the tests.</dd>
 *     <dt>Feedback</dt><dd>/docs/components/javascript-interpreter-question/examples/double.test.js</dd>
 *     <dt>Solution</dt><dd>Return value * 2.</dd>
 *   </dl>
 * </tp-javascript-interpreter-question>
 */
export class TpJavascriptInterpreterQuestion extends TpInterpreterQuestion<TpJavascript> {
	protected readonly language = "javascript";
	protected override createInterpreter(): TpJavascript {
		return new TpJavascript();
	}
	protected override createTestRunner(): TpJavascriptPlayground {
		return new TpJavascriptPlayground();
	}
}
if (!customElements.get("tp-javascript-interpreter-question"))
	customElements.define(
		"tp-javascript-interpreter-question",
		TpJavascriptInterpreterQuestion,
	);
declare global {
	interface HTMLElementTagNameMap {
		"tp-javascript-interpreter-question": TpJavascriptInterpreterQuestion;
	}
}
