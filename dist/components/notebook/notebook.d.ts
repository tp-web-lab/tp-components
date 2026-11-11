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
 * @summary Dropdown menu component.
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
 * @tp-dependency tp-latex
 * @summary Renders LaTeX documents with interactive components, MathJax formulas and TikZ figures.
 */
/**
 * @tp-dependency tp-latex-viewer
 * @summary Editable LaTeX documents with rendered HTML and generated source views.
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
import "../latex-viewer/latex-viewer.js";
import "../latex/latex.js";
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
 * The custom `<tp-notebook>` element combines editable markup cells and executable programming-language cells.
 *
 * @tagname tp-notebook
 * @summary Combines editable markup cells and executable programming-language cells.
 * @attr {string} language = "javascript" - Programming language enforced by a specialized notebook.
 * @attr {string} src = "" - JSON notebook file.
 * @attr {string} label - Title displayed in the center of the exported HTML toolbar. Defaults to the notebook type name; an empty value hides it.
 * @attr {string} logo - Icon name displayed at the start of the exported HTML toolbar. Defaults to the notebook type icon; an empty value hides it.
 * @attr {string} repository = "" - Directory containing project.json and .files.json.
 * @attr {boolean} readonly = false - Makes all notebook editors read-only and disables structural changes.
 * @event tp-notebook-load Emitted after inline, src, or repository cells are loaded.
 * @eventdetail tp-notebook-load { source: "inline" | "src" | "repository" | "file"; cells: number }
 * @event tp-notebook-change Emitted after the cell collection changes.
 * @eventdetail tp-notebook-change { cells: number }
 * @example
 * <tp-notebook>
 *   <script type="tp/markdown">
 *     # Notebook example
 *     Here is a notebook that combines AsciiDoc, HTML, LaTeX, Markdown and reStructuredText as markup languages, and Python and JavaScript as programming languages.
 *
 *     ## Calculation
 *     We perform a simple multiplication in Python to demonstrate the calculation.
 *   </script>
 *   <script type="tp/python">
 *     x = 6 * 7
 *     print(x)
 *   </script>
 *   <script type="tp/restructuredtext" doctest="">
 *     .. h2::
 *
 *        Verification
 *
 *     We use the doctest blocks in reStructuredText to verify the output of the Python code.
 *
 *     >>> print(6 * 7)
 *     42
 *   </script>
 *   <script type="tp/html">
 *     In JavaScript, we would have written the following code:
 *   </script>
 *   <script type="tp/javascript">
 *     const x = 6 * 7;
 *     console.log(x)
 *   </script>
 *   <script type="tp/asciidoc">
 *     == Result
 *     The result of the multiplication is displayed using Asciidoc and Mathjax:
 *
 *     latexmath:[x = 6 * 7 = 42]
 *   </script>
 *   <script type="tp/latex">
 *     \section*{LaTeX and TP styles}
 *     The same result can be written in LaTeX: $6 \times 7 = 42$.
 *
 *     \begin{itemize}
 *       \item Ordinary lists use the shared TP styles.
 *       \item Nested lists keep their hierarchy.
 *         \begin{itemize}
 *           \item This is a nested item.
 *         \end{itemize}
 *     \end{itemize}
 *
 *     \wcTpCallout[variant=info,heading=LaTeX inside a component]{
 *       \textbf{The component controls its appearance.}
 *       \begin{itemize}
 *         \item Keep the LaTeX source readable.
 *         \item Reuse the same TP typography and list styles.
 *       \end{itemize}
 *     }
 *   </script>
 * </tp-notebook>
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
    private markupLanguage;
    private codeLanguage;
    static get observedAttributes(): string[];
    get language(): NotebookLanguage;
    /** Title displayed in the center of the exported HTML toolbar. */
    get label(): string;
    set label(value: string);
    /** Exported toolbar icon; defaults to the notebook type, with empty hiding it. */
    get logo(): string;
    set logo(value: string);
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
    private languageControls;
    private updateLanguageControls;
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
