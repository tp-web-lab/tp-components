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
// tp-docgen:dependencies:start
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
// tp-docgen:dependencies:end

import style from "./notebook.css?inline";

import "../base/base.js";
import "../icon-button/icon-button.js";
import "../button/button.js";
import "../icon/icon.js";
import "../dropdown/dropdown.js";
import "../divider/divider.js";
import { setupTpDropdownTriggers } from "../dropdown/dropdown-triggers.js";
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
import { dedent } from "../../utilities/code.js";
import {
	getComponentSourceBaseUrl,
	resolveComponentSourceUrl,
} from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";

type NotebookLanguage =
	| "javascript"
	| "typescript"
	| "python"
	| "prolog"
	| "sql";
type MarkupLanguage =
	| "html"
	| "asciidoc"
	| "latex"
	| "markdown"
	| "restructuredtext";
interface NotebookFile {
	filename?: string;
	content: string;
}
interface NotebookCell {
	type: "markup" | "code";
	language: MarkupLanguage | NotebookLanguage;
	content?: string;
	files?: NotebookFile[];
	showEditor?: boolean;
	doctest?: boolean;
}
interface NotebookData {
	name?: string;
	cells: NotebookCell[];
}
interface NotebookWritableFileHandle {
	createWritable(): Promise<{
		write(data: Blob): Promise<void>;
		close(): Promise<void>;
	}>;
}

const MARKUP_LANGUAGES: MarkupLanguage[] = [
	"asciidoc",
	"html",
	"latex",
	"markdown",
	"restructuredtext",
];
const CODE_LANGUAGES: NotebookLanguage[] = [
	"javascript",
	"prolog",
	"python",
	"sql",
	"typescript",
];
const LANGUAGE_ICONS: Record<MarkupLanguage | NotebookLanguage, string> = {
	html: "file_type_html",
	asciidoc: "file_type_asciidoc",
	latex: "file_type_latex",
	markdown: "file_type_markdown",
	restructuredtext: "file_type_restructuredtext",
	javascript: "file_type_javascript",
	typescript: "file_type_typescript",
	python: "file_type_python",
	prolog: "file_type_prolog",
	sql: "file_type_sql",
};
const LANGUAGE_LABELS: Record<NotebookLanguage, string> = {
	javascript: "JavaScript",
	prolog: "Prolog",
	python: "Python",
	sql: "SQL",
	typescript: "TypeScript",
};

/** Resolves the loader used by a standalone notebook preview. */
export function getNotebookLoaderUrl(
	moduleHref: string = import.meta.url,
): string {
	const moduleUrl = new URL(moduleHref);
	if (moduleUrl.pathname.includes("/src/components/notebook/")) {
		return new URL("../../tp-loader.ts", moduleUrl).href;
	}
	if (
		moduleUrl.pathname.includes("/chunks/") &&
		!moduleUrl.pathname.includes("/src/chunks/")
	) {
		return new URL("../tp-loader.js", moduleUrl).href;
	}
	if (
		moduleUrl.pathname.includes("/components/notebook/") &&
		!moduleUrl.pathname.includes("/src/components/notebook/")
	) {
		return new URL("../../tp-loader.js", moduleUrl).href;
	}
	return new URL("/tp-loader.js", moduleUrl).href;
}

