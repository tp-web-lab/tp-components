//#region src/utilities/content-table.ts
function e(e, t, n) {
	let r = n.createElement("table"), i = Math.max(0, ...e.map((e) => e.length)), a = n.createElement("tbody");
	return e.forEach((e, o) => {
		let s = t && o === 0, c = n.createElement("tr");
		for (let t = 0; t < i; t++) {
			let r = n.createElement(s ? "th" : "td");
			s && r.setAttribute("scope", "col"), r.append(...e[t] ?? []), c.append(r);
		}
		if (s) {
			let e = n.createElement("thead");
			e.append(c), r.append(e);
		} else a.append(c);
	}), r.append(a), r;
}
//#endregion
export { e as createContentTable };

//# sourceMappingURL=content-table.js.map