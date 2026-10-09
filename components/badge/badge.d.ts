/**
 * @module components/badge
 * @summary Badge component for compact status labels.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
import { TpBase } from "../base/base.js";
import { type TpSizeType, type TpVariantType } from "../base/base.types.js";
/**
 * @summary Compact status label.
 * Colors are derived from the shared `tp.css` semantic tokens.
 * @tagname tp-badge
 * @attr {string} variant = "neutral" - Visual variant (`success`, `danger`, `warning`, `info`, `neutral`, or `brand`).
 * @attr {string} size = "m" - Badge size (`xxs`, `xs`, `s`, `m`, `l`, `xl`, or `xxl`).
 * @attr {boolean} outlined = false - Removes the filled background and uses the accent color for the border and text.
 * @attr {boolean} pill = false - Uses a fully rounded badge shape.
 * @attr {boolean} pulse = false - Makes the badge pulse to attract attention.
 * @cssprop --tp-badge-accent Accent color.
 * @cssprop --tp-badge-background Background color.
 * @cssprop --tp-badge-foreground Text color.
 * @cssprop --tp-badge-border-color Border color.
 * @cssprop --tp-badge-radius Border radius.
 * @cssprop --tp-badge-font-size Font size.
 * @cssprop --tp-badge-padding-block Block padding.
 * @cssprop --tp-badge-padding-inline Inline padding.
 * @example
 * <p>
 *   Build status: <tp-badge variant="success" pulse>Ready</tp-badge>
 *   <tp-badge outlined><tp-icon name="file_type_vite" library="languages"></tp-icon> Vite<tp-divider orientation="vertical"></tp-divider>8.1.5</tp-badge>
 * </p>
 */
export declare class TpBadge extends TpBase {
    /**
     * @summary Component global style ID.
     * @internal
     */
    private static readonly badgeStyleId;
    /**
     * @summary Declares observed attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * @summary Visual variant.
     * @attr variant
     * @default neutral
     */
    get variant(): TpVariantType;
    /**
     * @summary Sets the visual variant.
     * @param value Visual variant.
     */
    set variant(value: TpVariantType);
    /**
     * @summary Badge size.
     * @attr size
     * @default m
     */
    get size(): TpSizeType;
    /**
     * @summary Sets the badge size.
     * @param value Badge size.
     */
    set size(value: TpSizeType);
    /**
     * @summary Whether the badge is outlined.
     * @attr outlined
     * @default false
     */
    get outlined(): boolean;
    /**
     * @summary Sets the outlined state.
     * @param value Outlined state.
     */
    set outlined(value: boolean);
    /**
     * @summary Whether the badge uses a pill shape.
     * @attr pill
     * @default false
     */
    get pill(): boolean;
    /**
     * @summary Sets the pill shape.
     * @param value Pill state.
     */
    set pill(value: boolean);
    /**
     * @summary Whether the badge pulses to attract attention.
     * @attr pulse
     * @default false
     */
    get pulse(): boolean;
    /**
     * @summary Sets the pulse animation state.
     * @param value Pulse state.
     */
    set pulse(value: boolean);
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
     * @summary API documentation summary.
     * @internal
     */
    private updateBadge;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-badge": TpBadge;
    }
}
