/**
 * @module components/question
 * @summary Base description-list container for question components.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-badge
 * @summary Badge component for compact status labels.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-button-group
 * @summary Button group component for organizing multiple buttons.
 */
/**
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
/**
 * @tp-dependency tp-copy-code
 * @summary Copy-to-clipboard button component.
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
 * @tp-dependency tp-mask
 * @summary Replaces an anchored element with a message while active.
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
 * @tp-dependency tp-timer
 * @summary Countdown timer with stop control and optional ring.
 */
// tp-docgen:dependencies:end

import style from "./question.css?inline";
import { QuestionAi, questionAiAssistant } from "./question-ai.js";
import { QuestionTiming } from "./question-timing.js";

import "../badge/badge.js";
import "../button-group/button-group.js";
import "../callout/callout.js";
import "../icon/icon.js";
import "../icon-button/icon-button.js";
import "../switcher/switcher.js";
import "../tabs/tabs.js";

import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";

type TpQuestionSectionId =
	| "title"
	| "statement"
	| "response"
	| "feedback"
	| "solution";

interface TpQuestionSectionDefinition {
	id: TpQuestionSectionId;
	label: string;
	aliases: string[];
}

const SECTION_DEFINITIONS: TpQuestionSectionDefinition[] = [
	{
		id: "title",
		label: "Title",
		aliases: ["Title", "Titles"],
	},
	{
		id: "statement",
		label: "Prompt",
		aliases: [
			"Prompt",
			"Prompts",
			"Statement",
			"Statements",
			"Question",
			"Questions",
		],
	},
	{
		id: "response",
		label: "Form",
		aliases: ["Form", "Forms"],
	},
	{
		id: "feedback",
		label: "Feedback",
		aliases: ["Feedback", "Feedbacks"],
	},
	{
		id: "solution",
		label: "Solution",
		aliases: ["Solution", "Solutions"],
	},
];

/**
 * Payload emitted when submit is triggered.
 *
 * @summary Submit event payload.
 */
export interface TpQuestionSubmitDetail {
	value: unknown;
}

/**
 * Returns a normalized heading string for section matching.
 *
 * @summary Normalizes section headings.
 * @param value Raw section heading.
 * @returns Lower-cased heading without diacritics.
 * @internal
 */
function normalizeHeading(value: string): string {
	return value.toLowerCase().trim();
}

/**
 * Checks whether an element is a `<dt>`.
 *
 * @summary Type guard for DT elements.
 * @param node Candidate node.
 * @returns `true` when the node is a DT element.
 * @internal
 */
function isDtElement(node: Node | null | undefined): node is HTMLElement {
	return node instanceof HTMLElement && node.tagName === "DT";
}

/**
 * Checks whether an element is a `<dd>`.
 *
 * @summary Type guard for DD elements.
 * @param node Candidate node.
 * @returns `true` when the node is a DD element.
 * @internal
 */
function isDdElement(node: Node | null | undefined): node is HTMLElement {
	return node instanceof HTMLElement && node.tagName === "DD";
}

/**
 * `<tp-question>` is a base semantic container for question statements,
 * response widgets, feedback and solutions.
 *
 * The component enforces a `<dl><dt><dd>...</dd></dl>` source structure, then
 * renders an interactive layout with:
 * - `<details><summary>` from `Title`
 * - full-width prompt section
 * - input/output toggles at the end of the Prompt row; initial visibility follows the open attribute
 * - responsive two-panel area (form left, feedback/solution right)
 * - reset/submit actions and a message zone under the form
 *
 * Panel toggles preserve content and keep at least one panel visible, as in the viewers.
 *
 * @summary Semantic base container for question content.
 * @tagname tp-question
 * @attr {string} src = "" - URL of a JSON, HTML, Markdown, reStructuredText, or AsciiDoc question definition.
 * @attr {string} mode = "mixed" - Blank mode: opened, closed, or mixed local choices.
 * @attr {string} ai-explanation-src = "" - URL of a saved Markdown explanation; the companion .prompt.md must match the current prompt.
 * @attr {boolean} ai-api = false - Allows sending AI prompts to the selected provider; without it, prompts are only copied.
 * @attr {string} ai-assistant = "openai" - AI provider, optionally followed by /model; without a model, uses the server configuration. Providers: openai, anthropic, google, mistral.
 * @attr {"none"|"feedback"|"solution"|"both"} ai-help = "none" - Optional AI assistance; solution and both enable solution explanations. Feedback assistance is reserved for a future release.
 * @attr {string} timing = "" - Optional nonzero time limit in strict hh:mm:ss format.
 * @attr {boolean} score = false - Displays the numerical score in submission feedback.
 * @attr {string} open = "" - Initial panels: both (also a bare attribute), input, or output. Absent or invalid values collapse the question.

 *   `detail: { value: unknown }`
 * @example
 * <tp-question>
 *     <dl>
 *       <dt>Title</dt><dd>Reflection</dd>
 *       <dt>Prompt</dt><dd>Describe one benefit of web components.</dd>
 *     <dt>Form</dt><dd><tp-textfield multiline="" rows="3" placeholder="Type your answer..."></tp-textfield></dd>
 *       <dt>Feedback</dt><dd>Think about encapsulation and reuse.</dd>
 *       <dt>Solution</dt><dd>They package reusable behavior behind a custom element.</dd>
 *     </dl>
 *   </tp-question>
 * @event tp-question-submit Emitted after an answer passes submission validation and preparation. value is the response widget value, whose type depends on the question; invalid or blocked repeated submissions do not emit it.
 * @eventdetail tp-question-submit { value: unknown }
 */
export class TpQuestion extends TpBase {
	private readonly questionTiming = new QuestionTiming(this);
	private readonly questionAi = new QuestionAi(this);
	/** Whether numerical scores are displayed in feedback. */
	public get score(): boolean {
		return this.hasAttribute("score");
	}
	public set score(value: boolean) {
		this.toggleAttribute("score", value);
	}

	/** Sets an enclosing exercise's solution gate without displaying a local timer. */
	public setExerciseTiming(exercise: HTMLElement, pending: boolean): void {
		this.questionTiming.setExerciseTiming(exercise, pending);
	}

	/** Optional time limit; invalid and zero durations disable timing. */
	public get timing(): string {
		return this.getAttribute("timing") ?? "";
	}
	public set timing(value: string) {
		this.setAttribute("timing", value);
	}
	public static override get observedAttributes(): string[] {
		return [
			...(TpBase.observedAttributes ?? []),
			"src",
			"open",
			"mode",
			"timing",
			"ai-help",
			"ai-api",
			"ai-assistant",
			"ai-explanation-src",
			"score",
		];
	}

	/** Explicit permission to send prompts through the API. */
	public get aiApi(): boolean {
		return this.hasAttribute("ai-api");
	}
	public set aiApi(value: boolean) {
		this.toggleAttribute("ai-api", value);
	}
	/** Selected AI provider; absent or invalid values use OpenAI. */
	public get aiAssistant(): string {
		return questionAiAssistant(this.getAttribute("ai-assistant")).value;
	}
	public set aiAssistant(value: string) {
		this.setAttribute("ai-assistant", value);
	}

	/** Optional AI assistance; missing or invalid values disable it. */
	public get aiHelp(): "none" | "feedback" | "solution" | "both" {
		const value = this.getAttribute("ai-help");
		return value === "feedback" || value === "solution" || value === "both"
			? value
			: "none";
	}
	public set aiHelp(value: "none" | "feedback" | "solution" | "both") {
		this.setAttribute("ai-help", value);
	}

