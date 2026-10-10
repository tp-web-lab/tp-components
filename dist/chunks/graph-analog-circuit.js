import "./lib/typescript/typescript.js";
import { a as e, i as t, t as n } from "./graph-editor.js";
//#region src/components/graph-analog-circuit/graph-analog-circuit.css?inline
var r = "tp-graph-analog-circuit{display:block}.tp-analog-component{fill:none;stroke:var(--tp-neutral-text-colorful);stroke-width:2px}.tp-analog-source,.tp-analog-probe{fill:none}.tp-analog-hit{fill:none;stroke:none;pointer-events:all}.tp-analog-hit.is-selected{stroke:var(--tp-brand-stroke-mid);stroke-width:2px;stroke-dasharray:4 3}.tp-analog-ground-hit{fill:none;stroke:none;pointer-events:all}.tp-analog-ground-hit.is-selected{stroke:var(--tp-brand-stroke-mid);stroke-width:2px;stroke-dasharray:3 2}.tp-analog-ground-symbol{fill:none;stroke:var(--tp-neutral-text-colorful);stroke-linecap:square;stroke-width:2.5px;vector-effect:non-scaling-stroke;pointer-events:none}.tp-analog-hub{fill:var(--tp-neutral-fill-soft);stroke:var(--tp-neutral-text-colorful)}.tp-analog-hub-junction{fill:var(--tp-neutral-text-colorful);pointer-events:none}.tp-analog-symbol{fill:none;stroke:var(--tp-neutral-text-colorful);stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;vector-effect:non-scaling-stroke;pointer-events:none}.tp-analog-transistor-arrow{fill:var(--tp-neutral-text-colorful)}.tp-analog-internal-letter{fill:var(--tp-neutral-text-colorful);pointer-events:none;font-size:16px;font-weight:600}.tp-analog-component.is-selected,.tp-analog-source.is-selected,.tp-analog-probe.is-selected{stroke:var(--tp-brand-stroke-mid);stroke-width:3px}.tp-analog-results{overflow-x:auto}tp-graph-analog-circuit>.tp-graph-results{background:0 0;border:0;gap:.75rem;display:grid;overflow:visible}.tp-analog-panel,.tp-analog-equations{border:1px solid var(--tp-neutral-stroke-soft);background:var(--tp-paper-color);border-radius:.75rem;overflow:hidden}.tp-analog-oscilloscope-header{justify-content:space-between;align-items:center;gap:var(--tp-space-s);display:flex}.tp-analog-calibration{align-items:center;gap:var(--tp-space-xs);flex-wrap:wrap;display:flex}.tp-analog-calibration-group{align-items:center;gap:.2rem;display:inline-flex}.tp-analog-calibration-divider{background:var(--tp-neutral-stroke-soft);align-self:stretch;width:1px;min-height:1.5rem}.tp-analog-calibration-value{min-width:5.5rem;color:var(--tp-neutral-text-colorful);text-align:center;text-transform:none;letter-spacing:normal;font-size:.72rem}.tp-analog-results svg{width:100%;min-width:38rem;height:17rem}.tp-analog-axis{fill:none;stroke:var(--tp-neutral-stroke-mid);stroke-width:1px}.tp-analog-grid{fill:none;stroke:var(--tp-neutral-stroke-soft);stroke-width:1px}.tp-analog-trace{fill:none;stroke:var(--tp-info-stroke-mid);stroke-width:2px;vector-effect:non-scaling-stroke}.tp-analog-trace-1{stroke:var(--tp-success-stroke-mid)}.tp-analog-trace-2{stroke:var(--tp-warning-stroke-mid)}.tp-analog-trace-3{stroke:var(--tp-brand-stroke-mid)}.tp-analog-legend{color:var(--tp-neutral-text-colorful);align-items:center;gap:var(--tp-space-s);flex-wrap:wrap;display:flex}.tp-analog-legend-title{font-weight:600}.tp-analog-legend-item{align-items:center;gap:.3rem;display:inline-flex}.tp-analog-legend-swatch{background:var(--tp-info-stroke-mid);width:1.2rem;height:.18rem}.tp-analog-legend-swatch.tp-analog-trace-1{background:var(--tp-success-stroke-mid)}.tp-analog-legend-swatch.tp-analog-trace-2{background:var(--tp-warning-stroke-mid)}.tp-analog-legend-swatch.tp-analog-trace-3{background:var(--tp-brand-stroke-mid)}.tp-analog-scale-label{fill:var(--tp-neutral-text-colorful);font-size:12px}.tp-analog-axis-title{fill:var(--tp-neutral-text-colorful);font-size:13px;font-weight:600}.tp-analog-error{color:var(--tp-danger-text-colorful)}.tp-analog-equation-laws,.tp-analog-equation-list{gap:.55rem;display:grid}.tp-analog-equation-laws>span{flex-wrap:wrap;align-items:baseline;gap:.4rem 1rem;display:flex}.tp-analog-equation-list{margin-block-start:1rem}.tp-analog-equation{grid-template-columns:minmax(7rem,max-content) minmax(0,1fr);align-items:baseline;gap:1rem;display:grid}.tp-analog-equation-math .tp-markdown-output p{text-align:start;margin:0;display:block}.tp-analog-equations [data-mathjax-display=false],.tp-analog-equations mjx-container:not([display=true]){margin:0;display:inline}.tp-graph-results .tp-analog-equations mjx-container svg{min-width:0;max-width:none;vertical-align:inherit;display:inline-block}.tp-analog-parameter{white-space:nowrap;align-items:center;gap:.3rem;display:inline-flex}.tp-analog-parameter[hidden]{display:none}.tp-analog-parameter input,.tp-analog-parameter select{box-sizing:border-box;border:1px solid var(--tp-neutral-stroke-soft);width:7rem;min-height:1.8rem;color:inherit;background:var(--tp-paper-color);border-radius:.35rem}.tp-analog-parameter input[type=number]{width:7.5rem}.tp-analog-parameter select{width:6.5rem}.tp-analog-parameter select[data-analog-waveform]{width:8rem}@media (width<=32rem){.tp-analog-equation{grid-template-columns:1fr;gap:.15rem}}", i = "analog-resistor", a = "analog-capacitor", o = "analog-inductor", s = "analog-diode", c = "analog-led", l = "analog-lamp", u = "analog-motor", d = "analog-rheostat", f = "analog-potentiometer", p = "analog-transistor", m = "analog-transistor-npn", h = "analog-transistor-pnp", g = "analog-op-amp", _ = "analog-voltage-source", v = "analog-current-source", y = "analog-ground", b = "analog-hub", x = "analog-switch", S = "analog-probe", C = "analog-oscilloscope", w = "analog-wire", T = [
	i,
	a,
	o,
	s,
	c,
	l,
	u,
	d,
	f,
	p,
	m,
	h,
	g,
	_,
	v,
	y,
	b,
	x,
	S,
	C
], E = [
	{
		symbol: "p",
		scale: 1e-12
	},
	{
		symbol: "n",
		scale: 1e-9
	},
	{
		symbol: "µ",
		scale: 1e-6
	},
	{
		symbol: "m",
		scale: .001
	},
	{
		symbol: "",
		scale: 1
	},
	{
		symbol: "k",
		scale: 1e3
	},
	{
		symbol: "M",
		scale: 1e6
	},
	{
		symbol: "G",
		scale: 1e9
	}
];
function D(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function O(e, t, n) {
	let r = e.data?.[t];
	return typeof r == "number" && Number.isFinite(r) ? r : n;
}
function k(e, t) {
	return D(e.label ?? t);
}
function A(e) {
	let t = e.data?.angle;
	return t === 90 || t === 180 || t === 270 ? t : e.data?.orientation === "vertical" ? 90 : 0;
}
function j(e, t, n, r) {
	return A(e) % 180 == 90 ? `<text class="tp-graph-label" x="${r}" y="0" text-anchor="start" dominant-baseline="central">${k(e, t)}</text>` : `<text class="tp-graph-label" text-anchor="middle" y="${n}">${k(e, t)}</text>`;
}
function M(e, t) {
	let n = A(t);
	return `<g class="tp-analog-symbol"${n === 0 ? "" : ` transform="rotate(${n})"`}>${e}</g>`;
}
function N(e, t) {
	return t === 90 ? {
		x: -e.y,
		y: e.x
	} : t === 180 ? {
		x: -e.x,
		y: -e.y
	} : t === 270 ? {
		x: e.y,
		y: -e.x
	} : { ...e };
}
function P(e, t) {
	let n = [
		"north",
		"east",
		"south",
		"west"
	];
	return n[(n.indexOf(e) + t / 90) % 4];
}
function F(e, t, n, r) {
	return `<rect x="-38" y="-22" width="76" height="44" class="tp-graph-shape tp-analog-hit${t ? " is-selected" : ""}"/>${M({
		resistor: "<path d=\"M-36,0H-22 M22,0H36\"/><rect x=\"-22\" y=\"-9\" width=\"44\" height=\"18\"/>",
		capacitor: "<path d=\"M-36,0H-5 M5,0H36 M-5,-18V18 M5,-18V18\"/>",
		inductor: "<path d=\"M-36,0H-24 M24,0H36 M-24,0a6,8 0 0 1 12,0a6,8 0 0 1 12,0a6,8 0 0 1 12,0a6,8 0 0 1 12,0\"/>",
		diode: "<path d=\"M-36,0H-13 M13,0H36 M-13,-14L13,0L-13,14Z M13,-16V16\"/>",
		led: "<path d=\"M-36,0H-13 M13,0H36 M-13,-14L13,0L-13,14Z M13,-16V16 M8,-17L20,-29 M15,-29H20V-24 M15,-10L27,-22 M22,-22H27V-17\"/>",
		lamp: "<path d=\"M-36,0H-22 M22,0H36\"/><circle r=\"22\"/><path d=\"M-15,-15L15,15 M15,-15L-15,15\"/>",
		rheostat: "<path d=\"M-36,0H-22 M22,0H36\"/><rect x=\"-22\" y=\"-9\" width=\"44\" height=\"18\"/><path d=\"M-14,20L15,-18 M13.5,-7.8L15,-18L5.6,-13.9\"/>",
		potentiometer: "<path d=\"M-36,0H-22 M22,0H36\"/><rect x=\"-22\" y=\"-9\" width=\"44\" height=\"18\"/><path d=\"M0,-36V-9 M-6,-16L0,-9L6,-16\"/>"
	}[n] ?? "", e)}${j(e, r, 34, 30)}`;
}
function I(e, t) {
	return `<rect x="-38" y="-24" width="76" height="48" class="tp-graph-shape tp-analog-hit${t ? " is-selected" : ""}"/>${M("<path d=\"M-36,0H-22 M22,0H36\"/><circle r=\"22\"/>", e)}<text class="tp-analog-internal-letter" text-anchor="middle" dominant-baseline="central">M</text>${j(e, "Motor", 36, 30)}`;
}
function L(e, t, n = !1) {
	let r = e.data?.waveform, i = !n && r !== "square" && r !== "sine" ? "<circle r=\"22\"/><path d=\"M-36,0H-5 M5,0H36 M-5,-8V8 M5,-14V14\"/>" : "<path d=\"M-36,0H-22 M22,0H36\"/><circle r=\"22\"/>", a = n ? "<path d=\"M0,12V-12 M-6,-6L0,-12L6,-6\"/>" : r === "square" ? "<path d=\"M-13,8V-8H0V8H13\"/>" : r === "sine" ? "<path d=\"M-12,0C-8,-10,-4,-10,0,0S8,10,12,0\"/>" : "";
	return `<rect x="-38" y="-24" width="76" height="48" class="tp-graph-shape tp-analog-hit${t ? " is-selected" : ""}"/>${M(i, e)}${a ? `<g class="tp-analog-symbol tp-analog-readable-glyph">${a}</g>` : ""}${j(e, n ? "I" : "V", 36, 30)}`;
}
function R(e, t) {
	let n = e.data?.closed === !0;
	return `<rect x="-38" y="-22" width="76" height="44" class="tp-graph-shape tp-analog-hit${t ? " is-selected" : ""}"/>${M(`<path d="M-36,0H-20 M20,0H36"/><circle cx="-20" r="3"/><circle cx="20" r="3"/><path d="M-17,${n ? 0 : -2}L17,${n ? 0 : -15}"/>`, e)}${j(e, "Switch", 34, 30)}`;
}
function z(e, t, n, r = "npn") {
	let i = n ? "<path d=\"M-30,-25V25L30,0Z M-42,-14H-30 M-42,14H-30 M30,0H42\"/>" : `<circle r="25"/><path d="M-38,0H-10 M-10,-16V16 M-10,-10L24,-25 M-10,10L24,25"/><path class="tp-analog-transistor-arrow" d="${r === "pnp" ? "M6,17L17.2,16.5L13.1,25.6Z" : "M24,25L12.8,25.5L16.9,16.4Z"}"/>`, a = A(e), o = N({
		x: -23,
		y: -14
	}, a), s = N({
		x: -23,
		y: 14
	}, a), c = n ? `<g class="tp-analog-symbol tp-analog-readable-glyph" transform="translate(${o.x} ${o.y})"><path d="M-3,0H3 M0,-3V3"/></g><g class="tp-analog-symbol tp-analog-readable-glyph" transform="translate(${s.x} ${s.y})"><path d="M-3,0H3"/></g>` : "";
	return `<rect x="-44" y="-32" width="88" height="64" class="tp-graph-shape tp-analog-hit${t ? " is-selected" : ""}"/>${M(i, e)}${c}${j(e, n ? "Op amp" : r.toUpperCase(), 44, 36)}`;
}
function B(e, t) {
	return `<rect x="-24" y="-24" width="48" height="48" class="tp-graph-shape tp-analog-ground-hit${t ? " is-selected" : ""}"/>
    <path class="tp-analog-ground-symbol" d="M0,-24V-4 M-22,-4H22 M-14,5H14 M-6,14H6"/>
    <text class="tp-graph-label" text-anchor="middle" y="32">${k(e, "GND")}</text>`;
}
function V(e, t) {
	return `<rect x="-28" y="-28" width="56" height="56" rx="5" class="tp-graph-shape tp-analog-hub${t ? " is-selected" : ""}"/>
    <circle r="5" class="tp-analog-hub-junction"/>
    <text class="tp-graph-label" text-anchor="middle" y="44">${k(e, "Hub")}</text>`;
}
function H(e) {
	let t = A(e), n = P("west", t), r = P("east", t);
	return {
		[n]: N({
			x: -36,
			y: 0
		}, t),
		[r]: N({
			x: 36,
			y: 0
		}, t)
	};
}
function U(e) {
	let t = A(e), n = {};
	for (let [e, r] of [
		["north", {
			x: -30,
			y: -14
		}],
		["south", {
			x: -30,
			y: 14
		}],
		["east", {
			x: 42,
			y: 0
		}]
	]) n[P(e, t)] = N(r, t);
	return n;
}
function W(e) {
	let t = A(e), n = {};
	for (let [e, r] of [
		["west", {
			x: -38,
			y: 0
		}],
		["north", {
			x: 24,
			y: -25
		}],
		["south", {
			x: 24,
			y: 25
		}]
	]) n[P(e, t)] = N(r, t);
	return n;
}
function G(e) {
	let t = H(e), n = A(e);
	return t[P("north", n)] = N({
		x: 0,
		y: -36
	}, n), t;
}
function K(e) {
	let t = A(e);
	return [P("west", t), P("east", t)];
}
var q = class {
	parent = /* @__PURE__ */ new Map();
	find(e) {
		let t = this.parent.get(e);
		if (!t) return this.parent.set(e, e), e;
		if (t === e) return e;
		let n = this.find(t);
		return this.parent.set(e, n), n;
	}
	join(e, t) {
		let n = this.find(e), r = this.find(t);
		n !== r && this.parent.set(n, r);
	}
};
function J(e, t) {
	return `${e}:${t ?? "west"}`;
}
function Y(e, t) {
	let n = t.length, r = e.map((e, n) => [...e, t[n] ?? 0]);
	for (let e = 0; e < n; e += 1) {
		let t = e;
		for (let i = e + 1; i < n; i += 1) Math.abs(r[i]?.[e] ?? 0) > Math.abs(r[t]?.[e] ?? 0) && (t = i);
		if (Math.abs(r[t]?.[e] ?? 0) < 1e-12) continue;
		[r[e], r[t]] = [r[t], r[e]];
		let i = r[e]?.[e] ?? 1;
		for (let t = e; t <= n; t += 1) r[e][t] = (r[e][t] ?? 0) / i;
		for (let t = 0; t < n; t += 1) {
			if (t === e) continue;
			let i = r[t]?.[e] ?? 0;
			for (let a = e; a <= n; a += 1) r[t][a] = (r[t][a] ?? 0) - i * (r[e][a] ?? 0);
		}
	}
	return r.map((e) => e[n] ?? 0);
}
function X(e) {
	let t = new Set(e.nodes.map((e) => e.id));
	for (let t of e.nodes) if (t.type !== "comment" && !T.includes(t.type)) throw TypeError(`Unsupported analog component: ${t.type}`);
	for (let n of e.edges) {
		if (!n.source || !n.target || !t.has(n.source) || !t.has(n.target)) throw TypeError(`Wire "${n.id}" must connect two components.`);
		if (n.source === n.target) throw TypeError("Self-links are not allowed in analog circuits.");
		if (n.type !== void 0 && n.type !== "analog-wire") throw TypeError(`Unsupported analog link: ${n.type}`);
		if (n.direction !== void 0 && n.direction !== "none") throw TypeError("Analog wires cannot have arrows.");
	}
}
function Z(t, r = .02, i = 2e-4, a = "voltage") {
	if (X(t), !(r > 0) || !(i > 0)) throw TypeError("Duration and step must be positive.");
	let o = new q();
	for (let e of t.nodes.filter((e) => e.type === b)) for (let t of [
		"east",
		"south",
		"west"
	]) o.join(J(e.id, "north"), J(e.id, t));
	for (let e of t.edges) o.join(J(e.source, e.sourcePort), J(e.target, e.targetPort));
	let s = t.nodes.filter((e) => e.type === y).map((e) => o.find(J(e.id, "north")));
	if (s.length === 0) throw TypeError("The circuit needs a ground reference.");
	let c = s[0], l = t.nodes.filter((e) => ![
		y,
		b,
		S,
		C,
		n
	].includes(e.type)), u = /* @__PURE__ */ new Set();
	for (let e of l) {
		let [t, n] = K(e);
		if (u.add(o.find(J(e.id, t))), u.add(o.find(J(e.id, n))), e.type === "analog-potentiometer" && u.add(o.find(J(e.id, P("north", A(e))))), e.type === "analog-op-amp" || e.type === "analog-transistor" || e.type === "analog-transistor-npn" || e.type === "analog-transistor-pnp") {
			let t = e.type === "analog-op-amp" ? U(e) : W(e);
			for (let n of Object.keys(t)) u.add(o.find(J(e.id, n)));
		}
	}
	u.delete(c);
	let d = [...u], f = new Map(d.map((e, t) => [e, t])), p = l.filter((e) => e.type === _), m = d.length + p.length, h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), v = [], x = (e, t) => f.get(o.find(J(e.id, K(e)[t]))), w = (e, t) => f.get(o.find(J(e.id, t))), T = (e, t, n, r) => {
		t !== void 0 && (e[t][t] += r), n !== void 0 && (e[n][n] += r), t !== void 0 && n !== void 0 && (e[t][n] -= r, e[n][t] -= r);
	}, E = (e, t, n, r) => {
		t !== void 0 && (e[t] -= r), n !== void 0 && (e[n] += r);
	};
	for (let n = 0; n <= r + i / 2; n += i) {
		let r = Array.from({ length: m }, () => Array(m).fill(0)), s = Array(m).fill(0);
		for (let e of l) {
			let t = x(e, 0), n = x(e, 1);
			if (e.type === "analog-potentiometer") {
				let i = Math.max(1e-9, O(e, "resistance", 1e4)), a = Math.min(.999999, Math.max(1e-6, O(e, "position", .5))), o = w(e, P("north", A(e)));
				T(r, t, o, 1 / (i * a)), T(r, o, n, 1 / (i * (1 - a)));
			} else if ([
				"analog-resistor",
				"analog-lamp",
				"analog-motor",
				"analog-rheostat"
			].includes(e.type)) T(r, t, n, 1 / Math.max(1e-9, O(e, "resistance", 1e3)));
			else if (e.type === "analog-capacitor") {
				let a = Math.max(0, O(e, "capacitance", 1e-6)) / i;
				T(r, t, n, a), E(s, t, n, a * (h.get(e.id) ?? 0));
			} else e.type === "analog-inductor" ? (T(r, t, n, i / Math.max(1e-12, O(e, "inductance", .001))), E(s, t, n, g.get(e.id) ?? 0)) : e.type === "analog-current-source" ? E(s, t, n, O(e, "current", .001)) : e.type === "analog-diode" || e.type === "analog-led" ? T(r, t, n, (h.get(e.id) ?? 0) > O(e, "forwardVoltage", e.type === "analog-led" ? 1.8 : .6) ? .1 : 1e-9) : e.type === "analog-switch" && T(r, t, n, e.data?.closed === !0 ? 1e9 : 1e-9);
		}
		for (let [e, t] of p.entries()) {
			let i = x(t, 0), a = x(t, 1), o = d.length + e;
			i !== void 0 && (--r[i][o], --r[o][i]), a !== void 0 && (r[a][o] += 1, r[o][a] += 1);
			let c = t.data?.waveform, l = O(t, "voltage", 5), u = O(t, "frequency", 100);
			s[o] = c === "square" ? Math.sin(2 * Math.PI * u * n) >= 0 ? l : 0 : c === "sine" ? l * Math.sin(2 * Math.PI * u * n) : l;
		}
		let u = Y(r, s), _ = (e, t) => {
			let n = o.find(J(e.id, t));
			return n === c ? 0 : u[f.get(n) ?? -1] ?? 0;
		}, y = /* @__PURE__ */ new Map();
		for (let e of l) {
			let [t, n] = K(e), r = _(e, n) - _(e, t), a = h.get(e.id) ?? 0, o = 0;
			[
				"analog-resistor",
				"analog-lamp",
				"analog-motor",
				"analog-rheostat"
			].includes(e.type) ? o = -r / Math.max(1e-9, O(e, "resistance", 1e3)) : e.type === "analog-capacitor" ? o = O(e, "capacitance", 1e-6) * (a - r) / i : e.type === "analog-inductor" ? (o = (g.get(e.id) ?? 0) - r * i / Math.max(1e-12, O(e, "inductance", .001)), g.set(e.id, o)) : e.type === "analog-current-source" ? o = O(e, "current", .001) : e.type === "analog-diode" || e.type === "analog-led" ? o = -r * (a > O(e, "forwardVoltage", e.type === "analog-led" ? 1.8 : .6) ? .1 : 1e-9) : e.type === "analog-switch" && (o = -r * (e.data?.closed === !0 ? 1e9 : 1e-9)), y.set(e.id, o), h.set(e.id, r);
		}
		for (let [e, t] of p.entries()) y.set(t.id, -(u[d.length + e] ?? 0));
		let b = {};
		for (let n of t.edges) {
			let r = t.nodes.find((e) => e.id === n.source);
			if (!r) continue;
			let i = o.find(J(r.id, n.sourcePort)), s = i === c ? 0 : u[f.get(i) ?? -1] ?? 0;
			if (a === "current") {
				let e = t.nodes.find((e) => e.id === n.target), i = K(r), a = e ? K(e) : null, o = y.get(r.id), c = e ? y.get(e.id) : void 0;
				s = o !== void 0 && n.sourcePort === i[0] ? -o : o !== void 0 && n.sourcePort === i[1] ? o : c !== void 0 && n.targetPort === a?.[0] ? c : c !== void 0 && n.targetPort === a?.[1] ? -c : 0;
			}
			for (let t of e(n)) t.label && (b[t.label] = s);
		}
		for (let e of t.nodes.filter((e) => e.type === "analog-probe" || e.type === "analog-oscilloscope")) b[e.label ?? e.id] = _(e, K(e)[0]);
		v.push({
			time: n,
			values: b
		});
	}
	return {
		samples: v,
		duration: r,
		step: i
	};
}
function ee(e, t, n, r) {
	let i = Object.keys(e.samples[0]?.values ?? {});
	if (i.length === 0) return "<h3 class=\"tp-graph-results-header\">Transient analysis</h3><div class=\"tp-graph-results-content\">Drag named measurement points onto wires to add oscilloscope channels.</div>";
	let a = e.samples.flatMap((e) => Object.values(e.values)), o = Math.min(0, ...a), s = Math.max(1, ...a), c = s - o || 1, l = (o + s) / 2, u = c / t, d = l + u / 2, f = (t) => 62 + t / e.duration * 720, p = (e) => 18 + (d - e) / u * 200, m = Array.from({ length: 5 }, (t, n) => {
		let r = n / 4, i = 62 + r * 720, a = e.duration * r * 1e3;
		return `<path class="tp-analog-grid" d="M${i},18V218"/><text class="tp-analog-scale-label" x="${i}" y="240" text-anchor="middle">${a.toFixed(+(a < 10))}</text>`;
	}).join(""), h = Array.from({ length: 5 }, (e, t) => {
		let n = t / 4, r = 18 + n * 200, i = d - n * u;
		return `<path class="tp-analog-grid" d="M62,${r}H782"/><text class="tp-analog-scale-label" x="54" y="${r + 4}" text-anchor="end">${i.toFixed(2)}</text>`;
	}).join(""), g = i.map((t, r) => `<polyline class="tp-analog-trace tp-analog-trace-${r % 4}" data-trace="${r}" clip-path="url(#${n})" points="${e.samples.map((e) => `${f(e.time)},${p(e.values[t] ?? 0)}`).join(" ")}"/>`).join(""), _ = r === "voltage" ? "V" : "A", v = r === "voltage" ? "Voltage" : "Current", y = i.map((e, t) => `<span class="tp-analog-legend-item"><span class="tp-analog-legend-swatch tp-analog-trace-${t % 4}"></span>${D(e)} (${_})</span>`).join(""), b = e.duration * 1e3 / 4, x = u / 4;
	return `<h3 class="tp-graph-results-header tp-analog-oscilloscope-header"><span>Oscilloscope</span><span class="tp-analog-calibration"><span class="tp-analog-calibration-divider" aria-hidden="true"></span><tp-button-group attached><button type="button" data-analog-mode="voltage" class="${r === "voltage" ? "is-active" : ""}" aria-label="Voltage measurement mode">V</button><button type="button" data-analog-mode="current" class="${r === "current" ? "is-active" : ""}" aria-label="Current measurement mode">A</button></tp-button-group><span class="tp-analog-calibration-divider" aria-hidden="true"></span><span class="tp-analog-calibration-group"><tp-icon-button size="xs" name="minus" label="Increase time per division" data-analog-calibration="time-out"></tp-icon-button><span class="tp-analog-calibration-value">${b.toFixed(b < 1 ? 2 : 1)} ms/div</span><tp-icon-button size="xs" name="plus" label="Decrease time per division" data-analog-calibration="time-in"></tp-icon-button></span><span class="tp-analog-calibration-divider" aria-hidden="true"></span><tp-icon-button size="xs" name="refresh" label="Reset oscilloscope calibration" data-analog-calibration="reset"></tp-icon-button><span class="tp-analog-calibration-divider" aria-hidden="true"></span><span class="tp-analog-calibration-group"><tp-icon-button size="xs" name="minus" label="Increase ${v.toLowerCase()} units per division" data-analog-calibration="voltage-out"></tp-icon-button><span class="tp-analog-calibration-value">${x.toFixed(x < 1 ? 3 : 1)} ${_}/div</span><tp-icon-button size="xs" name="plus" label="Decrease ${v.toLowerCase()} units per division" data-analog-calibration="voltage-in"></tp-icon-button></span></span></h3><div class="tp-graph-results-content tp-analog-results"><div class="tp-analog-legend"><span class="tp-analog-legend-title">${v} channels:</span>${y}</div><svg viewBox="0 0 800 260" role="img" aria-label="${v} over time oscilloscope plot"><defs><clipPath id="${n}"><rect x="62" y="18" width="720" height="200"/></clipPath></defs>${m}${h}<path class="tp-analog-axis" d="M62,18V218H782"/>${g}<text class="tp-analog-axis-title" x="422" y="257" text-anchor="middle">Time (ms)</text><text class="tp-analog-axis-title" transform="translate(14 118) rotate(-90)" text-anchor="middle">${v} (${_})</text></svg></div>`;
}
function Q(e, t) {
	let n = [], r = (e) => `<tp-markdown class="tp-analog-equation-math"><script type="tp/markdown">---\nextensions:\n  - math\n---\n:latexmath:\`${e}\`<\/script></tp-markdown>`, i = (e, t) => {
		n.push(`<div class="tp-analog-equation"><strong>${k(e, e.id)}</strong>${r(t)}</div>`);
	};
	for (let t of e.nodes) if ([
		"analog-resistor",
		"analog-rheostat",
		"analog-lamp",
		"analog-motor"
	].includes(t.type)) i(t, String.raw`u(t) = ${O(t, "resistance", 1e3)}\,i(t)`);
	else if (t.type === "analog-capacitor") i(t, String.raw`i(t) = ${O(t, "capacitance", 1e-6)}\,\frac{du(t)}{dt}`);
	else if (t.type === "analog-inductor") i(t, String.raw`u(t) = ${O(t, "inductance", .001)}\,\frac{di(t)}{dt}`);
	else if (t.type === "analog-current-source") i(t, String.raw`i(t) = ${O(t, "current", .001)}\,\mathrm{A}`);
	else if (t.type === "analog-voltage-source") {
		let e = O(t, "voltage", 5), n = O(t, "frequency", 100), r = t.data?.waveform;
		i(t, r === "sine" ? String.raw`u(t) = ${e}\sin\!\left(2\pi\,${n}\,t\right)` : r === "square" ? String.raw`u(t)=\begin{cases}${e},&\sin\!\left(2\pi\,${n}\,t\right)\geq0\\0,&\text{otherwise}\end{cases}` : String.raw`u(t) = ${e}\,\mathrm{V}`);
	} else if (t.type === "analog-potentiometer") {
		let e = O(t, "resistance", 1e4), n = O(t, "position", .5);
		i(t, String.raw`R_1=${e}\times${n},\qquad R_2=${e}\left(1-${n}\right)`);
	} else t.type === "analog-diode" || t.type === "analog-led" ? i(t, String.raw`i(t)\approx0\quad\text{for}\quad u(t)<${O(t, "forwardVoltage", t.type === "analog-led" ? 1.8 : .6)}\,\mathrm{V}`) : t.type === "analog-switch" && i(t, t.data?.closed === !0 ? String.raw`u(t)=0\quad\text{(closed switch)}` : String.raw`i(t)=0\quad\text{(open switch)}`);
	let a = n.length > 0 ? n.join("") : "<p>No component equation is available.</p>";
	return `<section class="tp-analog-equations" aria-labelledby="tp-analog-equations-title"><h3 id="tp-analog-equations-title" class="tp-graph-results-header">Circuit equations</h3><div class="tp-graph-results-content"><div class="tp-analog-equation-laws"><span><strong>Kirchhoff current law</strong>${r(String.raw`\sum_k i_k(t)=0\quad\text{at each node}`)}</span><span><strong>Kirchhoff voltage law</strong>${r(String.raw`\sum_k u_k(t)=0\quad\text{around each loop}`)}</span><span><strong>Transient discretization</strong>${r(String.raw`\Delta t=${t}\,\mathrm{s}\quad\text{(backward Euler)}`)}</span></div><div class="tp-analog-equation-list">${a}</div></div></section>`;
}
var $ = class e extends t {
	static instanceCounter = 0;
	static analogStyleId = "tp-graph-analog-circuit-styles";
	analogInstanceId = ++e.instanceCounter;
	timeZoom = 1;
	voltageZoom = 1;
	measurementMode = "voltage";
	selectedAnalogId = null;
	constructor() {
		super(), this.unregisterPalette("generic"), this.activeEdgeDirection = "none";
		let e = (e, t, n, r) => ({
			type: e,
			label: t,
			description: t,
			width: 76,
			height: 68,
			ports: H,
			createData: () => ({
				angle: 0,
				...r
			}),
			render: (e, r) => F(e, r, n, t)
		});
		this.registerPalette({
			id: "analog-passive",
			label: "Passive components",
			shapes: [
				e(i, "Resistor", "resistor", { resistance: 1e3 }),
				e(a, "Capacitor", "capacitor", { capacitance: 1e-6 }),
				e(o, "Inductor", "inductor", { inductance: .001 }),
				e(d, "Rheostat", "rheostat", { resistance: 1e3 }),
				{
					type: f,
					label: "Potentiometer",
					description: "Three-terminal variable resistor",
					width: 76,
					height: 76,
					ports: G,
					createData: () => ({
						angle: 0,
						resistance: 1e4,
						position: .5
					}),
					render: (e, t) => F(e, t, "potentiometer", "Potentiometer")
				}
			]
		}), this.registerPalette({
			id: "analog-loads",
			label: "Loads / semiconductors",
			shapes: [
				e(s, "Diode", "diode", { forwardVoltage: .6 }),
				e(c, "LED", "led", { forwardVoltage: 1.8 }),
				e(l, "Lamp", "lamp", { resistance: 100 }),
				{
					type: u,
					label: "Motor",
					description: "Simple resistive motor load",
					width: 76,
					height: 72,
					ports: H,
					createData: () => ({
						angle: 0,
						resistance: 100
					}),
					render: I
				}
			]
		}), this.registerPalette({
			id: "analog-active",
			label: "Active components",
			shapes: [
				{
					type: m,
					label: "NPN transistor",
					description: "NPN bipolar transistor",
					width: 88,
					height: 84,
					ports: W,
					createData: () => ({
						angle: 0,
						kind: "npn"
					}),
					render: (e, t) => z(e, t, !1, "npn")
				},
				{
					type: h,
					label: "PNP transistor",
					description: "PNP bipolar transistor",
					width: 88,
					height: 84,
					ports: W,
					createData: () => ({
						angle: 0,
						kind: "pnp"
					}),
					render: (e, t) => z(e, t, !1, "pnp")
				},
				{
					type: g,
					label: "Op amp",
					description: "Operational amplifier",
					width: 88,
					height: 84,
					ports: U,
					createData: () => ({
						angle: 0,
						gain: 1e5
					}),
					render: (e, t) => z(e, t, !0)
				}
			]
		}), this.registerPalette({
			id: "analog-sources",
			label: "Sources",
			shapes: [
				{
					type: _,
					label: "Voltage source",
					description: "Voltage generator",
					width: 76,
					height: 72,
					ports: H,
					createData: () => ({
						angle: 0,
						voltage: 5,
						waveform: "dc",
						frequency: 100
					}),
					render: (e, t) => L(e, t)
				},
				{
					type: v,
					label: "Current source",
					description: "Current generator",
					width: 76,
					height: 72,
					ports: H,
					createData: () => ({
						angle: 0,
						current: .001
					}),
					render: (e, t) => L(e, t, !0)
				},
				{
					type: y,
					label: "Ground",
					description: "Reference potential",
					width: 48,
					height: 56,
					ports: { north: {
						x: 0,
						y: -24
					} },
					render: B
				}
			]
		}), this.registerPalette({
			id: "analog-connections",
			label: "Connections",
			shapes: [{
				type: x,
				label: "Switch",
				description: "Open or closed switch",
				width: 76,
				height: 68,
				ports: H,
				createData: () => ({
					angle: 0,
					closed: !1
				}),
				render: R
			}, {
				type: b,
				label: "Hub",
				description: "Four-port electrical junction",
				width: 56,
				height: 72,
				ports: {
					north: {
						x: 0,
						y: -28
					},
					east: {
						x: 28,
						y: 0
					},
					south: {
						x: 0,
						y: 28
					},
					west: {
						x: -28,
						y: 0
					}
				},
				render: V
			}]
		}), this.portsVisible = !0, this.addEventListener("tp-graph-selection-change", (e) => {
			this.selectedAnalogId = e.detail.id, this.updateAnalogControls();
		});
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(e.analogStyleId, r);
	}
	setGraph(e) {
		let t = this.selectedAnalogId;
		X(e), super.setGraph(e), t && e.nodes.some((e) => e.id === t) && this.selectMany([t]);
	}
	addNode(e, t, n) {
		if (!T.includes(e)) throw TypeError(`Unsupported analog component: ${e}`);
		return super.addNode(e, t, n);
	}
	addEdge(e, t, n = w, r, i, a = "none", o = "straight") {
		if (a !== "none") throw TypeError("Analog wires cannot have arrows.");
		return super.addEdge(e, t, n, r, i, a, o);
	}
	validateConnection(e, t, n) {
		if (super.validateConnection(e, t, n), e === t) throw TypeError("Self-links are not allowed in analog circuits.");
		if (n !== "analog-wire" && n !== "edge") throw TypeError(`Unsupported analog link: ${n}`);
	}
	simulate(e, t) {
		let n = Z(this.value, e, t);
		return super.setGraph(this.value), this.dispatchEvent(new CustomEvent("tp-analog-simulate", {
			bubbles: !0,
			detail: n
		})), n;
	}
	rotateSelected() {
		if (!this.selectedAnalogId) return;
		let e = this.value, t = e.nodes.find((e) => e.id === this.selectedAnalogId);
		if (!t || !this.isOrientable(t)) return;
		let n = {
			north: "east",
			east: "south",
			south: "west",
			west: "north"
		}, r = (A(t) + 90) % 360;
		t.data = {
			...t.data ?? {},
			angle: r,
			orientation: r % 180 == 0 ? "horizontal" : "vertical"
		};
		for (let r of e.edges) r.source === t.id && r.sourcePort && (r.sourcePort = n[r.sourcePort]), r.target === t.id && r.targetPort && (r.targetPort = n[r.targetPort]);
		this.setGraph(e);
	}
	toggleSwitch() {
		if (!this.selectedAnalogId) return;
		let e = this.value, t = e.nodes.find((e) => e.id === this.selectedAnalogId);
		t?.type === "analog-switch" && (t.data = {
			...t.data ?? {},
			closed: t.data?.closed !== !0
		}, this.setGraph(e));
	}
	edgeDirections() {
		return ["none"];
	}
	renderToolbarActions() {
		return `<label class="tp-analog-parameter" hidden>Label <input type="text" data-analog-label disabled></label><label class="tp-analog-parameter" hidden>Value <input type="number" data-analog-value disabled><select data-analog-unit disabled>${E.map((e) => `<option value="${e.scale}">${e.symbol}</option>`).join("")}</select></label><label class="tp-analog-parameter" hidden>Wiper <input type="number" min="0" max="100" step="1" data-analog-position disabled><span>%</span></label><label class="tp-analog-parameter" hidden>Waveform <select data-analog-waveform disabled><option value="dc">DC</option><option value="sine">Sine</option><option value="square">Square</option></select></label><label class="tp-analog-parameter" hidden>Frequency <input type="number" min="0" step="1" data-analog-frequency disabled><span>Hz</span></label><tp-icon-button name="rotate-right" label="Rotate selected component" data-analog-action="rotate" disabled></tp-icon-button><tp-icon-button name="toggle-switch" label="Open or close selected switch" data-analog-action="switch" disabled></tp-icon-button><tp-icon-button name="play" label="Run transient analysis" data-analog-action="simulate"></tp-icon-button>`;
	}
	bindExtensionEvents() {
		this.querySelector("[data-analog-action=\"simulate\"]")?.addEventListener("click", () => this.simulate()), this.querySelector("[data-analog-action=\"rotate\"]")?.addEventListener("click", () => this.rotateSelected()), this.querySelector("[data-analog-action=\"switch\"]")?.addEventListener("click", () => this.toggleSwitch()), this.querySelector("[data-analog-label]")?.addEventListener("change", (e) => this.updateSelectedLabel(e.currentTarget.value)), this.querySelector("[data-analog-value]")?.addEventListener("change", (e) => this.updateSelectedValue(Number(e.currentTarget.value))), this.querySelector("[data-analog-unit]")?.addEventListener("change", (e) => this.updateSelectedUnit(Number(e.currentTarget.value))), this.querySelector("[data-analog-position]")?.addEventListener("change", (e) => this.updatePotentiometerPosition(Number(e.currentTarget.value))), this.querySelector("[data-analog-waveform]")?.addEventListener("change", (e) => this.updateVoltageSourceWaveform(e.currentTarget.value)), this.querySelector("[data-analog-frequency]")?.addEventListener("change", (e) => this.updateVoltageSourceFrequency(Number(e.currentTarget.value)));
		for (let e of this.querySelectorAll("[data-analog-mode]")) e.addEventListener("click", () => {
			let t = e.dataset.analogMode;
			(t === "voltage" || t === "current") && (this.measurementMode = t, this.voltageZoom = 1, super.setGraph(this.value));
		});
		for (let e of this.querySelectorAll("[data-analog-calibration]")) e.addEventListener("click", () => {
			let t = e.dataset.analogCalibration;
			t === "reset" ? (this.timeZoom = 1, this.voltageZoom = 1) : t === "time-in" ? this.timeZoom = Math.min(16, this.timeZoom * 2) : t === "time-out" ? this.timeZoom = Math.max(.25, this.timeZoom / 2) : t === "voltage-in" ? this.voltageZoom = Math.min(16, this.voltageZoom * 2) : t === "voltage-out" && (this.voltageZoom = Math.max(.25, this.voltageZoom / 2)), super.setGraph(this.value);
		});
		this.updateAnalogControls();
	}
	renderResults() {
		let e = 2e-4;
		try {
			return `<section class="tp-analog-panel tp-analog-oscilloscope-panel">${ee(Z(this.value, .02 / this.timeZoom, e, this.measurementMode), this.voltageZoom, `tp-analog-plot-clip-${this.analogInstanceId}`, this.measurementMode)}</section>${Q(this.value, e)}`;
		} catch (t) {
			return `<section class="tp-analog-panel tp-analog-oscilloscope-panel"><h3 class="tp-graph-results-header">Transient analysis</h3><div class="tp-graph-results-content tp-analog-error">${D(t instanceof Error ? t.message : "Simulation failed.")}</div></section>${Q(this.value, e)}`;
		}
	}
	isOrientable(e) {
		return ![
			y,
			b,
			n
		].includes(e.type);
	}
	valueSpec(e) {
		return [
			"analog-resistor",
			"analog-rheostat",
			"analog-potentiometer",
			"analog-lamp",
			"analog-motor"
		].includes(e.type) ? {
			key: "resistance",
			fallback: 1e3,
			step: 1,
			unit: "Ω"
		} : e.type === "analog-capacitor" ? {
			key: "capacitance",
			fallback: 1e-6,
			step: 1e-6,
			unit: "F"
		} : e.type === "analog-inductor" ? {
			key: "inductance",
			fallback: .001,
			step: .001,
			unit: "H"
		} : e.type === "analog-voltage-source" ? {
			key: "voltage",
			fallback: 5,
			step: .1,
			unit: "V"
		} : e.type === "analog-current-source" ? {
			key: "current",
			fallback: .001,
			step: .001,
			unit: "A"
		} : e.type === "analog-op-amp" ? {
			key: "gain",
			fallback: 1e5,
			step: 1e3,
			unit: ""
		} : e.type === "analog-diode" || e.type === "analog-led" ? {
			key: "forwardVoltage",
			fallback: e.type === "analog-led" ? 1.8 : .6,
			step: .1,
			unit: "V"
		} : null;
	}
	updateSelectedLabel(e) {
		if (!this.selectedAnalogId) return;
		let t = this.value, n = t.nodes.find((e) => e.id === this.selectedAnalogId);
		n && (n.label = e.trim(), this.setGraph(t));
	}
	displayScale(e, t) {
		let n = e.data?.displayScale;
		if (typeof n == "number" && E.some((e) => e.scale === n)) return n;
		let r = Math.abs(O(e, t.key, t.fallback));
		return r === 0 ? 1 : [...E].reverse().find((e) => r >= e.scale)?.scale ?? 1e-12;
	}
	updateSelectedValue(e) {
		if (!this.selectedAnalogId || !Number.isFinite(e)) return;
		let t = this.value, n = t.nodes.find((e) => e.id === this.selectedAnalogId);
		if (!n) return;
		let r = this.valueSpec(n);
		if (!r) return;
		let i = this.displayScale(n, r);
		n.data = {
			...n.data ?? {},
			[r.key]: Math.max(0, e * i),
			displayScale: i
		}, this.setGraph(t);
	}
	updateSelectedUnit(e) {
		if (!this.selectedAnalogId || !E.some((t) => t.scale === e)) return;
		let t = this.value, n = t.nodes.find((e) => e.id === this.selectedAnalogId);
		!n || !this.valueSpec(n) || (n.data = {
			...n.data ?? {},
			displayScale: e
		}, this.setGraph(t));
	}
	updatePotentiometerPosition(e) {
		if (!this.selectedAnalogId || !Number.isFinite(e)) return;
		let t = this.value, n = t.nodes.find((e) => e.id === this.selectedAnalogId);
		n?.type === "analog-potentiometer" && (n.data = {
			...n.data ?? {},
			position: Math.min(1, Math.max(0, e / 100))
		}, this.setGraph(t));
	}
	updateVoltageSourceWaveform(e) {
		if (!this.selectedAnalogId || ![
			"dc",
			"sine",
			"square"
		].includes(e)) return;
		let t = this.value, n = t.nodes.find((e) => e.id === this.selectedAnalogId);
		n?.type === "analog-voltage-source" && (n.data = {
			...n.data ?? {},
			waveform: e
		}, this.setGraph(t));
	}
	updateVoltageSourceFrequency(e) {
		if (!this.selectedAnalogId || !Number.isFinite(e)) return;
		let t = this.value, n = t.nodes.find((e) => e.id === this.selectedAnalogId);
		n?.type === "analog-voltage-source" && (n.data = {
			...n.data ?? {},
			frequency: Math.max(0, e)
		}, this.setGraph(t));
	}
	updateAnalogControls() {
		let e = this.value.nodes.find((e) => e.id === this.selectedAnalogId), t = this.querySelector("[data-analog-label]");
		t && (t.disabled = !e, t.closest(".tp-analog-parameter")?.toggleAttribute("hidden", !e), t.value = e?.label ?? "");
		let n = e ? this.valueSpec(e) : null, r = this.querySelector("[data-analog-value]"), i = this.querySelector("[data-analog-unit]");
		if (r) if (r.disabled = !n, r.closest(".tp-analog-parameter")?.toggleAttribute("hidden", !n), e && n) {
			let t = this.displayScale(e, n);
			if (r.value = String(O(e, n.key, n.fallback) / t), r.step = String(n.step / t), i) {
				i.disabled = !1, i.value = String(t);
				for (let e of i.options) e.textContent = `${E.find((t) => t.scale === Number(e.value))?.symbol ?? ""}${n.unit}`;
			}
		} else i && (i.disabled = !0);
		let a = e?.type === _, o = this.querySelector("[data-analog-waveform]");
		o && (o.disabled = !a, o.closest(".tp-analog-parameter")?.toggleAttribute("hidden", !a), o.value = a && typeof e.data?.waveform == "string" ? e.data.waveform : "dc");
		let s = e?.type === f, c = this.querySelector("[data-analog-position]");
		c && (c.disabled = !s, c.closest(".tp-analog-parameter")?.toggleAttribute("hidden", !s), c.value = s ? String(O(e, "position", .5) * 100) : "50");
		let l = a && o?.value !== "dc", u = this.querySelector("[data-analog-frequency]");
		u && (u.disabled = !l, u.closest(".tp-analog-parameter")?.toggleAttribute("hidden", !l), u.value = a ? String(O(e, "frequency", 100)) : "100");
		let d = this.querySelector("[data-analog-action=\"rotate\"]");
		d && d.toggleAttribute("disabled", !e || !this.isOrientable(e));
		let p = this.querySelector("[data-analog-action=\"switch\"]");
		p && p.toggleAttribute("disabled", e?.type !== x);
	}
};
customElements.get("tp-graph-analog-circuit") || customElements.define("tp-graph-analog-circuit", $);
//#endregion
export { Z as C, $ as S, p as _, b as a, _ as b, c, f as d, S as f, x as g, C as h, y as i, u as l, d as m, v as n, o, i as p, s as r, l as s, a as t, g as u, m as v, X as w, w as x, h as y };

//# sourceMappingURL=graph-analog-circuit.js.map