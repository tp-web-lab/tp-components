import { C as e, S as t, b as n, n as r, o as i, u as a, w as o, x as s } from "./chunk-KEIR6QF5.js";
//#region ../node_modules/.pnpm/@mermaid-js+parser@1.2.0/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-5FCAYU7R.mjs
var c = class extends r {
	static {
		s(this, "WardleyValueConverter");
	}
	runCustomConverter(e, t, n) {
		switch (e.name.toUpperCase()) {
			case "LINK_LABEL": return t.substring(1).trim();
			default: return;
		}
	}
}, l = { parser: { ValueConverter: /* @__PURE__ */ s(() => new c(), "ValueConverter") } };
function u(r = i) {
	let s = o(e(r), a), c = o(t({ shared: s }), n, l);
	return s.ServiceRegistry.register(c), {
		shared: s,
		Wardley: c
	};
}
s(u, "createWardleyServices");
//#endregion
export { u as n, l as t };

//# sourceMappingURL=chunk-5FCAYU7R.js.map