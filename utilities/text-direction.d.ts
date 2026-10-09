/**
 * @module utilities/text-direction
 * @summary Text-direction helpers shared by documentation and UI components.
 */
/**
 * Determines whether a language, locale, or documentation region code maps to RTL.
 *
 * @summary Detects RTL reading direction from a language or locale code.
 * @param value BCP 47 language tag or documentation locale folder.
 * @returns `true` when the code should use right-to-left rendering.
 */
export declare function isRtlLocale(value: string): boolean;
/**
 * Resolves the text direction for a language, locale, or documentation region code.
 *
 * @summary Resolves `ltr` or `rtl` from a language or locale code.
 * @param value BCP 47 language tag or documentation locale folder.
 * @returns The text direction associated with the code.
 */
export declare function resolveTextDirection(value: string): 'ltr' | 'rtl';
