//#region src/languages/markdown/extensions/map/index.ts
function e(e) {
	t(e);
}
function t(e) {
	e.block.ruler.before("paragraph", "map_block", (e, t, r, s) => {
		if (!i(e, t).trim().startsWith("::map{")) return !1;
		let c = "", l = t;
		for (; l < r;) {
			let t = i(e, l).trim();
			if (c += `${t}\n`, t.endsWith("}")) break;
			l += 1;
		}
		let u = c.trim().match(/^::map\{([\s\S]*)\}\s*$/);
		if (u === null) return !1;
		if (s) return !0;
		let d = n(u[1] ?? ""), f = a(d, "lat") ?? "", p = a(d, "lon") ?? a(d, "long") ?? "", m = e.push("map_block", "", 0);
		return m.block = !0, m.meta = {
			lat: f,
			lon: p,
			zoom: a(d, "zoom") ?? "13",
			title: a(d, "title") ?? "",
			marker: o(d, "marker"),
			useCurrentLocation: f === "" || p === ""
		}, e.line = l + 1, !0;
	}), e.renderer.rules.map_block = (e, t) => {
		let n = r(e[t]);
		return `
${l()}
<div
  class="tp-md-map"
  ${n.lat === "" ? "" : `data-lat="${c(n.lat)}"`}
  ${n.lon === "" ? "" : `data-lon="${c(n.lon)}"`}
  data-zoom="${c(n.zoom)}"
  data-title="${c(n.title)}"
  ${n.marker ? "data-marker" : ""}
  ${n.useCurrentLocation ? "data-current-location" : ""}
></div>
`;
	};
}
function n(e) {
	return e.replaceAll("“", "\"").replaceAll("”", "\"").replaceAll("‘", "'").replaceAll("’", "'");
}
function r(e) {
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
function i(e, t) {
	let n = (e.bMarks[t] ?? 0) + (e.tShift[t] ?? 0), r = e.eMarks[t] ?? n;
	return e.src.slice(n, r);
}
function a(e, t) {
	let n = RegExp(`${t}=("[^"]+"|'[^']+'|\\S+)`), r = e.match(n);
	return r === null ? null : (r[1] ?? "").replace(/^["']|["']$/g, "");
}
function o(e, t) {
	return RegExp(`(^|\\s)${s(t)}(\\s|$)`).test(e);
}
function s(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function c(e) {
	return e.replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function l() {
	return "\n<style>\n.tp-md-map {\n  inline-size: 100%;\n  block-size: 24rem;\n  margin-block: 1rem;\n  border-radius: 0.75rem;\n  overflow: hidden;\n  border: 1px solid color-mix(\n    in srgb,\n    CanvasText 18%,\n    transparent\n  );\n}\n</style>\n";
}
//#endregion
export { e as default };

