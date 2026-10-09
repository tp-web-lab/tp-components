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
import type { Options } from 'markdown-it/lib/index.mjs';
import type StateBlock from 'markdown-it/lib/rules_block/state_block.mjs';
import type StateCore from 'markdown-it/lib/rules_core/state_core.mjs';
import type Token from 'markdown-it/lib/token.mjs';

/**
 * Represents a single heading collected from the Markdown document.
 */
interface TocHeading {
  /**
   * Heading depth level (`1` to `6`).
   */
  level: number;

  /**
   * Generated or existing HTML identifier.
   */
  id: string;

  /**
   * Plain text heading title.
   */
  title: string;
}

/**
 * Represents a hierarchical TOC node.
 */
interface TocTreeItem extends TocHeading {
  /**
   * Nested child headings.
   */
  children: TocTreeItem[];
}

/**
 * Front matter attributes supported by the TOC extension.
 */
interface TocAttributes {
  /**
   * Table of contents configuration.
   */
  toc?: {
    /**
     * Maximum heading level included in the TOC.
     */
    maxLevel?: number;
  };
}

/**
 * Markdown rendering environment used by the TOC extension.
 */
interface TocEnvironment {
  /**
   * Parsed Markdown attributes and front matter configuration.
   */
  attributes?: TocAttributes;

  /**
   * Collected TOC headings stored during rendering.
   */
  __tp_toc?: TocHeading[];
}

/**
 * Metadata attached to TOC placeholder tokens.
 */
interface TocTokenMeta {
  /**
   * Display title shown in the TOC summary.
   */
  title: string;
}

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
export default function markdownItTableOfContents(
  md: MarkdownIt,
  options: TocPluginOptions = {},
): void {
  md.core.ruler.push('tp_collect_toc', (state: StateCore): void => {
    const env = state.env as TocEnvironment;

    const maxLevel = Number(env.attributes?.toc?.maxLevel ?? 6);

    const headings: TocHeading[] = [];

    for (let index = 0; index < state.tokens.length; index += 1) {
      const token = state.tokens[index];

      if (token?.type !== 'heading_open') {
        continue;
      }

      const level = Number(token.tag.slice(1));

      if (!Number.isInteger(level) || level < 1 || level > maxLevel) {
        continue;
      }

      const next = state.tokens[index + 1];
      const rawTitle = next?.type === 'inline' ? renderInlinePlainText(next) : '';

      if (rawTitle === '') {
        continue;
      }

      const existingId = token.attrGet('id');
      const id = existingId ?? slugify(rawTitle);

      if (existingId === null) {
        token.attrSet('id', id);
      }

      headings.push({
        level,
        id,
        title: rawTitle,
      });
    }

    env.__tp_toc = headings;
  });

  md.block.ruler.before(
    'paragraph',
    'table_of_contents',
    (
      state: StateBlock,
      startLine: number,
      _endLine: number,
      silent: boolean,
    ): boolean => {
      const pos =
        (state.bMarks[startLine] ?? 0) +
        (state.tShift[startLine] ?? 0);

      const max = state.eMarks[startLine] ?? pos;

      const line = state.src.slice(pos, max).trim();

      const match =
        line.match(/^\[\[toc(?::(.*))?\]\]$/i) ??
        line.match(/^\[toc(?::(.*))?\]$/i) ??
        line.match(/^\$\{toc(?::(.*))?\}$/i);

      if (match === null) {
        return false;
      }

      if (silent) {
        return true;
      }

      const title =
        typeof match[1] === 'string' && match[1].trim() !== ''
          ? match[1].trim()
          : (options.defaultTitle ?? 'Contents');

      const token = state.push('toc_body', '', 0);

      token.block = true;
      token.meta = {
        title,
      } satisfies TocTokenMeta;

      state.line = startLine + 1;

      return true;
    },
  );

  md.renderer.rules.toc_body = (
    tokens: Token[],
    index: number,
    _options: Options,
    env: TocEnvironment,
  ): string => {
    const token = tokens[index];

    if (token === undefined) {
      return '';
    }

    const headings = env.__tp_toc ?? [];

    const title =
      typeof token.meta === 'object' &&
      token.meta !== null &&
      typeof (token.meta as Partial<TocTokenMeta>).title === 'string'
        ? (token.meta as TocTokenMeta).title
        : 'Contents';

    const tree = buildTocTree(headings);

    return `
${renderTocStyles()}
<details data-markdown-toc>
  <summary>${escapeHtml(title)}</summary>
  ${renderTocItems(tree)}
</details>
`;
  };
}

