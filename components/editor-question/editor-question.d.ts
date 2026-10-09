/** @module components/editor-question */
import type { TpFile } from "../filesystem/filesystem.types.js";
import type { TpExecutionDocument } from "../playground/playground.js";
import { TpQuestion } from "../question/question.js";
/**
 * @summary checks an editable exercise by running an external test file on each submission.
 * @attr {string} src = "" - Initial source file or supported project forwarded to the response viewer or playground.
 * @attr {string} test = "" - Test file executed against the current project after every submission.
 * @keyboard {Enter / Space} Opens the question or activates the focused action.
 * @accessibility Reuses question disclosures, output tabs and labelled programming controls.
 * @example
 * <tp-javascript-viewer-question open src="/tp-components/docs/components/playground-question/examples/javascript/double.js" test="/tp-components/docs/components/playground-question/examples/javascript/double.test.js">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Open Code to edit, then Submit to run the tests.</dd>
 *     <dt>Solution</dt><dd>Return value * 2.</dd>
 *   </dl>
 * </tp-javascript-viewer-question>
 */
export declare abstract class TpEditorQuestion<TEditor extends HTMLElement & {
    src: string;
}> extends TpQuestion {
    /** Creates the statically selected editable response component. */
    protected abstract createEditor(): TEditor;
    /** Event emitted after the response source finishes loading. */
    protected abstract readonly sourceLoadedEvent: string;
    /** Serializes the current learner response. */
    protected abstract responseValue(control: TEditor): unknown;
    /** Builds an isolated test document from the current response. */
    protected abstract buildTests(control: TEditor, file: TpFile): Promise<TpExecutionDocument>;
    /** Attributes which rebuild the exercise or change its test source. */
    static get observedAttributes(): string[];
    /** External test source URL. */
    get test(): string;
    /** Embedded editable response, shared with the standalone programming components. */
    private control;
    /** Whether the initial source finished loading. */
    private ready;
    /** Cancels pending fetches on reset, reconfiguration or disconnection. */
    private pending;
    /** Invalidates builds which finish after a newer submission. */
    private generation;
    /** Blob cleanup returned by the shared execution builder. */
    private cleanup;
    /** Isolated test execution surface, separate from the user's preview. */
    private frame;
    /** Output console receives only messages from this question's test frame. */
    private report;
    /** Feedback root retained while asynchronous tests run. */
    private result;
    /** Builds the standard question layout before inserting the programming control. */
    protected connectedCallback(): void;
    /** Releases listeners, pending fetches and generated execution resources. */
    disconnectedCallback(): void;
    /** Keeps open handling in TpQuestion and rebuilds only programming settings. */
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /** Creates the selected library control and passes it the resolved initial source. */
    private configure;
    /** Returns the current project as the submitted answer payload. */
    protected readResponseValue(): unknown;
    /** Every explicit submission is a new test run, even without edits. */
    protected get allowRepeatedSubmission(): boolean;
    /** Blocks submissions until the exercise and external tests are configured. */
    protected validateSubmit(): string | null;
    /** Starts an asynchronous run; the base class handles attempt counting and output tabs. */
    protected onSubmitAttempt(): void;
    /** Supplies the pending report container to the Feedback tab. */
    protected submitMessage(): HTMLElement;
    /** Test results replace the usual missing-text-feedback notice. */
    protected shouldShowMissingFeedback(): boolean;
    /** Restores the initial code through the inherited reset action and cancels old results. */
    protected onReset(): void;
    /** Invalidates older runs and disposes their iframe and blob resources. */
    private cancelRun;
    /** Loads fresh tests and executes a snapshot of the learner's current files. */
    private runTests;
    /** Accepts console bridge messages only from the active isolated test document. */
    private readonly receiveResult;
}
