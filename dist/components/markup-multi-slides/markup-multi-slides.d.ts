/**
 * @module components/markup-multi-slides
 * @summary presents multi-format pages as a responsive slide deck.
 */
/**
 * @tp-dependency tp-markup-multi-pages
 * @summary Multi-page documentation with support for multiple markup languages.
 */
/**
 * @tp-dependency tp-numberfield
 * @summary Numeric field with an optional native range slider.
 */
import { TpMarkupMultiPages } from "../markup-multi-pages/markup-multi-pages.js";
import "../numberfield/numberfield.js";
/**
 * Uses the complete multi-pages implementation and replaces only its rendered
 * previous/next navigation with slide controls.
 *
 * @summary presents multi-format pages as a responsive slide deck.
 * @tagname tp-markup-multi-slides
 * @example
 * <tp-markup-multi-slides repository="/slides"></tp-markup-multi-slides>
 */
export declare class TpMarkupMultiSlides extends TpMarkupMultiPages {
    /** Allocate a distinct datalist for each presentation in the same document. */
    private static nextTicksId;
    /** Stable identifier retained across slide changes. */
    private readonly ticksId;
    private static readonly styleId;
    private navigationObserver;
    private navigationSyncPending;
    private progressElements;
    private progressSteps;
    private progressIndex;
    private progressPage;
    private revealPreviousSlideOnLoad;
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    private handleKeydown;
    private handleProgressClick;
    private handleProgressContextMenu;
    private advanceProgress;
    private rewindProgress;
    private goToRelativeSlide;
    private observeNavigation;
    private scheduleNavigationSync;
    private syncNavigation;
    /** Maintain one native tick mark per slide without recreating the slider. */
    private syncSlideTicks;
    private syncProgress;
    private createArrow;
    private updateArrowStates;
    private createCounter;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-markup-multi-slides": TpMarkupMultiSlides;
    }
}
