/**
 * @module markdown/extensions/map
 * @summary Markdown-it extension providing interactive map blocks.
 */

import type MarkdownIt from 'markdown-it';
import type StateBlock from 'markdown-it/lib/rules_block/state_block.mjs';
import type Token from 'markdown-it/lib/token.mjs';

/**
 * Metadata associated with a parsed map token.
 *
 * @summary Describes the rendering configuration of a map block.
 */
interface MapTokenMeta {
  /**
   * Latitude coordinate.
   */
  lat: string;

  /**
   * Longitude coordinate.
   */
  lon: string;

  /**
   * Initial map zoom level.
   */
  zoom: string;

  /**
   * Optional marker title or popup text.
   */
  title: string;

  /**
   * Indicates whether a marker should be displayed.
   */
  marker: boolean;

  /**
   * Indicates whether the current geolocation should be used.
   */
  useCurrentLocation: boolean;
}

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
export default function markdownMapExtension(
  md: MarkdownIt,
): void {
  registerMapBlock(md);
}

/**
 * Registers the `::map{}` block parser and renderer.
 *
 * @summary Adds map block parsing support.
 * @param md Markdown-it instance.
 * @internal
 */
function registerMapBlock(md: MarkdownIt): void {
  md.block.ruler.before(
    'paragraph',
    'map_block',
    (
      state: StateBlock,
      startLine: number,
      _endLine: number,
      silent: boolean,
    ): boolean => {
      const firstLine = getLine(state, startLine).trim();

      if (!firstLine.startsWith('::map{')) {
        return false;
      }

      let args = '';
      let nextLine = startLine;

      while (nextLine < _endLine) {
        const line = getLine(state, nextLine).trim();

        args += `${line}\n`;

        if (line.endsWith('}')) {
          break;
        }

        nextLine += 1;
      }

      const match = args.trim().match(
        /^::map\{([\s\S]*)\}\s*$/,
      );

      if (match === null) {
        return false;
      }

      if (silent) {
        return true;
      }

      const rawArgs = normalizeQuotes(match[1] ?? '');

      const lat =
        readOption(rawArgs, 'lat') ?? '';

      const lon =
        readOption(rawArgs, 'lon') ??
        readOption(rawArgs, 'long') ??
        '';

      const token = state.push('map_block', '', 0);

      token.block = true;

      token.meta = {
        lat,
        lon,
        zoom:
          readOption(rawArgs, 'zoom') ??
          '13',
        title:
          readOption(rawArgs, 'title') ??
          '',
        marker: hasFlag(rawArgs, 'marker'),
        useCurrentLocation:
          lat === '' || lon === '',
      } satisfies MapTokenMeta;

      state.line = nextLine + 1;

      return true;
    },
  );

  md.renderer.rules.map_block = (
    tokens: Token[],
    index: number,
  ): string => {
    const meta = readMapMeta(tokens[index]);

    return `
${renderMapStyles()}
<div
  class="tp-md-map"
  ${
    meta.lat !== ''
      ? `data-lat="${escapeAttribute(meta.lat)}"`
      : ''
  }
  ${
    meta.lon !== ''
      ? `data-lon="${escapeAttribute(meta.lon)}"`
      : ''
  }
  data-zoom="${escapeAttribute(meta.zoom)}"
  data-title="${escapeAttribute(meta.title)}"
  ${meta.marker ? 'data-marker' : ''}
  ${
    meta.useCurrentLocation
      ? 'data-current-location'
      : ''
  }
></div>
`;
  };
}

/**
 * Normalizes typographic quotes into ASCII quotes.
 *
 * This allows users to write directives using
 * “smart quotes” copied from rich text editors.
 *
 * @summary Converts typographic quotes into standard quotes.
 * @param value Source string.
 * @returns Normalized string.
 * @internal
 */
