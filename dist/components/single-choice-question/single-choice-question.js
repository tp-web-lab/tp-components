import { V as e, st as t } from "../../chunks/lib/typescript/typescript.js";
import "../../chunks/radio-list.js";
import { SingleChoiceQuestionSrcSchema as n } from "../question/question-src-schema.js";
//#region src/components/single-choice-question/single-choice-question.ts
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
	correctItemEl = null;
	feedbackByItem = /* @__PURE__ */ new Map();
	_answer = 0;
	get answer() {
		if (this._answer > 0) return this._answer;
		let e = Number.parseInt(this.getAttribute("answer") ?? "", 10);
		return Number.isFinite(e) && e > 0 ? e : 0;
	}
	set answer(e) {
		this._answer = e;
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
		this.src || this.ensureRadioList();
	}
	async onSrcReady(e) {
		let t = n.safeParse(e);
		if (!t.success) {
			this.showSrcError(`Invalid question file "${this.src}":\n${t.error.issues.map((e) => `  • ${e.path.join(".")}: ${e.message}`).join("\n")}`);
			return;
		}
		let { title: r, prompt: i, form: a, feedback: o, solution: s, markup: c, attributes: l } = t.data;
		this.srcMarkup = this.normalizeSrcMarkup(c);
		let u = Number(l.answer);
		if (u > a.length) {
			this.showSrcError(`Invalid question file "${this.src}": answer (${u}) exceeds form items count (${a.length}).`);
			return;
		}
		this._answer = u, l.random && this.toggleAttribute("random", !0), l.name && this.setAttribute("name", l.name), l.orientation && this.setAttribute("orientation", l.orientation), l.value && this.setAttribute("value", l.value), r && this.updateSrcTitle(r, this.srcMarkup), i && this.updateSrcPrompt(i, this.srcMarkup), s && this.updateSrcSolution(s, this.srcMarkup), await this.populateItemsFromSrc(a, this.srcMarkup), this.storeCorrectItem(), this.buildFeedbackMap(o ?? []), o && o.length > 0 && (this.hasSpecificFeedback = !0, this.updateFeedbackPlaceholder()), this.random && this.randomize();
	}
	initInline() {
		let e = this.consumeFeedbackListItems();
		this.storeCorrectItem(), this.buildFeedbackMap(e), this.random && this.randomize();
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
		let a = document.createElement("tp-radio-list");
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
		let i = this.correctItemEl === null ? -1 : n.indexOf(this.correctItemEl);
		(i >= 0 && String(i + 1) === String(e) || this.tries >= r - 1) && this.solutionTabEl.removeAttribute("disabled");
	}
	get resetMessageText() {
		return this.random ? "Resetting and randomizing the answer form…" : "Resetting the answer form…";
	}
	validateSubmit(e) {
		return e === null || e === "" || e === "0" ? "Please select an item." : null;
	}
	submitMessage(e) {
		let t = document.createElement("div"), n = Number.parseInt(String(e), 10), r = this.isCorrectSelection(n);
		if (t.append(this.createAttemptSummaryLine(+!!r, 1)), r) {
			let e = document.createElement("p");
			e.textContent = "🎉 Well done, that’s the right answer!";
			let n = this.createOpenSolutionButton();
			return t.append(e, n), t;
		}
		let i = this.findResponseWidget();
		if (i instanceof HTMLElement) {
			let e = Array.from(i.querySelectorAll(":scope > ul > li, :scope > ol > li"))[n - 1], r = e === void 0 ? void 0 : this.feedbackByItem.get(e);
			if (typeof r == "string" && r.trim() !== "") {
				let e = document.createElement("div");
				e.append(this.createSrcContentNode(r, this.src ? this.srcMarkup : "html")), t.append(e);
			}
		}
		return t;
	}
	ensureRadioList() {
		let e = this.response;
		if (e === null || e.querySelector("tp-radio-list") !== null) return;
		let t = e.querySelector(":scope > ol, :scope > ul");
		if (t === null) {
			e.textContent = "";
			let t = document.createElement("div");
			t.setAttribute("style", "color: red; font-weight: bold;"), t.textContent = "ERROR: tp-single-choice-question requires a <ul> or <ol> list in the Form section.", e.append(t);
			return;
		}
		let n = document.createElement("tp-radio-list");
		this.name && n.setAttribute("name", this.name), this.orientation && n.setAttribute("orientation", this.orientation), this.value && n.setAttribute("value", this.value), t.replaceWith(n), n.append(t);
	}
	storeCorrectItem() {
		if (this.answer <= 0) return;
		let e = this.findResponseWidget();
		if (!(e instanceof HTMLElement)) return;
		let t = Array.from(e.querySelectorAll(":scope > ul > li, :scope > ol > li"));
		this.correctItemEl = t[this.answer - 1] ?? null;
	}
	isCorrectSelection(e) {
		if (!Number.isFinite(e)) return !1;
		let t = this.findResponseWidget();
		if (!(t instanceof HTMLElement)) return !1;
		let n = Array.from(t.querySelectorAll(":scope > ul > li, :scope > ol > li")), r = this.correctItemEl === null ? -1 : n.indexOf(this.correctItemEl);
		return r >= 0 && e === r + 1;
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
customElements.get("tp-single-choice-question") || customElements.define("tp-single-choice-question", r);
//#endregion
export { r as TpSingleChoiceQuestion };

//# sourceMappingURL=single-choice-question.js.map