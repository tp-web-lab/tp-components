/**
 * @module components/prolog-playground
 * @summary Prolog playground component.
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
 * @credit Scryer Prolog https://www.scryer.pl/
 * @summary Prolog execution in the browser.
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
import type { TpPlaygroundProjectMetadata } from "../playground/playground-project-loader.js";
import { TpPrologProject } from "./prolog-project.js";
export { TpPrologProject } from "./prolog-project.js";
/**
 * Prolog playground component.
 *
 * Provides a file-based playground that executes Prolog in the browser with Scryer Prolog.
 *
 * @summary Edits and runs a Prolog project with Scryer Prolog.
 * @tagname tp-prolog-playground
 *
 * @attr {string} repository = "" - Directory containing a Prolog playground project to load at initialization.
 * @attr {string} src = "" - JSON project or prolog source file to load.
 *
 * @example
 * <tp-prolog-playground></tp-prolog-playground>
 */
export declare class TpPrologPlayground extends TpPlayground<TpPrologProject> {
    protected get supportsTestExecution(): boolean;
    protected createEmptyProject(): TpPrologProject;
    protected createNewProject(): TpPrologProject;
    protected createClearProject(): TpPrologProject;
    protected normalizeProject(project: TpPrologProject): TpPrologProject;
    protected resolveEntry(project: TpPrologProject): string | null;
    protected getPlaygroundKind(): string;
    protected getLanguageIconName(): string;
    protected getLanguageHelp(): string;
    protected createProjectFromExample(metadata: TpExampleProjectMetadata, files: readonly TpFile[]): TpPrologProject;
    protected createProjectFromRepository(metadata: TpPlaygroundProjectMetadata, files: readonly TpFile[]): TpPrologProject;
    protected buildExecutionDocument(project: TpPrologProject): Promise<TpExecutionDocument>;
    protected buildTestDocument(project: TpPrologProject): Promise<TpExecutionDocument>;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-prolog-playground": TpPrologPlayground;
    }
}
