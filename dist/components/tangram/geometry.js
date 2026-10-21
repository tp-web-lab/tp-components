//#region src/components/tangram/geometry.ts
function e(e, t) {
	let n = e[t];
	if (n === void 0) throw Error(`Missing item ${t}`);
	return n;
}
var t = [
	[
		[0, 0],
		[4, 0],
		[2, 2]
	],
	[
		[0, 0],
		[2, 2],
		[0, 4]
	],
	[
		[4, 2],
		[4, 4],
		[2, 4]
	],
	[
		[4, 0],
		[4, 2],
		[3, 1]
	],
	[
		[2, 2],
		[3, 3],
		[1, 3]
	],
	[
		[2, 2],
		[3, 1],
		[4, 2],
		[3, 3]
	],
	[
		[0, 4],
		[2, 4],
		[3, 3],
		[1, 3]
	]
], n = [
	"large-1",
	"large-2",
	"medium",
	"small-1",
	"small-2",
	"square",
	"parallelogram"
], r = t.map((t, r) => {
	t.reduce((n, r, i) => {
		let a = e(t, (i + 1) % t.length);
		return n + r[0] * a[1] - r[1] * a[0];
	}, 0) < 0 && t.reverse();
	let i = t.reduce((e, t) => e + t[0], 0) / t.length, a = t.reduce((e, t) => e + t[1], 0) / t.length;
	return {
		id: e(n, r),
		points: t.map((e) => ({
			x: e[0] - i,
			y: e[1] - a
		})),
		x: i - 2,
		y: a - 2
	};
}), i = r.map((e) => ({
	id: e.id,
	x: e.x,
	y: e.y,
	angle: 0,
	flipped: !1
}));
function a(e) {
	let t = r.find((t) => t.id === e.id);
	if (!t) throw Error(`Unknown piece: ${e.id}`);
	let n = e.angle * Math.PI / 180, i = Math.cos(n), a = Math.sin(n), o = t.points.map((t) => {
		let n = e.flipped ? -t.x : t.x;
		return {
			x: e.x + n * i - t.y * a,
			y: e.y + n * a + t.y * i
		};
	});
	return e.flipped ? o.reverse() : o;
}
var o = (e, t, n) => (t.x - e.x) * (n.y - e.y) - (t.y - e.y) * (n.x - e.x);
function s(t) {
	return Math.abs(t.reduce((n, r, i) => {
		let a = e(t, (i + 1) % t.length);
		return n + r.x * a.y - r.y * a.x;
	}, 0)) / 2;
}
function c(t, n) {
	let r = t;
	for (let t = 0; t < n.length; t++) {
		let i = e(n, t), a = e(n, (t + 1) % n.length), s = r;
		r = [];
		for (let t = 0; t < s.length; t++) {
			let n = e(s, t), c = e(s, (t + 1) % s.length), l = o(i, a, n), u = o(i, a, c);
			if (l >= 0 && r.push(n), l >= 0 != u >= 0) {
				let e = l / (l - u);
				r.push({
					x: n.x + e * (c.x - n.x),
					y: n.y + e * (c.y - n.y)
				});
			}
		}
	}
	return r;
}
function l(e, t) {
	return s(c(a(e), a(t))) > 1e-7;
}
function u(e) {
	if (e.length !== 7 || new Set(e.map((e) => e.id)).size !== 7) throw Error("Exactly seven different pieces are required.");
	for (let t of e) {
		if (!r.some((e) => e.id === t.id) || ![
			t.x,
			t.y,
			t.angle
		].every(Number.isFinite) || typeof t.flipped != "boolean") throw Error("Invalid piece placement.");
		if (Math.abs(t.x) > 1e4 || Math.abs(t.y) > 1e4) throw Error("Coordinates exceed the supported range.");
	}
	if (e.some((t, n) => e.slice(n + 1).some((e) => l(t, e)))) throw Error("Solution pieces must not overlap.");
}
var d = "# Corners of a square of side 4\npoint A = (0, 0)\npoint B = (4, 0)\npoint C = (4, 4)\npoint D = (0, 4)\n\n# Shared landmarks\npoint O = midpoint(A, C)\npoint E = midpoint(B, C)\npoint F = midpoint(C, D)\npoint G = midpoint(B, O)\npoint H = midpoint(O, C)\npoint I = midpoint(O, D)\n\n# The seven pieces, described by their boundary vertices\ntriangle A B O\ntriangle A O D\ntriangle E C F\ntriangle B E G\ntriangle O H I\nsquare O G E H\nparallelogram D F H I";
function f(t, n) {
	let i = r.find((e) => e.id === t);
	if (!i || n.length !== i.points.length) return null;
	let a = n.reduce((e, t) => e + t.x, 0) / n.length, o = n.reduce((e, t) => e + t.y, 0) / n.length;
	for (let r of [!1, !0]) {
		let s = i.points.map((e) => ({
			x: r ? -e.x : e.x,
			y: e.y
		})), c = e(s, 0);
		for (let i of [1, -1]) for (let l = 0; l < n.length; l++) {
			let u = s.map((t, r) => e(n, (l + i * r + n.length) % n.length)), d = e(u, 0), f = Math.atan2(d.y - o, d.x - a) - Math.atan2(c.y, c.x), p = Math.cos(f), m = Math.sin(f);
			if (s.every((t, n) => {
				let r = e(u, n);
				return Math.hypot(a + t.x * p - t.y * m - r.x, o + t.x * m + t.y * p - r.y) < 1e-7;
			})) return {
				id: t,
				x: a,
				y: o,
				angle: f * 180 / Math.PI,
				flipped: r
			};
		}
	}
	return null;
}
function p(t) {
	let n = /* @__PURE__ */ new Map(), i = [], a = 1, o = !1, s = "[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d+)?", c = RegExp(`^\\(\\s*(${s})\\s*,\\s*(${s})\\s*\\)$`), d = (e) => {
		let t = n.get(e);
		if (!t) throw Error(`Unknown point "${e}". Define it before using it.`);
		return t;
	};
	for (let [s, u] of t.split(/\r?\n/).entries()) {
		let t = u.replace(/#.*$/, "").trim();
		if (t) try {
			if (t.startsWith("grid")) {
				if (o || n.size || i.length) throw Error("Declare the grid once, before any points or pieces.");
				if (t !== "grid 1" && t !== "grid sqrt2") throw Error("Expected grid 1 or grid sqrt2.");
				a = t === "grid sqrt2" ? Math.SQRT2 : 1, o = !0;
				continue;
			}
			if (t.startsWith("point ")) {
				let r = /^point\s+([A-Za-z][\w-]*)\s*=\s*(.+)$/.exec(t);
				if (!r) throw Error("Expected point NAME = (x, y) or midpoint(A, B).");
				let i = e(r, 1), o = e(r, 2);
				if (n.has(i)) throw Error(`Point "${i}" is already defined.`);
				let s = c.exec(o), l = /^midpoint\(\s*([A-Za-z][\w-]*)\s*,\s*([A-Za-z][\w-]*)\s*\)$/.exec(o), u;
				if (s) u = {
					x: a * Number(e(s, 1)),
					y: a * Number(e(s, 2))
				};
				else if (l) {
					let t = d(e(l, 1)), n = d(e(l, 2));
					u = {
						x: (t.x + n.x) / 2,
						y: (t.y + n.y) / 2
					};
				} else throw Error("Expected coordinates (x, y) or midpoint(A, B).");
				if (![u.x, u.y].every((e) => Number.isFinite(e) && Math.abs(e) <= 1e4)) throw Error("Point coordinates must be finite and within ±10000.");
				n.set(i, u);
				continue;
			}
			let s = t.match(/\([^()]*\)|[^\s]+/g) ?? [], u = s.shift();
			if (!u || ![
				"triangle",
				"square",
				"parallelogram"
			].includes(u)) throw Error("Expected point, triangle, square or parallelogram.");
			if (s.length !== (u === "triangle" ? 3 : 4)) throw Error(`${u} requires ${u === "triangle" ? 3 : 4} boundary vertices.`);
			let p = s.map((t) => {
				let n = c.exec(t);
				return n ? {
					x: a * Number(e(n, 1)),
					y: a * Number(e(n, 2))
				} : d(t);
			});
			if (p.some((e) => ![e.x, e.y].every((e) => Number.isFinite(e) && Math.abs(e) <= 1e4))) throw Error("Invalid vertex coordinates.");
			let m = r.filter((e) => u === "triangle" ? e.points.length === 3 : e.id === u).map((e) => f(e.id, p)).filter((e) => e !== null), h = m.find((e) => !i.some((t) => t.id === e.id));
			if (!h) throw Error(m.length ? `No unused ${u} of this size remains.` : `These vertices do not form a tangram ${u} of the required size. List vertices around its boundary.`);
			if (i.some((e) => l(e, h))) throw Error("This piece overlaps a previously declared piece.");
			i.push(h);
		} catch (e) {
			throw Error(`Line ${s + 1}: ${e instanceof Error ? e.message : String(e)}`);
		}
	}
	return u(i), i;
}
function m(e) {
	if (/^\s*(?:grid|point|triangle|square\s+(?:[A-Za-z(])|parallelogram\s+(?:[A-Za-z(]))/m.test(e.replace(/#.*$/gm, ""))) return p(e);
	let t;
	if (e.trim().startsWith("[")) {
		let n = JSON.parse(e);
		if (!Array.isArray(n)) throw Error("Expected a placement array.");
		t = n.map((e) => ({
			...e,
			angle: e.angle ?? 0,
			flipped: e.flipped ?? !1
		}));
	} else t = e.split(/\r?\n/).map((e) => e.replace(/#.*$/, "").trim()).filter(Boolean).map((e) => {
		let [t, n, r, i = "0", a, ...o] = e.split(/\s+/);
		if (!t || !n || !r || o.length || a !== void 0 && a !== "flip") throw Error(`Invalid placement: ${e}`);
		return {
			id: t,
			x: Number(n),
			y: Number(r),
			angle: Number(i),
			flipped: a === "flip"
		};
	});
	return u(t), t;
}
function h(e, t) {
	return Math.abs(s(a(e)) - t.reduce((t, n) => t + s(c(a(e), a(n))), 0)) < 1e-6;
}
function g(e, t) {
	try {
		u(e), u(t);
	} catch {
		return !1;
	}
	return e.every((e) => h(e, t));
}
//#endregion
export { r as PIECES, i as SQUARE, d as SQUARE_SOURCE, s as area, e as at, h as insideTarget, c as intersection, l as overlaps, m as parseSolution, a as polygon, g as solved, u as validate };

//# sourceMappingURL=geometry.js.map