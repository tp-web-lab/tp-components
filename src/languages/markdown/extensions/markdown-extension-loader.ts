/**
 * @module markdown/extensions/markdown-extension-loader
 * @summary Dynamic loader for Markdown-it extensions.
 *
 * This module provides a utility function that dynamically imports a Markdown
 * extension module at runtime and validates that the imported value is a
 * callable Markdown-it plugin.
 *
 * Both ES module default exports and CommonJS-style module exports are
 * supported.
 */

import type { TpMarkdownPlugin } from '../markdown.types.js';

/**
 * Dynamically imports a Markdown extension module.
 *
 * The loaded module must export a Markdown-it plugin function either as:
 *
 * - a default export,
 * - or the module value itself.
 *
 * Example:
 *
 * ```ts
 * const plugin = await loadMarkdownExtension(
 *   '/extensions/mathjax/index.js',
 * );
 * ```
 *
 * @param url - URL of the extension module to import.
 * @returns Loaded Markdown-it plugin function.
 * @throws Error if the imported module does not export a function.
 */
export async function loadMarkdownExtension(
  url: string,
): Promise<TpMarkdownPlugin> {
  const module = await import(/* @vite-ignore */ url);
  const plugin = module.default ?? module;

  if (typeof plugin !== 'function') {
    throw new Error(`Invalid Markdown extension: ${url}`);
  }

  return plugin;
}