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
import type StateCore from 'markdown-it/lib/rules_core/state_core.mjs';

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
 * Front matter attributes supported by the section numbering extension.
 */
interface SectionNumberingAttributes {
  /**
   * Section numbering configuration loaded from Markdown attributes.
   */
  sectionNumbering?: {
    /**
     * Enables section numbering.
     */
    enabled?: boolean;

    /**
     * Alias for `enabled`.
     */
    enable?: boolean;

    /**
     * Maximum heading level to number.
     */
    maxLevel?: number;
  };
}

/**
 * Markdown rendering environment used by the section numbering extension.
 */
interface SectionNumberingEnvironment {
  /**
   * Parsed Markdown attributes and front matter configuration.
   */
  attributes?: SectionNumberingAttributes;
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
export default function sectionNumberingExtension(
  md: MarkdownIt,
  options: SectionNumberingOptions = {},
): void {
  md.core.ruler.push('tp_section_numbering', (state: StateCore): void => {
    const env = state.env as SectionNumberingEnvironment;

    const enabled =
      env.attributes?.sectionNumbering?.enabled ??
      env.attributes?.sectionNumbering?.enable ??
      options.enabled ??
      false;

    if (enabled !== true) {
      return;
    }

    const maxLevel = normalizeMaxLevel(
      env.attributes?.sectionNumbering?.maxLevel ?? options.maxLevel ?? 6,
    );

    const counters = Array.from({ length: maxLevel }, () => 0);

    for (let index = 0; index < state.tokens.length; index += 1) {
      const token = state.tokens[index];

      if (token?.type !== 'heading_open') {
        continue;
      }

      const level = Number(token.tag.slice(1));

      if (!Number.isInteger(level) || level < 1 || level > maxLevel) {
        continue;
      }

      counters[level - 1] = (counters[level - 1] ?? 0) + 1;

      for (
        let counterIndex = level;
        counterIndex < counters.length;
        counterIndex += 1
      ) {
        counters[counterIndex] = 0;
      }

      const number = counters
        .slice(0, level)
        .filter((value) => value > 0)
        .join('.');

      const inline = state.tokens[index + 1];

      if (inline?.type !== 'inline') {
        continue;
      }

      inline.children ??= [];

      const numberToken = new state.Token('html_inline', '', 0);
      numberToken.content = `<span data-section-number>${escapeHtml(number)} </span>`;

      inline.children.unshift(numberToken);
    }
  });
}

/**
 * Normalizes and clamps the configured maximum heading level.
 *
 * Invalid or non-integer values fall back to `6`.
 *
 * @param value - Raw maximum level value.
 * @returns A normalized heading level between `1` and `6`.
 */
function normalizeMaxLevel(value: unknown): number {
  const number = Number(value);

  if (!Number.isInteger(number)) {
    return 6;
  }

  return Math.min(Math.max(number, 1), 6);
}

/**
 * Escapes HTML-sensitive characters for safe inline HTML rendering.
 *
 * @param value - Raw text content.
 * @returns Escaped HTML string.
 */
function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}