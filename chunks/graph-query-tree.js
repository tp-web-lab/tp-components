import { i as e, t } from "./graph-editor.js";
//#region src/components/graph-query-tree/graph-query-tree.css?inline
var n = "tp-graph-query-tree{display:block}.tp-query-relation{fill:var(--tp-neutral-fill-soft);stroke:var(--tp-neutral-text-colorful)}.tp-query-operator{fill:var(--tp-paper-color);stroke:var(--tp-brand-stroke-mid)}.tp-query-symbol{fill:var(--tp-text-body);pointer-events:none;font:600 16px system-ui,sans-serif}.tp-query-detail{fill:var(--tp-neutral-text-colorful);pointer-events:none;font:11px system-ui,sans-serif}.tp-query-parameter{white-space:nowrap;align-items:center;gap:.3rem;display:inline-flex}.tp-query-parameter[hidden]{display:none}.tp-query-parameter :is(input,select){box-sizing:border-box;border:1px solid var(--tp-neutral-stroke-soft);width:8rem;min-height:1.8rem;color:inherit;background:var(--tp-paper-color);border-radius:.35rem}.tp-query-expression input{width:min(24rem,32vw)}.tp-query-sql pre{color:var(--tp-text-body);background:var(--tp-neutral-fill-softer);border-radius:.4rem;margin:0;padding:.75rem;overflow:auto}.tp-query-sql code{font:.86rem/1.5 ui-monospace,SFMono-Regular,Consolas,monospace}.tp-query-error{color:var(--tp-danger-text-colorful)}", r = "query-relation", i = "query-selection", a = "query-projection", o = "query-rename", s = "query-aggregation", c = "query-sort", l = "query-join", u = "query-product", d = "query-union", f = "query-intersection", p = "query-difference", m = "query-edge", h = [
	r,
	i,
	a,
	o,
	s,
	c,
	l,
	u,
	d,
	f,
	p
], g = [
	i,
	a,
	o,
	s,
	c
];
function _(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function v(e, t, n = "") {
	let r = e.data?.[t];
	return typeof r == "string" ? r : n;
}
function y(e) {
	return e === "query-relation" ? 0 : g.includes(e) ? 1 : 2;
}
function b(e) {
	return e.nodes.filter((e) => e.type !== t);
}
function x(e) {
	let t = new Map(b(e).map((e) => [e.id, e]));
	for (let e of t.values()) if (!h.includes(e.type)) throw TypeError(`Unsupported query-tree node type: ${e.type}`);
	let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
	for (let i of e.edges) {
		if (!i.source || !i.target || !t.has(i.source) || !t.has(i.target)) throw TypeError(`Query edge "${i.id}" must connect two query nodes.`);
		if (i.source === i.target) throw TypeError("Query-tree self-links are not allowed.");
		if (i.type !== void 0 && i.type !== "query-edge") throw TypeError(`Unsupported query-tree edge type: ${i.type}`);
		if (i.direction !== void 0 && i.direction !== "forward") throw TypeError("Query-tree edges must point from operands to operators.");
		n.set(i.target, (n.get(i.target) ?? 0) + 1), r.set(i.source, (r.get(i.source) ?? 0) + 1);
	}
	for (let e of t.values()) {
		if ((n.get(e.id) ?? 0) > y(e.type)) throw TypeError(`Operator "${e.label ?? e.id}" has too many operands.`);
		if ((r.get(e.id) ?? 0) > 1) throw TypeError(`Node "${e.label ?? e.id}" cannot feed several parents in a tree.`);
	}
	let i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), o = (t) => {
		if (i.has(t)) throw TypeError("The query tree contains a cycle.");
		if (!a.has(t)) {
			i.add(t);
			for (let n of e.edges.filter((e) => e.source === t && e.target)) o(n.target);
			i.delete(t), a.add(t);
		}
	};
	for (let e of t.keys()) o(e);
}
function S(e) {
	return e.split("\n").map((e) => `  ${e}`).join("\n");
}
function C(e, t) {
	let n = new Map(e.nodes.map((e) => [e.id, e]));
	return e.edges.filter((e) => e.target === t.id && e.source).sort((e, t) => (n.get(e.source)?.x ?? 0) - (n.get(t.source)?.x ?? 0));
}
function w(e) {
	x(e);
	let t = new Map(b(e).map((e) => [e.id, e]));
	if (t.size === 0) throw TypeError("Add a relation to generate SQL.");
	let n = new Set(e.edges.map((e) => e.source).filter((e) => e !== void 0)), r = [...t.values()].filter((e) => !n.has(e.id));
	if (r.length !== 1) throw TypeError("A query tree must have exactly one root operator.");
	let i = (n) => {
		let r = C(e, n), a = y(n.type);
		if (r.length !== a) throw TypeError(`Operator "${n.label ?? n.id}" expects ${a} operand${a === 1 ? "" : "s"}.`);
		let o = r.map((e) => t.get(e.source)).filter((e) => e !== void 0);
		if (n.type === "query-relation") {
			let e = v(n, "table", n.label ?? "table").trim(), t = v(n, "alias").trim();
			if (e === "") throw TypeError(`Relation "${n.id}" needs a table name.`);
			return `SELECT *\nFROM ${e}${t === "" ? "" : ` AS ${t}`}`;
		}
		let s = (e, t) => `(\n${S(i(e))}\n) AS ${t}`;
		if (n.type === "query-selection") return `SELECT *\nFROM ${s(o[0], "q")}\nWHERE ${v(n, "condition", "TRUE")}`;
		if (n.type === "query-projection") return `SELECT ${v(n, "columns", "*")}\nFROM ${s(o[0], "q")}`;
		if (n.type === "query-rename") return `SELECT *\nFROM ${s(o[0], v(n, "alias", "q"))}`;
		if (n.type === "query-sort") return `SELECT *\nFROM ${s(o[0], "q")}\nORDER BY ${v(n, "orderBy", "1")}`;
		if (n.type === "query-aggregation") {
			let e = v(n, "groupBy").trim(), t = v(n, "expressions", "COUNT(*)");
			return `SELECT ${e === "" ? t : `${e}, ${t}`}\nFROM ${s(o[0], "q")}${e === "" ? "" : `\nGROUP BY ${e}`}`;
		}
		let c = i(o[0]), l = i(o[1]);
		if (n.type === "query-join") return `SELECT *\nFROM (\n${S(c)}\n) AS l\n${v(n, "joinType", "INNER").toUpperCase()} JOIN (\n${S(l)}\n) AS r\nON ${v(n, "condition", "TRUE")}`;
		if (n.type === "query-product") return `SELECT *\nFROM (\n${S(c)}\n) AS l\nCROSS JOIN (\n${S(l)}\n) AS r`;
		let u = n.type === "query-union" ? "UNION" : n.type === "query-intersection" ? "INTERSECT" : "EXCEPT";
		return `(\n${S(c)}\n)\n${u}\n(\n${S(l)}\n)`;
	};
	return `${i(r[0])};`;
}
function T(e, t) {
	let n = v(e, "table", e.label ?? "Relation"), r = v(e, "alias");
	return `<rect x="-58" y="-26" width="116" height="52" rx="4" class="tp-graph-shape tp-query-relation${t ? " is-selected" : ""}"/><text class="tp-query-symbol" text-anchor="middle" y="-3">${_(n)}</text>${r === "" ? "" : `<text class="tp-query-detail" text-anchor="middle" y="16">AS ${_(r)}</text>`}`;
}
function E(e, t, n = "") {
	return (r, i) => `<rect x="-60" y="-30" width="120" height="60" rx="26" class="tp-graph-shape tp-query-operator${i ? " is-selected" : ""}"/><text class="tp-query-symbol" text-anchor="middle" y="-5">${e}</text>${t ? `<text class="tp-query-detail" text-anchor="middle" y="16">${_(v(r, t, n))}</text>` : ""}`;
}
var D = class t extends e {
	static queryStyleId = "tp-graph-query-tree-styles";
	selectedQueryId = null;
	constructor() {
		super(), this.unregisterPalette("generic"), this.activeEdgeDirection = "forward";
		let e = {
			north: {
				x: 0,
				y: -30
			},
			south: {
				x: 0,
				y: 30
			}
		}, t = {
			north: {
				x: 0,
				y: -30
			},
			west: {
				x: -60,
				y: 0
			},
			east: {
				x: 60,
				y: 0
			}
		};
		this.registerPalette({
			id: "query-relations",
			label: "Relations",
			shapes: [{
				type: r,
				label: "Relation",
				description: "Base table or view",
				width: 116,
				height: 52,
				ports: { north: {
					x: 0,
					y: -26
				} },
				createData: () => ({
					table: "table",
					alias: ""
				}),
				render: T
			}]
		}), this.registerPalette({
			id: "query-unary",
			label: "Unary operators",
			shapes: [
				{
					type: i,
					label: "Selection",
					description: "Filter rows",
					width: 120,
					height: 60,
					ports: e,
					createData: () => ({ condition: "condition" }),
					render: E("σ", "condition", "condition")
				},
				{
					type: a,
					label: "Projection",
					description: "Choose columns",
					width: 120,
					height: 60,
					ports: e,
					createData: () => ({ columns: "*" }),
					render: E("π", "columns", "*")
				},
				{
					type: o,
					label: "Rename",
					description: "Rename a relation",
					width: 120,
					height: 60,
					ports: e,
					createData: () => ({ alias: "q" }),
					render: E("ρ", "alias", "q")
				},
				{
					type: s,
					label: "Aggregation",
					description: "Group and aggregate",
					width: 120,
					height: 60,
					ports: e,
					createData: () => ({
						groupBy: "",
						expressions: "COUNT(*)"
					}),
					render: E("γ", "expressions", "COUNT(*)")
				},
				{
					type: c,
					label: "Sort",
					description: "Order rows",
					width: 120,
					height: 60,
					ports: e,
					createData: () => ({ orderBy: "column" }),
					render: E("τ", "orderBy", "column")
				}
			]
		}), this.registerPalette({
			id: "query-binary",
			label: "Binary operators",
			shapes: [
				{
					type: l,
					label: "Join",
					description: "Conditional join",
					width: 120,
					height: 60,
					ports: t,
					createData: () => ({
						condition: "l.id = r.id",
						joinType: "inner"
					}),
					render: E("⋈", "condition", "condition")
				},
				{
					type: u,
					label: "Product",
					description: "Cartesian product",
					width: 120,
					height: 60,
					ports: t,
					render: E("×")
				},
				{
					type: d,
					label: "Union",
					description: "Set union",
					width: 120,
					height: 60,
					ports: t,
					render: E("∪")
				},
				{
					type: f,
					label: "Intersection",
					description: "Set intersection",
					width: 120,
					height: 60,
					ports: t,
					render: E("∩")
				},
				{
					type: p,
					label: "Difference",
					description: "Set difference",
					width: 120,
					height: 60,
					ports: t,
					render: E("−")
				}
			]
		}), this.addEventListener("tp-graph-selection-change", (e) => {
			this.selectedQueryId = e.detail.id, this.updateQueryControls();
		});
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(t.queryStyleId, n);
	}
	setGraph(e) {
		let t = this.selectedQueryId;
		x(e), super.setGraph(e), t && e.nodes.some((e) => e.id === t) && this.selectMany([t]);
	}
	addNode(e, t, n) {
		if (e !== "comment" && !h.includes(e)) throw TypeError(`Unsupported query-tree node type: ${e}`);
		return super.addNode(e, t, n);
	}
	addEdge(e, t, n = m, r, i, a = "forward") {
		if (a !== "forward") throw TypeError("Query-tree edges must be forward.");
		return super.addEdge(e, t, n, r, i, a);
	}
	toSql() {
		return w(this.value);
	}
	edgeDirections() {
		return ["forward"];
	}
	validateConnection(e, t, n) {
		super.validateConnection(e, t, n);
		let r = this.value, i = r.nodes.find((t) => t.id === e), a = r.nodes.find((e) => e.id === t);
		if (!i || !a || i.type === "comment" || a.type === "comment") throw TypeError("Query edges must connect query nodes.");
		if (n !== "query-edge" && n !== "edge") throw TypeError(`Unsupported query-tree edge type: ${n}`);
		if (a.type === "query-relation") throw TypeError("A relation cannot receive an operand.");
		if (r.edges.some((t) => t.source === e)) throw TypeError("A query-tree node can have only one parent.");
		if (r.edges.filter((e) => e.target === t).length >= y(a.type)) throw TypeError("This operator already has all its operands.");
	}
	renderToolbarActions() {
		return "<label class=\"tp-query-parameter\" hidden>Table <input type=\"text\" data-query-table disabled></label><label class=\"tp-query-parameter\" hidden>Alias <input type=\"text\" data-query-alias disabled></label><label class=\"tp-query-parameter tp-query-expression\" hidden>Expression <input type=\"text\" data-query-expression disabled></label><label class=\"tp-query-parameter\" hidden>Group by <input type=\"text\" data-query-group disabled></label><label class=\"tp-query-parameter\" hidden>Join <select data-query-join disabled><option value=\"inner\">Inner</option><option value=\"left\">Left</option><option value=\"right\">Right</option><option value=\"full\">Full</option></select></label>";
	}
	bindExtensionEvents() {
		this.querySelector("[data-query-table]")?.addEventListener("change", (e) => this.updateSelectedData("table", e.currentTarget.value)), this.querySelector("[data-query-alias]")?.addEventListener("change", (e) => this.updateSelectedData("alias", e.currentTarget.value)), this.querySelector("[data-query-expression]")?.addEventListener("change", (e) => {
			let t = this.selectedNode();
			t && this.updateSelectedData(this.expressionKey(t.type), e.currentTarget.value);
		}), this.querySelector("[data-query-group]")?.addEventListener("change", (e) => this.updateSelectedData("groupBy", e.currentTarget.value)), this.querySelector("[data-query-join]")?.addEventListener("change", (e) => this.updateSelectedData("joinType", e.currentTarget.value)), this.updateQueryControls();
	}
	renderResults() {
		try {
			return `<h3 class="tp-graph-results-header">Equivalent SQL</h3><div class="tp-graph-results-content tp-query-sql"><pre><code>${_(this.toSql())}</code></pre></div>`;
		} catch (e) {
			return `<h3 class="tp-graph-results-header">Equivalent SQL</h3><div class="tp-graph-results-content tp-query-error">${_(e instanceof Error ? e.message : "SQL is unavailable.")}</div>`;
		}
	}
	selectedNode() {
		return this.value.nodes.find((e) => e.id === this.selectedQueryId);
	}
	expressionKey(e) {
		return e === "query-selection" || e === "query-join" ? "condition" : e === "query-projection" ? "columns" : e === "query-aggregation" ? "expressions" : "orderBy";
	}
	updateSelectedData(e, t) {
		if (!this.selectedQueryId) return;
		let n = this.value, r = n.nodes.find((e) => e.id === this.selectedQueryId);
		r && (r.data = {
			...r.data ?? {},
			[e]: t.trim()
		}, this.setGraph(n));
	}
	updateQueryControls() {
		let e = this.selectedNode(), t = e?.type === r, n = t || e?.type === "query-rename", o = e ? [
			i,
			a,
			s,
			c,
			l
		].includes(e.type) : !1, u = (e, t, n) => {
			let r = this.querySelector(e);
			r && (r.disabled = !t, r.closest(".tp-query-parameter")?.toggleAttribute("hidden", !t), r.value = n);
		};
		u("[data-query-table]", t, e ? v(e, "table") : ""), u("[data-query-alias]", n, e ? v(e, "alias") : "");
		let d = e ? this.expressionKey(e.type) : "condition";
		u("[data-query-expression]", o, e ? v(e, d) : ""), u("[data-query-group]", e?.type === s, e ? v(e, "groupBy") : ""), u("[data-query-join]", e?.type === l, e ? v(e, "joinType", "inner") : "inner");
	}
};
customElements.get("tp-graph-query-tree") || customElements.define("tp-graph-query-tree", D);
//#endregion
export { l as a, r as c, c as d, d as f, x as h, f as i, o as l, w as m, p as n, u as o, D as p, m as r, a as s, s as t, i as u };

