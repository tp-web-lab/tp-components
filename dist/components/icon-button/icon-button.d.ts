/**
 * @module components/icon-button
 * @summary Accessible icon button component.
 */
import "../icon/icon.js";
import { TpBase } from "../base/base.js";
import { type TpSizeType, type TpVariantType } from "../base/base.types.js";
import type { TpButtonLoadingMode } from "../button/button.js";
/**
 * @summary API documentation summary.
 */
export type TpIconButtonNativeType = "button" | "submit" | "reset";
/**
 * The custom `<tp-icon-button>` element provides an icon action button with an accessible text label.
 *
 * @summary Provides an icon action button with an accessible text label.
 * @tagname tp-icon-button
 * @attr {boolean} outlined = false - Uses an outlined appearance instead of a filled background.
 * @attr {boolean} pill = false - Rounds the button ends to form a pill.
 * @attr {boolean} loading = false - Displays a loading spinner and prevents activation while present.
 * @attr {TpButtonLoadingMode} loading-mode = replace - Spinner layout while loading: replace hides the label; inline keeps the label beside the spinner.
 * @attr {string} href = "" - Destination URL. A nonempty value renders a link instead of a native button.
 * @attr {string} target = "" - Browsing context for href, such as _self, _blank or a named frame; ignored in native button mode.
 * @attr {string} rel = "" - Space-separated relationship tokens forwarded to the link, for example noopener noreferrer; applies only with href.
 * @attr {string} download = "" - Suggested download filename when href is set. A nonempty value requests a download; browser and server rules determine whether it is honored.
 * @attr {string} name = "" - Identifier of the icon displayed inside the button, resolved in library.
 * @attr {string} src = "" - Image or SVG URL forwarded to the icon; takes precedence over name.
 * @attr {string} library = "" - Icon registry used to resolve name, for example tp, components, languages or a custom registered library.
 * @attr {string} label = "" - Accessible button name and hover title. Provide the action, such as Close or Search, because the control has no visible text label.
 * @attr {string} type = "button" - Native button action: button, submit or reset; ignored when href is set.
 * @attr {string} variant = "neutral" - Color variant: neutral, brand, success, danger, warning or info.
 * @attr {string} size = "m" - Button and icon size preset: xxs, xs, s, m, l, xl or xxl.
 * @attr {string} color = "" - Color forwarded to the internal `<tp-icon>`.
 * @attr {number} scale = 1 - Scale forwarded to the internal `<tp-icon>`.
 * @attr {string} rotate = "0deg" - Rotation forwarded to the internal `<tp-icon>`.
 * @attr {boolean} flip-h = false - Horizontal flip forwarded to the internal `<tp-icon>`.
 * @attr {boolean} flip-v = false - Vertical flip forwarded to the internal `<tp-icon>`.
 * @attr {boolean} spin = false - Continuous spin forwarded to the internal `<tp-icon>`.
 * @attr {boolean} disabled = false - Prevents activation, including link navigation, and marks the control as disabled.
 *
 * @accessibility Uses a native button or link and hides the decorative icon from the accessible name.
 * @accessibilityresponsibility Set `label` to a concise name that describes the action.
 * @keyboard {Enter / Space} Uses native button activation; links activate with Enter.
 * @example
 * <tp-box data-intro-action="counter" data-allow-script="">
 *   <p>Activate the heart button to add a like.</p>
 *   <tp-icon-button name="heart" label="Like this example" data-demo-trigger=""></tp-icon-button>
 *   <p data-demo-status="" role="status">Likes: 0</p>
 *   <script src="/docs/components/_shared/introduction-actions.js"></script>
 * </tp-box>
 *  @cssprop [--tp-icon-button-focus-ring=currentColor] Color of the outline shown when the button receives keyboard focus.
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
     * @summary Uses an outlined appearance instead of a filled background.
     * @attr outlined
     */
    get outlined(): boolean;
    set outlined(value: boolean);
    /**
     * @summary Rounds the button ends to form a pill.
     * @attr pill
     */
    get pill(): boolean;
    set pill(value: boolean);
    /**
     * @summary Displays a loading spinner and prevents activation while present.
     * @attr loading
     */
    get loading(): boolean;
    set loading(value: boolean);
    /**
     * @summary Spinner layout while loading: replace hides the label; inline keeps the label beside the spinner.
     * @attr loading-mode
     * @default replace
     */
    get loadingMode(): TpButtonLoadingMode;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set loadingMode(value: TpButtonLoadingMode);
    /**
     * @summary Destination URL. A nonempty value renders a link instead of a native button.
     * @attr href
     */
    get href(): string;
    set href(value: string);
    /**
     * @summary Browsing context for href, such as _self, _blank or a named frame; ignored in native button mode.
     * @attr target
     */
    get target(): string;
    set target(value: string);
    /**
     * @summary Space-separated relationship tokens forwarded to the link, for example noopener noreferrer; applies only with href.
     * @attr rel
     */
    get rel(): string;
    set rel(value: string);
    /**
     * @summary Suggested download filename when href is set. A nonempty value requests a download; browser and server rules determine whether it is honored.
     * @attr download
     */
    get download(): string;
    set download(value: string);
    /** Image or SVG source displayed by the button. */
    get src(): string;
    set src(value: string);
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
     * @summary Native button action: button, submit or reset; ignored when href is set.
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
     * @summary Prevents activation, including link navigation, and marks the control as disabled.
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
