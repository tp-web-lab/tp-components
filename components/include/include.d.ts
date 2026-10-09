/**
 * @module components/include
 * @summary Remote HTML include component.
 */
import { TpBase } from "../base/base.js";
type TpIncludeFetchMode = "cors" | "no-cors" | "same-origin";
type TpIncludeMode = "auto" | "raw";
/**
 * `<tp-include>` charge un contenu HTML distant et l'injecte dans le DOM léger.
 *
 * Handling:
 * - document HTML complet → injecte uniquement `<body>`
 * - fragment HTML → injecte tel quel
 *
 * @summary Loads remote HTML content.
 * @tagname tp-include
 * @attr {string} src = "" - HTML source URL.
 * @attr {string} mode = "auto" - Inclusion mode (`auto` or `raw`).
 * @attr {string} fetch-mode = "cors" - Fetch mode (`cors`, `no-cors`, or `same-origin`).
 * @attr {boolean} allow-scripts = false - Allows included scripts to run.
 * @attr {boolean} allow-styles = false - Keeps included `<style>` and stylesheet links.
 * @attr {boolean} sanitize = false - Sanitizes included HTML with DOMPurify.
 * @attr {string} loading = "" - Text shown while loading.
 * @attr {string} fallback = "" - CSS selector for fallback content displayed on error.
 * @event tp-include-load Emitted after content is loaded and injected.
 * @eventdetail tp-include-load { src: string; fetchMode: "cors" | "no-cors" | "same-origin"; allowScripts: boolean; allowStyles: boolean; sanitize: boolean; scriptsExecuted: boolean }
 * @event tp-include-error Emitted when loading or injecting content fails.
 * @eventdetail tp-include-error { src: string; fetchMode: "cors" | "no-cors" | "same-origin"; allowScripts: boolean; allowStyles: boolean; sanitize: boolean; scriptsExecuted: false; error: string }
 * @example
 * <tp-include></tp-include>
 */
export declare class TpInclude extends TpBase {
    private static readonly styleId;
    private requestId;
    static get observedAttributes(): string[];
    /**
     * Location of the HTML file to include.
     */
    get src(): string;
    set src(value: string);
    /** Whether the response is interpreted as HTML or displayed as raw text. */
    get mode(): TpIncludeMode;
    set mode(value: TpIncludeMode);
    /**
     * Mode used for `fetch`.
     */
    get fetchMode(): TpIncludeFetchMode;
    set fetchMode(value: TpIncludeFetchMode);
    /**
     * Allows included scripts to run.
     */
    get allowScripts(): boolean;
    set allowScripts(value: boolean);
    /**
     * Allows included styles to remain in the injected content.
     *
     * Si absent, les balises `<style>` et `<link rel="stylesheet">`
     * sont retirées du contenu injecté.
     */
    get allowStyles(): boolean;
    set allowStyles(value: boolean);
    /**
     * Enables sanitizing included HTML with DOMPurify.
     */
    get sanitize(): boolean;
    set sanitize(value: boolean);
    /**
     * Text shown while loading.
     */
    get loading(): string;
    set loading(value: string);
    /**
     * CSS selector for fallback content displayed on error.
     */
    get fallback(): string;
    set fallback(value: string);
    /**
     * @summary Initializes the include component.
     * @internal
     */
    protected connectedCallback(): void;
    /**
     * @summary Reloads content when an observed attribute changes.
     * @internal
     */
    protected attributeChangedCallback(): void;
    /**
     * Explicitly reloads the remote content.
     *
     * @summary Reloads the included content.
     */
    reload(): Promise<void>;
    private ensureStyles;
    private loadContent;
    private injectHtml;
    private injectRaw;
    private processStyles;
    private processScripts;
    private renderLoading;
    private renderFallback;
}
export {};
