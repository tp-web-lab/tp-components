/**
 * @module markdown/markdown.types
 * @summary Shared types used by the Markdown parser, extensions, and runtime.
 */

import type MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token.mjs';

/**
 * Parser configuration options.
 */
export interface TpMarkdownOptions {
  /**
   * Enables raw HTML in Markdown sources.
   */
  html?: boolean;

  /**
   * Enables automatic link recognition.
   */
  linkify?: boolean;

  /**
   * Enables typographic replacements.
   */
  typographer?: boolean;

  /**
   * Initial front matter or parser attributes.
   */
  attributes?: Record<string, unknown>;

  /**
   * Logical source path of the current document.
   */
  path?: string;

  /**
   * Base URL used to resolve included files.
   */
  includeBaseUrl?: string;

  /**
   * Optional virtual file map available to extensions.
   */
  files?: Record<string, string>;

  /**
   * Marks the rendered document as a page navigation root.
   */
  pageNavRoot?: boolean;

  /**
   * Preserves original mdviewer source blocks when enabled.
   */
  preserveMdViewerSource?: boolean;
}

/**
 * Dynamic Markdown extension descriptor.
 */
export interface TpMarkdownExtension {
  /**
   * Optional stable extension identifier.
   */
  id?: string;

  /**
   * Module URL to import.
   */
  url: string;

  /**
   * Extension-specific options passed at registration time.
   */
  options?: Record<string, unknown>;
}

/**
 * Result returned by Markdown parsing helpers.
 */
export interface TpMarkdownParseResult {
  /**
   * Parsed Markdown-it tokens.
   */
  tokens: Token[];

  /**
   * Effective rendering environment.
   */
  env: TpMarkdownEnvironment;
}

/**
 * Rendering environment shared with extensions and renderers.
 */
export interface TpMarkdownEnvironment {
  /**
   * Merged front matter and parser attributes.
   */
  attributes: Record<string, unknown>;

  /**
   * Whether mdviewer source preservation is enabled.
   */
  preserveMdViewerSource?: boolean;

  /**
   * Additional extension-specific values.
   */
  [key: string]: unknown;
}

/**
 * Markdown-it plugin signature.
 */
export type TpMarkdownPlugin = (
  md: MarkdownIt,
  options?: Record<string, unknown>,
) => void;