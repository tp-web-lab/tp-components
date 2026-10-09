/**
 * @module components/single-choice-question
 * @summary Single-choice question component backed by a tp-radio-list.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-markdown
 * @summary Markdown rendering component.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
/**
 * @tp-dependency tp-radio-list
 * @summary Transforms a list into a group of radio buttons.
 */
/**
 * @credit Zod https://zod.dev/
 * @summary Runtime schema validation.
 */
// tp-docgen:dependencies:end

import { renderMarkdownToHtml } from "../markdown/markdown.js";
import { TpQuestion } from "../question/question.js";
import { SingleChoiceQuestionSrcSchema } from "../question/question-src-schema.js";
import "../radio-list/radio-list.js";

/**
 * @summary Single-choice question: wraps tp-question with radio-list validation.
 * @tagname tp-single-choice-question
 *
 * @attr {number} answer = 0 - 1-based index of the correct answer in the original list order. Not reflected back to the DOM when set via JS property — read from attribute only.
 * @attr {boolean} random = false - When present, items are shuffled on connect and after each reset.
 * @attr {string} name = "" - Name attribute passed to the underlying tp-radio-list.
 * @attr {string} orientation = "" - Orientation attribute passed to the underlying tp-radio-list.
 * @attr {string} value = "" - Value attribute passed to the underlying tp-radio-list.
 * @attr {string} src = "" - URL to an external JSON file describing items, answer, and feedback. When present, the answer is never exposed in the HTML source. Inherited from TpQuestion.
 * @example
 * <tp-single-choice-question></tp-single-choice-question>
 */
export class TpSingleChoiceQuestion extends TpQuestion {
	public static override get observedAttributes(): string[] {
		return [
			...(TpQuestion.observedAttributes ?? []),
			"answer",
			"random",
			"name",
			"orientation",
			"value",
		];
	}

	/** Reference to the correct <li> element, stored before any shuffle. */
	private correctItemEl: HTMLLIElement | null = null;
	/** Maps each <li> element to its feedback text, keyed before any shuffle. */
	private feedbackByItem: Map<HTMLLIElement, string> = new Map();
	/** Internal answer value — NOT reflected back to the DOM attribute. */
	private _answer = 0;

	// ── Attributes ─────────────────────────────────────────────────────────────

	/**
	 * 1-based index of the correct answer in the original list.
	 * Reads the DOM attribute on first access; JS assignment does NOT write back to the DOM.
	 */
	public get answer(): number {
		if (this._answer > 0) return this._answer;
		const raw = Number.parseInt(this.getAttribute("answer") ?? "", 10);
		return Number.isFinite(raw) && raw > 0 ? raw : 0;
	}

	/** Sets the answer without exposing it in the DOM. */
	public set answer(value: number) {
		this._answer = value;
	}

	/** When `true`, items are shuffled on connect and after each reset. */
	public get random(): boolean {
		return this.hasAttribute("random");
	}

	public set random(value: boolean) {
		this.toggleAttribute("random", value);
	}

	/** Name attribute passed to the underlying tp-radio-list. */
	public get name(): string {
		return this.getAttribute("name") ?? "";
	}

	public set name(value: string) {
		this.setAttribute("name", value);
	}

	/** Orientation attribute passed to the underlying tp-radio-list. */
	public get orientation(): string {
		return this.getAttribute("orientation") ?? "";
	}

	public set orientation(value: string) {
		this.setAttribute("orientation", value);
	}

	/** Value attribute passed to the underlying tp-radio-list. */
	public get value(): string {
		return this.getAttribute("value") ?? "";
	}

	public set value(val: string) {
		this.setAttribute("value", val);
	}

	// ── Lifecycle ───────────────────────────────────────────────────────────────

	protected override connectedCallback(): void {
		super.connectedCallback();
		if (this.src) {
			void this.loadSrc();
		} else {
			this.initInline();
		}
	}

	protected override beforeQuestionLayout(): void {
		if (!this.src) {
			this.ensureRadioList(); // only needed for inline path
		}
	}

	// ── src hook ────────────────────────────────────────────────────────────────

