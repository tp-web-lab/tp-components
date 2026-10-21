import "../textfield/textfield.js";
import { t as e } from "../../chunks/question.js";
import "../../chunks/mathfield.js";
import { n as t } from "../../chunks/blank.js";
import { getBlankFields as n } from "../fill-blank/fields.js";
import "../../chunks/fill-blank.js";
import { FillBlankQuestionSrcSchema as r } from "../question/question-src-schema.js";
import { AnswerReading as i } from "./answer-reading.js";
import { ClosedAnswers as a } from "./closed-answers.js";
//#region src/components/fill-blank-question/closed-answers.css?inline
var o = "tp-fill-blank-question [data-tp-closed-bank]{gap:.5rem;display:flex}tp-fill-blank-question [data-tp-closed-bank]>div{min-inline-size:0}tp-fill-blank-question tp-callout:has(>[data-tp-closed-reading]){margin-block-start:.5rem}tp-fill-blank-question tp-textfield[data-tp-closed-target] [data-tp-textfield-control],tp-fill-blank-question tp-blank[data-tp-closed-target]{outline:3px solid var(--tp-focus-color,var(--tp-brand-text-colorful));outline-offset:2px}tp-fill-blank-question tp-button[data-tp-closed-assigned]{--tp-button-background:var(--tp-info-fill-softer);--tp-button-foreground:var(--tp-info-text-colorful);--tp-button-border-color:var(--tp-info-stroke-soft)}tp-fill-blank-question .MathJax_Preview:has(+.MathJax_SVG){display:none}tp-fill-blank-question [data-tp-reading-math],tp-fill-blank-question [data-tp-reading-math]>svg{display:inline-block}tp-fill-blank-question[partial] [data-tp-blank-result]{border-bottom-style:solid;border-bottom-width:4px}tp-fill-blank-question[partial] [data-tp-blank-result=success]{border-bottom-color:var(--tp-success-stroke-mid)}tp-fill-blank-question[partial] [data-tp-blank-result=danger]{border-bottom-color:var(--tp-danger-stroke-mid)}tp-fill-blank-question [data-tp-reading-answer]{background:var(--tp-brand-fill-soft);color:var(--tp-brand-text-on-soft);-webkit-box-decoration-break:clone;box-decoration-break:clone;border-radius:.2em;padding:.1em .3em}tp-fill-blank-question[partial] [data-tp-reading-result=success]{background:var(--tp-success-fill-soft);color:var(--tp-success-text-on-soft)}tp-fill-blank-question[partial] [data-tp-reading-result=danger]{background:var(--tp-danger-fill-soft);color:var(--tp-danger-text-on-soft)}tp-fill-blank-question[partial] [data-tp-blank-result=warning]{border-bottom-color:var(--tp-warning-stroke-mid)}", s = class {
	fillBlankEl;
	constructor(e) {
		this.fillBlankEl = e;
	}
	get value() {
		let e = this.fillBlankEl;
		if (typeof e == "object" && e && e.value instanceof FormData) {
			let t = e.value;
			return n(this.fillBlankEl).map((e) => (t.get(e.name) ?? "").toString().trim()).join(",");
		}
		return "";
	}
}, c = class extends e {
	static get observedAttributes() {
		return [
			...e.observedAttributes ?? [],
			"case-sensitive",
			"mode",
			"partial"
		];
	}
	answerValues = [];
	expectedValues = [];
	answerRules = [];
	mathChecker = null;
	mathResults = /* @__PURE__ */ new Map();
	mathTransformations = /* @__PURE__ */ new Map();
	updatingModes = !1;
	listedAnswers = null;
	answerContent = [];
	actualFillBlank = null;
	stringValueProxy = null;
	feedbackItems = [];
	closedAnswers = null;
	answerReading = null;
	get caseSensitive() {
		return this.hasAttribute("case-sensitive");
	}
	set caseSensitive(e) {
		this.setBooleanAttribute("case-sensitive", e);
	}
	get partial() {
		return this.hasAttribute("partial");
	}
	set partial(e) {
		this.setBooleanAttribute("partial", e);
	}
	clearEditedResult = (e) => {
		let t = e.target;
		if (!(!(t instanceof Element) || !this.actualFillBlank)) for (let e of n(this.actualFillBlank)) (e === t || t.contains(e) || e.contains(t)) && e.removeAttribute("data-tp-blank-result");
	};
	clearResults() {
		for (let e of this.actualFillBlank?.querySelectorAll("[data-tp-blank-result]") ?? []) e.removeAttribute("data-tp-blank-result");
	}
	disconnectedCallback() {
		this.removeEventListener("tp-blank-mode-change", this.onBlankModeChange), this.removeEventListener("input", this.clearEditedResult), this.removeEventListener("change", this.clearEditedResult), this.answerReading?.destroy(), this.answerReading = null, this.closedAnswers?.destroy(), this.closedAnswers = null, super.disconnectedCallback();
	}
	connectedCallback() {
		if (super.connectedCallback(), this.ensureGlobalStyle("tp-fill-blank-question-closed-styles", o), this.updateCaseSensitiveNotice(), this.addEventListener("tp-blank-mode-change", this.onBlankModeChange), this.addEventListener("input", this.clearEditedResult), this.addEventListener("change", this.clearEditedResult), this.usesExternalData) {
			this.loadSrc();
			return;
		}
		this.feedbackItems = this.consumeFeedbackListItems(), this.parseAnswers();
	}
	beforeQuestionLayout() {
		this.usesExternalData || (this.readAnswerList(), this.ensureFillBlank(this.response));
	}
	readAnswerList() {
		let e = Array.from(this.querySelectorAll(":scope > dl > dt")).find((e) => /^(answer|answers)$/i.test(e.textContent?.trim() ?? "")), t = e?.nextElementSibling;
		t?.localName === "dd" && (this.answerRules = Array.from(t.querySelectorAll(":scope > ol > li"), (e) => {
			let t = e.querySelector("tp-math");
			return {
				math: !!t,
				mode: t?.getAttribute("mode") ?? "latexmath"
			};
		}), this.answerContent = Array.from(t.querySelectorAll(":scope > ol > li"), (e) => {
			let t = document.createDocumentFragment();
			for (let n of e.childNodes) t.append(n.cloneNode(!0));
			return t;
		}), this.listedAnswers = Array.from(t.querySelectorAll(":scope > ol > li"), (e) => {
			let t = e.querySelector("tp-math");
			return (t?.getAttribute("value") || t?.querySelector("script")?.textContent || t?.textContent || e.textContent || "").trim();
		}), e?.remove(), t.remove());
	}
	attributeChangedCallback(e, t, n) {
		super.attributeChangedCallback(e, t, n), e === "case-sensitive" && this.updateCaseSensitiveNotice(), e === "mode" && this.isConnected && this.updateClosedAnswers(), e === "partial" && !this.partial && this.clearResults();
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
		let t = r.safeParse(e);
		if (!t.success) {
			this.showSrcError(`Invalid question file "${this.src}":\n${t.error.issues.map((e) => `  • ${e.path.join(".")}: ${e.message}`).join("\n")}`);
			return;
		}
		let { title: i, prompt: a, form: o, feedback: s, solution: c, markup: l, attributes: u } = t.data;
		this.srcMarkup = this.normalizeSrcMarkup(l), this.listedAnswers = Array.isArray(u.answer) ? u.answer.map((e) => e.trim()) : u.answer.split(",").map((e) => e.trim()), i && this.updateSrcTitle(i, this.srcMarkup), a && this.updateSrcPrompt(a, this.srcMarkup), c && this.updateSrcSolution(c, this.srcMarkup), await this.populateFormFromSrc(o, this.srcMarkup), this.ensureFillBlank(this.formContent), this.parseAnswers();
		let d = this.actualFillBlank ? n(this.actualFillBlank).length : 0;
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
		if (this.mode !== "closed") for (let e = 0; e < this.answerValues.length; e += 1) {
			let t = this.isClosedAnswer(e) ? null : this.answerPattern(e);
			if (t !== null) try {
				new RegExp(t, this.caseSensitive ? "u" : "iu"), RegExp(`^(?:${t})(?![\\s\\S])`, this.caseSensitive ? "u" : "iu");
			} catch {
				return "Invalid answer pattern: the author must correct this question.";
			}
		}
		let t = this.getSubmittedValues();
		return t.length === 0 || !this.partial && t.some((e) => e === "") ? "Please fill in all blanks." : null;
	}
	shouldShowMissingFeedback() {
		return !this.matchesSubmittedValues(this.getSubmittedValues()) && super.shouldShowMissingFeedback();
	}
	submitMessage(e) {
		let t = document.createElement("div"), r = this.getSubmittedValues(), i = r.length, a = this.matchesSubmittedValues(r);
		this.clearResults();
		let o = this.actualFillBlank ? n(this.actualFillBlank) : [], s = 0;
		for (let e = 0; e < i; e += 1) {
			let t = this.normalizeAnswer(r[e] ?? ""), n = this.answerMatches(r[e] ?? "", e);
			n && (s += 1), this.partial && t !== "" && o[e]?.setAttribute("data-tp-blank-result", n ? "success" : !this.isClosedAnswer(e) && this.isMathAnswer(e) && this.mathResults.get(e) === void 0 ? "warning" : "danger");
		}
		t.append(this.createAttemptSummaryLine(s, i));
		for (let [e, n] of this.mathTransformations) {
			if (this.mathResults.get(e) !== !0) continue;
			let r = document.createElement("p");
			r.setAttribute("data-tp-math-transformation", n), r.setAttribute("data-tp-answer-index", String(e + 1));
			let i = {
				normalization: "correct after normalization (term order or notation).",
				simplification: "correct after algebraic simplification or rearrangement.",
				equivalence: "correct: mathematical equivalence was established."
			}[n];
			r.textContent = `Answer ${e + 1}: ${i}`, t.append(r);
			let a = document.createElement("p");
			a.setAttribute("data-tp-expected-answer", String(e + 1)), a.append("Expected answer: ");
			let o = document.createElement("tp-math");
			o.setAttribute("value", this.answerValues[e] ?? ""), a.append(o), t.append(a);
		}
		if (this.mode !== "closed" && r.forEach((e, n) => {
			if (this.isClosedAnswer(n) || this.isMathAnswer(n) || this.answerPattern(n) === null || !this.answerMatches(e, n) || this.normalizeAnswer(e) === this.normalizeAnswer(this.answerValues[n] ?? "")) return;
			let r = document.createElement("p");
			r.setAttribute("data-tp-text-variant", String(n + 1)), r.textContent = `Answer ${n + 1}: correct; an accepted wording variant was recognized.`;
			let i = document.createElement("p");
			i.setAttribute("data-tp-expected-answer", String(n + 1)), i.textContent = `Expected answer: ${this.answerValues[n] ?? ""}`, t.append(r, i);
		}), a) {
			let e = document.createElement("p");
			return e.textContent = "🎉 Congratulations, correct answer!", t.append(e), t;
		}
		for (let [e, n] of this.mathResults) {
			if (n !== void 0 || !r[e]?.trim()) continue;
			let i = document.createElement("p");
			i.setAttribute("data-tp-unverified-answer", String(e + 1)), i.textContent = `Answer ${e + 1}: this mathematical expression could not be verified automatically.`, t.append(i);
		}
		let c = this.createGeneralFeedback();
		c && t.append(c);
		let l = document.createElement("ul");
		l.setAttribute("data-tp-question-feedback-list", "");
		let u = !1;
		for (let e = 0; e < i; e += 1) {
			let t = this.normalizeAnswer(r[e] ?? "");
			if (this.answerMatches(r[e] ?? "", e) || this.partial && t === "") continue;
			let n = this.feedbackItems[e];
			if (typeof n != "string" || n.trim() === "") continue;
			u = !0;
			let i = document.createElement("li");
			this.usesExternalData ? i.append(this.createSrcContentNode(n)) : i.innerHTML = n, l.append(i);
		}
		return u && t.append(l), t;
	}
	ensureFillBlank(e) {
		if (e === null) return;
		if (e.querySelector("input, select, tp-textfield, tp-blank, tp-mathfield") === null) {
			e.textContent = "";
			let t = document.createElement("div");
			t.setAttribute("style", "color: red; font-weight: bold;"), t.textContent = "ERROR: tp-fill-blank-question requires <input> or <select> elements in the Form section.", e.append(t);
			return;
		}
		let t = e.querySelector("tp-fill-blank");
		if (t instanceof HTMLElement) {
			this.actualFillBlank = t, this.stringValueProxy = new s(t);
			return;
		}
		let n = document.createElement("tp-fill-blank");
		for (n.style.marginLeft = "1rem"; e.firstChild !== null;) n.append(e.firstChild);
		e.append(n), this.actualFillBlank = n, this.stringValueProxy = new s(n);
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
		this.answerValues = this.listedAnswers ?? (e === "" ? [] : e.split(",").map((e) => e.trim())), this.expectedValues = [...this.answerValues], this.updateClosedAnswers();
	}
	onBlankModeChange = (e) => {
		e.target instanceof Element && e.target.closest("[data-tp-question]") === this && this.updateClosedAnswers();
	};
	isClosedAnswer(e) {
		let r = this.actualFillBlank ? n(this.actualFillBlank)[e] : null;
		return r && t(r) ? r.effectiveClosed : this.mode === "closed";
	}
	updateClosedAnswers() {
		if (this.updatingModes || !this.actualFillBlank || !this.isConnected) return;
		this.updatingModes = !0;
		let e = n(this.actualFillBlank).filter((e, n) => !this.isClosedAnswer(n) && (!t(e) || e.hasAttribute("data-tp-blank-open"))).map((e) => [e, e.value]);
		try {
			this.mathResults.clear(), this.mathTransformations.clear(), this.clearResults(), this.answerReading?.destroy(), this.answerReading = null, this.closedAnswers?.destroy(), this.closedAnswers = null;
			let e = n(this.actualFillBlank);
			for (let n of e) t(n) && n.syncMode();
			let r = this.expectedValues;
			this.answerValues = r.map((t, n) => e[n]?.localName === "tp-blank" && this.isClosedAnswer(n) ? String(n + 1) : t);
			let i = e.flatMap((e, t) => this.isClosedAnswer(t) ? [t] : []);
			i.length && (this.closedAnswers = new a(this.actualFillBlank, r, this.querySelector("[data-tp-question-feedback-output]"), this.answerContent, i));
		} finally {
			for (let [t, n] of e) t.value = n;
			this.answerReading = new i(this.actualFillBlank), this.updatingModes = !1;
		}
	}
	isMathAnswer(e) {
		let r = this.actualFillBlank ? n(this.actualFillBlank)[e] : null;
		return r && t(r) ? r.type === "math" : !!this.answerRules[e]?.math;
	}
	prepareSubmission() {
		if (this.mathResults.clear(), this.mathTransformations.clear(), this.answerValues.some((e, t) => !this.isClosedAnswer(t) && this.isMathAnswer(t))) return this.prepareMathResults();
	}
	async prepareMathResults() {
		let e = this.getSubmittedValues();
		if (!this.mathChecker) {
			let { createMathChecker: e } = await import("./math-checker.js");
			this.mathChecker = e();
		}
		this.answerValues.forEach((t, n) => {
			!this.isClosedAnswer(n) && this.isMathAnswer(n) && this.mathResults.set(n, (this.answerRules[n]?.mode ?? "latexmath") === "latexmath" ? this.mathChecker?.(e[n] ?? "", this.answerValues[n] ?? "", (e) => this.mathTransformations.set(n, e)) : void 0);
		}), this.mathTransformations.size > 0 && await import("../math/math.js");
	}
	answerPattern(e) {
		let t = this.actualFillBlank ? n(this.actualFillBlank)[e] : null;
		return t?.getAttribute("regexp") ?? t?.closest("tp-textfield")?.getAttribute("regexp") ?? null;
	}
	answerMatches(e, r) {
		let i = this.answerValues[r] ?? "";
		if (!e.trim() || !i.trim()) return !1;
		if (!this.isClosedAnswer(r) && this.isMathAnswer(r)) return this.mathResults.get(r) === !0;
		let a = this.isClosedAnswer(r) ? null : this.answerPattern(r);
		if (!this.isClosedAnswer(r) && a !== null) try {
			return RegExp(`^(?:${a})(?![\\s\\S])`, this.caseSensitive ? "u" : "iu").test(e.trim());
		} catch {
			return !1;
		}
		let o = this.actualFillBlank ? n(this.actualFillBlank)[r] : null;
		return !this.isClosedAnswer(r) && o && t(o) && o.type === "number" ? Number.isFinite(Number(e)) && Number.isFinite(Number(i)) && Number(e) === Number(i) : this.normalizeAnswer(e) === this.normalizeAnswer(i);
	}
	matchesSubmittedValues(e) {
		return e.length !== 0 && e.every((e, t) => this.answerMatches(e, t));
	}
	normalizeAnswer(e) {
		let t = e.trim();
		return this.caseSensitive ? t : t.toLowerCase();
	}
	getSubmittedValues() {
		if (this.actualFillBlank === null) return [];
		let e = this.actualFillBlank;
		return e.value instanceof FormData ? n(this.actualFillBlank).map((t) => (e.value?.get(t.name) ?? "").toString().trim()) : [];
	}
};
customElements.get("tp-fill-blank-question") || customElements.define("tp-fill-blank-question", c);
//#endregion
export { c as TpFillBlankQuestion };

//# sourceMappingURL=fill-blank-question.js.map