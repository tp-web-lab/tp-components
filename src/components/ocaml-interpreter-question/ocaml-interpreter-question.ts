/** @module components/ocaml-interpreter-question */

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
 * @tp-dependency tp-ocaml
 * @summary Provides an interactive OCaml interpreter.
 */
/**
 * @tp-dependency tp-ocaml-playground
 * @summary Edits and runs an OCaml project.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
// tp-docgen:dependencies:end

import { TpInterpreterQuestion } from "../interpreter-question/interpreter-question.js";
import { TpOCaml } from "../ocaml/ocaml.js";
import { TpOCamlPlayground } from "../ocaml-playground/ocaml-playground.js";
/**
 * The custom `<tp-ocaml-interpreter-question>` element presents and grades OCaml exercises in an interactive interpreter.
 *
 * @summary Presents and grades OCaml exercises in an interactive interpreter.
 * @tagname tp-ocaml-interpreter-question
 * @attr {string} query = "" - Initial query for exploring the program; required to run the interpreter.
 * @attr {string} value = "" - Initial program when src is absent.
 * @keyboard {Enter / Shift+Enter} Reloads changed source and executes the query from its input.
 * @example
 * <tp-ocaml-interpreter-question query="double 3;;" open src="/docs/components/ocaml-interpreter-question/examples/double.ml">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Run the query to explore the program, then submit to run the tests.</dd>
 *     <dt>Feedback</dt><dd>/docs/components/ocaml-interpreter-question/examples/double.test.ml</dd>
 *     <dt>Solution</dt><dd>Return x * 2.</dd>
 *   </dl>
 * </tp-ocaml-interpreter-question>
 */
export class TpOCamlInterpreterQuestion extends TpInterpreterQuestion<TpOCaml> {
	protected readonly language = "ocaml";
	protected override createInterpreter(): TpOCaml {
		return new TpOCaml();
	}
	protected override createTestRunner(): TpOCamlPlayground {
		return new TpOCamlPlayground();
	}
}
if (!customElements.get("tp-ocaml-interpreter-question"))
	customElements.define(
		"tp-ocaml-interpreter-question",
		TpOCamlInterpreterQuestion,
	);
declare global {
	interface HTMLElementTagNameMap {
		"tp-ocaml-interpreter-question": TpOCamlInterpreterQuestion;
	}
}
