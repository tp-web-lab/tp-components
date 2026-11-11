/**
 * @module components/latex-viewer
 * @summary Editable LaTeX documents with rendered HTML and generated source views.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
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
 * @tp-dependency tp-switcher
 * @summary Switches between horizontal and vertical layouts based on available space.
 */
/**
 * @credit tp-latex https://www.npmjs.com/package/@tp/tp-latex
 * @summary LaTeX.js conversion and patched TikZJax assets.
 */
import { type MarkupViewerExample, type MarkupViewerMode, TpMarkupViewer } from "../markup-viewer/markup-viewer.js";
type LatexMode = "render" | "html";
/**
 * The custom `<tp-latex-viewer>` element presents editable LaTeX examples with rendered and generated HTML views.
 *
 * @summary Presents editable LaTeX examples with rendered and generated HTML views.
 * @tagname tp-latex-viewer
 * @attr {string} src = "" - Comma-separated URLs of LaTeX example files.
 * @attr {boolean} allow-script = false - Executes scripts in the generated HTML preview.
 * @attr {boolean} lite = false - Compact viewer with rendered output.
 * @see tp-latex-playground - Edit file-based LaTeX projects with a console.
 * @see tp-latex - Render LaTeX directly in a page.
 * @example
 * <tp-latex-viewer><script type="tp/latex">\section{Hello}A formula $x^2$.</script></tp-latex-viewer>
 */
export declare class TpLatexViewer extends TpMarkupViewer<LatexMode> {
    static get observedAttributes(): string[];
    protected readonly sourceLanguage = "stex";
    protected readonly viewerClassName = "tp-latex-viewer";
    protected readonly outputModes: readonly MarkupViewerMode<LatexMode>[];
    protected readInlineSource(): MarkupViewerExample;
    protected extractExamples(example: MarkupViewerExample): MarkupViewerExample[];
    protected createExternalContext(_url: URL): undefined;
    protected renderOutput(source: string, mode: LatexMode, container: HTMLElement): Promise<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-latex-viewer": TpLatexViewer;
    }
}
export {};
