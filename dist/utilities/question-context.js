//#region src/utilities/question-context.ts
function e(e) {
	let t = e.parentElement;
	for (; t;) {
		if (t.localName === "tp-question" || "readResponseValue" in t && "validateSubmit" in t) return !0;
		let e = t.getRootNode();
		t = t.parentElement ?? (e instanceof ShadowRoot ? e.host : null);
	}
	return !1;
}
//#endregion
export { e as isInQuestion };

//# sourceMappingURL=question-context.js.map