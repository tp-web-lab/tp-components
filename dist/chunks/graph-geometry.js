import { t as e } from "./base.js";
import "./accordion.js";
import "./icon-button.js";
import "../components/textfield/textfield.js";
import "./divider.js";
import "./button-group.js";
import "./dropdown.js";
import "./theme.js";
import "./code-editor.js";
import { chooseSaveTarget as t, saveBlob as n } from "../utilities/save-file.js";
import { choosePlaygroundFile as r } from "../components/playground/playground-local-file.js";
import "./callout.js";
import "./radio-list.js";
import "./save-image.js";
import { GEOMETRY_COLORS as i, GEOMETRY_STYLES as a, GEOMETRY_TRANSFORMATIONS as o, MEDIATRIX_CONSTRUCTION as s, dependencies as c, distance as l, evaluateGeometry as u, geometrySourceLabel as d, intersections as f, isLinear as p, parameterAt as m, parseGeometry as h, renameGeometry as g, serializeGeometry as _, withGeometryLabel as v } from "../components/graph-geometry/geometry.js";
import { GEOMETRY_SHORTCUTS as y } from "../components/graph-geometry/geometry-actions.js";
//#region src/components/graph-geometry/graph-geometry.css?inline
var b = "tp-graph-geometry{color:var(--tp-text-body,CanvasText);border:1px solid var(--tp-neutral-stroke-soft,#cdd9dc);background:var(--tp-paper-color,Canvas);border-radius:12px;font-family:system-ui,sans-serif;display:block;overflow:hidden}.tp-geometry-header{border-bottom:1px solid var(--tp-neutral-stroke-soft,#dbe4e6);justify-content:space-between;align-items:center;gap:16px;padding:18px;display:flex}.tp-geometry-header strong{font-size:1.25rem;display:block}.tp-geometry-header>div>span{opacity:.75;font-size:.85rem}.tp-geometry-tools{flex-wrap:wrap;gap:5px;padding:12px 16px;display:flex}.tp-geometry-parameters{flex-wrap:wrap;align-items:center;gap:12px;padding:0 16px;display:flex}.tp-geometry-parameters[hidden]{display:none}.tp-geometry-parameters tp-textfield{width:160px}.tp-geometry-parameters span{font-size:.8rem}.tp-geometry-hint{margin:12px 16px;font-size:.85rem}.tp-geometry-workspace{border-block:1px solid var(--tp-neutral-stroke-soft,#dbe4e6);grid-template-columns:minmax(0,1fr) 220px;display:grid}.tp-geometry-board{background:var(--tp-background-color,Canvas);flex-direction:column;min-width:0;display:flex}.tp-geometry-canvas{flex:1 0 auto;min-height:320px;position:relative}.tp-geometry-canvas:before{content:\"\";padding-top:62.2222%;display:block}.tp-geometry-canvas>svg{touch-action:none;width:100%;height:100%;display:block;position:absolute;inset:0}.tp-geometry-view{flex-wrap:wrap;align-items:center;gap:5px;padding:8px;display:flex}.tp-geometry-workspace aside{border-left:1px solid var(--tp-neutral-stroke-soft,#dbe4e6);padding:12px}.tp-geometry-workspace h3{margin:0 0 12px;font-size:.85rem}.tp-geometry-workspace aside p{opacity:.8;font-size:.8rem;line-height:1.5}tp-graph-geometry [data-objects]{margin-bottom:10px}tp-graph-geometry [data-objects] tp-button{text-align:left;justify-content:space-between;gap:8px;width:100%;margin-bottom:5px;display:flex}tp-graph-geometry [data-objects] .object-kind{font-size:.75rem}.tp-geometry-shape{cursor:pointer}.tp-geometry-shape .shape-hit{fill:none;stroke:#0000;stroke-width:15px}.tp-geometry-shape .shape-ink{fill:none;stroke:var(--tp-info-text-colorful,#447a94);stroke-width:2px;pointer-events:none}.tp-geometry-shape .line{stroke:var(--tp-warning-text-colorful,#ab573b)}.tp-geometry-shape .segment{stroke:var(--tp-text-body,CanvasText)}.tp-geometry-shape .arc{stroke:var(--tp-success-text-colorful,#248273)}.tp-geometry-shape.is-selected .shape-ink{stroke:#c96523;stroke-width:3px}.tp-geometry-shape .point-hit{fill:#0000}.tp-geometry-shape .point{fill:var(--tp-paper-color,Canvas);stroke:var(--tp-info-text-colorful,#1e5e85);stroke-width:2.5px}.tp-geometry-shape .dependent{fill:var(--tp-success-fill-loud,#268675);stroke:var(--tp-paper-color,Canvas)}.tp-geometry-shape.is-selected .point{fill:#df8c3e}.tp-geometry-shape text{fill:var(--tp-text-body,CanvasText);paint-order:stroke;stroke:var(--tp-background-color,Canvas);stroke-width:4px;font:600 15px system-ui}tp-graph-geometry [data-status]{min-height:2em;margin:0;padding:10px 16px;font-size:.85rem}.tp-geometry-source{border-top:1px solid var(--tp-neutral-stroke-soft,#dbe4e6);padding:12px 16px}@media (width<=700px){.tp-geometry-workspace{grid-template-columns:1fr}.tp-geometry-workspace aside{border-left:0;border-top:1px solid var(--tp-neutral-stroke-soft,#dbe4e6)}.tp-geometry-header{flex-wrap:wrap}}tp-graph-geometry aside>tp-button{max-width:100%}tp-graph-geometry aside>tp-button>button{white-space:normal}.tp-geometry-board [data-grid]{pointer-events:none}.tp-geometry-board [data-grid] path{fill:none;stroke:var(--tp-text-body,CanvasText);stroke-opacity:.13;stroke-width:1px;vector-effect:non-scaling-stroke}.tp-geometry-board svg.pan-mode,.tp-geometry-board svg.pan-mode .tp-geometry-shape{cursor:grab}.tp-geometry-board svg.is-panning,.tp-geometry-board svg.is-panning .tp-geometry-shape{cursor:grabbing}.tp-geometry-tools{--tp-button-group-gap:.3rem}.tp-geometry-header tp-button-group{--tp-button-group-gap:.4rem;flex-wrap:wrap}tp-graph-geometry [data-objects] tp-button>button{inline-size:100%}tp-graph-geometry [data-objects] [data-tp-button-content]{justify-content:space-between;gap:.5rem;inline-size:100%;display:flex}.tp-geometry-board svg:focus-visible{outline:3px solid var(--tp-focus-color,Highlight);outline-offset:-3px}.tp-geometry-shape .sector{fill:var(--tp-info-text-colorful,#447a94);fill-opacity:.12}.tp-geometry-appearance{flex-wrap:wrap;gap:.3rem;margin-bottom:.6rem;display:flex}.tp-geometry-swatch{background:var(--tp-brand-seed);border:1px solid;border-radius:50%;width:1em;height:1em;margin-inline-end:.5em;display:inline-block}.tp-geometry-shape.stroke-dotted .shape-ink,.tp-geometry-shape.stroke-dotted .point{stroke-dasharray:1 6;stroke-linecap:round}.tp-geometry-shape.stroke-dashed .shape-ink,.tp-geometry-shape.stroke-dashed .point{stroke-dasharray:10 6}.tp-geometry-shape.has-color .shape-ink,.tp-geometry-shape.has-color .point{stroke:var(--tp-brand-seed)}.tp-geometry-shape.has-color .sector,.tp-geometry-shape.has-color .dependent,.tp-geometry-shape.has-color text{fill:var(--tp-brand-seed)}.tp-geometry-preview{fill:none;stroke:var(--tp-info-text-colorful,#1e5e85);stroke-width:2px;stroke-dasharray:5 5;pointer-events:none}.tp-geometry-shape .polygon{fill:var(--tp-info-text-colorful,#447a94);fill-opacity:.15}.tp-geometry-shape.has-color .polygon{fill:var(--tp-brand-seed)}.tp-geometry-shape.is-selected:not(.has-color) .polygon{fill:#c96523}.tp-geometry-shape .shape-hit polygon{fill:#0000}tp-graph-geometry{position:relative}.tp-geometry-header>.tp-geometry-theme{margin-inline-start:auto}.tp-geometry-header>tp-save-image{margin-inline-start:0}tp-graph-geometry[canvas-only]>.tp-geometry-header{display:contents}tp-graph-geometry[canvas-only]>.tp-geometry-header>:not(.tp-geometry-theme),tp-graph-geometry[canvas-only]>.tp-geometry-tools,tp-graph-geometry[canvas-only]>.tp-geometry-parameters,tp-graph-geometry[canvas-only]>.tp-geometry-hint,tp-graph-geometry[canvas-only]>.tp-geometry-source,tp-graph-geometry[canvas-only]>.tp-geometry-workspace>aside{display:none}tp-graph-geometry[canvas-only]>.tp-geometry-workspace{border:0;grid-template-columns:minmax(0,1fr)}tp-graph-geometry[canvas-only]>[data-status]{clip-path:inset(50%);width:1px;height:1px;min-height:0;padding:0;position:absolute;overflow:hidden}.tp-geometry-board{position:relative}.tp-geometry-board-heading{justify-content:space-between;align-items:center;gap:.5rem;min-height:2.5rem;padding:.5rem;display:flex}.tp-geometry-board-heading strong{overflow-wrap:anywhere}.tp-geometry-board-actions{align-items:center;gap:.3rem;margin-inline-start:auto;display:flex}.tp-geometry-view{justify-content:flex-end}.tp-geometry-tools tp-icon-button,.tp-geometry-view tp-icon-button{--tp-icon-button-icon-size:24px;--tp-icon-button-size:34px}.tp-geometry-tools tp-icon-button[aria-pressed=true],.tp-geometry-view tp-icon-button[aria-pressed=true]{background:var(--tp-brand-fill-loud);color:var(--tp-brand-text-on-loud);border-radius:.3rem}[data-tool-palette]{overscroll-behavior:contain;min-width:18rem;overflow-x:hidden;max-height:var(--tp-geometry-palette-height,min(65vh,32rem))!important;max-block-size:var(--tp-geometry-palette-height,min(65vh,32rem))!important;overflow-y:auto!important}[data-tool-palette]>ul{overflow:visible}.tp-geometry-tools>tp-divider{align-self:center;min-height:24px}.tp-geometry-board-heading>[data-figure-title]{min-width:0;margin-inline-end:auto}.tp-geometry-board-actions{flex-shrink:0}[data-tool-palette] li:not([data-tp-dropdown-divider]){align-items:center;gap:.6rem;display:flex}[data-tool-palette] tp-icon{width:24px;height:24px}[data-tool-palette] kbd{margin-inline-start:auto;font-size:.8em}.tp-geometry-context{padding-bottom:.5rem}tp-graph-geometry[canvas-only][data-active-tool=move] .tp-geometry-context,tp-graph-geometry[canvas-only][data-active-tool=pan] .tp-geometry-context{display:none}.tp-geometry-dialog{border:1px solid var(--tp-neutral-stroke-soft);background:var(--tp-background-color);width:94vw;max-width:94vw;height:92vh;max-height:92vh;color:var(--tp-text-body);border-radius:.75rem;padding:0}.tp-geometry-dialog::backdrop{background:#0008}.tp-geometry-dialog>.tp-geometry-board{min-height:100%}.tp-geometry-parameters>[hidden],.tp-geometry-dialog .tp-geometry-canvas:before{display:none}.tp-geometry-dialog>.tp-geometry-board{height:100%}.tp-geometry-source-toolbar{justify-content:space-between;align-items:center;gap:.5rem;margin-bottom:.5rem;display:flex}.tp-geometry-source-actions{align-items:center;gap:.25rem;display:flex}.tp-geometry-view>[data-action=source-view]{margin-inline-end:auto;display:none}tp-graph-geometry[canvas-only] .tp-geometry-view>[data-action=source-view]{display:inline-flex}.tp-geometry-board>.tp-geometry-source{min-width:0;display:none}.tp-geometry-board[data-source-open]>.tp-geometry-source{display:block}.tp-geometry-board[data-source-open]>.tp-geometry-canvas,.tp-geometry-board[data-source-open]>.tp-geometry-context{display:none}.tp-geometry-dialog .tp-geometry-board[data-source-open]{height:auto}tp-graph-geometry>.tp-geometry-workspace>.tp-geometry-board{block-size:calc(var(--tp-plot-height,auto) - 2px);min-block-size:0}.tp-geometry-workspace>.tp-geometry-board>.tp-geometry-canvas{flex:auto;min-height:0;overflow:hidden}.tp-geometry-workspace>.tp-geometry-board>.tp-geometry-canvas:before{box-sizing:border-box;height:0;min-height:320px}.tp-geometry-workspace>.tp-geometry-board>.tp-geometry-board-heading,.tp-geometry-workspace>.tp-geometry-board>.tp-geometry-view{flex:none}.tp-geometry-workspace>.tp-geometry-board>.tp-geometry-source{flex:auto;min-height:0;overflow:auto}.tp-geometry-object-editor{flex-wrap:wrap;gap:.5rem;margin-block:.75rem;display:flex}.tp-geometry-object-editor tp-textfield,.tp-geometry-object-editor p{width:100%;margin:0}.tp-geometry-shape [data-name-label]{cursor:move}.tp-geometry-canvas [data-inline-rename]{z-index:2;box-sizing:border-box;background:var(--tp-background-color,Canvas);width:min(15rem,100%);max-width:100%;color:var(--tp-text-body,CanvasText);border:1px solid var(--tp-neutral-stroke-soft);left:clamp(min(7.5rem, 50%), var(--rename-left,50%), max(calc(100% - 7.5rem), 50%));border-radius:.4rem;gap:.25rem;padding:.5rem;display:grid;position:absolute;transform:translate(-50%,-50%)}.tp-geometry-canvas [data-inline-rename] [role=alert]{overflow-wrap:anywhere}.tp-geometry-board [data-animation-controls]:not([hidden]){flex-wrap:wrap;align-items:center;gap:.4rem;padding:.5rem;display:flex}", x = (e) => e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;"), S = {
	move: "Move",
	pan: "Pan view",
	point: "Point",
	on: "Point on object",
	segment: "Segment",
	line: "Line",
	fixedSegment: "Segment · length",
	ray: "Ray",
	vector: "Vector",
	sector: "Angular sector",
	comment: "Comment",
	length: "Measure length",
	area: "Measure area",
	angle: "Measure angle",
	circle: "Circle · radius",
	through: "Circle · through point",
	arc: "Arc",
	intersection: "Intersection"
}, C = [
	["move", "pan"],
	[
		"point",
		"on",
		"intersection"
	],
	[
		"line",
		"ray",
		"segment",
		"fixedSegment",
		"vector",
		"sector"
	],
	[
		"circle",
		"through",
		"arc"
	],
	[
		"length",
		"area",
		"angle"
	],
	["comment"]
], w = {
	midpoint: "Midpoint",
	perpendicular: "Perpendicular",
	parallel: "Parallel",
	perpendicularBisector: "Perpendicular bisector · direct",
	bisector: "Angle bisector",
	tangent: "Tangents",
	polygon: "Polygon",
	regularPolygon: "Regular polygon",
	axialSymmetry: "Axial symmetry",
	centralSymmetry: "Central symmetry",
	homothety: "Homothety",
	rotation: "Rotation",
	translation: "Translation"
}, T = [
	[
		"midpoint",
		"perpendicular",
		"parallel",
		"perpendicularBisector",
		"bisector",
		"tangent"
	],
	["polygon", "regularPolygon"],
	["axialSymmetry", "centralSymmetry"],
	[
		"homothety",
		"rotation",
		"translation"
	]
], E = {
	length: "Select two points, or a segment, vector, circle, arc, polygon or sector. Closed shapes show their perimeter.",
	area: "Select a circle, polygon or angular sector to measure its area.",
	angle: "Select two sides with a common vertex or intersection, or three points (vertex second). Two sides show an arc and value, or a square for a right angle.",
	axialSymmetry: "Select the object to copy, then a line, segment, ray or vector as the reflection axis.",
	centralSymmetry: "Select the object to copy, then the centre point.",
	homothety: "Set Ratio (nonzero), select the object to copy, then the centre point.",
	rotation: "Set Rotation angle (°), select the object to copy, then the centre point. Positive angles turn counterclockwise.",
	translation: "Select the object to copy, then a vector giving the displacement.",
	polygon: "Click to create vertices or select existing points. Click the first vertex or Finish polygon after at least three vertices. Escape cancels.",
	regularPolygon: "Set Sides (3–360), then click or select two consecutive vertices. The polygon turns counterclockwise from the first edge.",
	pan: "Drag anywhere to move the whole figure. Scroll in either direction; arrow keys pan the view.",
	move: "Drag points, names or comments to move them. Drag empty space to move the view. Scroll to pan; Shift+scroll pans horizontally.",
	point: "Click the drawing to place a free point.",
	on: "Click a line, segment, ray, vector, circle or arc to place a point attached to it.",
	segment: "Select two existing points.",
	line: "Select two existing points.",
	fixedSegment: "Enter a positive length, then select the origin and a point giving its direction. The endpoint stays at the chosen length.",
	ray: "Select the origin, then a point giving the ray direction.",
	vector: "Select the starting point, then the endpoint.",
	sector: "Set start/end angles, then select a circle to draw its angular sector.",
	comment: "Enter comment text, then click anywhere. Clicking a point attaches the comment to it. Move comments with Select / Move.",
	midpoint: "Select a segment to construct its midpoint.",
	perpendicular: "Select a point, then a line, segment, ray or vector.",
	parallel: "Select a point, then a line, segment, ray or vector.",
	perpendicularBisector: "Select a segment to construct its perpendicular bisector directly.",
	bisector: "Select three points: first arm, vertex, second arm. The internal angle bisector follows them.",
	tangent: "Select a point, then a circle. Creates two tangents outside, one on the circle, none inside.",
	circle: "Enter a positive radius or distance(A, B), then select the centre.",
	through: "Select the centre, then a point on the circle.",
	arc: "Set start/end angles, then select a circle. Its outline will be hidden; its dependencies remain.",
	intersection: "Select two lines, segments, rays, vectors, circles or arcs."
}, D = class D extends e {
	static nextId = 0;
	controlId = `tp-geometry-${++D.nextId}`;
	objects = [];
	activeAnimation = null;
	animationStep = 0;
	result = u([]);
	initialized = !1;
	sourceRequest = null;
	localFileRequest = null;
	sourceSaveTarget = null;
	sourceFileBusy = !1;
	objectListMarkup = "";
	tool = "move";
	polygonDraft = [];
	pending = [];
	selected = null;
	undoStack = [];
	redoStack = [];
	scale = 36;
	canvasHeight = 560;
	canvasObserver = null;
	center = {
		x: 0,
		y: 0
	};
	pan = null;
	suppressCanvasClick = !1;
	movingName = !1;
	pointerObject = null;
	drag = null;
	static get observedAttributes() {
		return [
			"readonly",
			"grid",
			"src",
			"built-in",
			"canvas-only",
			"label"
		];
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		e ? this.setAttribute("src", e) : this.removeAttribute("src");
	}
	get value() {
		return v(_(this.objects), this.label);
	}
	set value(e) {
		this.setConstruction(e);
	}
	get grid() {
		return this.hasAttribute("grid");
	}
	set grid(e) {
		this.toggleAttribute("grid", e);
	}
	get label() {
		return this.getAttribute("label") ?? "";
	}
	set label(e) {
		this.setAttribute("label", e);
	}
	get canvasOnly() {
		return this.hasAttribute("canvas-only");
	}
	set canvasOnly(e) {
		this.toggleAttribute("canvas-only", e);
	}
	get builtIn() {
		return this.hasAttribute("built-in");
	}
	set builtIn(e) {
		this.toggleAttribute("built-in", e);
	}
	get readonly() {
		return this.hasAttribute("readonly");
	}
	analyze() {
		return structuredClone(this.result);
	}
	setConstruction(e) {
		let t = h(e);
		this.querySelector("[data-inline-rename]")?.remove();
		let n = d(e), r = this.value;
		this.objects = t, this.animationStep = 0, n !== void 0 && (this.label = n), this.initialized = !0, r !== this.value && (this.undoStack.push(r), this.redoStack = []), this.pending = [], this.polygonDraft = [], this.selected = null, this.movingName = !1, this.recompute(), this.syncSource(e), this.changed();
	}
	undo() {
		if (this.readonly) return;
		let e = this.undoStack.pop();
		e !== void 0 && (this.redoStack.push(this.value), this.restore(e));
	}
	redo() {
		if (this.readonly) return;
		let e = this.redoStack.pop();
		e !== void 0 && (this.undoStack.push(this.value), this.restore(e));
	}
	removeObject(e) {
		if (this.readonly) return;
		let t = /* @__PURE__ */ new Set([e]), n;
		do {
			n = t.size;
			for (let e of this.objects) c(e.definition).some((e) => t.has(e)) && t.add(e.id);
		} while (n !== t.size);
		this.setConstruction(_(this.objects.filter((e) => !t.has(e.id)).map((e) => e.definition.kind === "animation" ? {
			...e,
			definition: {
				...e.definition,
				steps: e.definition.steps.map((e) => Array.isArray(e) ? e.filter((e) => !t.has(e)) : t.has(e) ? [] : e).filter((e) => !Array.isArray(e) || e.length > 0)
			}
		} : e)));
	}
	connectedCallback() {
		if (super.connectedCallback(), this.ensureGlobalStyle("tp-graph-geometry-style", b), !this.initialized) {
			let e = this.querySelector("script[type=\"tp/geometry\"]")?.textContent ?? this.textContent ?? "";
			try {
				if (this.objects = h(this.src.trim() ? "" : e.trim() || s), !this.src.trim()) {
					let t = d(e);
					t !== void 0 && (this.label = t);
				}
				this.initialized = !0;
			} catch (e) {
				this.innerHTML = `<p role="alert">${x(String(e))}</p>`, this.dispatchEvent(new CustomEvent("tp-geometry-error", {
					bubbles: !0,
					detail: { message: String(e) }
				}));
				return;
			}
		}
		this.render(), this.recompute(), this.syncSource(), this.fitView(), this.loadSource();
	}
	attributeChangedCallback(e, t, n) {
		if (t !== n) {
			if (e === "label") {
				let e = this.querySelector("[data-figure-title]");
				e && (e.textContent = this.label, e.hidden = !this.label);
				let t = this.querySelector("tp-code-editor");
				if (t) try {
					t.setValue(v(t.getValue(), this.label));
				} catch {}
				return;
			}
			if (e === "src") {
				this.sourceSaveTarget = null, this.isConnected && this.initialized && this.loadSource();
				return;
			}
			if (e === "grid") {
				this.isConnected && this.draw();
				return;
			}
			this.isConnected && this.initialized && (this.drag = null, this.pan = null, this.pending = [], this.polygonDraft = [], this.tool = "move", this.render(), this.recompute(), this.syncSource());
		}
	}
	disconnectedCallback() {
		for (let e of this.paletteViewports) e.removeEventListener("resize", this.constrainPalette), e.removeEventListener("scroll", this.constrainPalette, !0);
		this.paletteViewports.clear(), window.removeEventListener("resize", this.constrainPalette), window.removeEventListener("scroll", this.constrainPalette, !0), this.localFileRequest?.abort(), this.canvasObserver?.disconnect(), this.canvasObserver = null, this.sourceRequest?.abort(), this.sourceRequest = null, this.drag = null, this.pan = null;
	}
	async loadSource() {
		this.sourceRequest?.abort(), this.sourceRequest = null;
		let e = this.src.trim();
		if (!e) {
			this.report("");
			return;
		}
		let t = new AbortController();
		this.sourceRequest = t, this.report("Loading construction…");
		try {
			let n = await fetch(new URL(e, this.baseURI).href, { signal: t.signal });
			if (!n.ok) throw Error(`Cannot load construction: HTTP ${n.status}`);
			let r = await n.text();
			if (this.sourceRequest !== t || !this.isConnected) return;
			this.setConstruction(r), this.fitView(), this.report("Construction loaded.");
		} catch (e) {
			if (this.sourceRequest !== t || t.signal.aborted) return;
			let n = String(e);
			this.report(n), this.dispatchEvent(new CustomEvent("tp-geometry-error", {
				bubbles: !0,
				detail: { message: n }
			}));
		} finally {
			this.sourceRequest === t && (this.sourceRequest = null);
		}
	}
	restore(e) {
		this.objects = h(e), this.animationStep = 0, this.label = d(e) ?? "", this.pending = [], this.polygonDraft = [], this.selected = null, this.movingName = !1, this.recompute(), this.syncSource(), this.changed();
	}
	recompute() {
		this.result = u(this.objects), this.draw();
	}
	changed() {
		this.dispatchEvent(new CustomEvent("tp-geometry-change", {
			bubbles: !0,
			detail: {
				source: this.value,
				undefined: [...this.result.errors.keys()]
			}
		}));
	}
	syncSource(e = this.value) {
		let t = this.querySelector("tp-code-editor");
		t && t.setValue(e);
	}
	async sourceFileAction(e) {
		if (this.sourceFileBusy || e === "load" && this.readonly) return;
		this.sourceFileBusy = !0, this.syncSourceFileButtons();
		let i = this.value;
		try {
			if (e === "load") {
				let e = new AbortController();
				this.localFileRequest?.abort(), this.localFileRequest = e;
				let t = await r(this, ".txt,text/plain", e.signal);
				if (!t) return;
				let n = await t.text();
				if (e.signal.aborted || !this.isConnected || this.readonly || this.value !== i) return;
				h(n), this.sourceRequest?.abort(), this.setConstruction(n), this.sourceSaveTarget = null, this.fitView(), this.report(`Loaded ${t.name}.`);
			} else {
				let r = this.querySelector("tp-code-editor")?.getValue() ?? this.value, i = d(r) ?? this.label;
				r = v(r, i);
				let a = i.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "") || "construction", o = e === "save" && this.sourceSaveTarget || await t({
					suggestedName: `${a}.txt`,
					description: "Geometry construction",
					mimeType: "text/plain",
					extension: ".txt"
				});
				if (!o || !this.isConnected) return;
				await n(new Blob([r], { type: "text/plain;charset=utf-8" }), o), this.sourceSaveTarget = o, this.report(`Saved ${o.filename}.`);
			}
		} catch (t) {
			this.report(`Unable to ${e === "load" ? "load" : "save"} construction: ${String(t)}`);
		} finally {
			this.sourceFileBusy = !1, this.syncSourceFileButtons();
		}
	}
	syncSourceFileButtons() {
		for (let e of this.querySelectorAll("[data-source-file]")) {
			let t = this.sourceFileBusy || this.readonly && e.dataset.sourceFile === "load";
			e.toggleAttribute("disabled", t), e.setAttribute("aria-disabled", String(t));
		}
		this.syncButtonControls();
	}
	field(e) {
		return this.querySelector(`[data-field="${e}"]`)?.value ?? "";
	}
	report(e) {
		let t = this.querySelector("[data-status]");
		t && (t.textContent = e);
	}
	onExportError = (e) => {
		this.report(`Image export failed: ${String(e.detail.error)}`);
	};
	changeAppearance(e, t) {
		if (this.readonly || !this.selected) return;
		let n = this.selected, r = h(this.value), o = r.find((e) => e.id === n);
		o && (e !== void 0 && a.includes(e) && (o.hidden = e === "hidden", e !== "hidden" && (o.stroke = e)), t !== void 0 && (!t || i.includes(t)) && (t ? o.color = t : delete o.color), this.setConstruction(_(r)), this.selected = n, this.draw());
	}
	exportSvg() {
		let e = this.querySelector("svg[data-geometry-canvas]");
		if (!e) throw Error("The construction is not ready.");
		let t = e.cloneNode(!0);
		t.querySelectorAll(".shape-hit, .point-hit, [data-polygon-preview]").forEach((e) => {
			e.remove();
		}), t.querySelectorAll(".is-selected").forEach((e) => {
			e.classList.remove("is-selected");
		}), t.style.cssText = "position:fixed;left:-10000px;visibility:hidden;pointer-events:none", (e.parentElement ?? this).append(t);
		try {
			let n = [
				"fill",
				"fill-opacity",
				"stroke",
				"stroke-width",
				"stroke-opacity",
				"stroke-dasharray",
				"stroke-linecap",
				"stroke-linejoin",
				"font-family",
				"font-size",
				"font-weight",
				"paint-order",
				"opacity"
			];
			for (let e of t.querySelectorAll("*")) {
				let t = getComputedStyle(e), r = n.map((e) => [e, t.getPropertyValue(e)]);
				for (let [t, n] of r) t && n && e.style.setProperty(t, n);
			}
			let r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			r.setAttribute("width", "900"), r.setAttribute("height", String(this.canvasHeight)), r.setAttribute("fill", getComputedStyle(e.parentElement ?? this).backgroundColor), t.prepend(r);
			for (let e of [t, ...t.querySelectorAll("*")]) for (let t of [...e.attributes]) (t.name.startsWith("data-") || t.name.startsWith("aria-") || [
				"class",
				"tabindex",
				"role",
				"id"
			].includes(t.name)) && e.removeAttribute(t.name);
			return t.removeAttribute("style"), t.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg"), t.setAttribute("width", "900"), t.setAttribute("height", String(this.canvasHeight)), new XMLSerializer().serializeToString(t);
		} finally {
			t.remove();
		}
	}
	name(e) {
		let t = 1, n = e;
		for (; [...this.objects, ...this.polygonDraft].some((e) => e.id === n);) n = `${e}${t++}`;
		return n;
	}
	pointName() {
		return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").find((e) => ![...this.objects, ...this.polygonDraft].some((t) => t.id === e)) ?? this.name("P");
	}
	appendConstruction(e) {
		this.setConstruction(`${this.value}\n${e}`);
	}
	toolGroups() {
		return [...C, ...this.builtIn ? T : []];
	}
	paletteViewports = /* @__PURE__ */ new Set();
	constrainPalette = () => {
		queueMicrotask(() => {
			let e = this.querySelector("[data-tool-palette]");
			if (!e?.open) return;
			let t = window.innerHeight - e.getBoundingClientRect().top, n = e.getBoundingClientRect().top, r = 1, i = window;
			try {
				for (; i !== i.parent;) {
					let e = i.frameElement;
					if (!e) break;
					let a = e.getBoundingClientRect(), o = a.height / Math.max(1, e.offsetHeight);
					n = a.top + n * o, r *= o, i = i.parent, t = Math.min(t, (i.innerHeight - n) / r), this.paletteViewports.has(i) || (i.addEventListener("resize", this.constrainPalette), i.addEventListener("scroll", this.constrainPalette, !0), this.paletteViewports.add(i));
				}
			} catch {}
			let a = Math.max(48, Math.min(512, window.innerHeight * .65, t - 8));
			e.style.setProperty("--tp-geometry-palette-height", `${a}px`);
		});
	};
	toolButton(e, t) {
		let n = y[e];
		return `<tp-icon-button library="geometry" name="${e}" label="${t}" title="${t} (${n})" aria-keyshortcuts="${n}" data-geometry-control data-tool="${e}" aria-pressed="${e === this.tool}"></tp-icon-button>`;
	}
	actionButton(e, t, n) {
		let r = {
			palette: "keyboard-outline",
			zoom: "zoom-out",
			in: "plus",
			out: "minus",
			undo: "undo",
			redo: "redo"
		}, i = r[e] ?? e, a = e in r ? "tp" : "geometry";
		return `<tp-icon-button id="${this.controlId}-${e}" library="${a}" name="${i}" label="${t}" title="${t} (${n})" aria-keyshortcuts="${n}" data-geometry-control data-action="${e}"></tp-icon-button>`;
	}
	chooseTool(e) {
		this.movingName = !1, !(this.readonly && e !== "pan") && (!(e in S) && !this.builtIn || (this.tool = e, this.pending = [], this.polygonDraft = [], this.updateTool(), this.querySelector("[data-geometry-canvas]")?.focus()));
	}
	shortcut(e) {
		let t = e.target;
		if (!(t instanceof Element) || t.closest("input, textarea, select, [contenteditable=\"true\"], tp-code-editor, tp-dropdown, tp-theme") || e.defaultPrevented || e.altKey) return;
		let n = e.key.toLowerCase();
		if (n === "f1" && t.closest(".tp-geometry-source")) {
			e.preventDefault(), this.querySelector("[data-action=\"source-toolbar\"]")?.click();
			return;
		}
		let r;
		if (e.ctrlKey || e.metaKey) if (n === "z") r = e.shiftKey ? "redo" : "undo";
		else return;
		else {
			let t = Object.entries(y).find(([, t]) => t.toLowerCase() === `${e.shiftKey ? "shift+" : ""}${n}`)?.[0];
			if (t) {
				e.preventDefault(), this.chooseTool(t);
				return;
			}
			r = {
				delete: "delete",
				f1: "palette",
				z: "zoom",
				f: "fit",
				g: "grid",
				"+": "in",
				"=": "in",
				"-": "out"
			}[n];
		}
		r && (e.preventDefault(), this.querySelector(`[data-action="${r}"]`)?.click());
	}
	toggleSourceView() {
		if (!this.canvasOnly) return;
		let e = this.querySelector(".tp-geometry-board");
		if (!e) return;
		let t = e.toggleAttribute("data-source-open");
		t && this.querySelector(".tp-geometry-source")?.setAttribute("open-indexes", "0");
		let n = this.querySelector("[data-action=\"source-view\"]"), r = t ? "Show drawing" : "Show construction source";
		n?.setAttribute("aria-pressed", String(t)), n?.setAttribute("label", r), n?.setAttribute("title", r), this.syncButtonControls();
	}
	toggleZoom() {
		let e = this.querySelector(".tp-geometry-dialog"), t = this.querySelector(".tp-geometry-board");
		if (!e || !t) return;
		if (e.open) {
			e.close();
			return;
		}
		e.append(t), e.showModal();
		let n = this.querySelector("[data-action=\"zoom\"]");
		n?.setAttribute("name", "zoom-in"), n?.setAttribute("label", "Close zoomed drawing"), n?.setAttribute("title", "Close zoomed drawing (Z / Escape)"), this.querySelector("[data-geometry-canvas]")?.focus();
	}
	restoreBoard() {
		let e = this.querySelector(".tp-geometry-board");
		e && this.querySelector(".tp-geometry-workspace")?.prepend(e);
		let t = this.querySelector("[data-action=\"zoom\"]");
		t?.setAttribute("name", "zoom-out"), t?.setAttribute("label", "Zoom drawing"), t?.setAttribute("title", "Zoom drawing (Z)"), t?.querySelector("button")?.focus();
	}
	render() {
		let e = this.querySelector(".tp-geometry-theme")?.getAttribute("mode") ?? "auto";
		if (this.objectListMarkup = "", this.setAttribute("data-geometry-export", this.controlId), this.innerHTML = `<div class="tp-geometry-header"><div><strong>Ruler & compass</strong><span>Geometric constructions</span></div><tp-button-group><tp-button type="button" outlined data-geometry-control data-action="clear">New construction</tp-button></tp-button-group></div>
      <tp-button-group class="tp-geometry-tools" aria-label="Construction tools">${this.toolGroups().map((e) => e.map((e) => this.toolButton(e, {
			...S,
			...w
		}[e])).join("")).join("<tp-divider orientation=\"vertical\"></tp-divider>")}</tp-button-group>
      <div class="tp-geometry-parameters"><tp-textfield data-field="radius" label="Radius / length" value="5"></tp-textfield><tp-textfield data-field="start" label="Start angle (°)" value="20"></tp-textfield><tp-textfield data-field="end" label="End angle (°)" value="100"></tp-textfield><tp-textfield data-field="comment" label="Comment text" value="Comment"></tp-textfield>${this.builtIn ? `<tp-radio-list data-transform-mode label="Transformation" label-position="top" orientation="horizontal" value="1"><ul><li>Create a copy</li><li>Transform the object</li></ul></tp-radio-list><tp-textfield data-field="ratio" label="Ratio" value="2"></tp-textfield><tp-textfield data-field="rotation" label="Rotation angle (°)" value="90"></tp-textfield><tp-textfield data-field="sides" label="Sides" value="5" ${this.readonly ? "readonly" : ""}></tp-textfield><tp-button outlined data-geometry-control data-action="finish-polygon">Finish polygon</tp-button>` : ""}<span>Angles turn counterclockwise.</span></div>
      <tp-callout class="tp-geometry-hint" variant="info" outlined heading="${x({
			...S,
			...w
		}[this.tool])}" icon="${this.tool}" library="geometry"><span data-hint>${E[this.tool]}</span></tp-callout>
      <div class="tp-geometry-workspace"><div class="tp-geometry-board"><div class="tp-geometry-board-heading"><strong data-figure-title ${this.label ? "" : "hidden"}>${x(this.label)}</strong><div class="tp-geometry-board-actions">${this.actionButton("palette", "Actions", "F1")}<tp-save-image anchor='[data-geometry-export="${this.controlId}"]' filename="geometry"></tp-save-image><tp-theme class="tp-geometry-theme" mode="${e === "light" || e === "dark" ? e : "auto"}" anchor='[data-geometry-export="${this.controlId}"]'></tp-theme>${this.actionButton("zoom", "Zoom drawing", "Z")}</div></div><tp-dropdown data-tool-palette anchor="#${this.controlId}-palette" outside-click><ul>${this.toolGroups().map((e) => e.map((e) => `<li data-palette-tool="${e}" ${this.readonly && e !== "pan" ? "aria-disabled=\"true\"" : ""}><tp-icon library="geometry" name="${e}"></tp-icon><span>${{
			...S,
			...w
		}[e]}</span><kbd>${y[e]}</kbd></li>`).join("")).join("<tp-divider orientation=\"horizontal\"></tp-divider>")}</ul></tp-dropdown><div class="tp-geometry-context"></div><div data-animation-controls role="group" aria-label="Step-by-step construction" hidden></div><div class="tp-geometry-canvas"><svg data-geometry-canvas viewBox="0 0 900 ${this.canvasHeight}" role="group" aria-label="Geometric construction. Drag empty space or scroll to pan. In Pan view, arrow keys move the view." tabindex="0"><g data-grid aria-hidden="true"></g><g data-drawing></g></svg></div><div class="tp-geometry-view"><tp-icon-button library="tp" name="code" label="Show construction source" title="Show construction source" aria-pressed="false" data-geometry-control data-action="source-view"></tp-icon-button>${this.actionButton("undo", "Undo", "Ctrl+Z")}${this.actionButton("redo", "Redo", "Ctrl+Shift+Z")}${this.actionButton("out", "Zoom out", "-")}${this.actionButton("in", "Zoom in", "+")}${this.actionButton("fit", "Fit", "F")}${this.actionButton("grid", "Grid", "G")}</div></div>
      <aside><h3>Construction objects</h3><p data-appearance-label>Select an object in Move mode to change its appearance.</p><div class="tp-geometry-appearance"><tp-button id="${this.controlId}-style" outlined data-geometry-control data-action="style-menu" aria-haspopup="menu"><span data-style-label>Style · solid</span></tp-button><tp-dropdown anchor="#${this.controlId}-style" outside-click data-style-menu><ul>${a.map((e) => `<li data-stroke="${e}">${e}${e === "solid" ? " (default)" : ""}</li>`).join("")}</ul></tp-dropdown><tp-button id="${this.controlId}-color" outlined data-geometry-control data-action="color-menu" aria-haspopup="menu"><span data-color-label>Color · automatic</span></tp-button><tp-dropdown anchor="#${this.controlId}-color" outside-click data-color-menu><ul><li data-color="">Automatic</li>${i.map((e) => `<li data-color="${e}"><span class="tp-geometry-swatch tp-${e}" aria-hidden="true"></span>${e}</li>`).join("")}</ul></tp-dropdown></div><div class="tp-geometry-object-editor"><tp-textfield data-object-name label="Object name"></tp-textfield><tp-button outlined data-geometry-control data-action="rename">Rename</tp-button><tp-button outlined data-geometry-control data-action="move-name" aria-pressed="false">Move name</tp-button><tp-button outlined data-geometry-control data-action="hide-name" aria-pressed="false">Hide name</tp-button><p>Drag a name in the drawing, or enable Move name and use the arrow keys.</p></div><div data-objects></div><tp-button type="button" outlined data-geometry-control data-action="delete">Delete selected + dependents</tp-button><p>Free points move freely. Attached points slide on their support. Constructed points are calculated.</p></aside></div>
      <p data-status role="status" aria-live="polite"></p><tp-accordion class="tp-geometry-source"><dl><dt>Construction source</dt><dd><div class="tp-geometry-source-toolbar"><div><tp-icon-button id="${this.controlId}-source-files" name="file-outline" label="Construction files (.txt)" title="Construction files (.txt)" aria-haspopup="menu" data-geometry-control data-action="source-files"></tp-icon-button><tp-dropdown anchor="#${this.controlId}-source-files" outside-click data-source-menu><ul><li data-source-file="load">Load (.txt)</li><li data-source-file="save">Save (.txt)</li><li data-source-file="save-as">Save as (.txt)</li></ul></tp-dropdown></div><div class="tp-geometry-source-actions"><tp-icon-button library="tp" name="keyboard-f1" label="F1 — Toggle editor toolbar" title="Toggle editor toolbar (F1)" data-geometry-control data-action="source-toolbar"></tp-icon-button><tp-icon-button name="refresh" label="Reset source" title="Reset source to the displayed construction" data-geometry-control data-action="source-reset"></tp-icon-button><tp-icon-button name="play" label="Play" title="Play — Apply construction source" data-geometry-control data-action="apply"></tp-icon-button></div></div><tp-code-editor language="text" line-numbers ${this.readonly ? "readonly" : ""}></tp-code-editor></dd></dl></tp-accordion><dialog class="tp-geometry-dialog" aria-label="Zoomed drawing"></dialog>`, this.canvasOnly) {
			let e = this.querySelector(".tp-geometry-source"), t = this.querySelector(".tp-geometry-view");
			e && t && t.before(e);
		}
		let t = this.querySelector(".tp-geometry-context");
		for (let e of [".tp-geometry-hint", ".tp-geometry-parameters"]) {
			let n = this.querySelector(e);
			n && t && t.append(n);
		}
		this.querySelector(".tp-geometry-dialog")?.addEventListener("close", () => this.restoreBoard());
		for (let e of this.querySelectorAll("[data-palette-tool]")) {
			let t = () => {
				e.getAttribute("aria-disabled") !== "true" && (this.chooseTool(e.dataset.paletteTool), this.querySelector("[data-tool-palette]")?.hide());
			};
			e.addEventListener("click", t), e.addEventListener("keydown", (e) => {
				(e.key === "Enter" || e.key === " ") && (e.preventDefault(), t());
			});
		}
		this.querySelector("[data-tool-palette]")?.addEventListener("tp-dropdown-toggle", this.constrainPalette), window.addEventListener("resize", this.constrainPalette), window.addEventListener("scroll", this.constrainPalette, !0), this.onkeydown = (e) => this.shortcut(e), this.canvasObserver?.disconnect();
		let n = this.querySelector(".tp-geometry-canvas");
		if (n && typeof ResizeObserver < "u" && (this.canvasObserver = new ResizeObserver(() => {
			let e = n.getBoundingClientRect();
			if (e.width <= 0 || e.height <= 0) return;
			let t = 900 * e.height / e.width;
			Math.abs(t - this.canvasHeight) < .01 || (this.canvasHeight = t, this.querySelector("svg[data-geometry-canvas]")?.setAttribute("viewBox", `0 0 900 ${t}`), this.draw());
		}), this.canvasObserver.observe(n)), this.readonly) for (let e of this.querySelectorAll("[data-tool]:not([data-tool=\"pan\"]), [data-action=\"example\"], [data-action=\"clear\"], [data-action=\"delete\"], [data-action=\"apply\"]")) e.disabled = !0;
		this.querySelector(".tp-geometry-parameters")?.toggleAttribute("hidden", this.readonly);
		let r = this.querySelector("tp-save-image [data-format=\"svg\"]");
		r && (r.textContent = "SVG (default)"), this.dataset.activeTool = this.tool, this.updateParameters(), this.syncSourceFileButtons(), this.addEventListener("tp-save-image-error", this.onExportError);
		for (let e of ["style", "color"]) this.querySelector(`[data-${e}-menu]`)?.addEventListener("tp-dropdown-toggle", () => {
			this.querySelector(`[data-action="${e}-menu"]`)?.setAttribute("aria-expanded", String(this.querySelector(`[data-${e}-menu]`)?.hasAttribute("open"))), this.syncButtonControls();
		});
		for (let e of this.querySelectorAll("[data-stroke], [data-color]")) e.addEventListener("keydown", (t) => {
			(t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.changeAppearance(e.dataset.stroke, e.dataset.color));
		});
		for (let e of this.querySelectorAll("[data-source-file]")) {
			let t = () => {
				e.getAttribute("aria-disabled") !== "true" && this.sourceFileAction(e.dataset.sourceFile);
			};
			e.addEventListener("click", t), e.addEventListener("keydown", (e) => {
				(e.key === "Enter" || e.key === " ") && (e.preventDefault(), t());
			});
		}
		this.onclick = (e) => {
			let t = e.target.closest("[data-stroke], [data-color]");
			if (t && this.contains(t)) {
				this.changeAppearance(t.dataset.stroke, t.dataset.color);
				return;
			}
			let n = e.target.closest("tp-button[data-geometry-control], tp-icon-button[data-geometry-control]");
			if (!n || n.disabled) return;
			n.dataset.tool && (!this.readonly || n.dataset.tool === "pan") && this.chooseTool(n.dataset.tool), n.dataset.object && this.selectObject(n.dataset.object);
			let r = n.dataset.action;
			if (n.dataset.animation && (this.activeAnimation = n.dataset.animation, this.animationStep = 0, this.draw()), r?.startsWith("animation-")) {
				let e = this.currentAnimation();
				if (e?.definition.kind === "animation") {
					let t = e.definition.steps.length;
					this.animationStep = r === "animation-start" ? 0 : r === "animation-end" ? t : Math.max(0, Math.min(t, this.animationStep + (r === "animation-next" ? 1 : -1))), this.querySelector("[data-inline-rename]")?.remove(), this.draw();
				}
			}
			if (r === "rename" && !this.readonly && this.selected) try {
				let e = this.querySelector("[data-object-name]")?.value.trim() ?? "";
				this.renameObject(this.selected, e);
			} catch (e) {
				this.report(String(e));
			}
			if (r === "hide-name" && !this.readonly && this.selected) {
				let e = this.selected, t = h(this.value), n = t.find((t) => t.id === e);
				n && (n.labelHidden ? delete n.labelHidden : n.labelHidden = !0, this.setConstruction(_(t)), this.selected = e, this.movingName = !1, this.draw());
			}
			if (r === "move-name" && !this.readonly && this.selected && (this.movingName = !this.movingName, this.tool = "move", this.updateTool(), this.draw(), this.querySelector("[data-geometry-canvas]")?.focus()), r === "source-view" && this.toggleSourceView(), r === "source-files" && this.querySelector("[data-source-menu]")?.toggle(), r === "source-toolbar") {
				let e = this.querySelector("tp-code-editor");
				e && (e.toolbar = !e.toolbar);
			}
			if (r === "source-reset" && this.querySelector("tp-code-editor")?.setValue(this.value), r === "palette" && this.querySelector("[data-tool-palette]")?.toggle(), r === "zoom" && this.toggleZoom(), (r === "style-menu" || r === "color-menu") && this.querySelector(r === "style-menu" ? "[data-style-menu]" : "[data-color-menu]")?.toggle(), (r === "in" || r === "out") && (this.scale = Math.max(3, Math.min(300, this.scale * (r === "in" ? 1.25 : .8))), this.draw()), r === "fit" && this.fitView(), r === "grid" && (this.grid = !this.grid), !this.readonly) try {
				r === "undo" && this.undo(), r === "redo" && this.redo(), r === "delete" && this.selected && this.removeObject(this.selected), r === "example" && (this.sourceSaveTarget = null, this.setConstruction(s), this.fitView()), r === "finish-polygon" && this.finishPolygon(), r === "clear" && (this.sourceSaveTarget = null, this.setConstruction("")), r === "apply" && (this.setConstruction(this.querySelector("tp-code-editor")?.getValue() ?? ""), this.fitView());
			} catch (e) {
				this.report(String(e)), this.dispatchEvent(new CustomEvent("tp-geometry-error", {
					bubbles: !0,
					detail: { message: String(e) }
				}));
			}
		};
		let o = this.querySelector("svg[data-geometry-canvas]");
		if (!o) return;
		o.addEventListener("pointerdown", (e) => {
			if (this.drag || this.pan || e.button > 1) return;
			this.suppressCanvasClick = !1;
			let t = e.target.closest("[data-id]")?.getAttribute("data-id");
			if (this.pointerObject = t ?? null, e.button === 1 || this.tool === "pan" || !t && this.tool === "move") {
				this.pan = {
					pointer: e.pointerId,
					start: this.canvasPoint(e),
					center: { ...this.center }
				}, this.suppressCanvasClick = !0, o.setPointerCapture?.(e.pointerId), o.focus({ preventScroll: !0 }), o.classList.add("is-panning"), e.preventDefault();
				return;
			}
			if (this.readonly || this.tool !== "move") return;
			let n = this.objects.find((e) => e.id === t);
			if (!n) return;
			let r = !!e.target.closest("[data-name-label]") || this.movingName && n.id === this.selected;
			if (this.selected = n.id, this.movingName = r, this.draw(!0), n.definition.kind !== "point" && n.definition.kind !== "on" && n.definition.kind !== "measure" && n.definition.kind !== "comment" && !r) return;
			let i = this.result.values.get(n.id), a = this.world(e);
			this.drag = {
				...r ? { grab: {
					x: this.namePosition(n).x - a.x,
					y: this.namePosition(n).y - a.y
				} } : (n.definition.kind === "measure" || n.definition.kind === "comment") && i?.kind === "comment" ? { grab: {
					x: i.point.x - a.x,
					y: i.point.y - a.y
				} } : {},
				label: r,
				id: n.id,
				before: this.value,
				pointer: e.pointerId
			}, o.setPointerCapture?.(e.pointerId), o.focus({ preventScroll: !0 }), e.preventDefault();
		}), o.addEventListener("pointermove", (e) => {
			if (this.pan && e.pointerId === this.pan.pointer) {
				let t = this.canvasPoint(e);
				this.center = {
					x: this.pan.center.x - (t.x - this.pan.start.x) / this.scale,
					y: this.pan.center.y + (t.y - this.pan.start.y) / this.scale
				}, this.draw();
				return;
			}
			if (this.drag && e.pointerId === this.drag.pointer) {
				let t = this.world(e);
				(this.drag.label ? this.moveName.bind(this) : this.movePoint.bind(this))(this.drag.id, {
					x: t.x + (this.drag.grab?.x ?? 0),
					y: t.y + (this.drag.grab?.y ?? 0)
				});
			}
		});
		let c = (e) => {
			if (this.pan && e.pointerId === this.pan.pointer) {
				let t = this.center.x === this.pan.center.x && this.center.y === this.pan.center.y;
				e.type === "pointercancel" && (this.center = this.pan.center), this.pan = null, o.classList.remove("is-panning"), this.draw(t);
				return;
			}
			if (!this.drag || e.pointerId !== this.drag.pointer) return;
			let t = this.drag.before;
			if (this.drag = null, e.type === "pointercancel") {
				this.restore(t);
				return;
			}
			t !== this.value && (this.undoStack.push(t), this.redoStack = [], this.syncSource(), this.changed(), this.draw());
		};
		o.addEventListener("dblclick", (e) => {
			if (this.readonly || this.tool !== "move" && this.tool !== "pan") return;
			let t = e.target.closest("[data-id]")?.getAttribute("data-id") ?? this.pointerObject;
			t && (e.preventDefault(), this.editObjectName(t, this.canvasPoint(e)));
		}), o.addEventListener("pointerup", c), o.addEventListener("pointercancel", c), o.addEventListener("click", (e) => {
			if (this.suppressCanvasClick) {
				this.suppressCanvasClick = !1;
				return;
			}
			if (this.readonly || this.tool === "move" || this.tool === "pan") return;
			let t = e.target.closest("[data-id]")?.getAttribute("data-id") ?? void 0;
			try {
				o.focus({ preventScroll: !0 }), this.useTool(t, this.world(e));
			} catch (e) {
				this.pending = [], this.polygonDraft = [], this.updateTool(), this.report(String(e));
			}
		}), o.addEventListener("wheel", (e) => {
			if (e.ctrlKey || e.metaKey || this.pan || this.drag) return;
			e.preventDefault();
			let t = o.getBoundingClientRect(), n = e.deltaX, r = e.deltaY;
			e.shiftKey && n === 0 && (n = r, r = 0);
			let i = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? t.width || 900 : 1, a = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? t.height || this.canvasHeight : 1, s = this.canvasPoint(e), c = this.canvasPoint({
				clientX: e.clientX + n * i,
				clientY: e.clientY + r * a
			});
			this.center.x += (c.x - s.x) / this.scale, this.center.y -= (c.y - s.y) / this.scale, this.draw();
		}, { passive: !1 }), o.addEventListener("keydown", (e) => {
			if (e.key === "F2" && this.selected && !this.readonly) {
				e.preventDefault(), this.editObjectName(this.selected);
				return;
			}
			if (e.key === "Enter" && this.tool === "polygon") {
				e.preventDefault(), this.finishPolygon();
				return;
			}
			if (e.key === "Escape") {
				this.pending = [], this.polygonDraft = [], this.tool = "move", this.updateTool();
				return;
			}
			if ((this.tool === "pan" || this.canvasOnly && (!this.selected || this.readonly)) && [
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown"
			].includes(e.key)) {
				e.preventDefault();
				let t = (e.shiftKey ? 8 : 40) / this.scale;
				this.center.x += e.key === "ArrowRight" ? t : e.key === "ArrowLeft" ? -t : 0, this.center.y += e.key === "ArrowUp" ? t : e.key === "ArrowDown" ? -t : 0, this.draw();
				return;
			}
			if (this.readonly || !this.selected || ![
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown"
			].includes(e.key)) return;
			let t = this.objects.find((e) => e.id === this.selected), n = this.result.values.get(this.selected), r = this.movingName && t ? {
				kind: "point",
				point: this.namePosition(t)
			} : n;
			if (r?.kind !== "point" && !(r?.kind === "comment" && ["measure", "comment"].includes(t?.definition.kind ?? ""))) return;
			e.preventDefault();
			let i = this.value, a = e.shiftKey ? .02 : .2;
			(this.movingName ? this.moveName.bind(this) : this.movePoint.bind(this))(this.selected, {
				x: r.point.x + (e.key === "ArrowRight" ? a : e.key === "ArrowLeft" ? -a : 0),
				y: r.point.y + (e.key === "ArrowUp" ? a : e.key === "ArrowDown" ? -a : 0)
			}), i !== this.value && (this.undoStack.push(i), this.redoStack = [], this.syncSource(), this.changed(), this.draw());
		});
	}
	syncButtonControls() {
		queueMicrotask(() => {
			if (this.isConnected) for (let e of this.querySelectorAll("tp-button[data-geometry-control], tp-icon-button[data-geometry-control]")) {
				let t = e.querySelector(":scope > button");
				if (!t) continue;
				t.tabIndex = t.disabled ? -1 : 0;
				for (let n of [
					"aria-keyshortcuts",
					"aria-pressed",
					"aria-label",
					"aria-haspopup",
					"aria-expanded"
				]) {
					let r = e.getAttribute(n);
					n === "aria-label" && e.tagName === "TP-ICON-BUTTON" || (r === null ? t.removeAttribute(n) : t.setAttribute(n, r));
				}
				let n = e.getAttribute("aria-pressed") === "true" ? "brand" : "neutral";
				e.variant !== n && (e.variant = n);
			}
		});
	}
	updateParameters() {
		let e = {
			radius: ["circle", "fixedSegment"].includes(this.tool),
			start: ["arc", "sector"].includes(this.tool),
			end: ["arc", "sector"].includes(this.tool),
			comment: this.tool === "comment",
			ratio: this.tool === "homothety",
			rotation: this.tool === "rotation",
			sides: this.tool === "regularPolygon"
		};
		for (let t of this.querySelectorAll(".tp-geometry-parameters [data-field]")) t.hidden = this.canvasOnly && !e[t.dataset.field ?? ""];
		let t = this.querySelector("[data-transform-mode]");
		t && (t.hidden = this.canvasOnly && ![
			"axialSymmetry",
			"centralSymmetry",
			"homothety",
			"rotation",
			"translation"
		].includes(this.tool));
		let n = this.querySelector("[data-action=\"finish-polygon\"]");
		n && (n.hidden = this.canvasOnly && this.tool !== "polygon");
		let r = this.querySelector(".tp-geometry-parameters > span");
		r && (r.hidden = this.canvasOnly && !["arc", "sector"].includes(this.tool));
	}
	updateTool() {
		for (let e of this.querySelectorAll("[data-tool]")) {
			let t = e.dataset.tool === this.tool;
			e.setAttribute("aria-pressed", String(t)), e.toggleAttribute("outlined", !t);
		}
		this.dataset.activeTool = this.tool, this.updateParameters();
		let e = this.querySelector(".tp-geometry-hint");
		e?.setAttribute("heading", {
			...S,
			...w
		}[this.tool]), e?.setAttribute("icon", this.tool);
		let t = this.querySelector("[data-hint]");
		t && (t.textContent = E[this.tool]), this.report(this.pending.length ? `Selected: ${this.pending.join(", ")}. Select the next object.` : ""), this.draw();
	}
	renameObject(e, t) {
		if (this.readonly) return;
		let n = g(this.objects, e, t);
		this.activeAnimation === e && (this.activeAnimation = t), this.setConstruction(_(n)), this.selected = t, this.draw();
	}
	editObjectName(e, t) {
		if (this.readonly || !this.objects.some((t) => t.id === e)) return;
		let n = this.querySelector(".tp-geometry-canvas");
		if (!n) return;
		this.querySelector("[data-inline-rename]")?.remove(), this.selected = e, this.draw();
		let r = document.createElement("div");
		r.setAttribute("data-inline-rename", "");
		let i = document.createElement("tp-textfield");
		i.label = "Object name", i.value = e;
		let a = document.createElement("small");
		a.textContent = "Enter to rename · Escape to cancel";
		let o = document.createElement("span");
		o.setAttribute("role", "alert"), r.append(i, a, o);
		let s = this.objects.find((t) => t.id === e);
		if (!s) return;
		let c = this.namePosition(s), l = t ?? {
			x: 450 + (c.x - this.center.x) * this.scale,
			y: 280 - (c.y - this.center.y) * this.scale
		};
		r.style.setProperty("--rename-left", `${Math.max(0, Math.min(100, l.x / 9))}%`), r.style.top = `${Math.max(15, Math.min(85, l.y / this.canvasHeight * 100))}%`;
		let u = () => {
			r.remove(), this.querySelector("[data-geometry-canvas]")?.focus({ preventScroll: !0 });
		};
		r.addEventListener("keydown", (t) => {
			if (t.stopPropagation(), t.key === "Escape" && (t.preventDefault(), u()), t.key === "Enter") {
				t.preventDefault();
				try {
					this.renameObject(e, i.value.trim()), u();
				} catch (e) {
					o.textContent = e instanceof Error ? e.message : String(e), i.focus();
				}
			}
		}), r.addEventListener("focusout", () => {
			queueMicrotask(() => {
				r.isConnected && !r.contains(document.activeElement) && r.remove();
			});
		}), n.append(r), i.focus({ preventScroll: !0 }), i.select();
	}
	selectObject(e) {
		if (this.objects.find((t) => t.id === e)?.definition.kind === "animation") {
			this.activeAnimation = e, this.animationStep = 0, this.selected = e, this.draw();
			return;
		}
		if (this.tool === "move" || this.tool === "pan" || this.readonly) {
			this.selected = e, this.movingName = !1, this.draw(), this.querySelector("svg[data-geometry-canvas]")?.focus();
			return;
		}
		let t = this.result.values.get(e), n = t?.kind === "point" ? t.point : t?.kind === "circle" || t?.kind === "arc" || t?.kind === "sector" ? {
			x: t.center.x + t.radius,
			y: t.center.y
		} : t && p(t) ? t.first : {
			x: 0,
			y: 0
		};
		try {
			this.useTool(e, n);
		} catch (e) {
			this.pending = [], this.polygonDraft = [], this.updateTool(), this.report(String(e));
		}
	}
	finishPolygon() {
		if (this.readonly || !this.builtIn || this.tool !== "polygon" || this.pending.length < 3) return;
		let e = _(this.polygonDraft);
		this.appendConstruction(`${e}\npolygon ${this.name("poly")} = polygon(${this.pending.join(", ")})`), this.updateTool();
	}
	polygonClick(e, t) {
		if (!this.builtIn || this.readonly) return;
		let n = Number(this.field("sides"));
		if (this.tool === "regularPolygon" && (!Number.isInteger(n) || n < 3 || n > 360)) throw Error("Sides must be an integer from 3 to 360.");
		if (e && this.pending.includes(e)) {
			this.tool === "polygon" && e === this.pending[0] && this.pending.length >= 3 ? this.finishPolygon() : this.report("Select a different vertex; closing needs at least three vertices.");
			return;
		}
		if (e) {
			if (this.result.values.get(e)?.kind !== "point") throw Error("Select a point or click empty space.");
		} else e = this.pointName(), this.polygonDraft.push({
			id: e,
			hidden: !1,
			definition: {
				kind: "point",
				x: t.x,
				y: t.y
			}
		});
		if (this.pending.push(e), this.tool === "regularPolygon" && this.pending.length === 2) {
			let e = _(this.polygonDraft);
			this.appendConstruction(`${e}\npolygon ${this.name("poly")} = regularPolygon(${this.pending.join(", ")}, sides=${n})`);
		}
		this.updateTool();
	}
	useTool(e, t) {
		if (this.tool === "polygon" || this.tool === "regularPolygon") {
			this.polygonClick(e, t);
			return;
		}
		let n = e ? this.result.values.get(e) : null;
		if (this.tool === "point") {
			this.appendConstruction(`point ${this.pointName()} = (${t.x}, ${t.y})`);
			return;
		}
		if (this.tool === "comment") {
			this.appendConstruction(`comment ${this.name("note")} = comment(${n?.kind === "point" ? e : `(${t.x}, ${t.y})`}, ${JSON.stringify(this.field("comment"))})`);
			return;
		}
		if (!e || !n) throw Error("Select an existing, defined object.");
		if (o.includes(this.tool)) {
			if (!this.builtIn || this.readonly) return;
			if (!this.pending.length) {
				this.pending = [e], this.updateTool();
				return;
			}
			let t = this.objects.find((e) => e.id === this.pending[0]), n = t && this.result.values.get(t.id);
			if (!t || !n) throw Error("Select a defined object first.");
			let r = this.tool === "homothety" ? `, ratio=${this.field("ratio")}` : this.tool === "rotation" ? `, angle=${this.field("rotation")}deg` : "", i = `${t.stroke ? ` style=${t.stroke}` : ""}${t.color ? ` color=${t.color}` : ""}`, a = h(`${this.value}\n${n.kind} ${this.name(`${t.id}_image`)} = ${this.tool}(${t.id}, ${e}${r})${i}`), o = a[a.length - 1];
			if (o?.definition.kind !== "transform") throw Error("Invalid transformation.");
			if (this.querySelector("[data-transform-mode]")?.value === "2") {
				let e = structuredClone(this.objects), n = e.find((e) => e.id === t.id);
				if (!n) return;
				n.definition = {
					...o.definition,
					object: n.definition
				}, this.setConstruction(_(e));
			} else this.setConstruction(_(a));
			this.updateTool();
			return;
		}
		if (this.tool === "length" || this.tool === "area" || this.tool === "angle") {
			if (this.tool === "angle" && p(n)) {
				if (this.pending.length && !p(this.result.values.get(this.pending[0] ?? "") ?? {
					kind: "point",
					point: t
				})) throw Error("Select another point, or restart with two sides.");
				if (this.pending.includes(e)) throw Error("Select two different sides.");
				if (this.pending.push(e), this.pending.length === 1) {
					this.updateTool();
					return;
				}
				this.appendConstruction(`comment ${this.name("measure")} = angle(${this.pending.join(", ")})`), this.updateTool();
				return;
			}
			if (this.tool === "angle" && this.pending.some((e) => this.result.values.get(e)?.kind !== "point")) throw Error("Select another side.");
			let r = this.tool === "angle" || this.tool === "length" && (this.pending.length > 0 || n.kind === "point");
			if (r) {
				if (n.kind !== "point") throw Error("Select a point.");
				if (this.pending.includes(e)) throw Error("Select a different point.");
				if (this.pending.push(e), this.pending.length < (this.tool === "angle" ? 3 : 2)) {
					this.updateTool();
					return;
				}
			}
			this.appendConstruction(`comment ${this.name("measure")} = ${this.tool}(${r ? this.pending.join(", ") : e})`), this.updateTool();
			return;
		}
		if (this.tool === "on") {
			let r = m(n, t);
			this.appendConstruction(`point ${this.pointName()} = on(${e}, ${p(n) ? `t=${r}` : `angle=${r * 180 / Math.PI}deg`})`);
			return;
		}
		if (this.tool === "arc" || this.tool === "sector") {
			if (n.kind !== "circle") throw Error("Select a circle.");
			let t = h(`${this.value}\n${this.tool} ${this.name(this.tool)} = ${this.tool}(${e}, start=${this.field("start")}deg, end=${this.field("end")}deg)`), r = t.find((t) => t.id === e);
			r && this.tool === "arc" && (r.hidden = !0), this.setConstruction(_(t));
			return;
		}
		if (this.tool === "circle") {
			if (n.kind !== "point") throw Error("Select the centre point.");
			this.appendConstruction(`circle ${this.name("c")} = circle(${e}, ${this.field("radius")})`);
			return;
		}
		if (this.tool === "midpoint" || this.tool === "perpendicularBisector") {
			if (n.kind !== "segment") throw Error("Select a segment.");
			this.appendConstruction(`${this.tool === "midpoint" ? "point" : "line"} ${this.name(this.tool === "midpoint" ? "M" : "m")} = ${this.tool}(${e})`);
			return;
		}
		if (this.tool === "parallel" || this.tool === "perpendicular" || this.tool === "tangent") {
			if (!this.pending.length && n.kind !== "point") throw Error("Select a point first.");
			if (this.pending.length && (this.tool === "tangent" ? n.kind !== "circle" : !p(n))) throw Error(this.tool === "tangent" ? "Select a circle." : "Select a linear support.");
		} else if (this.tool === "intersection") {
			if (!p(n) && n.kind !== "circle" && n.kind !== "arc") throw Error("Select a line, segment, ray, vector, circle or arc.");
		} else if (n.kind !== "point") throw Error("Select a point.");
		if (this.pending.includes(e)) throw Error("Select two different objects.");
		if (this.pending.push(e), this.pending.length < (this.tool === "bisector" ? 3 : 2)) {
			this.updateTool();
			return;
		}
		let [r = "", i = "", a = ""] = this.pending;
		if (this.pending = [], this.polygonDraft = [], this.tool === "line" || this.tool === "segment" || this.tool === "fixedSegment" || this.tool === "ray" || this.tool === "vector") {
			let e = this.tool === "fixedSegment" ? "segment" : this.tool;
			this.appendConstruction(`${e} ${this.name(e === "line" ? "d" : e === "vector" ? "v" : e === "ray" ? "r" : "s")} = ${e}(${r}, ${i}${this.tool === "fixedSegment" ? `, length=${this.field("radius")}` : ""})`);
		} else if (this.tool === "parallel" || this.tool === "perpendicular") this.appendConstruction(`line ${this.name("d")} = ${this.tool}(${r}, ${i})`);
		else if (this.tool === "bisector") this.appendConstruction(`line ${this.name("b")} = bisector(${r}, ${i}, ${a})`);
		else if (this.tool === "tangent") {
			let e = h(`${this.value}\nline ${this.name("t")} = tangent(${r}, ${i}, branch=0)`), t = u(e).errors.get(this.name("t"));
			if (t) throw Error(t);
			let n = this.result.values.get(r), a = this.result.values.get(i);
			if (n?.kind === "point" && a?.kind === "circle" && l(n.point, a.center) > a.radius + 1e-9) {
				let t = 1;
				for (; e.some((e) => e.id === `t${t}`);) t++;
				e.push({
					id: `t${t}`,
					hidden: !1,
					definition: {
						kind: "tangent",
						point: r,
						circle: i,
						branch: 1
					}
				});
			}
			this.setConstruction(_(e));
		} else if (this.tool === "through") this.appendConstruction(`circle ${this.name("c")} = circle(${r}, through=${i})`);
		else {
			let e = this.result.values.get(r), t = this.result.values.get(i);
			if (!e || !t) return;
			let n = f(e, t), a = n.map((e, t) => e && !(t === 1 && n[0] && l(e, n[0]) < 1e-9) ? t : -1).filter((e) => e >= 0);
			if (!a.length) throw Error("These objects have no distinct intersection.");
			let o = [...this.objects];
			for (let e of a) {
				let t = 1, n = "I";
				for (; o.some((e) => e.id === n);) n = `I${t++}`;
				o.push({
					id: n,
					hidden: !1,
					definition: {
						kind: "intersection",
						first: r,
						second: i,
						branch: e
					}
				});
			}
			this.setConstruction(_(o));
		}
		this.updateTool();
	}
	canvasPoint(e) {
		let t = this.querySelector("svg[data-geometry-canvas]"), n = t?.getScreenCTM?.();
		if (n && typeof DOMPoint < "u") {
			let t = new DOMPoint(e.clientX, e.clientY).matrixTransform(n.inverse());
			return {
				x: t.x,
				y: t.y
			};
		}
		let r = t?.getBoundingClientRect();
		return {
			x: (e.clientX - (r?.left ?? 0)) * 900 / (r?.width || 900),
			y: (e.clientY - (r?.top ?? 0)) * this.canvasHeight / (r?.height || this.canvasHeight)
		};
	}
	world(e) {
		let t = this.canvasPoint(e);
		return {
			x: (t.x - 450) / this.scale + this.center.x,
			y: (280 - t.y) / this.scale + this.center.y
		};
	}
	namePosition(e, t = !0) {
		let n = this.result.values.get(e.id), r = {
			x: 0,
			y: 0
		};
		return n?.kind === "point" || n?.kind === "comment" ? r = n.point : n && p(n) ? r = {
			x: (n.first.x + n.second.x) / 2,
			y: (n.first.y + n.second.y) / 2
		} : n?.kind === "polygon" ? r = {
			x: n.vertices.reduce((e, t) => e + t.x, 0) / n.vertices.length,
			y: n.vertices.reduce((e, t) => e + t.y, 0) / n.vertices.length
		} : n?.kind === "arc" || n?.kind === "sector" ? r = {
			x: n.center.x + n.radius * Math.cos(n.start + n.sweep / 2),
			y: n.center.y + n.radius * Math.sin(n.start + n.sweep / 2)
		} : n && "center" in n && (r = {
			x: n.center.x + n.radius,
			y: n.center.y
		}), t ? {
			x: r.x + (e.labelOffset?.x ?? 0) + 11 / this.scale,
			y: r.y + (e.labelOffset?.y ?? 0) + 10 / this.scale
		} : r;
	}
	moveName(e, t) {
		let n = this.objects.find((t) => t.id === e);
		if (!n) return;
		let r = this.namePosition(n, !1);
		n.labelOffset = {
			x: t.x - r.x - 11 / this.scale,
			y: t.y - r.y - 10 / this.scale
		}, this.recompute();
	}
	movePoint(e, t) {
		let n = this.objects.find((t) => t.id === e)?.definition;
		if (n) {
			if (n.kind === "point") n.x = t.x, n.y = t.y;
			else if (n.kind === "measure" || n.kind === "comment") {
				let r = this.result.values.get(e);
				if (r?.kind !== "comment") return;
				let i = (n.offset?.x ?? 0) + t.x - r.point.x, a = (n.offset?.y ?? 0) + t.y - r.point.y;
				i || a ? n.offset = {
					x: i,
					y: a
				} : delete n.offset;
			} else if (n.kind === "on") {
				let e = this.result.values.get(n.object);
				e && (n.parameter = m(e, t));
			}
			this.recompute();
		}
	}
	fitView() {
		let e = [];
		for (let t of this.objects) {
			if (t.hidden) continue;
			let n = this.result.values.get(t.id);
			if (n && ((n.kind === "point" || n.kind === "comment") && e.push(n.point), p(n) && e.push(n.first, n.second), n.kind === "sector" && e.push(n.center), n.kind === "polygon" && e.push(...n.vertices), n.kind === "circle" && e.push({
				x: n.center.x - n.radius,
				y: n.center.y - n.radius
			}, {
				x: n.center.x + n.radius,
				y: n.center.y + n.radius
			}), n.kind === "arc" || n.kind === "sector")) for (let t = 0; t <= 32; t++) e.push({
				x: n.center.x + n.radius * Math.cos(n.start + n.sweep * t / 32),
				y: n.center.y + n.radius * Math.sin(n.start + n.sweep * t / 32)
			});
		}
		if (e.length) {
			let t = e.map((e) => e.x), n = e.map((e) => e.y), r = Math.min(...t), i = Math.max(...t), a = Math.min(...n), o = Math.max(...n);
			this.center = {
				x: (r + i) / 2,
				y: (a + o) / 2
			}, this.scale = Math.max(3, Math.min(70, 740 / Math.max(1, i - r), 430 / Math.max(1, o - a)));
		} else this.scale = 36, this.center = {
			x: 0,
			y: 0
		};
		this.draw();
	}
	currentAnimation() {
		let e = this.objects.filter((e) => e.definition.kind === "animation"), t = e.find((e) => e.id === this.activeAnimation) ?? e[0];
		return this.activeAnimation = t?.id ?? null, t;
	}
	syncAnimationControls() {
		let e = this.currentAnimation(), t = e?.definition.kind === "animation" ? e.definition.steps : [];
		this.animationStep = Math.min(this.animationStep, t.length);
		let n = this.querySelector("[data-animation-controls]");
		if (n) {
			n.hidden = !e;
			let r = this.objects.filter((e) => e.definition.kind === "animation").map((e) => e.id), i = JSON.stringify(r);
			n.dataset.names !== i && (n.dataset.names = i, n.innerHTML = `${r.map((e) => `<tp-button outlined data-geometry-control data-animation="${e}">${e}</tp-button>`).join("")}<tp-icon-button name="chevron-left-first" label="Start animation" title="Start animation" data-geometry-control data-action="animation-start"></tp-icon-button><tp-icon-button name="chevron-left" label="Previous animation step" title="Previous animation step" data-geometry-control data-action="animation-previous"></tp-icon-button><span data-animation-status role="status" aria-live="polite"></span><tp-icon-button name="chevron-right" label="Next animation step" title="Next animation step" data-geometry-control data-action="animation-next"></tp-icon-button><tp-icon-button name="chevron-right-last" label="Show complete animation" title="Show complete animation" data-geometry-control data-action="animation-end"></tp-icon-button>`);
			for (let t of n.querySelectorAll("[data-animation]")) t.setAttribute("aria-pressed", String(t.dataset.animation === e?.id)), t.toggleAttribute("outlined", t.dataset.animation !== e?.id);
			let a = n.querySelector("[data-animation-status]");
			a && (a.textContent = `${this.animationStep} / ${t.length}`);
			for (let e of [
				"start",
				"previous",
				"next",
				"end"
			]) {
				let r = n.querySelector(`[data-action="animation-${e}"]`);
				r && (r.disabled = e === "start" || e === "previous" ? this.animationStep === 0 : this.animationStep === t.length);
			}
		}
		return new Set(t.slice(this.animationStep).flat());
	}
	draw(e = !1) {
		let t = this.syncAnimationControls(), n = this.querySelector("[data-drawing]");
		if (!n) return;
		let r = (e) => 450 + (e - this.center.x) * this.scale, i = (e) => 280 - (e - this.center.y) * this.scale, a = [], o = [];
		for (let e of this.objects) {
			let n = this.result.values.get(e.id);
			if (!n || e.hidden || t.has(e.id)) continue;
			let s = `data-id="${e.id}" class="tp-geometry-shape ${e.color ? `has-color tp-${e.color}` : ""} stroke-${e.stroke ?? "solid"} ${this.selected === e.id || this.pending.includes(e.id) ? "is-selected" : ""}"`, c = this.namePosition(e), u = e.labelHidden ? "" : `<text data-name-label x="${r(c.x)}" y="${i(c.y)}">${e.id}</text>`, d = "";
			if (n.kind === "point") {
				o.push(`<g ${s}><circle class="point-hit" cx="${r(n.point.x)}" cy="${i(n.point.y)}" r="13"/><circle class="point ${e.definition.kind === "point" ? "free" : "dependent"}" cx="${r(n.point.x)}" cy="${i(n.point.y)}" r="5"/>${u}<title>${e.id} · ${e.definition.kind}</title></g>`);
				continue;
			}
			if (p(n)) {
				let e = l(n.first, n.second), t = n.kind === "line" || n.kind === "ray" ? (2 * Math.max(900, this.canvasHeight) / this.scale + l(n.first, this.center)) / e : 0, a = n.second.x - n.first.x, o = n.second.y - n.first.y;
				if (d = `<line x1="${r(n.first.x - a * (n.kind === "line" ? t : 0))}" y1="${i(n.first.y - o * (n.kind === "line" ? t : 0))}" x2="${r(n.second.x + a * t)}" y2="${i(n.second.y + o * t)}"/>`, n.kind === "vector") {
					let t = a / e, s = -o / e, c = r(n.second.x), l = i(n.second.y);
					d += `<path d="M ${c - 12 * t + 5 * s} ${l - 12 * s - 5 * t} L ${c} ${l} L ${c - 12 * t - 5 * s} ${l - 12 * s + 5 * t}"/>`;
				}
			} else if (n.kind === "polygon") d = `<polygon points="${n.vertices.map((e) => `${r(e.x)},${i(e.y)}`).join(" ")}"/>`;
			else if (n.kind === "comment") {
				if (n.angleMark) {
					let t = n.angleMark, a = t.right ? 16 : 30, c = (e, n) => ({
						x: r(t.vertex.x) + Math.cos(e) * n,
						y: i(t.vertex.y) - Math.sin(e) * n
					}), l = c(t.start, a), d = c(t.start + t.sweep, a), f = {
						x: l.x + d.x - r(t.vertex.x),
						y: l.y + d.y - i(t.vertex.y)
					}, p = t.right ? `M ${l.x} ${l.y} L ${f.x} ${f.y} L ${d.x} ${d.y}` : `M ${l.x} ${l.y} A ${a} ${a} 0 0 ${t.sweep > 0 ? 0 : 1} ${d.x} ${d.y}`, m = c(t.start + t.sweep / 2, 46);
					o.push(`<g ${s}><g class="shape-hit"><path d="${p}"/></g><g class="shape-ink"><path data-angle-mark="${t.right ? "right" : "arc"}" d="${p}"/></g>${t.right ? "" : `<text text-anchor="middle" dominant-baseline="middle" x="${m.x + (n.point.x - t.vertex.x) * this.scale}" y="${m.y - (n.point.y - t.vertex.y) * this.scale}">${x(n.text)}</text>`}${e.labelOffset || this.movingName && this.selected === e.id ? u : ""}<title>${e.id}${t.right ? " · Right angle" : ""}</title></g>`);
					continue;
				}
				o.push(`<g ${s}><text x="${r(n.point.x) + 12}" y="${i(n.point.y) + 24}">${x(n.text)}</text>${e.labelOffset || this.movingName && this.selected === e.id ? u : ""}<title>${e.id}</title></g>`);
				continue;
			} else if (n.kind === "circle") d = `<circle cx="${r(n.center.x)}" cy="${i(n.center.y)}" r="${n.radius * this.scale}"/>`;
			else if (n.kind === "arc" || n.kind === "sector") {
				let e = {
					x: n.center.x + n.radius * Math.cos(n.start),
					y: n.center.y + n.radius * Math.sin(n.start)
				}, t = {
					x: n.center.x + n.radius * Math.cos(n.start + n.sweep),
					y: n.center.y + n.radius * Math.sin(n.start + n.sweep)
				};
				d = `<path d="${n.kind === "sector" ? `M ${r(n.center.x)} ${i(n.center.y)} L` : "M"} ${r(e.x)} ${i(e.y)} A ${n.radius * this.scale} ${n.radius * this.scale} 0 ${+(Math.abs(n.sweep) > Math.PI)} ${n.sweep > 0 ? 0 : 1} ${r(t.x)} ${i(t.y)}${n.kind === "sector" ? " Z" : ""}"/>`;
			}
			a.push(`<g ${s}><g class="shape-hit">${d}</g><g class="shape-ink ${n.kind}">${d}</g>${u}<title>${e.id}</title></g>`);
		}
		let s = this.pending.map((e) => {
			let t = this.polygonDraft.find((t) => t.id === e)?.definition, n = this.result.values.get(e);
			return t?.kind === "point" ? t : n?.kind === "point" ? n.point : null;
		}).filter((e) => e !== null), c = this.tool === "polygon" || this.tool === "regularPolygon" ? `<g data-polygon-preview><polyline class="tp-geometry-preview" points="${s.map((e) => `${r(e.x)},${i(e.y)}`).join(" ")}"/>${this.polygonDraft.map((e) => {
			let t = e.definition;
			return t.kind === "point" ? `<g data-id="${e.id}" class="tp-geometry-shape"><circle class="point-hit" cx="${r(t.x)}" cy="${i(t.y)}" r="13"/><circle class="point" cx="${r(t.x)}" cy="${i(t.y)}" r="5"/><text x="${r(t.x) + 11}" y="${i(t.y) - 10}">${e.id}</text></g>` : "";
		}).join("")}</g>` : "";
		if (e) for (let e of n.querySelectorAll("[data-id]")) e.classList.toggle("is-selected", e.dataset.id === this.selected || this.pending.includes(e.dataset.id ?? ""));
		else n.innerHTML = `${a.join("")}${o.join("")}${c}`;
		let u = this.querySelector("[data-action=\"finish-polygon\"]");
		u && (u.disabled = this.readonly || this.tool !== "polygon" || this.pending.length < 3);
		let d = this.querySelector("[data-grid]");
		if (d) {
			let e = this.scale * 10 ** Math.max(0, Math.ceil(Math.log10(18 / this.scale))), t = [];
			if (this.grid) {
				for (let n = (r(0) % e + e) % e; n <= 900; n += e) t.push(`M ${n} 0 V ${this.canvasHeight}`);
				for (let n = (i(0) % e + e) % e; n <= this.canvasHeight; n += e) t.push(`M 0 ${n} H 900`);
			}
			d.innerHTML = t.length ? `<path d="${t.join(" ")}"/>` : "";
		}
		this.querySelector("[data-action=\"grid\"]")?.setAttribute("aria-pressed", String(this.grid)), this.querySelector("[data-geometry-canvas]")?.classList.toggle("pan-mode", this.tool === "pan");
		let f = this.querySelector("[data-object-name]");
		f && (!f.contains(document.activeElement) && document.activeElement !== f && (f.value = this.selected ?? ""), f.disabled = this.readonly || !this.selected);
		for (let e of [
			"rename",
			"move-name",
			"hide-name"
		]) {
			let t = this.querySelector(`[data-action="${e}"]`);
			t && (t.disabled = this.readonly || !this.selected || e !== "rename" && this.objects.find((e) => e.id === this.selected)?.definition.kind === "animation");
		}
		this.querySelector("[data-action=\"move-name\"]")?.setAttribute("aria-pressed", String(this.movingName)), this.querySelector("[data-action=\"move-name\"]")?.toggleAttribute("outlined", !this.movingName);
		let m = this.querySelector("[data-objects]");
		if (m) {
			let e = this.objects.map((e) => `<tp-button type="button" outlined data-geometry-control data-object="${e.id}" aria-pressed="${this.selected === e.id}" title="${x(this.result.errors.get(e.id) ?? e.definition.kind)}"><b>${e.id}</b><span class="object-kind">${this.result.errors.has(e.id) ? "Undefined" : e.definition.kind}${e.hidden ? " · hidden" : ""}${e.labelHidden ? " · name hidden" : ""}</span></tp-button>`).join("") || "<p>Place your first point.</p>";
			e !== this.objectListMarkup && (m.innerHTML = e, this.objectListMarkup = e);
		}
		let h = this.objects.find((e) => e.id === this.selected), g = this.querySelector("[data-action=\"hide-name\"]");
		g?.setAttribute("aria-pressed", String(!!h?.labelHidden)), g?.toggleAttribute("outlined", !h?.labelHidden);
		let _ = this.querySelector("[data-action=\"move-name\"]");
		_ && (_.disabled = this.readonly || !h || !!h.labelHidden || h.definition.kind === "animation");
		for (let e of ["style", "color"]) {
			let t = this.querySelector(`[data-action="${e}-menu"]`);
			if (t) {
				t.disabled = this.readonly || !h || h.definition.kind === "animation";
				let n = t.querySelector(`[data-${e}-label]`);
				n && (n.textContent = e === "style" ? `Style · ${h?.hidden ? "hidden" : h?.stroke ?? "solid"}` : `Color · ${h?.color ?? "automatic"}`), t.setAttribute("aria-expanded", String(this.querySelector(`[data-${e}-menu]`)?.hasAttribute("open") ?? !1));
			}
		}
		let v = this.querySelector("[data-appearance-label]");
		v && (v.textContent = h ? `Appearance of ${h.id}` : "Select an object in Move mode to change its appearance."), this.syncButtonControls();
		for (let e of [
			"undo",
			"redo",
			"delete"
		]) {
			let t = this.querySelector(`[data-action="${e}"]`);
			t && (t.disabled = this.readonly || (e === "undo" ? !this.undoStack.length : e === "redo" ? !this.redoStack.length : !this.selected));
		}
		this.result.errors.size ? this.report([...this.result.errors].map(([e, t]) => `${e}: ${t}`).join(" ")) : this.pending.length || this.report("");
	}
};
customElements.get("tp-graph-geometry") || customElements.define("tp-graph-geometry", D);
//#endregion
export { D as t };

//# sourceMappingURL=graph-geometry.js.map