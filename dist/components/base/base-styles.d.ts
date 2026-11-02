/**
 * Injects the shared tp-* styles and a default theme class eagerly.
 *
 * This avoids initial render flashes when static markup uses theme-dependent
 * tokens before any `<tp-theme>` or `<tp-color>` interaction occurs.
 *
 * @summary Ensures global tp-* styles are ready.
 * @internal
 */
export declare function ensureTpBaseStyles(): void;
