/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
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
 */
export declare class TpNote extends TpBase {
    get ref(): string;
    set ref(value: string);
    protected connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-note": TpNote;
    }
}
