/** Generator copied from @tp/tp-markdown/src/markdown/extensions/lorem-ipsum; keep dictionary and seeded output in sync. */
import { DICTIONARY } from "./dictionary.js";

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
export const DEFAULT_OPTIONS: LoremOptions = {
	type: "p",
	length: "3-5",
	wordsPerSentence: "4-16",
	sentencesPerParagraph: "3-6",
};

/**
 * Renders lorem output according to selected type and seed.
 *
 * @param options - Lorem options.
 * @returns HTML (or escaped text for inline forms).
 */
export function renderLorem(options: LoremOptions): string {
	const random =
		options.seed === undefined ? Math.random : createRandom(options.seed);

	switch (options.type) {
		case "sentence":
			return escapeHtml(createSentence(random, options));

		case "title":
			return escapeHtml(createTitle(random, options));

		case "dl":
			return renderDefinitionList(random, options);

		case "ol":
			return renderList(random, options, "ol");

		case "ul":
			return renderList(random, options, "ul");

		default:
			return renderParagraphs(random, options);
	}
}

/**
 * Renders paragraph lorem output (`<p>...</p>` blocks).
 *
 * @param random - Random number generator.
 * @param options - Lorem options.
 * @returns Paragraph HTML.
 */
function renderParagraphs(random: () => number, options: LoremOptions): string {
	const count = readRange(options.length, random);

	return Array.from({ length: count }, () => {
		const sentenceCount = readRange(options.sentencesPerParagraph, random);

		const text = Array.from({ length: sentenceCount }, () =>
			createSentence(random, options),
		).join(" ");

		return `<p>${escapeHtml(text)}</p>`;
	}).join("\n");
}

/**
 * Renders ordered/unordered list lorem output.
 *
 * @param random - Random number generator.
 * @param options - Lorem options.
 * @param tag - List tag (`ol` or `ul`).
 * @returns List HTML.
 */
function renderList(
	random: () => number,
	options: LoremOptions,
	tag: "ol" | "ul",
): string {
	const count = readRange(options.length, random);

	const items = Array.from({ length: count }, () => {
		const text = createSentence(random, options);

		return `  <li>${escapeHtml(text)}</li>`;
	}).join("\n");

	return `<${tag}>\n${items}\n</${tag}>`;
}

/**
 * Renders definition list lorem output.
 *
 * @param random - Random number generator.
 * @param options - Lorem options.
 * @returns Definition list HTML.
 */
function renderDefinitionList(
	random: () => number,
	options: LoremOptions,
): string {
	const count = readRange(options.length, random);

	const items = Array.from({ length: count }, () => {
		const term = createTitle(random, {
			...options,
			wordsPerSentence: "1-3",
		});

		const definition = createSentence(random, options);

		return [
			`  <dt>${escapeHtml(term)}</dt>`,
			`  <dd>${escapeHtml(definition)}</dd>`,
		].join("\n");
	}).join("\n");

	return `<dl>\n${items}\n</dl>`;
}

/**
 * Creates one lorem sentence.
 *
 * @param random - Random number generator.
 * @param options - Lorem options.
 * @returns Sentence ending with a period.
 */
function createSentence(random: () => number, options: LoremOptions): string {
	const count = readRange(options.wordsPerSentence, random);
	const words = createWords(random, count);
	const sentence = words.join(" ");

	return `${capitalize(sentence)}.`;
}

/**
 * Creates one lorem title (title-cased words, no trailing punctuation).
 *
 * @param random - Random number generator.
 * @param options - Lorem options.
 * @returns Title text.
 */
function createTitle(random: () => number, options: LoremOptions): string {
	const count = readRange(options.wordsPerSentence, random);

	return createWords(random, count).map(capitalize).join(" ");
}

/**
 * Generates lorem words from the dictionary.
 *
 * @param random - Random number generator.
 * @param count - Number of words to generate.
 * @returns Generated word list.
 */
function createWords(random: () => number, count: number): string[] {
	return Array.from({ length: count }, () => {
		const index = Math.floor(random() * DICTIONARY.length);

		return DICTIONARY[index] ?? "lorem";
	});
}

/**
 * Validates and normalizes lorem type.
 *
 * @param value - Raw type value.
 * @returns Supported type, defaults to `p`.
 */
export function readLoremType(value: string | number): LoremType {
	if (
		value === "sentence" ||
		value === "title" ||
		value === "p" ||
		value === "dl" ||
		value === "ol" ||
		value === "ul"
	) {
		return value;
	}

	return "p";
}

/**
 * Resolves a fixed integer or an inclusive integer range.
 *
 * @param value - Fixed value or range string (`min-max`).
 * @param random - Random number generator.
 * @returns Resolved integer.
 */
function readRange(value: string | number, random: () => number): number {
	if (typeof value === "number") {
		return Math.max(0, Math.floor(value));
	}

	const range = value.match(/^(\d+)\s*-\s*(\d+)$/);

	if (range !== null) {
		const min = Number.parseInt(range[1] ?? "0", 10);
		const max = Number.parseInt(range[2] ?? String(min), 10);
		const lower = Math.min(min, max);
		const upper = Math.max(min, max);

		return lower + Math.floor(random() * (upper - lower + 1));
	}

	return readInteger(value, 1);
}

/**
 * Reads a finite integer with fallback.
 *
 * @param value - Raw value.
 * @param fallback - Fallback when parsing fails.
 * @returns Parsed integer or fallback.
 */
function readInteger(
	value: string | number | undefined,
	fallback: number,
): number {
	if (typeof value === "number") {
		return Number.isFinite(value) ? Math.floor(value) : fallback;
	}

	if (typeof value !== "string") {
		return fallback;
	}

	const parsed = Number.parseInt(value, 10);

	return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Reads an optional finite integer.
 *
 * @param value - Raw value.
 * @returns Parsed integer or `undefined`.
 */
export function readOptionalInteger(
	value: string | number | undefined,
): number | undefined {
	if (value === undefined) {
		return undefined;
	}

	if (typeof value === "number") {
		return Number.isFinite(value) ? Math.floor(value) : undefined;
	}

	const parsed = Number.parseInt(value, 10);

	return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * Creates a deterministic pseudo-random number generator from a seed.
 *
 * @param seed - Initial seed.
 * @returns RNG function yielding values in `[0, 1)`.
 */
function createRandom(seed: number): () => number {
	let state = seed >>> 0;

	return () => {
		state += 0x6d2b79f5;

		let value = state;

		value = Math.imul(value ^ (value >>> 15), value | 1);
		value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

		return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * Capitalizes the first character of a string.
 *
 * @param value - Input text.
 * @returns Capitalized text.
 */
function capitalize(value: string): string {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Escapes HTML-sensitive characters.
 *
 * @param value - Raw text.
 * @returns Escaped HTML string.
 */
function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}
