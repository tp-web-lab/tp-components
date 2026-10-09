/** @module components/editor-question */

import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import {
	TpConsole,
	type TpConsoleEntryKind,
	type TpConsoleValue,
} from "../console/console.js";
import type { TpFile } from "../filesystem/filesystem.types.js";
import { TpIframe } from "../iframe/iframe.js";
import type { TpExecutionDocument } from "../playground/playground.js";
import { inferLanguage } from "../playground/playground-example-loader.js";
import { TpQuestion } from "../question/question.js";

/**
 * @summary checks an editable exercise by running an external test file on each submission.
 * @attr {string} src = "" - Initial source file or supported project forwarded to the response viewer or playground.
 * @attr {string} test = "" - Test file executed against the current project after every submission.
 * @keyboard {Enter / Space} Opens the question or activates the focused action.
 * @accessibility Reuses question disclosures, output tabs and labelled programming controls.
 * @example
 * <tp-javascript-viewer-question open src="/docs/components/playground-question/examples/javascript/double.js" test="/docs/components/playground-question/examples/javascript/double.test.js">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Open Code to edit, then Submit to run the tests.</dd>
 *     <dt>Solution</dt><dd>Return value * 2.</dd>
 *   </dl>
 * </tp-javascript-viewer-question>
 */
export abstract class TpEditorQuestion<
	TEditor extends HTMLElement & { src: string },
