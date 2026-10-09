/**
 * @module components/icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
import { TpBase } from "../base/base.js";
/**
 * @summary API documentation summary.
 * @tagname tp-icon
 * @attr {string} name = "" - Attribute `name`.
 * @attr {string} library = "tp" - Attribute `library`.
 * @attr {string} src = "" - Attribute `src`.
 * @attr {string} size = "1em" - Attribute `size`.
 * @attr {string} color = "" - Attribute `color`.
 * @attr {number} scale = 1 - Attribute `scale`.
 * @attr {string} rotate = "0deg" - Attribute `rotate`.
 * @attr {boolean} flip-h = false - Attribute `flip-h`.
 * @attr {boolean} flip-v = false - Attribute `flip-v`.
 * @attr {boolean} spin = false - Attribute `spin`.
 * @attr {string} fallback = "" - Attribute `fallback`.
 * @attr {string} fallback-icon = "" - Attribute `fallback-icon`.
 * @cssprop [--tp-icon-size=1em] CSS custom property.
 * @example
 * <tp-icon></tp-icon>
 */
export declare class TpIcon extends TpBase {
    /**
     * @summary Component global style ID.
     * @internal
     */
    private static readonly styleId;
    /**
     * @summary Internal rendering container.
     * @internal
     */
    private container;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private requestId;
    /**
     * @summary Declares observed attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * @summary API documentation summary.
     * @attr name
     */
    get name(): string;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set name(value: string);
    /**
     * @summary API documentation summary.
     * @attr library
     * @default tp
     */
    get library(): string;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set library(value: string);
    /**
     * @summary API documentation summary.
     * @attr src
     */
    get src(): string;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set src(value: string);
    /**
     * @summary API documentation summary.
     * @attr size
     * @default 1em
     */
    get size(): string;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set size(value: string);
    /**
     * @summary API documentation summary.
     * @attr color
     */
    get color(): string;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set color(value: string);
    /**
     * @summary API documentation summary.
     * @attr scale
     * @default 1
     */
    get scale(): number;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set scale(value: number);
    /**
     * @summary API documentation summary.
     * @attr rotate
     * @default 0deg
     */
    get rotate(): string;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set rotate(value: string);
    /**
     * @summary API documentation summary.
     * @attr flip-h
     */
    get flipH(): boolean;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set flipH(value: boolean);
    /**
     * @summary API documentation summary.
     * @attr flip-v
     */
    get flipV(): boolean;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set flipV(value: boolean);
    /**
     * @summary API documentation summary.
     * @attr spin
     */
    get spin(): boolean;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set spin(value: boolean);
    /**
     * @summary API documentation summary.
     * @attr fallback
     */
    get fallback(): string;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set fallback(value: string);
    /**
     * @summary API documentation summary.
     * @attr fallback-icon
     */
    get fallbackIcon(): string;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set fallbackIcon(value: string);
    private readonly handleIconLibraryChange;
    /**
     * @summary API documentation summary.
     * @internal
     */
    protected connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * @summary API documentation summary.
     * @internal
     */
    protected attributeChangedCallback(): void;
    /**
     * @summary API documentation summary.
     * @returns Return value.
     * @internal
     */
    private update;
    /**
     * @summary API documentation summary.
     * @returns Return value.
     * @internal
     */
    private resolve;
    private resolveFallbackIcon;
    /**
     * @summary API documentation summary.
     * @returns Return value.
     * @internal
     */
    private getInlineSvg;
    /**
     * @summary API documentation summary.
     * @param src Parameter.
     * @returns Return value.
     * @internal
     */
    private fetchSvg;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private renderFallback;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private applyStyle;
    /**
     * Applies the `color` attribute to visible SVG paint while preserving
     * definitions such as masks, gradients, and clipping paths.
     *
     * @summary Colors the rendered SVG when an explicit icon color is set.
     * @param color Any valid CSS color, including custom-property expressions.
     * @internal
     */
    private applyColorToSvg;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private ensureContainer;
    /**
     * @summary API documentation summary.
     * @internal
     */
    private ensureStyles;
}
/**
 * @summary API documentation summary.
 * @internal
 */
declare global {
    interface HTMLElementTagNameMap {
        "tp-icon": TpIcon;
    }
}
