//#region ../../../../../../@tp/tp-markdown/dist/markdown/extensions/simple-list-fence.js
var e = /^(?:[-*+]|\d+[.)])\s+(.+)$/;
function t(t) {
	let n = t.split("\n").map((e) => e.trim()).filter((e) => e !== "");
	if (n.length === 0) return "";
	let r = n.map((t) => e.exec(t)?.[1]?.trim() ?? null);
	return r.every((e) => e !== null) ? r.join("\n") : t.trim();
}
//#endregion
export { t };

