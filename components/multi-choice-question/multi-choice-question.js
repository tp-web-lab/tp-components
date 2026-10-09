import { V as e, st as t } from "../../chunks/lib/typescript/typescript.js";
import "../../chunks/checkbox-list.js";
import { MultiChoiceQuestionSrcSchema as n } from "../question/question-src-schema.js";
//#region src/components/multi-choice-question/multi-choice-question.ts
var r = class extends e {
	static get observedAttributes() {
		return [
			...e.observedAttributes ?? [],
			"answer",
			"random",
			"name",
			"orientation",
			"value"
		];
	}
	correctItemEls = [];
	feedbackByItem = /* @__PURE__ */ new Map();
	_answer = null;
	get answer() {
		return this._answer === null ? this.getAttribute("answer") ?? "" : this._answer;
	}
	set answer(e) {
		this._answer = e;
	}
	get answerIndexes() {
		return this.answer.split(",").map((e) => Number.parseInt(e.trim(), 10)).filter((e) => Number.isFinite(e) && e > 0);
	}
	get random() {
		return this.hasAttribute("random");
	}
	set random(e) {
		this.toggleAttribute("random", e);
	}
	get name() {
		return this.getAttribute("name") ?? "";
	}
	set name(e) {
		this.setAttribute("name", e);
	}
	get orientation() {
		return this.getAttribute("orientation") ?? "";
	}
	set orientation(e) {
		this.setAttribute("orientation", e);
	}
	get value() {
		return this.getAttribute("value") ?? "";
	}
	set value(e) {
		this.setAttribute("value", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.src ? this.loadSrc() : this.initInline();
	}
	beforeQuestionLayout() {
		this.src || this.ensureCheckboxList();
	}
	async onSrcReady(e) {
		let t = n.safeParse(e);
		if (!t.success) {
			this.showSrcError(`Invalid question file "${this.src}":\n${t.error.issues.map((e) => `  • ${e.path.join(".")}: ${e.message}`).join("\n")}`);
			return;
		}
		let { title: r, prompt: i, form: a, feedback: o, solution: s, markup: c, attributes: l } = t.data;
		this.srcMarkup = this.normalizeSrcMarkup(c);
		let u = Array.isArray(l.answer) ? l.answer.join(",") : l.answer, d = u.split(",").map((e) => Number.parseInt(e.trim(), 10)).filter((e) => e > a.length);
		if (d.length > 0) {
			this.showSrcError(`Invalid question file "${this.src}": answer index(es) ${d.join(",")} exceed form items count (${a.length}).`);
			return;
		}
		this._answer = u, l.random && this.toggleAttribute("random", !0), l.name && this.setAttribute("name", l.name), l.orientation && this.setAttribute("orientation", l.orientation), l.value && this.setAttribute("value", l.value), r && this.updateSrcTitle(r, this.srcMarkup), i && this.updateSrcPrompt(i, this.srcMarkup), s && this.updateSrcSolution(s, this.srcMarkup), await this.populateItemsFromSrc(a, this.srcMarkup), this.storeCorrectItems(), this.buildFeedbackMap(o ?? []), o && o.length > 0 && (this.hasSpecificFeedback = !0, this.updateFeedbackPlaceholder()), this.random && this.randomize();
	}
	initInline() {
		let e = this.consumeFeedbackListItems();
		this.storeCorrectItems(), this.buildFeedbackMap(e), this.random && this.randomize();
	}
	async populateItemsFromSrc(e, n) {
		let r = this.formContent;
		if (r === null) return;
		r.replaceChildren();
		let i = document.createElement("ol");
		for (let r of e) {
			let e = document.createElement("li"), a = this.normalizeSrcMarkup(n);
			a === "html" ? e.innerHTML = r : a === "none" ? e.textContent = r : e.innerHTML = await t(r), i.append(e);
		}
		let a = document.createElement("tp-checkbox-list");
		this.name && a.setAttribute("name", this.name), this.orientation && a.setAttribute("orientation", this.orientation), this.value && a.setAttribute("value", this.value), a.append(i), r.append(a);
	}
	randomize() {
		let e = this.findResponseWidget();
		if (!(e instanceof HTMLElement)) return;
		let t = e.querySelector(":scope > ul, :scope > ol");
		if (t === null) return;
		let n = Array.from(t.querySelectorAll(":scope > li"));
		if (n.length < 2) return;
		for (let e = n.length - 1; e > 0; e--) {
			let t = Math.floor(Math.random() * (e + 1)), r = n[e];
			n[e] = n[t], n[t] = r;
		}
		for (let e of n) t.append(e);
		let r = e.reset;
		typeof r == "function" && r.call(e);
	}
	onReset() {
		this.random && this.randomize();
	}
	onSubmitAttempt(e) {
		if (this.solutionTabEl === null || !this.solutionTabEl.hasAttribute("disabled")) return;
		let t = this.findResponseWidget();
		if (!(t instanceof HTMLElement)) return;
		let n = Array.from(t.querySelectorAll(":scope > ul > li, :scope > ol > li")), r = n.length;
		if (r < 2) return;
		let i = this.correctItemEls.map((e) => n.indexOf(e)).filter((e) => e >= 0).map((e) => e + 1).sort((e, t) => e - t), a = String(e ?? "").split(",").map((e) => Number.parseInt(e.trim(), 10)).filter((e) => Number.isFinite(e) && e > 0).sort((e, t) => e - t), o = i.length === a.length && i.every((e, t) => e === a[t]), s = 2 ** r;
		(o || this.tries >= s) && this.solutionTabEl.removeAttribute("disabled");
	}
	get resetMessageText() {
		return this.random ? "Resetting and randomizing the answer form…" : "Resetting the answer form…";
	}
	validateSubmit(e) {
		return null;
	}
	submitMessage(e) {
		let t = document.createElement("div"), n = this.parseSubmittedIndexes(e), r = this.getCorrectCurrentIndexes();
		if (r.length === n.length && r.every((e, t) => e === n[t])) {
			let e = r.length || this.findResponseWidget()?.querySelectorAll(":scope > ul > li, :scope > ol > li").length || 1;
			t.append(this.createAttemptSummaryLine(e, e));
			let n = document.createElement("p");
			return n.textContent = "🎉 Félicitations, bonne réponse !", t.append(n, this.createOpenSolutionButton()), t;
		}
		let i = this.findResponseWidget(), a = r.length;
		i instanceof HTMLElement && (a = i.querySelectorAll(":scope > ul > li, :scope > ol > li").length);
		let o = new Set(n), s = new Set(r), c = 0;
		for (let e = 1; e <= a; e += 1) o.has(e) === s.has(e) && (c += 1);
		t.append(this.createAttemptSummaryLine(c, a));
		let l = document.createElement("ul");
		l.setAttribute("data-tp-question-feedback-list", "");
		let u = !1, d = i instanceof HTMLElement ? Array.from(i.querySelectorAll(":scope > ul > li, :scope > ol > li")) : [];
		for (let e of n) {
			let t = d[e - 1], n = t === void 0 ? void 0 : this.feedbackByItem.get(t);
			if (typeof n != "string" || n.trim() === "") continue;
			u = !0;
			let r = document.createElement("li");
			r.append(this.createSrcContentNode(n, this.src ? this.srcMarkup : "html")), l.append(r);
		}
		return u && t.append(l), t;
	}
	ensureCheckboxList() {
		let e = this.response;
		if (e === null || e.querySelector("tp-checkbox-list") !== null) return;
		let t = e.querySelector(":scope > ol, :scope > ul");
		if (t === null) {
			e.textContent = "";
			let t = document.createElement("div");
			t.setAttribute("style", "color: red; font-weight: bold;"), t.textContent = "ERROR: tp-multi-choice-question requires a <ul> or <ol> list in the Form section.", e.append(t);
			return;
		}
		let n = document.createElement("tp-checkbox-list");
		this.name && n.setAttribute("name", this.name), this.orientation && n.setAttribute("orientation", this.orientation), this.value && n.setAttribute("value", this.value), t.replaceWith(n), n.append(t);
	}
	storeCorrectItems() {
		let e = this.answerIndexes;
		if (e.length === 0) return;
		let t = this.findResponseWidget();
		if (!(t instanceof HTMLElement)) return;
		let n = Array.from(t.querySelectorAll(":scope > ul > li, :scope > ol > li"));
		this.correctItemEls = e.map((e) => n[e - 1]).filter((e) => e instanceof HTMLLIElement);
	}
	parseSubmittedIndexes(e) {
		return String(e ?? "").split(",").map((e) => Number.parseInt(e.trim(), 10)).filter((e) => Number.isFinite(e) && e > 0).sort((e, t) => e - t);
	}
	getCorrectCurrentIndexes() {
		let e = this.findResponseWidget();
		if (!(e instanceof HTMLElement)) return [];
		let t = Array.from(e.querySelectorAll(":scope > ul > li, :scope > ol > li"));
		return this.correctItemEls.map((e) => t.indexOf(e)).filter((e) => e >= 0).map((e) => e + 1).sort((e, t) => e - t);
	}
	buildFeedbackMap(e) {
		let t = this.findResponseWidget();
		if (!(t instanceof HTMLElement)) return;
		let n = Array.from(t.querySelectorAll(":scope > ul > li, :scope > ol > li"));
		this.feedbackByItem.clear();
		for (let t = 0; t < n.length && t < e.length; t++) {
			let r = e[t];
			typeof r == "string" && r.trim() !== "" && this.feedbackByItem.set(n[t], r);
		}
	}
};
customElements.get("tp-multi-choice-question") || customElements.define("tp-multi-choice-question", r);
//#endregion
export { r as TpMultiChoiceQuestion };

