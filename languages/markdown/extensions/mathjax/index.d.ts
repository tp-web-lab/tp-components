/**
 * @module markdown/extensions/mathjax
 * @summary Markdown-it extension providing MathJax-based math rendering.
 */
import type MarkdownIt from 'markdown-it';
/**
 * Registers the MathJax Markdown extension.
 *
 * Supported syntaxes:
 *
 * Inline LaTeX:
 *
 * ```md
 * :latexmath:\`E = mc^2\`
 * ```
 *
 * Inline AsciiMath:
 *
 * ```md
 * :asciimath:\`sum_(i=1)^n i\`
 * ```
 *
 * Generic inline math:
 *
 * ```md
 * :math:\`E = mc^2\`
 * ```
 *
 * Display math fences:
 *
 * ````md
 * ```latexmath
 * E = mc^2
 * ```
 * ````
 *
 * The extension only produces HTML placeholders.
 * Actual MathJax rendering must be performed separately.
 *
 * @summary Enables MathJax-based math syntax.
 * @param md Markdown-it instance to extend.
 * @param _options Reserved extension options.
 */
export default function markdownMathJaxExtension(md: MarkdownIt, _options?: Record<string, unknown>): void;
