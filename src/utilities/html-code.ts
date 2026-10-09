/**
 * @module utilities/html-code
 * @summary Utilities for formatting HTML code snippets for display.
 */

const VOID_TAGS = new Set([
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

const RAW_TEXT_TAGS = new Set([
  'script',
  'style',
]);
const INLINE_TAGS = new Set([
  'a',
  'abbr',
  'b',
  'bdi',
  'bdo',
  'br',
  'button',
  'cite',
  'code',
  'data',
  'del',
  'dfn',
  'em',
  'i',
  'img',
  'input',
  'ins',
  'kbd',
  'label',
  'mark',
  'q',
  'ruby',
  's',
  'samp',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
  'var',
  'wbr',
]);
function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeHtmlText(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function readAttributes(element: Element): string {
  const parts: string[] = [];

  for (const attribute of element.attributes) {
    if (attribute.value === '') {
      parts.push(attribute.name);
      continue;
    }

    parts.push(`${attribute.name}="${escapeHtml(attribute.value)}"`);
  }

  return parts.join(' ');
}

function appendTextLines(text: string, level: number, lines: string[]): void {
  const indent = '  '.repeat(level);
  const normalized = text.replace(/\r\n/g, '\n').trim();

  if (normalized === '') {
    return;
  }

  for (const line of normalized.split('\n')) {
    const content = line.trim();
    if (content === '') {
      continue;
    }

    lines.push(`${indent}${escapeHtmlText(content)}`);
  }
}

function appendRawTextLines(text: string, level: number, lines: string[]): void {
  const indent = '  '.repeat(level);
  const sourceLines = text.replace(/\r\n?/g, '\n').split('\n');

  while (sourceLines[0]?.trim() === '') sourceLines.shift();
  while (sourceLines.at(-1)?.trim() === '') sourceLines.pop();

  if (sourceLines.length === 0) {
    return;
  }

  const commonIndent = Math.min(
    ...sourceLines
      .filter((line) => line.trim() !== '')
      .map((line) => line.match(/^[\t ]*/)?.[0].length ?? 0),
  );

  for (const line of sourceLines) {
    lines.push(line.trim() === '' ? '' : `${indent}${line.slice(commonIndent)}`);
  }
}

function isInlineContent(node: Node): boolean {
  if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.COMMENT_NODE) {
    return true;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  const element = node as Element;
  const tag = element.tagName.toLowerCase();
  return INLINE_TAGS.has(tag) &&
    Array.from(element.childNodes).every(isInlineContent);
}

function serializeInlineNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return escapeHtmlText((node.textContent ?? '').replace(/\s+/g, ' '));
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    return `<!-- ${(node.textContent ?? '').trim()} -->`;
  }

  const element = node as Element;
  const tag = element.tagName.toLowerCase();
  const attrs = readAttributes(element);
  const openTag = attrs === '' ? `<${tag}>` : `<${tag} ${attrs}>`;
  if (VOID_TAGS.has(tag)) {
    return openTag;
  }

  return `${openTag}${Array.from(element.childNodes).map(serializeInlineNode).join('')}</${tag}>`;
}

function serializeNode(node: Node, level: number, lines: string[]): void {
  if (node.nodeType === Node.TEXT_NODE) {
    appendTextLines(node.textContent ?? '', level, lines);
    return;
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    const content = (node.textContent ?? '').trim();
    if (content !== '') {
      lines.push(`${'  '.repeat(level)}<!-- ${content} -->`);
    }
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const element = node as Element;
  const tag = element.tagName.toLowerCase();
  const attrs = readAttributes(element);
  const indent = '  '.repeat(level);
  const openTag = attrs === '' ? `<${tag}>` : `<${tag} ${attrs}>`;

  if (VOID_TAGS.has(tag)) {
    lines.push(`${indent}${openTag}`);
    return;
  }

  if (RAW_TEXT_TAGS.has(tag)) {
    lines.push(`${indent}${openTag}`);
    appendRawTextLines(element.textContent ?? '', level + 1, lines);
    lines.push(`${indent}</${tag}>`);
    return;
  }

  const children = Array.from(element.childNodes);
  if (children.length === 0) {
    lines.push(`${indent}${openTag}</${tag}>`);
    return;
  }

  const hasElementChild = children.some((child) => child.nodeType === Node.ELEMENT_NODE);
  if (!hasElementChild && children.length === 1 && children[0]?.nodeType === Node.TEXT_NODE) {
    const content = (children[0].textContent ?? '').replace(/\s+/g, ' ').trim();
    if (content !== '') {
      lines.push(`${indent}${openTag}${escapeHtmlText(content)}</${tag}>`);
      return;
    }
  }

  if (children.every(isInlineContent)) {
    const content = children.map(serializeInlineNode).join('').trim();
    lines.push(`${indent}${openTag}${content}</${tag}>`);
    return;
  }

  lines.push(`${indent}${openTag}`);
  for (const child of children) {
    serializeNode(child, level + 1, lines);
  }
  lines.push(`${indent}</${tag}>`);
}

/**
 * Formats raw HTML source for readable display.
 *
 * @summary Normalizes HTML into an indented multi-line representation.
 * @param source Raw HTML source.
 * @returns Formatted HTML string.
 */
export function formatHtmlForDisplay(source: string): string {
  const trimmed = source.trim();
  if (trimmed === '') {
    return '';
  }

  const parser = new DOMParser();
  const documentNode = parser.parseFromString(trimmed, 'text/html');
  const lines: string[] = [];
  const hasFullDocument = /<!doctype\s+html[\s>]/i.test(trimmed) || /<html[\s>]/i.test(trimmed);

  if (hasFullDocument) {
    lines.push('<!doctype html>');
    const root = documentNode.documentElement;
    if (root !== null) {
      serializeNode(root, 0, lines);
    }
    return lines.join('\n');
  }

  const template = document.createElement('template');
  template.innerHTML = trimmed;

  for (const node of Array.from(template.content.childNodes)) {
    serializeNode(node, 0, lines);
  }

  return lines.join('\n').trim();
}
