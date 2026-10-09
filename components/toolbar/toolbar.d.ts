/**
 * @module components/toolbar
 * @summary Sticky toolbar with start / center / end sections,
 *          horizontal or vertical orientation, and configurable placement.
 *          Sticks to the edge of its containing element (not the viewport).
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
/** Reading-axis orientation of the toolbar. */
export type TpToolbarOrientation = "horizontal" | "vertical";
/** Container edge to which the toolbar sticks within its containing element. */
export type TpToolbarPlacement = "top" | "bottom" | "start" | "end";
/**
 * `<tp-toolbar>` renders a sticky toolbar with three zones: `start`, `center`, and `end`.
 *
 * Children are distributed into zones via their `section` attribute
 * (`section="start"` | `section="center"` | `section="end"`; default: `"start"`).
 * This is light DOM — no Shadow DOM slots are used.
 *
 * The toolbar sticks to the edge of its nearest scrolling container, not the viewport.
 * Set `position: relative` (or `overflow: auto`) on the parent to define the sticky boundary.
 *
 * The toolbar supports any `tp-*` component as a child, including:
 * `tp-button`, `tp-button-group`, `tp-icon-button`, `tp-dropdown`,
 * `tp-alarm`, `tp-chronometer`, `tp-clock`, `tp-color`, `tp-dir`,
 * `tp-icon`, `tp-theme`, `tp-timer`.
 *
 * @summary Sticky, zoned toolbar for tp-* components.
 * @tagname tp-toolbar
 * @attr {string} orientation = "horizontal" - `horizontal` (default) or `vertical`.
 * @attr {string} placement = "top (horizontal) / start (vertical)" - `top` (default for horizontal) | `bottom` | `start` | `end`.
 *
 * @example
 * <tp-box padding="0">
 *   <tp-toolbar>
 *     <tp-icon section="start" name="home" aria-label="Home"></tp-icon>
 *     <tp-icon section="start" name="menu" aria-label="Menu"></tp-icon>
 *     <span section="center">Document</span>
 *     <tp-icon section="end" name="github" aria-label="GitHub"></tp-icon>
 *     <tp-icon section="end" name="settings" aria-label="Settings"></tp-icon>
 *     <tp-icon section="end" name="help" aria-label="Help"></tp-icon>
 *   </tp-toolbar>
 *   <tp-box border-width="0" style="min-block-size: 5rem; display: grid; place-items: center">Document area</tp-box>
 * </tp-box>
 */
export declare class TpToolbar extends TpBase {
    /** Identifier used for the injected component stylesheet. */
    private static readonly styleId;
    /** MutationObserver that distributes children added after connect. */
    private childObserver;
    /** Container for `section="start"` children. */
    private startSection;
    /** Container for `section="center"` children. */
    private centerSection;
    /** Container for `section="end"` children. */
    private endSection;
    /**
     * Returns the list of attributes observed by the component.
     *
     * @summary Returns the observed attributes.
     */
    static get observedAttributes(): string[];
    /**
     * Returns the toolbar orientation.
     *
     * @summary Returns the configured orientation.
     */
    get orientation(): TpToolbarOrientation;
    /**
     * Updates the toolbar orientation.
     *
     * @summary Sets the configured orientation.
     * @param value Orientation to apply.
     */
    set orientation(value: TpToolbarOrientation);
    /**
     * Returns the toolbar placement.
     *
     * Defaults to `top` for horizontal toolbars and `start` for vertical ones.
     *
     * @summary Returns the configured placement.
     */
    get placement(): TpToolbarPlacement;
    /**
     * Updates the toolbar placement.
     *
     * @summary Sets the configured placement.
     * @param value Placement to apply.
     */
    set placement(value: TpToolbarPlacement);
    /**
     * Builds the section layout, distributes children, and starts observing.
     *
     * @summary Connects the toolbar component.
     */
    protected connectedCallback(): void;
    /**
     * Reacts to changes on observed attributes.
     *
     * @summary Handles observed attribute changes.
     * @param name Updated attribute name.
     * @param oldValue Previous value.
     * @param newValue New value.
     */
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * Stops observing child mutations.
     *
     * @summary Disconnects the toolbar component.
     */
    disconnectedCallback(): void;
    addButtonToSection(button: HTMLElement, section: string): void;
    /**
     * Creates and caches the three section containers when they do not exist yet.
     *
     * @summary Ensures the section containers exist.
     */
    private buildSections;
    /**
     * Moves children that were already present at connect time into their target section.
     *
     * @summary Distributes pre-existing children into sections.
     */
    private distributeExistingChildren;
    /**
     * Moves a single child element into the section indicated by its `section` attribute.
     *
     * @summary Assigns one child to its target section.
     * @param child Child element to place.
     */
    private assignToSection;
    /**
     * Updates `data-orientation` and `data-placement` host attributes
     * so CSS can target the current state.
     *
     * @summary Refreshes data attributes for CSS.
     */
    private updateDataAttributes;
    /**
     * Installs a MutationObserver to distribute children added after the initial connect.
     *
     * @summary Starts observing direct child mutations.
     */
    private startObserving;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-toolbar": TpToolbar;
    }
}
