import { t as e } from "./base.js";
import "./accordion.js";
import "../components/textfield/textfield.js";
import "./button-group.js";
import "./dropdown.js";
import "./code-editor.js";
import "./callout.js";
import "./radio-list.js";
import "./save-image.js";
import { GEOMETRY_COLORS as t, GEOMETRY_STYLES as n, GEOMETRY_TRANSFORMATIONS as r, MEDIATRIX_CONSTRUCTION as i, dependencies as a, distance as o, evaluateGeometry as s, intersections as c, isLinear as l, parameterAt as u, parseGeometry as d, serializeGeometry as f } from "../components/graph-geometry/geometry.js";
//#region src/components/graph-geometry/graph-geometry.css?inline
var p = "tp-graph-geometry{color:var(--tp-text-body,CanvasText);border:1px solid var(--tp-neutral-stroke-soft,#cdd9dc);background:var(--tp-paper-color,Canvas);border-radius:12px;font-family:system-ui,sans-serif;display:block;overflow:hidden}.tp-geometry-header{border-bottom:1px solid var(--tp-neutral-stroke-soft,#dbe4e6);justify-content:space-between;align-items:center;gap:16px;padding:18px;display:flex}.tp-geometry-header strong{font-size:1.25rem;display:block}.tp-geometry-header span{opacity:.75;font-size:.85rem}.tp-geometry-tools{flex-wrap:wrap;gap:5px;padding:12px 16px;display:flex}.tp-geometry-parameters{flex-wrap:wrap;align-items:center;gap:12px;padding:0 16px;display:flex}.tp-geometry-parameters[hidden]{display:none}.tp-geometry-parameters tp-textfield{width:160px}.tp-geometry-parameters span{font-size:.8rem}.tp-geometry-hint{margin:12px 16px;font-size:.85rem}.tp-geometry-workspace{border-block:1px solid var(--tp-neutral-stroke-soft,#dbe4e6);grid-template-columns:minmax(0,1fr) 220px;display:grid}.tp-geometry-board{background:var(--tp-background-color,Canvas);min-width:0}.tp-geometry-board svg{touch-action:none;width:100%;height:auto;display:block}.tp-geometry-view{flex-wrap:wrap;align-items:center;gap:5px;padding:8px;display:flex}.tp-geometry-workspace aside{border-left:1px solid var(--tp-neutral-stroke-soft,#dbe4e6);padding:12px}.tp-geometry-workspace h3{margin:0 0 12px;font-size:.85rem}.tp-geometry-workspace aside p{opacity:.8;font-size:.8rem;line-height:1.5}tp-graph-geometry [data-objects]{max-height:330px;margin-bottom:10px;overflow:auto}tp-graph-geometry [data-objects] tp-button{text-align:left;justify-content:space-between;gap:8px;width:100%;margin-bottom:5px;display:flex}tp-graph-geometry [data-objects] .object-kind{font-size:.75rem}.tp-geometry-shape{cursor:pointer}.tp-geometry-shape .shape-hit{fill:none;stroke:#0000;stroke-width:15px}.tp-geometry-shape .shape-ink{fill:none;stroke:var(--tp-info-text-colorful,#447a94);stroke-width:2px;pointer-events:none}.tp-geometry-shape .line{stroke:var(--tp-warning-text-colorful,#ab573b)}.tp-geometry-shape .segment{stroke:var(--tp-text-body,CanvasText)}.tp-geometry-shape .arc{stroke:var(--tp-success-text-colorful,#248273)}.tp-geometry-shape.is-selected .shape-ink{stroke:#c96523;stroke-width:3px}.tp-geometry-shape .point-hit{fill:#0000}.tp-geometry-shape .point{fill:var(--tp-paper-color,Canvas);stroke:var(--tp-info-text-colorful,#1e5e85);stroke-width:2.5px}.tp-geometry-shape .dependent{fill:var(--tp-success-fill-loud,#268675);stroke:var(--tp-paper-color,Canvas)}.tp-geometry-shape.is-selected .point{fill:#df8c3e}.tp-geometry-shape text{fill:var(--tp-text-body,CanvasText);paint-order:stroke;stroke:var(--tp-background-color,Canvas);stroke-width:4px;font:600 15px system-ui}tp-graph-geometry [data-status]{min-height:2em;margin:0;padding:10px 16px;font-size:.85rem}.tp-geometry-source{border-top:1px solid var(--tp-neutral-stroke-soft,#dbe4e6);padding:12px 16px}@media (width<=700px){.tp-geometry-workspace{grid-template-columns:1fr}.tp-geometry-workspace aside{border-left:0;border-top:1px solid var(--tp-neutral-stroke-soft,#dbe4e6)}.tp-geometry-header{flex-wrap:wrap}tp-graph-geometry [data-objects]{max-height:150px}}tp-graph-geometry aside>tp-button{max-width:100%}tp-graph-geometry aside>tp-button>button{white-space:normal}.tp-geometry-board [data-grid]{pointer-events:none}.tp-geometry-board [data-grid] path{fill:none;stroke:var(--tp-text-body,CanvasText);stroke-opacity:.13;stroke-width:1px;vector-effect:non-scaling-stroke}.tp-geometry-board svg.pan-mode,.tp-geometry-board svg.pan-mode .tp-geometry-shape{cursor:grab}.tp-geometry-board svg.is-panning,.tp-geometry-board svg.is-panning .tp-geometry-shape{cursor:grabbing}.tp-geometry-tools{--tp-button-group-gap:.3rem}.tp-geometry-header tp-button-group{--tp-button-group-gap:.4rem;flex-wrap:wrap}tp-graph-geometry [data-objects] tp-button>button{inline-size:100%}tp-graph-geometry [data-objects] [data-tp-button-content]{justify-content:space-between;gap:.5rem;inline-size:100%;display:flex}.tp-geometry-board svg:focus-visible{outline:3px solid var(--tp-focus-color,Highlight);outline-offset:-3px}.tp-geometry-shape .sector{fill:var(--tp-info-text-colorful,#447a94);fill-opacity:.12}.tp-geometry-appearance{flex-wrap:wrap;gap:.3rem;margin-bottom:.6rem;display:flex}.tp-geometry-swatch{background:var(--tp-brand-seed);border:1px solid;border-radius:50%;width:1em;height:1em;margin-inline-end:.5em;display:inline-block}.tp-geometry-shape.stroke-dotted .shape-ink,.tp-geometry-shape.stroke-dotted .point{stroke-dasharray:1 6;stroke-linecap:round}.tp-geometry-shape.stroke-dashed .shape-ink,.tp-geometry-shape.stroke-dashed .point{stroke-dasharray:10 6}.tp-geometry-shape.has-color .shape-ink,.tp-geometry-shape.has-color .point{stroke:var(--tp-brand-seed)}.tp-geometry-shape.has-color .sector,.tp-geometry-shape.has-color .dependent,.tp-geometry-shape.has-color text{fill:var(--tp-brand-seed)}.tp-geometry-header>tp-save-image{margin-inline-start:auto}.tp-geometry-preview{fill:none;stroke:var(--tp-info-text-colorful,#1e5e85);stroke-width:2px;stroke-dasharray:5 5;pointer-events:none}.tp-geometry-shape .polygon{fill:var(--tp-info-text-colorful,#447a94);fill-opacity:.15}.tp-geometry-shape.has-color .polygon{fill:var(--tp-brand-seed)}.tp-geometry-shape.is-selected:not(.has-color) .polygon{fill:#c96523}.tp-geometry-shape .shape-hit polygon{fill:#0000}", m = (e) => e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;"), h = {
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
}, g = {
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
}, _ = {
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
	move: "Drag a point to move it, or drag empty space to move the whole view. Scroll to pan; Shift+scroll pans horizontally.",
	point: "Click the drawing to place a free point.",
	on: "Click a line, segment, ray, vector, circle or arc to place a point attached to it.",
	segment: "Select two existing points.",
	line: "Select two existing points.",
	fixedSegment: "Enter a positive length, then select the origin and a point giving its direction. The endpoint stays at the chosen length.",
	ray: "Select the origin, then a point giving the ray direction.",
	vector: "Select the starting point, then the endpoint.",
	sector: "Set start/end angles, then select a circle to draw its angular sector.",
	comment: "Enter comment text, then select its anchor point.",
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
}, v = class v extends e {
	static nextId = 0;
	controlId = `tp-geometry-${++v.nextId}`;
	objects = [];
	result = s([]);
	initialized = !1;
	sourceRequest = null;
	objectListMarkup = "";
	tool = "move";
	polygonDraft = [];
	pending = [];
	selected = null;
	undoStack = [];
	redoStack = [];
	scale = 36;
	center = {
		x: 0,
		y: 0
	};
	pan = null;
	suppressCanvasClick = !1;
	drag = null;
	static get observedAttributes() {
		return [
			"readonly",
			"grid",
			"src",
			"built-in"
		];
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		e ? this.setAttribute("src", e) : this.removeAttribute("src");
	}
	get value() {
		return f(this.objects);
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
		let t = d(e), n = this.value;
		this.objects = t, this.initialized = !0, n !== this.value && (this.undoStack.push(n), this.redoStack = []), this.pending = [], this.polygonDraft = [], this.selected = null, this.recompute(), this.syncSource(), this.changed();
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
			for (let e of this.objects) a(e.definition).some((e) => t.has(e)) && t.add(e.id);
		} while (n !== t.size);
		this.setConstruction(f(this.objects.filter((e) => !t.has(e.id))));
	}
	connectedCallback() {
		if (super.connectedCallback(), this.ensureGlobalStyle("tp-graph-geometry-style", p), !this.initialized) {
			let e = this.querySelector("script[type=\"tp/geometry\"]")?.textContent ?? this.textContent ?? "";
			try {
				this.objects = d(this.src.trim() ? "" : e.trim() || i), this.initialized = !0;
			} catch (e) {
				this.innerHTML = `<p role="alert">${m(String(e))}</p>`, this.dispatchEvent(new CustomEvent("tp-geometry-error", {
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
			if (e === "src") {
				this.isConnected && this.initialized && this.loadSource();
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
		this.sourceRequest?.abort(), this.sourceRequest = null, this.drag = null, this.pan = null;
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
		this.objects = d(e), this.pending = [], this.polygonDraft = [], this.selected = null, this.recompute(), this.syncSource(), this.changed();
	}
	recompute() {
		this.result = s(this.objects), this.draw();
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
	syncSource() {
		let e = this.querySelector("tp-code-editor");
		e && e.setValue(this.value);
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
	changeAppearance(e, r) {
		if (this.readonly || !this.selected) return;
		let i = this.selected, a = d(this.value), o = a.find((e) => e.id === i);
		o && (e !== void 0 && n.includes(e) && (o.hidden = e === "hidden", e !== "hidden" && (o.stroke = e)), r !== void 0 && (!r || t.includes(r)) && (r ? o.color = r : delete o.color), this.setConstruction(f(a)), this.selected = i, this.draw());
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
			r.setAttribute("width", "900"), r.setAttribute("height", "560"), r.setAttribute("fill", getComputedStyle(e.parentElement ?? this).backgroundColor), t.prepend(r);
			for (let e of [t, ...t.querySelectorAll("*")]) for (let t of [...e.attributes]) (t.name.startsWith("data-") || t.name.startsWith("aria-") || [
				"class",
				"tabindex",
				"role",
				"id"
			].includes(t.name)) && e.removeAttribute(t.name);
			return t.removeAttribute("style"), t.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg"), t.setAttribute("width", "900"), t.setAttribute("height", "560"), new XMLSerializer().serializeToString(t);
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
	render() {
		if (this.objectListMarkup = "", this.setAttribute("data-geometry-export", this.controlId), this.innerHTML = `<div class="tp-geometry-header"><div><strong>Ruler & compass</strong><span>Geometric constructions</span></div><tp-save-image anchor='[data-geometry-export="${this.controlId}"]' filename="geometry"></tp-save-image><tp-button-group><tp-button type="button" outlined data-geometry-control data-action="example">Perpendicular bisector</tp-button><tp-button type="button" outlined data-geometry-control data-action="clear">New construction</tp-button></tp-button-group></div>
      <tp-button-group class="tp-geometry-tools" aria-label="Construction tools">${Object.entries({
			...h,
			...this.builtIn ? g : {}
		}).map(([e, t]) => `<tp-button type="button" ${e === this.tool ? "" : "outlined"} data-geometry-control data-tool="${e}" aria-pressed="${e === this.tool}">${t}</tp-button>`).join("")}</tp-button-group>
      <div class="tp-geometry-parameters"><tp-textfield data-field="radius" label="Radius / length" value="5"></tp-textfield><tp-textfield data-field="start" label="Start angle (°)" value="20"></tp-textfield><tp-textfield data-field="end" label="End angle (°)" value="100"></tp-textfield><tp-textfield data-field="comment" label="Comment text" value="Comment"></tp-textfield>${this.builtIn ? `<tp-radio-list data-transform-mode label="Transformation" label-position="top" orientation="horizontal" value="1"><ul><li>Create a copy</li><li>Transform the object</li></ul></tp-radio-list><tp-textfield data-field="ratio" label="Ratio" value="2"></tp-textfield><tp-textfield data-field="rotation" label="Rotation angle (°)" value="90"></tp-textfield><tp-textfield data-field="sides" label="Sides" value="5" ${this.readonly ? "readonly" : ""}></tp-textfield><tp-button outlined data-geometry-control data-action="finish-polygon">Finish polygon</tp-button>` : ""}<span>Angles turn counterclockwise.</span></div>
      <tp-callout class="tp-geometry-hint" variant="info" outlined><span data-hint>${_[this.tool]}</span></tp-callout>
      <div class="tp-geometry-workspace"><div class="tp-geometry-board"><svg data-geometry-canvas viewBox="0 0 900 560" role="group" aria-label="Geometric construction. Drag empty space or scroll to pan. In Pan view, arrow keys move the view." tabindex="0"><g data-grid aria-hidden="true"></g><g data-drawing></g></svg><div class="tp-geometry-view"><tp-button type="button" outlined data-geometry-control data-action="undo">Undo</tp-button><tp-button type="button" outlined data-geometry-control data-action="redo">Redo</tp-button><tp-button type="button" outlined data-geometry-control data-action="out" aria-label="Zoom out">−</tp-button><tp-button type="button" outlined data-geometry-control data-action="in" aria-label="Zoom in">+</tp-button><tp-button type="button" outlined data-geometry-control data-action="fit">Fit</tp-button><tp-button type="button" outlined data-geometry-control data-action="grid" aria-pressed="${this.grid}">Grid</tp-button></div></div>
      <aside><h3>Construction objects</h3><p data-appearance-label>Select an object in Move mode to change its appearance.</p><div class="tp-geometry-appearance"><tp-button id="${this.controlId}-style" outlined data-geometry-control data-action="style-menu" aria-haspopup="menu"><span data-style-label>Style · solid</span></tp-button><tp-dropdown anchor="#${this.controlId}-style" outside-click data-style-menu><ul>${n.map((e) => `<li data-stroke="${e}">${e}${e === "solid" ? " (default)" : ""}</li>`).join("")}</ul></tp-dropdown><tp-button id="${this.controlId}-color" outlined data-geometry-control data-action="color-menu" aria-haspopup="menu"><span data-color-label>Color · automatic</span></tp-button><tp-dropdown anchor="#${this.controlId}-color" outside-click data-color-menu><ul><li data-color="">Automatic</li>${t.map((e) => `<li data-color="${e}"><span class="tp-geometry-swatch tp-${e}" aria-hidden="true"></span>${e}</li>`).join("")}</ul></tp-dropdown></div><div data-objects></div><tp-button type="button" outlined data-geometry-control data-action="delete">Delete selected + dependents</tp-button><p>Free points move freely. Attached points slide on their support. Constructed points are calculated.</p></aside></div>
      <p data-status role="status" aria-live="polite"></p><tp-accordion class="tp-geometry-source"><dl><dt>Construction source</dt><dd><tp-code-editor language="text" line-numbers ${this.readonly ? "readonly" : ""}></tp-code-editor><tp-button type="button" outlined data-geometry-control data-action="apply">Apply construction</tp-button></dd></dl></tp-accordion>`, this.readonly) for (let e of this.querySelectorAll("[data-tool]:not([data-tool=\"pan\"]), [data-action=\"example\"], [data-action=\"clear\"], [data-action=\"delete\"], [data-action=\"apply\"]")) e.disabled = !0;
		this.querySelector(".tp-geometry-parameters")?.toggleAttribute("hidden", this.readonly);
		let e = this.querySelector("tp-save-image [data-format=\"svg\"]");
		e && (e.textContent = "SVG (default)"), this.addEventListener("tp-save-image-error", this.onExportError);
		for (let e of ["style", "color"]) this.querySelector(`[data-${e}-menu]`)?.addEventListener("tp-dropdown-toggle", () => {
			this.querySelector(`[data-action="${e}-menu"]`)?.setAttribute("aria-expanded", String(this.querySelector(`[data-${e}-menu]`)?.hasAttribute("open"))), this.syncButtonControls();
		});
		for (let e of this.querySelectorAll("[data-stroke], [data-color]")) e.addEventListener("keydown", (t) => {
			(t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.changeAppearance(e.dataset.stroke, e.dataset.color));
		});
		this.onclick = (e) => {
			let t = e.target.closest("[data-stroke], [data-color]");
			if (t && this.contains(t)) {
				this.changeAppearance(t.dataset.stroke, t.dataset.color);
				return;
			}
			let n = e.target.closest("tp-button[data-geometry-control]");
			if (!n || n.disabled) return;
			n.dataset.tool && (!this.readonly || n.dataset.tool === "pan") && (this.tool = n.dataset.tool, this.pending = [], this.polygonDraft = [], this.updateTool()), n.dataset.object && this.selectObject(n.dataset.object);
			let r = n.dataset.action;
			if ((r === "style-menu" || r === "color-menu") && this.querySelector(r === "style-menu" ? "[data-style-menu]" : "[data-color-menu]")?.toggle(), (r === "in" || r === "out") && (this.scale = Math.max(3, Math.min(300, this.scale * (r === "in" ? 1.25 : .8))), this.draw()), r === "fit" && this.fitView(), r === "grid" && (this.grid = !this.grid), !this.readonly) try {
				r === "undo" && this.undo(), r === "redo" && this.redo(), r === "delete" && this.selected && this.removeObject(this.selected), r === "example" && (this.setConstruction(i), this.fitView()), r === "finish-polygon" && this.finishPolygon(), r === "clear" && this.setConstruction(""), r === "apply" && (this.setConstruction(this.querySelector("tp-code-editor")?.getValue() ?? ""), this.fitView());
			} catch (e) {
				this.report(String(e)), this.dispatchEvent(new CustomEvent("tp-geometry-error", {
					bubbles: !0,
					detail: { message: String(e) }
				}));
			}
		};
		let r = this.querySelector("svg[data-geometry-canvas]");
		if (!r) return;
		r.addEventListener("pointerdown", (e) => {
			if (this.drag || this.pan || e.button > 1) return;
			this.suppressCanvasClick = !1;
			let t = e.target.closest("[data-id]")?.getAttribute("data-id");
			if (e.button === 1 || this.tool === "pan" || !t && this.tool === "move") {
				this.pan = {
					pointer: e.pointerId,
					start: this.canvasPoint(e),
					center: { ...this.center }
				}, this.suppressCanvasClick = !0, r.setPointerCapture?.(e.pointerId), r.focus({ preventScroll: !0 }), r.classList.add("is-panning"), e.preventDefault();
				return;
			}
			if (this.readonly || this.tool !== "move") return;
			let n = this.objects.find((e) => e.id === t);
			if (!n || (this.selected = n.id, this.draw(), n.definition.kind !== "point" && n.definition.kind !== "on" && n.definition.kind !== "measure")) return;
			let i = this.result.values.get(n.id), a = this.world(e);
			this.drag = {
				...n.definition.kind === "measure" && i?.kind === "comment" ? { grab: {
					x: i.point.x - a.x,
					y: i.point.y - a.y
				} } : {},
				id: n.id,
				before: this.value,
				pointer: e.pointerId
			}, r.setPointerCapture?.(e.pointerId), r.focus({ preventScroll: !0 }), e.preventDefault();
		}), r.addEventListener("pointermove", (e) => {
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
				this.movePoint(this.drag.id, {
					x: t.x + (this.drag.grab?.x ?? 0),
					y: t.y + (this.drag.grab?.y ?? 0)
				});
			}
		});
		let a = (e) => {
			if (this.pan && e.pointerId === this.pan.pointer) {
				e.type === "pointercancel" && (this.center = this.pan.center), this.pan = null, r.classList.remove("is-panning"), this.draw();
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
		r.addEventListener("pointerup", a), r.addEventListener("pointercancel", a), r.addEventListener("click", (e) => {
			if (this.suppressCanvasClick) {
				this.suppressCanvasClick = !1;
				return;
			}
			if (this.readonly || this.tool === "move" || this.tool === "pan") return;
			let t = e.target.closest("[data-id]")?.getAttribute("data-id") ?? void 0;
			try {
				r.focus({ preventScroll: !0 }), this.useTool(t, this.world(e));
			} catch (e) {
				this.pending = [], this.polygonDraft = [], this.updateTool(), this.report(String(e));
			}
		}), r.addEventListener("wheel", (e) => {
			if (e.ctrlKey || e.metaKey || this.pan || this.drag) return;
			e.preventDefault();
			let t = r.getBoundingClientRect(), n = e.deltaX, i = e.deltaY;
			e.shiftKey && n === 0 && (n = i, i = 0);
			let a = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? t.width || 900 : 1, o = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? t.height || 560 : 1, s = this.canvasPoint(e), c = this.canvasPoint({
				clientX: e.clientX + n * a,
				clientY: e.clientY + i * o
			});
			this.center.x += (c.x - s.x) / this.scale, this.center.y -= (c.y - s.y) / this.scale, this.draw();
		}, { passive: !1 }), r.addEventListener("keydown", (e) => {
			if (e.key === "Enter" && this.tool === "polygon") {
				e.preventDefault(), this.finishPolygon();
				return;
			}
			if (e.key === "Escape") {
				this.pending = [], this.polygonDraft = [], this.tool = "move", this.updateTool();
				return;
			}
			if (this.tool === "pan" && [
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
			let t = this.result.values.get(this.selected);
			if (t?.kind !== "point" && !(t?.kind === "comment" && this.objects.find((e) => e.id === this.selected)?.definition.kind === "measure")) return;
			e.preventDefault();
			let n = this.value, r = e.shiftKey ? .02 : .2;
			this.movePoint(this.selected, {
				x: t.point.x + (e.key === "ArrowRight" ? r : e.key === "ArrowLeft" ? -r : 0),
				y: t.point.y + (e.key === "ArrowUp" ? r : e.key === "ArrowDown" ? -r : 0)
			}), n !== this.value && (this.undoStack.push(n), this.redoStack = [], this.syncSource(), this.changed(), this.draw());
		});
	}
	syncButtonControls() {
		queueMicrotask(() => {
			if (this.isConnected) for (let e of this.querySelectorAll("tp-button[data-geometry-control]")) {
				let t = e.querySelector(":scope > button");
				if (!t) continue;
				for (let n of [
					"aria-pressed",
					"aria-label",
					"aria-haspopup",
					"aria-expanded"
				]) {
					let r = e.getAttribute(n);
					r === null ? t.removeAttribute(n) : t.setAttribute(n, r);
				}
				let n = e.getAttribute("aria-pressed") === "true" ? "brand" : "neutral";
				e.variant !== n && (e.variant = n);
			}
		});
	}
	updateTool() {
		for (let e of this.querySelectorAll("[data-tool]")) {
			let t = e.dataset.tool === this.tool;
			e.setAttribute("aria-pressed", String(t)), e.toggleAttribute("outlined", !t);
		}
		let e = this.querySelector("[data-hint]");
		e && (e.textContent = _[this.tool]), this.report(this.pending.length ? `Selected: ${this.pending.join(", ")}. Select the next object.` : ""), this.draw();
	}
	selectObject(e) {
		if (this.tool === "move" || this.tool === "pan" || this.readonly) {
			this.selected = e, this.draw(), this.querySelector("svg[data-geometry-canvas]")?.focus();
			return;
		}
		let t = this.result.values.get(e), n = t?.kind === "point" ? t.point : t?.kind === "circle" || t?.kind === "arc" || t?.kind === "sector" ? {
			x: t.center.x + t.radius,
			y: t.center.y
		} : t && l(t) ? t.first : {
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
		let e = f(this.polygonDraft);
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
			let e = f(this.polygonDraft);
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
		if (!e || !n) throw Error("Select an existing, defined object.");
		if (r.includes(this.tool)) {
			if (!this.builtIn || this.readonly) return;
			if (!this.pending.length) {
				this.pending = [e], this.updateTool();
				return;
			}
			let t = this.objects.find((e) => e.id === this.pending[0]), n = t && this.result.values.get(t.id);
			if (!t || !n) throw Error("Select a defined object first.");
			let r = this.tool === "homothety" ? `, ratio=${this.field("ratio")}` : this.tool === "rotation" ? `, angle=${this.field("rotation")}deg` : "", i = `${t.stroke ? ` style=${t.stroke}` : ""}${t.color ? ` color=${t.color}` : ""}`, a = d(`${this.value}\n${n.kind} ${this.name(`${t.id}_image`)} = ${this.tool}(${t.id}, ${e}${r})${i}`), o = a[a.length - 1];
			if (o?.definition.kind !== "transform") throw Error("Invalid transformation.");
			if (this.querySelector("[data-transform-mode]")?.value === "2") {
				let e = structuredClone(this.objects), n = e.find((e) => e.id === t.id);
				if (!n) return;
				n.definition = {
					...o.definition,
					object: n.definition
				}, this.setConstruction(f(e));
			} else this.setConstruction(f(a));
			this.updateTool();
			return;
		}
		if (this.tool === "length" || this.tool === "area" || this.tool === "angle") {
			if (this.tool === "angle" && l(n)) {
				if (this.pending.length && !l(this.result.values.get(this.pending[0] ?? "") ?? {
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
			let r = u(n, t);
			this.appendConstruction(`point ${this.pointName()} = on(${e}, ${l(n) ? `t=${r}` : `angle=${r * 180 / Math.PI}deg`})`);
			return;
		}
		if (this.tool === "arc" || this.tool === "sector") {
			if (n.kind !== "circle") throw Error("Select a circle.");
			let t = d(`${this.value}\n${this.tool} ${this.name(this.tool)} = ${this.tool}(${e}, start=${this.field("start")}deg, end=${this.field("end")}deg)`), r = t.find((t) => t.id === e);
			r && this.tool === "arc" && (r.hidden = !0), this.setConstruction(f(t));
			return;
		}
		if (this.tool === "circle") {
			if (n.kind !== "point") throw Error("Select the centre point.");
			this.appendConstruction(`circle ${this.name("c")} = circle(${e}, ${this.field("radius")})`);
			return;
		}
		if (this.tool === "comment") {
			if (n.kind !== "point") throw Error("Select an anchor point.");
			this.appendConstruction(`comment ${this.name("note")} = comment(${e}, ${JSON.stringify(this.field("comment"))})`);
			return;
		}
		if (this.tool === "midpoint" || this.tool === "perpendicularBisector") {
			if (n.kind !== "segment") throw Error("Select a segment.");
			this.appendConstruction(`${this.tool === "midpoint" ? "point" : "line"} ${this.name(this.tool === "midpoint" ? "M" : "m")} = ${this.tool}(${e})`);
			return;
		}
		if (this.tool === "parallel" || this.tool === "perpendicular" || this.tool === "tangent") {
			if (!this.pending.length && n.kind !== "point") throw Error("Select a point first.");
			if (this.pending.length && (this.tool === "tangent" ? n.kind !== "circle" : !l(n))) throw Error(this.tool === "tangent" ? "Select a circle." : "Select a linear support.");
		} else if (this.tool === "intersection") {
			if (!l(n) && n.kind !== "circle" && n.kind !== "arc") throw Error("Select a line, segment, ray, vector, circle or arc.");
		} else if (n.kind !== "point") throw Error("Select a point.");
		if (this.pending.includes(e)) throw Error("Select two different objects.");
		if (this.pending.push(e), this.pending.length < (this.tool === "bisector" ? 3 : 2)) {
			this.updateTool();
			return;
		}
		let [i = "", a = "", p = ""] = this.pending;
		if (this.pending = [], this.polygonDraft = [], this.tool === "line" || this.tool === "segment" || this.tool === "fixedSegment" || this.tool === "ray" || this.tool === "vector") {
			let e = this.tool === "fixedSegment" ? "segment" : this.tool;
			this.appendConstruction(`${e} ${this.name(e === "line" ? "d" : e === "vector" ? "v" : e === "ray" ? "r" : "s")} = ${e}(${i}, ${a}${this.tool === "fixedSegment" ? `, length=${this.field("radius")}` : ""})`);
		} else if (this.tool === "parallel" || this.tool === "perpendicular") this.appendConstruction(`line ${this.name("d")} = ${this.tool}(${i}, ${a})`);
		else if (this.tool === "bisector") this.appendConstruction(`line ${this.name("b")} = bisector(${i}, ${a}, ${p})`);
		else if (this.tool === "tangent") {
			let e = d(`${this.value}\nline ${this.name("t")} = tangent(${i}, ${a}, branch=0)`), t = s(e).errors.get(this.name("t"));
			if (t) throw Error(t);
			let n = this.result.values.get(i), r = this.result.values.get(a);
			if (n?.kind === "point" && r?.kind === "circle" && o(n.point, r.center) > r.radius + 1e-9) {
				let t = 1;
				for (; e.some((e) => e.id === `t${t}`);) t++;
				e.push({
					id: `t${t}`,
					hidden: !1,
					definition: {
						kind: "tangent",
						point: i,
						circle: a,
						branch: 1
					}
				});
			}
			this.setConstruction(f(e));
		} else if (this.tool === "through") this.appendConstruction(`circle ${this.name("c")} = circle(${i}, through=${a})`);
		else {
			let e = this.result.values.get(i), t = this.result.values.get(a);
			if (!e || !t) return;
			let n = c(e, t), r = n.map((e, t) => e && !(t === 1 && n[0] && o(e, n[0]) < 1e-9) ? t : -1).filter((e) => e >= 0);
			if (!r.length) throw Error("These objects have no distinct intersection.");
			let s = [...this.objects];
			for (let e of r) {
				let t = 1, n = "I";
				for (; s.some((e) => e.id === n);) n = `I${t++}`;
				s.push({
					id: n,
					hidden: !1,
					definition: {
						kind: "intersection",
						first: i,
						second: a,
						branch: e
					}
				});
			}
			this.setConstruction(f(s));
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
			y: (e.clientY - (r?.top ?? 0)) * 560 / (r?.height || 560)
		};
	}
	world(e) {
		let t = this.canvasPoint(e);
		return {
			x: (t.x - 450) / this.scale + this.center.x,
			y: (280 - t.y) / this.scale + this.center.y
		};
	}
	movePoint(e, t) {
		let n = this.objects.find((t) => t.id === e)?.definition;
		if (n) {
			if (n.kind === "point") n.x = t.x, n.y = t.y;
			else if (n.kind === "measure") {
				let r = this.result.values.get(e);
				if (r?.kind !== "comment") return;
				let i = (n.offset?.x ?? 0) + t.x - r.point.x, a = (n.offset?.y ?? 0) + t.y - r.point.y;
				i || a ? n.offset = {
					x: i,
					y: a
				} : delete n.offset;
			} else if (n.kind === "on") {
				let e = this.result.values.get(n.object);
				e && (n.parameter = u(e, t));
			}
			this.recompute();
		}
	}
	fitView() {
		let e = [];
		for (let t of this.objects) {
			if (t.hidden) continue;
			let n = this.result.values.get(t.id);
			if (n && ((n.kind === "point" || n.kind === "comment") && e.push(n.point), l(n) && e.push(n.first, n.second), n.kind === "sector" && e.push(n.center), n.kind === "polygon" && e.push(...n.vertices), n.kind === "circle" && e.push({
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
	draw() {
		let e = this.querySelector("[data-drawing]");
		if (!e) return;
		let t = (e) => 450 + (e - this.center.x) * this.scale, n = (e) => 280 - (e - this.center.y) * this.scale, r = [], i = [];
		for (let e of this.objects) {
			let a = this.result.values.get(e.id);
			if (!a || e.hidden) continue;
			let s = `data-id="${e.id}" class="tp-geometry-shape ${e.color ? `has-color tp-${e.color}` : ""} stroke-${e.stroke ?? "solid"} ${this.selected === e.id || this.pending.includes(e.id) ? "is-selected" : ""}"`, c = "";
			if (a.kind === "point") {
				i.push(`<g ${s}><circle class="point-hit" cx="${t(a.point.x)}" cy="${n(a.point.y)}" r="13"/><circle class="point ${e.definition.kind === "point" ? "free" : "dependent"}" cx="${t(a.point.x)}" cy="${n(a.point.y)}" r="5"/><text x="${t(a.point.x) + 11}" y="${n(a.point.y) - 10}">${e.id}</text><title>${e.id} · ${e.definition.kind}</title></g>`);
				continue;
			}
			if (l(a)) {
				let e = o(a.first, a.second), r = a.kind === "line" || a.kind === "ray" ? (1800 / this.scale + o(a.first, this.center)) / e : 0, i = a.second.x - a.first.x, s = a.second.y - a.first.y;
				if (c = `<line x1="${t(a.first.x - i * (a.kind === "line" ? r : 0))}" y1="${n(a.first.y - s * (a.kind === "line" ? r : 0))}" x2="${t(a.second.x + i * r)}" y2="${n(a.second.y + s * r)}"/>`, a.kind === "vector") {
					let r = i / e, o = -s / e, l = t(a.second.x), u = n(a.second.y);
					c += `<path d="M ${l - 12 * r + 5 * o} ${u - 12 * o - 5 * r} L ${l} ${u} L ${l - 12 * r - 5 * o} ${u - 12 * o + 5 * r}"/>`;
				}
			} else if (a.kind === "polygon") c = `<polygon points="${a.vertices.map((e) => `${t(e.x)},${n(e.y)}`).join(" ")}"/>`;
			else if (a.kind === "comment") {
				if (a.angleMark) {
					let r = a.angleMark, o = r.right ? 16 : 30, c = (e, i) => ({
						x: t(r.vertex.x) + Math.cos(e) * i,
						y: n(r.vertex.y) - Math.sin(e) * i
					}), l = c(r.start, o), u = c(r.start + r.sweep, o), d = {
						x: l.x + u.x - t(r.vertex.x),
						y: l.y + u.y - n(r.vertex.y)
					}, f = r.right ? `M ${l.x} ${l.y} L ${d.x} ${d.y} L ${u.x} ${u.y}` : `M ${l.x} ${l.y} A ${o} ${o} 0 0 ${r.sweep > 0 ? 0 : 1} ${u.x} ${u.y}`, p = c(r.start + r.sweep / 2, 46);
					i.push(`<g ${s}><g class="shape-hit"><path d="${f}"/></g><g class="shape-ink"><path data-angle-mark="${r.right ? "right" : "arc"}" d="${f}"/></g>${r.right ? "" : `<text text-anchor="middle" dominant-baseline="middle" x="${p.x + (a.point.x - r.vertex.x) * this.scale}" y="${p.y - (a.point.y - r.vertex.y) * this.scale}">${m(a.text)}</text>`}<title>${e.id}${r.right ? " · Right angle" : ""}</title></g>`);
					continue;
				}
				i.push(`<g ${s}><text x="${t(a.point.x) + 12}" y="${n(a.point.y) + 24}">${m(a.text)}</text><title>${e.id}</title></g>`);
				continue;
			} else if (a.kind === "circle") c = `<circle cx="${t(a.center.x)}" cy="${n(a.center.y)}" r="${a.radius * this.scale}"/>`;
			else if (a.kind === "arc" || a.kind === "sector") {
				let e = {
					x: a.center.x + a.radius * Math.cos(a.start),
					y: a.center.y + a.radius * Math.sin(a.start)
				}, r = {
					x: a.center.x + a.radius * Math.cos(a.start + a.sweep),
					y: a.center.y + a.radius * Math.sin(a.start + a.sweep)
				};
				c = `<path d="${a.kind === "sector" ? `M ${t(a.center.x)} ${n(a.center.y)} L` : "M"} ${t(e.x)} ${n(e.y)} A ${a.radius * this.scale} ${a.radius * this.scale} 0 ${+(Math.abs(a.sweep) > Math.PI)} ${a.sweep > 0 ? 0 : 1} ${t(r.x)} ${n(r.y)}${a.kind === "sector" ? " Z" : ""}"/>`;
			}
			r.push(`<g ${s}><g class="shape-hit">${c}</g><g class="shape-ink ${a.kind}">${c}</g><title>${e.id}</title></g>`);
		}
		let a = this.pending.map((e) => {
			let t = this.polygonDraft.find((t) => t.id === e)?.definition, n = this.result.values.get(e);
			return t?.kind === "point" ? t : n?.kind === "point" ? n.point : null;
		}).filter((e) => e !== null), s = this.tool === "polygon" || this.tool === "regularPolygon" ? `<g data-polygon-preview><polyline class="tp-geometry-preview" points="${a.map((e) => `${t(e.x)},${n(e.y)}`).join(" ")}"/>${this.polygonDraft.map((e) => {
			let r = e.definition;
			return r.kind === "point" ? `<g data-id="${e.id}" class="tp-geometry-shape"><circle class="point-hit" cx="${t(r.x)}" cy="${n(r.y)}" r="13"/><circle class="point" cx="${t(r.x)}" cy="${n(r.y)}" r="5"/><text x="${t(r.x) + 11}" y="${n(r.y) - 10}">${e.id}</text></g>` : "";
		}).join("")}</g>` : "";
		e.innerHTML = `${r.join("")}${i.join("")}${s}`;
		let c = this.querySelector("[data-action=\"finish-polygon\"]");
		c && (c.disabled = this.readonly || this.tool !== "polygon" || this.pending.length < 3);
		let u = this.querySelector("[data-grid]");
		if (u) {
			let e = this.scale * 10 ** Math.max(0, Math.ceil(Math.log10(18 / this.scale))), r = [];
			if (this.grid) {
				for (let n = (t(0) % e + e) % e; n <= 900; n += e) r.push(`M ${n} 0 V 560`);
				for (let t = (n(0) % e + e) % e; t <= 560; t += e) r.push(`M 0 ${t} H 900`);
			}
			u.innerHTML = r.length ? `<path d="${r.join(" ")}"/>` : "";
		}
		this.querySelector("[data-action=\"grid\"]")?.setAttribute("aria-pressed", String(this.grid)), this.querySelector("[data-geometry-canvas]")?.classList.toggle("pan-mode", this.tool === "pan");
		let d = this.querySelector("[data-objects]");
		if (d) {
			let e = this.objects.map((e) => `<tp-button type="button" outlined data-geometry-control data-object="${e.id}" aria-pressed="${this.selected === e.id}" title="${m(this.result.errors.get(e.id) ?? e.definition.kind)}"><b>${e.id}</b><span class="object-kind">${this.result.errors.has(e.id) ? "Undefined" : e.definition.kind}${e.hidden ? " · hidden" : ""}</span></tp-button>`).join("") || "<p>Place your first point.</p>";
			e !== this.objectListMarkup && (d.innerHTML = e, this.objectListMarkup = e);
		}
		let f = this.objects.find((e) => e.id === this.selected);
		for (let e of ["style", "color"]) {
			let t = this.querySelector(`[data-action="${e}-menu"]`);
			if (t) {
				t.disabled = this.readonly || !f;
				let n = t.querySelector(`[data-${e}-label]`);
				n && (n.textContent = e === "style" ? `Style · ${f?.hidden ? "hidden" : f?.stroke ?? "solid"}` : `Color · ${f?.color ?? "automatic"}`), t.setAttribute("aria-expanded", String(this.querySelector(`[data-${e}-menu]`)?.hasAttribute("open") ?? !1));
			}
		}
		let p = this.querySelector("[data-appearance-label]");
		p && (p.textContent = f ? `Appearance of ${f.id}` : "Select an object in Move mode to change its appearance."), this.syncButtonControls();
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
customElements.get("tp-graph-geometry") || customElements.define("tp-graph-geometry", v);
//#endregion
export { v as t };

//# sourceMappingURL=graph-geometry.js.map