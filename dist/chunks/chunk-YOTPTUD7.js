import { C as e, S as t, f as n, n as r, o as i, t as a, u as o, w as s, x as c } from "./chunk-KEIR6QF5.js";
//#region ../node_modules/.pnpm/@mermaid-js+parser@1.2.0/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-YOTPTUD7.mjs
var l = class extends a {
	static {
		c(this, "PieTokenBuilder");
	}
	constructor() {
		super(["pie", "showData"]);
	}
}, u = class extends r {
	static {
		c(this, "PieValueConverter");
	}
	runCustomConverter(e, t, n) {
		if (e.name === "PIE_SECTION_LABEL") return t.replace(/"/g, "").trim();
	}
}, d = { parser: {
	TokenBuilder: /* @__PURE__ */ c(() => new l(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ c(() => new u(), "ValueConverter")
} };
function f(r = i) {
	let a = s(e(r), o), c = s(t({ shared: a }), n, d);
	return a.ServiceRegistry.register(c), {
		shared: a,
		Pie: c
	};
}
c(f, "createPieServices");
//#endregion
export { f as n, d as t };

//# sourceMappingURL=chunk-YOTPTUD7.js.map