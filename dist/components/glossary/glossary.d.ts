/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
/**
 * The custom `<tp-glossary>` element defines a hidden glossary entry for reference tooltips and generated lists.
 *
 * @summary Defines a hidden glossary entry for reference tooltips and generated lists.
 * @tagname tp-glossary
 * @attr {string} ref = "" - Identifier used by references in this document.
 * @example
 * <div data-tp-reference-scope="">
 *   <p>Read more <tp-ref href="%example"></tp-ref>.</p>
 *   <tp-glossary ref="example" title="Example"><p>Additional information with <strong>HTML content</strong>.</p></tp-glossary>
 *   <tp-listof selector="tp-glossary"></tp-listof>
 * </div>
 *  @accessibility Stores glossary content in a hidden definition; tp-ref exposes the definition in a preview and tp-listof can render it in a native description list.
 * @accessibilityresponsibility Use a meaningful term identifier and a clear text definition, with alternatives for non-text content. Include a visible glossary list when definitions must remain available outside transient previews.
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
