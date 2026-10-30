// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./biblio.css?inline";
/**
 * @summary Defines a bibliography entry referenced by tp-ref.
 * @tagname tp-biblio
 * @attr {string} ref = "" - Identifier used by references in this document.
 * @example
 * <div data-tp-reference-scope="">
 *   <p>Read more <tp-ref href="@example"></tp-ref>.</p>
 *   <tp-biblio ref="example" title="Example"><p>Additional information with <strong>HTML content</strong>.</p></tp-biblio>
 *   <tp-listof selector="tp-biblio"></tp-listof>
 * </div>
 * @accessibility Stores bibliography content in a hidden definition; it is not a focusable control and its content is exposed through tp-ref previews or a tp-listof bibliography.
 * @accessibilityresponsibility Provide an unambiguous reference identifier, meaningful bibliographic text and accessible links or image alternatives. Include a visible tp-listof when readers need persistent access to the complete entries.
 */
export class TpBiblio extends TpBase {
	public get ref(): string {
		return this.getAttribute("ref") ?? "";
	}
	public set ref(value: string) {
		this.setAttribute("ref", value);
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-biblio-styles", style);
	}
}
if (!customElements.get("tp-biblio"))
	customElements.define("tp-biblio", TpBiblio);
declare global {
	interface HTMLElementTagNameMap {
		"tp-biblio": TpBiblio;
	}
}
