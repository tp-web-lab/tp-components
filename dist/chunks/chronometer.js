import { Zu as e } from "./lib/typescript/typescript.js";
//#region src/components/chronometer/chronometer.css?inline
var t = "tp-chronometer{--tp-chronometer-size:1rem;font-size:var(--tp-chronometer-size);border:1px solid #d1d5db;border-radius:.5em;align-items:center;gap:.4em;padding:.35em .5em;display:inline-flex}tp-chronometer>[data-tp-chronometer-display]{font-variant-numeric:tabular-nums;min-inline-size:8ch;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:1em}tp-chronometer>[data-tp-chronometer-icon]{--tp-icon-size:1.125em;color:currentColor}tp-chronometer>tp-icon-button>button{border:1px solid #d1d5db}", n = class n extends e {
	static styleId = "tp-chronometer-styles";
	tickTimer = null;
	startedAtMs = null;
	elapsedMs = 0;
	displayEl = null;
	static get observedAttributes() {
		return ["size"];
	}
	get size() {
		return this.getStringAttribute("size", "1rem");
	}
	set size(e) {
		this.setStringAttribute("size", e.trim() === "" ? "1rem" : e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(n.styleId, t), this.ensureDom(), this.updateDisplay();
	}
	attributeChangedCallback() {
		this.isConnected && this.updateDisplay();
	}
	disconnectedCallback() {
		this.stopTicking();
	}
	ensureDom() {
		if (this.displayEl instanceof HTMLSpanElement) return;
		let e = document.createElement("span");
		e.setAttribute("data-tp-chronometer-display", "");
		let t = document.createElement("tp-icon");
		t.setAttribute("name", "timer"), t.setAttribute("data-tp-chronometer-icon", "");
		let n = document.createElement("tp-icon-button");
		n.setAttribute("name", "play"), n.setAttribute("label", "Start chronometer"), n.addEventListener("click", () => {
			this.play();
		});
		let r = document.createElement("tp-icon-button");
		r.setAttribute("name", "pause"), r.setAttribute("label", "Pause chronometer"), r.addEventListener("click", () => {
			this.pause();
		});
		let i = document.createElement("tp-icon-button");
		i.setAttribute("name", "stop"), i.setAttribute("label", "Stop chronometer"), i.addEventListener("click", () => {
			this.stop();
		}), this.replaceChildren(t, e, n, r, i), this.displayEl = e;
	}
	play() {
		this.startedAtMs === null && (this.startedAtMs = Date.now() - this.elapsedMs, this.tickTimer = window.setInterval(() => {
			this.updateDisplay();
		}, 100));
	}
	pause() {
		this.startedAtMs !== null && (this.elapsedMs = Date.now() - this.startedAtMs, this.startedAtMs = null, this.stopTicking(), this.updateDisplay());
	}
	stop() {
		this.startedAtMs = null, this.elapsedMs = 0, this.stopTicking(), this.updateDisplay();
	}
	stopTicking() {
		this.tickTimer !== null && (window.clearInterval(this.tickTimer), this.tickTimer = null);
	}
	updateDisplay() {
		if (this.ensureDom(), !(this.displayEl instanceof HTMLSpanElement)) return;
		let e = this.startedAtMs === null ? this.elapsedMs : Date.now() - this.startedAtMs, t = Math.floor(e / 10), n = Math.floor(t / 6e3), r = Math.floor(t % 6e3 / 100), i = t % 100;
		this.displayEl.textContent = `${String(n).padStart(2, "0")}:${String(r).padStart(2, "0")}.${String(i).padStart(2, "0")}`, this.style.setProperty("--tp-chronometer-size", this.size);
	}
};
customElements.get("tp-chronometer") || customElements.define("tp-chronometer", n);
//#endregion
export { n as t };

//# sourceMappingURL=chronometer.js.map