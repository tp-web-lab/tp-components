import { C as e, S as t, i as n, o as r, p as i, t as a, u as o, w as s, x as c } from "./chunk-KEIR6QF5.js";
//#region ../node_modules/.pnpm/@mermaid-js+parser@1.2.0/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-QBLGF6JB.mjs
var l = class extends a {
	static {
		c(this, "RadarTokenBuilder");
	}
	constructor() {
		super(["radar-beta"]);
	}
}, u = { parser: {
	TokenBuilder: /* @__PURE__ */ c(() => new l(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ c(() => new n(), "ValueConverter")
} };
function d(n = r) {
	let a = s(e(n), o), c = s(t({ shared: a }), i, u);
	return a.ServiceRegistry.register(c), {
		shared: a,
		Radar: c
	};
}
c(d, "createRadarServices");
//#endregion
export { d as n, u as t };

//# sourceMappingURL=chunk-QBLGF6JB.js.map