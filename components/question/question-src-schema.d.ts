/**
 * @module components/question/question-src-schema
 * @summary Zod schemas for external question JSON files loaded via the `src` attribute.
 */
import { z } from "zod";
export declare const SingleChoiceQuestionSrcSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    markup: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        html: "html";
        markdown: "markdown";
        md: "md";
        none: "none";
    }>>>;
    prompt: z.ZodString;
    form: z.ZodArray<z.ZodString>;
    feedback: z.ZodOptional<z.ZodArray<z.ZodString>>;
    solution: z.ZodOptional<z.ZodString>;
    attributes: z.ZodObject<{
        answer: z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>;
        random: z.ZodOptional<z.ZodBoolean>;
        name: z.ZodOptional<z.ZodString>;
        orientation: z.ZodOptional<z.ZodString>;
        value: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type SingleChoiceQuestionSrc = z.infer<typeof SingleChoiceQuestionSrcSchema>;
export declare const MultiChoiceQuestionSrcSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    markup: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        html: "html";
        markdown: "markdown";
        md: "md";
        none: "none";
    }>>>;
    prompt: z.ZodString;
    form: z.ZodArray<z.ZodString>;
    feedback: z.ZodOptional<z.ZodArray<z.ZodString>>;
    solution: z.ZodOptional<z.ZodString>;
    attributes: z.ZodObject<{
        answer: z.ZodUnion<readonly [z.ZodLiteral<"">, z.ZodString, z.ZodArray<z.ZodNumber>]>;
        random: z.ZodOptional<z.ZodBoolean>;
        name: z.ZodOptional<z.ZodString>;
        orientation: z.ZodOptional<z.ZodString>;
        value: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type MultiChoiceQuestionSrc = z.infer<typeof MultiChoiceQuestionSrcSchema>;
export declare const FillBlankQuestionSrcSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    markup: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        html: "html";
        markdown: "markdown";
        md: "md";
        none: "none";
    }>>>;
    prompt: z.ZodString;
    form: z.ZodString;
    feedback: z.ZodOptional<z.ZodArray<z.ZodString>>;
    solution: z.ZodOptional<z.ZodString>;
    attributes: z.ZodObject<{
        answer: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type FillBlankQuestionSrc = z.infer<typeof FillBlankQuestionSrcSchema>;
