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
 * The custom `<tp-symbol-picker>` element lets readers browse and select HTML symbols.
 *
 * @summary Lets readers browse and select HTML symbols.
 * @tagname tp-symbol-picker
 * @attr {string} filter = "" - Free-text filter applied to symbol names and metadata.
 * @attr {string} group = "all" - Active symbol group (`all` by default).
 * @attr {string} copy = "symbol" - Clipboard format: `symbol`, `unicode`, `hexadecimal-html`, `decimal-html`, or `html-entity`.
 * @attr {boolean} compact = false - Shows only the title, filters, and a compact 2em symbol grid.
 *
 *
 * @example
 * <tp-symbol-picker></tp-symbol-picker>
 *  @event tp-symbol-picker-select Emitted when a symbol is selected. The detail contains the selection metadata and requested clipboard text; this event does not confirm clipboard success. value is null when the selected copy format has no representation.
 * @eventdetail tp-symbol-picker-select { symbol: string; name: string; group: string; entities: string[]; codepoints: string[]; copy: TpSymbolPickerCopyFormat; value: string | null }
 * @event tp-symbol-picker-copy-error Emitted when copying the selected symbol fails. The detail contains the requested clipboard text, selection metadata and the caught error.
 * @eventdetail tp-symbol-picker-copy-error { symbol: string; name: string; group: string; entities: string[]; codepoints: string[]; copy: TpSymbolPickerCopyFormat; value: string; error: unknown }
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
