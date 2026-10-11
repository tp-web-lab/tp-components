//#region src/utilities/save-file.ts
function e(e, t) {
	let n = e.trim();
	return n.toLowerCase().endsWith(t.toLowerCase()) ? n : `${n || "download"}${t}`;
}
async function t(t) {
	let n = window.showSaveFilePicker;
	if (n) try {
		let r = await n({
			suggestedName: t.suggestedName,
			types: [{
				description: t.description,
				accept: { [t.mimeType]: [t.extension] }
			}]
		});
		return {
			filename: e(r.name, t.extension),
			handle: r
		};
	} catch (e) {
		if (e instanceof DOMException && e.name === "AbortError") return null;
		throw e;
	}
	let r = t.suggestedName;
	try {
		let e = window.prompt("Save as", t.suggestedName);
		if (e === null) return null;
		r = e;
	} catch {}
	return { filename: e(r, t.extension) };
}
async function n(e, t) {
	if (t.handle) {
		let n = await t.handle.createWritable();
		await n.write(e), await n.close();
		return;
	}
	let n = URL.createObjectURL(e), r = document.createElement("a");
	r.href = n, r.download = t.filename, r.click(), URL.revokeObjectURL(n);
}
//#endregion
export { t as chooseSaveTarget, n as saveBlob };

//# sourceMappingURL=save-file.js.map