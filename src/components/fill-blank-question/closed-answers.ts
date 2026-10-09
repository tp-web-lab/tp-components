import "../button/button.js";
import { labelMathSvg } from "../../utilities/math-accessibility.js";
import "../button-group/button-group.js";
import "../callout/callout.js";
import "../sidebar/sidebar.js";
import "../dragdrop/dragdrop.js";
import "../divider/divider.js";
import { isTpBlank, type TpBlank } from "../blank/blank.js";
import type { TpDragDropDropDetail } from "../dragdrop/dragdrop.js";
import type { TpTextfield } from "../textfield/textfield.js";

/** Text-entry and rich-content destinations share the assignment contract. */
type ClosedField = TpTextfield | TpBlank;

/** One independently assignable answer, including repeated answer strings. */
interface Choice {
	text: string;
	button: HTMLElement;
	field: ClosedField | null;
	/** Original one-based position, unaffected by shuffling. */
	rank: string;
	/** Author content for rich blank destinations. */
	content: Node;
}

/** Manages a shuffled answer bank without changing question scoring. */
export class ClosedAnswers {
	/** Unique DOM root identifiers keep simultaneous questions isolated. */
	private static nextId = 0;
	/** Responsive layout containing the original blanks and their answer bank. */
	private readonly layout = document.createElement("tp-sidebar");
	/** Root for drag events and announcements, outside the two-column layout. */
	private readonly container = document.createElement("div");
	/** Existing drag-and-drop controller, including its keyboard workflow. */
	private readonly dragdrop = document.createElement("tp-dragdrop");
	/** Original author readonly settings, restored when leaving closed mode. */
	private readonly fields = new Map<ClosedField, boolean>();
	/** Answer identities are independent of their shuffled display positions. */
	private readonly choices: Choice[] = [];
	/** Current click/touch selection. */
	private selected: Choice | null = null;
	/** Blank retained while keyboard focus is in the answer bank. */
	private targetField: ClosedField | null = null;
	/** Readable author sentences with answers in place of interactive fields. */
	private readonly reading = document.createElement("div");
	/** Neutral presentation for the continuously reconstructed sentence. */
	private readonly readingCallout = document.createElement("tp-callout");
	/** Refreshes the reading when asynchronous math or icon rendering completes. */
	private readonly readingObserver = new MutationObserver(() =>
		this.updateReading(),
	);
	/** Persistent usage help beneath the feedback output. */
	private readonly instructions = document.createElement("tp-callout");

