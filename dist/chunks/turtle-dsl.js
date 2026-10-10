//#region ../tp-markdown/dist/chunks/turtle-dsl.js
function e(e) {
	let t = [];
	for (let n of e) {
		let e = t[t.length - 1];
		!e || !i(e.style, n.style) ? t.push({
			style: n.style,
			entries: [n]
		}) : e.entries.push(n);
	}
	return t;
}
function t(e) {
	return e.reduce((e, t) => e + t.segment.length, 0);
}
var n = class n {
	static nextId = 1;
	static sceneEntries = [];
	static stylesById = /* @__PURE__ */ new Map();
	static headsById = /* @__PURE__ */ new Map();
	static clearScene() {
		n.sceneEntries = [], n.stylesById.clear(), n.headsById.clear(), n.nextId = 1;
	}
	static renderSceneSvg(i = {}) {
		let a = i.width ?? 900, s = i.height ?? 500, c = i.padding ?? 24, l = i.background ?? "transparent", u = i.linecap ?? "round", d = i.linejoin ?? "round";
		if (n.sceneEntries.length === 0 && n.headsById.size === 0) return `<svg xmlns="http://www.w3.org/2000/svg" width="${a}" height="${s}" viewBox="0 0 ${a} ${s}"></svg>`;
		let f = Infinity, p = Infinity, m = -Infinity, h = -Infinity;
		for (let e of n.sceneEntries) f = Math.min(f, e.segment.x1, e.segment.x2), p = Math.min(p, e.segment.y1, e.segment.y2), m = Math.max(m, e.segment.x1, e.segment.x2), h = Math.max(h, e.segment.y1, e.segment.y2);
		for (let e of n.headsById.values()) f = Math.min(f, e.x), p = Math.min(p, e.y), m = Math.max(m, e.x), h = Math.max(h, e.y);
		(!Number.isFinite(f) || !Number.isFinite(p) || !Number.isFinite(m) || !Number.isFinite(h)) && (f = -1, p = -1, m = 1, h = 1);
		let g = Math.max(1e-9, m - f), _ = Math.max(1e-9, h - p), v = Math.max(1, a - 2 * c), y = Math.max(1, s - 2 * c), b = Math.min(v / g, y / _), x = (f + m) / 2, S = (p + h) / 2, C = (e, t) => ({
			x: (e - x) * b + a / 2,
			y: (t - S) * b + s / 2
		}), w = /* @__PURE__ */ new Map();
		for (let e of n.sceneEntries) w.set(e.turtleId, (w.get(e.turtleId) ?? 0) + e.segment.length);
		let T = /* @__PURE__ */ new Map();
		for (let e of n.sceneEntries) {
			let t = C(e.segment.x1, e.segment.y1), n = C(e.segment.x2, e.segment.y2), r = `M ${t.x.toFixed(2)} ${t.y.toFixed(2)} L ${n.x.toFixed(2)} ${n.y.toFixed(2)}`, i = T.get(e.turtleId) ?? [];
			i.push(r), T.set(e.turtleId, i);
		}
		let E = /* @__PURE__ */ new Map(), D = [], O = [];
		for (let e of n.sceneEntries) {
			let t = e.style, n = C(e.segment.x1, e.segment.y1), r = C(e.segment.x2, e.segment.y2), i = `M ${n.x.toFixed(2)} ${n.y.toFixed(2)} L ${r.x.toFixed(2)} ${r.y.toFixed(2)}`, a = Math.max(1e-9, e.segment.length * b).toFixed(2);
			if (t.durationMs > 0) {
				let n = Math.max(1e-9, w.get(e.turtleId) ?? 1e-9), r = Math.max(1, Math.round(t.durationMs * e.segment.length / n)), s = E.get(e.turtleId) ?? 0, c = t.beginMs + s;
				E.set(e.turtleId, s + r);
				let l = (Math.max(0, c) / 1e3).toFixed(3), f = (Math.max(1, r) / 1e3).toFixed(3);
				D.push([
					`<path d="${i}" fill="none" stroke="${o(t.stroke)}" stroke-width="${t.strokeWidth}" stroke-linecap="${u}" stroke-linejoin="${d}" stroke-dasharray="${a}" stroke-dashoffset="${a}">`,
					`<animate attributeName="stroke-dashoffset" from="${a}" to="0" begin="${l}s" dur="${f}s" fill="freeze" />`,
					"</path>"
				].join(""));
			} else D.push(`<path d="${i}" fill="none" stroke="${o(t.stroke)}" stroke-width="${t.strokeWidth}" stroke-linecap="${u}" stroke-linejoin="${d}" />`);
		}
		for (let [i] of T.entries()) {
			let a = n.sceneEntries.filter((e) => e.turtleId === i);
			if (a.length === 0) continue;
			let o = e(a), s = Math.max(1e-9, t(a)), c = 0;
			for (let e of o) {
				let n = e.style, i = t(e.entries), a = Math.max(1, Math.round(n.durationMs * i / s)), o = n.beginMs + c;
				if (n.shape === "none" || n.durationMs <= 0) {
					c += a;
					continue;
				}
				let l = [];
				for (let t of e.entries) {
					let e = C(t.segment.x1, t.segment.y1), n = C(t.segment.x2, t.segment.y2);
					l.push(`M ${e.x.toFixed(2)} ${e.y.toFixed(2)} L ${n.x.toFixed(2)} ${n.y.toFixed(2)}`);
				}
				let u = r(n.shape, n.shapeSize, n.stroke, n.strokeWidth);
				if (u !== "") {
					let e = (Math.max(0, o) / 1e3).toFixed(3), t = (Math.max(1, a) / 1e3).toFixed(3);
					O.push([
						"<g opacity=\"0\">",
						`${u}`,
						`<set attributeName="opacity" to="1" begin="${e}s" dur="${t}s" fill="remove" />`,
						`<animateMotion begin="${e}s" dur="${t}s" fill="remove" rotate="auto" path="${l.join(" ")}" />`,
						"</g>"
					].join(""));
				}
				c += a;
			}
		}
		let k = new Set(n.sceneEntries.map((e) => e.turtleId)), A = [];
		for (let e of n.headsById.values()) {
			if (!k.has(e.turtleId)) continue;
			let t = n.stylesById.get(e.turtleId) ?? n.defaultStyle();
			if (t.shape === "none" || t.durationMs > 0) continue;
			let i = C(e.x, e.y), a = e.headingRad * 180 / Math.PI, o = r(t.shape, t.shapeSize, t.stroke, t.strokeWidth);
			o !== "" && A.push(`<g transform="translate(${i.x.toFixed(2)} ${i.y.toFixed(2)}) rotate(${a.toFixed(2)})">${o}</g>`);
		}
		return [
			`<svg xmlns="http://www.w3.org/2000/svg" width="${a}" height="${s}" viewBox="0 0 ${a} ${s}" role="img">`,
			`<rect width="100%" height="100%" fill="${o(l)}" />`,
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
	static cloneCurrentStyle(e) {
		return { ...n.stylesById.get(e) ?? n.defaultStyle() };
	}
	id;
	state;
	stack = [];
	constructor(e = {}) {
		this.id = n.nextId++, this.state = {
			x: e.x ?? 0,
			y: e.y ?? 0,
			headingRad: e.headingRad ?? 0
		}, n.stylesById.set(this.id, {
			...n.defaultStyle(),
			...e.style ?? {}
		}), n.headsById.set(this.id, {
			turtleId: this.id,
			x: this.state.x,
			y: this.state.y,
			headingRad: this.state.headingRad
		});
	}
	setStyle(e) {
		let t = n.stylesById.get(this.id) ?? n.defaultStyle();
		return n.stylesById.set(this.id, {
			...t,
			...e
		}), this;
	}
	forward(e, t = !0) {
		let r = this.state.x + Math.cos(this.state.headingRad) * e, i = this.state.y + Math.sin(this.state.headingRad) * e;
		return t && n.sceneEntries.push({
			turtleId: this.id,
			segment: {
				x1: this.state.x,
				y1: this.state.y,
				x2: r,
				y2: i,
				length: Math.hypot(r - this.state.x, i - this.state.y)
			},
			style: n.cloneCurrentStyle(this.id)
		}), this.state = {
			...this.state,
			x: r,
			y: i
		}, n.headsById.set(this.id, {
			turtleId: this.id,
			x: this.state.x,
			y: this.state.y,
			headingRad: this.state.headingRad
		}), this;
	}
	goto(e, t, r = !0) {
		r && n.sceneEntries.push({
			turtleId: this.id,
			segment: {
				x1: this.state.x,
				y1: this.state.y,
				x2: e,
				y2: t,
				length: Math.hypot(e - this.state.x, t - this.state.y)
			},
			style: n.cloneCurrentStyle(this.id)
		});
		let i = e - this.state.x, a = t - this.state.y, o = i === 0 && a === 0 ? this.state.headingRad : Math.atan2(a, i);
		return this.state = {
			...this.state,
			x: e,
			y: t,
			headingRad: o
		}, n.headsById.set(this.id, {
			turtleId: this.id,
			x: this.state.x,
			y: this.state.y,
			headingRad: this.state.headingRad
		}), this;
	}
	left(e) {
		return this.state = {
			...this.state,
			headingRad: this.state.headingRad + a(e)
		}, n.headsById.set(this.id, {
			turtleId: this.id,
			x: this.state.x,
			y: this.state.y,
			headingRad: this.state.headingRad
		}), this;
	}
	right(e) {
		return this.state = {
			...this.state,
			headingRad: this.state.headingRad - a(e)
		}, n.headsById.set(this.id, {
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
		let e = this.stack.pop();
		return e !== void 0 && (this.state = e, n.headsById.set(this.id, {
			turtleId: this.id,
			x: this.state.x,
			y: this.state.y,
			headingRad: this.state.headingRad
		})), this;
	}
};
function r(e, t, n, r) {
	let i = Math.max(4, t), a = o(n), s = Math.max(1, r * .8);
	switch (e) {
		case "none": return "";
		case "triangle": return `<polygon points="${i},0 ${-i * .8},${i * .6} ${-i * .8},${-i * .6}" fill="${a}" stroke="${a}" stroke-width="${s}" />`;
		case "square": return `<rect x="${-i * .7}" y="${-i * .7}" width="${i * 1.4}" height="${i * 1.4}" fill="${a}" stroke="${a}" stroke-width="${s}" />`;
		case "circle": return `<circle cx="0" cy="0" r="${i * .75}" fill="${a}" stroke="${a}" stroke-width="${s}" />`;
		case "arrow": return `<polygon points="${i},0 ${-i * .2},${i * .7} ${-i * .2},${i * .3} ${-i},${i * .3} ${-i},${-i * .3} ${-i * .2},${-i * .3} ${-i * .2},${-i * .7}" fill="${a}" stroke="${a}" stroke-width="${s}" />`;
		case "turtle": return [`<ellipse cx="${-i * .2}" cy="0" rx="${i * .75}" ry="${i * .55}" fill="${a}" stroke="${a}" stroke-width="${s}" />`, `<circle cx="${i * .75}" cy="0" r="${i * .22}" fill="${a}" stroke="${a}" stroke-width="${s}" />`].join("");
		case "rabbit": return [
			`<ellipse cx="0" cy="0" rx="${i * .55}" ry="${i * .42}" fill="${a}" stroke="${a}" stroke-width="${s}" />`,
			`<ellipse cx="${i * .15}" cy="${-i * .75}" rx="${i * .18}" ry="${i * .42}" fill="${a}" />`,
			`<ellipse cx="${-i * .15}" cy="${-i * .75}" rx="${i * .18}" ry="${i * .42}" fill="${a}" />`
		].join("");
	}
}
function i(e, t) {
	return e.stroke === t.stroke && e.strokeWidth === t.strokeWidth && e.durationMs === t.durationMs && e.beginMs === t.beginMs && e.shape === t.shape && e.shapeSize === t.shapeSize;
}
function a(e) {
	return e * Math.PI / 180;
}
function o(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
}
function s(e) {
	return f(u(e));
}
function c(e) {
	let t = [];
	for (let n of e.split(/\r?\n/)) {
		let e = y(n).trim();
		if (!e) continue;
		if (/^goto\s*\(/i.test(e)) {
			let n = e.match(/^goto\s*\((.*)\)\s*$/i);
			if (!n) throw Error("Invalid goto syntax. Expected: goto(x,y,draw)");
			let r = g(n[1] ?? "");
			if (r.length < 2 || r.length > 3) throw Error("Invalid goto args. Expected 2 or 3 args: goto(x,y,draw)");
			t.push({
				cmd: "goto",
				x: x(r[0], "goto x"),
				y: x(r[1], "goto y"),
				draw: r[2] === void 0 || S(r[2], "goto draw")
			});
			continue;
		}
		let [r = "", ...i] = e.split(/\s+/), a = r.toLowerCase();
		if (a === "turtle") {
			let n = e.match(/^turtle\s*\{([^}]*)\}\s*$/i), r = h(m(n ? n[1] ?? "" : i.join(" ")));
			t.push({
				cmd: "turtle",
				name: r.name,
				color: r.color,
				x: b(r.x),
				y: b(r.y),
				heading: b(r.heading),
				duration: b(r.duration),
				begin: b(r.begin),
				strokeWidth: b(r.strokewidth),
				shape: k(r.shape),
				shapeSize: b(r.shapesize),
				speed: b(r.speed)
			});
			continue;
		}
		if (a === "style" || a === "set") {
			let e = h(i);
			t.push({
				cmd: "style",
				color: e.color,
				strokeWidth: b(e.strokewidth),
				shape: k(e.shape),
				shapeSize: b(e.shapesize),
				duration: b(e.duration),
				begin: b(e.begin),
				speed: b(e.speed)
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
				value: x(i.join(" "), "forward"),
				draw: !0
			});
			continue;
		}
		if (a === "move") {
			t.push({
				cmd: "forward",
				value: x(i.join(" "), "move"),
				draw: !1
			});
			continue;
		}
		if (a === "left") {
			t.push({
				cmd: "left",
				value: x(i.join(" "), "left")
			});
			continue;
		}
		if (a === "right") {
			t.push({
				cmd: "right",
				value: x(i.join(" "), "right")
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
function l(e, t = "animated", r = 0) {
	n.clearScene();
	let i = new n({ style: {
		shape: "none",
		durationMs: 0
	} }), a = /* @__PURE__ */ new Map();
	for (let o of e) switch (o.cmd) {
		case "turtle": {
			let e = o.duration ?? 1200, s = o.speed, c = t === "animated", l = 11 - (s !== void 0 && Number.isFinite(s) && s > 0 ? O(s, 1, 10) : 6), u = new n({
				x: o.x ?? 0,
				y: o.y ?? 0,
				headingRad: D(o.heading ?? 0),
				style: {
					stroke: o.color && o.color.trim() !== "" ? o.color : "currentColor",
					durationMs: c ? Math.max(1, Math.round(e * l)) : 0,
					beginMs: c ? (o.begin ?? 0) + r : 0,
					strokeWidth: o.strokeWidth ?? 2,
					shape: o.shape ?? "triangle",
					shapeSize: o.shapeSize ?? 12
				}
			});
			i = u, o.name?.trim() && a.set(o.name, u);
			break;
		}
		case "style": {
			let e = {};
			if (o.color !== void 0 && (e.stroke = o.color), o.strokeWidth !== void 0 && (e.strokeWidth = o.strokeWidth), o.shape !== void 0 && (e.shape = o.shape), o.shapeSize !== void 0 && (e.shapeSize = o.shapeSize), o.begin !== void 0 && (e.beginMs = o.begin + r), o.duration !== void 0) if (t === "animated" && o.speed !== void 0 && Number.isFinite(o.speed) && o.speed > 0) {
				let t = O(o.speed, 1, 10);
				e.durationMs = Math.max(1, Math.round(o.duration * (11 - t)));
			} else e.durationMs = t === "animated" ? Math.max(0, Math.round(o.duration)) : 0;
			t === "static" && (e.durationMs = 0, e.beginMs = 0), i.setStyle(e);
			break;
		}
		case "use": {
			let e = a.get(o.name);
			if (!e) throw Error(`Unknown turtle name: ${o.name}`);
			i = e;
			break;
		}
		case "forward":
			i.forward(o.value, o.draw);
			break;
		case "left":
			i.left(o.value);
			break;
		case "right":
			i.right(o.value);
			break;
		case "goto":
			i.goto(o.x, o.y, o.draw);
			break;
		case "push":
			i.push();
			break;
		case "pop":
			i.pop();
			break;
	}
}
function u(e) {
	let t = e.split(/\r?\n/), n = /* @__PURE__ */ new Map(), r = [], i = 2e5;
	for (let e = 0; e < t.length; e += 1) {
		let i = y(t[e] ?? "").trim();
		if (!i) continue;
		let a = i.match(/^define\s+([a-z_]\w*)\s*\(([^)]*)\)\s*\{$/i);
		if (a) {
			let r = (a[1] ?? "").toLowerCase(), i = (a[2] ?? "").split(",").map((e) => e.trim()).filter(Boolean), o = [], s = 1;
			for (e += 1; e < t.length;) {
				let n = y(t[e] ?? "").trim(), r = (n.match(/\{/g) ?? []).length, i = (n.match(/\}/g) ?? []).length;
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
		let i = y(e).trim();
		if (!i) return;
		if (t > 64) {
			let e = r.join(" -> ");
			throw Error(`Macro recursion depth exceeded (64).${e ? ` Call chain: ${e}` : ""}`);
		}
		let a = i.match(/^if\s*\((.*)\)\s*$/i);
		if (a) {
			let e = g(a[1] ?? "");
			if (e.length !== 3) throw Error("if(expr, then, else) expects exactly 3 arguments");
			let n = (e[0] ?? "").trim(), i = (e[1] ?? "").trim(), o = (e[2] ?? "").trim(), s = d(C(n) === 0 ? o : i);
			c(s, t + 1, [...r, "if"]);
			return;
		}
		let o = i.match(/^call\s+([a-z_]\w*)\s*\((.*)\)\s*$/i);
		if (o) {
			let e = (o[1] ?? "").toLowerCase(), i = g(o[2] ?? ""), a = n.get(e);
			if (!a) throw Error(`Unknown macro: ${e}`);
			if (i.length !== a.params.length) throw Error(`Macro ${e} expects ${a.params.length} args, got ${i.length}`);
			let s = /* @__PURE__ */ new Map();
			a.params.forEach((e, t) => s.set(e, i[t] ?? ""));
			for (let n of a.body) {
				let i = _(n, s);
				c(i, t + 1, [...r, e]);
			}
			return;
		}
		s(i);
	};
	for (let e of r) c(e, 0, []);
	return a.join("\n");
}
function d(e) {
	let t = e.trim();
	if (t.length >= 2) {
		let e = t[0], n = t[t.length - 1];
		if (e === "\"" && n === "\"" || e === "'" && n === "'") return t.slice(1, -1);
	}
	return t;
}
function f(e) {
	return p(e.split(/\r?\n/), 0).lines.join("\n");
}
function p(e, t) {
	let n = [], r = t;
	for (; r < e.length;) {
		let t = y(e[r] ?? "").trim();
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
			let e = x(i[1] ?? "", "repeat"), t = (i[2] ?? "").trim();
			if (!Number.isInteger(e) || e < 0) throw Error("repeat count must be a non-negative integer");
			if (!t) throw Error("repeat(n, cmd) requires a command");
			for (let r = 0; r < e; r += 1) n.push(t);
			r += 1;
			continue;
		}
		let a = t.match(/^repeat\s*\(\s*(.+?)\s*\)\s*\{\s*$/i);
		if (a) {
			let t = x(a[1] ?? "", "repeat");
			if (!Number.isInteger(t) || t < 0) throw Error("repeat count must be a non-negative integer");
			let i = p(e, r + 1);
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
function m(e) {
	return e.trim().split(/\s+/).filter(Boolean);
}
function h(e) {
	let t = {};
	for (let n of e) {
		let e = n.indexOf("=");
		e <= 0 || (t[n.slice(0, e).toLowerCase()] = n.slice(e + 1));
	}
	return t;
}
function g(e) {
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
function _(e, t) {
	let n = e;
	for (let [e, r] of t) n = n.replace(RegExp(`\\b${v(e)}\\b`, "g"), r);
	return n;
}
function v(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function y(e) {
	let t = e.indexOf("#");
	return t >= 0 ? e.slice(0, t) : e;
}
function b(e) {
	if (e !== void 0) return C(e);
}
function x(e, t) {
	if (e === void 0 || e.trim() === "") throw Error(`Missing numeric arg for ${t}`);
	return C(e);
}
function S(e, t) {
	let n = e.trim().toLowerCase();
	if (n === "true" || n === "1" || n === "yes") return !0;
	if (n === "false" || n === "0" || n === "no") return !1;
	throw Error(`Invalid boolean for ${t}: ${e}`);
}
function C(e) {
	let t = e.replace(/\s+/g, "");
	if (!t) throw Error("Empty numeric expression");
	if (!/^[0-9+\-*/().]+$/.test(t)) throw Error(`Invalid characters in numeric expression: "${e}"`);
	let n = w(t), r = 0, i = () => {
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
		if (E(t)) {
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
function w(e) {
	let t = [], n = 0;
	for (; n < e.length;) {
		let r = e[n];
		if (r === void 0) throw Error(`Unexpected end while tokenizing expression "${e}"`);
		if ("+-*/()".includes(r)) {
			t.push(r), n += 1;
			continue;
		}
		if (T(r) || r === ".") {
			let r = n + 1;
			for (; r < e.length;) {
				let t = e[r];
				if (t === void 0 || !T(t) && t !== ".") break;
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
function T(e) {
	return e >= "0" && e <= "9";
}
function E(e) {
	return /^\d*\.?\d+$/.test(e);
}
function D(e) {
	return e * Math.PI / 180;
}
function O(e, t, n) {
	return Math.max(t, Math.min(n, e));
}
function k(e) {
	if (e === void 0) return;
	let t = e.toLowerCase();
	if (t === "triangle" || t === "square" || t === "circle" || t === "arrow" || t === "turtle" || t === "rabbit" || t === "none") return t;
	throw Error(`Invalid shape: ${e}`);
}
//#endregion
export { s as i, l as n, n as r, c as t };

//# sourceMappingURL=turtle-dsl.js.map