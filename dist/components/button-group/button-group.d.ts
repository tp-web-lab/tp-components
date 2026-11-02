/**
 * @module components/button-group
 * @summary Button group component for organizing multiple buttons.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
import { TpBase } from "../base/base.js";
import "../button/button.js";
/**
 * @summary API documentation summary.
 */
export type TpButtonGroupOrientation = "horizontal" | "vertical";
/**
 * @summary API documentation summary.
 * @tagname tp-button-group
 * @attr {string} orientation = "horizontal" - Arrangement of buttons: horizontal in a row, or vertical in a column.
 * @attr {boolean} attached = false - Joins adjacent buttons without gaps and removes their inner corner rounding.
 * @attr {boolean} stretch = false - Expands the group to the available width and gives its buttons equal flexible space.
 * @example
 * <tp-button-group>
 * <tp-button>Previous</tp-button>
 *   <tp-button data-next>Next</tp-button>
 * </tp-button-group>
 * @cssprop [--tp-button-group-gap=0] Space between adjacent buttons in the group.
 */
export declare class TpButtonGroup extends TpBase {
    /**
     * @summary Global style ID.
     * @internal
     */
    private static readonly buttonGroupStyleId;
    /**
     * @summary Declares observed attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * @summary API documentation summary.
     * @default horizontal
     */
    get orientation(): TpButtonGroupOrientation;
    set orientation(value: TpButtonGroupOrientation);
    /**
     * @summary Joins adjacent buttons without gaps and removes their inner corner rounding.
     * @attr attached
     */
    get attached(): boolean;
    set attached(value: boolean);
    /**
     * @summary Expands the group to the available width and gives its buttons equal flexible space.
     * @attr stretch
     */
    get stretch(): boolean;
    set stretch(value: boolean);
    /**
     * @summary Injects the styles and synchronizes the markers.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * @summary API documentation summary.
     * @param _name Parameter.
     * @param oldValue Parameter.
     * @param newValue Parameter.
     * @internal
     */
    protected attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * @summary API documentation summary.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private updateButtonGroup;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-button-group": TpButtonGroup;
    }
}
