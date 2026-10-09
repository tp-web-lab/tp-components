//#region ../../../../../../@tp/tp-markdown/dist/markdown/extensions/l-system/index.js
function e(e, a = {}) {
	let u = a.defaultIterations ?? 4, d = a.defaultAngleDeg ?? 90, f = a.defaultStep ?? 10, p = "", m = u, h = d, g = f, _, v, y, b, x = /* @__PURE__ */ new Map(), S = [];
	for (let u of e.split(/\r?\n/)) {
		let e = r(u).trim();
		if (e === "") continue;
		let d = i(e);
		if (d !== null) {
			let { key: e, value: r } = d;
			switch (e) {
				case "label": continue;
				case "axiom":
					p = r.trim();
					continue;
				case "iterations":
					m = o(r, "iterations");
					continue;
				case "angle":
					h = s(r, "angle");
					continue;
				case "step":
					g = s(r, "step");
					continue;
				case "orientation":
					_ = c(r);
					continue;
				case "draw":
					v = l(r);
					continue;
				case "move":
					y = l(r);
					continue;
				case "seed":
					b = s(r, "seed");
					continue;
				case "rule": {
					let e = t(r);
					if (e !== null) {
						x.set(e.symbol, e.replacement);
						continue;
					}
					let i = n(r);
					if (i !== null) {
						S.push(i);
						let e = i.predecessor, t = i.branches[0];
						(e.params?.length ?? 0) === 0 && !i.condition && i.branches.length === 1 && t !== void 0 && x.set(e.symbol, t.replacement);
						continue;
					}
					throw Error(`Invalid rule: ${r}`);
				}
				default:
					if (a.strict === !0) throw Error(`Unknown directive: ${e}`);
					continue;
			}
		}
		if (a.strict === !0) throw Error(`Invalid line: ${e}`);
	}
	if (p.trim() === "") throw Error("Missing required directive: axiom");
	return {
		axiom: p,
		iterations: m,
		angleDeg: h,
		step: g,
		rules: x,
		rulesV2: S.length > 0 ? S : void 0,
		seed: b,
		orientation: _,
		drawSymbols: v,
		moveSymbols: y
	};
}
function t(e) {
	let t = a(e, /^(\S)\s*=>\s*(.*)$/);
	if (t === null) return null;
	let [n, r] = t;
	return {
		symbol: n,
		replacement: r
	};
}
function n(e) {
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
function r(e) {
	let t = e.indexOf("#");
	return t >= 0 ? e.slice(0, t) : e;
}
function i(e) {
	let t = a(e, /^([a-z][a-z0-9_-]*)\s*:\s*(.+)$/i);
	if (t === null) return null;
	let [n, r] = t;
	return {
		key: n.toLowerCase(),
		value: r
	};
}
function a(e, t) {
	let n = e.match(t);
	if (n === null) return null;
	let r = n[1], i = n[2];
	return r === void 0 || i === void 0 ? null : [r, i];
}
function o(e, t) {
	let n = Number(e.trim());
	if (!Number.isInteger(n) || n < 0) throw Error(`Invalid ${t}: ${e}`);
	return n;
}
function s(e, t) {
	let n = Number(e.trim());
	if (!Number.isFinite(n)) throw Error(`Invalid ${t}: ${e}`);
	return n;
}
function c(e) {
	let t = e.trim().toLowerCase();
	if (t === "east" || t === "north" || t === "west" || t === "south") return t;
	throw Error(`Invalid orientation: ${e}`);
}
function l(e) {
	return e.split(",").map((e) => e.trim()).filter((e) => e.length === 1);
}
var u = {
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
function d(e) {
	return Object.prototype.hasOwnProperty.call(u, e);
}
function f(e) {
	let t = u[e];
	return {
		axiom: t.axiom,
		iterations: t.iterations,
		angleDeg: t.angleDeg,
		step: t.step,
		orientation: t.orientation,
		drawSymbols: t.drawSymbols ? [...t.drawSymbols] : void 0,
		moveSymbols: t.moveSymbols ? [...t.moveSymbols] : void 0,
		rules: new Map(Object.entries(t.rules ?? {})),
		rulesV2: t.rulesV2 ? p(t.rulesV2) : void 0,
		metadata: {
			preset: e,
			...t.metadata ?? {}
		}
	};
}
function p(e) {
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
function m(e) {
	let t = e.renderer.rules.fence ?? ((e, t, n, r, i) => i.renderToken(e, t, n));
	e.renderer.rules.fence = (e, n, r, i, a) => {
		let o = e[n];
		if (!o) return t(e, n, r, i, a);
		let s = (o.info || "").trim();
		if (!(s === "l-system" || s.startsWith("l-system "))) return t(e, n, r, i, a);
		try {
			let e = x(o), t = h(o.content, e), n = b(e), r = y(e, t), i = _(t);
			return [
				`<figure${n}>`,
				"<div",
				" data-l-system-block=\"true\"",
				` data-definition="${M(i)}"`,
				` data-animate="${w(e, "animate") ? "true" : "false"}"`,
				` data-autoplay="${w(e, "autoplay") ? "true" : "false"}"`,
				` data-interval="${String(C(e.interval) ?? 250)}"`,
				` data-width="${M(e.width ?? "")}"`,
				` data-height="${M(e.height ?? "")}"`,
				` data-padding="${M(e.padding ?? "")}"`,
				` data-stroke="${M(e.stroke ?? "")}"`,
				` data-stroke-width="${M(e["stroke-width"] ?? e.strokeWidth ?? "")}"`,
				` data-fill="${M(e.fill ?? "")}"`,
				` data-linecap="${M(e.linecap ?? "")}"`,
				` data-linejoin="${M(e.linejoin ?? "")}"`,
				` data-mode="${M(e.mode ?? "")}"`,
				` data-aria-label="${M(e["aria-label"] ?? "")}"`,
				" data-class-name=\"tp-l-system-svg\"",
				"></div>",
				r ? `<figcaption class="tp-l-system-legend">${j(r)}</figcaption>` : "",
				"</figure>"
			].join("");
		} catch (e) {
			return `<pre class="tp-l-system-error"><code>${j(e instanceof Error ? e.message : "L-system render error")}</code></pre>`;
		}
	};
}
function h(t, n) {
	let r = (n.preset ?? "").trim();
	if (r !== "") {
		if (!d(r)) throw Error(`Unknown L-system preset: ${r}`);
		return g(f(r), n);
	}
	let i = v(t);
	return g(i === null ? e(t, { strict: !1 }) : i, n);
}
function g(e, t) {
	return {
		...e,
		iterations: C(t.iterations) ?? e.iterations,
		step: S(t.step) ?? e.step,
		angleDeg: S(t.angle) ?? e.angleDeg
	};
}
function _(e) {
	let t = {
		...e,
		rules: Object.fromEntries(e.rules.entries())
	};
	return JSON.stringify(t);
}
function v(e) {
	let t = e.trim();
	if (t === "" || !t.includes("axiom:")) return null;
	let n = t.replace(/,\s*([}\]])/g, "$1").replace(/(^|[{,\n\r]\s*)([A-Za-z_]\w*)\s*:/g, "$1\"$2\":").replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (e, t) => `"${t.replace(/"/g, "\\\"")}"`);
	n.trimStart().startsWith("{") || (n = `{${n}}`);
	let r;
	try {
		r = JSON.parse(n);
	} catch {
		return null;
	}
	if (typeof r != "object" || !r) return null;
	let i = r, a = T(i.axiom), o = D(i.iterations), s = E(i.angleDeg), c = E(i.step);
	if (a === void 0 || o === void 0 || s === void 0 || c === void 0) throw Error("Invalid l-system object: expected axiom, iterations, angleDeg, step.");
	let l = i.rules;
	if (typeof l != "object" || !l) throw Error("Invalid l-system object: rules is required.");
	let u = /* @__PURE__ */ new Map();
	for (let [e, t] of Object.entries(l)) typeof t == "string" && u.set(e, t);
	if (u.size === 0) throw Error("Invalid l-system object: rules must contain at least one entry.");
	return {
		axiom: a,
		iterations: o,
		angleDeg: s,
		step: c,
		orientation: k(i.orientation),
		drawSymbols: O(i.drawSymbols),
		moveSymbols: O(i.moveSymbols),
		rules: u,
		metadata: A(i.metadata) ?? {}
	};
}
function y(e, t) {
	let n = (e.label ?? e.caption ?? "").trim();
	if (n !== "") return n;
	let r = t.metadata, i = typeof r?.label == "string" ? r.label.trim() : "";
	return i === "" ? null : i;
}
function b(e) {
	let t = [];
	for (let [n, r] of Object.entries(e)) (n === "id" || n === "class" || n === "role" || n.startsWith("data-") || n.startsWith("aria-")) && t.push(` ${n}="${M(r)}"`);
	return t.join("");
}
function x(e) {
	let t = {};
	for (let [n, r] of e.attrs ?? []) t[n] = r ?? "";
	return t;
}
function S(e) {
	if (e === void 0 || e === "") return;
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function C(e) {
	if (e === void 0 || e === "") return;
	let t = Number(e);
	return Number.isInteger(t) && t >= 0 ? t : void 0;
}
function w(e, t) {
	if (!(t in e)) return !1;
	let n = (e[t] ?? "").trim().toLowerCase();
	return n === "" || n === t || n === "true" || n === "1" || n === "yes" || n === "on" || !(n === "false" || n === "0" || n === "no" || n === "off");
}
function T(e) {
	return typeof e == "string" ? e : void 0;
}
function E(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
function D(e) {
	return typeof e == "number" && Number.isInteger(e) && e >= 0 ? e : void 0;
}
function O(e) {
	if (Array.isArray(e)) return e.filter((e) => typeof e == "string");
}
function k(e) {
	return e === "north" || e === "east" || e === "south" || e === "west" ? e : void 0;
}
function A(e) {
	return typeof e == "object" && e ? e : void 0;
}
function j(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function M(e) {
	return j(e).replaceAll("\n", "&#10;").replaceAll("\r", "&#13;");
}
//#endregion
export { m as default, m as useLSystemExtension };

