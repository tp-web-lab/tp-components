/**
 * @module markdown/extensions/music
 * @summary Markdown extension for rendering interactive music notation blocks.
 *
 * This extension adds support for fenced `music` blocks and converts them into
 * structured HTML containers that can later be processed by a client-side music
 * renderer or playback engine.
 *
 * Supported features include:
 *
 * - music notation rendering
 * - optional tablature display
 * - optional playback controls
 * - configurable instrument selection
 *
 * Example:
 *
 * ```md
 * ```music play tablature instrument="guitar"
 * C D Em G
 * ```
 * ```
 */

import type MarkdownIt from 'markdown-it';
import type { Options } from 'markdown-it/lib/index.mjs';
import type Renderer from 'markdown-it/lib/renderer.mjs';
import type Token from 'markdown-it/lib/token.mjs';

/**
 * Metadata extracted from a music fence block.
 */
interface MusicTokenMeta {
  /**
   * Enables playback controls.
   */
  play: boolean;

  /**
   * Enables tablature rendering.
   */
  tablature: boolean;

  /**
   * Instrument name used for rendering or playback.
   */
  instrument: string;
}

/**
 * Registers the music Markdown extension.
 *
 * @param md - markdown-it instance.
 */
export default function markdownMusicExtension(
  md: MarkdownIt,
): void {
  registerMusicFence(md);
}

/**
 * Registers the `music` fenced code block renderer.
 *
 * The renderer intercepts fenced blocks whose info string starts with
 * `music` and replaces them with a structured HTML music container.
 *
 * Non-music fences are delegated to the default renderer.
 *
 * @param md - markdown-it instance.
 */
function registerMusicFence(md: MarkdownIt): void {
  const defaultFence = md.renderer.rules.fence;

  md.renderer.rules.fence = (
    tokens: Token[],
    index: number,
    options: Options,
    env: unknown,
    self: Renderer,
  ): string => {
    const token = tokens[index];

    if (token === undefined) {
      return '';
    }

    const info = parseFenceInfo(token.info);

    if (info.name !== 'music') {
      return typeof defaultFence === 'function'
        ? defaultFence(tokens, index, options, env, self)
        : self.renderToken(tokens, index, options);
    }

    const args = getFenceAttributes(token);

    const meta: MusicTokenMeta = {
      play: hasFlag(args, 'play'),
      tablature: hasFlag(args, 'tablature'),
      instrument: readOption(args, 'instrument') ?? 'guitar',
    };

    return renderMusicBlock(token.content.trim(), meta, index);
  };
}

/**
 * Renders a music block container.
 *
 * The generated HTML contains placeholders for:
 *
 * - notation rendering
 * - playback controls
 * - audio rendering
 * - tablature rendering
 *
 * @param source - Raw music notation source.
 * @param meta - Parsed music block options.
 * @param index - Token index used to generate a unique identifier.
 * @returns HTML music container.
 */
function renderMusicBlock(
  source: string,
  meta: MusicTokenMeta,
  index: number,
): string {
  const id = `tp-md-music-${String(index)}`;

  return `
<section
  class="tp-md-music"
  data-music-id="${escapeAttribute(id)}"
  ${meta.play ? 'data-music-play' : ''}
  ${meta.tablature ? 'data-music-tablature' : ''}
  data-music-instrument="${escapeAttribute(meta.instrument)}"
>
  <pre hidden class="tp-md-music-source">${escapeHtml(source)}</pre>

  <div class="tp-md-music-controls"></div>

  <div class="tp-md-music-notation"></div>

  <div class="tp-md-music-audio"></div>

  <div class="tp-md-music-tablature"></div>
</section>
`;
}

/**
 * Serializes token attributes into a plain attribute string.
 *
 * @param token - Markdown token.
 * @returns Serialized attribute string.
 */
function getFenceAttributes(token: Token): string {
  const attrs = token.attrs ?? [];

  return attrs
    .map(([name, value]) => {
      if (value === '') {
        return name;
      }

      return `${name}=${JSON.stringify(value)}`;
    })
    .join(' ');
}

/**
 * Parses a fence info string into its name and arguments.
 *
 * Example:
 *
 * ```txt
 * music play instrument="guitar"
 * ```
 *
 * @param info - Fence info string.
 * @returns Parsed fence descriptor.
 */
function parseFenceInfo(info: string): {
  name: string;
  args: string;
} {
  const trimmed = info.trim();
  const separator = trimmed.search(/\s/);

  if (separator === -1) {
    return {
      name: trimmed,
      args: '',
    };
  }

  return {
    name: trimmed.slice(0, separator),
    args: trimmed.slice(separator + 1).trim(),
  };
}

/**
 * Reads an option value from a serialized argument string.
 *
 * @param args - Serialized arguments.
 * @param name - Option name.
 * @returns Option value or `null` if not found.
 */
function readOption(
  args: string,
  name: string,
): string | null {
  const pattern = new RegExp(`${name}=("[^"]+"|'[^']+'|\\S+)`);
  const match = args.match(pattern);

  if (match === null) {
    return null;
  }

  return (match[1] ?? '').replace(/^["']|["']$/g, '');
}

/**
 * Checks whether a flag is present in a serialized argument string.
 *
 * @param args - Serialized arguments.
 * @param name - Flag name.
 * @returns `true` if the flag exists.
 */
function hasFlag(args: string, name: string): boolean {
  return new RegExp(`(^|\\s)${escapeRegExp(name)}(\\s|$)`).test(args);
}

/**
 * Escapes a string for safe use inside a regular expression.
 *
 * @param value - Raw string.
 * @returns Escaped regular expression string.
 */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Escapes HTML special characters.
 *
 * @param value - Raw HTML string.
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
 * Escapes an HTML attribute value.
 *
 * Only alphanumeric characters, underscores and hyphens are preserved.
 *
 * @param value - Raw attribute value.
 * @returns Sanitized attribute value.
 */
function escapeAttribute(value: string): string {
  return value.replaceAll(/[^a-zA-Z0-9_-]/g, '');
}