/**
 * @module markdown/extensions/include
 * @summary Markdown extension for recursive file inclusion.
 *
 * This extension adds support for `::include{...}` directives inside Markdown
 * documents. Included files are resolved from an in-memory virtual file system
 * and expanded before Markdown rendering.
 *
 * Features:
 *
 * - relative and absolute path resolution
 * - recursive include expansion
 * - circular include detection
 * - virtual file system support
 *
 * Example:
 *
 * ```md
 * ::include{./chapter1.md}
 * ```
 */
import type MarkdownIt from 'markdown-it';
/**
 * Configuration options for the include extension.
 */
export interface TpMarkdownIncludeOptions {
    /**
     * Virtual file system used to resolve include targets.
     *
     * Keys are file paths and values are file contents.
     */
    files?: Record<string, string>;
    /**
     * Default entry path used as the base directory when no rendering path
     * is available in the environment.
     */
    entryPath?: string;
}
/**
 * Registers the Markdown include extension.
 *
 * The extension overrides the default markdown-it render method in order
 * to expand include directives before the Markdown source is parsed.
 *
 * @param md - markdown-it instance.
 * @param options - Include extension configuration.
 */
export default function tpMarkdownInclude(md: MarkdownIt, options?: TpMarkdownIncludeOptions): void;
