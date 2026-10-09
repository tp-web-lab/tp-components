/**
 * @module markdown/extensions/references
 * @summary Markdown-it extension for bibliography, glossary, notes and index references.
 */

import type MarkdownIt from 'markdown-it';
import type { Options } from 'markdown-it/lib/index.mjs';
import type StateBlock from 'markdown-it/lib/rules_block/state_block.mjs';
import type StateCore from 'markdown-it/lib/rules_core/state_core.mjs';
import type StateInline from 'markdown-it/lib/rules_inline/state_inline.mjs';
import type Token from 'markdown-it/lib/token.mjs';

/**
 * Options for the references extension.
 *
 * @summary Configures external file resolution.
 */
interface ReferencesOptions {
  /**
   * Virtual project files indexed by absolute path.
   */
  files?: Record<string, string>;

  /**
   * Current Markdown entry path.
   *
   * Used to resolve relative include paths.
   *
   * @defaultValue `"/index.md"`
   */
  entryPath?: string;
}

/**
 * A collected reference definition.
 *
 * @summary Stores bibliography, glossary or note content.
 */
interface ReferenceDefinition {
  /** Original user-facing key. */
  key: string;

  /** Stable HTML anchor id. */
  id: string;

  /** Reserved popover id. */
  popoverId: string;

  /** Raw Markdown definition. */
  raw: string;

  /** Rendered HTML definition. */
  html: string;

  /** Plain text definition for tooltips. */
  text: string;
}

/**
 * A collected index entry.
 *
 * @summary Represents one `:index:` occurrence.
 */
interface IndexEntry {
  /** HTML anchor id inserted at the index position. */
  id: string;

  /** Raw comma-separated index key. */
  key: string;
}

/**
 * Shared parsing state stored in the Markdown environment.
 *
 * @summary Holds all references collected during one render pass.
 */
interface ReferencesState {
  bibliography: Map<string, ReferenceDefinition>;
  glossary: Map<string, ReferenceDefinition>;
  notes: Map<string, ReferenceDefinition>;
  noteOrder: string[];
  noteRefs: string[];
  indexEntries: IndexEntry[];
}

/**
 * Markdown-it render environment used by this extension.
 *
 * @summary Extends the environment with reference state and current path.
 */
interface ReferencesEnvironment {
  __tp_references?: ReferencesState;
  path?: string;
}

/**
 * Supported reference definition families.
 *
 * @summary Identifies bibliography, glossary and note definitions.
 */
type ReferenceKind = 'bibliography' | 'glossary' | 'notes';

/**
 * Metadata stored on inline reference tokens.
 *
 * @summary Stores the referenced key.
 */
interface ReferenceTokenMeta {
  key: string;
}

/**
 * Metadata stored on inline index tokens.
 *
 * @summary Stores the index key and generated anchor id.
 */
interface IndexTokenMeta {
  key: string;
  id: string;
}

/**
 * Metadata stored on reference section block tokens.
 *
 * @summary Describes generated bibliography, glossary, notes or index blocks.
 */
interface ReferencesBlockMeta {
  kind: ReferenceKind | 'index';
  file: string;
}

/**
 * Registers source-level extraction of reference definitions.
 *
 * Definitions are removed before block parsing, then stored in the render
 * environment. This prevents definitions from appearing as normal Markdown
 * paragraphs.
 *
 * @summary Extracts reference definitions before block parsing.
 * @param md Markdown-it instance.
 * @param options Extension options.
 * @internal
 */
function registerExtractDefinitions(
  md: MarkdownIt,
  options: ReferencesOptions,
): void {
  md.core.ruler.before('block', 'tp_extract_references', (state: StateCore) => {
    const env = state.env as ReferencesEnvironment;
    const references = getReferencesState(env);

    const fromPath =
      typeof env.path === 'string' && env.path !== ''
        ? env.path
        : (options.entryPath ?? '/index.md');

    const result = extractDefinitionsFromSource(
      md,
      references,
      state.src,
      fromPath,
      options,
    );

    state.src = result.source;
  });
}

