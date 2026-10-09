/**
 * @module components/markup-playground/extension-types
 * @summary Shared types for markup playground extensions.
 */

/** Supported markup languages. */
export type TpMarkupLanguage = 'asciidoc' | 'markdown' | 'restructuredtext';

/** Supported markup extension identifiers. */
export type TpMarkupExtensionId =
  | 'include'
  | 'toc'
  | 'list-table'
  | 'csv-table'
  | 'footnote'
  | 'highlight'
  | 'design'
  | 'map'
  | 'mathjax'
  | 'mermaid'
  | 'music'
  | 'references'
  | 'section-numbering'
  | 'web-component';

/** Extension categories. */
export type TpMarkupExtensionKind = 'built-in' | 'optional';

/** Describes a markup extension. */
export interface TpMarkupExtension {
  /** Extension identifier. */
  id: TpMarkupExtensionId;
  /** Extension label. */
  label: string;
  /** Extension category. */
  kind: TpMarkupExtensionKind;
  /** Whether the extension is enabled by default. */
  enabled: boolean;
  /** Supported languages. */
  languages: readonly TpMarkupLanguage[];
  /** Optional description. */
  description?: string;
}

/** Runtime descriptor for a markup extension. */
export interface TpMarkupRuntimeExtension {
  /** Extension identifier. */
  id: TpMarkupExtensionId;
  /** Extension label. */
  label: string;
  /** Runtime script URL. */
  url: string;
  /** Whether the extension is enabled. */
  enabled?: boolean;
}

/** Extension state map keyed by identifier. */
export type TpMarkupExtensionState = Partial<
  Record<TpMarkupExtensionId, boolean>
>;

/** Menu item descriptor for markup extensions. */
export interface TpMarkupExtensionMenuItem {
  /** Extension identifier. */
  id: TpMarkupExtensionId;
  /** Extension label. */
  label: string;
  /** Whether the item is checked. */
  checked: boolean;
  /** Whether the item is disabled. */
  disabled: boolean;
}