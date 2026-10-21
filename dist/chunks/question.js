import { t as e } from "./base.js";
import "./icon-button.js";
import "./icon.js";
import { resolveComponentSourceUrl as t } from "../utilities/source-url.js";
import "./button-group.js";
import "./badge.js";
import "./switcher.js";
import "./tabs.js";
import "./callout.js";
//#region src/components/question/question.css?inline
var n = "[data-tp-question]{margin-block:1em;display:flow-root}[data-tp-question] details[data-tp-question-details]{border:1px solid var(--tp-brand-fill-soft);border-radius:.5em;padding-block-end:0}[data-tp-question] details[data-tp-question-details][open]{padding-block-end:.75em;padding-inline:0}[data-tp-question] details[data-tp-question-details]:not([open]){padding-inline:0}[data-tp-question] details[data-tp-question-details]:not([open])>summary,[data-tp-question] details[data-tp-question-details][open]>summary{cursor:pointer;background-color:var(--tp-brand-fill-softer);margin-bottom:0;padding-block:.5em;font-weight:600}[data-tp-question] details[data-tp-question-details]>summary>tp-icon{vertical-align:middle;margin-inline:.35em}[data-tp-question] details[data-tp-question-details]>summary>[data-tp-question-title]{vertical-align:middle;display:inline-block}[data-tp-question] details[data-tp-question-details]>summary>*,[data-tp-question] details[data-tp-question-details]>summary .tp-markdown-output>*{margin-block:0}[data-tp-question] [data-tp-question-layout]{gap:1em;padding-inline:.75em;display:grid}[data-tp-question] [data-tp-question-prompt]{grid-column:1/-1}[data-tp-question-prompt-header]{justify-content:space-between;align-items:center;gap:.5em;margin-top:2px;display:flex}[data-tp-question-panel-controls]{--tp-button-group-gap:.25rem;margin-inline-start:auto}[data-tp-question-panel-controls] tp-icon-button[aria-pressed=true]{color:var(--tp-brand-text-colorful)}[data-tp-question-panel-controls] tp-icon-button[aria-pressed=true]>button{background:var(--tp-brand-fill-softer);border-radius:var(--tp-border-radius-md)}[data-tp-question] [data-tp-question-panels]{align-items:start}[data-tp-question] [data-tp-question-panel=form],[data-tp-question] [data-tp-question-panel=feedback]{min-inline-size:0}[data-tp-question] [data-tp-question-feedback-box]{border:1px solid var(--tp-neutral-stroke-soft);border-radius:var(--tp-border-radius-md,.375em);margin:0;padding:0 .75em .75em}[data-tp-question] [data-tp-question-feedback-label]{color:var(--tp-text-muted);padding:.25em .25em .5em;font-size:.75em;display:block}[data-tp-question] [data-tp-question-form-fieldset]{border:1px solid var(--tp-neutral-stroke-soft);border-radius:var(--tp-border-radius-md,.375em);margin:0;padding:0 .75em .75em}[data-tp-question] [data-tp-question-form-legend],[data-tp-question] [data-tp-closed-answers-heading]{color:var(--tp-text-muted);padding:.25em .25em .5em;font-size:.75em;display:block}[data-tp-question] [data-tp-question-prompt-label]{color:var(--tp-text-muted);padding:0 .25em .25em;font-size:.75em;display:block}[data-tp-question] [data-tp-question-prompt-content]{margin-block-start:.25em}[data-tp-question] [data-tp-question-prompt-content]>:first-child,[data-tp-question] [data-tp-question-prompt-content] .tp-markdown-output>:first-child,[data-tp-question] [data-tp-question-feedback-output]>:first-child,[data-tp-question] [data-tp-question-feedback-output] .tp-markdown-output>:first-child{margin-block-start:0}[data-tp-question] [data-tp-question-prompt-content]>:last-child,[data-tp-question] [data-tp-question-prompt-content] .tp-markdown-output>:last-child,[data-tp-question] [data-tp-question-feedback-output]>:last-child,[data-tp-question] [data-tp-question-feedback-output] .tp-markdown-output>:last-child{margin-block-end:0}[data-tp-question] [data-tp-question-form-content]{margin-bottom:.75em}[data-tp-question] [data-tp-question-toolbar]{align-items:center;gap:.5em;display:flex}[data-tp-question] [data-tp-question-actions]{border:1px solid var(--tp-neutral-stroke-soft);border-radius:var(--tp-border-radius-md,.375em);flex:none;align-items:center;gap:0;display:flex;overflow:hidden}[data-tp-question] [data-tp-question-message]{min-height:1.5em;color:var(--tp-text-body);flex:1;font-size:.875em}[data-tp-question] [data-tp-question-message][data-type=warning]{color:var(--tp-warning-text-colorful)}[data-tp-question] [data-tp-question-message][data-type=danger]{color:var(--tp-danger-text-colorful,var(--tp-error-text-colorful,red))}[data-tp-question] dl[data-tp-question-source]{display:none}[data-tp-question] [data-tp-question-feedback-list]{padding-inline-start:0!important;list-style:none!important}[data-tp-question] [data-tp-question-feedback-list]>li{list-style:none!important}[data-tp-question] [data-tp-question-feedback-list]>li::marker{content:\"\"}", r = [
	{
		id: "title",
		label: "Title",
		aliases: ["Title", "Titles"]
	},
	{
		id: "statement",
		label: "Prompt",
		aliases: [
			"Prompt",
			"Prompts",
			"Statement",
			"Statements",
			"Question",
			"Questions"
		]
	},
	{
		id: "response",
		label: "Form",
		aliases: ["Form", "Forms"]
	},
	{
		id: "feedback",
		label: "Feedback",
		aliases: ["Feedback", "Feedbacks"]
	},
	{
		id: "solution",
		label: "Solution",
		aliases: ["Solution", "Solutions"]
	}
];
function i(e) {
	return e.toLowerCase().trim();
}
function a(e) {
	return e instanceof HTMLElement && e.tagName === "DT";
}
function o(e) {
	return e instanceof HTMLElement && e.tagName === "DD";
}
var s = class s extends e {
	static get observedAttributes() {
		return [
			...e.observedAttributes ?? [],
			"src",
			"open",
			"mode"
		];
	}
	get mode() {
		let e = this.getAttribute("mode");
		return e === "closed" || e === "opened" ? e : "mixed";
	}
	set mode(e) {
		this.setAttribute("mode", e);
	}
	get open() {
		return this.hasAttribute("open");
	}
	set open(e) {
		this.toggleAttribute("open", e);
	}
	attributeChangedCallback(e, t, n) {
		if (super.attributeChangedCallback(e, t, n), e === "src" && t !== n && (this.sourceRevision++, this.inlineSourceLoaded = !1, this.isConnected && this.formContent && n && this.loadSrc()), e !== "open") return;
		let r = this.querySelector(":scope > details[data-tp-question-details]");
		r && (r.open = this.open);
	}
	static styleId = "tp-question-styles";
	resetButtonEl = null;
	submitButtonEl = null;
	panelToggleButtons = [];
	static nextPanelId = 0;
	messageEl = null;
	solutionTabEl = null;
	feedbackTabsEl = null;
	feedbackOutputEl = null;
	feedbackSourceEl = null;
	hasSpecificFeedback = !1;
	srcMarkup = "markdown";
	tries = 0;
	lastSubmittedValue = void 0;
	sourceRevision = 0;
	inlineSourceLoaded = !1;
	get usesExternalData() {
		return !!this.src && !this.inlineSourceLoaded;
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	async fetchSrc(e) {
		let n = ++this.sourceRevision, r;
		try {
			r = t(this, e).href;
		} catch {
			return this.showSrcError(`Failed to load "${e}": invalid URL`), null;
		}
		try {
			let e = await fetch(r);
			if (!e.ok) throw Error(`HTTP ${e.status}`);
			let t = new URL(r).pathname.split("/").pop() ?? "", i = t.includes(".") ? t.split(".").pop()?.toLowerCase() : "json", a = () => this.isConnected && n === this.sourceRevision;
			if (i === "json" || !i || !t.includes(".")) {
				let t = await e.json();
				return a() ? t : null;
			}
			let o = await e.text(), s;
			switch (i) {
				case "html":
				case "htm":
					s = o;
					break;
				case "md":
				case "markdown": {
					let { renderMarkdownToHtml: e } = await import("../components/markdown/markdown.js");
					s = await e(o, r);
					break;
				}
				case "rst":
				case "rest": {
					let { renderRestructuredTextToHtml: e } = await import("../components/restructuredtext/restructuredtext.js");
					s = await e(o);
					break;
				}
				case "adoc":
				case "asciidoc": {
					let { renderAsciidocToHtml: e } = await import("../components/asciidoc/asciidoc.js");
					s = await e(o);
					break;
				}
				default: throw Error(`Unsupported question extension: ${i}`);
			}
			return a() && this.applySourceMarkup(s, r), null;
		} catch (t) {
			return this.isConnected && n === this.sourceRevision && this.showSrcError(`Failed to load "${e}": ${String(t)}`), null;
		}
	}
	applySourceMarkup(e, t) {
		let n = document.createElement("template");
		n.innerHTML = e;
		let r = n.content.querySelector(this.localName)?.querySelector(":scope > dl") ?? n.content.querySelector("dl");
		if (!r) throw Error("Question source must contain a definition list.");
		r.setAttribute("data-tp-source", t);
		for (let e of r.querySelectorAll("[src], a[href]")) {
			if (e.localName.includes("-")) continue;
			let n = e.hasAttribute("src") ? "src" : "href", r = e.getAttribute(n);
			r && !r.startsWith("#") && e.setAttribute(n, new URL(r, t).href);
		}
		this.disconnectedCallback(), this.inlineSourceLoaded = !0, this.replaceChildren(r), this.connectedCallback();
	}
	showSrcError(e) {
		let t = this.querySelector("[data-tp-question-form-content]") ?? this.response;
		if (t === null) return;
		t.replaceChildren();
		let n = document.createElement("div");
		n.setAttribute("style", "color: red; font-weight: bold; white-space: pre-wrap;"), n.textContent = e, t.append(n), console.error(`[${this.tagName.toLowerCase()}]`, e);
	}
	updateSrcTitle(e, t = this.srcMarkup) {
		let n = this.querySelector(":scope > details[data-tp-question-details] > summary > [data-tp-question-title]");
		n instanceof HTMLElement && this.replaceWithSrcContent(n, e, t);
	}
	updateSrcPrompt(e, t = this.srcMarkup) {
		let n = this.querySelector("[data-tp-question-prompt-content]");
		n instanceof HTMLElement && this.replaceWithSrcContent(n, e, t);
	}
	updateSrcSolution(e, t = this.srcMarkup) {
		let n = this.querySelector("[data-tp-question-tabs]");
		if (!(n instanceof HTMLElement)) return;
		let r = n.querySelector("[data-tp-question-solution-content]");
		if (r instanceof HTMLElement) {
			if (e.trim() === "") {
				this.showMissingSolution(r);
				return;
			}
			this.replaceWithSrcContent(r, e, t);
		}
	}
	showMissingSolution(e) {
		let t = document.createElement("tp-callout");
		t.setAttribute("variant", "danger"), t.setAttribute("closable", ""), t.setAttribute("heading", "solution"), t.setAttribute("data-tp-question-missing-solution", ""), t.textContent = "No solution is available for this question.", e.replaceChildren(t);
	}
	normalizeSrcMarkup(e) {
		return e === "html" || e === "none" ? e : "markdown";
	}
	replaceWithSrcContent(e, t, n = this.srcMarkup) {
		e.replaceChildren(this.createSrcContentNode(t, n));
	}
	createSrcContentNode(e, t = this.srcMarkup) {
		let n = this.normalizeSrcMarkup(t);
		if (n === "html") {
			let t = document.createElement("template");
			return t.innerHTML = e, t.content.cloneNode(!0);
		}
		return n === "none" ? document.createTextNode(e) : this.createMarkdownElement(e);
	}
	createMarkdownElement(e) {
		import("../components/markdown/markdown.js").catch((e) => {
			console.error("Unable to load question Markdown renderer", e);
		});
		let t = document.createElement("tp-markdown");
		return t.textContent = e, t;
	}
	get formContent() {
		return this.querySelector("[data-tp-question-form-content]");
	}
	async onSrcReady(e) {
		if (typeof e != "object" || !e) {
			this.showSrcError("Question JSON must be an object.");
			return;
		}
		let t = e;
		this.srcMarkup = this.normalizeSrcMarkup(typeof t.markup == "string" ? t.markup : "markdown"), typeof t.title == "string" && this.updateSrcTitle(t.title), typeof t.prompt == "string" && this.updateSrcPrompt(t.prompt), typeof t.solution == "string" && this.updateSrcSolution(t.solution), typeof t.form == "string" && this.formContent && this.replaceWithSrcContent(this.formContent, t.form), typeof t.feedback == "string" && this.feedbackSourceEl && this.replaceWithSrcContent(this.feedbackSourceEl, t.feedback);
	}
	async loadSrc() {
		let e = await this.fetchSrc(this.src);
		e !== null && await this.onSrcReady(e);
	}
	connectedCallback() {
		super.connectedCallback(), this.setAttribute("data-tp-question", ""), this.ensureGlobalStyle(s.styleId, n), this.beforeQuestionLayout();
		let e = this.ensureDefinitionList();
		this.renderQuestionLayout(e), this.bindActions(), this.localName === "tp-question" && this.usesExternalData && this.loadSrc();
	}
	beforeQuestionLayout() {}
	disconnectedCallback() {
		this.sourceRevision++, this.unbindActions();
	}
	get titleSection() {
		return this.getSectionDd("title");
	}
	get statement() {
		return this.getSectionDd("statement");
	}
	get response() {
		return this.getSectionDd("response");
	}
	get feedback() {
		return this.getSectionDd("feedback");
	}
	get solution() {
		return this.getSectionDd("solution");
	}
	ensureDefinitionList() {
		let e = this.ensureSingleDl();
		return this.normalizeSections(e), e.setAttribute("data-tp-question-source", ""), e;
	}
	ensureSingleDl() {
		let e = this.querySelector(":scope > dl[data-tp-question-source]");
		if (e instanceof HTMLDListElement) return e;
		let t = this.querySelector(":scope > details[data-tp-question-details] > dl[data-tp-question-source]");
		if (t instanceof HTMLDListElement) return t;
		let n = Array.from(this.children).filter((e) => e instanceof HTMLDListElement);
		if (n.length === 0) {
			let e = document.createElement("dl");
			for (; this.firstChild !== null;) e.append(this.firstChild);
			return this.append(e), e;
		}
		let [r, ...i] = n;
		if (!(r instanceof HTMLDListElement)) {
			let e = document.createElement("dl");
			return this.append(e), e;
		}
		for (let e of i) {
			for (; e.firstChild !== null;) r.append(e.firstChild);
			e.remove();
		}
		return r;
	}
	normalizeSections(e) {
		let t = Array.from(e.children).filter((e) => a(e) || o(e)), n = [];
		for (let e = 0; e < t.length; e += 1) {
			let r = t[e];
			if (a(r)) {
				let i = e + 1 < t.length ? t[e + 1] : null, a = o(i) ? i : null;
				n.push({
					dt: r,
					dd: a
				});
			}
		}
		let i = /* @__PURE__ */ new Map();
		for (let e of n) {
			let t = this.resolveSection(e.dt.textContent ?? "");
			t !== null && e.dd !== null && !i.has(t.id) && (e.dt.textContent = t.label, i.set(t.id, {
				dt: e.dt,
				dd: e.dd
			}));
		}
		e.replaceChildren();
		for (let t of r) {
			let n = i.get(t.id) ?? this.createSectionPair(t.label);
			e.append(n.dt, n.dd);
		}
		let s = i.get("title")?.dd ?? this.getSectionDd("title");
		s !== null && s.textContent?.trim() === "" && (s.textContent = "Question");
	}
	renderQuestionLayout(e) {
		if (this.querySelector(":scope > details[data-tp-question-details] > [data-tp-question-layout]") instanceof HTMLDivElement && e.hidden) return;
		let t = this.ensureElement(":scope > details[data-tp-question-details]", () => {
			let e = document.createElement("details");
			return e.setAttribute("data-tp-question-details", ""), e.open = this.open, e.addEventListener("toggle", () => {
				this.open = e.open;
			}), this.append(e), e;
		}), n = this.ensureElement(":scope > details[data-tp-question-details] > summary", () => {
			let e = document.createElement("summary");
			return t.prepend(e), e;
		}), r = this.ensureElement(":scope > details[data-tp-question-details] > [data-tp-question-layout]", () => {
			let e = document.createElement("div");
			return e.setAttribute("data-tp-question-layout", ""), t.append(e), e;
		}), i = this.ensureChild(r, "[data-tp-question-prompt]", "div", { "data-tp-question-prompt": "" }), a = this.ensureChild(i, "[data-tp-question-prompt-header]", "div", { "data-tp-question-prompt-header": "" }), o = this.ensureChild(i, "span[data-tp-question-prompt-label]", "span", { "data-tp-question-prompt-label": "" });
		o.textContent = "Prompt", a.prepend(o);
		let c = this.ensureChild(a, "tp-button-group", "tp-button-group", {
			"aria-label": "Question panels",
			"data-tp-question-panel-controls": ""
		});
		this.panelToggleButtons = ["input", "output"].map((e) => this.ensureChild(c, `tp-icon-button[data-panel-toggle="${e}"]`, "tp-icon-button", {
			"data-panel-toggle": e,
			name: e,
			library: "tp",
			label: e === "input" ? "Answer form" : "Output",
			"data-help-description": e === "input" ? "Hide/show the form." : "Hide/show the output.",
			size: "s",
			type: "button",
			"aria-pressed": "true"
		}));
		let l = this.ensureChild(i, "div[data-tp-question-prompt-content]", "div", { "data-tp-question-prompt-content": "" }), u = this.ensureQuestionPanels(r), d = this.ensureChild(u, "[data-tp-question-form-panel]", "section", {
			"data-tp-question-form-panel": "",
			"data-tp-question-panel": "form"
		}), f = this.ensureChild(u, "[data-tp-question-feedback-panel]", "section", {
			"data-tp-question-feedback-panel": "",
			"data-tp-question-panel": "feedback"
		});
		for (let [e, t] of [d, f].entries()) t.id ||= `tp-question-panel-${++s.nextPanelId}`, this.panelToggleButtons[e]?.setAttribute("aria-controls", t.id);
		this.updatePanelVisibility();
		let p = this.ensureChild(d, "[data-tp-question-form-fieldset]", "div", { "data-tp-question-form-fieldset": "" }), m = this.ensureChild(p, "span[data-tp-question-form-legend]", "span", { "data-tp-question-form-legend": "" });
		m.textContent = "Answer form";
		let h = this.ensureChild(p, "[data-tp-question-form-content]", "div", { "data-tp-question-form-content": "" }), g = this.ensureChild(p, "[data-tp-question-toolbar]", "div", { "data-tp-question-toolbar": "" }), _ = this.ensureChild(g, "[data-tp-question-actions]", "div", { "data-tp-question-actions": "" });
		this.messageEl = this.ensureChild(g, "[data-tp-question-message]", "div", {
			"data-tp-question-message": "",
			role: "status",
			"aria-live": "polite"
		}), this.resetButtonEl = this.ensureChild(_, "tp-icon-button[data-action=\"reset\"]", "tp-icon-button", {
			"data-action": "reset",
			name: "refresh",
			label: "Reset response",
			type: "button"
		}), this.submitButtonEl = this.ensureChild(_, "tp-icon-button[data-action=\"submit\"]", "tp-icon-button", {
			"data-action": "submit",
			name: "play-arrow",
			label: "Submit response",
			type: "button"
		});
		let v = this.ensureChild(f, "[data-tp-question-feedback-box]", "div", { "data-tp-question-feedback-box": "" }), y = this.ensureChild(v, "span[data-tp-question-feedback-label]", "span", { "data-tp-question-feedback-label": "" });
		y.textContent = "Output", v.querySelector("tp-tabs[data-tp-question-tabs]")?.remove();
		let b = document.createElement("tp-tabs");
		b.setAttribute("data-tp-question-tabs", ""), this.feedbackTabsEl = b;
		let x = this.ensureChild(b, ":scope > dl", "dl", {});
		x.replaceChildren();
		let S = document.createElement("dt");
		S.textContent = "Feedback";
		let C = document.createElement("dd");
		this.feedbackOutputEl = this.ensureChild(C, "[data-tp-question-feedback-output]", "div", { "data-tp-question-feedback-output": "" }), this.feedbackSourceEl = this.ensureChild(C, "[data-tp-question-feedback-source]", "div", {
			"data-tp-question-feedback-source": "",
			hidden: ""
		}), this.feedbackOutputEl.replaceChildren();
		let w = document.createElement("dt");
		w.textContent = "Solution", w.setAttribute("data-tp-question-solution-tab", "");
		let T = document.createElement("dd");
		T.setAttribute("data-tp-question-solution-content", ""), x.append(S, C, w, T);
		let E = this.getSectionDd(e, "title"), D = E ? E.textContent?.trim() : "", O = document.createElement("tp-icon");
		O.setAttribute("name", this.localName.replace(/^tp-/, "")), O.setAttribute("library", "components"), O.setAttribute("size", "1.25em"), O.setAttribute("aria-hidden", "true");
		let k = document.createElement("span");
		k.setAttribute("data-tp-question-title", ""), k.textContent = D === "" ? "Question" : D ?? "Question", n.replaceChildren(O, k);
		let A = this.getSectionDd(e, "statement");
		A !== null && this.moveChildren(A, l);
		let j = this.getSectionDd(e, "response");
		j !== null && this.moveChildren(j, h);
		let M = this.getSectionDd(e, "feedback");
		if (M !== null && this.moveChildren(M, this.feedbackSourceEl instanceof HTMLDivElement ? this.feedbackSourceEl : C), this.feedbackOutputEl instanceof HTMLDivElement) {
			this.hasSpecificFeedback = (this.feedbackSourceEl?.textContent?.trim().length ?? 0) > 0;
			let e = document.createElement("tp-callout");
			e.setAttribute("variant", this.hasSpecificFeedback ? "warning" : "danger"), e.setAttribute("closable", ""), e.setAttribute("heading", "Feedback"), e.textContent = this.hasSpecificFeedback ? "Feedback will only be provided once you have submitted an answer to the question." : "No specific feedback is available for this question.", this.feedbackOutputEl.replaceChildren(e);
		}
		let N = this.getSectionDd(e, "solution");
		N !== null && this.moveChildren(N, T), T.textContent?.trim() || T.querySelector("img, svg, math, video, audio, iframe, canvas, object, embed") || Array.from(T.querySelectorAll("*")).some((e) => e.localName.startsWith("tp-")) || this.showMissingSolution(T), v.append(b), this.solutionTabEl = b.querySelector("[data-tp-question-solution-tab]"), t.append(e), e.hidden = !0;
	}
	ensureQuestionPanels(e) {
		let t = e.querySelector("[data-tp-question-panels]"), n = t?.tagName === "TP-SWITCHER" ? t : document.createElement("tp-switcher");
		if (n.setAttribute("data-tp-question-panels", ""), n.setAttribute("gap", "1rem"), n.setAttribute("threshold", "48rem"), t === null) return e.append(n), n;
		if (t !== n) {
			for (; t.firstChild !== null;) n.append(t.firstChild);
			t.replaceWith(n);
		}
		return n;
	}
	bindActions() {
		this.unbindActions();
		for (let e of this.panelToggleButtons) e.addEventListener("click", this.handlePanelToggle);
		this.resetButtonEl?.addEventListener("click", this.handleResetClick), this.submitButtonEl?.addEventListener("click", this.handleSubmitClick);
	}
	unbindActions() {
		for (let e of this.panelToggleButtons) e.removeEventListener("click", this.handlePanelToggle);
		this.resetButtonEl?.removeEventListener("click", this.handleResetClick), this.submitButtonEl?.removeEventListener("click", this.handleSubmitClick);
	}
	handlePanelToggle = (e) => {
		let t = e.currentTarget;
		if (!(t instanceof HTMLElement)) return;
		let n = t.getAttribute("aria-pressed") === "true";
		n && !this.panelToggleButtons.some((e) => e !== t && e.getAttribute("aria-pressed") === "true") || (t.setAttribute("aria-pressed", String(!n)), this.updatePanelVisibility());
	};
	updatePanelVisibility() {
		for (let e of this.panelToggleButtons) {
			let t = e.getAttribute("aria-controls") ?? "", n = this.ownerDocument.getElementById(t), r = e.getAttribute("aria-pressed") === "true";
			n && this.contains(n) && (n.hidden = !r);
			let i = e.querySelector("button");
			i?.setAttribute("aria-pressed", String(r)), i?.setAttribute("aria-controls", t);
		}
	}
	clearMessage() {
		this.messageEl instanceof HTMLDivElement && (this.messageEl.removeAttribute("data-type"), this.messageEl.textContent = "");
	}
	handleResetClick = () => {
		this.submissionRevision++, this.clearMessage(), this.lastSubmittedValue = void 0;
		let e = this.findResponseWidget(), t = e?.reset;
		typeof t == "function" && t.call(e), this.onReset(), this.messageEl instanceof HTMLDivElement && (this.messageEl.textContent = this.resetMessageText, setTimeout(() => {
			this.messageEl instanceof HTMLDivElement && (this.messageEl.textContent = "");
		}, 2e3));
	};
	onReset() {}
	onSubmitAttempt(e) {}
	get allowRepeatedSubmission() {
		return !1;
	}
	readResponseValue() {
		let e = this.findResponseWidget();
		return e === null ? null : e.value ?? null;
	}
	get resetMessageText() {
		return "Resetting the answer form…";
	}
	prepareSubmission() {}
	preparingSubmission = !1;
	submissionRevision = 0;
	handleSubmitClick = async () => {
		if (this.preparingSubmission) return;
		this.clearMessage();
		let e = this.readResponseValue(), t = this.validateSubmit(e);
		if (t !== null) {
			this.messageEl instanceof HTMLDivElement && (this.messageEl.setAttribute("data-type", "warning"), this.messageEl.textContent = `⚠ ${t}`);
			return;
		}
		if (JSON.stringify(e) === JSON.stringify(this.lastSubmittedValue) && !this.allowRepeatedSubmission) {
			this.messageEl instanceof HTMLDivElement && (this.messageEl.setAttribute("data-type", "warning"), this.messageEl.textContent = "⚠ No change from previous submission.");
			return;
		}
		try {
			let t = this.submissionRevision, n = this.prepareSubmission();
			if (n && (this.preparingSubmission = !0, this.setAttribute("aria-busy", "true"), await n, !this.isConnected || t !== this.submissionRevision || JSON.stringify(e) !== JSON.stringify(this.readResponseValue()))) return;
		} catch {
			this.messageEl && (this.messageEl.textContent = "Unable to check the answer. Please try again.");
			return;
		} finally {
			this.preparingSubmission = !1, this.removeAttribute("aria-busy");
		}
		this.lastSubmittedValue = e, this.tries++, this.onSubmitAttempt(e);
		let n = this.submitMessage(e);
		this.renderFeedbackResult(n), this.renderSubmitStatusMessage(), this.dispatchEvent(new CustomEvent("tp-question-submit", {
			detail: { value: e },
			bubbles: !0,
			composed: !0
		}));
	};
	validateSubmit(e) {
		return e === null || e === "" ? "Please provide an answer." : null;
	}
	submitMessage(e) {
		return this.createGeneralFeedback() ?? "Submitted.";
	}
	createGeneralFeedback() {
		if (this.feedbackSourceEl?.textContent?.trim()) {
			let e = document.createElement("div");
			for (let t of this.feedbackSourceEl.childNodes) e.append(t.cloneNode(!0));
			return e;
		}
		return null;
	}
	activateFeedbackPanel() {
		if (!(this.feedbackTabsEl instanceof HTMLElement)) return;
		let e = this.feedbackTabsEl;
		if (typeof e.select == "function") {
			e.select(0);
			return;
		}
		this.feedbackTabsEl.setAttribute("selected", "0");
	}
	openSolutionPanel() {
		if (!(this.feedbackTabsEl instanceof HTMLElement) || !(this.solutionTabEl instanceof HTMLElement) || this.solutionTabEl.hasAttribute("disabled")) return;
		let e = this.feedbackTabsEl;
		if (typeof e.select == "function") {
			e.select(1);
			return;
		}
		this.feedbackTabsEl.setAttribute("selected", "1");
	}
	createOpenSolutionButton() {
		let e = document.createElement("button");
		return e.type = "button", e.textContent = "See more in the solution...", e.addEventListener("click", () => this.openSolutionPanel()), this.solutionTabEl?.hasAttribute("disabled") && (e.disabled = !0), e;
	}
	createAttemptMetaLine() {
		let e = document.createElement("div");
		e.style.display = "flex", e.style.alignItems = "center", e.style.gap = "0.5rem";
		let t = document.createElement("tp-badge");
		t.setAttribute("variant", "brand"), t.setAttribute("size", "xs"), t.textContent = String(this.tries);
		let n = /* @__PURE__ */ new Date(), r = `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}:${String(n.getSeconds()).padStart(2, "0")}`, i = document.createElement("span");
		return i.textContent = r, e.append(t, i), e;
	}
	createAttemptSummaryLine(e, t) {
		let n = this.createAttemptMetaLine(), r = document.createElement("tp-badge");
		return r.setAttribute("variant", e === t ? "success" : "danger"), r.setAttribute("size", "xs"), r.textContent = `${String(e)}/${String(t)}`, n.append(r), n;
	}
	createScoreLine(e, t) {
		let n = document.createElement("p");
		return n.style.margin = "0.5rem 0 0", n.textContent = `${String(e)}/${String(t)}`, n;
	}
	renderSubmitStatusMessage() {
		if (!(this.messageEl instanceof HTMLDivElement)) return;
		this.messageEl.removeAttribute("data-type");
		let e = document.createElement("span");
		e.style.display = "inline-flex", e.style.alignItems = "center", e.style.gap = "0.5rem";
		let t = document.createElement("tp-badge");
		t.setAttribute("variant", "brand"), t.setAttribute("size", "xs"), t.textContent = String(this.tries);
		let n = document.createElement("span");
		n.textContent = "submitted", e.append(t, n), this.messageEl.replaceChildren(e);
	}
	consumeFeedbackListItems() {
		if (!(this.feedbackSourceEl instanceof HTMLDivElement)) return [];
		let e = this.feedbackSourceEl.querySelector(":scope > ul, :scope > ol");
		if (!(e instanceof HTMLUListElement || e instanceof HTMLOListElement)) return [];
		let t = Array.from(e.querySelectorAll(":scope > li")).map((e) => e.innerHTML.trim()).filter((e) => e !== "");
		return e.remove(), t;
	}
	shouldShowMissingFeedback() {
		return !this.hasSpecificFeedback;
	}
	renderFeedbackResult(e) {
		if (this.activateFeedbackPanel(), this.feedbackOutputEl instanceof HTMLDivElement) {
			if (this.shouldShowMissingFeedback()) {
				let t = document.createElement("tp-callout");
				t.setAttribute("variant", "danger"), t.setAttribute("heading", "Feedback"), t.setAttribute("closable", ""), t.textContent = "No specific feedback is available for this question.";
				let n = document.createElement("div");
				n.setAttribute("data-tp-question-feedback-attempt", ""), e instanceof HTMLElement ? n.replaceChildren(e) : n.textContent = e, this.feedbackOutputEl.replaceChildren(t, n);
				return;
			}
			e instanceof HTMLElement ? this.feedbackOutputEl.replaceChildren(e) : this.feedbackOutputEl.textContent = e;
			return;
		}
		this.messageEl instanceof HTMLDivElement && (e instanceof HTMLElement ? this.messageEl.replaceChildren(e) : this.messageEl.textContent = e);
	}
	updateFeedbackPlaceholder() {
		if (!(this.feedbackOutputEl instanceof HTMLDivElement) || this.feedbackOutputEl.querySelector("[data-tp-question-feedback-attempt]") !== null) return;
		let e = document.createElement("tp-callout");
		e.setAttribute("variant", this.hasSpecificFeedback ? "warning" : "danger"), e.setAttribute("closable", ""), e.setAttribute("heading", "Feedback"), e.textContent = this.hasSpecificFeedback ? "Feedback will only be provided once you have submitted an answer to the question." : "No specific feedback is available for this question.", this.feedbackOutputEl.replaceChildren(e);
	}
	findResponseWidget() {
		let e = this.querySelector("[data-tp-question-form-content]");
		return e instanceof HTMLElement ? e.querySelector(":scope > tp-radio-list, :scope > tp-checkbox-list, :scope > tp-fill-blank, :scope > tp-code-editor, :scope > *") : null;
	}
	resolveSection(e) {
		let t = i(e);
		for (let e of r) if (e.aliases.some((e) => i(e) === t)) return e;
		return null;
	}
	createSectionPair(e) {
		let t = document.createElement("dt");
		return t.textContent = e, {
			dt: t,
			dd: document.createElement("dd")
		};
	}
	getSectionDd(e, t) {
		let n = null, r;
		if (typeof e == "string") r = e, n = this.querySelector(":scope > details[data-tp-question-details] > dl[data-tp-question-source], :scope > dl[data-tp-question-source], :scope > dl");
		else {
			if (n = e, t === void 0) return null;
			r = t;
		}
		if (!(n instanceof HTMLDListElement)) return null;
		let i = Array.from(n.children);
		for (let e = 0; e < i.length; e += 1) {
			let t = i[e], n = i[e + 1];
			if (!(!a(t) || !o(n)) && this.resolveSection(t.textContent ?? "")?.id === r) return n;
		}
		return null;
	}
	ensureElement(e, t) {
		let n = this.querySelector(e);
		return n instanceof HTMLElement ? n : t();
	}
	ensureChild(e, t, n, r) {
		let i = e.querySelector(t);
		if (i instanceof HTMLElement) return i;
		let a = document.createElement(n);
		for (let [e, t] of Object.entries(r)) a.setAttribute(e, t);
		return e.append(a), a;
	}
	moveChildren(e, t) {
		if (e !== null) for (t.replaceChildren(); e.firstChild !== null;) t.append(e.firstChild);
	}
};
customElements.get("tp-question") || customElements.define("tp-question", s);
//#endregion
export { s as t };

//# sourceMappingURL=question.js.map