import { t as e } from "./chunk-CJCKSLXZ.js";
//#region ../node_modules/.pnpm/@mermaid-js+mermaid-zenuml@0.2.3_mermaid@11.16.0_playwright-core@1.62.0_tailwindcss@4.3.3/node_modules/@mermaid-js/mermaid-zenuml/dist/mermaid-zenuml.core.mjs
var t = "zenuml", n = {
	id: t,
	detector: /* @__PURE__ */ e((e) => /^\s*zenuml/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./zenuml-definition-ZCSB3OVJ.js");
		return {
			id: t,
			diagram: e
		};
	}, "loader")
};
//#endregion
export { n as default };

//# sourceMappingURL=mermaid-zenuml.core.js.map