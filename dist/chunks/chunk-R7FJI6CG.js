import { C as e, S as t, n, o as r, t as i, u as a, w as o, x as s, y as c } from "./chunk-KEIR6QF5.js";
//#region ../node_modules/.pnpm/@mermaid-js+parser@1.2.0/node_modules/@mermaid-js/parser/dist/chunks/mermaid-parser.core/chunk-R7FJI6CG.mjs
var l = class extends i {
	static {
		s(this, "TreemapTokenBuilder");
	}
	constructor() {
		super(["treemap"]);
	}
}, u = /classDef\s+([A-Z_a-z]\w+)(?:\s+([^\n\r;]*))?;?/, d = class extends n {
	static {
		s(this, "TreemapValueConverter");
	}
	runCustomConverter(e, t, n) {
		if (e.name === "NUMBER2") return parseFloat(t.replace(/,/g, ""));
		if (e.name === "SEPARATOR" || e.name === "STRING2") return t.substring(1, t.length - 1);
		if (e.name === "INDENTATION") return t.length;
		if (e.name === "ClassDef") {
			if (typeof t != "string") return t;
			let e = u.exec(t);
			if (e) return {
				$type: "ClassDefStatement",
				className: e[1],
				styleText: e[2] || void 0
			};
		}
	}
};
function f(e) {
	let t = e.validation.TreemapValidator, n = e.validation.ValidationRegistry;
	if (n) {
		let e = { Treemap: t.checkSingleRoot.bind(t) };
		n.register(e, t);
	}
}
s(f, "registerValidationChecks");
var p = class {
	static {
		s(this, "TreemapValidator");
	}
	checkSingleRoot(e, t) {
		let n;
		for (let r of e.TreemapRows) r.item && (n === void 0 && r.indent === void 0 ? n = 0 : (r.indent === void 0 || n !== void 0 && n >= parseInt(r.indent, 10)) && t("error", "Multiple root nodes are not allowed in a treemap.", {
			node: r,
			property: "item"
		}));
	}
}, m = {
	parser: {
		TokenBuilder: /* @__PURE__ */ s(() => new l(), "TokenBuilder"),
		ValueConverter: /* @__PURE__ */ s(() => new d(), "ValueConverter")
	},
	validation: { TreemapValidator: /* @__PURE__ */ s(() => new p(), "TreemapValidator") }
};
function h(n = r) {
	let i = o(e(n), a), s = o(t({ shared: i }), c, m);
	return i.ServiceRegistry.register(s), f(s), {
		shared: i,
		Treemap: s
	};
}
s(h, "createTreemapServices");
//#endregion
export { h as n, m as t };

//# sourceMappingURL=chunk-R7FJI6CG.js.map