/**
 * @module components/markup-viewer
 * @summary Shared foundation for interactive markup viewers.
 */
import { TpBase } from "../base/base.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import "../code-editor/code-editor.js";
import "../divider/divider.js";
import "../icon/icon.js";
import "../icon-button/icon-button.js";
import "../switcher/switcher.js";
/** Pane layouts supported by every markup viewer. */
export type MarkupViewerLayout = "both" | "source" | "output";
/** Description of an output mode exposed by a markup viewer. */
export interface MarkupViewerMode<TMode extends string> {
    /** Stable value used by the mode selector. */
    value: TMode;
    /** Human-readable selector label. */
    label: string;
}
/** One named source example and its language-specific rendering context. */
export interface MarkupViewerExample<TContext = undefined> {
    label: string;
    source: string;
    context: TContext;
}
/**
 * Abstract base class for interactive source/output markup viewers.
 *
 * It owns the common user interface and editing workflow. Concrete viewers
 * provide language-specific source extraction, example discovery, and output
 * rendering.
 *
 * @summary Shared implementation for markup viewer components.
 */
export declare abstract class TpMarkupViewer<TMode extends string, TContext = undefined> extends TpBase {
    private renderToken;
    /** Current source editor, including while its pane is hidden. */
    private responseEditor;
    /** Renders a snapshot without changing the visible preview. */
    private renderResponse;
    /** Restores the selected example's initial source. */
    private resetResponse;
    /** Returns the current editable source, including unsaved preview changes. */
    getValue(): string;
    /** Restores the selected example and refreshes its preview. */
    reset(): void;
    /** Creates an independent HTML document from the current source for testing. */
    createRenderedDocument(): Promise<string>;
    private iframeMutationObserver;
    private iframeResizeObserver;
    private iframeVisibilityObserver;
    private iframeOverlayBridge;
    private iframeSyncFrame;
    /** Code editor language used for the source pane. */
    protected abstract readonly sourceLanguage: string;
    /** Output modes offered by the viewer. The first mode is selected initially. */
    protected abstract readonly outputModes: readonly MarkupViewerMode<TMode>[];
    /** CSS class added to the concrete viewer host. */
    protected abstract readonly viewerClassName: string;
    /** Whether initial source capture must wait for nested elements to initialize. */
    protected readonly deferInitialRender: boolean;
    static get observedAttributes(): string[];
    /** Uses the compact, single-example viewer interface. */
    get lite(): boolean;
    set lite(value: boolean);
    /** URL or comma-separated URLs of external source examples. */
    get src(): string;
    set src(value: string);
    protected connectedCallback(): void;
    protected attributeChangedCallback(): void;
    /** Reads and normalizes source declared inside the component. */
    protected abstract readInlineSource(): Promise<MarkupViewerExample<TContext>> | MarkupViewerExample<TContext>;
    /**
     * Extracts named examples from one source document.
     *
     * The default implementation treats the document as a single example.
     */
    protected extractExamples(example: MarkupViewerExample<TContext>): MarkupViewerExample<TContext>[];
    /** Creates context associated with an externally loaded source file. */
    protected abstract createExternalContext(url: URL): Promise<TContext> | TContext;
    /** Renders one output mode into the output panel. */
    protected abstract renderOutput(source: string, mode: TMode, container: HTMLElement, context: TContext): Promise<void>;
    /** Called when the viewer is disconnected, for language-specific cleanup. */
    protected disposeViewer(): void;
    /** Synchronizes a code editor height after DOM and layout updates. */
    protected resyncEditorHeight(editor: TpCodeEditor): void;
    /** Returns the source used by Reset for an initialized example. */
    protected getResetSource(example: MarkupViewerExample<TContext>): string;
    /** Requests a complete reload after programmatic source changes. */
    protected requestViewerRender(): void;
    protected disconnectedCallback(): void;
    private renderViewer;
    /**
     * Recreates rendered scripts so the browser executes them when explicitly
     * allowed. Scripts produced through `innerHTML` are otherwise inert.
     */
    private activateOutputScripts;
    private initializeOutputIframe;
    private observeIframeDocument;
    private scheduleIframeHeightSync;
    private disconnectIframeResizeObserver;
    private createViewerMarkup;
    private readMode;
    protected loadExamples(): Promise<MarkupViewerExample<TContext>[]>;
}
