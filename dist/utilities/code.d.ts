/**
 * @module utilities/code
 * @summary Utilities for loading, normalizing, and detecting source code blocks.
 */
/**
 * Represents a resolved code block.
 *
 * @summary Resolved data for a source snippet.
 */
export type TpResolvedCode = {
    /**
     * Logical source file name.
     */
    filename: string;
    /**
     * Detected or provided language.
     */
    language: string;
    /**
     * Textual code content.
     */
    value: string;
};
/**
 * Removes shared indentation from a multi-line text block.
 *
 * Useful for cleaning the content of `<script type="...">`
 * or an indented `<template>` inside HTML.
 *
 * @summary Removes common indentation from multiline text.
 * @param input Text to normalize.
 * @returns Dedented text.
 */
export declare function dedent(input: string): string;
/**
 * Infers a language from a file name.
 *
 * If no known extension is found, returns `plaintext`.
 *
 * @summary Detects a language from a file extension.
 * @param filename File name or path.
 * @returns Detected language.
 */
export declare function getLanguageFromFilename(filename: string): string;
/**
 * Loads a text file with `fetch` and returns its content, name, and language.
 *
 * If `language` is not provided, the language is inferred from the extension.
 * If no known extension is found, the language becomes `plaintext`.
 *
 * @summary Loads code from a file.
 * @param filename URL or path of the file to load.
 * @param language Optional language.
 * @returns Resolved file data.
 * @throws {Error} If loading fails.
 */
export declare function getCodeFromFile(filename: string, language?: string): Promise<TpResolvedCode>;
/**
 * Searches for a `<script type="tp/<language>">` in a container and returns
 * its dedented content, logical name, and resolved language.
 *
 * Rules:
 * - if `language` is provided, searches for `script[type="tp/<language>"]`
 * - otherwise searches for the first `script[type^="tp/"]`
 * - if the script has a `filename`, the language may be inferred from that name
 * - if no language is known, returns `plaintext`
 *
 * @summary Resolves code from an inline script.
 * @param language Desired or expected language.
 * @param root Search root element. Defaults to `document`.
 * @returns Resolved script data, or `null` if no matching script is found.
 */
export declare function getCodeFromScript(language?: string, root?: ParentNode): TpResolvedCode | null;
/**
 * Searches for a `<template>` in a container and returns its content, logical
 * name, and resolved language.
 *
 * Rules:
 * - if `language` is provided, it takes priority
 * - otherwise, if the template has a `filename`, the language is inferred from
 *   that name
 * - otherwise the language is `plaintext`
 *
 * The content is read from `innerHTML` so the markup is preserved faithfully,
 * including any nested `<script>` tags.
 *
 * The template may receive a `filename="..."` attribute to mimic a file source.
 *
 * @summary Resolves code from an inline template.
 * @param language Desired or expected language.
 * @param root Search root element. Defaults to `document`.
 * @returns Resolved template data, or `null` if no template is found.
 */
export declare function getCodeFromTemplate(language?: string, root?: ParentNode): TpResolvedCode | null;
/**
 * Returns a defined value or throws a clear error.
 *
 * @summary Ensures a value is neither `null` nor `undefined`.
 * @param value Value to validate.
 * @param message Error message if the value is missing.
 * @returns Non-null value.
 * @throws {Error} If the value is missing.
 */
export declare function expectDefined<T>(value: T | null | undefined, message: string): T;
