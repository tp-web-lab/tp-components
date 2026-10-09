/**
 * @module components/html-viewer
 * @summary Interactive HTML viewer with editable source, live rendering, and DOM inspection.
 */
import type { MarkupViewerExample, MarkupViewerMode } from "../markup-viewer/markup-viewer.js";
import { TpMarkupViewer } from "../markup-viewer/markup-viewer.js";
import "../object-tree/object-tree.js";
/**
 * Supported two-pane layout modes.
 */
type HtmlViewerMode = "render" | "dom";
/**
 * One viewer example entry.
 */
type HtmlViewerContext = {
    baseHref: string | null;
};
type HtmlViewerExample = MarkupViewerExample<HtmlViewerContext>;
/**
 * Builds the iframe document used for live preview.
 *
 * @param source User HTML source.
 * @param baseHref Base URL used to resolve relative assets.
 * @returns Complete HTML document.
 */
export declare function buildIframeDocument(source: string, baseHref: string | null, loadTpComponents?: boolean): string;
/**
 * Interactive HTML viewer component.
 *
 * @tagname tp-html-viewer
 * @attr {boolean} allow-script = false - Allows executable scripts in the rendered example.
 * @attr {boolean} lite = false - Uses the compact single-example viewer with rendered HTML output.
 * @attr {boolean} no-loader = false - Disables automatic tp-loader injection when the example manages its own imports.
 * @attr {string} src = "" - URL of the HTML file to load into the viewer.
 * @example
 * <tp-html-viewer></tp-html-viewer>
 */
export declare class TpHtmlViewer extends TpMarkupViewer<HtmlViewerMode, HtmlViewerContext> {
    static get observedAttributes(): string[];
    protected readonly sourceLanguage = "html";
    protected readonly outputModes: readonly MarkupViewerMode<HtmlViewerMode>[];
    protected readonly viewerClassName = "tp-html-viewer";
    protected readonly deferInitialRender = true;
    private overrideSource;
    private overrideResetSource;
    private initialInlineExample;
    /**
     * Replaces the viewer input source and refreshes the preview.
     *
     * @summary Sets the HTML source from code.
     * @param source HTML source to display and render.
     * @param baseHref Optional base URL used to resolve relative assets.
     * @param resetSource Optional source used by the viewer reset button.
     */
    setSource(source: string, baseHref?: string | null, resetSource?: string): void;
    protected connectedCallback(): void;
    protected loadExamples(): Promise<HtmlViewerExample[]>;
    protected getResetSource(example: HtmlViewerExample): string;
    protected readInlineSource(): HtmlViewerExample;
    protected createExternalContext(url: URL): HtmlViewerContext;
    protected renderOutput(source: string, mode: HtmlViewerMode, container: HTMLElement, context: HtmlViewerContext): Promise<void>;
    /**
     * Reads source from `<script>`, `<template>`, or host content.
     *
     * @returns Dedented HTML source.
     */
    private readSource;
}
export {};
