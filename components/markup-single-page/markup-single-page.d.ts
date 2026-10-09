/**
 * @module components/markup-single-page
 * @summary Single-page renderer selecting HTML, Markdown, AsciiDoc or reStructuredText.
 */
import "../toolbar/toolbar.js";
import { TpBase } from "../base/base.js";
import "../markdown/markdown.js";
import "../asciidoc/asciidoc.js";
import "../restructuredtext/restructuredtext.js";
export type TpMarkupSinglePageLanguage = "html" | "markdown" | "asciidoc" | "restructuredtext";
/**
 * Renders one document with a parser selected from `src` or inline script type.
 *
 * @tagname tp-markup-single-page
 * @attr {string} src = "" - Source file. The extension selects the renderer.
 * @event tp-markup-single-page-rendered Emitted after the selected renderer completes.
 * @eventdetail tp-markup-single-page-rendered { language: "html" | "markdown" | "asciidoc" | "restructuredtext"; src: string }
 * @example
 * <tp-markup-single-page>
 *   <script type="tp/markdown">
 * ## A short guide
 *
 * This document is rendered as a single page.
 *
 * ### Getting started
 *
 * - Read the introduction
 * - Try a component
 *   </script>
 * </tp-markup-single-page>
 */
export declare class TpMarkupSinglePage extends TpBase {
    static get observedAttributes(): string[];
    private readonly outputElement;
    private renderToken;
    private inlineSourceSnapshot;
    /** Personal annotations share the rendered document's storage scope. */
    private annotations;
    /** Language imposed by a format-specific subclass, or automatic detection. */
    protected get fixedLanguage(): TpMarkupSinglePageLanguage | null;
    protected connectedCallback(): void;
    /** Removes annotation listeners and floating notes when detached. */
    disconnectedCallback(): void;
    protected attributeChangedCallback(): void;
    get src(): string;
    set src(value: string);
    private renderSinglePage;
    private renderExternalSource;
    private renderInlineSource;
    private renderMarkupElement;
    private finishRender;
    private readInlineSource;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-markup-single-page": TpMarkupSinglePage;
    }
}