	/** Mounts the bank next to the existing form after its fields have upgraded. */
	constructor(
		private readonly form: HTMLElement,
		answers: string[],
		feedbackOutput: HTMLElement | null,
		contents: Node[] = [],
	) {
		this.container.id = `tp-closed-answers-${ClosedAnswers.nextId++}`;
		this.layout.setAttribute("right-sidebar", "");
		this.layout.setAttribute("side-width", "10rem");
		this.container.setAttribute("data-tp-closed-answers", "");
		const bank = document.createElement("div");
		bank.setAttribute("data-tp-closed-bank", "");
		const divider = document.createElement("tp-divider");
		divider.setAttribute("orientation", "vertical");
		const answerColumn = document.createElement("div");
		const heading = document.createElement("span");
		heading.setAttribute("data-tp-closed-answers-heading", "");
		heading.textContent = "Answers";
		this.instructions.setAttribute("variant", "info");
		this.instructions.setAttribute("heading", "Interactions");
		this.instructions.setAttribute("closable", "");
		this.instructions.setAttribute("data-tp-closed-instructions", "");
		this.instructions.innerHTML = `<dl>
			<dt>Mouse</dt>
			<dd>Drag an answer to a blank, or select an answer then click a blank.</dd>
			<dt>Keyboard</dt>
			<dd>Tab to a blank, then press Right Arrow to reach the answers: the starting blank stays highlighted. Use Up/Down to choose an answer, then Enter or Space to fill the highlighted blank directly. Escape cancels and returns to that blank. Delete or Backspace clears a focused blank.</dd>
		</dl>`;
		feedbackOutput?.after(this.instructions);
		this.reading.setAttribute("role", "status");
		this.reading.setAttribute("data-tp-closed-reading", "");
		this.readingCallout.setAttribute("variant", "neutral");
		this.readingCallout.append(this.reading);
		const buttons = document.createElement("tp-button-group");
		buttons.setAttribute("orientation", "vertical");
		buttons.style.setProperty("--tp-button-group-gap", "0.25rem");
		buttons.setAttribute("aria-label", "Available answers");
		const shuffled = answers.map((text, index) => ({
			text,
			rank: String(index + 1),
			content: contents[index] ?? document.createTextNode(text),
		}));
		for (let index = shuffled.length - 1; index > 0; index -= 1) {
			const other = Math.floor(Math.random() * (index + 1));
			const value = shuffled[index];
			const replacement = shuffled[other];
			if (value && replacement) {
				shuffled[index] = replacement;
				shuffled[other] = value;
			}
		}
		for (const { text, rank, content } of shuffled) {
			const button = document.createElement("tp-button");
			button.setAttribute("size", "s");
			button.setAttribute("data-tp-closed-item", "");
			const label =
				text ||
				(content instanceof DocumentFragment
					? content
							.querySelector("[aria-label], img")
							?.getAttribute("aria-label") ||
						content.querySelector("img")?.getAttribute("alt")
					: "") ||
				"Answer option";
			button.setAttribute("aria-label", label);
			const control = document.createElement("button");
			control.type = "button";
			control.tabIndex = 0;
			control.setAttribute("aria-label", label);
			control.append(content.cloneNode(true));
			button.append(control);
			buttons.append(button);
			this.choices.push({ text: label, button, field: null, rank, content });
		}
		for (const field of form.querySelectorAll<ClosedField>(
			"tp-textfield, tp-blank",
		)) {
			this.fields.set(field, field.readOnly);
			field.readOnly = true;
			field.value = "";
			field.setAttribute("data-tp-closed-item", "");
		}
		answerColumn.append(heading, buttons);
		bank.append(divider, answerColumn);
		form.before(this.container);
		this.container.append(this.layout, this.readingCallout);
		this.layout.append(form, bank);
		this.container.addEventListener("click", this.onClick);
		this.container.addEventListener("input", this.onFieldInput);
		this.container.addEventListener("keydown", this.onKeyDown, true);
		this.dragdrop.setAttribute("root", `#${this.container.id}`);
		this.dragdrop.setAttribute("items", "[data-tp-closed-item]");
		this.dragdrop.setAttribute(
			"handle",
			"tp-button, tp-textfield, tp-blank, button, input, textarea",
		);
		this.dragdrop.addEventListener("tp-dragdrop-drop", this.onDrop);
		this.container.append(this.dragdrop);
		for (const choice of this.choices) choice.button.tabIndex = -1;
		this.updateReading();
		this.readingObserver.observe(this.form, {
			subtree: true,
			childList: true,
			characterData: true,
		});
		this.readingObserver.observe(bank, { subtree: true, childList: true });
	}

	/** Restores the author form and removes all listeners and generated controls. */
	public destroy(): void {
		this.readingObserver.disconnect();
		this.setTargetField(null);
		this.instructions.remove();
		this.dragdrop.remove();
		this.dragdrop.removeEventListener("tp-dragdrop-drop", this.onDrop);
		this.container.removeEventListener("click", this.onClick);
		this.container.removeEventListener("input", this.onFieldInput);
		this.container.removeEventListener("keydown", this.onKeyDown, true);
		for (const [field, readOnly] of this.fields) {
			field.readOnly = readOnly;
			field.removeAttribute("data-tp-closed-item");
			field.removeAttribute("draggable");
		}
		this.container.before(this.form);
		this.container.remove();
	}

	/** Selects an answer, or assigns the selected answer to a clicked blank. */
	private readonly onClick = (event: Event): void => {
		if (!(event.target instanceof Element)) return;
		const item = event.target.closest("[data-tp-closed-item]");
		const choice = this.choices.find((entry) => entry.button === item);
		if (choice) {
			this.selected = choice;
		} else if (item && this.fields.has(item as ClosedField) && this.selected) {
			this.assign(this.selected, item as ClosedField);
			this.selected = null;
		}
	};

