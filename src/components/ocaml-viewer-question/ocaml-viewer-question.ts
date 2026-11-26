/** @module components/ocaml-viewer-question */

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
 * @tp-dependency tp-ocaml-viewer
 * @summary Compact OCaml code viewer and runner.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
// tp-docgen:dependencies:end

import { TpOCamlViewer } from "../ocaml-viewer/ocaml-viewer.js";
import { TpPlaygroundQuestion } from "../playground-question/playground-question.js";

/**
 * The custom `<tp-ocaml-viewer-question>` element presents and grades OCaml programming exercises.
 *
 * @summary Presents and grades OCaml programming exercises.
 * @tagname tp-ocaml-viewer-question
 * @accessibility Reuses TpQuestion's disclosure, actions and feedback tabs.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-ocaml-viewer-question open src="/docs/components/ocaml-playground/examples/double.ml">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Edit the source, then submit to run the tests.</dd>
 *     <dt>Feedback</dt><dd>/docs/components/ocaml-playground/examples/double.test.ml</dd>
 *     <dt>Solution</dt><dd>Return x * 2.</dd>
 *   </dl>
 * </tp-ocaml-viewer-question>
 */
export class TpOCamlViewerQuestion extends TpPlaygroundQuestion<TpOCamlViewer> {
	/** Creates the fixed ocaml viewer; no language or mode attributes are needed. */
	protected override createPlayground(): TpOCamlViewer {
		return new TpOCamlViewer();
	}
}
if (!customElements.get("tp-ocaml-viewer-question"))
	customElements.define("tp-ocaml-viewer-question", TpOCamlViewerQuestion);
declare global {
	interface HTMLElementTagNameMap {
		"tp-ocaml-viewer-question": TpOCamlViewerQuestion;
	}
}