function normalizeQuotes(value: string): string {
  return value
    .replaceAll('“', '"')
    .replaceAll('”', '"')
    .replaceAll('‘', "'")
    .replaceAll('’', "'");
}

/**
 * Safely reads map metadata from a token.
 *
 * @summary Extracts normalized map metadata.
 * @param token Markdown token.
 * @returns Parsed map metadata.
 * @internal
 */
function readMapMeta(
  token: Token | undefined,
): MapTokenMeta {
  const meta = token?.meta;

  if (
    typeof meta !== 'object' ||
    meta === null
  ) {
    return {
      lat: '',
      lon: '',
      zoom: '13',
      title: '',
      marker: false,
      useCurrentLocation: true,
    };
  }

  const candidate =
    meta as Partial<MapTokenMeta>;

  return {
    lat:
      typeof candidate.lat === 'string'
        ? candidate.lat
        : '',
    lon:
      typeof candidate.lon === 'string'
        ? candidate.lon
        : '',
    zoom:
      typeof candidate.zoom === 'string'
        ? candidate.zoom
        : '13',
    title:
      typeof candidate.title === 'string'
        ? candidate.title
        : '',
    marker: candidate.marker === true,
    useCurrentLocation:
      candidate.useCurrentLocation === true,
  };
}

/**
 * Returns the raw content of a source line.
 *
 * @summary Reads a Markdown source line.
 * @param state Markdown block parser state.
 * @param line Line index.
 * @returns Raw line content.
 * @internal
 */
function getLine(
  state: StateBlock,
  line: number,
): string {
  const start =
    (state.bMarks[line] ?? 0) +
    (state.tShift[line] ?? 0);

  const end =
    state.eMarks[line] ?? start;

  return state.src.slice(start, end);
}

/**
 * Reads a named option from a directive argument string.
 *
 * Supported syntaxes:
 *
 * ```txt
 * zoom=13
 * title="Paris"
 * title='Paris'
 * ```
 *
 * @summary Extracts an option value.
 * @param args Raw argument string.
 * @param name Option name.
 * @returns Parsed value or `null`.
 * @internal
 */
function readOption(
  args: string,
  name: string,
): string | null {
  const pattern = new RegExp(
    `${name}=("[^"]+"|'[^']+'|\\S+)`,
  );

  const match = args.match(pattern);

  if (match === null) {
    return null;
  }

  return (match[1] ?? '').replace(
    /^["']|["']$/g,
    '',
  );
}

/**
 * Indicates whether a boolean flag is present.
 *
 * Example:
 *
 * ```txt
 * marker
 * ```
 *
 * @summary Detects a boolean directive flag.
 * @param args Raw argument string.
 * @param name Flag name.
 * @returns `true` if the flag is present.
 * @internal
 */
function hasFlag(
  args: string,
  name: string,
): boolean {
  return new RegExp(
    `(^|\\s)${escapeRegExp(name)}(\\s|$)`,
  ).test(args);
}

/**
 * Escapes a string for safe insertion into a regular expression.
 *
 * @summary Escapes regular expression metacharacters.
 * @param value Source string.
 * @returns Escaped string.
 * @internal
 */
function escapeRegExp(value: string): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&',
  );
}

/**
 * Escapes a string for safe HTML attribute insertion.
 *
 * @summary Escapes HTML attribute characters.
 * @param value Source string.
 * @returns Escaped attribute value.
 * @internal
 */
function escapeAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

/**
 * Returns the default CSS styles used by rendered maps.
 *
 * These styles only define the container layout.
 * Actual rendering is delegated to an external
 * map library such as Leaflet.
 *
 * @summary Generates default map styles.
 * @returns Inline stylesheet HTML.
 * @internal
 */
function renderMapStyles(): string {
  return `
<style>
.tp-md-map {
  inline-size: 100%;
  block-size: 24rem;
  margin-block: 1rem;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid color-mix(
    in srgb,
    CanvasText 18%,
    transparent
  );
}
</style>
`;
}