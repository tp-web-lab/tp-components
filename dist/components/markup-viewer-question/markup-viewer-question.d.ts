/** @module components/markup-viewer-question */
import { TpEditorQuestion } from "../editor-question/editor-question.js";
import type { TpFile } from "../filesystem/filesystem.types.js";
import type { TpExecutionDocument } from "../playground/playground.js";
/** Public contract implemented by each existing markup viewer. */
export interface MarkupQuestionViewer extends HTMLElement {
    /** External markup source. */
    src: string;
    /** Current source, including edits not yet previewed. */
    getValue(): string;
    /** Independent HTML document produced by the viewer's parser. */
    createRenderedDocument(): Promise<string>;
    /** Restores the original selected example. */
    reset(): void;
}
/**
 * @summary checks rendered markup using JavaScript DOM assertions.
 * @example
 * <tp-markdown-viewer-question open src="/docs/components/markup-viewer-question/examples/emphasis.md" test="/docs/components/markup-viewer-question/examples/emphasis.test.js">
 *   <dl>
 *     <dt>Title</dt><dd>Semantic emphasis</dd>
 *     <dt>Prompt</dt><dd>Mark Hello with strong emphasis. Open Code to edit, then submit.</dd>
 *     <dt>Solution</dt><dd>Use the language's strong-emphasis syntax.</dd>
 *   </dl>
 * </tp-markdown-viewer-question>
 */
export declare abstract class TpMarkupViewerQuestion<TViewer extends MarkupQuestionViewer> extends TpEditorQuestion<TViewer> {
    /** Markup viewer source readiness event. */
    protected readonly sourceLoadedEvent = "tp-markup-viewer-src-load";
    /** Creates the fixed language viewer. */
    protected abstract createViewer(): TViewer;
    /** Adapts the viewer factory to shared question lifecycle handling. */
    protected createEditor(): TViewer;
    /** Submits the current markup source as the response value. */
    protected responseValue(control: TViewer): string;
    /** Runs trusted JavaScript tests against a fresh, isolated rendering snapshot. */
    protected buildTests(control: TViewer, file: TpFile): Promise<TpExecutionDocument>;
}
