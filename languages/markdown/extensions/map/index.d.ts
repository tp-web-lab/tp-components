/**
 * @module markdown/extensions/map
 * @summary Markdown-it extension providing interactive map blocks.
 */
import type MarkdownIt from 'markdown-it';
/**
 * Registers the Markdown map extension.
 *
 * This extension introduces a custom block directive:
 *
 * ```md
 * ::map{
 *   lat=48.8566
 *   lon=2.3522
 *   zoom=13
 *   title="Paris"
 *   marker
 * }
 * ```
 *
 * Features:
 * - explicit coordinates
 * - current geolocation fallback
 * - optional marker support
 * - optional popup title
 * - multi-line directive parsing
 *
 * The extension only generates HTML placeholders.
 * Actual map rendering must be performed separately
 * (for example using Leaflet).
 *
 * @summary Enables `::map{}` blocks in Markdown.
 * @param md Markdown-it instance to extend.
 */
export default function markdownMapExtension(md: MarkdownIt): void;
