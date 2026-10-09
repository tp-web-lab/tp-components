/**
 * @module markdown/markdown-default-extensions
 * @summary Registers the default Markdown extensions used by the parser.
 */
import type MarkdownIt from 'markdown-it';
/**
 * Options used to configure the default Markdown extensions.
 */
export interface TpMarkdownDefaultExtensionOptions {
    /**
     * In-memory file map used by file-aware extensions.
     */
    files?: Record<string, string>;
    /**
     * Base path used to resolve relative file references.
     */
    entryPath?: string;
}
/**
 * Registers the default extension set on a Markdown-it instance.
 *
 * @param md - Markdown-it instance to extend.
 * @param options - Extension registration options.
 */
export declare function registerDefaultMarkdownExtensions(md: MarkdownIt, options?: TpMarkdownDefaultExtensionOptions): void;
