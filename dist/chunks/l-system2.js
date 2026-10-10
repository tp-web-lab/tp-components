//#region ../tp-markdown/dist/markdown/renderers/l-system.js
var e = /[A-Za-z_][A-Za-z0-9_]*/g;
function t(e) {
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
			let { content: r, nextIndex: a } = o(e, n), l = s(r).map((e) => d(c(e, {}))), u = `${i}(${r})`;
			t.push({
				symbol: i,
				args: l,
				raw: u
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
function n(e, t) {
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
function r(e, t) {
	return e === void 0 || e.trim() === "" || !!c(e, t);
}
function i(e, t) {
	return e.replace(/([^\s(),])\(([^()]*)\)/g, (e, n, r) => `${n}(${s(r).map((e) => d(c(e, t))).map(f).join(",")})`);
}
function a(e) {
	return e.args === void 0 ? e.symbol : `${e.symbol}(${e.args.map(f).join(",")})`;
}
function o(e, t) {
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
function s(e) {
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
function c(e, t) {
	let n = e.trim();
	if (n === "") throw Error("Empty expression.");
	l(n), u(n, t);
	let r = Object.keys(t), i = r.map((e) => t[e] ?? 0);
	return Function(...r, `return (${n});`)(...i);
}
function l(e) {
	if (!/^[0-9A-Za-z_+\-*/%().,<>=!&| \t\r\n]+$/.test(e)) throw Error(`Unsupported characters in expression: ${e}`);
}
function u(t, n) {
	let r = new Set(Object.keys(n));
	r.add("true"), r.add("false");
	let i = t.match(e) ?? [];
	for (let e of i) if (!r.has(e)) throw Error(`Unknown identifier in expression: ${e}`);
}
function d(e) {
	let t = typeof e == "boolean" ? Number(e) : e;
	if (!Number.isFinite(t)) throw Error(`Expression did not evaluate to a finite number: ${String(e)}`);
	return t;
}
function f(e) {
	return String(Number.isInteger(e) ? e : Number(e.toFixed(6)));
}
function p(e) {
	let t = e.axiom;
	for (let n = 0; n < e.iterations; n += 1) if (t = m(t, e), t.length > 2e5) throw Error(`Expanded sentence too large at iteration ${n + 1} (${t.length} chars)`);
	return {
		sentence: t,
		iterations: e.iterations,
		axiom: e.axiom
	};
}
function m(e, n) {
	let r = t(e), i = _((n.seed ?? 0) + e.length), o = "";
	for (let e of r) {
		let t = h(e, n.rulesV2 ?? [], i);
		if (t !== null) {
			o += t;
			continue;
		}
		if (e.args === void 0) {
			let t = n.rules.get(e.symbol);
			if (t !== void 0) {
				o += t;
				continue;
			}
		}
		o += a(e);
	}
	return o;
}
function h(e, t, a) {
	let o = t.filter((t) => {
		let i = n(t, e);
		return i !== null && r(t.condition, i);
	})[0];
	if (o === void 0) return null;
	let s = n(o, e);
	return s === null ? null : i(g(o.branches, a), s);
}
function g(e, t) {
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
function _(e) {
	let t = e >>> 0;
	return () => {
		t += 1831565813;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
function v(e, t) {
	let n = new Set(t.drawSymbols ?? ["F", "G"]), r = new Set(t.moveSymbols ?? ["M"]), i = w(t.angleDeg), a = [], o = [], s = {
		x: 0,
		y: 0,
		headingRad: S(t.orientation)
	}, c = T(s.x, s.y), l = y(e);
	for (let e of l) {
		let l = e.symbol, u = e.args[0];
		if (n.has(l)) {
			let e = u !== void 0 && Number.isFinite(u) ? u : t.step, n = C(s, e);
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
			s = C(s, e), c.include(s.x, s.y);
			continue;
		}
		if (l === "+") {
			let e = u !== void 0 && Number.isFinite(u) ? w(u) : i;
			s = {
				...s,
				headingRad: s.headingRad + e
			};
			continue;
		}
		if (l === "-") {
			let e = u !== void 0 && Number.isFinite(u) ? w(u) : i;
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
function y(e) {
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
			let r = b(e, n);
			n = r.nextIndex;
			let a = x(r.content).map((e) => Number(e.trim())).filter((e) => Number.isFinite(e));
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
function b(e, t) {
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
function x(e) {
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
function S(e) {
	switch (e) {
		case "north": return -Math.PI / 2;
		case "west": return Math.PI;
		case "south": return Math.PI / 2;
		default: return 0;
	}
}
function C(e, t) {
	return {
		x: e.x + Math.cos(e.headingRad) * t,
		y: e.y + Math.sin(e.headingRad) * t,
		headingRad: e.headingRad
	};
}
function w(e) {
	return e * Math.PI / 180;
}
function T(e, t) {
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
function E(e, t = {}) {
	let n = t.width ?? 800, r = t.height ?? 500, i = t.padding ?? 16, a = t.stroke ?? "currentColor", o = t.strokeWidth ?? 1.5, s = t.fill ?? "none", c = t.linecap ?? "round", l = t.linejoin ?? "round", u = t.mode ?? "path", d = t.title?.trim() ?? "", f = (t.ariaLabel?.trim() ?? d) || "L-system diagram", { bounds: p } = e, m = Math.max(1, p.width), h = Math.max(1, p.height), g = Math.min((n - 2 * i) / m, (r - 2 * i) / h), _ = i - p.minX * g + (n - 2 * i - m * g) / 2, v = i - p.minY * g + (r - 2 * i - h * g) / 2, y = u === "polyline" ? O(e, g, _, v) : D(e, g, _, v), b = t.className ? ` class="${A(t.className)}"` : "", x = d === "" ? "" : `  <title>${A(d)}</title>\n`;
	return [
		`<svg${b} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${r}" role="img" aria-label="${A(f)}">`,
		`${x}  <g fill="${s}" stroke="${A(a)}" stroke-width="${o}"`,
		`     stroke-linecap="${c}" stroke-linejoin="${l}">`,
		`    ${y}`,
		"  </g>",
		"</svg>"
	].join("\n");
}
function D(e, t, n, r) {
	return e.segments.length === 0 ? "<path d=\"\" />" : `<path d="${e.segments.map((e) => {
		let i = e.x1 * t + n, a = e.y1 * t + r, o = e.x2 * t + n, s = e.y2 * t + r;
		return `M ${k(i)} ${k(a)} L ${k(o)} ${k(s)}`;
	}).join(" ")}" />`;
}
function O(e, t, n, r) {
	return e.segments.length === 0 ? "<polyline points=\"\" />" : `<polyline points="${e.segments.flatMap((e) => [`${k(e.x1 * t + n)},${k(e.y1 * t + r)}`, `${k(e.x2 * t + n)},${k(e.y2 * t + r)}`]).join(" ")}" fill="none" />`;
}
function k(e) {
	return e.toFixed(3).replace(/\.?0+$/, "");
}
function A(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function j(e) {
	let t = JSON.parse(e);
	return {
		...t,
		rules: new Map(Object.entries(t.rules ?? {}))
	};
}
function M(e) {
	if (!e) return;
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function N(e, t) {
	let n = Number(e);
	return Number.isInteger(n) && n >= 0 ? n : t;
}
function P(e) {
	return e === "path" || e === "polyline" ? e : void 0;
}
function F(e) {
	return e === "butt" || e === "round" || e === "square" ? e : void 0;
}
function I(e) {
	return e === "miter" || e === "round" || e === "bevel" ? e : void 0;
}
function L(e, t = !1) {
	if (e === void 0) return t;
	let n = e.trim().toLowerCase();
	return n === "" || n === "true" || n === "1" || n === "yes" || n === "on" ? !0 : n === "false" || n === "0" || n === "no" || n === "off" ? !1 : t;
}
function R(e) {
	e.downloadUrl !== null && (URL.revokeObjectURL(e.downloadUrl), e.downloadUrl = null);
}
function z(e, t) {
	let n = e.querySelector("button[data-action=\"play\"]");
	n && (n.textContent = t ? "Pause" : "Play");
}
function B(e, t) {
	return {
		width: M(e.dataset.width),
		height: M(e.dataset.height),
		padding: M(e.dataset.padding),
		stroke: e.dataset.stroke || void 0,
		strokeWidth: M(e.dataset.strokeWidth),
		fill: e.dataset.fill || void 0,
		linecap: F(e.dataset.linecap),
		linejoin: I(e.dataset.linejoin),
		mode: P(e.dataset.mode),
		className: e.dataset.className || "tp-l-system-svg",
		title: t,
		ariaLabel: e.dataset.ariaLabel || t
	};
}
function V(e, t) {
	let n = e.querySelector("[data-role=\"viewport\"]"), r = e.querySelector("[data-role=\"counter\"]");
	if (!n) return;
	let i = {
		...t.baseDefinition,
		iterations: t.currentIterations
	}, a = E(v(p(i).sentence, i), B(e, `L-system (${t.currentIterations}/${t.maxIterations})`));
	n.innerHTML = a, r && (r.textContent = `iteration ${t.currentIterations} / ${t.maxIterations}`), R(t);
	let o = new Blob([a], { type: "image/svg+xml;charset=utf-8" });
	t.downloadUrl = URL.createObjectURL(o), z(e, t.timer !== null);
}
function H(e) {
	if (e.dataset.hydrated === "true") return;
	let t = e.dataset.definition ?? "";
	if (!t) throw Error("Missing data-definition for l-system block.");
	let n = j(t), r = Math.max(0, n.iterations), i = L(e.dataset.animate, !1), a = L(e.dataset.autoplay, !1), o = Math.max(16, N(e.dataset.interval, 250)), s = {
		baseDefinition: n,
		currentIterations: i ? 0 : r,
		maxIterations: r,
		intervalMs: o,
		timer: null,
		downloadUrl: null
	};
	e.innerHTML = "\n    <div class=\"tp-l-system-toolbar\" style=\"display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px;\">\n      <button type=\"button\" data-action=\"step\">Step</button>\n      <button type=\"button\" data-action=\"play\">Play</button>\n      <button type=\"button\" data-action=\"reset\">Reset</button>\n      <button type=\"button\" data-action=\"download\">Download SVG</button>\n      <span data-role=\"counter\" style=\"font-size:12px;opacity:.8;\"></span>\n    </div>\n    <div data-role=\"viewport\"></div>\n  ";
	let c = () => {
		s.currentIterations >= s.maxIterations ? s.currentIterations = 0 : s.currentIterations += 1, V(e, s);
	}, l = () => {
		s.timer !== null && (window.clearInterval(s.timer), s.timer = null), z(e, !1);
	}, u = () => {
		l(), s.timer = window.setInterval(c, s.intervalMs), z(e, !0);
	};
	e.querySelector("button[data-action=\"step\"]")?.addEventListener("click", c), e.querySelector("button[data-action=\"play\"]")?.addEventListener("click", () => {
		if (s.timer !== null) {
			l();
			return;
		}
		s.currentIterations >= s.maxIterations && (s.currentIterations = 0, V(e, s)), u();
	}), e.querySelector("button[data-action=\"reset\"]")?.addEventListener("click", () => {
		l(), s.currentIterations = i ? 0 : s.maxIterations, V(e, s);
	}), e.querySelector("button[data-action=\"download\"]")?.addEventListener("click", () => {
		if (!s.downloadUrl) return;
		let e = document.createElement("a");
		e.href = s.downloadUrl, e.download = "l-system.svg", document.body.appendChild(e), e.click(), e.remove();
	}), V(e, s), a && u(), e.addEventListener("DOMNodeRemovedFromDocument", () => {
		l(), R(s);
	}), e.dataset.hydrated = "true";
}
async function U(e) {
	let t = (e?.root ?? document).querySelectorAll("[data-l-system-block]");
	for (let e of t) try {
		H(e);
	} catch (t) {
		e.innerHTML = `<pre class="tp-l-system-error"><code>${W(t instanceof Error ? t.message : String(t))}</code></pre>`;
	}
}
function W(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
var G = {
	id: "l-system",
	async render(e, t) {
		await U({
			root: e,
			options: t
		});
	}
};
//#endregion
export { G as default };

//# sourceMappingURL=l-system2.js.map