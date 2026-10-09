/**
 * @module markdown/extensions/mathjax
 * @summary Markdown-it extension providing MathJax-based math rendering.
 */

import type MarkdownIt from 'markdown-it';
import type { Options } from 'markdown-it/lib/index.mjs';
import type Renderer from 'markdown-it/lib/renderer.mjs';
import type StateInline from 'markdown-it/lib/rules_inline/state_inline.mjs';
import type Token from 'markdown-it/lib/token.mjs';

/**
 * Rendering environment used by the MathJax extension.
 *
 * @summary Defines math-related rendering attributes.
 */
interface MathJaxEnvironment {
  attributes?: {
    /**
     * Default math syntax used by generic `:math:`
     * roles and ` ```math ` fences.
     */
    math?: 'latexmath' | 'asciimath' | string;
  };
}

/**
 * Metadata stored on math tokens.
 *
 * @summary Stores raw math source content.
 */
interface MathTokenMeta {
  /**
   * Raw math expression source.
   */
  source: string;
}

/**
 * Indicates whether the extension CSS has already been injected.
 *
 * @internal
 */
let hasRenderedMathStyles = false;

/**
 * Injects MathJax styles once per document.
 *
 * @summary Returns inline MathJax styles once.
 * @returns HTML style block or empty string.
 * @internal
 */
function renderMathStylesOnce(): string {
  if (hasRenderedMathStyles) {
    return '';
  }

  hasRenderedMathStyles = true;

  return renderMathStyles();
}

/**
 * Generates default MathJax rendering styles.
 *
 * Features:
 * - centered display equations
 * - horizontal scrolling for large formulas
 * - inline math alignment
 *
 * @summary Returns inline CSS for math rendering.
 * @returns HTML `<style>` element.
 * @internal
 */
function renderMathStyles(): string {
  return `
<style>
.tp-md-math-display {
  display: flex;
  justify-content: center;
  margin-block: 1rem;
  overflow-x: auto;
}

.tp-md-math-display mjx-container {
  margin-inline: auto;
}

.tp-md-math-inline {
  display: inline-block;
}
</style>
`;
}

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
export default function markdownMathJaxExtension(
  md: MarkdownIt,
  _options: Record<string, unknown> = {},
): void {
  registerInlineLatexMath(md);
  registerInlineAsciiMath(md);
  registerInlineGenericMath(md);
  registerMathFences(md);
}

/**
 * Registers inline LaTeX math roles.
 *
 * Syntax:
 *
 * ```md
 * :latexmath:\`...\`
 * ```
 *
 * @summary Adds inline LaTeX math support.
 * @param md Markdown-it instance.
 * @internal
 */
function registerInlineLatexMath(
  md: MarkdownIt,
): void {
  md.inline.ruler.before(
    'escape',
    'mathjax_latex_inline',
    (
      state: StateInline,
      silent: boolean,
    ): boolean => {
      return parseMathRole(
        state,
        silent,
        'latexmath',
        'mathjax_latex_inline',
      );
    },
  );

  md.renderer.rules.mathjax_latex_inline =
    renderLatexInline;
}

/**
 * Registers inline AsciiMath roles.
 *
 * Syntax:
 *
 * ```md
 * :asciimath:\`...\`
 * ```
 *
 * @summary Adds inline AsciiMath support.
 * @param md Markdown-it instance.
 * @internal
 */
function registerInlineAsciiMath(
  md: MarkdownIt,
): void {
  md.inline.ruler.before(
    'escape',
    'mathjax_asciimath_inline',
    (
      state: StateInline,
      silent: boolean,
    ): boolean => {
      return parseMathRole(
        state,
        silent,
        'asciimath',
        'mathjax_asciimath_inline',
      );
    },
  );

  md.renderer.rules.mathjax_asciimath_inline =
    renderAsciiMathInline;
}

/**
 * Registers generic inline math roles.
 *
 * Syntax:
 *
 * ```md
 * :math:\`...\`
 * ```
 *
 * The actual syntax engine depends on:
 *
 * ```yaml
 * math: latexmath
 * ```
 *
 * or:
 *
 * ```yaml
 * math: asciimath
 * ```
 *
 * @summary Adds configurable inline math support.
 * @param md Markdown-it instance.
 * @internal
 */
function registerInlineGenericMath(
  md: MarkdownIt,
): void {
  md.inline.ruler.before(
    'escape',
    'mathjax_generic_inline',
    (
      state: StateInline,
      silent: boolean,
    ): boolean => {
      return parseMathRole(
        state,
        silent,
        'math',
        'mathjax_generic_inline',
      );
    },
  );

  md.renderer.rules.mathjax_generic_inline =
    (
      tokens: Token[],
      index: number,
      _options: Options,
      env: MathJaxEnvironment,
    ): string => {
      const source = getMathSource(
        tokens[index],
      );

      const math =
        env.attributes?.math ??
        'latexmath';

      if (math === 'asciimath') {
        return renderAsciiMathElement(
          source,
          false,
        );
      }

      return renderLatexElement(
        source,
        false,
      );
    };
}

/**
 * Parses an inline math role.
 *
 * Example:
 *
 * ```md
 * :latexmath:\`x^2\`
 * ```
 *
 * @summary Parses inline math expressions.
 * @param state Inline parser state.
 * @param silent Silent parsing mode.
 * @param roleName Role name to parse.
 * @param tokenType Generated token type.
 * @returns `true` if parsing succeeded.
 * @internal
 */
