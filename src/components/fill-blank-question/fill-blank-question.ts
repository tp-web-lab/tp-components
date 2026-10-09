/**
 * @module components/fill-blank-question
 * @summary Fill-in-the-blank question component backed by tp-fill-blank.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-blank
 * @summary displays a text, SVG or image answer in a focusable blank.
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
 * @tp-dependency tp-divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
 */
/**
 * @tp-dependency tp-dragdrop
 * @summary Generic drag-and-drop controller for content.
 */
/**
 * @tp-dependency tp-fill-blank
 * @summary manages inline fields and rich blanks in the content.
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
 * @tp-dependency tp-sidebar
 * @summary Sidebar layout component.
 */
/**
 * @tp-dependency tp-textfield
 * @summary Single-line and automatically growing multiline text field.
 */
/**
 * @credit Zod https://zod.dev/
 * @summary Runtime schema validation.
 */
// tp-docgen:dependencies:end

import { TpQuestion } from "../question/question.js";
import { FillBlankQuestionSrcSchema } from "../question/question-src-schema.js";
import "../fill-blank/fill-blank.js";
import "../textfield/textfield.js";
import { getBlankFields } from "../fill-blank/fields.js";
import closedAnswersStyle from "./closed-answers.css?inline";
import { ClosedAnswers } from "./closed-answers.js";

/**
 * Minimal wrapper: exposes tp-fill-blank's FormData as a string for parent class compatibility.
 * This ensures JSON.stringify() produces different hashes for different submissions.
 */
class StringValueProxy {
	constructor(private fillBlankEl: HTMLElement) {}

	/** Return string value instead of FormData for proper change detection. */
	get value(): string {
		const fillBlank = this.fillBlankEl as unknown as { value?: FormData };
		if (
			typeof fillBlank === "object" &&
			fillBlank !== null &&
			fillBlank.value instanceof FormData
		) {
			const formData = fillBlank.value;
			const blanks = getBlankFields(this.fillBlankEl);

			const values = blanks.map((blank) =>
				(formData.get(blank.name) ?? "").toString().trim(),
			);

			return values.join(",");
		}

		return "";
	}
}

/**
 * @summary Fill-in-the-blank question: wraps tp-question with input/select validation.
 * @tagname tp-fill-blank-question
 *
 * @attr {boolean} case-sensitive = false - Requires matching uppercase and lowercase letters in answers.
 * @attr {boolean} partial = false - Allows incomplete submissions and marks filled blanks as correct or incorrect after feedback.
 * @attr {boolean} closed = false - Provides shuffled answers to assign to readonly tp-textfield blanks.
 * @example
 * <tp-fill-blank-question>
 *   <dl>
 *     <dt>Answers</dt><dd><ol><li>Paris</li></ol></dd>
 *     <dt>Title</dt><dd>Geography</dd>
 *     <dt>Prompt</dt><dd>Complete the sentence.</dd>
 *     <dt>Form</dt><dd>The capital of France is <tp-textfield name="capital" placeholder="Capital" aria-placeholder="Capital" aria-label="Capital" clearable></tp-textfield></dd>
 *     <dt>Feedback</dt><dd>Check the spelling.</dd>
 *     <dt>Solution</dt><dd>Paris</dd>
 *   </dl>
 * </tp-fill-blank-question>
 */
export class TpFillBlankQuestion extends TpQuestion {
	public static override get observedAttributes(): string[] {
		return [
			...(TpQuestion.observedAttributes ?? []),
			"case-sensitive",
			"closed",
			"partial",
		];
	}

	/** Expected values in blank order. */
	private answerValues: string[] = [];
	/** Ordered answers read from the author list (or from a JSON source). */
	private listedAnswers: string[] | null = null;
	/** Original answer presentations, retained independently of their expected rank. */
	private answerContent: Node[] = [];

	/** The tp-fill-blank widget instance (if any). */
	private actualFillBlank: HTMLElement | null = null;

	/** Proxy that exposes string value instead of FormData. */
	private stringValueProxy: StringValueProxy | null = null;
	private feedbackItems: string[] = [];
	/** Optional closed-answer interaction, cleaned up on reset and disconnect. */
	private closedAnswers: ClosedAnswers | null = null;

	// ── Lifecycle ───────────────────────────────────────────────────────────────

	/** Whether answer comparison distinguishes uppercase and lowercase letters. */
	public get caseSensitive(): boolean {
		return this.hasAttribute("case-sensitive");
	}
	/** Enables or disables case-sensitive answer comparison. */
	public set caseSensitive(value: boolean) {
		this.setBooleanAttribute("case-sensitive", value);
	}

