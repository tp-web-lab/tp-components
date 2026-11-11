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
 * The custom `<tp-lang>` element provides a documentation language selector.
 *
 * @summary Provides a documentation language selector.
 * @tagname tp-lang
 * @attr {string} langs = "en" - Comma-separated language codes.
 * @attr {string} repository = "" - Documentation repository root.
 * @attr {string} variant = "neutral" - Color variant forwarded to the trigger icon button: neutral, brand, success, danger, warning or info.
 * @attr {string} size = "m" - Size preset forwarded to the trigger icon button: xxs, xs, s, m, l, xl or xxl.
 * @attr {boolean} disabled = false - Disables the language trigger.
 *
 *
 * @event tp-lang-change Emitted when the selected documentation language changes.
 * @eventdetail tp-lang-change { choice: string; lang: string; repository: string; anchor: null; target: HTMLElement | null }
 * @example
 * <tp-box data-intro-action="lang" data-allow-script="">
 *   <p>Choose English or French to change the message in this isolated example.</p>
 *   <tp-lang langs="en,fr" repository="/docs/components/lang/examples"></tp-lang>
 *   <h2 data-demo-translation="">Welcome to this example.</h2>
 *   <script src="/docs/components/_shared/introduction-actions.js"></script>
 * </tp-box>
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
    private resolveSinglePage;
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
