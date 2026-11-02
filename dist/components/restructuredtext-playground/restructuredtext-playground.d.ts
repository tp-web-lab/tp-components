/**
 * @module components/restructuredtext-playground
 * @summary reStructuredText playground component.
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
import { TpRestructuredTextProject } from "./restructuredtext-project.js";
export { TpRestructuredTextProject } from "./restructuredtext-project.js";
/**
 * reStructuredText playground component.
 *
 * Provides a file-based playground that renders reStructuredText documents in the browser.
 *
 * @summary Edits and renders a reStructuredText project.
 * @tagname tp-restructuredtext-playground
 *
 * @attr {string} repository = "" - Directory containing a reStructuredText playground project to load at initialization.
 * @attr {string} src = "" - JSON project or restructuredtext source file to load.
 *
 * @example
 * <tp-restructuredtext-playground></tp-restructuredtext-playground>
 */
export declare class TpRestructuredTextPlayground extends TpPlayground<TpRestructuredTextProject> {
    protected createEmptyProject(): TpRestructuredTextProject;
    protected createNewProject(): TpRestructuredTextProject;
    protected createClearProject(): TpRestructuredTextProject;
    protected normalizeProject(project: TpRestructuredTextProject): TpRestructuredTextProject;
    protected resolveEntry(project: TpRestructuredTextProject): string | null;
    protected getPlaygroundKind(): string;
    protected getLanguageIconName(): string;
    protected getLanguageHelp(): string;
    protected createProjectFromExample(metadata: TpExampleProjectMetadata, files: readonly TpFile[]): TpRestructuredTextProject;
    protected buildExecutionDocument(project: TpRestructuredTextProject): Promise<TpExecutionDocument>;
    protected getAdditionalToolbarMenuItems(): string;
    protected handleAdditionalToolbarAction(action: string): boolean;
    private getActiveMarkupExtensionIds;
    private applyMarkupExtensions;
    private syncToolbarExtensionChecks;
    protected get exampleCategory(): string;
    protected get exampleGroup(): string;
    protected afterProjectLoaded(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-restructuredtext-playground": TpRestructuredTextPlayground;
    }
}