function buildTocTree(headings: readonly TocHeading[]): TocTreeItem[] {
  const root: TocTreeItem[] = [];

  const stack: Array<{
    level: number;
    children: TocTreeItem[];
  }> = [
    {
      level: 0,
      children: root,
    },
  ];

  for (const heading of headings) {
    const item: TocTreeItem = {
      ...heading,
      children: [],
    };

    while (
      stack.length > 1 &&
      heading.level <= getLastStackItem(stack).level
    ) {
      stack.pop();
    }

    getLastStackItem(stack).children.push(item);
    stack.push(item);
  }

  return root;
}

/**
 * Extracts plain text content from an inline Markdown token.
 *
 * Inline HTML tokens are stripped of their HTML tags so the resulting
 * string can safely be used for heading titles and generated identifiers.
 *
 * @param token - Inline token containing child inline tokens.
 * @returns Concatenated plain text representation.
 */
function renderInlinePlainText(token: Token): string {
  return (token.children ?? [])
    .map((child) => {
      if (child.type === 'html_inline') {
        return child.content.replace(/<[^>]*>/g, '');
      }

      return child.content;
    })
    .join('')
    .trim();
}

/**
 * Returns the last item of the TOC stack.
 *
 * The stack is used while building the hierarchical TOC tree.
 * If the stack is unexpectedly empty, a default root node is returned.
 *
 * @param stack - Current TOC hierarchy stack.
 * @returns The last stack item.
 */
function getLastStackItem(
  stack: Array<{
    level: number;
    children: TocTreeItem[];
  }>,
): {
  level: number;
  children: TocTreeItem[];
} {
  const last = stack.at(-1);

  if (last === undefined) {
    return {
      level: 0,
      children: [],
    };
  }

  return last;
}

/**
 * Recursively renders hierarchical TOC items as nested HTML lists.
 *
 * When headings already contain section numbers, a dedicated attribute
 * is added to the generated `<ul>` element so list markers can be
 * disabled with CSS.
 *
 * @param items - TOC tree items to render.
 * @returns HTML representation of the TOC subtree.
 */
function renderTocItems(items: readonly TocTreeItem[]): string {
  if (items.length === 0) {
    return '<ul></ul>';
  }

  const hasSectionNumbers = items.some((item) =>
    /^\d+(\.\d+)*\s/.test(item.title),
  );

  return `
<ul${hasSectionNumbers ? ' data-toc-numbered' : ''}>
  ${items
    .map(
      (item) => `
<li data-level="${item.level}">
  <a href="#${escapeAttribute(item.id)}">
    ${escapeHtml(item.title)}
  </a>

  ${renderTocItems(item.children)}
</li>`,
    )
    .join('')}
</ul>
`;
}

/**
 * Renders the CSS styles used by the generated table of contents.
 *
 * The styles remove default list markers when headings already contain
 * section numbers and adjust nested list indentation.
 *
 * @returns A `<style>` element as an HTML string.
 */
function renderTocStyles(): string {
  return `
<style>
[data-markdown-toc] ul[data-toc-numbered] {
  list-style: none;
  padding-inline-start: 1.25rem;
}

[data-markdown-toc] ul[data-toc-numbered] ul[data-toc-numbered] {
  padding-inline-start: 1.5rem;
}
</style>
`;
}

/**
 * Generates a URL-safe slug from a heading title.
 *
 * The generated slug:
 *
 * - trims surrounding whitespace,
 * - converts text to lowercase,
 * - removes diacritics,
 * - replaces non-alphanumeric characters with hyphens,
 * - removes leading and trailing hyphens.
 *
 * @param value - Raw heading title.
 * @returns URL-safe identifier.
 */
function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Escapes HTML-sensitive characters for safe HTML rendering.
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

/**
 * Escapes a string for safe usage inside HTML attributes.
 *
 * @param value - Raw attribute value.
 * @returns Escaped attribute-safe string.
 */
function escapeAttribute(value: string): string {
  return escapeHtml(value);
}