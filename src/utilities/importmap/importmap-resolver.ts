/**
 * @module utilities/importmap/importmap-resolver
 * @summary Resolves import specifiers using an import map and safe CDN fallbacks.
 */

import type {
  ImportMap,
  ImportResolutionResult,
} from './importmap-types';
import {
  SAFE_CDN_IMPORTS,
  SAFE_CDN_PREFIX_IMPORTS
} from './importmap-defaults.js';

/**
 * Resolves a specifier to a final URL when possible.
 *
 * @param specifier Module specifier to resolve.
 * @param importmap Optional import map.
 * @returns Resolved URL or `null`.
 */
export function resolveSpecifier(
  specifier: string,
  importmap?: ImportMap,
): string | null {
  const result = resolveSpecifierDebug(specifier, importmap);
  return result.resolved;
}

/**
 * Resolves a specifier and keeps trace information about the source.
 *
 * @param specifier Module specifier to resolve.
 * @param importmap Optional import map.
 * @returns Detailed resolution result.
 */
export function resolveSpecifierDebug(
  specifier: string,
  importmap?: ImportMap,
): ImportResolutionResult {
  // 1. Relative or absolute.
  if (specifier.startsWith('.') || specifier.startsWith('/')) {
    return {
      original: specifier,
      resolved: specifier,
      source: 'relative',
    };
  }

  // 2. Import map.
  const mapped = resolveFromImportMap(specifier, importmap);
  if (mapped !== null) {
    return {
      original: specifier,
      resolved: mapped,
      source: 'importmap',
    };
  }

  // 3. Controlled CDN fallback.
  const cdn = resolveFromKnownCdn(specifier);
  if (cdn !== null) {
    return {
      original: specifier,
      resolved: cdn,
      source: 'cdn',
    };
  }

  return {
    original: specifier,
    resolved: null,
    source: 'unknown',
  };
}

/**
 * Resolves a specifier from the provided import map.
 *
 * @param specifier Module specifier to resolve.
 * @param importmap Optional import map.
 * @returns Resolved URL or `null`.
 * @internal
 */
function resolveFromImportMap(
  specifier: string,
  importmap?: ImportMap,
): string | null {
  if (!importmap?.imports) return null;

  const imports = importmap.imports;

  // Exact match.
  if (imports[specifier]) {
    return imports[specifier];
  }

  // Prefix match.
  for (const [key, value] of Object.entries(imports)) {
    if (key.endsWith('/') && specifier.startsWith(key)) {
      return `${value}${specifier.slice(key.length)}`;
    }
  }

  return null;
}

/**
 * Resolves a specifier from the allow-listed CDN maps.
 *
 * @param specifier Module specifier to resolve.
 * @returns Resolved CDN URL or `null`.
 * @internal
 */
function resolveFromKnownCdn(specifier: string): string | null {
  const exact = SAFE_CDN_IMPORTS[specifier];

  if (exact !== undefined) {
    return exact;
  }

  for (const [prefix, baseUrl] of Object.entries(SAFE_CDN_PREFIX_IMPORTS)) {
    if (specifier.startsWith(prefix)) {
      return `${baseUrl}${specifier.slice(prefix.length)}/+esm`;
    }
  }

  return null;
}