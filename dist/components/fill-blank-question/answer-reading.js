import { labelMathSvg as e } from "../../utilities/math-accessibility.js";
import "../../chunks/callout.js";
import { n as t } from "../../chunks/blank.js";
import { getBlankFields as n } from "../fill-blank/fields.js";
//#region src/components/fill-blank-question/answer-reading.ts
var r = class {
	form;
	reading = document.createElement("div");
	callout = document.createElement("tp-callout");
	observer = new MutationObserver(() => this.updateReading());
	onEdit = () => this.updateReading();
	constructor(e) {
		this.form = e, this.reading.setAttribute("role", "status"), this.reading.setAttribute("data-tp-closed-reading", ""), this.callout.setAttribute("variant", "neutral"), this.callout.append(this.reading);
		let t = e.closest("[data-tp-closed-answers]") ?? e;
		t.after(this.callout), e.addEventListener("input", this.onEdit), e.addEventListener("change", this.onEdit), this.observer.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: ["data-tp-blank-result", "value"]
		}), this.updateReading();
	}
	destroy() {
		this.observer.disconnect(), this.form.removeEventListener("input", this.onEdit), this.form.removeEventListener("change", this.onEdit), this.callout.remove();
	}
	updateReading() {
		e(this.form.closest("[data-tp-closed-answers]") ?? this.form);
		let r = document.createElement("template"), i = r.content.ownerDocument.importNode(this.form, !0);
		r.content.append(...i.childNodes);
		let a = n(this.form), o = n(r.content);
		for (let [e, n] of o.entries()) {
			let r = a[e], i = n.closest("tp-textfield, tp-numberfield, tp-datefield, tp-timefield") ?? n;
			if (!r?.value) i.replaceWith(document.createTextNode("…"));
			else {
				let e = document.createElement("span");
				e.className = "tp-ivory", e.setAttribute("data-tp-reading-answer", "");
				let n = r?.getAttribute("data-tp-blank-result");
				if (n && e.setAttribute("data-tp-reading-result", n), t(r) && r.effectiveClosed) {
					let t = document.createDocumentFragment();
					for (let e of r.childNodes) e instanceof Element && e.hasAttribute("data-tp-blank-tools") || t.append(e.cloneNode(!0));
					for (let e of t.querySelectorAll("p")) e.replaceWith(...e.childNodes);
					e.append(t);
				} else e.textContent = r.value;
				i.replaceWith(e);
			}
		}
		this.normalizeReadingMath(r.content), this.reading.replaceChildren(r.content);
	}
	normalizeReadingMath(e) {
		i(e);
		for (let t of e.querySelectorAll("mjx-container, .MathJax_SVG")) {
			let e = t.querySelectorAll(":scope > svg");
			if (e.length === 0) continue;
			let n = document.createElement("span");
			n.setAttribute("data-tp-reading-math", "");
			let r = t.getAttribute("aria-label") || t.getAttribute("data-semantic-speech-none") || t.querySelector("svg[aria-label]")?.getAttribute("aria-label") || t.querySelector("math")?.textContent || "Mathematical expression";
			n.setAttribute("role", "img"), n.setAttribute("aria-label", r);
			for (let t of e) t.setAttribute("aria-hidden", "true");
			n.append(...e), t.replaceWith(n);
		}
		for (let t of e.querySelectorAll(".MathJax_Preview, script[type^=\"math/\"], mjx-assistive-mml, .MJX_Assistive_MathML")) t.remove();
	}
};
function i(e) {
	for (let t of e.querySelectorAll("tp-math")) {
		let e = t.querySelector(":scope > [data-tp-math-output]");
		e?.querySelector("svg") && (t.hasAttribute("displaystyle") && (e.style.display = "block"), t.replaceWith(e));
	}
}
//#endregion
export { r as AnswerReading, i as preserveRenderedMath };

//# sourceMappingURL=answer-reading.js.map