/** @module components/asciidoc-viewer-question */
/**
 * @tp-dependency tp-asciidoc-viewer
 * @summary Interactive AsciiDoc viewer with editable source and parser outputs.
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
 * @tp-dependency tp-code-editor
 * @summary CodeMirror-based code editor component.
 */
/**
 * @tp-dependency tp-console
 * @summary Displays structured console output.
 */
/**
 * @tp-dependency tp-drawer
 * @summary Displays a sliding drawer panel.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Displays an anchored dropdown menu.
 */
/**
 * @tp-dependency tp-file-tree
 * @summary Displays an interactive file and folder tree.
 */
/**
 * @tp-dependency tp-filesystem
 * @summary In-memory file system component.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-iframe
 * @summary Controlled iframe component.
 */
/**
 * @tp-dependency tp-menu
 * @summary Accessible menu component.
 */
/**
 * @tp-dependency tp-question
 * @summary Base description-list container for question components.
 */
/**
 * @tp-dependency tp-splitter
 * @summary Splitter component with two resizable panels.
 */
/**
 * @tp-dependency tp-switcher
 * @summary Switches between horizontal and vertical layouts based on available space.
 */
/**
 * @tp-dependency tp-tabs
 * @summary Accessible tabs component with keyboard and reorder support.
 */
/**
 * @tp-dependency tp-toolbar
 * @summary Sticky toolbar with start / center / end sections,
 */
/**
 * @credit es-module-lexer https://github.com/guybedford/es-module-lexer
 * @summary ECMAScript module import analysis.
 */
/**
 * @credit Chai https://www.chaijs.com/
 * @summary Assertions in browser tests.
 */
/**
 * @credit Lit https://lit.dev/
 * @summary Web-component examples and import maps.
 */
/**
 * @credit Mocha https://mochajs.org/
 * @summary Browser test execution.
 */
/**
 * @credit TypeScript https://www.typescriptlang.org/
 * @summary TypeScript transpilation and language services.
 */
/**
 * @credit Zod https://zod.dev/
 * @summary Runtime schema validation.
 */
import type { TpAsciidocViewer } from "../asciidoc-viewer/asciidoc-viewer.js";
import "../asciidoc-viewer/asciidoc-viewer.js";
import { TpMarkupViewerQuestion } from "../markup-viewer-question/markup-viewer-question.js";
/**
 * @summary checks rendered AsciiDoc using a viewer and external JavaScript DOM tests.
 * @tagname tp-asciidoc-viewer-question
 * @accessibility Reuses question actions, feedback tabs and the editable markup viewer.
 * @keyboard {Enter / Space} Expands the question or activates a focused action.
 * @example
 * <tp-asciidoc-viewer-question open src="/tp-components/docs/components/markup-viewer-question/examples/emphasis.adoc" test="/tp-components/docs/components/markup-viewer-question/examples/emphasis.test.js">
 *   <dl>
 *     <dt>Title</dt><dd>Semantic emphasis</dd>
 *     <dt>Prompt</dt><dd>Mark Hello with strong emphasis. Open Code to edit, then submit.</dd>
 *     <dt>Solution</dt><dd>Use the language's strong-emphasis syntax.</dd>
 *   </dl>
 * </tp-asciidoc-viewer-question>
 */
export declare class TpAsciidocViewerQuestion extends TpMarkupViewerQuestion<TpAsciidocViewer> {
    /** Creates the fixed AsciiDoc response viewer. */
    protected createViewer(): TpAsciidocViewer;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-asciidoc-viewer-question": TpAsciidocViewerQuestion;
    }
}
