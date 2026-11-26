/** @module components/editor-question */

import {
	rebaseSourceContent,
	resolveComponentSourceUrl,
} from "../../utilities/source-url.js";
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
 * @attr {string} src = "" - Initial program/project, or a Markdown exercise defining Title, Prompt and Solution.
 * @attr {string} test = "" - Optional legacy test-file URL; a filename or link in Feedback takes precedence. Tests run against the submitted editor contents.
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
	/** Captures the response before the test file is fetched. Programming subclasses freeze their source/project here. */
	protected captureTests(
		control: TEditor,
	): (file: TpFile) => Promise<TpExecutionDocument> {
		return (file) => this.buildTests(control, file);
	}

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
	/** Initial program, markup file or supported project loaded into the embedded editor. */
	public override get src(): string {
		return this.getAttribute("src") ?? "";
	}
	public set src(value: string) {
		this.setAttribute("src", value);
	}
	/** Optional test filename or URL in Feedback, with links and the legacy test attribute also accepted. */
	public get test(): string {
		const source = this.querySelector<HTMLElement>(
			"[data-tp-question-feedback-source]",
		);
		const link = source?.querySelector<HTMLAnchorElement>("a[href]");
		const filename = link?.getAttribute("href") ?? source?.textContent?.trim();
		if (!filename || !source) return this.getAttribute("test") ?? "";
		return this.definitionLoaded
			? new URL(filename, this.definitionUrl).href
			: resolveComponentSourceUrl(link ?? source, filename).href;
	}
	/** Embedded editable response, shared with the standalone programming components. */
	private control: TEditor | null = null;
	private definitionUrl = "";
	private definitionLoaded = false;
	private definitionLoading = false;
	private definitionProgram = "";
	private definitionRevision = 0;
	private definitionAttributes: Map<string, string | null> | null = null;
	/** A Markdown src is a complete exercise; other extensions remain program/project sources. */
	protected get loadsQuestionDefinition(): boolean {
		return /\.(?:md|markdown)(?:[?#]|$)/i.test(this.src);
	}
	private async loadDefinition(): Promise<void> {
		const url = resolveComponentSourceUrl(this, this.src).href;
		if (
			this.definitionUrl === url &&
			(this.definitionLoaded || this.definitionLoading)
		)
			return;
		const revision = ++this.definitionRevision;
		this.definitionUrl = url;
		this.definitionLoaded = false;
		this.definitionLoading = true;
		this.definitionProgram = "";
		this.definitionAttributes ??= new Map(
			["value", "query", "test"].map((name) => [name, this.getAttribute(name)]),
		);
		try {
			const response = await fetch(url);
			if (!response.ok)
				throw new Error(`Unable to load exercise (HTTP ${response.status}).`);
			const { renderMarkdownFragment } = await import(
				"../markdown/markdown.js"
			);
			const content = await renderMarkdownFragment(await response.text(), url);
			if (revision !== this.definitionRevision) return;
			if (!this.isConnected) {
				this.definitionLoading = false;
				return;
			}
			const template = document.createElement("template");
			template.content.append(content);
			const wrapper = template.content.querySelector(this.localName);
			const list =
				wrapper?.querySelector(":scope > dl") ??
				template.content.querySelector("dl");
			if (!list)
				throw new Error(
					"Exercise source must define Title, Prompt and Solution in a definition list.",
				);
			const fields = new Map<string, Element>();
			for (const term of list.querySelectorAll(":scope > dt")) {
				const definition = term.nextElementSibling;
				if (definition?.localName === "dd")
					fields.set(term.textContent?.trim().toLowerCase() ?? "", definition);
			}
			for (const name of ["title", "prompt", "solution"])
				if (!fields.has(name))
					throw new Error(`Missing exercise field: ${name}.`);
			for (const [name, previous] of this.definitionAttributes) {
				if (previous === null) this.removeAttribute(name);
				else this.setAttribute(name, previous);
			}
			const program = fields.get("program");
			if (program)
				this.setAttribute(
					"value",
					program.querySelector("pre code")?.textContent ??
						program.textContent ??
						"",
				);
			const query =
				wrapper?.getAttribute("query") ??
				fields.get("query")?.textContent?.trim();
			if (query) this.setAttribute("query", query);
			const test =
				wrapper?.getAttribute("test") ??
				fields.get("feedback")?.querySelector("a")?.getAttribute("href") ??
				(fields.get("feedback")?.textContent?.trim() || undefined) ??
				fields.get("test")?.querySelector("a")?.getAttribute("href");
			if (test) this.setAttribute("test", new URL(test, url).href);
			const programSrc =
				wrapper?.getAttribute("program-src") ??
				fields.get("source")?.querySelector("a")?.getAttribute("href");
			if (programSrc) this.definitionProgram = new URL(programSrc, url).href;
			const context = fields
				.get("context")
				?.querySelector("a")
				?.getAttribute("href");
			if (context) {
				const prompt = fields.get("prompt");
				const container = document.createElement("div");
				container.setAttribute("data-tp-source", new URL(context, url).href);
				if (prompt) {
					container.append(...prompt.childNodes);
					rebaseSourceContent(container, url, new URL(context, url).href);
					prompt.append(container);
				}
			}
			for (const name of ["program", "query", "test", "source", "context"]) {
				const field = fields.get(name);
				field?.previousElementSibling?.remove();
				field?.remove();
			}
			this.definitionLoaded = true;
			this.definitionLoading = false;
			this.applySourceMarkup(template.innerHTML, url);
			// Definitions may finish loading after the multi-page shell tried its anchor.
			const fragment =
				this.ownerDocument.defaultView?.location.hash.split("#").at(-1) ?? "";
			let anchor = "";
			try {
				anchor = decodeURIComponent(fragment);
			} catch {
				anchor = fragment;
			}
			const target = anchor ? this.ownerDocument.getElementById(anchor) : null;
			if (target && (target === this || this.contains(target))) {
				this.setAttribute("open", "both");
				requestAnimationFrame(() => {
					if (this.isConnected)
						this.ownerDocument
							.getElementById(anchor)
							?.scrollIntoView?.({ block: "start" });
				});
			}
		} catch (error: unknown) {
			if (revision === this.definitionRevision && this.isConnected) {
				this.definitionLoading = false;
				this.showSrcError(
					error instanceof Error ? error.message : String(error),
				);
			}
		}
	}

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

	/** Keeps the inherited source loader from consuming editor project files. */
	protected override get usesExternalData(): boolean {
		// The editor owns src; it is not a question-definition document.
		return false;
	}

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
		if (name === "src" && oldValue !== newValue) {
			this.definitionRevision++;
			this.definitionLoading = false;
			this.definitionLoaded = false;
			this.definitionProgram = "";
		}
		super.attributeChangedCallback(name, oldValue, newValue);
		if (
			oldValue !== newValue &&
			this.isConnected &&
			["src", "test"].includes(name)
		)
			this.configure();
		if (name === "open" && this.open && !this.control && this.isConnected)
			this.configure();
	}
	/** Creates the selected library control and passes it the resolved initial source. */
	private configure(): void {
		if (
			this.definitionLoading &&
			this.definitionUrl === resolveComponentSourceUrl(this, this.src).href
		)
			return;
		if (
			this.loadsQuestionDefinition &&
			(!this.definitionLoaded ||
				this.definitionUrl !== resolveComponentSourceUrl(this, this.src).href)
		) {
			this.cancelRun();
			this.ready = false;
			void this.loadDefinition();
			return;
		}
		this.cancelRun();
		this.result.replaceChildren();
		this.ready = false;
		this.hasSpecificFeedback = Boolean(this.test.trim());
		this.updateFeedbackPlaceholder();
		this.control = null;
		const form = this.querySelector("[data-tp-question-form-content]");
		if (!form) return;
		if (!this.open) {
			form.replaceChildren();
			return;
		}
		const control = this.createEditor();
		this.control = control;
		control.addEventListener(this.sourceLoadedEvent, () => {
			if (this.control === control) this.ready = true;
		});
		const programSrc = this.loadsQuestionDefinition
			? this.definitionProgram
			: this.src.trim();
		if (programSrc)
			control.src = resolveComponentSourceUrl(this, programSrc).href;
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
		return null;
	}
	/** Starts an asynchronous run; the base class handles attempt counting and output tabs. */
	protected override onSubmitAttempt(): void {
		if (this.test.trim()) void this.runTests();
	}
	/** Supplies the pending report container to the Feedback tab. */
	protected override submitMessage(): HTMLElement {
		if (!this.test.trim()) this.result.textContent = "No tests provided.";
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
			const build = control ? this.captureTests(control) : null;
			this.pending = new AbortController();
			const url = resolveComponentSourceUrl(this, this.test);
			const response = await fetch(url.href, {
				signal: this.pending.signal,
				cache: "no-store",
			});
			if (!response.ok)
				throw new Error(`Unable to load tests (HTTP ${response.status}).`);
			const content = await response.text();
			if (generation !== this.generation || !build) return;
			const filename = url.pathname.split("/").at(-1) || "exercise.test.js";
			const execution = await build({
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
			// Execute tests in isolation; Feedback presents only the bridged console.
			this.frame.hidden = true;
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
