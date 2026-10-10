/**
 * @module components/markdown
 * @summary Markdown rendering component.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @credit tp-markdown https://www.npmjs.com/package/@tp/tp-markdown
 * @summary Markdown parsing and rendering.
 */
import { TpMarkdownParser } from "@tp/tp-markdown/markdown/engine/markdown";
import { TpBase } from "../base/base.js";
type TpMarkdownParserInstance = InstanceType<typeof TpMarkdownParser>;
export declare function createTpMarkdownParser(path?: string): TpMarkdownParserInstance;
export declare function renderMarkdownToHtml(source: string, path?: string): Promise<string>;
export declare function parseMarkdownToTokens(source: string, path?: string): Promise<unknown>;
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
    private applyIncludePrefix;
    private renderInclude;
}
export {};
