import "../../chunks/icon-button.js";
import "../textfield/textfield.js";
import "../../chunks/button.js";
import "../../chunks/dropdown.js";
import "../../chunks/stack.js";
import "../../chunks/cluster.js";
import "../../chunks/code-editor.js";
import { chooseSaveTarget as e, saveBlob as t } from "../../utilities/save-file.js";
import { choosePlaygroundFile as n } from "../playground/playground-local-file.js";
import "../../chunks/callout.js";
import "../../chunks/radio-list.js";
import { i as r, n as i } from "../../chunks/xy-graph.js";
//#region src/components/xy-plot/xy-plot-settings.ts
var a = 0, o = [
	"xyFunctionGraph",
	"xyPolarGraph",
	"xyParametricGraph"
], s = [
	"both",
	"horizontal",
	"vertical",
	"none"
], c = [
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
], l = [
	"[[\"Line\", \"x\"]]",
	"[[\"Circle\", \"2\"]]",
	"[[\"Circle\", \"2*cos(t)\", \"2*sin(t)\"]]"
];
function u(e) {
	let t = /* @__PURE__ */ new Map(), n = "";
	for (let r of i(e).trim().split("\n")) {
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
var d = class {
	initialSource;
	apply;
	getLabel;
	element = document.createElement("tp-stack");
	container = document.createElement("div");
	controls = /* @__PURE__ */ new Map();
	generated = document.createElement("tp-code-editor");
	status = document.createElement("tp-callout");
	currentSource = "";
	sharedSyntax = !1;
	curveSyntax = !1;
	assignmentSyntax = !1;
	saveTarget = null;
	fileBusy = !1;
	fileRequest = new AbortController();
	updating = !1;
	timer;
	sampleLimit;
	constructor(e, t, n = () => "") {
		this.initialSource = e, this.apply = t, this.getLabel = n, this.container.setAttribute("data-xy-plot-output", ""), this.container.className = "tp-xy-plot-editors", this.container.append(this.element), this.sampleLimit = Math.max(4096, r(e).samples), this.element.className = "tp-xy-plot-settings", this.element.setAttribute("data-xy-plot-output", ""), this.element.setAttribute("role", "region"), this.element.setAttribute("aria-label", "Graph settings"), this.radio("kind", "Graph kind", o), this.radio("grid", "Grid", s);
		let i = document.createElement("tp-cluster");
		this.element.append(i);
		for (let [e, t, n] of c) {
			let r = document.createElement("tp-textfield");
			r.setAttribute("label", `${e} — ${t}`), r.setAttribute("placeholder", n), r.setAttribute("label-position", "top"), r.setAttribute("clearable", ""), r.dataset.directive = e, this.controls.set(e, r), i.append(r);
		}
		let u = document.createElement("p");
		u.textContent = `Clear optional fields to use their defaults. Bounds accept expressions such as PI/2. Use x for Cartesian curves and t for polar or parametric curves. Styles: solid, dashed, dotted, dash-dot. Vector dx and dy are displacements from (x, y). Samples: 2–${this.sampleLimit}. Changing graph kind starts a compatible curve; Reset restores the original definition.`, this.element.append(u);
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
		let d = document.createElement("tp-button");
		d.textContent = "Reset", d.setAttribute("type", "button"), d.className = "tp-xy-plot-settings-reset", d.addEventListener("click", () => {
			clearTimeout(this.timer), this.setFields(this.initialSource), this.apply(this.initialSource), this.report("Original graph restored.");
		}), this.status.setAttribute("role", "status");
		let f = document.createElement("details");
		f.className = "tp-xy-plot-definition";
		let p = `tp-xy-source-${++a}`;
		f.innerHTML = `<summary>Graph definition</summary><div class="tp-xy-source-toolbar"><div><tp-icon-button id="${p}" name="file-outline" library="tp" label="Graph files (.txt)" title="Graph files (.txt)" aria-haspopup="menu" data-source-action="files"></tp-icon-button><tp-dropdown anchor="#${p}" outside-click><ul><li data-source-file="load">Load (.txt)</li><li data-source-file="save">Save (.txt)</li><li data-source-file="save-as">Save as (.txt)</li></ul></tp-dropdown></div><div class="tp-xy-source-actions"><tp-icon-button name="keyboard-f1" library="tp" label="F1 — Toggle editor toolbar" title="Toggle editor toolbar (F1)" data-source-action="toolbar"></tp-icon-button><tp-icon-button name="refresh" library="tp" label="Reset definition" title="Reset definition to the displayed graph" data-source-action="reset"></tp-icon-button><tp-icon-button name="play" library="tp" label="Play" title="Play — Apply graph definition" data-source-action="play"></tp-icon-button></div></div>`, this.generated.setAttribute("language", "text"), this.generated.setAttribute("line-numbers", ""), this.generated.setAttribute("aria-label", "Graph definition"), this.generated.className = "tp-xy-plot-settings-source", f.append(this.generated), this.element.append(d), f.append(this.status), this.container.append(f), f.querySelector("[data-source-action=\"files\"]")?.addEventListener("click", () => f.querySelector("tp-dropdown")?.toggle()), f.querySelector("[data-source-action=\"toolbar\"]")?.addEventListener("click", () => {
			this.generated.toolbar = !this.generated.toolbar;
		}), f.querySelector("[data-source-action=\"reset\"]")?.addEventListener("click", () => {
			this.generated.setValue(this.currentSource);
		}), f.querySelector("[data-source-action=\"play\"]")?.addEventListener("click", () => {
			try {
				this.applyDefinition(this.generated.getValue());
			} catch (e) {
				this.report(`${String(e)} The previous graph is retained.`, !0);
			}
		});
		for (let e of f.querySelectorAll("[data-source-file]")) {
			let t = () => {
				this.fileAction(e.dataset.sourceFile);
			};
			e.addEventListener("click", t), e.addEventListener("keydown", (e) => {
				(e.key === "Enter" || e.key === " ") && (e.preventDefault(), t());
			});
		}
		f.addEventListener("keydown", (e) => {
			e.key === "F1" && !e.defaultPrevented && !(e.target instanceof Element && e.target.closest("tp-code-editor")) && (e.preventDefault(), this.generated.toolbar = !this.generated.toolbar);
		}), this.report("Edit a setting to update the graph."), this.element.addEventListener("tp-radio-list-change", (e) => {
			this.updating || (e.target === this.field("kind") && (this.updating = !0, this.field("functions").setValue((this.curveSyntax ? [
				"curve f = function(x, x)",
				"curve r = polar(t, 2)",
				"curve c = parametric(t, 2*cos(t), 2*sin(t))"
			] : l)[Number(this.field("kind").value) - 1] ?? l[0] ?? ""), this.updating = !1), this.update());
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
		clearTimeout(this.timer), this.setFields(e);
	}
	setFields(e) {
		this.updating = !0;
		let t = r(e), n = /^\s*(?:point|vector)\s|^\s*(?:label|title)\s*=/m.test(e);
		this.sharedSyntax = n, this.curveSyntax = /^\s*curve\s/m.test(e), this.assignmentSyntax = n || this.curveSyntax || i(e) !== e;
		let a = e.split("\n").filter((e) => /^\s*(?:point|vector|curve)\s|^\s*(?:label|title)\s*=/.test(e)), c = u(e.split("\n").filter((e) => !a.includes(e)).join("\n"));
		if (n) {
			c.set("title", t.title ?? "");
			for (let [e, t] of [["points", "point"], ["vectors", "vector"]]) {
				let n = c.get(e ?? "");
				c.set(e ?? "", [n ? `${e} ${n}` : "", ...a.filter((e) => RegExp(`^\\s*${t}\\s`).test(e))].filter(Boolean).join("\n"));
			}
		}
		if (this.curveSyntax) {
			let e = c.get("functions");
			c.set("functions", [e ? `functions = ${e}` : "", ...a.filter((e) => /^\s*curve\s/.test(e))].filter(Boolean).join("\n"));
		}
		let l = this.field("functions"), d = this.curveSyntax ? "Curves: curve f = function(x, expression)" : "Curves (optional line style before the interval)";
		l.setAttribute("aria-label", d), l.previousElementSibling && (l.previousElementSibling.textContent = `functions — ${d}`);
		for (let e of ["points", "vectors"]) {
			let t = this.field(e), r = n ? e === "points" ? "Points: point A = (x, y)" : "Vectors: vector u = vector(A, B)" : e === "points" ? "Points: [label, x, y, dx, dy]" : "Vectors: [label, x, y, dx, dy, optional style]";
			t.setAttribute("aria-label", r), t.previousElementSibling && (t.previousElementSibling.textContent = `${e} — ${r}`);
		}
		this.field("kind").setAttribute("value", String(o.indexOf(t.kind) + 1)), this.field("grid").setAttribute("value", String(s.indexOf(t.grid ?? "both") + 1));
		for (let [e, t] of this.controls) if (e !== "kind" && e !== "grid") {
			let n = c.get(e) ?? "";
			t.tagName === "TP-CODE-EDITOR" ? t.setValue(n) : t.value = n;
		}
		t.kind === "xyPolarGraph" && (this.field("theta-axis").value = c.get("theta-axis") ?? c.get("t-axis") ?? ""), this.currentSource = e, this.generated.setValue(e), this.syncKind(), this.updating = !1;
	}
	syncKind() {
		let e = o[Number(this.field("kind").value) - 1] ?? "xyFunctionGraph";
		return this.field("t-axis").hidden = e !== "xyParametricGraph", this.field("theta-axis").hidden = e !== "xyPolarGraph", e;
	}
	update() {
		clearTimeout(this.timer);
		try {
			let e = this.syncKind(), t = [e], n = this.assignmentSyntax ? " = " : " ";
			for (let [r, i] of this.controls) {
				if (r === "kind" || r === "grid" || r === "t-axis" && e !== "xyParametricGraph" || r === "theta-axis" && e !== "xyPolarGraph") continue;
				let a = (i.tagName === "TP-CODE-EDITOR" ? i.getValue() : i.value).trim();
				if (a) if ([
					"title",
					"legend-x",
					"legend-y"
				].includes(r)) {
					if (!(this.sharedSyntax && r === "title") && /["\r\n]/.test(a)) throw Error(`${r}: remove double quotes and line breaks.`);
					t.push(this.sharedSyntax && r === "title" ? `  label = ${JSON.stringify(a)}` : `  ${r}${n}"${a}"`);
				} else this.sharedSyntax && ["points", "vectors"].includes(r) || this.curveSyntax && r === "functions" ? t.push(a) : t.push(`  ${r}${n}${a}`);
			}
			t.push(`  grid${n}${s[Number(this.field("grid").value) - 1] ?? "both"}`);
			let r = t.join("\n");
			this.validate(r), this.apply(r), this.currentSource = r, this.generated.setValue(r), this.report("Graph updated.");
		} catch (e) {
			this.report(`${e instanceof Error ? e.message : String(e)} The previous graph is retained.`, !0);
		}
	}
	validate(e) {
		let t = r(e);
		if (!Number.isInteger(t.samples) || t.samples < 2 || t.samples > this.sampleLimit) throw Error(`samples must be an integer from 2 to ${this.sampleLimit}.`);
		for (let e of [t.xAxis, t.yAxis]) if (!e.every(Number.isFinite) || e[0] >= e[1]) throw Error("Axis bounds must be finite and strictly increasing.");
	}
	applyDefinition(e) {
		clearTimeout(this.timer), this.validate(e), this.apply(e), this.setFields(e), this.report("Graph updated.");
	}
	async fileAction(r) {
		if (!(this.fileBusy || this.fileRequest.signal.aborted)) {
			this.fileBusy = !0;
			for (let e of this.generated.closest("details")?.querySelectorAll("[data-source-file]") ?? []) e.setAttribute("aria-disabled", "true");
			try {
				if (r === "load") {
					let e = await n(this.element, ".txt,text/plain", this.fileRequest.signal);
					if (!e) return;
					let t = await e.text();
					if (this.fileRequest.signal.aborted) return;
					this.applyDefinition(t), this.saveTarget = null;
				} else {
					let n = this.generated.getValue(), i = this.getLabel().normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "") || "construction", a = r === "save" && this.saveTarget || await e({
						suggestedName: `${i}.txt`,
						description: "Graph definition",
						mimeType: "text/plain",
						extension: ".txt"
					});
					if (!a || this.fileRequest.signal.aborted) return;
					await t(new Blob([n], { type: "text/plain;charset=utf-8" }), a), this.saveTarget = a, this.report(`Saved ${a.filename}.`);
				}
			} catch (e) {
				this.report(`Unable to ${r === "load" ? "load" : "save"} definition: ${String(e)}`, !0);
			} finally {
				this.fileBusy = !1;
				for (let e of this.generated.closest("details")?.querySelectorAll("[data-source-file]") ?? []) e.setAttribute("aria-disabled", "false");
			}
		}
	}
	report(e, t = !1) {
		this.status.textContent = e, this.status.setAttribute("variant", t ? "danger" : "info");
	}
	destroy() {
		this.fileRequest.abort(), clearTimeout(this.timer), this.container.remove();
	}
};
//#endregion
export { d as XYPlotSettings };

//# sourceMappingURL=xy-plot-settings.js.map