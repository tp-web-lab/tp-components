/** @module components/javascript-playground-question */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-code-editor
 * @summary CodeMirror-based code editor component.
 */
/**
 * @tp-dependency tp-console
 * @summary Displays structured console output.
 */
/**
 * @tp-dependency tp-drawer
 * @summary Displays a sliding drawer panel.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Displays an anchored dropdown menu.
 */
/**
 * @tp-dependency tp-file-tree
 * @summary Displays an interactive file and folder tree.
 */
/**
 * @tp-dependency tp-filesystem
 * @summary In-memory file system component.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-iframe
 * @summary Controlled iframe component.
 */
/**
 * @tp-dependency tp-javascript-playground
 * @summary JavaScript playground component.
 */
/**
 * @tp-dependency tp-menu
 * @summary Accessible menu component.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
/**
 * @tp-dependency tp-splitter
 * @summary Splitter component with two resizable panels.
 */
/**
 * @tp-dependency tp-switcher
 * @summary Switches between horizontal and vertical layouts based on available space.
 */
/**
 * @tp-dependency tp-tabs
 * @summary Accessible tabs component with keyboard and reorder support.
 */
/**
 * @tp-dependency tp-toolbar
 * @summary Sticky toolbar with start / center / end sections,
 */
/**
 * @credit Zod https://zod.dev/
 * @summary Runtime schema validation.
 */
// tp-docgen:dependencies:end

import { TpJavascriptPlayground } from "../javascript-playground/javascript-playground.js";
import { TpPlaygroundQuestion } from "../playground-question/playground-question.js";

/**
 * @summary checks a JavaScript exercise using the playground and an external test file.
 * @tagname tp-javascript-playground-question
 * @accessibility Reuses TpQuestion's disclosure, actions and feedback tabs.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-javascript-playground-question open src="/docs/components/playground-question/examples/javascript/double.js" test="/docs/components/playground-question/examples/javascript/double.test.js">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Edit the source, then submit to run the tests.</dd>
 *     <dt>Solution</dt><dd>Return value * 2.</dd>
 *   </dl>
 * </tp-javascript-playground-question>
 */
export class TpJavascriptPlaygroundQuestion extends TpPlaygroundQuestion<TpJavascriptPlayground> {
	/** Creates the fixed javascript playground; no language or mode attributes are needed. */
	protected override createPlayground(): TpJavascriptPlayground {
		return new TpJavascriptPlayground();
	}
}
if (!customElements.get("tp-javascript-playground-question"))
	customElements.define(
		"tp-javascript-playground-question",
		TpJavascriptPlaygroundQuestion,
	);
declare global {
	interface HTMLElementTagNameMap {
		"tp-javascript-playground-question": TpJavascriptPlaygroundQuestion;
	}
}
