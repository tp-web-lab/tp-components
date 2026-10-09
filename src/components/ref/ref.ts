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
/**
 * @tp-dependency tp-tooltip
 * @summary Displays anchored tooltip content.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import { TpTooltip } from "../tooltip/tooltip.js";
import "../tooltip/tooltip.js";
import "../note/note.js";
import "../biblio/biblio.js";
import "../glossary/glossary.js";
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
 * @summary Displays inline references to notes, bibliography and glossary entries with HTML tooltips.
 * @tagname tp-ref
 * @attr {string} href = "" - Prefixed identifier selecting a note, bibliography or glossary entry.
 * @keyboard {Enter / Space} Shows the reference tooltip.
 * @keyboard {Escape} Closes the reference tooltip.
 * @example
 * <div data-tp-reference-scope="">
 *   <p>A useful detail <tp-ref href="^detail"></tp-ref>.</p>
 *   <tp-note ref="detail" title="Detail"><p>A note with <strong>formatted content</strong>.</p></tp-note>
 * </div>
 */
export class TpRef extends TpBase {
	private link: HTMLButtonElement | null = null;
	private tooltip: TpTooltip | null = null;
	private unsubscribe: (() => void) | null = null;
	private original: Node[] | null = null;
	private content = "";
	public static get observedAttributes(): string[] {
		return ["href"];
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
		if (this.closest("tp-tooltip, tp-note, tp-biblio, tp-glossary")) return;
		if (!this.original) this.original = Array.from(this.childNodes);
		if (!this.link) {
			this.link = document.createElement("button");
			this.link.type = "button";
			this.link.addEventListener("click", () => this.tooltip?.show());
			this.link.dataset.tpReferenceOutput = "";
			referenceId(this.link);
			this.append(this.link);
			this.tooltip = new TpTooltip();
			this.tooltip.dataset.tpReferenceOutput = "";
			this.tooltip.classList.add("tp-ref-tooltip");
			this.tooltip.setAttribute("anchor", `#${this.link.id}`);
			this.append(this.tooltip);
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
		if (!this.link || !this.tooltip) return;
		const tag = (
			{ "^": "tp-note", "@": "tp-biblio", "%": "tp-glossary" } as Record<
				string,
				string
			>
		)[this.href[0] ?? ""];
		const id = this.href.slice(1);
		const target =
			tag && id
				? referenceElements(referenceScope(this), tag).find(
						(e) => e.getAttribute("ref") === id,
					)
				: undefined;
		for (const node of this.original ?? [])
			if (node.parentNode === this || node.parentNode === this.link)
				node.parentNode.removeChild(node);
		const note = this.href.startsWith("^");
		const text = note
			? `[${noteNumbers(referenceScope(this)).get(id) ?? "?"}]`
			: this.href.startsWith("@")
				? `[${id}]`
				: id || "?";
		if (
			this.link.textContent !== text ||
			Boolean(this.link.querySelector("sup")) !== note
		) {
			if (note) {
				const sup = document.createElement("sup");
				sup.textContent = text;
				this.link.replaceChildren(sup);
			} else this.link.textContent = text;
		}

		this.link.disabled = !target;
		if (!target) this.tooltip.hide();

		const content = target?.innerHTML ?? "";
		if (content !== this.content) {
			this.content = content;
			this.tooltip.replaceChildren(
				...(target ? [referenceContent(target)] : []),
			);
		}
	}
}
if (!customElements.get("tp-ref")) customElements.define("tp-ref", TpRef);
declare global {
	interface HTMLElementTagNameMap {
		"tp-ref": TpRef;
	}
}
