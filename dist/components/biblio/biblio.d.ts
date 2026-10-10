/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
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
 */
export declare class TpBiblio extends TpBase {
    get ref(): string;
    set ref(value: string);
    protected connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-biblio": TpBiblio;
    }
}
