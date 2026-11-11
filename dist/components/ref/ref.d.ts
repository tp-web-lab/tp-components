/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-biblio
 * @summary Defines a bibliography entry referenced by tp-ref.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
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
 * @summary Tooltip component.
 */
import { TpBase } from "../base/base.js";
import "../tooltip/tooltip.js";
import "../note/note.js";
import "../biblio/biblio.js";
import "../glossary/glossary.js";
/**
 * The custom `<tp-ref>` element displays an inline reference with the corresponding HTML content in a tooltip.
 *
 * @summary Displays an inline reference with the corresponding HTML content in a tooltip.
 * @tagname tp-ref
 * @attr {string} href = "" - Prefixed identifier selecting a note, bibliography or glossary entry.
 * @keyboard {Enter / Space} Shows the reference tooltip.
 * @keyboard {Escape} Closes the reference tooltip.
 * @example
 * <div data-tp-reference-scope="">
 *   <p>A useful detail <tp-ref href="^detail"></tp-ref>.</p>
 *   <tp-note ref="detail" title="Detail"><p>A note with <strong>formatted content</strong>.</p></tp-note>
 * </div>
 *  @accessibility Uses a native button supplied by tp-button for the citation; the anchored tp-tooltip supports hover, keyboard focus and activation, and Escape dismissal.
 * @accessibility Disables unresolved citations and keeps note numbering synchronized with citation order.
 * @accessibilityresponsibility Use meaningful bibliography and glossary identifiers and accessible referenced content. Put essential or interactive material in a persistent tp-listof rather than relying solely on a tooltip.
 */
export declare class TpRef extends TpBase {
    private link;
    private label;
    private tooltip;
    private unsubscribe;
    private original;
    private content;
    static get observedAttributes(): string[];
    get href(): string;
    set href(value: string);
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    protected attributeChangedCallback(): void;
    private refresh;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-ref": TpRef;
    }
}
