/** @module components/scheme-playground-question */
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
 * @tp-dependency tp-scheme-playground
 * @summary Edits and runs a Scheme project with LIPS.
 */
// tp-docgen:dependencies:end

import { TpPlaygroundQuestion } from "../playground-question/playground-question.js";
import { TpSchemePlayground } from "../scheme-playground/scheme-playground.js";

/**
 * The custom `<tp-scheme-playground-question>` element presents and grades Scheme programming exercises.
 *
 * @summary Presents and grades Scheme programming exercises.
 * @tagname tp-scheme-playground-question
 * @accessibility Reuses TpQuestion's disclosure, actions and feedback tabs.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-scheme-playground-question open src="/docs/components/scheme-playground/examples/double.scm">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Edit the source, then submit to run the tests.</dd>
 *     <dt>Feedback</dt><dd>/docs/components/scheme-playground/examples/double.test.scm</dd>
 *     <dt>Solution</dt><dd>Return (* x 2).</dd>
 *   </dl>
 * </tp-scheme-playground-question>
 */
export class TpSchemePlaygroundQuestion extends TpPlaygroundQuestion<TpSchemePlayground> {
	/** Creates the fixed scheme playground; no language or mode attributes are needed. */
	protected override createPlayground(): TpSchemePlayground {
		return new TpSchemePlayground();
	}
}
if (!customElements.get("tp-scheme-playground-question"))
	customElements.define(
		"tp-scheme-playground-question",
		TpSchemePlaygroundQuestion,
	);
declare global {
	interface HTMLElementTagNameMap {
		"tp-scheme-playground-question": TpSchemePlaygroundQuestion;
	}
}
