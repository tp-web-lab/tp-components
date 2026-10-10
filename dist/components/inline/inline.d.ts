/**
 * @module components/inline
 * @summary Inline flex layout component.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
/**
 * `<tp-inline>` aligne ses enfants sur une seule ligne, sans retour à la ligne,
 * sans utiliser de Shadow DOM.
 *
 * Base styles:
 * - `display: flex`
 * - `flex-wrap: nowrap`
 * - `gap: var(--tp-inline-gap, 0.5rem)`
 * - `justify-content: flex-start`
 * - `align-items: center`
 *
 * Reactive attributes:
 * - `gap` : espace entre les enfants
 * - `justify` : valeur de `justify-content`
 * - `align` : valeur de `align-items`
 * - `stretch` : permet aux enfants de s'étirer (`flex: 1 1 0`)
 * @tagname tp-inline
 * @attr {"normal" | "stretch" | "center" | "start" | "end" | "flex-start" | "flex-end" | "self-start" | "self-end" | "baseline" | "first baseline" | "last baseline"} align = "center" - Cross-axis alignment applied to align-items.
 * @attr {string} gap = "0.5rem" - Gap between children. When absent, uses the --tp-inline-gap CSS default.
 * @attr {"normal" | "start" | "end" | "flex-start" | "flex-end" | "center" | "left" | "right" | "space-between" | "space-around" | "space-evenly" | "stretch"} justify = "flex-start" - Main-axis alignment applied to justify-content.
 * @example
 * <tp-inline></tp-inline>
 */
export declare class TpInline extends TpBase {
    /**
     * Identifier of the global stylesheet injected once.
     */
    private static readonly styleId;
    /**
     * List of observed attributes.
     */
    static get observedAttributes(): string[];
    /**
     * Value of the `gap` attribute.
     */
    get gap(): string;
    set gap(value: string);
    /**
     * Value of the `justify` attribute.
     */
    get justify(): string;
    set justify(value: string);
    /**
     * Value of the `align` attribute.
     */
    get align(): string;
    set align(value: string);
    /**
     * Indicates whether children can stretch.
     */
    get stretch(): boolean;
    set stretch(value: boolean);
    /**
     * Initializes the component.
     */
    protected connectedCallback(): void;
    /**
     * Reacts to changes in the observed attributes.
     */
    protected attributeChangedCallback(): void;
    /**
     */
    disconnectedCallback(): void;
    /**
     * Injects the global stylesheet once.
     */
    private ensureStyles;
    /**
     * Updates the instance inline styles.
     */
    private updateStyles;
}
