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
 * @attr {string} name = "" - Identifier of the icon displayed inside the button, resolved in library.
 * @attr {string} library = "" - Icon registry used to resolve name, for example tp, components, languages or a custom registered library.
 * @attr {string} label = "" - Accessible button name and hover title. Provide the action, such as Close or Search, because the control has no visible text label.
 * @attr {string} type = "button" - Native button action: button, submit or reset.
 * @attr {string} variant = "neutral" - Color variant: neutral, brand, success, danger, warning or info.
 * @attr {string} size = "m" - Button and icon size preset: xxs, xs, s, m, l, xl or xxl.
 * @attr {string} color = "" - Color forwarded to the internal `<tp-icon>`.
 * @attr {number} scale = 1 - Scale forwarded to the internal `<tp-icon>`.
 * @attr {string} rotate = "0deg" - Rotation forwarded to the internal `<tp-icon>`.
 * @attr {boolean} flip-h = false - Horizontal flip forwarded to the internal `<tp-icon>`.
 * @attr {boolean} flip-v = false - Vertical flip forwarded to the internal `<tp-icon>`.
 * @attr {boolean} spin = false - Continuous spin forwarded to the internal `<tp-icon>`.
 * @attr {boolean} disabled = false - Prevents button activation and marks the native button as disabled.

 * @accessibility Uses a native button and hides the decorative icon from the accessible name.
 * @accessibilityresponsibility Set `label` to a concise name that describes the action.
 * @keyboard {Enter / Space} Uses the browser's native button activation behavior.
 * @example
 * <tp-icon-button></tp-icon-button>
 * @cssprop [--tp-icon-button-focus-ring=currentColor] Color of the outline shown when the button receives keyboard focus.
 * @cssprop [--tp-icon-button-hover-background=color-mix( in srgb, currentColor 10%, transparent )] Background color of the button on hover.
 * @cssprop [--tp-icon-button-icon-size=1em] Width and height of the icon inside the button; distinct from the clickable area.
 * @cssprop [--tp-icon-button-radius=999rem] Corner radius of the clickable button.
 * @cssprop [--tp-icon-button-size=1.75em] Minimum width and height of the clickable button; size presets also update this value.
 * @event click Native click event bubbling from the inner button when activated by pointer or keyboard; disabled controls suppress activation. This is not a CustomEvent, so there is no custom detail payload.
 * @eventdetail click void
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
     * @summary Identifier of the icon displayed inside the button, resolved in library.
     * @attr name
     */
    get name(): string;
    set name(value: string);
    /**
     * @summary Icon registry used to resolve name, for example tp, components, languages or a custom registered library.
     * @attr library
     */
    get library(): string;
    set library(value: string);
    /**
     * @summary Accessible button name and hover title. Provide the action, such as Close or Search, because the control has no visible text label.
     * @attr label
     */
    get label(): string;
    set label(value: string);
    /**
     * @summary Native button action: button, submit or reset.
     * @attr type
     * @default button
     */
    get type(): TpIconButtonNativeType;
    set type(value: TpIconButtonNativeType);
    /**
     * @summary Color variant: neutral, brand, success, danger, warning or info.
     * @attr variant
     * @default neutral
     */
    get variant(): TpVariantType;
    set variant(value: TpVariantType);
    /**
     * @summary Button and icon size preset: xxs, xs, s, m, l, xl or xxl.
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
     * @summary Prevents button activation and marks the native button as disabled.
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
     * @summary Moves keyboard focus to the internal native button, when it exists.
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
