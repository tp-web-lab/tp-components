// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-biblio
 * @summary Defines a bibliography entry referenced by tp-ref.
 */
/**
 * @tp-dependency tp-glossary
 * @summary Defines a glossary entry referenced by tp-ref.
 */
/**
 * @tp-dependency tp-note
 * @summary Defines an HTML note referenced by tp-ref.
 */
// tp-docgen:dependencies:end

import "../note/note.js";
import "../biblio/biblio.js";
import "../glossary/glossary.js";
import {
	noteNumbers,
	observeReferences,
	referenceContent,
	referenceElements,
	referenceId,
	referenceLabel,
	referenceScope,
} from "../../utilities/references.js";
import { TpBase } from "../base/base.js";
import style from "./listof.css?inline";
/**
 * @summary Collects reference content or links to labelled elements matching a CSS selector.
 * @tagname tp-listof
 * @attr {string} selector = "" - CSS selector for reference definitions or elements with a title, label or caption.
 * @keyboard {Enter} Follows the focused list link.
 * @example
 * <div data-tp-reference-scope="">
 *   <tp-listof selector="figure"></tp-listof>
 *   <figure><p>A diagram of the water cycle.</p><figcaption>The water cycle</figcaption></figure>
 *   <figure><p>A diagram of a food chain.</p><figcaption>A food chain</figcaption></figure>
 * </div>
 */
export class TpListof extends TpBase {
	private unsubscribe: (() => void) | null = null;
	private output: HTMLDivElement | null = null;
	private signature = "";
	public static get observedAttributes(): string[] {
		return ["selector"];
	}
	public get selector(): string {
		return this.getAttribute("selector") ?? "";
	}
	public set selector(value: string) {
		this.setAttribute("selector", value);
	}
	protected override connectedCallback(): void {
		if (!this.isConnected) return;
		super.connectedCallback();
		this.ensureGlobalStyle("tp-listof-styles", style);
		if (this.closest("[data-tp-reference-output], tp-tooltip")) return;
		if (!this.output) {
			this.output = document.createElement("div");
			this.output.dataset.tpReferenceOutput = "";
			this.replaceChildren(this.output);
		}
		this.unsubscribe?.();
		this.refresh();
		this.unsubscribe = observeReferences(this, () => this.refresh());
	}
	public disconnectedCallback(): void {
		this.unsubscribe?.();
		this.unsubscribe = null;
	}
	protected override attributeChangedCallback(): void {
		if (this.isConnected) this.refresh();
	}
	private refresh(): void {
		if (!this.output) return;
		let targets: Element[] = [];
		let invalid = false;
		try {
			if (this.selector.trim())
				targets = referenceElements(referenceScope(this), this.selector);
		} catch {
			invalid = true;
		}
		if (this.hasAttribute("data-invalid-selector") !== invalid)
			this.toggleAttribute("data-invalid-selector", invalid);
		const entries = targets
			.filter(
				(e) =>
					e !== this && !e.contains(this) && !e.matches("tp-listof, tp-ref"),
			)
			.map((element) => ({ element, label: referenceLabel(element) }))
			.filter((e) => e.label)
			.map((e) => ({
				...e,
				id: referenceId(e.element),
				definition: e.element.matches("tp-note, tp-biblio, tp-glossary"),
			}));
		const numbers = noteNumbers(referenceScope(this));
		const signature = JSON.stringify(
			entries.map((e) => [
				e.id,
				e.element.localName,
				e.element.getAttribute("ref"),
				numbers.get(e.element.getAttribute("ref") ?? ""),
				e.label,
				e.definition ? e.element.innerHTML : "",
			]),
		);
		if (signature === this.signature) return;
		this.signature = signature;
		const groups: HTMLElement[] = [];
		const notes = entries.filter((e) => e.element.localName === "tp-note");
		if (notes.length) {
			notes.sort(
				(a, b) =>
					(numbers.get(a.element.getAttribute("ref") ?? "") ?? Infinity) -
					(numbers.get(b.element.getAttribute("ref") ?? "") ?? Infinity),
			);
			const list = document.createElement("ol");
			list.className = "tp-listof-notes";
			for (const entry of notes) {
				const item = document.createElement("li");
				const number = numbers.get(entry.element.getAttribute("ref") ?? "");
				if (number !== undefined) item.value = number;
				item.append(referenceContent(entry.element));
				list.append(item);
			}
			groups.push(list);
		}
		const collator = new Intl.Collator(
			this.closest("[lang]")?.getAttribute("lang") || undefined,
			{ sensitivity: "base", numeric: true },
		);
		for (const kind of ["biblio", "glossary"]) {
			const definitions = entries.filter(
				(e) => e.element.localName === `tp-${kind}`,
			);
			const term = (entry: (typeof entries)[number]) =>
				entry.element.getAttribute("ref") || entry.label;
			definitions.sort((a, b) => collator.compare(term(a), term(b)));
			if (!definitions.length) continue;
			const list = document.createElement("dl");
			list.className = `tp-listof-${kind}`;
			for (const entry of definitions) {
				const dt = document.createElement("dt");
				dt.textContent = term(entry);
				const dd = document.createElement("dd");
				dd.append(referenceContent(entry.element));
				list.append(dt, dd);
			}
			groups.push(list);
		}
		const others = entries.filter((e) => !e.definition);
		if (others.length) {
			const list = document.createElement("ul");
			for (const entry of others) {
				const item = document.createElement("li");
				const link = document.createElement("a");
				const hash = this.ownerDocument.defaultView?.location.hash ?? "";
				const route = hash.startsWith("#/")
					? hash.split("#").slice(0, 2).join("#")
					: "";
				link.href = `${route}#${encodeURIComponent(entry.id)}`;
				link.addEventListener("click", (event) => {
					if (
						event.button ||
						event.ctrlKey ||
						event.metaKey ||
						event.shiftKey ||
						event.altKey
					)
						return;
					event.preventDefault();
					const view = this.ownerDocument.defaultView;
					if (view) view.location.hash = link.getAttribute("href") ?? "";
					entry.element.scrollIntoView?.({ block: "start" });
				});
				link.textContent = entry.label;
				item.append(link);
				list.append(item);
			}
			groups.push(list);
		}
		this.output.replaceChildren(...groups);
		this.output.hidden = groups.length === 0;
	}
}
if (!customElements.get("tp-listof"))
	customElements.define("tp-listof", TpListof);
declare global {
	interface HTMLElementTagNameMap {
		"tp-listof": TpListof;
	}
}
