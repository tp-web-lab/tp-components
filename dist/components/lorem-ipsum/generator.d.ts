export type LoremType = "sentence" | "title" | "p" | "dl" | "ol" | "ul";
/**
 * Parsed options for lorem generation.
 */
export interface LoremOptions {
    /**
     * Output kind.
     */
    type: LoremType;
    /**
     * Number (or range) of generated top-level items.
     */
    length: number | string;
    /**
     * Number (or range) of words for generated sentences.
     */
    wordsPerSentence: number | string;
    /**
     * Number (or range) of sentences per paragraph (`type: p`).
     */
    sentencesPerParagraph: number | string;
    /**
     * Optional deterministic seed.
     */
    seed?: number;
}
/**
 * Default lorem directive options.
 */
export declare const DEFAULT_OPTIONS: LoremOptions;
/**
 * Renders lorem output according to selected type and seed.
 *
 * @param options - Lorem options.
 * @returns HTML (or escaped text for inline forms).
 */
export declare function renderLorem(options: LoremOptions): string;
/**
 * Validates and normalizes lorem type.
 *
 * @param value - Raw type value.
 * @returns Supported type, defaults to `p`.
 */
export declare function readLoremType(value: string | number): LoremType;
/**
 * Reads an optional finite integer.
 *
 * @param value - Raw value.
 * @returns Parsed integer or `undefined`.
 */
export declare function readOptionalInteger(value: string | number | undefined): number | undefined;
