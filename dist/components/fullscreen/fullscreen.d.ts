/**
 * @module components/fullscreen
 * @summary Fullscreen controller button.
 */
import "../icon-button/icon-button.js";
import { TpBase } from "../base/base.js";
import { type TpSizeType, type TpVariantType } from "../base/base.types.js";
/**
 * `<tp-fullscreen>` toggles fullscreen mode for an anchored or containing element.
 *
 * @summary Fullscreen controller button.
 * @tagname tp-fullscreen
 * @attr {string} anchor = "" - CSS selector of the element to toggle fullscreen.
 * @attr {string} variant = "neutral" - Icon button variant.
 * @attr {string} size = "m" - Icon button size.
 * @attr {boolean} disabled = false - Disables the fullscreen trigger.
 *
 * @event tp-fullscreen-change Emitted when the fullscreen state of the controlled target changes.
 * @eventdetail tp-fullscreen-change { fullscreen: boolean; anchor: string; target: HTMLElement }
 * @example
 * <tp-fullscreen></tp-fullscreen>
 */
export declare class TpFullscreen extends TpBase {
    private static readonly changeEventName;
    static get observedAttributes(): string[];
    private controlEl;
    private fullscreenTarget;
    private addedThemeClass;
    private lastFullscreenTarget;
    private lastFullscreenState;
    get anchor(): string;
    set anchor(value: string);
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
    private updateControl;
    private toggleFullscreen;
    private resolveFullscreenTarget;
    private resolveAnchoredTarget;
    private resolveContainingTarget;
    private handleControlClick;
    private handleFullscreenChange;
    private prepareFullscreenTarget;
    private cleanupFullscreenTarget;
    private emitChange;
    private resolveEffectiveTheme;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-fullscreen": TpFullscreen;
    }
}
