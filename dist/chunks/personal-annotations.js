import { er as e } from "./lib/typescript/typescript.js";
import "../components/textfield/textfield.js";
import "./box.js";
import "./numberfield.js";
import { t } from "./color.js";
import "./stack.js";
import "./cluster.js";
import { t as n } from "./lib/dompurify/dompurify.js";
import { t as r } from "./post-it.js";
//#region src/utilities/personal-annotations.css?inline
var i = "tp-icon-button[data-action=annotations]>button{border:1px solid var(--tp-neutral-stroke-mid,#9ca3af);background:var(--tp-paper-color,#fff)}tp-icon-button[data-action=annotations]>button:hover{background:var(--tp-neutral-fill-soft,#e5e7eb)}[data-personal-annotation=panel]{box-sizing:border-box;max-block-size:calc(100dvh - 5rem);inline-size:min(36rem,100vw - 2rem);z-index:var(--tp-z-index-toast,1100);background:var(--tp-paper-color,Canvas);color:var(--tp-text-body,CanvasText);margin:0;position:fixed;inset:4rem 1rem auto auto;overflow:auto}[data-personal-annotation=panel][hidden]{display:none}[data-annotation-header]>h3{flex:1;align-items:center;gap:.35em;min-inline-size:0;margin:0;display:flex}[data-annotation-header]>h3>span{overflow-wrap:anywhere;min-inline-size:0}[data-annotation-header]>h3>tp-icon,[data-annotation-header]>tp-icon-button,[data-annotation-header]>tp-color{flex:none}[data-annotation-header]{gap:var(--tp-toolbar-section-gap,.25rem);border-block-end:1px solid var(--tp-brand-stroke-soft,currentColor);flex-wrap:nowrap;margin-block-end:var(--tp-space-xs,.5rem);padding-block-end:var(--tp-space-xs,.5rem)}[data-annotation-footer]>tp-cluster{gap:var(--tp-toolbar-section-gap,.25rem)}@media (width<=600px){[data-annotation-header]{flex-wrap:wrap}[data-annotation-header]>h3{flex-basis:100%}}[data-personal-annotation=panel]>p{margin-block:.5rem}[data-personal-annotation=panel]>p:empty{display:none}[data-annotation-editor]:not([hidden]){gap:.5rem;display:grid}[data-annotation-languages]>li{align-items:center;gap:var(--tp-space-xs,.5rem);display:flex}[data-annotation-languages] [data-language-check]{margin-inline-start:auto}[data-annotation-languages] [data-language-check][hidden]{display:none}[data-annotation-ranges]{flex-wrap:nowrap}[data-annotation-ranges]>tp-numberfield{flex:1;min-inline-size:0}[data-annotation-add]{margin-inline-end:var(--tp-space-xs,.5rem);font-size:2em}[data-annotation-header] tp-icon-button>button,[data-annotation-footer] tp-icon-button>button{border:1px solid var(--tp-brand-stroke-mid);border-radius:var(--tp-border-radius-circle)}[data-annotation-header] tp-icon-button>button:hover,[data-annotation-footer] tp-icon-button>button:hover{background:var(--tp-brand-fill-soft);color:var(--tp-brand-text-on-soft)}[data-annotation-footer]{border-block-start:1px solid var(--tp-brand-stroke-soft,currentColor);margin-block-start:var(--tp-space-xs,.5rem);padding-block-start:var(--tp-space-xs,.5rem)}[data-personal-annotation=panel]::backdrop{pointer-events:none}[data-annotation-selecting],[data-annotation-selecting] *{cursor:crosshair}[data-annotation-selecting] :is(p,li,h1,h2,h3,h4,h5,h6,figure,img,blockquote,pre):is(:hover,:focus-visible){outline-offset:2px;outline:2px dashed}", a = [
	"adoc",
	"html",
	"md",
	"rst",
	"txt"
], o = {
	none: "txt",
	html: "html",
	markdown: "md",
	asciidoc: "adoc",
	restructuredtext: "rst"
};
async function s(e, t) {
	let r = e;
	t === "md" && (r = await (await import("../components/markdown/markdown.js")).renderMarkdownToHtml(e)), t === "adoc" && (r = await (await import("../components/asciidoc/asciidoc.js")).renderAsciidocToHtml(e)), t === "rst" && (r = await (await import("../components/restructuredtext/restructuredtext.js")).renderRestructuredTextToHtml(e));
	let i = n.sanitize(r, {
		USE_PROFILES: { html: !0 },
		CUSTOM_ELEMENT_HANDLING: {
			tagNameCheck: /^tp-math$/,
			attributeNameCheck: /^(value|mode|displaystyle|label)$/
		},
		FORBID_TAGS: [
			"style",
			"iframe",
			"form"
		],
		FORBID_ATTR: ["style"],
		SANITIZE_NAMED_PROPS: !0
	}), a = document.createElement("template");
	a.innerHTML = i;
	for (let e of a.content.querySelectorAll("[data-mathjax-tex], [data-mathjax-asciimath]")) {
		if (e.closest("tp-math")) continue;
		let t = document.createElement("tp-math"), n = e.hasAttribute("data-mathjax-asciimath");
		t.setAttribute("value", e.getAttribute(n ? "data-mathjax-asciimath" : "data-mathjax-tex") ?? ""), t.setAttribute("mode", n ? "asciimath" : "latexmath"), t.toggleAttribute("displaystyle", e.getAttribute("data-mathjax-display") === "true"), e.replaceWith(t);
	}
	for (let e of a.content.querySelectorAll("tp-math")) {
		for (let t of [...e.attributes]) [
			"value",
			"mode",
			"displaystyle",
			"label"
		].includes(t.name) || e.removeAttribute(t.name);
		e.textContent = e.textContent ?? "";
	}
	return a.innerHTML;
}
var c = r.colors;
function l(e) {
	return {
		heading: typeof e.heading == "string" ? e.heading : "Personal annotation",
		color: e.color && c.includes(e.color) ? e.color : "yellow",
		opacity: typeof e.opacity == "number" && Number.isFinite(e.opacity) ? Math.max(0, Math.min(1, e.opacity)) : 1,
		rotation: typeof e.rotation == "number" && Number.isFinite(e.rotation) ? Math.max(-12, Math.min(12, e.rotation)) : 0
	};
}
function u(e) {
	let t = e.ownerDocument.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = "", r = t.nextNode();
	for (; r;) r.parentElement?.closest("[data-personal-annotation], script, style") || (n += r.textContent ?? ""), r = t.nextNode();
	return n.replace(/\s+/g, " ").trim().slice(0, 240);
}
function d(e, t) {
	let n = [], r = t;
	for (; r && r !== e;) {
		let e = r.localName, t = Array.from(r.parentElement?.children ?? []).filter((t) => t.localName === e);
		n.unshift(`${e}:nth-of-type(${t.indexOf(r) + 1})`), r = r.parentElement;
	}
	return {
		selector: t.id ? `[id=${JSON.stringify(t.id)}]` : n.join(" > "),
		tag: t.localName,
		quote: u(t)
	};
}
function f(e, t) {
	try {
		let n = e.querySelector(t.selector);
		if (n?.localName === t.tag && u(n) === t.quote) return n;
	} catch {}
	let n = Array.from(e.querySelectorAll("*")).filter((e) => e.localName === t.tag && !e.closest("[data-personal-annotation]") && u(e) === t.quote);
	return t.quote && n.length === 1 ? n[0] ?? null : null;
}
function p(e) {
	if (!e) return [];
	let t = JSON.parse(e);
	if (!Array.isArray(t)) throw Error("Invalid annotation data.");
	return t.filter((e) => {
		if (!e || typeof e != "object") return !1;
		let t = e;
		return [
			"id",
			"text",
			"selector",
			"tag",
			"quote"
		].every((e) => typeof t[e] == "string") && typeof t.x == "number" && Number.isFinite(t.x) && typeof t.y == "number" && Number.isFinite(t.y);
	});
}
var m = class {
	host;
	root;
	onMarkupChange;
	button = document.createElement("tp-icon-button");
	panel = document.createElement("tp-box");
	status = document.createElement("p");
	list = document.createElement("div");
	field = document.createElement("tp-textfield");
	languageButton = document.createElement("tp-icon-button");
	language = "txt";
	defaultLanguage = "txt";
	languageItems = /* @__PURE__ */ new Map();
	headingField = document.createElement("tp-textfield");
	colorField = new t();
	opacityField = document.createElement("tp-numberfield");
	rotationField = document.createElement("tp-numberfield");
	editor = document.createElement("div");
	records = [];
	notes = /* @__PURE__ */ new Map();
	key = "";
	draft = null;
	selecting = null;
	focusTargets = /* @__PURE__ */ new Map();
	observer = new MutationObserver((e) => {
		e.some((e) => !(e.target instanceof Element ? e.target : e.target.parentElement)?.closest("[data-personal-annotation]")) && this.restore();
	});
	layoutRoot;
	layoutObserver = typeof ResizeObserver > "u" ? null : new ResizeObserver(() => this.positionPanel());
	constructor(t, n, r) {
		if (this.host = t, this.root = n, this.onMarkupChange = r, this.layoutRoot = n.closest("main, [data-role=\"content\"]") ?? n.ownerDocument.documentElement, !t.ownerDocument.getElementById("tp-personal-annotations-style")) {
			let e = t.ownerDocument.createElement("style");
			e.id = "tp-personal-annotations-style", e.textContent = i, t.ownerDocument.head.append(e);
		}
		this.button.setAttribute("name", "post-it-editor"), this.button.setAttribute("library", "components"), this.button.setAttribute("label", "Personal annotations"), this.button.setAttribute("section", "start"), this.button.setAttribute("data-action", "annotations"), this.button.addEventListener("click", () => {
			this.showPanel(!!this.panel.hidden), this.panel.hidden || (this.renderList(), this.panel.focus());
		}), this.panel.setAttribute("data-personal-annotation", "panel"), this.panel.tabIndex = -1, this.panel.hidden = !0, this.panel.setAttribute("popover", "manual"), this.panel.setAttribute("role", "region"), this.panel.setAttribute("aria-label", "Personal annotations");
		let s = document.createElement("h3"), c = document.createElement("tp-icon");
		c.setAttribute("name", "post-it"), c.setAttribute("library", "components"), c.setAttribute("aria-hidden", "true");
		let l = document.createElement("span");
		l.textContent = "Personal annotations", s.append(c, l);
		let u = document.createElement("tp-cluster");
		u.setAttribute("data-annotation-header", ""), u.setAttribute("align", "center"), u.setAttribute("gap", "var(--tp-toolbar-section-gap, 0.25rem)"), u.setAttribute("justify", "space-between"), u.append(s, this.iconAction("close", "Close", () => {
			this.showPanel(!1), this.cancelSelection(), this.button.querySelector("button")?.focus();
		}));
		let d = this.iconAction("plus", "Add annotation", () => this.select("new"));
		d.setAttribute("data-annotation-add", ""), u.insertBefore(d, u.lastElementChild), this.status.setAttribute("role", "status");
		let f = document.createElement("p");
		f.textContent = "Saved only in this browser for this document. Clearing site data deletes these notes. Select a target below, or focus an element and press Enter. Escape cancels selection.";
		let p = document.createElement("details"), m = document.createElement("summary");
		m.textContent = "Help and local storage", p.append(m, f), this.field.setAttribute("multiline", ""), this.field.setAttribute("rows", "2"), this.field.setAttribute("aria-label", "Annotation text"), this.field.setAttribute("label", "Annotation text"), this.field.setAttribute("clearable", ""), this.headingField.setAttribute("label", "heading"), this.headingField.setAttribute("aria-label", "heading"), this.headingField.setAttribute("clearable", ""), this.colorField.id = `annotation-color-${crypto.randomUUID()}`, this.colorField.anchor = `#${this.colorField.id}`, this.colorField.preset = "tp-yellow", [this.opacityField, this.rotationField].forEach((e) => {
			e.setAttribute("range", "");
		}), this.opacityField.setAttribute("label", "opacity"), this.opacityField.setAttribute("min", "0"), this.opacityField.setAttribute("max", "1"), this.opacityField.setAttribute("step", "0.05"), this.rotationField.setAttribute("label", "rotation"), this.rotationField.setAttribute("min", "-12"), this.rotationField.setAttribute("max", "12"), this.rotationField.setAttribute("step", "1");
		let h = document.createElement("tp-cluster");
		h.setAttribute("data-annotation-ranges", ""), h.setAttribute("gap", "0.75rem"), h.append(this.opacityField, this.rotationField);
		let g = document.createElement("tp-stack");
		g.setAttribute("gap", "0.5rem"), g.append(this.headingField, h);
		let _ = document.createElement("tp-button-group");
		_.append(this.action("Save", () => this.saveDraft()), this.action("Cancel", () => {
			this.draft = null, this.setEditing(!1), this.list.hidden = !1;
		}), this.action("Reset appearance defaults", () => this.editAppearance({
			heading: "",
			color: "yellow",
			opacity: 1,
			rotation: 0
		}))), this.editor.setAttribute("data-annotation-editor", ""), this.languageButton.id = `annotation-language-${crypto.randomUUID()}`, this.languageButton.setAttribute("label", "Annotation language"), this.languageButton.setAttribute("aria-label", "Annotation language"), this.languageButton.setAttribute("aria-haspopup", "menu"), this.languageButton.setAttribute("aria-expanded", "false");
		let v = new e();
		v.setAttribute("anchor", `#${this.languageButton.id}`), v.setAttribute("outside-click", "");
		let y = document.createElement("ul");
		y.setAttribute("data-annotation-languages", "");
		let b = {
			adoc: "file_type_asciidoc",
			html: "file_type_html",
			md: "file_type_markdown",
			rst: "file_type_restructuredtext",
			txt: "language-text"
		}, x = {
			adoc: "AsciiDoc",
			html: "HTML",
			md: "Markdown",
			rst: "reStructuredText",
			txt: "Plain text"
		};
		a.forEach((e) => {
			let t = document.createElement("li");
			t.setAttribute("data-language", e);
			let n = document.createElement("tp-icon");
			n.setAttribute("library", e === "txt" ? "tp" : "languages"), n.setAttribute("name", b[e]), n.setAttribute("aria-hidden", "true");
			let r = document.createElement("span");
			r.textContent = x[e];
			let i = document.createElement("tp-icon");
			i.setAttribute("name", "check"), i.setAttribute("library", "tp"), i.setAttribute("aria-hidden", "true"), i.setAttribute("data-language-check", ""), t.append(n, r, i), this.languageItems.set(e, t), t.addEventListener("click", () => {
				this.language = e;
				let t = Object.keys(o).find((t) => o[t] === e);
				t && this.onMarkupChange?.(t), this.syncLanguageMenu(), v.hide(), this.languageButton.querySelector("button")?.focus();
			}), t.addEventListener("keydown", (e) => {
				e.key !== "Enter" && e.key !== " " || (e.preventDefault(), e.stopPropagation(), t.click());
			}), y.append(t);
		}), v.append(y), this.syncLanguageMenu(), this.languageButton.addEventListener("click", () => v.toggle()), v.addEventListener("tp-dropdown-toggle", () => this.languageButton.setAttribute("aria-expanded", String(v.hasAttribute("open"))));
		let S = u.lastElementChild;
		u.insertBefore(this.languageButton, S), u.insertBefore(this.colorField, S), this.editor.append(this.field, g, _), this.setEditing(!1), this.panel.append(u, p, this.status, this.editor, this.list), this.panel.append(v), this.host.append(this.panel), this.root.addEventListener("click", this.pick, !0), this.host.ownerDocument.addEventListener("keydown", this.keyboard, !0), this.observer.observe(this.root, {
			childList: !0,
			subtree: !0
		}), this.layoutObserver?.observe(this.root), this.layoutRoot !== this.root && this.layoutObserver?.observe(this.layoutRoot), this.host.ownerDocument.defaultView?.addEventListener("resize", this.positionPanel);
	}
	setEditing(e) {
		this.editor.hidden = !e, this.languageButton.toggleAttribute("disabled", !e), this.colorField.disabled = !e;
	}
	syncLanguageMenu() {
		let e = this.languageItems.get(this.language)?.querySelector(":scope > span")?.textContent;
		this.languageButton.setAttribute("title", e ?? "Plain text"), this.languageButton.setAttribute("aria-description", `Current language: ${e ?? "Plain text"}`);
		let t = this.languageItems.get(this.language)?.querySelector("tp-icon");
		this.languageButton.setAttribute("name", t?.getAttribute("name") ?? "language-text"), this.languageButton.setAttribute("library", t?.getAttribute("library") ?? "tp"), this.languageItems.forEach((e, t) => {
			let n = t === this.language;
			e.setAttribute("aria-current", String(n));
			let r = e.querySelector("[data-language-check]");
			r && (r.hidden = !n);
		});
	}
	positionPanel = () => {
		if (this.panel.hidden) return;
		let e = this.host.ownerDocument.defaultView;
		if (!e) return;
		let t = this.layoutRoot.getBoundingClientRect(), n = t.width > 0 ? Math.min(e.innerWidth, t.right) : e.innerWidth, r = t.width > 0 ? Math.max(0, t.left) : 0;
		this.panel.style.right = `${Math.max(16, e.innerWidth - n + 16)}px`, this.panel.style.inlineSize = `min(36rem, ${Math.max(0, n - r - 32)}px)`;
	};
	showPanel(e) {
		this.panel.hidden = !e, e ? (this.positionPanel(), typeof this.panel.hidePopover == "function" && this.panel.matches(":popover-open") && this.panel.hidePopover(), this.panel.showPopover?.()) : this.panel.hidePopover?.();
	}
	action(e, t) {
		let n = document.createElement("tp-button");
		return n.textContent = e, n.addEventListener("click", t), n;
	}
	iconAction(e, t, n) {
		let r = document.createElement("tp-icon-button");
		return r.setAttribute("name", e), r.setAttribute("label", t), r.addEventListener("click", n), r;
	}
	setPage(e) {
		if (this.notes.forEach((e) => {
			e.remove();
		}), this.notes.clear(), this.cancelSelection(), this.draft = null, this.setEditing(!1), this.key = e ? `tp-personal-annotations:v1:${e}` : "", this.records = [], this.status.textContent = "", this.key) try {
			this.records = p(this.host.ownerDocument.defaultView?.localStorage.getItem(this.key) ?? null);
		} catch {
			this.status.textContent = "Saved annotations could not be read. Browser storage may be unavailable or the saved data invalid.";
		}
		this.restore(), this.renderList();
	}
	restore() {
		this.records.forEach((e) => {
			let t = f(this.root, e), n = this.notes.get(e.id);
			if (!t) {
				n?.remove(), this.notes.delete(e.id);
				return;
			}
			if (n?.isConnected) {
				n.attachment?.element !== t && n.attachTo(t, e.x, e.y);
				return;
			}
			let r = document.createElement("tp-post-it");
			r.setAttribute("data-personal-annotation", e.id), Object.assign(r, l(e)), r.lite = !0;
			let i = document.createElement("div");
			i.setAttribute("data-annotation-content", ""), i.textContent = e.text, i.style.whiteSpace = "pre-wrap", e.language && a.includes(e.language) && e.language !== "txt" && s(e.text, e.language).then(async (e) => {
				e.includes("<tp-math") && await import("../components/math/math.js"), i.isConnected && (i.style.whiteSpace = "normal", i.innerHTML = e);
			}).catch(() => {
				i.textContent = `Unable to render this annotation.\n${e.text}`;
			});
			let o = document.createElement("footer");
			o.setAttribute("data-annotation-footer", "");
			let c = document.createElement("tp-cluster");
			c.setAttribute("justify", "end"), c.setAttribute("align", "center"), c.setAttribute("gap", "var(--tp-toolbar-section-gap, 0.25rem)"), c.append(this.iconAction("pencil", "Edit", () => this.edit(e)), this.iconAction("delete-outline", "Delete", () => this.remove(e.id))), o.append(c), r.append(i, o), this.host.append(r), r.attachTo(t, e.x, e.y, !0), r.addEventListener("tp-post-it-move", () => {
				let n = r.attachment;
				if (!n || n.element === this.root || !this.root.contains(n.element) || n.element.closest("[data-personal-annotation]")) {
					r.attachTo(t, e.x, e.y);
					return;
				}
				Object.assign(e, d(this.root, n.element), {
					x: n.x,
					y: n.y
				}), this.persist();
			}), this.notes.set(e.id, r);
		}), this.panel.hidden || this.renderList();
	}
	persist() {
		try {
			this.host.ownerDocument.defaultView?.localStorage.setItem(this.key, JSON.stringify(this.records)), this.status.textContent = "Annotations saved in this browser.";
		} catch {
			this.showPanel(!0), this.status.textContent = "Unable to save annotations. Changes are only kept in memory; browser storage may be full or disabled.";
		}
		this.renderList();
	}
	renderList() {
		this.list.hidden = this.draft !== null, this.list.replaceChildren(), this.records.forEach((e) => {
			let t = document.createElement("div"), n = document.createElement("p");
			n.textContent = `${e.text}${f(this.root, e) ? "" : " — Target unavailable. Reattach this annotation."}`;
			let r = document.createElement("tp-button-group");
			r.append(this.action("Edit", () => this.edit(e)), this.action("Reattach", () => this.select(e.id)), this.action("Delete", () => this.remove(e.id))), t.append(n, r), this.list.append(t);
		});
	}
	setMarkup(e) {
		this.defaultLanguage = o[e], this.language = this.defaultLanguage, this.syncLanguageMenu();
	}
	edit(e) {
		this.draft = { ...e }, this.status.textContent = "", this.list.hidden = !0, this.field.value = e.text, this.language = e.language && a.includes(e.language) ? e.language : "txt", this.editAppearance(l(e)), this.syncLanguageMenu(), this.showPanel(!0), this.setEditing(!0), this.field.focus();
	}
	editAppearance(e) {
		this.headingField.value = e.heading, this.colorField.preset = `tp-${e.color}`, this.opacityField.value = String(e.opacity), this.rotationField.value = String(e.rotation);
	}
	saveDraft() {
		if (!this.draft || !this.key) return;
		let e = this.field.value.trim();
		if (!e) {
			this.status.textContent = "Enter annotation text before saving.";
			return;
		}
		let t = {
			...this.draft,
			text: e,
			language: this.language,
			...l({
				...this.draft,
				heading: this.headingField.value,
				color: this.colorField.preset.slice(3),
				opacity: Number(this.opacityField.value),
				rotation: Number(this.rotationField.value)
			})
		};
		this.records = this.records.filter((e) => e.id !== t.id), this.records.push(t), this.notes.get(t.id)?.remove(), this.notes.delete(t.id), this.draft = null, this.setEditing(!1), this.persist(), this.restore();
	}
	remove(e) {
		this.records = this.records.filter((t) => t.id !== e), this.notes.get(e)?.remove(), this.notes.delete(e), this.persist();
	}
	select(e) {
		if (!this.key) {
			this.status.textContent = "Open a rendered document first.";
			return;
		}
		this.cancelSelection(), this.selecting = e, this.status.textContent = "Select an element in the document. Escape cancels.", this.showPanel(!0), this.root.setAttribute("data-annotation-selecting", ""), this.root.querySelectorAll("p, li, h1, h2, h3, h4, h5, h6, figure, img, blockquote, pre").forEach((e) => {
			this.focusTargets.set(e, e.getAttribute("tabindex")), e.tabIndex = 0;
		}), this.focusTargets.set(this.root, this.root.getAttribute("tabindex")), this.root.tabIndex = 0, this.root.focus();
	}
	cancelSelection() {
		this.selecting = null, this.root.removeAttribute("data-annotation-selecting"), this.focusTargets.forEach((e, t) => {
			e === null ? t.removeAttribute("tabindex") : t.setAttribute("tabindex", e);
		}), this.focusTargets.clear();
	}
	pick = (e) => {
		!this.selecting || !(e.target instanceof Element) || (e.preventDefault(), e.stopImmediatePropagation(), this.choose(e.target, e.clientX, e.clientY));
	};
	keyboard = (e) => {
		if (this.selecting) {
			if (e.key === "Escape") e.preventDefault(), this.cancelSelection(), this.status.textContent = "Selection cancelled.", this.showPanel(!0), this.button.querySelector("button")?.focus();
			else if (e.key === "Enter" && e.target instanceof Element && this.root.contains(e.target)) {
				e.preventDefault(), e.stopImmediatePropagation();
				let t = e.target === this.root ? this.root.firstElementChild : e.target;
				if (t) {
					let e = t.getBoundingClientRect();
					this.choose(t, e.left + 20, e.top + 20);
				}
			}
		}
	};
	choose(e, t, n) {
		if (e === this.root || e.closest("[data-personal-annotation], script, style, tp-toolbar")) return;
		let r = this.selecting;
		this.cancelSelection();
		let i = e.getBoundingClientRect(), a = {
			...d(this.root, e),
			x: t - i.left,
			y: n - i.top
		}, o = this.records.find((e) => e.id === r);
		o ? (Object.assign(o, a), this.notes.get(o.id)?.remove(), this.notes.delete(o.id), this.persist(), this.restore(), this.showPanel(!0)) : this.edit({
			id: crypto.randomUUID(),
			language: this.defaultLanguage,
			text: "",
			heading: "",
			color: "yellow",
			opacity: 1,
			rotation: 0,
			...a
		});
	}
	dispose() {
		this.observer.disconnect(), this.layoutObserver?.disconnect(), this.host.ownerDocument.defaultView?.removeEventListener("resize", this.positionPanel), this.cancelSelection(), this.root.removeEventListener("click", this.pick, !0), this.host.ownerDocument.removeEventListener("keydown", this.keyboard, !0), this.notes.forEach((e) => {
			e.remove();
		}), this.notes.clear(), this.panel.remove(), this.button.remove();
	}
};
//#endregion
export { s as a, p as i, o as n, f as o, d as r, m as t };

//# sourceMappingURL=personal-annotations.js.map