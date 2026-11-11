/**
 * @module components/markup-multi-slides
 * @summary presents multi-format pages as a responsive slide deck.
 */
/**
 * @tp-dependency tp-markup-multi-pages
 * @summary Multi-page documentation with support for multiple markup languages.
 */
/**
 * @tp-dependency tp-menu
 * @summary Accessible menu component.
 */
/**
 * @tp-dependency tp-numberfield
 * @summary Numeric field with an optional native range slider.
 */
/**
 * @tp-dependency tp-slide-note
 * @summary Collapsible speaker notes with speech playback and presentation docking.
 */
/**
 * @tp-dependency tp-text-to-speech
 * @summary Reads textual component content aloud with the Web Speech API.
 */
import { TpMarkupMultiPages } from "../markup-multi-pages/markup-multi-pages.js";
import "../numberfield/numberfield.js";
import "../menu/menu.js";
import "../slide-note/slide-note.js";
import { type SlideAutoMode } from "./slide-playback.js";
/**
 * The custom `<tp-markup-multi-slides>` element presents multi-format pages as a responsive slide deck.
 *
 * @summary Presents multi-format pages as a responsive slide deck.
 * @cssprop --tp-slide-content-width = 65em - Maximum content width.
 * @cssprop --tp-slide-content-padding = clamp(1em, 3vw, 3em) - Inline content padding.
 * @cssprop --tp-slide-font-size = clamp(1rem, calc(0.65rem + 1.15vw), 2.5rem) - Responsive slide content font size.
 * @cssprop --tp-slide-title-size = 2.488em - Level-one title size relative to slide text.
 * @cssprop --tp-slide-image-height = 13em - Maximum image height.
 * @cssprop --tp-slide-image-height-small = 10em - Maximum image height below 650px.
 * @cssprop --tp-slide-svg-height = 22em - Maximum height of included SVG illustrations.
 * @attr {"" | "notes" | "timing"} auto = "" - Enables automatic playback controls. notes follows the current tp-text-to-speech[data-slide-notes] and its [trigger=clic] commands; timing advances each progressive step on a clock. Absent or invalid values keep manual navigation.
 * @attr {number} timing = 5000 - Positive integer milliseconds per progressive step in timing mode, also used when notes are absent or finished.
 * @tagname tp-markup-multi-slides
 * @example
 * <tp-markup-multi-slides repository="/docs/components/markup-multi-slides/docs" label="Mixed markup slides"></tp-markup-multi-slides>
 */
export declare class TpMarkupMultiSlides extends TpMarkupMultiPages {
    static get observedAttributes(): string[];
    /** Configured playback mode; an empty value preserves manual navigation. */
    get auto(): SlideAutoMode;
    set auto(value: SlideAutoMode);
    /** Milliseconds before revealing the next step or moving to the next slide. */
    get timing(): number;
    set timing(value: number);
    /** Starts or resumes the configured automatic playback after user activation. */
    playAuto(): void;
    /** Freezes the current voice or the remaining clock interval. */
    pauseAuto(): void;
    /** Cancels automatic playback while retaining the current slide and reveals. */
    stopAuto(): void;
    private readonly playback;
    private automaticNavigation;
    private automaticHash;
    private handleAutoRoute;
    protected attributeChangedCallback(name: string): void;
    private handleManualNavigation;
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
    private syncAutomatic;
    private syncModeMenu;
    private syncAutoControls;
    private createArrow;
    private updateArrowStates;
    private createCounter;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-markup-multi-slides": TpMarkupMultiSlides;
    }
}
