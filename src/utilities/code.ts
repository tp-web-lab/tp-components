/**
 * @module utilities/code
 * @summary Utilities for loading, normalizing, and detecting source code blocks.
 */

/**
 * Represents a resolved code block.
 *
 * @summary Resolved data for a source snippet.
 */
export type TpResolvedCode = {
  /**
   * Logical source file name.
   */
  filename: string;

  /**
   * Detected or provided language.
   */
  language: string;

  /**
   * Textual code content.
   */
  value: string;
};

/**
 * File extension to language mapping.
 *
 * @summary Maps file extensions to language identifiers.
 * @internal
 */
const LANGUAGE_BY_EXTENSION: Record<string, string> = {
  c: 'c',
  cpp: 'cpp',
  css: 'css',
  h: 'c',
  htm: 'html',
  html: 'html',
  java: 'java',
  js: 'javascript',
  json: 'json',
  jsx: 'jsx',
  md: 'markdown',
  mjs: 'javascript',
  pl: 'prolog',
  py: 'python',
  rest: 'restructuredtext',
  rst: 'restructuredtext',
  sh: 'shell',
  sql: 'sql',
  svg: 'xml',
  ts: 'typescript',
  tsx: 'tsx',
  txt: 'plaintext',
  xml: 'xml',
  yaml: 'yaml',
  yml: 'yaml',
};

/**
 * Removes shared indentation from a multi-line text block.
 *
 * Useful for cleaning the content of `<script type="...">`
 * or an indented `<template>` inside HTML.
 *
 * @summary Removes common indentation from multiline text.
 * @param input Text to normalize.
 * @returns Dedented text.
 */
export function dedent(input: string): string {
  const lines = input.replace(/\r\n/g, '\n').split('\n');

  while (lines.length > 0 && lines[0]?.trim() === '') {
    lines.shift();
  }

  while (lines.length > 0 && lines[lines.length - 1]?.trim() === '') {
    lines.pop();
  }

  if (lines.length === 0) {
    return '';
  }

  let minIndent: number | null = null;

  for (const line of lines) {
    if (line.trim() === '') {
      continue;
    }

    const match = line.match(/^[\t ]*/);
    const indent = match ? match[0].length : 0;

    if (minIndent === null || indent < minIndent) {
      minIndent = indent;
    }
  }

  if (minIndent === null || minIndent === 0) {
    return lines.join('\n');
  }

  return lines
    .map((line) => {
      if (line.trim() === '') {
        return '';
      }

      return line.slice(minIndent);
    })
    .join('\n');
}

/**
 * Infers a language from a file name.
 *
 * If no known extension is found, returns `plaintext`.
 *
 * @summary Detects a language from a file extension.
 * @param filename File name or path.
 * @returns Detected language.
 */
