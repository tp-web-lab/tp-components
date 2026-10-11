import { resolveComponentSourceUrl as e } from "../../utilities/source-url.js";
import { t } from "../../chunks/console.js";
import { t as n } from "../../chunks/iframe.js";
import { inferLanguage as r } from "../playground/playground-example-loader.js";
import { t as i } from "../../chunks/question.js";
//#region src/components/editor-question/editor-question.ts
var a = class extends i {
	static get observedAttributes() {
		return [...i.observedAttributes, "test"];
	}
	get test() {
		return this.getAttribute("test") ?? "";
	}
	control = null;
	ready = !1;
	pending = null;
	generation = 0;
	cleanup;
	frame = null;
	report = null;
	result = document.createElement("div");
	connectedCallback() {
		super.connectedCallback(), this.configure(), this.ownerDocument.defaultView?.addEventListener("message", this.receiveResult);
	}
	disconnectedCallback() {
		this.cancelRun(), this.ownerDocument.defaultView?.removeEventListener("message", this.receiveResult), super.disconnectedCallback();
	}
	attributeChangedCallback(e, t, n) {
		super.attributeChangedCallback(e, t, n), t !== n && this.isConnected && ["src", "test"].includes(e) && this.configure(), e === "open" && this.open && !this.control && this.isConnected && this.configure();
	}
	configure() {
		this.cancelRun(), this.result.replaceChildren(), this.ready = !1, this.hasSpecificFeedback = !!this.test.trim(), this.updateFeedbackPlaceholder(), this.control = null;
		let t = this.querySelector("[data-tp-question-form-content]");
		if (!t) return;
		if (!this.open) {
			t.replaceChildren();
			return;
		}
		let n = this.createEditor();
		this.control = n, n.addEventListener(this.sourceLoadedEvent, () => {
			this.control === n && (this.ready = !0);
		}), this.src.trim() ? n.src = e(this, this.src).href : this.ready = !0, t.replaceChildren(n);
	}
	readResponseValue() {
		return this.control ? this.responseValue(this.control) : null;
	}
	get allowRepeatedSubmission() {
		return !0;
	}
	validateSubmit() {
		return !this.control || !this.ready ? "Wait for the source to load, or check its configuration." : this.test.trim() ? null : "No test file is configured.";
	}
	onSubmitAttempt() {
		this.runTests();
	}
	submitMessage() {
		return this.result;
	}
	shouldShowMissingFeedback() {
		return !1;
	}
	onReset() {
		this.cancelRun(), this.result.replaceChildren();
	}
	cancelRun() {
		this.generation++, this.pending?.abort(), this.pending = null, this.frame?.remove(), this.frame = null, this.report = null, this.cleanup?.(), this.cleanup = void 0;
	}
	async runTests() {
		this.cancelRun();
		let i = this.generation, a = this.control;
		this.result = document.createElement("div"), this.result.setAttribute("aria-live", "polite"), this.result.textContent = "Loading tests…";
		try {
			this.pending = new AbortController();
			let o = e(this, this.test), s = await fetch(o.href, {
				signal: this.pending.signal,
				cache: "no-store"
			});
			if (!s.ok) throw Error(`Unable to load tests (HTTP ${s.status}).`);
			let c = await s.text();
			if (i !== this.generation || !a) return;
			let l = o.pathname.split("/").at(-1) || "exercise.test.js", u = await this.buildTests(a, {
				path: `/${l}`,
				language: r(l),
				content: c
			});
			if (i !== this.generation) {
				u.cleanup?.();
				return;
			}
			this.cleanup = u.cleanup, this.report = new t(), this.frame = new n(), this.frame.setAttribute("title", "Test execution"), this.frame.srcdoc = u.html, this.result.replaceChildren(this.report, this.frame);
		} catch (e) {
			i === this.generation && (this.result.textContent = e instanceof Error ? e.message : "Unable to run tests.");
		}
	}
	receiveResult = (e) => {
		if (!this.frame || e.source !== this.frame.contentWindow) return;
		let t = e.data;
		t?.type === "tp-playground-console-entry" && typeof t.kind == "string" && Array.isArray(t.values) && this.report?.addEntry(t.kind, t.values);
	};
};
//#endregion
export { a as TpEditorQuestion };

//# sourceMappingURL=editor-question.js.map