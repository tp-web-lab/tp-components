/** @module components/prolog-playground-question */

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
 * @tp-dependency tp-prolog-playground
 * @summary Prolog playground component.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
// tp-docgen:dependencies:end

import { TpPlaygroundQuestion } from "../playground-question/playground-question.js";
import { TpPrologPlayground } from "../prolog-playground/prolog-playground.js";

/**
 * @summary checks a Prolog exercise using the playground and an external test file.
 * @tagname tp-prolog-playground-question
 * @accessibility Reuses TpQuestion's disclosure, actions and feedback tabs.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-prolog-playground-question open src="/docs/components/playground-question/examples/prolog/double.pl" test="/docs/components/playground-question/examples/prolog/double.test.pl">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Edit the source, then submit to run the tests.</dd>
 *     <dt>Solution</dt><dd>Use Result is Value * 2.</dd>
 *   </dl>
 * </tp-prolog-playground-question>
 */
export class TpPrologPlaygroundQuestion extends TpPlaygroundQuestion<TpPrologPlayground> {
	/** Creates the fixed prolog playground; no language or mode attributes are needed. */
	protected override createPlayground(): TpPrologPlayground {
		return new TpPrologPlayground();
	}
}
if (!customElements.get("tp-prolog-playground-question"))
	customElements.define(
		"tp-prolog-playground-question",
		TpPrologPlaygroundQuestion,
	);
declare global {
	interface HTMLElementTagNameMap {
		"tp-prolog-playground-question": TpPrologPlaygroundQuestion;
	}
}
