/**
 * @module components/sql-playground
 * @summary SQL playground component.
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
 * @credit sql.js https://sql.js.org/
 * @summary SQLite execution in the browser.
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
import { TpSqlProject } from "./sql-project.js";
export { type TpSqlDatabase, type TpSqlDatabaseType, TpSqlProject, } from "./sql-project.js";
/**
 * SQL playground component.
 *
 * Provides a file-based playground that executes SQL with SQLite in the browser.
 *
 * @summary Edits and runs a SQL project.
 * @tagname tp-sql-playground
 *
 * @attr {string} repository = "" - Directory containing a SQL playground project to load at initialization.
 * @attr {string} src = "" - JSON project or sql source file to load.
 *
 * @example
 * <tp-sql-playground></tp-sql-playground>
 */
export declare class TpSqlPlayground extends TpPlayground<TpSqlProject> {
    protected createEmptyProject(): TpSqlProject;
    protected createNewProject(): TpSqlProject;
    protected createClearProject(): TpSqlProject;
    protected normalizeProject(project: TpSqlProject): TpSqlProject;
    protected resolveEntry(project: TpSqlProject): string | null;
    protected getPlaygroundKind(): string;
    protected getLanguageIconName(): string;
    protected getLanguageHelp(): string;
    protected getAdditionalToolbarMenuItems(): string;
    protected handleAdditionalToolbarAction(action: string): boolean;
    protected createProjectFromExample(metadata: TpExampleProjectMetadata, files: readonly TpFile[]): TpSqlProject;
    protected buildExecutionDocument(project: TpSqlProject): Promise<TpExecutionDocument>;
    private resetActiveDatabase;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-sql-playground": TpSqlPlayground;
    }
}
