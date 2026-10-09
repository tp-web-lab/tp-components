/**
 * @module components/multi-choice-question
 * @summary Multi-choice question component backed by a tp-checkbox-list.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-checkbox-list
 * @summary Transforms a list into a group of checkboxes.
 */
/**
 * @tp-dependency tp-markdown
 * @summary Markdown rendering component.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
/**
 * @credit Zod https://zod.dev/
 * @summary Runtime schema validation.
 */
// tp-docgen:dependencies:end

import { renderMarkdownToHtml } from "../markdown/markdown.js";
import { TpQuestion } from "../question/question.js";
import { MultiChoiceQuestionSrcSchema } from "../question/question-src-schema.js";
import "../checkbox-list/checkbox-list.js";

/**
 * @summary Multi-choice question: wraps tp-question with checkbox-list validation.
 * @tagname tp-multi-choice-question
 *
 * @attr {string} answer = "" - Comma-separated 1-based indexes of the correct answers in the original list order (e.g. `"1,3"`). An empty answer means none of the choices is correct. Not reflected back to the DOM when set via JS property — read from attribute only.
 * @attr {boolean} random = false - When present, items are shuffled on connect and after each reset.
 * @attr {string} name = "" - Name attribute passed to the underlying tp-checkbox-list.
 * @attr {string} orientation = "" - Orientation attribute passed to the underlying tp-checkbox-list.
 * @attr {string} value = "" - Value attribute passed to the underlying tp-checkbox-list.
 * @attr {string} src = "" - URL to an external JSON file describing items, answer, and feedback. When present, the answer is never exposed in the HTML source. Inherited from TpQuestion.
 * @example
 * <tp-multi-choice-question></tp-multi-choice-question>
 */
export class TpMultiChoiceQuestion extends TpQuestion {
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

	/** DOM references to the correct <li> elements, stored before any shuffle. */
	private correctItemEls: HTMLLIElement[] = [];
	/** Maps each <li> element to its feedback text, keyed before any shuffle. */
	private feedbackByItem: Map<HTMLLIElement, string> = new Map();
	/** Internal answer value — NOT reflected back to the DOM attribute. */
	private _answer: string | null = null;

	// ── Attributes ─────────────────────────────────────────────────────────────

	/**
	 * Comma-separated 1-based indexes of correct answers in the original list order.
	 * e.g. `"1,3"` means items 1 and 3 are correct.
	 * Reads the DOM attribute on first access; JS assignment does NOT write back to the DOM.
	 */
	public get answer(): string {
		if (this._answer !== null) return this._answer;
		return this.getAttribute("answer") ?? "";
	}

	/** Sets the answer without exposing it in the DOM. */
	public set answer(value: string) {
		this._answer = value;
	}

	/** Parsed array of 1-based correct answer indexes. */
	private get answerIndexes(): number[] {
		return this.answer
			.split(",")
			.map((s) => Number.parseInt(s.trim(), 10))
			.filter((n) => Number.isFinite(n) && n > 0);
	}

	/** When `true`, items are shuffled on connect and after each reset. */
	public get random(): boolean {
		return this.hasAttribute("random");
	}

	public set random(value: boolean) {
		this.toggleAttribute("random", value);
	}

	/** Name attribute passed to the underlying tp-checkbox-list. */
	public get name(): string {
		return this.getAttribute("name") ?? "";
	}

	public set name(value: string) {
		this.setAttribute("name", value);
	}

	/** Orientation attribute passed to the underlying tp-checkbox-list. */
	public get orientation(): string {
		return this.getAttribute("orientation") ?? "";
	}

	public set orientation(value: string) {
		this.setAttribute("orientation", value);
	}

