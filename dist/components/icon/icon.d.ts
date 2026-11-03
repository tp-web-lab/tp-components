/**
 * @module components/icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
import { TpBase } from "../base/base.js";
/**
 * @summary Displays SVG icons from inline markup, a URL or an icon library, with sizing, color, transforms and fallbacks.
 * @tagname tp-icon
 * @attr {string} name = "" - Icon identifier in the selected library, for example heart or settings. Used when no inline SVG or successfully loaded src is available.
 * @attr {string} library = "tp" - Registry containing name and the first fallback-icon lookup. Built-in libraries: tp, languages, flags, numbers, letters, screens and components. Custom registered libraries are also accepted.
 * @attr {string} src = "" - URL of an SVG file to load. Relative URLs resolve against the containing source document when available, otherwise the page URL. Inline SVG takes precedence; a failed load falls back to name, then the fallback settings.
 * @attr {string} size = "1em" - Base width and height as a CSS length, for example 24px, 2rem or 1.5em. The scale factor multiplies both dimensions; 1em follows the surrounding font size.
 * @attr {string} color = "" - CSS color applied to the SVG and its colorizable fills and strokes, for example red, #2563eb or var(--brand-color). Empty inherits the surrounding text color; explicit fixed SVG colors are preserved.
 * @attr {number} scale = 1 - Positive numeric multiplier for size, for example 0.5 to halve it or 2 to double it. Zero, negative and invalid values use 1. Changes the space occupied by the icon.
 * @attr {string} rotate = "0deg" - Rotation angle: a number is interpreted in degrees; deg, rad and turn units are also accepted. Negative values rotate in the opposite direction. Invalid values use 0deg; spin overrides this fixed rotation.
 * @attr {boolean} flip-h = false - Mirrors the icon horizontally when present. Remove the attribute to restore its orientation; writing false still enables it.
 * @attr {boolean} flip-v = false - Mirrors the icon vertically when present. Can be combined with flip-h and rotate; writing false still enables it.
 * @attr {boolean} spin = false - Continuously rotates the SVG once per second when present, overriding rotate. Respects the reduced-motion preference. Remove the attribute to stop; writing false still enables it.
 * @attr {string} fallback = "" - Plain text displayed only when no SVG can be resolved, including fallback-icon. For example, use ? for an unavailable icon. Empty leaves the reserved icon area blank.
 * @attr {string} fallback-icon = "" - Backup icon identifier used when inline SVG, src and name provide no icon. Looked up in the selected library, then in tp; if unavailable, fallback text is used.
 * @example
 * <tp-icon name="heart" size="3rem" aria-label="Heart"></tp-icon>
 * @cssprop [--tp-icon-size=1em] Width and height of the rendered icon; assigned internally from size multiplied by scale.
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
    private readonly deferredVisibility;
    /**
     * @summary Declares observed attributes.
     * @internal
     */
    static get observedAttributes(): string[];
    /**
     * @summary Icon identifier in the selected library, for example heart or settings. Used when no inline SVG or successfully loaded src is available.
     * @attr name
     */
    get name(): string;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set name(value: string);
    /**
     * @summary Registry containing name and the first fallback-icon lookup. Built-in libraries: tp, languages, flags, numbers, letters, screens and components. Custom registered libraries are also accepted.
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
     * @summary URL of an SVG file to load. Relative URLs resolve against the containing source document when available, otherwise the page URL. Inline SVG takes precedence; a failed load falls back to name, then the fallback settings.
     * @attr src
     */
    get src(): string;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set src(value: string);
    /**
     * @summary Base width and height as a CSS length, for example 24px, 2rem or 1.5em. The scale factor multiplies both dimensions; 1em follows the surrounding font size.
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
     * @summary CSS color applied to the SVG and its colorizable fills and strokes, for example red, #2563eb or var(--brand-color). Empty inherits the surrounding text color; explicit fixed SVG colors are preserved.
     * @attr color
     */
    get color(): string;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set color(value: string);
    /**
     * @summary Positive numeric multiplier for size, for example 0.5 to halve it or 2 to double it. Zero, negative and invalid values use 1. Changes the space occupied by the icon.
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
     * @summary Rotation angle: a number is interpreted in degrees; deg, rad and turn units are also accepted. Negative values rotate in the opposite direction. Invalid values use 0deg; spin overrides this fixed rotation.
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
     * @summary Mirrors the icon horizontally when present. Remove the attribute to restore its orientation; writing false still enables it.
     * @attr flip-h
     */
    get flipH(): boolean;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set flipH(value: boolean);
    /**
     * @summary Mirrors the icon vertically when present. Can be combined with flip-h and rotate; writing false still enables it.
     * @attr flip-v
     */
    get flipV(): boolean;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set flipV(value: boolean);
    /**
     * @summary Continuously rotates the SVG once per second when present, overriding rotate. Respects the reduced-motion preference. Remove the attribute to stop; writing false still enables it.
     * @attr spin
     */
    get spin(): boolean;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set spin(value: boolean);
    /**
     * @summary Plain text displayed only when no SVG can be resolved, including fallback-icon. For example, use ? for an unavailable icon. Empty leaves the reserved icon area blank.
     * @attr fallback
     */
    get fallback(): string;
    /**
     * @summary API documentation summary.
     * @param value Parameter.
     */
    set fallback(value: string);
    /**
     * @summary Backup icon identifier used when inline SVG, src and name provide no icon. Looked up in the selected library, then in tp; if unavailable, fallback text is used.
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
