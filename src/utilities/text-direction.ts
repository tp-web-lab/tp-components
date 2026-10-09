/**
 * @module utilities/text-direction
 * @summary Text-direction helpers shared by documentation and UI components.
 */

/**
 * Primary BCP 47 language subtags whose natural reading direction is RTL.
 */
const RTL_LANGUAGE_CODES = new Set([
  'ar',  // Arabic
  'arc', // Aramaic
  'ckb', // Central Kurdish
  'dv',  // Divehi
  'fa',  // Persian
  'he',  // Hebrew
  'ks',  // Kashmiri
  'nqo', // N'Ko
  'pa',  // Punjabi (Shahmukhi script)
  'pnb', // Western Punjabi
  'ps',  // Pashto
  'sd',  // Sindhi
  'ug',  // Uyghur
  'ur',  // Urdu
  'yi',  // Yiddish
]);

/**
 * Country or flag codes used as documentation locale folders for RTL content.
 */
const RTL_REGION_CODES = new Set([
  'ae',
  'bh',
  'dz',
  'eg',
  'iq',
  'jo',
  'kw',
  'lb',
  'ly',
  'ma',
  'mr',
  'om',
  'ps',
  'qa',
  'sa',
  'sd',
  'sy',
  'tn',
  'ye',
]);

/**
 * Determines whether a language, locale, or documentation region code maps to RTL.
 *
 * @summary Detects RTL reading direction from a language or locale code.
 * @param value BCP 47 language tag or documentation locale folder.
 * @returns `true` when the code should use right-to-left rendering.
 */
export function isRtlLocale(value: string): boolean {
  const code = value.trim().toLowerCase().split('-')[0] ?? '';
  return RTL_LANGUAGE_CODES.has(code) || RTL_REGION_CODES.has(code);
}

/**
 * Resolves the text direction for a language, locale, or documentation region code.
 *
 * @summary Resolves `ltr` or `rtl` from a language or locale code.
 * @param value BCP 47 language tag or documentation locale folder.
 * @returns The text direction associated with the code.
 */
export function resolveTextDirection(value: string): 'ltr' | 'rtl' {
  return isRtlLocale(value) ? 'rtl' : 'ltr';
}
