import { registerTpIconLibrary as e } from "./icon-registry.js";
//#region src/components/icon/icon-vite.ts
function t(e) {
	let t = e.replace(/\\/g, "/");
	return (t.split("/").pop() ?? t).replace(/\.svg$/i, "");
}
function n(e) {
	return e.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_\-\s]+/g, " ").trim().split(/\s+/).filter((e) => e !== "").map((e) => e.toLowerCase());
}
function r(e, t) {
	if (t === "none") return e;
	let r = n(e);
	return r.length === 0 ? "" : t === "kebab" ? r.join("-") : r.map((e, t) => t === 0 ? e : `${e.charAt(0).toUpperCase()}${e.slice(1)}`).join("");
}
function i(n, i, a = {}) {
	let o = {};
	for (let [e, n] of Object.entries(i)) {
		let i;
		a.fileNameToIconName === void 0 ? (i = e, a.stripPrefix !== void 0 && i.startsWith(a.stripPrefix) && (i = i.slice(a.stripPrefix.length)), a.stripSuffix !== void 0 && i.endsWith(a.stripSuffix) && (i = i.slice(0, -a.stripSuffix.length)), i === e && (i = t(e)), a.namePrefix !== void 0 && i.startsWith(a.namePrefix) && (i = i.slice(a.namePrefix.length)), i = r(i, a.normalize ?? "none")) : i = a.fileNameToIconName(e), i !== "" && (o[i] = n);
	}
	e(n, o);
}
//#endregion
export { i as registerTpIconLibraryFromGlob };

//# sourceMappingURL=icon-vite.js.map