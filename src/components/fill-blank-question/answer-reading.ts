import "../callout/callout.js";
import { labelMathSvg } from "../../utilities/math-accessibility.js";
import { isTpBlank } from "../blank/blank.js";
import { getBlankFields } from "../fill-blank/fields.js";

/** Live sentence reconstruction, independent of whether answers are typed or selected. */
export class AnswerReading {
	private readonly reading = document.createElement("div");
	private readonly callout = document.createElement("tp-callout");
	private readonly observer = new MutationObserver(() => this.updateReading());
	private readonly onEdit = (): void => this.updateReading();

	constructor(private readonly form: HTMLElement) {
		this.reading.setAttribute("role", "status");
		this.reading.setAttribute("data-tp-closed-reading", "");
		this.callout.setAttribute("variant", "neutral");
		this.callout.append(this.reading);
		const anchor = form.closest("[data-tp-closed-answers]") ?? form;
		anchor.after(this.callout);
		form.addEventListener("input", this.onEdit);
		form.addEventListener("change", this.onEdit);
		this.observer.observe(anchor, {
			subtree: true,
			childList: true,
			characterData: true,
			attributes: true,
			attributeFilter: ["data-tp-blank-result", "value"],
		});
		this.updateReading();
	}

	public destroy(): void {
		this.observer.disconnect();
		this.form.removeEventListener("input", this.onEdit);
		this.form.removeEventListener("change", this.onEdit);
		this.callout.remove();
	}

	/** Preserves rich formulas and images while removing field frames and controls. */
	private updateReading(): void {
		labelMathSvg(this.form.closest("[data-tp-closed-answers]") ?? this.form);
		const template = document.createElement("template");
		// Import into an inert document without reparsing nested answer paragraphs.
		const formCopy = template.content.ownerDocument.importNode(this.form, true);
		template.content.append(...formCopy.childNodes);
		const originals = getBlankFields(this.form);
		const copies = getBlankFields(template.content);
		for (const [index, copy] of copies.entries()) {
			const field = originals[index];
			const destination =
				copy.closest(
					"tp-textfield, tp-numberfield, tp-datefield, tp-timefield",
				) ?? copy;
			if (!field?.value) {
				destination.replaceWith(document.createTextNode("…"));
			} else {
				const answer = document.createElement("span");
				answer.className = "tp-ivory";
				answer.setAttribute("data-tp-reading-answer", "");
				const result = field?.getAttribute("data-tp-blank-result");
				if (result) answer.setAttribute("data-tp-reading-result", result);
				if (isTpBlank(field) && field.effectiveClosed) {
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
					answer.append(content);
				} else {
					answer.textContent = field.value;
				}
				destination.replaceWith(answer);
			}
		}
		this.normalizeReadingMath(template.content);
		this.reading.replaceChildren(template.content);
	}

	/** Keeps only the visual SVG and its accessible label, not MathJax rerendering sources. */
	private normalizeReadingMath(content: DocumentFragment): void {
		preserveRenderedMath(content);
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
}

/** Freezes rendered tp-math copies whose inline source lives only in the original instance. */
export function preserveRenderedMath(content: DocumentFragment): void {
	for (const formula of content.querySelectorAll("tp-math")) {
		const output = formula.querySelector<HTMLElement>(
			":scope > [data-tp-math-output]",
		);
		if (!output?.querySelector("svg")) continue;
		if (formula.hasAttribute("displaystyle")) output.style.display = "block";
		formula.replaceWith(output);
	}
}
