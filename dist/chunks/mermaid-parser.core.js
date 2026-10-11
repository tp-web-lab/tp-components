import { x as e } from "./chunk-KEIR6QF5.js";
import "./chunk-MOZMSUNE.js";
import "./chunk-OSBZ3O6U.js";
import "./chunk-5JV3BV7I.js";
import "./chunk-CYSBUYHQ.js";
import "./chunk-BIQX33UG.js";
import "./chunk-EMLP6XTP.js";
import "./chunk-YOTPTUD7.js";
import "./chunk-QBLGF6JB.js";
import "./chunk-5TONJI2A.js";
import "./chunk-5HE753X5.js";
import "./chunk-U6XO7XAA.js";
import "./chunk-JG7HCLWE.js";
import "./chunk-CQNSW5MT.js";
import "./chunk-R7FJI6CG.js";
import "./chunk-5FCAYU7R.js";
//#region ../node_modules/.pnpm/@mermaid-js+parser@1.2.0/node_modules/@mermaid-js/parser/dist/mermaid-parser.core.mjs
var t = {}, n = {
	info: /* @__PURE__ */ e(async () => {
		let { createInfoServices: e } = await import("./info-DKCQHKI2.js");
		t.info = e().Info.parser.LangiumParser;
	}, "info"),
	packet: /* @__PURE__ */ e(async () => {
		let { createPacketServices: e } = await import("./packet-7NZHBO7P.js");
		t.packet = e().Packet.parser.LangiumParser;
	}, "packet"),
	pie: /* @__PURE__ */ e(async () => {
		let { createPieServices: e } = await import("./pie-RZYD4A2V.js");
		t.pie = e().Pie.parser.LangiumParser;
	}, "pie"),
	treeView: /* @__PURE__ */ e(async () => {
		let { createTreeViewServices: e } = await import("./treeView-QDETBFTQ.js");
		t.treeView = e().TreeView.parser.LangiumParser;
	}, "treeView"),
	architecture: /* @__PURE__ */ e(async () => {
		let { createArchitectureServices: e } = await import("./architecture-TIHT7OUA.js");
		t.architecture = e().Architecture.parser.LangiumParser;
	}, "architecture"),
	gitGraph: /* @__PURE__ */ e(async () => {
		let { createGitGraphServices: e } = await import("./gitGraph-TEB2WS4Q.js");
		t.gitGraph = e().GitGraph.parser.LangiumParser;
	}, "gitGraph"),
	eventmodeling: /* @__PURE__ */ e(async () => {
		let { createEventModelingServices: e } = await import("./eventmodeling-45OFAUF4.js");
		t.eventmodeling = e().EventModel.parser.LangiumParser;
	}, "eventmodeling"),
	radar: /* @__PURE__ */ e(async () => {
		let { createRadarServices: e } = await import("./radar-I7S5WNFK.js");
		t.radar = e().Radar.parser.LangiumParser;
	}, "radar"),
	railroad: /* @__PURE__ */ e(async () => {
		let { createRailroadServices: e } = await import("./railroad-3IZDKUUU.js");
		t.railroad = e().Railroad.parser.LangiumParser;
	}, "railroad"),
	railroadEbnf: /* @__PURE__ */ e(async () => {
		let { createRailroadEbnfServices: e } = await import("./railroad-ebnf-EBAXGLYW.js");
		t.railroadEbnf = e().RailroadEbnf.parser.LangiumParser;
	}, "railroadEbnf"),
	railroadAbnf: /* @__PURE__ */ e(async () => {
		let { createRailroadAbnfServices: e } = await import("./railroad-abnf-AHOZXSZD.js");
		t.railroadAbnf = e().RailroadAbnf.parser.LangiumParser;
	}, "railroadAbnf"),
	railroadPeg: /* @__PURE__ */ e(async () => {
		let { createRailroadPegServices: e } = await import("./railroad-peg-LSFZ7HO6.js");
		t.railroadPeg = e().RailroadPeg.parser.LangiumParser;
	}, "railroadPeg"),
	treemap: /* @__PURE__ */ e(async () => {
		let { createTreemapServices: e } = await import("./treemap-6X3UGDF4.js");
		t.treemap = e().Treemap.parser.LangiumParser;
	}, "treemap"),
	wardley: /* @__PURE__ */ e(async () => {
		let { createWardleyServices: e } = await import("./wardley-OPB4EBWU.js");
		t.wardley = e().Wardley.parser.LangiumParser;
	}, "wardley"),
	cynefin: /* @__PURE__ */ e(async () => {
		let { createCynefinServices: e } = await import("./cynefin-VYW2F7L2.js");
		t.cynefin = e().Cynefin.parser.LangiumParser;
	}, "cynefin")
};
async function r(e, r) {
	let a = n[e];
	if (!a) throw Error(`Unknown diagram type: ${e}`);
	t[e] || await a();
	let o = t[e].parse(r);
	if (o.lexerErrors.length > 0 || o.parserErrors.length > 0) throw new i(o);
	return o.value;
}
e(r, "parse");
var i = class extends Error {
	constructor(e) {
		let t = e.lexerErrors.map((e) => `Lexer error on line ${e.line !== void 0 && !isNaN(e.line) ? e.line : "?"}, column ${e.column !== void 0 && !isNaN(e.column) ? e.column : "?"}: ${e.message}`).join("\n"), n = e.parserErrors.map((e) => `Parse error on line ${e.token.startLine !== void 0 && !isNaN(e.token.startLine) ? e.token.startLine : "?"}, column ${e.token.startColumn !== void 0 && !isNaN(e.token.startColumn) ? e.token.startColumn : "?"}: ${e.message}`).join("\n");
		super(`Parsing failed: ${t} ${n}`), this.result = e;
	}
	static {
		e(this, "MermaidParseError");
	}
};
//#endregion
export { r as n, i as t };

//# sourceMappingURL=mermaid-parser.core.js.map