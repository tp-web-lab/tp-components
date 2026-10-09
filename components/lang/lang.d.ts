/**
 * @module components/lang
 * @summary Documentation language selector.
 */
import "../dropdown/dropdown.js";
import "../icon/icon.js";
import "../icon-button/icon-button.js";
import "../divider/divider.js";
import { TpBase } from "../base/base.js";
import { type TpSizeType, type TpVariantType } from "../base/base.types.js";
/**
 * `<tp-lang>` selects the documentation language and updates the nearest multi-page documentation shell.
 *
 * @summary Documentation language selector.
 * @tagname tp-lang
 * @attr {string} langs = "en" - Comma-separated language codes.
 * @attr {string} repository = "" - Documentation repository root.
 * @attr {string} variant = "neutral" - Icon button variant.
 * @attr {string} size = "m" - Icon button size.
 * @attr {boolean} disabled = false - Disables the language trigger.
 *
 *
 * @event tp-lang-change Emitted when the selected documentation language changes.
 * @eventdetail tp-lang-change { choice: string; lang: string; repository: string; anchor: null; target: HTMLElement | null }
 * @example
 * <tp-lang></tp-lang>
 */
export declare class TpLang extends TpBase {
    private static readonly dropdownPlacement;
    private static readonly changeEventName;
    private static nextControlId;
    private anchorId;
    private controlEl;
    private dropdownEl;
    static get observedAttributes(): string[];
    get langs(): string;
    set langs(value: string);
    get repository(): string;
    set repository(value: string);
    get variant(): TpVariantType;
    set variant(value: TpVariantType);
    get size(): TpSizeType;
    set size(value: TpSizeType);
    get disabled(): boolean;
    set disabled(value: boolean);
    protected connectedCallback(): void;
    protected disconnectedCallback(): void;
    protected attributeChangedCallback(): void;
    private ensureControl;
    private ensureControlId;
    private renderOptions;
    private updateControl;
    private readLangs;
    private resolveCurrentLang;
    private readLangFromPath;
    private resolveAutoLang;
    private repositoryForLang;
    private resolveRepositoryBase;
    private resolveRepositoryPathSegments;
    private stripLangSegment;
    private readHostRepository;
    private selectLang;
    private emitChange;
    private updateUrlForRepository;
    private resolveMarkdownDoc;
    private handleControlClick;
    private handleLangItemClick;
    private handleLangItemKeyDown;
    private handleLocationChange;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-lang": TpLang;
    }
}
