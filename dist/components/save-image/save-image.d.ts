/**
 * @module components/save-image
 * @summary Downloads an anchored image as SVG, PNG or WebP.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Dropdown menu component.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
import { TpBase } from "../base/base.js";
import { type TpSizeType, type TpVariantType } from "../base/base.types.js";
import "../dropdown/dropdown.js";
import "../icon-button/icon-button.js";
import "../icon/icon.js";
export type TpSaveImageFormat = "svg" | "png" | "webp";
/**
 * Image download controller with an embedded dropdown.
 *
 * @summary Saves an anchored image in several formats.
 * @tagname tp-save-image
 * @attr {string} anchor = "" - CSS selector of the image or exportable component.
 * @attr {string} name = "image-download" - Icon used by the trigger.
 * @attr {string} filename = "image" - Download filename without its extension.
 * @attr {string} variant = "neutral" - Color variant forwarded to the trigger icon button: neutral, brand, success, danger, warning or info.
 * @attr {string} size = "m" - Size preset forwarded to the trigger icon button: xxs, xs, s, m, l, xl or xxl.
 * @attr {boolean} disabled = false - Disables the trigger.
 * @event tp-save-image-save Emitted after an image has been prepared for download.
 * @eventdetail tp-save-image-save { format: "svg" | "png" | "webp"; filename: string; anchor: string; target: Element }
 * @event tp-save-image-error Emitted when the target cannot be exported.
 * @eventdetail tp-save-image-error { format: "svg" | "png" | "webp"; error: unknown; anchor: string }
 * @example
 * <tp-save-image></tp-save-image>
 */
export declare class TpSaveImage extends TpBase {
    private static readonly styleId;
    private static nextId;
    private dropdownEl;
    private currentFormat;
    static get observedAttributes(): string[];
    get anchor(): string;
    set anchor(value: string);
    get name(): string;
    set name(value: string);
    get filename(): string;
    set filename(value: string);
    get variant(): TpVariantType;
    set variant(value: TpVariantType);
    get size(): TpSizeType;
    set size(value: TpSizeType);
    get disabled(): boolean;
    set disabled(value: boolean);
    protected connectedCallback(): void;
    protected attributeChangedCallback(): void;
    /**
     * @summary Saves the anchored image or exportable component as svg, png or webp using filename. Resolves after saving or cancellation; unsupported formats and missing targets reject.
     */
    save(format: TpSaveImageFormat): Promise<void>;
    private ensureControl;
    private syncCurrentFormat;
    private readonly handleTriggerClick;
    private resolveTarget;
    private createSvg;
    private createRaster;
    private svgSize;
    private canvasBlob;
    private imageSize;
    private safeFilename;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-save-image": TpSaveImage;
    }
}
