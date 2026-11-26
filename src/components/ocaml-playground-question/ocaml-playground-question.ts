/** @module components/ocaml-playground-question */

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
 * @tp-dependency tp-ocaml-playground
 * @summary Edits and runs an OCaml project.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
// tp-docgen:dependencies:end

import { TpOCamlPlayground } from "../ocaml-playground/ocaml-playground.js";
import { TpPlaygroundQuestion } from "../playground-question/playground-question.js";

/**
 * The custom `<tp-ocaml-playground-question>` element presents and grades OCaml programming exercises.
 *
 * @summary Presents and grades OCaml programming exercises.
 * @tagname tp-ocaml-playground-question
 * @accessibility Reuses TpQuestion's disclosure, actions and feedback tabs.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-ocaml-playground-question open src="/docs/components/ocaml-playground/examples/double.ml">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Edit the source, then submit to run the tests.</dd>
 *     <dt>Feedback</dt><dd>/docs/components/ocaml-playground/examples/double.test.ml</dd>
 *     <dt>Solution</dt><dd>Return x * 2.</dd>
 *   </dl>
 * </tp-ocaml-playground-question>
 */
export class TpOCamlPlaygroundQuestion extends TpPlaygroundQuestion<TpOCamlPlayground> {
	/** Creates the fixed ocaml playground; no language or mode attributes are needed. */
	protected override createPlayground(): TpOCamlPlayground {
		return new TpOCamlPlayground();
	}
}
if (!customElements.get("tp-ocaml-playground-question"))
	customElements.define(
		"tp-ocaml-playground-question",
		TpOCamlPlaygroundQuestion,
	);
declare global {
	interface HTMLElementTagNameMap {
		"tp-ocaml-playground-question": TpOCamlPlaygroundQuestion;
	}
}
