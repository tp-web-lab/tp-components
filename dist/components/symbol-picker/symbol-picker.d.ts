/**
 * @module components/symbol-picker
 * @summary HTML named-character symbol picker.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-radio-list
 * @summary Transforms a list into a group of radio buttons.
 */
import { TpBase } from "../base/base.js";
import "../radio-list/radio-list.js";
export type TpSymbolPickerItem = {
    symbol: string;
    name: string;
    group: string;
    entities: string[];
    codepoints: string[];
};
export type TpSymbolPickerMetadata = {
    unicode: string;
    hexadecimalHtml: string;
    decimalHtml: string;
    htmlEntity: string | null;
};
export type TpSymbolPickerCopyFormat = "symbol" | "unicode" | "hexadecimal-html" | "decimal-html" | "html-entity";
export declare function getSymbolMetadata(item: TpSymbolPickerItem): TpSymbolPickerMetadata;
export declare function parseHtmlSymbols(source: string): TpSymbolPickerItem[];
/**
 * `<tp-symbol-picker>` browses and copies HTML5 named character references.
 *
 * @summary HTML5 symbol picker.
 * @tagname tp-symbol-picker
 * @attr {string} filter = "" - Free-text filter applied to symbol names and metadata.
 * @attr {string} group = "all" - Active symbol group (`all` by default).
 * @attr {string} copy = "symbol" - Clipboard format: `symbol`, `unicode`, `hexadecimal-html`, `decimal-html`, or `html-entity`.
 * @attr {boolean} compact = false - Shows only the title, filters, and a compact 2em symbol grid.
 * @event tp-symbol-picker-select Emitted after a symbol is selected and copied.
 * @event tp-symbol-picker-copy-error Emitted when the clipboard rejects a copy operation.
 * @example
 * <tp-symbol-picker></tp-symbol-picker>
 */
export declare class TpSymbolPicker extends TpBase {
    private static readonly styleId;
    private static nextId;
    private readonly items;
    private searchInput;
    private groupSelect;
    private countElement;
    private gridElement;
    private selectedSymbolElement;
    private compactSelectedSymbolElement;
    private selectedNameElement;
    private selectedMetadataElements;
    private copyFormatElement;
    static get observedAttributes(): string[];
    get filter(): string;
    set filter(value: string);
    get group(): string;
    set group(value: string);
    get compact(): boolean;
    set compact(value: boolean);
    get copy(): TpSymbolPickerCopyFormat;
    set copy(value: TpSymbolPickerCopyFormat);
    protected connectedCallback(): void;
    protected attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void;
    private ensureStructure;
    private getFilteredItems;
    private render;
    private selectItem;
    private getClipboardValue;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-symbol-picker": TpSymbolPicker;
    }
}
