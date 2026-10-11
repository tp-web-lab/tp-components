import { dedent as e } from "../utilities/code.js";
import { t } from "./base.js";
import "./icon-button.js";
import "./icon.js";
import { resolveComponentSourceUrl as n } from "../utilities/source-url.js";
import "./toolbar.js";
import "./button.js";
import "./drawer.js";
import "./dropdown.js";
import "./splitter.js";
import "./console.js";
import "./code-editor.js";
import "./filesystem.js";
import "./iframe.js";
import "./menu.js";
import "./switcher.js";
import "./tabs.js";
import { chooseSaveTarget as r, saveBlob as i } from "../utilities/save-file.js";
import { TpPlaygroundExampleLoader as a, inferLanguage as o } from "../components/playground/playground-example-loader.js";
import { choosePlaygroundFile as s } from "../components/playground/playground-local-file.js";
import { loadPlaygroundRepository as c, parsePlaygroundProjectJson as l, readInlinePlaygroundProjectJson as u } from "../components/playground/playground-project-loader.js";
import { createSingleSourceProject as d, loadPlaygroundSource as f, playgroundSourceAccept as p } from "../components/playground/playground-source-loader.js";
import { TpProject as m } from "../components/playground/project.js";
//#region src/components/playground/playground.css?inline
var h = "tp-playground,tp-html-playground,tp-javascript-viewer,tp-typescript-viewer,tp-python-viewer,tp-sql-viewer,tp-prolog-viewer{box-sizing:border-box;min-block-size:100vh;inline-size:100%;font-family:system-ui,sans-serif;display:block}tp-playground,tp-html-playground,tp-javascript-playground,tp-typescript-playground,tp-python-playground,tp-sql-playground,tp-prolog-playground,tp-markdown-playground,tp-asciidoc-playground,tp-restructuredtext-playground{box-sizing:border-box;inline-size:auto;min-inline-size:0;max-inline-size:100%;display:flow-root}tp-javascript-viewer,tp-typescript-viewer,tp-python-viewer,tp-sql-viewer,tp-prolog-viewer{min-block-size:0;inline-size:auto;min-inline-size:0;max-inline-size:100%;overflow:hidden}[data-tp-programming-viewer-root]{border:1px solid var(--tp-border-color,#ddd);box-sizing:border-box;border-radius:.5rem;gap:0;min-inline-size:0;max-inline-size:100%;overflow:hidden}[data-tp-playground-root][data-tp-programming-viewer-root]{gap:0}[data-tp-programming-viewer-toolbar]{border-block-end:1px solid var(--tp-border-color,#ddd);box-sizing:border-box;align-items:center;gap:.25rem;inline-size:100%;min-inline-size:0;max-inline-size:100%;padding:.25rem .5rem;display:flex;overflow:hidden}[data-tp-programming-viewer-language]{margin-inline-end:.25rem;font-weight:600}[data-tp-programming-viewer-toolbar] tp-icon-button[aria-pressed=true]{background:var(--tp-brand-fill-softer,#eff6ff);color:var(--tp-brand-text-colorful,#2563eb);border-radius:.375rem}[data-tp-programming-viewer-spacer]{flex:auto}[data-tp-programming-viewer-editor-actions]{align-items:center;gap:.25rem;display:flex}[data-tp-programming-viewer-editor-actions][hidden]{display:none}[data-tp-programming-viewer-panels]{align-items:flex-start;inline-size:100%;min-inline-size:0;max-inline-size:100%}[data-tp-programming-viewer-panel]{min-inline-size:0;max-inline-size:100%;overflow:hidden}[data-tp-programming-viewer-panel][hidden]{display:none}[data-tp-programming-viewer-panel=code] tp-code-editor{inline-size:100%;min-inline-size:0;max-inline-size:100%;margin:0;overflow:hidden}[data-tp-programming-viewer-editor-group]{gap:0;min-inline-size:0;display:grid}[data-tp-programming-viewer-editor-group]+[data-tp-programming-viewer-editor-group],[data-tp-programming-viewer-additional-editors]:not(:empty){border-block-start:1px solid var(--tp-border-color,#ddd)}[data-tp-programming-viewer-additional-editors]{grid-template-columns:minmax(0,1fr);grid-auto-flow:row;min-inline-size:0;display:grid}[data-tp-programming-viewer-file-tabs]{min-inline-size:0;margin-block:.25rem}[data-tp-programming-viewer-file-tabs] [data-tp-tab-close]{display:none}[data-tp-programming-viewer-file-tabs] [data-tp-programming-viewer-editor-group]{border:0}[data-tp-programming-viewer-file-label]{background:var(--tp-paper-color,#fff);color:var(--tp-text-muted,#374151);padding:.3rem .5rem;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:.8rem}[data-tp-programming-viewer-file-label][hidden]{display:none}[data-tp-programming-viewer-panel=output]{box-sizing:border-box;gap:0;padding:6px;display:grid}[data-tp-programming-viewer-panel=output] tp-iframe,[data-tp-programming-viewer-panel=output] tp-console{border:0;border-radius:0;margin:0}[data-tp-programming-viewer-root] [data-tp-programming-viewer-panel=output] tp-iframe{min-block-size:0}[data-tp-programming-viewer-root] [data-tp-programming-viewer-panel=output] tp-iframe[hidden]{display:none}[data-tp-programming-viewer-root] [data-tp-programming-viewer-panel=output] tp-console{max-block-size:none;overflow:visible}[data-tp-programming-viewer-panel=output] tp-console{border-block-start:1px solid var(--tp-border-color,#ddd)}[data-tp-programming-viewer-panel=output] tp-console[hidden]{display:none}[data-tp-programming-viewer-root][data-view=both] [data-tp-programming-viewer-panel=output]{border-inline-start:1px solid var(--tp-border-color,#ddd)}@media (width<=60rem){[data-tp-programming-viewer-root][data-view=both] [data-tp-programming-viewer-panel=output]{border-block-start:1px solid var(--tp-border-color,#ddd);border-inline-start:0}}[data-tp-playground-root]{gap:.25rem;inline-size:100%;min-inline-size:0;display:grid}[data-tp-playground-switcher]{inline-size:100%}[data-tp-playground-work-group],[data-tp-playground-preview-group]{flex-direction:column;gap:.75rem;min-inline-size:0;display:flex}[data-tp-playground-work-group]{flex:2 36rem;align-self:flex-start}[data-tp-playground-preview-group]{flex:28rem;align-self:flex-start}[data-tp-playground-toolbar]{box-sizing:border-box;flex-wrap:wrap;inline-size:100%;min-inline-size:0;position:static}[data-tp-playground-toolbar]>[data-toolbar-start]{flex:auto;min-inline-size:0;max-inline-size:100%}[data-tp-playground-toolbar]>[data-toolbar-end]{margin-inline-start:auto}[data-tp-playground-toolbar] tp-menu>ul[role=menu]{flex-wrap:wrap}[data-tp-playground-toolbar] tp-menu{display:block}[data-tp-playground-toolbar] tp-menu ul{margin:0;padding:0;list-style:none}[data-tp-playground-toolbar] tp-menu li{list-style:none}[data-tp-playground-toolbar] tp-menu li::marker{content:\"\"}[data-tp-playground-main-splitter]{border:1px solid var(--tp-border-color,#ddd);border-radius:.5rem;block-size:auto;inline-size:100%;display:block;overflow:hidden}[data-tp-playground-main-splitter]>dl{block-size:auto}[data-tp-playground-panel]{flex-direction:column;min-block-size:0;min-inline-size:0;display:flex;overflow:hidden}[data-tp-playground-panel=filesystem]{background:var(--tp-filesystem-bg,#fafafa);border-inline-end:1px solid var(--tp-border-color,#ddd)}[data-tp-playground-panel=editor]{background:#fff;align-self:start}tp-filesystem{block-size:100%;inline-size:100%;overflow:auto}[data-tp-playground-editor-panel]{flex-direction:column;block-size:auto;min-block-size:0;inline-size:100%;min-inline-size:0;display:flex}[data-tp-playground-editor-panel] tp-tabs{flex-direction:column;flex:auto;min-block-size:0;margin:0;margin-block-end:0;display:flex}[data-tp-playground-editor-panel] tp-tabs>[data-tp-tablist]{flex:none}[data-tp-playground-editor-panel] tp-tabs>[role=tabpanel]{flex:auto;min-block-size:0;padding:0;overflow:hidden}[data-tp-playground-editor-panel] tp-tabs>[role=tabpanel]:not([hidden]){flex-direction:column;display:flex}[data-tp-playground-editor-panel] tp-code-editor{flex:none;min-block-size:0;inline-size:100%;margin:0;overflow:hidden}[data-tp-playground-editor-panel] tp-code-editor>[data-tp-code-editor],[data-tp-playground-editor-panel] tp-code-editor .cm-editor,[data-tp-playground-editor-panel] tp-code-editor .cm-scroller{min-block-size:0}[data-tp-playground-editor-panel] tp-code-editor .cm-scroller{overflow:auto}[data-tp-extension-check]{inline-size:1.25rem;display:inline-block}tp-iframe[data-tp-playground-preview]{border:1px solid var(--tp-border-color,#ddd);background:#fff;border-radius:.5rem;min-block-size:0;inline-size:100%;display:block}tp-iframe[data-tp-playground-preview][hidden]{display:none}tp-console[data-tp-playground-console]{border:1px solid var(--tp-border-color,#ddd);border-radius:.5rem;max-block-size:16rem;inline-size:100%;display:block;overflow:auto}[data-tp-programming-viewer-panel=output] tp-iframe[data-tp-playground-preview]{border:0;border-radius:0}[data-tp-playground-language-help]{min-block-size:1.5rem;min-inline-size:1.5rem}", g = /* @__PURE__ */ new Map([
	["asciidoc", "asciidoc"],
	["html", "html"],
	["javascript", "js"],
	["markdown", "markdown"],
	["prolog", "prolog"],
	["python", "py"],
	["restructuredtext", "restructuredtext"],
	["sql", "sql"],
	["typescript", "ts"]
]), _ = class _ extends t {
	static styleId = "tp-playground-styles";
	isSyncingEditor = !1;
	configuredProjectRevision = 0;
	fileSaveTargets = /* @__PURE__ */ new Map();
	fileChooserController = null;
	cleanupExecution = null;
	viewerIframeResizeObserver = null;
	viewerIframeMutationObserver = null;
	exampleLoader = null;
	project;
	initialProject;
	filesystemEl = null;
	editorEl = null;
	iframeEl = null;
	tabsEl = null;
	consoleEl = null;
	toolbarStartMenuEl = null;
	languageDrawerEl = null;
	viewerCodeVisible = !1;
	viewerOutputVisible = !0;
	viewerConsoleVisible = !1;
	openFiles = [];
	activeFile = null;
	static get observedAttributes() {
		return [
			...t.observedAttributes,
			"repository",
			"src"
		];
	}
	get repository() {
		return this.getAttribute("repository") ?? "";
	}
	set repository(e) {
		if (e === "") {
			this.removeAttribute("repository");
			return;
		}
		this.setAttribute("repository", e);
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		if (e === "") {
			this.removeAttribute("src");
			return;
		}
		this.setAttribute("src", e);
	}
	getLanguageIconName() {
		return "code";
	}
	get viewerMode() {
		return !1;
	}
	getViewerLanguageLabel() {
		let e = this.getPlaygroundKind();
		return e === "javascript" ? "JavaScript" : e === "typescript" ? "TypeScript" : e === "sql" ? "SQL" : e.charAt(0).toUpperCase() + e.slice(1);
	}
	getViewerAdditionalFilePaths(e) {
		return [];
	}
	get usesViewerEditorTabs() {
		return !1;
	}
	getLanguageHelp() {
		return "<p>No help available.</p>";
	}
	getAdditionalToolbarMenuItems() {
		return "";
	}
	getExampleMenuItems() {
		return "<li aria-disabled=\"true\">No examples</li>";
	}
	get supportsTestExecution() {
		return !1;
	}
	get exampleCategory() {
		return "playgrounds";
	}
	get exampleGroup() {
		return g.get(this.getPlaygroundKind()) ?? this.getPlaygroundKind();
	}
	getPlaygroundKind() {
		return "base";
	}
	createProjectFromExample(e, t) {
		return new m({
			name: e.name ?? e.label ?? e.id ?? "Untitled project",
			entry: e.entry,
			test: e.test,
			files: t
		});
	}
	getExampleLoader() {
		return this.exampleLoader === null && (this.exampleLoader = new a({
			category: this.exampleCategory,
			group: this.exampleGroup,
			createProject: (e, t) => this.createProjectFromExample(e, t)
		})), this.exampleLoader;
	}
	afterProjectLoaded() {}
	async syncExamplesMenu() {
		let e = this.queryElement("[data-tp-playground-example-list]");
		if (e !== null) try {
			let t = await this.getExampleLoader().getExamples();
			if (e.replaceChildren(), t.length === 0) {
				let t = document.createElement("li");
				t.setAttribute("aria-disabled", "true"), t.textContent = "No examples", e.append(t);
				return;
			}
			for (let n of t) {
				let t = document.createElement("li");
				t.setAttribute("data-tp-playground-example-id", n.id), t.textContent = n.label, e.append(t);
			}
			this.toolbarStartMenuEl?.refresh();
		} catch (t) {
			let n = t instanceof Error ? t.message : "Unknown examples loading error";
			console.warn("Unable to load examples", t), this.consoleEl?.warn(n), e.replaceChildren();
			let r = document.createElement("li");
			r.setAttribute("aria-disabled", "true"), r.textContent = "Unable to load examples", e.append(r), this.toolbarStartMenuEl?.refresh();
		}
	}
	async loadExample(e) {
		let t = await this.getExampleLoader().loadProject(e);
		this.setProject(t), this.consoleEl?.clear(), await this.run(), this.afterProjectLoaded();
	}
	handleAdditionalToolbarAction(e) {
		return !1;
	}
	constructor() {
		super(), this.project = this.createEmptyProject(), this.initialProject = this.project.clone();
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(_.styleId, h), this.ensureLayout(), this.bindEvents();
		let e = () => {
			this.isConnected && (this.setProject(this.createInitialProject()), this.loadConfiguredProject(), this.syncExamplesMenu());
		};
		this.viewerMode ? queueMicrotask(e) : e(), window.addEventListener("message", this.handleWindowMessage);
	}
	disconnectedCallback() {
		this.configuredProjectRevision++, this.fileChooserController?.abort(), this.fileChooserController = null, this.unbindEvents(), this.viewerIframeResizeObserver?.disconnect(), this.viewerIframeResizeObserver = null, this.viewerIframeMutationObserver?.disconnect(), this.viewerIframeMutationObserver = null, this.cleanupExecution?.(), this.cleanupExecution = null, window.removeEventListener("message", this.handleWindowMessage);
	}
	getProject() {
		return this.project.clone();
	}
	setProject(e) {
		this.fileSaveTargets.clear(), this.project = this.normalizeProject(e), this.initialProject = this.project.clone(), this.openFiles = [], this.activeFile = null, this.iframeEl?.removeAttribute("srcdoc"), this.syncFilesystemFromProject();
		let t = this.viewerMode ? this.resolveViewerPrimaryFile(this.project) : this.resolveEntry(this.project);
		t !== null && this.openFile(t), this.syncTabs(), this.syncEditorFromActiveFile(), this.syncViewerAdditionalEditors(), this.syncTestButton();
	}
	reset() {
		this.consoleEl?.clear(), this.setProject(this.initialProject.clone());
	}
	async run() {
		if (this.syncProjectFromFilesystem(), this.iframeEl !== null) {
			this.cleanupExecution?.(), this.cleanupExecution = null;
			try {
				let e = await this.buildExecutionDocument(this.project);
				this.cleanupExecution = e.cleanup ?? null, this.consoleEl?.clear(), this.viewerIframeResizeObserver?.disconnect(), this.viewerIframeResizeObserver = null, this.viewerIframeMutationObserver?.disconnect(), this.viewerIframeMutationObserver = null, this.iframeEl.style.blockSize = "1px", this.iframeEl.hidden = !1, this.iframeEl.setAttribute("srcdoc", e.html), this.editorEl?.syncHeightToContent();
			} catch (e) {
				this.reportError(e, "Unknown execution error");
			}
		}
	}
	async test() {
		if (this.syncProjectFromFilesystem(), this.iframeEl !== null) try {
			let e = await this.buildTestDocument(this.project);
			this.cleanupExecution?.(), this.cleanupExecution = e.cleanup ?? null, this.viewerIframeResizeObserver?.disconnect(), this.viewerIframeResizeObserver = null, this.viewerIframeMutationObserver?.disconnect(), this.viewerIframeMutationObserver = null, this.iframeEl.style.blockSize = "1px", this.iframeEl.hidden = !1, this.iframeEl.setAttribute("srcdoc", e.html);
		} catch (e) {
			this.reportError(e, "Tests are not supported.");
		}
	}
	async createTestDocument(e) {
		this.syncProjectFromFilesystem();
		let t = this.getProject();
		return t.files = t.files.filter((t) => t.path !== e.path), t.files.push({ ...e }), t.test = e.path, this.buildTestDocument(t);
	}
	openFile(e) {
		this.project.findFile(e) !== void 0 && (this.openFiles.includes(e) || (this.openFiles = [...this.openFiles, e]), this.activeFile = e, this.filesystemEl?.openFile(e, !1), this.syncTabs(), this.syncEditorFromActiveFile());
	}
	closeFile(e) {
		this.openFiles = this.openFiles.filter((t) => t !== e), this.activeFile === e && (this.activeFile = this.openFiles.at(-1) ?? null), this.filesystemEl?.closeFile(e), this.syncTabs(), this.syncEditorFromActiveFile();
	}
	attributeChangedCallback(e, t, n) {
		(e === "src" || e === "repository") && this.isConnected && this.loadConfiguredProject(!0);
	}
	createNewProject() {
		return this.createEmptyProject();
	}
	createClearProject() {
		return new m({
			name: "Untitled project",
			files: []
		});
	}
	createInitialProject() {
		let t = this.createEmptyProject();
		if (!this.viewerMode) return t;
		let n = this.getPlaygroundKind(), r = Array.from(this.querySelectorAll(`:scope > script:is([type="tp/${n}"], [type="tp/${n}-viewer"])`));
		for (let [n, i] of r.entries()) {
			let r = i.getAttribute("filename")?.trim() ?? "", a = r === "" ? n === 0 ? t.entry : void 0 : r.startsWith("/") ? r : `/${r}`;
			if (a === void 0) continue;
			let s = t.findFile(a), c = e(i.textContent ?? "");
			s === void 0 ? t.files.push({
				path: a,
				language: o(a),
				content: c
			}) : s.content = c;
		}
		return t;
	}
	createProjectFromData(e) {
		let t = e.files.map((e) => {
			let t = e.path.startsWith("/") ? e.path : `/${e.path}`;
			return {
				...e,
				path: t,
				language: e.language ?? o(t)
			};
		});
		return this.createProjectFromRepository(e, t);
	}
	createProjectFromRepository(e, t) {
		return this.createProjectFromExample(e, t);
	}
	normalizeProject(e) {
		return e.clone();
	}
	async loadConfiguredProject(e = !1) {
		let t = ++this.configuredProjectRevision;
		this.consoleEl?.clear();
		try {
			let r = this.src.trim();
			if (r !== "") {
				let e = await f(n(this, r).href, this.getPlaygroundKind());
				return t === this.configuredProjectRevision ? (this.setProject(this.createProjectFromData(e)), await this.run(), this.afterProjectLoaded(), this.dispatchEvent(new CustomEvent("tp-playground-src-load", {
					bubbles: !0,
					detail: {
						src: r,
						project: this.getProject()
					}
				})), !0) : !1;
			}
			let i = this.repository.trim();
			if (i !== "") {
				let e = await c(n(this, i).href);
				return t === this.configuredProjectRevision ? (this.setProject(this.createProjectFromRepository(e.metadata, e.files)), await this.run(), this.afterProjectLoaded(), this.dispatchEvent(new CustomEvent("tp-playground-repository-load", {
					bubbles: !0,
					detail: {
						repository: i,
						project: this.getProject()
					}
				})), !0) : !1;
			}
			let a = u(this);
			if (a !== null) return this.setProject(this.createProjectFromData(a)), await this.run(), this.afterProjectLoaded(), !0;
			if (e) return this.setProject(this.createInitialProject()), await this.run(), this.afterProjectLoaded(), !0;
		} catch (e) {
			if (t !== this.configuredProjectRevision) return !1;
			let n = e instanceof Error ? e.message : "Unable to load project.";
			this.consoleEl?.clear(), this.consoleEl?.error(n), console.error(e);
		}
		return !1;
	}
	resolveEntry(e) {
		return typeof e.entry == "string" && e.findFile(e.entry) !== void 0 ? e.entry : e.files[0]?.path ?? null;
	}
	resolveViewerPrimaryFile(e) {
		return this.resolveEntry(e);
	}
	async buildTestDocument(e) {
		throw Error("Tests are not supported by this playground.");
	}
	syncProjectFromFilesystem() {
		this.filesystemEl !== null && (this.project.setFiles(this.filesystemEl.getFiles()), this.syncTestButton());
	}
	hasAvailableTestFile(e = this.project) {
		return this.supportsTestExecution ? typeof e.test == "string" && e.test !== "" && e.findFile(e.test) !== void 0 || e.files.some((e) => /\.(?:test|tests|spec)\.[^/.]+$/i.test(e.path)) : !1;
	}
	syncToolbar() {
		let e = this.toolbarStartMenuEl;
		if (e === null) return;
		let t = e.querySelector("[data-tp-playground-additional-menu]");
		t instanceof HTMLLIElement && (t.outerHTML = this.getAdditionalToolbarMenuItems(), this.toolbarStartMenuEl = this.queryElement("[data-tp-playground-toolbar-start-menu]"), this.bindEvents());
	}
	syncFilesystemFromProject() {
		this.filesystemEl?.setFiles(this.project.files);
	}
	createConsoleBridgeScript() {
		return "\n<script>\n(() => {\n  const serialize = (value) => {\n    if (value instanceof Error) {\n      return {\n        name: value.name,\n        message: value.message,\n        stack: value.stack,\n      };\n    }\n\n    if (value instanceof Date) {\n      return value.toISOString();\n    }\n\n    if (typeof value === 'bigint') {\n      return String(value) + 'n';\n    }\n\n    if (typeof value === 'function') {\n      return '[Function ' + (value.name || 'anonymous') + ']';\n    }\n\n    try {\n      JSON.stringify(value);\n      return value;\n    } catch {\n      return String(value);\n    }\n  };\n\n  const postEntry = (kind, values) => {\n    window.parent.postMessage(\n      {\n        type: 'tp-playground-console-entry',\n        kind,\n        values: values.map(serialize),\n      },\n      '*',\n    );\n  };\n\n  const methods = [\n    'log',\n    'info',\n    'warn',\n    'error',\n    'table',\n    'group',\n    'groupCollapsed',\n    'groupEnd',\n    'assert',\n    'count',\n    'countReset',\n    'time',\n    'timeLog',\n    'timeEnd',\n  ];\n\n  const original = {};\n\n  for (const method of methods) {\n    original[method] = console[method]?.bind(console) ?? (() => {});\n  }\n\n  console.log = (...values) => {\n    original.log(...values);\n    postEntry('log', values);\n  };\n\n  console.info = (...values) => {\n    original.info(...values);\n    postEntry('info', values);\n  };\n\n  console.warn = (...values) => {\n    original.warn(...values);\n    postEntry('warn', values);\n  };\n\n  console.error = (...values) => {\n    original.error(...values);\n    postEntry('error', values);\n  };\n\n  console.table = (...values) => {\n    original.table(...values);\n    postEntry('table', values);\n  };\n\n  console.group = (...values) => {\n    original.group(...values);\n    postEntry('group', values);\n  };\n\n  console.groupCollapsed = (...values) => {\n    original.groupCollapsed(...values);\n    postEntry('group-collapsed', values);\n  };\n\n  console.groupEnd = () => {\n    original.groupEnd();\n    postEntry('group-end', []);\n  };\n\n  console.assert = (condition, ...values) => {\n    original.assert(condition, ...values);\n\n    if (!condition) {\n      postEntry('assert', values.length > 0 ? values : ['Assertion failed']);\n    }\n  };\n\n  console.count = (label = 'default') => {\n    original.count(label);\n    postEntry('count', [label]);\n  };\n\n  console.countReset = (label = 'default') => {\n    original.countReset(label);\n  };\n\n  console.time = (label = 'default') => {\n    original.time(label);\n  };\n\n  console.timeLog = (label = 'default', ...values) => {\n    original.timeLog(label, ...values);\n    postEntry('time', [label, ...values]);\n  };\n\n  console.timeEnd = (label = 'default') => {\n    original.timeEnd(label);\n    postEntry('time', [label]);\n  };\n\n  console.clear = () => {\n    window.parent.postMessage(\n      {\n        type: 'tp-playground-console-clear',\n      },\n      '*',\n    );\n  };\n})();\n<\/script>\n";
	}
	ensureLayout() {
		if (this.querySelector("[data-tp-playground-root]") !== null) {
			this.filesystemEl = this.queryElement("tp-filesystem"), this.editorEl = this.queryElement("tp-code-editor") ?? this.editorEl, this.iframeEl = this.queryElement("tp-iframe"), this.tabsEl = this.queryElement("tp-tabs"), this.consoleEl = this.queryElement("tp-console"), this.toolbarStartMenuEl = this.queryElement("[data-tp-playground-toolbar-start-menu]"), this.languageDrawerEl = this.queryElement("[data-tp-playground-language-drawer]");
			return;
		}
		if (this.viewerMode) {
			this.ensureViewerLayout();
			return;
		}
		let e = document.createElement("div");
		e.setAttribute("data-tp-playground-root", "");
		let t = document.createElement("tp-toolbar");
		t.setAttribute("data-tp-playground-toolbar", "");
		let n = document.createElement("tp-menu");
		n.setAttribute("data-tp-playground-toolbar-start-menu", ""), n.setAttribute("section", "start"), n.orientation = "horizontal", n.innerHTML = `
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
		let r = this.createToolbarIconButton({
			action: "reset",
			icon: "refresh",
			label: "Reset"
		}), i = this.createToolbarIconButton({
			action: "test",
			icon: this.hasAvailableTestFile() ? "test-tube" : "test-tube-off",
			label: "Test",
			title: this.hasAvailableTestFile() ? "Test" : "No test file found"
		}), a = this.createToolbarIconButton({
			action: "run",
			icon: "play",
			label: "Run"
		}), o = this.createToolbarIconButton({
			action: "editor-toolbar",
			icon: "keyboard-f1",
			label: "Toggle editor toolbar",
			title: "Toggle editor toolbar (F1)"
		}), s = document.createElement("tp-drawer");
		s.setAttribute("data-tp-playground-language-drawer", ""), s.setAttribute("placement", "end"), s.setAttribute("outside-click", ""), t.append(n, o, r, i, a);
		let c = document.createElement("tp-splitter");
		c.setAttribute("data-tp-playground-main-splitter", ""), c.setAttribute("axis", "horizontal"), c.setAttribute("position", "30%");
		let l = document.createElement("dl"), u = document.createElement("dt");
		u.textContent = "start";
		let d = document.createElement("dd");
		d.setAttribute("data-tp-playground-panel", "filesystem");
		let f = document.createElement("tp-filesystem");
		d.append(f);
		let p = document.createElement("dt");
		p.textContent = "end";
		let m = document.createElement("dd");
		m.setAttribute("data-tp-playground-panel", "editor");
		let h = document.createElement("div");
		h.setAttribute("data-tp-playground-editor-panel", "");
		let g = document.createElement("tp-tabs"), _ = document.createElement("tp-code-editor");
		_.setAttribute("line-numbers", ""), _.setAttribute("word-wrap", ""), h.append(g), m.append(h), l.append(u, d, p, m), c.append(l);
		let v = document.createElement("tp-iframe");
		v.setAttribute("data-tp-playground-preview", "");
		let y = document.createElement("tp-console");
		y.setAttribute("data-tp-playground-console", "");
		let b = document.createElement("tp-switcher");
		b.setAttribute("data-tp-playground-switcher", ""), b.setAttribute("threshold", "52rem"), b.setAttribute("gap", "0.75rem");
		let x = document.createElement("div");
		x.setAttribute("data-tp-playground-work-group", "");
		let S = document.createElement("div");
		S.setAttribute("data-tp-playground-preview-group", ""), x.append(c), S.append(v, y), b.append(x, S), e.append(t, b, s), this.append(e), this.filesystemEl = f, this.editorEl = _, this.iframeEl = v, this.tabsEl = g, this.consoleEl = y, this.toolbarStartMenuEl = n, this.languageDrawerEl = s, this.bindEvents();
	}
	ensureViewerLayout() {
		let e = document.createElement("div");
		e.setAttribute("data-tp-playground-root", ""), e.setAttribute("data-tp-programming-viewer-root", "");
		let t = document.createElement("div");
		t.setAttribute("data-tp-programming-viewer-toolbar", "");
		let n = document.createElement("tp-icon");
		n.setAttribute("data-tp-programming-viewer-language", ""), n.setAttribute("library", "components"), n.setAttribute("name", this.localName.replace(/^tp-/, "")), n.setAttribute("size", "1.5em"), n.setAttribute("role", "img"), n.setAttribute("aria-label", this.getViewerLanguageLabel()), n.setAttribute("title", this.getViewerLanguageLabel());
		let r = this.createViewerButton("code", "code", "Code"), i = this.createViewerButton("output", "eye-outline", "Render"), a = this.createViewerButton("console", "terminal", "Console", !1), o = this.createViewerButton("editor-toolbar", "keyboard-f1", "Editor toolbar", !1), s = document.createElement("span");
		s.setAttribute("data-tp-programming-viewer-spacer", "");
		let c = document.createElement("span");
		c.setAttribute("data-tp-programming-viewer-editor-actions", "");
		let l = this.createToolbarIconButton({
			action: "reset",
			icon: "refresh",
			label: "Reset"
		}), u = this.createToolbarIconButton({
			action: "run",
			icon: "play",
			label: "Run"
		});
		c.append(o, l, u), t.append(n, r, i, a, s, c);
		let d = document.createElement("tp-switcher");
		d.setAttribute("data-tp-programming-viewer-panels", ""), d.setAttribute("threshold", "60rem"), d.setAttribute("gap", "0");
		let f = document.createElement("section");
		f.setAttribute("data-tp-programming-viewer-panel", "code");
		let p = document.createElement("tp-code-editor");
		p.setAttribute("word-wrap", "");
		let m = document.createElement("div");
		m.setAttribute("data-tp-programming-viewer-editor-group", ""), m.setAttribute("data-tp-programming-viewer-primary-editor", "");
		let h = document.createElement("strong");
		h.setAttribute("data-tp-programming-viewer-file-label", ""), h.setAttribute("hidden", ""), m.append(h, p);
		let g = document.createElement("div");
		g.setAttribute("data-tp-programming-viewer-additional-editors", ""), this.usesViewerEditorTabs ? (g.append(m), f.append(g)) : f.append(m, g);
		let _ = document.createElement("section");
		_.setAttribute("data-tp-programming-viewer-panel", "output");
		let v = document.createElement("tp-iframe");
		v.setAttribute("data-tp-playground-preview", "");
		let y = document.createElement("tp-console");
		y.setAttribute("data-tp-playground-console", ""), _.append(v, y), d.append(f, _), e.append(t, d), this.append(e), this.editorEl = p, this.iframeEl = v, this.consoleEl = y, this.updateViewerLayout();
	}
	syncViewerAdditionalEditors() {
		if (!this.viewerMode) return;
		let e = this.queryElement("[data-tp-programming-viewer-additional-editors]"), t = this.queryElement("[data-tp-programming-viewer-primary-editor] [data-tp-programming-viewer-file-label]");
		if (e === null) return;
		let n = this.getViewerAdditionalFilePaths(this.project).filter((e) => e !== this.activeFile && this.project.findFile(e) !== void 0), r = this.queryElement("[data-tp-programming-viewer-primary-editor]");
		if (this.usesViewerEditorTabs && r !== null) {
			let i = document.createElement("tp-tabs");
			i.setAttribute("data-tp-programming-viewer-file-tabs", "");
			let a = document.createElement("dl"), o = (e, t) => {
				let n = document.createElement("dt");
				n.setAttribute("data-value", e), n.textContent = e.split("/").at(-1) ?? e;
				let r = document.createElement("dd");
				r.setAttribute("data-value", e), r.append(t), a.append(n, r);
			};
			o(this.activeFile ?? "/main", r);
			for (let e of n) {
				let t = this.project.findFile(e);
				t !== void 0 && o(e, this.createViewerAdditionalEditor(e, t.content, t.language));
			}
			i.append(a), e.replaceChildren(i), t?.setAttribute("hidden", "");
			return;
		}
		e.replaceChildren();
		let i = n.length > 0;
		t?.toggleAttribute("hidden", !i), t !== null && (t.textContent = this.activeFile?.split("/").at(-1) ?? "main");
		for (let t of n) {
			let n = this.project.findFile(t);
			if (n === void 0) continue;
			let r = this.createViewerAdditionalEditor(t, n.content, n.language), i = document.createElement("strong");
			i.setAttribute("data-tp-programming-viewer-file-label", ""), i.textContent = t.split("/").at(-1) ?? t, r.prepend(i), e.append(r);
		}
	}
	createViewerAdditionalEditor(e, t, n) {
		let r = document.createElement("div");
		r.setAttribute("data-tp-programming-viewer-editor-group", ""), r.setAttribute("data-path", e);
		let i = document.createElement("tp-code-editor");
		return i.setAttribute("filename", e), i.setAttribute("language", n ?? o(e)), i.setAttribute("word-wrap", ""), i.setValue(t), i.addEventListener("tp-code-editor-change", () => {
			let t = this.project.findFile(e);
			t !== void 0 && (t.content = i.getValue());
		}), r.append(i), r;
	}
	createViewerButton(e, t, n, r = !0) {
		let i = document.createElement("tp-icon-button");
		return i.setAttribute(`data-tp-programming-viewer-${e}`, ""), i.setAttribute("name", t), i.setAttribute("label", n), i.setAttribute("title", `Toggle ${n.toLowerCase()}`), i.setAttribute("size", "xs"), i.setAttribute("aria-pressed", String(r)), i;
	}
	updateViewerLayout() {
		if (!this.viewerMode) return;
		let e = this.queryElement("[data-tp-programming-viewer-root]"), t = this.queryElement("[data-tp-programming-viewer-panel=\"code\"]"), n = this.queryElement("[data-tp-programming-viewer-panel=\"output\"]"), r = this.queryElement("[data-tp-programming-viewer-code]"), i = this.queryElement("[data-tp-programming-viewer-output]"), a = this.queryElement("[data-tp-programming-viewer-console]"), o = this.queryElement("[data-tp-programming-viewer-editor-toolbar]"), s = this.queryElement("[data-tp-programming-viewer-editor-actions]");
		t?.toggleAttribute("hidden", !this.viewerCodeVisible), n?.toggleAttribute("hidden", !this.viewerOutputVisible), r?.setAttribute("aria-pressed", String(this.viewerCodeVisible)), i?.setAttribute("aria-pressed", String(this.viewerOutputVisible)), this.consoleEl?.toggleAttribute("hidden", !this.viewerConsoleVisible), a?.setAttribute("aria-pressed", String(this.viewerConsoleVisible)), o?.toggleAttribute("hidden", !this.viewerCodeVisible), s?.toggleAttribute("hidden", !this.viewerCodeVisible), e?.setAttribute("data-view", this.viewerCodeVisible && this.viewerOutputVisible ? "both" : this.viewerCodeVisible ? "code" : "output"), this.syncViewerEditorHeights();
	}
	syncViewerEditorHeights() {
		if (!this.viewerMode || !this.viewerCodeVisible) return;
		let e = () => {
			for (let e of this.querySelectorAll("[data-tp-programming-viewer-panel=\"code\"] tp-code-editor")) e.syncHeightToContent();
		};
		e(), queueMicrotask(e), requestAnimationFrame(e), setTimeout(e, 0);
	}
	handleViewerCodeClick = () => {
		this.viewerCodeVisible && !this.viewerOutputVisible || (this.viewerCodeVisible = !this.viewerCodeVisible, this.updateViewerLayout());
	};
	handleViewerOutputClick = () => {
		this.viewerOutputVisible && !this.viewerCodeVisible || (this.viewerOutputVisible = !this.viewerOutputVisible, this.updateViewerLayout());
	};
	handleViewerConsoleClick = () => {
		this.viewerConsoleVisible = !this.viewerConsoleVisible, this.updateViewerLayout();
	};
	handleViewerConsoleEntry = () => {
		this.viewerMode && (this.viewerConsoleVisible = !0, this.updateViewerLayout());
	};
	handleViewerConsoleClear = () => {
		this.viewerMode && (this.viewerConsoleVisible = !1, this.updateViewerLayout());
	};
	handleEditorToolbarClick = () => {
		let e = this.viewerMode ? Array.from(this.querySelectorAll("[data-tp-programming-viewer-panel=\"code\"] tp-code-editor")) : this.editorEl === null ? [] : [this.editorEl];
		if (e.length === 0) return;
		let t = !e.some((e) => e.toolbar);
		for (let n of e) n.toolbar = t;
		this.queryElement("[data-tp-programming-viewer-editor-toolbar]")?.setAttribute("aria-pressed", String(t)), this.syncViewerEditorHeights();
	};
	handleViewerIframeLoad = () => {
		if (this.iframeEl === null) return;
		this.viewerIframeResizeObserver?.disconnect(), this.viewerIframeResizeObserver = null, this.viewerIframeMutationObserver?.disconnect(), this.viewerIframeMutationObserver = null;
		let e = () => {
			let e = this.iframeEl;
			if (e === null) return;
			let t = e.contentDocument;
			if (t === null || t.body === null) return;
			e.style.blockSize = "1px";
			let n = Array.from(t.body.children).filter((e) => e.localName !== "script" && e.localName !== "style").some((e) => (e.textContent?.trim() ?? "") !== "" || e.matches("img, svg, canvas, video, audio, picture") || e.querySelector("img, svg, canvas, video, audio, picture") !== null || e.getBoundingClientRect().height > 0), r = e.getContentHeight();
			e.toggleAttribute("hidden", !n), n ? e.style.blockSize = `${String(Math.max(1, r))}px` : e.style.removeProperty("block-size");
		};
		e();
		let t = this.iframeEl.contentDocument;
		if (t !== null && t.body !== null && typeof ResizeObserver < "u") {
			let n = !1, r = new ResizeObserver(() => {
				n || (n = !0, requestAnimationFrame(() => {
					n = !1, !(this.viewerIframeResizeObserver !== r || this.iframeEl?.contentDocument !== t) && e();
				}));
			});
			this.viewerIframeResizeObserver = r, this.viewerIframeResizeObserver.observe(t.body), t.documentElement !== null && this.viewerIframeResizeObserver.observe(t.documentElement);
		}
		t !== null && t.body !== null && typeof MutationObserver < "u" && (this.viewerIframeMutationObserver = new MutationObserver(e), this.viewerIframeMutationObserver.observe(t.body, {
			childList: !0,
			characterData: !0,
			subtree: !0
		}));
	};
	createToolbarIconButton(e) {
		let t = document.createElement("tp-icon-button");
		return t.setAttribute(`data-tp-playground-${e.action}`, ""), t.setAttribute("section", "end"), t.setAttribute("name", e.icon), t.setAttribute("label", e.label), t.setAttribute("title", e.title ?? e.label), t.setAttribute("size", "xs"), e.action === "test" && !this.hasAvailableTestFile() && t.setAttribute("disabled", ""), t;
	}
	syncTestButton() {
		let e = this.queryElement("[data-tp-playground-test]");
		if (e === null) return;
		let t = this.hasAvailableTestFile();
		e.setAttribute("name", t ? "test-tube" : "test-tube-off"), e.setAttribute("title", t ? "Test" : "No test file found"), t ? e.removeAttribute("disabled") : e.setAttribute("disabled", "");
	}
	bindEvents() {
		this.unbindEvents(), this.queryElement("[data-tp-playground-run]")?.addEventListener("click", this.handleRunClick), this.queryElement("[data-tp-playground-test]")?.addEventListener("click", this.handleTestClick), this.queryElement("[data-tp-playground-reset]")?.addEventListener("click", this.handleResetClick), this.queryElement("[data-tp-programming-viewer-code]")?.addEventListener("click", this.handleViewerCodeClick), this.queryElement("[data-tp-programming-viewer-output]")?.addEventListener("click", this.handleViewerOutputClick), this.queryElement("[data-tp-programming-viewer-console]")?.addEventListener("click", this.handleViewerConsoleClick), this.queryElement("[data-tp-programming-viewer-editor-toolbar]")?.addEventListener("click", this.handleEditorToolbarClick), this.queryElement("[data-tp-playground-editor-toolbar]")?.addEventListener("click", this.handleEditorToolbarClick), this.filesystemEl?.addEventListener("tp-filesystem-open", this.handleFilesystemOpen), this.filesystemEl?.addEventListener("tp-filesystem-active", this.handleFilesystemActive), this.filesystemEl?.addEventListener("tp-filesystem-change", this.handleFilesystemChange), this.filesystemEl?.addEventListener("tp-filesystem-rename", this.handleFilesystemRename), this.editorEl?.addEventListener("tp-code-editor-change", this.handleEditorChange), this.iframeEl?.addEventListener("tp-iframe-load", this.handleViewerIframeLoad), this.consoleEl?.addEventListener("tp-console-entry-add", this.handleViewerConsoleEntry), this.consoleEl?.addEventListener("tp-console-clear", this.handleViewerConsoleClear), this.tabsEl?.addEventListener("tp-tabs-select", this.handleTabsSelect), this.tabsEl?.addEventListener("tp-tabs-close", this.handleTabsClose), this.toolbarStartMenuEl?.addEventListener("tp-menu-item-select", this.handleToolbarMenuSelect);
	}
	unbindEvents() {
		this.queryElement("[data-tp-playground-run]")?.removeEventListener("click", this.handleRunClick), this.queryElement("[data-tp-playground-test]")?.removeEventListener("click", this.handleTestClick), this.queryElement("[data-tp-playground-reset]")?.removeEventListener("click", this.handleResetClick), this.queryElement("[data-tp-programming-viewer-code]")?.removeEventListener("click", this.handleViewerCodeClick), this.queryElement("[data-tp-programming-viewer-output]")?.removeEventListener("click", this.handleViewerOutputClick), this.queryElement("[data-tp-programming-viewer-console]")?.removeEventListener("click", this.handleViewerConsoleClick), this.queryElement("[data-tp-programming-viewer-editor-toolbar]")?.removeEventListener("click", this.handleEditorToolbarClick), this.queryElement("[data-tp-playground-editor-toolbar]")?.removeEventListener("click", this.handleEditorToolbarClick), this.filesystemEl?.removeEventListener("tp-filesystem-open", this.handleFilesystemOpen), this.filesystemEl?.removeEventListener("tp-filesystem-active", this.handleFilesystemActive), this.filesystemEl?.removeEventListener("tp-filesystem-change", this.handleFilesystemChange), this.filesystemEl?.removeEventListener("tp-filesystem-rename", this.handleFilesystemRename), this.editorEl?.removeEventListener("tp-code-editor-change", this.handleEditorChange), this.iframeEl?.removeEventListener("tp-iframe-load", this.handleViewerIframeLoad), this.consoleEl?.removeEventListener("tp-console-entry-add", this.handleViewerConsoleEntry), this.consoleEl?.removeEventListener("tp-console-clear", this.handleViewerConsoleClear), this.tabsEl?.removeEventListener("tp-tabs-select", this.handleTabsSelect), this.tabsEl?.removeEventListener("tp-tabs-close", this.handleTabsClose), this.toolbarStartMenuEl?.removeEventListener("tp-menu-item-select", this.handleToolbarMenuSelect);
	}
	handleRunClick = () => {
		this.run();
	};
	handleTestClick = () => {
		this.test();
	};
	handleResetClick = () => {
		this.reset();
	};
	handleFilesystemOpen = (e) => {
		this.openFile(e.detail.path);
	};
	handleFilesystemActive = (e) => {
		this.activeFile = e.detail.path, this.syncTabs(), this.syncEditorFromActiveFile();
	};
	handleFilesystemChange = (e) => {
		this.fileSaveTargets.forEach((t, n) => {
			e.detail.files.some((e) => e.path === n) || this.fileSaveTargets.delete(n);
		}), this.project.setFiles(e.detail.files), this.syncEditorFromActiveFile(), this.syncTestButton();
	};
	handleFilesystemRename = (e) => {
		this.fileSaveTargets.delete(e.detail.oldPath), this.fileSaveTargets.delete(e.detail.newPath), this.openFiles = this.openFiles.map((t) => t === e.detail.oldPath ? e.detail.newPath : t), this.activeFile === e.detail.oldPath && (this.activeFile = e.detail.newPath), this.syncProjectFromFilesystem(), this.syncTabs(), this.syncEditorFromActiveFile(), this.syncTestButton();
	};
	handleEditorChange = (e) => {
		if (this.isSyncingEditor || this.activeFile === null) return;
		let t = e.detail.value;
		if (typeof t != "string") return;
		let n = this.project.findFile(this.activeFile);
		n === void 0 || n.readonly === !0 || (n.content = t, this.filesystemEl?.writeFile(this.activeFile, t));
	};
	handleTabsSelect = (e) => {
		let t = e.detail.value;
		this.openFiles.includes(t) && (this.activeFile = t, this.filesystemEl?.setActivePath(t, !1), this.syncEditorFromActiveFile());
	};
	handleTabsClose = (e) => {
		this.closeFile(e.detail.value);
	};
	handleToolbarMenuSelect = (e) => {
		let t = e.detail.item;
		if (!(t instanceof HTMLElement)) return;
		if (t.hasAttribute("data-tp-playground-language-help")) {
			this.languageDrawerEl?.setContent(this.getLanguageHelp()), this.languageDrawerEl?.show();
			return;
		}
		let n = t.getAttribute("data-tp-playground-example-id");
		if (typeof n == "string" && n !== "") {
			this.loadExample(n);
			return;
		}
		let r = t.getAttribute("data-tp-playground-action");
		if (!(typeof r != "string" || r === "") && !this.handleAdditionalToolbarAction(r)) switch (r) {
			case "open-source-file":
				this.openLocalProject(!1);
				break;
			case "save-file":
				this.saveActiveFile(!1);
				break;
			case "save-file-as":
				this.saveActiveFile(!0);
				break;
			case "run-project":
				this.run();
				break;
			case "test-project":
				this.test();
				break;
			case "reset-project":
				this.reset();
				break;
			case "new-project":
				this.setProject(this.createNewProject()), this.consoleEl?.clear();
				break;
			case "clear-project":
				this.setProject(this.createClearProject()), this.consoleEl?.clear();
				break;
			case "save-memory": break;
			case "clear-memory": break;
			case "import-disk":
				this.openLocalProject(!0);
				break;
			case "export-disk":
				this.exportLocalProject();
				break;
			default: break;
		}
	};
	async openLocalProject(e) {
		this.fileChooserController?.abort();
		let t = new AbortController();
		this.fileChooserController = t;
		let n = this.project;
		try {
			let r = await s(this, e ? ".json" : p(this.getPlaygroundKind()), t.signal);
			if (r === null) return;
			let i = await r.text();
			if (t.signal.aborted || this.project !== n) return;
			let a = e ? l(JSON.parse(i)) : d(r.name, i, this.getPlaygroundKind());
			this.configuredProjectRevision++, this.setProject(this.createProjectFromData(a)), this.consoleEl?.clear(), this.afterProjectLoaded();
		} catch (e) {
			if (t.signal.aborted || this.project !== n) return;
			this.consoleEl?.clear(), this.reportError(e, "Unable to open the selected file.");
		}
	}
	async saveActiveFile(e) {
		this.syncProjectFromFilesystem();
		let t = this.project, n = this.activeFile === null ? void 0 : t.findFile(this.activeFile);
		if (n === void 0) return;
		let a = n.path.split("/").at(-1) ?? "source.txt", o = /\.[^.]+$/.exec(a)?.[0] ?? ".txt", s = new Blob([n.content], { type: "text/plain;charset=utf-8" });
		try {
			let c = !e && this.fileSaveTargets.get(n.path) || await r({
				suggestedName: a,
				description: "Source file",
				mimeType: "text/plain",
				extension: o
			});
			if (c === null) return;
			await i(s, c), this.project === t && this.fileSaveTargets.set(n.path, c);
		} catch (e) {
			this.reportError(e, "Unable to save the source file.");
		}
	}
	async exportLocalProject() {
		this.syncProjectFromFilesystem();
		let e = this.getProject();
		try {
			let t = await r({
				suggestedName: `${e.name || "project"}.json`,
				description: "Playground project",
				mimeType: "application/json",
				extension: ".json"
			});
			t !== null && await i(new Blob([JSON.stringify(e.toJSON(), null, 2)], { type: "application/json" }), t);
		} catch (e) {
			this.reportError(e, "Unable to export the project.");
		}
	}
	syncEditorFromActiveFile() {
		let e = this.activeFile !== null && this.project.findFile(this.activeFile) !== void 0;
		if (this.toolbarStartMenuEl?.querySelectorAll("[data-tp-playground-action=\"save-file\"], [data-tp-playground-action=\"save-file-as\"]"), this.toolbarStartMenuEl) for (let t of this.toolbarStartMenuEl.querySelectorAll("[data-tp-playground-action=\"save-file\"], [data-tp-playground-action=\"save-file-as\"]")) t.setAttribute("aria-disabled", String(!e));
		if (this.editorEl === null) return;
		let t = this.activeFile === null ? void 0 : this.project.findFile(this.activeFile);
		if (t === void 0 ? (this.editorEl.removeAttribute("language"), this.editorEl.removeAttribute("filename")) : (this.editorEl.setAttribute("language", t.language ?? o(t.path)), this.editorEl.setAttribute("filename", t.path)), this.isSyncingEditor = !0, this.editorEl.setValue(t?.content ?? ""), this.isSyncingEditor = !1, t?.readonly === !0 ? this.editorEl.setAttribute("readonly", "") : this.editorEl.removeAttribute("readonly"), !this.viewerMode && this.tabsEl !== null) {
			let e = Array.from(this.tabsEl.querySelectorAll(":scope > [data-tp-tabpanel]")).find((e) => e.getAttribute("data-value") === this.activeFile);
			e && this.editorEl.parentElement !== e ? e.append(this.editorEl) : e || this.editorEl.remove();
		}
	}
	syncTabs() {
		if (this.tabsEl !== null) {
			this.tabsEl.clearTabs();
			for (let e of this.openFiles) {
				let t = e.split("/").filter(Boolean).at(-1) ?? e;
				this.tabsEl.addTab(e, t);
			}
			this.activeFile !== null && this.tabsEl.selectValue(this.activeFile), this.tabsEl.refresh();
		}
	}
	handleWindowMessage = (e) => {
		if (!(this.iframeEl instanceof HTMLElement)) return;
		let t = this.iframeEl;
		if (e.source !== t.contentWindow) return;
		let n = e.data;
		if (typeof n != "object" || !n) return;
		let r = n;
		if (r.type === "tp-playground-console-clear") {
			this.consoleEl?.clear();
			return;
		}
		r.type === "tp-playground-console-entry" && typeof r.kind == "string" && Array.isArray(r.values) && this.consoleEl?.addEntry(r.kind, r.values);
	};
	reportError(e, t) {
		let n = e instanceof Error ? e.message : t;
		this.consoleEl?.error(Error(n)), this.dispatchEvent(new CustomEvent("tp-playground-error", {
			bubbles: !0,
			detail: { message: n }
		}));
	}
};
//#endregion
export { _ as t };

//# sourceMappingURL=playground.js.map