import { Gt as e } from "../../chunks/lib/typescript/typescript.js";
//#region src/utilities/importmap/importmap-rewrite.ts
var t = /(?<=from\s+['"])([^'"]+)(?=['"])|(?<=import\s*\(\s*['"])([^'"]+)(?=['"]\s*\))/g;
function n(n, r) {
	return n.replace(t, (t) => e(t, r) ?? t);
}
//#endregion
export { n as rewriteImports };

//# sourceMappingURL=importmap-rewrite.js.map