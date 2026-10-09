/**
 * @module markdown/extensions/highlight
 * @summary Markdown-it extension integrating highlight.js syntax highlighting.
 */
import type MarkdownIt from 'markdown-it';
/**
 * Configuration options for the highlight.js Markdown extension.
 *
 * @summary Controls theme loading and highlighting behavior.
 */
export interface MarkdownHighlightOptions {
    /**
     * Name of the highlight.js CSS theme.
     *
     * @defaultValue `"github"`
     */
    theme?: string;
    /**
     * Automatically loads the selected CSS theme from jsDelivr.
     *
     * @defaultValue `false`
     */
    loadTheme?: boolean;
}
/**
 * Registers highlight.js integration for Markdown code fences.
 *
 * This extension configures the Markdown-it `highlight` callback so fenced
 * code blocks are rendered using highlight.js.
 *
 * Features:
 * - explicit language highlighting
 * - automatic language detection fallback
 * - optional automatic CSS theme loading
 * - safe HTML escaping fallback on errors
 *
 * ---
 *
 * Example:
 *
 * ```yaml
 * ---
 * highlight:
 *   theme: nord
 *   loadTheme: true
 * ---
 * ```
 *
 * @summary Enables syntax highlighting with highlight.js.
 * @param md Markdown-it instance to extend.
 * @param options Highlight extension configuration.
 */
export default function markdownItHighlightJs(md: MarkdownIt, options?: MarkdownHighlightOptions): void;
