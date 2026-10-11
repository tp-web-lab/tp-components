import { n as e } from "./chunk-Y2CYZVJY.js";
import { m as t } from "./src.js";
import { b as n, s as r } from "./chunk-WYO6CB5R.js";
import { d as i } from "./chunk-ICXQ74PX.js";
import { a, i as o, s } from "./chunk-ZGVPDNZ5.js";
import { a as c, i as l, o as u, r as d } from "./chunk-52WLFC77.js";
//#region ../node_modules/.pnpm/mermaid@11.16.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-FWX5IMBZ.mjs
var f = {
	common: r,
	getConfig: n,
	insertCluster: o,
	insertEdge: d,
	insertEdgeLabel: l,
	insertMarkers: c,
	insertNode: a,
	interpolateToCurve: i,
	labelHelper: s,
	log: t,
	positionEdgeLabel: u
}, p = {}, m = /* @__PURE__ */ e((e) => {
	for (let t of e) p[t.name] = t;
}, "registerLayoutLoaders");
(/* @__PURE__ */ e(() => {
	m([
		{
			name: "dagre",
			loader: /* @__PURE__ */ e(async () => await import("./dagre-VKFMJZFB.js"), "loader")
		},
		{
			name: "swimlane",
			loader: /* @__PURE__ */ e(async () => await import("./swimlanes-5IMT3BWC.js"), "loader")
		},
		{
			name: "cose-bilkent",
			loader: /* @__PURE__ */ e(async () => await import("./cose-bilkent-JH36ORCC.js"), "loader")
		}
	]);
}, "registerDefaultLayoutLoaders"))();
var h = /* @__PURE__ */ e(async (e, t, n) => {
	if (!(e.layoutAlgorithm in p)) throw Error(`Unknown layout algorithm: ${e.layoutAlgorithm}`);
	if (e.diagramId) for (let t of e.nodes) {
		let n = t.domId || t.id;
		t.domId = `${e.diagramId}-${n}`;
	}
	let r = p[e.layoutAlgorithm], i = await r.loader(), { theme: a, themeVariables: o } = e.config, { useGradient: s, gradientStart: c, gradientStop: l } = o, u = t.attr("id");
	if (t.append("defs").append("filter").attr("id", `${u}-drop-shadow`).attr("height", "130%").attr("width", "130%").append("feDropShadow").attr("dx", "4").attr("dy", "4").attr("stdDeviation", 0).attr("flood-opacity", "0.06").attr("flood-color", `${a?.includes("dark") ? "#FFFFFF" : "#000000"}`), t.append("defs").append("filter").attr("id", `${u}-drop-shadow-small`).attr("height", "150%").attr("width", "150%").append("feDropShadow").attr("dx", "2").attr("dy", "2").attr("stdDeviation", 0).attr("flood-opacity", "0.06").attr("flood-color", `${a?.includes("dark") ? "#FFFFFF" : "#000000"}`), s) {
		let e = t.append("linearGradient").attr("id", t.attr("id") + "-gradient").attr("gradientUnits", "objectBoundingBox").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
		e.append("svg:stop").attr("offset", "0%").attr("stop-color", c).attr("stop-opacity", 1), e.append("svg:stop").attr("offset", "100%").attr("stop-color", l).attr("stop-opacity", 1);
	}
	return i.render(e, t, f, { algorithm: r.algorithm }, n);
}, "render"), g = /* @__PURE__ */ e((e = "", { fallback: n = "dagre" } = {}) => {
	if (e in p) return e;
	if (n in p) return t.warn(`Layout algorithm ${e} is not registered. Using ${n} as fallback.`), n;
	throw Error(`Both layout algorithms ${e} and ${n} are not registered.`);
}, "getRegisteredLayoutAlgorithm");
//#endregion
export { m as n, h as r, g as t };

//# sourceMappingURL=chunk-FWX5IMBZ.js.map