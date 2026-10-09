/**
 * @module markdown/markdown-default-extensions
 * @summary Registers the default Markdown extensions used by the parser.
 */

import type MarkdownIt from 'markdown-it';
import sectionNumberingExtension from './extensions/section-numbering/index.js';
import tocExtension from './extensions/toc/index.js';
import includeExtension from './extensions/include/index.js';
import webComponentExtension from './extensions/web-component/index.js';
import referencesExtension from './extensions/references/index.js';

/**
 * Options used to configure the default Markdown extensions.
 */
export interface TpMarkdownDefaultExtensionOptions {
  /**
   * In-memory file map used by file-aware extensions.
   */
  files?: Record<string, string>;

  /**
   * Base path used to resolve relative file references.
   */
  entryPath?: string;
}

/**
 * Registers the default extension set on a Markdown-it instance.
 *
 * @param md - Markdown-it instance to extend.
 * @param options - Extension registration options.
 */
export function registerDefaultMarkdownExtensions(
  md: MarkdownIt,
  options: TpMarkdownDefaultExtensionOptions = {},
): void {
  md.use(referencesExtension);
  md.use(webComponentExtension);
  md.use(sectionNumberingExtension);
  md.use(includeExtension, {
    files: options.files,
    entryPath: options.entryPath,
  });
  md.use(tocExtension);
}
