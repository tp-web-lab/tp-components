import { dt as e } from "./lib/typescript/typescript.js";
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
		if (i === "(") r += 1;
		else if (i === ")" && (--r, r < 0)) throw Error(`Parenthèse fermante inattendue : ${e}`);
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
	let t = g(e).map((e) => e.trim()).filter((e) => e.length > 0), n = t[0], o = {
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
	}, s = [0, Math.PI * 2], l = [0, Math.PI * 2], d = [], p = [];
	for (let e of t.slice(1)) if (e.startsWith("title")) o.title = f(e);
	else if (e.startsWith("legend-x")) o.legendX = f(e);
	else if (e.startsWith("legend-y")) o.legendY = f(e);
	else if (e.startsWith("grid")) {
		let t = e.slice(4).trim();
		if (t !== "both" && t !== "horizontal" && t !== "vertical" && t !== "none") throw Error(`Grille invalide : ${t}`);
		o.grid = t;
	} else if (e.startsWith("x-axis-at")) o.xAxisAt = r(e.slice(9).trim());
	else if (e.startsWith("y-axis-at")) o.yAxisAt = r(e.slice(9).trim());
	else if (e.startsWith("x-axis")) o.xAxis = a(e);
	else if (e.startsWith("y-axis")) o.yAxis = a(e);
	else if (e.startsWith("t-axis")) n === "xyPolarGraph" ? l = a(e) : s = a(e);
	else if (e.startsWith("theta-axis")) l = a(e);
	else if (e.startsWith("samples")) o.samples = Number(e.replace("samples", "").trim());
	else if (e.startsWith("functions")) n === "xyParametricGraph" ? p = h(e) : d = m(e);
	else if (/^anim\s/.test(e)) {
		let t = JSON.parse(e.slice(4).trim());
		if (!Array.isArray(t) || t.some((e) => typeof e != "string" || !e.trim()) || new Set(t).size !== t.length) throw Error("anim requires a list of unique, nonempty names.");
		o.anim = t;
	} else e.startsWith("vectors") ? o.vectors = u(e) : e.startsWith("points") ? o.points = c(e) : e.startsWith("x-ticks") ? o.xTicks = i(e) : e.startsWith("y-ticks") && (o.yTicks = i(e));
	let _ = new Set([
		...d,
		...p,
		...o.points ?? [],
		...o.vectors ?? []
	].map((e) => e.label));
	for (let e of o.anim ?? []) if (!_.has(e)) throw Error(`Unknown anim object: ${e}`);
	for (let [e, t, n] of [[
		"x-axis-at",
		o.xAxisAt,
		o.yAxis
	], [
		"y-axis-at",
		o.yAxisAt,
		o.xAxis
	]]) if (t !== void 0 && (!Number.isFinite(t) || t < Math.min(...n) || t > Math.max(...n))) throw Error(`Position invalide pour ${e} : ${t}`);
	if (n === "xyFunctionGraph" && d.length === 0 && !o.vectors?.length) throw Error("Aucune fonction définie");
	if (n === "xyParametricGraph" && p.length === 0 && !o.vectors?.length) throw Error("Aucune fonction paramétrique définie");
	if (n === "xyPolarGraph" && d.length === 0 && !o.vectors?.length) throw Error("Aucune fonction polaire définie");
	if (n === "xyFunctionGraph") return {
		...o,
		kind: n,
		functions: d
	};
	if (n === "xyParametricGraph") return {
		...o,
		kind: n,
		tAxis: s,
		functions: p
	};
	if (n === "xyPolarGraph") return {
		...o,
		kind: n,
		thetaAxis: l,
		functions: d
	};
	throw Error(`Type de graphe inconnu : ${n}`);
}
function v(e = "solid") {
	switch (e) {
		case "solid": return "";
		case "dashed": return "stroke-dasharray=\"6 4\"";
		case "dotted": return "stroke-dasharray=\"0 5\" stroke-linecap=\"round\"";
		case "dash-dot": return "stroke-dasharray=\"6 4 0 4\" stroke-linecap=\"round\"";
		default: throw Error(`Style de trait invalide : ${e}`);
	}
}
var y = 900, b = 520, x = {
	left: (y - b) / 2,
	top: 70,
	right: 710,
	bottom: 590
}, S = {
	x: x.left,
	y: x.bottom + 70,
	lineHeight: 16,
	itemGap: 8,
	maxCharsPerLine: 100
}, C = {
	radius: 4,
	labelDx: 8,
	labelDy: -8
}, w = 9;
function T(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function E(e) {
	return Math.abs(e) < 1e-10 ? "0" : Number(e.toFixed(2)).toString();
}
function D(e, t, n = w) {
	return n < 2 ? [e] : Array.from({ length: n }, (r, i) => e + (t - e) * i / (n - 1));
}
function O(e) {
	return e.xTicks ?? D(e.xAxis[0], e.xAxis[1]);
}
function k(e) {
	return e.yTicks ?? D(e.yAxis[0], e.yAxis[1]);
}
function A(e, t) {
	let [n, r] = t.xAxis;
	return x.left + (e - n) / (r - n) * (x.right - x.left);
}
function j(e, t) {
	let [n, r] = t.yAxis;
	return x.bottom - (e - n) / (r - n) * (x.bottom - x.top);
}
function M(e, t) {
	return e.x >= t.xAxis[0] && e.x <= t.xAxis[1] && e.y >= t.yAxis[0] && e.y <= t.yAxis[1];
}
function N(e, t) {
	return e.kind === "xyPolarGraph" ? `r = ${t.expression}` : e.kind === "xyParametricGraph" ? t.expression : `y = ${t.expression}`;
}
function P(e, t) {
	let n = N(e, t);
	return t.label === t.expression || t.label === n ? n : `${t.label} : ${n}`;
}
function F(e) {
	if (e.length <= S.maxCharsPerLine) return [e];
	let t = e.replaceAll("; ", ";|").replaceAll(", ", ",|").replaceAll(" }", "|}").replaceAll(" [", "|[").replaceAll(" y=", "|y=").replaceAll(" r=", "|r=").replaceAll(" : ", " : |").split("|").filter((e) => e.length > 0), n = [], r = "";
	for (let e of t) {
		let t = r.length === 0 ? e : `${r} ${e}`;
		t.length > S.maxCharsPerLine && r.length > 0 ? (n.push(r), r = e) : r = t;
	}
	return r.length > 0 && n.push(r), n.flatMap((e) => {
		if (e.length <= S.maxCharsPerLine) return [e];
		let t = [];
		for (let n = 0; n < e.length; n += S.maxCharsPerLine) t.push(e.slice(n, n + S.maxCharsPerLine));
		return t;
	});
}
function I(e, t) {
	return e.points.filter((e) => M(e, t)).map((e, n) => {
		let r = A(e.x, t), i = j(e.y, t);
		return `${n === 0 ? "M" : "L"} ${r.toFixed(2)} ${i.toFixed(2)}`;
	}).join(" ");
}
function L(e) {
	let t = e.xAxisAt === void 0 ? x.bottom : j(e.xAxisAt, e), n = e.grid ?? "both";
	return O(e).map((r) => {
		let i = A(r, e);
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
            y1="${x.top}"
            x2="${i}"
            y2="${x.bottom}"
            data-xy-grid="vertical" stroke="#eee"
          />
          ` : ""}
          <text data-xy-axis="horizontal"
            x="${i}"
            y="${t + 22}"
            text-anchor="middle"
            font-size="11"
          >${E(r)}</text>
        </g>
      `;
	}).join("");
}
function R(e) {
	let t = e.yAxisAt === void 0 ? x.left : A(e.yAxisAt, e), n = e.grid ?? "both";
	return k(e).map((r) => {
		let i = j(r, e);
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
            x1="${x.left}"
            y1="${i}"
            x2="${x.right}"
            y2="${i}"
            data-xy-grid="horizontal" stroke="#eee"
          />
          ` : ""}
          <text data-xy-axis="vertical"
            x="${t - 10}"
            y="${i + 4}"
            text-anchor="end"
            font-size="11"
          >${E(r)}</text>
        </g>
      `;
	}).join("");
}
function z(e) {
	return (e.points ?? []).filter((t) => M(t, e)).map((t) => {
		let n = A(t.x, e), r = j(t.y, e), i = t.dx ?? C.labelDx, a = t.dy ?? C.labelDy, o = T(t.label);
		return `
        <g class="tp-md-xy-graph-point-group" data-xy-object="${o}">
          <title>${T(`${t.label} (${E(t.x)}, ${E(t.y)})`)}</title>
          <circle
            class="tp-md-xy-graph-point"
            cx="${n.toFixed(2)}"
            cy="${r.toFixed(2)}"
            r="${C.radius}"
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
function B(e, t) {
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
		let c = A(i, e), l = j(a, e), u = A(i + o, e), d = j(a + s, e), f = Math.hypot(u - c, d - l), p = Math.atan2(d - l, u - c) * 180 / Math.PI, m = Math.min(10, f / 2), h = `hsl(${(t + r) * 75 % 360} 70% 40%)`, g = v(n.lineStyle);
		return `<g data-xy-object="${T(n.label)}" class="tp-md-xy-graph-vector" fill="${h}" stroke="${h}">
   <title>${T(`${n.label}: (${i}, ${a}) → (${i + o}, ${a + s})`)}</title>
   ${f === 0 ? `<circle cx="${c}" cy="${l}" r="3" />` : `<line x1="${c}" y1="${l}" x2="${u}" y2="${d}" stroke-width="2" ${g}/>
   <path d="M 0 0 L ${-m} ${-m / 2} L ${-m} ${m / 2} Z" transform="translate(${u} ${d}) rotate(${p})" stroke="none" />`}
   <text x="${u + 8}" y="${d - 8}" font-size="12" stroke="none">${T(n.label)}</text>
  </g>`;
	}).join("");
	return `<svg x="${x.left}" y="${x.top}" width="${b}" height="${b}" viewBox="${x.left} ${x.top} ${b} ${b}" overflow="hidden">${n}</svg>`;
}
function V(e, t, n) {
	let r = S.y;
	for (let i of t.slice(0, n)) {
		let t = F(P(e, i)).length;
		r += t * S.lineHeight + S.itemGap;
	}
	return r;
}
function H(e, t) {
	return t.map((n, r) => {
		let i = V(e, t, r), a = `hsl(${r * 75 % 360} 70% 40%)`, o = P(e, n), s = F(o).map((e, t) => `
            <text
              x="${S.x + 42}"
              y="${i + 4 + t * S.lineHeight}"
              font-size="12"
            >${T(e)}</text>
          `).join("");
		return `
        <g data-xy-legend data-xy-object="${T(n.label)}">
          <title>${T(o)}</title>
          <line
            x1="${S.x}"
            y1="${i}"
            x2="${S.x + 32}"
            y2="${i}"
            stroke="${a}"
            stroke-width="2"
            ${v(n.lineStyle)}
          />
          ${s}
        </g>
      `;
	}).join("");
}
function U(e, t) {
	let n = e.xAxisAt ?? 0, r = e.yAxisAt ?? 0;
	for (let [t, n] of [[e.xAxisAt, e.yAxis], [e.yAxisAt, e.xAxis]]) if (t !== void 0 && (!Number.isFinite(t) || t < Math.min(...n) || t > Math.max(...n))) throw Error("Position d'axe hors du domaine du graphe");
	let i = A(r, e), a = j(n, e), o = e.yAxisAt === void 0 ? x.left : i, s = e.xAxisAt === void 0 ? x.bottom : a, c = t.map((t, n) => {
		let r = I(t, e), i = `hsl(${n * 75 % 360} 70% 40%)`;
		return `
        <path data-xy-object="${T(t.label)}"
          d="${r}"
          fill="none"
          stroke="${i}"
          stroke-width="2"
            ${v(t.lineStyle)}
        />
      `;
	}).join(""), l = o - 50, u = (x.top + x.bottom) / 2;
	return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${y} ${y}"
      role="img"
    >
      <rect width="100%" height="100%" fill="white" />

      ${e.title ? `<text x="${(x.left + x.right) / 2}" y="28" text-anchor="middle" font-size="36">${T(e.title)}</text>` : ""}

      <rect
        x="${x.left}"
        y="${x.top}"
        width="${x.right - x.left}"
        height="${x.bottom - x.top}"
        fill="none"
        stroke="#999"
      />

      ${L(e)}
      ${R(e)}

      ${e.yAxis[0] <= n && e.yAxis[1] >= n ? `<line data-xy-axis="horizontal" x1="${x.left}" y1="${a}" x2="${x.right}" y2="${a}" stroke="#aaa" />` : ""}

      ${e.xAxis[0] <= r && e.xAxis[1] >= r ? `<line data-xy-axis="vertical" x1="${i}" y1="${x.top}" x2="${i}" y2="${x.bottom}" stroke="#aaa" />` : ""}

      ${c}
      ${B(e, t.length)}
      ${z(e)}

      ${e.legendX ? `<text data-xy-axis="horizontal" x="${(x.left + x.right) / 2}" y="${s + 44}" text-anchor="middle">${T(e.legendX)}</text>` : ""}

      ${e.legendY ? `<text data-xy-axis="vertical"
              x="${l}"
              y="${u}"
              transform="rotate(-90 ${l} ${u})"
              text-anchor="middle"
            >${T(e.legendY)}</text>` : ""}

      ${H(e, t)}
    </svg>
  `;
}
function W(e, t, n, r) {
	return r <= 1 ? e : e + (t - e) * n / (r - 1);
}
function G(e, t) {
	if (!e) return t;
	if (e.length !== 2 || !e.every(Number.isFinite) || e[0] >= e[1]) throw Error("Intervalle de fonction invalide");
	return e;
}
function K(e) {
	return e.functions.map(({ label: n, expression: r, range: i, lineStyle: a }) => {
		let o = [], s = G(i, e.xAxis), c = i ? Math.max(s[0], Math.min(...e.xAxis)) : s[0], l = i ? Math.min(s[1], Math.max(...e.xAxis)) : s[1];
		if (i && c > l) return {
			label: n,
			expression: r,
			points: o,
			...a ? { lineStyle: a } : {}
		};
		for (let n = 0; n < e.samples; n += 1) {
			let i = W(c, l, n, e.samples);
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
function q(e) {
	return e.functions.map(({ label: n, xExpression: r, yExpression: i, range: a, lineStyle: o }) => {
		let s = [], c = `{ x = ${r}; y = ${i} }`, l = G(a, e.tAxis);
		for (let n = 0; n < e.samples; n += 1) {
			let a = W(l[0], l[1], n, e.samples);
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
function J(e) {
	return e.functions.map(({ label: n, expression: r, range: i, lineStyle: a }) => {
		let o = [], s = G(i, e.thetaAxis);
		for (let n = 0; n < e.samples; n += 1) {
			let i = W(s[0], s[1], n, e.samples);
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
function Y(e) {
	return e.kind === "xyFunctionGraph" ? K(e) : e.kind === "xyParametricGraph" ? q(e) : e.kind === "xyPolarGraph" ? J(e) : [];
}
var X = "tp-md-xy-plot-styles", Z = !1, Q = "\n.tp-md-xy-plot {\n  position: relative;\n\n  display: block;\n  inline-size: min(100%, 900px);\n  margin-block: 1rem;\n  margin-inline: auto;\n}\n\n.tp-md-xy-plot-preview {\n  inline-size: 100%;\n}\n\n.tp-md-xy-plot svg {\n  display: block;\n  inline-size: 100%;\n  block-size: auto;\n}\n\n.tp-md-xy-plot .tp-md-xy-graph-point {\n  fill: #333;\n  stroke: white;\n  stroke-width: 1.5;\n}\n\n.tp-md-xy-plot .tp-md-xy-graph-point-label {\n  fill: #333;\n  font-size: 12px;\n  font-family: system-ui, sans-serif;\n}\n\n.tp-md-xy-plot-zoom-button {\n  position: absolute;\n  inset-block-start: 0.5rem;\n  inset-inline-end: 0.5rem;\n  z-index: 1;\n\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n\n  padding-block: 0.35rem;\n  padding-inline: 0.65rem;\n\n  border: 1px solid color-mix(in srgb, CanvasText 25%, transparent);\n  border-radius: 999px;\n\n  background: color-mix(in srgb, Canvas 88%, transparent);\n  color: CanvasText;\n\n  font: inherit;\n  font-size: 0.875rem;\n  line-height: 1.2;\n\n  cursor: pointer;\n}\n\n.tp-md-xy-plot-zoom-button:hover {\n  background: color-mix(in srgb, CanvasText 8%, Canvas 92%);\n}\n\n.tp-md-xy-plot-dialog {\n  inline-size: min(96vw, 1200px);\n  max-inline-size: 1200px;\n  max-block-size: 92vh;\n  padding: 1rem;\n\n  border: 1px solid color-mix(in srgb, CanvasText 18%, transparent);\n  border-radius: 1rem;\n\n  background: Canvas;\n  color: CanvasText;\n}\n\n.tp-md-xy-plot-dialog::backdrop {\n  background: color-mix(in srgb, black 55%, transparent);\n}\n\n.tp-md-xy-plot-dialog-header {\n  display: flex;\n  justify-content: flex-end;\n  margin-block-end: 0.75rem;\n}\n\n.tp-md-xy-plot-close-button {\n  padding-block: 0.35rem;\n  padding-inline: 0.65rem;\n\n  border: 1px solid color-mix(in srgb, CanvasText 25%, transparent);\n  border-radius: 999px;\n\n  background: Canvas;\n  color: CanvasText;\n\n  font: inherit;\n  font-size: 0.875rem;\n  line-height: 1.2;\n\n  cursor: pointer;\n}\n\n.tp-md-xy-plot-dialog-content {\n  overflow: auto;\n}\n\n.tp-md-xy-plot-dialog-content svg {\n  inline-size: 100%;\n  min-inline-size: 900px;\n  block-size: auto;\n}\n\n.tp-md-xy-plot-error {\n  margin: 0;\n  padding: 1rem;\n  overflow-x: auto;\n\n  border: 1px solid color-mix(in srgb, red 45%, transparent);\n  border-radius: 0.75rem;\n\n  background: color-mix(in srgb, red 8%, Canvas 92%);\n  color: CanvasText;\n}\n";
function $(t) {
	e(X, Q), ee(), te(t);
}
function ee() {
	Z || typeof document > "u" || (Z = !0, document.addEventListener("click", (e) => {
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
function te(e) {
	let t = e.renderer.rules.fence;
	e.renderer.rules.fence = (e, n, r, i, a) => {
		let o = e[n];
		return o === void 0 ? "" : ie(o.info).name === "xy-plot" ? (o.attrJoin("class", "tp-md-xy-plot"), ne(o, a)) : typeof t == "function" ? t(e, n, r, i, a) : a.renderToken(e, n, r);
	};
}
function ne(e, t) {
	try {
		let n = _(e.content), r = U(n, Y(n));
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
  ${re(n)}
</figure>
`;
	}
}
function re(e) {
	return `
<pre class="tp-md-xy-plot-error" role="alert"><code>${ae(e instanceof Error ? e.message : String(e))}</code></pre>
`;
}
function ie(e) {
	let t = e.trim(), n = t.search(/\s/);
	return n === -1 ? {
		name: t,
		args: ""
	} : {
		name: t.slice(0, n),
		args: t.slice(n + 1).trim()
	};
}
function ae(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
//#endregion
export { $ as default };

//# sourceMappingURL=xy-plot2.js.map