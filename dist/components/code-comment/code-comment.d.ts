/** @module components/code-comment */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
/**
 * @tp-dependency tp-code-editor
 * @summary CodeMirror-based code editor component.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
import { TpBase } from "../base/base.js";
import "../code-editor/code-editor.js";
import "../icon/icon.js";
import "../callout/callout.js";
/**
 * @summary associates an ordered annotation list with numbered comments in a code editor.
 * @tagname tp-code-comment
 * @attr {string} for = "" - Exact ID, without #, of the tp-code-editor to annotate.
 * @attr {boolean} open = false - Show the explanation list; code markers and tooltips remain available when absent.
 * @accessibility Preserves the ordered-list semantics and names each code marker by its number.
 * @example
 * <tp-code-editor id="commented-function" language="typescript">
 *   <script type="tp/typescript">
 *     function f(x: number): number {
 *       if (x > 0) { return 2 * x; } // <1>
 *       else { return 4 * x; } // <2>
 *     }
 *   </script>
 * </tp-code-editor>
 * <tp-code-comment for="commented-function">
 *   <ol>
 *     <li>Positive values are doubled.</li>
 *     <li>Zero and negative values are multiplied by four.</li>
 *   </ol>
 * </tp-code-comment>
 */
export declare class TpCodeComment extends TpBase {
    /** Editor currently receiving this list's marker numbers. */
    private target;
    /** Original ordered-list entries, never cloned or replaced. */
    private items;
    /** Generated icons owned by this component. */
    private readonly icons;
    /** Inline configuration warning; never inserted into the author list. */
    private status;
    /** Tracks late editor insertion, ID changes and list edits without reacting to icon rendering. */
    private readonly observer;
    /** Attributes affecting the editor association. */
    static get observedAttributes(): string[];
    /** Exact editor ID; this is not a CSS selector. */
    get htmlFor(): string;
    /** Changes the associated editor. */
    set htmlFor(value: string);
    /** Whether the explanation list is visible, independently of editor tooltips. */
    get open(): boolean;
    /** Shows or hides the list without removing its content or editor association. */
    set open(value: boolean);
    /** Installs shared styles and watches for declarative content and target changes. */
    protected connectedCallback(): void;
    /** Rebinds when the author changes for. */
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /** Releases only this list's editor decorations and restores the author list. */
    disconnectedCallback(): void;
    /** Resolves a possibly late editor and synchronizes only when entry identities change. */
    private sync;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-code-comment": TpCodeComment;
    }
}
