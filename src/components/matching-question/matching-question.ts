/** @module components/matching-question */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
/**
 * @tp-dependency tp-matching
 * @summary associates rich content from two or more optionally titled lists without grading the groups.
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

import { z } from "zod";
import { TpCallout } from "../callout/callout.js";
import { normalizeMatchingValue, TpMatching } from "../matching/matching.js";
import { TpQuestion } from "../question/question.js";

/** External questions use the same rank-based author pairing as inline lists. */
const sourceSchema = z
	.object({
		title: z.string().optional(),
		prompt: z.string().min(1),
		markup: z.enum(["markdown", "md", "html", "none"]).optional(),
		form: z
			.array(z.array(z.string().min(1)).min(1))
			.min(2)
			.refine(
				(columns) =>
					columns.every((column) => column.length === columns[0]?.length),
				"All lists must have the same number of items.",
			),
		headers: z.array(z.string().min(1)).optional(),
		feedback: z.string().optional(),
		solution: z.string().optional(),
	})
	.refine(
		(data) => !data.headers || data.headers.length === data.form.length,
		"Provide exactly one header per list.",
	);

/**
 * @summary checks groups across two or more optionally titled lists using tp-matching.
 * @tagname tp-matching-question
 * @attr {boolean} heading = false - Passes heading to the matching widget; the first list supplies column titles.
 * @accessibility Reuses tp-matching keyboard controls and TpQuestion feedback, solution tabs and panel toggles.
 * @keyboard {Tab / Shift+Tab} Moves between association controls, embedded content and question actions.
 * @keyboard {Enter / Space} Activates the focused selection, removal, Reset or Submit button.
 * @keyboard {Escape} Cancels the pending association selection.
 * @example
 * <tp-matching-question>
 *   <dl>
 *     <dt>Title</dt><dd>English and French</dd>
 *     <dt>Prompt</dt><dd>Match each English expression with its French translation.</dd>
 *     <dt>Form</dt><dd>
 *       <ul><li>Hello</li><li>Thank you</li><li>Goodbye</li></ul>
 *       <ol><li>Bonjour</li><li>Merci</li><li>Au revoir</li></ol>
 *     </dd>
 *     <dt>Feedback</dt><dd>Distinguish greetings, thanks and farewells.</dd>
 *     <dt>Solution</dt><dd>Hello — Bonjour; Thank you — Merci; Goodbye — Au revoir.</dd>
 *   </dl>
 * </tp-matching-question>
 */
export class TpMatchingQuestion extends TpQuestion {
	public static override get observedAttributes(): string[] {
		return [...TpQuestion.observedAttributes, "heading"];
	}
	/** Whether the first list supplies column titles. @attr heading */
	public get heading(): boolean {
		return this.hasAttribute("heading");
	}
	public set heading(value: boolean) {
		this.toggleAttribute("heading", value);
	}
	protected override attributeChangedCallback(
		name: string,
		oldValue: string | null,
		newValue: string | null,
	): void {
		super.attributeChangedCallback(name, oldValue, newValue);
		if (name === "heading")
			this.findResponseWidget()?.toggleAttribute("heading", this.heading);
	}

