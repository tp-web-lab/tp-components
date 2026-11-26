/**
 * @module components/playground
 * @summary Shared playground base for interactive execution components.
 */

import { createViewerFullscreen } from "../../utilities/viewer-fullscreen.js";
import {
	readViewerMode,
	type ViewerMode,
} from "../../utilities/viewer-mode.js";
import { createViewerRunShortcut } from "../../utilities/viewer-run-shortcut.js";
import style from "./playground.css?inline";

import "../base/base.js";
import "../button/button.js";
import "../console/console.js";
import "../code-editor/code-editor.js";
import "../drawer/drawer.js";
import "../dropdown/dropdown.js";
import "../filesystem/filesystem.js";
import "../icon/icon.js";
import "../icon-button/icon-button.js";
import "../iframe/iframe.js";
import "../menu/menu.js";
import "../splitter/splitter.js";
import "../switcher/switcher.js";
import "../tabs/tabs.js";
import "../toolbar/toolbar.js";
import { dedent } from "../../utilities/code.js";
import {
	chooseSaveTarget,
	saveBlob,
	type TpSaveTarget,
} from "../../utilities/save-file.js";
import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import type { TpCodeEditor } from "../code-editor/code-editor.js";
import type {
	TpConsole,
	TpConsoleEntryKind,
	TpConsoleValue,
} from "../console/console.js";
import type { TpDrawer } from "../drawer/drawer.js";
import type { TpFilesystem } from "../filesystem/filesystem.js";
import type {
	TpFile,
	TpFilesystemChangeDetail,
	TpFilesystemPathDetail,
	TpFilesystemRenameDetail,
} from "../filesystem/filesystem.types.js";
import type { TpIframe } from "../iframe/iframe.js";
import type { TpMenu } from "../menu/menu.js";
import type {
	TpTabs,
	TpTabsCloseDetail,
	TpTabsSelectDetail,
} from "../tabs/tabs.js";
import {
	inferLanguage,
	type TpExampleProjectMetadata,
	TpPlaygroundExampleLoader,
} from "./playground-example-loader.js";
import { choosePlaygroundFile } from "./playground-local-file.js";
import {
	loadPlaygroundRepository,
	parsePlaygroundProjectJson,
	readInlinePlaygroundProjectJson,
	type TpPlaygroundProjectData,
	type TpPlaygroundProjectMetadata,
} from "./playground-project-loader.js";
import {
	createSingleSourceProject,
	loadPlaygroundSource,
	playgroundSourceAccept,
} from "./playground-source-loader.js";
import { TpProject } from "./project.js";

interface TpPlaygroundConsoleEntryMessage {
	type: "tp-playground-console-entry";
	kind: TpConsoleEntryKind;
	values: TpConsoleValue[];
}

interface TpPlaygroundConsoleClearMessage {
	type: "tp-playground-console-clear";
}

type TpPlaygroundWindowMessage =
	| TpPlaygroundConsoleEntryMessage
	| TpPlaygroundConsoleClearMessage;

export interface TpExecutionDocument {
	html: string;
	cleanup?: () => void;
}

export interface TpPlaygroundSrcLoadDetail<
	TProject extends TpProject = TpProject,
> {
	src: string;
	project: TProject;
}

export interface TpPlaygroundRepositoryLoadDetail<
	TProject extends TpProject = TpProject,
> {
	repository: string;
	project: TProject;
}

const EXAMPLE_GROUP_BY_PLAYGROUND_KIND = new Map<string, string>([
	["asciidoc", "asciidoc"],
	["html", "html"],
	["javascript", "js"],
	["markdown", "markdown"],
	["prolog", "prolog"],
	["python", "py"],
	["restructuredtext", "restructuredtext"],
	["sql", "sql"],
	["typescript", "ts"],
]);

export abstract class TpPlayground<
	TProject extends TpProject = TpProject,
