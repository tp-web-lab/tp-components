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
 * The custom `<tp-asciidoc-viewer>` element provides an interactive AsciiDoc viewer with editable source and parser outputs.
 *
 * @summary Provides an interactive AsciiDoc viewer with editable source and parser outputs.
 * @tagname tp-asciidoc-viewer
 * @attr {boolean} lite = false - Uses the compact single-example viewer with rendered HTML output.
 * @attr {string} src = "" - Comma-separated URLs of external AsciiDoc example files.
 * @example
 * <tp-asciidoc-viewer>
 *         <script type="tp/asciidoc">
 *           = Live AsciiDoc
 *           :showtitle:
 *
 *           Edit this source and select *Run*.
 *         </script>
 *       </tp-asciidoc-viewer>
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
