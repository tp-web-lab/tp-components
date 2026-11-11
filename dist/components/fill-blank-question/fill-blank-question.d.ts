/**
 * @module components/fill-blank-question
 * @summary Fill-in-the-blank question component backed by tp-fill-blank.
 */
import "../mathfield/mathfield.js";
import { TpQuestion } from "../question/question.js";
import "../fill-blank/fill-blank.js";
import "../textfield/textfield.js";
/**
 * The custom `<tp-fill-blank-question>` element presents and grades a fill-in-the-blank question.
 *
 * @summary Presents and grades a fill-in-the-blank question.
 * @tagname tp-fill-blank-question
 *
 * @attr {boolean} case-sensitive = false - Requires matching uppercase and lowercase letters in answers.
 * @attr {string} mode = "mixed" - Blank mode: opened, closed, or mixed local choices.
 * @attr {boolean} partial = false - Allows incomplete submissions and marks filled blanks as correct or incorrect after feedback.
 *
 * @example
 * <tp-fill-blank-question case-sensitive="">
 *   <dl>
 *     <dt>Answers</dt><dd><ol><li>Paris</li><li>Rome</li></ol></dd>
 *     <dt>Title</dt><dd>Geography</dd>
 *     <dt>Prompt</dt><dd>Complete both sentences.</dd>
 *     <dt>Form</dt>
 *     <dd>
 *       <p>The capital of France is <tp-blank name="france-capital" placeholder="Capital" aria-label="Capital of France" clearable=""></tp-blank>.</p>
 *       <p>The capital of Italy is <tp-blank name="italy-capital" placeholder="Capital" aria-label="Capital of Italy" clearable=""></tp-blank>.</p>
 *     </dd>
 *     <dt>Feedback</dt>
 *     <dd>
 *       <p>Check the spelling of each capital.</p>
 *       <ul>
 *         <li>The capital of France is home to the Eiffel Tower.</li>
 *         <li>The capital of Italy is home to the Colosseum.</li>
 *       </ul>
 *     </dd>
 *     <dt>Solution</dt><dd>The capital of France is Paris. The capital of Italy is Rome.</dd>
 *   </dl>
 * </tp-fill-blank-question>
 */
export declare class TpFillBlankQuestion extends TpQuestion {
    static get observedAttributes(): string[];
    /** Expected values in blank order. */
    private answerValues;
    private expectedValues;
    private answerRules;
    private mathChecker;
    private mathResults;
    private mathTransformations;
    private updatingModes;
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
    private answerReading;
    /** Whether answer comparison distinguishes uppercase and lowercase letters. */
    get caseSensitive(): boolean;
    /** Enables or disables case-sensitive answer comparison. */
    set caseSensitive(value: boolean);
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
    private readonly onBlankModeChange;
    private isClosedAnswer;
    /** Keeps author blanks in place and limits the bank to closed destinations. */
    private updateClosedAnswers;
    private isMathAnswer;
    protected prepareSubmission(): void | Promise<void>;
    private prepareMathResults;
    /** Read the current field regular expression. */
    private answerPattern;
    private answerMatches;
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
