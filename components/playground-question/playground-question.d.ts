/** @module components/playground-question */
import { TpEditorQuestion } from "../editor-question/editor-question.js";
import type { TpFile } from "../filesystem/filesystem.types.js";
import type { TpExecutionDocument, TpPlayground } from "../playground/playground.js";
import type { TpProject } from "../playground/project.js";
/**
 * @summary checks a programming project using an external test file.
 * @example
 * <tp-javascript-viewer-question open src="/tp-components/docs/components/playground-question/examples/javascript/double.js" test="/tp-components/docs/components/playground-question/examples/javascript/double.test.js">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Open Code to edit, then Submit to run the tests.</dd>
 *     <dt>Solution</dt><dd>Return value * 2.</dd>
 *   </dl>
 * </tp-javascript-viewer-question>
 */
export declare abstract class TpPlaygroundQuestion<TPlayground extends TpPlayground<TpProject>> extends TpEditorQuestion<TPlayground> {
    /** Creates the fixed programming control supplied by a concrete question. */
    protected abstract createPlayground(): TPlayground;
    /** Adapts the programming factory to the shared editable question lifecycle. */
    protected createEditor(): TPlayground;
    /** Playground source readiness event. */
    protected readonly sourceLoadedEvent = "tp-playground-src-load";
    /** Returns a serializable snapshot of the learner's files. */
    protected responseValue(control: TPlayground): unknown;
    /** Delegates test execution to the selected playground's existing engine. */
    protected buildTests(control: TPlayground, file: TpFile): Promise<TpExecutionDocument>;
}