/**
 * Registers the references extension.
 *
 * Supported inline syntaxes:
 *
 * ```md
 * [@citation]
 * [%glossary-term]
 * [^note]
 * :index:`Topic,Subtopic`
 * ```
 *
 * Supported definition syntaxes:
 *
 * ```md
 * [@citation]: Bibliography entry
 * [%term]: Glossary definition
 * [^note]: Note definition
 * ```
 *
 * Supported section directives:
 *
 * ```md
 * ::bibliography{}
 * ::glossary{}
 * ::notes{}
 * ::index{}
 * ```
 *
 * @summary Enables bibliography, glossary, notes and index support.
 * @param md Markdown-it instance.
 * @param options Extension options.
 */
export default function markdownReferencesExtension(
  md: MarkdownIt,
  options: ReferencesOptions = {},
): void {
  registerExtractDefinitions(md, options);
  registerInlineReferences(md);
  registerReferenceBlocks(md, options);
}

/**
 * Extracts reference definitions from Markdown source.
 *
 * Collected definitions are removed from the returned source and stored in
 * the shared references state.
 *
 * @summary Parses and removes reference definitions.
 * @param md Markdown-it instance.
 * @param references Shared references state.
 * @param source Source Markdown.
 * @param fromPath Current file path.
 * @param options Extension options.
 * @returns Source without reference definitions.
 * @internal
 */
function extractDefinitionsFromSource(
  md: MarkdownIt,
  references: ReferencesState,
  source: string,
  fromPath: string,
  options: ReferencesOptions,
): { source: string } {
  const lines = source.split('\n');
  const outputLines: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? '';
    const match = line.match(
      /^(\[@([^\]]+)\]|\[%([^\]]+)\]|\[\^([^\]]+)\]):\s*(.*)$/,
    );

    if (match === null) {
      outputLines.push(line);
      continue;
    }

    const kind = getDefinitionKind(match);
    const key = getDefinitionKey(match);
    const firstLine = match[5] ?? '';
    const definitionLines = [firstLine];

    let nextIndex = index + 1;

    while (nextIndex < lines.length) {
      const nextLine = lines[nextIndex] ?? '';

      if (nextLine.trim() === '') {
        definitionLines.push('');
        nextIndex += 1;
        continue;
      }

      if (/^( {2,}|\t)/.test(nextLine)) {
        definitionLines.push(nextLine.replace(/^( {2,}|\t)/, ''));
        nextIndex += 1;
        continue;
      }

      break;
    }

    index = nextIndex - 1;

    addDefinition(
      md,
      references,
      kind,
      key,
      definitionLines.join('\n').trim(),
    );
  }

  collectDefinitionsFromIncludedFiles(
    md,
    references,
    outputLines.join('\n'),
    fromPath,
    options,
  );

  return {
    source: outputLines.join('\n'),
  };
}

/**
 * Collects definitions from files referenced by section directives.
 *
 * Example:
 *
 * ```md
 * ::bibliography{refs/biblio.md}
 * ::glossary{refs/glossary.md}
 * ::notes{refs/notes.md}
 * ```
 *
 * @summary Loads external reference definition files.
 * @param md Markdown-it instance.
 * @param references Shared references state.
 * @param source Source Markdown.
 * @param fromPath Current file path.
 * @param options Extension options.
 * @internal
 */
function collectDefinitionsFromIncludedFiles(
  md: MarkdownIt,
  references: ReferencesState,
  source: string,
  fromPath: string,
  options: ReferencesOptions,
): void {
  const files = options.files ?? {};
  const directives = source.matchAll(
    /^::(bibliography|biblio|glossary|notes)\{([^}]*)\}\s*$/gm,
  );

  for (const directive of directives) {
    const target = directive[2]?.trim() ?? '';

    if (target === '') {
      continue;
    }

    const path = resolvePath(fromPath, target);
    const content = files[path];

    if (typeof content !== 'string') {
      continue;
    }

    extractDefinitionsFromSource(md, references, content, path, options);
  }
}

