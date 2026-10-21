import { t as e } from "./markdown-style-registry.js";
//#region ../tp-markdown/dist/markdown/extensions/xy-plot/index.js
function t(e, t) {
	if (!/^[0-9+\-*/().,\s_a-zA-Z]+$/.test(e)) throw Error(`Forbidden expression: ${e}`);
	let n = {
		PI: Math.PI,
		E: Math.E
	}, r = {
		abs: Math.abs,
		acos: Math.acos,
		acosh: Math.acosh,
		asin: Math.asin,
		asinh: Math.asinh,
		atan: Math.atan,
		atanh: Math.atanh,
		ceil: Math.ceil,
		cos: Math.cos,
		cosh: Math.cosh,
		exp: Math.exp,
		floor: Math.floor,
		log: Math.log,
		max: Math.max,
		min: Math.min,
		pow: Math.pow,
		random: Math.random,
		round: Math.round,
		sin: Math.sin,
		sinh: Math.sinh,
		sqrt: Math.sqrt,
		tan: Math.tan,
		tanh: Math.tanh
	}, i = [
		...Object.keys(n),
		...Object.keys(r),
		...Object.keys(t)
	], a = [
		...Object.values(n),
		...Object.values(r),
		...Object.values(t)
	], o = Function(...i, `"use strict"; return (${e});`)(...a);
	if (typeof o != "number" || !Number.isFinite(o)) throw Error(`Invalid result for: ${e}`);
	return o;
}
function n(e) {
	let t = [], n = "", r = 0;
	for (let i of e) {
		if (i === "(" || i === "[") r += 1;
		else if ((i === ")" || i === "]") && (--r, r < 0)) throw Error(`Parenthèse fermante inattendue : ${e}`);
		i === "," && r === 0 ? (t.push(n.trim()), n = "") : n += i;
	}
	if (r !== 0) throw Error(`Parenthèse non fermée : ${e}`);
	return t.push(n.trim()), t;
}
function r(e) {
	try {
		return t(e, {});
	} catch {
		throw Error(`Expression numérique invalide : ${e}`);
	}
}
function i(e) {
	let t = e.match(/\[(.*)\]/);
	if (!t) throw Error(`Liste numérique invalide : ${e}`);
	let i = d(t, 1).trim();
	if (i.length === 0) throw Error(`Liste numérique vide : ${e}`);
	return n(i).map((e) => {
		if (e.length === 0) throw Error(`Expression numérique invalide : ${e}`);
		return r(e);
	});
}
function a(e) {
	let t = e.match(/\[(.*)\]/);
	if (!t) throw Error(`Plage invalide : ${e}`);
	let i = n(d(t, 1).trim());
	if (i.length !== 2 || i.some((e) => e.length === 0)) throw Error(`Plage invalide : ${e}`);
	let a = i[0], o = i[1];
	if (a === void 0 || o === void 0) throw Error(`Plage invalide : ${e}`);
	return [r(a), r(o)];
}
function o(e) {
	let t = [], n = "", r = 0, i = !1;
	for (let a of e) {
		if (a === "\"" && (i = !i), i || a === "\"") {
			n += a;
			continue;
		}
		if (a === "[") {
			r > 0 && (n += a), r += 1;
			continue;
		}
		if (a === "]") {
			if (--r, r < 0) throw Error(`Crochet fermant inattendu : ${e}`);
			r === 0 ? (t.push(n.trim()), n = "") : n += a;
			continue;
		}
		if (r === 0) {
			if (a.trim().length === 0 || a === ",") continue;
			throw Error(`Liste de points invalide : ${e}`);
		}
		n += a;
	}
	if (r !== 0) throw Error(`Crochet non fermé : ${e}`);
	return t;
}
function s(e) {
	let t = e.match(/^\s*"([^"]+)"\s*,\s*(.*)\s*$/);
	if (!t) throw Error(`Point invalide : [${e}]`);
	let i = d(t, 1), a = n(d(t, 2));
	if (a.length !== 2 && a.length !== 4 || a.some((e) => e.length === 0)) throw Error(`Point invalide : [${e}]`);
	let o = a[0], s = a[1], c = a[2], l = a[3];
	if (o === void 0 || s === void 0) throw Error(`Point invalide : [${e}]`);
	let u = {
		label: i,
		x: r(o),
		y: r(s)
	};
	return c !== void 0 && l !== void 0 && (u.dx = r(c), u.dy = r(l)), u;
}
function c(e) {
	let t = e.match(/\[(.*)\]/);
	if (!t) throw Error(`Liste de points invalide : ${e}`);
	let n = d(t, 1).trim();
	if (n.length === 0) return [];
	let r = o(n);
	if (r.length === 0) throw Error(`Liste de points invalide : ${e}`);
	return r.map(s);
}
function l(e) {
	if (e === "solid" || e === "dashed" || e === "dotted" || e === "dash-dot") return e;
	throw Error(`Style de trait invalide : ${e}`);
}
function u(e) {
	let t = /^vectors\s*\[([\s\S]*)\]$/.exec(e);
	if (!t) throw Error(`Liste de vecteurs invalide : ${e}`);
	return o(d(t, 1)).map((e) => {
		let t = /^"([^"]+)"\s*,\s*(.*)$/.exec(e);
		if (!t) throw Error(`Vecteur invalide : ${e}`);
		let i = n(d(t, 2));
		if (i.length !== 4 && i.length !== 5) throw Error(`Vecteur invalide : ${e}`);
		let [a, o, s, c] = i.slice(0, 4).map(r);
		if (a === void 0 || o === void 0 || s === void 0 || c === void 0 || ![
			a,
			o,
			s,
			c,
			a + s,
			o + c
		].every(Number.isFinite)) throw Error(`Vecteur invalide : ${e}`);
		let u = i[4], f = u === void 0 ? void 0 : /^"([^"]+)"$/.exec(u);
		if (u !== void 0 && !f) throw Error(`Style de trait invalide : ${u}`);
		return {
			label: d(t, 1),
			x: a,
			y: o,
			dx: s,
			dy: c,
			...f ? { lineStyle: l(d(f, 1)) } : {}
		};
	});
}
function d(e, t) {
	let n = e[t];
	if (n === void 0) throw Error(`Capture manquante à l'index ${t}`);
	return n;
}
function f(e) {
	let t = e.match(/"([^"]*)"/);
	if (!t) throw Error(`Chaîne invalide : ${e}`);
	return d(t, 1);
}
function p(e) {
	let t = [], n = e.trim();
	for (; n.startsWith("\"");) {
		let r = n.match(/^"([^"]+)"\s*(?:,\s*|$)/);
		if (!r || (t.push(d(r, 1)), n = n.slice(r[0].length).trim(), r[0].trim().endsWith(",") && n.length === 0)) throw Error(`Fonction invalide : [${e}]`);
	}
	if (n.length === 0) return { values: t };
	if (!/^\[[^[\]]*\]$/.test(n)) throw Error(`Intervalle de fonction invalide : ${n}`);
	let r = a(n);
	if (!r.every(Number.isFinite) || r[0] >= r[1]) throw Error(`Intervalle de fonction invalide : ${n}`);
	return {
		values: t,
		range: r
	};
}
function m(e) {
	let t = e.match(/^functions\s*\[([\s\S]*)\]$/);
	if (!t) throw Error(`Liste de fonctions invalide : ${e}`);
	let n = d(t, 1).trim();
	if (n.startsWith("[")) return o(n).map((e) => {
		let { values: t, range: n } = p(e);
		if (t.length !== 2 && t.length !== 3) throw Error(`Fonction invalide : [${e}]`);
		return {
			label: d(t, 0),
			expression: d(t, 1),
			...t.length === 3 ? { lineStyle: l(d(t, 2)) } : {},
			...n ? { range: n } : {}
		};
	});
	let { values: r, range: i } = p(n);
	if (n.length === 0) return [];
	if (!r.length || i) throw Error(`Liste de fonctions invalide : ${e}`);
	return r.map((e) => ({
		label: e,
		expression: e
	}));
}
function h(e) {
	let t = e.match(/^functions\s*\[([\s\S]*)\]$/);
	if (!t) throw Error(`Liste de fonctions paramétriques invalide : ${e}`);
	return o(d(t, 1)).map((e) => {
		let { values: t, range: n } = p(e), r = t.length === 4 ? l(t.pop() ?? "") : void 0;
		if (t.length !== 2 && t.length !== 3) throw Error(`Fonction paramétrique invalide : [${e}]`);
		let i = d(t, t.length - 2), a = d(t, t.length - 1);
		return {
			label: t.length === 3 ? d(t, 0) : `{ x=${i}; y=${a} }`,
			...r ? { lineStyle: r } : {},
			xExpression: i,
			yExpression: a,
			...n ? { range: n } : {}
		};
	});
}
function g(e) {
	let t = e.split("\n").map((e) => e.trim()).filter((e) => e.length > 0), n = [], r = [], i = 0;
	for (let e of t) {
		let t = [...e.matchAll(/\[/g)].length, a = [...e.matchAll(/\]/g)].length;
		if (r.length > 0 || e.startsWith("functions") || e.startsWith("points") || e.startsWith("vectors") || /^anim\s/.test(e)) {
			r.push(e), i += t - a, i === 0 && (n.push(r.join(" ")), r = []);
			continue;
		}
		n.push(e);
	}
	if (r.length > 0) throw Error(`Bloc incomplet : ${r.join(" ")}`);
	return n;
}
function _(e) {
	let t = /^curve\s+([A-Za-z_]\w*)\s*=\s*(function|polar|parametric)\((.*)\)\s*(?:style\s*=\s*([\w-]+))?$/.exec(e);
	if (!t) throw Error(`Invalid curve declaration: ${e}`);
	let r = d(t, 1), i = d(t, 2), o = n(d(t, 3)), s = o.shift(), c = i === "function" ? "x" : "t";
	if (s !== c) throw Error(`Curve ${r} requires parameter ${c}.`);
	let u, f = o.at(-1);
	if (f && /^range\s*=/.test(f)) {
		o.pop();
		let e = f.replace(/^range\s*=\s*/, "");
		if (!/^\[[^[\]]*\]$/.test(e) || (u = a(e), !u.every(Number.isFinite) || u[0] >= u[1])) throw Error(`Invalid curve range: ${e}`);
	}
	if (o.length !== (i === "parametric" ? 2 : 1) || o.some((e) => !e || /[="']/.test(e))) throw Error(`Invalid expressions for curve ${r}.`);
	let p = t[4], m = {
		label: r,
		...u ? { range: u } : {},
		...p ? { lineStyle: l(p) } : {}
	};
	return i === "parametric" ? {
		kind: "xyParametricGraph",
		value: {
			...m,
			xExpression: o[0] ?? "",
			yExpression: o[1] ?? ""
		}
	} : {
		kind: i === "polar" ? "xyPolarGraph" : "xyFunctionGraph",
		value: {
			...m,
			expression: o[0] ?? ""
		}
	};
}
function ee(e) {
	return e.replace(/^(\s*)(x-axis|y-axis|x-ticks|y-ticks|legend-x|legend-y|grid|x-axis-at|y-axis-at|samples|anim|t-axis|theta-axis|functions|points|vectors)\s*=\s*/gm, "$1$2 ");
}
function v(e) {
	if (!Array.isArray(e)) throw Error("anim requires a list of names or name groups.");
	let t = /* @__PURE__ */ new Set();
	return e.map((e) => {
		let n = Array.isArray(e) ? e : [e];
		if (!n.length) throw Error("anim groups must not be empty.");
		for (let e of n) {
			if (typeof e != "string" || !e.trim() || t.has(e)) throw Error("anim requires unique, nonempty names across all steps.");
			t.add(e);
		}
		return Array.isArray(e) ? [...n] : e;
	});
}
function y(e) {
	let t = "", n = !1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r] ?? "";
		if (n) t += i, i === "\\" && r + 1 < e.length ? t += e[++r] : i === "\"" && (n = !1);
		else if (e.startsWith("<!--", r)) {
			let n = e.indexOf("-->", r + 4);
			if (n < 0) throw Error("Unterminated HTML comment: expected -->.");
			t += e.slice(r, n + 3).replace(/[^\r\n]/g, " "), r = n + 2;
		} else t += i, i === "\"" && (n = !0);
	}
	return t;
}
function b(e) {
	e = y(e);
	let t = g(ee(e)).map((e) => e.trim()).filter((e) => e.length > 0);
	(/^(?:label|title)\s*=|^(?:point|vector)\s/.test(t[0] ?? "") || /^\s*(?:x-axis|y-axis|x-ticks|y-ticks|legend-x|legend-y|grid|x-axis-at|y-axis-at|samples|anim|t-axis|theta-axis|functions|points|vectors)\s*=/.test(e.trimStart())) && t.unshift("xyFunctionGraph");
	let o = t[0], s = t.filter((e) => /^curve\b/.test(e)).map(_);
	!/^xy(?:Function|Polar|Parametric)Graph$/.test(e.trimStart().split("\n")[0]?.trim() ?? "") && s.length && (o === "xyFunctionGraph" || /^curve\b/.test(o ?? "")) && (o = s[0]?.kind, /^curve\b/.test(t[0] ?? "") && t.unshift(o ?? "xyFunctionGraph"));
	for (let e of s) if (e.kind !== o) throw Error("All curves must use the graph coordinate kind.");
	let l = [], p = [], b = !1, x = {
		anim: [],
		title: void 0,
		legendX: void 0,
		legendY: void 0,
		xAxis: [-10, 10],
		yAxis: [-10, 10],
		xTicks: void 0,
		yTicks: void 0,
		points: [],
		samples: 512
	}, S = [0, Math.PI * 2], C = [0, Math.PI * 2], w = [], T = [];
	for (let e of t.slice(1)) if (!/^curve\b/.test(e)) if (/^(?:label|title)\s*=/.test(e)) {
		if (b || x.title !== void 0) throw Error("Duplicate figure label.");
		let t = JSON.parse(e.slice(e.indexOf("=") + 1).trim());
		if (typeof t != "string") throw Error("Use label = \"Figure title\".");
		x.title = t, b = !0;
	} else if (/^point\b/.test(e)) {
		let t = /^point\s+([A-Za-z_]\w*)\s*=\s*\((.*)\)$/.exec(e);
		if (!t) throw Error(`Invalid point declaration: ${e}`);
		let i = n(d(t, 2));
		if (i.length !== 2) throw Error(`Expected two coordinates: ${e}`);
		let [a, o] = i.map(r);
		if (a === void 0 || o === void 0 || !Number.isFinite(a) || !Number.isFinite(o)) throw Error(`Invalid coordinates: ${e}`);
		l.push({
			label: d(t, 1),
			x: a,
			y: o
		});
	} else if (/^vector\b/.test(e)) {
		let t = /^vector\s+([A-Za-z_]\w*)\s*=\s*vector\(\s*([A-Za-z_]\w*)\s*,\s*([A-Za-z_]\w*)\s*\)$/.exec(e);
		if (!t) throw Error(`Use vector name = vector(A, B): ${e}`);
		p.push({
			label: d(t, 1),
			from: d(t, 2),
			to: d(t, 3)
		});
	} else if (e.startsWith("label")) throw Error("Use label = \"Figure title\".");
	else if (e.startsWith("title")) {
		if (b) throw Error("Duplicate figure label.");
		x.title = f(e);
	} else if (e.startsWith("legend-x")) x.legendX = f(e);
	else if (e.startsWith("legend-y")) x.legendY = f(e);
	else if (e.startsWith("grid")) {
		let t = e.slice(4).trim();
		if (t !== "both" && t !== "horizontal" && t !== "vertical" && t !== "none") throw Error(`Grille invalide : ${t}`);
		x.grid = t;
	} else e.startsWith("x-axis-at") ? x.xAxisAt = r(e.slice(9).trim()) : e.startsWith("y-axis-at") ? x.yAxisAt = r(e.slice(9).trim()) : e.startsWith("x-axis") ? x.xAxis = a(e) : e.startsWith("y-axis") ? x.yAxis = a(e) : e.startsWith("t-axis") ? o === "xyPolarGraph" ? C = a(e) : S = a(e) : e.startsWith("theta-axis") ? C = a(e) : e.startsWith("samples") ? x.samples = Number(e.replace("samples", "").trim()) : e.startsWith("functions") ? o === "xyParametricGraph" ? T = h(e) : w = m(e) : /^anim\s/.test(e) ? x.anim = v(JSON.parse(e.slice(4).trim())) : e.startsWith("vectors") ? x.vectors = u(e) : e.startsWith("points") ? x.points = c(e) : e.startsWith("x-ticks") ? x.xTicks = i(e) : e.startsWith("y-ticks") && (x.yTicks = i(e));
	let E = new Set([
		...w,
		...T,
		...x.points ?? [],
		...x.vectors ?? []
	].map((e) => e.label));
	for (let e of [
		...l,
		...p,
		...s.map((e) => e.value)
	]) {
		if (E.has(e.label)) throw Error(`Duplicate object name: ${e.label}`);
		E.add(e.label);
	}
	for (let e of s) "expression" in e.value ? w.push(e.value) : T.push(e.value);
	x.points = [...x.points ?? [], ...l];
	let D = new Map(x.points.map((e) => [e.label, e]));
	for (let e of p) {
		let t = D.get(e.from), n = D.get(e.to);
		if (!t || !n) throw Error(`Unknown endpoint for vector ${e.label}: ${t ? e.to : e.from}`);
		let r = n.x - t.x, i = n.y - t.y;
		if (![r, i].every(Number.isFinite)) throw Error(`Invalid vector: ${e.label}`);
		x.vectors ??= [], x.vectors.push({
			label: e.label,
			x: t.x,
			y: t.y,
			dx: r,
			dy: i
		});
	}
	let O = new Set([
		...w,
		...T,
		...x.points ?? [],
		...x.vectors ?? []
	].map((e) => e.label));
	for (let e of (x.anim ?? []).flat()) if (!O.has(e)) throw Error(`Unknown anim object: ${e}`);
	for (let [e, t, n] of [[
		"x-axis-at",
		x.xAxisAt,
		x.yAxis
	], [
		"y-axis-at",
		x.yAxisAt,
		x.xAxis
	]]) if (t !== void 0 && (!Number.isFinite(t) || t < Math.min(...n) || t > Math.max(...n))) throw Error(`Position invalide pour ${e} : ${t}`);
	if (o === "xyFunctionGraph" && w.length === 0 && !x.vectors?.length && !x.points?.length) throw Error("Aucune fonction définie");
	if (o === "xyParametricGraph" && T.length === 0 && !x.vectors?.length && !x.points?.length) throw Error("Aucune fonction paramétrique définie");
	if (o === "xyPolarGraph" && w.length === 0 && !x.vectors?.length && !x.points?.length) throw Error("Aucune fonction polaire définie");
	if (o === "xyFunctionGraph") return {
		...x,
		kind: o,
		functions: w
	};
	if (o === "xyParametricGraph") return {
		...x,
		kind: o,
		tAxis: S,
		functions: T
	};
	if (o === "xyPolarGraph") return {
		...x,
		kind: o,
		thetaAxis: C,
		functions: w
	};
	throw Error(`Type de graphe inconnu : ${o}`);
}
function x(e = "solid") {
	switch (e) {
		case "solid": return "";
		case "dashed": return "stroke-dasharray=\"6 4\"";
		case "dotted": return "stroke-dasharray=\"0 5\" stroke-linecap=\"round\"";
		case "dash-dot": return "stroke-dasharray=\"6 4 0 4\" stroke-linecap=\"round\"";
		default: throw Error(`Style de trait invalide : ${e}`);
	}
}
var S = 900, C = 520, w = {
	left: (S - C) / 2,
	top: 70,
	right: 710,
	bottom: 590
}, T = {
	x: w.left,
	y: w.bottom + 70,
	lineHeight: 16,
	itemGap: 8,
	maxCharsPerLine: 100
}, E = {
	radius: 4,
	labelDx: 8,
	labelDy: -8
}, D = 9;
function O(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function k(e) {
	return Math.abs(e) < 1e-10 ? "0" : Number(e.toFixed(2)).toString();
}
function A(e, t, n = D) {
	return n < 2 ? [e] : Array.from({ length: n }, (r, i) => e + (t - e) * i / (n - 1));
}
function j(e) {
	return e.xTicks ?? A(e.xAxis[0], e.xAxis[1]);
}
function M(e) {
	return e.yTicks ?? A(e.yAxis[0], e.yAxis[1]);
}
function N(e, t) {
	let [n, r] = t.xAxis;
	return w.left + (e - n) / (r - n) * (w.right - w.left);
}
function P(e, t) {
	let [n, r] = t.yAxis;
	return w.bottom - (e - n) / (r - n) * (w.bottom - w.top);
}
function F(e, t) {
	return e.x >= t.xAxis[0] && e.x <= t.xAxis[1] && e.y >= t.yAxis[0] && e.y <= t.yAxis[1];
}
function te(e, t) {
	return e.kind === "xyPolarGraph" ? `r = ${t.expression}` : e.kind === "xyParametricGraph" ? t.expression : `y = ${t.expression}`;
}
function I(e, t) {
	let n = te(e, t);
	return t.label === t.expression || t.label === n ? n : `${t.label} : ${n}`;
}
function L(e) {
	if (e.length <= T.maxCharsPerLine) return [e];
	let t = e.replaceAll("; ", ";|").replaceAll(", ", ",|").replaceAll(" }", "|}").replaceAll(" [", "|[").replaceAll(" y=", "|y=").replaceAll(" r=", "|r=").replaceAll(" : ", " : |").split("|").filter((e) => e.length > 0), n = [], r = "";
	for (let e of t) {
		let t = r.length === 0 ? e : `${r} ${e}`;
		t.length > T.maxCharsPerLine && r.length > 0 ? (n.push(r), r = e) : r = t;
	}
	return r.length > 0 && n.push(r), n.flatMap((e) => {
		if (e.length <= T.maxCharsPerLine) return [e];
		let t = [];
		for (let n = 0; n < e.length; n += T.maxCharsPerLine) t.push(e.slice(n, n + T.maxCharsPerLine));
		return t;
	});
}
function R(e, t) {
	return e.points.filter((e) => F(e, t)).map((e, n) => {
		let r = N(e.x, t), i = P(e.y, t);
		return `${n === 0 ? "M" : "L"} ${r.toFixed(2)} ${i.toFixed(2)}`;
	}).join(" ");
}
function z(e) {
	let t = e.xAxisAt === void 0 ? w.bottom : P(e.xAxisAt, e), n = e.grid ?? "both";
	return j(e).map((r) => {
		let i = N(r, e);
		return `
        <g>
          <line
            x1="${i}"
            y1="${t}"
            x2="${i}"
            y2="${t + 6}"
            data-xy-axis="horizontal" stroke="#666"
          />
          ${n === "both" || n === "vertical" ? `
          <line
            x1="${i}"
            y1="${w.top}"
            x2="${i}"
            y2="${w.bottom}"
            data-xy-grid="vertical" stroke="#eee"
          />
          ` : ""}
          <text data-xy-axis="horizontal"
            x="${i}"
            y="${t + 22}"
            text-anchor="middle"
            font-size="11"
          >${k(r)}</text>
        </g>
      `;
	}).join("");
}
function B(e) {
	let t = e.yAxisAt === void 0 ? w.left : N(e.yAxisAt, e), n = e.grid ?? "both";
	return M(e).map((r) => {
		let i = P(r, e);
		return `
        <g>
          <line
            x1="${t - 6}"
            y1="${i}"
            x2="${t}"
            y2="${i}"
            data-xy-axis="vertical" stroke="#666"
          />
          ${n === "both" || n === "horizontal" ? `
          <line
            x1="${w.left}"
            y1="${i}"
            x2="${w.right}"
            y2="${i}"
            data-xy-grid="horizontal" stroke="#eee"
          />
          ` : ""}
          <text data-xy-axis="vertical"
            x="${t - 10}"
            y="${i + 4}"
            text-anchor="end"
            font-size="11"
          >${k(r)}</text>
        </g>
      `;
	}).join("");
}
function V(e) {
	return (e.points ?? []).filter((t) => F(t, e)).map((t) => {
		let n = N(t.x, e), r = P(t.y, e), i = t.dx ?? E.labelDx, a = t.dy ?? E.labelDy, o = O(t.label);
		return `
        <g class="tp-md-xy-graph-point-group" data-xy-object="${o}">
          <title>${O(`${t.label} (${k(t.x)}, ${k(t.y)})`)}</title>
          <circle
            class="tp-md-xy-graph-point"
            cx="${n.toFixed(2)}"
            cy="${r.toFixed(2)}"
            r="${E.radius}"
          />
          <text
            class="tp-md-xy-graph-point-label"
            x="${(n + i).toFixed(2)}"
            y="${(r + a).toFixed(2)}"
            font-size="12"
          >${o}</text>
        </g>
      `;
	}).join("");
}
function H(e, t) {
	if (!e.vectors?.length) return "";
	let n = e.vectors.map((n, r) => {
		let { x: i, y: a, dx: o, dy: s } = n;
		if (![
			i,
			a,
			o,
			s,
			i + o,
			a + s
		].every(Number.isFinite)) throw Error("Vecteur invalide");
		let c = N(i, e), l = P(a, e), u = N(i + o, e), d = P(a + s, e), f = Math.hypot(u - c, d - l), p = Math.atan2(d - l, u - c) * 180 / Math.PI, m = Math.min(10, f / 2), h = `hsl(${(t + r) * 75 % 360} 70% 40%)`, g = x(n.lineStyle);
		return `<g data-xy-object="${O(n.label)}" class="tp-md-xy-graph-vector" fill="${h}" stroke="${h}">
   <title>${O(`${n.label}: (${i}, ${a}) → (${i + o}, ${a + s})`)}</title>
   ${f === 0 ? `<circle cx="${c}" cy="${l}" r="3" />` : `<line x1="${c}" y1="${l}" x2="${u}" y2="${d}" stroke-width="2" ${g}/>
   <path d="M 0 0 L ${-m} ${-m / 2} L ${-m} ${m / 2} Z" transform="translate(${u} ${d}) rotate(${p})" stroke="none" />`}
   <text x="${u + 8}" y="${d - 8}" font-size="12" stroke="none">${O(n.label)}</text>
  </g>`;
	}).join("");
	return `<svg x="${w.left}" y="${w.top}" width="${C}" height="${C}" viewBox="${w.left} ${w.top} ${C} ${C}" overflow="hidden">${n}</svg>`;
}
function U(e, t, n) {
	let r = T.y;
	for (let i of t.slice(0, n)) {
		let t = L(I(e, i)).length;
		r += t * T.lineHeight + T.itemGap;
	}
	return r;
}
function W(e, t) {
	return t.map((n, r) => {
		let i = U(e, t, r), a = `hsl(${r * 75 % 360} 70% 40%)`, o = I(e, n), s = L(o).map((e, t) => `
            <text
              x="${T.x + 42}"
              y="${i + 4 + t * T.lineHeight}"
              font-size="12"
            >${O(e)}</text>
          `).join("");
		return `
        <g data-xy-legend data-xy-object="${O(n.label)}">
          <title>${O(o)}</title>
          <line
            x1="${T.x}"
            y1="${i}"
            x2="${T.x + 32}"
            y2="${i}"
            stroke="${a}"
            stroke-width="2"
            ${x(n.lineStyle)}
          />
          ${s}
        </g>
      `;
	}).join("");
}
function G(e, t) {
	let n = e.xAxisAt ?? 0, r = e.yAxisAt ?? 0;
	for (let [t, n] of [[e.xAxisAt, e.yAxis], [e.yAxisAt, e.xAxis]]) if (t !== void 0 && (!Number.isFinite(t) || t < Math.min(...n) || t > Math.max(...n))) throw Error("Position d'axe hors du domaine du graphe");
	let i = N(r, e), a = P(n, e), o = e.yAxisAt === void 0 ? w.left : i, s = e.xAxisAt === void 0 ? w.bottom : a, c = t.map((t, n) => {
		let r = R(t, e), i = `hsl(${n * 75 % 360} 70% 40%)`;
		return `
        <path data-xy-object="${O(t.label)}"
          d="${r}"
          fill="none"
          stroke="${i}"
          stroke-width="2"
            ${x(t.lineStyle)}
        />
      `;
	}).join(""), l = o - 50, u = (w.top + w.bottom) / 2;
	return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${S} ${S}"
      role="img"
    >
      <rect width="100%" height="100%" fill="white" />

      ${e.title ? `<text x="${(w.left + w.right) / 2}" y="28" text-anchor="middle" font-size="36">${O(e.title)}</text>` : ""}

      <rect
        x="${w.left}"
        y="${w.top}"
        width="${w.right - w.left}"
        height="${w.bottom - w.top}"
        fill="none"
        stroke="#999"
      />

      ${z(e)}
      ${B(e)}

      ${e.yAxis[0] <= n && e.yAxis[1] >= n ? `<line data-xy-axis="horizontal" x1="${w.left}" y1="${a}" x2="${w.right}" y2="${a}" stroke="#aaa" />` : ""}

      ${e.xAxis[0] <= r && e.xAxis[1] >= r ? `<line data-xy-axis="vertical" x1="${i}" y1="${w.top}" x2="${i}" y2="${w.bottom}" stroke="#aaa" />` : ""}

      ${c}
      ${H(e, t.length)}
      ${V(e)}

      ${e.legendX ? `<text data-xy-axis="horizontal" x="${(w.left + w.right) / 2}" y="${s + 44}" text-anchor="middle">${O(e.legendX)}</text>` : ""}

      ${e.legendY ? `<text data-xy-axis="vertical"
              x="${l}"
              y="${u}"
              transform="rotate(-90 ${l} ${u})"
              text-anchor="middle"
            >${O(e.legendY)}</text>` : ""}

      ${W(e, t)}
    </svg>
  `;
}
function K(e, t, n, r) {
	return r <= 1 ? e : e + (t - e) * n / (r - 1);
}
function q(e, t) {
	if (!e) return t;
	if (e.length !== 2 || !e.every(Number.isFinite) || e[0] >= e[1]) throw Error("Intervalle de fonction invalide");
	return e;
}
function J(e) {
	return e.functions.map(({ label: n, expression: r, range: i, lineStyle: a }) => {
		let o = [], s = q(i, e.xAxis), c = i ? Math.max(s[0], Math.min(...e.xAxis)) : s[0], l = i ? Math.min(s[1], Math.max(...e.xAxis)) : s[1];
		if (i && c > l) return {
			label: n,
			expression: r,
			points: o,
			...a ? { lineStyle: a } : {}
		};
		for (let n = 0; n < e.samples; n += 1) {
			let i = K(c, l, n, e.samples);
			try {
				let e = t(r, { x: i });
				Number.isFinite(e) && o.push({
					x: i,
					y: e
				});
			} catch {}
		}
		return {
			label: n,
			expression: r,
			points: o,
			...a ? { lineStyle: a } : {}
		};
	});
}
function Y(e) {
	return e.functions.map(({ label: n, xExpression: r, yExpression: i, range: a, lineStyle: o }) => {
		let s = [], c = `{ x = ${r}; y = ${i} }`, l = q(a, e.tAxis);
		for (let n = 0; n < e.samples; n += 1) {
			let a = K(l[0], l[1], n, e.samples);
			try {
				let e = t(r, { t: a }), n = t(i, { t: a });
				Number.isFinite(e) && Number.isFinite(n) && s.push({
					x: e,
					y: n
				});
			} catch {}
		}
		return {
			label: n,
			expression: c,
			points: s,
			...o ? { lineStyle: o } : {}
		};
	});
}
function X(e) {
	return e.functions.map(({ label: n, expression: r, range: i, lineStyle: a }) => {
		let o = [], s = q(i, e.thetaAxis);
		for (let n = 0; n < e.samples; n += 1) {
			let i = K(s[0], s[1], n, e.samples);
			try {
				let e = t(r, { t: i }), n = e * Math.cos(i), a = e * Math.sin(i);
				Number.isFinite(n) && Number.isFinite(a) && o.push({
					x: n,
					y: a
				});
			} catch {}
		}
		return {
			label: n,
			expression: r,
			points: o,
			...a ? { lineStyle: a } : {}
		};
	});
}
function Z(e) {
	return e.kind === "xyFunctionGraph" ? J(e) : e.kind === "xyParametricGraph" ? Y(e) : e.kind === "xyPolarGraph" ? X(e) : [];
}
var ne = "tp-md-xy-plot-styles", Q = !1, re = "\n.tp-md-xy-plot {\n  position: relative;\n\n  display: block;\n  inline-size: min(100%, 900px);\n  margin-block: 1rem;\n  margin-inline: auto;\n}\n\n.tp-md-xy-plot-preview {\n  inline-size: 100%;\n}\n\n.tp-md-xy-plot svg {\n  display: block;\n  inline-size: 100%;\n  block-size: auto;\n}\n\n.tp-md-xy-plot .tp-md-xy-graph-point {\n  fill: #333;\n  stroke: white;\n  stroke-width: 1.5;\n}\n\n.tp-md-xy-plot .tp-md-xy-graph-point-label {\n  fill: #333;\n  font-size: 12px;\n  font-family: system-ui, sans-serif;\n}\n\n.tp-md-xy-plot-zoom-button {\n  position: absolute;\n  inset-block-start: 0.5rem;\n  inset-inline-end: 0.5rem;\n  z-index: 1;\n\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n\n  padding-block: 0.35rem;\n  padding-inline: 0.65rem;\n\n  border: 1px solid color-mix(in srgb, CanvasText 25%, transparent);\n  border-radius: 999px;\n\n  background: color-mix(in srgb, Canvas 88%, transparent);\n  color: CanvasText;\n\n  font: inherit;\n  font-size: 0.875rem;\n  line-height: 1.2;\n\n  cursor: pointer;\n}\n\n.tp-md-xy-plot-zoom-button:hover {\n  background: color-mix(in srgb, CanvasText 8%, Canvas 92%);\n}\n\n.tp-md-xy-plot-dialog {\n  inline-size: min(96vw, 1200px);\n  max-inline-size: 1200px;\n  max-block-size: 92vh;\n  padding: 1rem;\n\n  border: 1px solid color-mix(in srgb, CanvasText 18%, transparent);\n  border-radius: 1rem;\n\n  background: Canvas;\n  color: CanvasText;\n}\n\n.tp-md-xy-plot-dialog::backdrop {\n  background: color-mix(in srgb, black 55%, transparent);\n}\n\n.tp-md-xy-plot-dialog-header {\n  display: flex;\n  justify-content: flex-end;\n  margin-block-end: 0.75rem;\n}\n\n.tp-md-xy-plot-close-button {\n  padding-block: 0.35rem;\n  padding-inline: 0.65rem;\n\n  border: 1px solid color-mix(in srgb, CanvasText 25%, transparent);\n  border-radius: 999px;\n\n  background: Canvas;\n  color: CanvasText;\n\n  font: inherit;\n  font-size: 0.875rem;\n  line-height: 1.2;\n\n  cursor: pointer;\n}\n\n.tp-md-xy-plot-dialog-content {\n  overflow: auto;\n}\n\n.tp-md-xy-plot-dialog-content svg {\n  inline-size: 100%;\n  min-inline-size: 900px;\n  block-size: auto;\n}\n\n.tp-md-xy-plot-error {\n  margin: 0;\n  padding: 1rem;\n  overflow-x: auto;\n\n  border: 1px solid color-mix(in srgb, red 45%, transparent);\n  border-radius: 0.75rem;\n\n  background: color-mix(in srgb, red 8%, Canvas 92%);\n  color: CanvasText;\n}\n";
function ie(t) {
	e(ne, re), ae(), $(t);
}
function ae() {
	Q || typeof document > "u" || (Q = !0, document.addEventListener("click", (e) => {
		let t = e.target;
		if (!(t instanceof HTMLElement)) return;
		let n = t.closest(".tp-md-xy-plot-zoom-button");
		if (!(n instanceof HTMLButtonElement)) return;
		let r = n.closest(".tp-md-xy-plot");
		if (!(r instanceof HTMLElement)) return;
		let i = r.querySelector(".tp-md-xy-plot-dialog");
		i instanceof HTMLDialogElement && i.showModal();
	}));
}
function $(e) {
	let t = e.renderer.rules.fence;
	e.renderer.rules.fence = (e, n, r, i, a) => {
		let o = e[n];
		return o === void 0 ? "" : ce(o.info).name === "xy-plot" ? (o.attrJoin("class", "tp-md-xy-plot"), oe(o, a)) : typeof t == "function" ? t(e, n, r, i, a) : a.renderToken(e, n, r);
	};
}
function oe(e, t) {
	try {
		let n = b(e.content), r = G(n, Z(n));
		return `
<figure${t.renderAttrs(e)}>
  <button
    type="button"
    class="tp-md-xy-plot-zoom-button"
    aria-label="Zoom graph"
  >Zoom</button>

  <div class="tp-md-xy-plot-preview">
    ${r}
  </div>

  <dialog class="tp-md-xy-plot-dialog" aria-label="Zoomed graph">
    <form class="tp-md-xy-plot-dialog-header" method="dialog">
      <button type="submit" class="tp-md-xy-plot-close-button">Close</button>
    </form>

    <div class="tp-md-xy-plot-dialog-content">
      ${r}
    </div>
  </dialog>
</figure>
`;
	} catch (n) {
		return `
<figure${t.renderAttrs(e)}>
  ${se(n)}
</figure>
`;
	}
}
function se(e) {
	return `
<pre class="tp-md-xy-plot-error" role="alert"><code>${le(e instanceof Error ? e.message : String(e))}</code></pre>
`;
}
function ce(e) {
	let t = e.trim(), n = t.search(/\s/);
	return n === -1 ? {
		name: t,
		args: ""
	} : {
		name: t.slice(0, n),
		args: t.slice(n + 1).trim()
	};
}
function le(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
//#endregion
export { ie as default };

//# sourceMappingURL=xy-plot2.js.map