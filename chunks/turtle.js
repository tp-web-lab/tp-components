import { Ku as e } from "./lib/typescript/typescript.js";
import { TpDeclarativeTextSource as t } from "../utilities/declarative-text-source.js";
//#region ../../../../../../@tp/tp-utilities/dist/turtle/turtle.js
function n(e) {
	let t = [];
	for (let n of e) {
		let e = t[t.length - 1];
		!e || !o(e.style, n.style) ? t.push({
			style: n.style,
			entries: [n]
		}) : e.entries.push(n);
	}
	return t;
}
function r(e) {
	return e.reduce((e, t) => e + t.segment.length, 0);
}
var i = class e {
	static nextId = 1;
	static sceneEntries = [];
	static stylesById = /* @__PURE__ */ new Map();
	static headsById = /* @__PURE__ */ new Map();
	static clearScene() {
		e.sceneEntries = [], e.stylesById.clear(), e.headsById.clear(), e.nextId = 1;
	}
	static renderSceneSvg(t = {}) {
		let i = t.width ?? 900, o = t.height ?? 500, s = t.padding ?? 24, l = t.background ?? "transparent", u = t.linecap ?? "round", d = t.linejoin ?? "round";
		if (e.sceneEntries.length === 0 && e.headsById.size === 0) return `<svg xmlns="http://www.w3.org/2000/svg" width="${i}" height="${o}" viewBox="0 0 ${i} ${o}"></svg>`;
		let f = Infinity, p = Infinity, m = -Infinity, h = -Infinity;
		for (let t of e.sceneEntries) f = Math.min(f, t.segment.x1, t.segment.x2), p = Math.min(p, t.segment.y1, t.segment.y2), m = Math.max(m, t.segment.x1, t.segment.x2), h = Math.max(h, t.segment.y1, t.segment.y2);
		for (let t of e.headsById.values()) f = Math.min(f, t.x), p = Math.min(p, t.y), m = Math.max(m, t.x), h = Math.max(h, t.y);
		(!Number.isFinite(f) || !Number.isFinite(p) || !Number.isFinite(m) || !Number.isFinite(h)) && (f = -1, p = -1, m = 1, h = 1);
		let g = Math.max(1e-9, m - f), _ = Math.max(1e-9, h - p), v = Math.max(1, i - 2 * s), y = Math.max(1, o - 2 * s), b = Math.min(v / g, y / _), x = (f + m) / 2, S = (p + h) / 2, C = (e, t) => ({
			x: (e - x) * b + i / 2,
			y: (t - S) * b + o / 2
		}), w = /* @__PURE__ */ new Map();
		for (let t of e.sceneEntries) w.set(t.turtleId, (w.get(t.turtleId) ?? 0) + t.segment.length);
		let T = /* @__PURE__ */ new Map();
		for (let t of e.sceneEntries) {
			let e = C(t.segment.x1, t.segment.y1), n = C(t.segment.x2, t.segment.y2), r = `M ${e.x.toFixed(2)} ${e.y.toFixed(2)} L ${n.x.toFixed(2)} ${n.y.toFixed(2)}`, i = T.get(t.turtleId) ?? [];
			i.push(r), T.set(t.turtleId, i);
		}
		let E = /* @__PURE__ */ new Map(), D = [], O = [];
		for (let t of e.sceneEntries) {
			let e = t.style, n = C(t.segment.x1, t.segment.y1), r = C(t.segment.x2, t.segment.y2), i = `M ${n.x.toFixed(2)} ${n.y.toFixed(2)} L ${r.x.toFixed(2)} ${r.y.toFixed(2)}`, a = Math.max(1e-9, t.segment.length * b).toFixed(2);
			if (e.durationMs > 0) {
				let n = Math.max(1e-9, w.get(t.turtleId) ?? 1e-9), r = Math.max(1, Math.round(e.durationMs * t.segment.length / n)), o = E.get(t.turtleId) ?? 0, s = e.beginMs + o;
				E.set(t.turtleId, o + r);
				let l = (Math.max(0, s) / 1e3).toFixed(3), f = (Math.max(1, r) / 1e3).toFixed(3);
				D.push([
					`<path d="${i}" fill="none" stroke="${c(e.stroke)}" stroke-width="${e.strokeWidth}" stroke-linecap="${u}" stroke-linejoin="${d}" stroke-dasharray="${a}" stroke-dashoffset="${a}">`,
					`<animate attributeName="stroke-dashoffset" from="${a}" to="0" begin="${l}s" dur="${f}s" fill="freeze" />`,
					"</path>"
				].join(""));
			} else D.push(`<path d="${i}" fill="none" stroke="${c(e.stroke)}" stroke-width="${e.strokeWidth}" stroke-linecap="${u}" stroke-linejoin="${d}" />`);
		}
		for (let [t] of T.entries()) {
			let i = e.sceneEntries.filter((e) => e.turtleId === t);
			if (i.length === 0) continue;
			let o = n(i), s = Math.max(1e-9, r(i)), c = 0;
			for (let e of o) {
				let t = e.style, n = r(e.entries), i = Math.max(1, Math.round(t.durationMs * n / s)), o = t.beginMs + c;
				if (t.shape === "none" || t.durationMs <= 0) {
					c += i;
					continue;
				}
				let l = [];
				for (let t of e.entries) {
					let e = C(t.segment.x1, t.segment.y1), n = C(t.segment.x2, t.segment.y2);
					l.push(`M ${e.x.toFixed(2)} ${e.y.toFixed(2)} L ${n.x.toFixed(2)} ${n.y.toFixed(2)}`);
				}
				let u = a(t.shape, t.shapeSize, t.stroke, t.strokeWidth);
				if (u !== "") {
					let e = (Math.max(0, o) / 1e3).toFixed(3), t = (Math.max(1, i) / 1e3).toFixed(3);
					O.push([
						"<g opacity=\"0\">",
						`${u}`,
						`<set attributeName="opacity" to="1" begin="${e}s" dur="${t}s" fill="remove" />`,
						`<animateMotion begin="${e}s" dur="${t}s" fill="remove" rotate="auto" path="${l.join(" ")}" />`,
						"</g>"
					].join(""));
				}
				c += i;
			}
		}
		let k = new Set(e.sceneEntries.map((e) => e.turtleId)), A = [];
		for (let t of e.headsById.values()) {
			if (!k.has(t.turtleId)) continue;
			let n = e.stylesById.get(t.turtleId) ?? e.defaultStyle();
			if (n.shape === "none" || n.durationMs > 0) continue;
			let r = C(t.x, t.y), i = t.headingRad * 180 / Math.PI, o = a(n.shape, n.shapeSize, n.stroke, n.strokeWidth);
			o !== "" && A.push(`<g transform="translate(${r.x.toFixed(2)} ${r.y.toFixed(2)}) rotate(${i.toFixed(2)})">${o}</g>`);
		}
		return [
			`<svg xmlns="http://www.w3.org/2000/svg" width="${i}" height="${o}" viewBox="0 0 ${i} ${o}" role="img">`,
			`<rect width="100%" height="100%" fill="${c(l)}" />`,
			...D,
			...O,
			...A,
			"</svg>"
		].join("\n");
	}
	static defaultStyle() {
		return {
			stroke: "currentColor",
			strokeWidth: 2,
			durationMs: 1200,
			beginMs: 0,
			shape: "triangle",
			shapeSize: 12
		};
	}
	static cloneCurrentStyle(t) {
		return { ...e.stylesById.get(t) ?? e.defaultStyle() };
	}
	id;
	state;
	stack = [];
	constructor(t = {}) {
		this.id = e.nextId++, this.state = {
			x: t.x ?? 0,
			y: t.y ?? 0,
			headingRad: t.headingRad ?? 0
		}, e.stylesById.set(this.id, {
			...e.defaultStyle(),
			...t.style ?? {}
		}), e.headsById.set(this.id, {
			turtleId: this.id,
			x: this.state.x,
			y: this.state.y,
			headingRad: this.state.headingRad
		});
	}
	setStyle(t) {
		let n = e.stylesById.get(this.id) ?? e.defaultStyle();
		return e.stylesById.set(this.id, {
			...n,
			...t
		}), this;
	}
	forward(t, n = !0) {
		let r = this.state.x + Math.cos(this.state.headingRad) * t, i = this.state.y + Math.sin(this.state.headingRad) * t;
		return n && e.sceneEntries.push({
			turtleId: this.id,
			segment: {
				x1: this.state.x,
				y1: this.state.y,
				x2: r,
				y2: i,
				length: Math.hypot(r - this.state.x, i - this.state.y)
			},
			style: e.cloneCurrentStyle(this.id)
		}), this.state = {
			...this.state,
			x: r,
			y: i
		}, e.headsById.set(this.id, {
			turtleId: this.id,
			x: this.state.x,
			y: this.state.y,
			headingRad: this.state.headingRad
		}), this;
	}
	goto(t, n, r = !0) {
		r && e.sceneEntries.push({
			turtleId: this.id,
			segment: {
				x1: this.state.x,
				y1: this.state.y,
				x2: t,
				y2: n,
				length: Math.hypot(t - this.state.x, n - this.state.y)
			},
			style: e.cloneCurrentStyle(this.id)
		});
		let i = t - this.state.x, a = n - this.state.y, o = i === 0 && a === 0 ? this.state.headingRad : Math.atan2(a, i);
		return this.state = {
			...this.state,
			x: t,
			y: n,
			headingRad: o
		}, e.headsById.set(this.id, {
			turtleId: this.id,
			x: this.state.x,
			y: this.state.y,
			headingRad: this.state.headingRad
		}), this;
	}
	left(t) {
		return this.state = {
			...this.state,
			headingRad: this.state.headingRad + s(t)
		}, e.headsById.set(this.id, {
			turtleId: this.id,
			x: this.state.x,
			y: this.state.y,
			headingRad: this.state.headingRad
		}), this;
	}
	right(t) {
		return this.state = {
			...this.state,
			headingRad: this.state.headingRad - s(t)
		}, e.headsById.set(this.id, {
			turtleId: this.id,
			x: this.state.x,
			y: this.state.y,
			headingRad: this.state.headingRad
		}), this;
	}
	push() {
		return this.stack.push({ ...this.state }), this;
	}
	pop() {
		let t = this.stack.pop();
		return t !== void 0 && (this.state = t, e.headsById.set(this.id, {
			turtleId: this.id,
			x: this.state.x,
			y: this.state.y,
			headingRad: this.state.headingRad
		})), this;
	}
};
function a(e, t, n, r) {
	let i = Math.max(4, t), a = c(n), o = Math.max(1, r * .8);
	switch (e) {
		case "none": return "";
		case "triangle": return `<polygon points="${i},0 ${-i * .8},${i * .6} ${-i * .8},${-i * .6}" fill="${a}" stroke="${a}" stroke-width="${o}" />`;
		case "square": return `<rect x="${-i * .7}" y="${-i * .7}" width="${i * 1.4}" height="${i * 1.4}" fill="${a}" stroke="${a}" stroke-width="${o}" />`;
		case "circle": return `<circle cx="0" cy="0" r="${i * .75}" fill="${a}" stroke="${a}" stroke-width="${o}" />`;
		case "arrow": return `<polygon points="${i},0 ${-i * .2},${i * .7} ${-i * .2},${i * .3} ${-i},${i * .3} ${-i},${-i * .3} ${-i * .2},${-i * .3} ${-i * .2},${-i * .7}" fill="${a}" stroke="${a}" stroke-width="${o}" />`;
		case "turtle": return [`<ellipse cx="${-i * .2}" cy="0" rx="${i * .75}" ry="${i * .55}" fill="${a}" stroke="${a}" stroke-width="${o}" />`, `<circle cx="${i * .75}" cy="0" r="${i * .22}" fill="${a}" stroke="${a}" stroke-width="${o}" />`].join("");
		case "rabbit": return [
			`<ellipse cx="0" cy="0" rx="${i * .55}" ry="${i * .42}" fill="${a}" stroke="${a}" stroke-width="${o}" />`,
			`<ellipse cx="${i * .15}" cy="${-i * .75}" rx="${i * .18}" ry="${i * .42}" fill="${a}" />`,
			`<ellipse cx="${-i * .15}" cy="${-i * .75}" rx="${i * .18}" ry="${i * .42}" fill="${a}" />`
		].join("");
	}
}
function o(e, t) {
	return e.stroke === t.stroke && e.strokeWidth === t.strokeWidth && e.durationMs === t.durationMs && e.beginMs === t.beginMs && e.shape === t.shape && e.shapeSize === t.shapeSize;
}
function s(e) {
	return e * Math.PI / 180;
}
function c(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
}
//#endregion
//#region ../../../../../../@tp/tp-utilities/dist/turtle/turtle-dsl.js
function l(e) {
	return m(f(e));
}
function u(e) {
	let t = [];
	for (let n of e.split(/\r?\n/)) {
		let e = x(n).trim();
		if (!e) continue;
		if (/^goto\s*\(/i.test(e)) {
			let n = e.match(/^goto\s*\((.*)\)\s*$/i);
			if (!n) throw Error("Invalid goto syntax. Expected: goto(x,y,draw)");
			let r = v(n[1] ?? "");
			if (r.length < 2 || r.length > 3) throw Error("Invalid goto args. Expected 2 or 3 args: goto(x,y,draw)");
			t.push({
				cmd: "goto",
				x: C(r[0], "goto x"),
				y: C(r[1], "goto y"),
				draw: r[2] === void 0 || w(r[2], "goto draw")
			});
			continue;
		}
		let [r = "", ...i] = e.split(/\s+/), a = r.toLowerCase();
		if (a === "turtle") {
			let n = e.match(/^turtle\s*\{([^}]*)\}\s*$/i), r = _(g(n ? n[1] ?? "" : i.join(" ")));
			t.push({
				cmd: "turtle",
				name: r.name,
				color: r.color,
				x: S(r.x),
				y: S(r.y),
				heading: S(r.heading),
				duration: S(r.duration),
				begin: S(r.begin),
				strokeWidth: S(r.strokewidth),
				shape: j(r.shape),
				shapeSize: S(r.shapesize),
				speed: S(r.speed)
			});
			continue;
		}
		if (a === "style" || a === "set") {
			let e = _(i);
			t.push({
				cmd: "style",
				color: e.color,
				strokeWidth: S(e.strokewidth),
				shape: j(e.shape),
				shapeSize: S(e.shapesize),
				duration: S(e.duration),
				begin: S(e.begin),
				speed: S(e.speed)
			});
			continue;
		}
		if (a === "use") {
			let e = i[0]?.trim();
			if (!e) throw Error("Missing turtle name for use");
			t.push({
				cmd: "use",
				name: e
			});
			continue;
		}
		if (a === "forward") {
			t.push({
				cmd: "forward",
				value: C(i.join(" "), "forward"),
				draw: !0
			});
			continue;
		}
		if (a === "move") {
			t.push({
				cmd: "forward",
				value: C(i.join(" "), "move"),
				draw: !1
			});
			continue;
		}
		if (a === "left") {
			t.push({
				cmd: "left",
				value: C(i.join(" "), "left")
			});
			continue;
		}
		if (a === "right") {
			t.push({
				cmd: "right",
				value: C(i.join(" "), "right")
			});
			continue;
		}
		if (a === "push") {
			t.push({ cmd: "push" });
			continue;
		}
		if (a === "pop") {
			t.push({ cmd: "pop" });
			continue;
		}
		throw Error(`Unknown turtle command: ${a}`);
	}
	return t;
}
function d(e, t = "animated", n = 0) {
	i.clearScene();
	let r = new i({ style: {
		shape: "none",
		durationMs: 0
	} }), a = /* @__PURE__ */ new Map();
	for (let o of e) switch (o.cmd) {
		case "turtle": {
			let e = o.duration ?? 1200, s = o.speed, c = t === "animated", l = 11 - (s !== void 0 && Number.isFinite(s) && s > 0 ? A(s, 1, 10) : 6), u = new i({
				x: o.x ?? 0,
				y: o.y ?? 0,
				headingRad: k(o.heading ?? 0),
				style: {
					stroke: o.color && o.color.trim() !== "" ? o.color : "currentColor",
					durationMs: c ? Math.max(1, Math.round(e * l)) : 0,
					beginMs: c ? (o.begin ?? 0) + n : 0,
					strokeWidth: o.strokeWidth ?? 2,
					shape: o.shape ?? "triangle",
					shapeSize: o.shapeSize ?? 12
				}
			});
			r = u, o.name?.trim() && a.set(o.name, u);
			break;
		}
		case "style": {
			let e = {};
			if (o.color !== void 0 && (e.stroke = o.color), o.strokeWidth !== void 0 && (e.strokeWidth = o.strokeWidth), o.shape !== void 0 && (e.shape = o.shape), o.shapeSize !== void 0 && (e.shapeSize = o.shapeSize), o.begin !== void 0 && (e.beginMs = o.begin + n), o.duration !== void 0) if (t === "animated" && o.speed !== void 0 && Number.isFinite(o.speed) && o.speed > 0) {
				let t = A(o.speed, 1, 10);
				e.durationMs = Math.max(1, Math.round(o.duration * (11 - t)));
			} else e.durationMs = t === "animated" ? Math.max(0, Math.round(o.duration)) : 0;
			t === "static" && (e.durationMs = 0, e.beginMs = 0), r.setStyle(e);
			break;
		}
		case "use": {
			let e = a.get(o.name);
			if (!e) throw Error(`Unknown turtle name: ${o.name}`);
			r = e;
			break;
		}
		case "forward":
			r.forward(o.value, o.draw);
			break;
		case "left":
			r.left(o.value);
			break;
		case "right":
			r.right(o.value);
			break;
		case "goto":
			r.goto(o.x, o.y, o.draw);
			break;
		case "push":
			r.push();
			break;
		case "pop":
			r.pop();
			break;
	}
}
function f(e) {
	let t = e.split(/\r?\n/), n = /* @__PURE__ */ new Map(), r = [], i = 2e5;
	for (let e = 0; e < t.length; e += 1) {
		let i = x(t[e] ?? "").trim();
		if (!i) continue;
		let a = i.match(/^define\s+([a-z_]\w*)\s*\(([^)]*)\)\s*\{$/i);
		if (a) {
			let r = (a[1] ?? "").toLowerCase(), i = (a[2] ?? "").split(",").map((e) => e.trim()).filter(Boolean), o = [], s = 1;
			for (e += 1; e < t.length;) {
				let n = x(t[e] ?? "").trim(), r = (n.match(/\{/g) ?? []).length, i = (n.match(/\}/g) ?? []).length;
				if (s === 1 && n === "}" || (n && o.push(n), s += r - i, s <= 0)) break;
				e += 1;
			}
			n.set(r, {
				name: r,
				params: i,
				body: o
			});
			continue;
		}
		r.push(i);
	}
	let a = [], o = 0, s = (e) => {
		if (o += 1, o > i) throw Error(`Macro expansion exceeded ${i} lines (possible infinite recursion).`);
		a.push(e);
	}, c = (e, t, r) => {
		let i = x(e).trim();
		if (!i) return;
		if (t > 64) {
			let e = r.join(" -> ");
			throw Error(`Macro recursion depth exceeded (64).${e ? ` Call chain: ${e}` : ""}`);
		}
		let a = i.match(/^if\s*\((.*)\)\s*$/i);
		if (a) {
			let e = v(a[1] ?? "");
			if (e.length !== 3) throw Error("if(expr, then, else) expects exactly 3 arguments");
			let n = (e[0] ?? "").trim(), i = (e[1] ?? "").trim(), o = (e[2] ?? "").trim(), s = p(T(n) === 0 ? o : i);
			c(s, t + 1, [...r, "if"]);
			return;
		}
		let o = i.match(/^call\s+([a-z_]\w*)\s*\((.*)\)\s*$/i);
		if (o) {
			let e = (o[1] ?? "").toLowerCase(), i = v(o[2] ?? ""), a = n.get(e);
			if (!a) throw Error(`Unknown macro: ${e}`);
			if (i.length !== a.params.length) throw Error(`Macro ${e} expects ${a.params.length} args, got ${i.length}`);
			let s = /* @__PURE__ */ new Map();
			a.params.forEach((e, t) => s.set(e, i[t] ?? ""));
			for (let n of a.body) {
				let i = y(n, s);
				c(i, t + 1, [...r, e]);
			}
			return;
		}
		s(i);
	};
	for (let e of r) c(e, 0, []);
	return a.join("\n");
}
function p(e) {
	let t = e.trim();
	if (t.length >= 2) {
		let e = t[0], n = t[t.length - 1];
		if (e === "\"" && n === "\"" || e === "'" && n === "'") return t.slice(1, -1);
	}
	return t;
}
function m(e) {
	return h(e.split(/\r?\n/), 0).lines.join("\n");
}
function h(e, t) {
	let n = [], r = t;
	for (; r < e.length;) {
		let t = x(e[r] ?? "").trim();
		if (t === "}") return {
			lines: n,
			nextIndex: r + 1
		};
		if (!t) {
			r += 1;
			continue;
		}
		let i = t.match(/^repeat\s*\(\s*(.+?)\s*,\s*(.+)\)\s*$/i);
		if (i) {
			let e = C(i[1] ?? "", "repeat"), t = (i[2] ?? "").trim();
			if (!Number.isInteger(e) || e < 0) throw Error("repeat count must be a non-negative integer");
			if (!t) throw Error("repeat(n, cmd) requires a command");
			for (let r = 0; r < e; r += 1) n.push(t);
			r += 1;
			continue;
		}
		let a = t.match(/^repeat\s*\(\s*(.+?)\s*\)\s*\{\s*$/i);
		if (a) {
			let t = C(a[1] ?? "", "repeat");
			if (!Number.isInteger(t) || t < 0) throw Error("repeat count must be a non-negative integer");
			let i = h(e, r + 1);
			for (let e = 0; e < t; e += 1) n.push(...i.lines);
			r = i.nextIndex;
			continue;
		}
		n.push(t), r += 1;
	}
	return {
		lines: n,
		nextIndex: r
	};
}
function g(e) {
	return e.trim().split(/\s+/).filter(Boolean);
}
function _(e) {
	let t = {};
	for (let n of e) {
		let e = n.indexOf("=");
		e <= 0 || (t[n.slice(0, e).toLowerCase()] = n.slice(e + 1));
	}
	return t;
}
function v(e) {
	let t = [], n = 0, r = "";
	for (let i = 0; i < e.length; i += 1) {
		let a = e[i] ?? "";
		if (a === "(" && (n += 1), a === ")" && (n = Math.max(0, n - 1)), a === "," && n === 0) {
			let e = r.trim();
			e && t.push(e), r = "";
			continue;
		}
		r += a;
	}
	let i = r.trim();
	return i && t.push(i), t;
}
function y(e, t) {
	let n = e;
	for (let [e, r] of t) n = n.replace(RegExp(`\\b${b(e)}\\b`, "g"), r);
	return n;
}
function b(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function x(e) {
	let t = e.indexOf("#");
	return t >= 0 ? e.slice(0, t) : e;
}
function S(e) {
	if (e !== void 0) return T(e);
}
function C(e, t) {
	if (e === void 0 || e.trim() === "") throw Error(`Missing numeric arg for ${t}`);
	return T(e);
}
function w(e, t) {
	let n = e.trim().toLowerCase();
	if (n === "true" || n === "1" || n === "yes") return !0;
	if (n === "false" || n === "0" || n === "no") return !1;
	throw Error(`Invalid boolean for ${t}: ${e}`);
}
function T(e) {
	let t = e.replace(/\s+/g, "");
	if (!t) throw Error("Empty numeric expression");
	if (!/^[0-9+\-*/().]+$/.test(t)) throw Error(`Invalid characters in numeric expression: "${e}"`);
	let n = E(t), r = 0, i = () => {
		let e = a();
		for (; r < n.length && (n[r] === "+" || n[r] === "-");) {
			let t = n[r];
			if (t === void 0) break;
			r += 1;
			let i = a();
			e = t === "+" ? e + i : e - i;
		}
		return e;
	}, a = () => {
		let t = o();
		for (; r < n.length && (n[r] === "*" || n[r] === "/");) {
			let i = n[r];
			if (i === void 0) break;
			r += 1;
			let a = o();
			if (i === "*") t *= a;
			else {
				if (a === 0) throw Error(`Division by zero in expression: "${e}"`);
				t /= a;
			}
		}
		return t;
	}, o = () => {
		let t = n[r];
		if (t === void 0) throw Error(`Unexpected end of expression: "${e}"`);
		if (t === "+") return r += 1, o();
		if (t === "-") return r += 1, -o();
		if (t === "(") {
			r += 1;
			let t = i();
			if (n[r] !== ")") throw Error(`Missing closing parenthesis in expression: "${e}"`);
			return r += 1, t;
		}
		if (O(t)) {
			r += 1;
			let n = Number(t);
			if (!Number.isFinite(n)) throw Error(`Invalid number in expression: "${e}"`);
			return n;
		}
		throw Error(`Unexpected token "${t}" in expression: "${e}"`);
	}, s = i();
	if (r !== n.length) throw Error(`Unexpected token "${n[r] ?? ""}" in expression: "${e}"`);
	if (!Number.isFinite(s)) throw Error(`Invalid numeric result for expression: "${e}"`);
	return s;
}
function E(e) {
	let t = [], n = 0;
	for (; n < e.length;) {
		let r = e[n];
		if (r === void 0) throw Error(`Unexpected end while tokenizing expression "${e}"`);
		if ("+-*/()".includes(r)) {
			t.push(r), n += 1;
			continue;
		}
		if (D(r) || r === ".") {
			let r = n + 1;
			for (; r < e.length;) {
				let t = e[r];
				if (t === void 0 || !D(t) && t !== ".") break;
				r += 1;
			}
			let i = e.slice(n, r);
			if (!/^\d*\.?\d+$/.test(i)) throw Error(`Invalid number token "${i}" in expression "${e}"`);
			t.push(i), n = r;
			continue;
		}
		throw Error(`Invalid token "${r}" in expression "${e}"`);
	}
	return t;
}
function D(e) {
	return e >= "0" && e <= "9";
}
function O(e) {
	return /^\d*\.?\d+$/.test(e);
}
function k(e) {
	return e * Math.PI / 180;
}
function A(e, t, n) {
	return Math.max(t, Math.min(n, e));
}
function j(e) {
	if (e === void 0) return;
	let t = e.toLowerCase();
	if (t === "triangle" || t === "square" || t === "circle" || t === "arrow" || t === "turtle" || t === "rabbit" || t === "none") return t;
	throw Error(`Invalid shape: ${e}`);
}
//#endregion
//#region src/components/turtle/turtle.css?inline
var M = ".tp-turtle{display:block}.tp-turtle-toolbar{flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:8px;display:flex}.tp-turtle-toolbar button{font:inherit}.tp-turtle-figure{margin:0}.tp-turtle-figure figcaption{color:#4b5563;margin-block-start:.4rem;font-size:.92rem}.tp-turtle-viewport svg{max-width:100%;height:auto;display:block}.tp-turtle-error{color:#8a1c2c;background:#fff3f5;border:1px solid #f1b7bf;border-radius:6px;margin:0;padding:.9rem;overflow:auto}", N = "tp-turtle-styles";
function P(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
}
var F = class extends e {
	abortController = null;
	lastExpanded = "";
	lastWidth = 900;
	lastHeight = 420;
	lastBackground = "transparent";
	renderToken = 0;
	replayTimer = null;
	source = new t(this, { scriptTypes: ["tp/turtle"] });
	static get observedAttributes() {
		return [
			"src",
			"width",
			"height",
			"background",
			"label",
			"save-label",
			"replay-label",
			"download-name"
		];
	}
	connectedCallback() {
		super.connectedCallback(), this.classList.add("tp-turtle"), this.ensureGlobalStyle(N, M), this.source.observe(() => {
			this.render();
		}), this.render();
	}
	disconnectedCallback() {
		this.abortController?.abort(), this.stopReplay(), this.source.disconnect();
	}
	attributeChangedCallback() {
		this.isConnected && this.render();
	}
	async render() {
		let e = ++this.renderToken;
		this.stopReplay();
		try {
			let t = this.readNumberAttr("width", 900), n = this.readNumberAttr("height", 420), r = this.getAttribute("background") ?? "transparent", i = await this.readProgramSource();
			if (e !== this.renderToken) return;
			let a = l(i), o = u(a);
			if (e !== this.renderToken) return;
			this.lastExpanded = a, this.lastWidth = t, this.lastHeight = n, this.lastBackground = r;
			let s = this.renderSvgFromLines(o);
			if (e !== this.renderToken) return;
			this.renderWithToolbar(s);
		} catch (e) {
			let t = e instanceof Error ? e.message : String(e);
			this.innerHTML = `<pre class="tp-turtle-error" role="alert"><code>${P(t)}</code></pre>`;
		}
	}
	renderWithToolbar(e) {
		let t = this.getAttribute("label")?.trim() ?? "", n = t !== "";
		this.innerHTML = `
      <div class="tp-turtle-toolbar">
        <button type="button" data-action="replay">${P(this.getReplayLabel())}</button>
        <button type="button" data-action="save-svg">${P(this.getSaveLabel())}</button>
      </div>
      <figure class="tp-turtle-figure">
        <div class="tp-turtle-viewport" data-role="svg-host">${e}</div>
        ${n ? `<figcaption>${P(t)}</figcaption>` : ""}
      </figure>
    `, this.ensureResponsiveSvg(), this.querySelector("button[data-action=\"replay\"]")?.addEventListener("click", () => this.replayCurrentProgram()), this.querySelector("button[data-action=\"save-svg\"]")?.addEventListener("click", () => this.downloadCurrentSvg());
	}
	replayCurrentProgram() {
		this.stopReplay();
		let e = u(this.lastExpanded);
		if (e.length === 0) return;
		let t = this.querySelector("[data-role=\"svg-host\"]");
		if (t === null) return;
		let n = (e) => e.cmd === "forward" || e.cmd === "goto", r = (e) => Number.isFinite(e) ? Math.max(1, Math.min(10, Number(e))) : 6, i = (e, t, n, r) => Math.hypot(n - e, r - t), a = (e) => e * Math.PI / 180, o = (t) => {
			let o = [], s = t, c = 6, l = 0, u = 0, d = 0;
			for (let t of e) {
				if (!n(t)) {
					o.push(t), t.cmd === "turtle" ? (l = t.x ?? 0, u = t.y ?? 0, d = t.heading ?? 0, c = r(t.speed)) : t.cmd === "style" && t.speed !== void 0 ? c = r(t.speed) : t.cmd === "left" ? d -= t.value : t.cmd === "right" && (d += t.value);
					continue;
				}
				let e = 11 - c;
				if (t.cmd === "forward") {
					let n = a(d), r = l + Math.cos(n) * t.value, c = u + Math.sin(n) * t.value, f = Math.max(.001, i(l, u, r, c)) * e;
					if (s >= f) o.push(t), s -= f, l = r, u = c;
					else return o.push({
						...t,
						value: t.value * Math.max(0, Math.min(1, s / f))
					}), o;
				} else if (t.cmd === "goto") {
					let n = Math.max(.001, i(l, u, t.x, t.y)) * e;
					if (s >= n) o.push(t), s -= n, l = t.x, u = t.y;
					else {
						let e = Math.max(0, Math.min(1, s / n));
						return o.push({
							...t,
							x: l + (t.x - l) * e,
							y: u + (t.y - u) * e
						}), o;
					}
				}
			}
			return o;
		}, s = (() => {
			let t = 0, n = 6, o = 0, s = 0, c = 0;
			for (let l of e) {
				if (l.cmd === "turtle") {
					o = l.x ?? 0, s = l.y ?? 0, c = l.heading ?? 0, n = r(l.speed);
					continue;
				}
				if (l.cmd === "style" && l.speed !== void 0) {
					n = r(l.speed);
					continue;
				}
				if (l.cmd === "left") {
					c -= l.value;
					continue;
				}
				if (l.cmd === "right") {
					c += l.value;
					continue;
				}
				let e = 11 - n;
				if (l.cmd === "forward") {
					let n = a(c), r = o + Math.cos(n) * l.value, u = s + Math.sin(n) * l.value;
					t += Math.max(.001, i(o, s, r, u)) * e, o = r, s = u;
				} else l.cmd === "goto" && (t += Math.max(.001, i(o, s, l.x, l.y)) * e, o = l.x, s = l.y);
			}
			return t;
		})();
		if (s <= 0) {
			t.innerHTML = this.renderSvgFromLines(e), this.ensureResponsiveSvg();
			return;
		}
		let c = Math.min(3e4, Math.max(6e3, s * .9)), l = performance.now(), d = () => {
			let e = Math.max(0, Math.min(1, (performance.now() - l) / c)), n = o(s * e);
			if (t.innerHTML = this.renderSvgFromLines(n), this.ensureResponsiveSvg(), e >= 1) {
				this.stopReplay();
				return;
			}
			this.replayTimer = window.setTimeout(d, 16);
		};
		d();
	}
	downloadCurrentSvg() {
		this.stopReplay();
		let e = u(this.lastExpanded), t = this.renderSvgFromLines(e);
		t.startsWith("<?xml") || (t = `<?xml version="1.0" encoding="UTF-8"?>\n${t}`);
		let n = new Blob([t], { type: "image/svg+xml;charset=utf-8" }), r = URL.createObjectURL(n), i = document.createElement("a");
		i.href = r, i.download = this.getDownloadName(), document.body.append(i), i.click(), i.remove(), URL.revokeObjectURL(r);
	}
	stopReplay() {
		this.replayTimer !== null && (window.clearTimeout(this.replayTimer), this.replayTimer = null);
	}
	renderSvgFromLines(e) {
		return d(e, "static"), i.renderSceneSvg({
			width: this.lastWidth,
			height: this.lastHeight,
			background: this.lastBackground,
			padding: 20,
			linecap: "round",
			linejoin: "round"
		});
	}
	ensureResponsiveSvg() {
		let e = this.querySelector("svg");
		e instanceof SVGElement && (e.setAttribute("role", "img"), e.setAttribute("aria-label", this.getAttribute("label")?.trim() || "Turtle drawing"), e.style.display = "block", e.style.maxWidth = "100%", e.style.height = "auto");
	}
	getSaveLabel() {
		return this.getAttribute("save-label")?.trim() || "Save SVG";
	}
	getReplayLabel() {
		return this.getAttribute("replay-label")?.trim() || "Replay";
	}
	getDownloadName() {
		let e = this.getAttribute("download-name")?.trim() || "turtle.svg";
		return e.toLowerCase().endsWith(".svg") ? e : `${e}.svg`;
	}
	readProgramSource() {
		return (this.getAttribute("src") ?? "").trim() === "" ? this.source.read() : (this.abortController?.abort(), this.abortController = new AbortController(), this.source.read({ signal: this.abortController.signal }));
	}
	readNumberAttr(e, t) {
		let n = this.getAttribute(e);
		if (n === null) return t;
		let r = Number(n);
		return Number.isFinite(r) ? r : t;
	}
};
customElements.get("tp-turtle") || customElements.define("tp-turtle", F);
//#endregion
export { F as t };

