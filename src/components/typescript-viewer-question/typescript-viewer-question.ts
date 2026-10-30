/** @module components/typescript-viewer-question */

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
 * @tp-dependency tp-typescript-viewer
 * @summary Compact TypeScript code viewer and runner.
 */
// tp-docgen:dependencies:end

import { TpPlaygroundQuestion } from "../playground-question/playground-question.js";
import { TpTypescriptViewer } from "../typescript-viewer/typescript-viewer.js";

/**
 * @summary checks a TypeScript exercise using the viewer and an external test file.
 * @tagname tp-typescript-viewer-question
 * @accessibility Reuses TpQuestion's disclosure, actions and feedback tabs.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-typescript-viewer-question open src="/docs/components/playground-question/examples/typescript/double.ts" test="/docs/components/playground-question/examples/typescript/double.test.ts">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Open Code to edit, then submit to run the tests.</dd>
 *     <dt>Solution</dt><dd>Return value * 2.</dd>
 *   </dl>
 * </tp-typescript-viewer-question>
 */
export class TpTypescriptViewerQuestion extends TpPlaygroundQuestion<TpTypescriptViewer> {
	/** Creates the fixed typescript viewer; no language or mode attributes are needed. */
	protected override createPlayground(): TpTypescriptViewer {
		return new TpTypescriptViewer();
	}
}
if (!customElements.get("tp-typescript-viewer-question"))
	customElements.define(
		"tp-typescript-viewer-question",
		TpTypescriptViewerQuestion,
	);
declare global {
	interface HTMLElementTagNameMap {
		"tp-typescript-viewer-question": TpTypescriptViewerQuestion;
	}
}
