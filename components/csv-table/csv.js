//#region src/components/csv-table/csv.ts
function e(e, t) {
	if (t.length !== 1 || /["\r\n]/.test(t)) throw Error("separator must be one character other than a quote or line break.");
	let n = e.replace(/^\uFEFF/, ""), r = [], i = [], a = "", o = !1, s = !1, c = !1;
	for (let e = 0; e < n.length; e++) {
		let l = n[e];
		if (o) {
			l === "\"" ? n[e + 1] === "\"" ? (a += "\"", e++) : (o = !1, s = !0) : a += l;
			continue;
		}
		if (l === t) i.push(a), a = "", s = !1, c = !0;
		else if (l === "\r" || l === "\n") c && r.push([...i, a]), i = [], a = "", s = !1, c = !1, l === "\r" && n[e + 1] === "\n" && e++;
		else if (s) {
			if (l !== " " && l !== "	") throw Error("Unexpected text after a quoted CSV field.");
		} else if (l === "\"") {
			if (a !== "") throw Error("A quoted CSV field must start with a quote.");
			o = !0, c = !0;
		} else a += l, c = !0;
	}
	if (o) throw Error("Unclosed quoted CSV field.");
	return c && r.push([...i, a]), r;
}
//#endregion
export { e as parseCsv };

