/**
 * @module markdown/extensions/mermaid
 * @summary Markdown-it extension providing Mermaid diagram rendering support.
 */

import type MarkdownIt from 'markdown-it';
import type { Options } from 'markdown-it/lib/index.mjs';
import type Renderer from 'markdown-it/lib/renderer.mjs';
import type Token from 'markdown-it/lib/token.mjs';

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
export default function markdownMermaidExtension(
  md: MarkdownIt,
  options: MermaidPluginOptions = {},
): void {
  registerMermaidFence(md, options);
}

/**
 * Overrides Markdown-it fence rendering to handle
 * Mermaid code blocks.
 *
 * Non-Mermaid fences are delegated to the original
 * fence renderer.
 *
 * @summary Registers Mermaid fence rendering.
 * @param md Markdown-it instance.
 * @param options Mermaid extension options.
 * @internal
 */
function registerMermaidFence(
  md: MarkdownIt,
  options: MermaidPluginOptions,
): void {
  const defaultFence = md.renderer.rules.fence;

  md.renderer.rules.fence = (
    tokens: Token[],
    index: number,
    rendererOptions: Options,
    env: unknown,
    self: Renderer,
  ): string => {
    const token = tokens[index];

    if (token === undefined) {
      return '';
    }

    const info = token.info.trim();

    if (info !== 'mermaid') {
      return typeof defaultFence === 'function'
        ? defaultFence(
            tokens,
            index,
            rendererOptions,
            env,
            self,
          )
        : self.renderToken(
            tokens,
            index,
            rendererOptions,
          );
    }

    const className =
      options.className ?? 'tp-md-mermaid';

    return `
<div class="${escapeAttribute(className)}">
  <pre class="mermaid">${escapeHtml(token.content.trim())}</pre>
</div>
`;
  };
}

/**
 * Escapes HTML special characters.
 *
 * Prevents Mermaid source content from breaking
 * generated HTML output.
 *
 * @summary Escapes unsafe HTML characters.
 * @param value Source string.
 * @returns Escaped HTML string.
 * @internal
 */
function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/**
 * Escapes HTML attribute values.
 *
 * @summary Escapes unsafe HTML attribute characters.
 * @param value Source string.
 * @returns Escaped attribute string.
 * @internal
 */
function escapeAttribute(value: string): string {
  return escapeHtml(value);
}