import { dt as e } from "./lib/typescript/typescript.js";
//#region ../../../../../../@tp/tp-markdown/dist/markdown/extensions/xy-plot/index.js
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
	let i = l(t, 1).trim();
	if (i.length === 0) throw Error(`Liste numérique vide : ${e}`);
	return n(i).map((e) => {
		if (e.length === 0) throw Error(`Expression numérique invalide : ${e}`);
		return r(e);
	});
}
function a(e) {
	let t = e.match(/\[(.*)\]/);
	if (!t) throw Error(`Plage invalide : ${e}`);
	let i = n(l(t, 1).trim());
	if (i.length !== 2 || i.some((e) => e.length === 0)) throw Error(`Plage invalide : ${e}`);
	let a = i[0], o = i[1];
	if (a === void 0 || o === void 0) throw Error(`Plage invalide : ${e}`);
	return [r(a), r(o)];
}
function o(e) {
	let t = [], n = "", r = 0;
	for (let i of e) {
		if (i === "[") {
			r > 0 && (n += i), r += 1;
			continue;
		}
		if (i === "]") {
			if (--r, r < 0) throw Error(`Crochet fermant inattendu : ${e}`);
			r === 0 ? (t.push(n.trim()), n = "") : n += i;
			continue;
		}
		if (r === 0) {
			if (i.trim().length === 0 || i === ",") continue;
			throw Error(`Liste de points invalide : ${e}`);
		}
		n += i;
	}
	if (r !== 0) throw Error(`Crochet non fermé : ${e}`);
	return t;
}
function s(e) {
	let t = e.match(/^\s*"([^"]+)"\s*,\s*(.*)\s*$/);
	if (!t) throw Error(`Point invalide : [${e}]`);
	let i = l(t, 1), a = n(l(t, 2));
	if (a.length !== 2 && a.length !== 4 || a.some((e) => e.length === 0)) throw Error(`Point invalide : [${e}]`);
	let o = a[0], s = a[1], c = a[2], u = a[3];
	if (o === void 0 || s === void 0) throw Error(`Point invalide : [${e}]`);
	let d = {
		label: i,
		x: r(o),
		y: r(s)
	};
	return c !== void 0 && u !== void 0 && (d.dx = r(c), d.dy = r(u)), d;
}
function c(e) {
	let t = e.match(/\[(.*)\]/);
	if (!t) throw Error(`Liste de points invalide : ${e}`);
	let n = l(t, 1).trim();
	if (n.length === 0) return [];
	let r = o(n);
	if (r.length === 0) throw Error(`Liste de points invalide : ${e}`);
	return r.map(s);
}
function l(e, t) {
	let n = e[t];
	if (n === void 0) throw Error(`Capture manquante à l'index ${t}`);
	return n;
}
function u(e) {
	let t = e.match(/"([^"]*)"/);
	if (!t) throw Error(`Chaîne invalide : ${e}`);
	return l(t, 1);
}
function d(e) {
	let t = [...e.matchAll(/\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]/g)];
	if (/\bfunctions\s*\[\s*\[/.test(e) && t.length > 0) return t.map((e) => ({
		label: l(e, 1),
		expression: l(e, 2)
	}));
	let n = [...e.matchAll(/"([^"]+)"/g)];
	if (n.length === 0) throw Error(`Liste de fonctions invalide : ${e}`);
	return n.map((e) => {
		let t = l(e, 1);
		return {
			label: t,
			expression: t
		};
	});
}
function f(e) {
	let t = [...e.matchAll(/\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]/g)];
	if (t.length > 0) return t.map((e) => ({
		label: l(e, 1),
		xExpression: l(e, 2),
		yExpression: l(e, 3)
	}));
	let n = [...e.matchAll(/\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]/g)];
	if (n.length === 0) throw Error(`Liste de fonctions paramétriques invalide : ${e}`);
	return n.map((e) => {
		let t = l(e, 1), n = l(e, 2);
		return {
			label: `{ x=${t}; y=${n} }`,
			xExpression: t,
			yExpression: n
		};
	});
}
function p(e) {
	let t = e.split("\n").map((e) => e.trim()).filter((e) => e.length > 0), n = [], r = [], i = 0;
	for (let e of t) {
		let t = [...e.matchAll(/\[/g)].length, a = [...e.matchAll(/\]/g)].length;
		if (r.length > 0 || e.startsWith("functions") || e.startsWith("points")) {
			r.push(e), i += t - a, i === 0 && (n.push(r.join(" ")), r = []);
			continue;
		}
		n.push(e);
	}
	if (r.length > 0) throw Error(`Bloc incomplet : ${r.join(" ")}`);
	return n;
}
function m(e) {
	let t = p(e).map((e) => e.trim()).filter((e) => e.length > 0), n = t[0], r = {
		title: void 0,
		legendX: void 0,
		legendY: void 0,
		xAxis: [-10, 10],
		yAxis: [-10, 10],
		xTicks: void 0,
		yTicks: void 0,
		points: [],
		samples: 512
	}, o = [0, Math.PI * 2], s = [0, Math.PI * 2], l = [], m = [];
	for (let e of t.slice(1)) e.startsWith("title") ? r.title = u(e) : e.startsWith("legend-x") ? r.legendX = u(e) : e.startsWith("legend-y") ? r.legendY = u(e) : e.startsWith("x-axis") ? r.xAxis = a(e) : e.startsWith("y-axis") ? r.yAxis = a(e) : e.startsWith("t-axis") ? n === "xyPolarGraph" ? s = a(e) : o = a(e) : e.startsWith("theta-axis") ? s = a(e) : e.startsWith("samples") ? r.samples = Number(e.replace("samples", "").trim()) : e.startsWith("functions") ? n === "xyParametricGraph" ? m = f(e) : l = d(e) : e.startsWith("points") ? r.points = c(e) : e.startsWith("x-ticks") ? r.xTicks = i(e) : e.startsWith("y-ticks") && (r.yTicks = i(e));
	if (n === "xyFunctionGraph" && l.length === 0) throw Error("Aucune fonction définie");
	if (n === "xyParametricGraph" && m.length === 0) throw Error("Aucune fonction paramétrique définie");
	if (n === "xyPolarGraph" && l.length === 0) throw Error("Aucune fonction polaire définie");
	if (n === "xyFunctionGraph") return {
		...r,
		kind: n,
		functions: l
	};
	if (n === "xyParametricGraph") return {
		...r,
		kind: n,
		tAxis: o,
		functions: m
	};
	if (n === "xyPolarGraph") return {
		...r,
		kind: n,
		thetaAxis: s,
		functions: l
	};
	throw Error(`Type de graphe inconnu : ${n}`);
}
var h = 900, g = {
	left: (h - 520) / 2,
	top: 70,
	right: 710,
	bottom: 590
}, _ = {
	x: g.left,
	y: g.bottom + 70,
	lineHeight: 16,
	itemGap: 8,
	maxCharsPerLine: 100
}, v = {
	radius: 4,
	labelDx: 8,
	labelDy: -8
}, y = 9;
function b(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function x(e) {
	return Math.abs(e) < 1e-10 ? "0" : Number(e.toFixed(2)).toString();
}
function S(e, t, n = y) {
	return n < 2 ? [e] : Array.from({ length: n }, (r, i) => e + (t - e) * i / (n - 1));
}
function C(e) {
	return e.xTicks ?? S(e.xAxis[0], e.xAxis[1]);
}
function w(e) {
	return e.yTicks ?? S(e.yAxis[0], e.yAxis[1]);
}
function T(e, t) {
	let [n, r] = t.xAxis;
	return g.left + (e - n) / (r - n) * (g.right - g.left);
}
function E(e, t) {
	let [n, r] = t.yAxis;
	return g.bottom - (e - n) / (r - n) * (g.bottom - g.top);
}
function D(e, t) {
	return e.x >= t.xAxis[0] && e.x <= t.xAxis[1] && e.y >= t.yAxis[0] && e.y <= t.yAxis[1];
}
function O(e, t) {
	return e.kind === "xyPolarGraph" ? `r = ${t.expression}` : e.kind === "xyParametricGraph" ? t.expression : `y = ${t.expression}`;
}
function k(e, t) {
	let n = O(e, t);
	return t.label === t.expression || t.label === n ? n : `${t.label} : ${n}`;
}
function A(e) {
	if (e.length <= _.maxCharsPerLine) return [e];
	let t = e.replaceAll("; ", ";|").replaceAll(", ", ",|").replaceAll(" }", "|}").replaceAll(" [", "|[").replaceAll(" y=", "|y=").replaceAll(" r=", "|r=").replaceAll(" : ", " : |").split("|").filter((e) => e.length > 0), n = [], r = "";
	for (let e of t) {
		let t = r.length === 0 ? e : `${r} ${e}`;
		t.length > _.maxCharsPerLine && r.length > 0 ? (n.push(r), r = e) : r = t;
	}
	return r.length > 0 && n.push(r), n.flatMap((e) => {
		if (e.length <= _.maxCharsPerLine) return [e];
		let t = [];
		for (let n = 0; n < e.length; n += _.maxCharsPerLine) t.push(e.slice(n, n + _.maxCharsPerLine));
		return t;
	});
}
function j(e, t) {
	return e.points.filter((e) => D(e, t)).map((e, n) => {
		let r = T(e.x, t), i = E(e.y, t);
		return `${n === 0 ? "M" : "L"} ${r.toFixed(2)} ${i.toFixed(2)}`;
	}).join(" ");
}
function M(e) {
	return C(e).map((t) => {
		let n = T(t, e);
		return `
        <g>
          <line
            x1="${n}"
            y1="${g.bottom}"
            x2="${n}"
            y2="${g.bottom + 6}"
            stroke="#666"
          />
          <line
            x1="${n}"
            y1="${g.top}"
            x2="${n}"
            y2="${g.bottom}"
            stroke="#eee"
          />
          <text
            x="${n}"
            y="${g.bottom + 22}"
            text-anchor="middle"
            font-size="11"
          >${x(t)}</text>
        </g>
      `;
	}).join("");
}
function N(e) {
	return w(e).map((t) => {
		let n = E(t, e);
		return `
        <g>
          <line
            x1="${g.left - 6}"
            y1="${n}"
            x2="${g.left}"
            y2="${n}"
            stroke="#666"
          />
          <line
            x1="${g.left}"
            y1="${n}"
            x2="${g.right}"
            y2="${n}"
            stroke="#eee"
          />
          <text
            x="${g.left - 10}"
            y="${n + 4}"
            text-anchor="end"
            font-size="11"
          >${x(t)}</text>
        </g>
      `;
	}).join("");
}
function P(e) {
	return (e.points ?? []).filter((t) => D(t, e)).map((t) => {
		let n = T(t.x, e), r = E(t.y, e), i = t.dx ?? v.labelDx, a = t.dy ?? v.labelDy, o = b(t.label);
		return `
        <g class="tp-md-xy-graph-point-group">
          <title>${b(`${t.label} (${x(t.x)}, ${x(t.y)})`)}</title>
          <circle
            class="tp-md-xy-graph-point"
            cx="${n.toFixed(2)}"
            cy="${r.toFixed(2)}"
            r="${v.radius}"
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
function F(e, t, n) {
	let r = _.y;
	for (let i of t.slice(0, n)) {
		let t = A(k(e, i)).length;
		r += t * _.lineHeight + _.itemGap;
	}
	return r;
}
function I(e, t) {
	return t.map((n, r) => {
		let i = F(e, t, r), a = `hsl(${r * 75 % 360} 70% 40%)`, o = k(e, n), s = A(o).map((e, t) => `
            <text
              x="${_.x + 42}"
              y="${i + 4 + t * _.lineHeight}"
              font-size="12"
            >${b(e)}</text>
          `).join("");
		return `
        <g>
          <title>${b(o)}</title>
          <line
            x1="${_.x}"
            y1="${i}"
            x2="${_.x + 32}"
            y2="${i}"
            stroke="${a}"
            stroke-width="2"
          />
          ${s}
        </g>
      `;
	}).join("");
}
function L(e, t) {
	let n = T(0, e), r = E(0, e), i = t.map((t, n) => `
        <path
          d="${j(t, e)}"
          fill="none"
          stroke="${`hsl(${n * 75 % 360} 70% 40%)`}"
          stroke-width="2"
        />
      `).join(""), a = g.left - 50, o = (g.top + g.bottom) / 2;
	return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${h} ${h}"
      role="img"
    >
      <rect width="100%" height="100%" fill="white" />

      ${e.title ? `<text x="${(g.left + g.right) / 2}" y="28" text-anchor="middle" font-size="36">${b(e.title)}</text>` : ""}

      <rect
        x="${g.left}"
        y="${g.top}"
        width="${g.right - g.left}"
        height="${g.bottom - g.top}"
        fill="none"
        stroke="#999"
      />

      ${M(e)}
      ${N(e)}

      ${e.yAxis[0] <= 0 && e.yAxis[1] >= 0 ? `<line x1="${g.left}" y1="${r}" x2="${g.right}" y2="${r}" stroke="#aaa" />` : ""}

      ${e.xAxis[0] <= 0 && e.xAxis[1] >= 0 ? `<line x1="${n}" y1="${g.top}" x2="${n}" y2="${g.bottom}" stroke="#aaa" />` : ""}

      ${i}
      ${P(e)}

      ${e.legendX ? `<text x="${(g.left + g.right) / 2}" y="${g.bottom + 44}" text-anchor="middle">${b(e.legendX)}</text>` : ""}

      ${e.legendY ? `<text
              x="${a}"
              y="${o}"
              transform="rotate(-90 ${a} ${o})"
              text-anchor="middle"
            >${b(e.legendY)}</text>` : ""}

      ${I(e, t)}
    </svg>
  `;
}
function R(e, t, n, r) {
	return r <= 1 ? e : e + (t - e) * n / (r - 1);
}
function z(e) {
	return e.functions.map(({ label: n, expression: r }) => {
		let i = [];
		for (let n = 0; n < e.samples; n += 1) {
			let a = R(e.xAxis[0], e.xAxis[1], n, e.samples);
			try {
				let e = t(r, { x: a });
				Number.isFinite(e) && i.push({
					x: a,
					y: e
				});
			} catch {}
		}
		return {
			label: n,
			expression: r,
			points: i
		};
	});
}
function B(e) {
	return e.functions.map(({ label: n, xExpression: r, yExpression: i }) => {
		let a = [], o = `{ x = ${r}; y = ${i} }`;
		for (let n = 0; n < e.samples; n += 1) {
			let o = R(e.tAxis[0], e.tAxis[1], n, e.samples);
			try {
				let e = t(r, { t: o }), n = t(i, { t: o });
				Number.isFinite(e) && Number.isFinite(n) && a.push({
					x: e,
					y: n
				});
			} catch {}
		}
		return {
			label: n,
			expression: o,
			points: a
		};
	});
}
function V(e) {
	return e.functions.map(({ label: n, expression: r }) => {
		let i = [];
		for (let n = 0; n < e.samples; n += 1) {
			let a = R(e.thetaAxis[0], e.thetaAxis[1], n, e.samples);
			try {
				let e = t(r, { t: a }), n = e * Math.cos(a), o = e * Math.sin(a);
				Number.isFinite(n) && Number.isFinite(o) && i.push({
					x: n,
					y: o
				});
			} catch {}
		}
		return {
			label: n,
			expression: r,
			points: i
		};
	});
}
function H(e) {
	return e.kind === "xyFunctionGraph" ? z(e) : e.kind === "xyParametricGraph" ? B(e) : e.kind === "xyPolarGraph" ? V(e) : [];
}
var U = "tp-md-xy-plot-styles", W = !1, G = "\n.tp-md-xy-plot {\n  position: relative;\n\n  display: block;\n  inline-size: min(100%, 900px);\n  margin-block: 1rem;\n  margin-inline: auto;\n}\n\n.tp-md-xy-plot-preview {\n  inline-size: 100%;\n}\n\n.tp-md-xy-plot svg {\n  display: block;\n  inline-size: 100%;\n  block-size: auto;\n}\n\n.tp-md-xy-plot .tp-md-xy-graph-point {\n  fill: #333;\n  stroke: white;\n  stroke-width: 1.5;\n}\n\n.tp-md-xy-plot .tp-md-xy-graph-point-label {\n  fill: #333;\n  font-size: 12px;\n  font-family: system-ui, sans-serif;\n}\n\n.tp-md-xy-plot-zoom-button {\n  position: absolute;\n  inset-block-start: 0.5rem;\n  inset-inline-end: 0.5rem;\n  z-index: 1;\n\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n\n  padding-block: 0.35rem;\n  padding-inline: 0.65rem;\n\n  border: 1px solid color-mix(in srgb, CanvasText 25%, transparent);\n  border-radius: 999px;\n\n  background: color-mix(in srgb, Canvas 88%, transparent);\n  color: CanvasText;\n\n  font: inherit;\n  font-size: 0.875rem;\n  line-height: 1.2;\n\n  cursor: pointer;\n}\n\n.tp-md-xy-plot-zoom-button:hover {\n  background: color-mix(in srgb, CanvasText 8%, Canvas 92%);\n}\n\n.tp-md-xy-plot-dialog {\n  inline-size: min(96vw, 1200px);\n  max-inline-size: 1200px;\n  max-block-size: 92vh;\n  padding: 1rem;\n\n  border: 1px solid color-mix(in srgb, CanvasText 18%, transparent);\n  border-radius: 1rem;\n\n  background: Canvas;\n  color: CanvasText;\n}\n\n.tp-md-xy-plot-dialog::backdrop {\n  background: color-mix(in srgb, black 55%, transparent);\n}\n\n.tp-md-xy-plot-dialog-header {\n  display: flex;\n  justify-content: flex-end;\n  margin-block-end: 0.75rem;\n}\n\n.tp-md-xy-plot-close-button {\n  padding-block: 0.35rem;\n  padding-inline: 0.65rem;\n\n  border: 1px solid color-mix(in srgb, CanvasText 25%, transparent);\n  border-radius: 999px;\n\n  background: Canvas;\n  color: CanvasText;\n\n  font: inherit;\n  font-size: 0.875rem;\n  line-height: 1.2;\n\n  cursor: pointer;\n}\n\n.tp-md-xy-plot-dialog-content {\n  overflow: auto;\n}\n\n.tp-md-xy-plot-dialog-content svg {\n  inline-size: 100%;\n  min-inline-size: 900px;\n  block-size: auto;\n}\n\n.tp-md-xy-plot-error {\n  margin: 0;\n  padding: 1rem;\n  overflow-x: auto;\n\n  border: 1px solid color-mix(in srgb, red 45%, transparent);\n  border-radius: 0.75rem;\n\n  background: color-mix(in srgb, red 8%, Canvas 92%);\n  color: CanvasText;\n}\n";
function K(t) {
	e(U, G), q(), J(t);
}
function q() {
	W || typeof document > "u" || (W = !0, document.addEventListener("click", (e) => {
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
function J(e) {
	let t = e.renderer.rules.fence;
	e.renderer.rules.fence = (e, n, r, i, a) => {
		let o = e[n];
		return o === void 0 ? "" : Z(o.info).name === "xy-plot" ? (o.attrJoin("class", "tp-md-xy-plot"), Y(o, a)) : typeof t == "function" ? t(e, n, r, i, a) : a.renderToken(e, n, r);
	};
}
function Y(e, t) {
	try {
		let n = m(e.content), r = L(n, H(n));
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
  ${X(n)}
</figure>
`;
	}
}
function X(e) {
	return `
<pre class="tp-md-xy-plot-error" role="alert"><code>${Q(e instanceof Error ? e.message : String(e))}</code></pre>
`;
}
function Z(e) {
	let t = e.trim(), n = t.search(/\s/);
	return n === -1 ? {
		name: t,
		args: ""
	} : {
		name: t.slice(0, n),
		args: t.slice(n + 1).trim()
	};
}
function Q(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
//#endregion
export { K as default };

