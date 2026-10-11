import { C as e, S as t, i as n, o as r, s as i, t as a, u as o, w as s, x as c } from "./chunk-KEIR6QF5.js";
//#region ../node_modules/.pnpm/@mermaid-js+parser@1.2.0/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-5JV3BV7I.mjs
var l = class extends a {
	static {
		c(this, "EventModelingTokenBuilder");
	}
	constructor() {
		super(["eventmodeling"]);
	}
}, u = /* @__PURE__ */ new Set(["cmd", "command"]), d = /* @__PURE__ */ new Set(["evt", "event"]), f = /* @__PURE__ */ new Set(["rmo", "readmodel"]), p = /* @__PURE__ */ new Set(["pcr", "processor"]), m = /* @__PURE__ */ new Set(["ui"]);
function h(e) {
	let t = e.validation.EventModelingValidator, n = e.validation.ValidationRegistry;
	if (n) {
		let e = {
			EmTimeFrame: t.checkSourceFrameTypes.bind(t),
			EmResetFrame: t.checkSourceFrameTypes.bind(t)
		};
		n.register(e, t);
	}
}
c(h, "registerValidationChecks");
var g = class {
	static {
		c(this, "EventModelingValidator");
	}
	checkSourceFrameTypes(e, t) {
		e.sourceFrames.length !== 0 && (u.has(e.modelEntityType) ? this.validateSources(e, /* @__PURE__ */ new Set([...m, ...p]), "command", "ui or processor", t) : d.has(e.modelEntityType) ? this.validateSources(e, u, "event", "command", t) : f.has(e.modelEntityType) ? this.validateSources(e, d, "read model", "event", t) : p.has(e.modelEntityType) ? this.validateSources(e, f, "processor", "read model", t) : m.has(e.modelEntityType) && this.validateSources(e, f, "ui", "read model", t));
	}
	validateSources(e, t, n, r, i) {
		for (let a of e.sourceFrames) {
			let o = a.ref;
			o !== void 0 && !t.has(o.modelEntityType) && i("error", `A ${n} can only receive input from a ${r}, not from '${o.modelEntityType}'.`, {
				node: e,
				property: "sourceFrames"
			});
		}
	}
}, _ = {
	parser: {
		TokenBuilder: /* @__PURE__ */ c(() => new l(), "TokenBuilder"),
		ValueConverter: /* @__PURE__ */ c(() => new n(), "ValueConverter")
	},
	validation: { EventModelingValidator: /* @__PURE__ */ c(() => new g(), "EventModelingValidator") }
};
function v(n = r) {
	let a = s(e(n), o), c = s(t({ shared: a }), i, _);
	return a.ServiceRegistry.register(c), h(c), {
		shared: a,
		EventModel: c
	};
}
c(v, "createEventModelingServices");
//#endregion
export { v as n, _ as t };

//# sourceMappingURL=chunk-5JV3BV7I.js.map