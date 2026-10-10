import { Ku as e } from "./lib/typescript/typescript.js";
import { TpDeclarativeTextSource as t } from "../utilities/declarative-text-source.js";
import { t as n } from "./speech-controls.js";
import { readSpeechText as r } from "../utilities/speech-text.js";
import "./typewriting.js";
//#region src/components/text-to-speech/text-to-speech.css?inline
var i = ".tp-text-to-speech{border:1px solid var(--tp-neutral-stroke-soft,#d0d7de);border-radius:.5rem;gap:.75rem;padding:.75rem;display:grid}.tp-text-to-speech-text{margin:0}", a = class a extends e {
	static settingsSequence = 0;
	settingsId = `tp-speech-settings-${++a.settingsSequence}`;
	observedSynthesis;
	onVoicesChanged = () => {
		this.refreshVoiceMenu();
	};
	static get observedAttributes() {
		return [
			...e.observedAttributes,
			"src",
			"for",
			"value",
			"show-text",
			"lite",
			"voice",
			"rate",
			"pitch",
			"volume",
			"autoplay"
		];
	}
	source = new t(this, {
		scriptTypes: ["tp/txt", "tp/text-to-speech"],
		textContentFallback: !0,
		ignoreSelector: "[data-tp-speech-ui]"
	});
	text = "";
	utterance = null;
	updateToken = 0;
	linkedTypewriting = null;
	linkedTarget = null;
	linkedObserver = new MutationObserver(() => {
		this.linkedTarget && (!this.linkedTarget.isConnected || this.readLinkedText() !== this.text) && this.updateText();
	});
	get htmlFor() {
		return this.getAttribute("for") ?? "";
	}
	set htmlFor(e) {
		this.setStringAttribute("for", e);
	}
	resolveTarget() {
		let e = this.htmlFor ? this.ownerDocument.getElementById(this.htmlFor) : null, t = this.ownerDocument.defaultView?.customElements.get("tp-typewriting"), n = e?.localName === "tp-typewriting" && t && e instanceof t ? e : null;
		if (e !== this.linkedTarget && (this.stop(), this.linkedObserver.disconnect(), this.linkedTypewriting?.detachSpeech(this), this.linkedTypewriting = n, this.linkedTarget = e, n?.attachSpeech(this), e && e !== this && this.linkedObserver.observe(e, {
			childList: !0,
			subtree: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: [
				"hidden",
				"aria-hidden",
				"style",
				"class"
			]
		})), this.htmlFor && !e) throw Error(`No element found with id "${this.htmlFor}".`);
		if (e === this) throw Error("The speech component cannot reference itself.");
		return e;
	}
	readLinkedText() {
		return this.linkedTypewriting?.getSpeechText() ?? (this.linkedTarget ? r(this.linkedTarget) : "");
	}
	get src() {
		return this.getAttribute("src") ?? "";
	}
	set src(e) {
		this.setStringAttribute("src", e);
	}
	get value() {
		return this.getAttribute("value") ?? "";
	}
	set value(e) {
		this.setStringAttribute("value", e);
	}
	get showText() {
		return this.hasAttribute("show-text");
	}
	set showText(e) {
		this.setBooleanAttribute("show-text", e);
	}
	get lite() {
		return this.hasAttribute("lite");
	}
	set lite(e) {
		this.setBooleanAttribute("lite", e);
	}
	get voice() {
		return this.getAttribute("voice") ?? "";
	}
	set voice(e) {
		this.setStringAttribute("voice", e);
	}
	get rate() {
		return this.numberAttribute("rate", 1, .1, 10);
	}
	set rate(e) {
		this.setAttribute("rate", String(e));
	}
	get pitch() {
		return this.numberAttribute("pitch", 1, 0, 2);
	}
	set pitch(e) {
		this.setAttribute("pitch", String(e));
	}
	get volume() {
		return this.numberAttribute("volume", 1, 0, 1);
	}
	set volume(e) {
		this.setAttribute("volume", String(e));
	}
	get autoplay() {
		return this.hasAttribute("autoplay");
	}
	set autoplay(e) {
		this.setBooleanAttribute("autoplay", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle("tp-text-to-speech-styles", i), this.ensureGlobalStyle("tp-speech-controls-styles", n), this.classList.add("tp-text-to-speech"), this.observedSynthesis = this.getSpeechGlobals().speechSynthesis, this.observedSynthesis?.addEventListener("voiceschanged", this.onVoicesChanged), this.source.observe(() => {
			this.updateText();
		}), this.updateText();
	}
	attributeChangedCallback(e) {
		this.isConnected && ((e === "src" || e === "value" || e === "for") && this.updateText(), e === "show-text" && this.render(), e === "lite" && (this.stop(), this.render()), (e === "lang" || e === "voice") && this.refreshVoiceMenu());
	}
	disconnectedCallback() {
		this.source.disconnect(), this.observedSynthesis?.removeEventListener("voiceschanged", this.onVoicesChanged), this.observedSynthesis = void 0, this.stop(), this.linkedObserver.disconnect(), this.linkedTypewriting?.detachSpeech(this), this.linkedTypewriting = null, this.linkedTarget = null, this.updateToken += 1;
	}
	async speak() {
		try {
			this.resolveTarget() && (this.text = this.readLinkedText());
		} catch (e) {
			this.stop(), this.reportError(e instanceof Error ? e.message : String(e));
			return;
		}
		let e = this.getSpeechGlobals(), t = e.speechSynthesis, n = e.SpeechSynthesisUtterance;
		if (t === void 0 || n === void 0 || this.text === "") return;
		this.stop();
		let r = new n(this.text);
		this.utterance = r;
		let i = this.closest("[lang]")?.getAttribute("lang")?.trim();
		if (i && (r.lang = i), r.rate = this.rate, r.pitch = this.pitch, r.volume = this.volume, this.voice.trim() !== "") {
			let e = await this.selectVoice(t);
			e !== null && (r.voice = e);
		}
		this.utterance === r && (this.linkedTypewriting?.beginSpeech(this), r.addEventListener("start", () => {
			this.utterance === r && (this.setState("speaking"), this.emit("tp-text-to-speech-start", { text: this.text }));
		}), r.addEventListener("boundary", (e) => {
			this.utterance !== r || this.dataset.state === "paused" || e.name === "sentence" || this.linkedTypewriting?.revealSpeech(this, e.charIndex);
		}), r.addEventListener("end", () => {
			this.utterance === r && (this.utterance === r && (this.utterance = null), this.linkedTypewriting?.endSpeech(this), this.setState("idle"), this.emit("tp-text-to-speech-end", { text: this.text }));
		}), r.addEventListener("error", (e) => {
			this.utterance === r && (this.utterance === r && (this.utterance = null), this.linkedTypewriting?.endSpeech(this), this.setState("idle"), this.reportError(e.error || "Speech synthesis failed."));
		}), this.utterance = r, this.setState("speaking"), t.speak(r));
	}
	pause() {
		let e = this.getSpeechGlobals().speechSynthesis;
		e?.speaking === !0 && (e.pause(), this.setState("paused"));
	}
	resume() {
		let e = this.getSpeechGlobals().speechSynthesis;
		e?.paused === !0 && (e.resume(), this.setState("speaking"));
	}
	stop() {
		this.utterance = null, this.getSpeechGlobals().speechSynthesis?.cancel(), this.linkedTypewriting?.endSpeech(this), this.isConnected && this.setState("idle");
	}
	async getText() {
		return this.resolveTarget() ? this.readLinkedText() : (await this.source.read({ cache: "no-store" })).trim();
	}
	async updateText() {
		this.utterance && this.stop();
		let e = ++this.updateToken;
		try {
			let t = await this.getText();
			if (e !== this.updateToken) return;
			this.text = t, this.render(), this.autoplay && this.speak();
		} catch (t) {
			if (e !== this.updateToken) return;
			this.text = "", this.render(), this.reportError(t instanceof Error ? t.message : String(t));
		}
	}
	render() {
		this.source.capture();
		let e = this.getSpeechGlobals(), t = e.speechSynthesis !== void 0 && e.SpeechSynthesisUtterance !== void 0;
		this.innerHTML = `
      <p data-tp-speech-ui class="tp-text-to-speech-text" data-role="text"${this.showText ? "" : " hidden"}></p>
      ${this.lite ? "\n      <tp-icon-button data-tp-speech-ui data-action=\"toggle-speech\" name=\"speakerphone\" library=\"tp\" label=\"Speak\"></tp-icon-button>\n      <span data-tp-speech-ui class=\"tp-visually-hidden\" data-role=\"status\" role=\"status\" aria-live=\"polite\"></span>" : `
      <tp-button-group data-tp-speech-ui class="tp-text-to-speech-controls tp-speech-controls" role="group" aria-label="Text-to-speech controls">
        <tp-icon-button id="${this.settingsId}" name="settings" library="tp" label="Speech voice settings" aria-haspopup="menu" aria-expanded="false" aria-controls="${this.settingsId}-menu"></tp-icon-button>
        <tp-button size="s" data-action="speak">Speak</tp-button>
        <tp-button size="s" data-action="pause">Pause</tp-button>
        <tp-button size="s" data-action="resume">Resume</tp-button>
        <tp-button size="s" data-action="stop">Stop</tp-button>
        <span data-tp-speech-ui class="tp-text-to-speech-status tp-speech-status" data-role="status" role="status" aria-live="polite"></span>
      </tp-button-group>
      <tp-dropdown data-tp-speech-ui id="${this.settingsId}-menu" anchor="#${this.settingsId}" outside-click><ul aria-label="Speech voice"></ul></tp-dropdown>`}`;
		let n = this.querySelector("[data-role=\"text\"]");
		n !== null && (n.textContent = this.text);
		let r = this.querySelector("[data-action=\"toggle-speech\"]");
		r?.toggleAttribute("disabled", !t || this.text === ""), r?.addEventListener("click", () => {
			!t || this.text === "" || (this.utterance ? this.stop() : this.speak());
		});
		let i = this.querySelector(`tp-icon-button[id="${this.settingsId}"]`), a = this.querySelector("tp-dropdown");
		i?.toggleAttribute("disabled", !t), i?.addEventListener("click", () => {
			t && a?.toggle();
		}), a?.addEventListener("tp-dropdown-toggle", () => {
			i?.setAttribute("aria-expanded", String(a.open));
		}), this.refreshVoiceMenu();
		for (let e of this.querySelectorAll("tp-button")) e.toggleAttribute("disabled", !t || this.text === "");
		for (let e of [
			"speak",
			"pause",
			"resume",
			"stop"
		]) this.querySelector(`[data-action="${e}"]`)?.addEventListener("click", () => {
			this[e]();
		});
		this.setState(this.utterance ? this.dataset.state === "paused" ? "paused" : "speaking" : "idle", t ? void 0 : "Speech synthesis is unavailable in this browser.");
	}
	refreshVoiceMenu() {
		let e = this.querySelector("tp-dropdown > ul");
		if (!e) return;
		let t = (this.closest("[lang]")?.getAttribute("lang")?.trim() || this.ownerDocument.defaultView?.navigator.language || "en").split("-")[0]?.toLowerCase(), n = [{
			name: "",
			label: "Automatic (browser default)"
		}, ...(this.getSpeechGlobals().speechSynthesis?.getVoices() ?? []).filter((e) => e.lang.split("-")[0]?.toLowerCase() === t).sort((e, t) => e.name.localeCompare(t.name) || e.lang.localeCompare(t.lang)).map((e) => ({
			name: e.name,
			label: `${e.name} (${e.lang})`
		}))].map((e) => {
			let t = this.ownerDocument.createElement("li");
			return t.textContent = e.label, t.dataset.voice = e.name, e.name.toLowerCase() === this.voice.trim().toLowerCase() && t.setAttribute("aria-current", "true"), t.addEventListener("click", () => {
				this.stop(), this.voice = e.name, this.querySelector("tp-dropdown")?.hide(), this.querySelector("tp-icon-button")?.querySelector("button")?.focus();
			}), t;
		});
		e.replaceChildren(...n);
	}
	setState(e, t) {
		this.dataset.state = e;
		let n = this.querySelector("[data-action=\"toggle-speech\"]");
		n?.setAttribute("name", e === "idle" ? "speakerphone" : "speakerphone-off"), n?.setAttribute("label", e === "idle" ? "Speak" : "Stop");
		let r = this.querySelector("[data-role=\"status\"]");
		r !== null && (r.textContent = t ?? {
			idle: "Ready.",
			speaking: "Speaking.",
			paused: "Paused."
		}[e]);
	}
	async selectVoice(e) {
		let t = await this.loadVoices(e), n = this.voice.trim().toLowerCase();
		return t.find((e) => e.name.toLowerCase() === n) ?? t.find((e) => e.lang.toLowerCase() === n) ?? null;
	}
	async loadVoices(e) {
		let t = e.getVoices();
		return t.length > 0 ? t : await new Promise((t) => {
			let n = () => {
				let r = e.getVoices();
				r.length !== 0 && (e.removeEventListener("voiceschanged", n), t(r));
			};
			e.addEventListener("voiceschanged", n);
		});
	}
	getSpeechGlobals() {
		return this.ownerDocument.defaultView ?? globalThis;
	}
	numberAttribute(e, t, n, r) {
		let i = this.getAttribute(e);
		if (i === null || i.trim() === "") return t;
		let a = Number(i);
		return Number.isFinite(a) && a >= n && a <= r ? a : t;
	}
	reportError(e) {
		this.setState("idle", `Error: ${e}`), this.emit("tp-text-to-speech-error", { error: e });
	}
	emit(e, t) {
		this.dispatchEvent(new CustomEvent(e, {
			bubbles: !0,
			detail: t
		}));
	}
};
customElements.get("tp-text-to-speech") || customElements.define("tp-text-to-speech", a);
//#endregion
export { a as t };

//# sourceMappingURL=text-to-speech.js.map