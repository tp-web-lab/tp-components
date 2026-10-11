import { t as e } from "./base.js";
import "./icon-button.js";
import "./copy-code.js";
import "./object-tree.js";
//#region src/components/console/console.css?inline
var t = "tp-console{box-sizing:border-box;inline-size:auto;min-inline-size:0;max-inline-size:100%;color:var(--tp-console-color,#e6edf3);background:var(--tp-console-bg,#0d1117);border:1px solid var(--tp-console-border,#30363d);border-radius:.5rem;font-family:ui-monospace,SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;font-size:.875rem;line-height:1.45;display:block;overflow:hidden}[data-tp-console-root]{box-sizing:border-box;background:inherit;min-block-size:2.5rem;inline-size:100%;min-inline-size:0;max-inline-size:100%;color:inherit;display:block}[data-tp-console-entries]{box-sizing:border-box;flex-direction:column;min-block-size:0;inline-size:100%;max-inline-size:100%;display:flex}[data-tp-console-entry]{border-block-end:1px solid var(--tp-console-entry-border,#21262d);background:var(--tp-console-entry-bg,transparent);grid-template-columns:auto minmax(0,1fr);align-items:start;gap:.5rem .75rem;min-inline-size:0;padding:.625rem .75rem;display:grid}[data-tp-console-entry]:last-child{border-block-end:none}[data-tp-console-entry][data-kind=log]{--tp-console-kind-accent:#8b949e}[data-tp-console-entry][data-kind=info]{--tp-console-kind-accent:#79c0ff}[data-tp-console-entry][data-kind=warn]{--tp-console-kind-accent:#d29922;background:#d2992214}[data-tp-console-entry][data-kind=error]{--tp-console-kind-accent:#ff7b72;background:#ff7b7214}[data-tp-console-meta]{white-space:nowrap;align-items:center;gap:.5rem;min-inline-size:0;display:inline-flex}[data-tp-console-kind]{letter-spacing:.02em;text-transform:uppercase;min-inline-size:3.75rem;color:var(--tp-console-kind-accent,#8b949e);background:color-mix(in srgb, var(--tp-console-kind-accent,#8b949e) 14%, transparent);border-radius:999px;justify-content:center;align-items:center;padding:.125rem .4rem;font-size:.75rem;font-weight:700;display:inline-flex}[data-tp-console-time]{color:var(--tp-console-time-color,#8b949e);font-size:.75rem}[data-tp-console-values]{flex-wrap:wrap;align-items:start;gap:.5rem .75rem;min-inline-size:0;display:flex}[data-tp-console-value]{overflow-wrap:anywhere;white-space:pre-wrap;min-inline-size:0;display:inline-block}[data-tp-console-value][data-kind=string]{color:var(--tp-console-string-color,#a5d6ff)}[data-tp-console-value][data-kind=number]{color:var(--tp-console-number-color,#79c0ff)}[data-tp-console-value][data-kind=boolean]{color:var(--tp-console-boolean-color,#ffa657)}[data-tp-console-value][data-kind=undefined],[data-tp-console-value][data-kind=null]{color:var(--tp-console-nullish-color,#8b949e);font-style:italic}[data-tp-console-value][data-kind=bigint]{color:var(--tp-console-bigint-color,#bc8cff)}[data-tp-console-root] [data-tp-console-table]{border-spacing:0;inline-size:100%;max-inline-size:100%;display:table}[data-tp-console-object]{border:1px solid var(--tp-console-object-border,#30363d);background:var(--tp-console-object-bg,#11161d);border-radius:.375rem;inline-size:100%;min-inline-size:0;overflow:hidden}[data-tp-console-object]>summary{cursor:pointer;color:var(--tp-console-object-summary-color,#c9d1d9);background:var(--tp-console-object-summary-bg,#161b22);-webkit-user-select:none;user-select:none;padding:.45rem .6rem;list-style:none}[data-tp-console-object]>summary::-webkit-details-marker{display:none}[data-tp-console-object]>summary:before{content:\"▶\";inline-size:1rem;color:var(--tp-console-object-marker-color,#8b949e);transition:transform .12s;display:inline-block}[data-tp-console-object][open]>summary:before{transform:rotate(90deg)}[data-tp-console-object]>summary:hover{background:#1f242b}[data-tp-console-object]>tp-object-tree{background:var(--tp-console-object-panel-bg,#0f141a);padding:.5rem .6rem .6rem;display:block}tp-console tp-object-tree{color:inherit;font:inherit}tp-console tp-object-tree tp-tree{display:block}tp-console tp-object-tree ul{margin:0;padding-inline-start:1rem}tp-console tp-object-tree li{margin:.125rem 0}tp-console tp-object-tree [data-tp-object-tree-row]{flex-wrap:wrap;align-items:baseline;gap:.35rem;min-inline-size:0;display:inline-flex}tp-console tp-object-tree [data-tp-object-tree-key]{color:var(--tp-console-object-key-color,#c9d1d9);font-weight:600}tp-console tp-object-tree [data-tp-object-tree-separator]{color:var(--tp-console-object-separator-color,#8b949e)}tp-console tp-object-tree [data-tp-object-tree-summary]{overflow-wrap:anywhere}tp-console tp-object-tree [data-kind=string] [data-tp-object-tree-summary]{color:var(--tp-console-string-color,#a5d6ff)}tp-console tp-object-tree [data-kind=number] [data-tp-object-tree-summary]{color:var(--tp-console-number-color,#79c0ff)}tp-console tp-object-tree [data-kind=boolean] [data-tp-object-tree-summary]{color:var(--tp-console-boolean-color,#ffa657)}tp-console tp-object-tree [data-kind=null] [data-tp-object-tree-summary],tp-console tp-object-tree [data-kind=undefined] [data-tp-object-tree-summary]{color:var(--tp-console-nullish-color,#8b949e);font-style:italic}tp-console tp-object-tree [data-kind=date] [data-tp-object-tree-summary]{color:var(--tp-console-date-color,#7ee787)}tp-console tp-object-tree [data-kind=function] [data-tp-object-tree-summary]{color:var(--tp-console-function-color,#d2a8ff)}tp-console tp-object-tree [data-kind=error] [data-tp-object-tree-summary]{color:var(--tp-console-error-color,#ff7b72)}tp-console tp-object-tree [data-kind=circular] [data-tp-object-tree-summary]{color:var(--tp-console-circular-color,#f2cc60);font-style:italic}[data-tp-console-entry]{padding-inline-start:calc(var(--tp-console-depth,0) * 1rem)}tp-console tp-object-tree[data-type=string]{color:#22c55e}tp-console tp-object-tree[data-type=number]{color:#3b82f6}tp-console tp-object-tree[data-type=boolean]{color:#f59e0b}[data-tp-console-header]{border-bottom:1px solid var(--tp-color-border,#ddd);justify-content:space-between;align-items:center;padding:.25rem .5rem;display:flex}[data-tp-console-header-left]{align-items:center;display:flex}[data-tp-console-header-right]{align-items:center;gap:.25rem;display:flex}[data-tp-console-header-right] tp-copy-code{min-block-size:1.75rem;min-inline-size:1.75rem;position:static;inset:auto}[data-tp-console-header-right] tp-copy-code[data-state=idle]{color:inherit}[data-tp-console-title]{opacity:.8;font-size:.9rem;font-weight:600}[data-tp-console-entry][data-kind=assert],[data-tp-console-entry][data-kind=assert] [data-tp-console-kind]{color:red}[data-tp-console-clear]{cursor:pointer;opacity:.7;background:0 0;border:none}[data-tp-console-clear]:hover{opacity:1}[data-tp-console-entries]:empty:before{content:\"Empty console\";color:var(--tp-console-empty-color,#8b949e);padding:.75rem;font-style:italic;display:block}@media (width<=640px){[data-tp-console-entry]{grid-template-columns:1fr}[data-tp-console-meta]{justify-content:space-between}[data-tp-console-values]{inline-size:100%}}@media (prefers-reduced-motion:reduce){tp-console,tp-console *{transition-duration:.01ms!important;transition-delay:0s!important}}";
//#endregion
//#region src/components/console/console.ts
function n(e) {
	return e == null || typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "bigint";
}
function r(e) {
	return typeof e == "function";
}
function i(e) {
	return e === null ? "null" : e === void 0 ? "undefined" : typeof e == "string" ? `"${e}"` : typeof e == "bigint" ? `${String(e)}n` : String(e);
}
function a(e) {
	return n(e) ? i(e) : e instanceof Error ? `${e.name}: ${e.message}` : e instanceof Date ? `Date(${e.toISOString()})` : Array.isArray(e) ? `Array(${e.length})` : r(e) ? `Function(${e.name === "" ? "(anonymous)" : e.name})` : typeof e == "object" && e ? `Object(${Object.keys(e).length})` : String(e);
}
function o(e) {
	return new Date(e).toLocaleTimeString();
}
var s = class r extends e {
	static styleId = "tp-console-styles";
	entries = [];
	nextEntryId = 1;
	entriesEl = null;
	originalConsole = null;
	isRedirecting = !1;
	maxEntries = 500;
	groupDepth = 0;
	counters = /* @__PURE__ */ new Map();
	timers = /* @__PURE__ */ new Map();
	static get observedAttributes() {
		return [];
	}
	table(...e) {
		this.addEntry("table", e);
	}
	group(...e) {
		this.addEntry("group", e);
	}
	groupCollapsed(...e) {
		this.addEntry("group-collapsed", e);
	}
	groupEnd() {
		this.addEntry("group-end", []);
	}
	assert(e, ...t) {
		e || this.addEntry("assert", t.length > 0 ? t : ["Assertion failed"]);
	}
	count(e = "default") {
		let t = (this.counters.get(e) ?? 0) + 1;
		this.counters.set(e, t), this.addEntry("count", [`${e}: ${t}`]);
	}
	countReset(e = "default") {
		if (!this.counters.has(e)) {
			this.addEntry("warn", [`Count for '${e}' does not exist`]);
			return;
		}
		this.counters.set(e, 0);
	}
	time(e = "default") {
		this.timers.set(e, performance.now());
	}
	timeLog(e = "default", ...t) {
		let n = this.timers.get(e);
		if (n === void 0) {
			this.addEntry("warn", [`Timer '${e}' does not exist`]);
			return;
		}
		let r = performance.now() - n;
		this.addEntry("time", [`${e}: ${r.toFixed(2)} ms`, ...t]);
	}
	timeEnd(e = "default") {
		let t = this.timers.get(e);
		if (t === void 0) {
			this.addEntry("warn", [`Timer '${e}' does not exist`]);
			return;
		}
		let n = performance.now() - t;
		this.timers.delete(e), this.addEntry("time", [`${e}: ${n.toFixed(2)} ms`]);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureStyles(), this.ensureLayout(), this.render();
	}
	disconnectedCallback() {
		this.restoreConsole();
	}
	getEntries() {
		return this.entries.map((e) => ({
			id: e.id,
			kind: e.kind,
			values: [...e.values],
			timestamp: e.timestamp,
			depth: e.depth,
			collapsed: e.collapsed
		}));
	}
	getValue() {
		return this.entries.filter((e) => e.kind !== "group-end").map((e) => {
			let t = e.values.map((e) => this.formatCopyValue(e)).join(" ");
			return `${"  ".repeat(e.depth)}${e.kind.toUpperCase()} ${o(e.timestamp)} ${t}`.trimEnd();
		}).join("\n");
	}
	addEntry(e, t) {
		e === "group-end" && (this.groupDepth = Math.max(0, this.groupDepth - 1));
		let n = {
			id: this.nextEntryId,
			kind: e,
			values: [...t],
			timestamp: Date.now(),
			depth: this.groupDepth,
			collapsed: e === "group-collapsed"
		};
		return (e === "group" || e === "group-collapsed") && (this.groupDepth += 1), this.nextEntryId += 1, this.entries = [...this.entries, n], this.entries.length > this.maxEntries && (this.entries = this.entries.slice(-this.maxEntries)), this.render(), this.dispatchEvent(new CustomEvent("tp-console-entry-add", {
			bubbles: !0,
			detail: { entry: n }
		})), n;
	}
	log(...e) {
		this.addEntry("log", e);
	}
	info(...e) {
		this.addEntry("info", e);
	}
	warn(...e) {
		this.addEntry("warn", e);
	}
	error(...e) {
		this.addEntry("error", e);
	}
	clear() {
		let e = this.entries.length;
		this.entries = [], this.counters.clear(), this.timers.clear(), this.groupDepth = 0, this.ensureLayout(), this.entriesEl instanceof HTMLDivElement && this.entriesEl.replaceChildren(), this.dispatchEvent(new CustomEvent("tp-console-clear", {
			bubbles: !0,
			detail: { removedCount: e }
		}));
	}
	redirectConsoleToSelf() {
		if (this.isRedirecting) return () => this.restoreConsole();
		let e = {
			log: console.log.bind(console),
			info: console.info.bind(console),
			warn: console.warn.bind(console),
			error: console.error.bind(console),
			clear: console.clear.bind(console)
		};
		this.originalConsole = e, this.isRedirecting = !0;
		let t = (e, t) => (...n) => {
			try {
				t(...n);
			} finally {
				this.addEntry(e, n);
			}
		};
		return console.log = t("log", e.log), console.info = t("info", e.info), console.warn = t("warn", e.warn), console.error = t("error", e.error), console.clear = () => {
			e.clear(), this.clear();
		}, () => {
			this.restoreConsole();
		};
	}
	restoreConsole() {
		!this.isRedirecting || this.originalConsole === null || (console.log = this.originalConsole.log, console.info = this.originalConsole.info, console.warn = this.originalConsole.warn, console.error = this.originalConsole.error, console.clear = this.originalConsole.clear, this.originalConsole = null, this.isRedirecting = !1);
	}
	ensureStyles() {
		if (document.getElementById(r.styleId)) return;
		let e = document.createElement("style");
		e.id = r.styleId, e.textContent = t, document.head.append(e);
	}
	ensureLayout() {
		let e = this.querySelector("[data-tp-console-root]");
		if (e instanceof HTMLDivElement) {
			let t = e.querySelector("[data-tp-console-entries]");
			this.entriesEl = t instanceof HTMLDivElement ? t : null;
			return;
		}
		let t = document.createElement("div");
		t.setAttribute("data-tp-console-root", "");
		let n = document.createElement("div");
		n.setAttribute("data-tp-console-header", "");
		let r = document.createElement("div");
		r.setAttribute("data-tp-console-header-left", "");
		let i = document.createElement("div");
		i.setAttribute("data-tp-console-header-right", "");
		let a = document.createElement("span");
		a.setAttribute("data-tp-console-title", ""), a.textContent = "Console";
		let o = document.createElement("tp-copy-code");
		o.setAttribute("copied-text", "Console copied!"), o.setAttribute("title", "Copy console"), o.forElement = this;
		let s = document.createElement("tp-icon-button");
		s.setAttribute("name", "close"), s.setAttribute("label", "Clear console"), s.setAttribute("title", "Clear console"), s.addEventListener("click", (e) => {
			e.stopPropagation(), this.clear();
		}), r.append(a), i.append(o, s), n.append(r, i);
		let c = document.createElement("div");
		c.setAttribute("data-tp-console-entries", ""), t.append(n, c), this.append(t), this.entriesEl = c;
	}
	formatCopyValue(e) {
		if (n(e)) return i(e);
		if (e instanceof Error) return e.stack ?? `${e.name}: ${e.message}`;
		try {
			return JSON.stringify(e) ?? a(e);
		} catch {
			return a(e);
		}
	}
	render() {
		if (this.ensureLayout(), this.entriesEl === null) return;
		this.entriesEl.replaceChildren();
		let e = null;
		for (let t of this.entries) if (t.kind !== "group-end") {
			if (e !== null) {
				if (t.depth > e) continue;
				e = null;
			}
			this.entriesEl.append(this.renderEntry(t)), (t.kind === "group" || t.kind === "group-collapsed") && t.collapsed === !0 && (e = t.depth);
		}
		this.entriesEl.scrollTop = this.entriesEl.scrollHeight;
	}
	renderEntry(e) {
		let t = document.createElement("div");
		t.setAttribute("data-tp-console-entry", ""), t.setAttribute("data-kind", e.kind), t.setAttribute("data-entry-id", String(e.id)), t.style.setProperty("--tp-console-depth", String(e.depth)), (e.kind === "group" || e.kind === "group-collapsed") && (t.setAttribute("data-tp-console-group-toggle", ""), t.addEventListener("click", () => {
			e.collapsed = !e.collapsed, this.render();
		}));
		let n = document.createElement("div");
		n.setAttribute("data-tp-console-meta", "");
		let r = document.createElement("span");
		r.setAttribute("data-tp-console-kind", ""), r.textContent = e.kind === "group" || e.kind === "group-collapsed" ? e.collapsed ? "▶" : "▼" : e.kind;
		let i = document.createElement("span");
		i.setAttribute("data-tp-console-time", ""), i.textContent = o(e.timestamp), n.append(r, i);
		let a = document.createElement("div");
		if (a.setAttribute("data-tp-console-values", ""), e.kind === "assert") {
			let e = document.createElement("span");
			e.textContent = "✗ ", e.style.color = "red", e.style.fontWeight = "bold", a.append(e);
		}
		return this.renderConsoleValues(a, e.values), t.append(n, a), t;
	}
	renderConsoleValues(e, t) {
		let [n, r, ...i] = t;
		if (typeof n == "string" && n.includes("%c") && typeof r == "string") {
			let t = document.createElement("span");
			t.setAttribute("data-tp-console-value", ""), t.setAttribute("data-kind", "string"), t.textContent = n.replaceAll("%c", ""), t.setAttribute("style", r), e.append(t);
			for (let t of i) e.append(this.renderValue(t));
			return;
		}
		for (let n of t) e.append(this.renderValue(n));
	}
	renderValue(e) {
		if (n(e)) {
			let t = document.createElement("span");
			return t.setAttribute("data-tp-console-value", ""), t.setAttribute("data-kind", e === null ? "null" : typeof e), t.textContent = i(e), t;
		}
		if (Array.isArray(e) && e.every((e) => typeof e == "object")) {
			let t = document.createElement("table");
			t.setAttribute("data-tp-console-table", "");
			let n = Array.from(new Set(e.flatMap((e) => Object.keys(e)))), r = document.createElement("thead"), i = document.createElement("tr");
			for (let e of n) {
				let t = document.createElement("th");
				t.textContent = e, i.append(t);
			}
			r.append(i), t.append(r);
			let o = document.createElement("tbody");
			for (let t of e) {
				let e = document.createElement("tr");
				for (let r of n) {
					let n = document.createElement("td"), i = t[r];
					n.textContent = a(i), e.append(n);
				}
				o.append(e);
			}
			return t.append(o), t;
		}
		let t = document.createElement("details");
		t.setAttribute("data-tp-console-object", "");
		let r = document.createElement("summary");
		r.textContent = a(e);
		let o = document.createElement("tp-object-tree");
		return o.setValue(e), t.append(r, o), t;
	}
};
customElements.get("tp-console") || customElements.define("tp-console", s);
//#endregion
export { s as t };

//# sourceMappingURL=console.js.map