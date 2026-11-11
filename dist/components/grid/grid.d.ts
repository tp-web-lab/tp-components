/**
 * @module components/grid
 * @summary Responsive grid layout component.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
/**
 * The custom `<tp-grid>` element arranges content in a grid that adapts to the available width.
 *
 * @summary Arranges content in a grid that adapts to the available width.
 * @tagname tp-grid
 *
 * @attr {string} gap = "1rem" - Gap between grid cells. When absent, uses the --tp-grid-gap CSS default.
 * @attr {string} min-width = "250px" - Minimum column width used by the responsive grid template, limited to the available container width. When absent, uses the --tp-grid-min-width CSS default.
 *
 *
 * @cssprop --tp-grid-gap Default gap between grid cells.
 * @cssprop --tp-grid-min-width Default minimum column width.
 * @example
 * <tp-grid min-width="12rem" gap="1rem">
 *   <tp-box>First column</tp-box>
 *   <tp-box>Second column</tp-box>
 *   <tp-box>Third column</tp-box>
 * </tp-grid>
 */
export declare class TpGrid extends TpBase {
    private static readonly styleId;
    static get observedAttributes(): string[];
    /**
     * Minimum column width.
     */
    get minWidth(): string;
    set minWidth(value: string);
    /**
     * Gap between cells.
     */
    get gap(): string;
    set gap(value: string);
    protected connectedCallback(): void;
    protected attributeChangedCallback(): void;
    disconnectedCallback(): void;
    private ensureStyles;
    private updateStyles;
}
