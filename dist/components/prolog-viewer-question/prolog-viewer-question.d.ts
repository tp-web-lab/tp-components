/** @module components/prolog-viewer-question */
/**
 * @tp-dependency tp-console
 * @summary Displays structured console output.
 */
/**
 * @tp-dependency tp-iframe
 * @summary Controlled iframe component.
 */
/**
 * @tp-dependency tp-prolog-viewer
 * @summary Compact Prolog code viewer and runner.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
import { TpPlaygroundQuestion } from "../playground-question/playground-question.js";
import { TpPrologViewer } from "../prolog-viewer/prolog-viewer.js";
/**
 * The custom `<tp-prolog-viewer-question>` element presents and grades Prolog programming exercises.
 *
 * @summary Presents and grades Prolog programming exercises.
 * @tagname tp-prolog-viewer-question
 * @accessibility Reuses TpQuestion's disclosure, actions and feedback tabs.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-prolog-viewer-question open="" src="/docs/components/playground-question/examples/prolog/double.pl" test="/docs/components/playground-question/examples/prolog/double.test.pl">
 *   <dl>
 *     <dt>Title</dt><dd>Double a number</dd>
 *     <dt>Prompt</dt><dd>Complete double so it returns twice its argument. Open Code to edit, then submit to run the tests.</dd>
 *     <dt>Solution</dt><dd>Use Result is Value * 2.</dd>
 *   </dl>
 * </tp-prolog-viewer-question>
 */
export declare class TpPrologViewerQuestion extends TpPlaygroundQuestion<TpPrologViewer> {
    /** Creates the fixed prolog viewer; no language or mode attributes are needed. */
    protected createPlayground(): TpPrologViewer;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-prolog-viewer-question": TpPrologViewerQuestion;
    }
}
