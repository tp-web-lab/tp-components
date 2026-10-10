/**
 * @module components/html-playground
 * @summary HTML playground component.
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
import "../playground/playground.js";
import type { TpFile } from "../filesystem/filesystem.types.js";
import type { TpExecutionDocument } from "../playground/playground.js";
import { TpPlayground } from "../playground/playground.js";
import type { TpExampleProjectMetadata } from "../playground/playground-example-loader.js";
import { TpHtmlProject } from "./html-project.js";
export { TpHtmlProject } from "./html-project.js";
/**
 * HTML playground component.
 *
 * Provides a file-based playground that runs HTML, CSS, and JavaScript in an isolated preview.
 *
 * @summary Edits and runs an HTML project.
 * @tagname tp-html-playground
 *
 * @attr {string} repository = "" - Directory containing an HTML playground project to load at initialization.
 * @attr {string} src = "" - JSON project or html source file to load.
 *
 * @example
 * <tp-html-playground></tp-html-playground>
 */
export declare class TpHtmlPlayground extends TpPlayground<TpHtmlProject> {
    protected get supportsTestExecution(): boolean;
    protected getPlaygroundKind(): string;
    protected createProjectFromExample(metadata: TpExampleProjectMetadata, files: readonly TpFile[]): TpHtmlProject;
    protected createNewProject(): TpHtmlProject;
    protected createClearProject(): TpHtmlProject;
    protected getLanguageIconName(): string;
    protected getLanguageHelp(): string;
    protected getAdditionalToolbarMenuItems(): string;
    protected createEmptyProject(): TpHtmlProject;
    protected normalizeProject(project: TpHtmlProject): TpHtmlProject;
    protected resolveEntry(project: TpHtmlProject): string | null;
    protected buildExecutionDocument(project: TpHtmlProject): Promise<TpExecutionDocument>;
    protected buildTestDocument(project: TpHtmlProject): Promise<TpExecutionDocument>;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-html-playground": TpHtmlPlayground;
    }
}