> extends TpQuestion {
	/** Creates the statically selected editable response component. */
	protected abstract createEditor(): TEditor;
	/** Event emitted after the response source finishes loading. */
	protected abstract readonly sourceLoadedEvent: string;
	/** Serializes the current learner response. */
	protected abstract responseValue(control: TEditor): unknown;
	/** Builds an isolated test document from the current response. */
	protected abstract buildTests(
		control: TEditor,
		file: TpFile,
	): Promise<TpExecutionDocument>;
	/** Attributes which rebuild the exercise or change its test source. */
	public static override get observedAttributes(): string[] {
		return [...TpQuestion.observedAttributes, "test"];
	}
	/** External test source URL. */
	public get test(): string {
		return this.getAttribute("test") ?? "";
	}
	/** Embedded editable response, shared with the standalone programming components. */
	private control: TEditor | null = null;
	/** Whether the initial source finished loading. */
	private ready = false;
	/** Cancels pending fetches on reset, reconfiguration or disconnection. */
	private pending: AbortController | null = null;
	/** Invalidates builds which finish after a newer submission. */
	private generation = 0;
	/** Blob cleanup returned by the shared execution builder. */
	private cleanup: TpExecutionDocument["cleanup"];
	/** Isolated test execution surface, separate from the user's preview. */
	private frame: TpIframe | null = null;
	/** Output console receives only messages from this question's test frame. */
	private report: TpConsole | null = null;
	/** Feedback root retained while asynchronous tests run. */
	private result = document.createElement("div");

	/** Builds the standard question layout before inserting the programming control. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.configure();
		this.ownerDocument.defaultView?.addEventListener(
			"message",
			this.receiveResult,
		);
	}
	/** Releases listeners, pending fetches and generated execution resources. */
	public override disconnectedCallback(): void {
		this.cancelRun();
		this.ownerDocument.defaultView?.removeEventListener(
			"message",
			this.receiveResult,
		);
		super.disconnectedCallback();
	}
	/** Keeps open handling in TpQuestion and rebuilds only programming settings. */
	protected override attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		super.attributeChangedCallback(name, oldValue, newValue);
		if (
			oldValue !== newValue &&
			this.isConnected &&
			["src", "test"].includes(name)
		)
			this.configure();
	}
	/** Creates the selected library control and passes it the resolved initial source. */
	private configure(): void {
		this.cancelRun();
		this.result.replaceChildren();
		this.ready = false;
		this.hasSpecificFeedback = Boolean(this.test.trim());
		this.updateFeedbackPlaceholder();
		this.control = null;
		const form = this.querySelector("[data-tp-question-form-content]");
		if (!form) return;
		const control = this.createEditor();
		this.control = control;
		control.addEventListener(this.sourceLoadedEvent, () => {
			if (this.control === control) this.ready = true;
		});
		if (this.src.trim())
			control.src = resolveComponentSourceUrl(this, this.src).href;
		else this.ready = true;
		form.replaceChildren(control);
	}
	/** Returns the current project as the submitted answer payload. */
	protected override readResponseValue(): unknown {
		return this.control ? this.responseValue(this.control) : null;
	}
	/** Every explicit submission is a new test run, even without edits. */
	protected override get allowRepeatedSubmission(): boolean {
		return true;
	}
	/** Blocks submissions until the exercise and external tests are configured. */
	protected override validateSubmit(): string | null {
		if (!this.control || !this.ready)
			return "Wait for the source to load, or check its configuration.";
		return this.test.trim() ? null : "No test file is configured.";
	}
	/** Starts an asynchronous run; the base class handles attempt counting and output tabs. */
	protected override onSubmitAttempt(): void {
		void this.runTests();
	}
	/** Supplies the pending report container to the Feedback tab. */
	protected override submitMessage(): HTMLElement {
		return this.result;
	}
	/** Test results replace the usual missing-text-feedback notice. */
	protected override shouldShowMissingFeedback(): boolean {
		return false;
	}
	/** Restores the initial code through the inherited reset action and cancels old results. */
	protected override onReset(): void {
		this.cancelRun();
		this.result.replaceChildren();
	}
	/** Invalidates older runs and disposes their iframe and blob resources. */
	private cancelRun(): void {
		this.generation++;
		this.pending?.abort();
		this.pending = null;
		this.frame?.remove();
		this.frame = null;
		this.report = null;
		this.cleanup?.();
		this.cleanup = undefined;
	}
	/** Loads fresh tests and executes a snapshot of the learner's current files. */
	private async runTests(): Promise<void> {
		this.cancelRun();
		const generation = this.generation;
		const control = this.control;
		this.result = document.createElement("div");
		this.result.setAttribute("aria-live", "polite");
		this.result.textContent = "Loading tests…";
		try {
			this.pending = new AbortController();
			const url = resolveComponentSourceUrl(this, this.test);
			const response = await fetch(url.href, {
				signal: this.pending.signal,
				cache: "no-store",
			});
			if (!response.ok)
				throw new Error(`Unable to load tests (HTTP ${response.status}).`);
			const content = await response.text();
			if (generation !== this.generation || !control) return;
			const filename = url.pathname.split("/").at(-1) || "exercise.test.js";
			const execution = await this.buildTests(control, {
				path: `/${filename}`,
				language: inferLanguage(filename),
				content,
			});
			if (generation !== this.generation) {
				execution.cleanup?.();
				return;
			}
			this.cleanup = execution.cleanup;
			this.report = new TpConsole();
			this.frame = new TpIframe();
			this.frame.setAttribute("title", "Test execution");
			this.frame.srcdoc = execution.html;
			this.result.replaceChildren(this.report, this.frame);
		} catch (error: unknown) {
			if (generation === this.generation)
				this.result.textContent =
					error instanceof Error ? error.message : "Unable to run tests.";
		}
	}
	/** Accepts console bridge messages only from the active isolated test document. */
	private readonly receiveResult = (event: MessageEvent): void => {
		if (!this.frame || event.source !== this.frame.contentWindow) return;
		const data = event.data as {
			type?: string;
			kind?: TpConsoleEntryKind;
			values?: TpConsoleValue[];
		} | null;
		if (
			data?.type === "tp-playground-console-entry" &&
			typeof data.kind === "string" &&
			Array.isArray(data.values)
		)
			this.report?.addEntry(data.kind, data.values);
	};
}
