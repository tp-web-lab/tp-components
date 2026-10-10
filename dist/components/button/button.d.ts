/**
 * @module components/button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
import { type TpSizeType, type TpVariantType } from "../base/base.types.js";
/**
 * @summary API documentation summary.
 */
export type TpButtonNativeType = "button" | "submit" | "reset";
/**
 * @summary API documentation summary.
 */
export type TpButtonLoadingMode = "replace" | "inline";
/**
 * @summary an action button or navigation link with shared sizes, variants and loading states.
 * @tagname tp-button
 * @attr {string} variant = "neutral" - Attribute `variant`.
 * @attr {string} size = "m" - Attribute `size`.
 * @attr {string} type = "button" - Attribute `type`.
 * @attr {boolean} outlined = false - Attribute `outlined`.
 * @attr {boolean} pill = false - Attribute `pill`.
 * @attr {boolean} disabled = false - Attribute `disabled`.
 * @attr {boolean} loading = false - Attribute `loading`.
 * @attr {string} href = "" - Attribute `href`.
 * @attr {string} target = "" - Attribute `target`.
 * @attr {string} rel = "" - Attribute `rel`.
 * @attr {string} download = "" - Attribute `download`.
 * @event click Event.
 * Colors are derived from the shared `tp.css` semantic tokens.
 * @accessibility Uses a native `button` or `a` element according to the configured action.
 * @accessibility Exposes disabled and loading states to assistive technology.
 * @accessibilityresponsibility Provide visible text that describes the action or destination.
 * @keyboard {Enter / Space} Uses the browser's native button activation behavior.
 * @example
 * <tp-button href="/#/components/button/index.md#usage">Read the usage guide</tp-button>
 */
export declare class TpButton extends TpBase {
    /**
     * @summary Global style ID.
     * @internal
     */
    private static readonly buttonStyleId;
    /**
     * @summary Reference to the element interactif internal.
     * @internal
     */
    private controlEl;
    /**
     * @summary Reference to the content container.
     * @internal
     */
    private contentEl;
    /**
     * @summary Observes late children added while the HTML parser is still running.
     * @internal
     */
    private childObserver;
    /**
     * @summary Prevents observer feedback while moving nodes into the internal control.
     * @internal
     */
    private isSyncingLightDomContent;
    /**
     * @summary Reference to the indicateur for loading.
     * @internal
     */
    /**
     * @summary Declares observed attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * @summary API documentation summary.
     * @attr variant
     * @default neutral
     */
    get variant(): TpVariantType;
    set variant(value: TpVariantType);
    /**
     * @summary API documentation summary.
     * @attr size
     * @default m
     */
    get size(): TpSizeType;
    set size(value: TpSizeType);
    /**
     * @summary API documentation summary.
     * @attr type
     * @default button
     */
    get type(): TpButtonNativeType;
    set type(value: TpButtonNativeType);
    /**
     * @summary API documentation summary.
     * @attr outlined
     */
    get outlined(): boolean;
    set outlined(value: boolean);
    /**
     * @summary API documentation summary.
     * @attr pill
     */
    get pill(): boolean;
    set pill(value: boolean);
    /**
     * @summary API documentation summary.
     * @attr disabled
     */
    get disabled(): boolean;
    set disabled(value: boolean);
    /**
     * @summary API documentation summary.
     * @attr loading
     */
    get loading(): boolean;
    set loading(value: boolean);
    /**
     * @summary API documentation summary.
     * @attr loading-mode
     * @default replace
     */
    get loadingMode(): TpButtonLoadingMode;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set loadingMode(value: TpButtonLoadingMode);
    /**
     * @summary API documentation summary.
     * @attr href
     */
    get href(): string;
    set href(value: string);
    /**
     * @summary API documentation summary.
     * @attr target
     */
    get target(): string;
    set target(value: string);
    /**
     * @summary API documentation summary.
     * @attr rel
     */
    get rel(): string;
    set rel(value: string);
    /**
     * @summary API documentation summary.
     * @attr download
     */
    get download(): string;
    set download(value: string);
    /**
     * @summary API documentation summary.
     * @returns Return value.
     * @internal
     */
    private get isLink();
    /**
     * @summary Regroup `disabled` and `loading`.
     * @returns Return value.
     * @internal
     */
    private get isBlocked();
    /**
     * @summary API documentation summary.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * @summary API documentation summary.
     * @param _name Parameter.
     * @param oldValue Parameter.
     * @param newValue Parameter.
     * @internal
     */
    protected attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * @summary Observes direct children added after the internal control has been created.
     * @internal
     */
    private observeLightDomContent;
    /**
     * @summary Moves late content into the rendered native control.
     * @internal
     */
    private syncLightDomContent;
    /**
     * @summary Updates the user-facing source used by help and HTML viewer.
     * @internal
     */
    private updateHelpSource;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private ensureControl;
    /**
     * @summary Replaces the element interactif internal.
     * @param nextControl Parameter.
     * @internal
     */
    private replaceControl;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private ensureInnerStructure;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private updateButton;
    /**
     * @summary API documentation summary.
     * @param button Parameter.
     * @internal
     */
    private updateNativeButton;
    /**
     * @summary API documentation summary.
     * @param anchor Parameter.
     * @internal
     */
    private updateNativeLink;
    /**
     * @summary API documentation summary.
     * @param control Parameter.
     * @internal
     */
    private updateLoadingState;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-button": TpButton;
    }
}
