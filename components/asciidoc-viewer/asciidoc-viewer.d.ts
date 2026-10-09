/**
 * @module components/asciidoc-viewer
 * @summary Interactive AsciiDoc viewer with editable source and parser outputs.
 */
import type { MarkupViewerExample, MarkupViewerMode } from "../markup-viewer/markup-viewer.js";
import { TpMarkupViewer } from "../markup-viewer/markup-viewer.js";
import "../object-tree/object-tree.js";
/** Supported AsciiDoc output views. */
type AdocViewerMode = "render" | "html" | "ast";
/**
 * Interactive editor and viewer for one or more AsciiDoc examples.
 *
 * @tagname tp-asciidoc-viewer
 * @attr {boolean} lite = false - Uses the compact single-example viewer with rendered HTML output.
 * @attr {string} src = "" - Comma-separated URLs of external AsciiDoc example files.
 * @example
 * <tp-asciidoc-viewer></tp-asciidoc-viewer>
 */
export declare class TpAsciidocViewer extends TpMarkupViewer<AdocViewerMode> {
    protected readonly sourceLanguage = "asciidoc";
    protected readonly outputModes: readonly MarkupViewerMode<AdocViewerMode>[];
    protected readonly viewerClassName = "tp-asciidoc-viewer";
    protected readInlineSource(): MarkupViewerExample;
    protected extractExamples(example: MarkupViewerExample): MarkupViewerExample[];
    protected createExternalContext(_url: URL): undefined;
    protected renderOutput(source: string, mode: AdocViewerMode, container: HTMLElement): Promise<void>;
}
export {};
