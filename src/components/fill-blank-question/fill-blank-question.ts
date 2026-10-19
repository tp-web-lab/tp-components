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
 * @tp-dependency tp-mathfield
 * @summary Mathematical expression field with live LaTeX or AsciiMath rendering.
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
 * @credit CortexJS Compute Engine https://mathlive.io/compute-engine/
 * @summary Symbolic comparison of mathematical answers, loaded on demand.
 */
/**
 * @credit Zod https://zod.dev/
 * @summary Runtime schema validation.
 */
// tp-docgen:dependencies:end

import { isTpBlank } from "../blank/blank.js";
import "../mathfield/mathfield.js";
import { TpQuestion } from "../question/question.js";
import { FillBlankQuestionSrcSchema } from "../question/question-src-schema.js";
import type { MathChecker, MathTransformation } from "./math-checker.js";
import "../fill-blank/fill-blank.js";
import "../textfield/textfield.js";
import { getBlankFields } from "../fill-blank/fields.js";
import { AnswerReading } from "./answer-reading.js";
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
 * @attr {string} mode = "mixed" - Blank mode: opened, closed, or mixed local choices.
 * @attr {boolean} partial = false - Allows incomplete submissions and marks filled blanks as correct or incorrect after feedback.

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
			"mode",
			"partial",
		];
	}

	/** Expected values in blank order. */
	private answerValues: string[] = [];
	private expectedValues: string[] = [];
	private answerRules: {
		math: boolean;
		mode: string;
	}[] = [];
	private mathChecker: MathChecker | null = null;
	private mathResults = new Map<number, boolean | undefined>();
	private mathTransformations = new Map<number, MathTransformation>();
	private updatingModes = false;
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
	private answerReading: AnswerReading | null = null;

	// ── Lifecycle ───────────────────────────────────────────────────────────────

	/** Whether answer comparison distinguishes uppercase and lowercase letters. */
	public get caseSensitive(): boolean {
		return this.hasAttribute("case-sensitive");
	}
	/** Enables or disables case-sensitive answer comparison. */
	public set caseSensitive(value: boolean) {
		this.setBooleanAttribute("case-sensitive", value);
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
			if (field === target || target.contains(field) || field.contains(target))
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
		this.removeEventListener("tp-blank-mode-change", this.onBlankModeChange);
		this.removeEventListener("input", this.clearEditedResult);
		this.removeEventListener("change", this.clearEditedResult);
		this.answerReading?.destroy();
		this.answerReading = null;
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
		this.addEventListener("tp-blank-mode-change", this.onBlankModeChange);
		this.addEventListener("input", this.clearEditedResult);
		this.addEventListener("change", this.clearEditedResult);
		if (this.usesExternalData) {
			void this.loadSrc();
			return;
		}
		this.feedbackItems = this.consumeFeedbackListItems();
		this.parseAnswers();
	}

	protected override beforeQuestionLayout(): void {
		if (!this.usesExternalData) {
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
		this.answerRules = Array.from(
			content.querySelectorAll(":scope > ol > li"),
			(item) => {
				const math = item.querySelector("tp-math");
				return {
					math: !!math,
					mode: math?.getAttribute("mode") ?? "latexmath",
				};
			},
		);
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
			(item) => {
				const math = item.querySelector("tp-math");
				return (
					math?.getAttribute("value") ||
					math?.querySelector("script")?.textContent ||
					math?.textContent ||
					item.textContent ||
					""
				).trim();
			},
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
		if (name === "mode" && this.isConnected) this.updateClosedAnswers();
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
		if (this.mode !== "closed") {
			for (let index = 0; index < this.answerValues.length; index += 1) {
				const pattern = this.isClosedAnswer(index)
					? null
					: this.answerPattern(index);
				if (pattern !== null) {
					try {
						// Validate the source before wrapping it: an open character class
						// could otherwise consume the full-match suffix.
						new RegExp(pattern, this.caseSensitive ? "u" : "iu");
						new RegExp(
							`^(?:${pattern})(?![\\s\\S])`,
							this.caseSensitive ? "u" : "iu",
						);
					} catch {
						return "Invalid answer pattern: the author must correct this question.";
					}
				}
			}
		}
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
			const correct = this.answerMatches(submittedValues[index] ?? "", index);
			if (correct) score += 1;
			if (this.partial && submitted !== "")
				fields[index]?.setAttribute(
					"data-tp-blank-result",
					correct
						? "success"
						: !this.isClosedAnswer(index) &&
								this.isMathAnswer(index) &&
								this.mathResults.get(index) === undefined
							? "warning"
							: "danger",
				);
		}
		container.append(this.createAttemptSummaryLine(score, total));
		for (const [index, transformation] of this.mathTransformations) {
			if (this.mathResults.get(index) !== true) continue;
			const notice = document.createElement("p");
			notice.setAttribute("data-tp-math-transformation", transformation);
			notice.setAttribute("data-tp-answer-index", String(index + 1));
			const explanation = {
				normalization: "correct after normalization (term order or notation).",
				simplification:
					"correct after algebraic simplification or rearrangement.",
				equivalence: "correct: mathematical equivalence was established.",
			}[transformation];
			notice.textContent = `Answer ${index + 1}: ${explanation}`;
			container.append(notice);
			const expected = document.createElement("p");
			expected.setAttribute("data-tp-expected-answer", String(index + 1));
			expected.append("Expected answer: ");
			const formula = document.createElement("tp-math");
			formula.setAttribute("value", this.answerValues[index] ?? "");
			expected.append(formula);
			container.append(expected);
		}

		if (this.mode !== "closed") {
			submittedValues.forEach((value, index) => {
				if (
					this.isClosedAnswer(index) ||
					this.isMathAnswer(index) ||
					this.answerPattern(index) === null ||
					!this.answerMatches(value, index) ||
					this.normalizeAnswer(value) ===
						this.normalizeAnswer(this.answerValues[index] ?? "")
				)
					return;
				const notice = document.createElement("p");
				notice.setAttribute("data-tp-text-variant", String(index + 1));
				notice.textContent = `Answer ${index + 1}: correct; an accepted wording variant was recognized.`;
				const expected = document.createElement("p");
				expected.setAttribute("data-tp-expected-answer", String(index + 1));
				expected.textContent = `Expected answer: ${this.answerValues[index] ?? ""}`;
				container.append(notice, expected);
			});
		}

		if (isCorrect) {
			const title = document.createElement("p");
			title.textContent = "🎉 Congratulations, correct answer!";
			container.append(title);
			return container;
		}
		for (const [index, result] of this.mathResults) {
			if (result !== undefined || !submittedValues[index]?.trim()) continue;
			const notice = document.createElement("p");
			notice.setAttribute("data-tp-unverified-answer", String(index + 1));
			notice.textContent = `Answer ${index + 1}: this mathematical expression could not be verified automatically.`;
			container.append(notice);
		}
		const generalFeedback = this.createGeneralFeedback();
		if (generalFeedback) container.append(generalFeedback);

		const feedbackList = document.createElement("ul");
		feedbackList.setAttribute("data-tp-question-feedback-list", "");
		let hasFeedbackRows = false;
		for (let index = 0; index < total; index += 1) {
			const submitted = this.normalizeAnswer(submittedValues[index] ?? "");
			if (
				this.answerMatches(submittedValues[index] ?? "", index) ||
				(this.partial && submitted === "")
			) {
				continue;
			}
			const feedback = this.feedbackItems[index];
			if (typeof feedback !== "string" || feedback.trim() === "") {
				continue;
			}
			hasFeedbackRows = true;
			const item = document.createElement("li");
			if (this.usesExternalData) {
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
			formDd.querySelector(
				"input, select, tp-textfield, tp-blank, tp-mathfield",
			) !== null;
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
		this.expectedValues = [...this.answerValues];
		this.updateClosedAnswers();
	}

	private readonly onBlankModeChange = (event: Event): void => {
		if (
			event.target instanceof Element &&
			event.target.closest("[data-tp-question]") === this
		)
			this.updateClosedAnswers();
	};

	private isClosedAnswer(index: number): boolean {
		const field = this.actualFillBlank
			? getBlankFields(this.actualFillBlank)[index]
			: null;
		return field && isTpBlank(field)
			? field.effectiveClosed
			: this.mode === "closed";
	}

	/** Keeps author blanks in place and limits the bank to closed destinations. */
	private updateClosedAnswers(): void {
		if (this.updatingModes || !this.actualFillBlank || !this.isConnected)
			return;
		this.updatingModes = true;
		const openValues = getBlankFields(this.actualFillBlank)
			.filter(
				(field, index) =>
					!this.isClosedAnswer(index) &&
					(!isTpBlank(field) || field.hasAttribute("data-tp-blank-open")),
			)
			.map((field) => [field, field.value] as const);
		try {
			this.mathResults.clear();
			this.mathTransformations.clear();
			this.clearResults();
			this.answerReading?.destroy();
			this.answerReading = null;
			this.closedAnswers?.destroy();
			this.closedAnswers = null;
			const fields = getBlankFields(this.actualFillBlank);
			for (const field of fields) if (isTpBlank(field)) field.syncMode();
			const texts = this.expectedValues;
			this.answerValues = texts.map((text, index) =>
				fields[index]?.localName === "tp-blank" && this.isClosedAnswer(index)
					? String(index + 1)
					: text,
			);
			const closedIndices = fields.flatMap((_, index) =>
				this.isClosedAnswer(index) ? [index] : [],
			);
			if (closedIndices.length)
				this.closedAnswers = new ClosedAnswers(
					this.actualFillBlank,
					texts,
					this.querySelector<HTMLElement>("[data-tp-question-feedback-output]"),
					this.answerContent,
					closedIndices,
				);
		} finally {
			for (const [field, value] of openValues) field.value = value;
			this.answerReading = new AnswerReading(this.actualFillBlank);
			this.updatingModes = false;
		}
	}

	private isMathAnswer(index: number): boolean {
		const field = this.actualFillBlank
			? getBlankFields(this.actualFillBlank)[index]
			: null;
		return field && isTpBlank(field)
			? field.type === "math"
			: !!this.answerRules[index]?.math;
	}

	protected override prepareSubmission(): void | Promise<void> {
		this.mathResults.clear();
		this.mathTransformations.clear();
		if (
			!this.answerValues.some(
				(_, index) => !this.isClosedAnswer(index) && this.isMathAnswer(index),
			)
		)
			return;
		return this.prepareMathResults();
	}

	private async prepareMathResults(): Promise<void> {
		const values = this.getSubmittedValues();
		if (!this.mathChecker) {
			const { createMathChecker } = await import("./math-checker.js");
			this.mathChecker = createMathChecker();
		}
		this.answerValues.forEach((_, index) => {
			if (!this.isClosedAnswer(index) && this.isMathAnswer(index))
				this.mathResults.set(
					index,
					(this.answerRules[index]?.mode ?? "latexmath") === "latexmath"
						? this.mathChecker?.(
								values[index] ?? "",
								this.answerValues[index] ?? "",
								(transformation) =>
									this.mathTransformations.set(index, transformation),
							)
						: undefined,
				);
		});
		if (this.mathTransformations.size > 0) {
			await import("../math/math.js");
		}
	}

	/** Read the current field regular expression. */
	private answerPattern(index: number): string | null {
		const field = this.actualFillBlank
			? getBlankFields(this.actualFillBlank)[index]
			: null;
		return (
			field?.getAttribute("regexp") ??
			field?.closest("tp-textfield")?.getAttribute("regexp") ??
			null
		);
	}

	private answerMatches(value: string, index: number): boolean {
		const expected = this.answerValues[index] ?? "";
		if (!value.trim() || !expected.trim()) return false;
		if (!this.isClosedAnswer(index) && this.isMathAnswer(index))
			return this.mathResults.get(index) === true;
		const pattern = this.isClosedAnswer(index)
			? null
			: this.answerPattern(index);
		if (!this.isClosedAnswer(index) && pattern !== null) {
			try {
				return new RegExp(
					`^(?:${pattern})(?![\\s\\S])`,
					this.caseSensitive ? "u" : "iu",
				).test(value.trim());
			} catch {
				return false;
			}
		}
		const field = this.actualFillBlank
			? getBlankFields(this.actualFillBlank)[index]
			: null;
		if (
			!this.isClosedAnswer(index) &&
			field &&
			isTpBlank(field) &&
			field.type === "number"
		) {
			return (
				Number.isFinite(Number(value)) &&
				Number.isFinite(Number(expected)) &&
				Number(value) === Number(expected)
			);
		}
		return this.normalizeAnswer(value) === this.normalizeAnswer(expected);
	}

	private matchesSubmittedValues(submittedValues: string[]): boolean {
		if (submittedValues.length === 0) return false;
		return submittedValues.every((v, i) => this.answerMatches(v, i));
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
