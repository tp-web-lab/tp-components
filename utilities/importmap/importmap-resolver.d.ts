/**
 * @module utilities/importmap/importmap-resolver
 * @summary Resolves import specifiers using an import map and safe CDN fallbacks.
 */
import type { ImportMap, ImportResolutionResult } from './importmap-types';
/**
 * Resolves a specifier to a final URL when possible.
 *
 * @param specifier Module specifier to resolve.
 * @param importmap Optional import map.
 * @returns Resolved URL or `null`.
 */
export declare function resolveSpecifier(specifier: string, importmap?: ImportMap): string | null;
/**
 * Resolves a specifier and keeps trace information about the source.
 *
 * @param specifier Module specifier to resolve.
 * @param importmap Optional import map.
 * @returns Detailed resolution result.
 */
export declare function resolveSpecifierDebug(specifier: string, importmap?: ImportMap): ImportResolutionResult;
