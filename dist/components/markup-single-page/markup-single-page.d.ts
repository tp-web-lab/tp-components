/**
 * @module components/markup-single-page
 * @summary Single-page renderer selecting HTML, Markdown, AsciiDoc or reStructuredText.
 */
import "../calculator/calculator.js";
import "../clock/clock.js";
import "../lang/lang.js";
import "../color/color.js";
import "../theme/theme.js";
import "../source/source.js";
import "../fullscreen/fullscreen.js";
import "../icon-button/icon-button.js";
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
 * @attr {string | null} toolbar = null - Optional comma-separated controls: code, calc, postit, clock, lang, color, theme, fullscreen. Empty enables all; absent hides the toolbar.
 * @attr {string} git = "" - Repository URL. Adds a source link before Code when the toolbar is enabled.
 * @attr {string} label = "" - Text displayed in the center of the optional toolbar.
 * @attr {string} langs = "en" - Candidate document languages. The first uses the source directory; others use language subdirectories.
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
    private toolbarElement;
    private calculatorDrawer;
    private sourceDrawer;
    private sourceToken;
    private pageUrl;
    private languageToken;
    private languageSources;
    private currentDocumentLanguage;
    get langs(): string;
    set langs(value: string);
    /** Current document language, independent of its markup syntax. */
    get documentLanguage(): string;
    /** Select a translation discovered for this document. */
    setDocumentLanguage(language: string): void;
    private inlineSourceSnapshot;
    /** Personal annotations share the rendered document's storage scope. */
    private annotations;
    /** Language imposed by a format-specific subclass, or automatic detection. */
    protected get fixedLanguage(): TpMarkupSinglePageLanguage | null;
    protected connectedCallback(): void;
    /** Removes annotation listeners and floating notes when detached. */
    disconnectedCallback(): void;
    protected attributeChangedCallback(name: string): void;
    /** Null removes the toolbar; an empty string enables every control. */
    get toolbar(): string | null;
    set toolbar(value: string | null);
    get git(): string;
    set git(value: string);
    private updateGit;
    get label(): string;
    set label(value: string);
    private updateLabel;
    private disposeToolbar;
    private renderToolbar;
    /** Resolve the authored source for the currently selected generated page. */
    private getOriginalSource;
    private updateLanguages;
    private toggleCalculator;
    private toggleSource;
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
