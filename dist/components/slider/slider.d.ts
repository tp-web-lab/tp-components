/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
/**
 * The custom `<tp-slider>` element arranges content in a horizontally or vertically scrollable strip.
 *
 * Reactive attributes:
 * - `slider-height`
 * - `item-width`
 * - `gap`
 * - `scrollbar`
 * - `scrollbar-track-color`
 * - `scrollback-thumb-color`
 * @summary Arranges content in a horizontally or vertically scrollable strip.
 * @tagname tp-slider
 * @attr {"horizontal" | "vertical"} orientation = "horizontal" - Scrolling direction. Vertical sliders need a bounded slider-height.
 * @attr {string} gap = "1rem" - Gap between items, using --tp-slider-gap when absent.
 * @attr {string} item-width = "auto" - Preferred width of non-image items. By default, each item uses its own width or content-based size.
 * @attr {string} slider-height = "auto" - Height of the scrolling area. By default, follows the content height.
 * @attr {boolean} scrollbar = false - Shows the scrollbar when present and hides it when absent, regardless of the attribute's text value.
 * @attr {string} scrollbar-track-color = "transparent" - Scrollbar track color, using --tp-scrollbar-track-color when absent.
 * @attr {string} scrollback-thumb-color = "var(--tp-neutral-fill-mid)" - Scrollbar thumb color, using --tp-scrollbar-thumb-color when absent. Defaults to the theme's neutral scrollbar color.
 * @keyboard {Tab} Moves focus to the slider, then to its focusable children.
 * @keyboard {ArrowLeft / ArrowRight} Scrolls the focused slider left or right by 80% of its visible width.
 * @keyboard {ArrowUp / ArrowDown} Scrolls the focused vertical slider up or down by 80% of its visible height.
 * @keyboard {Home / End} Scrolls the focused slider to the start or end of its content, respecting text direction.
 * @example
 * <tp-box style="max-inline-size: 28rem">
 *   <tp-slider scrollbar="" item-width="10rem" gap="1rem" style="max-block-size: 8rem">
 *     <tp-box>First</tp-box><tp-box>Second</tp-box><tp-box>Third</tp-box><tp-box>Fourth</tp-box>
 *   </tp-slider>
 * </tp-box>
 *  @cssprop [--tp-slider-gap=1rem] Horizontal space between adjacent slider items.
 * @cssprop [--tp-slider-item-width=auto] Preferred width of each slider item; auto preserves its intrinsic width.
 * @cssprop [--tp-slider-native-scrollbar-size=0px] Measured native scrollbar thickness, written internally to reserve space without duplicating the browser gutter.
 */
export declare class TpSlider extends TpBase {
    private static readonly styleId;
    private resizeObserver;
    private mutationObserver;
    private readonly handleScroll;
    /** Scrolls only when the slider itself has focus, preserving child controls. */
    private readonly handleKeydown;
    static get observedAttributes(): string[];
    get orientation(): "horizontal" | "vertical";
    set orientation(value: "horizontal" | "vertical");
    get sliderHeight(): string;
    set sliderHeight(value: string);
    get itemWidth(): string;
    set itemWidth(value: string);
    get gap(): string;
    set gap(value: string);
    get scrollbar(): boolean;
    set scrollbar(value: boolean);
    get scrollbarTrackColor(): string;
    set scrollbarTrackColor(value: string);
    get scrollbackThumbColor(): string;
    set scrollbackThumbColor(value: string);
    get overflowing(): boolean;
    protected connectedCallback(): void;
    protected attributeChangedCallback(): void;
    disconnectedCallback(): void;
    private ensureStyles;
    private observeLayout;
    private updateStyles;
    private updateOverflowState;
}
