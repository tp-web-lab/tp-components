/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
/**
 * Cover layout component, without Shadow DOM.
 *
 * @summary Creates a vertical cover layout with an optional centered heading element.
 * @tagname tp-cover
 *
 * @attr {string} gap = "1rem" - Gap between direct children. When absent, uses the --tp-cover-gap CSS default.
 * @attr {string} heading = "" - Simple CSS selector (for example h2, .hero or #title) identifying a direct child to center vertically in the available space, not the heading text. Empty by default: no child is selected for centering.
 * @attr {string} min-height = "100vh" - Minimum block size of the cover. When absent, uses the --tp-cover-min-height CSS default.
 * @attr {string} padding = "1rem" - Padding applied inside the cover. When absent, uses the --tp-cover-padding CSS default.
 *
 *
 * @cssprop --tp-cover-gap Default gap between direct children.
 * @cssprop --tp-cover-min-height Default minimum block size.
 * @cssprop --tp-cover-padding Default inner padding.
 * @example
 * <tp-cover min-height="16rem" heading="h2">
 * <p>A short introduction</p>
 * <h2>A heading centered in the cover</h2>
 * <p>Supporting information stays below.</p>
 * </tp-cover>
 */
export declare class TpCover extends TpBase {
    private static readonly styleId;
    private headingStyleEl;
    private instanceId;
    static get observedAttributes(): string[];
    get heading(): string;
    set heading(value: string);
    get minHeight(): string;
    set minHeight(value: string);
    get gap(): string;
    set gap(value: string);
    get padding(): string;
    set padding(value: string);
    protected connectedCallback(): void;
    protected attributeChangedCallback(name: string): void;
    disconnectedCallback(): void;
    private ensureStyles;
    private ensureInstanceId;
    private updateStyles;
    private updateHeadingStyle;
    private removeHeadingStyle;
}
