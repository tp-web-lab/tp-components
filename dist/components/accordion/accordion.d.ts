/**
 * Accordion web component built from light-DOM `<dl>` markup, with ARIA semantics
 * and keyboard navigation.
 *
 * @module components/accordion
 * @summary Collapsible multi-panels element.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
export type TpAccordionAppearance = "default" | "outlined" | "filled";
/**
 * Accessible accordion web component based on light-DOM `<dl>` markup.
 *
 * Expected structure:
 *
 * ```html
 * <tp-accordion>
 *   <dl>
 *     <dt>Summary 1</dt>
 *     <dd>Content 1</dd>
 *
 *     <dt>Summary 2</dt>
 *     <dd>Content 2</dd>
 *   </dl>
 * </tp-accordion>
 * ```
 *
 * Mapping rules:
 * - `<dt>` nodes are treated as accordion headers
 * - `<dd>` nodes are treated as accordion panels
 * - headers/panels are paired by index order
 *
 * Reactive attributes:
 * - `multiple`: allows multiple expanded items
 * - `open-indexes`: space-separated list of expanded item indexes
 * - `appearance`: visual treatment (`default`, `outlined`, or `filled`)
 *
 * @tagname tp-accordion
 * @attr {TpAccordionAppearance} appearance = "default" - Visual treatment of accordion items.
 * @cssprop --tp-accordion-content-gap Gap between an accordion heading and its content.
 * @cssprop --tp-accordion-item-gap Gap between consecutive accordion items.
 * @accessibility Connects each header and panel with `aria-controls` and `aria-labelledby`.
 * @accessibility Exposes expanded state with `aria-expanded` and hides collapsed panels.
 * @accessibilityresponsibility Provide concise, unique text for every accordion header.
 * @keyboard {ArrowDown} Moves focus to the next header.
 * @keyboard {ArrowUp} Moves focus to the previous header.
 * @keyboard {Home} Moves focus to the first header.
 * @keyboard {End} Moves focus to the last header.
 * @keyboard {Enter / Space} Expands or collapses the focused section.
 * @example
 * <tp-accordion open-indexes="1">
 *   <dl>
 *     <dt>What is HTML?</dt><dd>The language used to structure web pages.</dd>
 *     <dt>What is CSS?</dt><dd>The language used to style web pages.</dd>
 *     <dt>What is Javascript?</dt><dd>The language used to define the behaviour of web pages.</dd>
 *   </dl>
 * </tp-accordion>
 */
export declare class TpAccordion extends TpBase {
    /**
     * Global style element ID injected once in `document.head`.
     */
    private static readonly accordionStyleId;
    /**
     * Unique ID assigned to this accordion instance.
     */
    private instanceId;
    /**
     * Source `<dl>` element used as accordion data model.
     */
    private dlEl;
    /**
     * List of observed attributes that trigger rerendering.
     */
    static get observedAttributes(): string[];
    /**
     * Visual treatment applied to all accordion items.
     *
     * Invalid or missing values resolve to `default`.
     *
     * @attr {TpAccordionAppearance} appearance Visual treatment of accordion items.
     */
    get appearance(): TpAccordionAppearance;
    set appearance(value: TpAccordionAppearance);
    /**
     * Whether multiple sections can stay open simultaneously.
     *
     * @attr {boolean} multiple Allows several sections to remain open simultaneously.
     */
    get multiple(): boolean;
    set multiple(value: boolean);
    /**
     * Normalized list of currently open section indexes.
     *
     * @attr {string} open-indexes Space-separated, zero-based indexes of the open sections.
     */
    get openIndexes(): number[];
    set openIndexes(value: number[]);
    /**
     * Initializes the component when connected to the DOM.
     */
    protected connectedCallback(): void;
    /**
     * Reacts to observed attribute changes.
     */
    protected attributeChangedCallback(): void;
    /**
     * Opens a section by index.
     *
     * In single mode, this replaces the current open section.
     *
     * @param index Target section index.
     */
    open(index: number): void;
    /**
     * Closes a section by index.
     *
     * @param index Target section index.
     */
    close(index: number): void;
    /**
     * Toggles open/closed state for a section by index.
     *
     * @param index Target section index.
     */
    toggle(index: number): void;
    /**
     * Ensures this instance has a stable unique ID.
     */
    private ensureInstanceId;
    /**
     * Finds and stores the first `<dl>` child used as data source.
     */
    private ensureDl;
    /**
     * Returns direct `<dt>` children from the source `<dl>`.
     *
     * @returns Header elements in source order.
     */
    private getSummaries;
    /**
     * Returns direct `<dd>` children from the source `<dl>`.
     *
     * @returns Panel elements in source order.
     */
    private getContents;
    /**
     * Recomputes ARIA roles, states, IDs, handlers, and panel visibility.
     */
    private update;
    /**
     * Handles keyboard navigation and activation on accordion headers.
     *
     * Supported keys:
     * - ArrowUp / ArrowDown: move focus between headers
     * - Home / End: jump to first/last header
     * - Enter / Space: toggle current section
     *
     * @param event Keyboard event.
     * @param index Current header index.
     * @param summaries Ordered list of header elements.
     */
    private handleKey;
}
