import { Ku as e } from "./lib/typescript/typescript.js";
import { TpDeclarativeTextSource as t } from "../utilities/declarative-text-source.js";
import "./save-image.js";
//#region ../../../../../../@tp/tp-utilities/dist/l-system/l-system-parser.js
var n = 4, r = 90, i = 10;
function a(e, t = {}) {
	let a = t.defaultIterations ?? n, u = t.defaultAngleDeg ?? r, h = t.defaultStep ?? i, g = "", _ = a, v = u, y = h, b, x, S, C, w = /* @__PURE__ */ new Map(), T = [];
	for (let n of e.split(/\r?\n/)) {
		let e = c(n).trim();
		if (e === "") continue;
		let r = l(e);
		if (r !== null) {
			let { key: e, value: n } = r;
			switch (e) {
				case "label": continue;
				case "axiom":
					g = n.trim();
					continue;
				case "iterations":
					_ = d(n, "iterations");
					continue;
				case "angle":
					v = f(n, "angle");
					continue;
				case "step":
					y = f(n, "step");
					continue;
				case "orientation":
					b = p(n);
					continue;
				case "draw":
					x = m(n);
					continue;
				case "move":
					S = m(n);
					continue;
				case "seed":
					C = f(n, "seed");
					continue;
				case "rule": {
					let e = o(n);
					if (e !== null) {
						w.set(e.symbol, e.replacement);
						continue;
					}
					let t = s(n);
					if (t !== null) {
						T.push(t);
						let e = t.predecessor, n = t.branches[0];
						(e.params?.length ?? 0) === 0 && !t.condition && t.branches.length === 1 && n !== void 0 && w.set(e.symbol, n.replacement);
						continue;
					}
					throw Error(`Invalid rule: ${n}`);
				}
				default:
					if (t.strict === !0) throw Error(`Unknown directive: ${e}`);
					continue;
			}
		}
		if (t.strict === !0) throw Error(`Invalid line: ${e}`);
	}
	if (g.trim() === "") throw Error("Missing required directive: axiom");
	return {
		axiom: g,
		iterations: _,
		angleDeg: v,
		step: y,
		rules: w,
		rulesV2: T.length > 0 ? T : void 0,
		seed: C,
		orientation: b,
		drawSymbols: x,
		moveSymbols: S
	};
}
function o(e) {
	let t = u(e, /^(\S)\s*=>\s*(.*)$/);
	if (t === null) return null;
	let [n, r] = t;
	return {
		symbol: n,
		replacement: r
	};
}
function s(e) {
	let t = e.match(/^(\S)(?:\(([^)]*)\))?(?:\s*:\s*(.*?))?\s*=>\s*(.+)$/);
	if (t === null) return null;
	let n = t[1], r = t[2], i = t[3], a = t[4];
	if (!n || !a) return null;
	let o = r ? r.split(",").map((e) => e.trim()).filter((e) => e.length > 0) : void 0, s = a.split("|").map((e) => e.trim()).filter((e) => e.length > 0).map((e) => {
		let t = e.match(/^([0-9]*\.?[0-9]+)\s*:\s*(.+)$/);
		if (t === null) return { replacement: e };
		let n = t[1], r = t[2];
		return n === void 0 || r === void 0 ? { replacement: e } : {
			weight: Number(n),
			replacement: r.trim()
		};
	});
	return s.length === 0 ? null : {
		predecessor: {
			symbol: n,
			params: o
		},
		condition: i?.trim() || void 0,
		branches: s
	};
}
function c(e) {
	let t = e.indexOf("#");
	return t >= 0 ? e.slice(0, t) : e;
}
function l(e) {
	let t = u(e, /^([a-z][a-z0-9_-]*)\s*:\s*(.+)$/i);
	if (t === null) return null;
	let [n, r] = t;
	return {
		key: n.toLowerCase(),
		value: r
	};
}
function u(e, t) {
	let n = e.match(t);
	if (n === null) return null;
	let r = n[1], i = n[2];
	return r === void 0 || i === void 0 ? null : [r, i];
}
function d(e, t) {
	let n = Number(e.trim());
	if (!Number.isInteger(n) || n < 0) throw Error(`Invalid ${t}: ${e}`);
	return n;
}
function f(e, t) {
	let n = Number(e.trim());
	if (!Number.isFinite(n)) throw Error(`Invalid ${t}: ${e}`);
	return n;
}
function p(e) {
	let t = e.trim().toLowerCase();
	if (t === "east" || t === "north" || t === "west" || t === "south") return t;
	throw Error(`Invalid orientation: ${e}`);
}
function m(e) {
	return e.split(",").map((e) => e.trim()).filter((e) => e.length === 1);
}
//#endregion
//#region ../../../../../../@tp/tp-utilities/dist/l-system/l-system-parametric.js
var h = /[A-Za-z_][A-Za-z0-9_]*/g;
function g(e) {
	let t = [], n = 0;
	for (; n < e.length;) {
		let r = e[n];
		if (r === void 0) break;
		if (/\s/.test(r)) {
			n += 1;
			continue;
		}
		if ("+-[]/\\&^|".includes(r)) {
			t.push({
				symbol: r,
				raw: r
			}), n += 1;
			continue;
		}
		let i = r;
		if (n += 1, e[n] === "(") {
			let { content: r, nextIndex: a } = x(e, n), o = S(r).map((e) => E(C(e, {}))), s = `${i}(${r})`;
			t.push({
				symbol: i,
				args: o,
				raw: s
			}), n = a;
			continue;
		}
		t.push({
			symbol: i,
			raw: i
		});
	}
	return t;
}
function _(e, t) {
	if (e.predecessor.symbol !== t.symbol) return null;
	let n = e.predecessor.params ?? [], r = t.args ?? [];
	if (n.length !== r.length) return null;
	let i = {};
	for (let e = 0; e < n.length; e += 1) {
		let t = n[e], a = r[e];
		if (t === void 0 || a === void 0) return null;
		i[t] = a;
	}
	return i;
}
function v(e, t) {
	return e === void 0 || e.trim() === "" || !!C(e, t);
}
function y(e, t) {
	return e.replace(/([^\s(),])\(([^()]*)\)/g, (e, n, r) => `${n}(${S(r).map((e) => E(C(e, t))).map(D).join(",")})`);
}
function b(e) {
	return e.args === void 0 ? e.symbol : `${e.symbol}(${e.args.map(D).join(",")})`;
}
function x(e, t) {
	let n = 0, r = t, i = -1;
	for (; r < e.length;) {
		let t = e[r];
		if (t === void 0) break;
		if (t === "(") {
			n += 1, n === 1 && (i = r + 1), r += 1;
			continue;
		}
		if (t === ")") {
			if (--n, n === 0) return {
				content: e.slice(i, r),
				nextIndex: r + 1
			};
			if (n < 0) break;
			r += 1;
			continue;
		}
		r += 1;
	}
	throw Error("Unbalanced parentheses in parametric token.");
}
function S(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i += 1) {
		let a = e[i];
		if (a === "(") n += 1;
		else if (a === ")") --n;
		else if (a === "," && n === 0) {
			let n = e.slice(r, i).trim();
			n !== "" && t.push(n), r = i + 1;
		}
	}
	let i = e.slice(r).trim();
	return i !== "" && t.push(i), t;
}
function C(e, t) {
	let n = e.trim();
	if (n === "") throw Error("Empty expression.");
	w(n), T(n, t);
	let r = Object.keys(t), i = r.map((e) => t[e] ?? 0);
	return Function(...r, `return (${n});`)(...i);
}
function w(e) {
	if (!/^[0-9A-Za-z_+\-*/%().,<>=!&| \t\r\n]+$/.test(e)) throw Error(`Unsupported characters in expression: ${e}`);
}
function T(e, t) {
	let n = new Set(Object.keys(t));
	n.add("true"), n.add("false");
	let r = e.match(h) ?? [];
	for (let e of r) if (!n.has(e)) throw Error(`Unknown identifier in expression: ${e}`);
}
function E(e) {
	let t = typeof e == "boolean" ? Number(e) : e;
	if (!Number.isFinite(t)) throw Error(`Expression did not evaluate to a finite number: ${String(e)}`);
	return t;
}
function D(e) {
	return String(Number.isInteger(e) ? e : Number(e.toFixed(6)));
}
//#endregion
//#region ../../../../../../@tp/tp-utilities/dist/l-system/l-system-expander.js
var O = 2e5;
function k(e) {
	let t = e.axiom;
	for (let n = 0; n < e.iterations; n += 1) if (t = A(t, e), t.length > O) throw Error(`Expanded sentence too large at iteration ${n + 1} (${t.length} chars)`);
	return {
		sentence: t,
		iterations: e.iterations,
		axiom: e.axiom
	};
}
function A(e, t) {
	let n = g(e), r = N((t.seed ?? 0) + e.length), i = "";
	for (let e of n) {
		let n = j(e, t.rulesV2 ?? [], r);
		if (n !== null) {
			i += n;
			continue;
		}
		if (e.args === void 0) {
			let n = t.rules.get(e.symbol);
			if (n !== void 0) {
				i += n;
				continue;
			}
		}
		i += b(e);
	}
	return i;
}
function j(e, t, n) {
	let r = t.filter((t) => {
		let n = _(t, e);
		return n !== null && v(t.condition, n);
	})[0];
	if (r === void 0) return null;
	let i = _(r, e);
	return i === null ? null : y(M(r.branches, n), i);
}
function M(e, t) {
	let n = e[0];
	if (n === void 0) return "";
	if (e.length === 1) return n.replacement;
	let r = e.map((e) => ({
		w: e.weight ?? 1,
		r: e.replacement
	})), i = r.reduce((e, t) => e + t.w, 0);
	if (i <= 0) return n.replacement;
	let a = t() * i;
	for (let e of r) if (a -= e.w, a <= 0) return e.r;
	return r[r.length - 1]?.r ?? n.replacement;
}
function N(e) {
	let t = e >>> 0;
	return () => {
		t += 1831565813;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
//#endregion
//#region ../../../../../../@tp/tp-utilities/dist/l-system/l-system-turtle.js
function ee(e, t) {
	let n = new Set(t.drawSymbols ?? ["F", "G"]), r = new Set(t.moveSymbols ?? ["M"]), i = z(t.angleDeg), a = [], o = [], s = {
		x: 0,
		y: 0,
		headingRad: L(t.orientation)
	}, c = B(s.x, s.y), l = P(e);
	for (let e of l) {
		let l = e.symbol, u = e.args[0];
		if (n.has(l)) {
			let e = u !== void 0 && Number.isFinite(u) ? u : t.step, n = R(s, e);
			o.push({
				x1: s.x,
				y1: s.y,
				x2: n.x,
				y2: n.y
			}), s = n, c.include(s.x, s.y);
			continue;
		}
		if (r.has(l)) {
			let e = u !== void 0 && Number.isFinite(u) ? u : t.step;
			s = R(s, e), c.include(s.x, s.y);
			continue;
		}
		if (l === "+") {
			let e = u !== void 0 && Number.isFinite(u) ? z(u) : i;
			s = {
				...s,
				headingRad: s.headingRad + e
			};
			continue;
		}
		if (l === "-") {
			let e = u !== void 0 && Number.isFinite(u) ? z(u) : i;
			s = {
				...s,
				headingRad: s.headingRad - e
			};
			continue;
		}
		if (l === "[") {
			a.push({ ...s });
			continue;
		}
		if (l === "]") {
			let e = a.pop();
			e !== void 0 && (s = e, c.include(s.x, s.y));
		}
	}
	return {
		segments: o,
		bounds: c.toBounds(),
		state: s
	};
}
function P(e) {
	let t = [], n = 0;
	for (; n < e.length;) {
		let r = e[n];
		if (r === void 0) break;
		if (/\s/.test(r)) {
			n += 1;
			continue;
		}
		let i = r;
		if (n += 1, e[n] === "(") {
			let r = F(e, n);
			n = r.nextIndex;
			let a = I(r.content).map((e) => Number(e.trim())).filter((e) => Number.isFinite(e));
			t.push({
				symbol: i,
				args: a
			});
			continue;
		}
		t.push({
			symbol: i,
			args: []
		});
	}
	return t;
}
function F(e, t) {
	let n = 0, r = t, i = -1;
	for (; r < e.length;) {
		let t = e[r];
		if (t === void 0) break;
		if (t === "(") {
			n += 1, n === 1 && (i = r + 1), r += 1;
			continue;
		}
		if (t === ")") {
			if (--n, n === 0) return {
				content: e.slice(i, r),
				nextIndex: r + 1
			};
			if (n < 0) break;
			r += 1;
			continue;
		}
		r += 1;
	}
	throw Error("Unbalanced parentheses in turtle sentence.");
}
function I(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i += 1) {
		let a = e[i];
		if (a === "(") {
			n += 1;
			continue;
		}
		if (a === ")") {
			--n;
			continue;
		}
		a === "," && n === 0 && (t.push(e.slice(r, i)), r = i + 1);
	}
	return t.push(e.slice(r)), t;
}
function L(e) {
	switch (e) {
		case "north": return -Math.PI / 2;
		case "west": return Math.PI;
		case "south": return Math.PI / 2;
		default: return 0;
	}
}
function R(e, t) {
	return {
		x: e.x + Math.cos(e.headingRad) * t,
		y: e.y + Math.sin(e.headingRad) * t,
		headingRad: e.headingRad
	};
}
function z(e) {
	return e * Math.PI / 180;
}
function B(e, t) {
	let n = e, r = t, i = e, a = t;
	return {
		include(e, t) {
			n = Math.min(n, e), r = Math.min(r, t), i = Math.max(i, e), a = Math.max(a, t);
		},
		toBounds() {
			return {
				minX: n,
				minY: r,
				maxX: i,
				maxY: a,
				width: i - n,
				height: a - r
			};
		}
	};
}
//#endregion
//#region ../../../../../../@tp/tp-utilities/dist/l-system/l-system-svg.js
var V = 800, H = 500, U = 16;
function W(e, t = {}) {
	let n = t.width ?? V, r = t.height ?? H, i = t.padding ?? U, a = t.stroke ?? "currentColor", o = t.strokeWidth ?? 1.5, s = t.fill ?? "none", c = t.linecap ?? "round", l = t.linejoin ?? "round", u = t.mode ?? "path", d = t.title?.trim() ?? "", f = (t.ariaLabel?.trim() ?? d) || "L-system diagram", { bounds: p } = e, m = Math.max(1, p.width), h = Math.max(1, p.height), g = Math.min((n - 2 * i) / m, (r - 2 * i) / h), _ = i - p.minX * g + (n - 2 * i - m * g) / 2, v = i - p.minY * g + (r - 2 * i - h * g) / 2, y = u === "polyline" ? K(e, g, _, v) : G(e, g, _, v), b = t.className ? ` class="${J(t.className)}"` : "", x = d === "" ? "" : `  <title>${J(d)}</title>\n`;
	return [
		`<svg${b} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${r}" role="img" aria-label="${J(f)}">`,
		`${x}  <g fill="${s}" stroke="${J(a)}" stroke-width="${o}"`,
		`     stroke-linecap="${c}" stroke-linejoin="${l}">`,
		`    ${y}`,
		"  </g>",
		"</svg>"
	].join("\n");
}
function G(e, t, n, r) {
	return e.segments.length === 0 ? "<path d=\"\" />" : `<path d="${e.segments.map((e) => {
		let i = e.x1 * t + n, a = e.y1 * t + r, o = e.x2 * t + n, s = e.y2 * t + r;
		return `M ${q(i)} ${q(a)} L ${q(o)} ${q(s)}`;
	}).join(" ")}" />`;
}
function K(e, t, n, r) {
	return e.segments.length === 0 ? "<polyline points=\"\" />" : `<polyline points="${e.segments.flatMap((e) => [`${q(e.x1 * t + n)},${q(e.y1 * t + r)}`, `${q(e.x2 * t + n)},${q(e.y2 * t + r)}`]).join(" ")}" fill="none" />`;
}
function q(e) {
	return e.toFixed(3).replace(/\.?0+$/, "");
}
function J(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
//#endregion
//#region ../../../../../../@tp/tp-utilities/dist/l-system/l-system-presets.js
var Y = {
	"fractal-tree": {
		axiom: "F",
		iterations: 5,
		angleDeg: 25,
		step: 6,
		orientation: "north",
		drawSymbols: ["F"],
		rules: { F: "F[+F]F[-F]F" },
		metadata: {
			dimension: "2D",
			version: "v1"
		}
	},
	"koch-curve": {
		axiom: "F",
		iterations: 4,
		angleDeg: 60,
		step: 8,
		drawSymbols: ["F"],
		rules: { F: "F+F--F+F" },
		metadata: {
			dimension: "2D",
			version: "v1"
		}
	},
	"dragon-curve": {
		axiom: "FX",
		iterations: 10,
		angleDeg: 90,
		step: 8,
		drawSymbols: ["F"],
		rules: {
			X: "X+YF+",
			Y: "-FX-Y"
		},
		metadata: {
			dimension: "2D",
			version: "v1"
		}
	},
	"hilbert-curve": {
		axiom: "A",
		iterations: 5,
		angleDeg: 90,
		step: 8,
		drawSymbols: ["F"],
		rules: {
			A: "+BF-AFA-FB+",
			B: "-AF+BFB+FA-"
		},
		metadata: {
			dimension: "2D",
			version: "v1"
		}
	},
	"peano-curve": {
		axiom: "F",
		iterations: 3,
		angleDeg: 90,
		step: 6,
		drawSymbols: ["F"],
		rules: { F: "F+F-F-F-F+F+F+F-F" },
		metadata: {
			dimension: "2D",
			version: "v1"
		}
	},
	"barnsley-fern": {
		axiom: "X",
		iterations: 6,
		angleDeg: 25,
		step: 5,
		orientation: "north",
		drawSymbols: ["F"],
		rules: {
			X: "F+[[X]-X]-F[-FX]+X",
			F: "FF"
		},
		metadata: {
			dimension: "2D",
			version: "v1"
		}
	},
	"levy-c-curve": {
		axiom: "F",
		iterations: 12,
		angleDeg: 45,
		step: 8,
		drawSymbols: ["F"],
		rules: { F: "+F--F+" },
		metadata: {
			dimension: "2D",
			version: "v1"
		}
	},
	"gosper-curve": {
		axiom: "A",
		iterations: 4,
		angleDeg: 60,
		step: 6,
		drawSymbols: ["A", "B"],
		rules: {
			A: "A-B--B+A++AA+B-",
			B: "+A-BB--B-A++A+B"
		},
		metadata: {
			dimension: "2D",
			version: "v1"
		}
	},
	"pythagoras-tree": {
		axiom: "F",
		iterations: 6,
		angleDeg: 45,
		step: 6,
		orientation: "north",
		drawSymbols: ["F"],
		rules: { F: "F[+F][-F]" },
		metadata: {
			dimension: "2D",
			version: "v1"
		}
	},
	"sierpinski-triangle": {
		axiom: "F-G-G",
		iterations: 5,
		angleDeg: 120,
		step: 8,
		drawSymbols: ["F", "G"],
		rules: {
			F: "F-G+F+G-F",
			G: "GG"
		},
		metadata: {
			dimension: "2D",
			version: "v1"
		}
	},
	"sierpinski-carpet": {
		axiom: "F-F-F-F",
		iterations: 3,
		angleDeg: 90,
		step: 6,
		drawSymbols: ["F"],
		rules: {
			F: "F+F-F-F-G+F+F+F-F",
			G: "GGG"
		},
		metadata: {
			dimension: "2D-approx",
			version: "v1"
		}
	},
	"sierpinski-arrowhead": {
		axiom: "A",
		iterations: 7,
		angleDeg: 60,
		step: 6,
		drawSymbols: ["A", "B"],
		rules: {
			A: "B-A-B",
			B: "A+B+A"
		},
		metadata: {
			dimension: "2D",
			version: "v1"
		}
	},
	"sierpinski-gasket": {
		axiom: "F--F--F",
		iterations: 6,
		angleDeg: 60,
		step: 6,
		drawSymbols: ["F"],
		rules: {
			F: "F--F--F--GG",
			G: "GG"
		},
		metadata: {
			dimension: "2D",
			version: "v1"
		}
	},
	"sierpinski-sponge": {
		axiom: "F",
		iterations: 3,
		angleDeg: 90,
		step: 5,
		drawSymbols: ["F"],
		rules: { F: "F+F-F-F-F+F+F+F-F" },
		metadata: {
			note: "2D projection placeholder for 3D sponge",
			version: "v1"
		}
	},
	"sierpinski-tetrahedron": {
		axiom: "F",
		iterations: 3,
		angleDeg: 120,
		step: 6,
		drawSymbols: ["F"],
		rules: { F: "F[+F]F[-F]F" },
		metadata: {
			note: "2D projection placeholder for 3D tetrahedron",
			version: "v1"
		}
	},
	"v2-weighted-tree": {
		axiom: "F",
		iterations: 7,
		angleDeg: 25,
		step: 6,
		orientation: "north",
		drawSymbols: ["F"],
		rulesV2: [{
			predecessor: { symbol: "F" },
			branches: [
				{
					weight: .5,
					replacement: "F[+F]F"
				},
				{
					weight: .33,
					replacement: "F[-F]F"
				},
				{
					weight: .33,
					replacement: "FF"
				}
			]
		}],
		metadata: {
			dimension: "2D",
			version: "v2",
			feature: "weighted"
		}
	},
	"v2-parametric-tree": {
		axiom: "F(14)",
		iterations: 6,
		angleDeg: 22.5,
		step: 8,
		orientation: "north",
		drawSymbols: ["F"],
		rulesV2: [{
			predecessor: {
				symbol: "F",
				params: ["x"]
			},
			branches: [{ replacement: "F(x*0.9)[+F(x*0.7)][-F(x*0.7)]" }]
		}],
		metadata: {
			dimension: "2D",
			version: "v2",
			feature: "parametric"
		}
	},
	"v2-parametric-conditional-tree": {
		axiom: "F(30)",
		iterations: 7,
		angleDeg: 22.5,
		step: 7,
		orientation: "north",
		drawSymbols: ["F", "G"],
		rulesV2: [{
			predecessor: {
				symbol: "F",
				params: ["x"]
			},
			condition: "x > 9",
			branches: [{ replacement: "F(x*0.82)[+(24)F(x*0.58)][-(24)F(x*0.58)]" }]
		}, {
			predecessor: {
				symbol: "F",
				params: ["x"]
			},
			condition: "x <= 9",
			branches: [{ replacement: "G(2.8)[+(55)G(1.6)][-(55)G(1.6)]" }]
		}],
		metadata: {
			dimension: "2D",
			version: "v2",
			feature: "parametric+conditional",
			pedagogical: "two-phase morphology"
		}
	}
};
function X(e) {
	return Object.prototype.hasOwnProperty.call(Y, e);
}
function Z(e) {
	let t = Y[e];
	return {
		axiom: t.axiom,
		iterations: t.iterations,
		angleDeg: t.angleDeg,
		step: t.step,
		orientation: t.orientation,
		drawSymbols: t.drawSymbols ? [...t.drawSymbols] : void 0,
		moveSymbols: t.moveSymbols ? [...t.moveSymbols] : void 0,
		rules: new Map(Object.entries(t.rules ?? {})),
		rulesV2: t.rulesV2 ? Q(t.rulesV2) : void 0,
		metadata: {
			preset: e,
			...t.metadata ?? {}
		}
	};
}
function Q(e) {
	return e.map((e) => ({
		predecessor: {
			symbol: e.predecessor.symbol,
			params: e.predecessor.params ? [...e.predecessor.params] : void 0
		},
		condition: e.condition,
		branches: e.branches.map((e) => ({
			weight: e.weight,
			replacement: e.replacement
		}))
	}));
}
//#endregion
//#region src/components/lsystem/lsystem.css?inline
var te = "tp-lsystem{min-inline-size:0;display:flow-root}tp-lsystem>tp-button-group{gap:var(--tp-space-xs,.5rem)}tp-lsystem>figure{margin:0}tp-lsystem [data-lsystem-viewport] svg{block-size:auto;max-inline-size:100%;display:block}", $ = class n extends e {
	static nextId = 0;
	source = new t(this, { scriptTypes: ["tp/lsystem", "tp/l-system"] });
	definition = null;
	iteration = 0;
	timer = null;
	pending = null;
	request = null;
	revision = 0;
	svg = "";
	viewportId = `tp-lsystem-${++n.nextId}`;
	static get observedAttributes() {
		return [
			...e.observedAttributes,
			"src",
			"preset",
			"iterations",
			"angle",
			"step",
			"interval",
			"label"
		];
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-lsystem-styles", te), this.addEventListener("click", this.handleClick), this.source.observe(() => this.schedule()), this.schedule();
	}
	disconnectedCallback() {
		this.pause(), this.revision++, this.request?.abort(), this.pending !== null && clearTimeout(this.pending), this.pending = null, this.source.disconnect(), this.removeEventListener("click", this.handleClick);
	}
	attributeChangedCallback(e) {
		this.isConnected && [
			"src",
			"preset",
			"iterations",
			"angle",
			"step",
			"interval",
			"label"
		].includes(e) && this.schedule();
	}
	schedule() {
		this.pause(), this.revision++, this.request?.abort(), this.definition = null, this.pending !== null && clearTimeout(this.pending), this.pending = setTimeout(() => {
			this.pending = null, this.load();
		}, 0);
	}
	number(e, t) {
		let n = this.getAttribute(e)?.trim(), r = n ? Number(n) : t;
		if (!Number.isFinite(r)) throw Error(`Invalid ${e}: expected a finite number.`);
		return r;
	}
	async load() {
		let e = this.revision;
		this.request = new AbortController(), this.setAttribute("aria-busy", "true");
		try {
			this.source.capture();
			let t = await this.source.read({ signal: this.request.signal });
			if (e !== this.revision || !this.isConnected) return;
			if (t.length > 2e4) throw Error("L-system source exceeds 20,000 characters.");
			let n = this.getAttribute("preset")?.trim() ?? "koch-curve";
			if (!t.trim() && !n) throw Error("Provide a tp/lsystem script, a source file or a preset.");
			let r;
			if (t.trim()) r = a(t, { strict: !0 });
			else if (X(n)) r = Z(n);
			else throw Error(`Unknown L-system preset: ${n}`);
			if ([...r.rules.values(), ...(r.rulesV2 ?? []).flatMap((e) => e.branches.map((e) => e.replacement))].some((e) => e.length > 256)) throw Error("Rule replacements are limited to 256 characters.");
			if (r.iterations = this.number("iterations", r.iterations), r.angleDeg = this.number("angle", r.angleDeg), r.step = this.number("step", r.step), !Number.isInteger(r.iterations) || r.iterations < 0 || r.iterations > 12) throw Error("Iterations must be an integer from 0 to 12.");
			if (r.step <= 0) throw Error("Step must be positive.");
			if (this.number("interval", 1e3) < 100) throw Error("Interval must be at least 100 milliseconds.");
			this.definition = r, this.iteration = r.iterations, this.innerHTML = `<tp-button-group data-lsystem-controls>
				<tp-button data-action="step">Step</tp-button>
				<tp-button data-action="play"><span data-play-label>Play</span></tp-button>
				<tp-button data-action="reset">Reset</tp-button>
				<tp-save-image anchor="#${this.viewportId}" filename="lsystem"></tp-save-image>
			</tp-button-group><p data-lsystem-status role="status" aria-live="polite"></p>
			<figure><div id="${this.viewportId}" data-lsystem-viewport></div><figcaption></figcaption></figure>`, this.draw();
		} catch (t) {
			e === this.revision && this.isConnected && this.fail(t);
		} finally {
			e === this.revision && this.removeAttribute("aria-busy");
		}
	}
	draw() {
		if (this.definition) try {
			let e = {
				...this.definition,
				iterations: this.iteration
			}, t = ee(k(e).sentence, e), n = this.getAttribute("label")?.trim() || "L-system";
			this.svg = W(t, {
				width: 800,
				height: 420,
				padding: 20,
				stroke: "currentColor",
				title: n,
				ariaLabel: n
			});
			let r = this.querySelector("[data-lsystem-viewport]");
			r && (r.innerHTML = this.svg);
			let i = this.querySelector("figcaption");
			i && (i.textContent = n);
			let a = this.querySelector("[data-lsystem-status]");
			a && (a.textContent = `Iteration ${this.iteration} / ${this.definition.iterations}`), this.dispatchEvent(new CustomEvent("tp-lsystem-rendered", {
				bubbles: !0,
				detail: {
					iteration: this.iteration,
					iterations: this.definition.iterations
				}
			}));
		} catch (e) {
			this.fail(e);
		}
	}
	fail(e) {
		this.pause(), this.definition = null, this.svg = "";
		let t = this.ownerDocument.createElement("tp-callout");
		t.setAttribute("variant", "warning"), t.setAttribute("role", "alert"), t.textContent = e instanceof Error ? e.message : String(e), this.replaceChildren(t);
	}
	handleClick = (e) => {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest("tp-button[data-action]")?.getAttribute("data-action");
		n === "step" ? this.step() : n === "reset" ? this.reset() : n === "play" && (this.timer === null ? this.play() : this.pause());
	};
	step() {
		this.pause(), this.definition && (this.iteration = this.iteration >= this.definition.iterations ? 0 : this.iteration + 1, this.draw());
	}
	play() {
		this.pause(), !(!this.definition || !this.isConnected || this.definition.iterations === 0) && (this.iteration >= this.definition.iterations && (this.iteration = 0, this.draw()), this.querySelector("[data-play-label]")?.replaceChildren("Pause"), this.timer = setInterval(() => {
			this.iteration++, this.draw(), this.definition && this.iteration >= this.definition.iterations && this.pause();
		}, this.number("interval", 1e3)));
	}
	pause() {
		this.timer !== null && clearInterval(this.timer), this.timer = null, this.querySelector("[data-play-label]")?.replaceChildren("Play");
	}
	reset() {
		this.pause(), this.iteration = 0, this.draw();
	}
	exportSvg() {
		return this.svg;
	}
};
customElements.get("tp-lsystem") || customElements.define("tp-lsystem", $);
//#endregion
export { $ as t };

