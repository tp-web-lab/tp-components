/**
 * @module components/latex-playground
 * @summary Edits and renders LaTeX projects as interactive web documents.
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
 * @summary Drawer overlay component.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Dropdown menu component.
 */
/**
 * @tp-dependency tp-filesystem
 * @summary In-memory file system component.
 */
/**
 * @tp-dependency tp-html-viewer
 * @summary Interactive HTML viewer with editable source, live rendering, and DOM inspection.
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
 * @credit tp-utilities https://www.npmjs.com/package/@tp/tp-utilities
 * @summary Shared parsers, games and rendering utilities.
 */
/**
 * @credit es-module-lexer https://github.com/guybedford/es-module-lexer
 * @summary ECMAScript module import analysis.
 */
/**
 * @credit Lit https://lit.dev/
 * @summary Web-component examples and import maps.
 */
/**
 * @credit Zod https://zod.dev/
 * @summary Runtime schema validation.
 */
import type { TpFile } from "../filesystem/filesystem.types.js";
import { type TpExecutionDocument, TpPlayground } from "../playground/playground.js";
import type { TpExampleProjectMetadata } from "../playground/playground-example-loader.js";
import { TpLatexProject } from "./latex-project.js";
export { TpLatexProject } from "./latex-project.js";
/**
 * The custom `<tp-latex-playground>` element edits and previews LaTeX projects.
 *
 * @summary Edits and previews LaTeX projects.
 * @tagname tp-latex-playground
 * @attr {string} src = "" - LaTeX source file or JSON project to load.
 * @attr {string} repository = "" - Directory containing a playground project.
 * @example
 * <tp-latex-playground><script type="tp/latex">\section{Hello}A formula $x^2$.</script></tp-latex-playground>
 *  @see tp-latex-viewer - Present editable examples with rendered and generated HTML views.
 * @see tp-latex - Render LaTeX directly in a page.
 */
export declare class TpLatexPlayground extends TpPlayground<TpLatexProject> {
    protected createEmptyProject(): TpLatexProject;
    protected createInitialProject(): TpLatexProject;
    protected createClearProject(): TpLatexProject;
    protected normalizeProject(project: TpLatexProject): TpLatexProject;
    protected resolveEntry(project: TpLatexProject): string | null;
    protected getPlaygroundKind(): string;
    protected getLanguageIconName(): string;
    protected getLanguageHelp(): string;
    protected createProjectFromExample(metadata: TpExampleProjectMetadata, files: readonly TpFile[]): TpLatexProject;
    protected buildExecutionDocument(project: TpLatexProject): Promise<TpExecutionDocument>;
    protected get exampleCategory(): string;
    protected get exampleGroup(): string;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-latex-playground": TpLatexPlayground;
    }
}
