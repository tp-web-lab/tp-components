/**
 * @module components/asciidoc
 * @summary Semantic AsciiDoc rendering component.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @credit tp-asciidoc https://www.npmjs.com/package/@tp/tp-asciidoc
 * @summary AsciiDoc parsing and rendering.
 */
import { TpAsciidocParser } from "@tp/tp-asciidoc";
import { TpBase } from "../base/base.js";
/** A configured parser instance used by the component runtime. */
type TpAsciidocParserInstance = InstanceType<typeof TpAsciidocParser>;
/**
 * Serializable representation of an Asciidoctor document node.
 *
 * This deliberately exposes only stable structural properties so the value can
 * be displayed as JSON without leaking Opal runtime objects.
 */
export type AsciidocAstNode = {
    /** Asciidoctor node context, such as `document`, `section`, or `paragraph`. */
    context: string;
    /** Explicit node identifier, when present. */
    id?: string;
    /** Node title, when present. */
    title?: string;
    /** Node style, when present. */
    style?: string;
    /** Original source associated with the node, when available. */
    source?: string;
    /** Recursively serialized child blocks. */
    blocks?: AsciidocAstNode[];
};
/**
 * Removes the HTML embedding indentation from AsciiDoc source.
 *
 * The first non-empty line defines the embedding depth. Each following line
 * loses at most that amount of leading whitespace. This remains reliable when
 * an outer Markdown renderer has already moved list markers to column zero.
 *
 * @param source Source read from an embedded script, template, or code block.
 * @returns Source normalized for Asciidoctor.
 */
export declare function dedentAsciidocSource(source: string): string;
/**
 * Creates a parser configured with the semantic HTML converter and bundled extensions.
 *
 * @returns A new independent AsciiDoc parser.
 */
export declare function createTpAsciidocParser(): TpAsciidocParserInstance;
/**
 * Converts AsciiDoc source to embeddable semantic HTML.
 *
 * @param source AsciiDoc source to convert.
 * @returns Generated semantic HTML.
 */
export declare function renderAsciidocToHtml(source: string): Promise<string>;
/**
 * Parses AsciiDoc source into a JSON-safe abstract syntax tree.
 *
 * @param source AsciiDoc source to parse.
 * @returns Serializable root document node.
 */
export declare function parseAsciidocToAst(source: string): Promise<AsciidocAstNode>;
/**
 * Converts source into an element and initializes interactive `adocviewer` blocks.
 *
 * @param source AsciiDoc source to render.
 * @param root Element that receives the generated HTML.
 */
export declare function renderAsciidocInto(source: string, root: HTMLElement): Promise<void>;
/**
 * Initializes interactive `adocviewer` blocks already present below a root node.
 *
 * @param root Root node containing rendered AsciiDoc HTML.
 */
export declare function renderAsciidocRuntimeIn(root: ParentNode): Promise<void>;
/**
 * Renders inline or external AsciiDoc as semantic HTML.
 *
 * @tagname tp-asciidoc
 * @attr {string} src = "" - URL of an external AsciiDoc source file.
 * @event tp-asciidoc-rendered Emitted after conversion and runtime initialization complete.
 * @eventdetail tp-asciidoc-rendered void
 * @example
 * <tp-box><tp-asciidoc><script type="tp/asciidoc">This paragraph uses *AsciiDoc*.</script></tp-asciidoc></tp-box>
 */
export declare class TpAsciidoc extends TpBase {
    /** Attributes that trigger a new source load and conversion. */
    static get observedAttributes(): string[];
    private readonly outputElement;
    /** Reapply names after MathJax's responsive line breaking replaces SVGs. */
    private readonly mathObserver;
    private renderToken;
    private inlineSourceSnapshot;
    protected connectedCallback(): void;
    /** Stops observing detached output and invalidates pending source requests. */
    disconnectedCallback(): void;
    protected attributeChangedCallback(): void;
    /**
     * URL of an external AsciiDoc source file.
     *
     * Inline content is used when this value is empty.
     *
     * @attr src
     */
    get src(): string;
    set src(value: string);
    private renderAsciidoc;
    private getAsciidocSource;
    private readInlineSource;
}
export {};
