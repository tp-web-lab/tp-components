export type TpDeclarativeTextSourceOptions = {
    scriptTypes: readonly string[];
    textContentFallback?: boolean;
    /** Generated UI subtrees that must never become author content. */
    ignoreSelector?: string;
};
/**
 * Reads and preserves textual component content declared either in an inline
 * script or through `src`. The observer handles custom elements upgraded while
 * the HTML parser is still adding their children.
 */
export declare class TpDeclarativeTextSource {
    private readonly host;
    private readonly options;
    private snapshot;
    private onInlineSource;
    private readonly observer;
    constructor(host: HTMLElement, options: TpDeclarativeTextSourceOptions);
    /** Starts watching for an inline script that the HTML parser may add later. */
    observe(onInlineSource: () => void): void;
    /** Captures author content before the host replaces its light DOM. */
    capture(): boolean;
    /** Reads text while excluding explicitly marked generated controls and output. */
    private authorText;
    /** Returns the preserved inline source, if one has been captured. */
    get inlineSource(): string | null;
    /** Reads the host using the common `src`, `value`, script, text precedence. */
    read(init?: RequestInit): Promise<string>;
    disconnect(): void;
}
