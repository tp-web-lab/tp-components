//#region src/utilities/text-direction.ts
var e = /* @__PURE__ */ new Set([
	"ar",
	"arc",
	"ckb",
	"dv",
	"fa",
	"he",
	"ks",
	"nqo",
	"pa",
	"pnb",
	"ps",
	"sd",
	"ug",
	"ur",
	"yi"
]), t = /* @__PURE__ */ new Set([
	"ae",
	"bh",
	"dz",
	"eg",
	"iq",
	"jo",
	"kw",
	"lb",
	"ly",
	"ma",
	"mr",
	"om",
	"ps",
	"qa",
	"sa",
	"sd",
	"sy",
	"tn",
	"ye"
]);
function n(n) {
	let r = n.trim().toLowerCase().split("-")[0] ?? "";
	return e.has(r) || t.has(r);
}
function r(e) {
	return n(e) ? "rtl" : "ltr";
}
//#endregion
export { n as isRtlLocale, r as resolveTextDirection };

//# sourceMappingURL=text-direction.js.map