> extends TpBase {
	private static readonly styleId = "tp-playground-styles";

	private isSyncingEditor = false;

	/** Invalidates source requests when a newer configuration is selected. */
	private configuredProjectRevision = 0;

	/** Last successful disk destination for each logical project file. */
	private readonly fileSaveTargets = new Map<string, TpSaveTarget>();

	/** Cancels a pending disk chooser when another is opened or the host disconnects. */
	private fileChooserController: AbortController | null = null;

	private cleanupExecution: (() => void) | null = null;

	private viewerIframeResizeObserver: ResizeObserver | null = null;

	private viewerIframeMutationObserver: MutationObserver | null = null;

	private exampleLoader: TpPlaygroundExampleLoader<TProject> | null = null;

	protected project: TProject;

	protected initialProject: TProject;

	protected filesystemEl: TpFilesystem | null = null;

	protected editorEl: TpCodeEditor | null = null;

	protected iframeEl: TpIframe | null = null;

	protected tabsEl: TpTabs | null = null;

	protected consoleEl: TpConsole | null = null;

	protected toolbarStartMenuEl: TpMenu | null = null;

	protected languageDrawerEl: TpDrawer | null = null;

	private viewerCodeVisible = false;

	private viewerOutputVisible = true;

	private viewerConsoleVisible = false;

	protected openFiles: string[] = [];

	protected activeFile: string | null = null;

	/** Controls the viewer presentation independently of its source language. */
	public get mode(): ViewerMode {
		return readViewerMode(this);
	}
	public set mode(value: ViewerMode) {
		this.setAttribute("mode", value);
	}

	public static override get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "repository", "src", "mode", "lite"];
	}

	public get repository(): string {
		return this.getAttribute("repository") ?? "";
	}

	public set repository(value: string) {
		if (value === "") {
			this.removeAttribute("repository");
			return;
		}

		this.setAttribute("repository", value);
	}

	public get src(): string {
		return this.getAttribute("src") ?? "";
	}

	public set src(value: string) {
		if (value === "") {
			this.removeAttribute("src");
			return;
		}

		this.setAttribute("src", value);
	}

	protected getLanguageIconName(): string {
		return "code";
	}

	/** Use the compact, single-project viewer interface instead of the IDE interface. */
	protected get viewerMode(): boolean {
		return false;
	}

	/** Scheme, OCaml and Prolog keep all output in the rendered result. */
	protected get inlineConsoleOutput(): boolean {
		return ["scheme", "ocaml", "prolog"].includes(this.getPlaygroundKind());
	}

	private executionHtml(html: string): string {
		return this.inlineConsoleOutput
			? html.replace(
					/<head([^>]*)>/i,
					"<head$1><script>window.__tpInlineConsole = true;</script>",
				)
			: html;
	}

	private appendInlineOutput(values: unknown[]): void {
		const frame = this.iframeEl as
			| (HTMLElement & { contentWindow?: Window | null })
			| null;
		const doc = frame?.contentWindow?.document;
		if (!doc?.body) return;
		let output = doc.querySelector<HTMLPreElement>("[data-tp-inline-messages]");
		if (!output) {
			output = doc.createElement("pre");
			output.setAttribute("data-tp-inline-messages", "");
			output.setAttribute("role", "log");
			doc.body.append(output);
		}
		const text = values
			.map((value) => {
				if (typeof value === "string") return value;
				if (value instanceof Error) return value.message;
				if (typeof value === "object" && value !== null) {
					const item = value as Record<string, unknown>;
					if (item.__tp_console_type === "error")
						return String(item.message ?? item.name ?? "Error");
					if (item.__tp_console_type === "undefined") return "undefined";
					try {
						return JSON.stringify(value, null, 2);
					} catch {
						return String(value);
					}
				}
				return String(value);
			})
			.join(" ");
		output.append(doc.createTextNode(`${text}\n`));
		if (this.iframeEl) this.iframeEl.hidden = false;
		this.viewerOutputVisible = true;
		this.updateViewerLayout();
	}

	protected getViewerLanguageLabel(): string {
		const kind = this.getPlaygroundKind();
		return kind === "javascript"
			? "JavaScript"
			: kind === "typescript"
				? "TypeScript"
				: kind === "sql"
					? "SQL"
					: kind.charAt(0).toUpperCase() + kind.slice(1);
	}

	/** Additional project files displayed as editors below the entry file. */
	protected getViewerAdditionalFilePaths(
		_project: TProject,
	): readonly string[] {
		return [];
	}

	/** Display the primary and additional viewer files as tabs. */
	protected get usesViewerEditorTabs(): boolean {
		return false;
	}

	protected getLanguageHelp(): string {
		return "<p>No help available.</p>";
	}

	protected getAdditionalToolbarMenuItems(): string {
		return "";
	}

	protected getExampleMenuItems(): string {
		return '<li aria-disabled="true">No examples</li>';
	}

	protected get supportsTestExecution(): boolean {
		return false;
	}

	protected get exampleCategory(): string {
		return "playgrounds";
	}

	protected get exampleGroup(): string {
		return (
			EXAMPLE_GROUP_BY_PLAYGROUND_KIND.get(this.getPlaygroundKind()) ??
			this.getPlaygroundKind()
		);
	}

	protected getPlaygroundKind(): string {
		return "base";
	}

	protected createProjectFromExample(
		metadata: TpExampleProjectMetadata,
		files: readonly TpFile[],
	): TProject {
		return new TpProject({
			name:
				metadata.name ?? metadata.label ?? metadata.id ?? "Untitled project",
			entry: metadata.entry,
			test: metadata.test,
			files,
		}) as TProject;
	}

	private getExampleLoader(): TpPlaygroundExampleLoader<TProject> {
		if (this.exampleLoader === null) {
			this.exampleLoader = new TpPlaygroundExampleLoader<TProject>({
				category: this.exampleCategory,
				group: this.exampleGroup,
				createProject: (metadata, files) =>
					this.createProjectFromExample(metadata, files),
			});
		}
		return this.exampleLoader;
	}

	protected afterProjectLoaded(): void {
		// hook
	}

	private async syncExamplesMenu(): Promise<void> {
		const list = this.queryElement<HTMLUListElement>(
			"[data-tp-playground-example-list]",
		);

		if (list === null) {
			return;
		}

		try {
			const examples = await this.getExampleLoader().getExamples();

			list.replaceChildren();

			if (examples.length === 0) {
				const item = document.createElement("li");
				item.setAttribute("aria-disabled", "true");
				item.textContent = "No examples";
				list.append(item);
				return;
			}

			for (const example of examples) {
				const item = document.createElement("li");
				item.setAttribute("data-tp-playground-example-id", example.id);
				item.textContent = example.label;
				list.append(item);
			}

			this.toolbarStartMenuEl?.refresh();
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "Unknown examples loading error";

			console.warn("Unable to load examples", error);
			if (this.inlineConsoleOutput) this.appendInlineOutput([message]);
			else this.consoleEl?.warn(message);

			list.replaceChildren();

			const item = document.createElement("li");
			item.setAttribute("aria-disabled", "true");
			item.textContent = "Unable to load examples";
			list.append(item);

			this.toolbarStartMenuEl?.refresh();
		}
	}

	/** Loads a bundled example by identifier, clears output and runs it. */
	public async loadExample(id: string): Promise<void> {
		const project = await this.getExampleLoader().loadProject(id);

		this.setProject(project);

		this.consoleEl?.clear();

		await this.run();
		this.afterProjectLoaded();
	}

	protected handleAdditionalToolbarAction(_action: string): boolean {
		return false;
	}

	public constructor() {
		super();

		this.project = this.createEmptyProject();
		this.initialProject = this.project.clone() as TProject;
	}

	private readonly handleViewerRunShortcut = createViewerRunShortcut(
		this,
		() => {
			void this.run();
		},
	);

	protected connectedCallback(): void {
		super.connectedCallback();
		this.addEventListener("keydown", this.handleViewerRunShortcut, true);
		this.ensureGlobalStyle(TpPlayground.styleId, style);
		this.ensureLayout();
		this.bindEvents();
		this.refreshMemoryMenu();
		const initializeProject = (): void => {
			if (!this.isConnected) return;
			this.setProject(this.createInitialProject());
			void this.loadConfiguredProject();
			void this.syncExamplesMenu();
		};

		// During HTML parsing a custom element is connected before the parser has
		// necessarily appended its following child nodes. Viewer scripts therefore
		// have to be read after the current parsing step has completed.
		if (this.viewerMode) {
			queueMicrotask(initializeProject);
		} else {
			initializeProject();
		}
		window.addEventListener("message", this.handleWindowMessage);
	}

	public disconnectedCallback(): void {
		this.removeEventListener("keydown", this.handleViewerRunShortcut, true);
		this.configuredProjectRevision++;
		this.fileChooserController?.abort();
		this.fileChooserController = null;
		this.unbindEvents();
		this.viewerIframeResizeObserver?.disconnect();
		this.viewerIframeResizeObserver = null;
		this.viewerIframeMutationObserver?.disconnect();
		this.viewerIframeMutationObserver = null;
		this.cleanupExecution?.();
		this.cleanupExecution = null;
		window.removeEventListener("message", this.handleWindowMessage);
	}

	/** Returns an independent copy of the current project and its files. */
	public getProject(): TProject {
		return this.project.clone() as TProject;
	}

	/** Replaces the project, records its reset state and opens its entry file. */
	public setProject(project: TProject): void {
		this.fileSaveTargets.clear();
		this.project = this.normalizeProject(project);
		this.initialProject = this.project.clone() as TProject;

		this.openFiles = [];
		this.activeFile = null;

		this.iframeEl?.removeAttribute("srcdoc");

		this.syncFilesystemFromProject();

		const entry = this.viewerMode
			? this.resolveViewerPrimaryFile(this.project)
			: this.resolveEntry(this.project);

		if (entry !== null) {
			this.openFile(entry);
		}

		this.syncTabs();
		this.syncEditorFromActiveFile();
		this.syncViewerAdditionalEditors();
		this.syncTestButton();
	}

	/** Restores the initially loaded project and clears the console. */
	public reset(): void {
		this.consoleEl?.clear();
		this.setProject(this.initialProject.clone() as TProject);
	}

	/** Executes the current edited project and replaces the output document. */
	public async run(): Promise<void> {
		this.syncProjectFromFilesystem();

		if (this.iframeEl === null) {
			return;
		}

		this.cleanupExecution?.();
		this.cleanupExecution = null;

		try {
			const documentResult = await this.buildExecutionDocument(this.project);

			this.cleanupExecution = documentResult.cleanup ?? null;
			this.consoleEl?.clear();
			// Stop measuring the outgoing document and revive an empty/hidden
			// preview before navigation, including nested Attributes iframes.
			this.viewerIframeResizeObserver?.disconnect();
			this.viewerIframeResizeObserver = null;
			this.viewerIframeMutationObserver?.disconnect();
			this.viewerIframeMutationObserver = null;
			this.iframeEl.style.blockSize = "1px";
			this.iframeEl.hidden = false;
			this.iframeEl.setAttribute(
				"srcdoc",
				this.executionHtml(documentResult.html),
			);
			this.editorEl?.syncHeightToContent();
		} catch (error: unknown) {
			this.reportError(error, "Unknown execution error");
		}
	}

	/** Runs the current project tests and displays their output or an unsupported-test error. */
	public async test(): Promise<void> {
		this.syncProjectFromFilesystem();

		if (this.iframeEl === null) {
			return;
		}

		try {
			const documentResult = await this.buildTestDocument(this.project);

			this.cleanupExecution?.();
			this.cleanupExecution = documentResult.cleanup ?? null;
			this.viewerIframeResizeObserver?.disconnect();
			this.viewerIframeResizeObserver = null;
			this.viewerIframeMutationObserver?.disconnect();
			this.viewerIframeMutationObserver = null;
			this.iframeEl.style.blockSize = "1px";
			this.iframeEl.hidden = false;
			this.iframeEl.setAttribute(
				"srcdoc",
				this.executionHtml(documentResult.html),
			);
		} catch (error: unknown) {
			this.reportError(error, "Tests are not supported.");
		}
	}

	/** Builds an isolated test run from the current edits without changing the project or preview. */
	public async createTestDocument(
		testFile: TpFile,
	): Promise<TpExecutionDocument> {
		this.syncProjectFromFilesystem();
		const snapshot = this.getProject();
		snapshot.files = snapshot.files.filter(
			(file) => file.path !== testFile.path,
		);
		snapshot.files.push({ ...testFile });
		snapshot.test = testFile.path;
		return this.buildTestDocument(snapshot);
	}

	/** Opens the project file at the given path and selects its editor tab. */
	public openFile(path: string): void {
		const file = this.project.findFile(path);

		if (file === undefined) {
			return;
		}

		if (!this.openFiles.includes(path)) {
			this.openFiles = [...this.openFiles, path];
		}

		this.activeFile = path;

		this.filesystemEl?.openFile(path, false);
		this.syncTabs();
		this.syncEditorFromActiveFile();
	}

	/** Closes the editor tab for the given path without deleting the project file. */
	public closeFile(path: string): void {
		this.openFiles = this.openFiles.filter((openPath) => openPath !== path);

		if (this.activeFile === path) {
			this.activeFile = this.openFiles.at(-1) ?? null;
		}

		this.filesystemEl?.closeFile(path);
		this.syncTabs();
		this.syncEditorFromActiveFile();
	}

	protected abstract createEmptyProject(): TProject;

	protected attributeChangedCallback(
		name: string,
		_oldValue: string | null,
		_newValue: string | null,
	): void {
		if (
			(name === "mode" || name === "lite") &&
			this.isConnected &&
			this.viewerMode
		)
			this.updateViewerLayout();
		if ((name === "src" || name === "repository") && this.isConnected) {
			void this.loadConfiguredProject(true);
		}
	}

	protected createNewProject(): TProject {
		return this.createEmptyProject();
	}

	protected createClearProject(): TProject {
		return new TpProject({
			name: "Untitled project",
			files: [],
		}) as TProject;
	}

	protected createInitialProject(): TProject {
		const project = this.createEmptyProject();

		const language = this.getPlaygroundKind();
		const scripts = Array.from(
			this.querySelectorAll<HTMLScriptElement>(
				`:scope > script:is([type="tp/${language}"], [type="tp/${language}-viewer"])`,
			),
		);

		for (const [index, script] of scripts.entries()) {
			const filename = script.getAttribute("filename")?.trim() ?? "";
			const path =
				filename === ""
					? index === 0
						? project.entry
						: undefined
					: filename.startsWith("/")
						? filename
						: `/${filename}`;
			if (path === undefined) continue;
			const file = project.findFile(path);
			const content = dedent(script.textContent ?? "");
			if (file !== undefined) {
				file.content = content;
			} else {
				project.files.push({ path, language: inferLanguage(path), content });
			}
		}

		return project;
	}

	protected createProjectFromData(data: TpPlaygroundProjectData): TProject {
		const files = data.files.map((file) => {
			const path = file.path.startsWith("/") ? file.path : `/${file.path}`;

			return {
				...file,
				path,
				language: file.language ?? inferLanguage(path),
			};
		});

		return this.createProjectFromRepository(data, files);
	}

	protected createProjectFromRepository(
		metadata: TpPlaygroundProjectMetadata,
		files: readonly TpFile[],
	): TProject {
		return this.createProjectFromExample(
			metadata as TpExampleProjectMetadata,
			files,
		);
	}

	protected normalizeProject(project: TProject): TProject {
		return project.clone() as TProject;
	}

	protected async loadConfiguredProject(
		restoreDefault = false,
	): Promise<boolean> {
		const revision = ++this.configuredProjectRevision;
		this.consoleEl?.clear();
		try {
			const src = this.src.trim();
			if (src !== "") {
				const data = await loadPlaygroundSource(
					resolveComponentSourceUrl(this, src).href,
					this.getPlaygroundKind(),
				);
				if (revision !== this.configuredProjectRevision) return false;
				this.setProject(this.createProjectFromData(data));
				await this.run();
				this.afterProjectLoaded();
				this.dispatchEvent(
					new CustomEvent<TpPlaygroundSrcLoadDetail<TProject>>(
						"tp-playground-src-load",
						{
							bubbles: true,
							detail: { src, project: this.getProject() },
						},
					),
				);
				return true;
			}

			const repository = this.repository.trim();
			if (repository !== "") {
				const data = await loadPlaygroundRepository(
					resolveComponentSourceUrl(this, repository).href,
				);
				if (revision !== this.configuredProjectRevision) return false;
				this.setProject(
					this.createProjectFromRepository(data.metadata, data.files),
				);
				await this.run();
				this.afterProjectLoaded();
				this.dispatchEvent(
					new CustomEvent<TpPlaygroundRepositoryLoadDetail<TProject>>(
						"tp-playground-repository-load",
						{
							bubbles: true,
							detail: { repository, project: this.getProject() },
						},
					),
				);
				return true;
			}

			const inlineData = readInlinePlaygroundProjectJson(this);
			if (inlineData !== null) {
				this.setProject(this.createProjectFromData(inlineData));
				await this.run();
				this.afterProjectLoaded();
				return true;
			}

			if (restoreDefault) {
				this.setProject(this.createInitialProject());
				await this.run();
				this.afterProjectLoaded();
				return true;
			}
		} catch (error: unknown) {
			if (revision !== this.configuredProjectRevision) return false;
			const message =
				error instanceof Error ? error.message : "Unable to load project.";
			// Discard output from the previous project emitted during the request.
			this.consoleEl?.clear();
			if (this.inlineConsoleOutput) this.appendInlineOutput([message]);
			else this.consoleEl?.error(message);
			console.error(error);
		}

		return false;
	}

	protected resolveEntry(project: TProject): string | null {
		if (
			typeof project.entry === "string" &&
			project.findFile(project.entry) !== undefined
		) {
			return project.entry;
		}

		return project.files[0]?.path ?? null;
	}

	protected resolveViewerPrimaryFile(project: TProject): string | null {
		return this.resolveEntry(project);
	}

	protected abstract buildExecutionDocument(
		project: TProject,
	): Promise<TpExecutionDocument>;

	protected async buildTestDocument(
		_project: TProject,
	): Promise<TpExecutionDocument> {
		throw new Error("Tests are not supported by this playground.");
	}

	protected syncProjectFromFilesystem(): void {
		if (this.filesystemEl === null) {
			return;
		}

		this.project.setFiles(this.filesystemEl.getFiles());
		this.syncTestButton();
	}

	protected hasAvailableTestFile(project: TProject = this.project): boolean {
		if (!this.supportsTestExecution) {
			return false;
		}

		if (
			typeof project.test === "string" &&
			project.test !== "" &&
			project.findFile(project.test) !== undefined
		) {
			return true;
		}

		return project.files.some((file) =>
			/\.(?:test|tests|spec)\.[^/.]+$/i.test(file.path),
		);
	}

	protected syncToolbar(): void {
		const startMenu = this.toolbarStartMenuEl;

		if (startMenu === null) {
			return;
		}

		const additionalMenuItem = startMenu.querySelector(
			"[data-tp-playground-additional-menu]",
		);

		if (!(additionalMenuItem instanceof HTMLLIElement)) {
			return;
		}

		additionalMenuItem.outerHTML = this.getAdditionalToolbarMenuItems();

		this.toolbarStartMenuEl = this.queryElement(
			"[data-tp-playground-toolbar-start-menu]",
		);

		this.bindEvents();
	}

	protected syncFilesystemFromProject(): void {
		this.filesystemEl?.setFiles(this.project.files);
	}

	protected createConsoleBridgeScript(): string {
		return `
<script>
(() => {
  const serialize = (value) => {
    if (value instanceof Error) {
      return {
        name: value.name,
        message: value.message,
        stack: value.stack,
      };
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (typeof value === 'bigint') {
      return String(value) + 'n';
    }

    if (typeof value === 'function') {
      return '[Function ' + (value.name || 'anonymous') + ']';
    }

    try {
      JSON.stringify(value);
      return value;
    } catch {
      return String(value);
    }
  };

  const postEntry = (kind, values) => {
    window.parent.postMessage(
      {
        type: 'tp-playground-console-entry',
        kind,
        values: values.map(serialize),
      },
      '*',
    );
  };

  const methods = [
    'log',
    'info',
    'warn',
    'error',
    'table',
    'group',
    'groupCollapsed',
    'groupEnd',
    'assert',
    'count',
    'countReset',
    'time',
    'timeLog',
    'timeEnd',
  ];

  const original = {};

  for (const method of methods) {
    original[method] = console[method]?.bind(console) ?? (() => {});
  }

  console.log = (...values) => {
    original.log(...values);
    postEntry('log', values);
  };

  console.info = (...values) => {
    original.info(...values);
    postEntry('info', values);
  };

  console.warn = (...values) => {
    original.warn(...values);
    postEntry('warn', values);
  };

  console.error = (...values) => {
    original.error(...values);
    postEntry('error', values);
  };

  console.table = (...values) => {
    original.table(...values);
    postEntry('table', values);
  };

  console.group = (...values) => {
    original.group(...values);
    postEntry('group', values);
  };

  console.groupCollapsed = (...values) => {
    original.groupCollapsed(...values);
    postEntry('group-collapsed', values);
  };

  console.groupEnd = () => {
    original.groupEnd();
    postEntry('group-end', []);
  };

  console.assert = (condition, ...values) => {
    original.assert(condition, ...values);

    if (!condition) {
      postEntry('assert', values.length > 0 ? values : ['Assertion failed']);
    }
  };

  console.count = (label = 'default') => {
    original.count(label);
    postEntry('count', [label]);
  };

  console.countReset = (label = 'default') => {
    original.countReset(label);
  };

  console.time = (label = 'default') => {
    original.time(label);
  };

  console.timeLog = (label = 'default', ...values) => {
    original.timeLog(label, ...values);
    postEntry('time', [label, ...values]);
  };

  console.timeEnd = (label = 'default') => {
    original.timeEnd(label);
    postEntry('time', [label]);
  };

  console.clear = () => {
    window.parent.postMessage(
      {
        type: 'tp-playground-console-clear',
      },
      '*',
    );
  };
})();
</script>
`;
	}

	private ensureLayout(): void {
		if (this.querySelector("[data-tp-playground-root]") !== null) {
			this.filesystemEl = this.queryElement<TpFilesystem>("tp-filesystem");
			// With no open file, the shared editor is detached but still reusable.
			this.editorEl =
				this.queryElement<TpCodeEditor>("tp-code-editor") ?? this.editorEl;
			this.iframeEl = this.queryElement<TpIframe>("tp-iframe");
			this.tabsEl = this.queryElement<TpTabs>("tp-tabs");
			this.consoleEl = this.queryElement<TpConsole>("tp-console");
			this.toolbarStartMenuEl = this.queryElement(
				"[data-tp-playground-toolbar-start-menu]",
			);
			this.languageDrawerEl = this.queryElement<TpDrawer>(
				"[data-tp-playground-language-drawer]",
			);
			return;
		}

		if (this.viewerMode) {
			this.ensureViewerLayout();
			return;
		}

		const root = document.createElement("div");
		root.setAttribute("data-tp-playground-root", "");

		const toolbar = document.createElement("tp-toolbar");
		toolbar.setAttribute("data-tp-playground-toolbar", "");

		const startMenu = document.createElement("tp-menu") as TpMenu;
		startMenu.setAttribute("data-tp-playground-toolbar-start-menu", "");
		startMenu.setAttribute("section", "start");
		startMenu.orientation = "horizontal";

		startMenu.innerHTML = `
      <ul>
        <li data-tp-playground-language-help aria-label="Language help" title="Language help">
          <tp-icon
            name="${this.getLanguageIconName()}"
            library="languages"
            size="1em"
            aria-hidden="true"
          ></tp-icon>
        </li>

        <li>
          Project
          <ul>
            <li data-tp-playground-action="new-project">New</li>
            <li data-tp-playground-action="clear-project">Clear</li>

            <li data-tp-menu-divider aria-disabled="true"></li>

            <li>
              Load from memory
              <ul data-tp-playground-memory-list>
                <li aria-disabled="true">No saved project</li>
              </ul>
            </li>

            <li data-tp-playground-action="clear-memory">Clear memory</li>
            <li data-tp-playground-action="save-memory">Save in memory</li>

            <li data-tp-menu-divider aria-disabled="true"></li>

            <li data-tp-playground-action="import-disk">Import from disk</li>
            <li data-tp-playground-action="export-disk">Export to disk</li>
          </ul>
        </li>

        <li>
          File
          <ul>
            <li data-tp-playground-action="open-source-file">Open source file…</li>
            <li data-tp-playground-action="save-file" aria-disabled="true">Save</li>
            <li data-tp-playground-action="save-file-as" aria-disabled="true">Save as…</li>
          </ul>
        </li>

        <li>
          Examples
          <ul data-tp-playground-example-list>
            ${this.getExampleMenuItems()}
          </ul>
        </li>

        ${this.getAdditionalToolbarMenuItems()}
      </ul>
    `;

		const resetButton = this.createToolbarIconButton({
			action: "reset",
			icon: "refresh",
			label: "Reset",
		});

		const testButton = this.createToolbarIconButton({
			action: "test",
			icon: this.hasAvailableTestFile() ? "test-tube" : "test-tube-off",
			label: "Test",
			title: this.hasAvailableTestFile() ? "Test" : "No test file found",
		});

		const runButton = this.createToolbarIconButton({
			action: "run",
			icon: "play",
			label: "Run",
		});

		const editorToolbarButton = this.createToolbarIconButton({
			action: "editor-toolbar",
			icon: "keyboard-f1",
			label: "Toggle editor toolbar",
			title: "Toggle editor toolbar (F1)",
		});

		const languageDrawer = document.createElement("tp-drawer") as TpDrawer;
		languageDrawer.setAttribute("data-tp-playground-language-drawer", "");
		languageDrawer.setAttribute("placement", "end");
		languageDrawer.setAttribute("outside-click", "");

		toolbar.append(
			startMenu,
			editorToolbarButton,
			resetButton,
			testButton,
			runButton,
			createViewerFullscreen(this),
		);

		const main = document.createElement("tp-splitter");
		main.setAttribute("data-tp-playground-main-splitter", "");
		main.setAttribute("axis", "horizontal");
		main.setAttribute("position", "30%");

		const splitterList = document.createElement("dl");

		const startTerm = document.createElement("dt");
		startTerm.textContent = "start";

		const startPanel = document.createElement("dd");
		startPanel.setAttribute("data-tp-playground-panel", "filesystem");

		const filesystem = document.createElement("tp-filesystem") as TpFilesystem;
		startPanel.append(filesystem);

		const endTerm = document.createElement("dt");
		endTerm.textContent = "end";

		const endPanel = document.createElement("dd");
		endPanel.setAttribute("data-tp-playground-panel", "editor");

		const editorPanel = document.createElement("div");
		editorPanel.setAttribute("data-tp-playground-editor-panel", "");

		const tabs = document.createElement("tp-tabs") as TpTabs;
		const editor = document.createElement("tp-code-editor") as TpCodeEditor;

		editor.setAttribute("line-numbers", "");
		editor.setAttribute("word-wrap", "");

		editorPanel.append(tabs);
		endPanel.append(editorPanel);

		splitterList.append(startTerm, startPanel, endTerm, endPanel);
		main.append(splitterList);

		const iframe = document.createElement("tp-iframe") as TpIframe;
		iframe.setAttribute("data-tp-playground-preview", "");
		const consoleEl = document.createElement("tp-console") as TpConsole;
		consoleEl.setAttribute("data-tp-playground-console", "");
		const switcher = document.createElement("tp-switcher");

		switcher.setAttribute("data-tp-playground-switcher", "");
		switcher.setAttribute("threshold", "52rem");
		switcher.setAttribute("gap", "0.75rem");

		const workGroup = document.createElement("div");
		workGroup.setAttribute("data-tp-playground-work-group", "");

		const previewGroup = document.createElement("div");
		previewGroup.setAttribute("data-tp-playground-preview-group", "");

		workGroup.append(main);
		previewGroup.append(iframe);
		if (!this.inlineConsoleOutput) previewGroup.append(consoleEl);

		switcher.append(workGroup, previewGroup);
		root.append(toolbar, switcher, languageDrawer);
		this.append(root);

		this.filesystemEl = filesystem;
		this.editorEl = editor;
		this.iframeEl = iframe;
		this.tabsEl = tabs;
		this.consoleEl = this.inlineConsoleOutput ? null : consoleEl;
		this.toolbarStartMenuEl = startMenu;
		this.languageDrawerEl = languageDrawer;

		this.bindEvents();
	}

	private ensureViewerLayout(): void {
		const root = document.createElement("div");
		root.setAttribute("data-tp-playground-root", "");
		root.setAttribute("data-tp-programming-viewer-root", "");

		const toolbar = document.createElement("div");
		toolbar.setAttribute("data-tp-programming-viewer-toolbar", "");

		const label = document.createElement("tp-icon");
		label.setAttribute("data-tp-programming-viewer-language", "");
		label.setAttribute("library", "components");
		label.setAttribute("name", this.localName.replace(/^tp-/, ""));
		label.setAttribute("size", "1.5em");
		label.setAttribute("role", "img");
		label.setAttribute("aria-label", this.getViewerLanguageLabel());
		label.setAttribute("title", this.getViewerLanguageLabel());

		const codeButton = this.createViewerButton("code", "code", "Code");
		const outputButton = this.createViewerButton(
			"output",
			"eye-outline",
			"Render",
		);
		const consoleButton = this.createViewerButton(
			"console",
			"terminal",
			"Console",
			false,
		);
		const editorToolbarButton = this.createViewerButton(
			"editor-toolbar",
			"keyboard-f1",
			"Editor toolbar",
			false,
		);
		const spacer = document.createElement("span");
		spacer.setAttribute("data-tp-programming-viewer-spacer", "");
		const editorActions = document.createElement("span");
		editorActions.setAttribute("data-tp-programming-viewer-editor-actions", "");
		const resetButton = this.createToolbarIconButton({
			action: "reset",
			icon: "refresh",
			label: "Reset",
		});
		const runButton = this.createToolbarIconButton({
			action: "run",
			icon: "play",
			label: "Run",
		});
		editorActions.append(editorToolbarButton, resetButton, runButton);
		toolbar.append(
			label,
			codeButton,
			outputButton,
			...(this.inlineConsoleOutput ? [] : [consoleButton]),
			spacer,
			editorActions,
			createViewerFullscreen(this),
		);

		const panels = document.createElement("tp-switcher");
		panels.setAttribute("data-tp-programming-viewer-panels", "");
		panels.setAttribute("threshold", "60rem");
		panels.setAttribute("gap", "0");

		const codePanel = document.createElement("section");
		codePanel.setAttribute("data-tp-programming-viewer-panel", "code");
		const editor = document.createElement("tp-code-editor") as TpCodeEditor;
		editor.setAttribute("word-wrap", "");
		const primaryEditorGroup = document.createElement("div");
		primaryEditorGroup.setAttribute(
			"data-tp-programming-viewer-editor-group",
			"",
		);
		primaryEditorGroup.setAttribute(
			"data-tp-programming-viewer-primary-editor",
			"",
		);
		const primaryLabel = document.createElement("strong");
		primaryLabel.setAttribute("data-tp-programming-viewer-file-label", "");
		primaryLabel.setAttribute("hidden", "");
		primaryEditorGroup.append(primaryLabel, editor);
		const additionalEditors = document.createElement("div");
		additionalEditors.setAttribute(
			"data-tp-programming-viewer-additional-editors",
			"",
		);
		if (this.usesViewerEditorTabs) {
			additionalEditors.append(primaryEditorGroup);
			codePanel.append(additionalEditors);
		} else {
			codePanel.append(primaryEditorGroup, additionalEditors);
		}

		const outputPanel = document.createElement("section");
		outputPanel.setAttribute("data-tp-programming-viewer-panel", "output");
		const iframe = document.createElement("tp-iframe") as TpIframe;
		iframe.setAttribute("data-tp-playground-preview", "");
		const consoleEl = document.createElement("tp-console") as TpConsole;
		consoleEl.setAttribute("data-tp-playground-console", "");
		outputPanel.append(iframe);
		if (!this.inlineConsoleOutput) outputPanel.append(consoleEl);

		panels.append(codePanel, outputPanel);
		root.append(toolbar, panels);
		this.append(root);

		this.editorEl = editor;
		this.iframeEl = iframe;
		this.consoleEl = this.inlineConsoleOutput ? null : consoleEl;
		this.updateViewerLayout();
	}

	private syncViewerAdditionalEditors(): void {
		if (!this.viewerMode) return;
		const container = this.queryElement<HTMLElement>(
			"[data-tp-programming-viewer-additional-editors]",
		);
		const primaryLabel = this.queryElement<HTMLElement>(
			"[data-tp-programming-viewer-primary-editor] [data-tp-programming-viewer-file-label]",
		);
		if (container === null) return;

		const paths = this.getViewerAdditionalFilePaths(this.project).filter(
			(path) =>
				path !== this.activeFile && this.project.findFile(path) !== undefined,
		);
		const primaryGroup = this.queryElement<HTMLElement>(
			"[data-tp-programming-viewer-primary-editor]",
		);
		if (this.usesViewerEditorTabs && primaryGroup !== null) {
			const tabs = document.createElement("tp-tabs");
			tabs.setAttribute("data-tp-programming-viewer-file-tabs", "");
			const list = document.createElement("dl");
			const appendTab = (path: string, group: HTMLElement): void => {
				const label = document.createElement("dt");
				label.setAttribute("data-value", path);
				label.textContent = path.split("/").at(-1) ?? path;
				const panel = document.createElement("dd");
				panel.setAttribute("data-value", path);
				panel.append(group);
				list.append(label, panel);
			};
			const primaryPath = this.activeFile ?? "/main";
			appendTab(primaryPath, primaryGroup);
			for (const path of paths) {
				const file = this.project.findFile(path);
				if (file === undefined) continue;
				const group = this.createViewerAdditionalEditor(
					path,
					file.content,
					file.language,
				);
				appendTab(path, group);
			}
			tabs.append(list);
			container.replaceChildren(tabs);
			primaryLabel?.setAttribute("hidden", "");
			return;
		}
		container.replaceChildren();
		const showLabels = paths.length > 0;
		primaryLabel?.toggleAttribute("hidden", !showLabels);
		if (primaryLabel !== null) {
			primaryLabel.textContent = this.activeFile?.split("/").at(-1) ?? "main";
		}

		for (const path of paths) {
			const file = this.project.findFile(path);
			if (file === undefined) continue;
			const group = this.createViewerAdditionalEditor(
				path,
				file.content,
				file.language,
			);
			const label = document.createElement("strong");
			label.setAttribute("data-tp-programming-viewer-file-label", "");
			label.textContent = path.split("/").at(-1) ?? path;
			group.prepend(label);
			container.append(group);
		}
	}

	private createViewerAdditionalEditor(
		path: string,
		content: string,
		language?: string,
	): HTMLElement {
		const group = document.createElement("div");
		group.setAttribute("data-tp-programming-viewer-editor-group", "");
		group.setAttribute("data-path", path);
		const editor = document.createElement("tp-code-editor") as TpCodeEditor;
		editor.setAttribute("filename", path);
		editor.setAttribute("language", language ?? inferLanguage(path));
		editor.setAttribute("word-wrap", "");
		editor.setValue(content);
		editor.addEventListener("tp-code-editor-change", () => {
			const currentFile = this.project.findFile(path);
			if (currentFile !== undefined) currentFile.content = editor.getValue();
		});
		group.append(editor);
		return group;
	}

	private createViewerButton(
		action: "code" | "output" | "console" | "editor-toolbar",
		icon: string,
		label: string,
		pressed = true,
	): HTMLElement {
		const button = document.createElement("tp-icon-button");
		button.setAttribute(`data-tp-programming-viewer-${action}`, "");
		button.setAttribute("name", icon);
		button.setAttribute("label", label);
		button.setAttribute("title", `Toggle ${label.toLowerCase()}`);
		button.setAttribute("size", "xs");
		button.setAttribute("aria-pressed", String(pressed));
		return button;
	}

	private updateViewerLayout(): void {
		if (!this.viewerMode) return;
		const simple = this.mode === "simple";
		const showCode = simple || this.viewerCodeVisible;
		const showOutput = simple || this.viewerOutputVisible;
		this.dataset.viewerMode = this.mode;
		this.consoleEl?.setAttribute("mode", this.mode);
		if (simple) this.editorEl?.removeAttribute("toolbar");
		const root = this.queryElement<HTMLElement>(
			"[data-tp-programming-viewer-root]",
		);
		const codePanel = this.queryElement<HTMLElement>(
			'[data-tp-programming-viewer-panel="code"]',
		);
		const outputPanel = this.queryElement<HTMLElement>(
			'[data-tp-programming-viewer-panel="output"]',
		);
		const codeButton = this.queryElement<HTMLElement>(
			"[data-tp-programming-viewer-code]",
		);
		const outputButton = this.queryElement<HTMLElement>(
			"[data-tp-programming-viewer-output]",
		);
		const consoleButton = this.queryElement<HTMLElement>(
			"[data-tp-programming-viewer-console]",
		);
		const editorToolbarButton = this.queryElement<HTMLElement>(
			"[data-tp-programming-viewer-editor-toolbar]",
		);
		const editorActions = this.queryElement<HTMLElement>(
			"[data-tp-programming-viewer-editor-actions]",
		);
		codePanel?.toggleAttribute("hidden", !showCode);
		outputPanel?.toggleAttribute("hidden", !showOutput);
		codeButton?.setAttribute("aria-pressed", String(showCode));
		outputButton?.setAttribute("aria-pressed", String(showOutput));
		this.consoleEl?.toggleAttribute("hidden", !this.viewerConsoleVisible);
		consoleButton?.setAttribute(
			"aria-pressed",
			String(this.viewerConsoleVisible),
		);
		editorToolbarButton?.toggleAttribute("hidden", !showCode);
		editorActions?.toggleAttribute("hidden", !showCode);
		root?.setAttribute(
			"data-view",
			showCode && showOutput ? "both" : showCode ? "code" : "output",
		);
		this.syncViewerEditorHeights();
	}

	/** Keeps every visible programming-viewer editor at its intrinsic height. */
	private syncViewerEditorHeights(): void {
		if (!this.viewerMode || (!this.viewerCodeVisible && this.mode !== "simple"))
			return;

		const sync = (): void => {
			for (const editor of this.querySelectorAll<TpCodeEditor>(
				'[data-tp-programming-viewer-panel="code"] tp-code-editor',
			)) {
				editor.syncHeightToContent();
			}
		};

		sync();
		queueMicrotask(sync);
		requestAnimationFrame(sync);
		setTimeout(sync, 0);
	}

	private readonly handleViewerCodeClick = (): void => {
		if (this.viewerCodeVisible && !this.viewerOutputVisible) return;
		this.viewerCodeVisible = !this.viewerCodeVisible;
		this.updateViewerLayout();
	};

	private readonly handleViewerOutputClick = (): void => {
		if (this.viewerOutputVisible && !this.viewerCodeVisible) return;
		this.viewerOutputVisible = !this.viewerOutputVisible;
		this.updateViewerLayout();
	};

	private readonly handleViewerConsoleClick = (): void => {
		this.viewerConsoleVisible = !this.viewerConsoleVisible;
		this.updateViewerLayout();
	};

	private readonly handleViewerConsoleEntry = (): void => {
		if (!this.viewerMode) return;
		this.viewerConsoleVisible = true;
		this.updateViewerLayout();
	};

	private readonly handleViewerConsoleClear = (): void => {
		if (!this.viewerMode) return;
		this.viewerConsoleVisible = false;
		this.updateViewerLayout();
	};

	private readonly handleEditorToolbarClick = (): void => {
		const editors = this.viewerMode
			? Array.from(
					this.querySelectorAll<TpCodeEditor>(
						'[data-tp-programming-viewer-panel="code"] tp-code-editor',
					),
				)
			: this.editorEl === null
				? []
				: [this.editorEl];
		if (editors.length === 0) return;
		const next = !editors.some((editor) => editor.toolbar);
		for (const editor of editors) {
			editor.toolbar = next;
		}
		this.queryElement<HTMLElement>(
			"[data-tp-programming-viewer-editor-toolbar]",
		)?.setAttribute("aria-pressed", String(next));
		this.syncViewerEditorHeights();
	};

	/** Fits both viewer and playground output to live content, including subsequent shrinking. */
	private readonly handleViewerIframeLoad = (): void => {
		if (this.iframeEl === null) return;
		this.viewerIframeResizeObserver?.disconnect();
		this.viewerIframeResizeObserver = null;
		this.viewerIframeMutationObserver?.disconnect();
		this.viewerIframeMutationObserver = null;

		const sync = (): void => {
			const iframe = this.iframeEl;
			if (iframe === null) return;
			const documentNode = iframe.contentDocument;
			if (documentNode === null || documentNode.body === null) return;

			// Measure against a collapsed viewport so a previous run's height does
			// not become the next document's minimum height.
			// Reveal before measuring: hidden ancestors give shadow-DOM drawings zero height.
			iframe.hidden = false;
			iframe.style.blockSize = "1px";

			const visualElements = Array.from(documentNode.body.children).filter(
				(element) =>
					element.localName !== "script" && element.localName !== "style",
			);
			const hasVisualContent = visualElements.some(
				(element) =>
					(element.textContent?.trim() ?? "") !== "" ||
					element.matches("img, svg, canvas, video, audio, picture, iframe") ||
					element.querySelector(
						"img, svg, canvas, video, audio, picture, iframe",
					) !== null ||
					// Elements belong to the iframe's realm, so a parent-window
					// `instanceof HTMLElement` check would incorrectly reject them.
					element.getBoundingClientRect().height > 0,
			);
			const height = iframe.getContentHeight();
			iframe.toggleAttribute("hidden", !hasVisualContent);
			if (hasVisualContent) {
				iframe.style.blockSize = `${String(Math.max(1, height))}px`;
			} else {
				iframe.style.removeProperty("block-size");
			}
		};

		sync();
		const documentNode = this.iframeEl.contentDocument;
		if (
			documentNode !== null &&
			documentNode.body !== null &&
			typeof ResizeObserver !== "undefined"
		) {
			// Resizing the iframe changes the observed document itself. Defer
			// those writes until the next frame, outside ResizeObserver delivery,
			// and coalesce notifications from both observed elements.
			let pending = false;
			const observer = new ResizeObserver(() => {
				if (pending) return;
				pending = true;
				requestAnimationFrame(() => {
					pending = false;
					if (
						this.viewerIframeResizeObserver !== observer ||
						this.iframeEl?.contentDocument !== documentNode
					)
						return;
					sync();
				});
			});
			this.viewerIframeResizeObserver = observer;
			this.viewerIframeResizeObserver.observe(documentNode.body);
			if (documentNode.documentElement !== null) {
				this.viewerIframeResizeObserver.observe(documentNode.documentElement);
			}
		}
		if (
			documentNode !== null &&
			documentNode.body !== null &&
			typeof MutationObserver !== "undefined"
		) {
			this.viewerIframeMutationObserver = new MutationObserver(sync);
			this.viewerIframeMutationObserver.observe(documentNode.body, {
				childList: true,
				characterData: true,
				subtree: true,
			});
		}
	};

	private createToolbarIconButton(options: {
		action: "reset" | "test" | "run" | "editor-toolbar";
		icon: string;
		label: string;
		title?: string;
	}): HTMLElement {
		const button = document.createElement("tp-icon-button");

		button.setAttribute(`data-tp-playground-${options.action}`, "");
		button.setAttribute("section", "end");
		button.setAttribute("name", options.icon);
		button.setAttribute("label", options.label);
		button.setAttribute("title", options.title ?? options.label);
		button.setAttribute("size", "xs");

		if (options.action === "test" && !this.hasAvailableTestFile()) {
			button.setAttribute("disabled", "");
		}

		return button;
	}

	private syncTestButton(): void {
		const button = this.queryElement<HTMLElement>("[data-tp-playground-test]");

		if (button === null) {
			return;
		}

		const hasTestFile = this.hasAvailableTestFile();

		button.setAttribute("name", hasTestFile ? "test-tube" : "test-tube-off");
		button.setAttribute("title", hasTestFile ? "Test" : "No test file found");

		if (hasTestFile) {
			button.removeAttribute("disabled");
		} else {
			button.setAttribute("disabled", "");
		}
	}

	private bindEvents(): void {
		this.unbindEvents();

		this.queryElement<HTMLElement>(
			"[data-tp-playground-run]",
		)?.addEventListener("click", this.handleRunClick);

		this.queryElement<HTMLElement>(
			"[data-tp-playground-test]",
		)?.addEventListener("click", this.handleTestClick);

		this.queryElement<HTMLElement>(
			"[data-tp-playground-reset]",
		)?.addEventListener("click", this.handleResetClick);

		this.queryElement<HTMLElement>(
			"[data-tp-programming-viewer-code]",
		)?.addEventListener("click", this.handleViewerCodeClick);
		this.queryElement<HTMLElement>(
			"[data-tp-programming-viewer-output]",
		)?.addEventListener("click", this.handleViewerOutputClick);
		this.queryElement<HTMLElement>(
			"[data-tp-programming-viewer-console]",
		)?.addEventListener("click", this.handleViewerConsoleClick);
		this.queryElement<HTMLElement>(
			"[data-tp-programming-viewer-editor-toolbar]",
		)?.addEventListener("click", this.handleEditorToolbarClick);
		this.queryElement<HTMLElement>(
			"[data-tp-playground-editor-toolbar]",
		)?.addEventListener("click", this.handleEditorToolbarClick);

		this.filesystemEl?.addEventListener(
			"tp-filesystem-open",
			this.handleFilesystemOpen as EventListener,
		);

		this.filesystemEl?.addEventListener(
			"tp-filesystem-active",
			this.handleFilesystemActive as EventListener,
		);

		this.filesystemEl?.addEventListener(
			"tp-filesystem-change",
			this.handleFilesystemChange as EventListener,
		);

		this.filesystemEl?.addEventListener(
			"tp-filesystem-rename",
			this.handleFilesystemRename as EventListener,
		);

		this.editorEl?.addEventListener(
			"tp-code-editor-change",
			this.handleEditorChange,
		);

		this.iframeEl?.addEventListener(
			"tp-iframe-load",
			this.handleViewerIframeLoad,
		);
		this.consoleEl?.addEventListener(
			"tp-console-entry-add",
			this.handleViewerConsoleEntry,
		);
		this.consoleEl?.addEventListener(
			"tp-console-clear",
			this.handleViewerConsoleClear,
		);

		this.tabsEl?.addEventListener(
			"tp-tabs-select",
			this.handleTabsSelect as EventListener,
		);

		this.tabsEl?.addEventListener(
			"tp-tabs-close",
			this.handleTabsClose as EventListener,
		);

		this.toolbarStartMenuEl?.addEventListener(
			"tp-menu-item-select",
			this.handleToolbarMenuSelect as EventListener,
		);
	}

	private unbindEvents(): void {
		this.queryElement<HTMLElement>(
			"[data-tp-playground-run]",
		)?.removeEventListener("click", this.handleRunClick);

		this.queryElement<HTMLElement>(
			"[data-tp-playground-test]",
		)?.removeEventListener("click", this.handleTestClick);

		this.queryElement<HTMLElement>(
			"[data-tp-playground-reset]",
		)?.removeEventListener("click", this.handleResetClick);

		this.queryElement<HTMLElement>(
			"[data-tp-programming-viewer-code]",
		)?.removeEventListener("click", this.handleViewerCodeClick);
		this.queryElement<HTMLElement>(
			"[data-tp-programming-viewer-output]",
		)?.removeEventListener("click", this.handleViewerOutputClick);
		this.queryElement<HTMLElement>(
			"[data-tp-programming-viewer-console]",
		)?.removeEventListener("click", this.handleViewerConsoleClick);
		this.queryElement<HTMLElement>(
			"[data-tp-programming-viewer-editor-toolbar]",
		)?.removeEventListener("click", this.handleEditorToolbarClick);
		this.queryElement<HTMLElement>(
			"[data-tp-playground-editor-toolbar]",
		)?.removeEventListener("click", this.handleEditorToolbarClick);

		this.filesystemEl?.removeEventListener(
			"tp-filesystem-open",
			this.handleFilesystemOpen as EventListener,
		);

		this.filesystemEl?.removeEventListener(
			"tp-filesystem-active",
			this.handleFilesystemActive as EventListener,
		);

		this.filesystemEl?.removeEventListener(
			"tp-filesystem-change",
			this.handleFilesystemChange as EventListener,
		);

		this.filesystemEl?.removeEventListener(
			"tp-filesystem-rename",
			this.handleFilesystemRename as EventListener,
		);

		this.editorEl?.removeEventListener(
			"tp-code-editor-change",
			this.handleEditorChange,
		);

		this.iframeEl?.removeEventListener(
			"tp-iframe-load",
			this.handleViewerIframeLoad,
		);
		this.consoleEl?.removeEventListener(
			"tp-console-entry-add",
			this.handleViewerConsoleEntry,
		);
		this.consoleEl?.removeEventListener(
			"tp-console-clear",
			this.handleViewerConsoleClear,
		);

		this.tabsEl?.removeEventListener(
			"tp-tabs-select",
			this.handleTabsSelect as EventListener,
		);

		this.tabsEl?.removeEventListener(
			"tp-tabs-close",
			this.handleTabsClose as EventListener,
		);

		this.toolbarStartMenuEl?.removeEventListener(
			"tp-menu-item-select",
			this.handleToolbarMenuSelect as EventListener,
		);
	}

	private readonly handleRunClick = (): void => {
		void this.run();
	};

	private readonly handleTestClick = (): void => {
		void this.test();
	};

	private readonly handleResetClick = (): void => {
		this.reset();
	};

	private readonly handleFilesystemOpen = (
		event: CustomEvent<TpFilesystemPathDetail>,
	): void => {
		this.openFile(event.detail.path);
	};

	private readonly handleFilesystemActive = (
		event: CustomEvent<TpFilesystemPathDetail>,
	): void => {
		this.activeFile = event.detail.path;
		this.syncTabs();
		this.syncEditorFromActiveFile();
	};

	private readonly handleFilesystemChange = (
		event: CustomEvent<TpFilesystemChangeDetail>,
	): void => {
		this.fileSaveTargets.forEach((_target, path) => {
			if (!event.detail.files.some((file) => file.path === path))
				this.fileSaveTargets.delete(path);
		});
		this.project.setFiles(event.detail.files);
		this.syncEditorFromActiveFile();
		this.syncTestButton();
	};

	private readonly handleFilesystemRename = (
		event: CustomEvent<TpFilesystemRenameDetail>,
	): void => {
		this.fileSaveTargets.delete(event.detail.oldPath);
		this.fileSaveTargets.delete(event.detail.newPath);
		this.openFiles = this.openFiles.map((path) =>
			path === event.detail.oldPath ? event.detail.newPath : path,
		);

		if (this.activeFile === event.detail.oldPath) {
			this.activeFile = event.detail.newPath;
		}

		this.syncProjectFromFilesystem();
		this.syncTabs();
		this.syncEditorFromActiveFile();
		this.syncTestButton();
	};

	private readonly handleEditorChange = (event: Event): void => {
		if (this.isSyncingEditor || this.activeFile === null) {
			return;
		}

		const customEvent = event as CustomEvent<{ value?: string }>;
		const value = customEvent.detail.value;

		if (typeof value !== "string") {
			return;
		}

		const file = this.project.findFile(this.activeFile);

		if (file === undefined || file.readonly === true) {
			return;
		}

		file.content = value;
		this.filesystemEl?.writeFile(this.activeFile, value);
	};

	private readonly handleTabsSelect = (
		event: CustomEvent<TpTabsSelectDetail>,
	): void => {
		const path = event.detail.value;

		if (!this.openFiles.includes(path)) {
			return;
		}

		this.activeFile = path;
		this.filesystemEl?.setActivePath(path, false);
		this.syncEditorFromActiveFile();
	};

	private readonly handleTabsClose = (
		event: CustomEvent<TpTabsCloseDetail>,
	): void => {
		this.closeFile(event.detail.value);
	};

	private readonly handleToolbarMenuSelect = (
		event: CustomEvent<{ item?: HTMLElement }>,
	): void => {
		const item = event.detail.item;

		if (!(item instanceof HTMLElement)) {
			return;
		}

		if (item.hasAttribute("data-tp-playground-language-help")) {
			this.showLanguageHelp();
			return;
		}

		const exampleId = item.getAttribute("data-tp-playground-example-id");
		if (typeof exampleId === "string" && exampleId !== "") {
			void this.loadExample(exampleId);
			return;
		}

		const action = item.getAttribute("data-tp-playground-action");

		if (typeof action !== "string" || action === "") {
			return;
		}

		if (this.handleAdditionalToolbarAction(action)) {
			return;
		}

		switch (action) {
			case "open-source-file":
				void this.openSourceFile();
				break;

			case "save-file":
				void this.saveFile();
				break;

			case "save-file-as":
				void this.saveFileAs();
				break;
			case "run-project":
				void this.run();
				break;

			case "test-project":
				void this.test();
				break;

			case "reset-project":
				this.reset();
				break;

			case "new-project":
				this.newProject();
				break;

			case "clear-project":
				this.clearProject();
				break;

			case "load-memory":
				this.loadFromMemory();
				break;
			case "save-memory":
				this.saveInMemory();
				break;

			case "clear-memory":
				this.clearMemory();
				break;

			case "import-disk":
				void this.importProject();
				break;

			case "export-disk":
				void this.exportProject();
				break;

			default:
				break;
		}
	};

	/** Saves the current project in browser storage for this language and refreshes its menu entry. */
	public saveInMemory(): void {
		this.syncProjectFromFilesystem();
		try {
			localStorage.setItem(
				`tp-playground-memory:${this.getPlaygroundKind()}`,
				JSON.stringify(this.getProject().toJSON()),
			);
			this.refreshMemoryMenu();
		} catch (error) {
			this.reportError(error, "Unable to save the project in browser storage.");
		}
	}
	/** Restores this language's saved project from browser storage without running it. */
	public loadFromMemory(): void {
		try {
			const saved = localStorage.getItem(
				`tp-playground-memory:${this.getPlaygroundKind()}`,
			);
			if (!saved) return;
			this.setProject(
				this.createProjectFromData(
					parsePlaygroundProjectJson(JSON.parse(saved)),
				),
			);
			this.consoleEl?.clear();
			this.afterProjectLoaded();
		} catch (error) {
			this.reportError(error, "Unable to restore the saved project.");
		}
	}
	/** Removes this language's saved project while retaining the current project. */
	public clearMemory(): void {
		try {
			localStorage.removeItem(
				`tp-playground-memory:${this.getPlaygroundKind()}`,
			);
			this.refreshMemoryMenu();
		} catch (error) {
			this.reportError(error, "Unable to clear the saved project.");
		}
	}
	private refreshMemoryMenu(): void {
		const list = this.querySelector("[data-tp-playground-memory-list]");
		if (!list) return;
		const item = document.createElement("li");
		let saved = false;
		try {
			saved = Boolean(
				localStorage.getItem(
					`tp-playground-memory:${this.getPlaygroundKind()}`,
				),
			);
		} catch {
			/* Storage can be unavailable in embedded documents. */
		}
		if (saved) {
			item.textContent = "Saved project";
			item.setAttribute("data-tp-playground-action", "load-memory");
		} else {
			item.textContent = "No saved project";
			item.setAttribute("aria-disabled", "true");
		}
		list.replaceChildren(item);
		this.toolbarStartMenuEl?.refresh();
	}

	/** Replaces the current project with the language's starter project and clears its console. */
	public newProject(): void {
		this.setProject(this.createNewProject());
		this.consoleEl?.clear();
	}
	/** Replaces the current project with an empty project and clears its console. */
	public clearProject(): void {
		this.setProject(this.createClearProject());
		this.consoleEl?.clear();
	}
	/** Opens a local source chooser and creates a project from the selected file. */
	public async openSourceFile(): Promise<void> {
		await this.openLocalProject(false);
	}
	/** Opens a JSON project chooser and replaces the current project with the selected project. */
	public async importProject(): Promise<void> {
		await this.openLocalProject(true);
	}
	/** Saves the active source file, reusing its previously chosen destination when available. */
	public async saveFile(): Promise<void> {
		await this.saveActiveFile(false);
	}
	/** Prompts for a new destination for the active source file. */
	public async saveFileAs(): Promise<void> {
		await this.saveActiveFile(true);
	}
	/** Saves all files and language settings as a JSON project. */
	public async exportProject(): Promise<void> {
		await this.exportLocalProject();
	}
	/** Opens the language reference drawer for this playground. */
	public showLanguageHelp(): void {
		this.languageDrawerEl?.setContent(this.getLanguageHelp());
		this.languageDrawerEl?.show();
	}

	/** Opens a local project chooser; true selects project JSON. */
	async openLocalProject(jsonProject: boolean): Promise<void> {
		this.fileChooserController?.abort();
		const controller = new AbortController();
		this.fileChooserController = controller;
		const previousProject = this.project;
		try {
			const file = await choosePlaygroundFile(
				this,
				jsonProject
					? ".json"
					: playgroundSourceAccept(this.getPlaygroundKind()),
				controller.signal,
			);
			if (file === null) return;
			const content = await file.text();
			if (controller.signal.aborted || this.project !== previousProject) return;
			const data = jsonProject
				? parsePlaygroundProjectJson(JSON.parse(content))
				: createSingleSourceProject(
						file.name,
						content,
						this.getPlaygroundKind(),
					);
			this.configuredProjectRevision++;
			this.setProject(this.createProjectFromData(data));
			this.consoleEl?.clear();
			this.afterProjectLoaded();
		} catch (error: unknown) {
			if (controller.signal.aborted || this.project !== previousProject) return;
			this.consoleEl?.clear();
			this.reportError(error, "Unable to open the selected file.");
		}
	}

	/** Saves the active file; true requests a new destination. */
	async saveActiveFile(saveAs: boolean): Promise<void> {
		this.syncProjectFromFilesystem();
		const project = this.project;
		const file =
			this.activeFile === null ? undefined : project.findFile(this.activeFile);
		if (file === undefined) return;
		const filename = file.path.split("/").at(-1) ?? "source.txt";
		const extension = /\.[^.]+$/.exec(filename)?.[0] ?? ".txt";
		const blob = new Blob([file.content], { type: "text/plain;charset=utf-8" });
		try {
			const target =
				(!saveAs && this.fileSaveTargets.get(file.path)) ||
				(await chooseSaveTarget({
					suggestedName: filename,
					description: "Source file",
					mimeType: "text/plain",
					extension,
				}));
			if (target === null) return;
			await saveBlob(blob, target);
			if (this.project === project) this.fileSaveTargets.set(file.path, target);
		} catch (error: unknown) {
			this.reportError(error, "Unable to save the source file.");
		}
	}

	/** Downloads the complete project. */
	async exportLocalProject(): Promise<void> {
		this.syncProjectFromFilesystem();
		const project = this.getProject();
		try {
			const target = await chooseSaveTarget({
				suggestedName: `${project.name || "project"}.json`,
				description: "Playground project",
				mimeType: "application/json",
				extension: ".json",
			});
			if (target !== null)
				await saveBlob(
					new Blob([JSON.stringify(project.toJSON(), null, 2)], {
						type: "application/json",
					}),
					target,
				);
		} catch (error: unknown) {
			this.reportError(error, "Unable to export the project.");
		}
	}

	private syncEditorFromActiveFile(): void {
		const canSave =
			this.activeFile !== null &&
			this.project.findFile(this.activeFile) !== undefined;
		this.toolbarStartMenuEl?.querySelectorAll<HTMLElement>(
			'[data-tp-playground-action="save-file"], [data-tp-playground-action="save-file-as"]',
		);
		if (this.toolbarStartMenuEl) {
			for (const item of this.toolbarStartMenuEl.querySelectorAll<HTMLElement>(
				'[data-tp-playground-action="save-file"], [data-tp-playground-action="save-file-as"]',
			)) {
				item.setAttribute("aria-disabled", String(!canSave));
			}
		}
		if (this.editorEl === null) {
			return;
		}

		const file =
			this.activeFile !== null
				? this.project.findFile(this.activeFile)
				: undefined;

		if (file !== undefined) {
			this.editorEl.setAttribute(
				"language",
				file.language ?? inferLanguage(file.path),
			);
			this.editorEl.setAttribute("filename", file.path);
		} else {
			this.editorEl.removeAttribute("language");
			this.editorEl.removeAttribute("filename");
		}

		this.isSyncingEditor = true;
		this.editorEl.setValue(file?.content ?? "");
		this.isSyncingEditor = false;

		if (file?.readonly === true) {
			this.editorEl.setAttribute("readonly", "");
		} else {
			this.editorEl.removeAttribute("readonly");
		}

		// Keep the shared editor inside the active file's accessible tab panel.
		// Its value is synchronized before reconnecting it to avoid loading stale code.
		if (!this.viewerMode && this.tabsEl !== null) {
			const panel = Array.from(
				this.tabsEl.querySelectorAll<HTMLElement>(
					":scope > [data-tp-tabpanel]",
				),
			).find(
				(element) => element.getAttribute("data-value") === this.activeFile,
			);
			if (panel && this.editorEl.parentElement !== panel) {
				panel.append(this.editorEl);
			} else if (!panel) {
				this.editorEl.remove();
			}
		}
	}

	private syncTabs(): void {
		if (this.tabsEl === null) {
			return;
		}

		this.tabsEl.clearTabs();

		for (const path of this.openFiles) {
			const label = path.split("/").filter(Boolean).at(-1) ?? path;
			this.tabsEl.addTab(path, label);
		}

		if (this.activeFile !== null) {
			this.tabsEl.selectValue(this.activeFile);
		}

		this.tabsEl.refresh();
	}

	private readonly handleWindowMessage = (event: MessageEvent): void => {
		if (!(this.iframeEl instanceof HTMLElement)) {
			return;
		}

		const iframe = this.iframeEl as HTMLElement & {
			contentWindow?: Window | null;
		};

		if (event.source !== iframe.contentWindow) {
			return;
		}

		const data = event.data;

		if (typeof data !== "object" || data === null) {
			return;
		}

		const message = data as Partial<TpPlaygroundWindowMessage>;

		if (message.type === "tp-playground-console-clear") {
			if (this.inlineConsoleOutput)
				iframe.contentWindow?.document
					.querySelector("[data-tp-inline-messages]")
					?.remove();
			this.consoleEl?.clear();
			return;
		}

		if (
			message.type === "tp-playground-console-entry" &&
			typeof message.kind === "string" &&
			Array.isArray(message.values)
		) {
			if (this.inlineConsoleOutput) {
				if (message.kind !== "group-end")
					this.appendInlineOutput(message.values);
			} else this.consoleEl?.addEntry(message.kind, message.values);
		}
	};

	private reportError(error: unknown, fallback: string): void {
		const message = error instanceof Error ? error.message : fallback;

		if (this.inlineConsoleOutput) this.appendInlineOutput([message]);
		else this.consoleEl?.error(new Error(message));

		this.dispatchEvent(
			new CustomEvent("tp-playground-error", {
				bubbles: true,
				detail: {
					message,
				},
			}),
		);
	}

	/** Shows or hides the code panel while retaining at least one visible panel. */
	toggleCode(): void {
		this.handleViewerCodeClick();
	}

	/** Shows or hides the output panel while retaining at least one visible panel. */
	toggleOutput(): void {
		this.handleViewerOutputClick();
	}

	/** Shows or hides the console panel. */
	toggleConsole(): void {
		this.handleViewerConsoleClick();
	}

	/** Shows or hides the active editor toolbar. */
	toggleEditorToolbar(): void {
		this.handleEditorToolbarClick();
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-playground": TpPlayground;
	}
}
