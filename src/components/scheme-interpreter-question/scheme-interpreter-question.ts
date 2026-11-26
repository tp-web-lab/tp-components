/** @module components/scheme-interpreter-question */

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
 * @tp-dependency tp-scheme
 * @summary Provides an interactive Scheme interpreter.
 */
/**
 * @tp-dependency tp-scheme-playground
 * @summary Edits and runs a Scheme project with LIPS.
 */
// tp-docgen:dependencies:end

import { TpInterpreterQuestion } from "../interpreter-question/interpreter-question.js";
import { TpScheme } from "../scheme/scheme.js";
import { TpSchemePlayground } from "../scheme-playground/scheme-playground.js";
/**
 * The custom `<tp-scheme-interpreter-question>` element presents and grades Scheme exercises in an interactive interpreter.
 *
 * @summary Presents and grades Scheme exercises in an interactive interpreter.
 * @tagname tp-scheme-interpreter-question
 * @attr {string} query = "" - Initial query for exploring the program; required to run the interpreter.
 * @attr {string} value = "" - Initial program when src is absent.
 * @keyboard {Enter / Shift+Enter} Reloads changed source and executes the query from its input.
 * @example
 * <tp-scheme-interpreter-question query="(double 3)" open src="/docs/components/scheme-interpreter-question/examples/double.scm">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Run the query to explore the program, then submit to run the tests.</dd>
 *     <dt>Feedback</dt><dd>/docs/components/scheme-interpreter-question/examples/double.test.scm</dd>
 *     <dt>Solution</dt><dd>Return (* x 2).</dd>
 *   </dl>
 * </tp-scheme-interpreter-question>
 */
export class TpSchemeInterpreterQuestion extends TpInterpreterQuestion<TpScheme> {
	protected readonly language = "scheme";
	protected override createInterpreter(): TpScheme {
		return new TpScheme();
	}
	protected override createTestRunner(): TpSchemePlayground {
		return new TpSchemePlayground();
	}
}
if (!customElements.get("tp-scheme-interpreter-question"))
	customElements.define(
		"tp-scheme-interpreter-question",
		TpSchemeInterpreterQuestion,
	);
declare global {
	interface HTMLElementTagNameMap {
		"tp-scheme-interpreter-question": TpSchemeInterpreterQuestion;
	}
}
