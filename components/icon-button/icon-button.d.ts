/**
 * @module components/icon-button
 * @summary Accessible icon button component.
 */
import "../icon/icon.js";
import { TpBase } from "../base/base.js";
import { type TpSizeType, type TpVariantType } from "../base/base.types.js";
/**
 * @summary API documentation summary.
 */
export type TpIconButtonNativeType = "button" | "submit" | "reset";
/**
 * @summary Button icon accessible.
 * @tagname tp-icon-button
 * @attr {string} name = "" - Attribute `name`.
 * @attr {string} library = "" - Attribute `library`.
 * @attr {string} label = "" - Attribute `label`.
 * @attr {string} type = "button" - Attribute `type`.
 * @attr {string} variant = "neutral" - Attribute `variant`.
 * @attr {string} size = "m" - Attribute `size`.
 * @attr {string} color = "" - Color forwarded to the internal `<tp-icon>`.
 * @attr {number} scale = 1 - Scale forwarded to the internal `<tp-icon>`.
 * @attr {string} rotate = "0deg" - Rotation forwarded to the internal `<tp-icon>`.
 * @attr {boolean} flip-h = false - Horizontal flip forwarded to the internal `<tp-icon>`.
 * @attr {boolean} flip-v = false - Vertical flip forwarded to the internal `<tp-icon>`.
 * @attr {boolean} spin = false - Continuous spin forwarded to the internal `<tp-icon>`.
 * @attr {boolean} disabled = false - Attribute `disabled`.
 * @event click Event.
 * @cssprop [--tp-icon-button-size=1.75rem] CSS custom property.
 * @cssprop [--tp-icon-button-icon-size=1rem] CSS custom property.
 * @cssprop [--tp-icon-button-radius=999rem] CSS custom property.
 * @cssprop [--tp-icon-button-hover-background=color-mix(in srgb, currentColor 10%, transparent)] CSS custom property.
 * @cssprop [--tp-icon-button-focus-ring=currentColor] CSS custom property.
 * @accessibility Uses a native button and hides the decorative icon from the accessible name.
 * @accessibilityresponsibility Set `label` to a concise name that describes the action.
 * @keyboard {Enter / Space} Uses the browser's native button activation behavior.
 * @example
 * <tp-icon-button></tp-icon-button>
 */
export declare class TpIconButton extends TpBase {
    /**
     * @summary Global style ID.
     * @internal
     */
    private static readonly iconButtonStyleId;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private buttonEl;
    /**
     * @summary Reference to `<tp-icon>`.
     * @internal
     */
    private iconEl;
    /**
     * @summary Declares reactive attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * @summary API documentation summary.
     * @attr name
     */
    get name(): string;
    set name(value: string);
    /**
     * @summary API documentation summary.
     * @attr library
     */
    get library(): string;
    set library(value: string);
    /**
     * @summary API documentation summary.
     * @attr label
     */
    get label(): string;
    set label(value: string);
    /**
     * @summary API documentation summary.
     * @attr type
     * @default button
     */
    get type(): TpIconButtonNativeType;
    set type(value: TpIconButtonNativeType);
    /**
     * @summary API documentation summary.
     * @attr variant
     * @default neutral
     */
    get variant(): TpVariantType;
    set variant(value: TpVariantType);
    /**
     * @summary API documentation summary.
     * @attr size
     * @default m
     */
    get size(): TpSizeType;
    set size(value: TpSizeType);
    get color(): string;
    set color(value: string);
    get scale(): number;
    set scale(value: number);
    get rotate(): string;
    set rotate(value: string);
    get flipH(): boolean;
    set flipH(value: boolean);
    get flipV(): boolean;
    set flipV(value: boolean);
    get spin(): boolean;
    set spin(value: boolean);
    /**
     * @summary API documentation summary.
     * @attr disabled
     */
    get disabled(): boolean;
    set disabled(value: boolean);
    /**
     * @summary API documentation summary.
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
     * @summary Cleans the component.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * @summary API documentation summary.
     */
    focus(): void;
    /**
     * @summary Ensures the structure internal.
     * @internal
     */
    private ensureButton;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private updateIconButton;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-icon-button": TpIconButton;
    }
}
