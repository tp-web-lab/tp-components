export { createTpMarkdownParser, parseMarkdownToTokens, renderMarkdownToHtml, } from "../../utilities/markdown-source.js";
import { TpBase } from "../base/base.js";
export declare function renderMarkdownInto(source: string, root: HTMLElement, path?: string): Promise<void>;
export declare function renderMarkdownRuntimeIn(root: ParentNode, path?: string): Promise<void>;
/**
 * @summary Markdown rendering component.
 * @tagname tp-markdown
 * @example
 * <tp-markdown><script type="tp/markdown">This paragraph uses **Markdown**.</script></tp-markdown>
 */
export declare class TpMarkdown extends TpBase {
    static get observedAttributes(): string[];
    private readonly outputElement;
    private renderToken;
    private inlineSourceSnapshot;
    protected connectedCallback(): void;
    protected attributeChangedCallback(): void;
    get src(): string;
    set src(value: string);
    private renderMarkdown;
    private getMarkdownSource;
    private resolveSourceUrl;
    private readInlineSource;
    private renderMarkdownRuntime;
    private resolveIncludes;
}
