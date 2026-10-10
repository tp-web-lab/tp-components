/**
 * @module markdown/extensions/mermaid
 * @summary Markdown-it extension providing Mermaid diagram rendering support.
 */
import type MarkdownIt from 'markdown-it';
/**
 * Configuration options for the Mermaid extension.
 *
 * @summary Mermaid rendering configuration.
 */
interface MermaidPluginOptions {
    /**
     * Custom CSS class applied to Mermaid containers.
     *
     * @defaultValue `"tp-md-mermaid"`
     */
    className?: string;
}
/**
 * Registers Mermaid diagram support for Markdown-it.
 *
 * Supported syntax:
 *
 * ````md
 * ```mermaid
 * graph TD
 *   A --> B
 * ```
 * ````
 *
 * The extension transforms Mermaid code fences into
 * HTML containers compatible with Mermaid.js rendering.
 *
 * Mermaid rendering itself must be performed separately
 * after Markdown rendering.
 *
 * @summary Enables Mermaid fenced blocks.
 * @param md Markdown-it instance to extend.
 * @param options Mermaid rendering options.
 */
export default function markdownMermaidExtension(md: MarkdownIt, options?: MermaidPluginOptions): void;
export {};
