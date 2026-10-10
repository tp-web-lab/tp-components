/**
 * @module utilities/importmap/importmap-rewrite
 * @summary Rewrites static import specifiers using the import-map resolver.
 */
import type { ImportMap } from './importmap-types';
/**
 * Rewrites import specifiers in source code.
 *
 * @param code Source code to process.
 * @param importmap Optional import map.
 * @returns Source code with rewritten import specifiers.
 */
export declare function rewriteImports(code: string, importmap?: ImportMap): string;
