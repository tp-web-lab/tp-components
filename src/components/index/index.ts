// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./index.css?inline";
/**
 * The custom `<tp-index>` element defines an alphabetical index entry with optional descriptive content and links to its occurrences.
 *
 * @summary Defines an alphabetical index entry with optional descriptive content and links to its occurrences.
 * @tagname tp-index
 * @attr {string} ref = "" - Entry identifier within its index and reference scope.
 * @attr {string} title = "" - Displayed term; defaults to ref.
 * @attr {string} sort-key = "" - Alphabetical sorting key; defaults to ref.
 * @attr {string} parent = "" - Parent entry identifier in the same index.
 * @attr {string} index = "default" - Index name shared with tp-ref and tp-listof.
 * @attr {string} see = "" - Entry identifier or JSON array of identifiers or {ref,label} objects for see cross-references.
 * @attr {string} see-also = "" - Entry identifier or JSON array of identifiers or {ref,label} objects for see also cross-references.
 * @see tp-ref - Marks visible or silent occurrences of this entry.
 * @see tp-listof - Builds the alphabetical index with links to occurrences.
 * @accessibility Stores a hidden definition; visible references and generated lists expose the entry and its occurrences.
 * @example
 * <div data-tp-reference-scope="">
 *   <p>A <tp-ref href="!matrix">matrix</tp-ref> represents a linear map.</p>
 *   <p>A square matrix<tp-ref href="!square" silent></tp-ref> has equal dimensions.</p>
 *   <tp-index ref="matrix" title="Matrix"><p>A rectangular array of numbers.</p></tp-index>
 *   <tp-index ref="square" title="Square matrix" parent="matrix"></tp-index>
 *   <tp-listof selector="tp-index" title="Subject index"></tp-listof>
 * </div>
 */
export class TpIndex extends TpBase {
	public get ref(): string {
		return this.getAttribute("ref") ?? "";
	}
	public set ref(value: string) {
		this.setAttribute("ref", value);
	}
	public get sortKey(): string {
		return this.getAttribute("sort-key") ?? "";
	}
	public set sortKey(value: string) {
		this.setAttribute("sort-key", value);
	}
	public get parent(): string {
		return this.getAttribute("parent") ?? "";
	}
	public set parent(value: string) {
		this.setAttribute("parent", value);
	}
	public get index(): string {
		return this.getAttribute("index") || "default";
	}
	public set index(value: string) {
		this.setAttribute("index", value);
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-index-styles", style);
	}
}
if (!customElements.get("tp-index")) customElements.define("tp-index", TpIndex);
declare global {
	interface HTMLElementTagNameMap {
		"tp-index": TpIndex;
	}
}
