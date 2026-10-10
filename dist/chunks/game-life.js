import { Zu as e, ed as t } from "./lib/typescript/typescript.js";
//#region ../tp-utilities/dist/game-life/game-life.js
function n(e, t, n = 0) {
	if (!Number.isInteger(e) || e <= 0) throw Error(`Invalid width: ${e}`);
	if (!Number.isInteger(t) || t <= 0) throw Error(`Invalid height: ${t}`);
	return {
		width: e,
		height: t,
		cells: Array(e * t).fill(n)
	};
}
function r(e, t, n) {
	return t < 0 || n < 0 || t >= e.width || n >= e.height ? 0 : e.cells[n * e.width + t] ?? 0;
}
function i(e, t, n, r) {
	t < 0 || n < 0 || t >= e.width || n >= e.height || (e.cells[n * e.width + t] = r);
}
function a(e, t = {}) {
	let a = t.wrap === !0, o = n(e.width, e.height, 0), s = (t, n) => {
		if (!a) return r(e, t, n);
		let i = (t % e.width + e.width) % e.width, o = (n % e.height + e.height) % e.height;
		return e.cells[o * e.width + i] ?? 0;
	};
	for (let t = 0; t < e.height; t += 1) for (let n = 0; n < e.width; n += 1) {
		let e = 0;
		for (let r = -1; r <= 1; r += 1) for (let i = -1; i <= 1; i += 1) i === 0 && r === 0 || (e += s(n + i, t + r));
		let r = s(n, t) === 1 && e === 2 || e === 3;
		i(o, n, t, +!!r);
	}
	return o;
}
//#endregion
//#region ../tp-utilities/dist/game-life/game-life-dsl.js
function o(e) {
	return m(p(e));
}
function s(e) {
	let t = [], n = e.split(/\r?\n/);
	for (let e = 0; e < n.length; e += 1) {
		let r = y(n[e] ?? "").trim();
		if (!r) continue;
		let i = r.match(/^pattern\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)\s*\{$/i);
		if (i) {
			let r = b(i[1], "pattern x"), a = b(i[2], "pattern y"), o = [];
			for (e += 1; e < n.length;) {
				let t = y(n[e] ?? "").trim();
				if (t === "}") break;
				t !== "" && o.push(t), e += 1;
			}
			if (o.length === 0) throw Error("Empty pattern block");
			t.push({
				cmd: "pattern",
				x: r,
				y: a,
				rows: o
			});
			continue;
		}
		let [a = "", ...o] = r.split(/\s+/), s = a.toLowerCase();
		if (s === "grid") {
			let e = D(o), n = x(e.width, "grid width"), r = x(e.height, "grid height"), i = e.fill, a = i === void 0 ? void 0 : S(i, "grid fill");
			t.push({
				cmd: "grid",
				width: n,
				height: r,
				fill: a
			});
			continue;
		}
		if (s === "set") {
			let e = b(o[0], "set x"), n = b(o[1], "set y"), r = S(o[2], "set value");
			t.push({
				cmd: "set",
				x: e,
				y: n,
				value: r
			});
			continue;
		}
		if (s === "alive") {
			let e = b(o[0], "alive x"), n = b(o[1], "alive y");
			t.push({
				cmd: "alive",
				x: e,
				y: n
			});
			continue;
		}
		if (s === "dead") {
			let e = b(o[0], "dead x"), n = b(o[1], "dead y");
			t.push({
				cmd: "dead",
				x: e,
				y: n
			});
			continue;
		}
		if (s === "row") {
			let e = r.match(/^row\s+(\S+)\s+(\S+)\s+(.+)$/i), n = r.match(/^row\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)\s+(.+)$/i), i = e ?? n;
			if (!i) throw Error(`Invalid row syntax. Expected: row <x> <y> <pattern>. Got: "${r}"`);
			let a = b(i[1], "row x"), o = b(i[2], "row y"), s = (i[3] ?? "").trim();
			if (!s) throw Error(`Missing row pattern in: "${r}"`);
			t.push({
				cmd: "row",
				x: a,
				y: o,
				pattern: s
			});
			continue;
		}
		throw Error(`Unknown game-life command: ${s}`);
	}
	return t;
}
function c(e) {
	let t = null;
	for (let r of e) {
		if (r.cmd === "grid") {
			t = n(r.width, r.height, r.fill ?? 0);
			continue;
		}
		if (t === null) throw Error("Program must start with \"grid width=... height=...\"");
		if (r.cmd === "set") {
			i(t, r.x, r.y, r.value);
			continue;
		}
		if (r.cmd === "alive") {
			i(t, r.x, r.y, 1);
			continue;
		}
		if (r.cmd === "dead") {
			i(t, r.x, r.y, 0);
			continue;
		}
		if (r.cmd === "row") {
			l(t, r.x, r.y, r.pattern);
			continue;
		}
		r.cmd === "pattern" && u(t, r.x, r.y, r.rows);
	}
	if (t === null) throw Error("Missing grid declaration");
	return t;
}
function l(e, t, n, r) {
	for (let i = 0; i < r.length; i += 1) {
		let a = r.charAt(i);
		if (a === " " || a === "	") continue;
		let o = f(a);
		d(e, t + i, n, o);
	}
}
function u(e, t, n, r) {
	for (let i = 0; i < r.length; i += 1) {
		let a = r[i];
		a !== void 0 && l(e, t, n + i, a);
	}
}
function d(e, t, n, r) {
	t < 0 || n < 0 || t >= e.width || n >= e.height || (e.cells[n * e.width + t] = r);
}
function f(e) {
	if (e === "*" || e === "O" || e === "o" || e === "X" || e === "x" || e === "1") return 1;
	if (e === "." || e === "0" || e === "_" || e === "-") return 0;
	throw Error(`Invalid pattern cell character: "${e}"`);
}
function p(e) {
	let t = e.split(/\r?\n/), n = /* @__PURE__ */ new Map(), r = [];
	for (let e = 0; e < t.length; e += 1) {
		let i = y(t[e] ?? "").trim();
		if (!i) continue;
		let a = i.match(/^define\s+([a-z_]\w*)\s*\(([^)]*)\)\s*\{$/i);
		if (a) {
			let r = (a[1] ?? "").toLowerCase(), i = (a[2] ?? "").split(",").map((e) => e.trim()).filter(Boolean), o = [], s = 1;
			for (e += 1; e < t.length;) {
				let n = y(t[e] ?? "").trim(), r = (n.match(/\{/g) ?? []).length, i = (n.match(/\}/g) ?? []).length;
				if (s === 1 && n === "}" || (n !== "" && o.push(n), s += r - i, s <= 0)) break;
				e += 1;
			}
			n.set(r, {
				name: r,
				params: i,
				body: o
			});
			continue;
		}
		let o = i.match(/^call\s+([a-z_]\w*)\s*\((.*)\)\s*$/i);
		if (o) {
			let e = (o[1] ?? "").toLowerCase(), t = g(o[2] ?? ""), i = n.get(e);
			if (!i) throw Error(`Unknown macro: ${e}`);
			if (t.length !== i.params.length) throw Error(`Macro ${e} expects ${i.params.length} args, got ${t.length}`);
			let a = /* @__PURE__ */ new Map();
			i.params.forEach((e, n) => {
				a.set(e, t[n] ?? "");
			});
			for (let e of i.body) r.push(_(e, a));
			continue;
		}
		r.push(i);
	}
	return r.join("\n");
}
function m(e) {
	return h(e.split(/\r?\n/), 0).lines.join("\n");
}
function h(e, t) {
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
			let e = b(i[1], "repeat"), t = (i[2] ?? "").trim();
			if (e < 0) throw Error("repeat count must be >= 0");
			if (!t) throw Error("repeat(n, cmd) requires a command");
			for (let r = 0; r < e; r += 1) n.push(t);
			r += 1;
			continue;
		}
		let a = t.match(/^repeat\s*\(\s*(.+?)\s*\)\s*\{\s*$/i);
		if (a) {
			let t = b(a[1], "repeat");
			if (t < 0) throw Error("repeat count must be >= 0");
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
	let t = [], n = 0, r = "";
	for (let i = 0; i < e.length; i += 1) {
		let a = e[i] ?? "";
		if (a === "(") {
			n += 1, r += a;
			continue;
		}
		if (a === ")") {
			n = Math.max(0, n - 1), r += a;
			continue;
		}
		if (a === "," && n === 0) {
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
	let t = 0;
	for (; t < e.length && (e[t] === " " || e[t] === "	");) t += 1;
	if (t < e.length && e[t] === "#") return "";
	for (let t = 1; t < e.length; t += 1) {
		if (e[t] !== "#") continue;
		let n = e[t - 1], r = t + 1 < e.length ? e[t + 1] : "";
		if ((n === " " || n === "	") && (r === "" || r === " " || r === "	")) return e.slice(0, t).trimEnd();
	}
	return e;
}
function b(e, t) {
	if (e === void 0 || e.trim() === "") throw Error(`Missing numeric arg for ${t}`);
	let n = C(e);
	if (!Number.isInteger(n)) throw Error(`Expected integer for ${t}, got: ${e}`);
	return n;
}
function x(e, t) {
	if (e === void 0 || e.trim() === "") throw Error(`Missing integer for ${t}`);
	let n = Number(e);
	if (!Number.isInteger(n)) throw Error(`Invalid integer for ${t}: ${e}`);
	return n;
}
function S(e, t) {
	if (e === void 0) throw Error(`Missing cell value for ${t}`);
	let n = e.trim().toLowerCase();
	if (n === "1" || n === "true" || n === "alive" || n === "on") return 1;
	if (n === "0" || n === "false" || n === "dead" || n === "off") return 0;
	throw Error(`Invalid cell value for ${t}: ${e}`);
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
	let t = {};
	for (let n of e) {
		let e = n.indexOf("=");
		e <= 0 || (t[n.slice(0, e).toLowerCase()] = n.slice(e + 1));
	}
	return t;
}
//#endregion
//#region ../tp-utilities/dist/game-life/game-life-svg.js
function O(e, t = {}) {
	let n = P(t.cellSize, 16), r = F(t.padding, 0), i = t.background ?? "transparent", a = t.aliveColor ?? "#111", o = t.deadColor ?? "#fff", s = t.drawDeadCells === !0, c = t.gridColor, l = P(t.gridStrokeWidth, 1), u = F(t.cellRadius, 0), d = t.includeXmlHeader === !0;
	A(e);
	let f = e.width * n, p = e.height * n, m = f + r * 2, h = p + r * 2, g = [];
	i !== "transparent" && g.push(`<rect x="0" y="0" width="${M(m)}" height="${M(h)}" fill="${N(i)}" />`);
	for (let t = 0; t < e.height; t += 1) for (let i = 0; i < e.width; i += 1) {
		let c = j(e, i, t) === 1;
		if (!c && !s) continue;
		let l = r + i * n, d = r + t * n, f = c ? a : o;
		g.push(`<rect x="${M(l)}" y="${M(d)}" width="${M(n)}" height="${M(n)}" rx="${M(u)}" ry="${M(u)}" fill="${N(f)}" />`);
	}
	if (c !== void 0 && c.trim() !== "") {
		let t = r, i = r, a = r + f, o = r + p, s = N(c);
		for (let r = 0; r <= e.width; r += 1) {
			let e = t + r * n;
			g.push(`<line x1="${M(e)}" y1="${M(i)}" x2="${M(e)}" y2="${M(o)}" stroke="${s}" stroke-width="${M(l)}" />`);
		}
		for (let r = 0; r <= e.height; r += 1) {
			let e = i + r * n;
			g.push(`<line x1="${M(t)}" y1="${M(e)}" x2="${M(a)}" y2="${M(e)}" stroke="${s}" stroke-width="${M(l)}" />`);
		}
	}
	let _ = [
		`<svg xmlns="http://www.w3.org/2000/svg" width="${M(m)}" height="${M(h)}" viewBox="0 0 ${M(m)} ${M(h)}" role="img" aria-label="Game of Life grid">`,
		...g,
		"</svg>"
	].join("");
	return d ? `<?xml version="1.0" encoding="UTF-8"?>\n${_}` : _;
}
function k(e, t = {}) {
	let n = O(e, t);
	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(n)}`;
}
function A(e) {
	if (!Number.isInteger(e.width) || e.width <= 0) throw Error(`Invalid grid width: ${e.width}`);
	if (!Number.isInteger(e.height) || e.height <= 0) throw Error(`Invalid grid height: ${e.height}`);
	let t = e.width * e.height;
	if (e.cells.length !== t) throw Error(`Invalid grid.cells length: expected ${t}, got ${e.cells.length}`);
}
function j(e, t, n) {
	return +(e.cells[n * e.width + t] === 1);
}
function M(e) {
	return Number.isInteger(e) ? String(e) : e.toFixed(3).replace(/\.?0+$/, "");
}
function N(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
}
function P(e, t) {
	return e === void 0 || !Number.isFinite(e) || e <= 0 ? t : e;
}
function F(e, t) {
	return e === void 0 || !Number.isFinite(e) || e < 0 ? t : e;
}
//#endregion
//#region src/components/game-life/game-life.css?inline
var I = ":where(tp-game-life){inline-size:fit-content;display:block}:where(tp-game-life .tp-game-life-container){border:1px solid color-mix(in srgb, currentColor 20%, transparent);background:color-mix(in srgb, Canvas 94%, currentColor 6%);border-radius:.5rem;gap:.5rem;padding:.75rem;display:grid}:where(tp-game-life .tp-game-life-label){font-weight:600}:where(tp-game-life .tp-game-life-title){opacity:.9;font-size:.9rem;font-weight:600}:where(tp-game-life .tp-game-life-toolbar){flex-wrap:wrap;align-items:center;gap:.5rem;display:flex}:where(tp-game-life .tp-game-life-toolbar tp-button-group){--tp-button-group-gap:.4rem}:where(tp-game-life .tp-game-life-svg){display:block}:where(tp-game-life .tp-game-life-error){color:#b00020;white-space:pre-wrap}", L = {
	glider: {
		width: 20,
		height: 12,
		x: 1,
		y: 1,
		rows: [
			".*.",
			"..*",
			"***"
		]
	},
	blinker: {
		width: 15,
		height: 9,
		x: 6,
		y: 4,
		rows: ["***"]
	},
	toad: {
		width: 18,
		height: 10,
		x: 6,
		y: 4,
		rows: [".***", "***."]
	},
	beacon: {
		width: 18,
		height: 10,
		x: 6,
		y: 3,
		rows: [
			"**..",
			"**..",
			"..**",
			"..**"
		]
	},
	"gosper-gun": {
		width: 90,
		height: 40,
		x: 1,
		y: 1,
		rows: [
			"........................*...........",
			"......................*.*...........",
			"............**......**............**",
			"...........*...*....**............**",
			"**........*.....*...**..............",
			"**........*...*.**....*.*...........",
			"..........*.....*.......*...........",
			"...........*...*....................",
			"............**......................"
		]
	}
};
function R(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
}
var z = class n extends e {
	static gameLifeStyleId = "tp-game-life-styles";
	currentGrid = null;
	renderToken = 0;
	autoplayTimer = null;
	static get observedAttributes() {
		return [
			"cell-size",
			"padding",
			"background",
			"alive-color",
			"dead-color",
			"grid-color",
			"grid-stroke-width",
			"cell-radius",
			"steps",
			"interval",
			"label",
			"wrap",
			"autoplay",
			"preset",
			"preset-x",
			"preset-y",
			"preset-width",
			"preset-height"
		];
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(n.gameLifeStyleId, I), this.render();
	}
	disconnectedCallback() {
		this.stopAutoplay();
	}
	attributeChangedCallback() {
		this.isConnected && this.render();
	}
	hasBoolAttr(e) {
		return this.hasAttribute(e);
	}
	readIntAttr(e, t) {
		let n = this.getAttribute(e);
		if (n === null || n.trim() === "") return t;
		let r = Number(n);
		return !Number.isFinite(r) || !Number.isInteger(r) ? t : r;
	}
	readPositiveIntAttr(e, t) {
		let n = this.readIntAttr(e, t);
		return n > 0 ? n : t;
	}
	readNumberAttr(e, t) {
		let n = this.getAttribute(e);
		if (n === null || n.trim() === "") return t;
		let r = Number(n);
		return Number.isFinite(r) ? r : t;
	}
	readStringAttr(e, t = "") {
		return this.getAttribute(e) ?? t;
	}
	getPresetName() {
		let e = this.getAttribute("preset");
		if (!e) return null;
		let t = e.trim().toLowerCase();
		return t === "glider" || t === "blinker" || t === "toad" || t === "beacon" || t === "gosper-gun" ? t : null;
	}
	buildPresetProgram() {
		let e = this.getPresetName();
		if (!e) throw Error(`Unknown or missing preset. Expected one of: ${Object.keys(L).join(", ")}`);
		let t = L[e], n = this.readPositiveIntAttr("preset-width", t.width), r = this.readPositiveIntAttr("preset-height", t.height), i = this.readIntAttr("preset-x", t.x), a = this.readIntAttr("preset-y", t.y), o = t.rows.map((e) => `      ${e}`).join("\n");
		return [
			`grid width=${n} height=${r}`,
			`pattern(${i},${a}) {`,
			o,
			"}"
		].join("\n");
	}
	async readProgramSource() {
		let e = this.querySelector("script[type=\"tp/game-life\"]");
		if (e?.textContent && e.textContent.trim() !== "") return t(e.textContent);
		if (this.getPresetName()) return this.buildPresetProgram();
		throw Error("Missing program source. Provide <script type=\"tp/game-life\">...<\/script> or a valid preset attribute.");
	}
	readSvgOptions() {
		let e = this.getAttribute("grid-color") ?? "color-mix(in srgb, currentColor 24%, transparent)";
		return {
			cellSize: Math.max(1, this.readNumberAttr("cell-size", 16)),
			padding: Math.max(0, this.readNumberAttr("padding", 0)),
			background: this.getAttribute("background") ?? void 0,
			aliveColor: this.getAttribute("alive-color") ?? void 0,
			deadColor: this.getAttribute("dead-color") ?? void 0,
			gridColor: e,
			gridStrokeWidth: Math.max(.1, this.readNumberAttr("grid-stroke-width", 1)),
			cellRadius: Math.max(0, this.readNumberAttr("cell-radius", 0)),
			includeXmlHeader: !1
		};
	}
	renderWithToolbar() {
		if (!this.currentGrid) return;
		let e = this.readStringAttr("label", "").trim(), t = this.readSvgOptions(), n = O(this.currentGrid, t), r = k(this.currentGrid, t), i = this.autoplayTimer === null ? "Play" : "Pause";
		this.innerHTML = `
      <div class="tp-game-life-container">
        ${e ? `<div class="tp-game-life-label">${R(e)}</div>` : ""}
        <div class="tp-game-life-toolbar">
          <span class="tp-game-life-title">Game of life</span>
          <tp-button-group attached>
            <tp-button data-action="step" variant="neutral" size="s">Step</tp-button>
            <tp-button data-action="play" variant="brand" size="s">${i}</tp-button>
            <tp-button data-action="reset" variant="neutral" outlined size="s">Reset</tp-button>
            <tp-button
              data-action="download"
              href="${R(r)}"
              download="game-life.svg"
              variant="info"
              outlined
              size="s"
            >
              Download SVG
            </tp-button>
          </tp-button-group>
        </div>
        <div data-role="svg" class="tp-game-life-svg">${n}</div>
      </div>
    `, this.querySelector("tp-button[data-action=\"step\"]")?.addEventListener("click", () => {
			this.stepOnce();
		}), this.querySelector("tp-button[data-action=\"play\"]")?.addEventListener("click", () => {
			this.autoplayTimer === null ? this.startAutoplay() : this.stopAutoplay(), this.renderWithToolbar();
		}), this.querySelector("tp-button[data-action=\"reset\"]")?.addEventListener("click", () => {
			this.render();
		});
	}
	stepOnce() {
		this.currentGrid && (this.currentGrid = a(this.currentGrid, { wrap: this.hasBoolAttr("wrap") }), this.renderWithToolbar());
	}
	startAutoplay() {
		this.stopAutoplay();
		let e = Math.max(16, this.readIntAttr("interval", 250));
		this.autoplayTimer = window.setInterval(() => this.stepOnce(), e);
	}
	stopAutoplay() {
		this.autoplayTimer !== null && (window.clearInterval(this.autoplayTimer), this.autoplayTimer = null);
	}
	async render() {
		let e = ++this.renderToken;
		try {
			let t = await this.readProgramSource();
			if (e !== this.renderToken) return;
			let n = s(o(t));
			if (e !== this.renderToken) return;
			let r = c(n), i = this.hasBoolAttr("wrap"), l = this.readIntAttr("steps", 0), u = r;
			for (let e = 0; e < l; e += 1) u = a(u, { wrap: i });
			if (this.currentGrid = u, this.renderWithToolbar(), e !== this.renderToken) return;
			this.hasBoolAttr("autoplay") ? this.startAutoplay() : this.stopAutoplay(), this.renderWithToolbar();
		} catch (e) {
			this.stopAutoplay();
			let t = e instanceof Error ? e.message : String(e);
			this.currentGrid = null, this.innerHTML = `<pre class="tp-game-life-error">tp-game-life error: ${R(t)}</pre>`;
		}
	}
};
customElements.get("tp-game-life") || customElements.define("tp-game-life", z);
//#endregion
export { z as t };

//# sourceMappingURL=game-life.js.map