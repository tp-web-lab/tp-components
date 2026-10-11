import { SAFE_CDN_IMPORTS as e, SAFE_CDN_PREFIX_IMPORTS as t } from "./importmap-defaults.js";
//#region src/utilities/importmap/importmap-resolver.ts
function n(e, t) {
	return r(e, t).resolved;
}
function r(e, t) {
	if (e.startsWith(".") || e.startsWith("/")) return {
		original: e,
		resolved: e,
		source: "relative"
	};
	let n = i(e, t);
	if (n !== null) return {
		original: e,
		resolved: n,
		source: "importmap"
	};
	let r = a(e);
	return r === null ? {
		original: e,
		resolved: null,
		source: "unknown"
	} : {
		original: e,
		resolved: r,
		source: "cdn"
	};
}
function i(e, t) {
	if (!t?.imports) return null;
	let n = t.imports;
	if (n[e]) return n[e];
	for (let [t, r] of Object.entries(n)) if (t.endsWith("/") && e.startsWith(t)) return `${r}${e.slice(t.length)}`;
	return null;
}
function a(n) {
	let r = e[n];
	if (r !== void 0) return r;
	for (let [e, r] of Object.entries(t)) if (n.startsWith(e)) return `${r}${n.slice(e.length)}/+esm`;
	return null;
}
//#endregion
export { n as resolveSpecifier, r as resolveSpecifierDebug };

//# sourceMappingURL=importmap-resolver.js.map