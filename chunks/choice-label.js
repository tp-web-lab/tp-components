//#region src/utilities/choice-label.css?inline
var e = ":is(tp-radio-list,tp-checkbox-list)[data-tp-choice-label-position]{grid-template-columns:minmax(0,1fr);grid-template-areas:\"heading\"\"choices\";align-items:center;gap:.35em .75em;display:grid}:is(tp-radio-list,tp-checkbox-list)>[data-tp-choice-label]{font-weight:var(--tp-textfield-label-font-weight,500);grid-area:heading}:is(tp-radio-list,tp-checkbox-list)[data-tp-choice-label-position]>:is(ul,ol){grid-area:choices;min-inline-size:0;margin:0}:is(tp-radio-list,tp-checkbox-list)[data-tp-choice-label-position=bottom]{grid-template-areas:\"choices\"\"heading\"}:is(tp-radio-list,tp-checkbox-list)[data-tp-choice-label-position=start]{grid-template-columns:max-content minmax(0,1fr);grid-template-areas:\"heading choices\"}:is(tp-radio-list,tp-checkbox-list)[data-tp-choice-label-position=end]{grid-template-columns:minmax(0,1fr) max-content;grid-template-areas:\"choices heading\"}";
//#endregion
//#region src/utilities/choice-label.ts
function t(e) {
	let t = e.getAttribute("label-position");
	return t === "bottom" || t === "start" || t === "end" ? t : "top";
}
var n = class e {
	static nextId = 0;
	heading = null;
	ownedRole = null;
	host;
	constructor(e) {
		this.host = e;
	}
	sync() {
		let n = this.host.getAttribute("label")?.trim() ?? "";
		if (!n) {
			this.heading && (this.updateReference(!1), this.heading.remove()), this.ownedRole && this.host.getAttribute("role") === this.ownedRole && this.host.removeAttribute("role"), this.ownedRole = null, this.host.removeAttribute("data-tp-choice-label-position");
			return;
		}
		this.heading || (this.host.querySelector(":scope > [data-tp-choice-label]")?.remove(), this.heading = document.createElement("span"), this.heading.setAttribute("data-tp-choice-label", ""), e.nextId += 1, this.heading.id = `tp-choice-label-${e.nextId}`, this.heading.addEventListener("click", () => {
			(this.host.querySelector("input:checked:not(:disabled)") ?? this.host.querySelector("input:not(:disabled)"))?.focus();
		})), this.heading.textContent = n, this.host.prepend(this.heading), this.host.setAttribute("data-tp-choice-label-position", t(this.host)), this.host.hasAttribute("role") || (this.ownedRole = this.host.localName === "tp-radio-list" ? "radiogroup" : "group", this.host.setAttribute("role", this.ownedRole)), this.updateReference(!0);
	}
	updateReference(e) {
		if (!this.heading) return;
		let t = (this.host.getAttribute("aria-labelledby") ?? "").split(/\s+/).filter((e) => e && e !== this.heading?.id);
		e && t.push(this.heading.id), t.length ? this.host.setAttribute("aria-labelledby", t.join(" ")) : this.host.removeAttribute("aria-labelledby");
	}
};
//#endregion
export { t as n, e as r, n as t };