	/** Whether answers are selected from a shuffled bank instead of typed freely. */
	public get closed(): boolean {
		return this.hasAttribute("closed");
	}

	/** Enables or disables the closed-answer mode. */
	public set closed(value: boolean) {
		this.setBooleanAttribute("closed", value);
	}

	/** Whether incomplete submissions may receive feedback. */
	public get partial(): boolean {
		return this.hasAttribute("partial");
	}
	public set partial(value: boolean) {
		this.setBooleanAttribute("partial", value);
	}

	/** Removes grading from answers as users edit or clear them. */
	private readonly clearEditedResult = (event: Event): void => {
		const target = event.target;
		if (!(target instanceof Element) || !this.actualFillBlank) return;
		for (const field of getBlankFields(this.actualFillBlank)) {
			if (field === target || target.contains(field))
				field.removeAttribute("data-tp-blank-result");
		}
	};

	/** Clears the previous submission's visual grading. */
	private clearResults(): void {
		for (const field of this.actualFillBlank?.querySelectorAll(
			"[data-tp-blank-result]",
		) ?? [])
			field.removeAttribute("data-tp-blank-result");
	}

	/** Removes answer-bank listeners before disconnecting the base question. */
	public override disconnectedCallback(): void {
		this.removeEventListener("input", this.clearEditedResult);
		this.removeEventListener("change", this.clearEditedResult);
		this.closedAnswers?.destroy();
		this.closedAnswers = null;
		super.disconnectedCallback();
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(
			"tp-fill-blank-question-closed-styles",
			closedAnswersStyle,
		);
		this.updateCaseSensitiveNotice();
		this.addEventListener("input", this.clearEditedResult);
		this.addEventListener("change", this.clearEditedResult);
		if (this.src) {
			void this.loadSrc();
			return;
		}
		this.feedbackItems = this.consumeFeedbackListItems();
		this.parseAnswers();
	}

	protected override beforeQuestionLayout(): void {
		if (!this.src) {
			this.readAnswerList();
			this.ensureFillBlank(this.response);
		}
	}

	/** Consumes the answer section before the base class normalizes the question DL. */
	private readAnswerList(): void {
		const heading = Array.from(this.querySelectorAll(":scope > dl > dt")).find(
			(node) => /^(answer|answers)$/i.test(node.textContent?.trim() ?? ""),
		);
		const content = heading?.nextElementSibling;
		if (content?.localName !== "dd") return;
		this.answerContent = Array.from(
			content.querySelectorAll(":scope > ol > li"),
			(item) => {
				const fragment = document.createDocumentFragment();
				for (const child of item.childNodes)
					fragment.append(child.cloneNode(true));
				return fragment;
			},
		);
		this.listedAnswers = Array.from(
			content.querySelectorAll(":scope > ol > li"),
			(item) => item.textContent?.trim() ?? "",
		);
		heading?.remove();
		content.remove();
	}

