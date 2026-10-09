/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
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
export declare class TpGlossary extends TpBase {
    get ref(): string;
    set ref(value: string);
    protected connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-glossary": TpGlossary;
    }
}
