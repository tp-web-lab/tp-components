//#region ../tp-markdown/dist/markdown/renderers/references.js
var e = {
	id: "references",
	render(e) {
		for (let t of e.querySelectorAll(".tp-md-reference-link")) t instanceof HTMLElement && s(t);
		for (let t of e.querySelectorAll(".tp-md-index-link")) t instanceof HTMLElement && c(e, t);
		for (let n of e.querySelectorAll("[data-tp-md-listof]")) n instanceof HTMLElement && t(e, n);
	}
};
function t(e, t) {
	let r = t.dataset.tpMdListof ?? "";
	if (r === "") return;
	let i = [...e.querySelectorAll(r)].filter((e) => e instanceof HTMLElement).filter((e) => e !== t && !t.contains(e)).filter((e) => !p(e)).filter((e) => !m(e)).map((e) => n(e)).filter((e) => e !== null);
	if (i.length === 0) {
		t.replaceChildren();
		return;
	}
	let a = document.createElement("ol");
	a.className = "tp-md-listof-list", a.append(...i), t.replaceChildren(a);
	for (let e of t.querySelectorAll(".tp-md-listof-link")) o(e);
}
function n(e) {
	let t = r(e);
	if (t === "") return null;
	e.id === "" && (e.id = i(t));
	let n = document.createElement("li"), a = document.createElement("a"), o = document.createElement("span");
	return a.className = "tp-md-listof-link", a.href = `#${e.id}`, a.textContent = t, o.className = "tp-md-listof-tooltip", o.setAttribute("role", "tooltip"), o.append(f(e)), a.append(o), n.append(a), n;
}
function r(e) {
	let t = e.getAttribute("label")?.trim();
	if (t !== void 0 && t !== "") return t;
	let n = e.querySelector("figcaption")?.textContent?.trim();
	if (n !== void 0 && n !== "") return n;
	let r = e.querySelector("caption")?.textContent?.trim();
	return r !== void 0 && r !== "" ? r : "";
}
function i(e) {
	return `listof-${a(e)}`;
}
function a(e) {
	return e.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/^-+|-+$/g, "");
}
function o(e) {
	let t = e.querySelector(".tp-md-listof-tooltip");
	if (t === null) return;
	let n = () => {
		t.dataset.open = "true", requestAnimationFrame(() => {
			u(e, t);
		});
	}, r = () => {
		delete t.dataset.open;
	};
	e.addEventListener("pointerenter", n), e.addEventListener("focus", n), e.addEventListener("pointerleave", r), e.addEventListener("blur", r);
}
function s(e) {
	if (e.dataset.referenceTooltipRendered === "true") return;
	let t = e.closest(".tp-md-note-ref-wrap"), n = t?.querySelector(".tp-md-reference-tooltip") ?? e.querySelector(".tp-md-reference-tooltip");
	if (n === null) return;
	let r = t ?? e;
	e.dataset.referenceTooltipRendered = "true";
	let i = () => {
		n.dataset.open = "true", requestAnimationFrame(() => {
			u(r, n);
		});
	}, a = () => {
		delete n.dataset.open;
	};
	e.addEventListener("pointerenter", i), e.addEventListener("pointermove", i), e.addEventListener("focus", i), e.addEventListener("pointerleave", a), e.addEventListener("blur", a), window.addEventListener("scroll", () => {
		n.dataset.open === "true" && u(r, n);
	}, !0), window.addEventListener("resize", () => {
		n.dataset.open === "true" && u(r, n);
	});
}
function c(e, t) {
	let n = t.dataset.tpMdIndexTarget ?? "";
	if (n === "") return;
	let r = t.querySelector(".tp-md-index-tooltip");
	if (r === null) return;
	let i = e.querySelector(`#${CSS.escape(n)}`);
	if (i === null) return;
	r.replaceChildren(l(i));
	let a = () => {
		r.dataset.open = "true", requestAnimationFrame(() => {
			u(t, r);
		});
	}, o = () => {
		delete r.dataset.open;
	};
	t.addEventListener("pointerenter", a), t.addEventListener("focus", a), t.addEventListener("pointerleave", o), t.addEventListener("blur", o);
}
function l(e) {
	let t = document.createElement("div");
	t.dataset.tpMdIndexPreview = "";
	let n = e.closest("section, article, figure, table, blockquote, li, p") ?? e, r = n.cloneNode(!0);
	r instanceof Element ? t.append(r) : t.textContent = n.textContent ?? "";
	for (let e of t.querySelectorAll("script, style, iframe, .tp-md-index-tooltip")) e.remove();
	return t;
}
function u(e, t) {
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect(), i = n.left + n.width / 2 - r.width / 2, a = n.top - r.height - 12;
	a < 12 && (a = n.bottom + 12), i = d(i, 12, window.innerWidth - r.width - 12), a = d(a, 12, window.innerHeight - r.height - 12), t.style.left = `${i}px`, t.style.top = `${a}px`;
}
function d(e, t, n) {
	return Math.min(Math.max(e, t), Math.max(t, n));
}
function f(e) {
	let t = document.createElement("div"), n = e.cloneNode(!0);
	t.dataset.tpMdListofPreview = "", n instanceof Element ? t.append(n) : t.textContent = e.textContent ?? "";
	for (let e of t.querySelectorAll("script, style, iframe")) e.remove();
	return t;
}
function p(e) {
	return e.closest([
		".tp-md-bibliography",
		".tp-md-glossary",
		".tp-md-notes",
		".tp-md-index",
		".tp-md-reference-tooltip",
		".tp-md-listof-tooltip",
		"[data-tp-md-listof-preview]",
		"[data-tp-md-index-preview]"
	].join(",")) !== null;
}
function m(e) {
	return e.closest(".tp-md-listof") !== null;
}
//#endregion
export { e as default };

//# sourceMappingURL=references.js.map