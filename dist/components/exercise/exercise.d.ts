/**
 * @module components/exercise
 * @summary Groups questions around a shared context and optional countdown.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-mask
 * @summary Replaces an anchored element with a message while active.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
/**
 * @tp-dependency tp-timer
 * @summary Countdown timer with stop control and optional ring.
 */
import { TpBase } from "../base/base.js";
import "../icon/icon.js";
import "../question/question.js";
/**
 * The custom `<tp-exercise>` element groups a shared context and an ordered list of questions, with an optional countdown for the whole activity.
 *
 * @summary Groups a shared context and an ordered list of questions, with an optional countdown for the whole activity.
 * @tagname tp-exercise
 * @attr {boolean} open = false - Initially expand the exercise.
 * @attr {string} timing = "" - Optional nonzero time limit in strict hh:mm:ss format.
 * @example
 * <tp-exercise open="">
 *   <dl>
 *     <dt>Title</dt><dd>A day at the museum</dd>
 *     <dt>Context</dt><dd>The museum opens at 9 a.m. Admission costs 8 euros.</dd>
 *     <dt>Questions</dt><dd><ol class="questions">
 *       <li><tp-question open="input"><dl>
 *         <dt>Title</dt><dd>Opening time</dd>
 *         <dt>Prompt</dt><dd>When does the museum open?</dd>
 *         <dt>Form</dt><dd><tp-textfield label="Your answer"></tp-textfield></dd>
 *         <dt>Feedback</dt><dd>Compare your answer with the opening time in the context.</dd>
 *         <dt>Solution</dt><dd>At 9 a.m.</dd>
 *       </dl></tp-question></li>
 *       <li><tp-question open="input"><dl>
 *         <dt>Title</dt><dd>Admission</dd>
 *         <dt>Prompt</dt><dd>How much do two tickets cost?</dd>
 *         <dt>Form</dt><dd><tp-textfield label="Your answer"></tp-textfield></dd>
 *         <dt>Feedback</dt><dd>Multiply the price of one ticket by two.</dd>
 *         <dt>Solution</dt><dd>16 euros.</dd>
 *       </dl></tp-question></li>
 *     </ol></dd>
 *   </dl>
 * </tp-exercise>
 *  @accessibility Uses native details and summary for disclosure, preserves the authored title content and ordered questions, and hides the decorative title icon from assistive technology.
 * @accessibility Timed exercises use labelled start controls and tp-mask to make unavailable question content inert; individual questions retain their own controls and feedback.
 * @accessibilityresponsibility Provide a descriptive title, clear instructions and accessible question content. Offer an untimed alternative or appropriate accommodation when imposing a countdown.
 */
export declare class TpExercise extends TpBase {
    private readonly exerciseTiming;
    private sourceObserver;
    static get observedAttributes(): string[];
    get open(): boolean;
    set open(value: boolean);
    get timing(): string;
    set timing(value: string);
    protected connectedCallback(): void;
    protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    disconnectedCallback(): void;
    private render;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-exercise": TpExercise;
    }
}
