/**
 * @module components/restructuredtext
 * @summary reStructuredText rendering component.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @credit tp-restructuredtext https://www.npmjs.com/package/@tp/tp-restructuredtext
 * @summary reStructuredText parsing and rendering.
 */
/**
 * @credit highlight.js https://highlightjs.org/
 * @summary Source-code syntax highlighting.
 */
import { type TpRestructuredTextNode, type TpRestructuredTextOptions, TpRestructuredTextParser } from "@tp/tp-restructuredtext";
import { TpBase } from "../base/base.js";
/** Configured parser instance used by the component runtime. */
export type TpRestructuredTextParserInstance = InstanceType<typeof TpRestructuredTextParser>;
/**
 * Removes HTML embedding indentation from reStructuredText source.
 *
 * @param source Source read from an embedded script or code block.
 * @returns Source normalized for Docutils.
 */
export declare function dedentRestructuredTextSource(source: string): string;
/** Creates an independent Pyodide and Docutils parser facade. */
export declare function createTpRestructuredTextParser(options?: TpRestructuredTextOptions): TpRestructuredTextParserInstance;
/**
 * Converts reStructuredText source to HTML.
 *
 * @param source reStructuredText source to convert.
 * @returns Generated HTML.
 */
export declare function renderRestructuredTextToHtml(source: string): Promise<string>;
/**
 * Parses reStructuredText into a JSON-compatible Docutils tree.
 *
 * @param source reStructuredText source to parse.
 * @returns Serializable document node.
 */
export declare function parseRestructuredTextToAst(source: string): Promise<TpRestructuredTextNode>;
/**
 * Converts source into an existing element.
 *
 * @param source reStructuredText source to render.
 * @param root Element that receives the generated HTML.
 */
export declare function renderRestructuredTextInto(source: string, root: HTMLElement): Promise<void>;
/**
 * Renders inline or external reStructuredText as HTML.
 *
 * The browser runtime and the Docutils package are loaded lazily when the first
 * document is rendered.
 *
 * @tagname tp-restructuredtext
 * @attr {string} src = "" - URL of an external reStructuredText source file.
 * @attr {boolean} doctest = false - Runs standard Python doctest blocks and reports their result.
 * @event tp-restructuredtext-rendered Emitted after conversion completes.
 * @eventdetail tp-restructuredtext-rendered void
 * @event tp-restructuredtext-doctest Emitted after the document doctests have run.
 * @eventdetail tp-restructuredtext-doctest TpRestructuredTextDoctestResult
 * @example
 * <tp-restructuredtext>
 *       <script type="tp/restructuredtext">
 *         Hello, **Docutils**!
 *       </script>
 *     </tp-restructuredtext>
 */
export declare class TpRestructuredText extends TpBase {
    /** Attributes that trigger a new source load and conversion. */
    static get observedAttributes(): string[];
    private readonly outputElement;
    private renderToken;
    private inlineSourceSnapshot;
    protected connectedCallback(): void;
    protected attributeChangedCallback(): void;
    /**
     * URL of an external reStructuredText source file.
     *
     * Inline content is used when this value is empty.
     *
     * @attr src
     */
    get src(): string;
    set src(value: string);
    /** Whether standard Python doctest blocks are executed after rendering. */
    get doctest(): boolean;
    set doctest(value: boolean);
    private renderRestructuredText;
    private renderDoctestResults;
    private getRestructuredTextSource;
    private readInlineSource;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-restructuredtext": TpRestructuredText;
    }
}
