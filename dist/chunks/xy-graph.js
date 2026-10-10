//#region ../tp-utilities/dist/xy-graph/safe-math.js
function e(e, t) {
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
//#endregion
//#region ../tp-utilities/dist/xy-graph/xy-graph-parser.js
function t(e) {
	let t = [], n = "", r = 0;
	for (let i of e) {
		if (i === "(") r += 1;
		else if (i === ")" && (--r, r < 0)) throw Error(`Parenthèse fermante inattendue : ${e}`);
		i === "," && r === 0 ? (t.push(n.trim()), n = "") : n += i;
	}
	if (r !== 0) throw Error(`Parenthèse non fermée : ${e}`);
	return t.push(n.trim()), t;
}
function n(t) {
	try {
		return e(t, {});
	} catch {
		throw Error(`Expression numérique invalide : ${t}`);
	}
}
function r(e) {
	let r = e.match(/\[(.*)\]/);
	if (!r) throw Error(`Liste numérique invalide : ${e}`);
	let i = u(r, 1).trim();
	if (i.length === 0) throw Error(`Liste numérique vide : ${e}`);
	return t(i).map((e) => {
		if (e.length === 0) throw Error(`Expression numérique invalide : ${e}`);
		return n(e);
	});
}
function i(e) {
	let r = e.match(/\[(.*)\]/);
	if (!r) throw Error(`Plage invalide : ${e}`);
	let i = t(u(r, 1).trim());
	if (i.length !== 2 || i.some((e) => e.length === 0)) throw Error(`Plage invalide : ${e}`);
	let a = i[0], o = i[1];
	if (a === void 0 || o === void 0) throw Error(`Plage invalide : ${e}`);
	return [n(a), n(o)];
}
function a(e) {
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
function o(e) {
	let r = e.match(/^\s*"([^"]+)"\s*,\s*(.*)\s*$/);
	if (!r) throw Error(`Point invalide : [${e}]`);
	let i = u(r, 1), a = t(u(r, 2));
	if (a.length !== 2 && a.length !== 4 || a.some((e) => e.length === 0)) throw Error(`Point invalide : [${e}]`);
	let o = a[0], s = a[1], c = a[2], l = a[3];
	if (o === void 0 || s === void 0) throw Error(`Point invalide : [${e}]`);
	let d = {
		label: i,
		x: n(o),
		y: n(s)
	};
	return c !== void 0 && l !== void 0 && (d.dx = n(c), d.dy = n(l)), d;
}
function s(e) {
	let t = e.match(/\[(.*)\]/);
	if (!t) throw Error(`Liste de points invalide : ${e}`);
	let n = u(t, 1).trim();
	if (n.length === 0) return [];
	let r = a(n);
	if (r.length === 0) throw Error(`Liste de points invalide : ${e}`);
	return r.map(o);
}
function c(e) {
	if (e === "solid" || e === "dashed" || e === "dotted" || e === "dash-dot") return e;
	throw Error(`Style de trait invalide : ${e}`);
}
function l(e) {
	let r = /^vectors\s*\[([\s\S]*)\]$/.exec(e);
	if (!r) throw Error(`Liste de vecteurs invalide : ${e}`);
	return a(u(r, 1)).map((e) => {
		let r = /^"([^"]+)"\s*,\s*(.*)$/.exec(e);
		if (!r) throw Error(`Vecteur invalide : ${e}`);
		let i = t(u(r, 2));
		if (i.length !== 4 && i.length !== 5) throw Error(`Vecteur invalide : ${e}`);
		let [a, o, s, l] = i.slice(0, 4).map(n);
		if (a === void 0 || o === void 0 || s === void 0 || l === void 0 || ![
			a,
			o,
			s,
			l,
			a + s,
			o + l
		].every(Number.isFinite)) throw Error(`Vecteur invalide : ${e}`);
		let d = i[4], f = d === void 0 ? void 0 : /^"([^"]+)"$/.exec(d);
		if (d !== void 0 && !f) throw Error(`Style de trait invalide : ${d}`);
		return {
			label: u(r, 1),
			x: a,
			y: o,
			dx: s,
			dy: l,
			...f ? { lineStyle: c(u(f, 1)) } : {}
		};
	});
}
function u(e, t) {
	let n = e[t];
	if (n === void 0) throw Error(`Capture manquante à l'index ${t}`);
	return n;
}
function d(e) {
	let t = e.match(/"([^"]*)"/);
	if (!t) throw Error(`Chaîne invalide : ${e}`);
	return u(t, 1);
}
function f(e) {
	let t = [], n = e.trim();
	for (; n.startsWith("\"");) {
		let r = n.match(/^"([^"]+)"\s*(?:,\s*|$)/);
		if (!r || (t.push(u(r, 1)), n = n.slice(r[0].length).trim(), r[0].trim().endsWith(",") && n.length === 0)) throw Error(`Fonction invalide : [${e}]`);
	}
	if (n.length === 0) return { values: t };
	if (!/^\[[^[\]]*\]$/.test(n)) throw Error(`Intervalle de fonction invalide : ${n}`);
	let r = i(n);
	if (!r.every(Number.isFinite) || r[0] >= r[1]) throw Error(`Intervalle de fonction invalide : ${n}`);
	return {
		values: t,
		range: r
	};
}
function p(e) {
	let t = e.match(/^functions\s*\[([\s\S]*)\]$/);
	if (!t) throw Error(`Liste de fonctions invalide : ${e}`);
	let n = u(t, 1).trim();
	if (n.startsWith("[")) return a(n).map((e) => {
		let { values: t, range: n } = f(e);
		if (t.length !== 2 && t.length !== 3) throw Error(`Fonction invalide : [${e}]`);
		return {
			label: u(t, 0),
			expression: u(t, 1),
			...t.length === 3 ? { lineStyle: c(u(t, 2)) } : {},
			...n ? { range: n } : {}
		};
	});
	let { values: r, range: i } = f(n);
	if (n.length === 0) return [];
	if (!r.length || i) throw Error(`Liste de fonctions invalide : ${e}`);
	return r.map((e) => ({
		label: e,
		expression: e
	}));
}
function m(e) {
	let t = e.match(/^functions\s*\[([\s\S]*)\]$/);
	if (!t) throw Error(`Liste de fonctions paramétriques invalide : ${e}`);
	return a(u(t, 1)).map((e) => {
		let { values: t, range: n } = f(e), r = t.length === 4 ? c(t.pop() ?? "") : void 0;
		if (t.length !== 2 && t.length !== 3) throw Error(`Fonction paramétrique invalide : [${e}]`);
		let i = u(t, t.length - 2), a = u(t, t.length - 1);
		return {
			label: t.length === 3 ? u(t, 0) : `{ x=${i}; y=${a} }`,
			...r ? { lineStyle: r } : {},
			xExpression: i,
			yExpression: a,
			...n ? { range: n } : {}
		};
	});
}
function h(e) {
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
function g(e) {
	let t = h(e).map((e) => e.trim()).filter((e) => e.length > 0), a = t[0], o = {
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
	}, c = [0, Math.PI * 2], u = [0, Math.PI * 2], f = [], g = [];
	for (let e of t.slice(1)) if (e.startsWith("title")) o.title = d(e);
	else if (e.startsWith("legend-x")) o.legendX = d(e);
	else if (e.startsWith("legend-y")) o.legendY = d(e);
	else if (e.startsWith("grid")) {
		let t = e.slice(4).trim();
		if (t !== "both" && t !== "horizontal" && t !== "vertical" && t !== "none") throw Error(`Grille invalide : ${t}`);
		o.grid = t;
	} else if (e.startsWith("x-axis-at")) o.xAxisAt = n(e.slice(9).trim());
	else if (e.startsWith("y-axis-at")) o.yAxisAt = n(e.slice(9).trim());
	else if (e.startsWith("x-axis")) o.xAxis = i(e);
	else if (e.startsWith("y-axis")) o.yAxis = i(e);
	else if (e.startsWith("t-axis")) a === "xyPolarGraph" ? u = i(e) : c = i(e);
	else if (e.startsWith("theta-axis")) u = i(e);
	else if (e.startsWith("samples")) o.samples = Number(e.replace("samples", "").trim());
	else if (e.startsWith("functions")) a === "xyParametricGraph" ? g = m(e) : f = p(e);
	else if (/^anim\s/.test(e)) {
		let t = JSON.parse(e.slice(4).trim());
		if (!Array.isArray(t) || t.some((e) => typeof e != "string" || !e.trim()) || new Set(t).size !== t.length) throw Error("anim requires a list of unique, nonempty names.");
		o.anim = t;
	} else e.startsWith("vectors") ? o.vectors = l(e) : e.startsWith("points") ? o.points = s(e) : e.startsWith("x-ticks") ? o.xTicks = r(e) : e.startsWith("y-ticks") && (o.yTicks = r(e));
	let _ = new Set([
		...f,
		...g,
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
	if (a === "xyFunctionGraph" && f.length === 0 && !o.vectors?.length) throw Error("Aucune fonction définie");
	if (a === "xyParametricGraph" && g.length === 0 && !o.vectors?.length) throw Error("Aucune fonction paramétrique définie");
	if (a === "xyPolarGraph" && f.length === 0 && !o.vectors?.length) throw Error("Aucune fonction polaire définie");
	if (a === "xyFunctionGraph") return {
		...o,
		kind: a,
		functions: f
	};
	if (a === "xyParametricGraph") return {
		...o,
		kind: a,
		tAxis: c,
		functions: g
	};
	if (a === "xyPolarGraph") return {
		...o,
		kind: a,
		thetaAxis: u,
		functions: f
	};
	throw Error(`Type de graphe inconnu : ${a}`);
}
//#endregion
//#region ../tp-utilities/dist/xy-graph/xy-graph-renderer.js
function _(e = "solid") {
	switch (e) {
		case "solid": return "";
		case "dashed": return "stroke-dasharray=\"6 4\"";
		case "dotted": return "stroke-dasharray=\"0 5\" stroke-linecap=\"round\"";
		case "dash-dot": return "stroke-dasharray=\"6 4 0 4\" stroke-linecap=\"round\"";
		default: throw Error(`Style de trait invalide : ${e}`);
	}
}
var v = 900, y = 520, b = {
	left: (v - y) / 2,
	top: 70,
	right: 710,
	bottom: 590
}, x = {
	x: b.left,
	y: b.bottom + 70,
	lineHeight: 16,
	itemGap: 8,
	maxCharsPerLine: 100
}, S = {
	radius: 4,
	labelDx: 8,
	labelDy: -8
}, C = 9;
function w(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function T(e) {
	return Math.abs(e) < 1e-10 ? "0" : Number(e.toFixed(2)).toString();
}
function E(e, t, n = C) {
	return n < 2 ? [e] : Array.from({ length: n }, (r, i) => e + (t - e) * i / (n - 1));
}
function D(e) {
	return e.xTicks ?? E(e.xAxis[0], e.xAxis[1]);
}
function O(e) {
	return e.yTicks ?? E(e.yAxis[0], e.yAxis[1]);
}
function k(e, t) {
	let [n, r] = t.xAxis;
	return b.left + (e - n) / (r - n) * (b.right - b.left);
}
function A(e, t) {
	let [n, r] = t.yAxis;
	return b.bottom - (e - n) / (r - n) * (b.bottom - b.top);
}
function j(e, t) {
	return e.x >= t.xAxis[0] && e.x <= t.xAxis[1] && e.y >= t.yAxis[0] && e.y <= t.yAxis[1];
}
function M(e, t) {
	return e.kind === "xyPolarGraph" ? `r = ${t.expression}` : e.kind === "xyParametricGraph" ? t.expression : `y = ${t.expression}`;
}
function N(e, t) {
	let n = M(e, t);
	return t.label === t.expression || t.label === n ? n : `${t.label} : ${n}`;
}
function P(e) {
	if (e.length <= x.maxCharsPerLine) return [e];
	let t = e.replaceAll("; ", ";|").replaceAll(", ", ",|").replaceAll(" }", "|}").replaceAll(" [", "|[").replaceAll(" y=", "|y=").replaceAll(" r=", "|r=").replaceAll(" : ", " : |").split("|").filter((e) => e.length > 0), n = [], r = "";
	for (let e of t) {
		let t = r.length === 0 ? e : `${r} ${e}`;
		t.length > x.maxCharsPerLine && r.length > 0 ? (n.push(r), r = e) : r = t;
	}
	return r.length > 0 && n.push(r), n.flatMap((e) => {
		if (e.length <= x.maxCharsPerLine) return [e];
		let t = [];
		for (let n = 0; n < e.length; n += x.maxCharsPerLine) t.push(e.slice(n, n + x.maxCharsPerLine));
		return t;
	});
}
function F(e, t) {
	return e.points.filter((e) => j(e, t)).map((e, n) => {
		let r = k(e.x, t), i = A(e.y, t);
		return `${n === 0 ? "M" : "L"} ${r.toFixed(2)} ${i.toFixed(2)}`;
	}).join(" ");
}
function I(e) {
	let t = e.xAxisAt === void 0 ? b.bottom : A(e.xAxisAt, e), n = e.grid ?? "both";
	return D(e).map((r) => {
		let i = k(r, e);
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
            y1="${b.top}"
            x2="${i}"
            y2="${b.bottom}"
            data-xy-grid="vertical" stroke="#eee"
          />
          ` : ""}
          <text data-xy-axis="horizontal"
            x="${i}"
            y="${t + 22}"
            text-anchor="middle"
            font-size="11"
          >${T(r)}</text>
        </g>
      `;
	}).join("");
}
function L(e) {
	let t = e.yAxisAt === void 0 ? b.left : k(e.yAxisAt, e), n = e.grid ?? "both";
	return O(e).map((r) => {
		let i = A(r, e);
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
            x1="${b.left}"
            y1="${i}"
            x2="${b.right}"
            y2="${i}"
            data-xy-grid="horizontal" stroke="#eee"
          />
          ` : ""}
          <text data-xy-axis="vertical"
            x="${t - 10}"
            y="${i + 4}"
            text-anchor="end"
            font-size="11"
          >${T(r)}</text>
        </g>
      `;
	}).join("");
}
function R(e) {
	return (e.points ?? []).filter((t) => j(t, e)).map((t) => {
		let n = k(t.x, e), r = A(t.y, e), i = t.dx ?? S.labelDx, a = t.dy ?? S.labelDy, o = w(t.label);
		return `
        <g class="tp-md-xy-graph-point-group" data-xy-object="${o}">
          <title>${w(`${t.label} (${T(t.x)}, ${T(t.y)})`)}</title>
          <circle
            class="tp-md-xy-graph-point"
            cx="${n.toFixed(2)}"
            cy="${r.toFixed(2)}"
            r="${S.radius}"
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
function z(e, t) {
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
		let c = k(i, e), l = A(a, e), u = k(i + o, e), d = A(a + s, e), f = Math.hypot(u - c, d - l), p = Math.atan2(d - l, u - c) * 180 / Math.PI, m = Math.min(10, f / 2), h = `hsl(${(t + r) * 75 % 360} 70% 40%)`, g = _(n.lineStyle);
		return `<g data-xy-object="${w(n.label)}" class="tp-md-xy-graph-vector" fill="${h}" stroke="${h}">
   <title>${w(`${n.label}: (${i}, ${a}) → (${i + o}, ${a + s})`)}</title>
   ${f === 0 ? `<circle cx="${c}" cy="${l}" r="3" />` : `<line x1="${c}" y1="${l}" x2="${u}" y2="${d}" stroke-width="2" ${g}/>
   <path d="M 0 0 L ${-m} ${-m / 2} L ${-m} ${m / 2} Z" transform="translate(${u} ${d}) rotate(${p})" stroke="none" />`}
   <text x="${u + 8}" y="${d - 8}" font-size="12" stroke="none">${w(n.label)}</text>
  </g>`;
	}).join("");
	return `<svg x="${b.left}" y="${b.top}" width="${y}" height="${y}" viewBox="${b.left} ${b.top} ${y} ${y}" overflow="hidden">${n}</svg>`;
}
function B(e, t, n) {
	let r = x.y;
	for (let i of t.slice(0, n)) {
		let t = P(N(e, i)).length;
		r += t * x.lineHeight + x.itemGap;
	}
	return r;
}
function V(e, t) {
	return t.map((n, r) => {
		let i = B(e, t, r), a = `hsl(${r * 75 % 360} 70% 40%)`, o = N(e, n), s = P(o).map((e, t) => `
            <text
              x="${x.x + 42}"
              y="${i + 4 + t * x.lineHeight}"
              font-size="12"
            >${w(e)}</text>
          `).join("");
		return `
        <g data-xy-legend data-xy-object="${w(n.label)}">
          <title>${w(o)}</title>
          <line
            x1="${x.x}"
            y1="${i}"
            x2="${x.x + 32}"
            y2="${i}"
            stroke="${a}"
            stroke-width="2"
            ${_(n.lineStyle)}
          />
          ${s}
        </g>
      `;
	}).join("");
}
function H(e, t) {
	let n = e.xAxisAt ?? 0, r = e.yAxisAt ?? 0;
	for (let [t, n] of [[e.xAxisAt, e.yAxis], [e.yAxisAt, e.xAxis]]) if (t !== void 0 && (!Number.isFinite(t) || t < Math.min(...n) || t > Math.max(...n))) throw Error("Position d'axe hors du domaine du graphe");
	let i = k(r, e), a = A(n, e), o = e.yAxisAt === void 0 ? b.left : i, s = e.xAxisAt === void 0 ? b.bottom : a, c = t.map((t, n) => {
		let r = F(t, e), i = `hsl(${n * 75 % 360} 70% 40%)`;
		return `
        <path data-xy-object="${w(t.label)}"
          d="${r}"
          fill="none"
          stroke="${i}"
          stroke-width="2"
            ${_(t.lineStyle)}
        />
      `;
	}).join(""), l = o - 50, u = (b.top + b.bottom) / 2;
	return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${v} ${v}"
      role="img"
    >
      <rect width="100%" height="100%" fill="white" />

      ${e.title ? `<text x="${(b.left + b.right) / 2}" y="28" text-anchor="middle" font-size="36">${w(e.title)}</text>` : ""}

      <rect
        x="${b.left}"
        y="${b.top}"
        width="${b.right - b.left}"
        height="${b.bottom - b.top}"
        fill="none"
        stroke="#999"
      />

      ${I(e)}
      ${L(e)}

      ${e.yAxis[0] <= n && e.yAxis[1] >= n ? `<line data-xy-axis="horizontal" x1="${b.left}" y1="${a}" x2="${b.right}" y2="${a}" stroke="#aaa" />` : ""}

      ${e.xAxis[0] <= r && e.xAxis[1] >= r ? `<line data-xy-axis="vertical" x1="${i}" y1="${b.top}" x2="${i}" y2="${b.bottom}" stroke="#aaa" />` : ""}

      ${c}
      ${z(e, t.length)}
      ${R(e)}

      ${e.legendX ? `<text data-xy-axis="horizontal" x="${(b.left + b.right) / 2}" y="${s + 44}" text-anchor="middle">${w(e.legendX)}</text>` : ""}

      ${e.legendY ? `<text data-xy-axis="vertical"
              x="${l}"
              y="${u}"
              transform="rotate(-90 ${l} ${u})"
              text-anchor="middle"
            >${w(e.legendY)}</text>` : ""}

      ${V(e, t)}
    </svg>
  `;
}
//#endregion
export { g as n, e as r, H as t };

//# sourceMappingURL=xy-graph.js.map