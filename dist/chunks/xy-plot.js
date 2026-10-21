import { t as e } from "./base.js";
import "./icon-button.js";
import "./theme.js";
import { TpDeclarativeTextSource as t } from "../utilities/declarative-text-source.js";
import "./save-image.js";
import { a as n, i as r, r as i, t as a } from "./xy-graph.js";
//#region ../tp-utilities/dist/xy-graph/xy-graph-sampler.js
function o(e, t, n, r) {
	return r <= 1 ? e : e + (t - e) * n / (r - 1);
}
function s(e, t) {
	if (!e) return t;
	if (e.length !== 2 || !e.every(Number.isFinite) || e[0] >= e[1]) throw Error("Intervalle de fonction invalide");
	return e;
}
function c(e) {
	return e.functions.map(({ label: t, expression: r, range: i, lineStyle: a }) => {
		let c = [], l = s(i, e.xAxis), u = i ? Math.max(l[0], Math.min(...e.xAxis)) : l[0], d = i ? Math.min(l[1], Math.max(...e.xAxis)) : l[1];
		if (i && u > d) return {
			label: t,
			expression: r,
			points: c,
			...a ? { lineStyle: a } : {}
		};
		for (let t = 0; t < e.samples; t += 1) {
			let i = o(u, d, t, e.samples);
			try {
				let e = n(r, { x: i });
				Number.isFinite(e) && c.push({
					x: i,
					y: e
				});
			} catch {}
		}
		return {
			label: t,
			expression: r,
			points: c,
			...a ? { lineStyle: a } : {}
		};
	});
}
function l(e) {
	return e.functions.map(({ label: t, xExpression: r, yExpression: i, range: a, lineStyle: c }) => {
		let l = [], u = `{ x = ${r}; y = ${i} }`, d = s(a, e.tAxis);
		for (let t = 0; t < e.samples; t += 1) {
			let a = o(d[0], d[1], t, e.samples);
			try {
				let e = n(r, { t: a }), t = n(i, { t: a });
				Number.isFinite(e) && Number.isFinite(t) && l.push({
					x: e,
					y: t
				});
			} catch {}
		}
		return {
			label: t,
			expression: u,
			points: l,
			...c ? { lineStyle: c } : {}
		};
	});
}
function u(e) {
	return e.functions.map(({ label: t, expression: r, range: i, lineStyle: a }) => {
		let c = [], l = s(i, e.thetaAxis);
		for (let t = 0; t < e.samples; t += 1) {
			let i = o(l[0], l[1], t, e.samples);
			try {
				let e = n(r, { t: i }), t = e * Math.cos(i), a = e * Math.sin(i);
				Number.isFinite(t) && Number.isFinite(a) && c.push({
					x: t,
					y: a
				});
			} catch {}
		}
		return {
			label: t,
			expression: r,
			points: c,
			...a ? { lineStyle: a } : {}
		};
	});
}
function d(e) {
	return e.kind === "xyFunctionGraph" ? c(e) : e.kind === "xyParametricGraph" ? l(e) : e.kind === "xyPolarGraph" ? u(e) : [];
}
//#endregion
//#region src/components/xy-plot/xy-plot.css?inline
var f = ".tp-xy-plot{box-sizing:border-box;inline-size:auto;min-inline-size:0;max-inline-size:min(100%,900px);margin-block:0;margin-inline:auto;display:flow-root;position:relative}.tp-xy-plot-preview{inline-size:100%}.tp-xy-plot-preview>svg{block-size:auto;inline-size:100%;display:block}.tp-xy-plot .tp-md-xy-graph-point{fill:#333;stroke:#fff;stroke-width:1.5px}.tp-xy-plot .tp-md-xy-graph-point-label{fill:#333;font-family:system-ui,sans-serif;font-size:12px}.tp-xy-plot-toolbar{justify-content:flex-end;margin-block-end:.25rem;display:flex}.tp-xy-plot-dialog{border:1px solid color-mix(in srgb, CanvasText 18%, transparent);color:canvastext;background:canvas;border-radius:1rem;max-block-size:92vh;inline-size:min(96vw,1200px);max-inline-size:1200px;padding:1rem}.tp-xy-plot-dialog::backdrop{background:#0000008c}.tp-xy-plot-dialog-header{justify-content:flex-end;margin-block-end:.75rem;display:flex}.tp-xy-plot-dialog-content{overflow:auto}.tp-xy-plot-dialog-content>svg{block-size:auto;inline-size:100%}.tp-xy-plot-error{background:color-mix(in srgb, red 8%, Canvas 92%);color:canvastext;border:1px solid #ff000073;border-radius:.75rem;margin:0;padding:1rem;overflow-x:auto}.tp-xy-plot-settings{border-block-start:1px solid color-mix(in srgb, CanvasText 20%, transparent);margin-block-start:.75rem;padding-block:.75rem}.tp-xy-plot-settings[hidden]{display:none}.tp-xy-plot-animation{justify-content:center;align-items:center;gap:.5rem;margin-block:.5rem;display:flex}.tp-xy-plot-animation [role=status]{font-variant-numeric:tabular-nums}.tp-xy-plot-preview,.tp-xy-plot-dialog-content{cursor:grab;touch-action:none;-webkit-user-select:none;user-select:none}.tp-xy-plot-panning{cursor:grabbing}.tp-xy-plot-preview:focus-visible,.tp-xy-plot-dialog-content:focus-visible{outline-offset:2px;outline:2px solid}.tp-xy-plot-toolbar,.tp-xy-plot-dialog-header{align-items:center;gap:.25rem}.tp-xy-plot [data-xy-label]{overflow-wrap:anywhere;min-width:0;margin-inline-end:auto}.tp-xy-plot [data-xy-label][hidden]{display:none}.tp-xy-source-toolbar{justify-content:space-between;align-items:center;gap:.5rem;margin-block:.5rem;display:flex}.tp-xy-source-actions{align-items:center;gap:.25rem;display:flex}.tp-xy-plot-definition{min-width:0}.tp-xy-plot-definition summary{cursor:pointer}.tp-xy-plot-dialog-footer{justify-content:flex-start;margin-block-start:.5rem;display:flex}.tp-xy-plot-dialog-source{min-width:0;display:none}.tp-xy-plot-dialog[data-source-open]>.tp-xy-plot-dialog-content{display:none}.tp-xy-plot-dialog[data-source-open]>.tp-xy-plot-dialog-source{display:block}.tp-xy-plot-preview>svg,.tp-xy-plot-dialog-content>svg{color:var(--tp-text-body,CanvasText)}.tp-xy-plot-preview>svg>rect:first-child,.tp-xy-plot-dialog-content>svg>rect:first-child{fill:var(--tp-background-color,Canvas)}.tp-xy-plot-preview svg text:not([fill]),.tp-xy-plot-dialog-content svg text:not([fill]){fill:var(--tp-text-body,CanvasText)}.tp-xy-plot [data-xy-grid]{stroke:var(--tp-neutral-stroke-soft,#ddd)}.tp-xy-plot line[data-xy-axis]{stroke:var(--tp-text-body,CanvasText)}.tp-xy-plot .tp-md-xy-graph-point{fill:var(--tp-text-body,CanvasText);stroke:var(--tp-background-color,Canvas)}.tp-xy-plot .tp-md-xy-graph-point-label{fill:var(--tp-text-body,CanvasText)}.tp-xy-plot-footer,.tp-xy-plot-dialog-footer{align-items:center;gap:.25rem;display:flex}.tp-xy-plot [data-xy-source-toggle]{margin-inline-end:auto}.tp-xy-plot-source{min-width:0;display:none}.tp-xy-plot[data-source-open]>.tp-xy-plot-board>.tp-xy-plot-preview{display:none}.tp-xy-plot[data-source-open]>.tp-xy-plot-board>.tp-xy-plot-source{display:block}.tp-xy-plot-board{box-sizing:border-box;block-size:var(--tp-plot-height,auto);border:1px solid var(--tp-neutral-stroke-soft,#cdd9dc);background:var(--tp-paper-color,Canvas);min-inline-size:0;color:var(--tp-text-body,CanvasText);border-radius:12px;flex-direction:column;display:flex;overflow:hidden}.tp-xy-plot-board>.tp-xy-plot-toolbar,.tp-xy-plot-board>.tp-xy-plot-footer{flex:none}.tp-xy-plot-board>.tp-xy-plot-preview{flex:auto;min-block-size:0}.tp-xy-plot-board>.tp-xy-plot-preview>svg{block-size:100%}.tp-xy-plot-board>.tp-xy-plot-source{flex:auto;min-block-size:0;overflow:auto}.tp-xy-plot-board>.tp-xy-plot-toolbar{gap:.5rem;min-height:2.5rem;margin-block-end:0;padding:.5rem}.tp-xy-plot-board>.tp-xy-plot-footer{flex-wrap:wrap;gap:5px;padding:8px}.tp-xy-plot-board>.tp-xy-plot-footer tp-icon-button{--tp-icon-button-icon-size:24px;--tp-icon-button-size:34px}", p = 0, m = "tp-xy-plot-styles", h = !1;
function g(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
var _ = class extends e {
	data = null;
	revision = 0;
	animation = [];
	zoomDiagram = null;
	zoomCurves = null;
	zoomLevel = 0;
	panX = 0;
	panY = 0;
	panFrame = 0;
	drag = null;
	animationOverride = null;
	sourceGrid = "both";
	objectNames = null;
	animationStep = 0;
	currentSource = null;
	initialSource = null;
	settingsEditor = null;
	undoSources = [];
	redoSources = [];
	sourceHome = null;
	sourceWasOpen = !1;
	settingsRevision = 0;
	settingsPanelId = `tp-xy-plot-settings-${++p}`;
	get settings() {
		return this.hasAttribute("settings");
	}
	set settings(e) {
		this.toggleAttribute("settings", e);
	}
	direction(e) {
		let t = this.getAttribute(e);
		return t === "horizontal" || t === "vertical" || t === "none" ? t : "both";
	}
	get grid() {
		return this.direction("grid");
	}
	set grid(e) {
		this.setAttribute("grid", e);
	}
	get axis() {
		return this.direction("axis");
	}
	set axis(e) {
		this.setAttribute("axis", e);
	}
	get noLegend() {
		return this.hasAttribute("no-legend");
	}
	set noLegend(e) {
		this.toggleAttribute("no-legend", e);
	}
	anim(e) {
		if (e === void 0) {
			let e = this.animationOverride ?? this.animation;
			return e.some(Array.isArray) ? JSON.stringify(e) : e.join(",");
		}
		let t = i(typeof e == "string" ? e.trim().startsWith("[") ? JSON.parse(e) : e.trim() ? e.split(",").map((e) => e.trim()) : [] : e);
		if (this.objectNames) {
			for (let e of t.flat()) if (!this.objectNames.has(e)) throw Error(`Unknown anim object: ${e}`);
		}
		this.animationOverride = t, this.animation = t, this.animationStep = 0, this.createAnimationControls(), this.syncAnimation();
	}
	goToStart() {
		this.animationStep = 0, this.syncAnimation();
	}
	goToEnd() {
		this.animationStep = this.animation.length, this.syncAnimation();
	}
	previous() {
		this.animationStep = Math.max(0, this.animationStep - 1), this.syncAnimation();
	}
	next() {
		this.animationStep = Math.min(this.animation.length, this.animationStep + 1), this.syncAnimation();
	}
	syncPresentation() {
		let e = this.hasAttribute("grid") ? this.grid : this.sourceGrid;
		for (let t of this.querySelectorAll("[data-xy-grid], [data-xy-axis], [data-xy-legend]")) {
			let n = t.hasAttribute("data-xy-grid") ? e : this.axis, r = t.getAttribute("data-xy-grid") ?? t.getAttribute("data-xy-axis"), i = t.hasAttribute("data-xy-legend") ? !this.noLegend : n === "both" || n === r;
			t.style.display = i ? "" : "none";
		}
		this.fitPlotViewBox();
	}
	static get observedAttributes() {
		return [
			"src",
			"settings",
			"grid",
			"axis",
			"no-legend",
			"label"
		];
	}
	get label() {
		return this.getAttribute("label") ?? "";
	}
	set label(e) {
		this.setAttribute("label", e);
	}
	syncLabel() {
		for (let e of this.querySelectorAll("[data-xy-label]")) {
			let t = this.label || this.zoomDiagram?.title || "";
			e.textContent = t, e.hidden = !t;
		}
	}
	source = new t(this, {
		scriptTypes: ["tp/xy-plot"],
		textContentFallback: !0,
		ignoreSelector: "[data-xy-plot-output]"
	});
	connectedCallback() {
		super.connectedCallback(), this.classList.add("tp-xy-plot"), this.setAttribute("data-xy-export", this.settingsPanelId), this.ensureGlobalStyle(m, f), v(), this.data || this.source.observe(() => {
			this.renderPlot();
		}), this.renderPlot();
	}
	disconnectedCallback() {
		this.stopPan(), this.revision++, this.source.disconnect(), this.disposeSettings();
	}
	attributeChangedCallback(e) {
		if (e === "label") {
			this.syncLabel();
			return;
		}
		if ([
			"grid",
			"axis",
			"no-legend"
		].includes(e)) {
			this.isConnected && this.syncPresentation();
			return;
		}
		if (e === "settings") {
			this.isConnected && this.syncSettings();
			return;
		}
		this.data = null, this.currentSource = null, this.initialSource = null, this.disposeSettings(), this.isConnected && this.renderPlot();
	}
	setData(e) {
		this.source.capture(), this.source.disconnect(), this.data = e, this.currentSource = null, this.initialSource = null, this.disposeSettings(), this.isConnected && this.renderPlot();
	}
	renderData(e) {
		this.objectNames = new Set([
			...e.series,
			...e.points ?? [],
			...e.vectors ?? []
		].map((e) => e.label));
		let t = [
			...e.series.flatMap((e) => e.points),
			...e.points ?? [],
			...(e.vectors ?? []).flatMap((e) => [{
				x: e.x,
				y: e.y
			}, {
				x: e.x + e.dx,
				y: e.y + e.dy
			}])
		];
		if (!t.length || t.some((e) => !Number.isFinite(e.x) || !Number.isFinite(e.y))) throw Error("Numeric plots require finite data points.");
		let n = t.reduce((e, t) => ({
			minX: Math.min(e.minX, t.x),
			maxX: Math.max(e.maxX, t.x),
			minY: Math.min(e.minY, t.y),
			maxY: Math.max(e.maxY, t.y)
		}), {
			minX: Infinity,
			maxX: -Infinity,
			minY: Infinity,
			maxY: -Infinity
		}), r = Math.max(1, (n.maxY - n.minY) * .05);
		return this.initializeViewport({
			kind: "xyParametricGraph",
			title: e.title,
			legendX: e.xLabel,
			legendY: e.yLabel,
			xAxis: [n.minX, n.maxX > n.minX ? n.maxX : n.minX + 1],
			yAxis: [n.minY - r, n.maxY + r],
			tAxis: [0, 1],
			samples: 2,
			functions: [],
			vectors: e.vectors,
			points: [...e.points ?? [], ...e.series.flatMap((e) => e.points.length === 1 ? e.points.map((e) => ({
				...e,
				label: ""
			})) : [])]
		}, e.series.map((e) => ({
			...e,
			expression: e.label,
			lineStyle: e.lineStyle ?? (e.dashed ? "dashed" : "solid")
		})));
	}
	initializeViewport(e, t = null) {
		let n = a({
			...e,
			title: "",
			grid: "both"
		}, t ?? d(e));
		return this.zoomDiagram = e, this.zoomCurves = t, this.stopPan(), this.zoomLevel = 0, this.panX = 0, this.panY = 0, n;
	}
	zoomRange(e, t, n = 0) {
		let r = e[0] / 2 + e[1] / 2 + n, i = (e[1] / 2 - e[0] / 2) / 1.25 ** t;
		return t === 0 && n === 0 ? e : [r - i, r + i];
	}
	changeZoom(e) {
		this.renderViewport(this.zoomLevel + e, this.panX, this.panY);
	}
	renderViewport(e, t, n) {
		let r = this.zoomDiagram;
		if (!r || e < -12 || e > 12) return;
		let i = this.zoomRange(r.xAxis, e, t), o = this.zoomRange(r.yAxis, e, n);
		if ([i, o].some(([e, t]) => !Number.isFinite(e) || !Number.isFinite(t) || e >= t)) return;
		let s = (e, t) => e !== void 0 && e >= t[0] && e <= t[1] ? e : void 0, c = {
			...r,
			xAxis: i,
			yAxis: o,
			xTicks: e === 0 && t === 0 ? r.xTicks : void 0,
			yTicks: e === 0 && n === 0 ? r.yTicks : void 0,
			xAxisAt: s(r.xAxisAt, o),
			yAxisAt: s(r.yAxisAt, i),
			grid: "both"
		}, l = a({
			...c,
			title: ""
		}, this.zoomCurves ?? d(c));
		this.zoomLevel = e, this.panX = t, this.panY = n, this.commitSvg(l, this.animation, !0);
	}
	stopPan() {
		this.panFrame && cancelAnimationFrame(this.panFrame), this.panFrame = 0;
		let e = this.drag;
		this.drag = null, e && (e.host.classList.remove("tp-xy-plot-panning"), e.host.hasPointerCapture?.(e.id) && e.host.releasePointerCapture(e.id));
	}
	bindPan(e) {
		e.tabIndex = 0, e.setAttribute("role", "group"), e.setAttribute("aria-label", "Graph viewport. Drag or use arrow keys to pan; Home resets the view."), e.addEventListener("keydown", (t) => {
			if (t.target !== e || !this.zoomDiagram) return;
			if (t.key === "Home") {
				t.preventDefault(), this.renderViewport(0, 0, 0);
				return;
			}
			let n = {
				ArrowLeft: [-1, 0],
				ArrowRight: [1, 0],
				ArrowUp: [0, 1],
				ArrowDown: [0, -1]
			}[t.key];
			if (!n) return;
			t.preventDefault();
			let r = this.zoomRange(this.zoomDiagram.xAxis, this.zoomLevel), i = this.zoomRange(this.zoomDiagram.yAxis, this.zoomLevel);
			this.renderViewport(this.zoomLevel, this.panX - (n[0] ?? 0) * (r[1] - r[0]) / 10, this.panY - (n[1] ?? 0) * (i[1] - i[0]) / 10);
		}), e.addEventListener("pointerdown", (t) => {
			if (t.button !== 0 || t.isPrimary === !1 || !this.zoomDiagram || this.drag) return;
			let n = e.querySelector("svg"), r = (n?.querySelector("rect[stroke=\"#999\"]"))?.getBoundingClientRect();
			if (!n || !r?.width || !r.height) return;
			let i = this.zoomRange(this.zoomDiagram.xAxis, this.zoomLevel), a = this.zoomRange(this.zoomDiagram.yAxis, this.zoomLevel);
			this.drag = {
				host: e,
				id: t.pointerId,
				x: t.clientX,
				y: t.clientY,
				offsetX: this.panX,
				offsetY: this.panY,
				unitX: (i[1] - i[0]) / r.width,
				unitY: (a[1] - a[0]) / r.height,
				nextX: this.panX,
				nextY: this.panY,
				viewBox: n.getAttribute("viewBox") ?? "0 0 900 900"
			}, e.setPointerCapture(t.pointerId), e.classList.add("tp-xy-plot-panning"), e.focus({ preventScroll: !0 }), t.preventDefault();
		}), e.addEventListener("pointermove", (e) => {
			let t = this.drag;
			!t || t.id !== e.pointerId || (t.nextX = t.offsetX - (e.clientX - t.x) * t.unitX, t.nextY = t.offsetY + (e.clientY - t.y) * t.unitY, this.panFrame ||= requestAnimationFrame(() => {
				this.panFrame = 0, this.drag === t && this.renderViewport(this.zoomLevel, t.nextX, t.nextY);
			}));
		});
		let t = (e) => {
			let t = this.drag;
			!t || e.pointerId !== t.id || (this.renderViewport(this.zoomLevel, t.nextX, t.nextY), this.stopPan());
		};
		e.addEventListener("pointerup", t), e.addEventListener("pointercancel", t), e.addEventListener("lostpointercapture", t);
	}
	fitPlotViewBox() {
		let e = this.querySelector(".tp-xy-plot-preview > svg");
		if (this.drag) {
			for (let e of this.querySelectorAll(".tp-xy-plot-preview > svg, .tp-xy-plot-dialog-content > svg")) e.setAttribute("viewBox", this.drag.viewBox);
			return;
		}
		if (!e || typeof e.getBBox != "function") return;
		let t = e.querySelector(":scope > rect");
		if (!t) return;
		let n = t.style.display;
		t.style.display = "none";
		let r;
		try {
			r = e.getBBox();
		} finally {
			t.style.display = n;
		}
		if (!(r.width > 0 && r.height > 0)) return;
		let i = r.x - 12, a = r.y - 12, o = r.width + 24, s = r.height + 24;
		for (let e of this.querySelectorAll(".tp-xy-plot-preview > svg, .tp-xy-plot-dialog-content > svg")) {
			e.setAttribute("viewBox", `${i} ${a} ${o} ${s}`);
			let t = e.querySelector(":scope > rect");
			t?.setAttribute("x", String(i)), t?.setAttribute("y", String(a)), t?.setAttribute("width", String(o)), t?.setAttribute("height", String(s));
		}
	}
	disposeSettings() {
		this.restoreZoomSource(), this.settingsRevision++, this.querySelector(".tp-xy-plot-definition")?.remove(), this.removeAttribute("data-source-open"), this.settingsEditor?.destroy(), this.settingsEditor = null, this.undoSources = [], this.redoSources = [];
	}
	syncSettings() {
		this.ensureDefinition(), this.settingsEditor && (this.settingsEditor.element.hidden = !this.settings);
	}
	applySource(e, t = !0) {
		let n = r(e), i = this.initializeViewport(n);
		t && this.currentSource && e !== this.currentSource && (this.undoSources.push(this.currentSource), this.redoSources = []), this.objectNames = new Set([
			...n.functions,
			...n.points ?? [],
			...n.vectors ?? []
		].map((e) => e.label)), this.sourceGrid = n.grid ?? "both", this.revision++, this.currentSource = e, this.commitSvg(i, n.anim);
	}
	navigateHistory(e) {
		let t = e ? this.redoSources : this.undoSources, n = e ? this.undoSources : this.redoSources, r = t.at(-1);
		if (r === void 0 || !this.currentSource) return;
		let i = this.currentSource;
		this.applySource(r, !1), t.pop(), n.push(i), this.settingsEditor?.initialize(r), this.syncHistory();
	}
	syncHistory() {
		for (let e of this.querySelectorAll("[data-xy-history]")) e.toggleAttribute("disabled", !(e.getAttribute("data-xy-history") === "redo" ? this.redoSources.length : this.undoSources.length));
	}
	async ensureDefinition() {
		if (!this.currentSource || this.data || this.settingsEditor) return;
		let e = this.settingsRevision;
		try {
			let { XYPlotSettings: t } = await import("../components/xy-plot/xy-plot-settings.js");
			if (e !== this.settingsRevision || !this.isConnected || this.settingsEditor || !this.currentSource) return;
			this.settingsEditor = new t(this.initialSource ?? this.currentSource, (e) => this.applySource(e), () => this.label), this.settingsEditor.element.id = this.settingsPanelId, this.append(this.settingsEditor.container), this.settingsEditor.initialize(this.currentSource);
			let n = this.settingsEditor.container.querySelector("details"), r = this.querySelector(":scope > .tp-xy-plot-board > .tp-xy-plot-source");
			n && r && (n.open = !0, this.moveDefinition(n, r)), this.syncSettings();
		} catch (t) {
			if (e !== this.settingsRevision) return;
			let n = document.createElement("p");
			n.setAttribute("role", "alert"), n.setAttribute("data-xy-plot-output", ""), n.textContent = t instanceof Error ? t.message : String(t), this.append(n);
		}
	}
	async toggleZoomSource() {
		let e = this.querySelector(".tp-xy-plot-dialog");
		if (!e?.open) return;
		if (this.sourceHome) {
			this.restoreZoomSource();
			return;
		}
		if (await this.ensureDefinition(), !e.open) return;
		let t = this.querySelector(".tp-xy-plot-definition"), n = e.querySelector(".tp-xy-plot-dialog-source");
		!t || !n || (this.sourceHome = t.parentElement, this.sourceWasOpen = t.open, t.open = !0, this.moveDefinition(t, n), e.setAttribute("data-source-open", ""), this.syncSourceToggle(!0));
	}
	moveDefinition(e, t) {
		let n = e.querySelector("tp-code-editor"), r = n?.getValue();
		t.append(e), n && r !== void 0 && n.setValue(r);
	}
	async toggleSource() {
		if (await this.ensureDefinition(), !this.settingsEditor) return;
		let e = this.toggleAttribute("data-source-open");
		this.syncSourceToggle(e, !1);
	}
	syncSourceToggle(e, t = !0) {
		let n = this.querySelector(t ? ".tp-xy-plot-dialog [data-xy-source-toggle]" : ":scope > .tp-xy-plot-board > .tp-xy-plot-footer [data-xy-source-toggle]");
		n?.setAttribute("aria-pressed", String(e)), n?.setAttribute("label", e ? "Show curves" : "Show graph definition"), n?.setAttribute("title", e ? "Show curves" : "Show graph definition");
	}
	restoreZoomSource() {
		let e = this.querySelector(".tp-xy-plot-dialog-source > details");
		e && this.sourceHome && (this.moveDefinition(e, this.sourceHome), e.open = this.sourceWasOpen), this.sourceHome = null, this.querySelector(".tp-xy-plot-dialog")?.removeAttribute("data-source-open"), this.syncSourceToggle(!1);
	}
	exportSvg() {
		let e = this.querySelector(".tp-xy-plot-preview > svg");
		if (!e) throw Error("The graph is not ready.");
		let t = e.cloneNode(!0), n = [e, ...e.querySelectorAll("*")], r = [t, ...t.querySelectorAll("*")];
		for (let [e, t] of n.entries()) {
			let n = r[e];
			if (!n) continue;
			let i = getComputedStyle(t);
			for (let e of [
				"fill",
				"stroke",
				"stroke-width",
				"stroke-dasharray",
				"fill-opacity",
				"stroke-opacity",
				"opacity",
				"display",
				"visibility",
				"font-family",
				"font-size",
				"font-weight",
				"color"
			]) {
				let t = i.getPropertyValue(e);
				t && n.style.setProperty(e, t);
			}
		}
		return t.setAttribute("xmlns", "http://www.w3.org/2000/svg"), t.removeAttribute("tabindex"), new XMLSerializer().serializeToString(t);
	}
	commitSvg(e, t = [], n = !1) {
		if (n || (this.animation = this.animationOverride ?? t, this.animationStep = 0), !this.querySelector(":scope > .tp-xy-plot-board > .tp-xy-plot-preview")) {
			let t = "<tp-icon-button data-xy-source-toggle library=\"tp\" name=\"code\" label=\"Show graph definition\" title=\"Show graph definition\" aria-pressed=\"false\"></tp-icon-button>\n <tp-icon-button data-xy-history=\"undo\" library=\"tp\" name=\"undo\" label=\"Undo\" disabled></tp-icon-button>\n <tp-icon-button data-xy-history=\"redo\" library=\"tp\" name=\"redo\" label=\"Redo\" disabled></tp-icon-button>\n <tp-icon-button data-xy-zoom=\"out\" name=\"minus\" library=\"tp\" label=\"Zoom out\"></tp-icon-button>\n <tp-icon-button data-xy-zoom=\"in\" name=\"plus\" library=\"tp\" label=\"Zoom in\"></tp-icon-button>";
			this.innerHTML = `
<div class="tp-xy-plot-board"><div class="tp-xy-plot-toolbar"><strong data-xy-label hidden></strong>
  <tp-save-image anchor='[data-xy-export="${this.settingsPanelId}"]' filename="graph"></tp-save-image><tp-theme anchor='[data-xy-export="${this.settingsPanelId}"]'></tp-theme>
  <tp-icon-button class="tp-xy-plot-zoom-button" name="zoom-out" library="tp" label="Zoom graph"></tp-icon-button>
</div>
<div class="tp-xy-plot-preview">${e}</div>
<div class="tp-xy-plot-source"></div>
<div class="tp-xy-plot-footer">${t}</div></div>
<dialog class="tp-xy-plot-dialog" aria-label="Zoomed graph">
  <form class="tp-xy-plot-dialog-header" method="dialog"><strong data-xy-label hidden></strong>
  <tp-save-image anchor='[data-xy-export="${this.settingsPanelId}"]' filename="graph"></tp-save-image><tp-theme anchor='[data-xy-export="${this.settingsPanelId}"]'></tp-theme>
    <tp-icon-button type="submit" class="tp-xy-plot-close-button" name="zoom-in" library="tp" label="Close zoomed graph"></tp-icon-button>
  </form>
  <div class="tp-xy-plot-dialog-content">${e}</div>
 <div class="tp-xy-plot-dialog-source"></div>
 <div class="tp-xy-plot-dialog-footer">${t}</div>
</dialog>
`;
			for (let e of this.querySelectorAll("[data-xy-source-toggle]")) e.addEventListener("click", () => {
				e.hasAttribute("disabled") || (e.closest("dialog") ? this.toggleZoomSource() : this.toggleSource());
			});
			for (let e of this.querySelectorAll("[data-xy-history]")) e.addEventListener("click", () => this.navigateHistory(e.getAttribute("data-xy-history") === "redo"));
			this.querySelector(".tp-xy-plot-dialog")?.addEventListener("close", () => this.restoreZoomSource());
			for (let e of this.querySelectorAll("[data-xy-zoom]")) e.addEventListener("click", () => {
				e.hasAttribute("disabled") || (e.getAttribute("data-xy-zoom") === "reset" ? this.renderViewport(0, 0, 0) : this.changeZoom(e.getAttribute("data-xy-zoom") === "in" ? 1 : -1));
			});
		}
		this.syncLabel();
		for (let e of this.querySelectorAll("[data-xy-source-toggle]")) e.toggleAttribute("disabled", !this.currentSource);
		this.syncHistory();
		for (let e of this.querySelectorAll(".tp-xy-plot-preview, .tp-xy-plot-dialog-content")) e.hasAttribute("tabindex") || this.bindPan(e);
		for (let e of this.querySelectorAll("[data-xy-zoom]")) e.toggleAttribute("disabled", e.getAttribute("data-xy-zoom") === "in" ? this.zoomLevel >= 12 : e.getAttribute("data-xy-zoom") === "out" && this.zoomLevel <= -12);
		let r = this.querySelector(":scope > .tp-xy-plot-board > .tp-xy-plot-preview"), i = this.querySelector(":scope > .tp-xy-plot-dialog > .tp-xy-plot-dialog-content");
		r && (r.innerHTML = e), i && (i.innerHTML = e);
		for (let e of this.querySelectorAll(".tp-xy-plot-preview > svg, .tp-xy-plot-dialog-content > svg")) e.setAttribute("role", "img"), e.setAttribute("aria-label", this.data?.title || "XY plot");
		if (this.zoomDiagram) for (let [e, t, n] of [[
			"horizontal",
			this.zoomDiagram.xAxisAt,
			this.zoomDiagram.yAxis
		], [
			"vertical",
			this.zoomDiagram.yAxisAt,
			this.zoomDiagram.xAxis
		]]) {
			let [r, i] = this.zoomRange(n, this.zoomLevel, e === "horizontal" ? this.panY : this.panX);
			if (t !== void 0 && (t < r || t > i)) for (let t of this.querySelectorAll(`svg > line[data-xy-axis="${e}"]`)) t.remove();
		}
		this.syncPresentation(), this.fitPlotViewBox(), n ? this.animation.length && this.syncAnimation() : this.createAnimationControls(), Array.from(this.children).forEach((e) => {
			e.setAttribute("data-xy-plot-output", "");
		}), this.syncSettings();
	}
	createAnimationControls() {
		if (this.querySelector(":scope > .tp-xy-plot-animation")?.remove(), !this.animation.length) return;
		let e = document.createElement("div");
		e.className = "tp-xy-plot-animation", e.setAttribute("role", "group"), e.setAttribute("aria-label", "Step-by-step graph"), e.setAttribute("data-xy-plot-output", "");
		for (let [t, n, r] of [
			[
				"start",
				"chevron-left-first",
				"Start"
			],
			[
				"previous",
				"chevron-left",
				"Previous"
			],
			[
				"next",
				"chevron-right",
				"Next"
			],
			[
				"end",
				"chevron-right-last",
				"End"
			]
		]) {
			if (!t || !n || !r) continue;
			if (t === "next") {
				let t = document.createElement("span");
				t.setAttribute("role", "status"), t.setAttribute("aria-live", "polite"), e.append(t);
			}
			let i = document.createElement("tp-icon-button");
			i.setAttribute("name", n), i.setAttribute("library", "tp"), i.setAttribute("label", r), i.dataset.action = t, i.addEventListener("click", () => {
				i.hasAttribute("disabled") || (t === "start" ? this.goToStart() : t === "end" ? this.goToEnd() : t === "next" ? this.next() : this.previous());
			}), e.append(i);
		}
		this.querySelector(":scope > .tp-xy-plot-board")?.after(e), this.syncAnimation();
	}
	syncAnimation() {
		let e = new Set(this.animation.slice(this.animationStep).flat());
		for (let t of this.querySelectorAll("[data-xy-object]")) {
			let n = !e.has(t.getAttribute("data-xy-object") ?? "");
			t.style.visibility = n ? "visible" : "hidden", t.setAttribute("aria-hidden", String(!n));
		}
		let t = this.querySelector(":scope > .tp-xy-plot-animation"), n = t?.querySelector("[role=\"status\"]");
		n && (n.textContent = `${this.animationStep} / ${this.animation.length}`);
		for (let e of t?.querySelectorAll("tp-icon-button") ?? []) {
			let t = ["start", "previous"].includes(e.getAttribute("data-action") ?? "");
			e.toggleAttribute("disabled", t ? this.animationStep === 0 : this.animationStep === this.animation.length);
		}
	}
	async renderPlot() {
		let e = ++this.revision;
		try {
			let t, n = [];
			if (this.data) this.sourceGrid = "both", t = this.renderData(this.data);
			else {
				let i = this.currentSource ?? await this.source.read({ cache: "no-store" });
				if (e !== this.revision || !this.isConnected) return;
				if (i.trim() === "") {
					this.innerHTML = "", this.syncSettings();
					return;
				}
				let a = r(i);
				this.objectNames = new Set([
					...a.functions,
					...a.points ?? [],
					...a.vectors ?? []
				].map((e) => e.label)), n = a.anim ?? [], this.sourceGrid = a.grid ?? "both", t = this.initializeViewport(a), this.currentSource = i, this.initialSource ??= i;
			}
			this.commitSvg(t, n);
		} catch (t) {
			if (e !== this.revision || !this.isConnected) return;
			let n = t instanceof Error ? t.message : String(t);
			this.innerHTML = `<pre class="tp-xy-plot-error" role="alert" data-xy-plot-output><code>${g(n)}</code></pre>`, this.syncSettings();
		}
	}
};
function v() {
	h || typeof document > "u" || (h = !0, document.addEventListener("click", (e) => {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(".tp-xy-plot-zoom-button");
		if (!(n instanceof HTMLElement)) return;
		let r = n.closest(".tp-xy-plot");
		if (!(r instanceof HTMLElement)) return;
		let i = r.querySelector(".tp-xy-plot-dialog");
		i instanceof HTMLDialogElement && i.showModal();
	}));
}
customElements.get("tp-xy-plot") || customElements.define("tp-xy-plot", _);
//#endregion
export { _ as t };

//# sourceMappingURL=xy-plot.js.map