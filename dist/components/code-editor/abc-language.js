import { W as e, c as t } from "../../chunks/dist.js";
//#region src/components/code-editor/abc-language.ts
var n = t.define({ token(e) {
	return e.sol() && e.match(/^%.*$/) ? "comment" : e.sol() && e.match(/^[A-Z]:/) ? "keyword" : e.match(/"[^"]*"/) ? "string" : e.match(/\[[^\]]+\]/) ? "bracket" : e.match(/[=_^]?[A-Ga-g][,']*\d*\/?\d*/) ? "atom" : e.match(/[zZx]\d*\/?\d*/) ? "number" : e.match(/[|:]+|\[|\]|\(|\)/) ? "operator" : (e.next(), null);
} }), r = e.baseTheme({
	".cm-keyword": {
		color: "#7c3aed",
		fontWeight: "700"
	},
	".cm-atom": {
		color: "#2563eb",
		fontWeight: "600"
	},
	".cm-string": { color: "#b45309" },
	".cm-number": { color: "#0f766e" },
	".cm-operator, .cm-bracket": {
		color: "#dc2626",
		fontWeight: "700"
	},
	".cm-comment": {
		color: "#64748b",
		fontStyle: "italic"
	}
});
//#endregion
export { r as abcBaseTheme, n as abcLanguage };

//# sourceMappingURL=abc-language.js.map