	/** Routes keyboard assignment between answers and blanks, not unrelated bank items. */
	private readonly onKeyDown = (event: KeyboardEvent): void => {
		if (!(event.target instanceof Element)) return;
		if (event.target.closest("[data-tp-blank-clear]")) {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				event.stopPropagation();
				const blank = event.target.closest("tp-blank");
				if (blank && isTpBlank(blank)) {
					blank.clear();
					blank.focus();
				}
			}
			return;
		}
		if (!event.target.closest("[data-tp-closed-item]")) return;
		const keys = [
			"Enter",
			" ",
			"Escape",
			"ArrowUp",
			"ArrowDown",
			"ArrowLeft",
			"ArrowRight",
			"Delete",
			"Backspace",
		];
		if (!keys.includes(event.key)) return;
		// The generic controller still handles pointer drag; keyboard targets here
		// are specifically blanks, rather than every draggable answer and field.
		event.stopPropagation();
		const item = event.target.closest("[data-tp-closed-item]");
		const field = event.target.closest<ClosedField>("tp-textfield, tp-blank");
		if (event.key === "Escape") {
			event.preventDefault();
			if (this.targetField) this.focusField(this.targetField);
			else
				this.selected?.button
					.querySelector<HTMLButtonElement>("button")
					?.focus();
			this.setTargetField(null);
			this.selected = null;
			return;
		}
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			const choice = this.choices.find((entry) => entry.button === item);
			if (choice) {
				if (this.targetField) {
					const target = this.targetField;
					this.assign(choice, target);
					this.setTargetField(null);
					this.selected = null;
					this.focusField(target);
					return;
				}
				this.selected = choice;
				const available = [...this.fields.keys()].filter(
					(entry) => !entry.disabled,
				);
				const target =
					available.find((entry) => entry.value === "") ?? available[0];
				if (target) this.focusField(target);
			} else if (field && this.selected) {
				this.assign(this.selected, field);
				this.selected = null;
			}
			return;
		}
		if (event.key.startsWith("Arrow")) {
			if (!this.selected) {
				const choiceIndex = this.choices.findIndex(
					(entry) => entry.button === item,
				);
				if (field && event.key === "ArrowRight") {
					event.preventDefault();
					if (field.disabled || this.choices.length === 0) return;
					this.setTargetField(field);
					this.choices[0]?.button
						.querySelector<HTMLButtonElement>("button")
						?.focus();
				} else if (
					choiceIndex >= 0 &&
					["ArrowUp", "ArrowDown"].includes(event.key)
				) {
					event.preventDefault();
					const offset = event.key === "ArrowDown" ? 1 : -1;
					const choice =
						this.choices[
							(choiceIndex + offset + this.choices.length) % this.choices.length
						];
					choice?.button.querySelector<HTMLButtonElement>("button")?.focus();
				}
				return;
			}
			event.preventDefault();
			const available = [...this.fields.keys()].filter(
				(entry) => !entry.disabled,
			);
			if (available.length === 0) return;
			const index = field ? available.indexOf(field) : -1;
			const offset = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
			const target =
				available[(index + offset + available.length) % available.length];
			if (target) this.focusField(target);
			return;
		}
		if (!field || !this.fields.has(field) || field.disabled) return;
		event.preventDefault();
		const choice = this.choices.find((entry) => entry.field === field);
		if (choice) choice.field = null;
		this.updateAssignedChoices();
		this.write(field, "");
	};

	/** Releases the assigned token when a rich blank is cleared through its own control. */
	private readonly onFieldInput = (event: Event): void => {
		this.updateReading();
		const field = event.target;
		if (!(field instanceof Element) || !isTpBlank(field) || field.value !== "")
			return;
		const choice = this.choices.find((entry) => entry.field === field);
		if (choice) {
			choice.field = null;
			this.updateAssignedChoices();
		}
	};

	/** Focuses a rich blank itself, or the native control of a text field. */
	private focusField(field: ClosedField): void {
		if (isTpBlank(field)) field.focus();
		else field.querySelector<HTMLElement>("input, textarea")?.focus();
	}

	/** Keeps exactly one destination visibly marked while browsing answers. */
	private setTargetField(field: ClosedField | null): void {
		this.targetField?.removeAttribute("data-tp-closed-target");
		this.targetField = field;
		field?.setAttribute("data-tp-closed-target", "");
	}

	/** Handles both pointer drops and the keyboard events emitted by tp-dragdrop. */
	private readonly onDrop = (event: Event): void => {
		const { source, target } = (event as CustomEvent<TpDragDropDropDetail>)
			.detail;
		const choice = this.choices.find(
			(entry) => entry.button === source || entry.field === source,
		);
		if (choice && target && this.fields.has(target as ClosedField)) {
			this.assign(choice, target as ClosedField);
		}
		this.selected = null;
	};

	/** Moves an answer identity, returning any displaced answer to the bank. */
	private assign(choice: Choice, field: ClosedField): void {
		if (!this.fields.has(field) || field.disabled) return;
		const previous = this.choices.find((entry) => entry.field === field);
		if (previous) previous.field = null;
		if (choice.field && choice.field !== field) this.write(choice.field, "");
		choice.field = field;
		this.updateAssignedChoices();
		if (isTpBlank(field)) {
			const content = document.createDocumentFragment();
			const control =
				choice.button.querySelector("[data-tp-button-content]") ??
				choice.button.querySelector("button");
			if (control) {
				for (const node of control.childNodes)
					content.append(node.cloneNode(true));
			} else content.append(choice.content.cloneNode(true));
			this.preserveRenderedMath(content);
			field.setAnswer(choice.rank, content);
		} else this.write(field, choice.text);
		this.updateReading();
	}

	/** Preserves rich formulas and images while removing field frames and controls. */
	private updateReading(): void {
		labelMathSvg(this.layout);
		const template = document.createElement("template");
		// Import into an inert document without reparsing nested answer paragraphs.
		const formCopy = template.content.ownerDocument.importNode(this.form, true);
		template.content.append(...formCopy.childNodes);
		const originals = [...this.fields.keys()];
		const copies = template.content.querySelectorAll("tp-textfield, tp-blank");
		for (const [index, copy] of copies.entries()) {
			const field = originals[index];
			if (!field?.value) {
				copy.replaceWith(document.createTextNode("…"));
			} else if (isTpBlank(field)) {
				const content = document.createDocumentFragment();
				for (const node of field.childNodes) {
					if (
						node instanceof Element &&
						node.hasAttribute("data-tp-blank-tools")
					)
						continue;
					content.append(node.cloneNode(true));
				}
				for (const paragraph of content.querySelectorAll("p"))
					paragraph.replaceWith(...paragraph.childNodes);
				copy.replaceWith(content);
			} else {
				copy.replaceWith(document.createTextNode(field.value));
			}
		}
		this.normalizeReadingMath(template.content);
		this.reading.replaceChildren(template.content);
	}

	/** Freezes rendered tp-math copies whose inline source lives only in the original instance. */
	private preserveRenderedMath(content: DocumentFragment): void {
		for (const formula of content.querySelectorAll("tp-math")) {
			const output = formula.querySelector<HTMLElement>(
				":scope > [data-tp-math-output]",
			);
			if (!output?.querySelector("svg")) continue;
			if (formula.hasAttribute("displaystyle")) output.style.display = "block";
			formula.replaceWith(output);
		}
	}

	/** Keeps only the visual SVG and its accessible label, not MathJax rerendering sources. */
	private normalizeReadingMath(content: DocumentFragment): void {
		this.preserveRenderedMath(content);
		for (const formula of content.querySelectorAll(
			"mjx-container, .MathJax_SVG",
		)) {
			const graphics = formula.querySelectorAll(":scope > svg");
			if (graphics.length === 0) continue;
			const replacement = document.createElement("span");
			replacement.setAttribute("data-tp-reading-math", "");
			const label =
				formula.getAttribute("aria-label") ||
				formula.getAttribute("data-semantic-speech-none") ||
				formula.querySelector("svg[aria-label]")?.getAttribute("aria-label") ||
				formula.querySelector("math")?.textContent ||
				"Mathematical expression";
			replacement.setAttribute("role", "img");
			replacement.setAttribute("aria-label", label);
			for (const graphic of graphics)
				graphic.setAttribute("aria-hidden", "true");
			replacement.append(...graphics);
			formula.replaceWith(replacement);
		}
		for (const source of content.querySelectorAll(
			'.MathJax_Preview, script[type^="math/"], mjx-assistive-mml, .MJX_Assistive_MathML',
		))
			source.remove();
	}

	/** Marks assigned cities visually and describes their destination to assistive tools. */
	private updateAssignedChoices(): void {
		for (const choice of this.choices) {
			choice.button.toggleAttribute(
				"data-tp-closed-assigned",
				choice.field !== null,
			);
			const control = choice.button.querySelector("button");
			if (choice.field) {
				control?.setAttribute(
					"aria-description",
					`Assigned to ${choice.field.getAttribute("aria-label") ?? choice.field.name}. Can be reassigned.`,
				);
			} else {
				control?.removeAttribute("aria-description");
			}
		}
	}

	/** Updates the library field and notifies the existing form/feedback machinery. */
	private write(field: ClosedField, value: string): void {
		field.value = value;
		if (isTpBlank(field)) {
			field.dispatchEvent(new Event("input", { bubbles: true }));
			return;
		}
		field
			.querySelector("input, textarea")
			?.dispatchEvent(new Event("input", { bubbles: true }));
	}
}
