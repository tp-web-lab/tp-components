import { Ku as e, Yn as t } from "./lib/typescript/typescript.js";
//#region src/components/matching/matching.css?inline
var n = "tp-matching{grid-template-columns:repeat(var(--tp-matching-columns,2), minmax(0, 1fr));gap:1rem;min-inline-size:0;display:grid}tp-matching [data-matching-list]{min-inline-size:0;margin:0;padding:0;list-style:none}tp-matching [data-matching-list]>li{border:1px solid var(--tp-neutral-stroke-soft);border-radius:var(--tp-border-radius-m,.5rem);overflow-wrap:anywhere;margin:0 0 .75rem;padding:.75rem;list-style:none}tp-matching [data-matching-list]>li[data-matching-paired]{background:var(--tp-brand-fill-softer);color:var(--tp-brand-text-on-soft);border-color:var(--tp-brand-stroke-loud)}tp-matching [data-matching-list]>li[data-matching-paired]>.tp-matching-controls>span{background:var(--tp-brand-fill-soft);color:var(--tp-brand-text-on-soft);border:1px solid var(--tp-brand-stroke-loud);border-radius:var(--tp-border-radius-sm);padding:.125em .375em}tp-matching [data-matching-list]>li[data-matching-selected]{outline:2px solid var(--tp-brand-stroke-loud);outline-offset:2px}tp-matching [data-matching-list]>li>.tp-matching-controls{flex-wrap:wrap;align-items:center;gap:.5rem;margin-block-start:.5rem;display:flex}.tp-matching-content{min-inline-size:0}tp-matching .tp-matching-controls>.tp-matching-select{margin-inline-start:auto}.tp-matching-content :is(img,svg,video,audio){max-inline-size:100%}tp-matching>:is(.tp-matching-status,tp-callout){grid-column:1/-1}.tp-matching-column{min-inline-size:0}.tp-matching-column>h3{overflow-wrap:anywhere;margin-block:0 .75rem;font-size:1rem}@media (width<=45rem){tp-matching{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (width<=28rem){tp-matching{grid-template-columns:minmax(0,1fr)}}", r = [
	"tp-blue",
	"tp-violet",
	"tp-amber",
	"tp-cyan",
	"tp-orange",
	"tp-indigo"
];
function i(e, t, n, r = !1) {
	if (!Array.isArray(e) || t < 2 || !n || r && e.length !== n) return null;
	let i = Array.from({ length: t }, () => /* @__PURE__ */ new Set()), a = [];
	for (let o of e) {
		if (typeof o != "object" || !o) return null;
		let e = t === 2 && "left" in o && "right" in o ? [o.left, o.right] : "items" in o ? o.items : null;
		if (!Array.isArray(e) || e.length !== t) return null;
		let s = [];
		for (let a = 0; a < t; a++) {
			let t = e[a];
			if (t === null && !r) {
				s.push(null);
				continue;
			}
			if (typeof t != "number" || !Number.isInteger(t) || t < 1 || t > n || i[a]?.has(t)) return null;
			i[a]?.add(t), s.push(t);
		}
		if (s.filter((e) => e !== null).length < 2) return null;
		a.push({ items: s });
	}
	return a;
}
var a = class a extends e {
	static nextHeading = 0;
	lists = [];
	originalLists = null;
	headingSources = [];
	items = [];
	groups = /* @__PURE__ */ new Map();
	nextGroup = 1;
	selected = null;
	drag = null;
	status = null;
	error = null;
	observer = new MutationObserver(() => this.initialize());
	static get observedAttributes() {
		return [
			...e.observedAttributes,
			"disabled",
			"heading"
		];
	}
	get heading() {
		return this.hasAttribute("heading");
	}
	set heading(e) {
		this.toggleAttribute("heading", e);
	}
	get disabled() {
		return this.hasAttribute("disabled");
	}
	set disabled(e) {
		this.toggleAttribute("disabled", e);
	}
	get columnCount() {
		return this.lists.length;
	}
	get itemCount() {
		let e = this.lists.map((e) => e.querySelectorAll(":scope > li").length);
		return e.length >= 2 && e.every((t) => t === e[0]) ? e[0] ?? 0 : 0;
	}
	get complete() {
		return this.itemCount > 0 && this.groups.size === this.itemCount && [...this.groups.values()].every((e) => e.every((e) => e !== null));
	}
	get value() {
		let e = [...this.groups.values()];
		return this.columnCount === 2 ? e.map((e) => ({
			left: Number(e[0]),
			right: Number(e[1])
		})).sort((e, t) => e.left - t.left) : e.map((e) => ({ items: [...e] })).sort((e, t) => JSON.stringify(e.items).localeCompare(JSON.stringify(t.items)));
	}
	set value(e) {
		let t = i(e, this.columnCount, this.itemCount);
		if (!t) throw RangeError("Groups must use unique, valid one-based ranks from each list and contain at least two members.");
		this.groups = new Map(t.map((e, t) => [t + 1, e.items])), this.nextGroup = t.length + 1, this.selected = null, this.update();
	}
	reset() {
		let e = this.groups.size > 0;
		this.groups.clear(), this.nextGroup = 1, this.selected = null, this.order(), this.update(), e && this.emitChange();
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-matching-styles", n), this.addEventListener("click", this.onClick), this.addEventListener("keydown", this.onKeyDown), this.items.length || (this.observer.observe(this, {
			childList: !0,
			subtree: !0
		}), this.initialize());
	}
	disconnectedCallback() {
		this.observer.disconnect(), this.removeEventListener("click", this.onClick), this.removeEventListener("keydown", this.onKeyDown), this.selected = null, this.update();
	}
	attributeChangedCallback(e) {
		if (e === "heading" && this.originalLists && this.items.length) {
			this.groups.clear(), this.selected = null, this.update();
			for (let { source: e, heading: t } of this.headingSources) e.append(...t.childNodes);
			for (let e of this.items) {
				let t = e.node.querySelector(":scope > .tp-matching-content");
				t && (e.node.prepend(...t.childNodes), t.remove()), e.select.parentElement?.remove();
			}
			this.lists.forEach((e, t) => {
				e.append(...this.items.filter((e) => e.side === t).sort((e, t) => e.rank - t.rank).map((e) => e.node)), e.removeAttribute("data-matching-list"), e.removeAttribute("aria-labelledby");
			}), this.replaceChildren(...this.originalLists), this.items = [], this.lists = [], this.headingSources = [], this.drag = null, this.status = null, this.nextGroup = 1, this.observer.observe(this, {
				childList: !0,
				subtree: !0
			}), this.initialize(), this.emitChange();
		} else e === "heading" && this.isConnected && !this.items.length && this.initialize();
		this.disabled && (this.selected = null), this.update();
	}
	initialize() {
		if (this.items.length) return;
		let e = this.querySelector(":scope > dl"), n = [], i = !0, o = [...this.children].filter((e) => e instanceof HTMLElement && ["UL", "OL"].includes(e.tagName));
		if (e) {
			i = o.length === 0 && this.querySelectorAll(":scope > dl").length === 1;
			let t = [...e.children];
			for (let e = 0; e < t.length; e += 2) {
				let r = t[e], a = t[e + 1], s = a?.querySelectorAll(":scope > ul, :scope > ol");
				if (!(r instanceof HTMLElement) || r.tagName !== "DT" || !r.textContent?.trim() || a?.tagName !== "DD" || s?.length !== 1) {
					i = !1;
					break;
				}
				let c = s[0];
				c instanceof HTMLElement && (n.push(r), o.push(c));
			}
		}
		let s = [...o], c;
		if (this.heading && !e) {
			c = o.shift();
			let e = [...c?.children ?? []].filter((e) => e instanceof HTMLElement && e.tagName === "LI");
			i = i && e.length === o.length && e.every((e) => !!e.textContent?.trim()), n.push(...e);
		}
		let l = o.map((e) => [...e.children].filter((e) => e instanceof HTMLLIElement));
		if (!i || o.length < 2 || !l[0]?.length || l.some((e) => e.length !== l[0]?.length)) {
			this.error || (this.error = document.createElement("tp-callout"), this.error.setAttribute("variant", "warning"), this.error.textContent = "Provide at least two nonempty ul or ol lists with the same number of items. With heading, the first list must contain one nonempty title per remaining column. Alternatively, use a dl with one dt and one dd containing a list per column.", this.append(this.error));
			return;
		}
		this.observer.disconnect(), this.error?.remove(), this.error = null, this.lists = o, e || (this.originalLists = s), this.style.setProperty("--tp-matching-columns", String(o.length)), o.forEach((e, t) => {
			e.setAttribute("role", "list"), e.setAttribute("data-matching-list", "");
			let r = n[t];
			if (r) {
				let t = document.createElement("section");
				t.className = "tp-matching-column";
				let n = document.createElement("h3");
				n.id = `tp-matching-heading-${++a.nextHeading}`, n.append(...r.childNodes), c && this.headingSources.push({
					source: r,
					heading: n
				}), e.setAttribute("aria-labelledby", n.id), t.append(n, e), this.append(t);
			}
		}), e?.remove(), c?.remove(), l.forEach((e, t) => {
			e.forEach((e, n) => {
				let i = document.createElement("div");
				i.className = "tp-matching-content", i.append(...e.childNodes);
				let a = document.createElement("div");
				a.className = "tp-matching-controls";
				let s = document.createElement("tp-icon-button");
				s.className = "tp-matching-select", s.setAttribute("name", "link"), s.setAttribute("label", "Select item"), s.draggable = !0;
				let c = document.createElement("tp-icon-button");
				c.setAttribute("name", "close"), c.setAttribute("label", o.length === 2 ? "Remove pair" : "Remove from group");
				let l = document.createElement("span");
				a.append(l, c, s), e.append(i, a), this.items.push({
					node: e,
					side: t,
					rank: n + 1,
					select: s,
					clear: c,
					badge: l,
					authorColors: r.filter((t) => e.classList.contains(t))
				});
			});
		}), this.status = document.createElement("p"), this.status.className = "tp-matching-status", this.status.setAttribute("role", "status"), this.drag = new t(), this.drag.adapter = {
			root: this,
			getItem: (e) => this.itemFromEvent(e)?.node ?? null,
			canStart: (e) => !this.disabled && this.items.some((t) => e.target instanceof Node && t.select.contains(e.target)),
			canDrop: (e) => !this.disabled && this.selected !== null && this.items.some((t) => t.node === e && t.side !== this.selected?.side),
			getPosition: () => "inside",
			getData: () => "tp-matching"
		}, this.drag.addEventListener("tp-dragdrop-start", this.onDragStart), this.drag.addEventListener("tp-dragdrop-drop", this.onDrop), this.drag.addEventListener("tp-dragdrop-end", this.onDragEnd), this.append(this.status, this.drag), this.order(), this.update();
	}
	order() {
		this.lists.forEach((e, t) => {
			let n = this.items.filter((e) => e.side === t).map((e) => e.node);
			for (let e = n.length - 1; e > 0; e--) {
				let t = Math.floor(Math.random() * (e + 1)), r = n[e], i = n[t];
				r && i && (n[e] = i, n[t] = r);
			}
			e.append(...n);
		});
	}
	itemFromEvent(e) {
		let t = e.target;
		if (!(!(t instanceof Element) || t.closest("tp-matching") !== this)) return this.items.find((e) => e.node.contains(t));
	}
	onClick = (e) => {
		if (this.disabled || e.defaultPrevented) return;
		let t = this.itemFromEvent(e);
		if (!(!t || !(e.target instanceof Node))) if (t.clear.contains(e.target)) this.unpair(t), this.selected = null, this.update(), t.select.querySelector("button")?.focus(), this.emitChange();
		else if (t.select.contains(e.target)) this.choose(t);
		else {
			for (let n of e.composedPath()) {
				if (n === t.node) break;
				if (n instanceof Element && (n.matches("a, button, input, select, textarea, label, summary, audio, video, iframe, object, embed, [tabindex], [contenteditable]:not([contenteditable=\"false\"]), [role=\"button\"], [role=\"link\"], [role=\"checkbox\"], [role=\"radio\"], [role=\"switch\"], [role=\"slider\"], [role=\"textbox\"], [role=\"combobox\"], [role=\"listbox\"], [role=\"menuitem\"], [role=\"tab\"], [role=\"spinbutton\"]") || n.localName.startsWith("tp-") && n.localName !== "tp-icon")) return;
			}
			this.choose(t);
		}
	};
	onKeyDown = (e) => {
		e.key !== "Escape" || !this.selected || !this.itemFromEvent(e) || (e.preventDefault(), this.selected = null, this.update());
	};
	choose(e) {
		if (this.selected && this.selected.side !== e.side) {
			let t = this.groupOf(this.selected);
			if (t?.[1][e.side] === e.rank) {
				this.selected = e, this.update();
				return;
			}
			this.unpair(e);
			let n = t?.[0] ?? this.nextGroup++, r = t?.[1] ?? Array(this.columnCount).fill(null);
			r[this.selected.side] = this.selected.rank, r[e.side] = e.rank, this.groups.set(n, r), r.every((e) => e !== null) && (this.selected = null), this.update(), this.emitChange();
		} else this.selected = this.selected === e ? null : e, this.update();
	}
	groupOf(e) {
		return [...this.groups].find(([, t]) => t[e.side] === e.rank);
	}
	unpair(e) {
		let t = this.groupOf(e);
		t && (t[1][e.side] = null, t[1].filter((e) => e !== null).length < 2 && this.groups.delete(t[0]));
	}
	onDragStart = (e) => {
		let t = e.detail.source;
		this.selected = this.items.find((e) => e.node === t) ?? null, this.update();
	};
	onDrop = (e) => {
		let t = e.detail, n = this.items.find((e) => e.node === t.target);
		!this.disabled && n && this.selected && n.side !== this.selected.side && this.choose(n);
	};
	onDragEnd = () => {
		this.selected = null, this.update();
	};
	update() {
		for (let e of this.items) {
			let t = this.groupOf(e);
			e.node.classList.remove(...r);
			let n = t ? r[(t[0] - 1) % r.length] : void 0;
			n ? e.node.classList.add(n) : e.node.classList.add(...e.authorColors);
			let i = this.selected === e;
			e.node.toggleAttribute("data-matching-selected", i), e.node.toggleAttribute("data-matching-paired", !!t), e.select.toggleAttribute("disabled", this.disabled), e.select.draggable = !this.disabled, e.select.setAttribute("label", `${i ? "Cancel selection of" : "Select"} list ${e.side + 1} item ${[...e.node.parentElement?.children ?? []].indexOf(e.node) + 1}`), e.select.querySelector("button")?.setAttribute("aria-pressed", String(i)), e.clear.hidden = !t, e.clear.toggleAttribute("disabled", this.disabled), e.badge.textContent = t ? `${this.columnCount === 2 ? "Pair" : "Group"} ${t[0]}` : "";
		}
		this.status && (this.status.textContent = this.selected ? "Select an item in another list to continue this group. Escape cancels the selection." : `${[...this.groups.values()].filter((e) => e.every((e) => e !== null)).length} of ${this.itemCount} ${this.columnCount === 2 ? "pairs" : "groups"} complete.`);
	}
	emitChange() {
		this.dispatchEvent(new CustomEvent("change", {
			bubbles: !0,
			composed: !0,
			detail: {
				value: this.value,
				complete: this.complete
			}
		}));
	}
};
customElements.get("tp-matching") || customElements.define("tp-matching", a);
//#endregion
export { i as n, a as t };

//# sourceMappingURL=matching.js.map