/**
 * Determines the reference kind from a definition regex match.
 *
 * @summary Resolves definition kind.
 * @param match Definition match.
 * @returns Reference kind.
 * @internal
 */
function getDefinitionKind(match: RegExpMatchArray): ReferenceKind {
  if (match[2] !== undefined) {
    return 'bibliography';
  }

  if (match[3] !== undefined) {
    return 'glossary';
  }

  return 'notes';
}

/**
 * Extracts the user-facing key from a definition regex match.
 *
 * @summary Reads a definition key.
 * @param match Definition match.
 * @returns Definition key.
 * @internal
 */
function getDefinitionKey(match: RegExpMatchArray): string {
  return (match[2] ?? match[3] ?? match[4] ?? '').trim();
}

/**
 * Adds a parsed definition to the shared reference state.
 *
 * The raw Markdown is rendered immediately so generated sections can reuse the
 * full HTML, while tooltips can reuse the stripped text.
 *
 * @summary Stores a reference definition.
 * @param md Markdown-it instance.
 * @param references Shared references state.
 * @param kind Reference kind.
 * @param key Definition key.
 * @param raw Raw Markdown definition.
 * @internal
 */
function addDefinition(
  md: MarkdownIt,
  references: ReferencesState,
  kind: ReferenceKind,
  key: string,
  raw: string,
): void {
  if (key === '') {
    return;
  }

  const normalized = normalizeKey(key);
  const id = getDefinitionId(kind, normalized);
  const popoverId = `popover-${id}`;
  const html = md.render(raw);
  const text = stripHtml(html);

  const definition: ReferenceDefinition = {
    key,
    id,
    popoverId,
    raw,
    html,
    text,
  };

  if (kind === 'bibliography') {
    references.bibliography.set(normalized, definition);
    return;
  }

  if (kind === 'glossary') {
    references.glossary.set(normalized, definition);
    return;
  }

  references.notes.set(normalized, definition);

  if (!references.noteOrder.includes(normalized)) {
    references.noteOrder.push(normalized);
  }
}

/**
 * Registers inline reference and index rules.
 *
 * @summary Adds inline references and index entries.
 * @param md Markdown-it instance.
 * @internal
 */
