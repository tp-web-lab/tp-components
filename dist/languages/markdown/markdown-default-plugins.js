import { o as e } from "../../chunks/rolldown-runtime.js";
import { a as t, i as n, n as r, o as i, r as a, s as o, t as s } from "../../chunks/lib/markdown-it/markdown-it.js";
//#region src/languages/markdown/markdown-default-plugins.ts
var c = /* @__PURE__ */ e(i(), 1);
function l(e) {
	e.use(o), e.use(a), e.use(r), e.use(s), e.use(n), e.use(t), e.use(c.default, {
		leftDelimiter: "{",
		rightDelimiter: "}"
	});
}
//#endregion
export { l as registerDefaultMarkdownPlugins };

//# sourceMappingURL=markdown-default-plugins.js.map