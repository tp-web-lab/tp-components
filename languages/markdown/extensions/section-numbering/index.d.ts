/**
 * @module markdown/extensions/section-numbering
 * @summary Markdown-it extension that automatically adds hierarchical
 * section numbers to Markdown headings.
 *
 * This extension injects section numbers directly into heading inline tokens
 * during the core parsing phase.
 *
 * Numbering can be enabled globally through extension options or configured
 * per document through front matter attributes.
 *
 * Supported configuration:
 *
 * ```yaml
 * ---
 * sectionNumbering:
 *   enabled: true
 *   maxLevel: 3
 * ---
 * ```
 *
 * Example:
 *
 * ```md
 * # Introduction
 * ## Installation
 * ### Configuration
 * ```
 *
 * becomes:
 *
 * ```text
 * 1 Introduction
 * 1.1 Installation
 * 1.1.1 Configuration
 * ```
 */
import type MarkdownIt from 'markdown-it';
/**
 * Configuration options for the section numbering extension.
 */
export interface SectionNumberingOptions {
    /**
     * Enables automatic numbering of headings.
     *
     * @defaultValue false
     */
    enabled?: boolean;
    /**
     * Maximum heading depth to number.
     *
     * Values are clamped between `1` and `6`.
     *
     * @defaultValue 6
     */
    maxLevel?: number;
}
/**
 * Registers automatic heading numbering support.
 *
 * The extension prepends hierarchical section numbers to Markdown headings
 * during the core rendering phase.
 *
 * Section numbering can be configured globally through extension options
 * or overridden per document through front matter attributes:
 *
 * ```yaml
 * ---
 * sectionNumbering:
 *   enabled: true
 *   maxLevel: 3
 * ---
 * ```
 *
 * Example output:
 *
 * ```md
 * # Introduction
 * ## Installation
 * ```
 *
 * becomes:
 *
 * ```html
 * 1 Introduction
 * 1.1 Installation
 * ```
 *
 * @param md - Markdown-it instance to extend.
 * @param options - Extension configuration options.
 */
export default function sectionNumberingExtension(md: MarkdownIt, options?: SectionNumberingOptions): void;