function registerInlineReferences(md: MarkdownIt): void {
  md.inline.ruler.before(
    'emphasis',
    'tp_reference_inline',
    (state: StateInline, silent: boolean): boolean => {
      const source = state.src.slice(state.pos);

      const match =
        source.match(/^\[@([^\]]+)\]/) ??
        source.match(/^\[%([^\]]+)\]/) ??
        source.match(/^\[\^([^\]]+)\]/);

      if (match === null) {
        return false;
      }

      const raw = match[0];
      const key = match[1]?.trim() ?? '';

      if (key === '') {
        return false;
      }

      if (!silent) {
        const token = state.push(getInlineTokenType(raw), '', 0);
        token.content = '';
        token.meta = {
          key,
        } satisfies ReferenceTokenMeta;
      }

      state.pos += raw.length;
      return true;
    },
  );

  md.inline.ruler.before(
    'emphasis',
    'tp_index_inline',
    (state: StateInline, silent: boolean): boolean => {
      const match = state.src.slice(state.pos).match(/^:index:`([^`]+)`/);

      if (match === null) {
        return false;
      }

      const key = match[1]?.trim() ?? '';

      if (key === '') {
        return false;
      }

      const env = state.env as ReferencesEnvironment;
      const references = getReferencesState(env);
      const id = `index-${slugify(key)}-${String(
        references.indexEntries.length + 1,
      )}`;

      if (!silent) {
        references.indexEntries.push({
          id,
          key,
        });

        const token = state.push('tp_index_inline', '', 0);
        token.content = '';
        token.meta = {
          key,
          id,
        } satisfies IndexTokenMeta;
      }

      state.pos += match[0].length;
      return true;
    },
  );

  md.renderer.rules.tp_cite_inline = (
    tokens: Token[],
    index: number,
    _options: Options,
    env: ReferencesEnvironment,
  ): string => renderReferenceInline(tokens[index], env, 'bibliography');

  md.renderer.rules.tp_glossary_inline = (
    tokens: Token[],
    index: number,
    _options: Options,
    env: ReferencesEnvironment,
  ): string => renderReferenceInline(tokens[index], env, 'glossary');

  md.renderer.rules.tp_note_inline = (
    tokens: Token[],
    index: number,
    _options: Options,
    env: ReferencesEnvironment,
  ): string => renderReferenceInline(tokens[index], env, 'notes');

  md.renderer.rules.tp_index_inline = (
    tokens: Token[],
    index: number,
  ): string => {
    const meta = readIndexMeta(tokens[index]);

    if (meta === null) {
      return '';
    }

    return `<span id="${escapeAttribute(meta.id)}" data-index-entry="${escapeAttribute(meta.key)}" aria-hidden="true"></span>`;
  };
}

/**
 * Returns the token type matching an inline reference syntax.
 *
 * @summary Maps raw syntax to token type.
 * @param raw Raw matched reference.
 * @returns Inline token type.
 * @internal
 */
function getInlineTokenType(raw: string): string {
  if (raw.startsWith('[@')) {
    return 'tp_cite_inline';
  }

  if (raw.startsWith('[%')) {
    return 'tp_glossary_inline';
  }

  return 'tp_note_inline';
}

/**
 * Renders an inline bibliography, glossary or note reference.
 *
 * Notes are numbered by first use, regardless of their source key.
 *
 * @summary Renders an inline reference.
 * @param token Reference token.
 * @param env Markdown render environment.
 * @param kind Reference kind.
 * @returns HTML output.
 * @internal
 */
function renderReferenceInline(
  token: Token | undefined,
  env: ReferencesEnvironment,
  kind: ReferenceKind,
): string {
  const key = readReferenceKey(token);

  if (key === '') {
    return '';
  }

  const references = getReferencesState(env);
  const normalized = normalizeKey(key);
  const definition = getDefinition(references, kind, normalized);

  const id = definition?.id ?? getDefinitionId(kind, normalized);
  const tooltip = renderReferenceTooltip(definition);

  if (kind === 'bibliography') {
    return `<a href="#${escapeAttribute(id)}" class="tp-md-reference-link" data-cite-ref="${escapeAttribute(id)}">[${escapeHtml(key)}]${tooltip}</a>`;
  }

  if (kind === 'glossary') {
    return `<a href="#${escapeAttribute(id)}" class="tp-md-reference-link tp-md-glossary-link" data-glossary-link="${escapeAttribute(id)}">${escapeHtml(key)}${tooltip}</a>`;
  }

  const label = getNoteLabel(references, normalized);

  return `<a href="#${escapeAttribute(id)}" class="tp-md-reference-link tp-md-note-link" data-note-ref="${escapeAttribute(id)}">[${escapeHtml(label)}]${tooltip}</a>`;
}

/**
 * Registers block directives that render generated reference sections.
 *
 * Supported directives:
 *
 * ```md
 * ::bibliography{}
 * ::biblio{}
 * ::glossary{}
 * ::notes{}
 * ::index{}
 * ```
 *
 * Each directive may optionally reference an external definition file:
 *
 * ```md
 * ::bibliography{references.md}
 * ```
 *
 * @summary Registers generated reference section blocks.
 * @param md Markdown-it instance.
 * @param options Extension options.
 * @internal
 */
function registerReferenceBlocks(
  md: MarkdownIt,
  options: ReferencesOptions,
): void {
    md.block.ruler.before(
    'paragraph',
    'tp_references_block',
    (
      state: StateBlock,
      startLine: number,
      _endLine: number,
      silent: boolean,
    ): boolean => {
      const line = getLine(state, startLine).trim();
      const match = line.match(
        /^::(bibliography|biblio|glossary|notes|index)\{([^}]*)\}\s*$/,
      );

      if (match === null) {
        return false;
      }

      if (silent) {
        return true;
      }

      const token = state.push('tp_references_block', '', 0);
      token.block = true;
      token.meta = {
        kind: normalizeBlockKind(match[1] ?? ''),
        file: match[2]?.trim() ?? '',
      } satisfies ReferencesBlockMeta;

      state.line = startLine + 1;
      return true;
    },
  );

  md.renderer.rules.tp_references_block = (
    tokens: Token[],
    index: number,
    _rendererOptions: Options,
    env: ReferencesEnvironment,
  ): string => {
    const token = tokens[index];

    if (token === undefined) {
      return '';
    }

    const meta = readBlockMeta(token.meta);
    const references = getReferencesState(env);

    if (meta.file !== '') {
      loadExternalDefinitions(md, references, meta.kind, meta.file, env, options);
    }

    if (meta.kind === 'bibliography') {
      return [
        renderReferenceStyles(),
        renderDefinitionList('tp-md-bibliography', references.bibliography),
      ].join('');
    }

    if (meta.kind === 'glossary') {
      return [
        renderReferenceStyles(),
        renderDefinitionList('tp-md-glossary', references.glossary),
      ].join('');
    }

    if (meta.kind === 'notes') {
      return [
        renderReferenceStyles(),
        renderNotesList(references),
      ].join('');
    }

    return renderIndex(references.indexEntries);
  };
}

/**
 * Renders the CSS styles used by inline bibliography references,
 * glossary entries and note references.
 *
 * The generated styles define:
 *
 * - the visual appearance of reference links,
 * - the tooltip container positioning,
 * - tooltip visibility behavior on hover and focus,
 * - tooltip layout, spacing and elevation.
 *
 * Tooltips are implemented entirely with CSS and are embedded
 * directly inside reference links.
 *
 * @returns A `<style>` element as an HTML string.
 */
function renderReferenceStyles(): string {
  return `
<style>
.tp-md-reference-link {
  position: relative;
  text-decoration: underline dotted;
  text-underline-offset: 0.2em;
}

.tp-md-reference-tooltip {
  position: absolute;
  z-index: 20;
  inset-block-end: 100%;
  inset-inline-start: 0;
  display: none;
  inline-size: max-content;
  max-inline-size: 32rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: Canvas;
  color: CanvasText;
  border: 1px solid color-mix(in srgb, CanvasText 20%, transparent);
  box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 0.2);
  white-space: normal;
}