export function getLanguageFromFilename(filename: string): string {
  const normalized = filename.trim().toLowerCase().split(/[?#]/, 1)[0] ?? '';
  const match = /\.([a-z0-9]+)$/.exec(normalized);

  if (!match?.[1]) {
    return 'plaintext';
  }

  return LANGUAGE_BY_EXTENSION[match[1]] ?? 'plaintext';
}

/**
 * Normalizes an explicit language value.
 *
 * If the language is missing or empty, returns `plaintext`.
 *
 * @summary Normalizes a language value.
 * @param language Provided language.
 * @returns Normalized language.
 * @internal
 */
function normalizeLanguage(language?: string): string {
  const value = language?.trim().toLowerCase() ?? '';
  return value === '' ? 'plaintext' : value;
}

/**
 * Loads a text file with `fetch` and returns its content, name, and language.
 *
 * If `language` is not provided, the language is inferred from the extension.
 * If no known extension is found, the language becomes `plaintext`.
 *
 * @summary Loads code from a file.
 * @param filename URL or path of the file to load.
 * @param language Optional language.
 * @returns Resolved file data.
 * @throws {Error} If loading fails.
 */
export async function getCodeFromFile(
  filename: string,
  language?: string,
): Promise<TpResolvedCode> {
  const fetchCandidates = [filename];

  const retryFromParent = resolveRelativeAgainstFrameLocation(filename, 'parent');
  if (retryFromParent !== null && !fetchCandidates.includes(retryFromParent)) {
    fetchCandidates.push(retryFromParent);
  }

  const retryFromTop = resolveRelativeAgainstFrameLocation(filename, 'top');
  if (retryFromTop !== null && !fetchCandidates.includes(retryFromTop)) {
    fetchCandidates.push(retryFromTop);
  }

  const retryFromDocsRoot = resolveRelativeAgainstDocsRoot(filename);
  if (retryFromDocsRoot !== null && !fetchCandidates.includes(retryFromDocsRoot)) {
    fetchCandidates.push(retryFromDocsRoot);
  }

  let response: Response | null = null;
  let value = '';
  let loadedFrom = filename;
  let didLoad = false;

  for (const candidate of fetchCandidates) {
    const next = await globalThis.fetch(candidate);
    if (!next.ok) {
      response = next;
      continue;
    }

    const nextValue = await next.text();
    const likelyFallback = isLikelyHtmlFallback(filename, next, nextValue);
    response = next;

    if (likelyFallback) {
      continue;
    }

    loadedFrom = candidate;
    value = nextValue;
    didLoad = true;
    break;
  }

  if (response === null || !response.ok || !didLoad) {
    const status = response?.status ?? 0;
    throw new Error(`Failed to fetch "${filename}" (${String(status)}).`);
  }

  return {
    filename: loadedFrom,
    language:
      language === undefined || language.trim() === ''
        ? getLanguageFromFilename(loadedFrom)
        : normalizeLanguage(language),
    value,
  };
}

function isLikelyHtmlFallback(
  filename: string,
  response: Response,
  body: string,
): boolean {
  const lower = filename.trim().toLowerCase().split(/[?#]/, 1)[0] ?? '';
  const extensionMatch = /\.([a-z0-9]+)$/.exec(lower);
  const extension = extensionMatch?.[1] ?? '';

  if (extension === 'html' || extension === 'htm' || extension === 'xhtml') {
    return false;
  }

  const contentType = (response.headers.get('content-type') ?? '').toLowerCase();
  const normalized = body.trimStart().toLowerCase();
  const looksLikeHtmlDocument =
    normalized.startsWith('<!doctype html') || normalized.startsWith('<html');

  if (!looksLikeHtmlDocument) {
    return false;
  }

  if (contentType.includes('text/html')) {
    return true;
  }
  return true;
}

function resolveRelativeAgainstFrameLocation(
  filename: string,
  scope: 'parent' | 'top',
): string | null {
  const raw = filename.trim();
  if (raw === '' || (!raw.startsWith('./') && !raw.startsWith('../'))) {
    return null;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const location =
      scope === 'parent'
        ? window.parent?.location?.href
        : window.top?.location?.href;

    if (!location || location === 'about:blank') {
      return null;
    }

    return new URL(raw, location).href;
  } catch {
    return null;
  }
}

function resolveRelativeAgainstDocsRoot(filename: string): string | null {
  const raw = filename.trim();
  if (!raw.startsWith('../')) {
    return null;
  }

  const normalized = raw.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');
  if (normalized === '') {
    return null;
  }

  return `/docs/${normalized}`;
}

/**
 * Searches for a `<script type="tp/<language>">` in a container and returns
 * its dedented content, logical name, and resolved language.
 *
 * Rules:
 * - if `language` is provided, searches for `script[type="tp/<language>"]`
 * - otherwise searches for the first `script[type^="tp/"]`
 * - if the script has a `filename`, the language may be inferred from that name
 * - if no language is known, returns `plaintext`
 *
 * @summary Resolves code from an inline script.
 * @param language Desired or expected language.
 * @param root Search root element. Defaults to `document`.
 * @returns Resolved script data, or `null` if no matching script is found.
 */
export function getCodeFromScript(
  language?: string,
  root: ParentNode = document,
): TpResolvedCode | null {
  const normalizedLanguage =
    language === undefined || language.trim() === ''
      ? ''
      : normalizeLanguage(language);

  const selector =
    normalizedLanguage === ''
      ? 'script[type^="tp/"]'
      : `script[type="tp/${normalizedLanguage}"]`;

  const script = root.querySelector(selector);

  if (!(script instanceof HTMLScriptElement)) {
    return null;
  }

  const filename = script.getAttribute('filename') ?? '';

  let resolvedLanguage = normalizedLanguage;

  if (resolvedLanguage === '') {
    const type = script.getAttribute('type') ?? '';
    const match = /^tp\/(.+)$/.exec(type.trim().toLowerCase());
    resolvedLanguage = match?.[1] ?? '';
  }

  if (filename !== '') {
    const fromFilename = getLanguageFromFilename(filename);

    if (resolvedLanguage === '' || resolvedLanguage === 'plaintext') {
      resolvedLanguage = fromFilename;
    }
  }

  if (resolvedLanguage === '') {
    resolvedLanguage = 'plaintext';
  }

  return {
    filename,
    language: resolvedLanguage,
    value: dedent(script.textContent ?? ''),
  };
}

/**
 * Searches for a `<template>` in a container and returns its content, logical
 * name, and resolved language.
 *
 * Rules:
 * - if `language` is provided, it takes priority
 * - otherwise, if the template has a `filename`, the language is inferred from
 *   that name
 * - otherwise the language is `plaintext`
 *
 * The content is read from `innerHTML` so the markup is preserved faithfully,
 * including any nested `<script>` tags.
 *
 * The template may receive a `filename="..."` attribute to mimic a file source.
 *
 * @summary Resolves code from an inline template.
 * @param language Desired or expected language.
 * @param root Search root element. Defaults to `document`.
 * @returns Resolved template data, or `null` if no template is found.
 */
export function getCodeFromTemplate(
  language?: string,
  root: ParentNode = document,
): TpResolvedCode | null {
  const template = root.querySelector('template');

  if (!(template instanceof HTMLTemplateElement)) {
    return null;
  }

  const filename = template.getAttribute('filename') ?? '';

  let resolvedLanguage =
    language === undefined || language.trim() === ''
      ? ''
      : normalizeLanguage(language);

  if (filename !== '') {
    const fromFilename = getLanguageFromFilename(filename);

    if (resolvedLanguage === '' || resolvedLanguage === 'plaintext') {
      resolvedLanguage = fromFilename;
    }
  }

  if (resolvedLanguage === '') {
    resolvedLanguage = 'plaintext';
  }

  return {
    filename,
    language: resolvedLanguage,
    value: dedent(template.innerHTML),
  };
}

/**
 * Returns a defined value or throws a clear error.
 *
 * @summary Ensures a value is neither `null` nor `undefined`.
 * @param value Value to validate.
 * @param message Error message if the value is missing.
 * @returns Non-null value.
 * @throws {Error} If the value is missing.
 */
export function expectDefined<T>(value: T | null | undefined, message: string): T {
  if (value == null) {
    throw new Error(message);
  }

  return value;
}