	/** Feedback supplied by an external JSON definition. */
	private sourceFeedback: Node | null = null;
	/** Invalidates pending source results after disconnection or reload. */
	private sourceVersion = 0;
	/** Keeps the introductory help and its dismissed state for this question. */
	private selectionHelp: TpCallout | null = null;
	/** Creates the shared layout and loads an optional external definition. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureSelectionHelp();
		this.findResponseWidget()?.toggleAttribute("heading", this.heading);
		if (this.src) void this.loadSrc();
	}
	/** Shows initial mouse and keyboard guidance in the Feedback panel. */
	private ensureSelectionHelp(): void {
		const target = this.querySelector<HTMLElement>(
			"[data-tp-question-feedback-output]",
		);
		if (!target) return;
		if (!this.selectionHelp) {
			const help = new TpCallout();
			help.setAttribute("data-tp-matching-question-help", "");
			help.setAttribute("variant", "info");
			help.setAttribute("closable", "");
			help.setAttribute("heading", "How to form a group");
			help.innerHTML =
				"<p><strong>Mouse:</strong> Click a card or its link icon, then click one item in each other column to form a group. You can also drag a link icon onto an item in another column. Click the selected item again to cancel the selection.</p>" +
				"<p><strong>Keyboard:</strong> Use Tab or Shift+Tab to focus an item's Select button (link icon), then press Enter or Space to select it. Repeat for one item in each other column. Press Escape while focused inside an item to cancel the pending selection.</p>" +
				"<p>Items in the same group share a color and a number. Select an existing member to extend or change its group.</p>";
			this.selectionHelp = help;
		}
		if (this.selectionHelp.parentElement !== target)
			target.prepend(this.selectionHelp);
	}
	/** Invalidates asynchronous results and releases inherited action listeners. */
	public override disconnectedCallback(): void {
		this.sourceVersion++;
		super.disconnectedCallback();
	}
	/** Wraps author lists or titled columns before TpQuestion builds its form panel. */
	protected override beforeQuestionLayout(): void {
		if (this.src || this.findResponseWidget()) return;
		const form = this.response;
		if (!form) return;
		const existing = form.querySelector("tp-matching");
		if (existing) {
			existing.heading = this.heading;
			return;
		}
		const widget = new TpMatching();
		widget.heading = this.heading;
		// AsciiDoc open blocks group sibling lists in a neutral div inside the dd.
		const listRoot =
			form.children.length === 1 && form.firstElementChild?.tagName === "DIV"
				? form.firstElementChild
				: form;
		const lists = [...listRoot.children].filter((node) =>
			node.matches("ul, ol, dl"),
		);
		widget.append(...lists);
		form.append(widget);
	}
	/** Finds the reused matching widget instead of a surrounding author paragraph. */
	protected override findResponseWidget(): TpMatching | null {
		return this.formContent?.querySelector<TpMatching>("tp-matching") ?? null;
	}
	/** Counts expected pairs from the original first list, regardless of display order. */
	private get pairCount(): number {
		return this.findResponseWidget()?.itemCount ?? 0;
	}
	/** Requires a complete one-to-one association before allowing a graded attempt. */
	protected override validateSubmit(value: unknown): string | null {
		const count = this.pairCount;
		if (!count)
			return "Provide at least two nonempty lists with the same number of items.";
		if (
			!normalizeMatchingValue(
				value,
				this.findResponseWidget()?.columnCount ?? 0,
				count,
				true,
			)
		)
			return "Associate every item with one item from each other list before submitting.";
		return null;
	}
	/** Scores equal original ranks; correct answers omit the author's remedial feedback. */
	protected override submitMessage(value: unknown): HTMLElement {
		const widget = this.findResponseWidget();
		const groups =
			normalizeMatchingValue(
				value,
				widget?.columnCount ?? 0,
				this.pairCount,
				true,
			) ?? [];
		const score = groups.filter((group) =>
			group.items.every((rank) => rank === group.items[0]),
		).length;
		const noun = widget?.columnCount === 2 ? "pairs" : "groups";
		const output = document.createElement("div");
		output.append(this.createAttemptSummaryLine(score, this.pairCount));
		const message = document.createElement("p");
		message.textContent =
			score === this.pairCount
				? `🎉 Well done, all ${noun} are correct!`
				: `Some ${noun} do not match. Try again.`;
		output.append(message);
		if (score === this.pairCount)
			output.append(this.createOpenSolutionButton());
		else {
			const feedback =
				this.sourceFeedback?.cloneNode(true) ?? this.createGeneralFeedback();
			if (feedback) output.append(feedback);
		}
		return output;
	}
	/** Ignores successful source responses belonging to a disconnected question. */
	protected override async loadSrc(): Promise<void> {
		const version = ++this.sourceVersion;
		const data = await this.fetchSrc(this.src);
		if (this.isConnected && version === this.sourceVersion && data !== null)
			await this.onSrcReady(data);
	}
	/** Validates external content and constructs the same matching widget as inline markup. */
	protected override async onSrcReady(data: unknown): Promise<void> {
		let sourceDefinition = data;
		if (
			this.heading &&
			typeof data === "object" &&
			data !== null &&
			"form" in data &&
			Array.isArray(data.form) &&
			!("headers" in data)
		) {
			sourceDefinition = {
				...data,
				headers: data.form[0],
				form: data.form.slice(1),
			};
		}
		const parsed = sourceSchema.safeParse(sourceDefinition);
		if (!parsed.success) {
			this.showSrcError(
				`Invalid matching question: ${parsed.error.issues.map((issue) => issue.message).join(" ")}`,
			);
			return;
		}
		const target = this.formContent;
		if (!target) return;
		const { title, prompt, form, markup, feedback, solution, headers } =
			parsed.data;
		this.srcMarkup = this.normalizeSrcMarkup(markup ?? "markdown");
		if (title) this.updateSrcTitle(title, this.srcMarkup);
		this.updateSrcPrompt(prompt, this.srcMarkup);
		if (solution) this.updateSrcSolution(solution, this.srcMarkup);
		this.sourceFeedback = feedback
			? this.createSrcContentNode(feedback, this.srcMarkup)
			: null;
		this.hasSpecificFeedback = !!feedback;
		const widget = new TpMatching();
		widget.heading = this.heading;
		const definition = headers ? document.createElement("dl") : null;
		for (const [index, column] of form.entries()) {
			const list = document.createElement("ul");
			for (const content of column) {
				const item = document.createElement("li");
				item.append(this.createSrcContentNode(content, this.srcMarkup));
				list.append(item);
			}
			if (definition) {
				const term = document.createElement("dt");
				term.textContent = headers?.[index] ?? "";
				const description = document.createElement("dd");
				description.append(list);
				definition.append(term, description);
			} else widget.append(list);
		}
		if (definition) widget.append(definition);
		target.replaceChildren(widget);
		this.updateFeedbackPlaceholder();
		this.ensureSelectionHelp();
	}
}

if (!customElements.get("tp-matching-question"))
	customElements.define("tp-matching-question", TpMatchingQuestion);
declare global {
	interface HTMLElementTagNameMap {
		"tp-matching-question": TpMatchingQuestion;
	}
}
