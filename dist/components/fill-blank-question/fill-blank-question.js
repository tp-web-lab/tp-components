import { V as e } from "../../chunks/lib/typescript/typescript.js";
import "../textfield/textfield.js";
import { getBlankFields as t } from "../fill-blank/fields.js";
import "../../chunks/fill-blank.js";
import { FillBlankQuestionSrcSchema as n } from "../question/question-src-schema.js";
import { ClosedAnswers as r } from "./closed-answers.js";
//#region src/components/fill-blank-question/closed-answers.css?inline
var i = "tp-fill-blank-question [data-tp-closed-bank]{gap:.5rem;display:flex}tp-fill-blank-question [data-tp-closed-bank]>div{min-inline-size:0}tp-fill-blank-question tp-callout:has(>[data-tp-closed-reading]){margin-block-start:.5rem}tp-fill-blank-question tp-textfield[data-tp-closed-target] [data-tp-textfield-control],tp-fill-blank-question tp-blank[data-tp-closed-target]{outline:3px solid var(--tp-focus-color,var(--tp-brand-text-colorful));outline-offset:2px}tp-fill-blank-question tp-button[data-tp-closed-assigned]{--tp-button-background:var(--tp-info-fill-softer);--tp-button-foreground:var(--tp-info-text-colorful);--tp-button-border-color:var(--tp-info-stroke-soft)}tp-fill-blank-question .MathJax_Preview:has(+.MathJax_SVG){display:none}tp-fill-blank-question [data-tp-reading-math],tp-fill-blank-question [data-tp-reading-math]>svg{display:inline-block}tp-fill-blank-question[partial] [data-tp-blank-result]{border-bottom-style:solid;border-bottom-width:4px}tp-fill-blank-question[partial] [data-tp-blank-result=success]{border-bottom-color:var(--tp-success-stroke-mid)}tp-fill-blank-question[partial] [data-tp-blank-result=danger]{border-bottom-color:var(--tp-danger-stroke-mid)}", a = class {
	fillBlankEl;
	constructor(e) {
		this.fillBlankEl = e;
	}
	get value() {
		let e = this.fillBlankEl;
		if (typeof e == "object" && e && e.value instanceof FormData) {
			let n = e.value;
			return t(this.fillBlankEl).map((e) => (n.get(e.name) ?? "").toString().trim()).join(",");
		}
		return "";
	}
}, o = class extends e {
	static get observedAttributes() {
		return [
			...e.observedAttributes ?? [],
			"case-sensitive",
			"closed",
			"partial"
		];
	}
	answerValues = [];
	listedAnswers = null;
	answerContent = [];
	actualFillBlank = null;
	stringValueProxy = null;
	feedbackItems = [];
	closedAnswers = null;
	get caseSensitive() {
		return this.hasAttribute("case-sensitive");
	}
	set caseSensitive(e) {
		this.setBooleanAttribute("case-sensitive", e);
	}
	get closed() {
		return this.hasAttribute("closed");
	}
	set closed(e) {
		this.setBooleanAttribute("closed", e);
	}
	get partial() {
		return this.hasAttribute("partial");
	}
	set partial(e) {
		this.setBooleanAttribute("partial", e);
	}
	clearEditedResult = (e) => {
		let n = e.target;
		if (!(!(n instanceof Element) || !this.actualFillBlank)) for (let e of t(this.actualFillBlank)) (e === n || n.contains(e)) && e.removeAttribute("data-tp-blank-result");
	};
	clearResults() {
		for (let e of this.actualFillBlank?.querySelectorAll("[data-tp-blank-result]") ?? []) e.removeAttribute("data-tp-blank-result");
	}
	disconnectedCallback() {
		this.removeEventListener("input", this.clearEditedResult), this.removeEventListener("change", this.clearEditedResult), this.closedAnswers?.destroy(), this.closedAnswers = null, super.disconnectedCallback();
	}
	connectedCallback() {
		if (super.connectedCallback(), this.ensureGlobalStyle("tp-fill-blank-question-closed-styles", i), this.updateCaseSensitiveNotice(), this.addEventListener("input", this.clearEditedResult), this.addEventListener("change", this.clearEditedResult), this.src) {
			this.loadSrc();
			return;
		}
		this.feedbackItems = this.consumeFeedbackListItems(), this.parseAnswers();
	}
	beforeQuestionLayout() {
		this.src || (this.readAnswerList(), this.ensureFillBlank(this.response));
	}
	readAnswerList() {
		let e = Array.from(this.querySelectorAll(":scope > dl > dt")).find((e) => /^(answer|answers)$/i.test(e.textContent?.trim() ?? "")), t = e?.nextElementSibling;
		t?.localName === "dd" && (this.answerContent = Array.from(t.querySelectorAll(":scope > ol > li"), (e) => {
			let t = document.createDocumentFragment();
			for (let n of e.childNodes) t.append(n.cloneNode(!0));
			return t;
		}), this.listedAnswers = Array.from(t.querySelectorAll(":scope > ol > li"), (e) => e.textContent?.trim() ?? ""), e?.remove(), t.remove());
	}
	attributeChangedCallback(e, t, n) {
		super.attributeChangedCallback(e, t, n), e === "case-sensitive" && this.updateCaseSensitiveNotice(), e === "closed" && this.isConnected && this.updateClosedAnswers(), e === "partial" && !this.partial && this.clearResults();
	}
	updateCaseSensitiveNotice() {
		let e = this.querySelector("[data-tp-question-prompt-content]");
		if (!e) return;
		let t = e.parentElement?.querySelector("[data-tp-case-sensitive-notice]");
		if (!this.caseSensitive) {
			t?.remove();
			return;
		}
		if (t) return;
		let n = document.createElement("tp-callout");
		n.setAttribute("variant", "warning"), n.setAttribute("data-tp-case-sensitive-notice", ""), n.textContent = "Answers are case-sensitive: uppercase and lowercase letters must match.", e.after(n);
	}
	async onSrcReady(e) {
		let r = n.safeParse(e);
		if (!r.success) {
			this.showSrcError(`Invalid question file "${this.src}":\n${r.error.issues.map((e) => `  • ${e.path.join(".")}: ${e.message}`).join("\n")}`);
			return;
		}
		let { title: i, prompt: a, form: o, feedback: s, solution: c, markup: l, attributes: u } = r.data;
		this.srcMarkup = this.normalizeSrcMarkup(l), this.listedAnswers = Array.isArray(u.answer) ? u.answer.map((e) => e.trim()) : u.answer.split(",").map((e) => e.trim()), i && this.updateSrcTitle(i, this.srcMarkup), a && this.updateSrcPrompt(a, this.srcMarkup), c && this.updateSrcSolution(c, this.srcMarkup), await this.populateFormFromSrc(o, this.srcMarkup), this.ensureFillBlank(this.formContent), this.parseAnswers();
		let d = this.actualFillBlank ? t(this.actualFillBlank).length : 0;
		if (d === 0) {
			this.showSrcError(`Invalid question file "${this.src}": form must contain at least one <input> or <select>.`);
			return;
		}
		if (this.answerValues.length !== d) {
			this.showSrcError(`Invalid question file "${this.src}": answer count (${String(this.answerValues.length)}) does not match blank count (${String(d)}).`);
			return;
		}
		this.feedbackItems = s ?? [], this.feedbackItems.length > 0 && (this.hasSpecificFeedback = !0, this.updateFeedbackPlaceholder());
	}
	findResponseWidget() {
		return this.stringValueProxy;
	}
	onReset() {
		if (this.clearResults(), this.actualFillBlank === null) return;
		let e = this.actualFillBlank;
		typeof e.reset == "function" && e.reset(), this.updateClosedAnswers();
	}
	onSubmitAttempt(e) {
		if (this.solutionTabEl === null || !this.solutionTabEl.hasAttribute("disabled") || this.actualFillBlank === null) return;
		let t = this.getSubmittedValues(), n = t.length;
		n !== 0 && (this.matchesSubmittedValues(t) || this.tries >= n - 1) && this.solutionTabEl.removeAttribute("disabled");
	}
	validateSubmit(e) {
		let t = this.getSubmittedValues();
		return t.length === 0 || !this.partial && t.some((e) => e === "") ? "Please fill in all blanks." : null;
	}
	shouldShowMissingFeedback() {
		return !this.matchesSubmittedValues(this.getSubmittedValues()) && super.shouldShowMissingFeedback();
	}
	submitMessage(e) {
		let n = document.createElement("div"), r = this.getSubmittedValues(), i = r.length, a = this.matchesSubmittedValues(r);
		this.clearResults();
		let o = this.actualFillBlank ? t(this.actualFillBlank) : [], s = 0;
		for (let e = 0; e < i; e += 1) {
			let t = this.normalizeAnswer(r[e] ?? ""), n = this.normalizeAnswer(this.answerValues[e] ?? ""), i = t !== "" && n !== "" && t === n;
			i && (s += 1), this.partial && t !== "" && o[e]?.setAttribute("data-tp-blank-result", i ? "success" : "danger");
		}
		if (n.append(this.createAttemptSummaryLine(s, i)), a) {
			let e = document.createElement("p");
			return e.textContent = "🎉 Congratulations, correct answer!", n.append(e), n;
		}
		let c = this.createGeneralFeedback();
		c && n.append(c);
		let l = document.createElement("ul");
		l.setAttribute("data-tp-question-feedback-list", "");
		let u = !1;
		for (let e = 0; e < i; e += 1) {
			let t = this.normalizeAnswer(r[e] ?? "");
			if (t === this.normalizeAnswer(this.answerValues[e] ?? "") || this.partial && t === "") continue;
			let n = this.feedbackItems[e];
			if (typeof n != "string" || n.trim() === "") continue;
			u = !0;
			let i = document.createElement("li");
			this.src ? i.append(this.createSrcContentNode(n)) : i.innerHTML = n, l.append(i);
		}
		return u && n.append(l), n;
	}
	ensureFillBlank(e) {
		if (e === null) return;
		if (e.querySelector("input, select, tp-textfield, tp-blank") === null) {
			e.textContent = "";
			let t = document.createElement("div");
			t.setAttribute("style", "color: red; font-weight: bold;"), t.textContent = "ERROR: tp-fill-blank-question requires <input> or <select> elements in the Form section.", e.append(t);
			return;
		}
		let t = e.querySelector("tp-fill-blank");
		if (t instanceof HTMLElement) {
			this.actualFillBlank = t, this.stringValueProxy = new a(t);
			return;
		}
		let n = document.createElement("tp-fill-blank");
		for (n.style.marginLeft = "1rem"; e.firstChild !== null;) n.append(e.firstChild);
		e.append(n), this.actualFillBlank = n, this.stringValueProxy = new a(n);
	}
	async populateFormFromSrc(e, t) {
		let n = this.formContent;
		if (n === null) return;
		let r = this.normalizeSrcMarkup(t);
		if (n.replaceChildren(), r === "html") {
			n.innerHTML = e;
			return;
		}
		if (r === "none") {
			n.textContent = e;
			return;
		}
		let { renderMarkdownToHtml: i } = await import("../markdown/markdown.js");
		n.innerHTML = await i(e);
	}
	parseAnswers() {
		let e = this.getAttribute("answer")?.trim() ?? "";
		this.answerValues = this.listedAnswers ?? (e === "" ? [] : e.split(",").map((e) => e.trim())), this.updateClosedAnswers();
	}
	updateClosedAnswers() {
		if (this.clearResults(), this.closedAnswers?.destroy(), this.closedAnswers = null, this.closed && this.actualFillBlank && this.isConnected) {
			let e = this.listedAnswers ?? this.answerValues, n = t(this.actualFillBlank);
			this.answerValues = e.map((e, t) => n[t]?.localName === "tp-blank" ? String(t + 1) : e), this.closedAnswers = new r(this.actualFillBlank, e, this.querySelector("[data-tp-question-feedback-output]"), this.answerContent);
		}
	}
	matchesSubmittedValues(e) {
		return e.length !== 0 && e.every((e, t) => this.normalizeAnswer(e) === this.normalizeAnswer(this.answerValues[t] ?? ""));
	}
	normalizeAnswer(e) {
		let t = e.trim();
		return this.caseSensitive ? t : t.toLowerCase();
	}
	getSubmittedValues() {
		if (this.actualFillBlank === null) return [];
		let e = this.actualFillBlank;
		return e.value instanceof FormData ? t(this.actualFillBlank).map((t) => (e.value?.get(t.name) ?? "").toString().trim()) : [];
	}
};
customElements.get("tp-fill-blank-question") || customElements.define("tp-fill-blank-question", o);
//#endregion
export { o as TpFillBlankQuestion };

//# sourceMappingURL=fill-blank-question.js.map