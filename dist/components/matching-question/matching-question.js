import { H as e, V as t, an as n, dn as r, in as i, ln as a } from "../../chunks/lib/typescript/typescript.js";
import { n as o, t as s } from "../../chunks/matching.js";
//#region src/components/matching-question/matching-question.ts
var c = a({
	title: r().optional(),
	prompt: r().min(1),
	markup: i([
		"markdown",
		"md",
		"html",
		"none"
	]).optional(),
	form: n(n(r().min(1)).min(1)).min(2).refine((e) => e.every((t) => t.length === e[0]?.length), "All lists must have the same number of items."),
	headers: n(r().min(1)).optional(),
	feedback: r().optional(),
	solution: r().optional()
}).refine((e) => !e.headers || e.headers.length === e.form.length, "Provide exactly one header per list."), l = class extends t {
	static get observedAttributes() {
		return [...t.observedAttributes, "heading"];
	}
	get heading() {
		return this.hasAttribute("heading");
	}
	set heading(e) {
		this.toggleAttribute("heading", e);
	}
	attributeChangedCallback(e, t, n) {
		super.attributeChangedCallback(e, t, n), e === "heading" && this.findResponseWidget()?.toggleAttribute("heading", this.heading);
	}
	sourceFeedback = null;
	sourceVersion = 0;
	selectionHelp = null;
	connectedCallback() {
		super.connectedCallback(), this.ensureSelectionHelp(), this.findResponseWidget()?.toggleAttribute("heading", this.heading), this.src && this.loadSrc();
	}
	ensureSelectionHelp() {
		let t = this.querySelector("[data-tp-question-feedback-output]");
		if (t) {
			if (!this.selectionHelp) {
				let t = new e();
				t.setAttribute("data-tp-matching-question-help", ""), t.setAttribute("variant", "info"), t.setAttribute("closable", ""), t.setAttribute("heading", "How to form a group"), t.innerHTML = "<p><strong>Mouse:</strong> Click a card or its link icon, then click one item in each other column to form a group. You can also drag a link icon onto an item in another column. Click the selected item again to cancel the selection.</p><p><strong>Keyboard:</strong> Use Tab or Shift+Tab to focus an item's Select button (link icon), then press Enter or Space to select it. Repeat for one item in each other column. Press Escape while focused inside an item to cancel the pending selection.</p><p>Items in the same group share a color and a number. Select an existing member to extend or change its group.</p>", this.selectionHelp = t;
			}
			this.selectionHelp.parentElement !== t && t.prepend(this.selectionHelp);
		}
	}
	disconnectedCallback() {
		this.sourceVersion++, super.disconnectedCallback();
	}
	beforeQuestionLayout() {
		if (this.src || this.findResponseWidget()) return;
		let e = this.response;
		if (!e) return;
		let t = e.querySelector("tp-matching");
		if (t) {
			t.heading = this.heading;
			return;
		}
		let n = new s();
		n.heading = this.heading;
		let r = [...(e.children.length === 1 && e.firstElementChild?.tagName === "DIV" ? e.firstElementChild : e).children].filter((e) => e.matches("ul, ol, dl"));
		n.append(...r), e.append(n);
	}
	findResponseWidget() {
		return this.formContent?.querySelector("tp-matching") ?? null;
	}
	get pairCount() {
		return this.findResponseWidget()?.itemCount ?? 0;
	}
	validateSubmit(e) {
		let t = this.pairCount;
		return t ? o(e, this.findResponseWidget()?.columnCount ?? 0, t, !0) ? null : "Associate every item with one item from each other list before submitting." : "Provide at least two nonempty lists with the same number of items.";
	}
	submitMessage(e) {
		let t = this.findResponseWidget(), n = (o(e, t?.columnCount ?? 0, this.pairCount, !0) ?? []).filter((e) => e.items.every((t) => t === e.items[0])).length, r = t?.columnCount === 2 ? "pairs" : "groups", i = document.createElement("div");
		i.append(this.createAttemptSummaryLine(n, this.pairCount));
		let a = document.createElement("p");
		if (a.textContent = n === this.pairCount ? `🎉 Well done, all ${r} are correct!` : `Some ${r} do not match. Try again.`, i.append(a), n === this.pairCount) i.append(this.createOpenSolutionButton());
		else {
			let e = this.sourceFeedback?.cloneNode(!0) ?? this.createGeneralFeedback();
			e && i.append(e);
		}
		return i;
	}
	async loadSrc() {
		let e = ++this.sourceVersion, t = await this.fetchSrc(this.src);
		this.isConnected && e === this.sourceVersion && t !== null && await this.onSrcReady(t);
	}
	async onSrcReady(e) {
		let t = e;
		this.heading && typeof e == "object" && e && "form" in e && Array.isArray(e.form) && !("headers" in e) && (t = {
			...e,
			headers: e.form[0],
			form: e.form.slice(1)
		});
		let n = c.safeParse(t);
		if (!n.success) {
			this.showSrcError(`Invalid matching question: ${n.error.issues.map((e) => e.message).join(" ")}`);
			return;
		}
		let r = this.formContent;
		if (!r) return;
		let { title: i, prompt: a, form: o, markup: l, feedback: u, solution: d, headers: f } = n.data;
		this.srcMarkup = this.normalizeSrcMarkup(l ?? "markdown"), i && this.updateSrcTitle(i, this.srcMarkup), this.updateSrcPrompt(a, this.srcMarkup), d && this.updateSrcSolution(d, this.srcMarkup), this.sourceFeedback = u ? this.createSrcContentNode(u, this.srcMarkup) : null, this.hasSpecificFeedback = !!u;
		let p = new s();
		p.heading = this.heading;
		let m = f ? document.createElement("dl") : null;
		for (let [e, t] of o.entries()) {
			let n = document.createElement("ul");
			for (let e of t) {
				let t = document.createElement("li");
				t.append(this.createSrcContentNode(e, this.srcMarkup)), n.append(t);
			}
			if (m) {
				let t = document.createElement("dt");
				t.textContent = f?.[e] ?? "";
				let r = document.createElement("dd");
				r.append(n), m.append(t, r);
			} else p.append(n);
		}
		m && p.append(m), r.replaceChildren(p), this.updateFeedbackPlaceholder(), this.ensureSelectionHelp();
	}
};
customElements.get("tp-matching-question") || customElements.define("tp-matching-question", l);
//#endregion
export { l as TpMatchingQuestion };

//# sourceMappingURL=matching-question.js.map