/**
 * @module components/button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
import { type TpSizeType, type TpVariantType } from "../base/base.types.js";
/**
 * @summary API documentation summary.
 */
export type TpButtonNativeType = "button" | "submit" | "reset";
/**
 * @summary API documentation summary.
 */
export type TpButtonLoadingMode = "replace" | "inline";
/**
 * The custom `<tp-button>` element provides an action button or navigation link, with configurable appearance and loading feedback.
 *
 * @summary Provides an action button or navigation link, with configurable appearance and loading feedback.
 * @tagname tp-button
 * @attr {TpButtonLoadingMode} loading-mode = replace - Spinner layout while loading: replace hides the label; inline keeps the label beside the spinner.
 * @attr {string} variant = "neutral" - Color variant: neutral, brand, success, danger, warning or info.
 * @attr {string} size = "m" - Button size preset: xxs, xs, s, m, l, xl or xxl; controls text size and padding.
 * @attr {string} type = "button" - Native button action: button, submit or reset; ignored when href makes the control a link.
 * @attr {boolean} outlined = false - Uses an outlined appearance instead of a filled background.
 * @attr {boolean} pill = false - Rounds the button ends to form a pill.
 * @attr {boolean} disabled = false - Prevents activation, including link navigation, and marks the control as disabled.
 * @attr {boolean} loading = false - Displays a loading spinner and prevents activation while present.
 * @attr {string} href = "" - Destination URL. A nonempty value renders a link instead of a native button.
 * @attr {string} target = "" - Browsing context for href, such as _self, _blank or a named frame; ignored in native button mode.
 * @attr {string} rel = "" - Space-separated relationship tokens forwarded to the link, for example noopener noreferrer; applies only with href.
 * @attr {string} download = "" - Suggested download filename when href is set. A nonempty value requests a download; browser and server rules determine whether it is honored.
 *
 * @accessibility Uses a native `button` or `a` element according to the configured action.
 * @accessibility Exposes disabled and loading states to assistive technology.
 * @accessibilityresponsibility Provide visible text that describes the action or destination.
 * @keyboard {Enter / Space} Uses the browser's native button activation behavior.
 * @example
 * <tp-button href="/#/components/button/index.md#usage">Read the usage guide</tp-button>
 *  @cssprop [--tp-button-accent=var(--tp-neutral-text-colorful)] Accent color used for outlined text and borders, and for the hover border; depends on variant.
 * @cssprop [--tp-button-background=var(--tp-neutral-fill-loud)] Background color of the button or link; variant and outlined can change it.
 * @cssprop [--tp-button-border-color=var(--tp-neutral-stroke-mid)] Border color of the button or link in its resting state.
 * @cssprop [--tp-button-focus-ring-color=var(--tp-focus-color)] Color of the outer ring shown on keyboard focus and hover.
 * @cssprop [--tp-button-font-size=0.875em] Font size of the button label; size presets also update this value.
 * @cssprop [--tp-button-foreground=var(--tp-neutral-text-on-loud)] Text and icon color of the button or link.
 * @cssprop [--tp-button-outline-background=var(--tp-neutral-fill-softer)] Background color of an enabled outlined button on hover.
 * @cssprop [--tp-button-padding-block=0.35em] Inner spacing above and below the button content.
 * @cssprop [--tp-button-padding-inline=0.7em] Inner spacing before and after the button content.
 * @cssprop [--tp-button-radius=0.5em] Corner radius of the button or link; pill uses a fully rounded radius.
 * @cssprop [--tp-button-spinner-border-width=2px] Stroke thickness of the circular loading indicator.
 * @cssprop [--tp-button-spinner-size=1em] Width and height of the circular loading indicator.
 * @event click Native click event bubbling from the inner button or link when activated by pointer or keyboard; disabled controls suppress activation. This is not a CustomEvent, so there is no custom detail payload.
 * @eventdetail click void
 */
export declare class TpButton extends TpBase {
    /**
     * @summary Global style ID.
     * @internal
     */
    private static readonly buttonStyleId;
    /**
     * @summary Reference to the element interactif internal.
     * @internal
     */
    private controlEl;
    /**
     * @summary Reference to the content container.
     * @internal
     */
    private contentEl;
    /**
     * @summary Observes late children added while the HTML parser is still running.
     * @internal
     */
    private childObserver;
    /**
     * @summary Prevents observer feedback while moving nodes into the internal control.
     * @internal
     */
    private isSyncingLightDomContent;
    /**
     * @summary Reference to the indicateur for loading.
     * @internal
     */
    /**
     * @summary Declares observed attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * @summary Color variant: neutral, brand, success, danger, warning or info.
     * @attr variant
     * @default neutral
     */
    get variant(): TpVariantType;
    set variant(value: TpVariantType);
    /**
     * @summary Button size preset: xxs, xs, s, m, l, xl or xxl; controls text size and padding.
     * @attr size
     * @default m
     */
    get size(): TpSizeType;
    set size(value: TpSizeType);
    /**
     * @summary Native button action: button, submit or reset; ignored when href makes the control a link.
     * @attr type
     * @default button
     */
    get type(): TpButtonNativeType;
    set type(value: TpButtonNativeType);
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
     * @summary Prevents activation, including link navigation, and marks the control as disabled.
     * @attr disabled
     */
    get disabled(): boolean;
    set disabled(value: boolean);
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
    /**
     * @summary API documentation summary.
     * @returns Return value.
     * @internal
     */
    private get isLink();
    /**
     * @summary Regroup `disabled` and `loading`.
     * @returns Return value.
     * @internal
     */
    private get isBlocked();
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
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * @summary Observes direct children added after the internal control has been created.
     * @internal
     */
    private observeLightDomContent;
    /**
     * @summary Moves late content into the rendered native control.
     * @internal
     */
    private syncLightDomContent;
    /**
     * @summary Updates the user-facing source used by help and HTML viewer.
     * @internal
     */
    private updateHelpSource;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private ensureControl;
    /**
     * @summary Replaces the element interactif internal.
     * @param nextControl Parameter.
     * @internal
     */
    private replaceControl;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private ensureInnerStructure;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private updateButton;
    /**
     * @summary API documentation summary.
     * @param button Parameter.
     * @internal
     */
    private updateNativeButton;
    /**
     * @summary API documentation summary.
     * @param anchor Parameter.
     * @internal
     */
    private updateNativeLink;
    /**
     * @summary API documentation summary.
     * @param control Parameter.
     * @internal
     */
    private updateLoadingState;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-button": TpButton;
    }
}
