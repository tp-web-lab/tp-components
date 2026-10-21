import "../textfield/textfield.js";
//#region src/components/markup-multi-pages/sidebar-tools.ts
function e(e, t) {
	let n = (t, n) => {
		let r = document.createElement("tp-icon-button");
		return r.name = t, r.setAttribute("label", n), r.setAttribute("title", n), e.append(r), r;
	}, r = null, i = n("arrow-expand-horizontal", "Widen table of contents");
	i.setAttribute("aria-pressed", "false"), i.addEventListener("click", () => {
		let e = t.closest("[data-role=\"sidebar\"]"), n = e?.closest("tp-splitter");
		if (!e || !n) return;
		if (r !== null) n.position = r, r = null, e.removeAttribute("data-tp-sidebar-wide"), e.style.removeProperty("--tp-sidebar-expanded-width");
		else {
			r = n.position;
			let i = t.cloneNode(!0);
			i.setAttribute("aria-hidden", "true"), i.setAttribute("inert", ""), i.style.cssText = "position:fixed;inset-inline-start:-100000px;visibility:hidden;inline-size:max-content;max-inline-size:none;white-space:nowrap";
			for (let e of i.querySelectorAll("[id]")) e.removeAttribute("id");
			for (let e of i.querySelectorAll("li")) e.setAttribute("data-expanded", "true");
			e.append(i), i.expandAll();
			let a = Math.ceil(i.getBoundingClientRect().width + 48);
			i.remove();
			let o = n.getBoundingClientRect().width, s = e.getBoundingClientRect().width;
			o > 0 && (n.position = `${Math.min(90, Math.max(s, a) / o * 100)}%`), e.style.setProperty("--tp-sidebar-expanded-width", `${a}px`), e.setAttribute("data-tp-sidebar-wide", "");
		}
		let a = r !== null;
		i.name = a ? "arrow-collapse-horizontal" : "arrow-expand-horizontal";
		let o = a ? "Restore table of contents width" : "Widen table of contents";
		i.setAttribute("label", o), i.setAttribute("title", o), i.setAttribute("aria-pressed", String(a));
	});
	let a = n("search", "Search table of contents");
	e.prepend(a), a.setAttribute("aria-expanded", "false");
	let o = document.createElement("div");
	o.setAttribute("data-tp-sidebar-search", ""), o.hidden = !0;
	let s = document.createElement("tp-textfield");
	s.setAttribute("label", "Search table of contents"), s.setAttribute("clearable", "");
	let c = document.createElement("span");
	c.setAttribute("role", "status"), o.append(s, c), e.append(o);
	let l = (e) => e.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase().trim(), u = [], d = -1, f = () => {
		let n = u[d], r = t.closest("[data-role=\"sidebar\"]");
		if (!n || !r) return;
		let i = r.scrollTop + n.getBoundingClientRect().top - r.getBoundingClientRect().top - e.getBoundingClientRect().height - 12;
		r.scrollTop = Math.max(0, i);
	}, p = () => {
		let e = l(s.value);
		u = [];
		for (let n of t.querySelectorAll("[data-tp-tree-row]")) {
			let r = n.cloneNode(!0);
			r.querySelector("[data-tp-tree-toggle]")?.remove();
			let i = e !== "" && l(r.textContent ?? "").includes(e);
			if (n.toggleAttribute("data-tp-sidebar-match", i), !i) continue;
			u.push(n);
			let a = n.closest("li")?.parentElement?.closest("li");
			for (; a && t.contains(a);) t.expandNode(a), a = a.parentElement?.closest("li");
		}
		d = u.length ? 0 : -1, c.textContent = e ? `${u.length} result${u.length === 1 ? "" : "s"}` : "", c.toggleAttribute("data-tp-sidebar-no-results", e !== "" && u.length === 0), f();
	};
	s.addEventListener("input", p), a.addEventListener("click", () => {
		o.hidden = !o.hidden, a.setAttribute("aria-expanded", String(!o.hidden)), o.hidden ? (s.value = "", p()) : s.querySelector("input")?.focus();
	}), s.addEventListener("keydown", (e) => {
		e.key === "Escape" ? (e.preventDefault(), o.hidden = !0, s.value = "", p(), a.setAttribute("aria-expanded", "false"), a.querySelector("button")?.focus()) : e.key === "Enter" && u.length && (e.preventDefault(), d = (d + 1) % u.length, f());
	});
}
//#endregion
export { e as appendSidebarTools };

//# sourceMappingURL=sidebar-tools.js.map