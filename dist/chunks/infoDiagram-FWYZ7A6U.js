import { n as e } from "./chunk-Y2CYZVJY.js";
import { m as t } from "./src.js";
import { c as n } from "./chunk-WYO6CB5R.js";
import { t as r } from "./chunk-VAUOI2AC.js";
import { n as i } from "./mermaid-parser.core.js";
//#region ../node_modules/.pnpm/mermaid@11.16.0/node_modules/mermaid/dist/chunks/mermaid.core/infoDiagram-FWYZ7A6U.mjs
var a = { parse: /* @__PURE__ */ e(async (e) => {
	let n = await i("info", e);
	t.debug(n);
}, "parse") }, o = { version: "11.16.0" }, s = {
	parser: a,
	db: { getVersion: /* @__PURE__ */ e(() => o.version, "getVersion") },
	renderer: { draw: /* @__PURE__ */ e((e, i, a) => {
		t.debug("rendering info diagram\n" + e);
		let o = r(i);
		n(o, 100, 400, !0), o.append("g").append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${a}`);
	}, "draw") }
};
//#endregion
export { s as diagram };

//# sourceMappingURL=infoDiagram-FWYZ7A6U.js.map