/**
 * @module components/skeleton
 * @summary Static HTML structure previews.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
/**
 * @summary Renders selected HTML elements as fixed shaded skeleton patterns without executing the source.
 * @tagname tp-skeleton
 * @attr {string} src = "" - HTML source URL, taking precedence over value and inline scripts.
 * @attr {string} value = "" - HTML source string, taking precedence over an inline script.
 * @attr {string} label = "Content layout preview" - Accessible description of the skeleton.
 * @accessibility Exposes one labelled static image, hiding decorative shapes from assistive technology.
 * @example
 * <tp-skeleton label="Article layout preview">
 *   <script type="tp/html">
 *     <main>
 *       <nav>Home · Articles · About</nav>
 *       <h1>Building accessible interfaces</h1>
 *       <p>An introduction to the article.</p>
 *       <figure><img src="portrait.jpg" alt="Portrait"><figcaption>Caption</figcaption></figure>
 *       <h2>Key ideas</h2>
 *       <ul><li>Clear structure</li><li>Consistent interactions</li></ul>
 *       <table><tr><th>Feature</th><th>Status</th></tr><tr><td>Keyboard</td><td>Ready</td></tr></table>
 *       <blockquote>A useful quotation.</blockquote>
 *     </main>
 *   </script>
 * </tp-skeleton>
 */
export declare class TpSkeleton extends TpBase {
    /** Shared source acquisition with src, value and script precedence. */
    private readonly source;
    /** Cancels source and iframe requests when rendering becomes obsolete. */
    private controller;
    /** Monotonic render generation that prevents stale asynchronous updates. */
    private generation;
    /** Source and accessible-name attributes. */
    static get observedAttributes(): string[];
    /** HTML file URL.
     * @attr src
     * @default ""
     */
    get src(): string;
    /** Sets the HTML file URL. */
    set src(value: string);
    /** Literal HTML source.
     * @attr value
     * @default ""
     */
    get value(): string;
    /** Sets the literal HTML source. */
    set value(value: string);
    /** Accessible description.
     * @attr label
     * @default "Content layout preview"
     */
    get label(): string;
    /** Sets the accessible description. */
    set label(value: string);
    /** Installs styles and captures scripts even when parsed after connection. */
    protected connectedCallback(): void;
    /** Cancels pending work and stops observing author content. */
    protected disconnectedCallback(): void;
    /** Refreshes source or label changes once connected. */
    protected attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void;
    /** Builds an inert template: author nodes are never inserted into the live page. */
    private parse;
    /** Creates one fixed visual pattern, independent of author text and descendants. */
    private pattern;
    /** Walks only main and iframe containers; all other unselected subtrees are skipped. */
    private walk;
    /** Reads iframe HTML without creating a browsing context or executing its scripts. */
    private frameSource;
    /** Displays a readable status inside the same shaded rectangle as a heading. */
    private showMessage;
    /** Resolves the source and atomically publishes only the latest completed preview. */
    private render;
}
declare global {
    /** Typed DOM creation and queries for skeleton previews. */
    interface HTMLElementTagNameMap {
        "tp-skeleton": TpSkeleton;
    }
}