	protected override async onSrcReady(data: unknown): Promise<void> {
		const result = SingleChoiceQuestionSrcSchema.safeParse(data);
		if (!result.success) {
			this.showSrcError(
				`Invalid question file "${this.src}":\n${result.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`).join("\n")}`,
			);
			return;
		}

		const { title, prompt, form, feedback, solution, markup, attributes } =
			result.data;
		this.srcMarkup = this.normalizeSrcMarkup(markup);
		const answer = Number(attributes.answer);

		if (answer > form.length) {
			this.showSrcError(
				`Invalid question file "${this.src}": answer (${answer}) exceeds form items count (${form.length}).`,
			);
			return;
		}

		// Apply attributes to the host element
		this._answer = answer;
		if (attributes.random) this.toggleAttribute("random", true);
		if (attributes.name) this.setAttribute("name", attributes.name);
		if (attributes.orientation)
			this.setAttribute("orientation", attributes.orientation);
		if (attributes.value) this.setAttribute("value", attributes.value);

		// Update rendered sections
		if (title) this.updateSrcTitle(title, this.srcMarkup);
		if (prompt) this.updateSrcPrompt(prompt, this.srcMarkup);
		if (solution) this.updateSrcSolution(solution, this.srcMarkup);

		// Populate form items into the rendered form content
		await this.populateItemsFromSrc(form, this.srcMarkup);

		this.storeCorrectItem();
		this.buildFeedbackMap(feedback ?? []);
		if (feedback && feedback.length > 0) {
			this.hasSpecificFeedback = true;
			this.updateFeedbackPlaceholder();
		}

		if (this.random) this.randomize();
	}

	// ── Inline init ─────────────────────────────────────────────────────────────

	private initInline(): void {
		const feedbackTexts = this.consumeFeedbackListItems();
		this.storeCorrectItem();
		this.buildFeedbackMap(feedbackTexts);
		if (this.random) this.randomize();
	}

	/** Replaces the rendered form content with a new tp-radio-list built from src items. */
	private async populateItemsFromSrc(
		items: string[],
		markup: string,
	): Promise<void> {
		const target = this.formContent;
		if (target === null) return;

		target.replaceChildren();

		const ol = document.createElement("ol");
		for (const text of items) {
			const li = document.createElement("li");
			const normalizedMarkup = this.normalizeSrcMarkup(markup);
			if (normalizedMarkup === "html") {
				li.innerHTML = text;
			} else if (normalizedMarkup === "none") {
				li.textContent = text;
			} else {
				li.innerHTML = await renderMarkdownToHtml(text);
			}
			ol.append(li);
		}

		const radioList = document.createElement("tp-radio-list");
		if (this.name) radioList.setAttribute("name", this.name);
		if (this.orientation)
			radioList.setAttribute("orientation", this.orientation);
		if (this.value) radioList.setAttribute("value", this.value);
		radioList.append(ol);
		target.append(radioList);
	}

	// ── Public API ──────────────────────────────────────────────────────────────

	/**
	 * Shuffles the radio-list items using a Fisher-Yates algorithm.
	 * Clears the current selection after shuffling.
	 *
	 * @summary Randomizes the order of answer items.
	 */
	public randomize(): void {
		const radioList = this.findResponseWidget();
		if (!(radioList instanceof HTMLElement)) return;

		const list = radioList.querySelector<HTMLUListElement | HTMLOListElement>(
			":scope > ul, :scope > ol",
		);
		if (list === null) return;

		const items = Array.from(
			list.querySelectorAll<HTMLLIElement>(":scope > li"),
		);
		if (items.length < 2) return;

		for (let i = items.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const tmp = items[i];
			items[i] = items[j] as HTMLLIElement;
			items[j] = tmp as HTMLLIElement;
		}

		for (const item of items) {
			list.append(item);
		}

		const resetFn = (radioList as { reset?: () => void }).reset;
		if (typeof resetFn === "function") {
			resetFn.call(radioList);
		}
	}

	// ── Overrides ───────────────────────────────────────────────────────────────

	protected override onReset(): void {
		if (this.random) {
			this.randomize();
		}
	}

	protected override onSubmitAttempt(value: unknown): void {
		if (
			this.solutionTabEl === null ||
			!this.solutionTabEl.hasAttribute("disabled")
		)
			return;

		const radioList = this.findResponseWidget();
		if (!(radioList instanceof HTMLElement)) return;

		const items = Array.from(
			radioList.querySelectorAll<HTMLLIElement>(
				":scope > ul > li, :scope > ol > li",
			),
		);
		const itemCount = items.length;
		if (itemCount < 2) return;

		// Unlock if the correct answer was selected
		const correctIndex =
			this.correctItemEl !== null ? items.indexOf(this.correctItemEl) : -1;
		const isCorrect =
			correctIndex >= 0 && String(correctIndex + 1) === String(value);

		if (isCorrect || this.tries >= itemCount - 1) {
			this.solutionTabEl.removeAttribute("disabled");
		}
	}

	protected override get resetMessageText(): string {
		return this.random
			? "Resetting and randomizing the answer form…"
			: "Resetting the answer form…";
	}

	protected override validateSubmit(value: unknown): string | null {
		if (value === null || value === "" || value === "0") {
			return "Please select an item.";
		}
		return null;
	}

	protected override submitMessage(value: unknown): HTMLElement {
		const container = document.createElement("div");
		const submittedIndex = Number.parseInt(String(value), 10);
		const isCorrect = this.isCorrectSelection(submittedIndex);
		container.append(this.createAttemptSummaryLine(isCorrect ? 1 : 0, 1));

		if (isCorrect) {
			const title = document.createElement("p");
			title.textContent = "🎉 Well done, that’s the right answer!";
			const button = this.createOpenSolutionButton();
			container.append(title, button);
			return container;
		}

		const radioList = this.findResponseWidget();
		if (radioList instanceof HTMLElement) {
			const items = Array.from(
				radioList.querySelectorAll<HTMLLIElement>(
					":scope > ul > li, :scope > ol > li",
				),
			);
			const selectedItem = items[submittedIndex - 1];
			const feedback =
				selectedItem !== undefined
					? this.feedbackByItem.get(selectedItem)
					: undefined;
			if (typeof feedback === "string" && feedback.trim() !== "") {
				const line = document.createElement("div");
				// Inline feedback has already been rendered by the page markup parser
				// before the question consumes its list. External JSON feedback still
				// needs to use the markup mode declared by that source.
				line.append(
					this.createSrcContentNode(
						feedback,
						this.src ? this.srcMarkup : "html",
					),
				);
				container.append(line);
			}
		}
		return container;
	}

	// ── Private helpers ─────────────────────────────────────────────────────────

	/** Wraps a bare list (ol/ul) in tp-radio-list if not already wrapped. */
	private ensureRadioList(): void {
		const formDd = this.response;
		if (formDd === null) return;

		// An explicitly authored tp-radio-list already provides the expected widget.
		const existingRadioList = formDd.querySelector("tp-radio-list");
		if (existingRadioList !== null) return;

		const list = formDd.querySelector<HTMLUListElement | HTMLOListElement>(
			":scope > ol, :scope > ul",
		);

		if (list === null) {
			// No list found - clear the dd and show error
			formDd.textContent = "";
			const error = document.createElement("div");
			error.setAttribute("style", "color: red; font-weight: bold;");
			error.textContent =
				"ERROR: tp-single-choice-question requires a <ul> or <ol> list in the Form section.";
			formDd.append(error);
			return;
		}

		// Create tp-radio-list and wrap the list inside it
		const radioList = document.createElement("tp-radio-list");

		// Pass through name, orientation, and value attributes
		if (this.name) radioList.setAttribute("name", this.name);
		if (this.orientation)
			radioList.setAttribute("orientation", this.orientation);
		if (this.value) radioList.setAttribute("value", this.value);

		list.replaceWith(radioList);
		radioList.append(list);
	}

	/** Stores the correct <li> element before any shuffle, based on the answer attribute. */
	private storeCorrectItem(): void {
		if (this.answer <= 0) return;
		const radioList = this.findResponseWidget();
		if (!(radioList instanceof HTMLElement)) return;
		const items = Array.from(
			radioList.querySelectorAll<HTMLLIElement>(
				":scope > ul > li, :scope > ol > li",
			),
		);
		this.correctItemEl = items[this.answer - 1] ?? null;
	}

	private isCorrectSelection(submittedIndex: number): boolean {
		if (!Number.isFinite(submittedIndex)) {
			return false;
		}
		const radioList = this.findResponseWidget();
		if (!(radioList instanceof HTMLElement)) {
			return false;
		}
		const items = Array.from(
			radioList.querySelectorAll<HTMLLIElement>(
				":scope > ul > li, :scope > ol > li",
			),
		);
		const correctIndex =
			this.correctItemEl !== null ? items.indexOf(this.correctItemEl) : -1;
		return correctIndex >= 0 && submittedIndex === correctIndex + 1;
	}

	/** Builds a map from each <li> element to its feedback text, keyed before any shuffle. */
	private buildFeedbackMap(feedbackTexts: string[]): void {
		const radioList = this.findResponseWidget();
		if (!(radioList instanceof HTMLElement)) return;
		const items = Array.from(
			radioList.querySelectorAll<HTMLLIElement>(
				":scope > ul > li, :scope > ol > li",
			),
		);
		this.feedbackByItem.clear();
		for (let i = 0; i < items.length && i < feedbackTexts.length; i++) {
			const text = feedbackTexts[i];
			if (typeof text === "string" && text.trim() !== "") {
				this.feedbackByItem.set(items[i] as HTMLLIElement, text);
			}
		}
	}
}

if (!customElements.get("tp-single-choice-question")) {
	customElements.define("tp-single-choice-question", TpSingleChoiceQuestion);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-single-choice-question": TpSingleChoiceQuestion;
	}
}
