/**
 * @module components/single-choice-question
 * @summary Single-choice question component backed by a tp-radio-list.
 */
import { TpQuestion } from "../question/question.js";
import "../radio-list/radio-list.js";
/**
 * @summary Single-choice question: wraps tp-question with radio-list validation.
 * @tagname tp-single-choice-question
 *
 * @attr {number} answer = 0 - 1-based index of the correct answer in the original list order. Not reflected back to the DOM when set via JS property — read from attribute only.
 * @attr {boolean} random = false - When present, items are shuffled on connect and after each reset.
 * @attr {string} name = "" - Name attribute passed to the underlying tp-radio-list.
 * @attr {string} orientation = "" - Orientation attribute passed to the underlying tp-radio-list.
 * @attr {string} value = "" - Value attribute passed to the underlying tp-radio-list.
 * @attr {string} src = "" - URL to an external JSON file describing items, answer, and feedback. When present, the answer is never exposed in the HTML source. Inherited from TpQuestion.
 * @example
 * <tp-single-choice-question></tp-single-choice-question>
 */
export declare class TpSingleChoiceQuestion extends TpQuestion {
    static get observedAttributes(): string[];
    /** Reference to the correct <li> element, stored before any shuffle. */
    private correctItemEl;
    /** Maps each <li> element to its feedback text, keyed before any shuffle. */
    private feedbackByItem;
    /** Internal answer value — NOT reflected back to the DOM attribute. */
    private _answer;
    /**
     * 1-based index of the correct answer in the original list.
     * Reads the DOM attribute on first access; JS assignment does NOT write back to the DOM.
     */
    get answer(): number;
    /** Sets the answer without exposing it in the DOM. */
    set answer(value: number);
    /** When `true`, items are shuffled on connect and after each reset. */
    get random(): boolean;
    set random(value: boolean);
    /** Name attribute passed to the underlying tp-radio-list. */
    get name(): string;
    set name(value: string);
    /** Orientation attribute passed to the underlying tp-radio-list. */
    get orientation(): string;
    set orientation(value: string);
    /** Value attribute passed to the underlying tp-radio-list. */
    get value(): string;
    set value(val: string);
    protected connectedCallback(): void;
    protected beforeQuestionLayout(): void;
    protected onSrcReady(data: unknown): Promise<void>;
    private initInline;
    /** Replaces the rendered form content with a new tp-radio-list built from src items. */
    private populateItemsFromSrc;
    /**
     * Shuffles the radio-list items using a Fisher-Yates algorithm.
     * Clears the current selection after shuffling.
     *
     * @summary Randomizes the order of answer items.
     */
    randomize(): void;
    protected onReset(): void;
    protected onSubmitAttempt(value: unknown): void;
    protected get resetMessageText(): string;
    protected validateSubmit(value: unknown): string | null;
    protected submitMessage(value: unknown): HTMLElement;
    /** Wraps a bare list (ol/ul) in tp-radio-list if not already wrapped. */
    private ensureRadioList;
    /** Stores the correct <li> element before any shuffle, based on the answer attribute. */
    private storeCorrectItem;
    private isCorrectSelection;
    /** Builds a map from each <li> element to its feedback text, keyed before any shuffle. */
    private buildFeedbackMap;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-single-choice-question": TpSingleChoiceQuestion;
    }
}
