/**
 * @module utilities/importmap/importmap-types
 * @summary Shared import-map types used by the resolver and rewriter.
 */
/**
 * Import map structure.
 */
export interface ImportMap {
    /**
     * Top-level import mappings.
     */
    imports?: Record<string, string>;
    /**
     * Scope-specific import mappings.
     */
    scopes?: Record<string, Record<string, string>>;
}
/**
 * Source of a resolved import specifier.
 */
export type ImportResolutionSource = 'relative' | 'importmap' | 'cdn' | 'unknown';
/**
 * Detailed import resolution result.
 */
export interface ImportResolutionResult {
    /**
     * Original module specifier.
     */
    original: string;
    /**
     * Resolved URL or `null` if unresolved.
     */
    resolved: string | null;
    /**
     * Source used to resolve the specifier.
     */
    source: ImportResolutionSource;
}
