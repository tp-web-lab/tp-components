/**
 * @module components/cluster
 * @summary Flexible cluster layout component.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
/**
 * Flexible cluster layout component, without Shadow DOM.
 *
 * @summary Groups child elements in a wrapping flex row with configurable alignment and gap.
 * @tagname tp-cluster
 *
 * @attr {"normal" | "stretch" | "center" | "start" | "end" | "flex-start" | "flex-end" | "self-start" | "self-end" | "baseline" | "first baseline" | "last baseline"} align = "center" - Cross-axis alignment applied to `align-items`.
 * @attr {string} gap = "1rem" - Gap between clustered items. When absent, uses the --tp-cluster-gap CSS default.
 * @attr {"normal" | "start" | "end" | "flex-start" | "flex-end" | "center" | "left" | "right" | "space-between" | "space-around" | "space-evenly" | "stretch"} justify = "flex-start" - Main-axis alignment applied to `justify-content`.
 *
 *
 * @cssprop --tp-cluster-gap Default gap between clustered items.
 * @example
 * <tp-box>
 *   <tp-cluster justify="center" gap="0.5rem">
 *     <tp-button>Alpha</tp-button>
 *     <tp-button>Beta</tp-button>
 *     <tp-button>Gamma</tp-button>
 *   </tp-cluster>
 * </tp-box>
 */
export declare class TpCluster extends TpBase {
    /**
     * Identifier of the global stylesheet injected once.
     */
    private static readonly styleId;
    /**
     * List of observed attributes for the custom element.
     */
    static get observedAttributes(): string[];
    /**
     * Explicit main-axis alignment, or an empty string to use the CSS default.
     */
    get justify(): string;
    set justify(value: string);
    /**
     * Explicit cross-axis alignment, or an empty string to use the CSS default.
     */
    get align(): string;
    set align(value: string);
    /**
     * Explicit gap, or an empty string to use the CSS custom property default.
     */
    get gap(): string;
    set gap(value: string);
    /**
     * Injects the shared stylesheet and applies reactive styles on connection.
     */
    protected connectedCallback(): void;
    /**
     * Reacts to changes in the observed attributes.
     */
    protected attributeChangedCallback(): void;
    /**
     * Cleans up the cluster instance.
     */
    disconnectedCallback(): void;
    /**
     * Ensures a single global stylesheet is present in the document.
     */
    private ensureStyles;
    /**
     * Updates the instance inline styles from the reactive attributes.
     */
    private updateStyles;
}
