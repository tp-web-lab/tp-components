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
 *   '/tp-components/extensions/mathjax/index.js',
 * );
 * ```
 *
 * @param url - URL of the extension module to import.
 * @returns Loaded Markdown-it plugin function.
 * @throws Error if the imported module does not export a function.
 */
export declare function loadMarkdownExtension(url: string): Promise<TpMarkdownPlugin>;