function parseMathRole(
  state: StateInline,
  silent: boolean,
  roleName: string,
  tokenType: string,
): boolean {
  const prefix = `:${roleName}:\``;

  if (
    !state.src.startsWith(
      prefix,
      state.pos,
    )
  ) {
    return false;
  }

  const sourceStart =
    state.pos + prefix.length;

  const sourceEnd =
    state.src.indexOf(
      '`',
      sourceStart,
    );

  if (sourceEnd === -1) {
    return false;
  }

  const source = state.src.slice(
    sourceStart,
    sourceEnd,
  );

  if (source === '') {
    return false;
  }

  if (!silent) {
    const token = state.push(
      tokenType,
      '',
      0,
    );

    token.content = '';

    token.meta = {
      source,
    } satisfies MathTokenMeta;
  }

  state.pos = sourceEnd + 1;

  return true;
}

/**
 * Renders inline LaTeX math.
 *
 * @summary Renders inline LaTeX placeholders.
 * @param tokens Markdown tokens.
 * @param index Token index.
 * @returns HTML output.
 * @internal
 */
function renderLatexInline(
  tokens: Token[],
  index: number,
): string {
  return renderLatexElement(
    getMathSource(tokens[index]),
    false,
  );
}

/**
 * Renders inline AsciiMath.
 *
 * @summary Renders inline AsciiMath placeholders.
 * @param tokens Markdown tokens.
 * @param index Token index.
 * @returns HTML output.
 * @internal
 */
function renderAsciiMathInline(
  tokens: Token[],
  index: number,
): string {
  return renderAsciiMathElement(
    getMathSource(tokens[index]),
    false,
  );
}

/**
 * Registers fenced math blocks.
 *
 * Supported fences:
 *
 * ````md
 * ```latexmath
 * ```
 *
 * ```asciimath
 * ```
 *
 * ```math
 * ```
 * ````
 *
 * @summary Adds block math fence rendering.
 * @param md Markdown-it instance.
 * @internal
 */
function registerMathFences(
  md: MarkdownIt,
): void {
  const defaultFence =
    md.renderer.rules.fence;

  md.renderer.rules.fence = (
    tokens: Token[],
    index: number,
    options: Options,
    env: MathJaxEnvironment,
    self: Renderer,
  ): string => {
    const token = tokens[index];

    if (token === undefined) {
      return '';
    }

    const info = token.info.trim();

    if (
      info !== 'math' &&
      info !== 'latexmath' &&
      info !== 'asciimath'
    ) {
      return typeof defaultFence ===
        'function'
        ? defaultFence(
            tokens,
            index,
            options,
            env,
            self,
          )
        : self.renderToken(
            tokens,
            index,
            options,
          );
    }

    const source =
      token.content.trim();

    if (info === 'asciimath') {
      return renderAsciiMathElement(
        source,
        true,
      );
    }

    if (
      info === 'math' &&
      env.attributes?.math ===
        'asciimath'
    ) {
      return renderAsciiMathElement(
        source,
        true,
      );
    }

    return renderLatexElement(
      source,
      true,
    );
  };
}

/**
 * Extracts math source content from a token.
 *
 * @summary Returns math expression source.
 * @param token Markdown token.
 * @returns Raw math source.
 * @internal
 */
function getMathSource(
  token: Token | undefined,
): string {
  const meta = token?.meta;

  if (
    typeof meta === 'object' &&
    meta !== null &&
    typeof (
      meta as Partial<MathTokenMeta>
    ).source === 'string'
  ) {
    return (
      meta as MathTokenMeta
    ).source;
  }

  return '';
}

/**
 * Generates a LaTeX math placeholder element.
 *
 * @summary Renders LaTeX math placeholders.
 * @param source Raw math expression.
 * @param display Whether display mode is enabled.
 * @returns HTML output.
 * @internal
 */
function renderLatexElement(
  source: string,
  display: boolean,
): string {
  const tag = display
    ? 'div'
    : 'span';

  const className = display
    ? 'tp-md-math tp-md-math-display'
    : 'tp-md-math tp-md-math-inline';

  return `${renderMathStylesOnce()}<${tag} class="${className}" data-mathjax-tex="${escapeAttribute(source)}" data-mathjax-display="${String(display)}"></${tag}>`;
}

/**
 * Generates an AsciiMath placeholder element.
 *
 * @summary Renders AsciiMath placeholders.
 * @param source Raw math expression.
 * @param display Whether display mode is enabled.
 * @returns HTML output.
 * @internal
 */
function renderAsciiMathElement(
  source: string,
  display: boolean,
): string {
  const tag = display
    ? 'div'
    : 'span';

  const className = display
    ? 'tp-md-math tp-md-math-display'
    : 'tp-md-math tp-md-math-inline';

  return `${renderMathStylesOnce()}<${tag} class="${className}" data-mathjax-asciimath="${escapeAttribute(source)}" data-mathjax-display="${String(display)}"></${tag}>`;
}

/**
 * Escapes HTML special characters.
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
function escapeAttribute(
  value: string,
): string {
  return escapeHtml(value);
}