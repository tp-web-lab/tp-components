import "../../chunks/lib/typescript/typescript.js";
import "../textfield/textfield.js";
import "../../chunks/stack.js";
import "../../chunks/cluster.js";
import "../../chunks/radio-list.js";
import { n as e } from "../../chunks/xy-graph.js";
//#region src/components/xy-plot/xy-plot-settings.ts
var t = [
	"xyFunctionGraph",
	"xyPolarGraph",
	"xyParametricGraph"
], n = [
	"both",
	"horizontal",
	"vertical",
	"none"
], r = [
	[
		"title",
		"Chart title",
		""
	],
	[
		"legend-x",
		"Horizontal axis label",
		""
	],
	[
		"legend-y",
		"Vertical axis label",
		""
	],
	[
		"x-axis",
		"Horizontal range",
		"[-10, 10]"
	],
	[
		"y-axis",
		"Vertical range",
		"[-10, 10]"
	],
	[
		"x-ticks",
		"Horizontal ticks",
		"Automatic: nine ticks"
	],
	[
		"y-ticks",
		"Vertical ticks",
		"Automatic: nine ticks"
	],
	[
		"x-axis-at",
		"Horizontal axis at y",
		"Default layout"
	],
	[
		"y-axis-at",
		"Vertical axis at x",
		"Default layout"
	],
	[
		"samples",
		"Samples per curve",
		"512"
	],
	[
		"anim",
		"Ordered names to reveal",
		"[]"
	],
	[
		"t-axis",
		"Parameter range",
		"[0, 2*PI]"
	],
	[
		"theta-axis",
		"Angle range (radians)",
		"[0, 2*PI]"
	]
], i = [
	"[[\"Line\", \"x\"]]",
	"[[\"Circle\", \"2\"]]",
	"[[\"Circle\", \"2*cos(t)\", \"2*sin(t)\"]]"
];
function a(e) {
	let t = /* @__PURE__ */ new Map(), n = "";
	for (let r of e.trim().split("\n")) {
		let e = /^\s*([a-z][a-z-]*)\s+(.+)$/.exec(r);
		e?.[1] && e[2] ? (n = e[1], t.set(n, e[2].trim())) : n && t.set(n, `${t.get(n)}\n${r.trim()}`.trim());
	}
	for (let e of [
		"title",
		"legend-x",
		"legend-y"
	]) {
		let n = t.get(e);
		n && t.set(e, n.slice(1, -1));
	}
	return t;
}
var o = class {
	initialSource;
	apply;
	element = document.createElement("tp-stack");
	controls = /* @__PURE__ */ new Map();
	generated = document.createElement("tp-code-editor");
	status = document.createElement("tp-callout");
	updating = !1;
	timer;
	sampleLimit;
	constructor(a, o) {
		this.initialSource = a, this.apply = o, this.sampleLimit = Math.max(4096, e(a).samples), this.element.className = "tp-xy-plot-settings", this.element.setAttribute("data-xy-plot-output", ""), this.element.setAttribute("role", "region"), this.element.setAttribute("aria-label", "Graph settings"), this.radio("kind", "Graph kind", t), this.radio("grid", "Grid", n);
		let s = document.createElement("tp-cluster");
		this.element.append(s);
		for (let [e, t, n] of r) {
			let r = document.createElement("tp-textfield");
			r.setAttribute("label", `${e} — ${t}`), r.setAttribute("placeholder", n), r.setAttribute("label-position", "top"), r.setAttribute("clearable", ""), r.dataset.directive = e, this.controls.set(e, r), s.append(r);
		}
		let c = document.createElement("p");
		c.textContent = `Clear optional fields to use their defaults. Bounds accept expressions such as PI/2. Use x for Cartesian curves and t for polar or parametric curves. Styles: solid, dashed, dotted, dash-dot. Vector dx and dy are displacements from (x, y). Samples: 2–${this.sampleLimit}. Changing graph kind starts a compatible curve; Reset restores the original definition.`, this.element.append(c);
		for (let [e, t] of [
			["functions", "Curves (optional line style before the interval)"],
			["points", "Points: [label, x, y, dx, dy]"],
			["vectors", "Vectors: [label, x, y, dx, dy, optional style]"]
		]) {
			if (!e || !t) continue;
			let n = document.createElement("h3");
			n.textContent = `${e} — ${t}`;
			let r = document.createElement("tp-code-editor");
			r.setAttribute("language", "text"), r.setAttribute("aria-label", t), r.dataset.directive = e, this.controls.set(e, r), this.element.append(n, r);
		}
		let l = document.createElement("tp-button");
		l.textContent = "Reset", l.setAttribute("type", "button"), l.className = "tp-xy-plot-settings-reset", l.addEventListener("click", () => {
			clearTimeout(this.timer), this.setFields(this.initialSource), this.apply(this.initialSource), this.report("Original graph restored.");
		}), this.status.setAttribute("role", "status");
		let u = document.createElement("h3");
		u.textContent = "Graph definition", this.generated.setAttribute("language", "text"), this.generated.setAttribute("readonly", ""), this.generated.className = "tp-xy-plot-settings-source", this.element.append(l, this.status, u, this.generated), this.report("Edit a setting to update the graph."), this.element.addEventListener("tp-radio-list-change", (e) => {
			this.updating || (e.target === this.field("kind") && (this.updating = !0, this.field("functions").value = i[Number(this.field("kind").value) - 1] ?? i[0] ?? "", this.updating = !1), this.update());
		});
		for (let e of ["input", "tp-code-editor-input"]) this.element.addEventListener(e, (e) => {
			this.updating || !(e.target instanceof Element) || !e.target.closest("[data-directive]") || (clearTimeout(this.timer), this.timer = setTimeout(() => this.update(), 200));
		});
	}
	field(e) {
		let t = this.controls.get(e);
		if (!t) throw Error(`Unknown graph setting: ${e}`);
		return t;
	}
	radio(e, t, n) {
		let r = document.createElement("tp-radio-list");
		r.setAttribute("label", t), r.setAttribute("label-position", "top"), r.setAttribute("orientation", "horizontal"), r.dataset.directive = e;
		let i = document.createElement("ul");
		for (let e of n) {
			let t = document.createElement("li");
			t.textContent = e, i.append(t);
		}
		r.append(i), this.controls.set(e, r), this.element.append(r);
	}
	initialize(e) {
		this.setFields(e);
	}
	setFields(r) {
		this.updating = !0;
		let i = e(r), o = a(r);
		this.field("kind").setAttribute("value", String(t.indexOf(i.kind) + 1)), this.field("grid").setAttribute("value", String(n.indexOf(i.grid ?? "both") + 1));
		for (let [e, t] of this.controls) e !== "kind" && e !== "grid" && (t.value = o.get(e) ?? "");
		i.kind === "xyPolarGraph" && (this.field("theta-axis").value = o.get("theta-axis") ?? o.get("t-axis") ?? ""), this.generated.value = r, this.syncKind(), this.updating = !1;
	}
	syncKind() {
		let e = t[Number(this.field("kind").value) - 1] ?? "xyFunctionGraph";
		return this.field("t-axis").hidden = e !== "xyParametricGraph", this.field("theta-axis").hidden = e !== "xyPolarGraph", e;
	}
	update() {
		clearTimeout(this.timer);
		try {
			let t = this.syncKind(), r = [t];
			for (let [e, n] of this.controls) {
				if (e === "kind" || e === "grid" || e === "t-axis" && t !== "xyParametricGraph" || e === "theta-axis" && t !== "xyPolarGraph") continue;
				let i = n.value.trim();
				if (i) if ([
					"title",
					"legend-x",
					"legend-y"
				].includes(e)) {
					if (/["\r\n]/.test(i)) throw Error(`${e}: remove double quotes and line breaks.`);
					r.push(`  ${e} "${i}"`);
				} else r.push(`  ${e} ${i}`);
			}
			r.push(`  grid ${n[Number(this.field("grid").value) - 1] ?? "both"}`);
			let i = r.join("\n"), a = e(i);
			if (!Number.isInteger(a.samples) || a.samples < 2 || a.samples > this.sampleLimit) throw Error(`samples must be an integer from 2 to ${this.sampleLimit}.`);
			for (let e of [a.xAxis, a.yAxis]) if (!e.every(Number.isFinite) || e[0] >= e[1]) throw Error("Axis bounds must be finite and strictly increasing.");
			this.apply(i), this.generated.value = i, this.report("Graph updated.");
		} catch (e) {
			this.report(`${e instanceof Error ? e.message : String(e)} The previous graph is retained.`, !0);
		}
	}
	report(e, t = !1) {
		this.status.textContent = e, this.status.setAttribute("variant", t ? "danger" : "info");
	}
	destroy() {
		clearTimeout(this.timer), this.element.remove();
	}
};
//#endregion
export { o as XYPlotSettings };

