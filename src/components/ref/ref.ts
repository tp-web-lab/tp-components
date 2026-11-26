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
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-equanum
 * @summary Associates an equation with its number and reference previews.
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
/**
 * @tp-dependency tp-tooltip
 * @summary Tooltip component.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import { TpButton } from "../button/button.js";
import { TpTooltip } from "../tooltip/tooltip.js";
import "../tooltip/tooltip.js";
import "../note/note.js";
import "../biblio/biblio.js";
import "../glossary/glossary.js";
import "../index/index.js";
import "../equanum/equanum.js";
import {
	noteNumbers,
	observeReferences,
	referenceContent,
	referenceElements,
	referenceId,
	referenceScope,
} from "../../utilities/references.js";
import style from "./ref.css?inline";
/**
 * The custom `<tp-ref>` element displays an inline reference with the corresponding HTML content in a tooltip.
 *
 * @summary Displays an inline reference with the corresponding HTML content in a tooltip.
 * @tagname tp-ref
 * @attr {string} href = "" - Prefixed identifier selecting a note, bibliography, glossary, index or equation entry.
 * @attr {string} label = "" - Optional displayed reference label; otherwise inferred from the target.
 * @attr {boolean} silent = false - Marks an occurrence without visible content or a keyboard stop.
 * @attr {string} index = "default" - Index name for an exclamation-prefixed reference.
 * @keyboard {Enter / Space} Shows the reference tooltip.
 * @keyboard {Escape} Closes the reference tooltip.
 *  @accessibility Uses a native button supplied by tp-button for the citation; the anchored tp-tooltip supports hover, keyboard focus and activation, and Escape dismissal.
 * @accessibility Disables unresolved citations and keeps note numbering synchronized with citation order.
 * @accessibilityresponsibility Use meaningful bibliography and glossary identifiers and accessible referenced content. Put essential or interactive material in a persistent tp-listof rather than relying solely on a tooltip.
 * @example
 * <div data-tp-reference-scope="">
 *   <p>A useful detail <tp-ref href="^detail"></tp-ref>.</p>
 *   <tp-note ref="detail" title="Detail"><p>A note with <strong>formatted content</strong>.</p></tp-note>
 * </div>
 */
