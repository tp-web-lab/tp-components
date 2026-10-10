import { Ku as e } from "./lib/typescript/typescript.js";
//#region src/components/timer/timer.css?inline
var t = "tp-timer{--tp-timer-alert:#b91c1c;--tp-timer-alert-bg:#fecaca;--tp-timer-muted:#9ca3af;--tp-timer-size:1rem;font-size:var(--tp-timer-size);border:1px solid #d1d5db;border-radius:.5em;align-items:center;gap:.5em;padding:.35em .5em;display:inline-flex}tp-timer[data-elapsed]{background-color:var(--tp-timer-alert-bg);border-color:var(--tp-timer-alert)}tp-timer>[data-tp-timer-duration]{border:1px solid #d1d5db;border-radius:.35em;inline-size:4.5em;padding:.2em .35em}tp-timer>[data-tp-timer-display]{font-variant-numeric:tabular-nums;min-inline-size:4.5ch;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:1em}tp-timer>[data-tp-timer-icon]{--tp-icon-size:1.125em;color:currentColor}tp-timer>tp-icon-button>button{border:1px solid #d1d5db}tp-timer[data-elapsed]>tp-icon-button>button{border-color:var(--tp-timer-alert)}tp-timer[data-elapsed]>[data-tp-timer-display]{color:var(--tp-timer-alert);font-weight:700}tp-timer[data-stopped]>[data-tp-timer-display]{color:var(--tp-timer-muted)}", n = class n extends e {
	static styleId = "tp-timer-styles";
	static ringCount = 3;
	static ringGapMs = 420;
	countdownTimer = null;
	ringTimeouts = [];
	endTimestampMs = null;
	remainingMs = 0;
	displayEl = null;
	durationInputEl = null;
	static get observedAttributes() {
		return [
			"duration",
			"size",
			"silent"
		];
	}
	get duration() {
		let e = this.getAttribute("duration") ?? "60", t = Number(e);
		return !Number.isFinite(t) || t <= 0 ? 60 : Math.round(t);
	}
	set duration(e) {
		this.setAttribute("duration", String(Math.max(1, Math.round(e))));
	}
	get size() {
		return this.getStringAttribute("size", "1rem");
	}
	set size(e) {
		this.setStringAttribute("size", e.trim() === "" ? "1rem" : e);
	}
	get silent() {
		return this.getBooleanAttribute("silent");
	}
	set silent(e) {
		this.setBooleanAttribute("silent", e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(n.styleId, t), this.ensureDom(), this.resetCountdown(), this.startCountdown();
	}
	attributeChangedCallback(e) {
		this.isConnected && (e === "silent" && this.silent && this.stopRinging(), e === "duration" && (this.resetCountdown(), this.hasAttribute("data-stopped") || this.startCountdown()), this.updateDisplay());
	}
	disconnectedCallback() {
		this.stopCountdown(), this.stopRinging();
	}
	ensureDom() {
		if (this.displayEl instanceof HTMLSpanElement && this.durationInputEl instanceof HTMLInputElement) return;
		let e = document.createElement("input");
		e.type = "number", e.min = "1", e.step = "1", e.setAttribute("data-tp-timer-duration", ""), e.setAttribute("aria-label", "Timer duration in seconds"), e.addEventListener("change", () => {
			let t = Number(e.value);
			if (!Number.isFinite(t) || t <= 0) {
				e.value = String(this.duration);
				return;
			}
			this.duration = Math.round(t);
		});
		let t = document.createElement("span");
		t.setAttribute("data-tp-timer-display", "");
		let n = document.createElement("tp-icon");
		n.setAttribute("name", "camera-timer"), n.setAttribute("data-tp-timer-icon", "");
		let r = document.createElement("tp-icon-button");
		r.setAttribute("name", "stop"), r.setAttribute("label", "Stop timer"), r.addEventListener("click", () => {
			this.stopAndReset();
		});
		let i = document.createElement("tp-icon-button");
		i.setAttribute("name", "play"), i.setAttribute("label", "Start timer"), i.addEventListener("click", () => {
			this.startFromBeginning();
		}), this.replaceChildren(n, e, t, i, r), this.durationInputEl = e, this.displayEl = t;
	}
	startCountdown() {
		this.stopCountdown(), this.removeAttribute("data-stopped"), this.endTimestampMs = Date.now() + this.remainingMs, this.countdownTimer = window.setInterval(() => {
			this.tickCountdown();
		}, 200);
	}
	stopCountdown() {
		this.countdownTimer !== null && (window.clearInterval(this.countdownTimer), this.countdownTimer = null);
	}
	tickCountdown() {
		if (this.endTimestampMs === null) return;
		let e = Math.max(0, this.endTimestampMs - Date.now());
		this.remainingMs = e, this.updateDisplay(), !(e > 0) && (this.stopCountdown(), this.setAttribute("data-elapsed", ""), this.dispatchEvent(new CustomEvent("tp-timer-elapsed", { bubbles: !0 })), this.startRinging());
	}
	resetCountdown() {
		this.stopRinging(), this.removeAttribute("data-elapsed"), this.remainingMs = this.duration * 1e3, this.endTimestampMs = null, this.updateDisplay();
	}
	stopAndReset() {
		this.stopCountdown(), this.resetCountdown(), this.setAttribute("data-stopped", "");
	}
	startFromBeginning() {
		this.resetCountdown(), this.startCountdown();
	}
	startRinging() {
		if (!this.silent) {
			this.stopRinging();
			for (let e = 0; e < n.ringCount; e += 1) {
				let t = window.setTimeout(() => {
					this.playBell();
				}, e * n.ringGapMs);
				this.ringTimeouts.push(t);
			}
		}
	}
	stopRinging() {
		if (this.ringTimeouts.length !== 0) {
			for (let e of this.ringTimeouts) window.clearTimeout(e);
			this.ringTimeouts = [];
		}
	}
	playBell() {
		let e = globalThis.AudioContext ?? globalThis.webkitAudioContext;
		if (!e) return;
		let t = new e(), n = t.createOscillator(), r = t.createGain();
		n.type = "triangle", n.frequency.value = 1020, n.connect(r), r.connect(t.destination);
		let i = t.currentTime;
		r.gain.setValueAtTime(.001, i), r.gain.linearRampToValueAtTime(.25, i + .02), r.gain.exponentialRampToValueAtTime(.001, i + .3), n.onended = () => {
			t.close();
		}, t.resume(), n.start(), n.stop(i + .3);
	}
	updateDisplay() {
		if (this.ensureDom(), !(this.displayEl instanceof HTMLSpanElement) || !(this.durationInputEl instanceof HTMLInputElement)) return;
		let e = Math.ceil(this.remainingMs / 1e3), t = Math.floor(e / 60), n = e % 60, r = `${String(t).padStart(2, "0")}:${String(n).padStart(2, "0")}`;
		this.displayEl.textContent = r, this.durationInputEl.value = String(this.duration), this.style.setProperty("--tp-timer-size", this.size);
	}
};
customElements.get("tp-timer") || customElements.define("tp-timer", n);
//#endregion
export { n as t };

//# sourceMappingURL=timer.js.map