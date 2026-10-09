/**
 * @module components/emoji-picker
 * @summary Unicode Emoji 17.0 picker.
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
export type TpEmojiPickerItem = {
    emoji: string;
    name: string;
    group: string;
    subgroup: string;
    version: string;
    codepoints: string[];
};
export type TpEmojiPickerMetadata = {
    unicode: string;
    hexadecimalHtml: string;
    decimalHtml: string;
    htmlEntity: string | null;
};
export type TpEmojiPickerCopyFormat = "emoji" | "unicode" | "hexadecimal-html" | "decimal-html" | "html-entity";
export declare function getEmojiMetadata(item: TpEmojiPickerItem): TpEmojiPickerMetadata;
/**
 * Parses the official Unicode `emoji-test.txt` format.
 *
 * @summary Parses fully-qualified RGI emoji and standalone components.
 * @param source Unicode Emoji test data.
 * @returns Emoji entries in CLDR order.
 */
export declare function parseEmojiTestData(source: string): TpEmojiPickerItem[];
/**
 * `<tp-emoji-picker>` browses and copies the RGI emoji defined by Unicode
 * Emoji 17.0. Names and group order come from the official test data.
 *
 * @summary Unicode Emoji 17.0 picker.
 * @tagname tp-emoji-picker
 * @attr {string} filter = "" - Free-text filter applied to emoji names and metadata.
 * @attr {string} group = "all" - Active Unicode emoji group (`all` by default).
 * @attr {string} copy = "emoji" - Clipboard format: `emoji`, `unicode`, `hexadecimal-html`, `decimal-html`, or `html-entity`.
 * @attr {boolean} compact = false - Shows only the title, filters, and a compact 2em glyph grid.
 * @event tp-emoji-picker-select Emitted after an emoji is selected and copied.
 * @event tp-emoji-picker-copy-error Emitted when the clipboard rejects a copy operation.
 * @example
 * <tp-emoji-picker></tp-emoji-picker>
 */
export declare class TpEmojiPicker extends TpBase {
    static readonly unicodeVersion = "17.0";
    private static readonly styleId;
    private static nextId;
    private readonly items;
    private searchInput;
    private groupSelect;
    private countElement;
    private gridElement;
    private selectedEmojiElement;
    private compactSelectedEmojiElement;
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
    get copy(): TpEmojiPickerCopyFormat;
    set copy(value: TpEmojiPickerCopyFormat);
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
        "tp-emoji-picker": TpEmojiPicker;
    }
}
