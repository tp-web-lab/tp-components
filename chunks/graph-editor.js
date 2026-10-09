import { Ku as e, Qu as t, _n as n, vn as r } from "./lib/typescript/typescript.js";
import "./accordion.js";
import "./color.js";
import "./save-image.js";
import { TpGraphDocumentSchema as i, formatGraphSchemaError as a } from "../components/graph-editor/graph-schema.js";
//#region src/components/graph-editor/graph-editor.css?inline
var o = "tp-graph-editor{min-height:28rem;color:var(--tp-text-body,CanvasText);display:block}.tp-graph-interface{min-height:inherit}.tp-graph-editor-shell{min-height:inherit;border:1px solid var(--tp-neutral-stroke-soft,#d5dae4);background:var(--tp-paper-color,Canvas);border-radius:.75rem;grid-template-columns:11rem minmax(0,1fr);display:grid;overflow:hidden}.tp-graph-palette{border-inline-end:1px solid var(--tp-neutral-stroke-soft,#d5dae4);background:var(--tp-neutral-fill-softer,#f6f7fa);padding:.75rem;overflow:auto}.tp-graph-palette-controls{z-index:1;background:var(--tp-neutral-fill-softer,#f6f7fa);justify-content:flex-end;gap:.25rem;padding-block-end:.5rem;display:flex;position:sticky;inset-block-start:0}.tp-graph-minimap{border-block-start:1px solid var(--tp-neutral-stroke-soft,#d5dae4);margin-block-start:.75rem;padding-block-start:.75rem}.tp-graph-minimap svg{aspect-ratio:16/10;border:1px solid var(--tp-neutral-stroke-soft,#d5dae4);background:var(--tp-background-color,Canvas);border-radius:.35rem;width:100%;display:block}.tp-graph-minimap-edges path{fill:none;stroke:var(--tp-neutral-text-colorful,#657084);stroke-width:2px;vector-effect:non-scaling-stroke}.tp-graph-minimap-nodes rect{fill:var(--tp-paper-color,Canvas);stroke:var(--tp-text-body,CanvasText);stroke-width:1.5px;vector-effect:non-scaling-stroke}.tp-graph-minimap-viewport{fill:color-mix(in srgb, var(--tp-brand-fill-soft,#c7d2fe) 28%, transparent);stroke:var(--tp-brand-stroke-mid,#5268d8);stroke-width:2px;vector-effect:non-scaling-stroke;cursor:move}.tp-graph-palette h3{letter-spacing:.04em;text-transform:uppercase;margin:.25rem 0 .65rem;font-size:.75rem}.tp-graph-palette-items{gap:.4rem;display:grid}.tp-graph-link-button-group{grid-column:1/-1;gap:.25rem;display:grid}.tp-graph-direction-group{grid-template-columns:repeat(2,minmax(0,1fr))}.tp-graph-routing-group{grid-template-columns:repeat(3,minmax(0,1fr))}.tp-graph-palette .tp-graph-link-button-group>button{justify-content:center;min-width:0;padding-inline:.3rem}.tp-graph-palette button,.tp-graph-toolbar button,.tp-graph-specific-toolbar button{border:1px solid var(--tp-neutral-stroke-soft,#c7cedb);color:inherit;background:var(--tp-paper-color,Canvas);cursor:pointer;border-radius:.45rem;padding:.5rem .65rem}.tp-graph-palette button{box-sizing:border-box;text-align:start;justify-content:flex-start;align-items:center;gap:.55rem;width:100%;min-height:2.75rem;display:flex;overflow:hidden}.tp-graph-palette-preview{pointer-events:none;flex:0 0 2rem;width:2rem;height:2rem;display:block;overflow:visible}.tp-graph-palette button>span{overflow-wrap:anywhere;min-width:0;font-size:.82rem;line-height:1.15}.tp-graph-palette-comment-control{min-width:0}.tp-graph-comment-palette-swatch{border:1px solid;border-radius:999rem;flex:0 0 .8rem;width:.8rem;height:.8rem;margin-inline-start:auto;display:inline-block}.tp-graph-comment-color-dropdown .tp-graph-comment-color-grid{grid-template-columns:repeat(3,2.4rem);gap:.35rem;padding:.4rem;display:grid}.tp-graph-comment-color-dropdown li{place-items:center;padding:.2rem;display:grid}.tp-graph-comment-color-dropdown li .tp-graph-comment-palette-swatch{border-radius:.25rem;width:2rem;height:1.25rem;margin:0}.tp-graph-comment-swatch-success{background:var(--tp-success-fill-soft,#bbf7d0)}.tp-graph-comment-swatch-warning{background:var(--tp-warning-fill-soft,#fde68a)}.tp-graph-comment-swatch-info{background:var(--tp-info-fill-soft,#bfdbfe)}.tp-graph-comment-swatch-danger{background:var(--tp-danger-fill-soft,#fecaca)}.tp-graph-comment-swatch-brand{background:var(--tp-brand-fill-soft,#c7d2fe)}.tp-graph-comment-swatch-neutral{background:var(--tp-neutral-fill-soft,#e5e7eb)}.tp-graph-palette button[draggable=true]{cursor:grab}.tp-graph-palette button[draggable=true]:active{cursor:grabbing}.tp-graph-palette-edge{fill:none;stroke:currentColor;stroke-width:2px}.tp-graph-palette-edge+marker path,.tp-graph-palette-preview marker path{fill:currentColor}.tp-graph-palette button:hover,.tp-graph-toolbar button:hover,.tp-graph-specific-toolbar button:hover,button.is-active{border-color:var(--tp-brand-stroke-mid,#5268d8);background:var(--tp-brand-fill-softer,#e0e7ff)}.tp-graph-workspace{min-width:0;min-height:inherit;flex-direction:column;display:flex;position:relative}.tp-graph-toolbar{z-index:2;border-block-end:1px solid var(--tp-neutral-stroke-soft,#d5dae4);background:var(--tp-neutral-fill-softer,#f6f7fa);flex-wrap:wrap;align-items:center;gap:.35rem;padding:.4rem;display:flex;position:relative}.tp-graph-specific-toolbar{z-index:2;box-sizing:border-box;border-block-start:1px solid var(--tp-neutral-stroke-soft,#d5dae4);background:var(--tp-neutral-fill-softer,#f6f7fa);flex-wrap:wrap;align-items:center;gap:.35rem;min-width:0;min-height:3rem;padding:.4rem;display:flex;position:relative;overflow-x:auto}.tp-graph-toolbar tp-icon-button,.tp-graph-specific-toolbar tp-icon-button{--tp-icon-button-size:1.75rem;--tp-icon-button-icon-size:1rem}.tp-graph-toolbar tp-icon-button.is-active{color:var(--tp-brand-text-colorful,currentColor);background:var(--tp-brand-fill-softer,#e0e7ff)}.tp-graph-toolbar-spacer{flex:auto}.tp-graph-toolbar-message{min-width:1px;color:var(--tp-text-body,currentColor);font-size:.8rem}.tp-graph-comment-color-label{align-items:center;gap:.35rem;font-size:.78rem;display:inline-flex}.tp-graph-comment-color-label select{border:1px solid var(--tp-neutral-stroke-soft,#c7cedb);background:var(--tp-paper-color,Canvas);min-height:2rem;color:inherit;border-radius:.35rem}.tp-graph-canvas-frame{overscroll-behavior:contain;flex:auto;min-height:28rem;position:relative;overflow:hidden}.tp-graph-title{z-index:1;text-align:center;pointer-events:none;margin:0;font:600 1.15rem system-ui,sans-serif;position:absolute;inset:.75rem 1rem auto}.tp-graph-toolbar-separator{background:var(--tp-neutral-stroke-soft,#d5dae4);align-self:stretch;width:1px;margin:.1rem .15rem}.tp-graph-toolbar button:disabled{opacity:.45;cursor:default}.tp-graph-import-input{display:none}.tp-graph-label-editor{z-index:3;border:2px solid var(--tp-brand-stroke-mid,#5268d8);width:min(11rem,100% - 1rem);min-width:8rem;color:inherit;background:var(--tp-paper-color,Canvas);box-shadow:0 4px 16px color-mix(in srgb, var(--tp-text-body,CanvasText) 25%, transparent);font:inherit;border-radius:.35rem;padding:.4rem .5rem;position:absolute;transform:translate(-50%,-50%)}.tp-graph-label-editor:is(textarea){resize:both;width:min(20rem,100% - 1rem);min-height:6rem}.tp-graph-canvas{touch-action:none;background-color:var(--tp-background-color,Canvas);background-image:radial-gradient(circle, color-mix(in srgb, currentColor 18%, transparent) 1px, transparent 1px);background-size:20px 20px;width:100%;height:100%;min-height:28rem;display:block}.tp-graph-canvas.is-drop-target{outline:3px solid var(--tp-brand-stroke-mid,#5268d8);outline-offset:-3px}tp-graph-editor:not([grid]) .tp-graph-canvas{background-image:none}.tp-graph-node{cursor:grab}.tp-graph-port,.tp-graph-port-overlay-visual{fill:var(--tp-text-body,CanvasText);stroke:var(--tp-text-body,CanvasText);stroke-width:1px;opacity:0;pointer-events:all;cursor:crosshair;transform-box:fill-box;transform-origin:50%;transition:opacity .12s,transform .12s;transform:scale(.75)}.tp-graph-port-hit-area{fill:#0000;stroke:#0000;pointer-events:all;cursor:crosshair}.tp-graph-port-overlay-visual{pointer-events:none}.tp-graph-node:hover .tp-graph-port,[ports-visible] :is(.tp-graph-port,.tp-graph-port-overlay-visual),.tp-graph-port-overlay:hover .tp-graph-port-overlay-visual{opacity:1}.tp-graph-port:hover,.tp-graph-port-overlay:hover .tp-graph-port-overlay-visual{transform:scale(1)}.tp-graph-connection-draft{stroke:var(--tp-brand-stroke-mid,#5268d8);stroke-width:2px;stroke-dasharray:6 4;pointer-events:none;vector-effect:non-scaling-stroke}.tp-graph-selection-area{fill:color-mix(in srgb, var(--tp-brand-fill-mid,#5268d8) 14%, transparent);stroke:var(--tp-brand-stroke-mid,#5268d8);stroke-width:1.5px;stroke-dasharray:6 4;pointer-events:none;vector-effect:non-scaling-stroke}.tp-graph-selection-indicator{fill:color-mix(in srgb, var(--tp-brand-fill-mid,#5268d8) 10%, transparent);stroke:var(--tp-brand-stroke-strong,var(--tp-brand-stroke-mid,#5268d8));stroke-width:2px;stroke-dasharray:6 3;opacity:0;pointer-events:none;vector-effect:non-scaling-stroke;filter:drop-shadow(0 0 2px color-mix(in srgb, var(--tp-brand-stroke-mid,#5268d8) 55%, transparent));transition:opacity .12s}.tp-graph-node.is-selected>.tp-graph-selection-indicator{opacity:1}.tp-graph-shape{fill:var(--tp-graph-node-fill,var(--tp-paper-color,Canvas));stroke:var(--tp-graph-node-stroke,var(--tp-brand-stroke-mid,#5268d8));stroke-width:2px;vector-effect:non-scaling-stroke;transition:fill .2s,stroke .2s}.tp-graph-shape.is-selected{fill:var(--tp-brand-fill-softer,#e0e7ff);stroke-width:3px}.tp-graph-comment{fill:var(--tp-neutral-fill-softer,#f3f4f6);stroke:var(--tp-neutral-stroke-soft,#d1d5db)}.tp-graph-comment-success{fill:var(--tp-success-fill-softer,#dcfce7);stroke:var(--tp-success-stroke-soft,#86efac)}.tp-graph-comment-warning{fill:var(--tp-warning-fill-softer,#fef3c7);stroke:var(--tp-warning-stroke-soft,#fcd34d)}.tp-graph-comment-info{fill:var(--tp-info-fill-softer,#dbeafe);stroke:var(--tp-info-stroke-soft,#93c5fd)}.tp-graph-comment-danger{fill:var(--tp-danger-fill-softer,#fee2e2);stroke:var(--tp-danger-stroke-soft,#fca5a5)}.tp-graph-comment-brand{fill:var(--tp-brand-fill-softer,#e0e7ff);stroke:var(--tp-brand-stroke-soft,#a5b4fc)}.tp-graph-comment-neutral{fill:var(--tp-neutral-fill-softer,#f3f4f6);stroke:var(--tp-neutral-stroke-soft,#d1d5db)}.tp-graph-comment-label{dominant-baseline:hanging}.tp-graph-node.is-selected .tp-graph-shape{fill:var(--tp-brand-fill-softer,#e0e7ff);stroke-width:3px}.tp-graph-label{fill:currentColor;pointer-events:none;-webkit-user-select:none;user-select:none;font:13px system-ui,sans-serif}.tp-graph-edge-line{fill:none;stroke:var(--tp-graph-edge-color,var(--tp-neutral-text-colorful,#657084));stroke-width:2px;pointer-events:none;vector-effect:non-scaling-stroke}.tp-graph-edge-bridge{fill:none;stroke:var(--tp-background-color,Canvas);stroke-width:7px;pointer-events:none;vector-effect:non-scaling-stroke}.tp-graph-edge-hit-area{fill:none;stroke:#0000;stroke-width:14px;pointer-events:stroke;cursor:move;vector-effect:non-scaling-stroke}.tp-graph-edge.is-selected .tp-graph-edge-line{stroke:var(--tp-brand-stroke-mid,#5268d8);stroke-width:3px}.tp-graph-edge-handle{fill:var(--tp-paper-color,Canvas);stroke:var(--tp-brand-stroke-mid,#5268d8);stroke-width:2px;opacity:0;pointer-events:none;cursor:grab;vector-effect:non-scaling-stroke}.tp-graph-edge:is(:hover,.is-selected) .tp-graph-edge-handle{opacity:1;pointer-events:all}.tp-graph-edge-handle:active{cursor:grabbing}.tp-graph-measurement{cursor:grab}.tp-graph-measurement:active{cursor:grabbing}.tp-graph-measurement-shape{fill:var(--tp-paper-color,Canvas);stroke:var(--tp-text-color,CanvasText);stroke-width:2px;vector-effect:non-scaling-stroke}.tp-graph-measurement.is-selected .tp-graph-measurement-shape{stroke:var(--tp-brand-stroke-mid,#5268d8);stroke-width:3px}.tp-graph-measurement-label{fill:var(--tp-text-color,CanvasText);paint-order:stroke;stroke:var(--tp-paper-color,Canvas);stroke-width:3px;stroke-linejoin:round;font-size:12px;font-weight:600}.tp-graph-edge-bend-handle{cursor:ew-resize}.tp-graph-edge-bend-handle.is-horizontal{cursor:ns-resize}.tp-graph-edge text{fill:currentColor;paint-order:stroke;stroke:var(--tp-background-color,Canvas);stroke-width:4px;font:12px system-ui,sans-serif}.tp-graph-edge marker path,#tp-graph-arrow path{fill:var(--tp-graph-edge-color,var(--tp-neutral-text-colorful,#657084))}.tp-graph-results,.tp-graph-code{border:1px solid var(--tp-neutral-stroke-soft,#d5dae4);background:var(--tp-paper-color,Canvas);border-radius:.75rem;margin-block-start:.75rem;overflow:hidden}.tp-graph-results[hidden]{display:none}.tp-graph-results-header{border-block-end:1px solid var(--tp-neutral-stroke-soft,#d5dae4);background:var(--tp-neutral-fill-softer,#f6f7fa);letter-spacing:.04em;text-transform:uppercase;margin:0;padding:.55rem .75rem;font-size:.8rem}.tp-graph-results-content{max-width:100%;padding:.75rem;overflow:auto}.tp-graph-results table{border-collapse:collapse;font-variant-numeric:tabular-nums;width:100%}.tp-graph-results th,.tp-graph-results td{border:1px solid var(--tp-neutral-stroke-soft,#d5dae4);text-align:center;padding:.35rem .55rem}.tp-graph-results th{background:var(--tp-neutral-fill-softer,#f6f7fa)}.tp-graph-results svg{min-width:100%;color:var(--tp-text-body,CanvasText);display:block}.tp-graph-results-wave-grid{stroke:var(--tp-neutral-stroke-soft,#d5dae4);stroke-width:1px}.tp-graph-results-wave{fill:none;stroke:var(--tp-brand-stroke-mid,#5268d8);stroke-width:2px;vector-effect:non-scaling-stroke}.tp-graph-results-wave-label,.tp-graph-results-wave-step{fill:currentColor;font:11px system-ui,sans-serif}.tp-graph-petri-results{grid-template-columns:minmax(0,2fr) minmax(10rem,1fr);gap:1rem;display:grid}.tp-graph-petri-results h4{margin:0 0 .5rem}.tp-graph-marking-graph{grid-column:1/-1}.tp-graph-marking-vector{margin-inline:auto;width:auto!important}.tp-graph-results-marking-edge{fill:none;stroke:var(--tp-neutral-text-colorful,#657084);stroke-width:1.5px}.tp-graph-results-marking-node{fill:var(--tp-paper-color,Canvas);stroke:var(--tp-brand-stroke-mid,#5268d8);stroke-width:2px}.tp-graph-marking-graph marker path{fill:var(--tp-neutral-text-colorful,#657084)}.tp-graph-code[hidden]{display:none}.tp-graph-code-header{border-block-end:1px solid var(--tp-neutral-stroke-soft,#d5dae4);background:var(--tp-neutral-fill-softer,#f6f7fa);justify-content:space-between;align-items:center;gap:.5rem;padding:.3rem .45rem .3rem .75rem;display:flex}.tp-graph-code-header>h3{letter-spacing:.04em;text-transform:uppercase;margin:0;font-size:.8rem}.tp-graph-code-header tp-icon-button{--tp-icon-button-size:2rem;--tp-icon-button-icon-size:1.1rem;margin-inline-start:auto}.tp-graph-json-editor{min-height:14rem;max-height:24rem;display:block;overflow:auto}.tp-graph-json-editor[data-invalid]{outline:2px solid var(--tp-danger-stroke-mid,#dc2626);outline-offset:-2px}.tp-graph-code-status{min-height:1.2em;color:var(--tp-danger-text-colorful,#b91c1c);margin:0;padding:0 .75rem .45rem;font-size:.78rem}@media (width<=60rem){.tp-graph-toolbar{flex-wrap:wrap;max-width:calc(100% - 1.3rem)}}@media (width<=32rem){.tp-graph-specific-toolbar{flex-wrap:nowrap}.tp-graph-specific-toolbar>*{flex:none}}@media (width<=42rem){.tp-graph-editor-shell{grid-template-rows:auto 1fr;grid-template-columns:1fr}.tp-graph-palette{border-inline-end:0;border-block-end:1px solid var(--tp-neutral-stroke-soft,#d5dae4)}.tp-graph-palette-items{grid-template-columns:repeat(3,1fr)}}@media (prefers-reduced-motion:reduce){tp-graph-editor,tp-graph-editor *{transition-duration:.01ms!important;transition-delay:0s!important}}", s = {
	version: 1,
	title: "",
	nodes: [],
	edges: []
}, c = "comment", l = "measurement", u = "hub", d = [
	"success",
	"warning",
	"info",
	"danger",
	"brand",
	"neutral"
];
function f(e) {
	return typeof e == "string" && d.includes(e) ? e : "neutral";
}
function p(e) {
	return m(e.label ?? "Comment").length * 17 + 16;
}
function m(e, t = 22) {
	let n = [];
	for (let r of e.split("\n")) {
		let e = r.split(/\s+/).filter(Boolean);
		if (e.length === 0) {
			n.push("");
			continue;
		}
		let i = "", a = [];
		for (let n of e) {
			let e = n;
			for (; e.length > t;) a.push(e.slice(0, t)), e = e.slice(t);
			e !== "" && a.push(e);
		}
		for (let e of a) {
			let r = i === "" ? e : `${i} ${e}`;
			r.length <= t ? i = r : (i !== "" && n.push(i), i = e);
		}
		i !== "" && n.push(i);
	}
	return n.length === 0 ? [""] : n;
}
function h(e) {
	return structuredClone(e);
}
function g(e) {
	let t = e.data?.measurements;
	return Array.isArray(t) ? t.flatMap((e) => {
		if (!e || typeof e != "object") return [];
		let t = e;
		return typeof t.id != "string" || typeof t.position != "number" || !Number.isFinite(t.position) ? [] : [{
			id: t.id,
			position: Math.min(1, Math.max(0, t.position)),
			...typeof t.label == "string" && t.label.trim() !== "" ? { label: t.label } : {}
		}];
	}) : [];
}
function _(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function v(e, t) {
	let n = _(e.label ?? e.type);
	return `<circle r="31" class="tp-graph-shape${t ? " is-selected" : ""}" />
    <text class="tp-graph-label" text-anchor="middle" dominant-baseline="central">${n}</text>`;
}
function y(e, t, n) {
	return typeof e == "function" ? e(t) : e ?? n;
}
function b(e, t, n) {
	if (n?.ports) return C(n, e).reduce((r, i) => {
		let a = w(e, r, n), o = w(e, i, n);
		return Math.hypot(o.x - t.x, o.y - t.y) < Math.hypot(a.x - t.x, a.y - t.y) ? i : r;
	});
	let r = t.x - e.x, i = t.y - e.y, a = Math.max(1, y(n?.width, e, 64) / 2), o = Math.max(1, y(n?.height, e, 64) / 2);
	return Math.abs(r / a) >= Math.abs(i / o) ? r >= 0 ? "east" : "west" : i >= 0 ? "south" : "north";
}
var x = [
	"north",
	"east",
	"south",
	"west"
];
function S(e, t) {
	if (e?.ports) return typeof e.ports == "function" ? e.ports(t) : e.ports;
}
function C(e, t) {
	if (!e?.ports) return [...x];
	let n = S(e, t), r = x.filter((e) => n?.[e] !== void 0);
	return r.length > 0 ? r : [...x];
}
function w(e, t, n) {
	let r = S(n, e)?.[t];
	if (r !== void 0) {
		let t = typeof r == "function" ? r(e) : r;
		return {
			x: e.x + t.x,
			y: e.y + t.y
		};
	}
	let i = y(n?.width, e, 64) / 2, a = y(n?.height, e, 64) / 2;
	return t === "north" ? {
		x: e.x,
		y: e.y - a
	} : t === "east" ? {
		x: e.x + i,
		y: e.y
	} : t === "south" ? {
		x: e.x,
		y: e.y + a
	} : {
		x: e.x - i,
		y: e.y
	};
}
var T = {
	id: "generic",
	label: "General",
	shapes: [{
		type: "node",
		label: "Node",
		width: 64,
		height: 64
	}, {
		type: "hub",
		label: "Hub",
		description: "Four-port connection hub",
		width: 32,
		height: 32,
		render: (e, t) => `<rect x="-16" y="-16" width="32" height="32" rx="4" class="tp-graph-shape tp-graph-hub${t ? " is-selected" : ""}" />
        <text class="tp-graph-label" text-anchor="middle" dominant-baseline="central">${_(e.label ?? "Hub")}</text>`
	}]
}, E = {
	id: "annotations",
	label: "Annotations",
	shapes: [{
		type: c,
		label: "Comment",
		description: "Free text area",
		width: 160,
		height: p,
		createData: () => ({ color: "neutral" }),
		render: (e, t) => {
			let n = m(e.label ?? "Comment"), r = p(e), i = f(e.data?.color);
			return `<rect x="-80" y="${-r / 2}" width="160" height="${r}" rx="5" class="tp-graph-shape tp-graph-comment tp-graph-comment-${i}${t ? " is-selected" : ""}" />
        <text class="tp-graph-label tp-graph-comment-label" x="-68" y="${-r / 2 + 17}">${n.map((e, t) => `<tspan x="-68" dy="${t === 0 ? 0 : 17}">${_(e)}</tspan>`).join("")}</text>`;
		}
	}, {
		type: l,
		label: "Measurement",
		description: "Named measurement point attached to a link",
		width: 18,
		height: 18,
		render: () => "<rect x=\"-5\" y=\"-5\" width=\"10\" height=\"10\" class=\"tp-graph-measurement-shape\" />"
	}]
}, D = class c extends e {
	static styleId = "tp-graph-editor-styles";
	static editorCounter = 0;
	graphValue = h(s);
	palettes = /* @__PURE__ */ new Map();
	simulators = /* @__PURE__ */ new Map();
	selectedId = null;
	selectedIds = /* @__PURE__ */ new Set();
	selectionMode = !1;
	selectionDraft = null;
	activeShapeType = "node";
	drag = null;
	connectionDraft = null;
	edgeReconnectDraft = null;
	edgeBendDrag = null;
	measurementDrag = null;
	minimapDrag = null;
	edgeDrag = null;
	idCounter = 0;
	initialized = !1;
	initializationScheduled = !1;
	initializationObserver = null;
	interactionBound = !1;
	initialGraphSourceSnapshot = null;
	sourceFilename = null;
	zoomValue = 1;
	commentPaletteColor = "neutral";
	activeEdgeDirection = "forward";
	activeEdgeRouting = "straight";
	activeEdgeElbows = 2;
	activeEdgeDeparture = "horizontal";
	activeEdgeTurns = "alternating";
	paletteOpenIndexes = "";
	pan = {
		x: 0,
		y: 0
	};
	viewportPixels = {
		x: 800,
		y: 448
	};
	viewportResizeObserver = null;
	graphCodeEditor = null;
	graphCodeEditorBound = !1;
	graphCodeVisible = !1;
	graphCodeInitialized = !1;
	pendingGraphCodeSource = null;
	undoStack = [];
	redoStack = [];
	committedGraph = h(s);
	clipboard = null;
	pasteCount = 0;
	static minimumZoom = .25;
	static maximumZoom = 4;
	static zoomFactor = 1.2;
	static get observedAttributes() {
		return [
			"readonly",
			"grid",
			"grid-size",
			"ports-visible",
			"message",
			"src"
		];
	}
	constructor() {
		super(), this.registerPalette(T), this.registerPalette(E);
	}
	get value() {
		return h(this.graphValue);
	}
	set value(e) {
		this.setGraph(e);
	}
	get readonly() {
		return this.hasAttribute("readonly");
	}
	set readonly(e) {
		this.toggleAttribute("readonly", e);
	}
	get src() {
		return this.getAttribute("src")?.trim() ?? "";
	}
	set src(e) {
		e.trim() === "" ? this.removeAttribute("src") : this.setAttribute("src", e);
	}
	get portsVisible() {
		return this.hasAttribute("ports-visible");
	}
	set portsVisible(e) {
		this.toggleAttribute("ports-visible", e);
	}
	get zoom() {
		return this.zoomValue;
	}
	set zoom(e) {
		this.setZoom(e);
	}
	get message() {
		return this.getAttribute("message") ?? "";
	}
	set message(e) {
		e === "" ? this.removeAttribute("message") : this.setAttribute("message", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.id === "" && (c.editorCounter += 1, this.id = `tp-graph-editor-${c.editorCounter}`), this.ensureGlobalStyle(c.styleId, o), this.scheduleInitialization();
	}
	disconnectedCallback() {
		this.viewportResizeObserver?.disconnect(), this.viewportResizeObserver = null;
	}
	attributeChangedCallback() {
		this.isConnected && this.initialized && this.render();
	}
	scheduleInitialization() {
		if (!(this.initialized || this.initializationScheduled)) {
			if (this.initializationScheduled = !0, this.src !== "" || t("graph", this) !== null) {
				this.initializeEditor();
				return;
			}
			this.initializationObserver = new MutationObserver(() => {
				t("graph", this) !== null && this.initializeEditor();
			}), this.initializationObserver.observe(this, { childList: !0 }), window.requestAnimationFrame(() => {
				this.initializeEditor();
			});
		}
	}
	async initializeEditor() {
		if (!(!this.isConnected || this.initialized)) {
			this.initializationObserver?.disconnect(), this.initializationObserver = null, this.initializationScheduled = !1;
			try {
				await this.readInitialGraph();
			} catch (e) {
				this.dispatchEvent(new CustomEvent("tp-graph-error", {
					bubbles: !0,
					detail: {
						error: e,
						operation: "load-src",
						src: this.src
					}
				}));
			}
			this.committedGraph = h(this.graphValue), this.initialized = !0, this.bindCanvasInteraction(), this.render();
		}
	}
	setGraph(e) {
		this.validateGraph(e);
		let t = h(this.graphValue);
		this.graphValue = {
			...h(e),
			title: e.title ?? ""
		}, this.normalizeSelfLinks(), this.selectedId = null, this.selectedIds.clear(), this.initialized && JSON.stringify(t) !== JSON.stringify(this.graphValue) && (this.undoStack.push(t), this.redoStack = []), this.committedGraph = h(this.graphValue), this.isConnected && this.render();
	}
	copy() {
		if (this.selectedIds.size === 0) return !1;
		let e = new Set(this.graphValue.nodes.filter((e) => this.selectedIds.has(e.id)).map((e) => e.id)), t = this.graphValue.nodes.filter((t) => e.has(t.id)), n = this.graphValue.edges.filter((t) => this.selectedIds.has(t.id) || t.source !== void 0 && t.target !== void 0 && e.has(t.source) && e.has(t.target));
		return this.clipboard = {
			nodes: structuredClone(t),
			edges: structuredClone(n)
		}, this.pasteCount = 0, this.render(), !0;
	}
	cut() {
		if (this.readonly || !this.copy()) return !1;
		let e = new Set(this.selectedIds);
		return this.graphValue.nodes = this.graphValue.nodes.filter((t) => !e.has(t.id)), this.graphValue.edges = this.graphValue.edges.filter((t) => !e.has(t.id) && (t.source === void 0 || !e.has(t.source)) && (t.target === void 0 || !e.has(t.target))), this.removeMeasurements(e), this.select(null), this.changed("cut"), !0;
	}
	paste() {
		if (this.readonly || !this.clipboard) return null;
		this.pasteCount += 1;
		let e = 24 * this.pasteCount, t = /* @__PURE__ */ new Map(), n = [];
		for (let r of this.clipboard.nodes) {
			let i = structuredClone(r);
			i.id = this.nextId("node"), t.set(r.id, i.id), i.x = this.snap(i.x + e), i.y = this.snap(i.y + e), this.graphValue.nodes.push(i), n.push(i.id);
		}
		for (let r of this.clipboard.edges) {
			let i = structuredClone(r), a = this.edgePoints(r);
			i.id = this.nextId("edge"), i.source = r.source ? t.get(r.source) : void 0, i.target = r.target ? t.get(r.target) : void 0, !i.source && a && (i.sourcePort = void 0, i.sourcePoint = {
				x: a.start.x + e,
				y: a.start.y + e
			}), !i.target && a && (i.targetPort = void 0, i.targetPoint = {
				x: a.end.x + e,
				y: a.end.y + e
			}), i.bendX !== void 0 && (i.bendX += e), i.bendY !== void 0 && (i.bendY += e), this.graphValue.edges.push(i), n.push(i.id);
		}
		return this.selectMany(n), this.changed("paste"), n[0] ?? null;
	}
	undo() {
		let e = this.undoStack.pop();
		return e ? (this.redoStack.push(h(this.graphValue)), this.restoreHistoryGraph(e, "undo"), !0) : !1;
	}
	redo() {
		let e = this.redoStack.pop();
		return e ? (this.undoStack.push(h(this.graphValue)), this.restoreHistoryGraph(e, "redo"), !0) : !1;
	}
	registerPalette(e) {
		if (!e.id || e.shapes.length === 0) throw TypeError("A palette needs an id and at least one shape.");
		this.palettes.set(e.id, e), this.activeShapeType === "" && (this.activeShapeType = e.shapes[0]?.type ?? ""), this.isConnected && this.initialized && this.render();
	}
	unregisterPalette(e) {
		let t = this.palettes.get(e);
		this.palettes.delete(e), t?.shapes.some((e) => e.type === this.activeShapeType) && (this.activeShapeType = [...this.palettes.values()][0]?.shapes[0]?.type ?? ""), this.isConnected && this.initialized && this.render();
	}
	registerSimulator(e, t) {
		this.simulators.set(e, t);
	}
	setZoom(e) {
		if (!Number.isFinite(e) || e <= 0) throw TypeError("The zoom must be a positive finite number.");
		this.zoomValue = Math.min(c.maximumZoom, Math.max(c.minimumZoom, e)), this.isConnected && this.initialized && this.render();
	}
	zoomIn() {
		this.setZoom(this.zoomValue * c.zoomFactor);
	}
	zoomOut() {
		this.setZoom(this.zoomValue / c.zoomFactor);
	}
	resetZoom() {
		this.setZoom(1);
	}
	exportJson(e = !0) {
		return JSON.stringify(this.value, null, e ? 2 : 0);
	}
	exportSvg() {
		let e = this.querySelector(".tp-graph-canvas");
		if (!e) throw Error("The graph canvas is not ready.");
		let t = e.cloneNode(!0), n = this.exportContentBounds(e), r = this.graphValue.title ? 36 : 0, i = Math.max(1, Math.ceil(n.width + 48)), a = Math.max(1, Math.ceil(n.height + 48 + r));
		t.setAttribute("xmlns", "http://www.w3.org/2000/svg"), t.setAttribute("width", String(i)), t.setAttribute("height", String(a)), t.setAttribute("viewBox", `0 0 ${i} ${a}`);
		let o = [e, ...e.querySelectorAll("*")], s = [t, ...t.querySelectorAll("*")];
		for (let [e, t] of o.entries()) {
			let n = s[e];
			if (!n) continue;
			let r = getComputedStyle(t);
			for (let e of [
				"color",
				"fill",
				"stroke",
				"stroke-width",
				"stroke-dasharray",
				"opacity",
				"font",
				"font-family",
				"font-size",
				"font-weight",
				"dominant-baseline",
				"paint-order"
			]) {
				let t = r.getPropertyValue(e), i = t.trim().toLowerCase() === "currentcolor" ? r.getPropertyValue("color") : t;
				i !== "" && n.style.setProperty(e, i);
			}
		}
		for (let e of t.querySelectorAll(".tp-graph-edge text")) e.style.setProperty("paint-order", "stroke fill"), e.style.setProperty("stroke-linejoin", "round");
		t.querySelector(".tp-graph-scene")?.setAttribute("transform", `translate(${24 - n.x} ${24 + r - n.y})`);
		for (let e of t.querySelectorAll(".tp-graph-port, .tp-graph-port-layer, .tp-graph-edge-handle, .tp-graph-edge-hit-area, .tp-petri-fire-control, .tp-graph-connection-draft, .tp-graph-selection-area, .tp-graph-selection-indicator")) e.remove();
		let c = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		c.setAttribute("width", "100%"), c.setAttribute("height", "100%"), c.setAttribute("fill", getComputedStyle(e).backgroundColor || "#fff"), t.prepend(c);
		let l = document.createElementNS("http://www.w3.org/2000/svg", "style");
		if (l.textContent = ".tp-graph-shape{fill:#fff;stroke:#5268d8;stroke-width:2}.tp-graph-edge-line{fill:none;stroke:#657084;stroke-width:2}.tp-graph-label,.tp-graph-edge text{fill:#172033;font:13px system-ui,sans-serif}.tp-graph-comment-neutral{fill:#f3f4f6;stroke:#d1d5db}.tp-graph-comment-success{fill:#dcfce7;stroke:#86efac}.tp-graph-comment-warning{fill:#fef3c7;stroke:#fcd34d}.tp-graph-comment-info{fill:#dbeafe;stroke:#93c5fd}.tp-graph-comment-danger{fill:#fee2e2;stroke:#fca5a5}.tp-graph-comment-brand{fill:#e0e7ff;stroke:#a5b4fc}.tp-petri-transition{fill:#263248}.tp-petri-token,.tp-petri-token-count{fill:#172033}", t.prepend(l), this.graphValue.title) {
			let e = document.createElementNS("http://www.w3.org/2000/svg", "text");
			e.setAttribute("x", "50%"), e.setAttribute("y", "24"), e.setAttribute("text-anchor", "middle"), e.setAttribute("class", "tp-graph-label"), e.textContent = this.graphValue.title, t.append(e);
		}
		return new XMLSerializer().serializeToString(t);
	}
	exportContentBounds(e) {
		let t = e.querySelector(".tp-graph-scene");
		try {
			let e = t?.getBBox();
			if (e && e.width > 0 && e.height > 0) return {
				x: e.x,
				y: e.y,
				width: e.width,
				height: e.height
			};
		} catch {}
		let n = [];
		for (let e of this.graphValue.nodes) {
			let t = this.findShape(e.type), r = y(t?.width, e, 64) / 2 + 24, i = y(t?.height, e, 64) / 2 + 24;
			n.push({
				x: e.x - r,
				y: e.y - i
			}), n.push({
				x: e.x + r,
				y: e.y + i
			});
		}
		for (let e of this.graphValue.edges) {
			let t = this.edgePoints(e);
			t && n.push(t.start, t.end), e.bendX !== void 0 && t && n.push({
				x: e.bendX,
				y: t.start.y
			}, {
				x: e.bendX,
				y: t.end.y
			}), e.bendY !== void 0 && t && n.push({
				x: t.start.x,
				y: e.bendY
			}, {
				x: t.end.x,
				y: e.bendY
			});
		}
		if (n.length === 0) return {
			x: 0,
			y: 0,
			width: this.viewportPixels.x,
			height: this.viewportPixels.y
		};
		let r = Math.min(...n.map((e) => e.x)), i = Math.min(...n.map((e) => e.y)), a = Math.max(...n.map((e) => e.x)), o = Math.max(...n.map((e) => e.y));
		return {
			x: r,
			y: i,
			width: Math.max(1, a - r),
			height: Math.max(1, o - i)
		};
	}
	importJson(e) {
		let t = JSON.parse(e);
		this.validateGraph(t), this.setGraph(t), this.dispatchEvent(new CustomEvent("tp-graph-import", {
			bubbles: !0,
			detail: { graph: this.value }
		}));
	}
	setElementLabel(e, t) {
		let n = this.measurement(e);
		if (n) {
			let e = t.trim();
			n.measurement.label = e === "" ? void 0 : e, n.edge.data = {
				...n.edge.data ?? {},
				measurements: n.measurements
			}, this.changed("label");
			return;
		}
		let r = this.node(e) ?? this.graphValue.edges.find((t) => t.id === e);
		if (!r) throw TypeError(`Unknown graph element: ${e}`);
		let i = t.trim();
		i === "" ? r.label = void 0 : r.label = i, this.changed("label");
	}
	setTitle(e) {
		let t = e.trim();
		this.graphValue.title = t, this.changed("set-title");
	}
	setCommentColor(e, t) {
		if (!d.includes(t)) throw TypeError(`Unsupported comment color: ${t}`);
		let n = this.node(e);
		if (!n || n.type !== "comment") throw TypeError(`Unknown graph comment: ${e}`);
		n.data = {
			...n.data ?? {},
			color: t
		}, this.changed("set-comment-color");
	}
	addNode(e, t, n) {
		let r = this.findShape(e), i = {
			id: this.nextId("node"),
			type: e,
			x: this.snap(t.x),
			y: this.snap(t.y),
			label: n ?? r?.label ?? e,
			data: r?.createData?.()
		};
		return this.graphValue.nodes.push(i), this.changed("add-node"), structuredClone(i);
	}
	addEdge(e, t, n = "edge", r, i, a = this.activeEdgeDirection, o = this.activeEdgeRouting) {
		this.validateConnection(e, t, n);
		let s = {
			id: this.nextId("edge"),
			source: e,
			target: t,
			type: n,
			sourcePort: r,
			targetPort: i,
			direction: a,
			routing: o,
			...o === "orthogonal" ? {
				elbows: this.activeEdgeElbows,
				departure: this.activeEdgeDeparture,
				turns: this.activeEdgeTurns
			} : {}
		};
		return this.normalizeSelfLink(s), this.graphValue.edges.push(s), this.changed("add-edge"), structuredClone(s);
	}
	addMeasurement(e, t = .5, n) {
		let r = this.graphValue.edges.find((t) => t.id === e);
		if (!r) throw TypeError(`Unknown graph edge: ${e}`);
		let i = {
			id: this.nextId("measurement"),
			position: Math.min(1, Math.max(0, t)),
			...n?.trim() ? { label: n.trim() } : {}
		};
		return r.data = {
			...r.data ?? {},
			measurements: [...g(r), i]
		}, this.changed("add-measurement"), structuredClone(i);
	}
	moveMeasurement(e, t) {
		let n = this.measurement(e);
		if (!n) throw TypeError(`Unknown graph measurement: ${e}`);
		n.measurement.position = Math.min(1, Math.max(0, t)), n.edge.data = {
			...n.edge.data ?? {},
			measurements: n.measurements
		}, this.changed("move-measurement");
	}
	reconnectEdge(e, t, n, r) {
		let i = this.graphValue.edges.find((t) => t.id === e);
		if (!i) throw TypeError(`Unknown graph edge: ${e}`);
		let a = i.source !== void 0 && i.source === i.target, o = t === "source" ? n : i.source, s = t === "target" ? n : i.target;
		return o !== void 0 && s !== void 0 && this.validateConnection(o, s, i.type ?? "edge"), t === "source" ? (i.source = n, i.sourcePort = r, i.sourcePoint = void 0) : (i.target = n, i.targetPort = r, i.targetPoint = void 0), !a && i.source !== void 0 && i.source === i.target && (i.sourcePort = void 0, i.targetPort = void 0), this.normalizeSelfLink(i, t), this.changed("reconnect-edge"), structuredClone(i);
	}
	setEdgeDirection(e, t) {
		if (!this.edgeDirections().includes(t)) throw TypeError(`Unsupported edge direction: ${t}`);
		let n = this.graphValue.edges.find((t) => t.id === e);
		if (!n) throw TypeError(`Unknown graph edge: ${e}`);
		n.direction = t, this.activeEdgeDirection = t, this.changed("set-edge-direction");
	}
	setEdgeRouting(e, t) {
		let n = this.graphValue.edges.find((t) => t.id === e);
		if (!n) throw TypeError(`Unknown graph edge: ${e}`);
		n.routing = t, this.activeEdgeRouting = t, this.changed("set-edge-routing");
	}
	setEdgeOrthogonal(e, t, n, r = "alternating") {
		let i = this.graphValue.edges.find((t) => t.id === e);
		if (!i) throw TypeError(`Unknown graph edge: ${e}`);
		i.routing = "orthogonal", i.elbows = t, i.departure = n, i.turns = t === 2 ? r : "alternating", this.activeEdgeRouting = "orthogonal", this.activeEdgeElbows = t, this.activeEdgeDeparture = n, this.activeEdgeTurns = i.turns, this.changed("set-edge-routing");
	}
	validateConnection(e, t, n) {
		let r = this.node(e);
		if (!r || !this.node(t)) throw TypeError("Both edge endpoints must exist.");
		if (e === t && r.type === "hub") throw TypeError("Self-links are not allowed on hubs.");
	}
	removeElement(e) {
		this.graphValue.nodes = this.graphValue.nodes.filter((t) => t.id !== e), this.graphValue.edges = this.graphValue.edges.filter((t) => t.id !== e && t.source !== e && t.target !== e), this.removeMeasurements(/* @__PURE__ */ new Set([e])), this.selectedIds.delete(e), this.selectedId === e && this.selectMany([...this.selectedIds]), this.changed("remove");
	}
	async step(e) {
		let t = this.simulators.get(e);
		if (!t) throw TypeError(`Unknown graph simulator: ${e}`);
		let n = await t(this.value);
		await this.animateTransition(n), this.dispatchEvent(new CustomEvent("tp-graph-simulation-step", {
			bubbles: !0,
			detail: {
				simulator: e,
				graph: this.value
			}
		}));
	}
	async animateTransition(e) {
		for (let [t, n] of Object.entries(e.nodes ?? {})) {
			let e = this.node(t);
			e && Object.assign(e, n, { id: t });
		}
		for (let [t, n] of Object.entries(e.edges ?? {})) {
			let e = this.graphValue.edges.find((e) => e.id === t);
			e && Object.assign(e, n, { id: t });
		}
		this.render();
		let t = Math.max(0, e.duration ?? 300);
		for (let e of this.querySelectorAll("[data-node-id], [data-edge-id]")) e.animate?.([{ opacity: .55 }, { opacity: 1 }], {
			duration: t,
			easing: "ease-out"
		});
		t > 0 && await new Promise((e) => window.setTimeout(e, t)), this.changed("simulation");
	}
	async readInitialGraph() {
		if (this.src !== "") {
			let e = await fetch(this.src);
			if (!e.ok) throw Error(`Unable to load graph JSON (${e.status} ${e.statusText}).`);
			let t = JSON.parse(await e.text());
			this.validateGraph(t), this.sourceFilename = this.filenameFromSource(this.src), this.setGraph(t);
			return;
		}
		let e = this.readGraphSource();
		if (e === "") return;
		let t = JSON.parse(e);
		this.validateGraph(t), this.setGraph(t);
	}
	readGraphSource() {
		let e = t("graph", this);
		if (e !== null) {
			let t = e.value;
			return t.trim() !== "" && (this.initialGraphSourceSnapshot = t), t;
		}
		return this.initialGraphSourceSnapshot ?? "";
	}
	validateGraph(e) {
		let t = i.safeParse(e);
		if (!t.success) throw TypeError(`Invalid tp/graph document:\n${a(t.error)}`);
	}
	normalizeSelfLinks() {
		for (let e of this.graphValue.edges) this.normalizeSelfLink(e);
	}
	normalizeSelfLink(e, t = "target") {
		if (e.source === void 0 || e.source !== e.target) return;
		let n = [
			"north",
			"east",
			"south",
			"west"
		], r = [
			["east", "north"],
			["south", "west"],
			["north", "west"],
			["east", "south"]
		], i = {
			north: ["west", "east"],
			east: ["north", "south"],
			south: ["east", "west"],
			west: ["south", "north"]
		}, a = new Map(n.map((e) => [e, 0])), o = (t, n) => this.graphValue.edges.filter((r) => r.id !== e.id && r.source === e.source && r.target === e.target && (r.sourcePort === t && r.targetPort === n || r.sourcePort === n && r.targetPort === t)).length;
		for (let t of this.graphValue.edges) t.id === e.id || t.source !== e.source || t.target !== e.target || (t.sourcePort && a.set(t.sourcePort, (a.get(t.sourcePort) ?? 0) + 1), t.targetPort && a.set(t.targetPort, (a.get(t.targetPort) ?? 0) + 1));
		if (!e.sourcePort && !e.targetPort) {
			let t = r.reduce((e, t) => {
				let n = (a.get(t[0]) ?? 0) + (a.get(t[1]) ?? 0), r = (a.get(e[0]) ?? 0) + (a.get(e[1]) ?? 0);
				return n === r ? o(t[0], t[1]) < o(e[0], e[1]) ? t : e : n < r ? t : e;
			});
			[e.sourcePort, e.targetPort] = t;
		} else e.sourcePort && !e.targetPort ? e.targetPort = i[e.sourcePort].reduce((t, n) => {
			let r = a.get(n) ?? 0, i = a.get(t) ?? 0;
			return r === i ? o(e.sourcePort, n) < o(e.sourcePort, t) ? n : t : r < i ? n : t;
		}) : !e.sourcePort && e.targetPort && (e.sourcePort = i[e.targetPort].reduce((t, n) => {
			let r = a.get(n) ?? 0, i = a.get(t) ?? 0;
			return r === i ? o(n, e.targetPort) < o(t, e.targetPort) ? n : t : r < i ? n : t;
		}));
		if (!e.sourcePort || !e.targetPort || e.sourcePort !== e.targetPort) return;
		let s = {
			north: "east",
			east: "south",
			south: "west",
			west: "north"
		};
		t === "source" ? e.sourcePort = s[e.targetPort] : e.targetPort = s[e.sourcePort];
	}
	render() {
		let e = this.querySelector(".tp-graph-palette-accordion");
		e && (this.paletteOpenIndexes = e.getAttribute("open-indexes") ?? "");
		let t = this.querySelector("tp-color")?.getAttribute("preset") ?? "tp-default", n = this.querySelector("tp-theme")?.getAttribute("mode"), r = n === "light" || n === "dark" ? n : "auto", i = this.querySelector(".tp-graph-canvas")?.getBoundingClientRect();
		i && i.width > 0 && i.height > 0 && (this.viewportPixels = {
			x: i.width,
			y: i.height
		});
		let a = [...this.palettes.values()], o = this.renderToolbarActions().replaceAll("<tp-icon-button ", "<tp-icon-button size=\"xs\" "), s = this.selectedId === null ? void 0 : this.node(this.selectedId), c = s?.type === "comment" ? f(s.data?.color) : null, l = this.id === "" ? "" : ` anchor="#${_(CSS.escape(this.id))}"`, u = this.querySelector(":scope > .tp-graph-interface");
		if (u ||= (this.innerHTML = "<div class=\"tp-graph-interface\"></div><section class=\"tp-graph-results\" hidden></section><section class=\"tp-graph-code\" hidden><div class=\"tp-graph-code-header\"><h3>Graph JSON</h3><tp-icon-button size=\"xs\" name=\"keyboard-f1\" label=\"Toggle editor toolbar\" title=\"Toggle editor toolbar (F1)\" data-action=\"editor-toolbar\"></tp-icon-button><tp-icon-button size=\"xs\" name=\"sync\" label=\"Synchronize graph and JSON\" data-action=\"sync-json\"></tp-icon-button></div><div class=\"tp-graph-code-editor-slot\"></div><p class=\"tp-graph-code-status\" role=\"status\" aria-live=\"polite\"></p></section>", this.querySelector(":scope > .tp-graph-interface")), !u) return;
		u.innerHTML = `<div class="tp-graph-editor-shell">
      <aside class="tp-graph-palette" aria-label="Shape palette">
        <div class="tp-graph-palette-controls" role="toolbar" aria-label="Palette sections">
          <tp-icon-button size="xs" name="arrow-expand-vertical" label="Expand all" data-action="palette-expand"></tp-icon-button>
          <tp-icon-button size="xs" name="arrow-collapse-vertical" label="Collapse all" data-action="palette-collapse"></tp-icon-button>
        </div>
        ${this.renderPalettes(a)}
        ${this.renderMinimap()}
      </aside>
      <div class="tp-graph-workspace">
        <div class="tp-graph-toolbar" role="toolbar" aria-label="Graph tools">
          <tp-icon-button size="xs" name="undo" label="Undo" data-action="undo" ${this.undoStack.length === 0 || this.readonly ? "disabled" : ""}></tp-icon-button>
          <tp-icon-button size="xs" name="redo" label="Redo" data-action="redo" ${this.redoStack.length === 0 || this.readonly ? "disabled" : ""}></tp-icon-button>
          <tp-icon-button size="xs" name="select" label="Select area" data-action="select-area" class="${this.selectionMode ? "is-active" : ""}" aria-pressed="${String(this.selectionMode)}"></tp-icon-button>
          <tp-icon-button size="xs" name="content-copy" label="Copy" data-action="copy" ${this.selectedIds.size === 0 ? "disabled" : ""}></tp-icon-button>
          <tp-icon-button size="xs" name="content-cut" label="Cut" data-action="cut" ${this.selectedIds.size === 0 || this.readonly ? "disabled" : ""}></tp-icon-button>
          <tp-icon-button size="xs" name="content-paste" label="Paste" data-action="paste" ${this.clipboard === null || this.readonly ? "disabled" : ""}></tp-icon-button>
          <tp-icon-button size="xs" name="text-short" label="Label" data-action="label" ${this.selectedId === null || this.readonly ? "disabled" : ""}></tp-icon-button>
          <span class="tp-graph-toolbar-separator" aria-hidden="true"></span>
          <tp-icon-button size="xs" name="format-title" label="Graph title" data-action="title" ${this.readonly ? "disabled" : ""}></tp-icon-button>
          <tp-icon-button size="xs" name="magnify-minus-outline" label="Zoom out" data-action="zoom-out"></tp-icon-button>
          <tp-icon-button size="xs" name="magnify-plus-outline" label="Zoom in" data-action="zoom-in"></tp-icon-button>
          <tp-icon-button size="xs" name="grid" label="Show or hide grid" data-action="toggle-grid" aria-pressed="${String(this.hasAttribute("grid"))}"></tp-icon-button>
          <span class="tp-graph-toolbar-separator" aria-hidden="true"></span>
          <tp-icon-button size="xs" name="file-upload" label="Import JSON" data-action="import" ${this.readonly ? "disabled" : ""}></tp-icon-button>
          <tp-icon-button size="xs" name="file-download" label="Export JSON" data-action="export"></tp-icon-button>
          <tp-save-image${l} name="image-download" filename="graph" size="xs"></tp-save-image>
          <tp-icon-button size="xs" name="language-json" label="Show or hide graph JSON" data-action="toggle-json" aria-pressed="${String(this.graphCodeVisible)}"></tp-icon-button>
          <input class="tp-graph-import-input" data-role="import" type="file" accept="application/json,.json" tabindex="-1" aria-hidden="true" />
          <label class="tp-graph-comment-color-label" ${c === null ? "hidden" : ""}>Color <select data-action="comment-color" ${this.readonly ? "disabled" : ""}>${d.map((e) => `<option value="${e}" ${e === (c ?? "neutral") ? "selected" : ""}>${e}</option>`).join("")}</select></label>
          <span class="tp-graph-toolbar-spacer"></span>
          <tp-color${l} preset="${_(t)}" size="xs"></tp-color>
          <tp-theme${l} mode="${r}" size="xs"></tp-theme>
          <tp-fullscreen${l} size="xs"></tp-fullscreen>
        </div>
        <div class="tp-graph-canvas-frame">
          ${this.graphValue.title ? `<h2 class="tp-graph-title">${_(this.graphValue.title)}</h2>` : ""}
          <svg class="tp-graph-canvas" tabindex="0" role="application" aria-label="Graph editor">
            <defs><marker id="tp-graph-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>
            <g class="tp-graph-scene" transform="translate(${-this.pan.x * this.zoomValue} ${-this.pan.y * this.zoomValue}) scale(${this.zoomValue})">
              <g class="tp-graph-edges">${this.graphValue.edges.map((e) => this.renderEdge(e)).join("")}</g>
              <g class="tp-graph-nodes">${this.graphValue.nodes.map((e) => this.renderNode(e)).join("")}</g>
              <g class="tp-graph-port-layer">${this.graphValue.nodes.map((e) => this.renderPortOverlay(e)).join("")}</g>
              ${this.renderSelectionDraft()}
            </g>
          </svg>
        </div>
        <div class="tp-graph-specific-toolbar" role="toolbar" aria-label="Domain tools">
          ${o}
          <span class="tp-graph-toolbar-spacer"></span>
          <span class="tp-graph-toolbar-message" role="status" aria-live="polite">${_(this.message)}</span>
        </div>
      </div>
    </div>`;
		let p = this.renderResults(), m = this.querySelector(":scope > .tp-graph-results");
		m && (m.hidden = p === "", m.innerHTML = p);
		let h = this.querySelector(":scope > .tp-graph-code");
		h && (h.hidden = !this.graphCodeVisible), this.syncRenderedMeasurementPositions(), this.setPan(this.pan.x, this.pan.y), this.ensureGraphCodeEditor(), this.observeCanvasViewport(), this.bindEvents();
	}
	observeCanvasViewport() {
		if (typeof ResizeObserver > "u") return;
		let e = this.querySelector(".tp-graph-canvas");
		e && (this.viewportResizeObserver?.disconnect(), this.viewportResizeObserver = new ResizeObserver((e) => {
			let t = e[0]?.contentRect;
			!t || t.width <= 0 || t.height <= 0 || Math.abs(t.width - this.viewportPixels.x) < .5 && Math.abs(t.height - this.viewportPixels.y) < .5 || (this.viewportPixels = {
				x: t.width,
				y: t.height
			}, this.render());
		}), this.viewportResizeObserver.observe(e));
	}
	ensureGraphCodeEditor() {
		let e = this.querySelector(":scope > .tp-graph-code .tp-graph-code-editor-slot");
		e && (this.graphCodeEditor || (this.graphCodeEditor = document.createElement("tp-code-editor"), this.graphCodeEditor.className = "tp-graph-json-editor", this.graphCodeEditor.setAttribute("language", "json"), this.graphCodeEditor.setAttribute("line-numbers", ""), this.graphCodeEditor.setAttribute("fold-gutter", ""), this.graphCodeEditor.setAttribute("word-wrap", ""), this.graphCodeEditor.setAttribute("aria-label", "Graph JSON")), this.graphCodeEditor.toggleAttribute("readonly", this.readonly), this.graphCodeEditor.isConnected || e.append(this.graphCodeEditor), this.graphCodeInitialized ||= (this.writeGraphCode(this.exportJson()), !0), this.graphCodeEditorBound || (this.graphCodeEditorBound = !0, this.graphCodeEditor.addEventListener("tp-code-editor-input", (e) => {
			if (this.readonly) return;
			let t = e.detail.value;
			this.pendingGraphCodeSource = t, this.graphCodeEditor?.setAttribute("data-dirty", "");
		}), this.querySelector("[data-action=\"sync-json\"]")?.addEventListener("click", () => this.syncGraphCode())));
	}
	writeGraphCode(e) {
		this.graphCodeEditor && (typeof this.graphCodeEditor.getValue == "function" ? this.graphCodeEditor.getValue() : this.graphCodeEditor.getAttribute("value") ?? "") !== e && (typeof this.graphCodeEditor.setValue == "function" ? this.graphCodeEditor.setValue(e) : this.graphCodeEditor.setAttribute("value", e));
	}
	syncGraphCode() {
		if (this.pendingGraphCodeSource !== null && !this.readonly) {
			this.applyGraphCode(this.pendingGraphCodeSource);
			return;
		}
		this.writeGraphCode(this.exportJson()), this.graphCodeEditor?.removeAttribute("data-invalid");
		let e = this.querySelector(":scope > .tp-graph-code .tp-graph-code-status");
		e && (e.textContent = "");
	}
	applyGraphCode(e) {
		let t = this.querySelector(":scope > .tp-graph-code .tp-graph-code-status");
		try {
			let n = JSON.parse(e);
			this.validateGraph(n), this.graphValue = {
				...h(n),
				title: n.title ?? ""
			}, this.normalizeSelfLinks(), this.selectedId = null, this.selectedIds.clear(), this.render(), this.pendingGraphCodeSource = null, this.graphCodeEditor?.removeAttribute("data-invalid"), this.graphCodeEditor?.removeAttribute("data-dirty"), t && (t.textContent = ""), this.dispatchEvent(new CustomEvent("tp-graph-change", {
				bubbles: !0,
				detail: {
					reason: "edit-json",
					graph: this.value
				}
			}));
		} catch (e) {
			this.graphCodeEditor?.setAttribute("data-invalid", ""), t && (t.textContent = e instanceof Error ? e.message : "Invalid graph JSON.");
		}
	}
	renderNode(e) {
		let t = this.findShape(e.type), n = y(t?.width, e, 64), r = y(t?.height, e, 64), i = C(t, e).map((n) => {
			let r = w({
				...e,
				x: 0,
				y: 0
			}, n, t);
			return `<rect class="tp-graph-port" data-port="${n}" x="${r.x - 4}" y="${r.y - 4}" width="8" height="8" />`;
		}).join(""), a = this.selectedIds.has(e.id);
		return `<g data-node-id="${_(e.id)}" class="tp-graph-node${a ? " is-selected" : ""}" transform="translate(${e.x} ${e.y})" tabindex="0" role="button" aria-label="${_(e.label ?? e.type)}">
      ${t?.render?.(e, a) ?? v(e, a)}
      <rect class="tp-graph-selection-indicator" x="${-n / 2 - 6}" y="${-r / 2 - 6}" width="${n + 12}" height="${r + 12}" rx="7" aria-hidden="true"/>
      ${i}
    </g>`;
	}
	renderPortOverlay(e) {
		let t = this.findShape(e.type);
		return C(t, e).map((n) => {
			let r = w(e, n, t);
			return `<g class="tp-graph-port-overlay">
        <rect class="tp-graph-port-hit-area" data-port="${n}" data-port-node-id="${_(e.id)}" x="${r.x - 10}" y="${r.y - 10}" width="20" height="20" />
        <rect class="tp-graph-port-overlay-visual" x="${r.x - 4}" y="${r.y - 4}" width="8" height="8" />
      </g>`;
		}).join("");
	}
	renderPaletteItem(e) {
		let t = e.type === "comment" ? `${this.id || "detached"}-comment-palette` : "", n = `<button type="button" ${t === "" ? "" : `id="${_(t)}"`} draggable="true" data-shape="${_(e.type)}" class="${e.type === this.activeShapeType ? "is-active" : ""}" title="Drag to canvas — ${_(e.description ?? e.label)}">${this.renderPaletteShape(e)}<span>${_(e.label)}</span></button>`;
		return e.type === "comment" ? `<div class="tp-graph-palette-comment-control">${n}${`<tp-dropdown class="tp-graph-comment-color-dropdown" anchor="#${_(CSS.escape(t))}" placement="end" offset="4px" outside-click><ul class="tp-graph-comment-color-grid" role="menu" aria-label="Comment color">${d.map((e) => `<li role="menuitem" tabindex="0" data-comment-palette-color="${e}" aria-label="${e}" title="${e}"><span class="tp-graph-comment-palette-swatch tp-graph-comment-swatch-${e}" aria-hidden="true"></span></li>`).join("")}</ul></tp-dropdown>`}</div>` : n;
	}
	edgeDirections() {
		return [
			"none",
			"both",
			"forward",
			"backward"
		];
	}
	graphWorldBounds() {
		return null;
	}
	renderPalettes(e) {
		return `<tp-accordion class="tp-graph-palette-accordion" multiple${this.paletteOpenIndexes === "" ? "" : ` open-indexes="${_(this.paletteOpenIndexes)}"`}><dl>${e.map((e) => `<dt>${_(e.label)}</dt><dd data-palette-id="${_(e.id)}"><div class="tp-graph-palette-items">${e.shapes.map((e) => this.renderPaletteItem(e)).join("")}</div></dd>`).join("")}${this.renderEdgePalette()}</dl></tp-accordion>`;
	}
	renderMinimap() {
		let e = this.viewportPixels.x / this.zoomValue, t = this.viewportPixels.y / this.zoomValue, n = this.graphValue.nodes.map((e) => {
			let t = this.findShape(e.type), n = y(t?.width, e, 64) / 2, r = y(t?.height, e, 64) / 2;
			return {
				left: e.x - n,
				right: e.x + n,
				top: e.y - r,
				bottom: e.y + r
			};
		}), r = this.graphWorldBounds(), i = Math.min(...n.map((e) => e.left), r?.minX ?? 0, 0) - 40, a = Math.min(...n.map((e) => e.top), r?.minY ?? 0, 0) - 40, o = Math.max(...n.map((e) => e.right), r?.maxX ?? e, e) + 40, s = Math.max(...n.map((e) => e.bottom), r?.maxY ?? t, t) + 40, c = Math.max(1, o - i), l = Math.max(1, s - a);
		return `<div class="tp-graph-minimap"><svg viewBox="${i} ${a} ${c} ${l}" data-minimap-min-x="${i}" data-minimap-min-y="${a}" data-minimap-width="${c}" data-minimap-height="${l}" role="img" aria-label="Graph overview">
      <g class="tp-graph-minimap-edges">${this.graphValue.edges.map((e) => {
			let t = this.edgePoints(e);
			return t ? `<path d="${this.edgePath(e, t.start, t.end)}" />` : "";
		}).join("")}</g>
      <g class="tp-graph-minimap-nodes">${this.graphValue.nodes.map((e) => {
			let t = this.findShape(e.type), n = y(t?.width, e, 64), r = y(t?.height, e, 64);
			return `<rect x="${e.x - n / 2}" y="${e.y - r / 2}" width="${n}" height="${r}" rx="3" />`;
		}).join("")}</g>
      <rect class="tp-graph-minimap-viewport" data-minimap-viewport x="${this.pan.x}" y="${this.pan.y}" width="${e}" height="${t}" />
    </svg></div>`;
	}
	renderSelectionDraft() {
		return this.selectionDraft ? `<rect class="tp-graph-selection-area" x="${Math.min(this.selectionDraft.start.x, this.selectionDraft.current.x)}" y="${Math.min(this.selectionDraft.start.y, this.selectionDraft.current.y)}" width="${Math.abs(this.selectionDraft.current.x - this.selectionDraft.start.x)}" height="${Math.abs(this.selectionDraft.current.y - this.selectionDraft.start.y)}" aria-hidden="true" />` : "";
	}
	renderEdgePalette() {
		let e = this.edgeDirections();
		if (e.length === 0) return "";
		let t = this.graphValue.edges.find((e) => e.id === this.selectedId), n = t?.direction ?? (t ? "forward" : this.activeEdgeDirection), r = {
			none: "No arrow",
			forward: "Forward",
			backward: "Backward",
			both: "Bidirectional"
		}, i = t?.routing ?? this.activeEdgeRouting, a = t?.elbows ?? this.activeEdgeElbows, o = t?.departure ?? this.activeEdgeDeparture, s = t?.turns ?? this.activeEdgeTurns;
		return `<dt>Links</dt><dd><div class="tp-graph-palette-items"><tp-button-group class="tp-graph-link-button-group tp-graph-direction-group" attached>${e.map((e) => {
			let t = e === "backward" || e === "both" ? " marker-start=\"url(#tp-graph-palette-arrow)\"" : "", i = e === "forward" || e === "both" ? " marker-end=\"url(#tp-graph-palette-arrow)\"" : "";
			return `<button type="button" data-edge-direction="${e}" class="${e === n ? "is-active" : ""}" title="${r[e]}" aria-label="${r[e]}"><svg class="tp-graph-palette-preview" viewBox="0 0 52 32" aria-hidden="true"><defs><marker id="tp-graph-palette-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" /></marker></defs><path class="tp-graph-palette-edge" d="M5 16L47 16"${t}${i} /></svg></button>`;
		}).join("")}</tp-button-group>
      <tp-button-group class="tp-graph-link-button-group tp-graph-routing-group" attached>
      <button type="button" data-edge-routing="straight" class="${i === "straight" ? "is-active" : ""}" title="Straight" aria-label="Straight"><svg class="tp-graph-palette-preview" viewBox="0 0 52 32" aria-hidden="true"><path class="tp-graph-palette-edge" d="M5 24L47 8" /></svg></button>
      ${[
			1,
			2,
			3
		].flatMap((e) => ["horizontal", "vertical"].map((t) => {
			let n = e === 1 ? t === "horizontal" ? "M5 24H47V8" : "M5 24V8H47" : e === 2 ? t === "horizontal" ? "M5 24H22V8H47" : "M5 24V16H47V8" : t === "horizontal" ? "M5 24H18V8H36V20H47" : "M5 24V16H25V8H47", r = `${e} corner${e === 1 ? "" : "s"} · ${t === "horizontal" ? "H" : "V"}`;
			return `<button type="button" data-edge-orthogonal data-edge-elbows="${e}" data-edge-departure="${t}" data-edge-turns="alternating" class="${i === "orthogonal" && a === e && o === t && s !== "same" ? "is-active" : ""}" title="${r}" aria-label="${r}"><svg class="tp-graph-palette-preview" viewBox="0 0 52 32" aria-hidden="true"><path class="tp-graph-palette-edge" d="${n}" /></svg></button>`;
		})).join("")}
      ${["horizontal", "vertical"].map((e) => {
			let t = e === "horizontal" ? "M5 24H47V8H30" : "M5 24V4H47V16", n = `2 corners · ${e === "horizontal" ? "H" : "V"} same`;
			return `<button type="button" data-edge-orthogonal data-edge-elbows="2" data-edge-departure="${e}" data-edge-turns="same" class="${i === "orthogonal" && a === 2 && o === e && s === "same" ? "is-active" : ""}" title="${n}" aria-label="${n}"><svg class="tp-graph-palette-preview" viewBox="0 0 52 32" aria-hidden="true"><path class="tp-graph-palette-edge" d="${t}" /></svg></button>`;
		}).join("")}</tp-button-group></div></dd>`;
	}
	renderPaletteShape(e) {
		let t = {
			id: "preview",
			type: e.type,
			x: 0,
			y: 0,
			label: "",
			data: e.createData?.()
		};
		e.type === "comment" && (t.data = {
			...t.data ?? {},
			color: this.commentPaletteColor
		});
		let n = y(e.width, t, 64), r = y(e.height, t, 64), i = e.render?.(t, !1) ?? v(t, !1);
		return `<svg class="tp-graph-palette-preview" viewBox="${-n / 2 - 8} ${-r / 2 - 8} ${n + 16} ${r + 16}" aria-hidden="true" focusable="false"><g>${i}</g></svg>`;
	}
	renderEdge(e) {
		let t = this.edgePoints(e);
		if (!t) return "";
		let { start: n, end: r } = t, i = this.selectedIds.has(e.id) ? " is-selected" : "", a = e.state?.active === !0 ? " is-active" : "", o = e.state?.value === !0 ? " is-true" : e.state?.value === !1 ? " is-false" : "", s = this.selfLinkGeometry(e, n, r), c = s?.labelPoint ?? (e.routing === "orthogonal" ? this.orthogonalLabelPoint(e, n, r) : {
			x: (n.x + r.x) / 2,
			y: (n.y + r.y) / 2 - 8
		}), l = s?.path ?? this.edgePath(e, n, r), u = e.routing === "orthogonal" && (e.elbows ?? 2) >= 2 && !s, d = e.departure ?? "horizontal", f = e.turns === "same", p = f ? r.x >= n.x ? Math.max(n.x, r.x) + 60 : Math.min(n.x, r.x) - 60 : (n.x + r.x) / 2, m = f ? r.y >= n.y ? Math.max(n.y, r.y) + 60 : Math.min(n.y, r.y) - 60 : (n.y + r.y) / 2, h = u && (d === "horizontal" || e.elbows === 3) ? e.bendX ?? p : null, v = u && (d === "vertical" || e.elbows === 3) ? e.bendY ?? m : null, y = e.direction ?? "forward", b = y === "backward" || y === "both" ? " marker-start=\"url(#tp-graph-arrow)\"" : "", x = y === "forward" || y === "both" ? " marker-end=\"url(#tp-graph-arrow)\"" : "", S = g(e).map((t) => {
			let n = this.edgePointAt(e, t.position), r = this.selectedIds.has(t.id) ? " is-selected" : "";
			return `<g data-measurement-id="${_(t.id)}" data-measurement-edge-id="${_(e.id)}" class="tp-graph-measurement${r}" transform="translate(${n.x} ${n.y})" tabindex="0">
        <rect class="tp-graph-measurement-shape" x="-5" y="-5" width="10" height="10" />
        ${t.label ? `<text class="tp-graph-measurement-label" x="0" y="-10" text-anchor="middle">${_(t.label)}</text>` : ""}
      </g>`;
		}).join("");
		return `<g data-edge-id="${_(e.id)}" class="tp-graph-edge${i}${a}${o}" tabindex="0">
      <path class="tp-graph-edge-hit-area" d="${l}" />
      <path class="tp-graph-edge-bridge" d="${l}" />
      <path class="tp-graph-edge-line" d="${l}"${b}${x} />
      ${e.label ? `<text x="${c.x}" y="${c.y}" text-anchor="middle">${_(e.label)}</text>` : ""}
      <circle class="tp-graph-edge-handle" data-edge-endpoint="source" cx="${n.x}" cy="${n.y}" r="6" />
      <circle class="tp-graph-edge-handle" data-edge-endpoint="target" cx="${r.x}" cy="${r.y}" r="6" />
      ${h === null ? "" : `<rect class="tp-graph-edge-handle tp-graph-edge-bend-handle" data-edge-bend data-edge-bend-axis="x" x="${h - 5}" y="${(n.y + r.y) / 2 - 8}" width="10" height="16" rx="2" />`}
      ${v === null ? "" : `<rect class="tp-graph-edge-handle tp-graph-edge-bend-handle is-horizontal" data-edge-bend data-edge-bend-axis="y" x="${(n.x + r.x) / 2 - 8}" y="${v - 5}" width="16" height="10" rx="2" />`}
      ${S}
    </g>`;
	}
	edgePointAt(e, t) {
		let n = this.edgePolyline(e);
		if (n.length < 2) return n[0] ?? {
			x: 0,
			y: 0
		};
		let r = n.slice(1).map((e, t) => Math.hypot(e.x - (n[t]?.x ?? 0), e.y - (n[t]?.y ?? 0))), i = r.reduce((e, t) => e + t, 0), a = Math.min(1, Math.max(0, t)) * i;
		for (let [e, t] of r.entries()) {
			if (a <= t || e === r.length - 1) {
				let r = n[e] ?? n[0] ?? {
					x: 0,
					y: 0
				}, i = n[e + 1] ?? r, o = t === 0 ? 0 : a / t;
				return {
					x: r.x + (i.x - r.x) * o,
					y: r.y + (i.y - r.y) * o
				};
			}
			a -= t;
		}
		return n.at(-1) ?? {
			x: 0,
			y: 0
		};
	}
	edgePolyline(e) {
		let t = this.edgePoints(e);
		if (!t) return [];
		let { start: n, end: r } = t;
		if (e.routing !== "orthogonal") return [n, r];
		let i = e.departure ?? "horizontal";
		if ((e.elbows ?? 2) === 1) return i === "horizontal" ? [
			n,
			{
				x: r.x,
				y: n.y
			},
			r
		] : [
			n,
			{
				x: n.x,
				y: r.y
			},
			r
		];
		if (e.elbows === 3) {
			let t = e.bendX ?? (n.x + r.x) / 2, a = e.bendY ?? (n.y + r.y) / 2;
			return i === "vertical" ? [
				n,
				{
					x: n.x,
					y: a
				},
				{
					x: t,
					y: a
				},
				{
					x: t,
					y: r.y
				},
				r
			] : [
				n,
				{
					x: t,
					y: n.y
				},
				{
					x: t,
					y: a
				},
				{
					x: r.x,
					y: a
				},
				r
			];
		}
		if (i === "vertical") {
			let t = e.bendY ?? (e.turns === "same" ? r.y >= n.y ? Math.max(n.y, r.y) + 60 : Math.min(n.y, r.y) - 60 : (n.y + r.y) / 2);
			return [
				n,
				{
					x: n.x,
					y: t
				},
				{
					x: r.x,
					y: t
				},
				r
			];
		}
		let a = e.bendX ?? (e.turns === "same" ? r.x >= n.x ? Math.max(n.x, r.x) + 60 : Math.min(n.x, r.x) - 60 : (n.x + r.x) / 2);
		return [
			n,
			{
				x: a,
				y: n.y
			},
			{
				x: a,
				y: r.y
			},
			r
		];
	}
	edgePositionNear(e, t) {
		let n = this.graphValue.edges.find((t) => t.id === e);
		if (!n) return .5;
		let r = this.querySelector(`[data-edge-id="${CSS.escape(e)}"] .tp-graph-edge-line`);
		if (r && typeof r.getTotalLength == "function" && typeof r.getPointAtLength == "function") {
			let e = r.getTotalLength(), n = 0, i = Infinity;
			for (let a = 0; a <= 100; a += 1) {
				let o = a / 100, s = r.getPointAtLength(o * e), c = Math.hypot(s.x - t.x, s.y - t.y);
				c < i && (i = c, n = o);
			}
			return n;
		}
		let i = 0, a = Infinity;
		for (let e = 0; e <= 100; e += 1) {
			let r = e / 100, o = this.edgePointAt(n, r), s = Math.hypot(o.x - t.x, o.y - t.y);
			s < a && (a = s, i = r);
		}
		return i;
	}
	syncRenderedMeasurementPositions() {
		for (let e of this.graphValue.edges) {
			let t = this.querySelector(`[data-edge-id="${CSS.escape(e.id)}"] .tp-graph-edge-line`);
			if (!t || typeof t.getTotalLength != "function" || typeof t.getPointAtLength != "function") continue;
			let n = t.getTotalLength();
			for (let r of g(e)) {
				let e = t.getPointAtLength(r.position * n);
				this.querySelector(`[data-measurement-id="${CSS.escape(r.id)}"]`)?.setAttribute("transform", `translate(${e.x} ${e.y})`);
			}
		}
	}
	edgePath(e, t, n) {
		let r = this.selfLinkGeometry(e, t, n);
		if (r) return r.path;
		if (e.source !== void 0 && e.target !== void 0) {
			if (e.routing === "orthogonal") {
				let r = e.departure ?? "horizontal";
				if ((e.elbows ?? 2) === 1) return r === "horizontal" ? `M ${t.x} ${t.y} H ${n.x} V ${n.y}` : `M ${t.x} ${t.y} V ${n.y} H ${n.x}`;
				if (e.elbows === 3) {
					let i = e.bendX ?? (t.x + n.x) / 2, a = e.bendY ?? (t.y + n.y) / 2;
					return r === "vertical" ? `M ${t.x} ${t.y} V ${a} H ${i} V ${n.y} H ${n.x}` : `M ${t.x} ${t.y} H ${i} V ${a} H ${n.x} V ${n.y}`;
				}
				if (r === "vertical") {
					let r = e.bendY ?? (e.turns === "same" ? n.y >= t.y ? Math.max(t.y, n.y) + 60 : Math.min(t.y, n.y) - 60 : (t.y + n.y) / 2);
					return `M ${t.x} ${t.y} V ${r} H ${n.x} V ${n.y}`;
				}
				let i = e.bendX ?? (e.turns === "same" ? n.x >= t.x ? Math.max(t.x, n.x) + 60 : Math.min(t.x, n.x) - 60 : (t.x + n.x) / 2);
				return `M ${t.x} ${t.y} H ${i} V ${n.y} H ${n.x}`;
			}
			let r = this.graphValue.edges.filter((t) => t.source !== void 0 && t.target !== void 0 && (t.source === e.source && t.target === e.target || t.source === e.target && t.target === e.source)).sort((e, t) => e.id.localeCompare(t.id));
			if (r.length > 1) {
				let i = (r.findIndex((t) => t.id === e.id) - (r.length - 1) / 2) * 28, a = n.x - t.x, o = n.y - t.y, s = Math.max(1, Math.hypot(a, o)), c = (t.x + n.x) / 2 - o / s * i, l = (t.y + n.y) / 2 + a / s * i;
				return `M ${t.x} ${t.y} Q ${c} ${l} ${n.x} ${n.y}`;
			}
		}
		return `M ${t.x} ${t.y} L ${n.x} ${n.y}`;
	}
	orthogonalLabelPoint(e, t, n) {
		let r = e.departure ?? "horizontal";
		if ((e.elbows ?? 2) === 1) return {
			x: (t.x + n.x) / 2,
			y: (r === "horizontal" ? t.y : n.y) - 8
		};
		if (e.elbows === 3) {
			let i = e.bendX ?? (t.x + n.x) / 2, a = e.bendY ?? (t.y + n.y) / 2;
			return r === "vertical" ? {
				x: (t.x + i) / 2,
				y: a - 8
			} : {
				x: (i + n.x) / 2,
				y: a - 8
			};
		}
		if (r === "vertical") {
			let r = e.bendY ?? (e.turns === "same" ? n.y >= t.y ? Math.max(t.y, n.y) + 60 : Math.min(t.y, n.y) - 60 : (t.y + n.y) / 2);
			return {
				x: (t.x + n.x) / 2,
				y: r - 8
			};
		}
		let i = e.bendX ?? (e.turns === "same" ? n.x >= t.x ? Math.max(t.x, n.x) + 60 : Math.min(t.x, n.x) - 60 : (t.x + n.x) / 2);
		return Math.abs(i - t.x) >= Math.abs(n.x - i) ? {
			x: (t.x + i) / 2,
			y: t.y - 8
		} : {
			x: (i + n.x) / 2,
			y: n.y - 8
		};
	}
	selfLinkGeometry(e, t, n) {
		if (e.source !== void 0 && e.source === e.target) {
			let r = this.graphValue.edges.filter((t) => t.source === e.source && t.target === e.target && (t.sourcePort ?? "east") === (e.sourcePort ?? "east") && (t.targetPort ?? "north") === (e.targetPort ?? "north")).sort((e, t) => e.id.localeCompare(t.id)), i = Math.max(0, r.findIndex((t) => t.id === e.id)), a = e.sourcePort ?? "east", o = e.targetPort ?? "north", s = {
				north: {
					x: 0,
					y: -1
				},
				east: {
					x: 1,
					y: 0
				},
				south: {
					x: 0,
					y: 1
				},
				west: {
					x: -1,
					y: 0
				}
			}, c = Math.hypot(n.x - t.x, n.y - t.y) / 2, l = this.node(e.source), u = l ? this.findShape(l.type) : void 0, d = c + (l ? Math.max(18, Math.max(y(u?.width, l, 64), y(u?.height, l, 64)) * .3) : 18) * (i + 1), f = +(s[a].x * s[o].y - s[a].y * s[o].x > 0), p = (t.x - n.x) / 2, m = (t.y - n.y) / 2, h = p * p + m * m, g = (f === 1 ? -1 : 1) * Math.sqrt(Math.max(0, (d * d - h) / h)), _ = {
				x: (t.x + n.x) / 2 + g * m,
				y: (t.y + n.y) / 2 - g * p
			}, v = l ? {
				x: _.x - l.x,
				y: _.y - l.y
			} : {
				x: 0,
				y: -1
			}, b = Math.max(1, Math.hypot(v.x, v.y));
			return {
				path: `M ${t.x} ${t.y} A ${d} ${d} 0 1 ${f} ${n.x} ${n.y}`,
				labelPoint: {
					x: _.x + v.x / b * (d + 8),
					y: _.y + v.y / b * (d + 8)
				}
			};
		}
		return null;
	}
	edgePoints(e) {
		let t = e.source === void 0 ? void 0 : this.node(e.source), n = e.target === void 0 ? void 0 : this.node(e.target), r = n ?? e.targetPoint, i = t ?? e.sourcePoint, a = t !== void 0 && t === n, o = t && r ? w(t, e.sourcePort ?? (a ? "east" : b(t, r, this.findShape(t.type))), this.findShape(t.type)) : e.sourcePoint, s = n && i ? w(n, e.targetPort ?? (a ? "north" : b(n, i, this.findShape(n.type))), this.findShape(n.type)) : e.targetPoint;
		return o && s ? {
			start: o,
			end: s
		} : null;
	}
	bindEvents() {
		for (let e of this.querySelectorAll("[data-edge-direction]")) e.addEventListener("click", () => {
			let t = e.dataset.edgeDirection;
			if (t === "none" || t === "forward" || t === "backward" || t === "both") {
				let e = this.graphValue.edges.find((e) => e.id === this.selectedId);
				e ? this.setEdgeDirection(e.id, t) : (this.activeEdgeDirection = t, this.render());
			}
		});
		for (let e of this.querySelectorAll("[data-edge-routing]")) e.addEventListener("click", () => {
			let t = e.dataset.edgeRouting;
			if (t !== "straight" && t !== "orthogonal") return;
			let n = this.graphValue.edges.find((e) => e.id === this.selectedId);
			n ? this.setEdgeRouting(n.id, t) : (this.activeEdgeRouting = t, this.render());
		});
		for (let e of this.querySelectorAll("[data-edge-orthogonal]")) e.addEventListener("click", () => {
			let t = Number(e.dataset.edgeElbows), n = e.dataset.edgeDeparture, r = e.dataset.edgeTurns === "same" ? "same" : "alternating";
			if (t !== 1 && t !== 2 && t !== 3 || n !== "horizontal" && n !== "vertical") return;
			let i = this.graphValue.edges.find((e) => e.id === this.selectedId);
			i ? this.setEdgeOrthogonal(i.id, t, n, r) : (this.activeEdgeRouting = "orthogonal", this.activeEdgeElbows = t, this.activeEdgeDeparture = n, this.activeEdgeTurns = r, this.render());
		});
		for (let e of this.querySelectorAll("[data-shape]")) e.addEventListener("click", () => {
			this.activeShapeType = e.dataset.shape ?? "node", this.activeShapeType === "comment" ? this.querySelector(".tp-graph-comment-color-dropdown")?.toggle() : this.render();
		}), e.addEventListener("dragstart", (t) => {
			let n = e.dataset.shape;
			!n || !t.dataTransfer || (t.dataTransfer.effectAllowed = "copy", t.dataTransfer.setData("application/x-tp-graph-shape", n), t.dataTransfer.setData("text/plain", n));
		});
		for (let e of this.querySelectorAll("[data-comment-palette-color]")) {
			let t = () => {
				this.commentPaletteColor = f(e.dataset.commentPaletteColor), this.querySelector(".tp-graph-comment-color-dropdown")?.removeAttribute("open"), this.render();
			};
			e.addEventListener("click", t), e.addEventListener("keydown", (e) => {
				(e.key === "Enter" || e.key === " ") && t();
			});
		}
		this.querySelector("[data-action=\"select-area\"]")?.addEventListener("click", () => {
			this.selectionMode = !this.selectionMode, this.render();
		}), this.querySelector("[data-action=\"undo\"]")?.addEventListener("click", () => this.undo()), this.querySelector("[data-action=\"redo\"]")?.addEventListener("click", () => this.redo()), this.querySelector("[data-action=\"copy\"]")?.addEventListener("click", () => this.copy()), this.querySelector("[data-action=\"cut\"]")?.addEventListener("click", () => this.cut()), this.querySelector("[data-action=\"paste\"]")?.addEventListener("click", () => this.paste()), this.querySelector("[data-action=\"label\"]")?.addEventListener("click", () => {
			this.selectedId && this.openLabelEditor(this.selectedId);
		}), this.querySelector("[data-action=\"title\"]")?.addEventListener("click", () => this.openTitleEditor()), this.querySelector("[data-action=\"zoom-in\"]")?.addEventListener("click", () => this.zoomIn()), this.querySelector("[data-action=\"zoom-out\"]")?.addEventListener("click", () => this.zoomOut()), this.querySelector("[data-action=\"toggle-grid\"]")?.addEventListener("click", () => {
			this.toggleAttribute("grid");
		}), this.querySelector("[data-action=\"export\"]")?.addEventListener("click", () => {
			this.downloadJson();
		}), this.querySelector("[data-action=\"palette-expand\"]")?.addEventListener("click", () => {
			let e = this.querySelector(".tp-graph-palette-accordion"), t = e?.querySelectorAll("dt").length ?? 0;
			this.paletteOpenIndexes = Array.from({ length: t }, (e, t) => t).join(" "), this.paletteOpenIndexes === "" ? e?.removeAttribute("open-indexes") : e?.setAttribute("open-indexes", this.paletteOpenIndexes);
		}), this.querySelector("[data-action=\"palette-collapse\"]")?.addEventListener("click", () => {
			this.paletteOpenIndexes = "", this.querySelector(".tp-graph-palette-accordion")?.removeAttribute("open-indexes");
		}), this.querySelector("[data-action=\"toggle-json\"]")?.addEventListener("click", () => {
			this.graphCodeVisible = !this.graphCodeVisible;
			let e = this.querySelector(":scope > .tp-graph-code");
			if (e && (e.hidden = !this.graphCodeVisible), this.querySelector("[data-action=\"toggle-json\"]")?.setAttribute("aria-pressed", String(this.graphCodeVisible)), this.graphCodeVisible) {
				if (this.pendingGraphCodeSource === null) {
					this.writeGraphCode(this.exportJson()), this.graphCodeEditor?.removeAttribute("data-invalid");
					let e = this.querySelector(":scope > .tp-graph-code .tp-graph-code-status");
					e && (e.textContent = "");
				}
				this.graphCodeEditor?.focus();
			}
		}), this.querySelector("[data-action=\"editor-toolbar\"]")?.addEventListener("click", () => {
			this.graphCodeEditor !== null && (this.graphCodeEditor.toolbar = !this.graphCodeEditor.toolbar, this.querySelector("[data-action=\"editor-toolbar\"]")?.setAttribute("aria-pressed", String(this.graphCodeEditor.toolbar)));
		}), this.querySelector("[data-action=\"comment-color\"]")?.addEventListener("change", (e) => {
			this.selectedId && e.currentTarget instanceof HTMLSelectElement && this.setCommentColor(this.selectedId, f(e.currentTarget.value));
		});
		let e = this.querySelector("[data-role=\"import\"]");
		this.querySelector("[data-action=\"import\"]")?.addEventListener("click", () => e?.click()), e?.addEventListener("change", () => {
			let t = e.files?.[0];
			t && t.text().then((e) => {
				this.importJson(e), this.sourceFilename = t.name;
			});
		});
		let t = this.querySelector(".tp-graph-canvas");
		this.querySelector(".tp-graph-canvas-frame")?.addEventListener("wheel", (e) => {
			let t = e.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? this.viewportPixels.y : 1, n = e.shiftKey && e.deltaX === 0 ? e.deltaY : e.deltaX, r = e.shiftKey && e.deltaX === 0 ? 0 : e.deltaY;
			this.setPan(this.pan.x + n * t / this.zoomValue, this.pan.y + r * t / this.zoomValue) && e.preventDefault();
		}, { passive: !1 }), t?.addEventListener("dragover", (e) => {
			this.readonly || (e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy"), t.classList.add("is-drop-target"));
		}), t?.addEventListener("dragleave", () => t.classList.remove("is-drop-target")), t?.addEventListener("drop", (e) => {
			if (t.classList.remove("is-drop-target"), this.readonly || !e.dataTransfer) return;
			e.preventDefault();
			let n = e.dataTransfer.getData("application/x-tp-graph-shape") || e.dataTransfer.getData("text/plain");
			if (this.findShape(n)) {
				let r = e.target instanceof Element ? e.target : null;
				this.handlePaletteDrop(n, this.svgPoint(e, t), r);
			}
		}), this.bindExtensionEvents();
	}
	renderToolbarActions() {
		return "";
	}
	renderResults() {
		return "";
	}
	bindExtensionEvents() {}
	handlePaletteDrop(e, t, n) {
		if (e === "measurement") {
			let e = n?.closest("[data-edge-id]")?.dataset.edgeId;
			if (!e) return;
			let r = this.addMeasurement(e, this.edgePositionNear(e, t));
			this.select(r.id), queueMicrotask(() => this.openLabelEditor(r.id));
			return;
		}
		let r = this.addNode(e, t);
		e === "comment" && this.setCommentColor(r.id, this.commentPaletteColor);
	}
	bindCanvasInteraction() {
		if (this.interactionBound) return;
		this.interactionBound = !0, this.addEventListener("pointerdown", (e) => {
			let t = e.target instanceof Element ? e.target : null;
			if (t?.closest("[data-minimap-viewport]")) {
				this.minimapDrag = {
					startClient: {
						x: e.clientX,
						y: e.clientY
					},
					startPan: { ...this.pan }
				}, e.preventDefault();
				return;
			}
			let n = t?.closest(".tp-graph-canvas") ?? null;
			n && this.onPointerDown(e, n);
		}), this.addEventListener("pointermove", (e) => {
			let t = this.querySelector(".tp-graph-canvas");
			t && this.onPointerMove(e, t);
		});
		let e = (e) => {
			if (this.measurementDrag) {
				e.type !== "pointercancel" && this.changed("move-measurement"), this.measurementDrag = null;
				return;
			}
			if (this.selectionDraft) {
				e.type === "pointercancel" ? this.selectionDraft = null : this.finishAreaSelection(), this.render();
				return;
			}
			if (this.edgeBendDrag) {
				e.type !== "pointercancel" && this.changed("move-edge-bend"), this.edgeBendDrag = null;
				return;
			}
			if (this.minimapDrag) {
				this.minimapDrag = null;
				return;
			}
			if (this.edgeReconnectDraft) {
				e.type === "pointercancel" ? this.cancelEdgeReconnect() : this.finishEdgeReconnect(e);
				return;
			}
			if (this.connectionDraft) {
				this.finishConnection(e);
				return;
			}
			if (this.edgeDrag) {
				this.edgeDrag.moved && this.changed("move-edge"), this.edgeDrag = null;
				return;
			}
			this.drag?.moved && this.changed("move-node"), this.drag = null;
		};
		this.addEventListener("pointerup", e), this.addEventListener("pointercancel", e), this.addEventListener("dblclick", (e) => {
			if (this.readonly || this.querySelector(".tp-graph-label-editor")) return;
			let t = (e.target instanceof Element ? e.target : null)?.closest("[data-node-id], [data-edge-id], [data-measurement-id]"), n = t?.dataset.measurementId ?? t?.dataset.nodeId ?? t?.dataset.edgeId ?? this.selectedId;
			n && this.openLabelEditor(n);
		}), this.addEventListener("click", (e) => {
			if (e.detail !== 2 || this.readonly || this.querySelector(".tp-graph-label-editor")) return;
			let t = (e.target instanceof Element ? e.target : null)?.closest("[data-node-id], [data-edge-id], [data-measurement-id]"), n = t?.dataset.measurementId ?? t?.dataset.nodeId ?? t?.dataset.edgeId;
			n && this.openLabelEditor(n);
		}), this.addEventListener("keydown", (e) => {
			let t = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLElement && e.target.isContentEditable, n = e.ctrlKey || e.metaKey;
			if (!t && n) {
				let t = e.key.toLowerCase(), n = !1;
				t === "c" ? n = this.copy() : t === "x" ? n = this.cut() : t === "v" ? n = this.paste() !== null : t === "z" && e.shiftKey ? n = this.redo() : t === "z" ? n = this.undo() : t === "y" && (n = this.redo()), n && e.preventDefault();
				return;
			}
			if (!t && (e.key === "Delete" || e.key === "Del" || e.key === "Backspace") && this.selectedIds.size > 0 && !this.readonly) {
				this.deleteSelection();
				return;
			}
			let r = {
				ArrowLeft: {
					x: -1,
					y: 0
				},
				ArrowRight: {
					x: 1,
					y: 0
				},
				ArrowUp: {
					x: 0,
					y: -1
				},
				ArrowDown: {
					x: 0,
					y: 1
				}
			}[e.key];
			if (!t && r && this.selectedIds.size > 0 && !this.readonly) {
				let t = e.shiftKey ? 10 : 1, n = !1;
				for (let e of this.graphValue.nodes) this.selectedIds.has(e.id) && (e.x += r.x * t, e.y += r.y * t, n = !0);
				n && (e.preventDefault(), this.changed("move-node-keyboard"), this.querySelector(".tp-graph-canvas")?.focus({ preventScroll: !0 }));
			}
		});
	}
	onPointerDown(e, t) {
		let n = e.target instanceof Element ? e.target : null, r = n?.closest("[data-measurement-id]"), i = n?.closest("[data-node-id]"), a = n?.closest("[data-port-node-id]"), o = n?.closest("[data-edge-id]"), s = n?.closest("[data-edge-endpoint]"), c = n?.closest("[data-edge-bend]");
		if (r?.dataset.measurementId && r.dataset.measurementEdgeId) {
			t.focus({ preventScroll: !0 }), this.select(r.dataset.measurementId), this.readonly || (this.measurementDrag = {
				edgeId: r.dataset.measurementEdgeId,
				measurementId: r.dataset.measurementId
			}), e.preventDefault();
			return;
		}
		if (this.selectionMode && !i && !o && !a) {
			let n = this.svgPoint(e, t);
			this.selectionDraft = {
				start: n,
				current: n
			}, this.select(null), e.preventDefault(), this.render();
			return;
		}
		if (o?.dataset.edgeId && c && !this.readonly) {
			this.select(o.dataset.edgeId), this.edgeBendDrag = {
				edgeId: o.dataset.edgeId,
				axis: c.dataset.edgeBendAxis === "y" ? "y" : "x"
			};
			return;
		}
		if (o?.dataset.edgeId && s?.dataset.edgeEndpoint && !this.readonly) {
			let e = s.dataset.edgeEndpoint;
			if (e === "source" || e === "target") {
				this.select(o.dataset.edgeId), this.edgeReconnectDraft = {
					edgeId: o.dataset.edgeId,
					endpoint: e
				}, this.classList.add("is-reconnecting-edge");
				return;
			}
		}
		if (o?.dataset.edgeId && n?.classList.contains("tp-graph-edge-hit-area")) {
			let n = o.dataset.edgeId;
			if (t.focus({ preventScroll: !0 }), this.select(n), !this.readonly) {
				let r = this.graphValue.edges.find((e) => e.id === n), i = r ? this.edgePoints(r) : null;
				if (r && i) {
					let a = this.svgPoint(e, t);
					this.edgeDrag = {
						edgeId: n,
						startClient: {
							x: e.clientX,
							y: e.clientY
						},
						pointer: a,
						source: i.start,
						target: i.end,
						bendX: r.bendX,
						bendY: r.bendY,
						moved: !1
					};
				}
			}
			return;
		}
		let l = i?.dataset.nodeId ?? a?.dataset.portNodeId;
		if (l) {
			let r = l;
			t.focus({ preventScroll: !0 });
			let i = n?.closest("[data-port]")?.dataset.port;
			if (i && !this.readonly) {
				this.startConnection(r, i), this.select(r);
				return;
			}
			let a = this.svgPoint(e, t);
			if (this.select(r), !this.readonly) {
				let t = this.node(r);
				t && (this.drag = {
					id: r,
					offset: {
						x: a.x - t.x,
						y: a.y - t.y
					},
					startClient: {
						x: e.clientX,
						y: e.clientY
					},
					moved: !1
				});
			}
			return;
		}
		if (o?.dataset.edgeId) {
			let e = o.dataset.edgeId;
			t.focus({ preventScroll: !0 }), this.select(e);
			return;
		}
		this.select(null);
	}
	onPointerMove(e, t) {
		if (this.measurementDrag) {
			let n = this.measurement(this.measurementDrag.measurementId);
			n && (n.measurement.position = this.edgePositionNear(this.measurementDrag.edgeId, this.svgPoint(e, t)), n.edge.data = {
				...n.edge.data ?? {},
				measurements: n.measurements
			}, this.render());
			return;
		}
		if (this.selectionDraft) {
			this.selectionDraft.current = this.svgPoint(e, t), this.render();
			return;
		}
		if (this.minimapDrag) {
			let t = this.querySelector(".tp-graph-minimap svg"), n = t?.getBoundingClientRect();
			if (!t || !n || n.width <= 0 || n.height <= 0) return;
			let r = Number(t.dataset.minimapMinX), i = Number(t.dataset.minimapMinY), a = Number(t.dataset.minimapWidth), o = Number(t.dataset.minimapHeight), s = this.viewportPixels.x / this.zoomValue, c = this.viewportPixels.y / this.zoomValue, l = this.minimapDrag.startPan.x + (e.clientX - this.minimapDrag.startClient.x) * a / n.width, u = this.minimapDrag.startPan.y + (e.clientY - this.minimapDrag.startClient.y) * o / n.height;
			this.setPan(Math.min(Math.max(l, r), Math.max(r, r + a - s)), Math.min(Math.max(u, i), Math.max(i, i + o - c)));
			return;
		}
		if (this.edgeBendDrag) {
			let n = this.graphValue.edges.find((e) => e.id === this.edgeBendDrag?.edgeId);
			if (n?.routing === "orthogonal") {
				let r = this.svgPoint(e, t);
				this.edgeBendDrag.axis === "x" ? n.bendX = this.snap(r.x) : n.bendY = this.snap(r.y), this.render();
			}
			return;
		}
		if (this.edgeReconnectDraft) {
			let n = this.svgPoint(e, t), r = `[data-edge-id="${CSS.escape(this.edgeReconnectDraft.edgeId)}"]`, i = this.querySelector(`${r} .tp-graph-edge-line`), a = this.querySelector(`${r} [data-edge-endpoint="${this.edgeReconnectDraft.endpoint}"]`), o = this.querySelector(`${r} [data-edge-endpoint="${this.edgeReconnectDraft.endpoint === "source" ? "target" : "source"}"]`), s = {
				x: Number(o?.getAttribute("cx") ?? 0),
				y: Number(o?.getAttribute("cy") ?? 0)
			};
			i?.setAttribute("d", this.edgeReconnectDraft.endpoint === "source" ? `M ${n.x} ${n.y} L ${s.x} ${s.y}` : `M ${s.x} ${s.y} L ${n.x} ${n.y}`), a?.setAttribute("cx", String(n.x)), a?.setAttribute("cy", String(n.y));
			return;
		}
		if (this.edgeDrag) {
			if (!this.edgeDrag.moved) {
				if (Math.hypot(e.clientX - this.edgeDrag.startClient.x, e.clientY - this.edgeDrag.startClient.y) < 5) return;
				let t = this.graphValue.edges.find((e) => e.id === this.edgeDrag?.edgeId);
				if (!t) return;
				t.source = void 0, t.target = void 0, t.sourcePort = void 0, t.targetPort = void 0, this.edgeDrag.moved = !0;
			}
			let n = this.svgPoint(e, t), r = n.x - this.edgeDrag.pointer.x, i = n.y - this.edgeDrag.pointer.y, a = {
				x: this.edgeDrag.source.x + r,
				y: this.edgeDrag.source.y + i
			}, o = {
				x: this.edgeDrag.target.x + r,
				y: this.edgeDrag.target.y + i
			}, s = this.graphValue.edges.find((e) => e.id === this.edgeDrag?.edgeId);
			s && (s.sourcePoint = a, s.targetPoint = o, this.edgeDrag.bendX !== void 0 && (s.bendX = this.edgeDrag.bendX + r), this.edgeDrag.bendY !== void 0 && (s.bendY = this.edgeDrag.bendY + i)), this.render();
			return;
		}
		if (this.connectionDraft) {
			let n = this.svgPoint(e, t), r = this.querySelector(".tp-graph-connection-draft");
			r?.setAttribute("x2", String(n.x)), r?.setAttribute("y2", String(n.y));
			return;
		}
		if (!this.drag) return;
		let n = this.node(this.drag.id);
		if (!n || !this.drag.moved && Math.hypot(e.clientX - this.drag.startClient.x, e.clientY - this.drag.startClient.y) < 5) return;
		let r = this.svgPoint(e, t);
		this.drag.moved = !0, n.x = this.snap(r.x - this.drag.offset.x), n.y = this.snap(r.y - this.drag.offset.y), this.render();
	}
	svgPoint(e, t) {
		let n = t.getBoundingClientRect();
		return {
			x: this.pan.x + (e.clientX - n.left) / this.zoomValue,
			y: this.pan.y + (e.clientY - n.top) / this.zoomValue
		};
	}
	setPan(e, t) {
		let n = this.querySelector(".tp-graph-minimap svg"), r = Number(n?.dataset.minimapMinX ?? 0), i = Number(n?.dataset.minimapMinY ?? 0), a = Number(n?.dataset.minimapWidth ?? this.viewportPixels.x / this.zoomValue), o = Number(n?.dataset.minimapHeight ?? this.viewportPixels.y / this.zoomValue), s = this.viewportPixels.x / this.zoomValue, c = this.viewportPixels.y / this.zoomValue, l = {
			x: Math.min(Math.max(e, r), Math.max(r, r + a - s)),
			y: Math.min(Math.max(t, i), Math.max(i, i + o - c))
		}, u = Math.abs(l.x - this.pan.x) >= .01 || Math.abs(l.y - this.pan.y) >= .01;
		this.pan = l, this.querySelector(".tp-graph-scene")?.setAttribute("transform", `translate(${-this.pan.x * this.zoomValue} ${-this.pan.y * this.zoomValue}) scale(${this.zoomValue})`);
		let d = this.querySelector("[data-minimap-viewport]");
		d?.setAttribute("x", String(this.pan.x)), d?.setAttribute("y", String(this.pan.y));
		let f = this.querySelector(".tp-graph-canvas");
		return f && (f.style.backgroundPosition = `${-this.pan.x * this.zoomValue}px ${-this.pan.y * this.zoomValue}px`), u;
	}
	startConnection(e, t) {
		let n = this.node(e), r = this.querySelector(".tp-graph-scene");
		if (!n || !r) return;
		this.cancelConnection(), this.connectionDraft = {
			sourceId: e,
			sourcePort: t,
			direction: this.activeEdgeDirection
		};
		let i = w(n, t, this.findShape(n.type)), a = document.createElementNS("http://www.w3.org/2000/svg", "line");
		a.classList.add("tp-graph-connection-draft"), a.setAttribute("x1", String(i.x)), a.setAttribute("y1", String(i.y)), a.setAttribute("x2", String(i.x)), a.setAttribute("y2", String(i.y)), a.setAttribute("marker-end", "url(#tp-graph-arrow)"), r.append(a), this.classList.add("is-connecting");
	}
	finishEdgeReconnect(e) {
		let t = this.edgeReconnectDraft, n = (e.target instanceof Element ? e.target : null)?.closest("[data-port]"), r = n?.closest("[data-node-id]")?.dataset.nodeId ?? n?.getAttribute("data-port-node-id") ?? void 0, i = n?.dataset.port;
		if (!t || !r || !i) {
			this.cancelEdgeReconnect();
			return;
		}
		let a = this.graphValue.edges.find((e) => e.id === t.edgeId), o = t.endpoint === "source" ? a?.target : a?.source, s = t.endpoint === "source" ? a?.targetPort : a?.sourcePort;
		if (!a || !this.node(r) || r === o && i === s) {
			this.cancelEdgeReconnect();
			return;
		}
		this.edgeReconnectDraft = null, this.classList.remove("is-reconnecting-edge");
		try {
			this.reconnectEdge(a.id, t.endpoint, r, i);
		} catch (e) {
			this.render(), this.dispatchEvent(new CustomEvent("tp-graph-error", {
				bubbles: !0,
				detail: {
					error: e,
					operation: "reconnect-edge"
				}
			}));
		}
	}
	cancelEdgeReconnect() {
		this.edgeReconnectDraft = null, this.classList.remove("is-reconnecting-edge"), this.render();
	}
	finishConnection(e) {
		let t = this.connectionDraft, n = (e.target instanceof Element ? e.target : null)?.closest("[data-port]") ?? null, r = n?.closest("[data-node-id]")?.dataset.nodeId ?? n?.getAttribute("data-port-node-id") ?? void 0, i = n?.dataset.port;
		if (this.cancelConnection(), !(!t || !i || !r)) try {
			this.addEdge(t.sourceId, r, void 0, t.sourcePort, i, t.direction);
		} catch (e) {
			this.dispatchEvent(new CustomEvent("tp-graph-error", {
				bubbles: !0,
				detail: {
					error: e,
					operation: "add-edge"
				}
			}));
		}
	}
	cancelConnection() {
		this.connectionDraft = null, this.querySelector(".tp-graph-connection-draft")?.remove(), this.classList.remove("is-connecting");
	}
	openLabelEditor(e) {
		let t = this.measurement(e), n = t?.measurement ?? this.node(e) ?? this.graphValue.edges.find((t) => t.id === e);
		if (!n) return;
		this.select(e);
		let r = this.querySelector(".tp-graph-workspace"), i = this.querySelector(".tp-graph-canvas");
		if (!r || !i) return;
		this.querySelector(".tp-graph-label-editor")?.remove();
		let a = this.node(e)?.type === "comment" ? document.createElement("textarea") : document.createElement("input");
		a.className = "tp-graph-label-editor", a instanceof HTMLInputElement && (a.type = "text"), a.value = n.label ?? "", a.setAttribute("aria-label", "Element label"), a.dataset.elementId = e, a.placeholder = "Label";
		let o = this.node(e), s = this.graphValue.edges.find((t) => t.id === e), c = s ? this.edgePoints(s) : null, l = t ? this.edgePointAt(t.edge, t.measurement.position) : o ? {
			x: o.x,
			y: o.y
		} : {
			x: ((c?.start.x ?? 0) + (c?.end.x ?? 0)) / 2,
			y: ((c?.start.y ?? 0) + (c?.end.y ?? 0)) / 2
		}, u = i.getBoundingClientRect(), d = r.getBoundingClientRect();
		a.style.left = `${u.left - d.left + (l.x - this.pan.x) * this.zoomValue}px`, a.style.top = `${u.top - d.top + (l.y - this.pan.y) * this.zoomValue}px`;
		let f = !1, p = (t) => {
			f || (f = !0, t && this.setElementLabel(e, a.value), a.remove());
		};
		a.addEventListener("keydown", (e) => {
			let t = e;
			t.key === "Enter" && (!(a instanceof HTMLTextAreaElement) || t.ctrlKey || t.metaKey) ? p(!0) : t.key === "Escape" && p(!1);
		}), a.addEventListener("blur", () => p(!0)), r.append(a), a.focus(), a.select();
	}
	openTitleEditor() {
		if (this.readonly) return;
		let e = this.querySelector(".tp-graph-workspace");
		if (!e) return;
		this.querySelector(".tp-graph-title-editor")?.remove();
		let t = document.createElement("input");
		t.className = "tp-graph-label-editor tp-graph-title-editor", t.type = "text", t.value = this.graphValue.title ?? "", t.placeholder = "Graph title", t.setAttribute("aria-label", "Graph title"), t.style.left = "50%", t.style.top = "6.5rem";
		let n = !1, r = (e) => {
			n || (n = !0, e && this.setTitle(t.value), t.remove());
		};
		t.addEventListener("keydown", (e) => {
			e.key === "Enter" ? r(!0) : e.key === "Escape" && r(!1);
		}), t.addEventListener("blur", () => r(!0)), e.append(t), t.focus(), t.select();
	}
	async downloadJson() {
		let e = await n({
			suggestedName: this.jsonExportFilename(),
			description: "Graph JSON",
			mimeType: "application/json",
			extension: ".json"
		});
		e && (await r(new Blob([this.exportJson()], { type: "application/json" }), e), this.dispatchEvent(new CustomEvent("tp-graph-export", {
			bubbles: !0,
			detail: { graph: this.value }
		})));
	}
	filenameFromSource(e) {
		try {
			let t = new URL(e, document.baseURI).pathname, n = decodeURIComponent(t.slice(t.lastIndexOf("/") + 1));
			return n === "" ? null : n;
		} catch {
			return null;
		}
	}
	jsonExportFilename() {
		return this.sourceFilename ? this.sourceFilename.toLowerCase().endsWith(".json") ? this.sourceFilename : `${this.sourceFilename}.json` : `${this.localName.replace(/^tp-/, "") || "graph-editor"}.json`;
	}
	select(e) {
		this.selectMany(e === null ? [] : [e]);
	}
	selectMany(e) {
		this.selectedIds = new Set(e), this.selectedId = e.length === 1 ? e[0] ?? null : null;
		for (let e of this.querySelectorAll(".tp-graph-node.is-selected, .tp-graph-edge.is-selected, .tp-graph-measurement.is-selected")) e.classList.remove("is-selected");
		for (let e of this.querySelectorAll(".tp-graph-shape.is-selected")) e.classList.remove("is-selected");
		for (let t of e) {
			let e = this.querySelector(`[data-node-id="${CSS.escape(t)}"], [data-edge-id="${CSS.escape(t)}"], [data-measurement-id="${CSS.escape(t)}"]`);
			e?.classList.add("is-selected"), e?.querySelector(".tp-graph-shape")?.classList.add("is-selected");
		}
		let t = this.querySelector("[data-action=\"label\"]");
		t && (t.disabled = this.selectedId === null || this.readonly);
		let n = this.querySelector("[data-action=\"copy\"]");
		n && (n.disabled = e.length === 0);
		let r = this.querySelector("[data-action=\"cut\"]");
		r && (r.disabled = e.length === 0 || this.readonly);
		let i = this.querySelector(".tp-graph-comment-color-label"), a = this.querySelector("[data-action=\"comment-color\"]"), o = this.selectedId === null ? void 0 : this.node(this.selectedId), s = o?.type === "comment" ? f(o.data?.color) : null;
		i && (i.hidden = s === null), a && s !== null && (a.value = s), this.dispatchEvent(new CustomEvent("tp-graph-selection-change", {
			bubbles: !0,
			detail: {
				id: this.selectedId,
				ids: [...this.selectedIds]
			}
		})), e.length > 0 && queueMicrotask(() => this.querySelector(".tp-graph-canvas")?.focus({ preventScroll: !0 }));
	}
	finishAreaSelection() {
		if (!this.selectionDraft) return;
		let e = Math.min(this.selectionDraft.start.x, this.selectionDraft.current.x), t = Math.max(this.selectionDraft.start.x, this.selectionDraft.current.x), n = Math.min(this.selectionDraft.start.y, this.selectionDraft.current.y), r = Math.max(this.selectionDraft.start.y, this.selectionDraft.current.y), i = (i) => i.x >= e && i.x <= t && i.y >= n && i.y <= r, a = this.graphValue.nodes.filter((e) => i(e)).map((e) => e.id);
		for (let e of this.graphValue.edges) {
			let t = this.edgePoints(e);
			t && i(t.start) && i(t.end) && a.push(e.id);
		}
		this.selectionDraft = null, this.selectMany(a);
	}
	deleteSelection() {
		let e = new Set(this.selectedIds);
		this.graphValue.nodes = this.graphValue.nodes.filter((t) => !e.has(t.id)), this.graphValue.edges = this.graphValue.edges.filter((t) => !e.has(t.id) && (t.source === void 0 || !e.has(t.source)) && (t.target === void 0 || !e.has(t.target))), this.removeMeasurements(e), this.select(null), this.changed("remove");
	}
	changed(e) {
		JSON.stringify(this.committedGraph) !== JSON.stringify(this.graphValue) && (this.undoStack.push(h(this.committedGraph)), this.undoStack.length > 100 && this.undoStack.shift(), this.redoStack = [], this.committedGraph = h(this.graphValue)), this.render(), this.dispatchEvent(new CustomEvent("tp-graph-change", {
			bubbles: !0,
			detail: {
				reason: e,
				graph: this.value
			}
		}));
	}
	restoreHistoryGraph(e, t) {
		this.graphValue = h(e), this.committedGraph = h(e), this.selectedId = null, this.selectedIds.clear(), this.render(), this.dispatchEvent(new CustomEvent("tp-graph-change", {
			bubbles: !0,
			detail: {
				reason: t,
				graph: this.value
			}
		}));
	}
	node(e) {
		return this.graphValue.nodes.find((t) => t.id === e);
	}
	removeMeasurements(e) {
		for (let t of this.graphValue.edges) {
			let n = g(t), r = n.filter((t) => !e.has(t.id));
			r.length !== n.length && (t.data = {
				...t.data ?? {},
				measurements: r
			});
		}
	}
	measurement(e) {
		for (let t of this.graphValue.edges) {
			let n = g(t), r = n.find((t) => t.id === e);
			if (r) return {
				edge: t,
				measurements: n,
				measurement: r
			};
		}
	}
	findShape(e) {
		for (let t of this.palettes.values()) {
			let n = t.shapes.find((t) => t.type === e);
			if (n) return n;
		}
	}
	nextId(e) {
		let t = "";
		do
			this.idCounter += 1, t = `${e}-${this.idCounter}`;
		while (this.graphValue.nodes.some((e) => e.id === t) || this.graphValue.edges.some((e) => e.id === t || g(e).some((e) => e.id === t)));
		return t;
	}
	snap(e) {
		if (!this.hasAttribute("grid")) return Math.round(e);
		let t = Number(this.getAttribute("grid-size")), n = Number.isFinite(t) && t > 0 ? t : 20;
		return Math.round(e / n) * n;
	}
};
customElements.get("tp-graph-editor") || customElements.define("tp-graph-editor", D);
//#endregion
export { g as a, D as i, u as n, l as r, c as t };

