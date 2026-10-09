// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import style from "./glossary.css?inline";
/**
 * @summary Defines a glossary entry referenced by tp-ref.
 * @tagname tp-glossary
 * @attr {string} ref = "" - Identifier used by references in this document.
 * @example
 * <div data-tp-reference-scope="">
 *   <p>Read more <tp-ref href="%example"></tp-ref>.</p>
 *   <tp-glossary ref="example" title="Example"><p>Additional information with <strong>HTML content</strong>.</p></tp-glossary>
 *   <tp-listof selector="tp-glossary"></tp-listof>
 * </div>
 */
export class TpGlossary extends TpBase {
	public get ref(): string {
		return this.getAttribute("ref") ?? "";
	}
	public set ref(value: string) {
		this.setAttribute("ref", value);
	}
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-glossary-styles", style);
	}
}
if (!customElements.get("tp-glossary"))
	customElements.define("tp-glossary", TpGlossary);
declare global {
	interface HTMLElementTagNameMap {
		"tp-glossary": TpGlossary;
	}
}
