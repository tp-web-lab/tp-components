/**
 * @module components/divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
 */
import { TpBase } from '../base/base.js';
export type TpDividerOrientation = 'horizontal' | 'vertical';
/**
 * `<tp-divider>` draws a compact horizontal or vertical separator.
 *
 * @summary Visual separator.
 * @tagname tp-divider
 * @attr {string} orientation = "horizontal" - Divider orientation (`horizontal` or `vertical`).
 * @cssprop --tp-divider-color Divider line color.
 * @cssprop --tp-divider-thickness Divider line thickness.
 * @cssprop --tp-divider-margin-block Block margin around the divider.
 * @cssprop --tp-divider-margin-inline Inline margin around the divider.
 * @example
 * <tp-divider></tp-divider>
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
        'tp-divider': TpDivider;
    }
}
