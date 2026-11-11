/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
/**
 * The custom `<tp-biblio>` element defines a hidden bibliography entry for reference tooltips and generated lists.
 *
 * @summary Defines a hidden bibliography entry for reference tooltips and generated lists.
 * @tagname tp-biblio
 * @attr {string} ref = "" - Identifier used by references in this document.
 * @example
 * <div data-tp-reference-scope="">
 *   <p>Read more <tp-ref href="@example"></tp-ref>.</p>
 *   <tp-biblio ref="example" title="Example"><p>Additional information with <strong>HTML content</strong>.</p></tp-biblio>
 *   <tp-listof selector="tp-biblio"></tp-listof>
 * </div>
 *  @accessibility Stores bibliography content in a hidden definition; it is not a focusable control and its content is exposed through tp-ref previews or a tp-listof bibliography.
 * @accessibilityresponsibility Provide an unambiguous reference identifier, meaningful bibliographic text and accessible links or image alternatives. Include a visible tp-listof when readers need persistent access to the complete entries.
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
