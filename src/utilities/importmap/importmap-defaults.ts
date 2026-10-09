/**
 * @module utilities/importmap/importmap-defaults
 * @summary Default safe CDN import mappings used by the import-map resolver.
 */

/**
 * Exact specifiers that are allowed to resolve to a controlled CDN URL.
 */
export const SAFE_CDN_IMPORTS: Record<string, string> = {
  'lit': 'https://cdn.jsdelivr.net/npm/lit@3/+esm',
  '@lit/reactive-element': 'https://cdn.jsdelivr.net/npm/@lit/reactive-element@2/+esm',
  'react': 'https://esm.sh/react@18.3.1?dev',
  'react-dom/client':
    'https://esm.sh/react-dom@18.3.1/client?dev&external=react',
  'svelte': 'https://cdn.jsdelivr.net/npm/svelte@5/+esm',
  'svelte/compiler': 'https://cdn.jsdelivr.net/npm/svelte@5/compiler/+esm',
  'vue': 'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.prod.js'
};

/**
 * Prefix specifiers that are allowed to resolve to a controlled CDN URL.
 */
export const SAFE_CDN_PREFIX_IMPORTS: Record<string, string> = {
  'lit/': 'https://cdn.jsdelivr.net/npm/lit@3/',
  'lit-html/': 'https://cdn.jsdelivr.net/npm/lit-html@3/',
  '@lit/reactive-element/': 'https://cdn.jsdelivr.net/npm/@lit/reactive-element@2/',
};