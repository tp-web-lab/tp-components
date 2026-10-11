import { t as e } from "./base.js";
import "./tree.js";
//#region src/components/object-tree/object-tree.css?inline
var t = "tp-object-tree{font-size:var(--tp-object-tree-font-size,.875rem);display:block}tp-object-tree [data-tp-object-tree-row]{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}tp-object-tree [data-tp-object-tree-key]{color:var(--tp-object-tree-key-color,#6a737d)}tp-object-tree [data-tp-object-tree-separator]{color:var(--tp-object-tree-separator-color,#8c959f);margin-inline:.25em}tp-object-tree [data-tp-object-tree-summary][data-value-kind=string]{color:var(--tp-object-tree-string-color,#0a7f3f)}tp-object-tree [data-tp-object-tree-summary][data-value-kind=number]{color:var(--tp-object-tree-number-color,#0550ae)}tp-object-tree [data-tp-object-tree-summary][data-value-kind=boolean]{color:var(--tp-object-tree-boolean-color,#8250df)}tp-object-tree [data-tp-object-tree-summary][data-value-kind=null],tp-object-tree [data-tp-object-tree-summary][data-value-kind=undefined]{color:var(--tp-object-tree-nullish-color,#8c959f);font-style:italic}tp-object-tree [data-tp-object-tree-summary][data-value-kind=function]{color:var(--tp-object-tree-function-color,#953800)}tp-object-tree [data-tp-object-tree-summary][data-value-kind=date]{color:var(--tp-object-tree-date-color,#116329)}tp-object-tree [data-tp-object-tree-summary][data-value-kind=error]{color:var(--tp-object-tree-error-color,#cf222e)}tp-object-tree [data-tp-object-tree-summary][data-value-kind=circular]{color:var(--tp-object-tree-circular-color,#cf222e);font-style:italic}tp-object-tree [data-tp-object-tree-summary][data-value-kind=array],tp-object-tree [data-tp-object-tree-summary][data-value-kind=object]{color:var(--tp-object-tree-structure-color,#57606a);font-weight:600}";
//#endregion
//#region src/components/object-tree/object-tree.ts
function n(e) {
	return typeof e == "object" && !!e;
}
function r(e) {
	return typeof e == "function";
}
function i(e) {
	return e.name === "" ? "(anonymous)" : e.name;
}
function a(e) {
	return e === null ? "null" : e === void 0 ? "undefined" : typeof e == "string" ? `"${e}"` : typeof e == "number" || typeof e == "boolean" ? String(e) : typeof e == "bigint" ? `${String(e)}n` : String(e);
}
function o(e, t) {
	let n = e.key ?? "", r = t.key ?? "";
	if (n !== "" || r !== "") {
		let e = n.localeCompare(r, void 0, {
			sensitivity: "base",
			numeric: !0
		});
		if (e !== 0) return e;
	}
	return e.summary.localeCompare(t.summary, void 0, {
		sensitivity: "base",
		numeric: !0
	});
}
function s(e) {
	let t = e.children.map((e) => s(e)).sort(o);
	return {
		...e,
		children: t
	};
}
var c = {
	globalActions: [
		{
			id: "expand-all",
			label: "Expand all"
		},
		{
			id: "collapse-all",
			label: "Collapse all"
		},
		{
			id: "sort-all",
			label: "Sort all"
		},
		{
			id: "toggle-guides",
			label: "Toggle guides"
		}
	],
	getNodeActions: () => []
}, l = class o extends e {
	static styleId = "tp-object-tree-styles";
	rootNode = null;
	treeEl = null;
	inlineScriptSource = "";
	loadSequence = 0;
	static get observedAttributes() {
		return ["src"];
	}
	get src() {
		return this.getAttribute("src")?.trim() ?? "";
	}
	set src(e) {
		if (e.trim() === "") {
			this.removeAttribute("src");
			return;
		}
		this.setAttribute("src", e);
	}
	connectedCallback() {
		super.connectedCallback();
		let e = this.querySelector(":scope > script[type=\"tp/javascript\"]");
		e !== null && (this.inlineScriptSource = e.textContent?.trim() ?? ""), this.ensureStyles(), this.render(), this.bindEvents(), this.loadConfiguredValue();
	}
	attributeChangedCallback(e, t, n) {
		this.isConnected && e === "src" && t !== n && this.loadConfiguredValue();
	}
	async loadConfiguredValue() {
		let e = ++this.loadSequence;
		if (this.src !== "") {
			try {
				let t = await fetch(this.src);
				if (!t.ok) throw Error(`Unable to load "${this.src}" (${String(t.status)} ${t.statusText}).`);
				let n = await t.json();
				if (e !== this.loadSequence) return;
				this.setValue(n), this.dispatchLoadEvent("src", n);
			} catch (t) {
				if (e !== this.loadSequence) return;
				this.dispatchErrorEvent("src", t);
			}
			return;
		}
		if (this.inlineScriptSource !== "") try {
			let t = Function(`"use strict"; return (\n${this.inlineScriptSource}\n);`)();
			if (e !== this.loadSequence) return;
			this.setValue(t), this.dispatchLoadEvent("script", t);
		} catch (t) {
			if (e !== this.loadSequence) return;
			this.dispatchErrorEvent("script", t);
		}
	}
	dispatchLoadEvent(e, t) {
		this.dispatchEvent(new CustomEvent("tp-object-tree-load", {
			bubbles: !0,
			detail: {
				source: e,
				src: e === "src" ? this.src : "",
				value: t
			}
		}));
	}
	dispatchErrorEvent(e, t) {
		let n = t instanceof Error ? t.message : String(t);
		this.dispatchEvent(new CustomEvent("tp-object-tree-error", {
			bubbles: !0,
			detail: {
				message: n,
				source: e,
				src: e === "src" ? this.src : ""
			}
		}));
	}
	setValue(e) {
		this.rootNode = this.inspectValue(e, void 0, "$", /* @__PURE__ */ new WeakSet()), this.render(), this.bindEvents();
	}
	expandAll() {
		this.treeEl?.expandAll();
	}
	collapseAll() {
		this.treeEl?.collapseAll();
	}
	sortAll() {
		this.rootNode !== null && (this.rootNode = s(this.rootNode), this.render(), this.bindEvents(), this.treeEl?.expandAll());
	}
	ensureStyles() {
		if (document.getElementById(o.styleId)) return;
		let e = document.createElement("style");
		e.id = o.styleId, e.textContent = t, document.head.append(e);
	}
	bindEvents() {
		this.unbindEvents(), this.treeEl?.addEventListener("tp-tree-context-action", this.handleTreeContextAction);
	}
	unbindEvents() {
		this.treeEl?.removeEventListener("tp-tree-context-action", this.handleTreeContextAction);
	}
	handleTreeContextAction = (e) => {
		if (e.detail.scope === "global") switch (e.detail.actionId) {
			case "expand-all":
				this.expandAll();
				break;
			case "collapse-all":
				this.collapseAll();
				break;
			case "sort-all":
				this.sortAll();
				break;
			case "toggle-guides":
				this.treeEl?.toggleGuides();
				break;
			default: break;
		}
	};
	inspectValue(e, t, o, s) {
		if (e === null) return {
			id: o,
			kind: "null",
			key: t,
			summary: "null",
			children: []
		};
		if (e === void 0) return {
			id: o,
			kind: "undefined",
			key: t,
			summary: "undefined",
			children: []
		};
		if (typeof e == "string") return {
			id: o,
			kind: "string",
			key: t,
			summary: a(e),
			children: []
		};
		if (typeof e == "number") return {
			id: o,
			kind: "number",
			key: t,
			summary: a(e),
			children: []
		};
		if (typeof e == "boolean") return {
			id: o,
			kind: "boolean",
			key: t,
			summary: a(e),
			children: []
		};
		if (typeof e == "bigint") return {
			id: o,
			kind: "number",
			key: t,
			summary: a(e),
			children: []
		};
		if (r(e)) return {
			id: o,
			kind: "function",
			key: t,
			summary: `Function(${i(e)})`,
			children: []
		};
		if (e instanceof Date) return {
			id: o,
			kind: "date",
			key: t,
			summary: `Date(${e.toISOString()})`,
			children: []
		};
		if (e instanceof Error) {
			let n = [{
				id: `${o}.name`,
				kind: "string",
				key: "name",
				summary: `"${e.name}"`,
				children: []
			}, {
				id: `${o}.message`,
				kind: "string",
				key: "message",
				summary: `"${e.message}"`,
				children: []
			}];
			return typeof e.stack == "string" && e.stack !== "" && n.push({
				id: `${o}.stack`,
				kind: "string",
				key: "stack",
				summary: `"${e.stack}"`,
				children: []
			}), {
				id: o,
				kind: "error",
				key: t,
				summary: `${e.name}: ${e.message}`,
				children: n
			};
		}
		if (!n(e)) return {
			id: o,
			kind: "string",
			key: t,
			summary: String(e),
			children: []
		};
		if (s.has(e)) return {
			id: o,
			kind: "circular",
			key: t,
			summary: "[Circular]",
			children: []
		};
		if (s.add(e), Array.isArray(e)) {
			let n = e.map((e, t) => this.inspectValue(e, String(t), `${o}[${String(t)}]`, s));
			return {
				id: o,
				kind: "array",
				key: t,
				summary: `Array(${e.length})`,
				children: n
			};
		}
		let c = Object.entries(e), l = c.map(([e, t]) => this.inspectValue(t, e, `${o}.${e}`, s));
		return {
			id: o,
			kind: "object",
			key: t,
			summary: `Object(${c.length})`,
			children: l
		};
	}
	render() {
		this.unbindEvents(), this.innerHTML = "";
		let e = document.createElement("tp-tree");
		e.setAttribute("guides", ""), e.setContextMenuConfig(c);
		let t = document.createElement("ul");
		this.rootNode !== null && t.append(this.renderNode(this.rootNode)), e.append(t), this.append(e), this.treeEl = e, this.bindEvents(), this.rootNode !== null && e.expandAll();
	}
	renderNode(e) {
		let t = document.createElement("li");
		t.setAttribute("data-node-id", e.id), t.setAttribute("data-kind", e.kind), typeof e.key == "string" && e.key !== "" ? t.setAttribute("data-label", e.key) : t.setAttribute("data-label", e.summary);
		let n = document.createElement("span");
		if (n.setAttribute("data-tp-object-tree-row", ""), typeof e.key == "string") {
			let t = document.createElement("span");
			t.setAttribute("data-tp-object-tree-key", ""), t.textContent = e.key;
			let r = document.createElement("span");
			r.setAttribute("data-tp-object-tree-separator", ""), r.textContent = ":", n.append(t, r);
		}
		let r = document.createElement("span");
		if (r.setAttribute("data-tp-object-tree-summary", ""), r.setAttribute("data-value-kind", e.kind), r.textContent = this.formatSummary(e), n.append(r), t.append(n), e.children.length > 0) {
			let n = document.createElement("ul");
			for (let t of e.children) n.append(this.renderNode(t));
			t.append(n);
		}
		return t;
	}
	formatSummary(e) {
		switch (e.kind) {
			case "string": return e.summary;
			case "number":
			case "boolean": return e.summary;
			case "null":
			case "undefined": return e.summary;
			case "function": return `ƒ ${e.summary.replace("Function", "")}`;
			case "date": return e.summary.replace("Date", "");
			case "error": return e.summary;
			case "array": return e.summary;
			case "object": return e.summary;
			case "circular": return "↻ Circular";
			default: return e.summary;
		}
	}
};
customElements.get("tp-object-tree") || customElements.define("tp-object-tree", l);
//#endregion
export { l as t };

//# sourceMappingURL=object-tree.js.map