/** @module components/screen
 * @summary Responsive page preview in selectable device viewports.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-iframe
 * @summary Controlled iframe component.
 */
/**
 * @tp-dependency tp-menu
 * @summary Accessible menu component.
 */
/**
 * @tp-dependency tp-modal
 * @summary Modal overlay component.
 */
import { TpBase } from "../base/base.js";
import { type TpSizeType, type TpVariantType } from "../base/base.types.js";
import "../icon-button/icon-button.js";
import "../button/button.js";
import "../menu/menu.js";
import "../modal/modal.js";
import "../iframe/iframe.js";
export type TpScreenDevice = "phone-portrait" | "phone-landscape" | "tablet-portrait" | "tablet-landscape" | "laptop" | "desktop" | "default" | "16:9" | "3:2" | "4:3" | "1:1" | "3:4" | "2:3" | "9:16";
export declare const TP_SCREEN_DEVICES: {
    readonly "phone-portrait": {
        readonly label: "Phone portrait";
        readonly width: 390;
        readonly height: 844;
    };
    readonly "phone-landscape": {
        readonly label: "Phone landscape";
        readonly width: 844;
        readonly height: 390;
    };
    readonly "tablet-portrait": {
        readonly label: "Tablet portrait";
        readonly width: 768;
        readonly height: 1024;
    };
    readonly "tablet-landscape": {
        readonly label: "Tablet landscape";
        readonly width: 1024;
        readonly height: 768;
    };
    readonly laptop: {
        readonly label: "Laptop";
        readonly width: 1366;
        readonly height: 768;
    };
    readonly desktop: {
        readonly label: "Desktop";
        readonly width: 1920;
        readonly height: 1080;
    };
    readonly default: {
        readonly label: "default";
        readonly width: 0;
        readonly height: 0;
    };
    readonly "16:9": {
        readonly label: "16:9";
        readonly width: 16;
        readonly height: 9;
    };
    readonly "3:2": {
        readonly label: "3:2";
        readonly width: 3;
        readonly height: 2;
    };
    readonly "4:3": {
        readonly label: "4:3";
        readonly width: 4;
        readonly height: 3;
    };
    readonly "1:1": {
        readonly label: "1:1";
        readonly width: 1;
        readonly height: 1;
    };
    readonly "3:4": {
        readonly label: "3:4";
        readonly width: 3;
        readonly height: 4;
    };
    readonly "2:3": {
        readonly label: "2:3";
        readonly width: 2;
        readonly height: 3;
    };
    readonly "9:16": {
        readonly label: "9:16";
        readonly width: 9;
        readonly height: 16;
    };
};
/**
 * @tagname tp-screen
 * @summary Previews and applies absolute device sizes or relative aspect ratios to the page.
 * @attr {TpScreenDevice} device = "default" - Device preset in CSS pixels, or a ratio fitted to the available preview area.
 * @attr {string} src = "" - Page URL to preview; empty uses the current document URL, including its route.
 * @attr {boolean} disabled = false - Disables and closes the preview.
 * @attr {TpVariantType} variant = "neutral" - Trigger color variant.
 * @attr {TpSizeType} size = "m" - Trigger size.
 * @event tp-screen-confirm Emitted after OK applies the selected format.
 * @eventdetail tp-screen-confirm { device: string }
 * @event tp-screen-change Emitted when the preview opens or its viewport changes.
 * @eventdetail tp-screen-change { device: string; width: number; height: number }
 * @keyboard {Enter / Space} Opens the focused preview button or selects a focused device.
 * @keyboard {Escape} Cancels the chooser; from an applied page, restores the original window.
 * @example
 * <tp-screen src="/docs/components/screen/examples/responsive.html"></tp-screen>
 */
export declare class TpScreen extends TpBase {
    static get observedAttributes(): string[];
    get device(): TpScreenDevice;
    set device(value: TpScreenDevice);
    get src(): string;
    set src(value: string);
    get disabled(): boolean;
    set disabled(value: boolean);
    get variant(): TpVariantType;
    set variant(value: TpVariantType);
    get size(): TpSizeType;
    set size(value: TpSizeType);
    private modal;
    private frame;
    private stage;
    private viewport;
    private status;
    private observer;
    private previewDocument;
    private nested;
    private sourceError;
    private draftDevice;
    private appliedDevice;
    private editing;
    private confirmed;
    private frameElement;
    protected connectedCallback(): void;
    protected attributeChangedCallback(name: string): void;
    private renderTrigger;
    private readonly updateWindowTitle;
    private readonly syncNestedMode;
    /** Opens the format chooser, keeping the current applied page alive. */
    show(): void;
    /** Cancels the tentative choice and restores the last confirmed format. */
    close(): void;
    /** Confirms the tentative format, or restores the original page for default. */
    confirm(): void;
    private showApplied;
    private reset;
    private createPreview;
    private loadPage;
    private readonly escapePreview;
    private updateDevice;
    private readonly fitPreview;
    private disposeFrame;
    disconnectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-screen": TpScreen;
    }
}
