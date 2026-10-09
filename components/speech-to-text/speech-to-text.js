import { Ku as e } from "../../chunks/lib/typescript/typescript.js";
import "../textfield/textfield.js";
import "../../chunks/stack.js";
import { t } from "../../chunks/speech-controls.js";
//#region src/components/speech-to-text/speech-to-text.ts
var n = class extends e {
	static get observedAttributes() {
		return [
			...e.observedAttributes,
			"value",
			"continuous",
			"interim-results",
			"disabled"
		];
	}
	recognition = null;
	sessionPrefix = "";
	interim = "";
	writingResult = !1;
	status = "Ready.";
	state = "idle";
	get value() {
		return this.getAttribute("value") ?? "";
	}
	set value(e) {
		this.setStringAttribute("value", e);
	}
	get continuous() {
		return this.hasAttribute("continuous");
	}
	set continuous(e) {
		this.setBooleanAttribute("continuous", e);
	}
	get interimResults() {
		return this.hasAttribute("interim-results");
	}
	set interimResults(e) {
		this.setBooleanAttribute("interim-results", e);
	}
	get disabled() {
		return this.hasAttribute("disabled");
	}
	set disabled(e) {
		this.setBooleanAttribute("disabled", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-speech-controls-styles", t), this.innerHTML = "<tp-stack>\n      <tp-button-group class=\"tp-speech-controls\" role=\"group\" aria-label=\"Speech recognition controls\">\n        <tp-button size=\"s\" data-action=\"start\">Start</tp-button>\n        <tp-button size=\"s\" data-action=\"stop\">Stop</tp-button>\n        <tp-button size=\"s\" data-action=\"clear\">Clear</tp-button>\n        <span class=\"tp-speech-status\" data-role=\"status\" role=\"status\" aria-live=\"polite\"></span>\n      </tp-button-group>\n      <tp-textfield multiline label=\"Transcript\" data-role=\"transcript\"></tp-textfield>\n      <p data-role=\"interim\" aria-label=\"Provisional transcript\" hidden></p>\n    </tp-stack>";
		for (let e of [
			"start",
			"stop",
			"clear"
		]) this.querySelector(`[data-action="${e}"]`)?.addEventListener("click", () => this[e]());
		this.querySelector("tp-textfield")?.addEventListener("input", this.onInput), this.updateUI();
	}
	attributeChangedCallback(e) {
		this.writingResult || ((e === "value" || e === "lang" || e === "continuous" || e === "interim-results" || this.disabled) && this.abort(), this.isConnected && this.updateUI());
	}
	disconnectedCallback() {
		this.abort();
	}
	start() {
		if (this.disabled || this.recognition || !this.isConnected) return;
		let e = this.recognitionConstructor();
		if (!e) {
			this.fail("Speech recognition is unavailable in this browser.");
			return;
		}
		try {
			let t = new e();
			this.recognition = t, this.sessionPrefix = this.value.trim(), this.interim = "";
			let n = this.closest("[lang]")?.getAttribute("lang")?.trim();
			n && (t.lang = n), t.continuous = this.continuous, t.interimResults = this.interimResults, t.addEventListener("start", this.onStart), t.addEventListener("result", this.onResult), t.addEventListener("error", this.onError), t.addEventListener("end", this.onEnd), this.state = "starting", this.status = "Waiting for microphone permission…", this.updateUI(), t.start();
		} catch (e) {
			this.fail(e instanceof Error ? e.message : String(e));
		}
	}
	stop() {
		if (!(!this.recognition || this.state === "stopping")) {
			this.state = "stopping", this.status = "Finishing transcription…", this.updateUI();
			try {
				this.recognition.stop();
			} catch (e) {
				this.fail(e instanceof Error ? e.message : String(e));
			}
		}
	}
	abort() {
		let e = this.release();
		if (e) {
			try {
				e.abort();
			} catch {}
			this.status = "Stopped.", this.updateUI(), this.emit("end", { value: this.value });
		}
	}
	clear() {
		this.disabled || (this.abort(), this.value = "", this.interim = "", this.status = "Ready.", this.updateUI());
	}
	recognitionConstructor() {
		let e = this.ownerDocument.defaultView;
		return e?.SpeechRecognition ?? e?.webkitSpeechRecognition;
	}
	onStart = () => {
		this.state !== "stopping" && (this.state = "listening", this.status = "Listening…"), this.updateUI(), this.emit("start", { value: this.value });
	};
	onResult = (e) => {
		let t = e.results, n = [this.sessionPrefix], r = [];
		for (let e = 0; e < t.length; e += 1) {
			let i = t[e];
			if (!i) continue;
			let a = i[0]?.transcript.trim() ?? "";
			(i.isFinal ? n : r).push(a);
		}
		this.writingResult = !0, this.value = n.filter(Boolean).join(" "), this.writingResult = !1, this.interim = this.interimResults ? r.filter(Boolean).join(" ") : "", this.updateUI(), this.emit("result", {
			value: this.value,
			interim: this.interim
		});
	};
	onError = (e) => {
		this.fail(e.error);
	};
	onEnd = () => {
		this.release(), this.status = "Ready.", this.updateUI(), this.emit("end", { value: this.value });
	};
	onInput = () => {
		let e = this.querySelector("tp-textfield");
		e && (this.value = e.value);
	};
	release() {
		let e = this.recognition;
		return this.recognition = null, e?.removeEventListener("start", this.onStart), e?.removeEventListener("result", this.onResult), e?.removeEventListener("error", this.onError), e?.removeEventListener("end", this.onEnd), this.state = "idle", this.interim = "", e;
	}
	fail(e) {
		this.abort(), this.status = `Error: ${e}`, this.updateUI(), this.emit("error", { error: e });
	}
	updateUI() {
		let e = !!this.recognitionConstructor(), t = this.querySelector("tp-textfield");
		t && (t.value = this.value, t.disabled = this.disabled), this.querySelector("[data-action=\"start\"]")?.toggleAttribute("disabled", this.disabled || !e || this.state !== "idle"), this.querySelector("[data-action=\"stop\"]")?.toggleAttribute("disabled", this.disabled || this.state === "idle" || this.state === "stopping"), this.querySelector("[data-action=\"clear\"]")?.toggleAttribute("disabled", this.disabled || this.value === "" && this.state === "idle");
		let n = this.querySelector("[data-role=\"status\"]");
		n && (n.textContent = e ? this.status : "Speech recognition is unavailable. You can type your transcript.");
		let r = this.querySelector("[data-role=\"interim\"]");
		r && (r.textContent = this.interim, r.hidden = this.interim === ""), this.dataset.state = this.state;
	}
	emit(e, t) {
		this.dispatchEvent(new CustomEvent(`tp-speech-to-text-${e}`, {
			detail: t,
			bubbles: !0
		}));
	}
};
customElements.get("tp-speech-to-text") || customElements.define("tp-speech-to-text", n);
//#endregion
export { n as TpSpeechToText };

