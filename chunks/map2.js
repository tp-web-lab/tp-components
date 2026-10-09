import { dt as e } from "./lib/typescript/typescript.js";
//#region ../../../../../../@tp/tp-markdown/dist/markdown/extensions/map/index.js
var t = "tp-md-map-styles", n = "\n.tp-md-map {\n  inline-size: 100%;\n  block-size: 24rem;\n  margin-block: 1rem;\n  border-radius: 0.75rem;\n  overflow: hidden;\n  border: 1px solid color-mix(\n    in srgb,\n    CanvasText 18%,\n    transparent\n  );\n}\n";
function r(r) {
	e(t, n), i(r);
}
function i(e) {
	e.block.ruler.before("paragraph", "map_block", (e, t, n, r) => {
		if (!s(e, t).trim().startsWith("::map{")) return !1;
		let i = "", o = t;
		for (; o < n;) {
			let t = s(e, o).trim();
			if (i += `${t}\n`, t.endsWith("}")) break;
			o += 1;
		}
		let u = i.trim().match(/^::map\{([\s\S]*)\}\s*$/);
		if (u === null) return !1;
		if (r) return !0;
		let d = a(u[1] ?? ""), f = c(d, "lat") ?? "", p = c(d, "lon") ?? c(d, "long") ?? "", m = e.push("map_block", "", 0);
		return m.block = !0, m.meta = {
			lat: f,
			lon: p,
			zoom: c(d, "zoom") ?? "13",
			title: c(d, "title") ?? "",
			marker: l(d, "marker"),
			useCurrentLocation: f === "" || p === ""
		}, e.line = o + 1, !0;
	}), e.renderer.rules.map_block = (e, t) => {
		let n = o(e[t]);
		return `
<div
  class="tp-md-map"
  ${n.lat === "" ? "" : `data-lat="${d(n.lat)}"`}
  ${n.lon === "" ? "" : `data-lon="${d(n.lon)}"`}
  data-zoom="${d(n.zoom)}"
  data-title="${d(n.title)}"
  ${n.marker ? "data-marker" : ""}
  ${n.useCurrentLocation ? "data-current-location" : ""}
></div>
`;
	};
}
function a(e) {
	return e.replaceAll("“", "\"").replaceAll("”", "\"").replaceAll("‘", "'").replaceAll("’", "'");
}
function o(e) {
	let t = e?.meta;
	if (typeof t != "object" || !t) return {
		lat: "",
		lon: "",
		zoom: "13",
		title: "",
		marker: !1,
		useCurrentLocation: !0
	};
	let n = t;
	return {
		lat: typeof n.lat == "string" ? n.lat : "",
		lon: typeof n.lon == "string" ? n.lon : "",
		zoom: typeof n.zoom == "string" ? n.zoom : "13",
		title: typeof n.title == "string" ? n.title : "",
		marker: n.marker === !0,
		useCurrentLocation: n.useCurrentLocation === !0
	};
}
function s(e, t) {
	let n = (e.bMarks[t] ?? 0) + (e.tShift[t] ?? 0), r = e.eMarks[t] ?? n;
	return e.src.slice(n, r);
}
function c(e, t) {
	let n = RegExp(`${t}=("[^"]+"|'[^']+'|\\S+)`), r = e.match(n);
	return r === null ? null : (r[1] ?? "").replace(/^["']|["']$/g, "");
}
function l(e, t) {
	return RegExp(`(^|\\s)${u(t)}(\\s|$)`).test(e);
}
function u(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function d(e) {
	return e.replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
//#endregion
export { r as default };

