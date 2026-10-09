/**
 * @module components/center
 * @summary Centered content layout component.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
/**
 * Centered content layout component, without Shadow DOM.
 *
 * The component constrains its own inline size and centers itself in the
 * available horizontal space. It can also center text, add inline gutters, or
 * switch to intrinsic child sizing.
 *
 * @summary Centers content within a configurable maximum inline size.
 * @tagname tp-center
 *
 * @attr {boolean} center-text = false - Centers inline text content with `text-align: center`.
 * @attr {boolean} intrinsic = false - Sizes children intrinsically by centering them in a column flex layout.
 * @attr {string} max-inline-size = "60ch" - Maximum inline size applied to the centered container. When absent, uses the --tp-center-width CSS default.
 * @attr {string} padding-inline = "0px" - Symmetric inline padding applied to the centered container.
 *
 *
 * @cssprop --tp-center-width Default maximum inline size when `max-inline-size` is not set.
 * @example
 * <tp-center intrinsic>
 * <tp-box>Centered content</tp-box>
 * </tp-center>
 */
export declare class TpCenter extends TpBase {
    /**
     * Identifier of the global stylesheet injected once for all center instances.
     *
     * @summary Global style element identifier.
     * @internal
     */
    private static readonly styleId;
    /**
     * Attributes observed by `<tp-center>`.
     *
     * @summary Observed attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * Maximum inline size applied to the centered container.
     *
     * @attr max-inline-size
     */
    get maxInlineSize(): string;
    set maxInlineSize(value: string);
    /**
     * Centers inline text content.
     *
     * @attr center-text
     */
    get centerText(): boolean;
    set centerText(value: boolean);
    /**
     * Symmetric inline padding applied to the centered container.
     *
     * @attr padding-inline
     */
    get paddingInline(): string;
    set paddingInline(value: string);
    /**
     * Centers children with intrinsic sizing in a column flex layout.
     *
     * @attr intrinsic
     */
    get intrinsic(): boolean;
    set intrinsic(value: boolean);
    /**
     * Initializes the center instance.
     *
     * @summary Connects the center to the document.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * Reacts to observed attribute changes.
     *
     * @summary Updates inline styles after attribute changes.
     * @internal
     */
    protected attributeChangedCallback(): void;
    /**
     * Cleans up the center instance.
     *
     * @summary Disconnects the center from the document.
     * @internal
     */
    disconnectedCallback(): void;
    private ensureStyles;
    private updateStyles;
}
