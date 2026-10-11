//#region src/components/playground/playground-example-loader.ts
function e(e) {
	return e.endsWith(".adoc") || e.endsWith(".asciidoc") ? "asciidoc" : e.endsWith(".html") || e.endsWith(".htm") ? "html" : e.endsWith(".css") ? "css" : e.endsWith(".js") || e.endsWith(".mjs") ? "javascript" : e.endsWith(".ts") ? "typescript" : e.endsWith(".py") ? "python" : e.endsWith(".pl") ? "prolog" : e.endsWith(".sql") ? "sql" : e.endsWith(".json") ? "json" : e.endsWith(".md") ? "markdown" : e.endsWith(".rst") ? "restructuredtext" : e.endsWith(".abc") ? "abc" : "text";
}
var t = class {
	rootUrl;
	category;
	group;
	createProject;
	referencesCache = null;
	projectCache = /* @__PURE__ */ new Map();
	constructor(e) {
		this.rootUrl = e.rootUrl ?? "/examples", this.category = e.category, this.group = e.group, this.createProject = e.createProject;
	}
	async getExamples() {
		return (await this.getReferences()).map((e) => ({
			id: e.id,
			label: e.label
		}));
	}
	async getReferences() {
		if (this.referencesCache !== null) return this.referencesCache;
		let e = (await this.fetchJson(`${this.rootUrl}/index.json`)).groups[this.category];
		if (e === void 0) throw Error(`Examples category not found: ${this.category}`);
		let t = e[this.group];
		if (typeof t != "string" || t === "") throw Error(`Examples group not found: ${this.category}/${this.group}`);
		let n = await this.fetchJson(`${t}/index.json`);
		return this.referencesCache = await Promise.all(n.examples.map((e) => this.loadReference(t, e))), this.referencesCache;
	}
	async loadProject(e) {
		let t = this.projectCache.get(e);
		if (t !== void 0) return t.clone();
		let n = (await this.getReferences()).find((t) => t.id === e);
		if (n === void 0) throw Error(`Example not found: ${e}`);
		let r = await this.fetchJson(`${n.baseUrl}/.files.json`), i = await Promise.all(r.files.map((e) => this.loadFile(n.baseUrl, e))), a = this.createProject(n.metadata, i);
		return this.projectCache.set(e, a.clone()), a.clone();
	}
	clearCache() {
		this.referencesCache = null, this.projectCache.clear();
	}
	async loadReference(e, t) {
		let n = `${e}/${t}`, r = await this.fetchJson(`${n}/project.json`);
		return {
			id: r.id ?? t,
			label: r.label ?? r.name ?? t,
			name: r.name ?? r.label ?? t,
			baseUrl: n,
			metadata: r
		};
	}
	async loadFile(t, n) {
		let r = await fetch(`${t}/${n}`);
		if (!r.ok) throw Error(`Unable to load example file: ${n}`);
		let i = n.startsWith("/") ? n : `/${n}`;
		return {
			path: i,
			content: await r.text(),
			language: e(i)
		};
	}
	async fetchJson(e) {
		let t = await fetch(e);
		if (!t.ok) throw Error(`Unable to load JSON: ${e}`);
		return await t.json();
	}
};
//#endregion
export { t as TpPlaygroundExampleLoader, e as inferLanguage };

//# sourceMappingURL=playground-example-loader.js.map