/**
 * The custom `<tp-notebook>` element combines editable markup cells and executable programming-language cells.
 *
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
export class TpNotebook extends TpBase {
	private static readonly styleId = "tp-notebook-styles";
	private static nextId = 0;
	private cells: NotebookCell[] = [];
	private initialCells: NotebookCell[] = [];
	private cellsEl: HTMLElement | null = null;
	private selectedIndex = -1;
	private readonly instanceId = `tp-notebook-${++TpNotebook.nextId}`;
	private executionScopeVersion = 0;
	private notebookName = "notebook";
	private fileHandle: NotebookWritableFileHandle | null = null;
	private viewerObservers: MutationObserver[] = [];
	private previewing = false;
	private markupLanguage: MarkupLanguage = "markdown";
	private codeLanguage: NotebookLanguage = "javascript";

	public static override get observedAttributes(): string[] {
		return [
			...TpBase.observedAttributes,
			"language",
			"src",
			"repository",
			"readonly",
		];
	}

	public get language(): NotebookLanguage {
		const value = this.getAttribute("language");
		return CODE_LANGUAGES.includes(value as NotebookLanguage)
			? (value as NotebookLanguage)
			: "javascript";
	}

	public get readonly(): boolean {
		return this.hasAttribute("readonly");
	}

	public set readonly(value: boolean) {
		this.toggleAttribute("readonly", value);
	}

	public connectedCallback(): void {
		this.ensureGlobalStyle(TpNotebook.styleId, style);
		this.renderShell();
		void this.load();
	}

	public disconnectedCallback(): void {
		this.viewerObservers.forEach((observer) => {
			observer.disconnect();
		});
		this.viewerObservers = [];
	}

	protected attributeChangedCallback(
		name: string,
		oldValue: string | null,
		value: string | null,
	): void {
		if (
			oldValue !== value &&
			this.isConnected &&
			["src", "repository"].includes(name)
		)
			void this.load();
		if (oldValue !== value && this.isConnected && name === "readonly")
			this.syncSelection();
	}

	private async load(): Promise<void> {
		let source: "inline" | "src" | "repository" = "inline";
		let data: NotebookData;
		const src = this.getAttribute("src")?.trim() ?? "";
		const repository = this.getAttribute("repository")?.trim() ?? "";

		if (src !== "") {
			source = "src";
			data = await this.fetchJson(resolveComponentSourceUrl(this, src).href);
		} else if (repository !== "") {
			source = "repository";
			data = await this.loadRepository(
				resolveComponentSourceUrl(this, repository).href,
			);
		} else {
			data = { cells: this.readInlineCells() };
		}

		this.cells = structuredClone(data.cells);
		this.initialCells = structuredClone(data.cells);
		this.notebookName = data.name?.trim() || "notebook";
		this.selectedIndex = this.cells.length > 0 ? 0 : -1;
		this.renderCells();
		this.dispatchEvent(
			new CustomEvent("tp-notebook-load", {
				bubbles: true,
				detail: { source, cells: this.cells.length },
			}),
		);
	}

	private async fetchJson(url: string): Promise<NotebookData> {
		const response = await fetch(url, { cache: "no-store" });
		if (!response.ok) throw new Error(`Unable to load notebook: ${url}`);
		return response.json() as Promise<NotebookData>;
	}

	private async loadRepository(base: string): Promise<NotebookData> {
		const root = base.replace(/\/$/, "");
		const project = await this.fetchJson(`${root}/project.json`);
		const manifestResponse = await fetch(`${root}/.files.json`, {
			cache: "no-store",
		});
		const manifest = (await manifestResponse.json()) as { files?: string[] };
		const contents = new Map<string, string>();
		await Promise.all(
			(manifest.files ?? []).map(async (path) => {
				const response = await fetch(`${root}/${path.replace(/^\//, "")}`, {
					cache: "no-store",
				});
				contents.set(path, await response.text());
				contents.set(`/${path.replace(/^\//, "")}`, contents.get(path) ?? "");
			}),
		);
		return {
			...project,
			cells: project.cells.map((cell) => ({
				...cell,
				content:
					typeof cell.content === "string" && contents.has(cell.content)
						? contents.get(cell.content)
						: cell.content,
				files: cell.files?.map((file) => ({
					...file,
					content: contents.get(file.content) ?? file.content,
				})),
			})),
		};
	}

	private readInlineCells(): NotebookCell[] {
		const scripts = Array.from(
			this.querySelectorAll<HTMLScriptElement>(':scope > script[type^="tp/"]'),
		);
		const cells: NotebookCell[] = [];
		let codeCell: NotebookCell | null = null;
		for (const script of scripts) {
			const language = script.type.replace("tp/", "");
			const content = dedent(script.textContent ?? "");
			if (MARKUP_LANGUAGES.includes(language as MarkupLanguage)) {
				codeCell = null;
				cells.push({
					type: "markup",
					language: language as MarkupLanguage,
					content,
					doctest:
						language === "restructuredtext" && script.hasAttribute("doctest"),
				});
			} else if (
				CODE_LANGUAGES.includes(language as NotebookLanguage) &&
				(this.localName === "tp-notebook" || language === this.language)
			) {
				if (codeCell === null || codeCell.language !== language) {
					codeCell = {
						type: "code",
						language: language as NotebookLanguage,
						files: [],
					};
					cells.push(codeCell);
				}
				codeCell.files?.push({
					filename: script.getAttribute("filename") ?? undefined,
					content,
				});
			}
		}
		return cells;
	}

	private renderShell(): void {
		this.querySelector(":scope > [data-tp-notebook-root]")?.remove();
		this.previewing = false;
		const root = document.createElement("section");
		root.setAttribute("data-tp-notebook-root", "");
		const toolbar = document.createElement("div");
		toolbar.setAttribute("data-tp-notebook-toolbar", "");
		const title = document.createElement("span");
		title.setAttribute("data-tp-notebook-title", "");
		if (this.localName === "tp-notebook") {
			title.textContent = "Notebook";
		} else {
			const componentIcon = document.createElement("tp-icon");
			componentIcon.setAttribute("library", "components");
			componentIcon.setAttribute("name", this.localName.replace(/^tp-/, ""));
			componentIcon.setAttribute("size", "1.75em");
			componentIcon.setAttribute("aria-hidden", "true");
			title.append(componentIcon);
		}
		const filesButton = this.button("files-menu", "file-settings", "Files");
		filesButton.id = `${this.instanceId}-files`;
		const filesMenu = this.filesMenu(filesButton.id);
		filesMenu.id = `${this.instanceId}-files-menu`;
		this.configureDropdownTrigger(filesButton, filesMenu.id);
		const spacer = document.createElement("span");
		spacer.setAttribute("data-tp-notebook-toolbar-spacer", "");
		const markupControls = this.languageControls(false);
		const languageControls =
			this.localName === "tp-notebook"
				? this.languageControls(true)
				: [this.restrictedLanguageButton()];
		toolbar.append(
			title,
			this.menuTrigger("Files", filesButton),
			filesMenu,
			spacer,
			...markupControls,
			...languageControls,
			this.button("up", "arrow-up", "Move selected block up"),
			this.button("down", "arrow-down", "Move selected block down"),
			this.button("duplicate", "content-copy", "Duplicate selected block"),
			this.button("delete", "delete-outline", "Delete selected block"),
			this.button("editor-toolbar", "keyboard-f1", "Toggle editor toolbar"),
			this.button("reset", "refresh", "Reset notebook"),
			this.button("preview", "eye-outline", "Preview notebook"),
			this.button("run-all", "play-all", "Run all cells"),
		);
		const cells = document.createElement("div");
		cells.setAttribute("data-tp-notebook-cells", "");
		root.append(toolbar, cells);
		this.append(root);
		setupTpDropdownTriggers(root);
		this.cellsEl = cells;
		toolbar.addEventListener("click", (event) => this.handleAction(event));
	}

	private filesMenu(anchorId: string): HTMLElement {
		const dropdown = document.createElement("tp-dropdown") as HTMLElement & {
			hide?: () => void;
		};
		dropdown.setAttribute("anchor", `#${anchorId}`);
		dropdown.setAttribute("placement", "bottom");
		dropdown.setAttribute("offset", "4px");
		dropdown.setAttribute("outside-click", "");
		dropdown.setAttribute("data-tp-notebook-files-menu", "");
		const list = document.createElement("ul");
		const appendItems = (
			items: ReadonlyArray<readonly [string, string]>,
		): void => {
			for (const [action, label] of items) {
				const item = document.createElement("li");
				item.dataset.fileAction = action;
				item.textContent = label;
				list.append(item);
			}
		};
		appendItems([
			["load", "Load"],
			["save", "Save"],
			["save-as", "Save as…"],
		]);
		list.append(document.createElement("tp-divider"));
		appendItems([
			["import-html", "Import HTML"],
			["export-html", "Export HTML"],
		]);
		dropdown.append(list);
		dropdown.addEventListener("click", (event) => {
			const action = (event.target as Element | null)?.closest<HTMLElement>(
				"[data-file-action]",
			)?.dataset.fileAction;
			if (action === "load") this.chooseNotebookFile("json");
			else if (action === "import-html") this.chooseNotebookFile("html");
			else if (action === "save") void this.saveNotebook(false);
			else if (action === "save-as") void this.saveNotebook(true);
			else if (action === "export-html") void this.exportHtml();
			if (action !== undefined) dropdown.hide?.();
		});
		return dropdown;
	}

	private chooseNotebookFile(format: "json" | "html"): void {
		const input = document.createElement("input");
		input.type = "file";
		input.accept =
			format === "json" ? ".json,application/json" : ".html,.htm,text/html";
		input.hidden = true;
		input.addEventListener(
			"change",
			() => {
				const file = input.files?.[0];
				if (file !== undefined) {
					if (format === "json") void this.loadNotebookFile(file);
					else void this.importHtmlFile(file);
				}
				input.remove();
			},
			{ once: true },
		);
		this.append(input);
		input.click();
	}

	private async loadNotebookFile(file: File): Promise<void> {
		const data = JSON.parse(await file.text()) as NotebookData;
		if (!Array.isArray(data.cells))
			throw new TypeError("The notebook file must contain a cells array.");
		this.cells = structuredClone(data.cells);
		this.initialCells = structuredClone(data.cells);
		this.notebookName =
			data.name?.trim() || file.name.replace(/\.json$/i, "") || "notebook";
		this.fileHandle = null;
		this.selectedIndex = this.cells.length > 0 ? 0 : -1;
		this.renderCells();
		this.dispatchEvent(
			new CustomEvent("tp-notebook-load", {
				bubbles: true,
				detail: { source: "file", cells: this.cells.length },
			}),
		);
	}

	private async importHtmlFile(file: File): Promise<void> {
		const source = await file.text();
		const documentNode = new DOMParser().parseFromString(source, "text/html");
		const dataElement = documentNode.querySelector<HTMLScriptElement>(
			'script#tp-notebook-data[type="application/json"]',
		);
		const data =
			dataElement === null
				? {
						name: file.name.replace(/\.html?$/i, "") || "notebook",
						cells: [
							{
								type: "markup" as const,
								language: "html" as const,
								content: documentNode.body.innerHTML,
							},
						],
					}
				: (JSON.parse(dataElement.textContent ?? "") as NotebookData);
		if (!Array.isArray(data.cells))
			throw new TypeError(
				"The exported notebook data must contain a cells array.",
			);
		this.cells = structuredClone(data.cells);
		this.initialCells = structuredClone(data.cells);
		this.notebookName =
			data.name?.trim() || file.name.replace(/\.html?$/i, "") || "notebook";
		this.fileHandle = null;
		this.selectedIndex = this.cells.length > 0 ? 0 : -1;
		this.renderCells();
		this.dispatchEvent(
			new CustomEvent("tp-notebook-load", {
				bubbles: true,
				detail: { source: "file", cells: this.cells.length },
			}),
		);
	}

	private notebookBlob(): Blob {
		this.captureAllCells();
		const cells = this.cells.map(
			({ showEditor: _showEditor, ...cell }) => cell,
		);
		const data: NotebookData = { name: this.notebookName, cells };
		return new Blob([`${JSON.stringify(data, null, 2)}\n`], {
			type: "application/json",
		});
	}

	private async saveNotebook(saveAs: boolean): Promise<void> {
		const picker = (
			window as Window & {
				showSaveFilePicker?: (
					options: object,
				) => Promise<NotebookWritableFileHandle>;
			}
		).showSaveFilePicker;
		if ((saveAs || this.fileHandle === null) && picker !== undefined) {
			this.fileHandle = await picker({
				suggestedName: `${this.notebookName}.json`,
				types: [
					{
						description: "Notebook JSON",
						accept: { "application/json": [".json"] },
					},
				],
			});
		}
		const blob = this.notebookBlob();
		if (this.fileHandle !== null) {
			const writable = await this.fileHandle.createWritable();
			await writable.write(blob);
			await writable.close();
			return;
		}
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${this.notebookName}.json`;
		link.click();
		URL.revokeObjectURL(url);
	}

	private async standaloneHtml(): Promise<string> {
		// Snapshot global appearance before asynchronous markup rendering.
		const globalScope =
			this.closest(".tp-light, .tp-dark") ??
			document.body.closest(".tp-light, .tp-dark");
		const theme = globalScope?.classList.contains("tp-dark")
			? "tp-dark"
			: "tp-light";
		const appearance = document.createElement("body");
		appearance.className = theme;
		const brand =
			getComputedStyle(this).getPropertyValue("--tp-brand-seed").trim() ||
			getComputedStyle(globalScope ?? document.body)
				.getPropertyValue("--tp-brand-seed")
				.trim() ||
			getComputedStyle(document.body)
				.getPropertyValue("--tp-brand-seed")
				.trim() ||
			getComputedStyle(document.documentElement)
				.getPropertyValue("--tp-brand-seed")
				.trim();
		if (brand) appearance.style.setProperty("--tp-brand-seed", brand);
		// Serialize the attribute through the DOM, including any necessary escaping.
		const bodyOpening = appearance.outerHTML.replace("</body>", "");
		this.captureAllCells();
		const { notebookExportStyle, renderNotebookMarkup } = await import(
			"./notebook-export.js"
		);
		const rendered = await Promise.all(
			this.cells.map(async (cell, index) => {
				if (cell.type === "markup")
					return (await renderNotebookMarkup(cell.language, cell.content ?? ""))
						.outerHTML;
				const viewer = this.createRenderedCell(cell, index);
				viewer.setAttribute("data-tp-notebook-code-viewer", "");
				// JSON preserves literal closing script tags in code without breaking HTML parsing.
				for (const script of viewer.querySelectorAll("script")) {
					const type = script.type;
					script.type = "application/json";
					script.setAttribute("data-tp-export-type", type);
					script.textContent = JSON.stringify(script.textContent).replaceAll(
						"<",
						"\\u003c",
					);
				}
				const fallback = document.createElement("details");
				fallback.setAttribute("data-tp-notebook-code-fallback", "");
				const summary = document.createElement("summary");
				summary.textContent = `${LANGUAGE_LABELS[cell.language as NotebookLanguage]} source`;
				fallback.append(summary);
				for (const file of cell.files ?? []) {
					const pre = document.createElement("pre");
					const code = document.createElement("code");
					code.textContent = file.content;
					pre.append(code);
					fallback.append(pre);
				}
				return viewer.outerHTML + fallback.outerHTML;
			}),
		);
		const body = rendered.join("\n");
		const base = document.createElement("base");
		base.href = getComponentSourceBaseUrl(this);

		const loader =
			document.querySelector<HTMLScriptElement>('script[src*="tp-loader"]')
				?.src ?? getNotebookLoaderUrl();
		const title = this.notebookName
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;");
		const exportCells = this.cells.map(
			({ showEditor: _showEditor, ...cell }) => cell,
		);
		const notebookData = JSON.stringify({
			name: this.notebookName,
			cells: exportCells,
		}).replaceAll("<", "\\u003c");
		return `<!doctype html>
<html lang="en" class="${theme}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  ${base.outerHTML}
  <style>${notebookExportStyle}</style>
  <script type="module" src="${loader}"></script>
  <script id="tp-notebook-data" type="application/json">${notebookData}</script>
  <style>body{background:var(--tp-background-color);color:var(--tp-text-body);box-sizing:border-box;margin-inline:auto;max-inline-size:80rem;padding:1rem}main{display:grid;gap:.75rem;min-inline-size:0}[data-tp-notebook-export-actions]{display:flex;justify-content:flex-end;gap:.5rem;margin-block-end:1rem}[data-tp-notebook-code-viewer]:defined + [data-tp-notebook-code-fallback]{display:none}</style>
</head>
${bodyOpening}
  <nav data-tp-notebook-export-actions aria-label="Notebook actions">
    <tp-icon-button data-tp-notebook-export-reset name="refresh" label="Reset all" disabled title="Restore all code cells to their exported sources"></tp-icon-button>
    <tp-icon-button data-tp-notebook-export-run name="play-all" label="Run all" disabled title="Run all code cells in document order"></tp-icon-button>
  </nav>
  <main>${body}</main>
  <script>
    for (const source of document.querySelectorAll('script[data-tp-export-type]')) {
      source.textContent = JSON.parse(source.textContent);
      source.type = source.getAttribute('data-tp-export-type');
      source.removeAttribute('data-tp-export-type');
    }
    const viewers = Array.from(document.querySelectorAll('main > [data-tp-notebook-code-viewer]'));
    const resetAll = document.querySelector('[data-tp-notebook-export-reset]');
    const runAll = document.querySelector('[data-tp-notebook-export-run]');
    let busy = false;
    const updateActions = () => {
      const ready = viewers.length > 0 && viewers.every(viewer =>
        viewer.querySelector('[data-tp-programming-viewer-code]') &&
        viewer.querySelector('[data-tp-programming-viewer-output]') &&
        typeof viewer.run === 'function' && typeof viewer.reset === 'function');
      resetAll.toggleAttribute('disabled', busy || !ready);
      runAll.toggleAttribute('disabled', busy || !ready);
    };
    const applyToAll = async (action) => {
      if (busy || runAll.hasAttribute('disabled')) return;
      busy = true;
      updateActions();
      try {
        for (const viewer of viewers) await viewer[action]();
      } finally {
        busy = false;
        updateActions();
      }
    };
    resetAll.addEventListener('click', () => { void applyToAll('reset'); });
    runAll.addEventListener('click', () => { void applyToAll('run'); });
    for (const viewer of viewers) {
      const openPanels = () => {
        const code = viewer.querySelector('[data-tp-programming-viewer-code]');
        const output = viewer.querySelector('[data-tp-programming-viewer-output]');
        if (!code || !output) return;
        observer.disconnect();
        updateActions();
        if (code.getAttribute('aria-pressed') === 'false') code.click();
        if (output.getAttribute('aria-pressed') === 'false') output.click();
      };
      const observer = new MutationObserver(openPanels);
      observer.observe(viewer, { childList: true, subtree: true });
      openPanels();
    }
  </script>
</body>
</html>`;
	}

	private createRenderedCell(cell: NotebookCell, index: number): HTMLElement {
		if (cell.type === "code") {
			const viewer = document.createElement(`tp-${cell.language}-viewer`);
			viewer.setAttribute("execution-scope", this.executionScope);
			viewer.setAttribute("execution-index", String(index));
			for (const file of cell.files ?? [{ content: "" }]) {
				const script = document.createElement("script");
				script.type = `tp/${cell.language}`;
				if (file.filename) script.setAttribute("filename", file.filename);
				script.textContent = file.content;
				viewer.append(script);
			}
			return viewer;
		}

		if (cell.language === "html") {
			const output = document.createElement("div");
			output.innerHTML = cell.content ?? "";
			return output;
		}

		const renderer = document.createElement(`tp-${cell.language}`);
		if (cell.language === "restructuredtext") {
			renderer.toggleAttribute("doctest", cell.doctest === true);
		}
		const script = document.createElement("script");
		script.type = `tp/${cell.language}`;
		script.textContent = cell.content ?? "";
		renderer.append(script);
		return renderer;
	}

	private async htmlBlob(): Promise<Blob> {
		return new Blob([await this.standaloneHtml()], { type: "text/html" });
	}

	private togglePreview(): void {
		if (this.cellsEl === null) return;
		if (this.previewing) {
			this.previewing = false;
			this.querySelector("[data-tp-notebook-root]")?.removeAttribute(
				"data-tp-notebook-preview",
			);
			this.updatePreviewButton();
			this.renderCells();
			return;
		}

		this.captureAllCells();
		this.previewing = true;
		this.viewerObservers.forEach((observer) => {
			observer.disconnect();
		});
		this.viewerObservers = [];
		const preview = document.createElement("section");
		preview.setAttribute("data-tp-notebook-preview-content", "");
		this.cells.forEach((cell, index) => {
			preview.append(this.createRenderedCell(cell, index));
		});
		this.cellsEl.replaceChildren(preview);
		this.querySelector("[data-tp-notebook-root]")?.setAttribute(
			"data-tp-notebook-preview",
			"",
		);
		this.updatePreviewButton();
		this.syncSelection();
	}

	private updatePreviewButton(): void {
		const button = this.querySelector<HTMLElement>('[data-action="preview"]');
		if (button === null) return;
		const label = this.previewing ? "Edit notebook" : "Preview notebook";
		button.setAttribute("name", this.previewing ? "pencil" : "eye-outline");
		button.setAttribute("label", label);
		button.setAttribute("title", label);
		button.setAttribute("aria-pressed", String(this.previewing));
	}

	private async exportHtml(): Promise<void> {
		const picker = (
			window as Window & {
				showSaveFilePicker?: (
					options: object,
				) => Promise<NotebookWritableFileHandle>;
			}
		).showSaveFilePicker;
		if (picker !== undefined) {
			let handle: NotebookWritableFileHandle;
			try {
				// Open before rendering asynchronously to retain the click's user activation.
				handle = await picker({
					suggestedName: `${this.notebookName}.html`,
					types: [
						{
							description: "Notebook HTML",
							accept: { "text/html": [".html"] },
						},
					],
				});
			} catch (error) {
				if (error instanceof DOMException && error.name === "AbortError")
					return;
				throw error;
			}
			const blob = await this.htmlBlob();
			const writable = await handle.createWritable();
			await writable.write(blob);
			await writable.close();
			return;
		}
		const url = URL.createObjectURL(await this.htmlBlob());
		const link = document.createElement("a");
		link.href = url;
		link.download = `${this.notebookName}.html`;
		link.click();
		URL.revokeObjectURL(url);
	}

	private configureDropdownTrigger(
		button: HTMLElement,
		dropdownId: string,
	): void {
		button.removeAttribute("data-action");
		button.setAttribute("data-tp-dropdown-action", "toggle");
		button.setAttribute("data-tp-dropdown-target", `#${dropdownId}`);
		button.setAttribute("data-tp-dropdown-exclusive", "");
		button.setAttribute("aria-haspopup", "menu");
	}

	private menuTrigger(label: string, button: HTMLElement): HTMLElement {
		const trigger = document.createElement("span");
		trigger.setAttribute("data-tp-notebook-menu-trigger", "");
		const text = document.createElement("span");
		text.textContent = label;
		trigger.append(text, button);
		return trigger;
	}

	private languageControls(programming: boolean): HTMLElement[] {
		const type = programming ? "code" : "markup";
		const name = programming ? "language" : "markup";
		const group = document.createElement("span");
		group.setAttribute("data-tp-notebook-menu-trigger", "");
		const chooser = document.createElement("tp-button");
		chooser.id = `${this.instanceId}-${name}`;
		chooser.setAttribute("data-tp-notebook-language-choice", type);
		chooser.setAttribute("size", "s");
		chooser.setAttribute("outlined", "");
		const label = document.createElement("span");
		label.setAttribute("data-language-label", "");
		const arrow = document.createElement("tp-icon");
		arrow.setAttribute("name", "chevron-down");
		arrow.setAttribute("aria-hidden", "true");
		chooser.append(label, arrow);
		const add = this.button(`add-${name}`, "plus", "Add cell");
		group.append(chooser, add);
		const menu = this.languageMenu(chooser.id, programming);
		menu.id = `${this.instanceId}-${name}-menu`;
		this.configureDropdownTrigger(chooser, menu.id);
		this.updateLanguageControls(group, menu, programming);
		return [group, menu];
	}

	private updateLanguageControls(
		group: Element,
		menu: Element,
		programming: boolean,
	): void {
		const language = programming ? this.codeLanguage : this.markupLanguage;
		const label = group.querySelector("[data-language-label]");
		if (label) label.textContent = language;
		group
			.querySelector("[data-tp-notebook-language-choice]")
			?.setAttribute(
				"title",
				`Choose ${programming ? "programming" : "markup"} language`,
			);
		const add = group.querySelector("[data-action]");
		add?.setAttribute("label", `Add ${language} block`);
		add?.setAttribute("title", `Add ${language} block`);
		menu.querySelectorAll<HTMLElement>("[data-language]").forEach((item) => {
			const selected = item.dataset.language === language;
			item.setAttribute("aria-current", String(selected));
			const check = item.querySelector<HTMLElement>("[data-language-check]");
			if (check) check.style.visibility = selected ? "visible" : "hidden";
		});
	}

	private languageMenu(anchorId: string, programming = false): HTMLElement {
		const dropdown = document.createElement("tp-dropdown") as HTMLElement & {
			hide?: () => void;
		};
		dropdown.setAttribute("anchor", `#${anchorId}`);
		dropdown.setAttribute("placement", "bottom");
		dropdown.setAttribute("offset", "4px");
		dropdown.setAttribute("outside-click", "");
		dropdown.setAttribute(
			"data-tp-notebook-language-menu",
			programming ? "code" : "markup",
		);
		const list = document.createElement("ul");
		const languages = programming ? CODE_LANGUAGES : MARKUP_LANGUAGES;
		for (const language of languages) {
			const item = document.createElement("li");
			item.dataset.language = language;
			item.dataset.cellType = programming ? "code" : "markup";
			const icon = document.createElement("tp-icon");
			icon.setAttribute("library", "languages");
			icon.setAttribute("name", LANGUAGE_ICONS[language]);
			icon.setAttribute("size", "1.25em");
			icon.setAttribute("aria-hidden", "true");
			const label = document.createElement("span");
			label.textContent = language;
			const check = document.createElement("tp-icon");
			check.setAttribute("name", "check");
			check.setAttribute("data-language-check", "");
			check.setAttribute("aria-hidden", "true");
			item.append(check, icon, label);
			list.append(item);
		}
		dropdown.append(list);
		dropdown.addEventListener("click", (event) => {
			const item = (event.target as Element | null)?.closest<HTMLElement>(
				"[data-language]",
			);
			if (item === null || item === undefined) return;
			const language = item.dataset.language;
			if (language === undefined) return;
			if (this.readonly || this.previewing) return;
			if (programming) this.codeLanguage = language as NotebookLanguage;
			else this.markupLanguage = language as MarkupLanguage;
			const group = this.querySelector(
				`[data-tp-notebook-language-choice="${programming ? "code" : "markup"}"]`,
			)?.parentElement;
			if (group) this.updateLanguageControls(group, dropdown, programming);
			dropdown.hide?.();
		});
		return dropdown;
	}

	private restrictedLanguageButton(): HTMLElement {
		const button = document.createElement("tp-button");
		button.setAttribute("data-action", "add-language");
		button.setAttribute("size", "m");
		button.setAttribute("outlined", "");
		button.setAttribute("title", `Add ${LANGUAGE_LABELS[this.language]} block`);
		const languageIcon = document.createElement("tp-icon");
		languageIcon.setAttribute("library", "languages");
		languageIcon.setAttribute("name", LANGUAGE_ICONS[this.language]);
		languageIcon.setAttribute("size", "1.25em");
		languageIcon.setAttribute("aria-hidden", "true");
		const label = document.createElement("span");
		label.textContent = LANGUAGE_LABELS[this.language];
		const plus = document.createElement("tp-icon");
		plus.setAttribute("name", "plus");
		plus.setAttribute("size", "1.25rem");
		plus.setAttribute("aria-hidden", "true");
		button.append(languageIcon, label, plus);
		return button;
	}

	private button(action: string, name: string, label: string): HTMLElement {
		const button = document.createElement("tp-icon-button");
		button.setAttribute("data-action", action);
		button.setAttribute("name", name);
		button.setAttribute("label", label);
		button.setAttribute("title", label);
		button.setAttribute("size", "s");
		return button;
	}

	private renderCells(): void {
		if (this.cellsEl === null) return;
		this.viewerObservers.forEach((observer) => {
			observer.disconnect();
		});
		this.viewerObservers = [];
		this.cellsEl.replaceChildren();
		if (this.cells.length === 0) {
			const empty = document.createElement("p");
			empty.setAttribute("data-tp-notebook-empty", "");
			empty.textContent = "This notebook has no cells.";
			this.cellsEl.append(empty);
			this.syncSelection();
			return;
		}
		this.cells.forEach((cell, index) => {
			this.cellsEl?.append(this.renderCell(cell, index));
		});
		this.syncSelection();
	}

	private renderCell(cell: NotebookCell, index: number): HTMLElement {
		const article = document.createElement("article");
		article.setAttribute("data-tp-notebook-cell", "");
		article.setAttribute("data-cell-type", cell.type);
		article.dataset.index = String(index);
		article.tabIndex = 0;
		article.setAttribute("aria-label", `${cell.language} block ${index + 1}`);
		const body = document.createElement("div");
		body.setAttribute("data-tp-notebook-cell-body", "");
		body.append(this.createViewer(cell, index));
		article.append(body);
		article.addEventListener("pointerdown", () => this.selectCell(index));
		article.addEventListener("focusin", () => this.selectCell(index));
		return article;
	}

	private createViewer(cell: NotebookCell, index: number): HTMLElement {
		const viewer = document.createElement(`tp-${cell.language}-viewer`);
		if (cell.type === "code") {
			viewer.setAttribute("execution-scope", this.executionScope);
			viewer.setAttribute("execution-index", String(index));
		}
		if (cell.type === "markup") viewer.setAttribute("lite", "");
		if (
			cell.type === "markup" &&
			cell.language === "restructuredtext" &&
			cell.doctest === true
		)
			viewer.setAttribute("doctest", "");
		viewer.toggleAttribute("readonly", this.readonly);
		const scripts =
			cell.type === "markup"
				? [{ content: cell.content ?? "" }]
				: (cell.files ?? [{ content: "" }]);
		if (cell.type === "markup" && cell.language === "html") {
			viewer.innerHTML = cell.content ?? "";
		} else {
			for (const file of scripts) {
				const script = document.createElement("script");
				script.type = `tp/${cell.language}`;
				if ("filename" in file && file.filename)
					script.setAttribute("filename", file.filename);
				script.textContent = file.content;
				viewer.append(script);
			}
		}
		this.observeViewer(
			viewer,
			!this.readonly,
			cell.type === "markup" ? 1 : Math.max(1, scripts.length),
		);
		return viewer;
	}

	private observeViewer(
		viewer: HTMLElement,
		openSource: boolean,
		expectedEditors: number,
	): void {
		let sourceOpened = !openSource;
		let observer: MutationObserver;
		const sync = (): void => {
			const editors = viewer.querySelectorAll<HTMLElement>("tp-code-editor");
			editors.forEach((editor) => {
				editor.toggleAttribute("readonly", this.readonly);
			});
			this.syncEditorToolbarButton();
			viewer
				.querySelectorAll<HTMLElement>(
					'[data-role="reset"], [data-tp-playground-reset]',
				)
				.forEach((button) => {
					button.toggleAttribute("disabled", this.readonly);
				});
			if (!sourceOpened) {
				const sourceButton = viewer.querySelector<HTMLElement>(
					'[data-role="toggle-source"][aria-pressed="false"], [data-tp-programming-viewer-code][aria-pressed="false"]',
				);
				if (sourceButton !== null) {
					sourceOpened = true;
					sourceButton.click();
				}
			}
			if (sourceOpened && editors.length >= expectedEditors)
				observer.disconnect();
		};
		observer = new MutationObserver(sync);
		observer.observe(viewer, { childList: true, subtree: true });
		this.viewerObservers.push(observer);
		queueMicrotask(sync);
	}

	private handleAction(event: Event): void {
		const target = event.target as Element | null;
		const action =
			target?.closest<HTMLElement>("[data-action]")?.dataset.action;
		if (action === undefined) return;
		if (
			this.readonly &&
			!["run-all", "preview", "editor-toolbar"].includes(action)
		)
			return;
		if (
			this.previewing &&
			(action === "add-language" || action === "add-markup")
		)
			return;
		if (action === "add-markup") {
			this.addCell("markup", this.markupLanguage);
			return;
		}
		if (action === "add-language") {
			this.addCell(
				"code",
				this.localName === "tp-notebook" ? this.codeLanguage : this.language,
			);
			return;
		}
		if (action === "editor-toolbar") {
			const selected = this.querySelector<HTMLElement>(
				"[data-tp-notebook-cell][data-selected]",
			);
			const editors = Array.from(
				selected?.querySelectorAll<HTMLElement>("tp-code-editor") ?? [],
			);
			const next = !editors.some((editor) => editor.hasAttribute("toolbar"));
			editors.forEach((editor) => {
				editor.toggleAttribute("toolbar", next);
			});
			this.querySelector<HTMLElement>(
				'[data-action="editor-toolbar"]',
			)?.setAttribute("aria-pressed", String(next));
			return;
		}
		const index = this.selectedIndex;
		if (action === "run-all")
			this.querySelectorAll<HTMLElement>(
				this.previewing
					? "[data-tp-notebook-preview-content] > [execution-scope] [data-tp-playground-run]"
					: "[data-tp-notebook-cell] [data-tp-playground-run]",
			).forEach((button) => {
				button.click();
			});
		else if (action === "preview") this.togglePreview();
		else if (action === "reset") {
			this.executionScopeVersion += 1;
			this.cells = structuredClone(this.initialCells);
			this.selectedIndex = this.cells.length > 0 ? 0 : -1;
		} else if (index >= 0) {
			this.captureAllCells();
			const cell = this.cells[index];
			if (cell === undefined) return;
			const previous = this.cells[index - 1];
			const next = this.cells[index + 1];
			if (action === "delete") this.cells.splice(index, 1);
			else if (action === "duplicate")
				this.cells.splice(index + 1, 0, structuredClone(cell));
			else if (action === "up" && previous !== undefined)
				[this.cells[index - 1], this.cells[index]] = [cell, previous];
			else if (action === "down" && next !== undefined)
				[this.cells[index + 1], this.cells[index]] = [cell, next];
			if (action === "delete")
				this.selectedIndex = Math.min(index, this.cells.length - 1);
			else if (action === "duplicate") this.selectedIndex = index + 1;
			else if (action === "up" && index > 0) this.selectedIndex = index - 1;
			else if (action === "down" && index < this.cells.length - 1)
				this.selectedIndex = index + 1;
		}
		if (!["run-all", "preview"].includes(action)) {
			this.renderCells();
			this.emitChange();
		}
	}

	private addCell(type: "markup" | "code", language: string): void {
		if (this.readonly) return;
		this.captureAllCells();
		const cell: NotebookCell =
			type === "markup"
				? {
						type,
						language: language as MarkupLanguage,
						content: "",
						showEditor: true,
					}
				: {
						type,
						language: language as NotebookLanguage,
						files: [{ content: "" }],
					};
		const insertionIndex =
			this.selectedIndex < 0 ? this.cells.length : this.selectedIndex + 1;
		this.cells.splice(insertionIndex, 0, cell);
		this.selectedIndex = insertionIndex;
		this.renderCells();
		this.emitChange();
	}

	private get executionScope(): string {
		return `${this.instanceId}-execution-${this.executionScopeVersion}`;
	}

	private selectCell(index: number): void {
		if (this.selectedIndex === index) return;
		this.selectedIndex = index;
		this.syncSelection();
	}

	private syncSelection(): void {
		this.querySelectorAll<HTMLElement>("[data-tp-notebook-cell]").forEach(
			(cell, index) => {
				const selected = index === this.selectedIndex;
				cell.toggleAttribute("data-selected", selected);
				cell.toggleAttribute("aria-current", selected);
			},
		);
		const states: Record<string, boolean> = {
			up: this.previewing || this.readonly || this.selectedIndex <= 0,
			down:
				this.previewing ||
				this.readonly ||
				this.selectedIndex < 0 ||
				this.selectedIndex >= this.cells.length - 1,
			duplicate: this.previewing || this.readonly || this.selectedIndex < 0,
			delete: this.previewing || this.readonly || this.selectedIndex < 0,
			reset: this.previewing || this.readonly,
			"run-all": false,
		};
		for (const [action, disabled] of Object.entries(states)) {
			this.querySelector<HTMLElement>(
				`[data-tp-notebook-toolbar] [data-action="${action}"]`,
			)?.toggleAttribute("disabled", disabled);
		}
		this.querySelectorAll<HTMLElement>(
			'[data-tp-dropdown-target$="-markup-menu"], [data-tp-dropdown-target$="-language-menu"]',
		).forEach((button) => {
			button.toggleAttribute("disabled", this.previewing || this.readonly);
		});
		this.querySelectorAll<HTMLElement>(
			'[data-action="add-language"], [data-action="add-markup"]',
		).forEach((button) => {
			button.toggleAttribute("disabled", this.previewing || this.readonly);
		});
		this.syncReadonly();
		this.syncEditorToolbarButton();
	}

	private syncEditorToolbarButton(): void {
		const button = this.querySelector<HTMLElement>(
			'[data-action="editor-toolbar"]',
		);
		const selected = this.querySelector<HTMLElement>(
			"[data-tp-notebook-cell][data-selected]",
		);
		const editors = Array.from(
			selected?.querySelectorAll<HTMLElement>("tp-code-editor") ?? [],
		);
		button?.toggleAttribute("hidden", this.previewing || editors.length === 0);
		button?.setAttribute(
			"aria-pressed",
			String(editors.some((editor) => editor.hasAttribute("toolbar"))),
		);
	}

	private syncReadonly(): void {
		this.querySelectorAll<HTMLElement>(
			"[data-tp-notebook-cell-body] > *",
		).forEach((viewer) => {
			viewer.toggleAttribute("readonly", this.readonly);
		});
		this.querySelectorAll<HTMLElement>("tp-code-editor").forEach((editor) => {
			editor.toggleAttribute("readonly", this.readonly);
		});
		this.querySelectorAll<HTMLElement>(
			'[data-role="reset"], [data-tp-playground-reset]',
		).forEach((button) => {
			button.toggleAttribute("disabled", this.readonly);
		});
	}

	private captureAllCells(): void {
		const cells = this.previewing
			? this.cellsEl?.querySelector("[data-tp-notebook-preview-content]")
					?.children
			: this.cellsEl?.children;
		Array.from(cells ?? []).forEach((element, index) => {
			this.captureCell(index, element as HTMLElement);
		});
	}

	private captureCell(index: number, element: HTMLElement | null): void {
		const cell = this.cells[index];
		if (cell === undefined || element === null) return;
		const editors = Array.from(
			element.querySelectorAll("tp-code-editor"),
		) as Array<HTMLElement & { getValue(): string }>;
		if (cell.type === "markup")
			cell.content = editors[0]?.getValue() ?? cell.content ?? "";
		else
			editors.forEach((editor, fileIndex) => {
				const file = cell.files?.[fileIndex];
				if (file) file.content = editor.getValue();
			});
	}

	private emitChange(): void {
		this.dispatchEvent(
			new CustomEvent("tp-notebook-change", {
				bubbles: true,
				detail: { cells: this.cells.length },
			}),
		);
	}
}

if (!customElements.get("tp-notebook"))
	customElements.define("tp-notebook", TpNotebook);

declare global {
	interface HTMLElementTagNameMap {
		"tp-notebook": TpNotebook;
	}
}
