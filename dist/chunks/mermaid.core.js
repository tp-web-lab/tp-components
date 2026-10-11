import { t as e } from "./purify.es.js";
import { n as t } from "./chunk-Y2CYZVJY.js";
import { h as n, m as r, p as i } from "./src.js";
import { C as a, E as o, I as s, L as c, N as l, P as u, Q as d, S as f, T as p, V as m, W as h, X as g, Z as _, _ as v, b as y, c as b, g as x, l as S, m as C, n as w, p as T, q as ee, r as te, t as ne, u as E } from "./chunk-WYO6CB5R.js";
import { S as re, a as ie, f as ae, g as D, h as oe, i as se, o as ce, v as le, x as ue, y as de } from "./chunk-ICXQ74PX.js";
import { t as fe } from "./chunk-VAUOI2AC.js";
import { r as pe } from "./chunk-HOUHSVGY.js";
import { r as me } from "./chunk-Q4XR5HBZ.js";
import "./chunk-7BUUIJ7U.js";
import "./chunk-OGEWGWER.js";
import "./chunk-C7G6YPKG.js";
import "./chunk-ZGVPDNZ5.js";
import "./chunk-52WLFC77.js";
import { n as he } from "./chunk-FWX5IMBZ.js";
import { n as ge, t as _e } from "./chunk-ZIRB5QZD.js";
//#region ../node_modules/.pnpm/es-toolkit@1.50.0/node_modules/es-toolkit/dist/compat/_internal/isPrototype.mjs
function ve(e) {
	let t = e?.constructor;
	return e === (typeof t == "function" ? t.prototype : Object.prototype);
}
//#endregion
//#region ../node_modules/.pnpm/es-toolkit@1.50.0/node_modules/es-toolkit/dist/compat/predicate/isEmpty.mjs
function ye(e) {
	if (e == null) return !0;
	if (ue(e)) return typeof e.splice != "function" && typeof e != "string" && !re(e) && !le(e) && !de(e) ? !1 : e.length === 0;
	if (typeof e == "object" || typeof e == "function") {
		if (e instanceof Map || e instanceof Set) return e.size === 0;
		let t = Object.keys(e);
		return ve(e) ? t.filter((e) => e !== "constructor").length === 0 : t.length === 0;
	}
	return !0;
}
//#endregion
//#region ../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Enum.js
var O = "comm", be = "rule", xe = "decl", Se = "@import", Ce = "@namespace", we = "@keyframes", Te = "@layer", Ee = Math.abs, k = String.fromCharCode;
function De(e) {
	return e.trim();
}
function A(e, t, n) {
	return e.replace(t, n);
}
function j(e, t) {
	return e.charCodeAt(t) | 0;
}
function M(e, t, n) {
	return e.slice(t, n);
}
function N(e) {
	return e.length;
}
function Oe(e) {
	return e.length;
}
function P(e, t) {
	return t.push(e), e;
}
//#endregion
//#region ../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Tokenizer.js
var F = 1, I = 1, ke = 0, L = 0, R = 0, z = "";
function B(e, t, n, r, i, a, o, s) {
	return {
		value: e,
		root: t,
		parent: n,
		type: r,
		props: i,
		children: a,
		line: F,
		column: I,
		length: o,
		return: "",
		siblings: s
	};
}
function Ae() {
	return R;
}
function je() {
	return R = L > 0 ? j(z, --L) : 0, I--, R === 10 && (I = 1, F--), R;
}
function V() {
	return R = L < ke ? j(z, L++) : 0, I++, R === 10 && (I = 1, F++), R;
}
function H() {
	return j(z, L);
}
function U() {
	return L;
}
function W(e, t) {
	return M(z, e, t);
}
function G(e) {
	switch (e) {
		case 0:
		case 9:
		case 10:
		case 13:
		case 32: return 5;
		case 33:
		case 43:
		case 44:
		case 47:
		case 62:
		case 64:
		case 126:
		case 59:
		case 123:
		case 125: return 4;
		case 58: return 3;
		case 34:
		case 39:
		case 40:
		case 91: return 2;
		case 41:
		case 93: return 1;
	}
	return 0;
}
function Me(e) {
	return F = I = 1, ke = N(z = e), L = 0, [];
}
function Ne(e) {
	return z = "", e;
}
function Pe(e) {
	return De(W(L - 1, Le(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function Fe(e) {
	for (; (R = H()) && R < 33;) V();
	return G(e) > 2 || G(R) > 3 ? "" : " ";
}
function Ie(e, t) {
	for (; --t && V() && !(R < 48 || R > 102 || R > 57 && R < 65 || R > 70 && R < 97););
	return W(e, U() + (t < 6 && H() == 32 && V() == 32));
}
function Le(e) {
	for (; V();) switch (R) {
		case e: return L;
		case 34:
		case 39:
			e !== 34 && e !== 39 && Le(R);
			break;
		case 40:
			e === 41 && Le(e);
			break;
		case 92:
			V();
			break;
	}
	return L;
}
function Re(e, t) {
	for (; V() && e + R !== 57 && !(e + R === 84 && H() === 47););
	return "/*" + W(t, L - 1) + "*" + k(e === 47 ? e : V());
}
function ze(e) {
	for (; !G(H());) V();
	return W(e, L);
}
//#endregion
//#region ../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Parser.js
function Be(e) {
	return Ne(K("", null, null, null, [""], e = Me(e), 0, [0], e));
}
function K(e, t, n, r, i, a, o, s, c) {
	for (var l = 0, u = 0, d = o, f = 0, p = 0, m = 0, h = 1, g = 1, _ = 1, v = 0, y = 0, b = "", x = i, S = a, C = r, w = b; g;) switch (m = y, y = V()) {
		case 40:
			m != 108 && j(w, d - 1) == 58 ? (v++, w += "(") : w += Pe(y);
			break;
		case 41:
			v--, w += ")";
			break;
		case 34:
		case 39:
		case 91:
			w += Pe(y);
			break;
		case 9:
		case 10:
		case 13:
		case 32:
			if (v > 0) {
				w += k(y);
				break;
			}
			w += Fe(m);
			break;
		case 92:
			w += Ie(U() - 1, 7);
			continue;
		case 47:
			switch (H()) {
				case 42:
				case 47:
					P(He(Re(V(), U()), t, n, c), c), (G(m || 1) == 5 || G(H() || 1) == 5) && N(w) && M(w, -1, void 0) !== " " && (w += " ");
					break;
				default: w += "/";
			}
			break;
		case 123 * h: s[l++] = N(w) * _;
		case 125 * h:
		case 59:
		case 0:
			if (v > 0 && y) {
				w += k(y);
				break;
			}
			switch (y) {
				case 0:
				case 125: g = 0;
				case 59 + u:
					_ == -1 && (w = A(w, /\f/g, "")), p > 0 && (N(w) - d || h === 0) && P(p > 32 ? Ue(w + ";", r, n, d - 1, c) : Ue(A(w, " ", "") + ";", r, n, d - 2, c), c);
					break;
				case 59: w += ";";
				default: if (P(C = Ve(w, t, n, l, u, i, s, b, x = [], S = [], d, a), a), y === 123) if (u === 0) K(w, t, C, C, x, a, d, s, S);
				else {
					switch (f) {
						case 99: if (j(w, 3) === 110) break;
						case 108: if (j(w, 2) === 97) break;
						default: u = 0;
						case 100:
						case 109:
						case 115:
					}
					u ? K(e, C, C, r && P(Ve(e, C, C, 0, 0, i, s, b, i, x = [], d, S), S), i, S, d, s, r ? x : S) : K(w, C, C, C, [""], S, 0, s, S);
				}
			}
			l = u = p = 0, h = _ = 1, b = w = "", d = o;
			break;
		case 58: d = 1 + N(w), p = m;
		default:
			if (h < 1) {
				if (y == 123) --h;
				else if (y == 125 && h++ == 0 && je() == 125) continue;
			}
			switch (w += k(y), y * h) {
				case 38:
					_ = u > 0 ? 1 : (w += "\f", -1);
					break;
				case 44:
					if (v > 0) break;
					s[l++] = (N(w) - 1) * _, _ = 1;
					break;
				case 64:
					H() === 45 && (w += Pe(V())), f = H(), u = d = N(b = w += ze(U())), y++;
					break;
				case 45: m === 45 && N(w) == 2 && (h = 0);
			}
	}
	return a;
}
function Ve(e, t, n, r, i, a, o, s, c, l, u, d) {
	for (var f = i - 1, p = i === 0 ? a : [""], m = Oe(p), h = 0, g = 0, _ = 0; h < r; ++h) for (var v = 0, y = M(e, f + 1, f = Ee(g = o[h])), b = e; v < m; ++v) (b = De(g > 0 ? p[v] + " " + y : A(y, /&\f/g, p[v]))) && (c[_++] = b);
	return B(e, t, n, i === 0 ? be : s, c, l, u, d);
}
function He(e, t, n, r) {
	return B(e, t, n, O, k(Ae()), M(e, 2, -2), 0, r);
}
function Ue(e, t, n, r, i) {
	return B(e, t, n, xe, M(e, 0, r), M(e, r + 1, -1), r, i);
}
//#endregion
//#region ../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Serializer.js
function q(e, t) {
	for (var n = "", r = 0; r < e.length; r++) n += t(e[r], r, e, t) || "";
	return n;
}
function We(e, t, n, r) {
	switch (e.type) {
		case Te: if (e.children.length) break;
		case Se:
		case Ce:
		case xe: return e.return = e.return || e.value;
		case O: return "";
		case we: return e.return = e.value + "{" + q(e.children, r) + "}";
		case be: if (!N(e.value = e.props.join(","))) return "";
	}
	return N(n = q(e.children, r)) ? e.return = e.value + "{" + n + "}" : "";
}
//#endregion
//#region ../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Middleware.js
function Ge(e) {
	var t = Oe(e);
	return function(n, r, i, a) {
		for (var o = "", s = 0; s < t; s++) o += e[s](n, r, i, a) || "";
		return o;
	};
}
//#endregion
//#region ../node_modules/.pnpm/mermaid@11.16.0/node_modules/mermaid/dist/mermaid.core.mjs
var Ke = "c4", qe = {
	id: Ke,
	detector: /* @__PURE__ */ t((e) => /^\s*C4Context|C4Container|C4Component|C4Dynamic|C4Deployment/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./c4Diagram-LMCZKHZV.js");
		return {
			id: Ke,
			diagram: e
		};
	}, "loader")
}, Je = "flowchart", Ye = {
	id: Je,
	detector: /* @__PURE__ */ t((e, t) => t?.flowchart?.defaultRenderer === "dagre-wrapper" || t?.flowchart?.defaultRenderer === "elk" ? !1 : /^\s*graph/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./flowDiagram-23GEKE2U.js");
		return {
			id: Je,
			diagram: e
		};
	}, "loader")
}, Xe = "flowchart-v2", Ze = {
	id: Xe,
	detector: /* @__PURE__ */ t((e, t) => t?.flowchart?.defaultRenderer === "dagre-d3" ? !1 : (t?.flowchart?.defaultRenderer === "elk" && (t.layout = "elk"), /^\s*graph/.test(e) && t?.flowchart?.defaultRenderer === "dagre-wrapper" ? !0 : /^\s*flowchart/.test(e)), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./flowDiagram-23GEKE2U.js");
		return {
			id: Xe,
			diagram: e
		};
	}, "loader")
}, Qe = "swimlane", $e = {
	id: Qe,
	detector: /* @__PURE__ */ t((e) => /^\s*swimlane-beta\b/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./swimlanesDiagram-G3AALYLV.js");
		return {
			id: Qe,
			diagram: e
		};
	}, "loader")
}, et = "er", tt = {
	id: et,
	detector: /* @__PURE__ */ t((e) => /^\s*erDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./erDiagram-Q63AITRT.js");
		return {
			id: et,
			diagram: e
		};
	}, "loader")
}, nt = "gitGraph", rt = {
	id: nt,
	detector: /* @__PURE__ */ t((e) => /^\s*gitGraph/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./gitGraphDiagram-IHSO6WYX.js");
		return {
			id: nt,
			diagram: e
		};
	}, "loader")
}, it = "gantt", at = {
	id: it,
	detector: /* @__PURE__ */ t((e) => /^\s*gantt/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./ganttDiagram-NO4QXBWP.js");
		return {
			id: it,
			diagram: e
		};
	}, "loader")
}, ot = "info", st = {
	id: ot,
	detector: /* @__PURE__ */ t((e) => /^\s*info/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./infoDiagram-FWYZ7A6U.js");
		return {
			id: ot,
			diagram: e
		};
	}, "loader")
}, ct = "pie", lt = {
	id: ct,
	detector: /* @__PURE__ */ t((e) => /^\s*pie/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./pieDiagram-ENE6RG2P.js");
		return {
			id: ct,
			diagram: e
		};
	}, "loader")
}, ut = "quadrantChart", dt = {
	id: ut,
	detector: /* @__PURE__ */ t((e) => /^\s*quadrantChart/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./quadrantDiagram-ABIIQ3AL.js");
		return {
			id: ut,
			diagram: e
		};
	}, "loader")
}, ft = "xychart", pt = {
	id: ft,
	detector: /* @__PURE__ */ t((e) => /^\s*xychart(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./xychartDiagram-FW5EYKEG.js");
		return {
			id: ft,
			diagram: e
		};
	}, "loader")
}, mt = "requirement", ht = {
	id: mt,
	detector: /* @__PURE__ */ t((e) => /^\s*requirement(Diagram)?/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./requirementDiagram-TGXJPOKE.js");
		return {
			id: mt,
			diagram: e
		};
	}, "loader")
}, gt = "sequence", _t = {
	id: gt,
	detector: /* @__PURE__ */ t((e) => /^\s*sequenceDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./sequenceDiagram-DBY2YBRQ.js");
		return {
			id: gt,
			diagram: e
		};
	}, "loader")
}, vt = "class", yt = {
	id: vt,
	detector: /* @__PURE__ */ t((e, t) => t?.class?.defaultRenderer !== "dagre-wrapper" && /^\s*classDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./classDiagram-OUVF2IWQ.js");
		return {
			id: vt,
			diagram: e
		};
	}, "loader")
}, bt = "classDiagram", xt = {
	id: bt,
	detector: /* @__PURE__ */ t((e, t) => /^\s*classDiagram/.test(e) && t?.class?.defaultRenderer === "dagre-wrapper" ? !0 : /^\s*classDiagram-v2/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./classDiagram-v2-EOCWNBFH.js");
		return {
			id: bt,
			diagram: e
		};
	}, "loader")
}, St = "state", Ct = {
	id: St,
	detector: /* @__PURE__ */ t((e, t) => t?.state?.defaultRenderer !== "dagre-wrapper" && /^\s*stateDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./stateDiagram-2N3HPSRC.js");
		return {
			id: St,
			diagram: e
		};
	}, "loader")
}, wt = "stateDiagram", Tt = {
	id: wt,
	detector: /* @__PURE__ */ t((e, t) => !!(/^\s*stateDiagram-v2/.test(e) || /^\s*stateDiagram/.test(e) && t?.state?.defaultRenderer === "dagre-wrapper"), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./stateDiagram-v2-6OUMAXLB.js");
		return {
			id: wt,
			diagram: e
		};
	}, "loader")
}, Et = "journey", Dt = {
	id: Et,
	detector: /* @__PURE__ */ t((e) => /^\s*journey/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./journeyDiagram-5HDEW3XC.js");
		return {
			id: Et,
			diagram: e
		};
	}, "loader")
}, Ot = { draw: /* @__PURE__ */ t((e, t, n) => {
	r.debug("rendering svg for syntax error\n");
	let i = fe(t), a = i.append("g");
	i.attr("viewBox", "0 0 2412 512"), b(i, 100, 512, !0), a.append("path").attr("class", "error-icon").attr("d", "m411.313,123.313c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32-9.375,9.375-20.688-20.688c-12.484-12.5-32.766-12.5-45.25,0l-16,16c-1.261,1.261-2.304,2.648-3.31,4.051-21.739-8.561-45.324-13.426-70.065-13.426-105.867,0-192,86.133-192,192s86.133,192 192,192 192-86.133 192-192c0-24.741-4.864-48.327-13.426-70.065 1.402-1.007 2.79-2.049 4.051-3.31l16-16c12.5-12.492 12.5-32.758 0-45.25l-20.688-20.688 9.375-9.375 32.001-31.999zm-219.313,100.687c-52.938,0-96,43.063-96,96 0,8.836-7.164,16-16,16s-16-7.164-16-16c0-70.578 57.422-128 128-128 8.836,0 16,7.164 16,16s-7.164,16-16,16z"), a.append("path").attr("class", "error-icon").attr("d", "m459.02,148.98c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l16,16c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16.001-16z"), a.append("path").attr("class", "error-icon").attr("d", "m340.395,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16-16c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l15.999,16z"), a.append("path").attr("class", "error-icon").attr("d", "m400,64c8.844,0 16-7.164 16-16v-32c0-8.836-7.156-16-16-16-8.844,0-16,7.164-16,16v32c0,8.836 7.156,16 16,16z"), a.append("path").attr("class", "error-icon").attr("d", "m496,96.586h-32c-8.844,0-16,7.164-16,16 0,8.836 7.156,16 16,16h32c8.844,0 16-7.164 16-16 0-8.836-7.156-16-16-16z"), a.append("path").attr("class", "error-icon").attr("d", "m436.98,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688l32-32c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32c-6.251,6.25-6.251,16.375-0.001,22.625z"), a.append("text").attr("class", "error-text").attr("x", 1440).attr("y", 250).attr("font-size", "150px").style("text-anchor", "middle").text("Syntax error in text"), a.append("text").attr("class", "error-text").attr("x", 1250).attr("y", 400).attr("font-size", "100px").style("text-anchor", "middle").text(`mermaid version ${n}`);
}, "draw") }, kt = Ot, At = {
	db: {},
	renderer: Ot,
	parser: { parse: /* @__PURE__ */ t(() => {}, "parse") }
}, jt = "flowchart-elk", Mt = {
	id: jt,
	detector: /* @__PURE__ */ t((e, t = {}) => /^\s*flowchart-elk/.test(e) || /^\s*(flowchart|graph)/.test(e) && t?.flowchart?.defaultRenderer === "elk" ? (t.layout = "elk", !0) : !1, "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./flowDiagram-23GEKE2U.js");
		return {
			id: jt,
			diagram: e
		};
	}, "loader")
}, Nt = "timeline", Pt = {
	id: Nt,
	detector: /* @__PURE__ */ t((e) => /^\s*timeline/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./timeline-definition-FHXFAJF6.js");
		return {
			id: Nt,
			diagram: e
		};
	}, "loader")
}, Ft = "mindmap", It = {
	id: Ft,
	detector: /* @__PURE__ */ t((e) => /^\s*mindmap/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./mindmap-definition-LN4V7U3C.js");
		return {
			id: Ft,
			diagram: e
		};
	}, "loader")
}, Lt = "kanban", Rt = {
	id: Lt,
	detector: /* @__PURE__ */ t((e) => /^\s*kanban/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./kanban-definition-HUTT4EX6.js");
		return {
			id: Lt,
			diagram: e
		};
	}, "loader")
}, zt = "sankey", Bt = {
	id: zt,
	detector: /* @__PURE__ */ t((e) => /^\s*sankey(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./sankeyDiagram-HTMAVEWB.js");
		return {
			id: zt,
			diagram: e
		};
	}, "loader")
}, Vt = "packet", Ht = {
	id: Vt,
	detector: /* @__PURE__ */ t((e) => /^\s*packet(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./diagram-NH7WQ7WH.js");
		return {
			id: Vt,
			diagram: e
		};
	}, "loader")
}, Ut = "radar", Wt = {
	id: Ut,
	detector: /* @__PURE__ */ t((e) => /^\s*radar-beta/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./diagram-WEI45ONY.js");
		return {
			id: Ut,
			diagram: e
		};
	}, "loader")
}, Gt = "block", Kt = {
	id: Gt,
	detector: /* @__PURE__ */ t((e) => /^\s*block(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./blockDiagram-677ZJIJ3.js");
		return {
			id: Gt,
			diagram: e
		};
	}, "loader")
}, qt = "treeView", Jt = {
	id: qt,
	detector: /* @__PURE__ */ t((e) => /^\s*treeView-beta/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./diagram-OA4YK3LP.js");
		return {
			id: qt,
			diagram: e
		};
	}, "loader")
}, Yt = "architecture", Xt = {
	id: Yt,
	detector: /* @__PURE__ */ t((e) => /^\s*architecture/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./architectureDiagram-ZJ3FMSHR.js");
		return {
			id: Yt,
			diagram: e
		};
	}, "loader")
}, Zt = "eventmodeling", Qt = {
	id: Zt,
	detector: /* @__PURE__ */ t((e) => /^\s*eventmodeling/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./diagram-FQU43EPY.js");
		return {
			id: Zt,
			diagram: e
		};
	}, "loader")
}, $t = "ishikawa", en = {
	id: $t,
	detector: /* @__PURE__ */ t((e) => /^\s*ishikawa(-beta)?\b/i.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./ishikawaDiagram-FXEZZL3T.js");
		return {
			id: $t,
			diagram: e
		};
	}, "loader")
}, tn = "venn", nn = {
	id: tn,
	detector: /* @__PURE__ */ t((e) => /^\s*venn-beta/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./vennDiagram-L72KCM5P.js");
		return {
			id: tn,
			diagram: e
		};
	}, "loader")
}, rn = "treemap", an = {
	id: rn,
	detector: /* @__PURE__ */ t((e) => /^\s*treemap/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./diagram-G47NLZAW.js");
		return {
			id: rn,
			diagram: e
		};
	}, "loader")
}, on = "wardley", sn = {
	id: on,
	detector: /* @__PURE__ */ t((e) => /^\s*wardley-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./wardleyDiagram-EHGQE667.js");
		return {
			id: on,
			diagram: e
		};
	}, "loader")
}, cn = "cynefin", ln = {
	id: cn,
	detector: /* @__PURE__ */ t((e) => /^\s*cynefin-beta(?:[\s:]|$)/.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./cynefinDiagram-TSTJHNR4.js");
		return {
			id: cn,
			diagram: e
		};
	}, "loader")
}, un = "railroad", dn = {
	id: un,
	detector: /* @__PURE__ */ t((e) => /^\s*railroad-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./railroadDiagram-RFXS5EU6.js");
		return {
			id: un,
			diagram: e
		};
	}, "loader")
}, fn = "railroadEbnf", pn = {
	id: fn,
	detector: /* @__PURE__ */ t((e) => /^\s*railroad-ebnf-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./ebnfDiagram-CCIWWBDH.js");
		return {
			id: fn,
			diagram: e
		};
	}, "loader")
}, mn = "railroadAbnf", hn = {
	id: mn,
	detector: /* @__PURE__ */ t((e) => /^\s*railroad-abnf-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./abnfDiagram-VRR7QNED.js");
		return {
			id: mn,
			diagram: e
		};
	}, "loader")
}, gn = "railroadPeg", _n = {
	id: gn,
	detector: /* @__PURE__ */ t((e) => /^\s*railroad-peg-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ t(async () => {
		let { diagram: e } = await import("./pegDiagram-2B236MQR.js");
		return {
			id: gn,
			diagram: e
		};
	}, "loader")
}, vn = !1, J = /* @__PURE__ */ t(() => {
	vn || (vn = !0, l("error", At, (e) => e.toLowerCase().trim() === "error"), l("---", {
		db: { clear: /* @__PURE__ */ t(() => {}, "clear") },
		styles: {},
		renderer: { draw: /* @__PURE__ */ t(() => {}, "draw") },
		parser: { parse: /* @__PURE__ */ t(() => {
			throw Error("Diagrams beginning with --- are not valid. If you were trying to use a YAML front-matter, please ensure that you've correctly opened and closed the YAML front-matter with un-indented `---` blocks");
		}, "parse") },
		init: /* @__PURE__ */ t(() => null, "init")
	}, (e) => e.toLowerCase().trimStart().startsWith("---")), u(Mt, It, Xt), u(qe, Rt, xt, yt, tt, at, st, lt, ht, _t, $e, Ze, Ye, Pt, rt, Tt, Ct, Dt, dt, Bt, Ht, pt, Kt, Qt, Jt, Wt, en, an, dn, pn, hn, _n, nn, sn, ln));
}, "addDiagrams"), yn = /* @__PURE__ */ t(async () => {
	r.debug("Loading registered diagrams");
	let e = (await Promise.allSettled(Object.entries(C).map(async ([e, { detector: t, loader: n }]) => {
		if (n) try {
			f(e);
		} catch {
			try {
				let { diagram: e, id: r } = await n();
				l(r, e, t);
			} catch (t) {
				throw r.error(`Failed to load external diagram with key ${e}. Removing from detectors.`), delete C[e], t;
			}
		}
	}))).filter((e) => e.status === "rejected");
	if (e.length > 0) {
		r.error(`Failed to load ${e.length} external diagrams`);
		for (let t of e) r.error(t);
		throw Error(`Failed to load ${e.length} external diagrams`);
	}
}, "loadRegisteredDiagrams"), bn = "graphics-document document";
function xn(e, t) {
	e.attr("role", bn), t !== "" && e.attr("aria-roledescription", t);
}
t(xn, "setA11yDiagramInfo");
function Sn(e, t, n, r) {
	if (e.insert !== void 0) {
		if (n) {
			let t = `chart-desc-${r}`;
			e.attr("aria-describedby", t), e.insert("desc", ":first-child").attr("id", t).text(n);
		}
		if (t) {
			let n = `chart-title-${r}`;
			e.attr("aria-labelledby", n), e.insert("title", ":first-child").attr("id", n).text(t);
		}
	}
}
t(Sn, "addSVGa11yTitleDescription");
var Y = class e {
	constructor(e, t, n, r, i) {
		this.type = e, this.text = t, this.db = n, this.parser = r, this.renderer = i;
	}
	static {
		t(this, "Diagram");
	}
	static async fromText(t, n = {}) {
		let r = y(), i = T(t, r);
		t = ce(t) + "\n";
		try {
			f(i);
		} catch {
			let e = a(i);
			if (!e) throw new ne(`Diagram ${i} not found.`);
			let { id: t, diagram: n } = await e();
			l(t, n);
		}
		let { db: o, parser: s, renderer: c, init: u } = f(i);
		return s.parser && (s.parser.yy = o), o.clear?.(), u?.(r), n.title && o.setDiagramTitle?.(n.title), await s.parse(t), new e(i, t, o, s, c);
	}
	async render(e, t) {
		await this.renderer.draw(this.text, e, t, this);
	}
	getParser() {
		return this.parser;
	}
	getType() {
		return this.type;
	}
}, Cn = [], wn = /* @__PURE__ */ t(() => {
	Cn.forEach((e) => {
		e();
	}), Cn = [];
}, "attachFunctions"), Tn = /* @__PURE__ */ t((e) => e.replace(/^\s*%%(?!{)[^\n]+\n?/gm, "").trimStart(), "cleanupComments");
function En(e) {
	let t = e.match(v);
	if (!t) return {
		text: e,
		metadata: {}
	};
	let n = t[1], r = ge(n ? t[2].split("\n").map((e) => e.startsWith(n) ? e.slice(n.length) : e).join("\n") : t[2], { schema: _e }) ?? {};
	r = typeof r == "object" && !Array.isArray(r) ? r : {};
	let i = {};
	return r.displayMode && (i.displayMode = r.displayMode.toString()), r.title && (i.title = r.title.toString()), r.config && (i.config = r.config), {
		text: e.slice(t[0].length),
		metadata: i
	};
}
t(En, "extractFrontMatter");
var Dn = /* @__PURE__ */ t((e) => e.replace(/\r\n?/g, "\n").replace(/<(\w+)([^>]*)>/g, (e, t, n) => "<" + t + n.replace(/="([^"]*)"/g, "='$1'") + ">"), "cleanupText"), On = /* @__PURE__ */ t((e) => {
	let { text: t, metadata: n } = En(e), { displayMode: r, title: i, config: a = {} } = n;
	return r && (a.gantt ||= {}, a.gantt.displayMode = r), {
		title: i,
		config: a,
		text: t
	};
}, "processFrontmatter"), kn = /* @__PURE__ */ t((e) => {
	let t = D.detectInit(e) ?? {}, n = D.detectDirective(e, "wrap");
	return Array.isArray(n) ? t.wrap = n.some(({ type: e }) => e === "wrap") : n?.type === "wrap" && (t.wrap = !0), {
		text: oe(e),
		directive: t
	};
}, "processDirectives");
function X(e) {
	let t = On(Dn(e)), n = kn(t.text), r = se(t.config, n.directive);
	return e = Tn(n.text), {
		code: e,
		title: t.title,
		config: r
	};
}
t(X, "preprocessDiagram");
function An(e) {
	let t = new TextEncoder().encode(e), n = Array.from(t, (e) => String.fromCodePoint(e)).join("");
	return btoa(n);
}
t(An, "toBase64");
var jn = 5e4, Mn = "graph TB;a[Maximum text size in diagram exceeded];style a fill:#faa", Nn = "sandbox", Pn = "loose", Fn = "http://www.w3.org/2000/svg", In = "http://www.w3.org/1999/xlink", Ln = "http://www.w3.org/1999/xhtml", Rn = "100%", zn = "100%", Bn = "border:0;margin:0;", Vn = "margin:0", Hn = "allow-top-navigation-by-user-activation allow-popups", Un = "The \"iframe\" tag is not supported by your browser.", Wn = ["foreignobject"], Gn = ["dominant-baseline"];
function Kn(e) {
	let t = X(e);
	return s(), w(t.config ?? {}), t;
}
t(Kn, "processAndSetConfigs");
async function qn(e, t) {
	J();
	try {
		let { code: t, config: n } = Kn(e);
		return {
			diagramType: (await ar(t)).type,
			config: n
		};
	} catch (e) {
		if (t?.suppressErrors) return !1;
		throw e;
	}
}
t(qn, "parse");
var Jn = /* @__PURE__ */ t((e, t, n = []) => `.${e} ${t} ${c(`{ ${n.join(" !important; ")} !important; }`)}`, "cssImportantStyles"), Yn = /* @__PURE__ */ t((e, t = /* @__PURE__ */ new Map()) => {
	let n = new CSSStyleSheet();
	if (e.fontFamily !== void 0 && n.insertRule(`:root { --mermaid-font-family: ${e.fontFamily}}`, n.cssRules.length), e.altFontFamily !== void 0 && n.insertRule(`:root { --mermaid-alt-font-family: ${e.altFontFamily}}`, n.cssRules.length), t instanceof Map) {
		let r = p(e) ? ["> *", "span"] : [
			"rect",
			"polygon",
			"ellipse",
			"circle",
			"path"
		];
		t.forEach((e) => {
			ye(e.styles) || r.forEach((t) => {
				n.insertRule(Jn(e.id, t, e.styles), n.cssRules.length);
			}), ye(e.textStyles) || n.insertRule(Jn(e.id, "tspan", (e?.textStyles || []).map((e) => e.replace("color", "fill"))), n.cssRules.length);
		});
	}
	let r = "";
	if (e.themeCSS !== void 0) if (typeof n.replaceSync == "function") {
		let t = new CSSStyleSheet();
		t.replaceSync(e.themeCSS), r = S(t) + "\n";
	} else r += `${e.themeCSS}
`;
	return r + S(n);
}, "createCssStyles"), Xn = /* @__PURE__ */ t((e, n) => q(Be(`${e}{${n}}`), Ge([/* @__PURE__ */ t(function(t, n, i, a) {
	if (t.type === "rule" && Array.isArray(t.props)) {
		if (t.parent && t.parent.type === "@keyframes") return;
		t.props = t.props.map((t) => t.startsWith(e) ? t : `${e} ${t}`);
	} else t.type.startsWith("@") && ([
		"@media",
		"@supports",
		"@layer",
		"@scope",
		"@container",
		"@starting-style",
		"@keyframes"
	].includes(t.type) || (r.warn(`Removing unsupported at-rule ${t.type} from CSS`), t.type = O));
}, "addNamespace"), We])), "compileCSS"), Zn = /* @__PURE__ */ t((e, t, n, r) => Xn(r, g(t, Yn(e, n), {
	...e.themeVariables,
	theme: e.theme,
	look: e.look
}, r)), "createUserStyles"), Qn = /* @__PURE__ */ t((e = "", t, n) => {
	let r = e;
	return !n && !t && (r = r.replace(/marker-end="url\([\d+./:=?A-Za-z-]*?#/g, "marker-end=\"url(#")), r = ie(r), r = r.replace(/<br>/g, "<br/>"), r;
}, "cleanUpSvgCode"), $n = /* @__PURE__ */ t((e = "", t) => `<iframe style="width:${Rn};height:${t?.viewBox?.baseVal?.height ? t.viewBox.baseVal.height + "px" : zn};${Bn}" src="data:text/html;charset=UTF-8;base64,${An(`<body style="${Vn}">${e}</body>`)}" sandbox="${Hn}">
  ${Un}
</iframe>`, "putIntoIFrame"), er = /* @__PURE__ */ t((e, t, n, r, i) => {
	let a = e.append("div");
	a.attr("id", n), r && a.attr("style", r);
	let o = a.append("svg").attr("id", t).attr("width", "100%").attr("xmlns", Fn);
	return i && o.attr("xmlns:xlink", i), o.append("g"), e;
}, "appendDivSvgG");
function tr(e, t) {
	return e.append("iframe").attr("id", t).attr("style", "width: 100%; height: 100%;").attr("sandbox", "");
}
t(tr, "sandboxedIframe");
var nr = /* @__PURE__ */ t((e, t, n, r) => {
	e.getElementById(t)?.remove(), e.getElementById(n)?.remove(), e.getElementById(r)?.remove();
}, "removeExistingElements"), rr = /* @__PURE__ */ t(async function(n, a, o) {
	J();
	let s = Kn(a);
	a = s.code;
	let c = y();
	r.debug(c), a.length > (c?.maxTextSize ?? jn) && (a = Mn);
	let l = `#${n}`, u = "i" + n, d = "#" + u, f = "d" + n, p = "#" + f, m = /* @__PURE__ */ t(() => {
		let e = i(g ? d : p).node();
		e && "remove" in e && e.remove();
	}, "removeTempElements"), h = i(document.body), g = c.securityLevel === Nn, _ = c.securityLevel === Pn, v = c.fontFamily;
	o === void 0 ? (nr(document, n, f, u), g ? (h = i(tr(i(document.body), u).nodes()[0].contentDocument.body), h.node().style.margin = "0") : h = i("body"), er(h, n, f)) : (o && (o.innerHTML = ""), g ? (h = i(tr(i(o), u).nodes()[0].contentDocument.body), h.node().style.margin = "0") : h = i(o), er(h, n, f, `font-family: ${v}`, In));
	let b, S;
	try {
		b = await Y.fromText(a, { title: s.title });
	} catch (e) {
		if (c.suppressErrorRendering) throw m(), e;
		b = await Y.fromText("error"), S = e;
	}
	let C = h.select(p).node(), w = b.type, T = C.firstChild, ee = T.firstChild, te = b.renderer.getClasses?.(a, b), ne = Zn(c, w, te, l), E = document.createElement("style");
	E.innerHTML = ne, T.insertBefore(E, ee);
	try {
		await b.renderer.draw(a, n, "11.16.0", b);
	} catch (e) {
		throw c.suppressErrorRendering ? m() : kt.draw(a, n, "11.16.0"), e;
	}
	let re = h.select(`${p} svg`), ie = b.db.getAccTitle?.(), ae = b.db.getAccDescription?.();
	or(w, re, ie, ae), h.select(`[id="${n}"]`).selectAll("foreignobject > *").attr("xmlns", Ln);
	let D = h.select(p).node().innerHTML;
	if (r.debug("config.arrowMarkerAbsolute", c.arrowMarkerAbsolute), D = Qn(D, g, x(c.arrowMarkerAbsolute)), g) {
		let e = h.select(p + " svg").node();
		D = $n(D, e);
	} else _ || (D = e.sanitize(D, {
		ADD_TAGS: Wn,
		ADD_ATTR: Gn,
		HTML_INTEGRATION_POINTS: { foreignobject: !0 }
	}));
	if (wn(), S) throw S;
	return m(), {
		diagramType: w,
		svg: D,
		bindFunctions: b.db.bindFunctions
	};
}, "render");
function ir(e = {}) {
	let t = te({}, e);
	t?.fontFamily && !t.themeVariables?.fontFamily && (t.themeVariables ||= {}, t.themeVariables.fontFamily = t.fontFamily), m(t), t?.theme && t.theme in _ ? t.themeVariables = _[t.theme].getThemeVariables(t.themeVariables) : t && (t.themeVariables = _.default.getThemeVariables(t.themeVariables)), n((typeof t == "object" ? ee(t) : o()).logLevel), J();
}
t(ir, "initialize");
var ar = /* @__PURE__ */ t((e, t = {}) => {
	let { code: n } = X(e);
	return Y.fromText(n, t);
}, "getDiagramFromText");
function or(e, t, n, r) {
	xn(t, e), Sn(t, n, r, t.attr("id"));
}
t(or, "addA11yInfo");
var Z = Object.freeze({
	render: rr,
	parse: qn,
	getDiagramFromText: ar,
	initialize: ir,
	getConfig: y,
	setConfig: h,
	getSiteConfig: o,
	updateSiteConfig: d,
	reset: /* @__PURE__ */ t(() => {
		s();
	}, "reset"),
	globalReset: /* @__PURE__ */ t(() => {
		s(E);
	}, "globalReset"),
	defaultConfig: E
});
n(y().logLevel), s(y());
var sr = /* @__PURE__ */ t((e, t, n) => {
	r.warn(e), ae(e) ? (n && n(e.str, e.hash), t.push({
		...e,
		message: e.str,
		error: e
	})) : (n && n(e), e instanceof Error && t.push({
		str: e.message,
		message: e.message,
		hash: e.name,
		error: e
	}));
}, "handleError"), cr = /* @__PURE__ */ t(async function(e = { querySelector: ".mermaid" }) {
	try {
		await lr(e);
	} catch (t) {
		if (ae(t) && r.error(t.str), $.parseError && $.parseError(t), !e.suppressErrors) throw r.error("Use the suppressErrors option to suppress these errors"), t;
	}
}, "run"), lr = /* @__PURE__ */ t(async function({ postRenderCallback: e, querySelector: t, nodes: n } = { querySelector: ".mermaid" }) {
	let i = Z.getConfig();
	r.debug(`${e ? "" : "No "}Callback function found`);
	let a;
	if (n) a = n;
	else if (t) a = document.querySelectorAll(t);
	else throw Error("Nodes and querySelector are both undefined");
	r.debug(`Found ${a.length} diagrams`), i?.startOnLoad !== void 0 && (r.debug("Start On Load: " + i?.startOnLoad), Z.updateSiteConfig({ startOnLoad: i?.startOnLoad }));
	let o = new D.InitIDGenerator(i.deterministicIds, i.deterministicIDSeed), s, c = [];
	for (let t of Array.from(a)) {
		if (r.info("Rendering diagram: " + t.id), t.getAttribute("data-processed")) continue;
		t.setAttribute("data-processed", "true");
		let n = `mermaid-${o.next()}`;
		s = t.innerHTML, s = me(D.entityDecode(s)).trim().replace(/<br\s*\/?>/gi, "<br/>");
		let i = D.detectInit(s);
		i && r.debug("Detected early reinit: ", i);
		try {
			let { svg: r, bindFunctions: i } = await vr(n, s, t);
			t.innerHTML = r, e && await e(n), i && i(t);
		} catch (e) {
			sr(e, c, $.parseError);
		}
	}
	if (c.length > 0) throw c[0];
}, "runThrowsErrors"), ur = /* @__PURE__ */ t(function(e) {
	Z.initialize(e);
}, "initialize"), dr = /* @__PURE__ */ t(async function(e, t, n) {
	r.warn("mermaid.init is deprecated. Please use run instead."), e && ur(e);
	let i = {
		postRenderCallback: n,
		querySelector: ".mermaid"
	};
	typeof t == "string" ? i.querySelector = t : t && (t instanceof HTMLElement ? i.nodes = [t] : i.nodes = t), await cr(i);
}, "init"), fr = /* @__PURE__ */ t(async (e, { lazyLoad: t = !0 } = {}) => {
	J(), u(...e), t === !1 && await yn();
}, "registerExternalDiagrams"), pr = /* @__PURE__ */ t(function() {
	if ($.startOnLoad) {
		let { startOnLoad: e } = Z.getConfig();
		e && $.run().catch((e) => r.error("Mermaid failed to initialize", e));
	}
}, "contentLoaded");
typeof document < "u" && window.addEventListener("load", pr, !1);
var mr = /* @__PURE__ */ t(function(e) {
	$.parseError = e;
}, "setParseErrorHandler"), Q = [], hr = !1, gr = /* @__PURE__ */ t(async () => {
	if (!hr) {
		for (hr = !0; Q.length > 0;) {
			let e = Q.shift();
			if (e) try {
				await e();
			} catch (e) {
				r.error("Error executing queue", e);
			}
		}
		hr = !1;
	}
}, "executeQueue"), _r = /* @__PURE__ */ t(async (e, n) => new Promise((i, a) => {
	let o = /* @__PURE__ */ t(() => new Promise((t, o) => {
		Z.parse(e, n).then((e) => {
			t(e), i(e);
		}, (e) => {
			r.error("Error parsing", e), $.parseError?.(e), o(e), a(e);
		});
	}), "performCall");
	Q.push(o), gr().catch(a);
}), "parse"), vr = /* @__PURE__ */ t((e, n, i) => new Promise((a, o) => {
	let s = /* @__PURE__ */ t(() => new Promise((t, s) => {
		Z.render(e, n, i).then((e) => {
			t(e), a(e);
		}, (e) => {
			r.error("Error parsing", e), $.parseError?.(e), s(e), o(e);
		});
	}), "performCall");
	Q.push(s), gr().catch(o);
}), "render"), $ = {
	startOnLoad: !0,
	mermaidAPI: Z,
	parse: _r,
	render: vr,
	init: dr,
	run: cr,
	registerExternalDiagrams: fr,
	registerLayoutLoaders: he,
	initialize: ur,
	parseError: void 0,
	contentLoaded: pr,
	setParseErrorHandler: mr,
	detectType: T,
	registerIconPacks: pe,
	getRegisteredDiagramsMetadata: /* @__PURE__ */ t(() => Object.keys(C).map((e) => ({ id: e })), "getRegisteredDiagramsMetadata")
}, yr = $;
//#endregion
export { yr as default };

//# sourceMappingURL=mermaid.core.js.map