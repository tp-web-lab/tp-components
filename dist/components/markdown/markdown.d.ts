export { createTpMarkdownParser, parseMarkdownToTokens, renderMarkdownToHtml, } from "../../utilities/markdown-source.js";
import { TpBase } from "../base/base.js";
export declare function renderMarkdownInto(source: string, root: HTMLElement, path?: string): Promise<void>;
export declare function renderMarkdownRuntimeIn(root: ParentNode, path?: string): Promise<void>;
/**
 * The custom `<tp-markdown>` element renders Markdown documents.
 *
 * @summary Renders Markdown documents.
 * @tagname tp-markdown
 * @attr {string} src = "" - URL of a Markdown source file to fetch and render; relative paths resolve against the containing source document when available.
 * @example
 * <tp-markdown>
 *   <script type="tp/markdown">
 * ## A short document
 *
 * This paragraph uses **Markdown**.
 *
 * - Write content
 * - Add components
 * - Publish the page
 *   </script>
 * </tp-markdown>
 *  @event tp-markdown-rendered Emitted after Markdown and its runtime extensions are rendered, or after a source/conversion error is displayed. This event alone does not indicate successful conversion.
 * @eventdetail tp-markdown-rendered void
 */
export declare class TpMarkdown extends TpBase {
    static get observedAttributes(): string[];
    private readonly outputElement;
    private renderToken;
    private inlineSourceSnapshot;
    private safeSource;
    /** Renders generated Markdown with restricted formatting and source-backed formulas only. */
    setSafeMarkdown(source: string): Promise<void>;
    protected connectedCallback(): void;
    protected attributeChangedCallback(): void;
    get src(): string;
    set src(value: string);
    private readonly pendingVisibility;
    protected disconnectedCallback(): void;
    private renderMarkdown;
    private getMarkdownSource;
    private resolveSourceUrl;
    private readInlineSource;
    private renderMarkdownRuntime;
    private resolveIncludes;
}
