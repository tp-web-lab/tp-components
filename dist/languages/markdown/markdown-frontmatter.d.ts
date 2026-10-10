/**
 * @module markdown/markdown-frontmatter
 * @summary YAML front matter parser for Markdown documents.
 *
 * This module extracts YAML front matter metadata from a Markdown source and
 * returns both the parsed attributes object and the remaining Markdown body.
 *
 * Front matter blocks must follow the standard YAML syntax:
 *
 * ```md
 * ---
 * title: Example
 * toc:
 *   maxLevel: 3
 * ---
 * ```
 */
/**
 * Result returned after parsing a Markdown document front matter block.
 */
export interface TpMarkdownFrontMatterResult {
    /**
     * Parsed YAML attributes.
     */
    attributes: Record<string, unknown>;
    /**
     * Markdown content without the front matter block.
     */
    body: string;
}
/**
 * Extracts and parses YAML front matter from a Markdown source string.
 *
 * If the document does not contain a valid front matter block, the function
 * returns an empty attributes object and the original source unchanged.
 *
 * @param source - Raw Markdown source content.
 * @returns Parsed front matter attributes and Markdown body.
 */
export declare function parseMarkdownFrontMatter(source: string): TpMarkdownFrontMatterResult;
