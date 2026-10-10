/**
 * @module markdown/extensions/toc
 * @summary Markdown-it extension that generates a table of contents from
 * document headings.
 *
 * This extension collects headings during the core parsing phase and renders
 * a hierarchical table of contents using a custom block syntax.
 *
 * Supported TOC syntaxes:
 *
 * ```md
 * [[toc]]
 * [toc]
 * ${toc}
 * ```
 *
 * A custom title can be provided:
 *
 * ```md
 * [[toc:Contents]]
 * ```
 *
 * The extension automatically:
 *
 * - extracts headings from the token stream,
 * - generates heading identifiers,
 * - builds a nested heading tree,
 * - renders nested TOC lists,
 * - supports numbered sections,
 * - respects a configurable maximum heading level.
 *
 * Example front matter configuration:
 *
 * ```yaml
 * ---
 * toc:
 *   maxLevel: 3
 * ---
 * ```
 */
import type MarkdownIt from 'markdown-it';
/**
 * Configuration options for the TOC extension.
 */
interface TocPluginOptions {
    /**
     * Default TOC title used when none is explicitly provided.
     */
    defaultTitle?: string;
}
/**
 * Registers the table of contents extension.
 *
 * The extension:
 *
 * - collects document headings,
 * - injects heading identifiers,
 * - parses TOC placeholders,
 * - renders a hierarchical TOC tree.
 *
 * @param md - Markdown-it instance to extend.
 * @param options - TOC rendering options.
 */
export default function markdownItTableOfContents(md: MarkdownIt, options?: TocPluginOptions): void;
export {};
