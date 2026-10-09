/**
 * @module markdown/extensions/web-component
 * @summary Markdown-it extension that renders Markdown directives as custom
 * HTML elements.
 *
 * This extension reserves container directives for web components:
 *
 * ```md
 * ::: sl-card {variant="primary"}
 * Card content
 * :::
 * ```
 *
 * and inline directives:
 *
 * ```md
 * :sl-badge:Success{variant="success" pill}
 * ```
 *
 * Block directives render Markdown content inside the generated custom
 * element, while inline directives render escaped text content.
 */

import type MarkdownIt from 'markdown-it';
import type StateBlock from 'markdown-it/lib/rules_block/state_block.mjs';
import type StateInline from 'markdown-it/lib/rules_inline/state_inline.mjs';
import type Token from 'markdown-it/lib/token.mjs';

/**
 * Parsed container fence metadata.
 *
 * @summary Describes the opening fence of a web component block.
 */
interface ContainerFence {
  /**
   * Fence marker, for example `:::`.
   */
  fence: string;

  /**
   * Raw directive information after the fence.
   */
  info: string;
}

/**
 * Parsed custom element declaration.
 *
 * @summary Stores the tag name and raw HTML attributes.
 */
interface ElementDeclaration {
  /**
   * Sanitized custom element tag name.
   */
  tag: string;

  /**
   * Raw attributes extracted from the `{...}` block.
   */
  attributes: string;
}

const RAW_TEXT_ELEMENTS = new Set(['script', 'style', 'textarea', 'template']);
const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

/**
 * Minimal Markdown-it rule descriptor.
 *
 * @summary Represents a parser rule entry.
 */
interface MarkdownItRuleDescriptor {
  /**
   * Rule name.
   */
  name: string;
}

/**
 * Extended Markdown-it ruler exposing internal rule descriptors.
 *
 * @summary Used to detect whether `markdown-it-container` is registered.
 */
interface MarkdownItRulerWithRules {
  /**
   * Internal Markdown-it rule list.
   */
  __rules__?: MarkdownItRuleDescriptor[];
}

/**
 * Registers web component block and inline directives.
 *
 * @summary Enables web component rendering in Markdown.
 * @param md Markdown-it instance to extend.
 */
export default function markdownWebComponentExtension(md: MarkdownIt): void {
  registerWebComponentBlock(md);
  registerWebComponentInline(md);
}

/**
 * Registers block web component directives.
 *
 * Block syntax:
 *
 * ```md
 * ::: tag-name {attr="value" boolean-attr}
 * Markdown content
 * :::
 * ```
 *
 * The inner content is rendered as Markdown before being inserted inside the
 * generated element.
 *
 * @summary Adds block custom element support.
 * @param md Markdown-it instance.
 * @internal
 */
function registerWebComponentBlock(md: MarkdownIt): void {
  md.block.ruler.before(
    getBeforeRule(md),
    'web_component_block',
    (state: StateBlock, startLine: number, endLine: number, silent: boolean) => {
      const parsed = parseContainerFence(getLine(state, startLine).trim());

      if (parsed === null) {
        return false;
      }

      const declaration = parseElementDeclaration(parsed.info);

      if (declaration === null) {
        return false;
      }

      if (silent) {
        return true;
      }

      const content = collectContainerContent(
        state,
        startLine,
        endLine,
        parsed.fence,
      );

      const token = state.push('web_component_block', '', 0);
      token.content = content.content;
      token.meta = declaration;
      token.block = true;

      state.line = content.nextLine;
      return true;
    },
    { alt: ['paragraph', 'reference', 'blockquote', 'list'] },
  );

  md.renderer.rules.web_component_block = (
    tokens: Token[],
    index: number,
  ): string => {
    const token = tokens[index];

    if (token === undefined) {
      return '';
    }

    const meta = readElementDeclarationMeta(token.meta, 'div');
    if (VOID_ELEMENTS.has(meta.tag)) {
      return `<${meta.tag}${meta.attributes !== '' ? ` ${meta.attributes}` : ''}>\n`;
    }
    const content = RAW_TEXT_ELEMENTS.has(meta.tag)
      ? token.content
      : meta.tag === 'p'
        ? md.renderInline(token.content.trim())
        : md.render(token.content);

    return `<${meta.tag}${meta.attributes !== '' ? ` ${meta.attributes}` : ''}>
${content}
</${meta.tag}>
`;
  };
}

