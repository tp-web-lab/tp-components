/**
 * @module components/box
 * @summary Simple box layout component.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
/**
 * Simple box layout component, without Shadow DOM.
 *
 * @summary Wraps content in a configurable bordered box.
 * @tagname tp-box
 *
 * @attr {string} border-width = "1px" - Border width applied to the box. When absent, uses --tp-box-border-width with a 1px fallback.
 * @attr {string} border-radius = "0px" - Border radius applied to the box. When absent, uses --tp-box-border-radius with a 0px fallback.
 * @attr {boolean} invert = false - Uses an inverted surface with contrasting text.
 * @attr {string} padding = "1rem" - Padding applied inside the box. When absent, uses --tp-box-padding with a 1rem fallback.
 *
 *
 * @cssprop --tp-box-background Default box background.
 * @cssprop --tp-box-border-radius Default border radius.
 * @cssprop --tp-box-border-width Default border width.
 * @cssprop --tp-box-color Default box text color.
 * @cssprop --tp-box-padding Default inner padding.
 * @example
 * <tp-box>
 *   The custom HTML element <code>&lt;tp-box&gt;</code> wraps its content in various ways.
 * </tp-box>
 */
export declare class TpBox extends TpBase {
    /**
     * Identifier of the global stylesheet injected once.
     */
    private static readonly styleId;
    /**
     * List of observed attributes.
     */
    static get observedAttributes(): string[];
    /**
     * Value of the `padding` attribute.
     *
     * Returns an empty string if absent; CSS supplies --tp-box-padding (1rem by default).
     */
    get padding(): string;
    set padding(value: string);
    /**
     * Value of the `border-width` attribute.
     *
     * Returns an empty string if absent; CSS supplies --tp-box-border-width (1px by default).
     */
    get borderWidth(): string;
    set borderWidth(value: string);
    /**
     * Value of the `border-radius` attribute.
     *
     * Returns an empty string if absent; CSS supplies --tp-box-border-radius (0px by default).
     */
    get borderRadius(): string;
    set borderRadius(value: string);
    /**
     * Indicates whether the box uses an inverted surface.
     */
    get invert(): boolean;
    set invert(value: boolean);
    /**
     * Injects the global styles and applies the reactive styles
     * when the element is connected to the document.
     */
    protected connectedCallback(): void;
    /**
     * Reacts to changes in the observed attributes.
     */
    protected attributeChangedCallback(): void;
    /**
     * Injects the global stylesheet once.
     */
    private ensureStyles;
    /**
     * Updates the instance CSS variables.
     *
     * If an attribute is absent, the corresponding CSS variable is removed
     * so the default value defined in the stylesheet can apply.
     */
    private updateStyles;
}