	/** Value attribute passed to the underlying tp-checkbox-list. */
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
			this.ensureCheckboxList(); // only needed for inline path
		}
	}

	// ── src hook ────────────────────────────────────────────────────────────────

	protected override async onSrcReady(data: unknown): Promise<void> {
		const result = MultiChoiceQuestionSrcSchema.safeParse(data);
		if (!result.success) {
			this.showSrcError(
				`Invalid question file "${this.src}":\n${result.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`).join("\n")}`,
			);
			return;
		}

		const { title, prompt, form, feedback, solution, markup, attributes } =
			result.data;
		this.srcMarkup = this.normalizeSrcMarkup(markup);
		const answerStr = Array.isArray(attributes.answer)
			? attributes.answer.join(",")
			: attributes.answer;
		const indexes = answerStr
			.split(",")
			.map((s) => Number.parseInt(s.trim(), 10));
		const outOfRange = indexes.filter((i) => i > form.length);
		if (outOfRange.length > 0) {
			this.showSrcError(
				`Invalid question file "${this.src}": answer index(es) ${outOfRange.join(",")} exceed form items count (${form.length}).`,
			);
			return;
		}

		// Apply attributes to the host element
		this._answer = answerStr;
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

		this.storeCorrectItems();
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
		this.storeCorrectItems();
		this.buildFeedbackMap(feedbackTexts);
		if (this.random) this.randomize();
	}

	/** Replaces the rendered form content with a new tp-checkbox-list built from src items. */
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

		const checkboxList = document.createElement("tp-checkbox-list");
		if (this.name) checkboxList.setAttribute("name", this.name);
		if (this.orientation)
			checkboxList.setAttribute("orientation", this.orientation);
		if (this.value) checkboxList.setAttribute("value", this.value);
		checkboxList.append(ol);
		target.append(checkboxList);
	}

	// ── Public API ──────────────────────────────────────────────────────────────

	/**
	 * Shuffles the checkbox-list items using a Fisher-Yates algorithm.
	 * Clears the current selection after shuffling.
	 *
	 * @summary Randomizes the order of answer items.
	 */
	public randomize(): void {
		const checkboxList = this.findResponseWidget();
		if (!(checkboxList instanceof HTMLElement)) return;

		const list = checkboxList.querySelector<
			HTMLUListElement | HTMLOListElement
		>(":scope > ul, :scope > ol");
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

		const resetFn = (checkboxList as { reset?: () => void }).reset;
		if (typeof resetFn === "function") {
			resetFn.call(checkboxList);
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

		const checkboxList = this.findResponseWidget();
		if (!(checkboxList instanceof HTMLElement)) return;

		const items = Array.from(
			checkboxList.querySelectorAll<HTMLLIElement>(
				":scope > ul > li, :scope > ol > li",
			),
		);
		const itemCount = items.length;
		if (itemCount < 2) return;

		// Current 1-based positions of the correct items after possible shuffle
		const correctCurrentIndexes = this.correctItemEls
			.map((el) => items.indexOf(el))
			.filter((i) => i >= 0)
			.map((i) => i + 1)
			.sort((a, b) => a - b);

		// Submitted value is a comma-separated string of selected 1-based indexes
		const submittedIndexes = String(value ?? "")
			.split(",")
			.map((s) => Number.parseInt(s.trim(), 10))
			.filter((n) => Number.isFinite(n) && n > 0)
			.sort((a, b) => a - b);

		const isCorrect =
			correctCurrentIndexes.length === submittedIndexes.length &&
			correctCurrentIndexes.every((v, i) => v === submittedIndexes[i]);

		const maxTries = 2 ** itemCount;
		if (isCorrect || this.tries >= maxTries) {
			this.solutionTabEl.removeAttribute("disabled");
		}
	}

	protected override get resetMessageText(): string {
		return this.random
			? "Resetting and randomizing the answer form…"
			: "Resetting the answer form…";
	}

	protected override validateSubmit(_value: unknown): string | null {
		return null;
	}

	protected override submitMessage(value: unknown): HTMLElement {
		const container = document.createElement("div");
		const submittedIndexes = this.parseSubmittedIndexes(value);
		const correctIndexes = this.getCorrectCurrentIndexes();
		const isCorrect =
			correctIndexes.length === submittedIndexes.length &&
			correctIndexes.every((index, i) => index === submittedIndexes[i]);

		if (isCorrect) {
			const total =
				correctIndexes.length ||
				this.findResponseWidget()?.querySelectorAll(
					":scope > ul > li, :scope > ol > li",
				).length ||
				1;
			container.append(this.createAttemptSummaryLine(total, total));
			const title = document.createElement("p");
			title.textContent = "🎉 Félicitations, bonne réponse !";
			container.append(title, this.createOpenSolutionButton());
			return container;
		}
		const checkboxList = this.findResponseWidget();
		let total = correctIndexes.length;
		if (checkboxList instanceof HTMLElement) {
			const items = checkboxList.querySelectorAll(
				":scope > ul > li, :scope > ol > li",
			);
			total = items.length;
		}
		const submittedSet = new Set(submittedIndexes);
		const correctSet = new Set(correctIndexes);
		let score = 0;
		for (let index = 1; index <= total; index += 1) {
			const selected = submittedSet.has(index);
			const shouldSelect = correctSet.has(index);
			if (selected === shouldSelect) {
				score += 1;
			}
		}
		container.append(this.createAttemptSummaryLine(score, total));

		const feedbackList = document.createElement("ul");
		feedbackList.setAttribute("data-tp-question-feedback-list", "");
		let hasFeedbackRows = false;
		const checkboxItems =
			checkboxList instanceof HTMLElement
				? Array.from(
						checkboxList.querySelectorAll<HTMLLIElement>(
							":scope > ul > li, :scope > ol > li",
						),
					)
				: [];
		for (const index of submittedIndexes) {
			const item = checkboxItems[index - 1];
			const feedback =
				item !== undefined ? this.feedbackByItem.get(item) : undefined;
			if (typeof feedback !== "string" || feedback.trim() === "") {
				continue;
			}
			hasFeedbackRows = true;
			const li = document.createElement("li");
			// Inline feedback is already HTML; only external content needs its declared parser.
			li.append(
				this.createSrcContentNode(feedback, this.src ? this.srcMarkup : "html"),
			);
			feedbackList.append(li);
		}
		if (hasFeedbackRows) {
			container.append(feedbackList);
		}
		return container;
	}

	// ── Private helpers ─────────────────────────────────────────────────────────

	/** Wraps a bare list (ol/ul) in tp-checkbox-list if not already wrapped. */
	private ensureCheckboxList(): void {
		const formDd = this.response;
		if (formDd === null) return;

		// An explicitly authored tp-checkbox-list already provides the expected widget.
		const existingCheckboxList = formDd.querySelector("tp-checkbox-list");
		if (existingCheckboxList !== null) return;

		const list = formDd.querySelector<HTMLUListElement | HTMLOListElement>(
			":scope > ol, :scope > ul",
		);

		if (list === null) {
			// No list found - clear the dd and show error
			formDd.textContent = "";
			const error = document.createElement("div");
			error.setAttribute("style", "color: red; font-weight: bold;");
			error.textContent =
				"ERROR: tp-multi-choice-question requires a <ul> or <ol> list in the Form section.";
			formDd.append(error);
			return;
		}

		// Create tp-checkbox-list and wrap the list inside it
		const checkboxList = document.createElement("tp-checkbox-list");

		// Pass through name, orientation, and value attributes
		if (this.name) checkboxList.setAttribute("name", this.name);
		if (this.orientation)
			checkboxList.setAttribute("orientation", this.orientation);
		if (this.value) checkboxList.setAttribute("value", this.value);

		list.replaceWith(checkboxList);
		checkboxList.append(list);
	}

	/** Stores references to the correct <li> elements before any shuffle. */
	private storeCorrectItems(): void {
		const indexes = this.answerIndexes;
		if (indexes.length === 0) return;

		const checkboxList = this.findResponseWidget();
		if (!(checkboxList instanceof HTMLElement)) return;

		const items = Array.from(
			checkboxList.querySelectorAll<HTMLLIElement>(
				":scope > ul > li, :scope > ol > li",
			),
		);

		this.correctItemEls = indexes
			.map((i) => items[i - 1])
			.filter((el): el is HTMLLIElement => el instanceof HTMLLIElement);
	}

	private parseSubmittedIndexes(value: unknown): number[] {
		return String(value ?? "")
			.split(",")
			.map((s) => Number.parseInt(s.trim(), 10))
			.filter((n) => Number.isFinite(n) && n > 0)
			.sort((a, b) => a - b);
	}

	private getCorrectCurrentIndexes(): number[] {
		const checkboxList = this.findResponseWidget();
		if (!(checkboxList instanceof HTMLElement)) {
			return [];
		}
		const items = Array.from(
			checkboxList.querySelectorAll<HTMLLIElement>(
				":scope > ul > li, :scope > ol > li",
			),
		);
		return this.correctItemEls
			.map((el) => items.indexOf(el))
			.filter((i) => i >= 0)
			.map((i) => i + 1)
			.sort((a, b) => a - b);
	}

	/** Builds a map from each <li> element to its feedback text, keyed before any shuffle. */
	private buildFeedbackMap(feedbackTexts: string[]): void {
		const checkboxList = this.findResponseWidget();
		if (!(checkboxList instanceof HTMLElement)) return;
		const items = Array.from(
			checkboxList.querySelectorAll<HTMLLIElement>(
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

if (!customElements.get("tp-multi-choice-question")) {
	customElements.define("tp-multi-choice-question", TpMultiChoiceQuestion);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-multi-choice-question": TpMultiChoiceQuestion;
	}
}
