import "./lib/typescript/typescript.js";
import { a as e, i as t } from "./graph-editor.js";
//#region src/components/graph-logical-circuit/graph-logical-circuit.css?inline
var n = "tp-graph-logical-circuit{display:block}.tp-logic-results-layout{grid-template-columns:fit-content(65%) minmax(20rem,1fr);display:grid}.tp-logic-results-layout>section+section{border-inline-start:1px solid var(--tp-neutral-stroke-soft)}.tp-logic-results-layout table{width:max-content}.tp-logic-results-layout :is(th,td).tp-logic-truth-boundary{border-inline-start-width:3px;border-inline-start-color:var(--tp-neutral-stroke-strong,var(--tp-text-body))}.tp-logic-equations-header{align-items:center;gap:.5rem;display:flex}.tp-logic-equations-header tp-icon-button{margin-inline-start:auto}.tp-logic-equations{align-content:start;gap:.5rem;display:grid}.tp-logic-equation{text-align:start;font-size:1.05rem}.tp-logic-equation .tp-markdown-output p{text-align:start;display:block}.tp-logic-equation [data-mathjax-display=false],.tp-logic-equation mjx-container:not([display=true]){margin:0;display:inline}.tp-graph-results .tp-logic-equation mjx-container svg{min-width:0;max-width:none;vertical-align:inherit;display:inline-block}.tp-logic-equation .tp-markdown-output>:first-child{margin-block-start:0}.tp-logic-equation .tp-markdown-output>:last-child{margin-block-end:0}@media (width<=48rem){.tp-logic-results-layout{grid-template-columns:minmax(0,1fr)}.tp-logic-results-layout>section+section{border-block-start:1px solid var(--tp-neutral-stroke-soft);border-inline-start:0}}.tp-logic-terminal,.tp-logic-gate{transition:fill .2s,stroke .2s}.tp-logic-terminal.is-true{fill:var(--tp-success-fill-softer,#dcfce7);stroke:var(--tp-success-stroke-mid,#16a34a)}.tp-logic-terminal.is-false{fill:var(--tp-danger-fill-softer,#fee2e2);stroke:var(--tp-danger-stroke-mid,#dc2626)}.tp-logic-gate,.tp-logic-gate.is-selected,.tp-logic-gate.is-true,.tp-logic-gate.is-false,.tp-logic-hub{fill:var(--tp-neutral-fill-soft);stroke:var(--tp-text-body)}.tp-logic-gate-detail{fill:none;stroke-width:2px;vector-effect:non-scaling-stroke}.tp-logic-gate-detail,.tp-logic-gate-detail.is-true,.tp-logic-gate-detail.is-false{stroke:var(--tp-text-body)}.tp-logic-gate-label{font-size:18px;font-weight:700}.tp-logic-inversion{fill:var(--tp-paper-color,Canvas);stroke:currentColor;stroke-width:2px;vector-effect:non-scaling-stroke}.tp-graph-node.is-toggleable{cursor:pointer}.tp-graph-edge.is-true .tp-graph-edge-line{stroke:var(--tp-success-stroke-mid,#16a34a)}.tp-graph-edge.is-false .tp-graph-edge-line{stroke:var(--tp-danger-stroke-mid,#dc2626)}.tp-graph-palette .tp-logic-terminal,.tp-graph-palette .tp-logic-gate,.tp-graph-palette .tp-logic-gate-detail,.tp-graph-palette .tp-logic-inversion{stroke:var(--tp-text-body)}.tp-graph-palette .tp-logic-terminal{fill:var(--tp-neutral-fill-soft)}.tp-graph-palette .tp-logic-gate-label{font-size:21px}.tp-graph-palette .tp-logic-terminal+.tp-graph-label{fill:var(--tp-text-body);font-size:16px;font-weight:700}@media (prefers-reduced-motion:reduce){tp-graph-logical-circuit,tp-graph-logical-circuit *{transition-duration:.01ms!important;transition-delay:0s!important}}", r = "logic-input", i = "logic-output", a = "logic-and", o = "logic-or", s = "logic-not", c = "logic-xor", l = "logic-nand", u = "logic-nor", d = "logic-hub", f = "logic-and-3", p = "logic-or-3", m = "logic-xor-3", h = "logic-nand-3", g = "logic-nor-3", _ = "logic-wire", v = [
	f,
	p,
	m,
	h,
	g
], y = [
	a,
	o,
	s,
	c,
	l,
	u,
	...v
], b = [
	r,
	i,
	d,
	...y
];
function x(e) {
	return e.endsWith("-3") ? e.slice(0, -2) : e;
}
function S(e) {
	return e === "logic-not" ? ["west"] : v.includes(e) ? [
		"north",
		"west",
		"south"
	] : ["north", "south"];
}
function C(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function w(e) {
	return e.state?.value === !0;
}
function T(e) {
	let t = structuredClone(e), n = new Map(t.nodes.map((e) => [e.id, e])), r = /* @__PURE__ */ new Map();
	for (let e of t.edges) {
		let t = e.source === void 0 ? void 0 : n.get(e.source), i = e.target === void 0 ? void 0 : n.get(e.target);
		if ((t?.type === "logic-input" || t?.type === "logic-hub" || t && y.includes(t.type)) && (e.sourcePort ??= "east"), i) {
			if (i.type === "logic-output") e.targetPort ??= "west";
			else if (y.includes(i.type)) {
				let t = r.get(i.id) ?? /* @__PURE__ */ new Set();
				e.targetPort ||= S(i.type).find((e) => !t.has(e)), e.targetPort && t.add(e.targetPort), r.set(i.id, t);
			}
		}
	}
	return t;
}
function E(e, t) {
	return e = x(e), e === "logic-not" ? !(t[0] ?? !1) : e === "logic-and" ? t.length > 0 && t.every(Boolean) : e === "logic-or" ? t.some(Boolean) : e === "logic-xor" ? t.filter(Boolean).length % 2 == 1 : e === "logic-nand" ? !(t.length > 0 && t.every(Boolean)) : e === "logic-nor" ? !t.some(Boolean) : t[0] ?? !1;
}
function D(e) {
	return `\\mathrm{${e.trim().replaceAll("\\", "\\backslash ").replaceAll("{", "\\{").replaceAll("}", "\\}").replaceAll("_", "\\_").replaceAll("#", "\\#").replaceAll("%", "\\%").replaceAll("&", "\\&").replaceAll("$", "\\$").replaceAll("^", "\\^{}").replaceAll("~", "\\sim ").replaceAll("<", "\\lt ").replaceAll(">", "\\gt ").replaceAll("`", "").replaceAll(" ", "\\ ") || "?"}}`;
}
function O(e, t = "electronic") {
	k(e);
	let n = new Map(e.nodes.map((e) => [e.id, e])), r = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = (i) => {
		let s = r.get(i);
		if (s !== void 0) return s;
		if (a.has(i)) throw TypeError("Logical equations require an acyclic circuit.");
		let c = n.get(i);
		if (!c) return "0";
		if (c.type === "logic-input") return D(c.label ?? c.id);
		a.add(i);
		let l = e.edges.filter((e) => e.target === i && e.source !== void 0).map((e) => o(e.source)), u = x(c.type), d = (e) => `\\left(${l.join(` ${e} `)}\\right)`, f, p = (e) => t === "electronic" ? `\\overline{${e}}` : `\\lnot ${e}`;
		return f = c.type === "logic-output" || c.type === "logic-hub" ? l[0] ?? "0" : u === "logic-not" ? p(l[0] ?? "0") : u === "logic-and" ? d(t === "electronic" ? "\\cdot" : "\\land") : u === "logic-or" ? d(t === "electronic" ? "+" : "\\lor") : u === "logic-xor" ? d("\\oplus") : u === "logic-nand" ? p(d(t === "electronic" ? "\\cdot" : "\\land")) : u === "logic-nor" ? p(d(t === "electronic" ? "+" : "\\lor")) : l[0] ?? "0", a.delete(i), r.set(i, f), f;
	};
	return e.nodes.filter((e) => e.type === i).map((e) => ({
		outputId: e.id,
		output: e.label ?? e.id,
		latex: `${D(e.label ?? e.id)} = ${o(e.id)}`
	}));
}
function k(e) {
	let t = new Map(e.nodes.map((e) => [e.id, e]));
	for (let t of e.nodes) if (t.type !== "comment" && !b.includes(t.type)) throw TypeError(`Unsupported logical-circuit node type: ${t.type}`);
	let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
	for (let i of e.edges) {
		if (i.source === void 0 || i.target === void 0) continue;
		let e = t.get(i.source), a = t.get(i.target);
		if (!e || !a || e.type === "comment" || a.type === "comment") throw TypeError(`Wire "${i.id}" must connect two logical elements.`);
		if (i.source === i.target) throw TypeError("Self-links are not allowed in combinational circuits.");
		if (e.type === "logic-output") throw TypeError("An output cannot be the source of a wire.");
		if (a.type === "logic-input") throw TypeError("An input cannot be the target of a wire.");
		if (i.type !== void 0 && i.type !== "logic-wire") throw TypeError(`Unsupported wire type: ${i.type}`);
		if (i.direction !== void 0 && i.direction !== "forward") throw TypeError("Logical wires must be forward.");
		if (n.set(a.id, (n.get(a.id) ?? 0) + 1), i.targetPort && y.includes(a.type)) {
			if (!S(a.type).includes(i.targetPort)) throw TypeError(`Invalid input port for ${a.type}: ${i.targetPort}`);
			let e = r.get(a.id) ?? /* @__PURE__ */ new Set();
			if (e.has(i.targetPort)) throw TypeError(`Input port ${i.targetPort} is already connected.`);
			e.add(i.targetPort), r.set(a.id, e);
		}
	}
	for (let t of e.nodes) {
		let e = n.get(t.id) ?? 0;
		if (t.type === "logic-input" || t.type === "comment") continue;
		let r = t.type === "logic-not" || t.type === "logic-output" ? 1 : v.includes(t.type) ? 3 : t.type === "logic-hub" ? 4 : 2;
		if (e > r) {
			let e = t.type === "logic-not" ? "NOT gates" : t.type === "logic-output" ? "Outputs" : "This element";
			throw TypeError(`${e} accept${e === "This element" ? "s" : ""} only ${r} input wire${r === 1 ? "" : "s"}.`);
		}
	}
}
function A(e) {
	k(e);
	let t = structuredClone(e), n = new Map(t.nodes.map((e) => [e.id, e]));
	for (let e = 0; e < t.nodes.length; e += 1) {
		let e = !1;
		for (let r of t.nodes) {
			if (r.type === "logic-input" || r.type === "comment") continue;
			let i = t.edges.filter((e) => e.target === r.id && e.source !== void 0);
			if (i.length === 0 && r.type === "logic-output") continue;
			let a = i.map((e) => w(n.get(e.source))), o = r.type === "logic-output" || r.type === "logic-hub" ? a[0] ?? !1 : E(r.type, a);
			w(r) !== o && (e = !0), r.state = {
				...r.state ?? {},
				value: o
			};
		}
		if (!e) break;
	}
	for (let e of t.edges) {
		let t = e.source === void 0 ? void 0 : n.get(e.source);
		e.state = {
			...e.state ?? {},
			value: t ? w(t) : !1
		};
	}
	return t;
}
function j(e, t, n) {
	let r = w(e);
	return `${n === "input" ? `<circle r="18" class="tp-graph-shape tp-logic-terminal tp-logic-input${t ? " is-selected" : ""} ${r ? "is-true" : "is-false"}" />` : `<rect x="-18" y="-18" width="36" height="36" class="tp-graph-shape tp-logic-terminal tp-logic-output${t ? " is-selected" : ""} ${r ? "is-true" : "is-false"}" />`}
    <text class="tp-graph-label" text-anchor="middle" dominant-baseline="central">${C(e.label ?? n)}</text>`;
}
function M(e, t) {
	return `<rect x="-28" y="-20" width="56" height="40" class="tp-graph-shape tp-logic-hub${t ? " is-selected" : ""}" />
    <text class="tp-graph-label" text-anchor="middle" dominant-baseline="central">${C(e.label ?? "Hub")}</text>`;
}
function N(e, t, n, r, i = !1, a = "iso") {
	let o = w(e), s = `tp-graph-shape tp-logic-gate${t ? " is-selected" : ""} ${o ? "is-true" : "is-false"}`;
	if (a === "ansi") {
		let e = x(n);
		return `${e === "logic-not" ? `<path d="M -30 -24 V 24 L 30 0 Z" class="${s}" />` : e === "logic-or" || e === "logic-nor" || e === "logic-xor" ? `<path d="M -24 -24 Q -8 0 -24 24 Q 10 24 30 0 Q 10 -24 -24 -24 Z" class="${s}" />
          <path d="M -30 -20 H -20 M -30 20 H -20${e === "logic-xor" ? " M -29 -24 Q -13 0 -29 24" : ""}" class="tp-logic-gate-detail ${o ? "is-true" : "is-false"}" />` : `<path d="M -30 -24 H 6 A 24 24 0 0 1 6 24 H -30 Z" class="${s}" />`}${i ? "<circle cx=\"35\" cy=\"0\" r=\"5\" class=\"tp-logic-inversion\" />" : ""}`;
	}
	return `<rect x="-30" y="-24" width="60" height="48" class="${s}" />
    ${i ? "<circle cx=\"35\" cy=\"0\" r=\"5\" class=\"tp-logic-inversion\" />" : ""}
    <text class="tp-graph-label tp-logic-gate-label" text-anchor="middle" dominant-baseline="central">${r}</text>`;
}
var P = class x extends t {
	static logicStyleId = "tp-graph-logical-circuit-styles";
	gateRepresentation = "iso";
	logicalEquationNotation = "electronic";
	constructor() {
		super(), this.unregisterPalette("generic");
		let e = {
			north: {
				x: -30,
				y: -20
			},
			south: {
				x: -30,
				y: 20
			},
			east: {
				x: 30,
				y: 0
			}
		}, t = {
			north: {
				x: -30,
				y: -20
			},
			south: {
				x: -30,
				y: 20
			},
			east: {
				x: 40,
				y: 0
			}
		}, n = {
			north: {
				x: -30,
				y: -20
			},
			west: {
				x: -30,
				y: 0
			},
			south: {
				x: -30,
				y: 20
			},
			east: {
				x: 30,
				y: 0
			}
		}, _ = {
			west: {
				x: -30,
				y: 0
			},
			east: {
				x: 40,
				y: 0
			}
		}, v = (r, i, a, o = !1, s = !1) => ({
			type: r,
			label: i,
			description: `${i} gate`,
			width: o ? 80 : 60,
			height: 48,
			ports: r === "logic-not" ? _ : s ? {
				...n,
				...o ? { east: {
					x: 40,
					y: 0
				} } : {}
			} : o ? t : e,
			render: (e, t) => N(e, t, r, a, o, this.gateRepresentation)
		});
		this.registerPalette({
			id: "logic-io",
			label: "Inputs / outputs",
			shapes: [
				{
					type: r,
					label: "Input",
					description: "Toggleable input",
					width: 36,
					height: 36,
					ports: { east: {
						x: 18,
						y: 0
					} },
					createData: () => ({ value: !1 }),
					render: (e, t) => j(e, t, "input")
				},
				{
					type: i,
					label: "Output",
					description: "Toggleable output",
					width: 36,
					height: 36,
					ports: { west: {
						x: -18,
						y: 0
					} },
					createData: () => ({ value: !1 }),
					render: (e, t) => j(e, t, "output")
				},
				{
					type: d,
					label: "Hub",
					description: "Four-port hub",
					width: 56,
					height: 40,
					ports: {
						north: {
							x: 0,
							y: -20
						},
						east: {
							x: 28,
							y: 0
						},
						south: {
							x: 0,
							y: 20
						},
						west: {
							x: -28,
							y: 0
						}
					},
					render: M
				}
			]
		}), this.registerPalette({
			id: "logic-1",
			label: "1 output / 1 input",
			shapes: [v(s, "NOT", "1", !0)]
		}), this.registerPalette({
			id: "logic-2",
			label: "1 output / 2 inputs",
			shapes: [
				v(a, "AND", "&"),
				v(o, "OR", "≥1"),
				v(c, "XOR", "=1"),
				v(l, "NAND", "&", !0),
				v(u, "NOR", "≥1", !0)
			]
		}), this.registerPalette({
			id: "logic-3",
			label: "1 output / 3 inputs",
			shapes: [
				v(f, "AND 3", "&", !1, !0),
				v(p, "OR 3", "≥1", !1, !0),
				v(m, "XOR 3", "=1", !1, !0),
				v(h, "NAND 3", "&", !0, !0),
				v(g, "NOR 3", "≥1", !0, !0)
			]
		}), this.portsVisible = !0;
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(x.logicStyleId, n);
	}
	isSupportedLogicNode(e) {
		return e === "comment" || b.includes(e);
	}
	validateLogicGraph(e) {
		k(e);
	}
	setGraph(e) {
		let n = T(e);
		this.validateLogicGraph(n), t.prototype.setGraph.call(this, n);
	}
	addNode(e, n, r) {
		if (!this.isSupportedLogicNode(e)) throw TypeError(`Unsupported logical-circuit node type: ${e}`);
		return t.prototype.addNode.call(this, e, n, r);
	}
	addEdge(e, t, n = _, r, i, a = "forward") {
		if (a !== "forward") throw TypeError("Logical wires must be forward.");
		this.validateConnection(e, t, n), this.assertInputCapacity(t);
		let o = this.resolveInputPort(t, i);
		return super.addEdge(e, t, n, r, o, a);
	}
	reconnectEdge(e, t, n, r) {
		t === "target" && this.assertInputCapacity(n, e);
		let i = t === "target" ? this.resolveInputPort(n, r, e) ?? r : r;
		return super.reconnectEdge(e, t, n, i);
	}
	edgeDirections() {
		return ["forward"];
	}
	validateConnection(e, t, n) {
		super.validateConnection(e, t, n);
		let r = this.value, i = r.nodes.find((t) => t.id === e), a = r.nodes.find((e) => e.id === t);
		if (!i || !a || i.type === "comment" || a.type === "comment") throw TypeError("A wire must connect two logical elements.");
		if (e === t) throw TypeError("Self-links are not allowed in combinational circuits.");
		if (i.type === "logic-output") throw TypeError("An output cannot be the source of a wire.");
		if (a.type === "logic-input") throw TypeError("An input cannot be the target of a wire.");
		if (n !== "logic-wire") throw TypeError(`Unsupported wire type: ${n}`);
	}
	toggle(e, t = !0) {
		let n = this.value, r = n.nodes.find((t) => t.id === e);
		if (!r || r.type !== "logic-input" && r.type !== "logic-output") throw TypeError("Only inputs and outputs can be toggled.");
		let i = !w(r);
		return r.state = {
			...r.state ?? {},
			value: i
		}, this.setGraph(t && r.type === "logic-input" ? A(n) : n), this.dispatchEvent(new CustomEvent("tp-logic-toggle", {
			bubbles: !0,
			detail: {
				id: e,
				value: i,
				graph: this.value
			}
		})), i;
	}
	evaluate() {
		this.setGraph(A(this.value)), this.dispatchEvent(new CustomEvent("tp-logic-evaluate", {
			bubbles: !0,
			detail: { graph: this.value }
		}));
	}
	get representation() {
		return this.gateRepresentation;
	}
	set representation(e) {
		if (e !== "iso" && e !== "ansi") throw TypeError(`Unsupported gate representation: ${e}`);
		this.gateRepresentation = e, super.setGraph(this.value);
	}
	toggleRepresentation() {
		return this.representation = this.gateRepresentation === "iso" ? "ansi" : "iso", this.gateRepresentation;
	}
	get equationNotation() {
		return this.logicalEquationNotation;
	}
	set equationNotation(e) {
		if (e !== "electronic" && e !== "mathematical") throw TypeError(`Unsupported logical equation notation: ${e}`);
		this.logicalEquationNotation = e, super.setGraph(this.value);
	}
	toggleEquationNotation() {
		return this.equationNotation = this.logicalEquationNotation === "electronic" ? "mathematical" : "electronic", this.logicalEquationNotation;
	}
	renderResults() {
		let t = this.value.nodes.filter((e) => e.type === r), n = this.value.nodes.filter((e) => e.type === i), a = this.value.edges.flatMap((t) => e(t).filter((e) => e.label).map((e) => ({
			edgeId: t.id,
			measurement: e
		})));
		if (t.length === 0 || n.length === 0) return "";
		if (t.length > 8) return "<h3 class=\"tp-graph-results-header\">Truth table</h3><div class=\"tp-graph-results-content\">Truth tables are limited to 8 inputs.</div>";
		try {
			let e = [], r = 2 ** t.length, i = t.length + a.length, o = (e) => e === t.length || e === i;
			for (let i = 0; i < r; i += 1) {
				let r = this.value, s = t.map((e, n) => (i & 1 << t.length - n - 1) != 0);
				for (let [e, n] of t.entries()) {
					let t = r.nodes.find((e) => e.id === n.id);
					t && (t.state = {
						...t.state ?? {},
						value: s[e]
					});
				}
				let c = A(r), l = [
					...s,
					...a.map(({ edgeId: e }) => c.edges.find((t) => t.id === e)?.state?.value === !0),
					...n.map((e) => c.nodes.find((t) => t.id === e.id)?.state?.value === !0)
				];
				e.push(`<tr>${l.map((e, t) => `<td${o(t) ? " class=\"tp-logic-truth-boundary\"" : ""}>${e ? "1" : "0"}</td>`).join("")}</tr>`);
			}
			let s = [
				...t.map((e) => e.label ?? e.id),
				...a.map(({ measurement: e }) => e.label ?? e.id),
				...n.map((e) => e.label ?? e.id)
			].map((e, t) => `<th scope="col"${o(t) ? " class=\"tp-logic-truth-boundary\"" : ""}>${C(e)}</th>`).join(""), c = O(this.value, this.logicalEquationNotation).map((e) => `<tp-markdown class="tp-logic-equation">
        <script type="tp/markdown">---
extensions:
  - math
---
:latexmath:\`${e.latex}\`<\/script>
      </tp-markdown>`).join("");
			return `<div class="tp-logic-results-layout">
        <section><h3 class="tp-graph-results-header">Truth table</h3><div class="tp-graph-results-content"><table><thead><tr>${s}</tr></thead><tbody>${e.join("")}</tbody></table></div></section>
        <section><h3 class="tp-graph-results-header tp-logic-equations-header"><span>Logical equations</span><tp-icon-button size="xs" name="function" label="Use ${this.logicalEquationNotation === "electronic" ? "mathematical" : "electronic"} notation" data-logic-action="equation-notation"></tp-icon-button></h3><div class="tp-graph-results-content tp-logic-equations">${c}</div></section>
      </div>`;
		} catch (e) {
			return `<h3 class="tp-graph-results-header">Truth table</h3><div class="tp-graph-results-content">${C(e instanceof Error ? e.message : "The truth table is unavailable.")}</div>`;
		}
	}
	renderToolbarActions() {
		return `<tp-icon-button name="shapes" label="Use ${this.gateRepresentation === "iso" ? "ANSI" : "ISO"} gate symbols" data-logic-action="representation"></tp-icon-button>
      <tp-icon-button name="play" label="Evaluate circuit" data-logic-action="evaluate"></tp-icon-button>`;
	}
	bindExtensionEvents() {
		this.querySelector("[data-logic-action=\"evaluate\"]")?.addEventListener("click", () => this.evaluate()), this.querySelector("[data-logic-action=\"representation\"]")?.addEventListener("click", () => this.toggleRepresentation()), this.querySelector("[data-logic-action=\"equation-notation\"]")?.addEventListener("click", () => this.toggleEquationNotation());
		for (let e of this.querySelectorAll("[data-node-id]")) {
			let t = e.dataset.nodeId, n = this.value.nodes.find((e) => e.id === t);
			!t || n?.type !== "logic-input" && n?.type !== "logic-output" || (e.classList.add("is-toggleable"), e.addEventListener("click", (e) => {
				e.stopPropagation(), this.toggle(t);
			}), e.addEventListener("keydown", (e) => {
				e.key !== "Enter" && e.key !== " " || (e.preventDefault(), e.stopPropagation(), this.toggle(t));
			}));
		}
	}
	assertInputCapacity(e, t) {
		let n = this.value, r = n.nodes.find((t) => t.id === e);
		if (!r || r.type === "logic-input" || r.type === "comment") return;
		let i = n.edges.filter((n) => n.id !== t && n.target === e).length, a = r.type === "logic-not" || r.type === "logic-output" ? 1 : v.includes(r.type) ? 3 : r.type === "logic-hub" ? 4 : 2;
		if (i >= a) {
			let e = r.type === "logic-not" ? "NOT gates accept only one input wire." : r.type === "logic-output" ? "Outputs accept only one input wire." : `This gate accepts only ${a} input wires.`;
			throw TypeError(e);
		}
	}
	resolveInputPort(e, t, n) {
		let r = this.value, i = r.nodes.find((t) => t.id === e);
		if (!i || !y.includes(i.type)) return t;
		let a = new Set(r.edges.filter((t) => t.id !== n && t.target === e).map((e) => e.targetPort).filter((e) => e !== void 0)), o = S(i.type);
		return t && o.includes(t) && !a.has(t) ? t : o.find((e) => !a.has(e)) ?? t;
	}
};
customElements.get("tp-graph-logical-circuit") || customElements.define("tp-graph-logical-circuit", P);
//#endregion
export { A as _, l as a, g as c, p as d, i as f, P as g, m as h, r as i, s as l, c as m, f as n, h as o, _ as p, d as r, u as s, a as t, o as u, O as v, k as y };

//# sourceMappingURL=graph-logical-circuit.js.map