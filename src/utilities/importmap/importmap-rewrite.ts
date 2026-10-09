/**
 * @module utilities/importmap/importmap-rewrite
 * @summary Rewrites static import specifiers using the import-map resolver.
 */

import { resolveSpecifier } from './importmap-resolver';
import type { ImportMap } from './importmap-types';

const IMPORT_REGEX =
  /(?<=from\s+['"])([^'"]+)(?=['"])|(?<=import\s*\(\s*['"])([^'"]+)(?=['"]\s*\))/g;

/**
 * Rewrites import specifiers in source code.
 *
 * @param code Source code to process.
 * @param importmap Optional import map.
 * @returns Source code with rewritten import specifiers.
 */
export function rewriteImports(
  code: string,
  importmap?: ImportMap,
): string {
  return code.replace(IMPORT_REGEX, (match) => {
    const resolved = resolveSpecifier(match, importmap);
    return resolved ?? match;
  });
}