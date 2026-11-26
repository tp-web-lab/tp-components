/** @module components/prolog-interpreter-question */

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
 * @tp-dependency tp-prolog
 * @summary Provides an interactive Prolog interpreter.
 */
/**
 * @tp-dependency tp-prolog-playground
 * @summary Prolog playground component.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
// tp-docgen:dependencies:end

import { TpInterpreterQuestion } from "../interpreter-question/interpreter-question.js";
import { TpProlog } from "../prolog/prolog.js";
import { TpPrologPlayground } from "../prolog-playground/prolog-playground.js";
/**
 * The custom `<tp-prolog-interpreter-question>` element presents and grades Prolog exercises in an interactive interpreter.
 *
 * @summary Presents and grades Prolog exercises in an interactive interpreter.
 * @tagname tp-prolog-interpreter-question
 * @attr {string} query = "" - Initial query for exploring the program; required to run the interpreter.
 * @attr {string} value = "" - Initial program when src is absent.
 * @keyboard {Enter / Shift+Enter} Reloads changed source and executes the query from its input.
 * @example
 * <tp-prolog-interpreter-question query="double(3, Result)." open="" src="/docs/components/prolog-interpreter-question/examples/double.pl">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Run the query to explore the program, then submit to run the tests.</dd>
 *     <dt>Feedback</dt><dd>/docs/components/prolog-interpreter-question/examples/double.test.pl</dd>
 *     <dt>Solution</dt><dd>Use Result is Value * 2.</dd>
 *   </dl>
 * </tp-prolog-interpreter-question>
 */
export class TpPrologInterpreterQuestion extends TpInterpreterQuestion<TpProlog> {
	protected readonly language = "prolog";
	protected override createInterpreter(): TpProlog {
		return new TpProlog();
	}
	protected override createTestRunner(): TpPrologPlayground {
		return new TpPrologPlayground();
	}
}
if (!customElements.get("tp-prolog-interpreter-question"))
	customElements.define(
		"tp-prolog-interpreter-question",
		TpPrologInterpreterQuestion,
	);
declare global {
	interface HTMLElementTagNameMap {
		"tp-prolog-interpreter-question": TpPrologInterpreterQuestion;
	}
}
