/**
 * @module components/tabs
 * @summary Accessible tabs component with keyboard and reorder support.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
import { TpBase } from "../base/base.js";
import "../icon/icon.js";
/**
 * @summary API documentation summary.
 */
type TpTabsActivation = "auto" | "manual";
/**
 * @summary Sets the axis of navigation.
 */
type TpTabsOrientation = "horizontal" | "vertical";
/**
 * @summary Represents a tab selection change.
 */
export interface TpTabsSelectDetail {
    /**
     * @summary Selected tab index.
     */
    selected: number;
    /**
     * @summary Selected tab value.
     */
    value: string;
}
/**
 * @summary Represents a tab close request.
 */
export interface TpTabsCloseDetail {
    /**
     * @summary Closed tab index.
     */
    index: number;
    /**
     * @summary Closed tab value.
     */
    value: string;
}
/**
 * @summary Represents a tab reorder event.
 */
export interface TpTabsReorderDetail {
    /**
     * @summary Original tab index.
     */
    fromIndex: number;
    /**
     * @summary New tab index.
     */
    toIndex: number;
    /**
     * @summary Reordered tab value.
     */
    value: string;
}
/**
 * @summary Accessible tab group.
 * @tagname tp-tabs
 * @attr {string} activation = "auto" - Keyboard activation mode (`auto` or `manual`).
 * @attr {string} orientation = "horizontal" - Tab list orientation (`horizontal` or `vertical`).
 * @attr {number} selected = 0 - Selected tab index.
 * @event tp-tabs-close Emitted when a tab close button is activated.
 * @eventdetail tp-tabs-close { index: number; value: string }
 * @event tp-tabs-reorder Emitted after a tab is reordered by drag and drop.
 * @eventdetail tp-tabs-reorder { fromIndex: number; toIndex: number; value: string }
 * @event tp-tabs-select Emitted after a tab is selected.
 * @eventdetail tp-tabs-select { selected: number; value: string }
 * @accessibility Accepts author-friendly dl/dt/dd markup and converts it to ARIA-compatible generic tab, tablist, and tabpanel elements at runtime.
 * @accessibility Implements the ARIA tablist, tab, and tabpanel relationships in light DOM.
 * @accessibility Exposes selection through `aria-selected` and uses roving tabindex.
 * @accessibilityresponsibility Provide a concise, unique visible label for every tab.
 * @keyboard {ArrowRight / ArrowDown} Moves focus to the next tab according to orientation.
 * @keyboard {ArrowLeft / ArrowUp} Moves focus to the previous tab according to orientation.
 * @keyboard {Home} Moves focus to the first tab.
 * @keyboard {End} Moves focus to the last tab.
 * @keyboard {Enter / Space} Activates the focused tab in manual activation mode.
 * @keyboard {Delete} Requests closing a dynamically added tab.
 * @example
 * <tp-tabs>
 *   <dl>
 *     <dt>Tab 1</dt>
 *     <dd>Content of panel <tp-icon size="2em" name="numeric-1"></tp-icon></dd>
 *     <dt>Tab 2</dt>
 *     <dd>Content of panel <tp-icon size="2em" name="numeric-2"></tp-icon></dd>
 *     <dt>Tab 3</dt>
 *     <dd>Content of panel <tp-icon size="2em" name="numeric-3"></tp-icon></dd>
 *     <dt>Tab 4</dt>
 *     <dd>Content of panel <tp-icon size="2em" name="numeric-4"></tp-icon></dd>
 *   </dl>
 * </tp-tabs>
 */
