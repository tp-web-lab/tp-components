import { TpBase } from "../base/base.js";
import "../button/button.js";
import "../icon/icon.js";
import "../checkbox-list/checkbox-list.js";
import "../radio-list/radio-list.js";
import "../textfield/textfield.js";
import "../numberfield/numberfield.js";
import "../datefield/datefield.js";
import "../timefield/timefield.js";
import "../cluster/cluster.js";
import "../tabs/tabs.js";
import "../html-viewer/html-viewer.js";
/**
 * API reference beside an interactive component preview.
 * @tagname tp-component-viewer
 * @summary API tables and interactive attribute controls for a component preview.
 * @attr {string} tag = "" - Component tag; inferred from supplied HTML when omitted.
 * @attr {string} src = "" - HTML example file, resolved relative to the author document.
 * @attr {string} api-src = "" - Optional component API manifest URL.
 * @example
 * <tp-component-viewer tag="tp-button"></tp-component-viewer>
 */
export declare class TpComponentViewer extends TpBase {
    private inlineSource;
    private source;
    private baseUrl;
    private componentTag;
    private activePanel;
    private api;
    private values;
    private cleared;
    private revision;
    private request;
    private previewObserver;
    private preview;
    static get observedAttributes(): string[];
    get tag(): string;
    set tag(value: string);
    get src(): string;
    set src(value: string);
    get apiSrc(): string;
    set apiSrc(value: string);
    protected connectedCallback(): void;
    protected attributeChangedCallback(name: string): void;
    protected disconnectedCallback(): void;
    private get attributesApi();
    private load;
    private loadApi;
    private choices;
    private render;
    private updatePanel;
    private loadFullApi;
    private apply;
    private syncControls;
    /** Restores documented attribute defaults and restarts the preview. */
    resetDefaults(): void;
    private renderPreview;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-component-viewer": TpComponentViewer;
    }
}
