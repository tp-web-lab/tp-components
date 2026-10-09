/**
 * @module components/icon-picker
 * @summary Icon picker that lists built-in icons from `icon-internal`
 *          and SVG libraries stored in `src/components/icon/icons/`.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-radio-list
 * @summary Transforms a list into a group of radio buttons.
 */
import { TpBase } from "../base/base.js";
import "../icon/icon.js";
import "../radio-list/radio-list.js";
/**
 * Clipboard output generated when an icon is selected.
 *
 * @summary Supported icon picker copy formats.
 */
export type TpIconPickerCopyFormat = "name" | "svg" | "tp-icon" | "tp-icon-button" | "img";
/**
 * `<tp-icon-picker>` lists predefined icons and lets users pick one.
 *
 * The component stays in Light DOM and dispatches `tp-icon-picker-select`
 * when an item is clicked. Clicking also copies the representation selected
 * with `copy` to the clipboard when the Clipboard API is available.
 *
 * @summary Picker for predefined icons.
 * @tagname tp-icon-picker
 * @attr {string} filter = "" - Free-text filter applied to icon names/libraries.
 * @attr {string} library = "all" - Active library filter (`all` by default).
 * @attr {'name'|'svg'|'tp-icon'|'tp-icon-button'|'img'} copy = "name" - Clipboard output format (`name` by default).
 * @attr {boolean} compact = false - Shows only the title, filters, and a compact 2em icon grid.
 * @event tp-icon-picker-select Emitted after an icon is selected.
 * @event tp-icon-picker-copy-error Emitted when the clipboard rejects a copy operation.
 * @example
 * <tp-icon-picker></tp-icon-picker>
 */
