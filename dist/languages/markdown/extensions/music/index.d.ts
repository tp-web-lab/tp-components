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
/**
 * Registers the music Markdown extension.
 *
 * @param md - markdown-it instance.
 */
export default function markdownMusicExtension(md: MarkdownIt): void;