/**
 * Registers inline web component directives.
 *
 * Inline syntax:
 *
 * ```md
 * :tag-name:content{attr="value" boolean-attr}
 * ```
 *
 * The trailing `{...}` attribute block is required so the rule consumes the
 * whole directive before other Markdown rules can process its attributes.
 *
 * @summary Adds inline custom element support.
 * @param md Markdown-it instance.
 * @internal
 */
function registerWebComponentInline(md: MarkdownIt): void {
  md.inline.ruler.before(
    'emphasis',
    'web_component_inline',
    (state: StateInline, silent: boolean) => {
      if (state.src[state.pos] !== ':') {
        return false;
      }

      const source = state.src.slice(state.pos);
      // Content between :tag: and {attrs} is optional — elements like <tp-icon>
      // have no text content, only attributes.
      const match = source.match(/^:([a-z][a-z0-9-]*):([^\n]*?)\{([^}\n]*)\}/i);

      if (match === null) {
        return false;
      }

      const rawTag = match[1] ?? '';
      const rawContent = match[2] ?? '';
      const rawAttributes = `{${match[3] ?? ''}}`;

      const tag = sanitizeTagName(rawTag);
      const attributes = parseAttributeBlock(rawAttributes);

      if (tag === 'div') {
        return false;
      }

      if (!silent) {
        const token = state.push('web_component_inline', '', 0);
        token.content = rawContent.trim();
        token.meta = {
          tag,
          attributes,
        } satisfies ElementDeclaration;
      }

      state.pos += match[0].length;
      return true;
    },
  );

  md.renderer.rules.web_component_inline = (
    tokens: Token[],
    index: number,
  ): string => {
    const token = tokens[index];

    if (token === undefined) {
      return '';
    }

    const meta = readElementDeclarationMeta(token.meta, 'span');
    const content = md.utils.escapeHtml(token.content);

    if (VOID_ELEMENTS.has(meta.tag)) {
      return `<${meta.tag}${meta.attributes !== '' ? ` ${meta.attributes}` : ''}>`;
    }

    return `<${meta.tag}${meta.attributes !== '' ? ` ${meta.attributes}` : ''}>${content}</${meta.tag}>`;
  };
}

/**
 * Parses a container fence line.
 *
 * @summary Extracts the fence marker and directive info.
 * @param line Trimmed source line.
 * @returns Parsed fence metadata or `null`.
 * @internal
 */
function parseContainerFence(line: string): ContainerFence | null {
  const match = line.match(/^(:{3,})(.*)$/);

  if (match === null) {
    return null;
  }

  const fence = match[1];

  if (fence === undefined) {
    return null;
  }

  return {
    fence,
    info: match[2]?.trim() ?? '',
  };
}

/**
 * Parses a web component declaration.
 *
 * Expected syntax:
 *
 * ```txt
 * tag-name {attr="value" boolean-attr}
 * ```
 *
 * @summary Extracts the tag name and attributes.
 * @param info Raw directive info.
 * @returns Parsed declaration or `null`.
 * @internal
 */
function parseElementDeclaration(info: string): ElementDeclaration | null {
  const match = info.match(/^([a-z][a-z0-9-]*)(?:\s+(\{[\s\S]*\}))?$/i);

  if (match === null) {
    return null;
  }

  const rawTag = match[1];

  if (rawTag === undefined) {
    return null;
  }

  const tag = sanitizeTagName(rawTag);

  if (tag === 'div' && rawTag !== 'div') {
    return null;
  }

  return {
    tag,
    attributes: parseAttributeBlock(match[2] ?? ''),
  };
}

