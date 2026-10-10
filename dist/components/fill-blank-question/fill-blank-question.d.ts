/**
 * @module components/fill-blank-question
 * @summary Fill-in-the-blank question component backed by tp-fill-blank.
 */
/**
 * @tp-dependency tp-blank
 * @summary displays a text, SVG or image answer in a focusable blank.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-button-group
 * @summary Button group component for organizing multiple buttons.
 */
/**
 * @tp-dependency tp-callout
 * @summary Callout component for highlighted contextual content.
 */
/**
 * @tp-dependency tp-divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
 */
/**
 * @tp-dependency tp-dragdrop
 * @summary Generic drag-and-drop controller for content.
 */
/**
 * @tp-dependency tp-fill-blank
 * @summary manages inline fields and rich blanks in the content.
 */
/**
 * @tp-dependency tp-markdown
 * @summary Markdown rendering component.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
/**
 * @tp-dependency tp-sidebar
 * @summary Sidebar layout component.
 */
/**
 * @tp-dependency tp-textfield
 * @summary Single-line and automatically growing multiline text field.
 */
/**
 * @credit Zod https://zod.dev/
 * @summary Runtime schema validation.
 */
import { TpQuestion } from "../question/question.js";
import "../fill-blank/fill-blank.js";
import "../textfield/textfield.js";
/**
 * @summary Fill-in-the-blank question: wraps tp-question with input/select validation.
 * @tagname tp-fill-blank-question
 *
 * @attr {boolean} case-sensitive = false - Requires matching uppercase and lowercase letters in answers.
 * @attr {boolean} partial = false - Allows incomplete submissions and marks filled blanks as correct or incorrect after feedback.
 * @attr {boolean} closed = false - Provides shuffled answers to assign to readonly tp-textfield blanks.
 * @example
 * <tp-fill-blank-question>
 *   <dl>
 *     <dt>Answers</dt><dd><ol><li>Paris</li></ol></dd>
 *     <dt>Title</dt><dd>Geography</dd>
 *     <dt>Prompt</dt><dd>Complete the sentence.</dd>
 *     <dt>Form</dt><dd>The capital of France is <tp-textfield name="capital" placeholder="Capital" aria-placeholder="Capital" aria-label="Capital" clearable></tp-textfield></dd>
 *     <dt>Feedback</dt><dd>Check the spelling.</dd>
 *     <dt>Solution</dt><dd>Paris</dd>
 *   </dl>
 * </tp-fill-blank-question>
 */
export declare class TpFillBlankQuestion extends TpQuestion {
    static get observedAttributes(): string[];
    /** Expected values in blank order. */
    private answerValues;
    /** Ordered answers read from the author list (or from a JSON source). */
    private listedAnswers;
    /** Original answer presentations, retained independently of their expected rank. */
    private answerContent;
    /** The tp-fill-blank widget instance (if any). */
    private actualFillBlank;
    /** Proxy that exposes string value instead of FormData. */
    private stringValueProxy;
    private feedbackItems;
    /** Optional closed-answer interaction, cleaned up on reset and disconnect. */
    private closedAnswers;
    /** Whether answer comparison distinguishes uppercase and lowercase letters. */
    get caseSensitive(): boolean;
    /** Enables or disables case-sensitive answer comparison. */
    set caseSensitive(value: boolean);
    /** Whether answers are selected from a shuffled bank instead of typed freely. */
    get closed(): boolean;
    /** Enables or disables the closed-answer mode. */
    set closed(value: boolean);
    /** Whether incomplete submissions may receive feedback. */
    get partial(): boolean;
    set partial(value: boolean);
    /** Removes grading from answers as users edit or clear them. */
    private readonly clearEditedResult;
    /** Clears the previous submission's visual grading. */
    private clearResults;
    /** Removes answer-bank listeners before disconnecting the base question. */
    disconnectedCallback(): void;
    protected connectedCallback(): void;
    protected beforeQuestionLayout(): void;
    /** Consumes the answer section before the base class normalizes the question DL. */
    private readAnswerList;
    /** Keeps the prompt notice in sync with the boolean attribute. */
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /** Adds a separate notice after the prompt, preserving authored and fetched content. */
    private updateCaseSensitiveNotice;
    protected onSrcReady(data: unknown): Promise<void>;
    protected findResponseWidget(): HTMLElement | null;
    protected onReset(): void;
    protected onSubmitAttempt(value: unknown): void;
    protected validateSubmit(_value: unknown): string | null;
    /** A fully correct response needs congratulations, not a missing-feedback warning. */
    protected shouldShowMissingFeedback(): boolean;
    protected submitMessage(_value: unknown): HTMLElement;
    /** Wraps inputs/selects in tp-fill-blank if not already wrapped. */
    private ensureFillBlank;
    private populateFormFromSrc;
    /** Uses the ordered list, with a fallback for existing attribute-based exercises. */
    private parseAnswers;
    /** Rebuilds the shuffled bank while preserving the original question form. */
    private updateClosedAnswers;
    private matchesSubmittedValues;
    /** Applies the same whitespace and case policy to validation and per-blank scoring. */
    private normalizeAnswer;
    private getSubmittedValues;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-fill-blank-question": TpFillBlankQuestion;
    }
}
