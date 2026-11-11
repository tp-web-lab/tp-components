/**
 * @module components/asciidoc-playground
 * @summary AsciiDoc playground component.
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
 * @credit Asciidoctor.js https://asciidoctor.org/docs/asciidoctor.js/
 * @summary AsciiDoc conversion in the browser.
 */
/**
 * @credit Lit https://lit.dev/
 * @summary Web-component examples and import maps.
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
import { TpAsciidocProject } from "./asciidoc-project.js";
export { type TpAsciidocExtension, TpAsciidocProject, } from "./asciidoc-project.js";
/**
 * The custom `<tp-asciidoc-playground>` element edits and renders an AsciiDoc project.
 *
 * Provides a file-based playground that renders AsciiDoc documents in the browser.
 *
 * @summary Edits and renders an AsciiDoc project.
 * @tagname tp-asciidoc-playground
 *
 * @attr {string} repository = "" - Directory containing an AsciiDoc playground project to load at initialization.
 * @attr {string} src = "" - JSON project or asciidoc source file to load.
 *
 * @example
 * <tp-asciidoc-playground src="/docs/components/_shared/intro-projects/asciidoc.json"></tp-asciidoc-playground>
 */
export declare class TpAsciidocPlayground extends TpPlayground<TpAsciidocProject> {
    protected get exampleCategory(): string;
    protected get exampleGroup(): string;
    protected createEmptyProject(): TpAsciidocProject;
    protected createNewProject(): TpAsciidocProject;
    protected createClearProject(): TpAsciidocProject;
    protected normalizeProject(project: TpAsciidocProject): TpAsciidocProject;
    protected resolveEntry(project: TpAsciidocProject): string | null;
    protected getPlaygroundKind(): string;
    protected getLanguageIconName(): string;
    protected getLanguageHelp(): string;
    protected getAdditionalToolbarMenuItems(): string;
    protected handleAdditionalToolbarAction(action: string): boolean;
    protected createProjectFromExample(metadata: TpExampleProjectMetadata, files: readonly TpFile[]): TpAsciidocProject;
    protected buildExecutionDocument(project: TpAsciidocProject): Promise<TpExecutionDocument>;
    private applyExtensions;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-asciidoc-playground": TpAsciidocPlayground;
    }
}
