/**
 * @module components/component-viewer
 * @summary API tables and interactive attribute controls for a component preview.
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
 * @tp-dependency tp-checkbox-list
 * @summary Transforms a list into a group of checkboxes.
 */
/**
 * @tp-dependency tp-cluster
 * @summary Flexible cluster layout component.
 */
/**
 * @tp-dependency tp-code-editor
 * @summary CodeMirror-based code editor component.
 */
/**
 * @tp-dependency tp-datefield
 * @summary Native date field with labels, constraints, picker access, and clearing.
 */
/**
 * @tp-dependency tp-html-viewer
 * @summary Interactive HTML viewer with editable source, live rendering, and DOM inspection.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-markdown
 * @summary Markdown rendering component.
 */
/**
 * @tp-dependency tp-numberfield
 * @summary Numeric field with an optional native range slider.
 */
/**
 * @tp-dependency tp-radio-list
 * @summary Transforms a list into a group of radio buttons.
 */
/**
 * @tp-dependency tp-tabs
 * @summary Accessible tabs component with keyboard and reorder support.
 */
/**
 * @tp-dependency tp-textfield
 * @summary Single-line and automatically growing multiline text field.
 */
/**
 * @tp-dependency tp-timefield
 * @summary Native time field with labels, constraints, picker access, and clearing.
 */
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
import "../icon-button/icon-button.js";
import "../code-editor/code-editor.js";
/**
 * The custom `<tp-component-viewer>` element documents a component and lets readers try its attributes on a live example.
 *
 * @tagname tp-component-viewer
 * @summary Documents a component and lets readers try its attributes on a live example.
 * @attr {string} tag = "" - Component tag; inferred from supplied HTML when omitted.
 * @attr {string} src = "" - HTML example file, resolved relative to the author document.
 * @attr {string} api-src = "" - Optional component API manifest URL.
 * @example
 * <tp-component-viewer tag="tp-button"></tp-component-viewer>
 */
export declare class TpComponentViewer extends TpBase {
    private inlineSource;
    private source;
    private contentOverride;
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
    private pendingPreviewValues;
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
    /** Serialize author content with current public attributes, excluding generated DOM. */
    private configuredDocument;
    private syncSource;
    private syncButtonInteractions;
    private renderPreview;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-component-viewer": TpComponentViewer;
    }
}
