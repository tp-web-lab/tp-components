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
import "../note/note.js";
import "../biblio/biblio.js";
import "../glossary/glossary.js";
import { TpBase } from "../base/base.js";
/**
 * @summary Collects reference content or links to labelled elements matching a CSS selector.
 * @tagname tp-listof
 * @attr {string} selector = "" - CSS selector for reference definitions or elements with a title, label or caption.
 * @keyboard {Enter} Follows the focused list link.
 * @example
 * <div data-tp-reference-scope="">
 *   <tp-listof selector="figure"></tp-listof>
 *   <figure><p>A diagram of the water cycle.</p><figcaption>The water cycle</figcaption></figure>
 *   <figure><p>A diagram of a food chain.</p><figcaption>A food chain</figcaption></figure>
 * </div>
 */
export declare class TpListof extends TpBase {
    private unsubscribe;
    private output;
    private signature;
    static get observedAttributes(): string[];
    get selector(): string;
    set selector(value: string);
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    protected attributeChangedCallback(): void;
    private refresh;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-listof": TpListof;
    }
}
