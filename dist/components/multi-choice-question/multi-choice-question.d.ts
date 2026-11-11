/**
 * @module components/multi-choice-question
 * @summary Multi-choice question component backed by a tp-checkbox-list.
 */
import { TpQuestion } from "../question/question.js";
import "../checkbox-list/checkbox-list.js";
/**
 * The custom `<tp-multi-choice-question>` element presents and grades a question with multiple selectable answers.
 *
 * @summary Presents and grades a question with multiple selectable answers.
 * @tagname tp-multi-choice-question
 *
 * @attr {string} answer = "" - Comma-separated 1-based indexes of the correct answers in the original list order (e.g. `"1,3"`). An empty answer means none of the choices is correct. Not reflected back to the DOM when set via JS property — read from attribute only.
 * @attr {boolean} random = false - When present, items are shuffled on connect and after each reset.
 * @attr {string} name = "" - Form field name passed to the underlying choice list.
 * @attr {string} orientation = "" - Arrangement of answer choices: horizontal or vertical.
 * @attr {string} value = "" - Comma-separated 1-based indexes of the currently selected answers; empty means no selection.
 * @attr {string} src = "" - URL of an external JSON, HTML, Markdown, AsciiDoc or reStructuredText question definition. Keeps the definition out of authored markup, but does not make downloaded answers confidential.
 * @example
 * <tp-multi-choice-question answer="1,3,5" random="">
 *   <dl>
 *     <dt>Title</dt><dd>Web languages</dd>
 *     <dt>Prompt</dt><dd>Select the styling languages, including CSS preprocessors.</dd>
 *     <dt>Form</dt><dd><ul><li>CSS</li><li>HTML</li><li>Sass</li><li>JavaScript</li><li>Less</li></ul></dd>
 *     <dt>Feedback</dt><dd><ul><li>Correct. CSS describes presentation.</li><li>HTML structures content.</li><li>Correct. Sass is a CSS preprocessor.</li><li>JavaScript is a programming language.</li><li>Correct. Less is a CSS preprocessor.</li></ul></dd>
 *     <dt>Solution</dt><dd>CSS, Sass and Less are used to define styles.</dd>
 *   </dl>
 * </tp-multi-choice-question>
 */
export declare class TpMultiChoiceQuestion extends TpQuestion {
    static get observedAttributes(): string[];
    /** DOM references to the correct <li> elements, stored before any shuffle. */
    private correctItemEls;
    /** Maps each <li> element to its feedback text, keyed before any shuffle. */
    private feedbackByItem;
    /** Internal answer value — NOT reflected back to the DOM attribute. */
    private _answer;
    /**
     * Comma-separated 1-based indexes of correct answers in the original list order.
     * e.g. `"1,3"` means items 1 and 3 are correct.
     * Reads the DOM attribute on first access; JS assignment does NOT write back to the DOM.
     */
    get answer(): string;
    /** Sets the answer without exposing it in the DOM. */
    set answer(value: string);
    /** Parsed array of 1-based correct answer indexes. */
    private get answerIndexes();
    /** When `true`, items are shuffled on connect and after each reset. */
    get random(): boolean;
    set random(value: boolean);
    /** Name attribute passed to the underlying tp-checkbox-list. */
    get name(): string;
    set name(value: string);
    /** Orientation attribute passed to the underlying tp-checkbox-list. */
    get orientation(): string;
    set orientation(value: string);
    /** Value attribute passed to the underlying tp-checkbox-list. */
    get value(): string;
    set value(val: string);
    protected connectedCallback(): void;
    protected beforeQuestionLayout(): void;
    protected onSrcReady(data: unknown): Promise<void>;
    private initInline;
    /** Replaces the rendered form content with a new tp-checkbox-list built from src items. */
    private populateItemsFromSrc;
    /**
     * Shuffles the checkbox-list items using a Fisher-Yates algorithm.
     * Clears the current selection after shuffling.
     *
     * @summary Randomizes the order of answer items.
     */
    randomize(): void;
    protected onReset(): void;
    protected onSubmitAttempt(value: unknown): void;
    protected get resetMessageText(): string;
    protected validateSubmit(_value: unknown): string | null;
    protected submitMessage(value: unknown): HTMLElement;
    /** Wraps a bare list (ol/ul) in tp-checkbox-list if not already wrapped. */
    private ensureCheckboxList;
    /** Stores references to the correct <li> elements before any shuffle. */
    private storeCorrectItems;
    private parseSubmittedIndexes;
    private getCorrectCurrentIndexes;
    /** Builds a map from each <li> element to its feedback text, keyed before any shuffle. */
    private buildFeedbackMap;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-multi-choice-question": TpMultiChoiceQuestion;
    }
}
