/** @module components/typescript-playground-question */
/**
 * @tp-dependency tp-console
 * @summary Displays structured console output.
 */
/**
 * @tp-dependency tp-iframe
 * @summary Controlled iframe component.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
/**
 * @tp-dependency tp-typescript-playground
 * @summary TypeScript playground component.
 */
import { TpPlaygroundQuestion } from "../playground-question/playground-question.js";
import { TpTypescriptPlayground } from "../typescript-playground/typescript-playground.js";
/**
 * The custom `<tp-typescript-playground-question>` element presents and grades TypeScript programming exercises.
 *
 * @summary Presents and grades TypeScript programming exercises.
 * @tagname tp-typescript-playground-question
 * @accessibility Reuses TpQuestion's disclosure, actions and feedback tabs.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-typescript-playground-question open="" src="/docs/components/playground-question/examples/typescript/double.ts" test="/docs/components/playground-question/examples/typescript/double.test.ts">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Edit the source, then submit to run the tests.</dd>
 *     <dt>Solution</dt><dd>Return value * 2.</dd>
 *   </dl>
 * </tp-typescript-playground-question>
 */
export declare class TpTypescriptPlaygroundQuestion extends TpPlaygroundQuestion<TpTypescriptPlayground> {
    /** Creates the fixed typescript playground; no language or mode attributes are needed. */
    protected createPlayground(): TpTypescriptPlayground;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-typescript-playground-question": TpTypescriptPlaygroundQuestion;
    }
}
