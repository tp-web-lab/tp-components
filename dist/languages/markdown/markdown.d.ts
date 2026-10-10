/**
 * @module markdown
 * @summary High-level Markdown rendering and parsing API based on markdown-it.
 *
 * This module exposes the {@link TpMarkdown} class, which provides synchronous
 * and asynchronous parsing/rendering utilities with support for:
 *
 * - markdown-it plugins
 * - dynamically loaded extensions
 * - YAML front matter
 * - custom rendering environments
 * - asynchronous extension loading
 */
import MarkdownIt from 'markdown-it';
import type { TpMarkdownExtension, TpMarkdownOptions, TpMarkdownParseResult, TpMarkdownPlugin } from './markdown.types.js';
/**
 * High-level Markdown renderer and parser built on top of markdown-it.
 *
 * The class provides utilities for:
 *
 * - rendering Markdown to HTML
 * - parsing Markdown into tokens
 * - loading synchronous or asynchronous extensions
 * - handling YAML front matter
 * - configuring markdown-it plugins
 */
export declare class TpMarkdown {
    /**
     * Internal markdown-it instance.
     */
    readonly md: MarkdownIt;
    /**
     * Renderer configuration options.
     */
    readonly options: TpMarkdownOptions;
    /**
     * Creates a new Markdown renderer instance.
     *
     * Default markdown-it plugins and built-in extensions are automatically
     * registered during construction.
     *
     * @param options - Markdown renderer configuration.
     * @param extensions - Initial extensions to register.
     */
    constructor(options?: TpMarkdownOptions, extensions?: readonly TpMarkdownExtension[]);
    /**
     * Registers a markdown-it plugin.
     *
     * @param plugin - markdown-it plugin function.
     * @param options - Plugin configuration options.
     * @returns Current renderer instance.
     */
    use(plugin: TpMarkdownPlugin, options?: Record<string, unknown>): this;
    /**
     * Loads and registers a Markdown extension dynamically.
     *
     * @param extension - Extension descriptor.
     * @returns Current renderer instance.
     */
    useExtension(extension: TpMarkdownExtension): Promise<this>;
    /**
     * Loads and registers multiple Markdown extensions sequentially.
     *
     * @param extensions - Extension descriptors.
     * @returns Current renderer instance.
     */
    useExtensions(extensions: readonly TpMarkdownExtension[]): Promise<this>;
    /**
     * Parses Markdown into markdown-it tokens.
     *
     * This method only supports already registered extensions.
     * Use {@link parseAsync} when dynamic extension loading is required.
     *
     * @param source - Markdown source content.
     * @param extensions - Additional extensions.
     * @returns Parsed tokens and rendering environment.
     * @throws Error if asynchronous extensions are provided.
     */
    parse(source: string, extensions?: readonly TpMarkdownExtension[]): TpMarkdownParseResult;
    /**
     * Asynchronously parses Markdown into markdown-it tokens.
     *
     * Extensions are dynamically loaded before parsing.
     *
     * @param source - Markdown source content.
     * @param extensions - Extensions to load.
     * @returns Parsed tokens and rendering environment.
     */
    parseAsync(source: string, extensions?: readonly TpMarkdownExtension[]): Promise<TpMarkdownParseResult>;
    /**
     * Renders Markdown into HTML.
     *
     * This method only supports already registered extensions.
     * Use {@link renderAsync} when dynamic extension loading is required.
     *
     * @param source - Markdown source content.
     * @param extensions - Additional extensions.
     * @returns Rendered HTML string.
     * @throws Error if asynchronous extensions are provided.
     */
    render(source: string, extensions?: readonly TpMarkdownExtension[]): string;
    /**
     * Asynchronously renders Markdown into HTML.
     *
     * Extensions are dynamically loaded before rendering and may receive
     * configuration values from YAML front matter attributes.
     *
     * @param source - Markdown source content.
     * @param extensions - Extensions to load.
     * @returns Rendered HTML string.
     */
    renderAsync(source: string, extensions?: readonly TpMarkdownExtension[]): Promise<string>;
}
