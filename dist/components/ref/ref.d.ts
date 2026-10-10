/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-biblio
 * @summary Defines a bibliography entry referenced by tp-ref.
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
 * @summary Displays anchored tooltip content.
 */
import { TpBase } from "../base/base.js";
import "../tooltip/tooltip.js";
import "../note/note.js";
import "../biblio/biblio.js";
import "../glossary/glossary.js";
/**
 * @summary Displays inline references to notes, bibliography and glossary entries with HTML tooltips.
 * @tagname tp-ref
 * @attr {string} href = "" - Prefixed identifier selecting a note, bibliography or glossary entry.
 * @keyboard {Enter / Space} Shows the reference tooltip.
 * @keyboard {Escape} Closes the reference tooltip.
 * @example
 * <div data-tp-reference-scope="">
 *   <p>A useful detail <tp-ref href="^detail"></tp-ref>.</p>
 *   <tp-note ref="detail" title="Detail"><p>A note with <strong>formatted content</strong>.</p></tp-note>
 * </div>
 */
export declare class TpRef extends TpBase {
    private link;
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