.tp-md-reference-link:hover .tp-md-reference-tooltip,
.tp-md-reference-link:focus .tp-md-reference-tooltip {
  display: block;
}
</style>
`;
}

function renderReferenceTooltip(
  definition: ReferenceDefinition | undefined,
): string {
  if (definition === undefined) {
    return '';
  }

  return `<span class="tp-md-reference-tooltip" role="tooltip">${escapeHtml(definition.text)}</span>`;
}

function loadExternalDefinitions(
  md: MarkdownIt,
  references: ReferencesState,
  kind: ReferenceKind | 'index',
  file: string,
  env: ReferencesEnvironment,
  options: ReferencesOptions,
): void {
  if (kind === 'index') {
    return;
  }

  const files = options.files ?? {};
  const fromPath =
    typeof env.path === 'string' && env.path !== ''
      ? env.path
      : (options.entryPath ?? '/index.md');

  const path = resolvePath(fromPath, file);
  const content = files[path];

  if (typeof content !== 'string') {
    return;
  }

  extractDefinitionsFromSource(md, references, content, path, options);
}

function renderDefinitionList(
  className: string,
  definitions: ReadonlyMap<string, ReferenceDefinition>,
): string {
  const html = [`<dl class="${escapeAttribute(className)}">`];

  for (const definition of definitions.values()) {
    html.push(
      `<dt id="${escapeAttribute(definition.id)}">${escapeHtml(definition.key)}</dt>`,
    );
    html.push(
      `<dd data-reference-def="${escapeAttribute(definition.id)}">${definition.html}</dd>`,
    );
  }

  html.push('</dl>');

  return html.join('');
}

function renderNotesList(references: ReferencesState): string {
  const html = ['<dl class="tp-md-notes">'];

  const ordered = [
    ...references.noteRefs,
    ...references.noteOrder.filter(
      (normalized) => !references.noteRefs.includes(normalized),
    ),
  ];

  for (const normalized of ordered) {
    const definition = references.notes.get(normalized);

    if (definition === undefined) {
      continue;
    }

    const label = getNoteLabel(references, normalized);

    html.push(
      `<dt id="${escapeAttribute(definition.id)}">[${escapeHtml(label)}]</dt>`,
    );
    html.push(
      `<dd data-reference-def="${escapeAttribute(definition.id)}">${definition.html}</dd>`,
    );
  }

  html.push('</dl>');

  return html.join('');
}

function renderIndex(entries: readonly IndexEntry[]): string {
  const tree = collectIndexTree(entries);
  return renderIndexLevel(tree, true);
}

interface IndexNode {
  label: string;
  targets: string[];
  children: Map<string, IndexNode>;
}

function collectIndexTree(
  entries: readonly IndexEntry[],
): Map<string, IndexNode> {
  const tree = new Map<string, IndexNode>();

  for (const entry of entries) {
    const parts = entry.key
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part !== '');

    if (parts.length === 0) {
      continue;
    }

    addIndexEntry(tree, parts, entry.id);
  }

  return tree;
}

function addIndexEntry(
  tree: Map<string, IndexNode>,
  parts: readonly string[],
  targetId: string,
): void {
  const head = parts[0];

  if (head === undefined) {
    return;
  }

  const key = normalizeKey(head);
  let node = tree.get(key);

  if (node === undefined) {
    node = {
      label: head,
      targets: [],
      children: new Map<string, IndexNode>(),
    };

    tree.set(key, node);
  }

  const tail = parts.slice(1);

  if (tail.length === 0) {
    node.targets.push(targetId);
    return;
  }

  addIndexEntry(node.children, tail, targetId);
}

function renderIndexLevel(
  tree: ReadonlyMap<string, IndexNode>,
  isRoot = false,
): string {
  const className = isRoot ? ' class="tp-md-index"' : '';
  const html = [`<dl${className}>`];

  for (const node of [...tree.values()].sort((left, right) =>
    left.label.localeCompare(right.label, undefined, {
      sensitivity: 'base',
      numeric: true,
    }),
  )) {
    html.push('<dt>');
    html.push(escapeHtml(node.label));

    if (node.targets.length > 0) {
      html.push(' ');
      html.push(renderIndexLinks(node.targets));
    }

    html.push('</dt>');

    if (node.children.size > 0) {
      html.push('<dd>');
      html.push(renderIndexLevel(node.children));
      html.push('</dd>');
    }
  }

  html.push('</dl>');

  return html.join('');
}

function renderIndexLinks(targets: readonly string[]): string {
  return targets
    .map(
      (targetId, index) =>
        `<a href="#${escapeAttribute(targetId)}">${String(index + 1)}</a>`,
    )
    .join(', ');
}

function getReferencesState(env: ReferencesEnvironment): ReferencesState {
  if (env.__tp_references !== undefined) {
    return env.__tp_references;
  }

  const references: ReferencesState = {
    bibliography: new Map<string, ReferenceDefinition>(),
    glossary: new Map<string, ReferenceDefinition>(),
    notes: new Map<string, ReferenceDefinition>(),
    noteOrder: [],
    noteRefs: [],
    indexEntries: [],
  };

  env.__tp_references = references;

  return references;
}

function getDefinition(
  references: ReferencesState,
  kind: ReferenceKind,
  normalized: string,
): ReferenceDefinition | undefined {
  if (kind === 'bibliography') {
    return references.bibliography.get(normalized);
  }

  if (kind === 'glossary') {
    return references.glossary.get(normalized);
  }

  return references.notes.get(normalized);
}

function getDefinitionId(kind: ReferenceKind, normalized: string): string {
  if (kind === 'bibliography') {
    return `bib-${slugify(normalized)}`;
  }

  if (kind === 'glossary') {
    return `glo-${slugify(normalized)}`;
  }

  return `note-${slugify(normalized)}`;
}

function getNoteLabel(
  references: ReferencesState,
  normalized: string,
): string {
  let index = references.noteRefs.indexOf(normalized);

  if (index === -1) {
    references.noteRefs.push(normalized);
    index = references.noteRefs.length - 1;
  }

  return String(index + 1);
}

function normalizeBlockKind(value: string): ReferenceKind | 'index' {
  if (value === 'biblio' || value === 'bibliography') {
    return 'bibliography';
  }

  if (value === 'glossary') {
    return 'glossary';
  }

  if (value === 'notes') {
    return 'notes';
  }

  return 'index';
}

function readReferenceKey(token: Token | undefined): string {
  const meta = token?.meta;

  if (
    typeof meta === 'object' &&
    meta !== null &&
    typeof (meta as Partial<ReferenceTokenMeta>).key === 'string'
  ) {
    return (meta as ReferenceTokenMeta).key;
  }

  return '';
}

function readIndexMeta(token: Token | undefined): IndexTokenMeta | null {
  const meta = token?.meta;

  if (
    typeof meta === 'object' &&
    meta !== null &&
    typeof (meta as Partial<IndexTokenMeta>).key === 'string' &&
    typeof (meta as Partial<IndexTokenMeta>).id === 'string'
  ) {
    return meta as IndexTokenMeta;
  }

  return null;
}

function readBlockMeta(value: unknown): ReferencesBlockMeta {
  if (typeof value !== 'object' || value === null) {
    return {
      kind: 'bibliography',
      file: '',
    };
  }

  const candidate = value as {
    kind?: unknown;
    file?: unknown;
  };

  const kind =
    typeof candidate.kind === 'string'
      ? normalizeBlockKind(candidate.kind)
      : 'bibliography';

  return {
    kind,
    file: typeof candidate.file === 'string' ? candidate.file : '',
  };
}

function getLine(state: StateBlock, line: number): string {
  const start = (state.bMarks[line] ?? 0) + (state.tShift[line] ?? 0);
  const end = state.eMarks[line] ?? start;

  return state.src.slice(start, end);
}

function resolvePath(fromPath: string, targetPath: string): string {
  if (targetPath.startsWith('/')) {
    return targetPath;
  }

  const fromParts = fromPath.split('/').filter(Boolean);
  fromParts.pop();

  const outputParts = [...fromParts];

  for (const part of targetPath.split('/')) {
    if (part === '' || part === '.') {
      continue;
    }

    if (part === '..') {
      outputParts.pop();
      continue;
    }

    outputParts.push(part);
  }

  return `/${outputParts.join('/')}`;
}

function normalizeKey(value: string): string {
  return value.trim().toLowerCase();
}

function stripHtml(value: string): string {
  return value
    .replaceAll(/<[^>]*>/g, '')
    .replaceAll(/\s+/g, ' ')
    .trim();
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '');
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}
