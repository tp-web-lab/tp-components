import "./lib/typescript/typescript.js";
import { i as e } from "./graph-editor.js";
//#region src/components/graph-geometric-optics/graph-geometric-optics.css?inline
var t = "tp-graph-geometric-optics{display:block}tp-graph-geometric-optics .tp-graph-link-button-group{display:none}tp-graph-geometric-optics [data-palette-id^=optics-] .tp-graph-palette-items{grid-template-columns:repeat(2,minmax(0,1fr))}tp-graph-geometric-optics [data-palette-id=optics-mirrors] .tp-graph-palette-items,tp-graph-geometric-optics [data-palette-id=optics-interfaces] .tp-graph-palette-items{grid-template-columns:repeat(3,minmax(0,1fr))}tp-graph-geometric-optics [data-palette-id=optics-screen] .tp-graph-palette-items{grid-template-columns:minmax(0,1fr)}tp-graph-geometric-optics [data-palette-id^=optics-] .tp-graph-palette-items button{justify-content:center;min-height:2.5rem;padding:.25rem}tp-graph-geometric-optics [data-palette-id^=optics-] .tp-graph-palette-items button>span{display:none}tp-graph-geometric-optics .tp-graph-palette .tp-optics-mirror-backing.is-preview{stroke-width:3px;vector-effect:non-scaling-stroke}.tp-optics-object{fill:none;stroke:var(--tp-danger-stroke-mid);stroke-width:3px}.tp-optics-point-source{fill:var(--tp-danger-fill-mid);stroke:var(--tp-danger-stroke-mid);stroke-width:2px}.tp-optics-point-source-halo{fill:none;stroke:var(--tp-danger-stroke-mid);stroke-width:1px;stroke-dasharray:2 3;pointer-events:none}.tp-optics-lens,.tp-optics-lens.is-diverging{fill:none;stroke-width:2.5px;stroke-linecap:round;stroke-linejoin:round}.tp-optics-spherical-lens{fill:currentColor;fill-opacity:.16;stroke-width:2.5px;stroke-linejoin:round}.tp-optics-screen{fill:currentColor;stroke-width:1px}.tp-optics-medium{fill:currentColor;fill-opacity:.2;stroke-width:1.5px}.tp-optics-grin-medium{fill:none;stroke-width:1.5px}.tp-optics-grin-cell{fill:currentColor;stroke:none;pointer-events:none}.tp-optics-grin-legend rect{fill:currentColor;opacity:.35}.tp-optics-grin-legend text{fill:var(--tp-text-body);font:10px system-ui,sans-serif}.tp-optics-plane-interface,.tp-optics-curved-interface{fill:none;stroke-width:2.5px}.tp-optics-mirror{fill:none;stroke-width:2.5px;stroke-linecap:round}.tp-optics-mirror-backing{fill:none;stroke:var(--tp-text-body);stroke-width:2px;pointer-events:none}.tp-optics-normal{stroke:var(--tp-neutral-stroke-strong);stroke-width:1px;stroke-dasharray:3 3;pointer-events:none}.tp-optics-axis-graduation{pointer-events:none}.tp-optics-axis{stroke:var(--tp-neutral-stroke-strong,var(--tp-text-muted));stroke-width:1.5px;vector-effect:non-scaling-stroke}.tp-optics-axis-tick{stroke:var(--tp-neutral-stroke-strong,var(--tp-text-muted));stroke-width:1px;vector-effect:non-scaling-stroke}.tp-optics-axis-tick.is-major{stroke-width:1.5px}.tp-optics-axis-label{fill:var(--tp-text-body);font:10px system-ui,sans-serif}.tp-optics-focus{fill:currentColor}.tp-optics-ray{fill:none;stroke-width:2px;vector-effect:non-scaling-stroke}.tp-optics-virtual-ray{stroke-width:1.5px;stroke-dasharray:5 4;vector-effect:non-scaling-stroke}.tp-optics-image{fill:none;stroke:var(--tp-danger-stroke-mid);stroke-width:2.5px;stroke-dasharray:6 4;vector-effect:non-scaling-stroke}.tp-optics-image-spread{fill:var(--tp-warning-fill-mid);fill-opacity:.2;stroke:var(--tp-warning-stroke-mid);stroke-width:1.5px;stroke-dasharray:3 3;vector-effect:non-scaling-stroke}.tp-optics-ray-intersection{fill:var(--tp-warning-fill-mid);stroke:var(--tp-warning-stroke-mid);stroke-width:1.5px;vector-effect:non-scaling-stroke}.tp-optics-point-image{fill:var(--tp-danger-fill-mid)}.tp-optics-image-label{fill:var(--tp-danger-text-colorful);font:12px system-ui,sans-serif}.tp-optics-color-0{color:var(--tp-brand-stroke-mid);stroke:var(--tp-brand-stroke-mid);stop-color:var(--tp-brand-stroke-mid)}.tp-optics-color-1{color:var(--tp-info-stroke-mid);stroke:var(--tp-info-stroke-mid);stop-color:var(--tp-info-stroke-mid)}.tp-optics-color-2{color:var(--tp-success-stroke-mid);stroke:var(--tp-success-stroke-mid);stop-color:var(--tp-success-stroke-mid)}.tp-optics-color-3{color:var(--tp-warning-stroke-mid);stroke:var(--tp-warning-stroke-mid);stop-color:var(--tp-warning-stroke-mid)}.tp-optics-color-4{color:var(--tp-neutral-stroke-strong);stroke:var(--tp-neutral-stroke-strong);stop-color:var(--tp-neutral-stroke-strong)}tp-graph-geometric-optics .tp-graph-specific-toolbar{flex-wrap:nowrap;block-size:3rem;min-block-size:3rem;overflow:auto hidden}tp-graph-geometric-optics .tp-graph-specific-toolbar .tp-graph-toolbar-message{white-space:nowrap;flex:none}.tp-optics-parameter{white-space:nowrap;flex:none;align-items:center;gap:.35rem;font-size:.78rem;display:inline-flex}.tp-optics-parameter[hidden]{display:none}.tp-optics-parameter input,.tp-optics-parameter select{border:1px solid var(--tp-neutral-stroke-soft);width:4.75rem;min-height:1.8rem;color:inherit;background:var(--tp-paper-color);border-radius:.35rem}.tp-optics-parameter select[data-optics-curvature]{width:6.5rem}.tp-optics-parameter select[data-optics-grin-profile]{width:10rem}.tp-optics-parameter input[data-optics-parameter=coefficient]{width:8rem}.tp-optics-parameter.tp-optics-expression input{width:13rem}.tp-optics-parameter.tp-optics-expression input[aria-invalid=true]{border-color:var(--tp-danger-stroke-mid);color:var(--tp-danger-text-colorful);background:var(--tp-danger-fill-softer);outline:1px solid var(--tp-danger-stroke-soft)}.tp-optics-results{grid-template-columns:minmax(12rem,1fr) minmax(24rem,2fr);gap:1rem;display:grid}.tp-optics-results h4{margin:0 0 .5rem}.tp-optics-analysis-summary>h4:not(:first-child){border-top:1px solid var(--tp-neutral-stroke-soft);margin-top:1.25rem;padding-top:.75rem}.tp-optics-lens-details+.tp-optics-lens-details{margin-top:.75rem}.tp-optics-lens-details h5{color:var(--tp-text-body);margin:0 0 .35rem}.tp-optics-snell,.tp-optics-reflection{border-top:1px solid var(--tp-neutral-stroke-soft);margin-top:1.25rem;padding-top:.75rem}.tp-optics-results dl{grid-template-columns:auto 1fr;gap:.35rem .75rem;margin:0;display:grid}.tp-optics-results dt{font-weight:600}.tp-optics-results dd{text-transform:capitalize;margin:0}.tp-optics-results [data-mathjax-display=false],.tp-optics-results mjx-container:not([display=true]){display:inline}.tp-graph-results .tp-optics-results mjx-container svg{min-width:0;max-width:none;vertical-align:inherit;display:inline-block}@media (width<=48rem){.tp-optics-results{grid-template-columns:minmax(0,1fr)}}", n = "optics-source", r = "optics-point-source", i = "optics-converging-lens", a = "optics-diverging-lens", o = "optics-biconvex-lens", s = "optics-biconcave-lens", c = "optics-screen", l = "optics-medium", u = "optics-grin-medium", d = "optics-plane-interface", f = "optics-curved-interface", p = "optics-concave-interface", m = "optics-mirror", h = "optics-convex-mirror", g = "optics-concave-mirror", _ = [
	n,
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
	p,
	m,
	h,
	g
];
function v(e) {
	return e.type === "optics-source" || e.type === "optics-point-source";
}
function y(e) {
	return e.type === "optics-curved-interface" || e.type === "optics-concave-interface";
}
function b(e) {
	return e.type === "optics-biconvex-lens" || e.type === "optics-biconcave-lens";
}
function x(e) {
	return e.type === "optics-mirror" || e.type === "optics-convex-mirror" || e.type === "optics-concave-mirror";
}
function S(e) {
	return e.data?.direction === "down" ? "down" : "up";
}
var C = /* @__PURE__ */ new Map();
function w(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function T(e, t, n) {
	let r = e.data?.[t];
	return typeof r == "number" && Number.isFinite(r) ? r : n;
}
function E(e) {
	let t = e.data?.profile;
	return t === "linear" || t === "radial" || t === "custom" ? t : "parabolic";
}
function D(e) {
	let t = C.get(e);
	if (t) return t;
	let n = [...e.matchAll(/\s*(?:(\d*\.?\d+(?:e[+-]?\d+)?)|([A-Za-z_]\w*)|(.))/g)].map((e) => e[1] ?? e[2] ?? e[3] ?? ""), r = 0, i = () => n[r], a = () => n[r++] ?? "", o = () => {
		let e = s();
		for (; i() === "+" || i() === "-";) {
			let t = a(), n = s(), r = e;
			e = t === "+" ? (e) => r(e) + n(e) : (e) => r(e) - n(e);
		}
		return e;
	}, s = () => {
		let e = c();
		for (; i() === "*" || i() === "/";) {
			let t = a(), n = c(), r = e;
			e = t === "*" ? (e) => r(e) * n(e) : (e) => r(e) / n(e);
		}
		return e;
	}, c = () => {
		let e = l();
		if (i() !== "^") return e;
		a();
		let t = c();
		return (n) => e(n) ** t(n);
	}, l = () => {
		if (i() === "+") return a(), l();
		if (i() === "-") {
			a();
			let e = l();
			return (t) => -e(t);
		}
		return u();
	}, u = () => {
		let e = a(), t = Number(e);
		if (e !== "" && Number.isFinite(t)) return () => t;
		if (e === "(") {
			let e = o();
			if (a() !== ")") throw TypeError("Missing closing parenthesis in the GRIN expression.");
			return e;
		}
		if (e === "x" || e === "y" || e === "n0") return (t) => t[e];
		if (e === "pi") return () => Math.PI;
		if (e === "e") return () => Math.E;
		let n = {
			abs: Math.abs,
			cos: Math.cos,
			exp: Math.exp,
			log: Math.log,
			sin: Math.sin,
			sqrt: Math.sqrt,
			tan: Math.tan
		}[e];
		if (!n || a() !== "(") throw TypeError(`Unsupported token "${e}" in the GRIN expression.`);
		let r = o();
		if (a() !== ")") throw TypeError("Missing closing parenthesis in the GRIN expression.");
		return (e) => n(r(e));
	}, d = o();
	if (r !== n.length) throw TypeError(`Unexpected token "${i()}" in the GRIN expression.`);
	return C.set(e, d), d;
}
function O(e, t, n) {
	let r = t - e.x, i = n - e.y, a = T(e, "baseIndex", 1.5), o = E(e), s = T(e, "gradient", -.001), c = T(e, "coefficient", 2e-5);
	return o === "linear" ? a + s * i : o === "radial" ? a + s * Math.hypot(r, i) : o === "custom" ? D(typeof e.data?.expression == "string" ? e.data.expression : "n0 - 0.00002*y^2")({
		x: r,
		y: i,
		n0: a
	}) : a - c * i * i;
}
function k(e) {
	let t = T(e, "radius", 160), n = e.data?.curvature;
	return n === "concave" ? -Math.abs(t) : n === "convex" ? Math.abs(t) : t;
}
function A(e) {
	let t = Math.abs(T(e, "radius", 160));
	return e.data?.shape === "concave" ? -t : t;
}
function j(e, t) {
	if (t?.id === "preview") return 80;
	let r = e.nodes.find((e) => e.type === n);
	return Math.max(80, Math.abs(r ? T(r, "height", 60) : 60) + 30);
}
function M(e, t) {
	return t?.id === "preview" ? 105 : j(e) + 25;
}
function N(e) {
	let t = [];
	for (let n of e.nodes) if (n.type === "optics-plane-interface" && t.push({
		x: n.x,
		y: n.y,
		halfHeight: T(n, "height", 240) / 2,
		n1: T(n, "leftIndex", 1),
		n2: T(n, "rightIndex", 1.5),
		label: n.label ?? n.id
	}), n.type === "optics-medium") {
		let e = T(n, "width", 160), r = T(n, "refractiveIndex", 1.5), i = {
			y: n.y,
			halfHeight: T(n, "height", 240) / 2
		};
		t.push({
			...i,
			x: n.x - e / 2,
			n1: 1,
			n2: r,
			label: `${n.label ?? n.id} entry`
		}), t.push({
			...i,
			x: n.x + e / 2,
			n1: r,
			n2: 1,
			label: `${n.label ?? n.id} exit`
		});
	}
	return t.sort((e, t) => e.x - t.x);
}
function P(e) {
	let t = T(e, "thickness", 100), n = T(e, "radius1", e.type === "optics-biconvex-lens" ? 100 : -100), r = T(e, "radius2", e.type === "optics-biconvex-lens" ? -100 : 100), i = T(e, "refractiveIndex", 1.5), a = T(e, "height", 160);
	return [{
		id: `${e.id}-front`,
		type: f,
		x: e.x - t / 2,
		y: e.y,
		data: {
			radius: n,
			leftIndex: 1,
			rightIndex: i,
			height: a
		}
	}, {
		id: `${e.id}-back`,
		type: f,
		x: e.x + t / 2,
		y: e.y,
		data: {
			radius: r,
			leftIndex: i,
			rightIndex: 1,
			height: a
		}
	}];
}
function F(e) {
	let t = T(e, "height", 160) / 2, n = T(e, "radius1", e.type === "optics-biconvex-lens" ? 100 : -100), r = T(e, "radius2", e.type === "optics-biconvex-lens" ? -100 : 100), i = (e) => e - Math.sign(e) * Math.sqrt(Math.max(0, e * e - t * t));
	return Math.max(1, Math.ceil(i(n) - i(r) + 5));
}
function I(e, t) {
	let [n, r, i, a] = e, [o, s, c, l] = t;
	return [
		n * o + r * c,
		n * s + r * l,
		i * o + a * c,
		i * s + a * l
	];
}
function L(e) {
	return [
		1,
		e,
		0,
		1
	];
}
function R(e) {
	return [
		1,
		0,
		-1 / e,
		1
	];
}
function z(e, t, n) {
	return [
		1,
		0,
		(e - t) / (n * t),
		e / t
	];
}
function ee(e) {
	let t = T(e, "refractiveIndex", 1.5), n = T(e, "thickness", 100), r = T(e, "radius1", 100), i = T(e, "radius2", -100), a = (t - 1) * (1 / r - 1 / i + (t - 1) * n / (t * r * i));
	return Math.abs(a) < 1e-12 ? Infinity : 1 / a;
}
function B(e) {
	return b(e) ? ee(e) : T(e, "focalLength", 100);
}
function V(e) {
	let t = e.nodes.filter(v), n = e.nodes.filter((e) => e.type === c);
	if (t.length !== 1) throw TypeError("An optical bench requires exactly one source.");
	if (n.length > 1) throw TypeError("An optical bench accepts at most one screen.");
	for (let t of e.nodes) {
		if (t.type !== "comment" && !_.includes(t.type)) throw TypeError(`Unsupported geometric-optics node type: ${t.type}`);
		if (t.type === "optics-converging-lens" || t.type === "optics-diverging-lens") {
			let e = T(t, "focalLength", t.type === "optics-converging-lens" ? 100 : -100);
			if (e === 0 || t.type === "optics-converging-lens" && e < 0 || t.type === "optics-diverging-lens" && e > 0) throw TypeError(`Lens "${t.id}" has an invalid focal length.`);
		}
		if (t.type === "optics-source" && t.data?.direction !== void 0 && t.data.direction !== "up" && t.data.direction !== "down") throw TypeError(`Object "${t.id}" has an invalid direction.`);
		if (b(t)) {
			let e = T(t, "thickness", 100), n = T(t, "refractiveIndex", 1.5), r = T(t, "height", 160), i = Math.abs(T(t, "radius1", 100)), a = Math.abs(T(t, "radius2", 100));
			if (e < F(t) || n <= 0 || r <= 0 || r > i * 2 || r > a * 2) throw TypeError(`Spherical lens "${t.id}" has invalid optical properties.`);
		}
		if (t.type === "optics-medium" && (T(t, "refractiveIndex", 1.5) <= 0 || T(t, "width", 160) <= 0 || T(t, "height", 240) <= 0)) throw TypeError(`Medium "${t.id}" has invalid optical properties.`);
		if (t.type === "optics-grin-medium") {
			let e = T(t, "width", 180), n = T(t, "height", 200), r = T(t, "integrationStep", 2);
			if (e <= 0 || n <= 0 || r < .1 || r > 20) throw TypeError(`GRIN medium "${t.id}" has invalid dimensions or integration step.`);
			for (let r of [
				t.x - e / 2,
				t.x,
				t.x + e / 2
			]) for (let e of [
				t.y - n / 2,
				t.y,
				t.y + n / 2
			]) {
				let n = O(t, r, e);
				if (!Number.isFinite(n) || n <= 0) throw TypeError(`GRIN medium "${t.id}" produces an invalid refractive index.`);
			}
		}
		if (t.type === "optics-plane-interface" && (T(t, "leftIndex", 1) <= 0 || T(t, "rightIndex", 1.5) <= 0 || T(t, "height", 240) <= 0)) throw TypeError(`Interface "${t.id}" has invalid optical properties.`);
		if (y(t)) {
			let e = k(t), n = T(t, "height", 240);
			if (T(t, "leftIndex", 1) <= 0 || T(t, "rightIndex", 1.5) <= 0 || e === 0 || n <= 0 || n > Math.abs(e) * 2) throw TypeError(`Curved interface "${t.id}" has invalid optical properties.`);
		}
		if (t.type === "optics-point-source") {
			let e = T(t, "rayCount", 3), n = T(t, "openingAngle", 60), r = T(t, "orientationAngle", 0);
			if (!Number.isInteger(e) || e < 1 || e > 10 || n < 0 || n > 360 || r < -180 || r > 180) throw TypeError(`Point source "${t.id}" has invalid emission properties.`);
		}
		if (x(t)) {
			let e = t.data?.shape ?? "plane", n = T(t, "height", 240), r = Math.abs(T(t, "radius", 160));
			if (e !== "plane" && e !== "convex" && e !== "concave" || n <= 0 || e !== "plane" && (r === 0 || n > r * 2)) throw TypeError(`Mirror "${t.id}" has invalid optical properties.`);
		}
	}
	if (e.edges.length > 0) throw TypeError("Optical rays are computed automatically; graph edges are not used.");
	if (n[0] && (n[0]?.x ?? 0) <= (t[0]?.x ?? 0)) throw TypeError("The screen must be placed to the right of the source.");
}
function H(e) {
	V(e);
	let t = e.nodes.find(v), n = e.nodes.find((e) => e.type === c), r = typeof e.data?.axisY == "number" ? e.data.axisY : t.y, i = e.nodes.filter((e) => e.type === "optics-converging-lens" || e.type === "optics-diverging-lens" || b(e)).filter((e) => Math.abs(e.y - r) < .5 && e.x > t.x && (!n || e.x < n.x)).sort((e, t) => e.x - t.x), a = [], o = [
		1,
		0,
		0,
		1
	], s = t.x;
	for (let e of i) {
		let t = b(e) ? T(e, "thickness", 100) : 0, n = e.x - t / 2, r = L(n - s);
		if (o = I(r, o), a.push({
			label: `Free space ${n - s}`,
			matrix: r,
			cumulative: o
		}), b(e)) {
			let n = T(e, "refractiveIndex", 1.5), r = T(e, "radius1", 100), i = T(e, "radius2", -100), c = z(1, n, r);
			o = I(c, o), a.push({
				label: `${e.label ?? e.id} front (R = ${r})`,
				matrix: c,
				cumulative: o
			});
			let l = L(t);
			o = I(l, o), a.push({
				label: `${e.label ?? e.id} glass (${t})`,
				matrix: l,
				cumulative: o
			});
			let u = z(n, 1, i);
			o = I(u, o), a.push({
				label: `${e.label ?? e.id} back (R = ${i})`,
				matrix: u,
				cumulative: o
			}), s = e.x + t / 2;
		} else {
			let t = T(e, "focalLength", 100), n = R(t);
			o = I(n, o), a.push({
				label: `${e.label ?? e.id} (f = ${t})`,
				matrix: n,
				cumulative: o
			}), s = e.x;
		}
	}
	let l = o, [, u, d, f] = l, p = i.length === 0 || Math.abs(f) < 1e-12 ? null : -u / f, m = p === null ? null : s + p, h = p === null ? null : l[0] + p * d, g = n?.x ?? m ?? s + 200, _ = L(g - s);
	return o = I(_, o), a.push({
		label: `${n ? "Free space" : "Image plane"} ${g - s}`,
		matrix: _,
		cumulative: o
	}), {
		axisY: r,
		sourceId: t.id,
		screenId: n?.id ?? null,
		matrix: o,
		stages: a,
		imageX: m,
		magnification: h,
		imageKind: p === null ? "afocal" : p >= 0 ? "real" : "virtual",
		orientation: h === null ? "undefined" : h < 0 ? "inverted" : "upright"
	};
}
function U(e, t) {
	let n = Math.max(10, Math.abs(T(e, "height", 60))), r = S(e) === "up" ? -1 : 1, i = r * n, a = i - r * 10, o = `<path class="tp-graph-shape tp-optics-object${t ? " is-selected" : ""}" d="M0 0V${i}M-7 ${a}L0 ${i}L7 ${a}"/><text class="tp-graph-label" y="${r < 0 ? 20 : -12}" text-anchor="middle">${w(e.label ?? "Object")}</text>`;
	return e.id === "preview" ? `<g class="tp-optics-object-preview" transform="translate(0 ${-r * n / 2})">${o}</g>` : o;
}
function W(e, t) {
	return `<circle class="tp-graph-shape tp-optics-point-source${t ? " is-selected" : ""}" r="7"/><circle class="tp-optics-point-source-halo" r="12"/><text class="tp-graph-label" y="27" text-anchor="middle">${w(e.label ?? "Point source")}</text>`;
}
function G(e, t, n, r, i) {
	let a = n ? `M0 ${-r}V${r}M-8 ${-r + 10}L0 ${-r}L8 ${-r + 10}M-8 ${r - 10}L0 ${r}L8 ${r - 10}` : `M0 ${-r}V${r}M-8 ${-r - 10}L0 ${-r}L8 ${-r - 10}M-8 ${r + 10}L0 ${r}L8 ${r + 10}`;
	return `<path class="tp-graph-shape tp-optics-lens tp-optics-color-${i} ${n ? "is-converging" : "is-diverging"}${t ? " is-selected" : ""}" d="${a}"/><text class="tp-graph-label" y="${r + 18}" text-anchor="middle">${w(e.label ?? "Lens")}</text>`;
}
function K(e, t, n, r) {
	let i = e.id === "preview" ? 22 : 10;
	return `<rect class="tp-graph-shape tp-optics-screen tp-optics-color-${r}${t ? " is-selected" : ""}" x="${-i / 2}" y="${-n}" width="${i}" height="${n * 2}"/><text class="tp-graph-label" y="${n + 16}" text-anchor="middle">${w(e.label ?? "Screen")}</text>`;
}
function q(e, t, n) {
	let r = T(e, "width", 160), i = T(e, "height", 240), a = T(e, "refractiveIndex", 1.5);
	return `<rect class="tp-graph-shape tp-optics-medium tp-optics-color-${n}${t ? " is-selected" : ""}" x="${-r / 2}" y="${-i / 2}" width="${r}" height="${i}"/><text class="tp-graph-label" y="${-i / 2 + 18}" text-anchor="middle">${w(e.label ?? "Medium")} · n=${a}</text>`;
}
function J(e, t, n) {
	let r = T(e, "width", 180), i = T(e, "height", 200), a = e.id === "preview" ? 6 : 18, o = e.id === "preview" ? 6 : 12, s = [];
	for (let t = 0; t < o; t += 1) for (let n = 0; n < a; n += 1) {
		let c = -r / 2 + (n + .5) * r / a, l = -i / 2 + (t + .5) * i / o;
		s.push({
			x: c,
			y: l,
			value: O(e, e.x + c, e.y + l)
		});
	}
	let c = s.map((e) => e.value), l = Math.min(...c), u = Math.max(...c), d = Math.max(1e-9, u - l), f = s.map((e) => `<rect class="tp-optics-grin-cell" x="${e.x - r / a / 2}" y="${e.y - i / o / 2}" width="${r / a + .2}" height="${i / o + .2}" fill-opacity="${(.1 + .4 * (e.value - l) / d).toFixed(3)}"/>`).join(""), p = e.id === "preview" ? "" : `<g class="tp-optics-grin-legend" transform="translate(${-r / 2} ${i / 2 + 16})"><rect width="${r}" height="7"/><text y="20">n min ${l.toFixed(3)}</text><text x="${r}" y="20" text-anchor="end">n max ${u.toFixed(3)}</text></g>`;
	return `<g class="tp-optics-grin-field tp-optics-color-${n}">${f}</g><rect class="tp-graph-shape tp-optics-grin-medium tp-optics-color-${n}${t ? " is-selected" : ""}" x="${-r / 2}" y="${-i / 2}" width="${r}" height="${i}"/><text class="tp-graph-label" y="${-i / 2 + 18}" text-anchor="middle">${w(e.label ?? "GRIN medium")} · ${E(e)}</text>${p}`;
}
function Y(e, t, n) {
	let r = T(e, "height", 240) / 2;
	return `<path class="tp-graph-shape tp-optics-plane-interface tp-optics-color-${n}${t ? " is-selected" : ""}" d="M0 ${-r}V${r}"/><line class="tp-optics-normal" x1="-30" y1="0" x2="30" y2="0"/><text class="tp-graph-label" y="${r + 18}" text-anchor="middle">${w(e.label ?? "Plane interface")}</text>`;
}
function X(e, t, n) {
	let r = k(e), i = T(e, "height", 240) / 2, a = [];
	for (let e = 0; e <= 24; e += 1) {
		let t = -i + e * i * 2 / 24, n = r - Math.sign(r) * Math.sqrt(Math.max(0, r * r - t * t));
		a.push(`${n},${t}`);
	}
	return `<polyline class="tp-graph-shape tp-optics-curved-interface tp-optics-color-${n}${t ? " is-selected" : ""}" points="${a.join(" ")}"/><line class="tp-optics-normal" x1="-30" y1="0" x2="30" y2="0"/><text class="tp-graph-label" y="${i + 18}" text-anchor="middle">${w(e.label ?? "Curved interface")}</text>`;
}
function Z(e, t, n) {
	let r = T(e, "height", 160) / 2, [i, a] = P(e), o = (t) => {
		let n = k(t), i = [];
		for (let a = 0; a <= 32; a += 1) {
			let o = -r + a * r * 2 / 32;
			i.push({
				x: t.x - e.x + n - Math.sign(n) * Math.sqrt(Math.max(0, n * n - o * o)),
				y: o
			});
		}
		return i;
	}, s = o(i), c = o(a), l = [...s, ...[...c].reverse()];
	return `<polygon class="tp-graph-shape tp-optics-spherical-lens tp-optics-color-${n}${t ? " is-selected" : ""}" points="${l.map((e) => `${e.x},${e.y}`).join(" ")}"/><text class="tp-graph-label" y="${r + 18}" text-anchor="middle">${w(e.label ?? "Spherical lens")}</text>`;
}
function Q(e, t, n) {
	let r = T(e, "height", 240) / 2, i = e.data?.shape ?? "plane", a = [];
	if (i === "plane") a.push(`0,${-r}`, `0,${r}`);
	else {
		let t = A(e);
		for (let e = 0; e <= 24; e += 1) {
			let n = -r + e * r * 2 / 24, i = t - Math.sign(t) * Math.sqrt(Math.max(0, t * t - n * n));
			a.push(`${i},${n}`);
		}
	}
	let o = e.id === "preview" ? 16 : 3, s = a.map((e) => {
		let [t, n] = e.split(",").map(Number);
		return `${(t ?? 0) + o},${n ?? 0}`;
	}).join(" ");
	return `<polyline class="tp-optics-mirror-backing${e.id === "preview" ? " is-preview\" style=\"stroke:#000" : ""}" points="${s}"/><polyline class="tp-graph-shape tp-optics-mirror tp-optics-color-${n}${t ? " is-selected" : ""}" points="${a.join(" ")}"/><text class="tp-graph-label" y="${r + 18}" text-anchor="middle">${w(e.label ?? "Mirror")}</text>`;
}
function te(e, t, n, r) {
	let i = k(e), a = {
		x: e.x + i,
		y: e.y
	}, o = Math.hypot(1, n), s = {
		x: r / o,
		y: -n * r / o
	}, c = {
		x: t.x - a.x,
		y: t.y - a.y
	}, l = 2 * (c.x * s.x + c.y * s.y), u = c.x * c.x + c.y * c.y - i * i, d = l * l - 4 * u;
	if (d < 0) return null;
	let f = [(-l - Math.sqrt(d)) / 2, (-l + Math.sqrt(d)) / 2].filter((e) => e > 1e-6).sort((e, t) => e - t), p = T(e, "height", 240) / 2;
	for (let n of f) {
		let o = {
			x: t.x + s.x * n,
			y: t.y + s.y * n
		}, c = o.y - e.y;
		if (Math.abs(c) > p) continue;
		let l = a.x - Math.sign(i) * Math.sqrt(Math.max(0, i * i - c * c));
		if (Math.abs(o.x - l) > .5) continue;
		let u = {
			x: (o.x - a.x) / Math.abs(i),
			y: (o.y - a.y) / Math.abs(i)
		};
		s.x * u.x + s.y * u.y > 0 && (u = {
			x: -u.x,
			y: -u.y
		});
		let d = (r > 0 ? T(e, "leftIndex", 1) : T(e, "rightIndex", 1.5)) / (r > 0 ? T(e, "rightIndex", 1.5) : T(e, "leftIndex", 1)), f = -(s.x * u.x + s.y * u.y), m = 1 - d * d * (1 - f * f);
		if (m < 0) return null;
		let h = {
			x: d * s.x + (d * f - Math.sqrt(m)) * u.x,
			y: d * s.y + (d * f - Math.sqrt(m)) * u.y
		};
		return {
			point: o,
			slope: -h.y / h.x
		};
	}
	return null;
}
function ne(e, t, n, r) {
	let i = A(e), a = {
		x: e.x + i,
		y: e.y
	}, o = Math.hypot(1, n), s = {
		x: r / o,
		y: -n * r / o
	}, c = {
		x: t.x - a.x,
		y: t.y - a.y
	}, l = 2 * (c.x * s.x + c.y * s.y), u = c.x * c.x + c.y * c.y - i * i, d = l * l - 4 * u;
	if (d < 0) return null;
	let f = [(-l - Math.sqrt(d)) / 2, (-l + Math.sqrt(d)) / 2].filter((e) => e > 1e-6).sort((e, t) => e - t), p = T(e, "height", 240) / 2;
	for (let n of f) {
		let o = {
			x: t.x + s.x * n,
			y: t.y + s.y * n
		}, c = o.y - e.y;
		if (Math.abs(c) > p) continue;
		let l = a.x - Math.sign(i) * Math.sqrt(Math.max(0, i * i - c * c));
		if (Math.abs(o.x - l) > .5) continue;
		let u = {
			x: (o.x - a.x) / Math.abs(i),
			y: (o.y - a.y) / Math.abs(i)
		}, d = s.x * u.x + s.y * u.y, f = {
			x: s.x - 2 * d * u.x,
			y: s.y - 2 * d * u.y
		};
		return {
			point: o,
			slope: -f.y / f.x,
			direction: Math.sign(f.x) || -r
		};
	}
	return null;
}
function re(e, t, n, r) {
	let i = T(e, "width", 180), a = T(e, "height", 200), o = T(e, "integrationStep", 2), s = e.x + r * i / 2, c = Math.max(.05, o * .1), l = Math.hypot(1, n), u = O(e, t.x + r * c, t.y), d = -n * r / l / u;
	if (Math.abs(d) >= 1) return {
		points: [t],
		slope: n,
		complete: !1
	};
	let f = {
		x: t.x,
		y: t.y,
		ux: r * Math.sqrt(1 - d * d),
		uy: d
	}, p = [t], m = (t) => {
		let n = O(e, t.x, t.y), r = (O(e, t.x + c, t.y) - O(e, t.x - c, t.y)) / (2 * c), i = (O(e, t.x, t.y + c) - O(e, t.x, t.y - c)) / (2 * c), a = t.ux * r + t.uy * i;
		return {
			x: t.ux,
			y: t.uy,
			ux: (r - t.ux * a) / n,
			uy: (i - t.uy * a) / n
		};
	}, h = (e, t, n) => ({
		x: e.x + t.x * n,
		y: e.y + t.y * n,
		ux: e.ux + t.ux * n,
		uy: e.uy + t.uy * n
	});
	for (let t = 0; t < 1e4; t += 1) {
		let t = f, n = m(f), i = m(h(f, n, o / 2)), l = m(h(f, i, o / 2)), u = m(h(f, l, o));
		f = {
			x: f.x + o * (n.x + 2 * i.x + 2 * l.x + u.x) / 6,
			y: f.y + o * (n.y + 2 * i.y + 2 * l.y + u.y) / 6,
			ux: f.ux + o * (n.ux + 2 * i.ux + 2 * l.ux + u.ux) / 6,
			uy: f.uy + o * (n.uy + 2 * i.uy + 2 * l.uy + u.uy) / 6
		};
		let d = Math.hypot(f.ux, f.uy);
		if (f.ux /= d, f.uy /= d, Math.abs(f.y - e.y) > a / 2) return p.push({
			x: f.x,
			y: f.y
		}), {
			points: p,
			slope: -f.uy / f.ux,
			complete: !1
		};
		if (r > 0 && f.x >= s || r < 0 && f.x <= s) {
			let n = (s - t.x) / (f.x - t.x), i = t.y + n * (f.y - t.y), a = O(e, s - r * c, i) * f.uy;
			if (p.push({
				x: s,
				y: i
			}), Math.abs(a) >= 1) return {
				points: p,
				slope: -f.uy / f.ux,
				complete: !1
			};
			let o = r * Math.sqrt(1 - a * a);
			return {
				points: p,
				slope: -a / o,
				complete: !0
			};
		}
		p.push({
			x: f.x,
			y: f.y
		});
	}
	return {
		points: p,
		slope: -f.uy / f.ux,
		complete: !1
	};
}
function ie(e, t, n) {
	let r = Math.ceil(e / 25) * 25, i = [];
	for (let e = r; e <= t; e += 25) {
		let t = e % 50 == 0;
		i.push(`<line class="tp-optics-axis-tick${t ? " is-major" : ""}" x1="${e}" y1="${n - (t ? 6 : 3)}" x2="${e}" y2="${n + (t ? 6 : 3)}"/>`), t && i.push(`<text class="tp-optics-axis-label" x="${e}" y="${n + 19}" text-anchor="middle">${e}</text>`);
	}
	return `<g class="tp-optics-axis-graduation"><line class="tp-optics-axis" x1="${e}" y1="${n}" x2="${t}" y2="${n}"/>${i.join("")}</g>`;
}
function ae(e, t) {
	let [n, r] = e, [i, a] = t, o = (n.x - r.x) * (i.y - a.y) - (n.y - r.y) * (i.x - a.x);
	if (Math.abs(o) < 1e-9) return null;
	let s = n.x * r.y - n.y * r.x, c = i.x * a.y - i.y * a.x, l = (s * (i.x - a.x) - (n.x - r.x) * c) / o, u = (s * (i.y - a.y) - (n.y - r.y) * c) / o;
	return Number.isFinite(l) && Number.isFinite(u) ? {
		x: l,
		y: u
	} : null;
}
var $ = class C extends e {
	static opticsStyleId = "tp-graph-geometric-optics-styles";
	static instanceCounter = 0;
	opticsInstanceId = ++C.instanceCounter;
	selectedOpticsId = null;
	constructor() {
		super(), this.unregisterPalette("generic");
		let e = (e) => j(this.value, e), t = (e) => this.opticalColorIndex(e), _ = (e) => M(this.value, e);
		this.registerPalette({
			id: "optics-sources",
			label: "Sources",
			shapes: [{
				type: n,
				label: "Object",
				description: "Luminous object",
				width: 40,
				height: (e) => Math.max(100, Math.abs(T(e, "height", 60)) + 30),
				createData: () => ({
					height: 60,
					rayCount: 3,
					direction: "up"
				}),
				render: U
			}, {
				type: r,
				label: "Point source",
				description: "Point emitting a divergent ray bundle",
				width: 40,
				height: 55,
				createData: () => ({
					rayCount: 3,
					openingAngle: 60,
					orientationAngle: 0
				}),
				render: W
			}]
		}), this.registerPalette({
			id: "optics-lenses",
			label: "Lenses",
			shapes: [
				{
					type: i,
					label: "Converging lens",
					description: "Positive thin lens",
					width: 34,
					height: (t) => e(t) * 2 + 30,
					createData: () => ({ focalLength: 100 }),
					render: (n, r) => G(n, r, !0, e(n), t(n))
				},
				{
					type: a,
					label: "Diverging lens",
					description: "Negative thin lens",
					width: 34,
					height: (t) => e(t) * 2 + 30,
					createData: () => ({ focalLength: -100 }),
					render: (n, r) => G(n, r, !1, e(n), t(n))
				},
				{
					type: o,
					label: "Biconvex lens",
					description: "Thick converging lens with two spherical surfaces",
					width: 110,
					height: (e) => T(e, "height", 160) + 30,
					createData: () => ({
						refractiveIndex: 1.5,
						thickness: 100,
						radius1: 100,
						radius2: -100,
						height: 160
					}),
					render: (e, n) => Z(e, n, t(e))
				},
				{
					type: s,
					label: "Biconcave lens",
					description: "Thick diverging lens with two spherical surfaces",
					width: 110,
					height: (e) => T(e, "height", 160) + 30,
					createData: () => ({
						refractiveIndex: 1.5,
						thickness: 100,
						radius1: -100,
						radius2: 100,
						height: 160
					}),
					render: (e, n) => Z(e, n, t(e))
				}
			]
		}), this.registerPalette({
			id: "optics-interfaces",
			label: "Interfaces",
			shapes: [
				{
					type: d,
					label: "Plane interface",
					description: "Plane boundary between two refractive indices",
					width: 50,
					height: (e) => T(e, "height", 240) + 30,
					createData: () => ({
						leftIndex: 1,
						rightIndex: 1.5,
						height: 240
					}),
					render: (e, n) => Y(e, n, t(e))
				},
				{
					type: f,
					label: "Convex interface",
					description: "Convex spherical boundary between two refractive indices",
					width: 90,
					height: (e) => T(e, "height", 240) + 30,
					createData: () => ({
						leftIndex: 1,
						rightIndex: 1.5,
						radius: 160,
						curvature: "convex",
						height: 240
					}),
					render: (e, n) => X(e, n, t(e))
				},
				{
					type: p,
					label: "Concave interface",
					description: "Concave spherical boundary between two refractive indices",
					width: 90,
					height: (e) => T(e, "height", 240) + 30,
					createData: () => ({
						leftIndex: 1,
						rightIndex: 1.5,
						radius: 160,
						curvature: "concave",
						height: 240
					}),
					render: (e, n) => X(e, n, t(e))
				}
			]
		}), this.registerPalette({
			id: "optics-media",
			label: "Media",
			shapes: [{
				type: l,
				label: "Homogeneous medium",
				description: "Parallel slab with a constant refractive index",
				width: (e) => T(e, "width", 160),
				height: (e) => T(e, "height", 240),
				createData: () => ({
					refractiveIndex: 1.5,
					width: 160,
					height: 240
				}),
				render: (e, n) => q(e, n, t(e))
			}, {
				type: u,
				label: "GRIN medium",
				description: "Continuous gradient-index medium",
				width: (e) => T(e, "width", 180),
				height: (e) => T(e, "height", 200) + 32,
				createData: () => ({
					profile: "parabolic",
					baseIndex: 1.5,
					gradient: -.001,
					coefficient: 2e-5,
					expression: "n0 - 0.00002*y^2",
					integrationStep: 2,
					width: 180,
					height: 200
				}),
				render: (e, n) => J(e, n, t(e))
			}]
		}), this.registerPalette({
			id: "optics-mirrors",
			label: "Mirrors",
			shapes: [
				{
					type: m,
					label: "Plane mirror",
					description: "Plane reflecting surface",
					width: 45,
					height: (e) => T(e, "height", 240) + 30,
					createData: () => ({
						shape: "plane",
						radius: 160,
						height: 240
					}),
					render: (e, n) => Q(e, n, t(e))
				},
				{
					type: g,
					label: "Concave mirror",
					description: "Concave spherical reflecting surface",
					width: 90,
					height: (e) => T(e, "height", 240) + 30,
					createData: () => ({
						shape: "concave",
						radius: 160,
						height: 240
					}),
					render: (e, n) => Q(e, n, t(e))
				},
				{
					type: h,
					label: "Convex mirror",
					description: "Convex spherical reflecting surface",
					width: 90,
					height: (e) => T(e, "height", 240) + 30,
					createData: () => ({
						shape: "convex",
						radius: 160,
						height: 240
					}),
					render: (e, n) => Q(e, n, t(e))
				}
			]
		}), this.registerPalette({
			id: "optics-screen",
			label: "Screen",
			shapes: [{
				type: c,
				label: "Screen",
				description: "Image observation screen",
				width: 24,
				height: (e) => _(e) * 2 + 28,
				render: (e, n) => K(e, n, _(e), t(e))
			}]
		}), this.addEventListener("tp-graph-selection-change", (e) => {
			this.selectedOpticsId = e.detail.id, this.updateControls();
		});
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(C.opticsStyleId, t);
	}
	setGraph(e) {
		V(e), super.setGraph(e);
	}
	addNode(e, t, n) {
		if (e !== "comment" && !_.includes(e)) throw TypeError(`Unsupported geometric-optics node type: ${e}`);
		if ((e === "optics-source" || e === "optics-point-source") && this.value.nodes.some(v)) throw TypeError("The optical bench already has a source.");
		if (e === "optics-screen" && this.value.nodes.some((t) => t.type === e)) throw TypeError("The optical bench already has a screen.");
		return super.addNode(e, t, n);
	}
	addEdge() {
		throw TypeError("Optical rays are computed automatically.");
	}
	edgeDirections() {
		return [];
	}
	graphWorldBounds() {
		let e = typeof this.value.data?.axisY == "number" ? this.value.data.axisY : 240;
		return {
			minX: 0,
			minY: e - 250,
			maxX: 1e3,
			maxY: e + 250
		};
	}
	analyze() {
		return H(this.value);
	}
	trace() {
		this.setGraph(this.value), this.dispatchEvent(new CustomEvent("tp-optics-trace", {
			bubbles: !0,
			detail: {
				analysis: this.analyze(),
				graph: this.value
			}
		}));
	}
	renderToolbarActions() {
		return "<label class=\"tp-optics-parameter\" hidden>Focal length <input type=\"number\" step=\"10\" data-optics-parameter=\"focalLength\" disabled></label><label class=\"tp-optics-parameter\" hidden>Object height <input type=\"number\" min=\"10\" step=\"10\" data-optics-parameter=\"height\" disabled></label><label class=\"tp-optics-parameter\" hidden>Object direction <select data-optics-object-direction disabled><option value=\"up\">Up</option><option value=\"down\">Down</option></select></label><label class=\"tp-optics-parameter\" hidden>Ray count <input type=\"number\" min=\"1\" max=\"10\" step=\"1\" data-optics-parameter=\"rayCount\" disabled></label><label class=\"tp-optics-parameter\" hidden>Opening angle <input type=\"number\" min=\"0\" max=\"360\" step=\"5\" data-optics-parameter=\"openingAngle\" disabled></label><label class=\"tp-optics-parameter\" hidden>Orientation <input type=\"number\" min=\"-180\" max=\"180\" step=\"5\" data-optics-parameter=\"orientationAngle\" disabled></label><label class=\"tp-optics-parameter\" hidden>Index <input type=\"number\" min=\"0.01\" step=\"0.01\" data-optics-parameter=\"refractiveIndex\" disabled></label><label class=\"tp-optics-parameter\" hidden>Width <input type=\"number\" min=\"10\" step=\"10\" data-optics-parameter=\"width\" disabled></label><label class=\"tp-optics-parameter\" hidden>GRIN profile <select data-optics-grin-profile disabled><option value=\"linear\">Linear n(y)</option><option value=\"radial\">Radial n(x,y)</option><option value=\"parabolic\">Parabolic n(y)</option><option value=\"custom\">Custom expression</option></select></label><label class=\"tp-optics-parameter\" hidden>Base index <input type=\"number\" min=\"0.01\" step=\"0.01\" data-optics-parameter=\"baseIndex\" disabled></label><label class=\"tp-optics-parameter\" hidden>Gradient <input type=\"number\" step=\"0.0001\" data-optics-parameter=\"gradient\" disabled></label><label class=\"tp-optics-parameter\" hidden>Coefficient <input type=\"number\" min=\"0\" step=\"0.00001\" data-optics-parameter=\"coefficient\" disabled></label><label class=\"tp-optics-parameter\" hidden>Step <input type=\"number\" min=\"0.1\" max=\"20\" step=\"0.5\" data-optics-parameter=\"integrationStep\" disabled></label><label class=\"tp-optics-parameter tp-optics-expression\" hidden>n(x,y) <input type=\"text\" data-optics-grin-expression disabled></label><label class=\"tp-optics-parameter\" hidden>Thickness <input type=\"number\" min=\"1\" step=\"5\" data-optics-parameter=\"thickness\" disabled></label><label class=\"tp-optics-parameter\" hidden>Front radius <input type=\"number\" step=\"10\" data-optics-parameter=\"radius1\" disabled></label><label class=\"tp-optics-parameter\" hidden>Back radius <input type=\"number\" step=\"10\" data-optics-parameter=\"radius2\" disabled></label><label class=\"tp-optics-parameter\" hidden>Left n <input type=\"number\" min=\"0.01\" step=\"0.01\" data-optics-parameter=\"leftIndex\" disabled></label><label class=\"tp-optics-parameter\" hidden>Right n <input type=\"number\" min=\"0.01\" step=\"0.01\" data-optics-parameter=\"rightIndex\" disabled></label><label class=\"tp-optics-parameter\" hidden>Curvature <select data-optics-curvature disabled><option value=\"convex\">Convex</option><option value=\"concave\">Concave</option></select></label><label class=\"tp-optics-parameter\" hidden>Mirror shape <select data-optics-mirror-shape disabled><option value=\"plane\">Plane</option><option value=\"convex\">Convex</option><option value=\"concave\">Concave</option></select></label><label class=\"tp-optics-parameter\" hidden>Radius <input type=\"number\" min=\"1\" step=\"10\" data-optics-parameter=\"radius\" disabled></label>";
	}
	renderResults() {
		try {
			let e = this.analyze(), t = (e) => `\\begin{pmatrix}${e[0].toFixed(3)}&${e[1].toFixed(3)}\\\\${e[2].toFixed(3)}&${e[3].toFixed(3)}\\end{pmatrix}`, n = (e) => `<tp-markdown><script type="tp/markdown">---\nextensions:\n  - math\n---\n:latexmath:\`${e}\`<\/script></tp-markdown>`, i = e.stages.map((e) => `<tr><th scope="row">${w(e.label)}</th><td>${n(t(e.matrix))}</td><td>${n(t(e.cumulative))}</td></tr>`).join(""), a = this.value.nodes.find((t) => t.id === e.sourceId), o = a.type === r, s = o ? 0 : Math.max(10, Math.abs(T(a, "height", 60))), c = e.magnification === null ? null : Math.abs(s * e.magnification), l = this.value.nodes.filter((e) => e.type === "optics-converging-lens" || e.type === "optics-diverging-lens" || b(e)).sort((e, t) => e.x - t.x), d = l.map((t) => `<article class="tp-optics-lens-details"><h5>${w(t.label ?? t.id)}</h5><dl><dt>Type</dt><dd>${b(t) ? t.type === "optics-biconvex-lens" ? "Biconvex spherical" : "Biconcave spherical" : t.type === "optics-converging-lens" ? "Converging thin" : "Diverging thin"}</dd><dt>Position</dt><dd>${t.x.toFixed(2)}</dd><dt>Focal length</dt><dd>${B(t).toFixed(2)}</dd>${b(t) ? `<dt>Index</dt><dd>${T(t, "refractiveIndex", 1.5).toFixed(3)}</dd><dt>Thickness</dt><dd>${T(t, "thickness", 100).toFixed(2)}</dd><dt>R₁ / R₂</dt><dd>${T(t, "radius1", 100).toFixed(2)} / ${T(t, "radius2", -100).toFixed(2)}</dd>` : ""}<dt>On axis</dt><dd>${Math.abs(t.y - e.axisY) < .5 ? "Yes" : "No"}</dd></dl></article>`).join(""), f = this.value.nodes.filter((e) => e.type === u), p = f.map((e) => {
				let t = T(e, "width", 180), n = T(e, "height", 200), r = [
					-1,
					-.5,
					0,
					.5,
					1
				].flatMap((r) => [
					-1,
					-.5,
					0,
					.5,
					1
				].map((i) => O(e, e.x + r * t / 2, e.y + i * n / 2))), i = E(e) === "custom" ? String(e.data?.expression ?? "n0 - 0.00002*y^2") : E(e);
				return `<article class="tp-optics-lens-details"><h5>${w(e.label ?? e.id)}</h5><dl><dt>Profile</dt><dd>${E(e)}</dd><dt>Law</dt><dd><code>${w(i)}</code></dd><dt>Index range</dt><dd>${Math.min(...r).toFixed(3)} – ${Math.max(...r).toFixed(3)}</dd><dt>Integration step</dt><dd>${T(e, "integrationStep", 2).toFixed(2)}</dd></dl></article>`;
			}).join(""), m = e.magnification === null ? "undefined" : S(a) === "up" == e.magnification > 0 ? "up" : "down", h = l.length === 0 ? "" : `<h4>Image</h4><dl><dt>Position</dt><dd>${e.imageX?.toFixed(2) ?? "At infinity"}</dd><dt>Height</dt><dd>${c?.toFixed(2) ?? "Undefined"}</dd><dt>Magnification</dt><dd>${e.magnification?.toFixed(3) ?? "Undefined"}</dd><dt>Kind</dt><dd>${e.imageKind}</dd><dt>Relative orientation</dt><dd>${e.orientation}</dd><dt>Direction</dt><dd>${m}</dd></dl>`, g = this.value.nodes.filter(y).map((e) => ({
				x: e.x,
				y: e.y,
				halfHeight: T(e, "height", 240) / 2,
				n1: T(e, "leftIndex", 1),
				n2: T(e, "rightIndex", 1.5),
				label: `${e.label ?? e.id} (${k(e) > 0 ? "convex" : "concave"}, R=${Math.abs(k(e))})`
			})), _ = [...N(this.value), ...g].sort((e, t) => e.x - t.x), v = _.map((e) => {
				let t = e.n1 > e.n2 ? `${(Math.asin(e.n2 / e.n1) * 180 / Math.PI).toFixed(2)}°` : "None";
				return `<tr><th scope="row">${w(e.label)}</th><td>${e.x.toFixed(2)}</td><td>${e.n1.toFixed(3)}</td><td>${e.n2.toFixed(3)}</td><td>${t}</td></tr>`;
			}).join(""), C = _.length === 0 ? "" : `<div class="tp-optics-snell"><h4>Snell–Descartes law</h4>${n("n_1\\sin(i)=n_2\\sin(r)")}<table><thead><tr><th>Interface</th><th>Position</th><th>n₁</th><th>n₂</th><th>Critical angle</th></tr></thead><tbody>${v}</tbody></table></div>`, D = this.value.nodes.filter(x), A = D.length === 0 ? "" : `<div class="tp-optics-reflection"><h4>Law of reflection</h4>${n("i=r")}<dl>${D.map((e) => `<dt>${w(e.label ?? e.id)}</dt><dd>${String(e.data?.shape ?? "plane")}</dd>`).join("")}</dl></div>`, j = f.length === 0 ? "" : `<div class="tp-optics-snell"><h4>Gradient-index ray equation</h4>${n("\\frac{d}{ds}\\left(n\\frac{d\\mathbf r}{ds}\\right)=\\nabla n")}<p>Ray paths are integrated numerically with the step stored by each GRIN medium.</p></div>`;
			return `<h3 class="tp-graph-results-header">Paraxial analysis</h3><div class="tp-graph-results-content tp-optics-results"><section class="tp-optics-analysis-summary">${o ? `<h4>Point source</h4><dl><dt>Position x</dt><dd>${a.x.toFixed(2)}</dd><dt>Position y</dt><dd>${a.y.toFixed(2)}</dd><dt>Ray count</dt><dd>${T(a, "rayCount", 3)}</dd><dt>Opening angle</dt><dd>${T(a, "openingAngle", 60).toFixed(2)}°</dd><dt>Orientation</dt><dd>${T(a, "orientationAngle", 0).toFixed(2)}°</dd></dl>` : `<h4>Object</h4><dl><dt>Position</dt><dd>${a.x.toFixed(2)}</dd><dt>Height</dt><dd>${s.toFixed(2)}</dd><dt>Direction</dt><dd>${S(a)}</dd></dl>`}${h}<h4>Lenses</h4>${d || "<p>None</p>"}<h4>GRIN media</h4>${p || "<p>None</p>"}</section><section><h4>ABCD matrices</h4>${n(`M=${t(e.matrix)}`)}<table><thead><tr><th>Stage</th><th>Element</th><th>Cumulative</th></tr></thead><tbody>${i}</tbody></table>${C}${j}${A}</section></div>`;
		} catch (e) {
			return `<h3 class="tp-graph-results-header">Paraxial analysis</h3><div class="tp-graph-results-content">${w(e instanceof Error ? e.message : "Analysis unavailable.")}</div>`;
		}
	}
	bindExtensionEvents() {
		for (let e of this.querySelectorAll("[data-optics-parameter]")) e.addEventListener("change", () => this.updateParameter(e.dataset.opticsParameter ?? "", Number(e.value)));
		this.querySelector("[data-optics-curvature]")?.addEventListener("change", (e) => this.updateCurvature(e.currentTarget.value)), this.querySelector("[data-optics-mirror-shape]")?.addEventListener("change", (e) => this.updateMirrorShape(e.currentTarget.value)), this.querySelector("[data-optics-grin-profile]")?.addEventListener("change", (e) => this.updateGrinProfile(e.currentTarget.value)), this.querySelector("[data-optics-object-direction]")?.addEventListener("change", (e) => this.updateObjectDirection(e.currentTarget.value));
		let e = this.querySelector("[data-optics-grin-expression]");
		e?.addEventListener("input", () => this.validateGrinExpressionField(e)), e?.addEventListener("change", () => {
			this.validateGrinExpressionField(e) && this.updateGrinExpression(e.value);
		}), this.renderOverlay(), this.updateControls();
	}
	updateParameter(e, t) {
		if (!this.selectedOpticsId || !Number.isFinite(t)) return;
		let n = this.value, r = n.nodes.find((e) => e.id === this.selectedOpticsId);
		if (r) {
			if (e === "height" && r.type === "optics-source") r.data = {
				...r.data ?? {},
				height: Math.max(10, Math.abs(t))
			};
			else if (e === "focalLength" && (r.type === "optics-converging-lens" || r.type === "optics-diverging-lens")) r.data = {
				...r.data ?? {},
				focalLength: (r.type === "optics-converging-lens" ? 1 : -1) * Math.max(1, Math.abs(t))
			};
			else if (e === "refractiveIndex" && (r.type === "optics-medium" || b(r))) r.data = {
				...r.data ?? {},
				refractiveIndex: Math.max(.01, t)
			};
			else if (e === "width" && r.type === "optics-medium") r.data = {
				...r.data ?? {},
				width: Math.max(10, t)
			};
			else if (e === "width" && r.type === "optics-grin-medium") r.data = {
				...r.data ?? {},
				width: Math.max(10, t)
			};
			else if (e === "baseIndex" && r.type === "optics-grin-medium") r.data = {
				...r.data ?? {},
				baseIndex: Math.max(.01, t)
			};
			else if (e === "gradient" && r.type === "optics-grin-medium") r.data = {
				...r.data ?? {},
				gradient: t
			};
			else if (e === "coefficient" && r.type === "optics-grin-medium") r.data = {
				...r.data ?? {},
				coefficient: Math.max(0, t)
			};
			else if (e === "integrationStep" && r.type === "optics-grin-medium") r.data = {
				...r.data ?? {},
				integrationStep: Math.min(20, Math.max(.1, t))
			};
			else if (e === "thickness" && b(r)) r.data = {
				...r.data ?? {},
				thickness: Math.max(F(r), t)
			};
			else if ((e === "radius1" || e === "radius2") && b(r) && t !== 0) r.data = {
				...r.data ?? {},
				[e]: t
			}, r.data = {
				...r.data,
				thickness: Math.max(T(r, "thickness", 100), F(r))
			};
			else if (e === "rayCount" && r.type === "optics-point-source") r.data = {
				...r.data ?? {},
				rayCount: Math.min(10, Math.max(1, Math.round(t)))
			};
			else if (e === "openingAngle" && r.type === "optics-point-source") r.data = {
				...r.data ?? {},
				openingAngle: Math.min(360, Math.max(0, t))
			};
			else if (e === "orientationAngle" && r.type === "optics-point-source") r.data = {
				...r.data ?? {},
				orientationAngle: Math.min(180, Math.max(-180, t))
			};
			else if ((e === "leftIndex" || e === "rightIndex") && r.type === "optics-plane-interface") r.data = {
				...r.data ?? {},
				[e]: Math.max(.01, t)
			};
			else if ((e === "leftIndex" || e === "rightIndex") && y(r)) r.data = {
				...r.data ?? {},
				[e]: Math.max(.01, t)
			};
			else if (e === "radius" && (y(r) || x(r))) {
				let e = T(r, "height", 240) / 2;
				r.data = {
					...r.data ?? {},
					radius: Math.max(e, Math.abs(t))
				};
			} else return;
			this.setGraph(n);
		}
	}
	updateCurvature(e) {
		if (!this.selectedOpticsId || e !== "convex" && e !== "concave") return;
		let t = this.value, n = t.nodes.find((e) => e.id === this.selectedOpticsId);
		!n || !y(n) || (n.data = {
			...n.data ?? {},
			radius: Math.abs(T(n, "radius", 160)),
			curvature: e
		}, this.setGraph(t));
	}
	updateMirrorShape(e) {
		if (!this.selectedOpticsId || e !== "plane" && e !== "convex" && e !== "concave") return;
		let t = this.value, n = t.nodes.find((e) => e.id === this.selectedOpticsId);
		!n || !x(n) || (n.data = {
			...n.data ?? {},
			shape: e,
			radius: Math.abs(T(n, "radius", 160))
		}, this.setGraph(t));
	}
	updateGrinProfile(e) {
		if (!this.selectedOpticsId || e !== "linear" && e !== "radial" && e !== "parabolic" && e !== "custom") return;
		let t = this.value, n = t.nodes.find((e) => e.id === this.selectedOpticsId);
		!n || n.type !== "optics-grin-medium" || (n.data = {
			...n.data ?? {},
			profile: e
		}, this.setGraph(t));
	}
	updateObjectDirection(e) {
		if (!this.selectedOpticsId || e !== "up" && e !== "down") return;
		let t = this.value, n = t.nodes.find((e) => e.id === this.selectedOpticsId);
		!n || n.type !== "optics-source" || (n.data = {
			...n.data ?? {},
			direction: e
		}, this.setGraph(t));
	}
	updateGrinExpression(e) {
		if (!this.selectedOpticsId) return;
		let t = this.value, n = t.nodes.find((e) => e.id === this.selectedOpticsId);
		!n || n.type !== "optics-grin-medium" || (D(e), n.data = {
			...n.data ?? {},
			expression: e
		}, this.setGraph(t));
	}
	validateGrinExpressionField(e) {
		let t = this.value.nodes.find((e) => e.id === this.selectedOpticsId), n = t?.type === u;
		if (n && t) try {
			let r = D(e.value), i = T(t, "baseIndex", 1.5), a = T(t, "width", 180), o = T(t, "height", 200);
			n = [
				-a / 2,
				0,
				a / 2
			].every((e) => [
				-o / 2,
				0,
				o / 2
			].every((t) => {
				let n = r({
					x: e,
					y: t,
					n0: i
				});
				return Number.isFinite(n) && n > 0;
			}));
		} catch {
			n = !1;
		}
		return e.setAttribute("aria-invalid", String(!n)), n;
	}
	updateControls() {
		let e = this.value.nodes.find((e) => e.id === this.selectedOpticsId), t = this.querySelector("[data-optics-parameter=\"focalLength\"]"), i = this.querySelector("[data-optics-parameter=\"height\"]");
		if (t) {
			let n = e?.type === "optics-converging-lens" || e?.type === "optics-diverging-lens";
			t.disabled = !n, t.closest(".tp-optics-parameter")?.toggleAttribute("hidden", !n), t.value = n && e ? String(T(e, "focalLength", 100)) : "";
		}
		if (i) {
			let t = e?.type === n;
			i.disabled = !t, i.closest(".tp-optics-parameter")?.toggleAttribute("hidden", !t), i.value = t && e ? String(T(e, "height", 60)) : "";
		}
		let a = this.querySelector("[data-optics-object-direction]"), o = e?.type === n;
		a && (a.disabled = !o, a.closest(".tp-optics-parameter")?.toggleAttribute("hidden", !o), a.value = o && e ? S(e) : "up");
		for (let t of [
			"rayCount",
			"openingAngle",
			"orientationAngle"
		]) {
			let n = this.querySelector(`[data-optics-parameter="${t}"]`), i = e?.type === r, a = t === "rayCount" ? 3 : t === "openingAngle" ? 60 : 0;
			n && (n.disabled = !i, n.closest(".tp-optics-parameter")?.toggleAttribute("hidden", !i), n.value = i && e ? String(T(e, t, a)) : "");
		}
		for (let t of [
			"refractiveIndex",
			"width",
			"leftIndex",
			"rightIndex"
		]) {
			let n = this.querySelector(`[data-optics-parameter="${t}"]`), r = t === "refractiveIndex" ? e?.type === "optics-medium" || e !== void 0 && b(e) : t === "width" ? e?.type === "optics-medium" || e?.type === "optics-grin-medium" : e?.type === "optics-plane-interface" || e !== void 0 && y(e), i = t === "width" ? 160 : t === "leftIndex" ? 1 : 1.5;
			n && (n.disabled = !r, n.closest(".tp-optics-parameter")?.toggleAttribute("hidden", !r), n.value = r && e ? String(T(e, t, i)) : "");
		}
		for (let t of [
			"thickness",
			"radius1",
			"radius2"
		]) {
			let n = this.querySelector(`[data-optics-parameter="${t}"]`), r = e !== void 0 && b(e), i = t === "thickness" || t === "radius1" ? 100 : -100;
			n && (n.disabled = !r, n.closest(".tp-optics-parameter")?.toggleAttribute("hidden", !r), n.value = r && e ? String(T(e, t, i)) : "", t === "thickness" && (n.min = r && e ? String(F(e)) : "1"));
		}
		let s = e?.type === u, c = this.querySelector("[data-optics-grin-profile]"), l = this.querySelector("[data-optics-grin-expression]");
		c && (c.disabled = !s, c.closest(".tp-optics-parameter")?.toggleAttribute("hidden", !s), c.value = s && e ? E(e) : "parabolic");
		for (let t of [
			"baseIndex",
			"gradient",
			"coefficient",
			"integrationStep"
		]) {
			let n = this.querySelector(`[data-optics-parameter="${t}"]`), r = s && (t === "baseIndex" || t === "integrationStep" || t === "gradient" && (c?.value === "linear" || c?.value === "radial") || t === "coefficient" && c?.value === "parabolic"), i = t === "baseIndex" ? 1.5 : t === "gradient" ? -.001 : t === "coefficient" ? 2e-5 : 2;
			n && (n.disabled = !r, n.closest(".tp-optics-parameter")?.toggleAttribute("hidden", !r), n.value = r && e ? String(T(e, t, i)) : "");
		}
		let d = s && c?.value === "custom";
		l && (l.disabled = !d, l.closest(".tp-optics-parameter")?.toggleAttribute("hidden", !d), l.value = d && e && typeof e.data?.expression == "string" ? e.data.expression : "n0 - 0.00002*y^2", d ? this.validateGrinExpressionField(l) : l.removeAttribute("aria-invalid"));
		let f = this.querySelector("[data-optics-parameter=\"radius\"]"), p = this.querySelector("[data-optics-curvature]"), m = this.querySelector("[data-optics-mirror-shape]"), h = e !== void 0 && y(e) || e !== void 0 && x(e) && e.data?.shape !== "plane";
		f && (f.disabled = !h, f.closest(".tp-optics-parameter")?.toggleAttribute("hidden", !h), f.value = h && e ? String(Math.abs(k(e))) : "");
		let g = e !== void 0 && y(e);
		p && (p.disabled = !g, p.closest(".tp-optics-parameter")?.toggleAttribute("hidden", !g), p.value = g && e && k(e) < 0 ? "concave" : "convex");
		let _ = e !== void 0 && x(e);
		m && (m.disabled = !_, m.closest(".tp-optics-parameter")?.toggleAttribute("hidden", !_), m.value = _ && e && typeof e.data?.shape == "string" ? e.data.shape : "plane");
	}
	opticalColorIndex(e) {
		let t = this.value.nodes.filter((t) => t.type === e.type);
		return Math.max(0, t.findIndex((t) => t.id === e.id)) % 5;
	}
	traceRayPoints(e, t, n, r = 1) {
		let i = this.value, a = i.nodes.find((e) => e.id === n.sourceId), o = i.nodes.find((e) => e.id === n.screenId), s = r > 0 ? o?.x ?? 1e3 : 0, c = (e) => r > 0 ? e > a.x && e < s : e < a.x && e > s, l = i.nodes.filter((e) => e.type === "optics-converging-lens" || e.type === "optics-diverging-lens").filter((e) => Math.abs(e.y - n.axisY) < .5 && c(e.x)).sort((e, t) => (e.x - t.x) * r), u = N(i).filter((e) => c(e.x)), d = [...i.nodes.filter((e) => y(e) && c(e.x)), ...i.nodes.filter((e) => b(e) && Math.abs(e.y - n.axisY) < .5).flatMap(P).filter((e) => c(e.x))], f = i.nodes.filter((e) => x(e) && c(e.x)), p = i.nodes.filter((e) => e.type === "optics-grin-medium" && c(e.x - r * T(e, "width", 180) / 2)), m = [
			...l.map((e) => ({
				x: e.x,
				lens: e,
				face: null,
				curved: null,
				mirror: null,
				grin: null
			})),
			...u.map((e) => ({
				x: e.x,
				lens: null,
				face: e,
				curved: null,
				mirror: null,
				grin: null
			})),
			...d.map((e) => ({
				x: e.x,
				lens: null,
				face: null,
				curved: e,
				mirror: null,
				grin: null
			})),
			...f.map((e) => ({
				x: e.x,
				lens: null,
				face: null,
				curved: null,
				mirror: e,
				grin: null
			})),
			...p.map((e) => ({
				x: e.x - r * T(e, "width", 180) / 2,
				lens: null,
				face: null,
				curved: null,
				mirror: null,
				grin: e
			}))
		].sort((e, t) => (e.x - t.x) * r), h = a.x, g = e, _ = [{
			x: h,
			y: n.axisY - g
		}];
		for (let e of m) {
			if (e.grin) {
				g += (e.x - h) * t, h = e.x, _.push({
					x: h,
					y: n.axisY - g
				});
				let i = T(e.grin, "height", 200) / 2;
				if (Math.abs(n.axisY - g - e.grin.y) > i) {
					h = e.grin.x + r * T(e.grin, "width", 180) / 2, g += (h - e.x) * t, _.push({
						x: h,
						y: n.axisY - g
					});
					continue;
				}
				let a = re(e.grin, {
					x: h,
					y: n.axisY - g
				}, t, r);
				_.push(...a.points.slice(1));
				let o = a.points.at(-1);
				if (h = o.x, g = n.axisY - o.y, t = a.slope, !a.complete) return _;
				continue;
			}
			if (e.mirror) {
				let i = e.mirror.data?.shape ?? "plane", a = -r, s = -t;
				if (i === "plane") {
					if (g += (e.x - h) * t, h = e.x, Math.abs(n.axisY - g - e.mirror.y) > T(e.mirror, "height", 240) / 2) continue;
					_.push({
						x: h,
						y: n.axisY - g
					});
				} else {
					let i = ne(e.mirror, {
						x: h,
						y: n.axisY - g
					}, t, r);
					if (!i) continue;
					h = i.point.x, g = n.axisY - i.point.y, a = i.direction, s = i.slope, _.push(i.point);
				}
				let c = a > 0 ? o?.x ?? 1e3 : 0;
				return g += (c - h) * s, _.push({
					x: c,
					y: n.axisY - g
				}), _;
			}
			if (e.curved) {
				let i = te(e.curved, {
					x: h,
					y: n.axisY - g
				}, t, r);
				i && (h = i.point.x, g = n.axisY - i.point.y, t = i.slope, _.push(i.point));
				continue;
			}
			if (g += (e.x - h) * t, h = e.x, _.push({
				x: h,
				y: n.axisY - g
			}), e.lens && Math.abs(g) <= j(i, e.lens) && (t -= r * g / T(e.lens, "focalLength", 100)), e.face && Math.abs(n.axisY - g - e.face.y) <= e.face.halfHeight) {
				let n = r > 0 ? e.face.n1 : e.face.n2, i = r > 0 ? e.face.n2 : e.face.n1, a = n * Math.sin(Math.atan(t)) / i;
				if (Math.abs(a) > 1) break;
				t = Math.tan(Math.asin(a));
			}
		}
		return (r > 0 && h < s || r < 0 && h > s) && (g += (s - h) * t, _.push({
			x: s,
			y: n.axisY - g
		})), _;
	}
	mountOpticsOverlay(e, t) {
		this.querySelector(".tp-graph-nodes")?.after(e);
		let n = this.querySelector(`[data-node-id="${CSS.escape(t)}"]`);
		n && e.parentNode && e.after(n);
	}
	renderOverlay() {
		let e;
		try {
			e = this.analyze();
		} catch {
			return;
		}
		let t = this.value, n = t.nodes.find((t) => t.id === e.sourceId), i = t.nodes.find((t) => t.id === e.screenId)?.x ?? 1e3, a = t.nodes.filter((e) => e.type.includes("lens")).filter((t) => Math.abs(t.y - e.axisY) < .5), o = n.type === r, s = document.createElementNS("http://www.w3.org/2000/svg", "g");
		s.setAttribute("class", "tp-optics-overlay");
		let c = ie(0, 1e3, e.axisY);
		if (!o && a.length === 0 && N(t).length === 0 && !t.nodes.some((e) => y(e) || x(e) || e.type === "optics-grin-medium")) {
			s.innerHTML = c, this.mountOpticsOverlay(s, n.id);
			return;
		}
		let l = Math.max(10, Math.abs(T(n, "height", 60))), u = o ? e.axisY - n.y : S(n) === "up" ? l : -l, d = a.filter((e) => e.x > n.x && e.x < i).sort((e, t) => e.x - t.x)[0], f = d ? d.x - n.x : 1, p = d ? B(d) : 100, m = f - p, h = Math.round(T(n, "rayCount", 3)), g = T(n, "openingAngle", 60) * Math.PI / 180, _ = T(n, "orientationAngle", 0) * Math.PI / 180, v = o ? Array.from({ length: h }, (e, t) => h === 1 ? _ : g >= Math.PI * 2 ? _ - Math.PI + t * Math.PI * 2 / h : _ - g / 2 + t * g / (h - 1)) : [], C = d ? p > 0 && m <= 0 ? -u / (f + p) : Math.abs(m) > .001 ? -u / m : -u / (f + Math.abs(p)) : -.1, w = [
			0,
			d ? -u / f : .1,
			C
		], E = o ? v.map((t) => Math.abs(Math.cos(t)) < 1e-6 ? [{
			x: n.x,
			y: n.y
		}, {
			x: n.x,
			y: Math.sin(t) > 0 ? 0 : e.axisY * 2
		}] : this.traceRayPoints(u, Math.tan(t), e, Math.sign(Math.cos(t)))) : w.map((t) => this.traceRayPoints(u, t, e)), D = a.filter((e) => e.x > n.x && e.x < i).sort((e, t) => e.x - t.x), O = E.map((e, t) => {
			let r = [];
			D.length === 0 && r.push("<stop class=\"tp-optics-color-0\" offset=\"0\"/><stop class=\"tp-optics-color-0\" offset=\"100%\"/>");
			for (let [e, t] of D.entries()) {
				let a = this.opticalColorIndex(t);
				if (e === 0) r.push(`<stop class="tp-optics-color-${a}" offset="0"/>`);
				else {
					let o = this.opticalColorIndex(D[e - 1]), s = `${(t.x - n.x) / (i - n.x) * 100}%`;
					r.push(`<stop class="tp-optics-color-${o}" offset="${s}"/><stop class="tp-optics-color-${a}" offset="${s}"/>`);
				}
				e === D.length - 1 && r.push(`<stop class="tp-optics-color-${a}" offset="100%"/>`);
			}
			return `<linearGradient id="tp-optics-ray-gradient-${this.opticsInstanceId}-${t}" gradientUnits="userSpaceOnUse" x1="${n.x}" x2="${i}">${r.join("")}</linearGradient>`;
		}).join(""), k = E.map((e, t) => `<polyline class="tp-optics-ray tp-optics-ray-${t + 1}" style="stroke:url(#tp-optics-ray-gradient-${this.opticsInstanceId}-${t})" points="${e.map((e) => `${e.x},${e.y}`).join(" ")}"/>`).join(""), A = a.map((t) => {
			let n = Math.abs(B(t)), r = this.opticalColorIndex(t);
			return `<circle class="tp-optics-focus tp-optics-color-${r}" cx="${t.x - n}" cy="${e.axisY}" r="3"/><circle class="tp-optics-focus tp-optics-color-${r}" cx="${t.x + n}" cy="${e.axisY}" r="3"/>`;
		}).join(""), j = E.map((e) => e.length > 2 ? [e.at(-2), e.at(-1)] : null).filter((e) => e !== null), M = [];
		if (e.imageKind !== "afocal" && a.some(b)) for (let e = 0; e < j.length; e += 1) for (let t = e + 1; t < j.length; t += 1) {
			let n = ae(j[e], j[t]);
			n && n.x > -1500 && n.x < 2250 && n.y > -1e3 && n.y < 1500 && M.push(n);
		}
		let P = M.map((e) => `<circle class="tp-optics-ray-intersection" cx="${e.x}" cy="${e.y}" r="4"/>`).join(""), F = M.length < 2 ? "" : (() => {
			let e = M.map((e) => e.x), t = M.map((e) => e.y), n = Math.min(...e), r = Math.max(...e), i = Math.min(...t), a = Math.max(...t);
			return `<ellipse class="tp-optics-image-spread" cx="${(n + r) / 2}" cy="${(i + a) / 2}" rx="${Math.max(6, (r - n) / 2 + 4)}" ry="${Math.max(6, (a - i) / 2 + 4)}"/>`;
		})(), I = e.magnification === null ? null : u * e.magnification, L = a.filter((e) => e.x > n.x && e.x < i).sort((e, t) => e.x - t.x).at(-1), R = M.length > 0 ? Math.min(...M.map((e) => e.x), e.imageX ?? Infinity) : e.imageX;
		s.innerHTML = `${c}<defs>${O}</defs>${A}${e.imageKind !== "virtual" || R === null || !L ? "" : j.map(([e, t]) => {
			let n = t.x - e.x;
			if (Math.abs(n) < 1e-9) return "";
			let r = e.y + (R - e.x) * (t.y - e.y) / n;
			return `<line class="tp-optics-virtual-ray tp-optics-image-extension tp-optics-color-${this.opticalColorIndex(L)}" x1="${R}" y1="${r}" x2="${e.x}" y2="${e.y}"/>`;
		}).join("")}${k}${F}${P}${e.imageX === null || I === null ? "" : o ? `<circle class="tp-optics-image tp-optics-point-image" cx="${e.imageX}" cy="${e.axisY - I}" r="6"/><text class="tp-optics-image-label" x="${e.imageX}" y="${e.axisY - I - 12}" text-anchor="middle">Paraxial image</text>` : `<path class="tp-optics-image" d="M${e.imageX} ${e.axisY}V${e.axisY - I}M${e.imageX - 7} ${e.axisY - I + Math.sign(I) * 10}L${e.imageX} ${e.axisY - I}L${e.imageX + 7} ${e.axisY - I + Math.sign(I) * 10}"/><text class="tp-optics-image-label" x="${e.imageX}" y="${e.axisY - I + (I < 0 ? 18 : -10)}" text-anchor="middle">Paraxial image</text>`}`, this.mountOpticsOverlay(s, n.id);
	}
};
customElements.get("tp-graph-geometric-optics") || customElements.define("tp-graph-geometric-optics", $);
//#endregion
export { H as _, i as a, a as c, m as d, d as f, $ as g, n as h, g as i, u as l, c as m, o as n, h as o, r as p, p as r, f as s, s as t, l as u, V as v };

