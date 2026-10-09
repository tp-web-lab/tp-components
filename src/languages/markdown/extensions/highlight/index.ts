/**
 * @module markdown/extensions/highlight
 * @summary Markdown-it extension integrating highlight.js syntax highlighting.
 */

import type MarkdownIt from 'markdown-it';

/**
 * Minimal highlight.js API used by this extension.
 *
 * @summary Represents the subset of the highlight.js API required for rendering.
 */
interface HighlightJsApi {
  /**
   * Returns whether a language is registered.
   *
   * @param language Language identifier.
   * @returns Registered language descriptor or `undefined`.
   */
  getLanguage(language: string): unknown;

  /**
   * Highlights code using an explicit language.
   *
   * @param code Source code to highlight.
   * @param options Highlighting options.
   * @returns Highlighted HTML fragment.
   */
  highlight(
    code: string,
    options: {
      language: string;
    },
  ): {
    value: string;
  };

  /**
   * Automatically detects the best language and highlights the code.
   *
   * @param code Source code to highlight.
   * @returns Highlighted HTML fragment.
   */
  highlightAuto(code: string): {
    value: string;
  };
}

/**
 * Extension of the global `window` object with highlight.js support.
 *
 * @summary Declares the optional global `hljs` instance.
 */
interface HighlightJsWindow extends Window {
  /**
   * Global highlight.js instance.
   */
  hljs?: HighlightJsApi;
}

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
 * Default highlight.js theme.
 *
 * @summary Fallback theme used when none is explicitly configured.
 * @internal
 */
const DEFAULT_THEME = 'github';

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
export default function markdownItHighlightJs(
  md: MarkdownIt,
  options: MarkdownHighlightOptions = {},
): void {
  const highlightjs = (window as HighlightJsWindow).hljs;

  if (highlightjs === undefined) {
    console.warn('highlight.js is not loaded');
    return;
  }

  if (options.loadTheme === true) {
    loadHighlightTheme(options.theme ?? DEFAULT_THEME);
  }

  md.set({
    highlight(code: string, language: string): string {
      try {
        if (language !== '' && highlightjs.getLanguage(language)) {
          const highlighted = highlightjs.highlight(code, {
            language,
          }).value;

          return `<pre><code class="hljs language-${md.utils.escapeHtml(language)}">${highlighted}</code></pre>`;
        }

        return `<pre><code class="hljs">${highlightjs.highlightAuto(code).value}</code></pre>`;
      } catch (error) {
        console.error(error);

        return `<pre><code>${md.utils.escapeHtml(code)}</code></pre>`;
      }
    },
  });
}

/**
 * Loads a highlight.js CSS theme dynamically.
 *
 * If a theme stylesheet already exists, its URL is updated instead of creating
 * a duplicate `<link>` element.
 *
 * @summary Injects or updates the highlight.js theme stylesheet.
 * @param theme Theme name.
 * @internal
 */
function loadHighlightTheme(theme: string): void {
  const id = 'tp-markdown-highlight-theme';

  const existing = document.getElementById(id);

  if (existing instanceof HTMLLinkElement) {
    existing.href = getHighlightThemeUrl(theme);
    return;
  }

  const link = document.createElement('link');

  link.id = id;
  link.rel = 'stylesheet';
  link.href = getHighlightThemeUrl(theme);

  document.head.append(link);
}

/**
 * Returns the CDN URL of a highlight.js CSS theme.
 *
 * @summary Builds the jsDelivr theme URL.
 * @param theme Theme name.
 * @returns Fully qualified CSS URL.
 * @internal
 */
function getHighlightThemeUrl(theme: string): string {
  return `https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/styles/${theme}.min.css`;
}