	/** Global blank policy; missing and invalid values use local choices. */
	public get mode(): "opened" | "closed" | "mixed" {
		const value = this.getAttribute("mode");
		return value === "closed" || value === "opened" ? value : "mixed";
	}
	public set mode(value: "opened" | "closed" | "mixed") {
		this.setAttribute("mode", value);
	}

	/** Initial panel selection; a bare attribute selects both panels. */
	public get open(): "both" | "input" | "output" | false {
		const value = this.getAttribute("open");
		if (value === "") return "both";
		return value === "both" || value === "input" || value === "output"
			? value
			: false;
	}

	/** Selects panels without discarding answers; booleans remain supported in JavaScript. */
	public set open(value: "both" | "input" | "output" | boolean) {
		if (value === false) this.removeAttribute("open");
		else this.setAttribute("open", value === true ? "both" : value);
	}

	private applyOpenPanels(): void {
		const mode = this.open;
		if (!mode) return;
		for (const button of this.panelToggleButtons) {
			button.setAttribute(
				"aria-pressed",
				String(mode === "both" || button.dataset.panelToggle === mode),
			);
		}
		this.updatePanelVisibility();
	}

	/** Synchronizes declarative visibility changes with the native disclosure. */
	protected override attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		super.attributeChangedCallback(name, oldValue, newValue);
		if (
			["ai-help", "ai-api", "ai-assistant", "ai-explanation-src"].includes(
				name,
			) &&
			this.isConnected
		)
			this.questionAi.sync();
		if (name === "score") {
			for (const element of this.querySelectorAll<HTMLElement>(
				"[data-tp-question-score]",
			)) {
				if (element.closest("[data-tp-question]") === this)
					element.hidden = !this.score;
			}
		}
		if (name === "src" && oldValue !== newValue) {
			this.sourceRevision++;
			this.inlineSourceLoaded = false;
			if (this.isConnected && this.formContent && this.usesExternalData)
				void this.loadSrc();
		}
		if (name === "timing" && this.isConnected && oldValue !== newValue)
			this.questionTiming.configure();
		if (name !== "open") return;
		const details = this.querySelector<HTMLDetailsElement>(
			":scope > details[data-tp-question-details]",
		);
		if (details) details.open = Boolean(this.open);
		this.applyOpenPanels();
	}

	/**
	 * Global stylesheet identifier for the component.
	 *
	 * @summary Identifier of the question stylesheet.
	 * @internal
	 */
	private static readonly styleId = "tp-question-styles";

	/**
	 * Reference to the reset action button.
	 *
	 * @summary Reset button element.
	 * @internal
	 */
	private resetButtonEl: HTMLElement | null = null;

	/**
	 * Reference to the submit action button.
	 *
	 * @summary Submit button element.
	 * @internal
	 */
	private submitButtonEl: HTMLElement | null = null;
	/** Input/output visibility controls, retained across layout updates. */
	private panelToggleButtons: HTMLElement[] = [];
	/** Unique suffix for accessible panel identifiers. */
	private static nextPanelId = 0;

	/**
	 * Reference to the message/status zone.
	 *
	 * @summary Message zone element.
	 * @internal
	 */
	private messageEl: HTMLDivElement | null = null;

	/**
	 * Reference to the normalized Solution tab. Accessible by default.
	 *
	 * @summary Solution tab handle.
	 */
	protected solutionTabEl: HTMLElement | null = null;

	/**
	 * Reference to tabs controlling Feedback/Solution.
	 *
	 * @summary Feedback tabs handle.
	 * @internal
	 */
	private feedbackTabsEl: HTMLElement | null = null;

	/**
	 * Runtime feedback output container inside the Feedback tab.
	 *
	 * @summary Dynamic feedback output root.
	 * @internal
	 */
	private feedbackOutputEl: HTMLDivElement | null = null;
	private feedbackSourceEl: HTMLDivElement | null = null;
	protected hasSpecificFeedback = false;
	protected srcMarkup: "markdown" | "html" | "none" = "markdown";

	/**
	 * Number of times the user has clicked submit since the component connected.
	 * Not reset by the reset button.
	 *
	 * @summary Submit attempt counter.
	 */
	protected tries = 0;

	/**
	 * The last successfully submitted value. Used to detect no-change resubmissions.
	 *
	 * @summary Last submitted value.
	 */
	private lastSubmittedValue: unknown = undefined;

	private sourceRevision = 0;
	private inlineSourceLoaded = false;

	/** Whether the question still needs its external definition. */
	protected get usesExternalData(): boolean {
		return Boolean(this.src) && !this.inlineSourceLoaded;
	}

	// ── src attribute API ───────────────────────────────────────────────────────

	/**
	 * URL to an external question definition; its extension selects the parser.
	 *
	 * @summary External question data URL.
	 */
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}

	/**
	 * Loads JSON data or initializes markup from `src`. Returns JSON data, or `null` on
	 * markup completion or error (errors appear inside the form section).
	 *
	 * @summary Loads external question data.
	 * @param src URL whose extension selects the source format.
	 * @returns Parsed JSON or `null`.
	 */
	protected async fetchSrc(src: string): Promise<unknown | null> {
		const revision = ++this.sourceRevision;
		let url: string;
		try {
			url = resolveComponentSourceUrl(this, src).href;
		} catch {
			this.showSrcError(`Failed to load "${src}": invalid URL`);
			return null;
		}
		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const filename = new URL(url).pathname.split("/").pop() ?? "";
			const extension = filename.includes(".")
				? filename.split(".").pop()?.toLowerCase()
				: "json";
			const isCurrent = () =>
				this.isConnected && revision === this.sourceRevision;
			if (extension === "json" || !extension || !filename.includes(".")) {
				const data: unknown = await response.json();
				return isCurrent() ? data : null;
			}
			const source = await response.text();
			let html: string;
			switch (extension) {
				case "html":
				case "htm":
					html = source;
					break;
				case "md":
				case "markdown": {
					const { renderMarkdownToHtml } = await import(
						"../markdown/markdown.js"
					);
					html = await renderMarkdownToHtml(source, url);
					break;
				}
				case "rst":
				case "rest": {
					const { renderRestructuredTextToHtml } = await import(
						"../restructuredtext/restructuredtext.js"
					);
					html = await renderRestructuredTextToHtml(source);
					break;
				}
				case "adoc":
				case "asciidoc": {
					const { renderAsciidocToHtml } = await import(
						"../asciidoc/asciidoc.js"
					);
					html = await renderAsciidocToHtml(source);
					break;
				}
				default:
					throw new Error(`Unsupported question extension: ${extension}`);
			}
			if (isCurrent()) this.applySourceMarkup(html, url);
			return null;
		} catch (err) {
			if (this.isConnected && revision === this.sourceRevision)
				this.showSrcError(`Failed to load "${src}": ${String(err)}`);
			return null;
		}
	}

	/** Initializes parsed markup through the same lifecycle as an inline question. */
	private applySourceMarkup(html: string, url: string): void {
		const template = document.createElement("template");
		template.innerHTML = html;
		const wrapper = template.content.querySelector(this.localName);
		const list =
			wrapper?.querySelector(":scope > dl") ??
			template.content.querySelector("dl");
		if (!list)
			throw new Error("Question source must contain a definition list.");
		list.setAttribute("data-tp-source", url);
		for (const element of list.querySelectorAll("[src], a[href]")) {
			if (element.localName.includes("-")) continue;
			const name = element.hasAttribute("src") ? "src" : "href";
			const value = element.getAttribute(name);
			if (value && !value.startsWith("#"))
				element.setAttribute(name, new URL(value, url).href);
		}
		this.disconnectedCallback();
		this.inlineSourceLoaded = true;
		this.replaceChildren(list);
		this.connectedCallback();
	}

	/**
	 * Displays an error message inside the form section and logs it to the console.
	 * Called automatically by `fetchSrc` on network failure; also available for
	 * subclasses to report schema validation errors.
	 *
	 * @summary Renders a src-load error.
	 * @param message Human-readable error description.
	 */
	protected showSrcError(message: string): void {
		// After layout render, content is in [data-tp-question-form-content], not the source <dd>
		const target =
			this.querySelector<HTMLElement>("[data-tp-question-form-content]") ??
			this.response;
		if (target === null) return;
		target.replaceChildren();
		const error = document.createElement("div");
		error.setAttribute(
			"style",
			"color: red; font-weight: bold; white-space: pre-wrap;",
		);
		error.textContent = message;
		target.append(error);
		console.error(`[${this.tagName.toLowerCase()}]`, message);
	}

	/**
	 * Updates the question title (summary text) from src data.
	 * No-op when the summary element is absent.
	 *
	 * @summary Sets the collapsible title from src.
	 * @param text Plain text title.
	 */
	protected updateSrcTitle(text: string, markup = this.srcMarkup): void {
		const title = this.querySelector<HTMLElement>(
			":scope > details[data-tp-question-details] > summary > [data-tp-question-title]",
		);
		if (title instanceof HTMLElement) {
			this.replaceWithSrcContent(title, text, markup);
		}
	}

	/**
	 * Updates the prompt content from src data.
	 * Sets the content as a `<tp-markdown>` element for markdown rendering.
	 *
	 * @summary Sets the prompt from src.
	 * @param markdown Markdown or plain-text prompt.
	 */
	protected updateSrcPrompt(markdown: string, markup = this.srcMarkup): void {
		const promptContent = this.querySelector<HTMLElement>(
			"[data-tp-question-prompt-content]",
		);
		if (!(promptContent instanceof HTMLElement)) return;
		this.replaceWithSrcContent(promptContent, markdown, markup);
	}

	/**
	 * Updates the solution tab content from src data.
	 * Sets the content as a `<tp-markdown>` element for markdown rendering.
	 *
	 * @summary Sets the solution from src.
	 * @param markdown Markdown or plain-text solution.
	 */
	protected updateSrcSolution(markdown: string, markup = this.srcMarkup): void {
		const tabs = this.querySelector("[data-tp-question-tabs]");
		if (!(tabs instanceof HTMLElement)) return;
		const solutionDd = tabs.querySelector(
			"[data-tp-question-solution-content]",
		);
		if (!(solutionDd instanceof HTMLElement)) return;
		if (markdown.trim() === "") {
			this.showMissingSolution(solutionDd);
			this.questionAi.sync();
			return;
		}
		this.replaceWithSrcContent(solutionDd, markdown, markup);
		this.questionAi.sync();
	}

	/** Displays the same kind of absence notice as the Feedback panel. */
	private showMissingSolution(panel: HTMLElement): void {
		const callout = document.createElement("tp-callout");
		callout.setAttribute("variant", "danger");
		callout.setAttribute("closable", "");
		callout.setAttribute("heading", "solution");
		callout.setAttribute("data-tp-question-missing-solution", "");
		callout.textContent = "No solution is available for this question.";
		panel.replaceChildren(callout);
	}

	/**
	 * Normalizes src markup aliases to a concrete rendering mode.
	 *
	 * @summary Resolves the effective markup mode.
	 * @param markup Raw markup value from JSON.
	 * @returns Concrete rendering mode.
	 */
	protected normalizeSrcMarkup(
		markup: string | undefined,
	): "markdown" | "html" | "none" {
		if (markup === "html" || markup === "none") {
			return markup;
		}
		return "markdown";
	}

	/**
	 * Replaces a target element with content interpreted according to the src
	 * markup mode.
	 *
	 * @summary Renders src content into a target node.
	 * @param target Destination element.
	 * @param content Raw string content from the JSON file.
	 * @param markup Markup mode.
	 */
	protected replaceWithSrcContent(
		target: HTMLElement,
		content: string,
		markup: string = this.srcMarkup,
	): void {
		target.replaceChildren(this.createSrcContentNode(content, markup));
	}

	/**
	 * Creates a node for src content according to the selected markup mode.
	 *
	 * @summary Builds the rendered node for JSON string content.
	 * @param content Raw string content from the JSON file.
	 * @param markup Markup mode.
	 * @returns A node ready to append into the DOM.
	 */
	protected createSrcContentNode(
		content: string,
		markup: string = this.srcMarkup,
	): Node {
		const normalizedMarkup = this.normalizeSrcMarkup(markup);
		if (normalizedMarkup === "html") {
			const template = document.createElement("template");
			template.innerHTML = content;
			return template.content.cloneNode(true);
		}
		if (normalizedMarkup === "none") {
			return document.createTextNode(content);
		}
		return this.createMarkdownElement(content);
	}

	/**
	 * Creates a `<tp-markdown>` element for rendering markdown or inline web
	 * component directives such as `:tp-icon:{...}`.
	 *
	 * @summary Wraps markdown text in a tp-markdown element.
	 * @param markdown Markdown or plain-text content.
	 * @returns Configured tp-markdown element.
	 */
	protected createMarkdownElement(markdown: string): HTMLElement {
		void import("../markdown/markdown.js").catch((error: unknown) => {
			console.error("Unable to load question Markdown renderer", error);
		});
		const md = document.createElement("tp-markdown");
		md.textContent = markdown;
		return md;
	}

	/**
	 * Returns the rendered form content container (populated after layout render).
	 * Subclasses should target this element — not the source `<dd>` — when adding
	 * or replacing form widgets from src data.
	 *
	 * @summary Rendered form content container.
	 */
	protected get formContent(): HTMLElement | null {
		return this.querySelector<HTMLElement>("[data-tp-question-form-content]");
	}

	/**
	 * Called after `fetchSrc` succeeds. Override in subclasses to validate and
	 * apply the loaded JSON data. The base implementation loads common sections.
	 *
	 * @summary Hook invoked when external src data is ready.
	 * @param _data Parsed JSON data from the `src` file.
	 */
	protected async onSrcReady(data: unknown): Promise<void> {
		if (typeof data !== "object" || data === null) {
			this.showSrcError("Question JSON must be an object.");
			return;
		}
		const values = data as Record<string, unknown>;
		this.srcMarkup = this.normalizeSrcMarkup(
			typeof values.markup === "string" ? values.markup : "markdown",
		);
		if (typeof values.title === "string") this.updateSrcTitle(values.title);
		if (typeof values.prompt === "string") this.updateSrcPrompt(values.prompt);
		if (typeof values.solution === "string")
			this.updateSrcSolution(values.solution);
		if (typeof values.form === "string" && this.formContent)
			this.replaceWithSrcContent(this.formContent, values.form);
		if (typeof values.feedback === "string" && this.feedbackSourceEl)
			this.replaceWithSrcContent(this.feedbackSourceEl, values.feedback);
	}

	/**
	 * Initiates the fetch → validate → apply pipeline when `src` is set.
	 * Subclasses call this from their `connectedCallback` after `super.connectedCallback()`.
	 *
	 * @summary Triggers src loading when the src attribute is present.
	 */
	protected async loadSrc(): Promise<void> {
		const data = await this.fetchSrc(this.src);
		if (data !== null) await this.onSrcReady(data);
	}

	/**
	 * Connects the component and enforces normalized question structure.
	 *
	 * @summary Initializes question structure and styles.
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.setAttribute("data-tp-question", "");
		this.ensureGlobalStyle(TpQuestion.styleId, style);
		this.beforeQuestionLayout();
		const list = this.ensureDefinitionList();
		this.renderQuestionLayout(list);
		this.questionTiming.configure();
		this.questionAi.sync();
		this.bindActions();
		if (this.localName === "tp-question" && this.usesExternalData)
			void this.loadSrc();
	}

	/**
	 * Allows subclasses to adapt their authored source before the shared
	 * question layout is normalized.
	 *
	 * @summary Prepares subclass-specific question source.
	 * @internal
	 */
	protected beforeQuestionLayout(): void {
		// no-op
	}

	/**
	 * Cleans action listeners when disconnected.
	 *
	 * @summary Disconnects action listeners.
	 */
	public disconnectedCallback(): void {
		this.questionAi.dispose();
		this.questionTiming.dispose();
		this.sourceRevision++;
		this.unbindActions();
	}

	/**
	 * Returns the `<dd>` node of the title section.
	 *
	 * @summary Returns the title content node.
	 */
	public get titleSection(): HTMLElement | null {
		return this.getSectionDd("title");
	}

	/**
	 * Returns the `<dd>` node of the statement section.
	 *
	 * @summary Returns the statement content node.
	 */
	public get statement(): HTMLElement | null {
		return this.getSectionDd("statement");
	}

	/**
	 * Returns the `<dd>` node of the response section.
	 *
	 * @summary Returns the response content node.
	 */
	public get response(): HTMLElement | null {
		return this.getSectionDd("response");
	}

	/**
	 * Returns the `<dd>` node of the feedback section.
	 *
	 * @summary Returns the feedback content node.
	 */
	public get feedback(): HTMLElement | null {
		return this.getSectionDd("feedback");
	}

	/**
	 * Returns the `<dd>` node of the solution section.
	 *
	 * @summary Returns the solution content node.
	 */
	public get solution(): HTMLElement | null {
		return this.getSectionDd("solution");
	}

	/**
	 * Ensures the host contains a single normalized `<dl>`.
	 *
	 * @summary Enforces the description-list question source structure.
	 * @returns Normalized source `<dl>`.
	 * @internal
	 */
	private ensureDefinitionList(): HTMLDListElement {
		const list = this.ensureSingleDl();
		this.normalizeSections(list);
		list.setAttribute("data-tp-question-source", "");
		return list;
	}

	/**
	 * Returns a single source `<dl>`, creating one when needed.
	 *
	 * @summary Creates or reuses the source description list.
	 * @returns Root description list element.
	 * @internal
	 */
	private ensureSingleDl(): HTMLDListElement {
		const existingSource = this.querySelector(
			":scope > dl[data-tp-question-source]",
		);
		if (existingSource instanceof HTMLDListElement) {
			return existingSource;
		}

		const nestedSource = this.querySelector(
			":scope > details[data-tp-question-details] > dl[data-tp-question-source]",
		);
		if (nestedSource instanceof HTMLDListElement) {
			return nestedSource;
		}

		const directDls = Array.from(this.children).filter(
			(child): child is HTMLDListElement => child instanceof HTMLDListElement,
		);

		if (directDls.length === 0) {
			const list = document.createElement("dl");
			while (this.firstChild !== null) {
				list.append(this.firstChild);
			}
			this.append(list);
			return list;
		}

		const [first, ...rest] = directDls;
		if (!(first instanceof HTMLDListElement)) {
			const list = document.createElement("dl");
			this.append(list);
			return list;
		}
		for (const extra of rest) {
			while (extra.firstChild !== null) {
				first.append(extra.firstChild);
			}
			extra.remove();
		}
		return first;
	}

	/**
	 * Normalizes `<dt>/<dd>` pairs and ensures required sections exist.
	 *
	 * @summary Normalizes section pairs in canonical order.
	 * @param list Source description list.
	 * @internal
	 */
	private normalizeSections(list: HTMLDListElement): void {
		// Step 1: Extract actual DT and DD elements (ignore whitespace)
		const dtddElements = Array.from(list.children).filter(
			(child): child is HTMLElement => isDtElement(child) || isDdElement(child),
		);

		// Step 2: Group into DT/DD pairs
		const pairs: Array<{ dt: HTMLElement; dd: HTMLElement | null }> = [];
		for (let i = 0; i < dtddElements.length; i += 1) {
			const current = dtddElements[i];
			if (isDtElement(current)) {
				const next = i + 1 < dtddElements.length ? dtddElements[i + 1] : null;
				const dd = isDdElement(next) ? (next as HTMLElement) : null;
				pairs.push({ dt: current, dd });
			}
		}

		// Step 3: Map pairs to sections
		const knownPairs = new Map<
			TpQuestionSectionId,
			{ dt: HTMLElement; dd: HTMLElement }
		>();
		for (const pair of pairs) {
			const section = this.resolveSection(pair.dt.textContent ?? "");
			if (section !== null && pair.dd !== null && !knownPairs.has(section.id)) {
				pair.dt.textContent = section.label;
				knownPairs.set(section.id, { dt: pair.dt, dd: pair.dd });
			}
		}

		// Step 4: Rebuild DL with canonical sections
		list.replaceChildren();
		for (const section of SECTION_DEFINITIONS) {
			const pair =
				knownPairs.get(section.id) ?? this.createSectionPair(section.label);
			list.append(pair.dt, pair.dd);
		}

		const titleDd = knownPairs.get("title")?.dd ?? this.getSectionDd("title");
		if (titleDd !== null && titleDd.textContent?.trim() === "") {
			titleDd.textContent = "Question";
		}
	}

	/**
	 * Builds the rendered details/panels/tabs UI from normalized sections.
	 *
	 * @summary Renders the interactive question layout.
	 * @param list Normalized source list.
	 * @internal
	 */
	private renderQuestionLayout(list: HTMLDListElement): void {
		const existingLayout = this.querySelector(
			":scope > details[data-tp-question-details] > [data-tp-question-layout]",
		);
		if (existingLayout instanceof HTMLDivElement && list.hidden) {
			return;
		}

		const details = this.ensureElement<HTMLDetailsElement>(
			":scope > details[data-tp-question-details]",
			() => {
				const node = document.createElement("details");
				node.setAttribute("data-tp-question-details", "");
				node.open = Boolean(this.open);
				node.addEventListener("toggle", () => {
					// Native toggle events are asynchronous: do not overwrite a valid mode.
					if (node.open === Boolean(this.open)) return;
					if (!node.open) this.open = false;
					else {
						const selected = this.panelToggleButtons.filter(
							(button) => button.getAttribute("aria-pressed") === "true",
						);
						this.open =
							selected.length === 1 &&
							selected[0]?.dataset.panelToggle === "input"
								? "input"
								: selected.length === 1
									? "output"
									: "both";
					}
				});
				this.append(node);
				return node;
			},
		);

		const summary = this.ensureElement<HTMLElement>(
			":scope > details[data-tp-question-details] > summary",
			() => {
				const node = document.createElement("summary");
				details.prepend(node);
				return node;
			},
		);

		const layout = this.ensureElement<HTMLDivElement>(
			":scope > details[data-tp-question-details] > [data-tp-question-layout]",
			() => {
				const node = document.createElement("div");
				node.setAttribute("data-tp-question-layout", "");
				details.append(node);
				return node;
			},
		);

		const promptSlot = this.ensureChild(
			layout,
			"[data-tp-question-prompt]",
			"div",
			{
				"data-tp-question-prompt": "",
			},
		);
		const promptHeader = this.ensureChild(
			promptSlot,
			"[data-tp-question-prompt-header]",
			"div",
			{ "data-tp-question-prompt-header": "" },
		);
		const promptLabel = this.ensureChild(
			promptSlot,
			"span[data-tp-question-prompt-label]",
			"span",
			{
				"data-tp-question-prompt-label": "",
			},
		);
		promptLabel.textContent = "Prompt";
		promptHeader.prepend(promptLabel);
		const panelControls = this.ensureChild(
			promptHeader,
			"tp-button-group",
			"tp-button-group",
			{
				"aria-label": "Question panels",
				"data-tp-question-panel-controls": "",
			},
		);
		this.panelToggleButtons = ["input", "output"].map((name) =>
			this.ensureChild<HTMLElement>(
				panelControls,
				`tp-icon-button[data-panel-toggle="${name}"]`,
				"tp-icon-button",
				{
					"data-panel-toggle": name,
					name,
					library: "tp",
					label: name === "input" ? "Answer form" : "Output",
					"data-help-description":
						name === "input" ? "Hide/show the form." : "Hide/show the output.",
					size: "s",
					type: "button",
					"aria-pressed": "true",
				},
			),
		);
		const promptContent = this.ensureChild(
			promptSlot,
			"div[data-tp-question-prompt-content]",
			"div",
			{
				"data-tp-question-prompt-content": "",
			},
		);
		const panels = this.ensureQuestionPanels(layout);
		const formPanel = this.ensureChild(
			panels,
			"[data-tp-question-form-panel]",
			"section",
			{
				"data-tp-question-form-panel": "",
				"data-tp-question-panel": "form",
			},
		);
		const feedbackPanel = this.ensureChild(
			panels,
			"[data-tp-question-feedback-panel]",
			"section",
			{
				"data-tp-question-feedback-panel": "",
				"data-tp-question-panel": "feedback",
			},
		);

		for (const [index, panel] of [formPanel, feedbackPanel].entries()) {
			if (!panel.id) panel.id = `tp-question-panel-${++TpQuestion.nextPanelId}`;
			this.panelToggleButtons[index]?.setAttribute("aria-controls", panel.id);
		}
		this.applyOpenPanels();
		this.updatePanelVisibility();
		const formFieldset = this.ensureChild(
			formPanel,
			"[data-tp-question-form-fieldset]",
			"div",
			{
				"data-tp-question-form-fieldset": "",
			},
		);
		const formLegend = this.ensureChild(
			formFieldset,
			"span[data-tp-question-form-legend]",
			"span",
			{
				"data-tp-question-form-legend": "",
			},
		);
		formLegend.textContent = "Answer form";
		const formContent = this.ensureChild(
			formFieldset,
			"[data-tp-question-form-content]",
			"div",
			{
				"data-tp-question-form-content": "",
			},
		);
		const toolbar = this.ensureChild(
			formFieldset,
			"[data-tp-question-toolbar]",
			"div",
			{
				"data-tp-question-toolbar": "",
			},
		);
		const actions = this.ensureChild(
			toolbar,
			"[data-tp-question-actions]",
			"div",
			{
				"data-tp-question-actions": "",
			},
		);
		this.messageEl = this.ensureChild(
			toolbar,
			"[data-tp-question-message]",
			"div",
			{
				"data-tp-question-message": "",
				role: "status",
				"aria-live": "polite",
			},
		);

		this.resetButtonEl = this.ensureChild(
			actions,
			'tp-icon-button[data-action="reset"]',
			"tp-icon-button",
			{
				"data-action": "reset",
				name: "refresh",
				label: "Reset response",
				type: "button",
			},
		);
		this.submitButtonEl = this.ensureChild(
			actions,
			'tp-icon-button[data-action="submit"]',
			"tp-icon-button",
			{
				"data-action": "submit",
				name: "play-arrow",
				label: "Submit response",
				type: "button",
			},
		);

		const feedbackBox = this.ensureChild(
			feedbackPanel,
			"[data-tp-question-feedback-box]",
			"div",
			{
				"data-tp-question-feedback-box": "",
			},
		);
		const feedbackBoxLabel = this.ensureChild(
			feedbackBox,
			"span[data-tp-question-feedback-label]",
			"span",
			{
				"data-tp-question-feedback-label": "",
			},
		);
		feedbackBoxLabel.textContent = "Output";
		// Build author markup while detached so tp-tabs normalizes complete content on connection.
		feedbackBox.querySelector("tp-tabs[data-tp-question-tabs]")?.remove();
		const tabs = document.createElement("tp-tabs");
		tabs.setAttribute("data-tp-question-tabs", "");
		this.feedbackTabsEl = tabs;
		const tabsDl = this.ensureChild(tabs, ":scope > dl", "dl", {});
		tabsDl.replaceChildren();
		const feedbackDt = document.createElement("dt");
		feedbackDt.textContent = "Feedback";
		const feedbackDd = document.createElement("dd");
		this.feedbackOutputEl = this.ensureChild(
			feedbackDd,
			"[data-tp-question-feedback-output]",
			"div",
			{
				"data-tp-question-feedback-output": "",
			},
		);
		this.feedbackSourceEl = this.ensureChild(
			feedbackDd,
			"[data-tp-question-feedback-source]",
			"div",
			{
				"data-tp-question-feedback-source": "",
				hidden: "",
			},
		);
		this.feedbackOutputEl.replaceChildren();
		const solutionDt = document.createElement("dt");
		solutionDt.textContent = "Solution";
		solutionDt.setAttribute("data-tp-question-solution-tab", "");
		const solutionDd = document.createElement("dd");
		solutionDd.setAttribute("data-tp-question-solution-content", "");
		tabsDl.append(feedbackDt, feedbackDd, solutionDt, solutionDd);

		const titleDd = this.getSectionDd(list, "title");
		const titleText = titleDd ? titleDd.textContent?.trim() : "";
		const titleIcon = document.createElement("tp-icon");
		titleIcon.setAttribute("name", this.localName.replace(/^tp-/, ""));
		titleIcon.setAttribute("library", "components");
		titleIcon.setAttribute("size", "1.25em");
		titleIcon.setAttribute("aria-hidden", "true");
		const title = document.createElement("span");
		title.setAttribute("data-tp-question-title", "");
		title.textContent =
			titleText === "" ? "Question" : (titleText ?? "Question");
		summary.replaceChildren(titleIcon, title);

		const statementDd = this.getSectionDd(list, "statement");
		if (statementDd !== null) {
			this.moveChildren(statementDd, promptContent);
		}
		const responseDd = this.getSectionDd(list, "response");
		if (responseDd !== null) {
			this.moveChildren(responseDd, formContent);
		}
		const feedbackDd2 = this.getSectionDd(list, "feedback");
		if (feedbackDd2 !== null) {
			this.moveChildren(
				feedbackDd2,
				this.feedbackSourceEl instanceof HTMLDivElement
					? this.feedbackSourceEl
					: feedbackDd,
			);
		}
		if (this.feedbackOutputEl instanceof HTMLDivElement) {
			this.hasSpecificFeedback =
				(this.feedbackSourceEl?.textContent?.trim().length ?? 0) > 0;
			const callout = document.createElement("tp-callout");
			callout.setAttribute(
				"variant",
				this.hasSpecificFeedback ? "warning" : "danger",
			);
			callout.setAttribute("closable", "");
			callout.setAttribute("heading", "Feedback");
			callout.textContent = this.hasSpecificFeedback
				? "Feedback will only be provided once you have submitted an answer to the question."
				: "No specific feedback is available for this question.";
			this.feedbackOutputEl.replaceChildren(callout);
		}
		const solutionDd2 = this.getSectionDd(list, "solution");
		if (solutionDd2 !== null) {
			this.moveChildren(solutionDd2, solutionDd);
		}
		const hasSolutionContent =
			solutionDd.textContent?.trim() ||
			solutionDd.querySelector(
				"img, svg, math, video, audio, iframe, canvas, object, embed",
			) ||
			Array.from(solutionDd.querySelectorAll("*")).some((element) =>
				element.localName.startsWith("tp-"),
			);
		if (!hasSolutionContent) this.showMissingSolution(solutionDd);

		feedbackBox.append(tabs);
		this.solutionTabEl = tabs.querySelector("[data-tp-question-solution-tab]");

		details.append(list);
		list.hidden = true;
	}

	private ensureQuestionPanels(layout: HTMLElement): HTMLElement {
		const existing = layout.querySelector<HTMLElement>(
			"[data-tp-question-panels]",
		);
		const panels =
			existing?.tagName === "TP-SWITCHER"
				? existing
				: document.createElement("tp-switcher");

		panels.setAttribute("data-tp-question-panels", "");
		panels.setAttribute("gap", "1rem");
		panels.setAttribute("threshold", "48rem");

		if (existing === null) {
			layout.append(panels);
			return panels;
		}

		if (existing !== panels) {
			while (existing.firstChild !== null) {
				panels.append(existing.firstChild);
			}
			existing.replaceWith(panels);
		}

		return panels;
	}

	/**
	 * Attaches action listeners once.
	 *
	 * @summary Binds reset and submit actions.
	 * @internal
	 */
	private bindActions(): void {
		this.unbindActions();
		for (const button of this.panelToggleButtons)
			button.addEventListener("click", this.handlePanelToggle);
		this.resetButtonEl?.addEventListener("click", this.handleResetClick);
		this.submitButtonEl?.addEventListener("click", this.handleSubmitClick);
	}

	/**
	 * Detaches action listeners.
	 *
	 * @summary Unbinds reset and submit actions.
	 * @internal
	 */
	private unbindActions(): void {
		for (const button of this.panelToggleButtons)
			button.removeEventListener("click", this.handlePanelToggle);
		this.resetButtonEl?.removeEventListener("click", this.handleResetClick);
		this.submitButtonEl?.removeEventListener("click", this.handleSubmitClick);
	}

	/** Toggles one panel while keeping at least one visible, as in the viewers. */
	private handlePanelToggle = (event: Event): void => {
		const button = event.currentTarget;
		if (!(button instanceof HTMLElement)) return;
		const visible = button.getAttribute("aria-pressed") === "true";
		if (
			visible &&
			!this.panelToggleButtons.some(
				(other) =>
					other !== button && other.getAttribute("aria-pressed") === "true",
			)
		)
			return;
		button.setAttribute("aria-pressed", String(!visible));
		this.updatePanelVisibility();
	};

	/** Hides panels without recreating their content and synchronizes native button ARIA. */
	private updatePanelVisibility(): void {
		for (const button of this.panelToggleButtons) {
			const id = button.getAttribute("aria-controls") ?? "";
			const panel = this.ownerDocument.getElementById(id);
			const visible = button.getAttribute("aria-pressed") === "true";
			if (panel && this.contains(panel)) panel.hidden = !visible;
			const nativeButton = button.querySelector("button");
			nativeButton?.setAttribute("aria-pressed", String(visible));
			nativeButton?.setAttribute("aria-controls", id);
		}
	}

	private clearMessage(): void {
		if (this.messageEl instanceof HTMLDivElement) {
			this.messageEl.removeAttribute("data-type");
			this.messageEl.textContent = "";
		}
	}

	/**
	 * Resets the embedded response widget when available.
	 *
	 * @summary Handles reset action.
	 * @internal
	 */
	private handleResetClick = (): void => {
		this.submissionRevision++;
		this.clearMessage();
		this.lastSubmittedValue = undefined;
		const widget = this.findResponseWidget();
		const maybeReset = (widget as { reset?: () => void } | null)?.reset;
		if (typeof maybeReset === "function") {
			maybeReset.call(widget);
		}
		this.onReset();
		if (this.messageEl instanceof HTMLDivElement) {
			this.messageEl.textContent = this.resetMessageText;
			setTimeout(() => {
				if (this.messageEl instanceof HTMLDivElement) {
					this.messageEl.textContent = "";
				}
			}, 2000);
		}
	};

	/**
	 * Hook called after reset is applied. Override in subclasses for custom post-reset logic.
	 *
	 * @summary Post-reset hook for subclasses.
	 */
	protected onReset(): void {}

	/**
	 * Hook called on every submit click with the current widget value.
	 * Override in subclasses to react to the attempt and value.
	 *
	 * @summary Post-attempt hook for subclasses.
	 * @param _value Current value from the response widget.
	 */
	protected onSubmitAttempt(_value: unknown): void {}

	/** Makes the solution available after automatic grading confirms a correct answer. */
	protected unlockCorrectSolution(feedback: HTMLElement): void {
		const elapsed = QuestionTiming.elapsedFor(this);
		if (elapsed !== null) {
			const message = document.createElement("p");
			message.setAttribute("data-tp-question-success-time", "");
			message.textContent = `Bonne réponse trouvée en ${elapsed}.`;
			feedback.append(message);
		}
		this.questionTiming.unlockSolution();
		this.solutionTabEl =
			this.feedbackTabsEl?.querySelector<HTMLElement>(
				"[data-tp-question-solution-tab]",
			) ?? this.solutionTabEl;
		this.solutionTabEl?.removeAttribute("disabled");
		this.solutionTabEl?.setAttribute("aria-disabled", "false");
	}

	/** Allows specialized asynchronous exercises to rerun an unchanged answer. */
	protected get allowRepeatedSubmission(): boolean {
		return false;
	}

	/** Reads the answer exposed by the response widget. */
	protected readResponseValue(): unknown {
		const widget = this.findResponseWidget();
		return widget === null
			? null
			: ((widget as { value?: unknown }).value ?? null);
	}

	/**
	 * Text displayed in the message area after a reset. Override in subclasses to customize.
	 *
	 * @summary Reset confirmation message.
	 */
	protected get resetMessageText(): string {
		return "Resetting the answer form…";
	}

	/**
	 * Emits a submit event carrying the current widget value when available.
	 *
	 * @summary Handles submit action.
	 * @internal
	 */
	protected prepareSubmission(): void | Promise<void> {}

	private preparingSubmission = false;
	private submissionRevision = 0;

	private handleSubmitClick = async (): Promise<void> => {
		this.activateFeedbackPanel();
		if (this.preparingSubmission) return;
		this.clearMessage();
		const value = this.readResponseValue();

		const warning = this.validateSubmit(value);
		if (warning !== null) {
			if (this.messageEl instanceof HTMLDivElement) {
				this.messageEl.setAttribute("data-type", "warning");
				this.messageEl.textContent = `⚠ ${warning}`;
			}
			return;
		}

		// Check if the value changed since the last successful submit
		const valueChanged =
			JSON.stringify(value) !== JSON.stringify(this.lastSubmittedValue);
		if (!valueChanged && !this.allowRepeatedSubmission) {
			if (this.messageEl instanceof HTMLDivElement) {
				this.messageEl.setAttribute("data-type", "warning");
				this.messageEl.textContent = "⚠ No change from previous submission.";
			}
			return;
		}

		try {
			const revision = this.submissionRevision;
			const preparation = this.prepareSubmission();
			if (preparation) {
				this.preparingSubmission = true;
				this.setAttribute("aria-busy", "true");
				await preparation;
				if (
					!this.isConnected ||
					revision !== this.submissionRevision ||
					JSON.stringify(value) !== JSON.stringify(this.readResponseValue())
				)
					return;
			}
		} catch {
			if (this.messageEl)
				this.messageEl.textContent =
					"Unable to check the answer. Please try again.";
			return;
		} finally {
			this.preparingSubmission = false;
			this.removeAttribute("aria-busy");
		}
		this.lastSubmittedValue = value;
		this.tries++;
		this.onSubmitAttempt(value);
		const content = this.submitMessage(value);
		this.renderFeedbackResult(content);
		this.renderSubmitStatusMessage();

		this.dispatchEvent(
			new CustomEvent<TpQuestionSubmitDetail>("tp-question-submit", {
				detail: { value },
				bubbles: true,
				composed: true,
			}),
		);
	};

	/**
	 * Validates the submitted value. Return a warning string to block submission, or null to allow.
	 * Override in subclasses to add specific validation.
	 *
	 * @summary Validates submitted value.
	 * @param value Value from the response widget.
	 * @returns Warning message or null.
	 */
	protected validateSubmit(value: unknown): string | null {
		if (value === null || value === "") {
			return "Please provide an answer.";
		}
		return null;
	}

	/**
	 * Returns author-provided feedback after submission, or a generic confirmation when absent.
	 * Override in subclasses to provide answer-specific feedback.
	 *
	 * @summary Submit confirmation message.
	 * @param value Submitted value from the response widget.
	 * @returns Message as string or HTMLElement.
	 */
	protected submitMessage(_value: unknown): string | HTMLElement {
		return this.createGeneralFeedback() ?? "Submitted.";
	}

	/** Copies general feedback left after subclasses consume their per-item list. */
	protected createGeneralFeedback(): HTMLElement | null {
		if (this.feedbackSourceEl?.textContent?.trim()) {
			const content = document.createElement("div");
			for (const child of this.feedbackSourceEl.childNodes) {
				content.append(child.cloneNode(true));
			}
			return content;
		}
		return null;
	}

	/**
	 * Ensures the Feedback tab is selected.
	 *
	 * @summary Activates Feedback panel before writing output.
	 */
	protected activateFeedbackPanel(): void {
		const outputToggle = this.panelToggleButtons.find(
			(button) => button.dataset.panelToggle === "output",
		);
		outputToggle?.setAttribute("aria-pressed", "true");
		this.updatePanelVisibility();
		if (!(this.feedbackTabsEl instanceof HTMLElement)) {
			return;
		}
		const maybeSelect = this.feedbackTabsEl as {
			select?: (index: number) => void;
		};
		if (typeof maybeSelect.select === "function") {
			maybeSelect.select(0);
			return;
		}
		this.feedbackTabsEl.setAttribute("selected", "0");
	}

	/**
	 * Selects Solution tab when available.
	 *
	 * @summary Opens the Solution panel.
	 */
	protected openSolutionPanel(): void {
		if (
			!(this.feedbackTabsEl instanceof HTMLElement) ||
			!(this.solutionTabEl instanceof HTMLElement) ||
			this.solutionTabEl.hasAttribute("disabled")
		) {
			return;
		}

		const maybeSelect = this.feedbackTabsEl as {
			select?: (index: number) => void;
		};
		if (typeof maybeSelect.select === "function") {
			maybeSelect.select(1);
			return;
		}
		this.feedbackTabsEl.setAttribute("selected", "1");
	}

	/**
	 * Creates a button opening the Solution tab.
	 *
	 * @summary Builds a "See more in the solution…" CTA button.
	 * @returns Ready-to-use button.
	 */
	protected createOpenSolutionButton(): HTMLButtonElement {
		const button = document.createElement("button");
		button.type = "button";
		button.textContent = "See more in the solution...";
		button.setAttribute("data-tp-question-open-solution", "");
		button.addEventListener("click", () => this.openSolutionPanel());
		if (this.solutionTabEl?.hasAttribute("disabled")) {
			button.disabled = true;
		}
		return button;
	}

	/**
	 * Builds the attempt metadata line with tries badge and current time.
	 *
	 * @summary Creates "<badge>N</badge> hh:mm:ss" line.
	 * @returns Metadata line element.
	 */
	protected createAttemptMetaLine(): HTMLDivElement {
		const line = document.createElement("div");
		line.style.display = "flex";
		line.style.alignItems = "center";
		line.style.gap = "0.5rem";

		const badge = document.createElement("tp-badge");
		badge.setAttribute("variant", "brand");
		badge.setAttribute("size", "xs");
		badge.textContent = String(this.tries);

		const now = new Date();
		const time = `${String(now.getHours()).padStart(2, "0")}:${String(
			now.getMinutes(),
		).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
		const timeText = document.createElement("span");
		timeText.textContent = time;

		line.append(badge, timeText);
		return line;
	}

	/**
	 * Builds a single inline summary line containing tries badge, current time,
	 * and score.
	 *
	 * @summary Creates "<badge>N</badge> hh:mm:ss n/t" line.
	 * @param score Number of correct items.
	 * @param total Total evaluated items.
	 * @returns Summary line element.
	 */
	protected createAttemptSummaryLine(
		score: number,
		total: number,
	): HTMLDivElement {
		const line = this.createAttemptMetaLine();
		const scoreBadge = document.createElement("tp-badge");
		scoreBadge.setAttribute("variant", score === total ? "success" : "danger");
		scoreBadge.setAttribute("size", "xs");
		scoreBadge.setAttribute("data-tp-question-score", "");
		scoreBadge.hidden = !this.score;
		scoreBadge.textContent = `${String(score)}/${String(total)}`;
		line.append(scoreBadge);
		return line;
	}

	/**
	 * Builds a score line in `n/t` format.
	 *
	 * @summary Creates score line.
	 * @param score Number of correct items.
	 * @param total Total evaluated items.
	 * @returns Score line element.
	 */
	protected createScoreLine(
		score: number,
		total: number,
	): HTMLParagraphElement {
		const line = document.createElement("p");
		line.style.margin = "0.5rem 0 0";
		line.setAttribute("data-tp-question-score", "");
		line.hidden = !this.score;
		line.textContent = `${String(score)}/${String(total)}`;
		return line;
	}

	/**
	 * Renders the compact submit status in the left toolbar message area.
	 *
	 * @summary Displays "<badge>tries</badge> submitted".
	 */
	private renderSubmitStatusMessage(): void {
		if (!(this.messageEl instanceof HTMLDivElement)) {
			return;
		}
		this.messageEl.removeAttribute("data-type");
		const wrap = document.createElement("span");
		wrap.style.display = "inline-flex";
		wrap.style.alignItems = "center";
		wrap.style.gap = "0.5rem";

		const badge = document.createElement("tp-badge");
		badge.setAttribute("variant", "brand");
		badge.setAttribute("size", "xs");
		badge.textContent = String(this.tries);

		const text = document.createElement("span");
		text.textContent = "submitted";

		wrap.append(badge, text);
		this.messageEl.replaceChildren(wrap);
	}

	/**
	 * Reads and removes a direct feedback list from the Feedback tab.
	 *
	 * @summary Consumes author-provided per-item feedback list.
	 * @returns List item HTML payloads, one per feedback item.
	 */
	protected consumeFeedbackListItems(): string[] {
		if (!(this.feedbackSourceEl instanceof HTMLDivElement)) {
			return [];
		}
		const list = this.feedbackSourceEl.querySelector<
			HTMLUListElement | HTMLOListElement
		>(":scope > ul, :scope > ol");
		if (
			!(list instanceof HTMLUListElement || list instanceof HTMLOListElement)
		) {
			return [];
		}
		const items = Array.from(list.querySelectorAll(":scope > li"))
			.map((item) => item.innerHTML.trim())
			.filter((item) => item !== "");
		list.remove();
		return items;
	}

	/**
	 * Whether the result needs a notice about missing author feedback.
	 *
	 * @summary Controls the missing-feedback notice for a submission.
	 */
	protected shouldShowMissingFeedback(): boolean {
		return !this.hasSpecificFeedback;
	}

	/** Displays the submission result, with a missing-feedback notice when appropriate. */
	protected renderFeedbackResult(content: string | HTMLElement): void {
		this.activateFeedbackPanel();
		if (this.feedbackOutputEl instanceof HTMLDivElement) {
			if (this.shouldShowMissingFeedback()) {
				const callout = document.createElement("tp-callout");
				callout.setAttribute("variant", "danger");
				callout.setAttribute("heading", "Feedback");
				callout.setAttribute("closable", "");
				callout.textContent =
					"No specific feedback is available for this question.";
				const body = document.createElement("div");
				body.setAttribute("data-tp-question-feedback-attempt", "");
				if (content instanceof HTMLElement) {
					body.replaceChildren(content);
				} else {
					body.textContent = content;
				}
				this.feedbackOutputEl.replaceChildren(callout, body);
				return;
			}

			if (content instanceof HTMLElement) {
				this.feedbackOutputEl.replaceChildren(content);
			} else {
				this.feedbackOutputEl.textContent = content;
			}
			return;
		}

		// Fallback for unexpected layouts.
		if (this.messageEl instanceof HTMLDivElement) {
			if (content instanceof HTMLElement) {
				this.messageEl.replaceChildren(content);
			} else {
				this.messageEl.textContent = content;
			}
		}
	}

	/**
	 * Re-renders the feedback placeholder callout to reflect the current
	 * `hasSpecificFeedback` state. Call after setting `hasSpecificFeedback`
	 * from async src loading so the initial message is consistent.
	 *
	 * @summary Updates the initial feedback placeholder callout.
	 */
	protected updateFeedbackPlaceholder(): void {
		if (!(this.feedbackOutputEl instanceof HTMLDivElement)) return;
		// Only update if the output still shows the placeholder (no attempt yet).
		const hasAttempt =
			this.feedbackOutputEl.querySelector(
				"[data-tp-question-feedback-attempt]",
			) !== null;
		if (hasAttempt) return;
		const callout = document.createElement("tp-callout");
		callout.setAttribute(
			"variant",
			this.hasSpecificFeedback ? "warning" : "danger",
		);
		callout.setAttribute("closable", "");
		callout.setAttribute("heading", "Feedback");
		callout.textContent = this.hasSpecificFeedback
			? "Feedback will only be provided once you have submitted an answer to the question."
			: "No specific feedback is available for this question.";
		this.feedbackOutputEl.replaceChildren(callout);
	}

	/**
	 * Finds the primary response widget inside the rendered form panel.
	 *
	 * @summary Returns the first embedded tp-* response element.
	 * @returns Response widget element or `null`.
	 * @internal
	 */
	protected findResponseWidget(): HTMLElement | null {
		const root = this.querySelector("[data-tp-question-form-content]");
		if (!(root instanceof HTMLElement)) {
			return null;
		}

		return root.querySelector<HTMLElement>(
			":scope > tp-radio-list, :scope > tp-checkbox-list, :scope > tp-fill-blank, :scope > tp-code-editor, :scope > *",
		);
	}

	/**
	 * Resolves a section definition from a heading text.
	 *
	 * @summary Matches a heading against known question sections.
	 * @param heading Heading text from `<dt>`.
	 * @returns Matching section definition or `null`.
	 * @internal
	 */
	private resolveSection(heading: string): TpQuestionSectionDefinition | null {
		const normalized = normalizeHeading(heading);
		for (const section of SECTION_DEFINITIONS) {
			if (
				section.aliases.some((alias) => normalizeHeading(alias) === normalized)
			) {
				return section;
			}
		}
		return null;
	}

	/**
	 * Creates an empty `<dt>/<dd>` pair.
	 *
	 * @summary Creates a default section pair.
	 * @param heading Section heading.
	 * @returns Section pair nodes.
	 * @internal
	 */
	private createSectionPair(heading: string): {
		dt: HTMLElement;
		dd: HTMLElement;
	} {
		const dt = document.createElement("dt");
		dt.textContent = heading;
		const dd = document.createElement("dd");
		return { dt, dd };
	}

	/**
	 * Returns the `<dd>` element for a canonical section id.
	 *
	 * @summary Gets a normalized section content node.
	 * @param listOrSectionId Description list or section id.
	 * @param sectionId Section id (when first param is a list).
	 * @returns Matching `<dd>` element or `null`.
	 * @internal
	 */
	private getSectionDd(
		listOrSectionId: HTMLDListElement | TpQuestionSectionId,
		sectionId?: TpQuestionSectionId,
	): HTMLElement | null {
		let list: HTMLDListElement | null = null;
		let targetId: TpQuestionSectionId;

		if (typeof listOrSectionId === "string") {
			// Old signature: getSectionDd(sectionId)
			targetId = listOrSectionId;
			list = this.querySelector(
				":scope > details[data-tp-question-details] > dl[data-tp-question-source], :scope > dl[data-tp-question-source], :scope > dl",
			);
		} else {
			// New signature: getSectionDd(list, sectionId)
			list = listOrSectionId;
			if (sectionId === undefined) {
				return null;
			}
			targetId = sectionId;
		}

		if (!(list instanceof HTMLDListElement)) {
			return null;
		}

		const nodes = Array.from(list.children);
		for (let i = 0; i < nodes.length; i += 1) {
			const dt = nodes[i];
			const dd = nodes[i + 1];
			if (!isDtElement(dt) || !isDdElement(dd)) {
				continue;
			}

			const section = this.resolveSection(dt.textContent ?? "");
			if (section?.id === targetId) {
				return dd;
			}
		}

		return null;
	}

	/**
	 * Ensures a unique element exists in this component.
	 *
	 * @summary Returns an existing element or creates it.
	 * @param selector Selector used to find the node.
	 * @param create Factory called when the node is absent.
	 * @returns Existing or created node.
	 * @internal
	 */
	private ensureElement<T extends HTMLElement>(
		selector: string,
		create: () => T,
	): T {
		const existing = this.querySelector(selector);
		if (existing instanceof HTMLElement) {
			return existing as T;
		}
		return create();
	}

	/**
	 * Ensures a specific child exists in a given parent.
	 *
	 * @summary Returns an existing child node or creates it.
	 * @param parent Parent element.
	 * @param selector Child selector.
	 * @param tagName Tag used when creating.
	 * @param attributes Attributes to set on creation.
	 * @returns Existing or created child element.
	 * @internal
	 */
	private ensureChild<T extends HTMLElement>(
		parent: ParentNode,
		selector: string,
		tagName: string,
		attributes: Record<string, string>,
	): T {
		const existing = parent.querySelector(selector);
		if (existing instanceof HTMLElement) {
			return existing as T;
		}

		const node = document.createElement(tagName);
		for (const [name, value] of Object.entries(attributes)) {
			node.setAttribute(name, value);
		}
		parent.append(node);
		return node as T;
	}

	/**
	 * Moves all child nodes from one container to another.
	 *
	 * @summary Moves section content into rendered containers.
	 * @param from Source element.
	 * @param to Target element.
	 * @internal
	 */
	private moveChildren(from: Element | null, to: Element): void {
		if (from === null) {
			return;
		}

		to.replaceChildren();
		while (from.firstChild !== null) {
			to.append(from.firstChild);
		}
	}
}

if (!customElements.get("tp-question")) {
	customElements.define("tp-question", TpQuestion);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-question": TpQuestion;
	}
}
