/** @module components/python-interpreter-question */

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
 * @tp-dependency tp-python
 * @summary Provides an interactive Python interpreter.
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

import { TpInterpreterQuestion } from "../interpreter-question/interpreter-question.js";
import { TpPython } from "../python/python.js";
import { TpPythonPlayground } from "../python-playground/python-playground.js";
/**
 * The custom `<tp-python-interpreter-question>` element presents and grades Python exercises in an interactive interpreter.
 *
 * @summary Presents and grades Python exercises in an interactive interpreter.
 * @tagname tp-python-interpreter-question
 * @attr {string} query = "" - Initial query for exploring the program; required to run the interpreter.
 * @attr {string} value = "" - Initial program when src is absent.
 * @keyboard {Enter / Shift+Enter} Reloads changed source and executes the query from its input.
 * @example
 * <tp-python-interpreter-question query="double(3)" open="" src="/docs/components/python-interpreter-question/examples/double.py">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Run the query to explore the program, then submit to run the tests.</dd>
 *     <dt>Feedback</dt><dd>/docs/components/python-interpreter-question/examples/double.test.py</dd>
 *     <dt>Solution</dt><dd>Return value * 2.</dd>
 *   </dl>
 * </tp-python-interpreter-question>
 */
export class TpPythonInterpreterQuestion extends TpInterpreterQuestion<TpPython> {
	protected readonly language = "python";
	protected override createInterpreter(): TpPython {
		return new TpPython();
	}
	protected override createTestRunner(): TpPythonPlayground {
		return new TpPythonPlayground();
	}
}
if (!customElements.get("tp-python-interpreter-question"))
	customElements.define(
		"tp-python-interpreter-question",
		TpPythonInterpreterQuestion,
	);
declare global {
	interface HTMLElementTagNameMap {
		"tp-python-interpreter-question": TpPythonInterpreterQuestion;
	}
}
