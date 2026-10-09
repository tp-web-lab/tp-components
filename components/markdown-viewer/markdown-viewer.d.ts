/**
 * @module components/markdown-viewer
 * @summary Interactive Markdown viewer with editable source and parser outputs.
 */
import type { MarkupViewerExample, MarkupViewerMode } from "../markup-viewer/markup-viewer.js";
import { TpMarkupViewer } from "../markup-viewer/markup-viewer.js";
import "../object-tree/object-tree.js";
/** Supported Markdown output views. */
type MdViewerMode = "render" | "html" | "ast";
/**
 * Interactive Markdown viewer component.
 *
 * @tagname tp-markdown-viewer
 * @attr {boolean} lite = false - Uses the compact single-example viewer with rendered HTML output.
 * @attr {string} src = "" - Comma-separated URLs of external Markdown example files.
 * @example
 * <tp-markdown-viewer></tp-markdown-viewer>
 */
export declare class TpMarkdownViewer extends TpMarkupViewer<MdViewerMode> {
    protected readonly sourceLanguage = "markdown";
    protected readonly outputModes: readonly MarkupViewerMode<MdViewerMode>[];
    protected readonly viewerClassName = "tp-markdown-viewer";
    protected readInlineSource(): MarkupViewerExample;
    protected extractExamples(example: MarkupViewerExample): MarkupViewerExample[];
    protected createExternalContext(_url: URL): undefined;
    protected renderOutput(source: string, mode: MdViewerMode, container: HTMLElement): Promise<void>;
}
export {};
