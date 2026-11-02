/**
 * @module components/python-playground
 * @summary Python playground component.
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
 * @credit Pyodide https://pyodide.org/
 * @summary Python execution in the browser.
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
import { TpPythonProject } from "./python-project.js";
export { TpPythonProject } from "./python-project.js";
/**
 * Python playground component.
 *
 * Provides a file-based playground that executes Python in the browser.
 *
 * @summary Edits and runs a Python project.
 * @tagname tp-python-playground
 *
 * @attr {string} repository = "" - Directory containing a Python playground project to load at initialization.
 * @attr {string} src = "" - JSON project or python source file to load.
 *
 * @example
 * <tp-python-playground></tp-python-playground>
 */
export declare class TpPythonPlayground extends TpPlayground<TpPythonProject> {
    private static nextExecutionScope;
    private readonly defaultExecutionScope;
    protected get supportsTestExecution(): boolean;
    protected createEmptyProject(): TpPythonProject;
    protected createNewProject(): TpPythonProject;
    protected createClearProject(): TpPythonProject;
    protected normalizeProject(project: TpPythonProject): TpPythonProject;
    protected resolveEntry(project: TpPythonProject): string | null;
    protected getPlaygroundKind(): string;
    protected getLanguageIconName(): string;
    protected getLanguageHelp(): string;
    protected getAdditionalToolbarMenuItems(): string;
    protected handleAdditionalToolbarAction(action: string): boolean;
    protected createProjectFromExample(metadata: TpExampleProjectMetadata, files: readonly TpFile[]): TpPythonProject;
    protected buildExecutionDocument(project: TpPythonProject): Promise<TpExecutionDocument>;
    protected buildTestDocument(project: TpPythonProject): Promise<TpExecutionDocument>;
    private applyLibs;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-python-playground": TpPythonPlayground;
    }
}
