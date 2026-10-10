import { Ku as e } from "./lib/typescript/typescript.js";
//#region src/components/alarm/alarm.css?inline
var t = "tp-alarm{--tp-alarm-alert:#b91c1c;--tp-alarm-alert-bg:#fecaca;--tp-alarm-muted:#9ca3af;--tp-alarm-size:1rem;font-size:var(--tp-alarm-size);border:1px solid #d1d5db;border-radius:.5em;align-items:center;gap:.5em;padding:.35em .5em;display:inline-flex}tp-alarm[data-alert]{background-color:var(--tp-alarm-alert-bg);border-color:var(--tp-alarm-alert)}tp-alarm>[data-tp-alarm-time]{appearance:none;background:0 0;border:1px solid #d1d5db;border-radius:.35em;padding:.2em .35em}tp-alarm>[data-tp-alarm-time]::-webkit-calendar-picker-indicator{opacity:0;pointer-events:none;-webkit-appearance:none;display:none}tp-alarm>[data-tp-alarm-time]::-webkit-clear-button{display:none}tp-alarm>[data-tp-alarm-time]::-webkit-inner-spin-button{display:none}tp-alarm>[data-tp-alarm-time]::-webkit-datetime-edit-second-field{padding:0}tp-alarm>[data-tp-alarm-time]::-webkit-datetime-edit-minute-field{padding:0}tp-alarm>[data-tp-alarm-time]::-webkit-datetime-edit-hour-field{padding:0}tp-alarm>[data-tp-alarm-display]{font-variant-numeric:tabular-nums;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:1em}tp-alarm>[data-tp-alarm-icon]{--tp-icon-size:var(--tp-alarm-size);color:currentColor;font-size:var(--tp-alarm-size);block-size:var(--tp-alarm-size);inline-size:var(--tp-alarm-size);flex:none}tp-alarm>tp-icon-button{flex:none}tp-alarm>tp-icon-button>button{box-sizing:border-box;border:1px solid #d1d5db}tp-alarm[data-alert]>[data-tp-alarm-display]{color:var(--tp-alarm-alert);font-weight:700}tp-alarm[data-stopped]>[data-tp-alarm-display]{color:var(--tp-alarm-muted)}", n = class n extends e {
	static styleId = "tp-alarm-styles";
	static ringCount = 10;
	static ringGapMs = 420;
	checkTimer = null;
	ringTimeouts = [];
	displayEl = null;
	timeInputEl = null;
	alarmIconEl = null;
	lastTriggerKey = "";
	static get observedAttributes() {
		return [
			"time",
			"size",
			"silent"
		];
	}
	get time() {
		return this.getStringAttribute("time", "07:00");
	}
	set time(e) {
		this.setStringAttribute("time", e);
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
		super.connectedCallback(), this.ensureGlobalStyle(n.styleId, t), this.ensureDom(), this.startChecking(), this.updateDisplay();
	}
	attributeChangedCallback(e) {
		this.isConnected && (e === "silent" && this.silent && this.stopRinging(), e === "time" && (this.lastTriggerKey = ""), this.updateDisplay());
	}
	disconnectedCallback() {
		this.stopChecking(), this.stopRinging();
	}
	ensureDom() {
		if (this.displayEl instanceof HTMLSpanElement && this.timeInputEl instanceof HTMLInputElement && this.alarmIconEl instanceof HTMLElement) return;
		let e = document.createElement("input");
		e.type = "time", e.step = "1", e.setAttribute("data-tp-alarm-time", ""), e.setAttribute("aria-label", "Alarm time"), e.addEventListener("change", () => {
			let t = e.value.trim();
			t !== "" && (this.time = t.length === 5 ? `${t}:00` : t, this.clearAlert(!1), this.removeAttribute("data-stopped"), this.updateDisplay());
		});
		let t = document.createElement("span");
		t.setAttribute("data-tp-alarm-display", "");
		let n = document.createElement("tp-icon");
		n.setAttribute("name", "notifications"), n.setAttribute("data-tp-alarm-icon", ""), n.setAttribute("size", this.size);
		let r = document.createElement("tp-icon-button");
		r.setAttribute("name", "stop"), r.setAttribute("label", "Stop alarm"), r.addEventListener("click", () => {
			this.stopAlarm();
		});
		let i = document.createElement("tp-icon-button");
		i.setAttribute("name", "play"), i.setAttribute("label", "Start alarm"), i.addEventListener("click", () => {
			this.startAlarm();
		}), this.replaceChildren(n, e, t, i, r), this.alarmIconEl = n, this.timeInputEl = e, this.displayEl = t;
	}
	startChecking() {
		this.stopChecking(), this.checkTimer = window.setInterval(() => {
			this.checkAlarm();
		}, 250);
	}
	stopChecking() {
		this.checkTimer !== null && (window.clearInterval(this.checkTimer), this.checkTimer = null);
	}
	checkAlarm() {
		let e = this.parseAlarmTime(this.time);
		if (e === null) {
			this.setAttribute("data-invalid", "");
			return;
		}
		this.removeAttribute("data-invalid");
		let t = /* @__PURE__ */ new Date(), n = `${String(t.getFullYear())}-${String(t.getMonth())}-${String(t.getDate())}`;
		this.lastTriggerKey !== n && t.getHours() === e.hours && t.getMinutes() === e.minutes && t.getSeconds() === e.seconds && (this.lastTriggerKey = n, this.triggerAlarm());
	}
	triggerAlarm() {
		if (this.removeAttribute("data-stopped"), this.setAttribute("data-alert", ""), this.dispatchEvent(new CustomEvent("tp-alarm-trigger", { bubbles: !0 })), !this.silent) {
			this.stopRinging();
			for (let e = 0; e < n.ringCount; e += 1) {
				let t = window.setTimeout(() => {
					this.playBell();
				}, e * n.ringGapMs);
				this.ringTimeouts.push(t);
			}
		}
	}
	startAlarm() {
		this.removeAttribute("data-stopped"), this.startChecking();
	}
	stopAlarm() {
		this.stopChecking(), this.clearAlert();
	}
	clearAlert(e = !0) {
		this.removeAttribute("data-alert"), this.stopRinging(), e && this.setAttribute("data-stopped", "");
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
		n.type = "sine", n.frequency.value = 1240, n.connect(r), r.connect(t.destination);
		let i = t.currentTime;
		r.gain.setValueAtTime(.001, i), r.gain.linearRampToValueAtTime(.28, i + .02), r.gain.exponentialRampToValueAtTime(.001, i + .3), n.onended = () => {
			t.close();
		}, t.resume(), n.start(), n.stop(i + .3);
	}
	parseAlarmTime(e) {
		let t = e.trim().match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
		if (t === null) return null;
		let n = Number(t[1]), r = Number(t[2]), i = Number(t[3] ?? "00");
		return n < 0 || n > 23 || r < 0 || r > 59 || i < 0 || i > 59 ? null : {
			hours: n,
			minutes: r,
			seconds: i
		};
	}
	updateDisplay() {
		this.ensureDom(), !(!(this.displayEl instanceof HTMLSpanElement) || !(this.timeInputEl instanceof HTMLInputElement)) && (this.timeInputEl.value = this.time, this.displayEl.textContent = this.time, this.alarmIconEl?.setAttribute("size", this.size), this.style.setProperty("--tp-alarm-size", this.size));
	}
};
customElements.get("tp-alarm") || customElements.define("tp-alarm", n);
//#endregion
export { n as t };

//# sourceMappingURL=alarm.js.map