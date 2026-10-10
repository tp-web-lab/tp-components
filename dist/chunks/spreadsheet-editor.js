import { Ku as e } from "./lib/typescript/typescript.js";
import { J as t, a as n, i as r, o as i } from "./lib/vendor/vendor.js";
import "./color.js";
import "./formula-picker.js";
//#region src/components/spreadsheet-editor/spreadsheet-editor.css?inline
var a = "tp-spreadsheet-editor{border:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));border-radius:var(--tp-radius-m,.375rem);background:var(--tp-color-surface,Canvas);min-inline-size:0;color:var(--tp-color-text,CanvasText);gap:.5rem;display:grid;overflow:hidden}tp-spreadsheet-editor>tp-toolbar[data-tp-spreadsheet-editor-toolbar]{box-sizing:border-box;z-index:4;border-block-end:1px solid var(--tp-color-border,color-mix(in srgb, currentColor 18%, transparent));background:var(--tp-color-surface-raised,color-mix(in srgb, Canvas 96%, CanvasText));--tp-toolbar-padding:.375rem;--tp-toolbar-size:auto;--tp-icon-button-size:2rem;flex-wrap:wrap;min-inline-size:0;max-inline-size:100%;position:static;overflow-x:auto}tp-spreadsheet-editor [data-tp-spreadsheet-editor-separator]{background:color-mix(in srgb, CanvasText 22%, Canvas);align-self:stretch;inline-size:1px;margin-inline:.125rem}tp-spreadsheet-editor>tp-toolbar>[data-toolbar-start]:not(:empty)+[data-toolbar-center]:not(:empty),tp-spreadsheet-editor>tp-toolbar>[data-toolbar-center]:not(:empty)+[data-toolbar-end]:not(:empty),tp-spreadsheet-editor>tp-toolbar>[data-toolbar-start]:not(:empty)+[data-toolbar-end]:not(:empty){border-inline-start-color:color-mix(in srgb, CanvasText 22%, Canvas)}tp-spreadsheet-editor [data-tp-spreadsheet-editor-search]{align-items:center;display:inline-flex}tp-spreadsheet-editor [data-tp-spreadsheet-editor-search][hidden]{display:none}tp-spreadsheet-editor [data-tp-spreadsheet-editor-search] input{box-sizing:border-box;border:1px solid var(--tp-neutral-stroke-soft);min-block-size:2rem;inline-size:10rem;font:inherit;padding-inline:.45rem}tp-spreadsheet-editor [data-tp-spreadsheet-editor-formula-bar]{grid-template-columns:max-content 4rem minmax(0,1fr);align-items:center;gap:.25rem;padding:.5rem;display:grid}tp-spreadsheet-editor [data-tp-spreadsheet-editor-formula-bar] output,tp-spreadsheet-editor [data-tp-spreadsheet-editor-formula-bar] input{box-sizing:border-box;border:1px solid var(--tp-neutral-stroke-soft);min-block-size:2rem;font:inherit;padding:.3rem .5rem}tp-spreadsheet-editor [data-tp-spreadsheet-editor-formula-bar] output{background:var(--tp-neutral-fill-softer);font-weight:var(--tp-font-weight-bold);place-items:center;display:grid}tp-spreadsheet-editor [data-tp-spreadsheet-editor-viewport]{max-block-size:32rem;overflow:auto}tp-spreadsheet-editor>[data-tp-spreadsheet-editor-viewport]>table{max-inline-size:none;border-spacing:0;table-layout:fixed;max-width:none;display:table;overflow:visible}tp-spreadsheet-editor th{z-index:1;border:1px solid var(--tp-neutral-stroke-soft);background:var(--tp-neutral-fill-softer);min-inline-size:3rem;font-size:.8rem;position:sticky}tp-spreadsheet-editor thead th{inset-block-start:0}tp-spreadsheet-editor tbody th{inset-inline-start:0}tp-spreadsheet-editor td{border:1px solid var(--tp-neutral-stroke-soft);min-inline-size:0;padding:0}tp-spreadsheet-editor td input{box-sizing:border-box;block-size:2rem;inline-size:100%;min-inline-size:0;color:inherit;font:inherit;background:0 0;border:0;padding:.25rem .4rem}tp-spreadsheet-editor td input:focus{outline:2px solid var(--tp-brand-stroke);outline-offset:-2px}tp-spreadsheet-editor td input[data-style~=bold]{font-weight:var(--tp-font-weight-bold,700)}tp-spreadsheet-editor td input[data-style~=italic]{font-style:italic}tp-spreadsheet-editor td input[data-style~=underline]{text-decoration-line:underline}tp-spreadsheet-editor td input[data-style~=strikethrough]{text-decoration-line:line-through}tp-spreadsheet-editor td input[data-style~=underline][data-style~=strikethrough]{text-decoration-line:underline line-through}tp-spreadsheet-editor td input[data-search-match]{background:color-mix(in srgb, var(--tp-brand-fill,#88b1a1) 30%, transparent)}tp-spreadsheet-editor[data-tp-fullscreen-target]:fullscreen{box-sizing:border-box;grid-template-rows:max-content max-content minmax(0,1fr);align-content:start;block-size:100%;inline-size:100%}tp-spreadsheet-editor[data-tp-fullscreen-target]:fullscreen [data-tp-spreadsheet-editor-viewport]{min-block-size:0;max-block-size:none}@media (width<=40rem){tp-spreadsheet-editor [data-tp-spreadsheet-editor-formula-bar]{grid-template-columns:4rem minmax(0,1fr)}tp-spreadsheet-editor tp-formula-picker{grid-column:1/-1}}tp-spreadsheet-editor td input[data-selected]{background:var(--tp-brand-fill-softer,color-mix(in srgb, Highlight 18%, transparent));box-shadow:inset 0 0 0 1px var(--tp-brand-stroke,Highlight)}tp-spreadsheet-editor [data-column-resize]{cursor:col-resize;touch-action:none;-webkit-user-select:none;user-select:none;z-index:2;inline-size:8px;position:absolute;inset-block:0;inset-inline-end:-3px}tp-spreadsheet-editor [data-column-resize]:hover,tp-spreadsheet-editor [data-column-resize]:focus-visible{background:var(--tp-brand-stroke,Highlight);outline:none}", o = t;
function s(e) {
	let t = [[]], n = "", r = !1;
	for (let i = 0; i < e.length; i += 1) {
		let a = e[i] ?? "";
		r ? a === "\"" && e[i + 1] === "\"" ? (n += "\"", i += 1) : a === "\"" ? r = !1 : n += a : a === "\"" ? r = !0 : a === "," ? (t.at(-1)?.push(n), n = "") : a === "\n" ? (t.at(-1)?.push(n), t.push([]), n = "") : a !== "\r" && (n += a);
	}
	return t.at(-1)?.push(n), t.length > 1 && t.at(-1)?.length === 1 && t.at(-1)?.[0] === "" && t.pop(), t;
}
function c(e) {
	return e.map((e) => e.map((e) => {
		let t = String(e ?? "");
		return /[",\r\n]/.test(t) ? `"${t.replaceAll("\"", "\"\"")}"` : t;
	}).join(",")).join("\r\n");
}
function l(e) {
	let t = e + 1, n = "";
	for (; t > 0;) --t, n = String.fromCharCode(65 + t % 26) + n, t = Math.floor(t / 26);
	return n;
}
function u(e) {
	let t = e.toUpperCase().match(/^\$?([A-Z]+)\$?([1-9]\d*)$/);
	if (t === null || t[1] === void 0 || t[2] === void 0) return null;
	let n = 0;
	for (let e of t[1]) n = n * 26 + e.charCodeAt(0) - 64;
	return [Number(t[2]) - 1, n - 1];
}
function d(e, t, n) {
	return e.startsWith("=") ? e.replace(/"(?:[^"]|"")*"|[A-Z_$][A-Z0-9_.$]*/gi, (r, i) => {
		if (r.startsWith("\"") || /[A-Z0-9_.$]/i.test(e[i - 1] ?? "") || /^\s*\(/.test(e.slice(i + r.length))) return r;
		let a = r.match(/^(\$?)([A-Z]+)(\$?)([1-9]\d*)$/i), o = u(r);
		if (!a || !o) return r;
		let s = o[0] + (a[3] ? 0 : t), c = o[1] + (a[1] ? 0 : n);
		return s < 0 || c < 0 ? "#REF!" : `${a[1]}${l(c)}${a[3]}${s + 1}`;
	}) : e;
}
function f(e) {
	let t = [], n = 0;
	for (; n < e.length;) {
		let r = e.slice(n);
		if (r.startsWith("#REF!")) throw Error("#REF!");
		let i = r.match(/^\s+/);
		if (i !== null) {
			n += i[0].length;
			continue;
		}
		let a = r.match(/^"(?:[^"]|"")*"/);
		if (a !== null) {
			t.push({
				type: "string",
				value: a[0].slice(1, -1).replaceAll("\"\"", "\"")
			}), n += a[0].length;
			continue;
		}
		let o = r.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:E[+-]?\d+)?/i);
		if (o !== null) {
			t.push({
				type: "number",
				value: o[0]
			}), n += o[0].length;
			continue;
		}
		let s = r.match(/^[A-Z_$][A-Z0-9_.$]*/i);
		if (s !== null) {
			t.push({
				type: "identifier",
				value: s[0]
			}), n += s[0].length;
			continue;
		}
		let c = r.match(/^(?:<=|>=|<>|=|<|>|\+|-|\*|\/|\^|&)/);
		if (c !== null) {
			t.push({
				type: "operator",
				value: c[0]
			}), n += c[0].length;
			continue;
		}
		if ("(),;:".includes(e[n] ?? "")) {
			t.push({
				type: "punctuation",
				value: e[n] ?? ""
			}), n += 1;
			continue;
		}
		throw Error(`#ERROR! Unexpected ${e[n] ?? ""}`);
	}
	return t;
}
var p = class {
	tokens;
	resolveCell;
	resolveRange;
	index = 0;
	constructor(e, t, n) {
		this.tokens = e, this.resolveCell = t, this.resolveRange = n;
	}
	parse() {
		let e = this.comparison();
		if (this.peek() !== void 0) throw Error("#ERROR! Invalid formula");
		return e;
	}
	comparison() {
		let e = this.concatenation();
		for (; [
			"=",
			"<>",
			"<",
			">",
			"<=",
			">="
		].includes(this.peek()?.value ?? "");) {
			let t = this.next()?.value, n = this.concatenation();
			e = t === "=" ? e === n : t === "<>" ? e !== n : t === "<" ? e < n : t === ">" ? e > n : t === "<=" ? e <= n : e >= n;
		}
		return e;
	}
	concatenation() {
		let e = this.addition();
		for (; this.peek()?.value === "&";) this.next(), e = `${String(e)}${String(this.addition())}`;
		return e;
	}
	addition() {
		let e = this.multiplication();
		for (; this.peek()?.value === "+" || this.peek()?.value === "-";) {
			let t = this.next()?.value, n = Number(this.multiplication());
			e = t === "+" ? Number(e) + n : Number(e) - n;
		}
		return e;
	}
	multiplication() {
		let e = this.power();
		for (; this.peek()?.value === "*" || this.peek()?.value === "/";) {
			let t = this.next()?.value, n = Number(this.power());
			e = t === "*" ? Number(e) * n : Number(e) / n;
		}
		return e;
	}
	power() {
		let e = this.unary();
		return this.peek()?.value === "^" && (this.next(), e = Number(e) ** Number(this.power())), e;
	}
	unary() {
		return this.peek()?.value === "+" ? (this.next(), Number(this.unary())) : this.peek()?.value === "-" ? (this.next(), -Number(this.unary())) : this.primary();
	}
	primary() {
		let e = this.next();
		if (e === void 0) throw Error("#ERROR! Missing value");
		if (e.type === "number") return Number(e.value);
		if (e.type === "string") return e.value;
		if (e.value === "(") {
			let e = this.comparison();
			return this.expect(")"), e;
		}
		if (e.type !== "identifier") throw Error("#ERROR! Invalid value");
		let t = e.value.toUpperCase();
		if (t === "TRUE") return !0;
		if (t === "FALSE") return !1;
		if (this.peek()?.value === "(") {
			this.next();
			let e = [];
			for (; this.peek()?.value !== ")" && (e.push(this.comparison()), this.peek()?.value === "," || this.peek()?.value === ";");) this.next();
			this.expect(")");
			let n = o[t];
			if (typeof n != "function") throw Error("#NAME?");
			let r = n(...e);
			if (r instanceof Error) throw r;
			return r;
		}
		if (u(t) === null) throw Error("#NAME?");
		if (this.peek()?.value === ":") {
			this.next();
			let e = this.next();
			if (e?.type !== "identifier" || u(e.value) === null) throw Error("#REF!");
			return this.resolveRange(t, e.value);
		}
		return this.resolveCell(t);
	}
	peek() {
		return this.tokens[this.index];
	}
	next() {
		let e = this.tokens[this.index];
		return this.index += 1, e;
	}
	expect(e) {
		if (this.next()?.value !== e) throw Error(`#ERROR! Expected ${e}`);
	}
}, m = class t extends e {
	static styleId = "tp-spreadsheet-editor-styles";
	static nextId = 0;
	static copiedCell = null;
	data = [];
	formats = /* @__PURE__ */ new Map();
	cellStyles = /* @__PURE__ */ new Map();
	undoStack = [];
	redoStack = [];
	colorPreset = "tp-default";
	themeMode = "auto";
	formulaInput = null;
	nameOutput = null;
	activeReference = "A1";
	columnWidths = /* @__PURE__ */ new Map();
	selectionAnchor = "A1";
	sourceRequest = null;
	static get observedAttributes() {
		return [
			"rows",
			"columns",
			"value",
			"src"
		];
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		this.setAttribute("src", e);
	}
	get rows() {
		let e = Number(this.getAttribute("rows") ?? "20");
		return Number.isFinite(e) ? Math.max(1, Math.floor(e)) : 20;
	}
	set rows(e) {
		this.setAttribute("rows", String(Math.max(1, Math.floor(e))));
	}
	get columns() {
		let e = Number(this.getAttribute("columns") ?? "10");
		return Number.isFinite(e) ? Math.max(1, Math.floor(e)) : 10;
	}
	set columns(e) {
		this.setAttribute("columns", String(Math.max(1, Math.floor(e))));
	}
	get value() {
		return JSON.stringify(this.data);
	}
	set value(e) {
		this.setAttribute("value", e);
	}
	getData() {
		return this.data.map((e) => [...e]);
	}
	setData(e) {
		let t = Math.max(1, e.length), n = Math.max(1, ...e.map((e) => e.length));
		this.setAttribute("rows", String(t)), this.setAttribute("columns", String(n)), this.data = Array.from({ length: t }, (t, r) => Array.from({ length: n }, (t, n) => String(e[r]?.[n] ?? ""))), this.setAttribute("value", JSON.stringify(this.data));
	}
	async importFile(e) {
		this.sourceRequest?.abort(), this.applyImport(e, await this.parseFile(e));
	}
	async parseFile(e) {
		let t = e.name.split(".").at(-1)?.toLowerCase(), i;
		if (t === "csv") i = s(await e.text());
		else if (t === "json") {
			let t = JSON.parse(await e.text());
			i = typeof t == "object" && t && "data" in t ? t.data : t;
		} else if (t === "xlsx") {
			let t = r(await e.arrayBuffer(), {
				type: "array",
				cellFormula: !0
			}), a = t.SheetNames[0];
			if (a === void 0) throw Error("The XLSX workbook contains no worksheet.");
			let o = t.Sheets[a];
			if (o === void 0) throw Error("The XLSX worksheet cannot be read.");
			i = n.sheet_to_json(o, {
				header: 1,
				raw: !1,
				defval: ""
			}).map((e, t) => e.map((e, r) => {
				let i = o[n.encode_cell({
					r: t,
					c: r
				})];
				return i?.f === void 0 ? e : `=${i.f}`;
			}));
		} else throw Error("Supported import formats are CSV, JSON and XLSX.");
		if (!Array.isArray(i) || i.some((e) => !Array.isArray(e))) throw Error("The imported data must be a two-dimensional array.");
		return i;
	}
	applyImport(e, t) {
		let n = e.name.split(".").at(-1)?.toLowerCase();
		this.rememberState(), this.setData(t), this.dispatchEvent(new CustomEvent("tp-spreadsheet-editor-import", {
			bubbles: !0,
			composed: !0,
			detail: {
				format: n,
				file: e
			}
		}));
	}
	exportFile(e, t = "spreadsheet", r = "formulas") {
		let a = r === "values" ? this.data.map((e, t) => e.map((e, n) => this.evaluate(`${l(n)}${t + 1}`, /* @__PURE__ */ new Set()))) : this.data;
		if (e === "xlsx") {
			let e = {};
			a.forEach((t, i) => {
				t.forEach((t, a) => {
					let o = n.encode_cell({
						r: i,
						c: a
					});
					r === "formulas" && typeof t == "string" && t.startsWith("=") ? e[o] = {
						t: "n",
						f: t.slice(1)
					} : t instanceof Date ? e[o] = {
						t: "d",
						v: t
					} : typeof t == "boolean" ? e[o] = {
						t: "b",
						v: t
					} : t !== "" && Number.isFinite(Number(t)) ? e[o] = {
						t: "n",
						v: Number(t)
					} : e[o] = {
						t: "s",
						v: String(t)
					};
				});
			}), e["!ref"] = n.encode_range({
				s: {
					r: 0,
					c: 0
				},
				e: {
					r: this.rows - 1,
					c: this.columns - 1
				}
			});
			let o = n.book_new();
			n.book_append_sheet(o, e, "Sheet1"), i(o, `${t}.xlsx`);
		} else {
			let n = e === "csv" ? c(a.map((e) => e.map((e) => e instanceof Date ? e.toISOString() : e))) : JSON.stringify(a, null, 2), r = new Blob([n], { type: e === "csv" ? "text/csv;charset=utf-8" : "application/json" }), i = URL.createObjectURL(r), o = document.createElement("a");
			o.href = i, o.download = `${t}.${e}`, o.click(), URL.revokeObjectURL(i);
		}
		this.dispatchEvent(new CustomEvent("tp-spreadsheet-editor-export", {
			bubbles: !0,
			composed: !0,
			detail: {
				format: e,
				filename: `${t}.${e}`
			}
		}));
	}
	insertRow(e = "after") {
		let t = u(this.activeReference);
		if (t === null) return;
		let n = t[0] + +(e === "after");
		this.rememberState();
		let r = this.getData();
		r.splice(n, 0, Array.from({ length: this.columns }, () => "")), this.activeReference = `${l(t[1])}${String(n + 1)}`, this.formats.clear(), this.cellStyles.clear(), this.restoreState(r), this.emitStructureChange("insert-row", n);
	}
	deleteRow() {
		if (this.rows <= 1) return;
		let e = u(this.activeReference);
		if (e === null) return;
		this.rememberState();
		let t = this.getData();
		t.splice(e[0], 1);
		let n = Math.min(e[0], t.length - 1);
		this.activeReference = `${l(e[1])}${String(n + 1)}`, this.formats.clear(), this.cellStyles.clear(), this.restoreState(t), this.emitStructureChange("delete-row", e[0]);
	}
	insertColumn(e = "after") {
		let t = u(this.activeReference);
		if (t === null) return;
		let n = t[1] + +(e === "after");
		this.rememberState();
		let r = this.getData();
		for (let e of r) e.splice(n, 0, "");
		this.activeReference = `${l(n)}${String(t[0] + 1)}`, this.formats.clear(), this.cellStyles.clear(), this.restoreState(r), this.emitStructureChange("insert-column", n);
	}
	deleteColumn() {
		if (this.columns <= 1) return;
		let e = u(this.activeReference);
		if (e === null) return;
		this.rememberState();
		let t = this.getData();
		for (let n of t) n.splice(e[1], 1);
		let n = Math.min(e[1], this.columns - 2);
		this.activeReference = `${l(n)}${String(e[0] + 1)}`, this.formats.clear(), this.cellStyles.clear(), this.restoreState(t), this.emitStructureChange("delete-column", e[1]);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureId(), this.ensureGlobalStyle(t.styleId, a), this.readValue(), this.render(), this.loadSource();
	}
	disconnectedCallback() {
		this.sourceRequest?.abort();
	}
	async loadSource() {
		this.sourceRequest?.abort();
		let e = this.src.trim();
		if (!e) return;
		let t = new AbortController();
		this.sourceRequest = t;
		try {
			let n = new URL(e, this.baseURI), r = await fetch(n.href, { signal: t.signal });
			if (!r.ok) throw Error(`Unable to load spreadsheet (${r.status}).`);
			let i = new File([await r.arrayBuffer()], decodeURIComponent(n.pathname.split("/").at(-1) ?? "")), a = await this.parseFile(i);
			!t.signal.aborted && this.isConnected && this.applyImport(i, a);
		} catch (n) {
			t.signal.aborted || this.dispatchEvent(new CustomEvent("tp-spreadsheet-editor-error", {
				bubbles: !0,
				composed: !0,
				detail: {
					src: e,
					error: n
				}
			}));
		}
	}
	attributeChangedCallback(e, t, n) {
		if (t !== n) {
			if (e === "src") {
				this.isConnected && this.loadSource();
				return;
			}
			this.isConnected && (this.ensureId(), this.readValue(), this.render());
		}
	}
	ensureId() {
		this.dataset.tpColorScope = "", this.dataset.tpThemeScope = "", this.id === "" && (t.nextId += 1, this.id = `tp-spreadsheet-editor-${String(t.nextId)}`);
	}
	readValue() {
		let e = [];
		try {
			e = JSON.parse(this.getAttribute("value") ?? "[]");
		} catch {
			e = [];
		}
		let t = Array.isArray(e) ? e : [];
		this.data = Array.from({ length: this.rows }, (e, n) => Array.from({ length: this.columns }, (e, r) => {
			let i = t[n];
			return String(Array.isArray(i) ? i[r] ?? "" : "");
		}));
	}
	render() {
		this.colorPreset = this.querySelector("tp-color")?.getAttribute("preset") ?? this.colorPreset, this.themeMode = this.querySelector("tp-theme")?.getAttribute("mode") ?? this.themeMode;
		let e = this.createToolbar(), t = document.createElement("div");
		t.dataset.tpSpreadsheetEditorFormulaBar = "";
		let n = document.createElement("tp-formula-picker");
		n.addEventListener("tp-formula-picker-select", (e) => {
			let t = e.detail, n = t.formula;
			this.formulaInput !== null && (this.formulaInput.value = n, this.formulaInput.focus(), this.formulaInput.setSelectionRange(t.selectionStart, t.selectionEnd));
		});
		let r = document.createElement("output");
		r.textContent = this.activeReference;
		let i = document.createElement("input");
		i.type = "text", i.setAttribute("aria-label", "Cell value or formula"), i.addEventListener("change", () => this.commit(this.activeReference, i.value)), t.append(n, r, i);
		let a = document.createElement("table"), o = document.createElement("colgroup"), s = document.createElement("col");
		s.style.width = "48px", o.append(s);
		for (let e = 0; e < this.columns; e++) {
			let t = document.createElement("col");
			t.style.width = `${this.columnWidths.get(e) ?? 112}px`, o.append(t);
		}
		a.append(o);
		let c = 48 + Array.from({ length: this.columns }, (e, t) => this.columnWidths.get(t) ?? 112).reduce((e, t) => e + t, 0), d = () => {
			a.style.width = `${c}px`;
		};
		d();
		let f = a.createTHead().insertRow();
		f.append(document.createElement("th"));
		for (let e = 0; e < this.columns; e += 1) {
			let t = document.createElement("th");
			t.scope = "col", t.textContent = l(e);
			let n = document.createElement("span");
			n.dataset.columnResize = String(e), n.tabIndex = 0, n.setAttribute("role", "separator"), n.setAttribute("aria-orientation", "vertical"), n.setAttribute("aria-label", `Resize column ${l(e)}`), n.setAttribute("aria-valuemin", "48"), n.setAttribute("aria-valuenow", String(this.columnWidths.get(e) ?? 112));
			let r = (t) => {
				let r = Math.max(48, Math.round(t)), i = this.columnWidths.get(e) ?? 112;
				if (r === i) return;
				c += r - i, this.columnWidths.set(e, r);
				let a = o.children[e + 1];
				a.style.width = `${r}px`, n.setAttribute("aria-valuenow", String(r)), d();
			}, i = null, s = 0, u = null, p = () => {
				s = 0, u !== null && a.isConnected && r(u), u = null;
			};
			n.addEventListener("pointerdown", (t) => {
				t.button === 0 && (t.preventDefault(), i = {
					id: t.pointerId,
					x: t.clientX,
					width: this.columnWidths.get(e) ?? 112
				}, n.setPointerCapture(t.pointerId), n.focus());
			}), n.addEventListener("pointermove", (e) => {
				i?.id === e.pointerId && (u = i.width + e.clientX - i.x, s ||= requestAnimationFrame(p));
			});
			let m = () => {
				s && cancelAnimationFrame(s), p(), i = null;
			};
			n.addEventListener("pointerup", m), n.addEventListener("pointercancel", m), n.addEventListener("lostpointercapture", m), n.addEventListener("dblclick", () => r(112)), n.addEventListener("keydown", (t) => {
				t.key !== "ArrowLeft" && t.key !== "ArrowRight" || (t.preventDefault(), r((this.columnWidths.get(e) ?? 112) + (t.key === "ArrowRight" ? 8 : -8)));
			}), t.append(n), f.append(t);
		}
		let p = a.createTBody();
		for (let t = 0; t < this.rows; t += 1) {
			let n = p.insertRow(), r = document.createElement("th");
			r.scope = "row", r.textContent = String(t + 1), n.append(r);
			for (let r = 0; r < this.columns; r += 1) {
				let i = `${l(r)}${String(t + 1)}`, a = n.insertCell(), o = document.createElement("input");
				o.dataset.cell = i, o.dataset.format = this.formats.get(i) ?? "general", o.dataset.style = [...this.cellStyles.get(i) ?? []].join(" "), o.setAttribute("aria-label", i), o.value = this.displayValue(i), o.addEventListener("focus", () => {
					this.select(i, o.hasAttribute("data-selected"));
				}), o.addEventListener("pointerdown", (e) => {
					e.button === 0 && (e.shiftKey && e.preventDefault(), this.select(i, e.shiftKey));
				}), o.addEventListener("keydown", (t) => {
					if ((t.ctrlKey || t.metaKey) && !t.altKey && [
						"c",
						"x",
						"v"
					].includes(t.key.toLowerCase())) {
						t.preventDefault(), this.runToolbarCommand(t.key.toLowerCase() === "c" ? "copy" : t.key.toLowerCase() === "x" ? "cut" : "paste", e);
						return;
					}
					if (t.shiftKey && [
						"ArrowUp",
						"ArrowDown",
						"ArrowLeft",
						"ArrowRight"
					].includes(t.key)) {
						t.preventDefault();
						let [e, n] = u(this.activeReference) ?? [0, 0], r = Math.max(0, Math.min(this.rows - 1, e + (t.key === "ArrowDown" ? 1 : t.key === "ArrowUp" ? -1 : 0))), i = Math.max(0, Math.min(this.columns - 1, n + (t.key === "ArrowRight" ? 1 : t.key === "ArrowLeft" ? -1 : 0)));
						this.select(`${l(i)}${r + 1}`, !0);
					} else (t.key === "Delete" || t.key === "Backspace") && this.selectedReferences().length > 1 ? (t.preventDefault(), this.clearSelection()) : t.key === "Escape" && this.select(i);
				}), o.addEventListener("change", () => this.commit(i, o.value)), a.append(o);
			}
		}
		let m = document.createElement("div");
		m.dataset.tpSpreadsheetEditorViewport = "", m.append(a), this.replaceChildren(e, t, m), this.formulaInput = i, this.nameOutput = r, this.select(this.activeReference, !0);
	}
	createToolbar() {
		this.ensureId();
		let e = document.createElement("tp-toolbar");
		e.dataset.tpSpreadsheetEditorToolbar = "";
		let t = `${this.id}-files`, n = `${this.id}-format`, r = `${this.id}-cell-style`, i = `${this.id}-table`;
		e.innerHTML = `
      <tp-icon-button section="start" id="${t}" name="file" label="Files" aria-haspopup="menu"></tp-icon-button>
      <tp-dropdown section="start" data-spreadsheet-file-dropdown anchor="#${t}" placement="bottom" offset="4px" outside-click>
        <tp-menu><ul>
          <li data-file-action="import"><tp-icon name="file-import"></tp-icon><span>Import CSV, JSON or XLSX</span></li>
          <li data-tp-menu-divider aria-disabled="true"></li>
          <li data-file-action="csv" data-export-mode="formulas"><tp-icon name="file-upload"></tp-icon><span>Export CSV — formulas</span></li>
          <li data-file-action="csv" data-export-mode="values"><tp-icon name="file-upload"></tp-icon><span>Export CSV — values</span></li>
          <li data-file-action="json" data-export-mode="formulas"><tp-icon name="file-upload"></tp-icon><span>Export JSON — formulas</span></li>
          <li data-file-action="json" data-export-mode="values"><tp-icon name="file-upload"></tp-icon><span>Export JSON — values</span></li>
          <li data-file-action="xlsx" data-export-mode="formulas"><tp-icon name="file-upload"></tp-icon><span>Export XLSX — formulas</span></li>
          <li data-file-action="xlsx" data-export-mode="values"><tp-icon name="file-upload"></tp-icon><span>Export XLSX — values</span></li>
        </ul></tp-menu>
      </tp-dropdown>
      <input type="file" accept=".csv,.json,.xlsx,text/csv,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" data-spreadsheet-file hidden />
      <tp-icon-button section="start" id="${n}" name="letter-f" label="Format" aria-haspopup="menu"></tp-icon-button>
      <tp-dropdown section="start" data-spreadsheet-format-dropdown anchor="#${n}" placement="bottom" offset="4px" outside-click>
        <tp-menu><ul>
          <li data-format="general">General</li><li data-format="number">Number</li>
          <li data-format="currency">Currency</li><li data-format="percent">Percent</li><li data-format="date">Date</li>
        </ul></tp-menu>
      </tp-dropdown>
      <tp-icon-button section="start" id="${r}" name="format-text" label="Cell style" aria-haspopup="menu"></tp-icon-button>
      <tp-dropdown section="start" data-spreadsheet-style-dropdown anchor="#${r}" placement="bottom" offset="4px" outside-click>
        <tp-menu><ul>
          <li data-cell-style="bold"><tp-icon name="format-bold"></tp-icon><span>Bold</span></li>
          <li data-cell-style="italic"><tp-icon name="format-italic"></tp-icon><span>Italic</span></li>
          <li data-cell-style="underline"><tp-icon name="format-underline"></tp-icon><span>Underline</span></li>
          <li data-cell-style="strikethrough"><tp-icon name="format-strikethrough"></tp-icon><span>Strikethrough</span></li>
        </ul></tp-menu>
      </tp-dropdown>
      <tp-icon-button section="start" id="${i}" name="table" label="Table" aria-haspopup="menu"></tp-icon-button>
      <tp-dropdown section="start" data-spreadsheet-table-dropdown anchor="#${i}" placement="bottom" offset="4px" outside-click>
        <tp-menu><ul>
          <li data-table-action="insert-row-before"><tp-icon name="table-row-plus-before"></tp-icon><span>Insert row before</span></li>
          <li data-table-action="insert-row-after"><tp-icon name="table-row-plus-after"></tp-icon><span>Insert row after</span></li>
          <li data-table-action="insert-column-before"><tp-icon name="table-column-plus-before"></tp-icon><span>Insert column before</span></li>
          <li data-table-action="insert-column-after"><tp-icon name="table-column-plus-after"></tp-icon><span>Insert column after</span></li>
          <li data-tp-menu-divider aria-disabled="true"></li>
          <li data-table-action="delete-row"><tp-icon name="table-row-remove"></tp-icon><span>Delete row</span></li>
          <li data-table-action="delete-column"><tp-icon name="table-column-remove"></tp-icon><span>Delete column</span></li>
        </ul></tp-menu>
      </tp-dropdown>
      <span section="center" data-tp-spreadsheet-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="center" name="undo" label="Undo" data-command="undo"></tp-icon-button>
      <tp-icon-button section="center" name="redo" label="Redo" data-command="redo"></tp-icon-button>
      <tp-icon-button section="center" name="copy" label="Copy" data-command="copy"></tp-icon-button>
      <tp-icon-button section="center" name="cut" label="Cut" data-command="cut"></tp-icon-button>
      <tp-icon-button section="center" name="paste" label="Paste" data-command="paste"></tp-icon-button>
      <tp-icon-button section="center" name="close" label="Clear selected cells" data-command="clear-cells"></tp-icon-button>
      <tp-icon-button section="center" name="format-clear" label="Clear formatting" data-command="unformat"></tp-icon-button>
      <span section="center" data-tp-spreadsheet-editor-separator aria-hidden="true"></span>
      <tp-icon-button section="end" name="search" label="Search" data-command="search"></tp-icon-button>
      <span section="end" data-tp-spreadsheet-editor-search hidden><input type="search" aria-label="Search cells" /><tp-icon-button name="close" size="xs" label="Close search" data-command="close-search"></tp-icon-button></span>
      <tp-fullscreen section="end" anchor="#${this.id}"></tp-fullscreen>
      <tp-color section="end" anchor="#${this.id}" preset="${this.colorPreset}"></tp-color>
      <tp-theme section="end" anchor="#${this.id}" mode="${this.themeMode}"></tp-theme>
    `;
		let a = e.querySelector(`#${t}`), o = e.querySelector(`#${n}`), s = e.querySelector(`#${r}`), c = e.querySelector(`#${i}`), l = e.querySelector("[data-spreadsheet-file-dropdown]"), u = e.querySelector("[data-spreadsheet-format-dropdown]"), d = e.querySelector("[data-spreadsheet-style-dropdown]"), f = e.querySelector("[data-spreadsheet-table-dropdown]"), p = [
			l,
			u,
			d,
			f
		], m = (e, t) => {
			e?.addEventListener("click", (n) => {
				if (n.preventDefault(), n.stopPropagation(), t !== null) {
					if (!t.open) for (let e of p) e !== t && e?.hide();
					t.toggle(), e.setAttribute("aria-expanded", String(t.open));
				}
			}), t?.addEventListener("tp-dropdown-toggle", () => e?.setAttribute("aria-expanded", String(t.open)));
		};
		m(a, l), m(o, u), m(s, d), m(c, f), e.querySelector("tp-color")?.addEventListener("tp-color-change", (e) => {
			this.colorPreset = e.detail.preset;
		}), e.querySelector("tp-theme")?.addEventListener("tp-theme-change", (e) => {
			this.themeMode = e.detail.mode;
		});
		let h = e.querySelector("[data-spreadsheet-file]");
		return h?.addEventListener("change", () => {
			let e = h.files?.[0];
			e !== void 0 && this.importFile(e), h.value = "";
		}), e.addEventListener("tp-menu-item-select", (e) => {
			let t = e.detail?.item ?? e.target, n = t.closest("[data-file-action]")?.dataset.fileAction;
			n === "import" ? h?.click() : (n === "csv" || n === "json" || n === "xlsx") && this.exportFile(n, "spreadsheet", t.closest("[data-export-mode]")?.dataset.exportMode === "values" ? "values" : "formulas");
			let r = t.closest("[data-format]")?.dataset.format;
			r !== void 0 && this.applyFormat(r);
			let i = t.closest("[data-cell-style]")?.dataset.cellStyle;
			i !== void 0 && this.toggleCellStyle(i);
			let a = t.closest("[data-table-action]")?.dataset.tableAction;
			a === "insert-row-before" ? this.insertRow("before") : a === "insert-row-after" ? this.insertRow("after") : a === "insert-column-before" ? this.insertColumn("before") : a === "insert-column-after" ? this.insertColumn("after") : a === "delete-row" ? this.deleteRow() : a === "delete-column" && this.deleteColumn();
		}), e.addEventListener("click", (t) => {
			let n = t.target.closest("[data-command]")?.dataset.command;
			n !== void 0 && this.runToolbarCommand(n, e);
		}), e.querySelector("[type=\"search\"]")?.addEventListener("input", (e) => this.search(e.target.value)), e;
	}
	selectedReferences() {
		let [e, t] = u(this.activeReference) ?? [0, 0], [n, r] = u(this.selectionAnchor) ?? [e, t], i = [];
		for (let a = Math.min(e, n); a <= Math.min(this.rows - 1, Math.max(e, n)); a++) for (let e = Math.min(t, r); e <= Math.min(this.columns - 1, Math.max(t, r)); e++) i.push(`${l(e)}${a + 1}`);
		return i;
	}
	clearSelection() {
		let e = this.selectedReferences().filter((e) => {
			let [t, n] = u(e) ?? [0, 0];
			return (this.data[t]?.[n] ?? "") !== "";
		});
		if (e.length) {
			this.rememberState();
			for (let t of e) {
				let [e, n] = u(t) ?? [0, 0], r = this.data[e];
				r && (r[n] = "");
			}
			this.setAttribute("value", JSON.stringify(this.data)), this.querySelector(`[data-cell="${this.activeReference}"]`)?.focus();
			for (let t of e) this.dispatchEvent(new CustomEvent("tp-spreadsheet-editor-input", {
				bubbles: !0,
				composed: !0,
				detail: {
					cell: t,
					raw: "",
					value: ""
				}
			}));
		}
	}
	select(e, t = !1) {
		this.activeReference = e, t || (this.selectionAnchor = e);
		let n = new Set(this.selectedReferences());
		for (let e of this.querySelectorAll("[data-cell]")) e.toggleAttribute("data-selected", n.has(e.dataset.cell ?? ""));
		this.nameOutput !== null && (this.nameOutput.textContent = e);
		let r = u(e);
		r !== null && this.formulaInput !== null && (this.formulaInput.value = this.data[r[0]]?.[r[1]] ?? "");
	}
	commit(e, t) {
		let n = u(e);
		if (n === null) return;
		let [r, i] = n;
		this.data[r] !== void 0 && this.data[r][i] !== t && (this.rememberState(), this.data[r][i] = t, this.setAttribute("value", JSON.stringify(this.data)), this.dispatchEvent(new CustomEvent("tp-spreadsheet-editor-input", {
			bubbles: !0,
			composed: !0,
			detail: {
				cell: e,
				raw: t,
				value: this.evaluate(e, /* @__PURE__ */ new Set())
			}
		})));
	}
	displayValue(e) {
		let t = this.evaluate(e, /* @__PURE__ */ new Set()), n = this.formats.get(e) ?? "general";
		if (n === "number" && Number.isFinite(Number(t))) return Number(t).toLocaleString();
		if (n === "currency" && Number.isFinite(Number(t))) return Number(t).toLocaleString(void 0, {
			style: "currency",
			currency: "EUR"
		});
		if (n === "percent" && Number.isFinite(Number(t))) return Number(t).toLocaleString(void 0, { style: "percent" });
		if (n === "date") {
			let e = t instanceof Date ? t : new Date(String(t));
			if (!Number.isNaN(e.getTime())) return e.toLocaleDateString();
		}
		return t instanceof Date ? t.toLocaleDateString() : String(t);
	}
	rememberState() {
		this.undoStack.push(this.getData()), this.undoStack.length > 100 && this.undoStack.shift(), this.redoStack.length = 0;
	}
	restoreState(e) {
		this.setAttribute("rows", String(Math.max(1, e.length))), this.setAttribute("columns", String(Math.max(1, ...e.map((e) => e.length)))), this.setAttribute("value", JSON.stringify(e));
	}
	emitStructureChange(e, t) {
		this.dispatchEvent(new CustomEvent("tp-spreadsheet-editor-structure", {
			bubbles: !0,
			composed: !0,
			detail: {
				action: e,
				index: t,
				rows: this.rows,
				columns: this.columns
			}
		}));
	}
	undo() {
		let e = this.undoStack.pop();
		e !== void 0 && (this.redoStack.push(this.getData()), this.restoreState(e));
	}
	redo() {
		let e = this.redoStack.pop();
		e !== void 0 && (this.undoStack.push(this.getData()), this.restoreState(e));
	}
	applyFormat(e) {
		e === "general" ? this.formats.delete(this.activeReference) : this.formats.set(this.activeReference, e), this.render(), this.querySelector(`[data-cell="${this.activeReference}"]`)?.focus();
	}
	toggleCellStyle(e) {
		let t = new Set(this.cellStyles.get(this.activeReference) ?? []);
		t.has(e) ? t.delete(e) : t.add(e), t.size === 0 ? this.cellStyles.delete(this.activeReference) : this.cellStyles.set(this.activeReference, t), this.render(), this.querySelector(`[data-cell="${this.activeReference}"]`)?.focus();
	}
	clearActiveFormatting() {
		this.formats.delete(this.activeReference), this.cellStyles.delete(this.activeReference), this.render(), this.querySelector(`[data-cell="${this.activeReference}"]`)?.focus();
	}
	async runToolbarCommand(e, n) {
		if (e === "clear-cells") {
			this.clearSelection();
			return;
		}
		if (e === "undo") {
			this.undo();
			return;
		}
		if (e === "redo") {
			this.redo();
			return;
		}
		if (e === "unformat") {
			this.clearActiveFormatting();
			return;
		}
		let r = n.querySelector("[data-tp-spreadsheet-editor-search]"), i = r?.querySelector("input");
		if (e === "search") {
			r != null && (r.hidden = !1), i?.focus();
			return;
		}
		if (e === "close-search") {
			i != null && (i.value = ""), this.search(""), r != null && (r.hidden = !0);
			return;
		}
		let a = u(this.activeReference);
		if (a === null) return;
		let o = this.data[a[0]]?.[a[1]] ?? "", s = this.activeReference;
		try {
			if (e === "copy" || e === "cut") await navigator.clipboard.writeText(o), t.copiedCell = {
				raw: o,
				row: a[0],
				column: a[1],
				cut: e === "cut"
			}, e === "cut" && this.commit(s, "");
			else if (e === "paste") {
				let e = await navigator.clipboard.readText(), n = t.copiedCell, r = n && !n.cut && n.raw === e ? d(e, a[0] - n.row, a[1] - n.column) : e;
				n && n.raw !== e && (t.copiedCell = null), this.commit(s, r);
			}
		} catch {
			this.dispatchEvent(new CustomEvent("tp-spreadsheet-editor-clipboard-error", {
				bubbles: !0,
				composed: !0,
				detail: { command: e }
			}));
		}
	}
	search(e) {
		let t = e.trim().toLocaleLowerCase();
		for (let e of this.querySelectorAll("[data-cell]")) {
			let n = t !== "" && e.value.toLocaleLowerCase().includes(t);
			e.toggleAttribute("data-search-match", n);
		}
	}
	evaluate(e, t) {
		let n = u(e);
		if (n === null) return "#REF!";
		if (e = `${l(n[1])}${n[0] + 1}`, t.has(e)) return "#CYCLE!";
		let r = this.data[n[0]]?.[n[1]] ?? "";
		if (!r.startsWith("=")) return r !== "" && Number.isFinite(Number(r)) ? Number(r) : r;
		t.add(e);
		try {
			return new p(f(r.slice(1)), (e) => this.evaluate(e.toUpperCase(), new Set(t)), (e, n) => this.range(e, n, t)).parse();
		} catch (e) {
			return e instanceof Error && e.message.startsWith("#") ? e.message : "#ERROR!";
		}
	}
	range(e, t, n) {
		let r = u(e), i = u(t);
		if (r === null || i === null) return [["#REF!"]];
		let a = [];
		for (let e = Math.min(r[0], i[0]); e <= Math.max(r[0], i[0]); e += 1) {
			let t = [];
			for (let a = Math.min(r[1], i[1]); a <= Math.max(r[1], i[1]); a += 1) t.push(this.evaluate(`${l(a)}${String(e + 1)}`, new Set(n)));
			a.push(t);
		}
		return a;
	}
};
customElements.get("tp-spreadsheet-editor") || customElements.define("tp-spreadsheet-editor", m);
//#endregion
export { c as a, s as i, u as n, d as o, l as r, m as t };

//# sourceMappingURL=spreadsheet-editor.js.map