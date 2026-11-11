/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-slider
 * @summary Arranges content in a horizontally or vertically scrollable strip.
 */
import { TpBase } from "../base/base.js";
import "../icon-button/icon-button.js";
import "../slider/slider.js";
/**
 * The custom `<tp-carousel>` element displays images one at a time in a horizontal or vertical carousel.
 *
 * @summary Displays images one at a time in a horizontal or vertical carousel.
 * @tagname tp-carousel
 * @attr {"horizontal" | "vertical"} orientation = "horizontal" - Direction of image navigation.
 * @attr {string} height = "20rem" - Height of the image viewport, in CSS units.
 * @attr {number} index = 0 - Zero-based index of the selected image, clamped to the available images.
 * @attr {boolean} loop = false - Lets Previous and Next wrap between the first and last images.
 * @event tp-carousel-change Emitted when the selected image changes.
 * @eventdetail tp-carousel-change { index: number; count: number }
 * @keyboard {ArrowLeft / ArrowRight} Selects the previous or next image in horizontal mode when the image viewport is focused.
 * @keyboard {ArrowUp / ArrowDown} Selects the previous or next image in vertical mode when the image viewport is focused.
 * @keyboard {Home / End} Selects the first or last image when the image viewport is focused.
 * @keyboard {Tab} Moves focus between the image viewport and available navigation buttons.
 * @accessibility Provides a labelled carousel, keyboard navigation, native touch scrolling and a live image counter; respects reduced-motion preferences.
 * @accessibilityresponsibility Supply meaningful alternative text for every image and an aria-label that identifies the gallery.
 * @see tp-slider - Provides the scrollable strip used by the carousel.
 * @example
 * <tp-carousel aria-label="Outdoor activities" height="18rem">
 *   <img src="/docs/medias/images/canoe.svg" alt="Canoe">
 *   <img src="/docs/medias/images/basketball.svg" alt="Basketball">
 *   <img src="/docs/medias/images/walking-shoe.svg" alt="Walking shoe">
 * </tp-carousel>
 */
export declare class TpCarousel extends TpBase {
    private viewport;
    private controls;
    private previousButton;
    private nextButton;
    private counter;
    private activeIndex;
    private reflecting;
    private resizeObserver;
    private mutationObserver;
    private layoutFrame;
    private scrollFrame;
    static get observedAttributes(): string[];
    get orientation(): "horizontal" | "vertical";
    set orientation(value: "horizontal" | "vertical");
    get height(): string;
    set height(value: string);
    get index(): number;
    set index(value: number);
    get loop(): boolean;
    set loop(value: boolean);
    /** Number of images in the carousel. */
    get count(): number;
    private get slides();
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    protected attributeChangedCallback(): void;
    /** Selects the previous image, wrapping when loop is enabled. */
    previous(): void;
    /** Selects the next image, wrapping when loop is enabled. */
    next(): void;
    /** Selects an image by its zero-based index. */
    goTo(index: number): void;
    private step;
    private ensureControls;
    private collectImages;
    private sync;
    private select;
    private updateControls;
    private readonly scheduleLayout;
    private scrollToSelection;
    private readonly handleScroll;
    private readonly handleKeydown;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-carousel": TpCarousel;
    }
}
