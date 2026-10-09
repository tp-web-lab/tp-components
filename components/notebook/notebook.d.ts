/**
 * @module components/notebook
 * @summary Interactive notebook combining markup and executable code cells.
 * @tp-dependency tp-icon-button
 * @summary Icon-only button component backed by tp-icon.
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 * @tp-dependency tp-dropdown
 * @summary Displays an anchored dropdown menu.
 * @tp-dependency tp-divider
 * @summary Draws a horizontal or vertical separator.
 * @tp-dependency tp-html-viewer
 * @summary Displays editable HTML code and its rendered result.
 * @tp-dependency tp-asciidoc-viewer
 * @summary Displays editable AsciiDoc code and its rendered result.
 * @tp-dependency tp-markdown-viewer
 * @summary Displays editable Markdown code and its rendered result.
 * @tp-dependency tp-restructuredtext-viewer
 * @summary Displays editable reStructuredText code and its rendered result.
 * @tp-dependency tp-javascript-viewer
 * @summary Displays and runs one JavaScript example in a compact interface.
 * @tp-dependency tp-typescript-viewer
 * @summary Displays and runs one TypeScript example in a compact interface.
 * @tp-dependency tp-python-viewer
 * @summary Displays and runs one Python example in a compact interface.
 * @tp-dependency tp-prolog-viewer
 * @summary Displays and runs one Prolog example in a compact interface.
 * @tp-dependency tp-sql-viewer
 * @summary Displays and runs one SQL example in a compact interface.
 */
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
 * @tp-dependency tp-divider
 * @summary Visual separator for menus, dropdowns, toolbars, and layouts.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Displays an anchored dropdown menu.
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
 * @tp-dependency tp-javascript-viewer
 * @summary Compact JavaScript code viewer and runner.
 */
/**
 * @tp-dependency tp-markdown-viewer
 * @summary Interactive Markdown viewer with editable source and parser outputs.
 */
/**
 * @tp-dependency tp-prolog-viewer
 * @summary Compact Prolog code viewer and runner.
 */
/**
 * @tp-dependency tp-python-viewer
 * @summary Compact Python code viewer and runner.
 */
/**
 * @tp-dependency tp-restructuredtext-viewer
 * @summary Interactive reStructuredText viewer with editable source and parser outputs.
 */
/**
 * @tp-dependency tp-sql-viewer
 * @summary Compact SQL code viewer and runner.
 */
/**
 * @tp-dependency tp-typescript-viewer
 * @summary Compact TypeScript code viewer and runner.
 */
import "../base/base.js";
import "../icon-button/icon-button.js";
import "../button/button.js";
import "../icon/icon.js";
import "../dropdown/dropdown.js";
import "../divider/divider.js";
import "../html-viewer/html-viewer.js";
import "../asciidoc-viewer/asciidoc-viewer.js";
import "../markdown-viewer/markdown-viewer.js";
import "../restructuredtext-viewer/restructuredtext-viewer.js";
import "../javascript-viewer/javascript-viewer.js";
import "../typescript-viewer/typescript-viewer.js";
import "../python-viewer/python-viewer.js";
import "../prolog-viewer/prolog-viewer.js";
import "../sql-viewer/sql-viewer.js";
import { TpBase } from "../base/base.js";
type NotebookLanguage = "javascript" | "typescript" | "python" | "prolog" | "sql";
/** Resolves the loader used by a standalone notebook preview. */
export declare function getNotebookLoaderUrl(moduleHref?: string): string;
/**
 * @tagname tp-notebook
 * @summary Combines editable markup cells and executable programming-language cells.
 * @attr {string} language = "javascript" - Programming language enforced by a specialized notebook.
 * @attr {string} src = "" - JSON notebook file.
 * @attr {string} repository = "" - Directory containing project.json and .files.json.
 * @attr {boolean} readonly = false - Makes all notebook editors read-only and disables structural changes.
 * @event tp-notebook-load Emitted after inline, src, or repository cells are loaded.
 * @eventdetail tp-notebook-load { source: "inline" | "src" | "repository" | "file"; cells: number }
 * @event tp-notebook-change Emitted after the cell collection changes.
 * @eventdetail tp-notebook-change { cells: number }
 * @example
 * <tp-notebook></tp-notebook>
 */
export declare class TpNotebook extends TpBase {
    private static readonly styleId;
    private static nextId;
    private cells;
    private initialCells;
    private cellsEl;
    private selectedIndex;
    private readonly instanceId;
    private executionScopeVersion;
    private notebookName;
    private fileHandle;
    private viewerObservers;
    private previewing;
    static get observedAttributes(): string[];
    get language(): NotebookLanguage;
    get readonly(): boolean;
    set readonly(value: boolean);
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected attributeChangedCallback(name: string, oldValue: string | null, value: string | null): void;
    private load;
    private fetchJson;
    private loadRepository;
    private readInlineCells;
    private renderShell;
    private filesMenu;
    private chooseNotebookFile;
    private loadNotebookFile;
    private importHtmlFile;
    private notebookBlob;
    private saveNotebook;
    private standaloneHtml;
    private createRenderedCell;
    private htmlBlob;
    private togglePreview;
    private updatePreviewButton;
    private exportHtml;
    private configureDropdownTrigger;
    private menuTrigger;
    private languageMenu;
    private restrictedLanguageButton;
    private button;
    private renderCells;
    private renderCell;
    private createViewer;
    private observeViewer;
    private handleAction;
    private addCell;
    private get executionScope();
    private selectCell;
    private syncSelection;
    private syncEditorToolbarButton;
    private syncReadonly;
    private captureAllCells;
    private captureCell;
    private emitChange;
}
declare global {
    interface HTMLElementTagNameMap {
        "tp-notebook": TpNotebook;
    }
}
export {};
