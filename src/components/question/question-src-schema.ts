/**
 * @module components/question/question-src-schema
 * @summary Zod schemas for external question JSON files loaded via the `src` attribute.
 */

import { z } from "zod";

// ── Shared base ─────────────────────────────────────────────────────────────

const QuestionMarkupSchema = z.enum(["markdown", "md", "html", "none"]);

/**
 * Fields common to all question types.
 * Only `prompt`, `form`, and `attributes.answer` are required.
 */
const BaseQuestionSrcSchema = z.object({
	/** Optional title shown in the collapsible summary. */
	title: z.string().optional(),
	/** Optional markup mode applied to all strings in this JSON question. */
	markup: QuestionMarkupSchema.default("markdown").optional(),
	/** Required question prompt (plain text or markdown). */
	prompt: z.string().min(1),
	/** Required list of answer choices (at least 2). */
	form: z.array(z.string().min(1)).min(2),
	/** Optional per-item feedback texts, in the same order as `form`. */
	feedback: z.array(z.string()).optional(),
	/** Optional solution text shown after correct answer (plain text or markdown). */
	solution: z.string().optional(),
});

// ── Single-choice ───────────────────────────────────────────────────────────

const SingleChoiceAttributesSchema = z.object({
	/** Required 1-based index of the correct answer (number or numeric string). */
	answer: z.union([
		z.number().int().min(1),
		z.string().regex(/^\d+$/, "Expected a 1-based integer index"),
	]),
	/** When true, items are shuffled on connect and after each reset. */
	random: z.boolean().optional(),
	/** Forwarded to the underlying tp-radio-list. */
	name: z.string().optional(),
	/** Forwarded to the underlying tp-radio-list. */
	orientation: z.string().optional(),
	/** Forwarded to the underlying tp-radio-list. */
	value: z.string().optional(),
});

export const SingleChoiceQuestionSrcSchema = BaseQuestionSrcSchema.extend({
	attributes: SingleChoiceAttributesSchema,
});

export type SingleChoiceQuestionSrc = z.infer<
	typeof SingleChoiceQuestionSrcSchema
>;

// ── Multi-choice ────────────────────────────────────────────────────────────

const MultiChoiceAttributesSchema = z.object({
	/**
	 * Required 1-based indexes of correct answers.
	 * Accepted as a comma-separated string (`"1,3"`), an array of numbers,
	 * or a single numeric string.
	 */
	answer: z.union([
		z.literal(""),
		z
			.string()
			.regex(/^\d+(,\s*\d+)*$/, "Expected comma-separated 1-based indexes"),
		z.array(z.number().int().min(1)),
	]),
	/** When true, items are shuffled on connect and after each reset. */
	random: z.boolean().optional(),
	/** Forwarded to the underlying tp-checkbox-list. */
	name: z.string().optional(),
	/** Forwarded to the underlying tp-checkbox-list. */
	orientation: z.string().optional(),
	/** Forwarded to the underlying tp-checkbox-list. */
	value: z.string().optional(),
});

export const MultiChoiceQuestionSrcSchema = BaseQuestionSrcSchema.extend({
	attributes: MultiChoiceAttributesSchema,
});

export type MultiChoiceQuestionSrc = z.infer<
	typeof MultiChoiceQuestionSrcSchema
>;

// ── Fill-blank ───────────────────────────────────────────────────────────────

const FillBlankAttributesSchema = z.object({
	/**
	 * Required answers in blank order.
	 * Accepted as a comma-separated string (`"went,forgave"`) or an array.
	 */
	answer: z.union([z.string().min(1), z.array(z.string().min(1)).min(1)]),
});

export const FillBlankQuestionSrcSchema = z.object({
	/** Optional title shown in the collapsible summary. */
	title: z.string().optional(),
	/** Optional markup mode applied to all strings in this JSON question. */
	markup: QuestionMarkupSchema.default("markdown").optional(),
	/** Required question prompt (plain text or markdown). */
	prompt: z.string().min(1),
	/** Required fill-blank body, usually containing `<input>` / `<select>` HTML. */
	form: z.string().min(1),
	/** Optional per-blank feedback texts, in blank order. */
	feedback: z.array(z.string()).optional(),
	/** Optional solution text shown after correct answer. */
	solution: z.string().optional(),
	attributes: FillBlankAttributesSchema,
});

export type FillBlankQuestionSrc = z.infer<typeof FillBlankQuestionSrcSchema>;
