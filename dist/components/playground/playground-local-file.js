//#region src/components/playground/playground-local-file.ts
function e(e, t, n) {
	return n.aborted ? Promise.resolve(null) : new Promise((r) => {
		let i = e.ownerDocument.createElement("input");
		i.type = "file", i.accept = t, i.hidden = !0, i.setAttribute("data-tp-playground-file-input", "");
		let a = (e) => {
			i.remove(), n.removeEventListener("abort", o), r(e);
		}, o = () => a(null);
		i.addEventListener("change", () => a(i.files?.[0] ?? null), { once: !0 }), i.addEventListener("cancel", o, { once: !0 }), n.addEventListener("abort", o, { once: !0 }), e.append(i), i.click();
	});
}
//#endregion
export { e as choosePlaygroundFile };

//# sourceMappingURL=playground-local-file.js.map