export declare class TpIconPicker extends TpBase {
    /**
     * Identifier used for the injected component stylesheet.
     *
     * @summary Global style identifier for the picker component.
     * @internal
     */
    private static readonly styleId;
    private static nextSearchInputId;
    /**
     * All known icon entries rendered by the picker.
     *
     * @summary In-memory list of available icon entries.
     * @internal
     */
    private readonly items;
    /**
     * Input field used for the text filter.
     *
     * @summary Search input element.
     * @internal
     */
    private searchInput;
    /**
     * Select field used for library filtering.
     *
     * @summary Library filter element.
     * @internal
     */
    private librarySelect;
    /**
     * Grid container that holds icon item buttons.
     *
     * @summary Icon grid container.
     * @internal
     */
    private gridElement;
    /**
     * Label displaying the current result count.
     *
     * @summary Result count label.
     * @internal
     */
    private countElement;
    /**
     * Embedded radio list used to choose the clipboard output format.
     *
     * @summary Copy format selector.
     * @internal
     */
    private copyFormatElement;
    /**
     * Read-only field showing the exact clipboard value for the active icon.
     *
     * @summary Clipboard preview field.
     * @internal
     */
    private copyPreviewElement;
    /**
     * Icon currently represented in the clipboard preview.
     *
     * @summary Active preview icon.
     * @internal
     */
    private activeItem;
    /**
     * Last icon explicitly selected by clicking a grid item.
     *
     * @summary Clicked icon shown in the large preview.
     * @internal
     */
    private selectedItem;
    /**
     * Large preview container for the clicked icon.
     *
     * @summary Selected icon preview.
     * @internal
     */
    private selectedPreviewElement;
    private compactSelectedIconElement;
    /**
     * Stable `<tp-icon>` instance used exclusively by the selected preview.
     *
     * @summary Selected icon component.
     * @internal
     */
    private selectedIconElement;
    /**
     * Inputs controlling attributes added to copied `<tp-icon>` markup.
     *
     * @summary Icon attribute controls.
     * @internal
     */
    private iconOptionInputs;
    /**
     * Returns the list of observed attributes.
     *
     * @summary Declares attributes observed by the icon picker.
     */
    static get observedAttributes(): string[];
    get compact(): boolean;
    set compact(value: boolean);
    /**
     * Returns the current text filter.
     *
     * @summary Returns the configured icon text filter.
     */
    get filter(): string;
    /**
     * Updates the current text filter.
     *
     * @summary Sets the icon text filter.
     * @param value Filter text to apply.
     */
    set filter(value: string);
    /**
     * Returns the active library filter.
     *
     * @summary Returns the configured library filter.
     */
    get library(): string;
    /**
     * Updates the active library filter.
     *
     * @summary Sets the active library filter.
     * @param value Library name to apply (`all` for no restriction).
     */
    set library(value: string);
    /**
     * Returns the clipboard output format.
     *
     * @summary Returns the configured copy format.
     */
    get copy(): TpIconPickerCopyFormat;
    /**
     * Updates the clipboard output format.
     *
     * @summary Sets the copy format.
     * @param value Clipboard output format.
     */
    set copy(value: TpIconPickerCopyFormat);
    /**
     * Connects the component and renders the picker UI.
     *
     * @summary Initializes the icon picker component.
     */
    protected connectedCallback(): void;
    /**
     * Reacts to observed attribute changes.
     *
     * @summary Handles filter and library updates.
     * @param name Updated attribute name.
     * @param oldValue Previous value.
     * @param newValue New value.
     */
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * Ensures the static Light-DOM structure exists.
     *
     * @summary Creates picker controls and grid containers.
     * @internal
     */
    private ensureStructure;
    /**
     * Handles text filter input changes.
     *
     * @summary Applies typed search text as component filter.
     * @internal
     */
    private readonly onSearchInput;
    /**
     * Handles library select changes.
     *
     * @summary Applies selected library as component filter.
     * @internal
     */
    private readonly onLibraryChange;
    /**
     * Handles changes from the embedded copy format radio list.
     *
     * @summary Applies the selected clipboard format.
     * @param event Radio-list change event.
     * @internal
     */
    private readonly onCopyFormatChange;
    /**
     * Creates inputs for optional `<tp-icon>` presentation attributes.
     *
     * @summary Builds icon attribute controls.
     * @param idPrefix Unique prefix shared with picker controls.
     * @internal
     */
    private ensureIconOptionControls;
    /**
     * Creates the large preview used for the clicked icon.
     *
     * @summary Builds selected icon visualization.
     * @internal
     */
    private ensureSelectedPreview;
    /**
     * Renders the last clicked icon at a larger size.
     *
     * @summary Updates selected icon visualization.
     * @internal
     */
    private renderSelectedPreview;
    /**
     * Updates the code field and visual previews after an option changes.
     *
     * @summary Handles icon attribute input.
     * @internal
     */
    private readonly onIconOptionInput;
    /**
     * Reads values from the icon attribute controls.
     *
     * @summary Returns configured icon presentation options.
     * @returns Current option values.
     * @internal
     */
    private getIconOptions;
    /**
     * Applies configured presentation options only to the selected `<tp-icon>`.
     *
     * @summary Refreshes the selected icon preview.
     * @internal
     */
    private applyIconOptionsToPreviews;
    /**
     * Synchronizes the embedded selector and clipboard preview.
     *
     * @summary Refreshes copy controls from component state.
     * @internal
     */
    private syncCopyControls;
    /**
     * Computes the filtered icon list using current component filters.
     *
     * @summary Returns icon entries visible with current filters.
     * @returns Filtered icon entries.
     * @internal
     */
    private getFilteredItems;
    /**
     * Returns all known library names from available icon entries.
     *
     * @summary Lists available icon library values.
     * @returns Sorted library names.
     * @internal
     */
    private getLibraries;
    /**
     * Re-renders select options, counters, and icon item cards.
     *
     * @summary Renders the icon picker UI from current state.
     * @internal
     */
    private render;
    /**
     * Renders library options in the select control.
     *
     * @summary Updates library filter select options.
     * @param libraries Available library names.
     * @internal
     */
    private renderLibraryOptions;
    /**
     * Creates one clickable icon item card.
     *
     * @summary Builds one grid item for an icon entry.
     * @param item Icon entry to render.
     * @returns Clickable button representing the icon.
     * @internal
     */
    private createItemButton;
    /**
     * Builds the clipboard value for an icon and format.
     *
     * @summary Serializes an icon for clipboard output.
     * @param item Selected icon.
     * @param format Requested output format.
     * @returns Text to copy.
     * @internal
     */
    private getClipboardValue;
    /**
     * Copies the selected icon representation when supported.
     *
     * @summary Copies the selected icon to clipboard.
     * @param item Selected icon.
     * @param format Clipboard output format.
     * @param value Text to copy.
     * @returns Promise resolved when copy attempt completes.
     * @internal
     */
    private copyToClipboard;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-icon-picker": TpIconPicker;
    }
}
