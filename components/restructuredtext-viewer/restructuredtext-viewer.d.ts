/**
 * @module components/restructuredtext-viewer
 * @summary Interactive reStructuredText viewer with editable source and parser outputs.
 */
import type { MarkupViewerExample, MarkupViewerMode } from "../markup-viewer/markup-viewer.js";
import { TpMarkupViewer } from "../markup-viewer/markup-viewer.js";
import "../object-tree/object-tree.js";
/** Supported reStructuredText output views. */
type RstViewerMode = "render" | "html" | "ast";
type RstViewerExample = MarkupViewerExample<URL>;
/**
 * Interactive editor and viewer for one or more reStructuredText examples.
 *
 * Consecutive examples can be declared with `.. example:: Label` blocks.
 *
 * @tagname tp-restructuredtext-viewer
 * @attr {boolean} lite = false - Uses the compact single-example viewer with rendered HTML output.
 * @attr {boolean} doctest = false - Runs standard Python doctest blocks in rendered output.
 * @attr {string} src = "" - Comma-separated URLs of external reStructuredText example files.
 * @example
 * <tp-restructuredtext-viewer></tp-restructuredtext-viewer>
 */
export declare class TpRestructuredTextViewer extends TpMarkupViewer<RstViewerMode, URL> {
    static get observedAttributes(): string[];
    protected readonly sourceLanguage = "restructuredtext";
    protected readonly outputModes: readonly MarkupViewerMode<RstViewerMode>[];
    protected readonly viewerClassName = "tp-restructuredtext-viewer";
    /** Whether rendered standard Python doctest blocks are executed. */
    get doctest(): boolean;
    set doctest(value: boolean);
    protected readInlineSource(): RstViewerExample;
    protected extractExamples(example: RstViewerExample): RstViewerExample[];
    protected createExternalContext(url: URL): URL;
    protected renderOutput(source: string, mode: RstViewerMode, container: HTMLElement, context: URL): Promise<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-restructuredtext-viewer": TpRestructuredTextViewer;
    }
}
export {};
