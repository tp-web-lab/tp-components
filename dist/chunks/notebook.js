import { dedent as e } from "../utilities/code.js";
import { t } from "./base.js";
import "./icon-button.js";
import "./icon.js";
import { resolveComponentSourceUrl as n } from "../utilities/source-url.js";
import "./button.js";
import "./divider.js";
import "./dropdown.js";
import "./html-viewer.js";
import "../components/asciidoc-viewer/asciidoc-viewer.js";
import { setupTpDropdownTriggers as r } from "../components/dropdown/dropdown-triggers.js";
import "../components/markdown-viewer/markdown-viewer.js";
import "../components/restructuredtext-viewer/restructuredtext-viewer.js";
import "../components/javascript-viewer/javascript-viewer.js";
import "../components/typescript-viewer/typescript-viewer.js";
import "../components/python-viewer/python-viewer.js";
import "../components/prolog-viewer/prolog-viewer.js";
import "../components/sql-viewer/sql-viewer.js";
//#region src/components/notebook/notebook.css?inline
var i = "tp-notebook,tp-javascript-notebook,tp-typescript-notebook,tp-python-notebook,tp-prolog-notebook,tp-sql-notebook{gap:.75rem;min-inline-size:0;display:grid}[data-tp-notebook-root]{border:1px solid var(--tp-border-color,#d1d5db);border-radius:.5rem;gap:.75rem;min-inline-size:0;padding:.75rem;display:grid}[data-tp-notebook-toolbar]{flex-wrap:wrap;justify-content:flex-end;align-items:center;gap:.25rem;display:flex}[data-tp-notebook-title]{align-items:center;gap:.375rem;font-weight:650;display:inline-flex}[data-tp-notebook-toolbar-spacer]{flex:auto}[data-tp-notebook-menu-trigger]{border:1px solid var(--tp-border-color,#d1d5db);border-radius:.375rem;align-items:center;gap:.125rem;padding-inline-start:.5rem;display:inline-flex}[data-tp-notebook-menu-trigger]>span{font-size:.875em;font-weight:600}tp-button[data-action=add-language]{--tp-button-background:transparent;--tp-button-border-color:var(--tp-border-color,#d1d5db);--tp-button-font-size:.875rem;--tp-button-foreground:currentColor;--tp-button-radius:.375rem}[data-tp-notebook-root] tp-button[data-action=add-language]>button{border-color:var(--tp-border-color,#d1d5db);color:inherit;min-block-size:1.875rem;padding-block:0;padding-inline:.5rem .375rem}[data-tp-notebook-root] tp-button[data-action=add-language]>button>[data-tp-button-content]{align-items:center}[data-tp-notebook-language-menu]>ul{min-inline-size:10rem}[data-tp-notebook-language-menu] li{align-items:center;gap:.5rem;display:flex}[data-tp-notebook-cells]{gap:.75rem;min-inline-size:0;display:grid}[data-tp-notebook-cell]{border:1px solid var(--tp-border-color,#d1d5db);border-radius:.5rem;min-inline-size:0;overflow:hidden}[data-tp-notebook-cell][data-selected]{border-color:var(--tp-brand-color,#2563eb);box-shadow:0 0 0 2px color-mix(in srgb, var(--tp-brand-color,#2563eb) 25%, transparent)}[data-tp-notebook-cell][data-cell-type=markup] .tp-markup-viewer{margin-block:0}[data-tp-notebook-cell-body]>*{inline-size:100%;min-inline-size:0}[data-tp-notebook-preview-content]{gap:.75rem;inline-size:100%;min-inline-size:0;display:grid}[data-tp-notebook-preview-content]>*{inline-size:100%;min-inline-size:0}[data-tp-notebook-empty]{color:var(--tp-text-muted,#6b7280);text-align:center;margin:0;padding:1rem}", a = [
	"asciidoc",
	"html",
	"markdown",
	"restructuredtext"
], o = [
	"javascript",
	"prolog",
	"python",
	"sql",
	"typescript"
], s = {
	html: "file_type_html",
	asciidoc: "file_type_asciidoc",
	markdown: "file_type_markdown",
	restructuredtext: "file_type_restructuredtext",
	javascript: "file_type_javascript",
	typescript: "file_type_typescript",
	python: "file_type_python",
	prolog: "file_type_prolog",
	sql: "file_type_sql"
}, c = {
	javascript: "JavaScript",
	prolog: "Prolog",
	python: "Python",
	sql: "SQL",
	typescript: "TypeScript"
};
function l(e = import.meta.url) {
	let t = new URL(e);
	return t.pathname.includes("/src/components/notebook/") ? new URL("../../tp-loader.ts", t).href : t.pathname.includes("/chunks/") && !t.pathname.includes("/src/chunks/") ? new URL("../tp-loader.js", t).href : t.pathname.includes("/components/notebook/") && !t.pathname.includes("/src/components/notebook/") ? new URL("../../tp-loader.js", t).href : new URL("/tp-loader.js", t).href;
}
var u = class u extends t {
	static styleId = "tp-notebook-styles";
	static nextId = 0;
	cells = [];
	initialCells = [];
	cellsEl = null;
	selectedIndex = -1;
	instanceId = `tp-notebook-${++u.nextId}`;
	executionScopeVersion = 0;
	notebookName = "notebook";
	fileHandle = null;
	viewerObservers = [];
	previewing = !1;
	static get observedAttributes() {
		return [
			...t.observedAttributes,
			"language",
			"src",
			"repository",
			"readonly"
		];
	}
	get language() {
		let e = this.getAttribute("language");
		return o.includes(e) ? e : "javascript";
	}
	get readonly() {
		return this.hasAttribute("readonly");
	}
	set readonly(e) {
		this.toggleAttribute("readonly", e);
	}
	connectedCallback() {
		this.ensureGlobalStyle(u.styleId, i), this.renderShell(), this.load();
	}
	disconnectedCallback() {
		this.viewerObservers.forEach((e) => {
			e.disconnect();
		}), this.viewerObservers = [];
	}
	attributeChangedCallback(e, t, n) {
		t !== n && this.isConnected && ["src", "repository"].includes(e) && this.load(), t !== n && this.isConnected && e === "readonly" && this.syncSelection();
	}
	async load() {
		let e = "inline", t, r = this.getAttribute("src")?.trim() ?? "", i = this.getAttribute("repository")?.trim() ?? "";
		r === "" ? i === "" ? t = { cells: this.readInlineCells() } : (e = "repository", t = await this.loadRepository(n(this, i).href)) : (e = "src", t = await this.fetchJson(n(this, r).href)), this.cells = structuredClone(t.cells), this.initialCells = structuredClone(t.cells), this.notebookName = t.name?.trim() || "notebook", this.selectedIndex = this.cells.length > 0 ? 0 : -1, this.renderCells(), this.dispatchEvent(new CustomEvent("tp-notebook-load", {
			bubbles: !0,
			detail: {
				source: e,
				cells: this.cells.length
			}
		}));
	}
	async fetchJson(e) {
		let t = await fetch(e, { cache: "no-store" });
		if (!t.ok) throw Error(`Unable to load notebook: ${e}`);
		return t.json();
	}
	async loadRepository(e) {
		let t = e.replace(/\/$/, ""), n = await this.fetchJson(`${t}/project.json`), r = await (await fetch(`${t}/.files.json`, { cache: "no-store" })).json(), i = /* @__PURE__ */ new Map();
		return await Promise.all((r.files ?? []).map(async (e) => {
			let n = await fetch(`${t}/${e.replace(/^\//, "")}`, { cache: "no-store" });
			i.set(e, await n.text()), i.set(`/${e.replace(/^\//, "")}`, i.get(e) ?? "");
		})), {
			...n,
			cells: n.cells.map((e) => ({
				...e,
				content: typeof e.content == "string" && i.has(e.content) ? i.get(e.content) : e.content,
				files: e.files?.map((e) => ({
					...e,
					content: i.get(e.content) ?? e.content
				}))
			}))
		};
	}
	readInlineCells() {
		let t = Array.from(this.querySelectorAll(":scope > script[type^=\"tp/\"]")), n = [], r = null;
		for (let i of t) {
			let t = i.type.replace("tp/", ""), s = e(i.textContent ?? "");
			a.includes(t) ? (r = null, n.push({
				type: "markup",
				language: t,
				content: s,
				doctest: t === "restructuredtext" && i.hasAttribute("doctest")
			})) : o.includes(t) && (this.localName === "tp-notebook" || t === this.language) && ((r === null || r.language !== t) && (r = {
				type: "code",
				language: t,
				files: []
			}, n.push(r)), r.files?.push({
				filename: i.getAttribute("filename") ?? void 0,
				content: s
			}));
		}
		return n;
	}
	renderShell() {
		this.querySelector(":scope > [data-tp-notebook-root]")?.remove(), this.previewing = !1;
		let e = document.createElement("section");
		e.setAttribute("data-tp-notebook-root", "");
		let t = document.createElement("div");
		t.setAttribute("data-tp-notebook-toolbar", "");
		let n = document.createElement("span");
		if (n.setAttribute("data-tp-notebook-title", ""), this.localName === "tp-notebook") n.textContent = "Notebook";
		else {
			let e = document.createElement("tp-icon");
			e.setAttribute("library", "components"), e.setAttribute("name", this.localName.replace(/^tp-/, "")), e.setAttribute("size", "1.75em"), e.setAttribute("aria-hidden", "true"), n.append(e);
		}
		let i = this.button("files-menu", "file-settings", "Files");
		i.id = `${this.instanceId}-files`;
		let a = this.filesMenu(i.id);
		a.id = `${this.instanceId}-files-menu`, this.configureDropdownTrigger(i, a.id);
		let o = document.createElement("span");
		o.setAttribute("data-tp-notebook-toolbar-spacer", "");
		let s = this.button("markup-menu", "plus-box-outline", "Add markup block");
		s.id = `${this.instanceId}-markup`;
		let c = this.languageMenu(s.id);
		c.id = `${this.instanceId}-markup-menu`, this.configureDropdownTrigger(s, c.id);
		let l = [];
		if (this.localName === "tp-notebook") {
			let e = this.button("language-menu", "plus-box-outline", "Add programming block");
			e.id = `${this.instanceId}-language`;
			let t = this.languageMenu(e.id, !0);
			t.id = `${this.instanceId}-language-menu`, this.configureDropdownTrigger(e, t.id), l.push(this.menuTrigger("Language", e), t);
		} else l.push(this.restrictedLanguageButton());
		t.append(n, this.menuTrigger("Files", i), a, o, this.menuTrigger("Markup", s), c, ...l, this.button("up", "arrow-up", "Move selected block up"), this.button("down", "arrow-down", "Move selected block down"), this.button("duplicate", "content-copy", "Duplicate selected block"), this.button("delete", "delete-outline", "Delete selected block"), this.button("editor-toolbar", "keyboard-f1", "Toggle editor toolbar"), this.button("reset", "refresh", "Reset notebook"), this.button("preview", "eye-outline", "Preview notebook"), this.button("run-all", "play-all", "Run all cells"));
		let u = document.createElement("div");
		u.setAttribute("data-tp-notebook-cells", ""), e.append(t, u), this.append(e), r(e), this.cellsEl = u, t.addEventListener("click", (e) => this.handleAction(e));
	}
	filesMenu(e) {
		let t = document.createElement("tp-dropdown");
		t.setAttribute("anchor", `#${e}`), t.setAttribute("placement", "bottom"), t.setAttribute("offset", "4px"), t.setAttribute("outside-click", ""), t.setAttribute("data-tp-notebook-files-menu", "");
		let n = document.createElement("ul"), r = (e) => {
			for (let [t, r] of e) {
				let e = document.createElement("li");
				e.dataset.fileAction = t, e.textContent = r, n.append(e);
			}
		};
		return r([
			["load", "Load"],
			["save", "Save"],
			["save-as", "Save as…"]
		]), n.append(document.createElement("tp-divider")), r([["import-html", "Import HTML"], ["export-html", "Export HTML"]]), t.append(n), t.addEventListener("click", (e) => {
			let n = e.target?.closest("[data-file-action]")?.dataset.fileAction;
			n === "load" ? this.chooseNotebookFile("json") : n === "import-html" ? this.chooseNotebookFile("html") : n === "save" ? this.saveNotebook(!1) : n === "save-as" ? this.saveNotebook(!0) : n === "export-html" && this.exportHtml(), n !== void 0 && t.hide?.();
		}), t;
	}
	chooseNotebookFile(e) {
		let t = document.createElement("input");
		t.type = "file", t.accept = e === "json" ? ".json,application/json" : ".html,.htm,text/html", t.hidden = !0, t.addEventListener("change", () => {
			let n = t.files?.[0];
			n !== void 0 && (e === "json" ? this.loadNotebookFile(n) : this.importHtmlFile(n)), t.remove();
		}, { once: !0 }), this.append(t), t.click();
	}
	async loadNotebookFile(e) {
		let t = JSON.parse(await e.text());
		if (!Array.isArray(t.cells)) throw TypeError("The notebook file must contain a cells array.");
		this.cells = structuredClone(t.cells), this.initialCells = structuredClone(t.cells), this.notebookName = t.name?.trim() || e.name.replace(/\.json$/i, "") || "notebook", this.fileHandle = null, this.selectedIndex = this.cells.length > 0 ? 0 : -1, this.renderCells(), this.dispatchEvent(new CustomEvent("tp-notebook-load", {
			bubbles: !0,
			detail: {
				source: "file",
				cells: this.cells.length
			}
		}));
	}
	async importHtmlFile(e) {
		let t = await e.text(), n = new DOMParser().parseFromString(t, "text/html"), r = n.querySelector("script#tp-notebook-data[type=\"application/json\"]"), i = r === null ? {
			name: e.name.replace(/\.html?$/i, "") || "notebook",
			cells: [{
				type: "markup",
				language: "html",
				content: n.body.innerHTML
			}]
		} : JSON.parse(r.textContent ?? "");
		if (!Array.isArray(i.cells)) throw TypeError("The exported notebook data must contain a cells array.");
		this.cells = structuredClone(i.cells), this.initialCells = structuredClone(i.cells), this.notebookName = i.name?.trim() || e.name.replace(/\.html?$/i, "") || "notebook", this.fileHandle = null, this.selectedIndex = this.cells.length > 0 ? 0 : -1, this.renderCells(), this.dispatchEvent(new CustomEvent("tp-notebook-load", {
			bubbles: !0,
			detail: {
				source: "file",
				cells: this.cells.length
			}
		}));
	}
	notebookBlob() {
		this.captureAllCells();
		let e = this.cells.map(({ showEditor: e, ...t }) => t), t = {
			name: this.notebookName,
			cells: e
		};
		return new Blob([`${JSON.stringify(t, null, 2)}\n`], { type: "application/json" });
	}
	async saveNotebook(e) {
		let t = window.showSaveFilePicker;
		(e || this.fileHandle === null) && t !== void 0 && (this.fileHandle = await t({
			suggestedName: `${this.notebookName}.json`,
			types: [{
				description: "Notebook JSON",
				accept: { "application/json": [".json"] }
			}]
		}));
		let n = this.notebookBlob();
		if (this.fileHandle !== null) {
			let e = await this.fileHandle.createWritable();
			await e.write(n), await e.close();
			return;
		}
		let r = URL.createObjectURL(n), i = document.createElement("a");
		i.href = r, i.download = `${this.notebookName}.json`, i.click(), URL.revokeObjectURL(r);
	}
	standaloneHtml() {
		this.captureAllCells();
		let e = this.cells.map((e, t) => this.createRenderedCell(e, t).outerHTML).join("\n"), t = document.querySelector("script[src*=\"tp-loader\"]")?.src ?? l(), n = this.notebookName.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"), r = this.cells.map(({ showEditor: e, ...t }) => t);
		return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${n}</title>
  <script type="module" src="${t}"><\/script>
  <script id="tp-notebook-data" type="application/json">${JSON.stringify({
			name: this.notebookName,
			cells: r
		}).replaceAll("<", "\\u003c")}<\/script>
  <style>:root{color-scheme:light}body{background:#fff;box-sizing:border-box;color:#111827;margin-inline:auto;max-inline-size:80rem;padding:1rem}main{display:grid;gap:.75rem;min-inline-size:0}</style>
</head>
<body>
  <main>${e}</main>
</body>
</html>`;
	}
	createRenderedCell(e, t) {
		if (e.type === "code") {
			let n = document.createElement(`tp-${e.language}-viewer`);
			n.setAttribute("execution-scope", this.executionScope), n.setAttribute("execution-index", String(t));
			for (let t of e.files ?? [{ content: "" }]) {
				let r = document.createElement("script");
				r.type = `tp/${e.language}`, t.filename && r.setAttribute("filename", t.filename), r.textContent = t.content, n.append(r);
			}
			return n;
		}
		if (e.language === "html") {
			let t = document.createElement("div");
			return t.innerHTML = e.content ?? "", t;
		}
		let n = document.createElement(`tp-${e.language}`);
		e.language === "restructuredtext" && n.toggleAttribute("doctest", e.doctest === !0);
		let r = document.createElement("script");
		return r.type = `tp/${e.language}`, r.textContent = e.content ?? "", n.append(r), n;
	}
	htmlBlob() {
		return new Blob([this.standaloneHtml()], { type: "text/html" });
	}
	togglePreview() {
		if (this.cellsEl === null) return;
		if (this.previewing) {
			this.previewing = !1, this.querySelector("[data-tp-notebook-root]")?.removeAttribute("data-tp-notebook-preview"), this.updatePreviewButton(), this.renderCells();
			return;
		}
		this.captureAllCells(), this.previewing = !0, this.viewerObservers.forEach((e) => {
			e.disconnect();
		}), this.viewerObservers = [];
		let e = document.createElement("section");
		e.setAttribute("data-tp-notebook-preview-content", ""), this.cells.forEach((t, n) => {
			e.append(this.createRenderedCell(t, n));
		}), this.cellsEl.replaceChildren(e), this.querySelector("[data-tp-notebook-root]")?.setAttribute("data-tp-notebook-preview", ""), this.updatePreviewButton(), this.syncSelection();
	}
	updatePreviewButton() {
		let e = this.querySelector("[data-action=\"preview\"]");
		if (e === null) return;
		let t = this.previewing ? "Edit notebook" : "Preview notebook";
		e.setAttribute("name", this.previewing ? "pencil" : "eye-outline"), e.setAttribute("label", t), e.setAttribute("title", t), e.setAttribute("aria-pressed", String(this.previewing));
	}
	exportHtml() {
		let e = URL.createObjectURL(this.htmlBlob()), t = document.createElement("a");
		t.href = e, t.download = `${this.notebookName}.html`, t.click(), URL.revokeObjectURL(e);
	}
	configureDropdownTrigger(e, t) {
		e.removeAttribute("data-action"), e.setAttribute("data-tp-dropdown-action", "toggle"), e.setAttribute("data-tp-dropdown-target", `#${t}`), e.setAttribute("data-tp-dropdown-exclusive", ""), e.setAttribute("aria-haspopup", "menu");
	}
	menuTrigger(e, t) {
		let n = document.createElement("span");
		n.setAttribute("data-tp-notebook-menu-trigger", "");
		let r = document.createElement("span");
		return r.textContent = e, n.append(r, t), n;
	}
	languageMenu(e, t = !1) {
		let n = document.createElement("tp-dropdown");
		n.setAttribute("anchor", `#${e}`), n.setAttribute("placement", "bottom"), n.setAttribute("offset", "4px"), n.setAttribute("outside-click", ""), n.setAttribute("data-tp-notebook-language-menu", t ? "code" : "markup");
		let r = document.createElement("ul"), i = t ? o : a;
		for (let e of i) {
			let n = document.createElement("li");
			n.dataset.language = e, n.dataset.cellType = t ? "code" : "markup";
			let i = document.createElement("tp-icon");
			i.setAttribute("library", "languages"), i.setAttribute("name", s[e]), i.setAttribute("size", "1.25em"), i.setAttribute("aria-hidden", "true");
			let a = document.createElement("span");
			a.textContent = e, n.append(i, a), r.append(n);
		}
		return n.append(r), n.addEventListener("click", (e) => {
			let t = e.target?.closest("[data-language]");
			if (t == null) return;
			let r = t.dataset.language;
			r !== void 0 && (this.addCell(t.dataset.cellType, r), n.hide?.());
		}), n;
	}
	restrictedLanguageButton() {
		let e = document.createElement("tp-button");
		e.setAttribute("data-action", "add-language"), e.setAttribute("size", "m"), e.setAttribute("outlined", ""), e.setAttribute("title", `Add ${c[this.language]} block`);
		let t = document.createElement("tp-icon");
		t.setAttribute("library", "languages"), t.setAttribute("name", s[this.language]), t.setAttribute("size", "1.25em"), t.setAttribute("aria-hidden", "true");
		let n = document.createElement("span");
		n.textContent = c[this.language];
		let r = document.createElement("tp-icon");
		return r.setAttribute("name", "plus-box-outline"), r.setAttribute("size", "1.25rem"), r.setAttribute("aria-hidden", "true"), e.append(t, n, r), e;
	}
	button(e, t, n) {
		let r = document.createElement("tp-icon-button");
		return r.setAttribute("data-action", e), r.setAttribute("name", t), r.setAttribute("label", n), r.setAttribute("title", n), r.setAttribute("size", "s"), r;
	}
	renderCells() {
		if (this.cellsEl !== null) {
			if (this.viewerObservers.forEach((e) => {
				e.disconnect();
			}), this.viewerObservers = [], this.cellsEl.replaceChildren(), this.cells.length === 0) {
				let e = document.createElement("p");
				e.setAttribute("data-tp-notebook-empty", ""), e.textContent = "This notebook has no cells.", this.cellsEl.append(e), this.syncSelection();
				return;
			}
			this.cells.forEach((e, t) => {
				this.cellsEl?.append(this.renderCell(e, t));
			}), this.syncSelection();
		}
	}
	renderCell(e, t) {
		let n = document.createElement("article");
		n.setAttribute("data-tp-notebook-cell", ""), n.setAttribute("data-cell-type", e.type), n.dataset.index = String(t), n.tabIndex = 0, n.setAttribute("aria-label", `${e.language} block ${t + 1}`);
		let r = document.createElement("div");
		return r.setAttribute("data-tp-notebook-cell-body", ""), r.append(this.createViewer(e, t)), n.append(r), n.addEventListener("pointerdown", () => this.selectCell(t)), n.addEventListener("focusin", () => this.selectCell(t)), n;
	}
	createViewer(e, t) {
		let n = document.createElement(`tp-${e.language}-viewer`);
		e.type === "code" && (n.setAttribute("execution-scope", this.executionScope), n.setAttribute("execution-index", String(t))), e.type === "markup" && n.setAttribute("lite", ""), e.type === "markup" && e.language === "restructuredtext" && e.doctest === !0 && n.setAttribute("doctest", ""), n.toggleAttribute("readonly", this.readonly);
		let r = e.type === "markup" ? [{ content: e.content ?? "" }] : e.files ?? [{ content: "" }];
		if (e.type === "markup" && e.language === "html") n.innerHTML = e.content ?? "";
		else for (let t of r) {
			let r = document.createElement("script");
			r.type = `tp/${e.language}`, "filename" in t && t.filename && r.setAttribute("filename", t.filename), r.textContent = t.content, n.append(r);
		}
		return this.observeViewer(n, e.type === "markup" && e.showEditor === !0, e.type === "markup" ? 1 : Math.max(1, r.length)), n;
	}
	observeViewer(e, t, n) {
		let r = !t, i, a = () => {
			let t = e.querySelectorAll("tp-code-editor");
			if (t.forEach((e) => {
				e.toggleAttribute("readonly", this.readonly);
			}), this.syncEditorToolbarButton(), e.querySelectorAll("[data-role=\"reset\"], [data-tp-playground-reset]").forEach((e) => {
				e.toggleAttribute("disabled", this.readonly);
			}), !r) {
				let t = e.querySelector("[data-role=\"toggle-source\"][aria-pressed=\"false\"]");
				t !== null && (r = !0, t.click());
			}
			r && t.length >= n && i.disconnect();
		};
		i = new MutationObserver(a), i.observe(e, {
			childList: !0,
			subtree: !0
		}), this.viewerObservers.push(i), queueMicrotask(a);
	}
	handleAction(e) {
		let t = e.target?.closest("[data-action]")?.dataset.action;
		if (t === void 0 || this.readonly && ![
			"run-all",
			"preview",
			"editor-toolbar"
		].includes(t)) return;
		if (t === "add-language") {
			this.addCell("code", this.language);
			return;
		}
		if (t === "editor-toolbar") {
			let e = this.querySelector("[data-tp-notebook-cell][data-selected]"), t = Array.from(e?.querySelectorAll("tp-code-editor") ?? []), n = !t.some((e) => e.hasAttribute("toolbar"));
			t.forEach((e) => {
				e.toggleAttribute("toolbar", n);
			}), this.querySelector("[data-action=\"editor-toolbar\"]")?.setAttribute("aria-pressed", String(n));
			return;
		}
		let n = this.selectedIndex;
		if (t === "run-all") this.querySelectorAll("[data-tp-notebook-cell] [data-tp-playground-run]").forEach((e) => {
			e.click();
		});
		else if (t === "preview") this.togglePreview();
		else if (t === "reset") this.executionScopeVersion += 1, this.cells = structuredClone(this.initialCells), this.selectedIndex = this.cells.length > 0 ? 0 : -1;
		else if (n >= 0) {
			this.captureAllCells();
			let e = this.cells[n];
			if (e === void 0) return;
			let r = this.cells[n - 1], i = this.cells[n + 1];
			t === "delete" ? this.cells.splice(n, 1) : t === "duplicate" ? this.cells.splice(n + 1, 0, structuredClone(e)) : t === "up" && r !== void 0 ? [this.cells[n - 1], this.cells[n]] = [e, r] : t === "down" && i !== void 0 && ([this.cells[n + 1], this.cells[n]] = [e, i]), t === "delete" ? this.selectedIndex = Math.min(n, this.cells.length - 1) : t === "duplicate" ? this.selectedIndex = n + 1 : t === "up" && n > 0 ? this.selectedIndex = n - 1 : t === "down" && n < this.cells.length - 1 && (this.selectedIndex = n + 1);
		}
		["run-all", "preview"].includes(t) || (this.renderCells(), this.emitChange());
	}
	addCell(e, t) {
		if (this.readonly) return;
		this.captureAllCells();
		let n = e === "markup" ? {
			type: e,
			language: t,
			content: "",
			showEditor: !0
		} : {
			type: e,
			language: t,
			files: [{ content: "" }]
		}, r = this.selectedIndex < 0 ? this.cells.length : this.selectedIndex + 1;
		this.cells.splice(r, 0, n), this.selectedIndex = r, this.renderCells(), this.emitChange();
	}
	get executionScope() {
		return `${this.instanceId}-execution-${this.executionScopeVersion}`;
	}
	selectCell(e) {
		this.selectedIndex !== e && (this.selectedIndex = e, this.syncSelection());
	}
	syncSelection() {
		this.querySelectorAll("[data-tp-notebook-cell]").forEach((e, t) => {
			let n = t === this.selectedIndex;
			e.toggleAttribute("data-selected", n), e.toggleAttribute("aria-current", n);
		});
		let e = {
			up: this.previewing || this.readonly || this.selectedIndex <= 0,
			down: this.previewing || this.readonly || this.selectedIndex < 0 || this.selectedIndex >= this.cells.length - 1,
			duplicate: this.previewing || this.readonly || this.selectedIndex < 0,
			delete: this.previewing || this.readonly || this.selectedIndex < 0,
			reset: this.previewing || this.readonly,
			"run-all": this.previewing
		};
		for (let [t, n] of Object.entries(e)) this.querySelector(`[data-tp-notebook-toolbar] [data-action="${t}"]`)?.toggleAttribute("disabled", n);
		this.querySelectorAll("[data-tp-dropdown-target$=\"-markup-menu\"], [data-tp-dropdown-target$=\"-language-menu\"]").forEach((e) => {
			e.toggleAttribute("disabled", this.previewing || this.readonly);
		}), this.querySelector("[data-action=\"add-language\"]")?.toggleAttribute("disabled", this.previewing || this.readonly), this.syncReadonly(), this.syncEditorToolbarButton();
	}
	syncEditorToolbarButton() {
		let e = this.querySelector("[data-action=\"editor-toolbar\"]"), t = this.querySelector("[data-tp-notebook-cell][data-selected]"), n = Array.from(t?.querySelectorAll("tp-code-editor") ?? []);
		e?.toggleAttribute("hidden", this.previewing || n.length === 0), e?.setAttribute("aria-pressed", String(n.some((e) => e.hasAttribute("toolbar"))));
	}
	syncReadonly() {
		this.querySelectorAll("[data-tp-notebook-cell-body] > *").forEach((e) => {
			e.toggleAttribute("readonly", this.readonly);
		}), this.querySelectorAll("tp-code-editor").forEach((e) => {
			e.toggleAttribute("readonly", this.readonly);
		}), this.querySelectorAll("[data-role=\"reset\"], [data-tp-playground-reset]").forEach((e) => {
			e.toggleAttribute("disabled", this.readonly);
		});
	}
	captureAllCells() {
		this.querySelectorAll("[data-tp-notebook-cell]").forEach((e, t) => {
			this.captureCell(t, e);
		});
	}
	captureCell(e, t) {
		let n = this.cells[e];
		if (n === void 0 || t === null) return;
		let r = Array.from(t.querySelectorAll("tp-code-editor"));
		n.type === "markup" ? n.content = r[0]?.getValue() ?? n.content ?? "" : r.forEach((e, t) => {
			let r = n.files?.[t];
			r && (r.content = e.getValue());
		});
	}
	emitChange() {
		this.dispatchEvent(new CustomEvent("tp-notebook-change", {
			bubbles: !0,
			detail: { cells: this.cells.length }
		}));
	}
};
customElements.get("tp-notebook") || customElements.define("tp-notebook", u);
//#endregion
export { l as n, u as t };

//# sourceMappingURL=notebook.js.map