export class TpRef extends TpBase {
	private link: TpButton | null = null;
	private labelElement: HTMLSpanElement | null = null;
	private tooltip: TpTooltip | null = null;
	private unsubscribe: (() => void) | null = null;
	private original: Node[] | null = null;
	private content = "";
	public static get observedAttributes(): string[] {
		return ["href", "silent", "index", "label"];
	}
	public get silent(): boolean {
		return this.hasAttribute("silent");
	}
	public set silent(value: boolean) {
		this.toggleAttribute("silent", Boolean(value));
	}
	public get index(): string {
		return this.getAttribute("index") || "default";
	}
	public set index(value: string) {
		this.setAttribute("index", value);
	}
	public get label(): string {
		return this.getAttribute("label") ?? "";
	}
	public set label(value: string) {
		this.setAttribute("label", value);
	}
	public get href(): string {
		return this.getAttribute("href") ?? "";
	}
	public set href(value: string) {
		this.setAttribute("href", value);
	}
	protected override connectedCallback(): void {
		if (!this.isConnected) return;
		super.connectedCallback();
		this.ensureGlobalStyle("tp-ref-styles", style);
		// A preview may contain another reference; never recursively create tooltips.
		if (this.closest("tp-tooltip, tp-note, tp-biblio, tp-glossary, tp-index"))
			return;
		if (!this.original) {
			this.original = Array.from(this.childNodes);
			const source = document.createElement("template");
			source.dataset.tpReferenceSource = "";
			source.content.append(...this.original);
			this.append(source);
		}
		referenceId(this);
		if (!this.link) {
			this.link = new TpButton();
			this.labelElement = document.createElement("span");
			this.link.append(this.labelElement);
			this.link.type = "button";
			this.link.addEventListener("click", () => {
				if (
					!this.hasAttribute("silent") &&
					!this.link?.disabled &&
					this.content.trim()
				)
					this.tooltip?.show();
			});
			this.link.dataset.tpReferenceOutput = "";
			referenceId(this.link);
			this.append(this.link);
			this.tooltip = new TpTooltip();
			this.tooltip.dataset.tpReferenceOutput = "";
			this.tooltip.classList.add("tp-ref-tooltip");
			this.tooltip.tabIndex = 0;
			this.append(this.tooltip);
		}
		// TpButton creates its native control in a microtask. Bind once it exists.
		queueMicrotask(() => {
			if (this.isConnected && this.link && this.content.trim() && !this.silent)
				this.tooltip?.setAttribute("anchor", `#${this.link.id} > button`);
		});
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
		if (!this.link || !this.labelElement || !this.tooltip) return;
		if (this.silent) {
			this.link.hidden = true;
			this.tooltip.hide();
			if (this.labelElement.hasChildNodes())
				this.labelElement.replaceChildren();
			if (this.tooltip.hasChildNodes()) this.tooltip.replaceChildren();
			this.content = "";
			return;
		}
		const tag = (
			{
				"^": "tp-note",
				"@": "tp-biblio",
				"%": "tp-glossary",
				"!": "tp-index",
				"=": "tp-equanum",
			} as Record<string, string>
		)[this.href[0] ?? ""];
		const id = this.href.slice(1);
		const target =
			tag && id
				? referenceElements(referenceScope(this), tag).find(
						(e) =>
							e.getAttribute("ref") === id &&
							(tag !== "tp-index" ||
								(e.getAttribute("index") || "default") ===
									(this.getAttribute("index") || "default")),
					)
				: undefined;
		for (const node of this.original ?? [])
			if (node.parentNode === this || node.parentNode === this.link)
				node.parentNode.removeChild(node);
		const silent = this.hasAttribute("silent");
		this.link.hidden = silent;
		if (silent) this.tooltip.hide();
		const index = this.href.startsWith("!");
		const note = this.href.startsWith("^");
		const equation = this.href.startsWith("=");
		const text =
			this.getAttribute("label") ??
			(note
				? `[${noteNumbers(referenceScope(this)).get(id) ?? "?"}]`
				: this.href.startsWith("@")
					? target?.getAttribute("label") || `[${id}]`
					: equation
						? `(${target?.getAttribute("number") || "?"})`
						: index
							? target?.getAttribute("title") || id || "?"
							: id || "?");
		if (
			!this.hasAttribute("label") &&
			index &&
			this.original?.some((node) => node.textContent?.trim())
		) {
			const content = this.original.map((node) => node.cloneNode(true));
			const template = document.createElement("div");
			template.append(...content);
			if (this.labelElement.innerHTML !== template.innerHTML)
				this.labelElement.replaceChildren(...template.childNodes);
		} else if (
			this.labelElement.textContent !== text ||
			Boolean(this.labelElement.querySelector("sup")) !== note
		) {
			if (note) {
				const sup = document.createElement("sup");
				sup.textContent = text;
				this.labelElement.replaceChildren(sup);
			} else this.labelElement.textContent = text;
		}

		this.link.disabled = !target;
		if (!target) this.tooltip.hide();

		const content = target
			? referenceContent(target)
			: document.createDocumentFragment();
		// Nested references remain readable without creating recursive tooltips.
		for (const nested of content.querySelectorAll("tp-ref")) {
			const label = nested.hasAttribute("silent")
				? ""
				: nested.getAttribute("label") ||
					nested.textContent?.trim() ||
					nested.getAttribute("href")?.slice(1) ||
					"";
			nested.replaceWith(document.createTextNode(label));
		}
		const serialized = document.createElement("div");
		serialized.append(content);
		const signature = serialized.innerHTML;
		if (signature !== this.content) {
			this.content = signature;
			this.tooltip.replaceChildren(...serialized.childNodes);
		}
		if (this.content.trim() && !silent)
			this.tooltip.setAttribute("anchor", `#${this.link.id} > button`);
		else {
			this.tooltip.removeAttribute("anchor");
			this.tooltip.hide();
		}
	}
}
if (!customElements.get("tp-ref")) customElements.define("tp-ref", TpRef);
declare global {
	interface HTMLElementTagNameMap {
		"tp-ref": TpRef;
	}
}
