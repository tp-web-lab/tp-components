//#region src/utilities/help-buttons.ts
function e(e, t) {
	let n = e.ownerDocument, r = /* @__PURE__ */ new Set([
		"tp-button-group",
		"tp-toolbar",
		"tp-cluster",
		"tp-stack",
		"tp-inline",
		"tp-grid",
		"tp-box",
		"tp-center",
		"tp-sidebar",
		"tp-splitter"
	]), i = "button, [role=\"button\"], tp-icon-button, tp-button", a = [...e.matches(i) ? [e] : [], ...e.querySelectorAll("button, [role=\"button\"], tp-icon-button, tp-button")], o = t.split("\n").filter((e) => e.startsWith("|")).map((e) => e.split("|").slice(1, -1).map((e) => e.replace(/:tp-icon:\{[^}]*\}|<[^>]*>|[*`]/g, "").trim())), s = (e) => e.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim(), c = n.createElement("section");
	c.className = "tp-component-help-buttons tp-markdown-output";
	let l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set(), d = (e) => {
		let t = l.get(e);
		if (t) return t;
		let r = n.createElement("h4");
		r.textContent = e;
		let i = n.createElement("table");
		i.className = "tp-md-table";
		let a = i.createTHead().insertRow();
		for (let e of ["Button", "Description"]) {
			let t = n.createElement("th");
			t.scope = "col", t.textContent = e, a.append(t);
		}
		let o = i.createTBody();
		return l.set(e, o), c.append(r, i), o;
	};
	for (let t of a) {
		if (t.namespaceURI !== "http://www.w3.org/1999/xhtml" || t.localName === "dt") continue;
		let a = !1;
		for (let n = t; n && n !== e; n = n.parentElement) if (n.matches("[hidden], [aria-hidden=\"true\"], [data-help-ignore], [data-role=\"content\"], .tp-component-help") || n !== t && (n.matches(i) || n.localName.startsWith("tp-") && !r.has(n.localName))) {
			a = !0;
			break;
		}
		if (t !== e && e.matches(i) && (a = !0), a) continue;
		let c = t.querySelector("button, [role=button]"), l = t.getAttribute("label") || t.getAttribute("aria-label") || c?.getAttribute("aria-label") || t.getAttribute("title") || t.textContent?.trim();
		if (!l) continue;
		let f = t.matches("tp-icon-button") ? t : t.querySelector("tp-icon"), p = f?.getAttribute("name") ?? "", m = f?.getAttribute("library") ?? "", h = t.closest("[data-help-group], tp-button-group[aria-label], [role=toolbar][aria-label]"), g = h && e.contains(h) && (h.getAttribute("data-help-group") || h.getAttribute("aria-label")) || "Buttons", _ = `${g}|${l}|${p}|${m}`;
		if (u.has(_)) continue;
		u.add(_);
		let v = d(g).insertRow(), y = v.insertCell();
		if (p) {
			let e = n.createElement("tp-icon");
			e.setAttribute("name", p), m && e.setAttribute("library", m), e.setAttribute("aria-hidden", "true"), e.setAttribute("size", "2em"), y.append(e, " ");
		}
		y.append(n.createTextNode(l));
		let b = l.replace(RegExp(`^${e.localName.replace(/^tp-/, "").replace(/-/g, " ")} `, "i"), "").replace(/ selected piece/g, ""), x = o.find(([e]) => s(e ?? "") === s(l)) ?? o.find(([e]) => (e ?? "").split(" / ").some((e) => s(e.split(" (")[0] ?? "") === s(b)));
		v.insertCell().textContent = t.getAttribute("data-help-description") || t.getAttribute("aria-description") || x?.[1]?.split(/(?<=[.!?])\s/)[0] || t.getAttribute("title") || l;
	}
	return l.size ? c : null;
}
//#endregion
export { e as createHelpButtonTable };

//# sourceMappingURL=help-buttons.js.map