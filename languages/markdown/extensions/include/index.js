//#region src/languages/markdown/extensions/include/index.ts
function e(e, t = {}) {
	let r = t.files ?? {}, i = t.entryPath ?? "/index.md", a = e.render.bind(e);
	e.render = (e, t = {}) => {
		let o = typeof t.path == "string" && t.path !== "" ? t.path : i;
		return a(n(e, o, r), t);
	};
}
function t(e, t) {
	if (t.startsWith("/")) return t;
	let n = e.split("/").filter(Boolean);
	n.pop();
	let r = [...n];
	for (let e of t.split("/")) if (!(e === "" || e === ".")) {
		if (e === "..") {
			r.pop();
			continue;
		}
		r.push(e);
	}
	return `/${r.join("/")}`;
}
function n(e, r, i, a = /* @__PURE__ */ new Set()) {
	return e.replace(/^::include\{(.+?)\}\s*$/gm, (e, o) => {
		let s = t(r, o.trim());
		if (a.has(s)) return `> Circular include ignored: \`${s}\``;
		let c = i[s];
		if (typeof c != "string") return `> Include not found: \`${s}\``;
		a.add(s);
		let l = n(c, s, i, a);
		return a.delete(s), l;
	});
}
//#endregion
export { e as default };

