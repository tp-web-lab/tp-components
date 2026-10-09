/**
 * @module components/markup-playground/extension-registry
 * @summary Shared registry for markup playground extensions.
 */

import type {
  TpMarkupExtension,
  TpMarkupExtensionId,
  TpMarkupExtensionMenuItem,
  TpMarkupExtensionState,
  TpMarkupLanguage,
  TpMarkupRuntimeExtension,
} from './markup-extension.types.js';

/** Built-in and optional markup extensions available in the playgrounds. */
export const TP_MARKUP_EXTENSIONS: readonly TpMarkupExtension[] = [
  {
    id: 'include',
    label: 'Include',
    kind: 'built-in',
    enabled: true,
    languages: ['asciidoc', 'markdown', 'restructuredtext'],
  },
  {
    id: 'toc',
    label: 'Table of contents',
    kind: 'built-in',
    enabled: true,
    languages: ['asciidoc', 'markdown', 'restructuredtext'],
  },
  {
    id: 'list-table',
    label: 'List table',
    kind: 'built-in',
    enabled: true,
    languages: ['asciidoc', 'markdown', 'restructuredtext'],
  },
  {
    id: 'csv-table',
    label: 'CSV table',
    kind: 'built-in',
    enabled: true,
    languages: ['asciidoc', 'markdown', 'restructuredtext'],
  },
  {
    id: 'footnote',
    label: 'Footnote',
    kind: 'built-in',
    enabled: true,
    languages: ['asciidoc', 'markdown', 'restructuredtext'],
  },
  {
    id: 'highlight',
    label: 'Highlight',
    kind: 'optional',
    enabled: false,
    languages: ['asciidoc', 'markdown', 'restructuredtext'],
  },
  {
    id: 'design',
    label: 'Design',
    kind: 'optional',
    enabled: false,
    languages: ['asciidoc', 'markdown', 'restructuredtext'],
  },
  {
    id: 'map',
    label: 'Map',
    kind: 'optional',
    enabled: false,
    languages: ['asciidoc', 'markdown', 'restructuredtext'],
  },
  {
    id: 'mathjax',
    label: 'MathJax',
    kind: 'optional',
    enabled: false,
    languages: ['asciidoc', 'markdown', 'restructuredtext'],
  },
  {
    id: 'mermaid',
    label: 'Mermaid',
    kind: 'optional',
    enabled: false,
    languages: ['asciidoc', 'markdown', 'restructuredtext'],
  },
  {
    id: 'music',
    label: 'Music',
    kind: 'optional',
    enabled: false,
    languages: ['asciidoc', 'markdown', 'restructuredtext'],
  },
  {
    id: 'references',
    label: 'References',
    kind: 'optional',
    enabled: false,
    languages: ['asciidoc', 'markdown', 'restructuredtext'],
  },
  {
    id: 'section-numbering',
    label: 'Section numbering',
    kind: 'built-in',
    enabled: true,
    languages: ['asciidoc', 'markdown', 'restructuredtext'],
  },
  {
    id: 'web-component',
    label: 'Web component',
    kind: 'built-in',
    enabled: true,
    languages: ['asciidoc', 'markdown', 'restructuredtext'],
  },
];

/** Returns the extensions available for a given language. */
export function getMarkupExtensionsForLanguage(
  language: TpMarkupLanguage,
): TpMarkupExtension[] {
  return TP_MARKUP_EXTENSIONS.filter((extension) =>
    extension.languages.includes(language),
  ).map((extension) => ({ ...extension }));
}

/** Returns the optional extensions available for a given language. */
export function getOptionalMarkupExtensionsForLanguage(
  language: TpMarkupLanguage,
): TpMarkupExtension[] {
  return getMarkupExtensionsForLanguage(language).filter(
    (extension) => extension.kind === 'optional',
  );
}

/** Creates the default enabled state for a language. */
export function createDefaultMarkupExtensionState(
  language: TpMarkupLanguage,
): TpMarkupExtensionState {
  const state: TpMarkupExtensionState = {};

  for (const extension of getMarkupExtensionsForLanguage(language)) {
    state[extension.id] = extension.enabled;
  }

  return state;
}

/** Creates menu items for the optional extensions of a language. */
export function createMarkupExtensionMenuItems(
  language: TpMarkupLanguage,
  activeIds: ReadonlySet<TpMarkupExtensionId>,
): TpMarkupExtensionMenuItem[] {
  return getOptionalMarkupExtensionsForLanguage(language).map((extension) => ({
    id: extension.id,
    label: extension.label,
    checked: activeIds.has(extension.id),
    disabled: false,
  }));
}

/** Converts active extensions to runtime descriptors. */
export function toMarkupRuntimeExtensions(
  language: TpMarkupLanguage,
  activeIds: ReadonlySet<TpMarkupExtensionId>,
): TpMarkupRuntimeExtension[] {
  return getOptionalMarkupExtensionsForLanguage(language)
    .filter((extension) => activeIds.has(extension.id))
    .map((extension) => ({
      id: extension.id,
      label: extension.label,
      url: `/extensions/${language}/${extension.id}/index.js`,
      enabled: true,
    }));
}

/** Finds an extension by identifier. */
export function getMarkupExtensionById(
  id: TpMarkupExtensionId,
): TpMarkupExtension | undefined {
  const extension = TP_MARKUP_EXTENSIONS.find((item) => item.id === id);

  return extension === undefined ? undefined : { ...extension };
}

/** Toggles an extension identifier in the active set. */
export function toggleMarkupExtensionId(
  activeIds: ReadonlySet<TpMarkupExtensionId>,
  id: TpMarkupExtensionId,
): Set<TpMarkupExtensionId> {
  const nextIds = new Set(activeIds);

  if (nextIds.has(id)) {
    nextIds.delete(id);
    return nextIds;
  }

  nextIds.add(id);
  return nextIds;
}