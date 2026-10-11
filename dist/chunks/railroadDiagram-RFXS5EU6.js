import { n as e } from "./chunk-5TONJI2A.js";
import { n as t } from "./chunk-Y2CYZVJY.js";
import { m as n } from "./src.js";
import "./chunk-WYO6CB5R.js";
import "./chunk-VAUOI2AC.js";
import { n as r, r as i, t as a } from "./chunk-MOJQB5TN.js";
import { t as o } from "./chunk-JWPE2WC7.js";
import { t as s } from "./mermaid-parser.core.js";
//#region ../node_modules/.pnpm/mermaid@11.16.0/node_modules/mermaid/dist/chunks/mermaid.core/railroadDiagram-RFXS5EU6.mjs
var c = e().Railroad.parser.LangiumParser, l = /* @__PURE__ */ t((e) => {
	switch (e.$type) {
		case "RailroadTerminalExpr": return {
			type: "terminal",
			value: e.value
		};
		case "RailroadNonTerminalExpr": return {
			type: "nonterminal",
			name: e.name
		};
		case "RailroadSpecialExpr": return {
			type: "special",
			text: e.text
		};
		case "RailroadSequenceExpr": {
			let t = e.elements.map(l);
			return t.length === 1 ? t[0] : {
				type: "sequence",
				elements: t
			};
		}
		case "RailroadChoiceExpr": {
			let t = e.alternatives.map(l);
			return t.length === 1 ? t[0] : {
				type: "choice",
				alternatives: t
			};
		}
		case "RailroadOptionalExpr": return {
			type: "optional",
			element: l(e.element)
		};
		case "RailroadOneOrMoreExpr": return {
			type: "repetition",
			element: l(e.element),
			min: 1,
			max: Infinity
		};
		case "RailroadZeroOrMoreExpr": return {
			type: "repetition",
			element: l(e.element),
			min: 0,
			max: Infinity
		};
		default: throw Error(`Unsupported railroad expression: ${e.$type}`);
	}
}, "transformExpression"), u = /* @__PURE__ */ t((e) => ({
	name: e.name,
	definition: l(e.definition)
}), "transformRule"), d = /* @__PURE__ */ t((e) => {
	o(e, a), e.title && a.setTitle(e.title), e.rules.map((e) => a.addRule(u(e)));
}, "populateDb"), f = {
	parser: {
		parse: /* @__PURE__ */ t((e) => {
			a.clear(), n.debug("[Railroad Parser] Starting Langium parse");
			let t = c.parse(e);
			if (t.lexerErrors.length > 0 || t.parserErrors.length > 0) throw new s(t);
			let r = t.value;
			n.debug("[Railroad Parser] Parsed rules:", r.rules.length), d(r), n.debug("[Railroad Parser] Parse complete");
		}, "parse"),
		parser: { yy: a }
	},
	db: a,
	renderer: i,
	styles: r
};
//#endregion
export { f as diagram };

//# sourceMappingURL=railroadDiagram-RFXS5EU6.js.map