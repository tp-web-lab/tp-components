/**
 * @module components/javascript-playground
 * @summary JavaScript playground component.
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
 * @credit Lit https://lit.dev/
 * @summary Web-component examples and import maps.
 */
/**
 * @credit Mocha https://mochajs.org/
 * @summary Browser test execution.
 */
/**
 * @credit Shoelace https://shoelace.style/
 * @summary Web-component examples and import maps.
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
import { TpJavascriptProject } from "./javascript-project.js";
export { TpJavascriptProject } from "./javascript-project.js";
/**
 * JavaScript playground component.
 *
 * Provides a file-based playground that runs JavaScript modules in an isolated preview.
 *
 * @summary Edits and runs a JavaScript project.
 * @tagname tp-javascript-playground
 *
 * @attr {string} repository = "" - Directory containing a JavaScript playground project to load at initialization.
 * @attr {string} src = "" - JSON project or javascript source file to load.
 *
 * @example
 * <tp-javascript-playground></tp-javascript-playground>
 */
export declare class TpJavascriptPlayground extends TpPlayground<TpJavascriptProject> {
    protected get supportsTestExecution(): boolean;
    private applyImportmap;
    protected createEmptyProject(): TpJavascriptProject;
    protected createNewProject(): TpJavascriptProject;
    protected createClearProject(): TpJavascriptProject;
    protected normalizeProject(project: TpJavascriptProject): TpJavascriptProject;
    protected resolveEntry(project: TpJavascriptProject): string | null;
    protected getPlaygroundKind(): string;
    protected getLanguageIconName(): string;
    protected getLanguageHelp(): string;
    protected createProjectFromExample(metadata: TpExampleProjectMetadata, files: readonly TpFile[]): TpJavascriptProject;
    protected buildExecutionDocument(project: TpJavascriptProject): Promise<TpExecutionDocument>;
    protected buildTestDocument(project: TpJavascriptProject): Promise<TpExecutionDocument>;
    protected getAdditionalToolbarMenuItems(): string;
    protected handleAdditionalToolbarAction(action: string): boolean;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-javascript-playground": TpJavascriptPlayground;
    }
}