/**
 * Parses a raw `{...}` attribute block.
 *
 * The returned string is intended to be inserted as raw HTML attributes.
 *
 * @summary Extracts attribute text.
 * @param source Raw attribute block.
 * @returns Attribute string without surrounding braces.
 * @internal
 */
function parseAttributeBlock(source: string): string {
  const value = source.trim();

  if (value === '') {
    return '';
  }

  if (!value.startsWith('{') || !value.endsWith('}')) {
    return '';
  }

  return value.slice(1, -1).trim();
}

/**
 * Collects block content until the matching closing fence.
 *
 * @summary Reads web component block body lines.
 * @param state Markdown block parser state.
 * @param startLine Opening fence line.
 * @param endLine Last available line.
 * @param openingFence Fence marker to match.
 * @returns Collected content and next parser line.
 * @internal
 */
function collectContainerContent(
  state: StateBlock,
  startLine: number,
  endLine: number,
  openingFence: string,
): { content: string; nextLine: number } {
  const lines: string[] = [];
  let nextLine = startLine + 1;

  while (nextLine < endLine) {
    const rawLine = getLine(state, nextLine);

    if (rawLine.trim() === openingFence) {
      return {
        content: lines.join('\n'),
        nextLine: nextLine + 1,
      };
    }

    lines.push(rawLine);
    nextLine += 1;
  }

  return {
    content: lines.join('\n'),
    nextLine,
  };
}

/**
 * Reads a source line from the block parser state.
 *
 * @summary Returns raw line content.
 * @param state Markdown block parser state.
 * @param line Line index.
 * @returns Raw line text.
 * @internal
 */
function getLine(state: StateBlock, line: number): string {
  const bMark = state.bMarks[line] ?? 0;
  const tShift = state.tShift[line] ?? 0;
  const eMark = state.eMarks[line] ?? bMark;

  const start = bMark + tShift;

  return state.src.slice(start, eMark);
}

/**
 * Sanitizes a custom element tag name.
 *
 * Invalid tag names fall back to `div`.
 *
 * @summary Validates and normalizes tag names.
 * @param value Raw tag name.
 * @returns Sanitized lowercase tag name.
 * @internal
 */
function sanitizeTagName(value: string): string {
  const tag = value.trim().toLowerCase();

  return /^[a-z][a-z0-9-]*$/.test(tag) ? tag : 'div';
}

/**
 * Safely reads element declaration metadata from a token.
 *
 * @summary Extracts element declaration metadata.
 * @param value Raw token metadata.
 * @param fallbackTag Fallback tag name.
 * @returns Parsed element declaration.
 * @internal
 */
function readElementDeclarationMeta(
  value: unknown,
  fallbackTag: string,
): ElementDeclaration {
  if (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Partial<ElementDeclaration>).tag === 'string'
  ) {
    const candidate = value as Partial<ElementDeclaration>;

    return {
      tag: sanitizeTagName(candidate.tag ?? fallbackTag),
      attributes:
        typeof candidate.attributes === 'string'
          ? candidate.attributes.trim()
          : '',
    };
  }

  return {
    tag: fallbackTag,
    attributes: '',
  };
}

/**
 * Determines which block rule this extension should run before.
 *
 * This extension runs before every other block rule so web-component fences
 * keep priority over generic or named container rules. Non-directive lines are
 * rejected immediately and continue through the regular Markdown pipeline.
 *
 * @summary Resolves the block parser insertion point.
 * @param md Markdown-it instance.
 * @returns Rule name to insert before.
 * @internal
 */
function getBeforeRule(md: MarkdownIt): string {
  const ruler = md.block.ruler as MarkdownIt['block']['ruler'] &
    MarkdownItRulerWithRules;
  return ruler.__rules__?.[0]?.name ?? 'fence';
}
