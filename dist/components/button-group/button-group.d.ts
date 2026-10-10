/**
 * @module components/button-group
 * @summary Button group component for organizing multiple buttons.
 */
import { TpBase } from '../base/base.js';
import '../button/button.js';
/**
 * @summary API documentation summary.
 */
export type TpButtonGroupOrientation = 'horizontal' | 'vertical';
/**
 * @summary API documentation summary.
 * @tagname tp-button-group
 * @attr {string} orientation = "horizontal" - Attribute `orientation`.
 * @attr {boolean} attached = false - Attribute `attached`.
 * @attr {boolean} stretch = false - Attribute `stretch`.
 * @cssprop [--tp-button-group-gap=0] CSS custom property.
 * @example
 * <tp-button-group>
 * <tp-button>Previous</tp-button>
 *   <tp-button data-next>Next</tp-button>
 * </tp-button-group>
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
     * @summary API documentation summary.
     * @attr attached
     */
    get attached(): boolean;
    set attached(value: boolean);
    /**
     * @summary API documentation summary.
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
        'tp-button-group': TpButtonGroup;
    }
}
