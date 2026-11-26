import { navigateDocumentAnchor } from "../../utilities/document-history.js";
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-biblio
 * @summary Defines a hidden bibliography entry for reference tooltips and generated lists.
 */
/**
 * @tp-dependency tp-glossary
 * @summary Defines a hidden glossary entry for reference tooltips and generated lists.
 */
/**
 * @tp-dependency tp-index
 * @summary Defines an alphabetical index entry with optional descriptive content and links to its occurrences.
 */
/**
 * @tp-dependency tp-note
 * @summary Defines a hidden HTML note for reference tooltips and generated lists.
 */
// tp-docgen:dependencies:end

import "../note/note.js";
import "../biblio/biblio.js";
import "../glossary/glossary.js";
import "../index/index.js";
import { indexList, indexName } from "../../utilities/index-references.js";
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
 * The custom `<tp-listof>` element builds a list of reference entries or links to labelled document elements.
 *
 * @summary Builds a list of reference entries or links to labelled document elements.
 * @tagname tp-listof
 * @attr {string} selector = "" - CSS selector for reference definitions or elements with a title, label or caption.
 * @attr {string} index = "default" - Selects the named index when listing tp-index entries.
 * @attr {boolean} intoc = false - Includes the index heading in the table of contents when exporting to native LaTeX.
 * @attr {string} title = "" - Index heading; defaults to Index for tp-index lists.
 * @keyboard {Enter} Follows the focused list link.
 *  @accessibility Renders notes as a native ordered list, bibliography and glossary entries as description lists, and other matched elements as labelled anchor links in an unordered list.
 * @accessibility Generated links retain native keyboard activation; an empty generated list is hidden.
 * @accessibilityresponsibility Choose a selector that identifies meaningful targets and supply descriptive target labels. Ensure copied definition content, links and media are accessible in the generated list.
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
		return ["selector", "index", "title"];
	}
	public get index(): string {
		return this.getAttribute("index") || "default";
	}
	public set index(value: string) {
		this.setAttribute("index", value);
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
			.filter(
				(e) =>
					e.label &&
					(e.element.localName !== "tp-index" ||
						indexName(e.element) === indexName(this)),
			)
			.map((e) => ({
				...e,
				id: referenceId(e.element),
				definition: e.element.matches(
					"tp-note, tp-biblio, tp-glossary, tp-index",
				),
			}));
		const numbers = noteNumbers(referenceScope(this));
		const indexReferences = referenceElements(
			referenceScope(this),
			'tp-ref[href^="!"]',
		).filter((e) => !e.closest("tp-index,tp-note,tp-biblio,tp-glossary"));
		const signature = JSON.stringify([
			this.getAttribute("title"),
			this.getAttribute("index"),
			indexReferences.map((e) => [
				referenceId(e),
				e.getAttribute("href"),
				indexName(e),
			]),
			entries.map((e) => [
				e.id,
				e.element.localName,
				e.element.getAttribute("ref"),
				numbers.get(e.element.getAttribute("ref") ?? ""),
				e.label,
				e.definition ? e.element.innerHTML : "",
				["label", "sort-key", "parent", "index", "see", "see-also"].map(
					(name) => e.element.getAttribute(name),
				),
			]),
		]);
		if (signature === this.signature) return;
		this.signature = signature;
		const groups: HTMLElement[] = [];
		const indexes = entries.filter((e) => e.element.localName === "tp-index");
		if (indexes.length || this.selector.trim() === "tp-index") {
			const heading = document.createElement("h2");
			heading.textContent = this.getAttribute("title") || "Index";
			groups.push(
				heading,
				indexList(
					indexes.map((e) => e.element),
					indexReferences,
					this,
				),
			);
		}
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
				item.dataset.tpNoteRef = entry.element.getAttribute("ref") ?? "";
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
				(kind === "biblio" ? entry.element.getAttribute("label") : null) ||
				entry.element.getAttribute("ref") ||
				entry.label;
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
					navigateDocumentAnchor(
						entry.element,
						link.getAttribute("href") ?? "",
					);
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