export declare class TpTabs extends TpBase {
    /**
     * @summary Global style ID.
     * @internal
     */
    private static readonly styleId;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private instanceId;
    /**
     * @summary Reference to the internal description list.
     * @internal
     */
    private dlEl;
    /**
     * @summary Observes external structural changes.
     * @internal
     */
    private mutationObserver;
    /**
     * @summary Declares reactive attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * @summary Selected tab index.
     * @attr selected
     * @default 0
     * @returns Return value.
     */
    get selected(): number;
    /**
     * @summary Selects a tab by index.
     * @param value Selected tab index.
     */
    set selected(value: number);
    /**
     * @summary Mode of activation keyboard.
     * @attr activation
     * @default auto
     * @returns Return value.
     */
    get activation(): TpTabsActivation;
    /**
     * @summary Sets the keyboard activation mode.
     * @param value Keyboard activation mode.
     */
    set activation(value: TpTabsActivation);
    /**
     * @summary Tab list orientation.
     * @attr orientation
     * @default horizontal
     * @returns Return value.
     */
    get orientation(): TpTabsOrientation;
    /**
     * @summary Sets the tab list orientation.
     * @param value Tab list orientation.
     */
    set orientation(value: TpTabsOrientation);
    /**
     * @summary Injects the styles, initializes the structure and observes the content.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * @summary API documentation summary.
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * @summary API documentation summary.
     * @internal
     */
    protected attributeChangedCallback(): void;
    /**
     * @summary Selects a tab by its index.
     * @param index Tab index.
     */
    select(index: number): void;
    /**
     * @summary Selects a tab by its `data-value`.
     * @param value Tab value.
     */
    selectValue(value: string): void;
    /**
     * @summary Adds a tab and its empty panel.
     * @param value Tab value.
     * @param label Tab label.
     * @returns Added tab index.
     */
    addTab(value: string, label: string): number;
    /**
     * @summary Removes a tab by value.
     * @param value Tab value.
     */
    removeTab(value: string): void;
    /**
     * @summary Moves a tab from one index to another.
     * @param fromIndex Original tab index.
     * @param toIndex New tab index.
     */
    moveTab(fromIndex: number, toIndex: number): void;
    /**
     * @summary Removes all tabs and panels.
     */
    clearTabs(): void;
    /**
     * @summary Returns the selected tab value.
     * @returns Selected tab value, or `null` when no tab is selected.
     */
    getSelectedValue(): string | null;
    /**
     * @summary Rebuilds tab roles and selection state.
     */
    refresh(): void;
    /**
     * @summary Injects the style global.
     * @internal
     */
    private ensureStyles;
    /**
     * @summary Initializes the instance identifier.
     * @internal
     */
    private ensureInstanceId;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private observeMutations;
    /**
     * @summary Normalizes existing DL structure (wraps plain text DT/DD).
     * @internal
     */
    private normalizeDl;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private ensureDl;
    /**
     * @summary Returns the tabs source.
     * @returns Return value.
     * @internal
     */
    private getTabs;
    /**
     * @summary Returns the panels source.
     * @returns Return value.
     * @internal
     */
    private getPanels;
    /**
     * @summary API documentation summary.
     * @param tab Parameter.
     * @param label Parameter.
     * @internal
     */
    private setTabLabel;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private update;
    /**
     * @summary API documentation summary.
     * @param index Parameter.
     * @internal
     */
    private dispatchSelectEvent;
    /**
     * @summary API documentation summary.
     * @param index Parameter.
     * @internal
     */
    private dispatchCloseEvent;
    /**
     * @summary API documentation summary.
     * @param fromIndex Parameter.
     * @param toIndex Parameter.
     * @internal
     */
    private dispatchReorderEvent;
    /**
     * @summary API documentation summary.
     * @param event Parameter.
     * @param index Parameter.
     * @param tabs Parameter.
     * @internal
     */
    private handleKey;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-tabs": TpTabs;
    }
    interface HTMLElementEventMap {
        "tp-tabs-select": CustomEvent<TpTabsSelectDetail>;
        "tp-tabs-close": CustomEvent<TpTabsCloseDetail>;
        "tp-tabs-reorder": CustomEvent<TpTabsReorderDetail>;
    }
}
export {};
