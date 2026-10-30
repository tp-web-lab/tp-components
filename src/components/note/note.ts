// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./note.css?inline";
/**
 * @summary Defines an HTML note referenced by tp-ref.
 * @tagname tp-note
 * @attr {string} ref = "" - Identifier used by references in this document.
 * @example
 * <div data-tp-reference-scope="">
 *   <p>Read more <tp-ref href="^example"></tp-ref>.</p>
 *   <tp-note ref="example" title="Example"><p>Additional information with <strong>HTML content</strong>.</p></tp-note>
 *   <tp-listof selector="tp-note"></tp-listof>
 * </div>
 * @accessibility Stores note content in a hidden definition rather than adding an interactive control; tp-ref provides the citation and tp-listof can expose the content in a numbered list.
 * @accessibilityresponsibility Supply understandable note text and accessible embedded content. Provide a visible notes list for essential information that should remain available independently of reference tooltips.
 */
export class TpNote extends TpBase {
	public get ref(): string {
		return this.getAttribute("ref") ?? "";
	}
	public set ref(value: string) {
		this.setAttribute("ref", value);
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-note-styles", style);
	}
}
if (!customElements.get("tp-note")) customElements.define("tp-note", TpNote);
declare global {
	interface HTMLElementTagNameMap {
		"tp-note": TpNote;
	}
}