	/** Keeps the prompt notice in sync with the boolean attribute. */
	protected override attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		super.attributeChangedCallback(name, oldValue, newValue);
		if (name === "case-sensitive") this.updateCaseSensitiveNotice();
		if (name === "closed" && this.isConnected) this.updateClosedAnswers();
		if (name === "partial" && !this.partial) this.clearResults();
	}

	/** Adds a separate notice after the prompt, preserving authored and fetched content. */
	private updateCaseSensitiveNotice(): void {
		const prompt = this.querySelector("[data-tp-question-prompt-content]");
		if (!prompt) return;
		const notice = prompt.parentElement?.querySelector(
			"[data-tp-case-sensitive-notice]",
		);
		if (!this.caseSensitive) {
			notice?.remove();
			return;
		}
		if (notice) return;
		const message = document.createElement("tp-callout");
		message.setAttribute("variant", "warning");
		message.setAttribute("data-tp-case-sensitive-notice", "");
		message.textContent =
			"Answers are case-sensitive: uppercase and lowercase letters must match.";
		prompt.after(message);
	}

	protected override async onSrcReady(data: unknown): Promise<void> {
		const result = FillBlankQuestionSrcSchema.safeParse(data);
		if (!result.success) {
			this.showSrcError(
				`Invalid question file "${this.src}":\n${result.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`).join("\n")}`,
			);
			return;
		}

		const { title, prompt, form, feedback, solution, markup, attributes } =
			result.data;
		this.srcMarkup = this.normalizeSrcMarkup(markup);
		this.listedAnswers = Array.isArray(attributes.answer)
			? attributes.answer.map((value) => value.trim())
			: attributes.answer.split(",").map((value) => value.trim());

		if (title) this.updateSrcTitle(title, this.srcMarkup);
		if (prompt) this.updateSrcPrompt(prompt, this.srcMarkup);
		if (solution) this.updateSrcSolution(solution, this.srcMarkup);

		await this.populateFormFromSrc(form, this.srcMarkup);
		this.ensureFillBlank(this.formContent);
		this.parseAnswers();

		const blankCount = this.actualFillBlank
			? getBlankFields(this.actualFillBlank).length
			: 0;
		if (blankCount === 0) {
			this.showSrcError(
				`Invalid question file "${this.src}": form must contain at least one <input> or <select>.`,
			);
			return;
		}
		if (this.answerValues.length !== blankCount) {
			this.showSrcError(
				`Invalid question file "${this.src}": answer count (${String(this.answerValues.length)}) does not match blank count (${String(blankCount)}).`,
			);
			return;
		}

		this.feedbackItems = feedback ?? [];
		if (this.feedbackItems.length > 0) {
			this.hasSpecificFeedback = true;
			this.updateFeedbackPlaceholder();
		}
	}

	// ── Overrides ───────────────────────────────────────────────────────────────

	protected override findResponseWidget(): HTMLElement | null {
		return this.stringValueProxy as unknown as HTMLElement;
	}

	protected override onReset(): void {
		this.clearResults();
		if (this.actualFillBlank === null) return;
		const fillBlank = this.actualFillBlank as unknown as {
			reset?: () => void;
		};
		if (typeof fillBlank.reset === "function") {
			fillBlank.reset();
		}
		this.updateClosedAnswers();
	}

	protected override onSubmitAttempt(value: unknown): void {
		if (
			this.solutionTabEl === null ||
			!this.solutionTabEl.hasAttribute("disabled")
		)
			return;

		if (this.actualFillBlank === null) return;

		const submittedValues = this.getSubmittedValues();
		const blankCount = submittedValues.length;
		if (blankCount === 0) return;

		// Unlock if correct or after blankCount-1 tries
		const isCorrect = this.matchesSubmittedValues(submittedValues);
		if (isCorrect || this.tries >= blankCount - 1) {
			this.solutionTabEl.removeAttribute("disabled");
		}
		void value;
	}

	protected override validateSubmit(_value: unknown): string | null {
		const submittedValues = this.getSubmittedValues();
		if (
			submittedValues.length === 0 ||
			(!this.partial && submittedValues.some((v) => v === ""))
		) {
			return "Please fill in all blanks.";
		}
		return null;
	}

	/** A fully correct response needs congratulations, not a missing-feedback warning. */
	protected override shouldShowMissingFeedback(): boolean {
		return (
			!this.matchesSubmittedValues(this.getSubmittedValues()) &&
			super.shouldShowMissingFeedback()
		);
	}

	protected override submitMessage(_value: unknown): HTMLElement {
		const container = document.createElement("div");
		const submittedValues = this.getSubmittedValues();
		const total = submittedValues.length;
		const isCorrect = this.matchesSubmittedValues(submittedValues);

		this.clearResults();
		const fields = this.actualFillBlank
			? getBlankFields(this.actualFillBlank)
			: [];
		let score = 0;
		for (let index = 0; index < total; index += 1) {
			const submitted = this.normalizeAnswer(submittedValues[index] ?? "");
			const expected = this.normalizeAnswer(this.answerValues[index] ?? "");
			const correct =
				submitted !== "" && expected !== "" && submitted === expected;
			if (correct) score += 1;
			if (this.partial && submitted !== "")
				fields[index]?.setAttribute(
					"data-tp-blank-result",
					correct ? "success" : "danger",
				);
		}
		container.append(this.createAttemptSummaryLine(score, total));

		if (isCorrect) {
			const title = document.createElement("p");
			title.textContent = "🎉 Congratulations, correct answer!";
			container.append(title);
			return container;
		}
		const generalFeedback = this.createGeneralFeedback();
		if (generalFeedback) container.append(generalFeedback);

		const feedbackList = document.createElement("ul");
		feedbackList.setAttribute("data-tp-question-feedback-list", "");
		let hasFeedbackRows = false;
		for (let index = 0; index < total; index += 1) {
			const submitted = this.normalizeAnswer(submittedValues[index] ?? "");
			const expected = this.normalizeAnswer(this.answerValues[index] ?? "");
			if (submitted === expected || (this.partial && submitted === "")) {
				continue;
			}
			const feedback = this.feedbackItems[index];
			if (typeof feedback !== "string" || feedback.trim() === "") {
				continue;
			}
			hasFeedbackRows = true;
			const item = document.createElement("li");
			if (this.src) {
				item.append(this.createSrcContentNode(feedback));
			} else {
				item.innerHTML = feedback;
			}
			feedbackList.append(item);
		}
		if (hasFeedbackRows) {
			container.append(feedbackList);
		}
		return container;
	}

	// ── Private helpers ─────────────────────────────────────────────────────────

	/** Wraps inputs/selects in tp-fill-blank if not already wrapped. */
	private ensureFillBlank(formDd: HTMLElement | null): void {
		if (formDd === null) return;

		// Check if any input or select exists in the dd
		const hasInputsOrSelects =
			formDd.querySelector("input, select, tp-textfield, tp-blank") !== null;
		if (!hasInputsOrSelects) {
			// No inputs/selects found - clear the dd and show error
			formDd.textContent = "";
			const error = document.createElement("div");
			error.setAttribute("style", "color: red; font-weight: bold;");
			error.textContent =
				"ERROR: tp-fill-blank-question requires <input> or <select> elements in the Form section.";
			formDd.append(error);
			return;
		}

		// If there's already a tp-fill-blank, nothing to do
		const existingFillBlank = formDd.querySelector("tp-fill-blank");
		if (existingFillBlank instanceof HTMLElement) {
			this.actualFillBlank = existingFillBlank;
			this.stringValueProxy = new StringValueProxy(existingFillBlank);
			return;
		}

		// Create tp-fill-blank and wrap all children inside it
		const fillBlank = document.createElement("tp-fill-blank");
		fillBlank.style.marginLeft = "1rem";
		while (formDd.firstChild !== null) {
			fillBlank.append(formDd.firstChild);
		}
		formDd.append(fillBlank);
		this.actualFillBlank = fillBlank;
		this.stringValueProxy = new StringValueProxy(fillBlank);
	}

	private async populateFormFromSrc(
		form: string,
		markup: string,
	): Promise<void> {
		const target = this.formContent;
		if (target === null) return;

		const normalizedMarkup = this.normalizeSrcMarkup(markup);
		target.replaceChildren();
		if (normalizedMarkup === "html") {
			target.innerHTML = form;
			return;
		}
		if (normalizedMarkup === "none") {
			target.textContent = form;
			return;
		}
		const { renderMarkdownToHtml } = await import("../markdown/markdown.js");
		target.innerHTML = await renderMarkdownToHtml(form);
	}

	/** Uses the ordered list, with a fallback for existing attribute-based exercises. */
	private parseAnswers(): void {
		const answerStr = this.getAttribute("answer")?.trim() ?? "";
		this.answerValues =
			this.listedAnswers ??
			(answerStr === "" ? [] : answerStr.split(",").map((s) => s.trim()));
		this.updateClosedAnswers();
	}

	/** Rebuilds the shuffled bank while preserving the original question form. */
	private updateClosedAnswers(): void {
		this.clearResults();
		this.closedAnswers?.destroy();
		this.closedAnswers = null;
		if (this.closed && this.actualFillBlank && this.isConnected) {
			const texts = this.listedAnswers ?? this.answerValues;
			const fields = getBlankFields(this.actualFillBlank);
			this.answerValues = texts.map((text, index) =>
				fields[index]?.localName === "tp-blank" ? String(index + 1) : text,
			);
			this.closedAnswers = new ClosedAnswers(
				this.actualFillBlank,
				texts,
				this.querySelector<HTMLElement>("[data-tp-question-feedback-output]"),
				this.answerContent,
			);
		}
	}

	private matchesSubmittedValues(submittedValues: string[]): boolean {
		if (submittedValues.length === 0) return false;
		return submittedValues.every(
			(v, i) =>
				this.normalizeAnswer(v) ===
				this.normalizeAnswer(this.answerValues[i] ?? ""),
		);
	}

	/** Applies the same whitespace and case policy to validation and per-blank scoring. */
	private normalizeAnswer(value: string): string {
		const text = value.trim();
		return this.caseSensitive ? text : text.toLowerCase();
	}

	private getSubmittedValues(): string[] {
		if (this.actualFillBlank === null) return [];
		const fillBlank = this.actualFillBlank as unknown as { value?: FormData };
		if (!(fillBlank.value instanceof FormData)) {
			return [];
		}
		const blanks = getBlankFields(this.actualFillBlank);
		return blanks.map((blank) =>
			(fillBlank.value?.get(blank.name) ?? "").toString().trim(),
		);
	}
}

if (!customElements.get("tp-fill-blank-question")) {
	customElements.define("tp-fill-blank-question", TpFillBlankQuestion);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-fill-blank-question": TpFillBlankQuestion;
	}
}
