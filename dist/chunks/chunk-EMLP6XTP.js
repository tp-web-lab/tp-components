import { C as e, S as t, d as n, i as r, o as i, t as a, u as o, w as s, x as c } from "./chunk-KEIR6QF5.js";
//#region ../node_modules/.pnpm/@mermaid-js+parser@1.2.0/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-EMLP6XTP.mjs
var l = class extends a {
	static {
		c(this, "PacketTokenBuilder");
	}
	constructor() {
		super(["packet"]);
	}
}, u = { parser: {
	TokenBuilder: /* @__PURE__ */ c(() => new l(), "TokenBuilder"),
	ValueConverter: /* @__PURE__ */ c(() => new r(), "ValueConverter")
} };
function d(r = i) {
	let a = s(e(r), o), c = s(t({ shared: a }), n, u);
	return a.ServiceRegistry.register(c), {
		shared: a,
		Packet: c
	};
}
c(d, "createPacketServices");
//#endregion
export { d as n, u as t };

//# sourceMappingURL=chunk-EMLP6XTP.js.map