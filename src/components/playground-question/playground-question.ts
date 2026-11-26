/** @module components/playground-question */

import { TpEditorQuestion } from "../editor-question/editor-question.js";
import type { TpFile } from "../filesystem/filesystem.types.js";
import type {
	TpExecutionDocument,
	TpPlayground,
} from "../playground/playground.js";
import type { TpProject } from "../playground/project.js";
/**
 * @summary checks a programming project using an external test file.
 * @example
 * <tp-javascript-viewer-question open src="/docs/components/playground-question/examples/javascript/double.js" test="/docs/components/playground-question/examples/javascript/double.test.js">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Open Code to edit, then Submit to run the tests.</dd>
 *     <dt>Solution</dt><dd>Return value * 2.</dd>
 *   </dl>
 * </tp-javascript-viewer-question>
 * @accessibility Inherits question disclosure, submission and reset controls from the editor-question hierarchy; test progress, results and failures are presented in its polite live feedback region.
 * @accessibility Keyboard editing and project navigation are provided by the concrete playground; this abstract class adds no separate interactive surface.
 * @accessibilityresponsibility Provide a descriptive title and prompt, understandable test messages and an editor configuration usable with the keyboard. Ensure any rendered program output has appropriate text alternatives.
 * @attr {string} src = "" - Program, JSON project, or Markdown exercise defining Title, Prompt and Solution.
 */
export abstract class TpPlaygroundQuestion<
	TPlayground extends TpPlayground<TpProject>,
> extends TpEditorQuestion<TPlayground> {
	/** Creates the fixed programming control supplied by a concrete question. */
	protected abstract createPlayground(): TPlayground;
	/** Adapts the programming factory to the shared editable question lifecycle. */
	protected override createEditor(): TPlayground {
		const control = this.createPlayground();
		for (const script of this.querySelectorAll<HTMLScriptElement>(
			":scope > script[type^='tp/']",
		)) {
			control.append(script.cloneNode(true));
		}
		return control;
	}
	/** Playground source readiness event. */
	protected readonly sourceLoadedEvent = "tp-playground-src-load";
	/** Returns a serializable snapshot of the learner's files. */
	protected override responseValue(control: TPlayground): unknown {
		return control.getProject().toJSON();
	}
	/** Freezes the current project so edits made while downloading tests belong to the next submission. */
	protected override captureTests(
		control: TPlayground,
	): (file: TpFile) => Promise<TpExecutionDocument> {
		const runner = this.createPlayground();
		runner.setProject(control.getProject());
		return (file) => runner.createTestDocument(file);
	}

	/** Delegates test execution to the selected playground's existing engine. */
	protected override buildTests(
		control: TPlayground,
		file: TpFile,
	): Promise<TpExecutionDocument> {
		return control.createTestDocument(file);
	}
}
