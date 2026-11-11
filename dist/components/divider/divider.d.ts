/**
 * @module components/divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
export type TpDividerOrientation = "horizontal" | "vertical";
/**
 * The custom `<tp-divider>` element provides a visual separator.
 *
 * @summary Provides a visual separator.
 * @tagname tp-divider
 * @attr {string} orientation = "horizontal" - Divider orientation (`horizontal` or `vertical`).
 * @cssprop --tp-divider-color Divider line color.
 * @cssprop --tp-divider-thickness Divider line thickness.
 * @cssprop --tp-divider-margin-block Block margin around the divider.
 * @cssprop --tp-divider-margin-inline Inline margin around the divider.
 * @example
 * <tp-box>
 *       <p>Primary content group.</p>
 *       <tp-divider></tp-divider>
 *       <p>Secondary content group.</p>
 *     </tp-box>
 */
export declare class TpDivider extends TpBase {
    private static readonly styleId;
    static get observedAttributes(): string[];
    /**
     * Returns the divider orientation.
     *
     * @summary Returns the configured orientation.
     */
    get orientation(): TpDividerOrientation;
    /**
     * Updates the divider orientation.
     *
     * @summary Sets the configured orientation.
     * @param value Divider orientation.
     */
    set orientation(value: TpDividerOrientation);
    protected connectedCallback(): void;
    protected attributeChangedCallback(): void;
    private updateDivider;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-divider": TpDivider;
    }
}
