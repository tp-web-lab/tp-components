/** @module components/typescript-viewer-question */
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
 * @tp-dependency tp-typescript-viewer
 * @summary Compact TypeScript code viewer and runner.
 */
import { TpPlaygroundQuestion } from "../playground-question/playground-question.js";
import { TpTypescriptViewer } from "../typescript-viewer/typescript-viewer.js";
/**
 * The custom `<tp-typescript-viewer-question>` element presents and grades TypeScript programming exercises.
 *
 * @summary Presents and grades TypeScript programming exercises.
 * @tagname tp-typescript-viewer-question
 * @accessibility Reuses TpQuestion's disclosure, actions and feedback tabs.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-typescript-viewer-question open="" src="/docs/components/playground-question/examples/typescript/double.ts" test="/docs/components/playground-question/examples/typescript/double.test.ts">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Open Code to edit, then submit to run the tests.</dd>
 *     <dt>Solution</dt><dd>Return value * 2.</dd>
 *   </dl>
 * </tp-typescript-viewer-question>
 */
export declare class TpTypescriptViewerQuestion extends TpPlaygroundQuestion<TpTypescriptViewer> {
    /** Creates the fixed typescript viewer; no language or mode attributes are needed. */
    protected createPlayground(): TpTypescriptViewer;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-typescript-viewer-question": TpTypescriptViewerQuestion;
    }
}
