import { TP_COLOR_PRESETS as e } from "../color/color-presets.js";
//#region src/components/graph-geometry/geometry.ts
var t = e.map((e) => e.slice(3)), n = [
	"hidden",
	"dotted",
	"dashed",
	"solid"
], r = [
	"axialSymmetry",
	"centralSymmetry",
	"homothety",
	"rotation",
	"translation"
], i = 1e-9, a = 2 * Math.PI, o = (e) => e * Math.PI / 180, s = (e) => (e % a + a) % a, c = (e, t) => Math.hypot(e.x - t.x, e.y - t.y), l = (e, t) => e.x * t.y - e.y * t.x, u = (e, t) => ({
	x: e.x - t.x,
	y: e.y - t.y
}), d = (e, t, n) => ({
	x: e.x + t.x * n,
	y: e.y + t.y * n
});
function f(e) {
	if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(e.trim())) throw Error(`Expected a number: ${e}`);
	let t = Number(e);
	if (!Number.isFinite(t)) throw Error("A number must be finite.");
	return t;
}
function p(e) {
	if (!/^[A-Za-z][\w]*$/.test(e)) throw Error(`Invalid name: ${e}`);
	return e;
}
function m(e) {
	let t = [], n = 0, r = 0, i = !1;
	for (let a = 0; a < e.length; a++) {
		if (i && e[a] === "\\") {
			a++;
			continue;
		}
		if (e[a] === "\"") {
			i = !i;
			continue;
		}
		i || (e[a] === "(" && n++, e[a] === ")" && n--, e[a] === "," && n === 0 && (t.push(e.slice(r, a).trim()), r = a + 1));
	}
	if (n !== 0 || i) throw Error("Unbalanced parentheses.");
	return t.push(e.slice(r).trim()), t;
}
function h(e, a = 0) {
	if (a > 64) throw Error("Too many nested transformations.");
	let c = [], l = /* @__PURE__ */ new Set();
	for (let [u, d] of e.split("\n").entries()) {
		let e = d.replace(/"(?:[^"\\]|\\.)*"|(#.*$)/g, (e, t) => t ? "" : e).trim();
		if (e) try {
			let u = /^(point|line|segment|ray|vector|circle|arc|sector|comment|polygon)\s+(\w+)\s*=\s*(.*?)(\s+(?:(?:style|color)=\w+|hidden)(?:\s+(?:(?:style|color)=\w+|hidden))*)?$/.exec(e);
			if (!u) throw Error("Expected: type name = construction.");
			let [, d = "", g = "", _ = "", y = ""] = u;
			if (p(g), l.has(g)) throw Error(`Duplicate name: ${g}`);
			l.add(g);
			let b, x = /^\(([^,]+),([^,]+)\)$/.exec(_);
			if (d === "point" && x) b = {
				kind: "point",
				x: f(x[1] ?? ""),
				y: f(x[2] ?? "")
			};
			else {
				let e = /^(\w+)\((.*)\)$/.exec(_);
				if (!e) throw Error("Invalid construction.");
				let t = e[1], n = m(e[2] ?? ""), c = n[0] ?? "", l = n[1] ?? "", u = /* @__PURE__ */ new Map(), g = (e, t) => {
					for (let r of n.slice(e)) {
						let e = /^([\w-]+)=(.+)$/.exec(r), n = e?.[1] ?? "", i = e?.[2] ?? "";
						if (!t.includes(n) || u.has(n)) throw Error(`Unexpected option: ${r}`);
						u.set(n, i);
					}
				};
				if (r.includes(t)) {
					let e = t, n = e === "homothety" ? "ratio" : e === "rotation" ? "angle" : null;
					g(2, n ? [n] : []);
					let r = n ? f((u.get(n) ?? "").replace(e === "rotation" ? /deg$/ : /$^/, "")) : 1;
					if (e === "homothety" && r === 0) throw Error("The homothety ratio must be nonzero.");
					b = {
						kind: "transform",
						operation: e,
						object: /^[A-Za-z][\w]*$/.test(c) ? p(c) : (() => {
							let e = h(`${d} nested = ${c}`, a + 1)[0];
							if (!e || e.hidden || e.color || e.stroke) throw Error("Expected a construction expression.");
							return e.definition;
						})(),
						support: p(l),
						output: d,
						amount: r
					};
				} else if (d === "point" && t === "on") {
					if (g(1, ["angle", "t"]), u.size !== 1) throw Error("Use angle=…deg or t=… .");
					let e = u.get("angle");
					b = {
						kind: "on",
						object: p(c),
						parameter: e === void 0 ? f(u.get("t") ?? "") : o(f(e.replace(/deg$/, "")))
					}, v.set(b, e === void 0 ? "linear" : "circular");
				} else if (d === "point" && t === "intersection") {
					g(2, ["branch"]);
					let e = f(u.get("branch") ?? "0");
					if (e !== 0 && e !== 1) throw Error("An intersection branch is 0 or 1.");
					b = {
						kind: "intersection",
						first: p(c),
						second: p(l),
						branch: e
					};
				} else if (d === "polygon" && t === "polygon") {
					let e = n.map(p);
					if (e.length < 3 || new Set(e).size !== e.length) throw Error("A polygon needs at least three distinct vertices.");
					b = {
						kind: "polygon",
						vertices: e
					};
				} else if (d === "polygon" && t === "regularPolygon") {
					g(2, ["sides"]);
					let e = f(u.get("sides") ?? "");
					if (!Number.isInteger(e) || e < 3 || e > 360) throw Error("Sides must be an integer from 3 to 360.");
					b = {
						kind: "regularPolygon",
						first: p(c),
						second: p(l),
						sides: e
					};
				} else if (d === "point" && t === "midpoint" && n.length === 1) b = {
					kind: "midpoint",
					segment: p(c)
				};
				else if (d === "line" && t === "perpendicularBisector" && n.length === 1) b = {
					kind: "perpendicularBisector",
					segment: p(c)
				};
				else if (d === "line" && (t === "parallel" || t === "perpendicular") && n.length === 2) b = {
					kind: t,
					point: p(c),
					support: p(l)
				};
				else if (d === "line" && t === "bisector" && n.length === 3) b = {
					kind: "bisector",
					first: p(c),
					vertex: p(l),
					second: p(n[2] ?? "")
				};
				else if (d === "line" && t === "tangent") {
					g(2, ["branch"]);
					let e = f(u.get("branch") ?? "0");
					if (e !== 0 && e !== 1) throw Error("A tangent branch is 0 or 1.");
					b = {
						kind: "tangent",
						point: p(c),
						circle: p(l),
						branch: e
					};
				} else if (d === "comment" && (t === "length" || t === "area" || t === "angle")) {
					let e = n.findIndex((e) => e.includes("=")), r = e < 0 ? n : n.slice(0, e);
					if (g(r.length, ["dx", "dy"]), !(t === "angle" ? r.length === 3 || r.length === 2 : t === "length" ? r.length === 1 || r.length === 2 : r.length === 1)) throw Error("Invalid measurement arguments.");
					let i = f(u.get("dx") ?? "0"), a = f(u.get("dy") ?? "0");
					b = {
						kind: "measure",
						operation: t,
						inputs: r.map(p),
						...i || a ? { offset: {
							x: i,
							y: a
						} } : {}
					};
				} else if (d === "comment" && t === "comment" && n.length === 2) {
					let e = JSON.parse(l);
					if (typeof e != "string" || !e.trim()) throw Error("A comment needs nonempty quoted text.");
					b = {
						kind: "comment",
						point: p(c),
						text: e
					};
				} else if ((d === "line" || d === "segment" || d === "ray" || d === "vector") && t === d) {
					g(2, d === "segment" ? ["length"] : []);
					let e = u.has("length") ? f(u.get("length") ?? "") : void 0;
					if (e !== void 0 && e <= 0) throw Error("The length must be positive.");
					b = {
						kind: d,
						first: p(c),
						second: p(l),
						...e === void 0 ? {} : { length: e }
					};
				} else if (d === "circle" && t === "circle" && n.length === 2) {
					let e = /^distance\((\w+),\s*(\w+)\)$/.exec(l), t = l.startsWith("through=") ? { through: p(l.slice(8)) } : e ? { distance: [p(e[1] ?? ""), p(e[2] ?? "")] } : f(l);
					if (typeof t == "number" && t <= 0) throw Error("The radius must be positive.");
					b = {
						kind: "circle",
						center: p(c),
						radius: t
					};
				} else if ((d === "arc" || d === "sector") && t === d) {
					g(1, [
						"start",
						"end",
						"direction",
						"relative-to"
					]);
					let e = u.get("direction") ?? "ccw";
					if (e !== "ccw" && e !== "cw") throw Error("Use direction=ccw or direction=cw.");
					if (b = {
						kind: d,
						circle: p(c),
						start: o(f((u.get("start") ?? "").replace(/deg$/, ""))),
						end: o(f((u.get("end") ?? "").replace(/deg$/, ""))),
						clockwise: e === "cw",
						...u.has("relative-to") ? { relativeTo: p(u.get("relative-to") ?? "") } : {}
					}, s(b.end - b.start) < i) throw Error("An arc must span more than 0 and less than 360 degrees.");
				} else throw Error(`Unsupported ${d} construction: ${t}`);
			}
			let S = {
				id: g,
				hidden: !1,
				definition: b
			}, C = /* @__PURE__ */ new Set();
			for (let e of y.trim().split(/\s+/).filter(Boolean)) {
				let [r = "", i = ""] = e.split("=");
				if (C.has(r)) throw Error(`Duplicate appearance option: ${r}`);
				if (C.add(r), r === "hidden") S.hidden = !0;
				else if (r === "style") {
					if (!n.includes(i)) throw Error(`Unknown stroke style: ${i}`);
					i === "hidden" ? S.hidden = !0 : i !== "solid" && (S.stroke = i);
				} else {
					if (!t.includes(i)) throw Error(`Unknown library color: ${i}`);
					S.color = i;
				}
			}
			c.push(S);
		} catch (e) {
			throw Error(`Line ${u + 1}: ${e instanceof Error ? e.message : e}`);
		}
	}
	return c;
}
function g(e) {
	let t = h(e), n = new Map(t.map((e) => [e.id, e])), r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), a = (e) => {
		if (i.has(e)) return;
		if (r.has(e)) throw Error(`Circular dependency: ${e}`);
		let t = n.get(e);
		if (!t) throw Error(`Unknown object: ${e}`);
		r.add(e);
		for (let e of y(t.definition)) a(e);
		let o = (e) => {
			let t = n.get(e)?.definition;
			return t ? _(t) : "";
		}, s = (t, n) => {
			if (!n.includes(o(t))) throw Error(`Invalid support ${t} for ${e}.`);
		}, c = (t) => {
			if (t.kind === "transform") {
				if (typeof t.object == "string") s(t.object, [t.output]);
				else if (c(t.object), _(t.object) !== t.output) throw Error(`Invalid nested construction for ${e}.`);
				s(t.support, t.operation === "axialSymmetry" ? [
					"line",
					"segment",
					"ray",
					"vector"
				] : t.operation === "translation" ? ["vector"] : ["point"]);
			}
			if (t.kind === "polygon" || t.kind === "regularPolygon") for (let e of y(t)) s(e, ["point"]);
			if ((t.kind === "line" || t.kind === "segment" || t.kind === "ray" || t.kind === "vector") && (s(t.first, ["point"]), s(t.second, ["point"])), t.kind === "circle" && (s(t.center, ["point"]), typeof t.radius != "number")) for (let e of "through" in t.radius ? [t.radius.through] : t.radius.distance) s(e, ["point"]);
			if (t.kind === "on" && s(t.object, v.get(t) === "linear" ? [
				"line",
				"segment",
				"ray",
				"vector"
			] : ["circle", "arc"]), (t.kind === "arc" || t.kind === "sector") && (s(t.circle, ["circle"]), t.relativeTo && s(t.relativeTo, [
				"line",
				"segment",
				"ray",
				"vector"
			])), t.kind === "intersection" && (s(t.first, [
				"line",
				"segment",
				"ray",
				"vector",
				"circle",
				"arc"
			]), s(t.second, [
				"line",
				"segment",
				"ray",
				"vector",
				"circle",
				"arc"
			])), (t.kind === "midpoint" || t.kind === "perpendicularBisector") && s(t.segment, ["segment"]), (t.kind === "parallel" || t.kind === "perpendicular") && (s(t.point, ["point"]), s(t.support, [
				"line",
				"segment",
				"ray",
				"vector"
			])), t.kind === "bisector") for (let e of [
				t.first,
				t.vertex,
				t.second
			]) s(e, ["point"]);
			if (t.kind === "tangent" && (s(t.point, ["point"]), s(t.circle, ["circle"])), t.kind === "measure") {
				let e = t.operation === "angle" && t.inputs.length === 2 ? [
					"segment",
					"ray",
					"vector",
					"line"
				] : t.operation === "angle" || t.inputs.length === 2 ? ["point"] : t.operation === "area" ? [
					"polygon",
					"circle",
					"sector"
				] : [
					"segment",
					"vector",
					"circle",
					"arc",
					"polygon",
					"sector"
				];
				for (let n of t.inputs) s(n, e);
			}
			t.kind === "comment" && s(t.point, ["point"]);
		};
		c(t.definition), r.delete(e), i.add(e);
	};
	for (let e of t) a(e.id);
	return t;
}
function _(e) {
	return e.kind === "transform" ? e.output : e.kind === "regularPolygon" ? "polygon" : e.kind === "measure" ? "comment" : e.kind === "on" || e.kind === "intersection" || e.kind === "midpoint" ? "point" : [
		"parallel",
		"perpendicular",
		"perpendicularBisector",
		"bisector",
		"tangent"
	].includes(e.kind) ? "line" : e.kind;
}
var v = /* @__PURE__ */ new WeakMap();
function y(e) {
	switch (e.kind) {
		case "measure": return e.inputs;
		case "transform": return [...typeof e.object == "string" ? [e.object] : y(e.object), e.support];
		case "polygon": return e.vertices;
		case "regularPolygon": return [e.first, e.second];
		case "point": return [];
		case "on": return [e.object];
		case "intersection":
		case "line":
		case "segment":
		case "ray":
		case "vector": return [e.first, e.second];
		case "midpoint":
		case "perpendicularBisector": return [e.segment];
		case "parallel":
		case "perpendicular": return [e.point, e.support];
		case "bisector": return [
			e.first,
			e.vertex,
			e.second
		];
		case "tangent": return [e.point, e.circle];
		case "comment": return [e.point];
		case "sector":
		case "arc": return [e.circle, ...e.relativeTo ? [e.relativeTo] : []];
		case "circle": return [e.center, ...typeof e.radius == "number" ? [] : "through" in e.radius ? [e.radius.through] : e.radius.distance];
	}
}
function b(e) {
	return e.kind === "line" || e.kind === "segment" || e.kind === "ray" || e.kind === "vector";
}
function x(e) {
	return e.kind === "circle" || e.kind === "arc";
}
function S(e, t) {
	if (e.kind === "arc") {
		let n = Math.atan2(t.y - e.center.y, t.x - e.center.x);
		return (e.sweep > 0 ? s(n - e.start) : s(e.start - n)) <= Math.abs(e.sweep) + i;
	}
	if (e.kind === "segment" || e.kind === "vector" || e.kind === "ray") {
		let n = u(e.second, e.first), r = u(t, e.first), i = (r.x * n.x + r.y * n.y) / (n.x ** 2 + n.y ** 2);
		return i >= -1e-9 && (e.kind === "ray" || i <= 1.000000001);
	}
	return !0;
}
function C(e, t) {
	let n = [];
	if (b(e) && b(t)) {
		let r = u(e.second, e.first), a = u(t.second, t.first), o = l(r, a);
		Math.abs(o) > i && (n = [d(e.first, r, l(u(t.first, e.first), a) / o)]);
	} else if (x(e) && x(t)) {
		let r = u(t.center, e.center), a = c(e.center, t.center);
		if (a > i && a <= e.radius + t.radius + i && a >= Math.abs(e.radius - t.radius) - i) {
			let i = (e.radius ** 2 - t.radius ** 2 + a ** 2) / (2 * a), o = Math.sqrt(Math.max(0, e.radius ** 2 - i ** 2)), s = d(e.center, r, i / a), c = {
				x: -r.y / a,
				y: r.x / a
			};
			n = [d(s, c, o), d(s, c, -o)];
		}
	} else {
		let r = b(e) ? e : b(t) ? t : null, a = x(e) ? e : x(t) ? t : null;
		if (r && a) {
			let e = u(r.second, r.first), t = u(r.first, a.center), o = e.x ** 2 + e.y ** 2, s = 2 * (t.x * e.x + t.y * e.y), c = t.x ** 2 + t.y ** 2 - a.radius ** 2, l = s ** 2 - 4 * o * c;
			l >= -1e-9 && o > i && (n = [d(r.first, e, (-s - Math.sqrt(Math.max(0, l))) / (2 * o)), d(r.first, e, (-s + Math.sqrt(Math.max(0, l))) / (2 * o))]);
		}
	}
	return n.map((n) => S(e, n) && S(t, n) ? n : null);
}
function w(e, t, n, r) {
	let a, s = 1, c = 1;
	if (n === "translation") {
		if (t.kind !== "vector") throw Error("Select a vector.");
		let e = u(t.second, t.first);
		a = (t) => d(t, e, 1);
	} else if (n === "axialSymmetry") {
		if (!b(t)) throw Error("Select a linear axis.");
		let e = u(t.second, t.first), n = e.x ** 2 + e.y ** 2;
		if (n < i * i) throw Error("The axis is undefined.");
		c = -1, a = (r) => {
			let i = u(r, t.first), a = d(t.first, e, (i.x * e.x + i.y * e.y) / n);
			return {
				x: 2 * a.x - r.x,
				y: 2 * a.y - r.y
			};
		};
	} else {
		if (t.kind !== "point") throw Error("Select a centre point.");
		let e = t.point, i = n === "rotation" ? o(r) : 0, c = n === "homothety" ? r : n === "centralSymmetry" ? -1 : 1;
		s = Math.abs(c), a = (t) => {
			let n = u(t, e);
			return {
				x: e.x + c * (n.x * Math.cos(i) - n.y * Math.sin(i)),
				y: e.y + c * (n.x * Math.sin(i) + n.y * Math.cos(i))
			};
		};
	}
	if (e.kind === "comment" && e.angleMark) {
		let t = e.angleMark, n = a(t.vertex), r = a({
			x: t.vertex.x + Math.cos(t.start),
			y: t.vertex.y + Math.sin(t.start)
		});
		return {
			...e,
			point: a(e.point),
			angleMark: {
				...t,
				vertex: n,
				start: Math.atan2(r.y - n.y, r.x - n.x),
				sweep: t.sweep * c
			}
		};
	}
	if (e.kind === "point" || e.kind === "comment") return {
		...e,
		point: a(e.point)
	};
	if (b(e)) return {
		...e,
		first: a(e.first),
		second: a(e.second)
	};
	if (e.kind === "polygon") return {
		...e,
		vertices: e.vertices.map(a)
	};
	let l = a(e.center), f = e.radius * s;
	if (e.kind === "circle") return {
		kind: "circle",
		center: l,
		radius: f
	};
	let p = a({
		x: e.center.x + e.radius * Math.cos(e.start),
		y: e.center.y + e.radius * Math.sin(e.start)
	});
	return {
		...e,
		center: l,
		radius: f,
		start: Math.atan2(p.y - l.y, p.x - l.x),
		sweep: c * e.sweep
	};
}
function T(e, t) {
	let n = e.inputs.map(t), r = n[0];
	if (!r) throw Error("Missing measurement support.");
	let o = 0, s, d, f = (e) => ({
		x: e.reduce((e, t) => e + t.x, 0) / e.length,
		y: e.reduce((e, t) => e + t.y, 0) / e.length
	});
	if (e.operation === "angle" && n.length === 2) {
		let e = n[1];
		if (!b(r) || !e || !b(e)) throw Error("Select two linear sides.");
		let t = [r.first, r.second].find((t) => c(t, e.first) < i || c(t, e.second) < i) ?? C(r, e).find((e) => e !== null);
		if (!t) throw Error("The sides need a common vertex or intersection.");
		let a = (e) => c(e.first, t) > c(e.second, t) ? e.first : e.second, f = a(r), p = a(e);
		if (c(f, t) < i || c(p, t) < i) throw Error("The angle needs two nonzero arms.");
		let m = u(f, t), h = u(p, t), g = Math.atan2(l(m, h), m.x * h.x + m.y * h.y);
		o = Math.abs(g) * 180 / Math.PI, s = {
			vertex: t,
			start: Math.atan2(m.y, m.x),
			sweep: g,
			right: Math.abs(o - 90) < 1e-7
		}, d = t;
	} else if (e.operation === "angle" || n.length === 2) {
		let [t, r, a] = n.map((e) => {
			if (e.kind !== "point") throw Error("Select points.");
			return e.point;
		});
		if (!t || !r) throw Error("Select two points.");
		if (e.operation === "angle") {
			if (!a || c(t, r) < i || c(a, r) < i) throw Error("The angle needs two nonzero arms.");
			let e = u(t, r), n = u(a, r);
			o = Math.atan2(Math.abs(l(e, n)), e.x * n.x + e.y * n.y) * 180 / Math.PI, d = r;
		} else o = c(t, r), d = f([t, r]);
	} else if (r.kind === "polygon") {
		d = f(r.vertices);
		let t = r.vertices;
		if (e.operation === "area") for (let e = 0; e < t.length; e++) {
			let n = t[e], r = t[(e + 1) % t.length];
			if (!(!n || !r)) for (let a = e + 2; a < t.length; a++) {
				if (e === 0 && a === t.length - 1) continue;
				let o = t[a], s = t[(a + 1) % t.length];
				if (!o || !s) continue;
				let c = (e, t, n) => l(u(t, e), u(n, e)), d = (e, t, n) => Math.abs(c(e, t, n)) < i && n.x >= Math.min(e.x, t.x) - i && n.x <= Math.max(e.x, t.x) + i && n.y >= Math.min(e.y, t.y) - i && n.y <= Math.max(e.y, t.y) + i;
				if (c(n, r, o) * c(n, r, s) < 0 && c(o, s, n) * c(o, s, r) < 0 || d(n, r, o) || d(n, r, s) || d(o, s, n) || d(o, s, r)) throw Error("Area requires a simple polygon without crossing edges.");
			}
		}
		for (let n = 0; n < t.length; n++) {
			let r = t[n], i = t[(n + 1) % t.length];
			!r || !i || (o += e.operation === "area" ? l(u(r, t[0] ?? r), u(i, t[0] ?? r)) / 2 : c(r, i));
		}
		o = Math.abs(o);
	} else if (r.kind === "segment" || r.kind === "vector") o = c(r.first, r.second), d = f([r.first, r.second]);
	else if (r.kind === "circle" || r.kind === "arc" || r.kind === "sector") {
		let t = r.kind === "circle" ? a : Math.abs(r.sweep);
		o = e.operation === "area" ? r.radius ** 2 * t / 2 : r.radius * t + (r.kind === "sector" ? 2 * r.radius : 0), d = r.kind === "arc" ? {
			x: r.center.x + r.radius * Math.cos(r.start + r.sweep / 2),
			y: r.center.y + r.radius * Math.sin(r.start + r.sweep / 2)
		} : r.center;
	} else throw Error("Unsupported measurement support.");
	if (!Number.isFinite(o)) throw Error("The measurement is undefined.");
	let p = e.operation === "angle" ? "°" : e.operation === "area" ? " u²" : " u";
	return {
		kind: "comment",
		point: {
			x: d.x + (e.offset?.x ?? 0),
			y: d.y + (e.offset?.y ?? 0)
		},
		text: s ? s.right ? "" : `${Number(o.toFixed(2))}°` : `${e.operation}(${e.inputs.join(", ")}) = ${Number(o.toFixed(2))}${p}`,
		...s ? { angleMark: s } : {}
	};
}
function E(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = new Map(e.map((e) => [e.id, e])), o = /* @__PURE__ */ new Set(), l = (e) => {
		if (t.has(e)) return t.get(e) ?? null;
		if (o.has(e)) throw Error(`Circular dependency: ${e}`);
		o.add(e);
		try {
			let n = r.get(e)?.definition;
			if (!n) throw Error(`Unknown object: ${e}`);
			let o = (e) => {
				let t = l(e);
				if (!t) throw Error(`Undefined support: ${e}`);
				return t;
			}, f = (e) => {
				let t = o(e);
				if (t.kind !== "point") throw Error(`Expected point: ${e}`);
				return t.point;
			}, p = (e) => {
				let t;
				if (e.kind === "transform") t = w(typeof e.object == "string" ? o(e.object) : p(e.object), o(e.support), e.operation, e.amount);
				else if (e.kind === "polygon" || e.kind === "regularPolygon") {
					let n;
					if (e.kind === "polygon") n = e.vertices.map(f);
					else {
						let t = f(e.first), r = f(e.second);
						n = [t, r];
						let i = a / e.sides, o = r.x - t.x, s = r.y - t.y;
						for (let t = 2; t < e.sides; t++) {
							let e = o * Math.cos(i) - s * Math.sin(i);
							s = o * Math.sin(i) + s * Math.cos(i), o = e;
							let a = n[t - 1] ?? r;
							n.push({
								x: a.x + o,
								y: a.y + s
							});
						}
					}
					if (n.some((e, t) => c(e, n[(t + 1) % n.length] ?? e) < i)) throw Error("Consecutive polygon vertices coincide.");
					t = {
						kind: "polygon",
						vertices: n
					};
				} else if (e.kind === "point") t = {
					kind: "point",
					point: {
						x: e.x,
						y: e.y
					}
				};
				else if (e.kind === "line" || e.kind === "segment" || e.kind === "ray" || e.kind === "vector") {
					let n = f(e.first), r = f(e.second);
					if (c(n, r) < i) throw Error("The two points coincide.");
					e.kind === "segment" && e.length !== void 0 && (r = d(n, u(r, n), e.length / c(n, r))), t = {
						kind: e.kind,
						first: n,
						second: r
					};
				} else if (e.kind === "circle") {
					let n = f(e.center), r = typeof e.radius == "number" ? e.radius : "through" in e.radius ? c(n, f(e.radius.through)) : c(f(e.radius.distance[0]), f(e.radius.distance[1]));
					if (r < i) throw Error("The radius is zero.");
					t = {
						kind: "circle",
						center: n,
						radius: r
					};
				} else if (e.kind === "arc" || e.kind === "sector") {
					let n = o(e.circle);
					if (n.kind !== "circle") throw Error("Expected a circle.");
					let r = 0;
					if (e.relativeTo) {
						let t = o(e.relativeTo);
						if (!b(t)) throw Error("Expected a direction.");
						r = Math.atan2(t.second.y - t.first.y, t.second.x - t.first.x);
					}
					t = {
						...n,
						kind: e.kind,
						start: e.start + r,
						sweep: e.clockwise ? -s(e.start - e.end) : s(e.end - e.start)
					};
				} else if (e.kind === "on") {
					let n = o(e.object), r;
					if (b(n)) r = d(n.first, u(n.second, n.first), O(n, e.parameter));
					else if (x(n)) {
						let t = e.parameter;
						n.kind === "arc" && !S(n, d(n.center, {
							x: Math.cos(t),
							y: Math.sin(t)
						}, n.radius)) && (t = D(n, t)), r = d(n.center, {
							x: Math.cos(t),
							y: Math.sin(t)
						}, n.radius);
					} else throw Error("Expected a line or circle.");
					t = {
						kind: "point",
						point: r
					};
				} else if (e.kind === "measure") t = T(e, o);
				else if (e.kind === "comment") t = {
					kind: "comment",
					point: f(e.point),
					text: e.text
				};
				else if (e.kind === "midpoint" || e.kind === "perpendicularBisector") {
					let n = o(e.segment);
					if (n.kind !== "segment") throw Error("Expected a segment.");
					let r = d(n.first, u(n.second, n.first), .5), i = u(n.second, n.first);
					t = e.kind === "midpoint" ? {
						kind: "point",
						point: r
					} : {
						kind: "line",
						first: r,
						second: d(r, {
							x: -i.y,
							y: i.x
						}, 1)
					};
				} else if (e.kind === "parallel" || e.kind === "perpendicular") {
					let n = o(e.support);
					if (!b(n)) throw Error("Expected a linear support.");
					let r = f(e.point), i = u(n.second, n.first);
					t = {
						kind: "line",
						first: r,
						second: d(r, e.kind === "parallel" ? i : {
							x: -i.y,
							y: i.x
						}, 1)
					};
				} else if (e.kind === "bisector") {
					let n = f(e.vertex), r = u(f(e.first), n), a = u(f(e.second), n), o = Math.hypot(r.x, r.y), s = Math.hypot(a.x, a.y);
					if (o < i || s < i) throw Error("The angle needs two nonzero arms.");
					let c = {
						x: r.x / o + a.x / s,
						y: r.y / o + a.y / s
					};
					Math.hypot(c.x, c.y) < i && (c.x = -r.y / o, c.y = r.x / o), t = {
						kind: "line",
						first: n,
						second: d(n, c, 1)
					};
				} else if (e.kind === "tangent") {
					let n = o(e.circle);
					if (n.kind !== "circle") throw Error("Expected a circle.");
					let r = f(e.point), a = u(r, n.center), s = c(r, n.center);
					if (s < n.radius - i) throw Error("No tangent from inside the circle.");
					if (Math.abs(s - n.radius) <= i) t = {
						kind: "line",
						first: r,
						second: d(r, {
							x: -a.y / s,
							y: a.x / s
						}, 1)
					};
					else {
						let i = d(n.center, a, (n.radius / s) ** 2), o = n.radius * Math.sqrt(1 - (n.radius / s) ** 2);
						t = {
							kind: "line",
							first: r,
							second: d(i, {
								x: -a.y / s,
								y: a.x / s
							}, e.branch === 0 ? o : -o)
						};
					}
				} else if (e.kind === "intersection") {
					let n = C(o(e.first), o(e.second))[e.branch];
					if (!n) throw Error("This intersection does not exist.");
					t = {
						kind: "point",
						point: n
					};
				} else throw Error("Unsupported construction.");
				return t;
			}, m = p(n);
			return t.set(e, m), m;
		} catch (r) {
			return n.set(e, r instanceof Error ? r.message : String(r)), t.set(e, null), null;
		} finally {
			o.delete(e);
		}
	};
	for (let t of e) l(t.id);
	return {
		values: t,
		errors: n
	};
}
function D(e, t) {
	let n = (e) => Math.abs(Math.atan2(Math.sin(e - t), Math.cos(e - t)));
	return n(e.start) <= n(e.start + e.sweep) ? e.start : e.start + e.sweep;
}
function O(e, t) {
	return e.kind === "segment" || e.kind === "vector" ? Math.max(0, Math.min(1, t)) : e.kind === "ray" ? Math.max(0, t) : t;
}
function k(e, t) {
	if (x(e)) {
		let n = Math.atan2(t.y - e.center.y, t.x - e.center.x);
		return e.kind === "arc" && !S(e, t) ? D(e, n) : n;
	}
	if (b(e)) {
		let n = u(e.second, e.first), r = u(t, e.first);
		return O(e, (r.x * n.x + r.y * n.y) / (n.x ** 2 + n.y ** 2));
	}
	throw Error("Select a line, segment, circle or arc.");
}
function A(e) {
	let t = (e) => String(Number(e.toPrecision(12)));
	return e.map(({ id: n, hidden: r, stroke: i, color: a, definition: o }) => {
		let s = _(o), c = (n) => {
			let r;
			if (n.kind === "transform") r = `${n.operation}(${typeof n.object == "string" ? n.object : c(n.object)}, ${n.support}${n.operation === "homothety" ? `, ratio=${t(n.amount)}` : n.operation === "rotation" ? `, angle=${t(n.amount)}deg` : ""})`;
			else if (n.kind === "polygon") r = `polygon(${n.vertices.join(", ")})`;
			else if (n.kind === "regularPolygon") r = `regularPolygon(${n.first}, ${n.second}, sides=${n.sides})`;
			else if (n.kind === "point") r = `(${t(n.x)}, ${t(n.y)})`;
			else if (n.kind === "on") {
				let i = e.find((e) => e.id === n.object)?.definition, a = i ? _(i) : "";
				r = `on(${n.object}, ${[
					"line",
					"segment",
					"ray",
					"vector"
				].includes(a) ? `t=${t(n.parameter)}` : `angle=${t(n.parameter * 180 / Math.PI)}deg`})`;
			} else if (n.kind === "intersection") r = `intersection(${n.first}, ${n.second}, branch=${n.branch})`;
			else if (n.kind === "line" || n.kind === "segment" || n.kind === "ray" || n.kind === "vector") r = `${n.kind}(${n.first}, ${n.second}${n.kind === "segment" && n.length !== void 0 ? `, length=${t(n.length)}` : ""})`;
			else if (n.kind === "circle") r = `circle(${n.center}, ${typeof n.radius == "number" ? t(n.radius) : "through" in n.radius ? `through=${n.radius.through}` : `distance(${n.radius.distance.join(", ")})`})`;
			else if (n.kind === "measure") r = `${n.operation}(${n.inputs.join(", ")}${n.offset ? `, dx=${t(n.offset.x)}, dy=${t(n.offset.y)}` : ""})`;
			else if (n.kind === "comment") r = `comment(${n.point}, ${JSON.stringify(n.text)})`;
			else if (n.kind === "midpoint" || n.kind === "perpendicularBisector") r = `${n.kind}(${n.segment})`;
			else if (n.kind === "parallel" || n.kind === "perpendicular") r = `${n.kind}(${n.point}, ${n.support})`;
			else if (n.kind === "bisector") r = `bisector(${n.first}, ${n.vertex}, ${n.second})`;
			else if (n.kind === "tangent") r = `tangent(${n.point}, ${n.circle}, branch=${n.branch})`;
			else if (n.kind === "arc" || n.kind === "sector") r = `${n.kind}(${n.circle}, start=${t(n.start * 180 / Math.PI)}deg, end=${t(n.end * 180 / Math.PI)}deg, direction=${n.clockwise ? "cw" : "ccw"}${n.relativeTo ? `, relative-to=${n.relativeTo}` : ""})`;
			else throw Error("Unsupported construction.");
			return r;
		};
		return `${s} ${n} = ${c(o)}${i && i !== "solid" ? ` style=${i}` : ""}${a ? ` color=${a}` : ""}${r ? " hidden" : ""}`;
	}).join("\n");
}
var j = "point A = (-3, 0)\npoint B = (3, 0)\nsegment AB = segment(A, B)\ncircle cA = circle(A, distance(A, B)) hidden\ncircle cB = circle(B, distance(A, B)) hidden\narc aC = arc(cA, start=40deg, end=80deg, relative-to=AB)\narc aD = arc(cA, start=280deg, end=320deg, relative-to=AB)\narc bC = arc(cB, start=100deg, end=140deg, relative-to=AB)\narc bD = arc(cB, start=220deg, end=260deg, relative-to=AB)\npoint C = intersection(aC, bC, branch=0)\npoint D = intersection(aD, bD, branch=1)\nline m = line(C, D)";
//#endregion
export { t as GEOMETRY_COLORS, n as GEOMETRY_STYLES, r as GEOMETRY_TRANSFORMATIONS, j as MEDIATRIX_CONSTRUCTION, _ as constructionKind, S as contains, y as dependencies, c as distance, E as evaluateGeometry, C as intersections, b as isLinear, k as parameterAt, g as parseGeometry, A as serializeGeometry };

//# sourceMappingURL=geometry.js.map