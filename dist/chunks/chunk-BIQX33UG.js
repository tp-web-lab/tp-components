import { C as e, S as t, i as n, l as r, o as i, t as a, u as o, w as s, x as c } from "./chunk-KEIR6QF5.js";
//#region ../node_modules/.pnpm/@mermaid-js+parser@1.2.0/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-BIQX33UG.mjs
var l = class extends a {
	static {
		c(this, "InfoTokenBuilder");
	}
	constructor() {
		super(["info", "showInfo"]);
	}
}, u = { parser: {
	TokenBuilder: /* @__PURE__ */ c(() => new l(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ c(() => new n(), "ValueConverter")
} };
function d(n = i) {
	let a = s(e(n), o), c = s(t({ shared: a }), r, u);
	return a.ServiceRegistry.register(c), {
		shared: a,
		Info: c
	};
}
c(d, "createInfoServices");
//#endregion
export { d as n, u as t };

//# sourceMappingURL=chunk-BIQX33UG.js.map