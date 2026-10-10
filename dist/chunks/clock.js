import { Zu as e } from "./lib/typescript/typescript.js";
//#region src/components/clock/clock.css?inline
var t = "tp-clock{--tp-clock-size:1rem;border:1px solid var(--tp-brand-stroke-soft,#d1d5db);font-size:var(--tp-clock-size);border-radius:.5em;align-items:center;gap:.5em;padding:.35em .5em;display:inline-flex}tp-clock>[data-tp-clock-time]{font-variant-numeric:tabular-nums;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:1em}tp-clock>[data-tp-clock-graphic]{block-size:1.6em;color:var(--tp-brand-text-on-soft,currentColor);inline-size:1.6em}tp-clock:not([type=analogic])>[data-tp-clock-graphic],tp-clock[type=analogic]>[data-tp-clock-time]{display:none}";
//#endregion
//#region src/components/clock/clock.ts
function n(e) {
	return e instanceof SVGElement && e.tagName.toLowerCase() === "line";
}
var r = class r extends e {
	static styleId = "tp-clock-styles";
	tickTimer = null;
	timeEl = null;
	tooltipEl = null;
	digitalAnchorId = "";
	analogicAnchorId = "";
	hourHandEl = null;
	minuteHandEl = null;
	secondHandEl = null;
	static get observedAttributes() {
		return ["type", "size"];
	}
	get type() {
		return this.getStringAttribute("type", "digital").toLowerCase() === "analogic" ? "analogic" : "digital";
	}
	set type(e) {
		this.setStringAttribute("type", e === "analogic" ? "analogic" : "digital");
	}
	get size() {
		return this.getStringAttribute("size", "1rem");
	}
	set size(e) {
		this.setStringAttribute("size", e.trim() === "" ? "1rem" : e);
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(r.styleId, t), this.ensureDom(), this.startTicker(), this.updateClock();
	}
	attributeChangedCallback() {
		this.isConnected && this.updateClock();
	}
	disconnectedCallback() {
		this.stopTicker();
	}
	ensureDom() {
		if (this.timeEl instanceof HTMLTimeElement && this.tooltipEl instanceof HTMLElement && n(this.hourHandEl) && n(this.minuteHandEl) && n(this.secondHandEl)) return;
		let e = `tp-clock-${Math.random().toString(36).slice(2, 10)}`;
		this.digitalAnchorId = `${e}-digital`, this.analogicAnchorId = `${e}-analogic`;
		let t = document.createElement("time");
		t.id = this.digitalAnchorId, t.setAttribute("data-tp-clock-time", "");
		let r = "http://www.w3.org/2000/svg", i = document.createElementNS(r, "svg");
		i.id = this.analogicAnchorId, i.setAttribute("data-tp-clock-graphic", ""), i.setAttribute("viewBox", "0 0 100 100"), i.setAttribute("aria-hidden", "true");
		let a = document.createElementNS(r, "circle");
		a.setAttribute("cx", "50"), a.setAttribute("cy", "50"), a.setAttribute("r", "48"), a.setAttribute("fill", "none"), a.setAttribute("stroke", "currentColor"), a.setAttribute("stroke-width", "4");
		let o = Array.from({ length: 12 }, (e, t) => {
			let n = (t * 30 - 90) * (Math.PI / 180), i = 50 + Math.cos(n) * 36, a = 50 + Math.sin(n) * 36, o = document.createElementNS(r, "text");
			return o.setAttribute("data-tp-clock-tick", ""), o.setAttribute("x", String(i)), o.setAttribute("y", String(a)), o.setAttribute("text-anchor", "middle"), o.setAttribute("dominant-baseline", "middle"), o.setAttribute("font-size", "8"), o.textContent = String(t), o;
		}), s = document.createElementNS(r, "line");
		s.setAttribute("x1", "50"), s.setAttribute("y1", "50"), s.setAttribute("x2", "50"), s.setAttribute("y2", "28"), s.setAttribute("stroke", "currentColor"), s.setAttribute("stroke-width", "4"), s.setAttribute("stroke-linecap", "round");
		let c = document.createElementNS(r, "line");
		c.setAttribute("x1", "50"), c.setAttribute("y1", "50"), c.setAttribute("x2", "50"), c.setAttribute("y2", "20"), c.setAttribute("stroke", "currentColor"), c.setAttribute("stroke-width", "3"), c.setAttribute("stroke-linecap", "round");
		let l = document.createElementNS(r, "line");
		l.setAttribute("x1", "50"), l.setAttribute("y1", "52"), l.setAttribute("x2", "50"), l.setAttribute("y2", "15"), l.setAttribute("stroke", "currentColor"), l.setAttribute("stroke-width", "2"), l.setAttribute("stroke-linecap", "round");
		let u = document.createElementNS(r, "circle");
		u.setAttribute("cx", "50"), u.setAttribute("cy", "50"), u.setAttribute("r", "3"), u.setAttribute("fill", "currentColor"), i.append(a, ...o, s, c, l, u);
		let d = document.createElement("tp-tooltip");
		d.setAttribute("anchor", `#${this.digitalAnchorId}`), d.setAttribute("placement", "bottom"), this.replaceChildren(t, i, d), this.timeEl = t, this.tooltipEl = d, this.hourHandEl = s, this.minuteHandEl = c, this.secondHandEl = l;
	}
	startTicker() {
		this.tickTimer === null && (this.tickTimer = window.setInterval(() => {
			this.updateClock();
		}, 1e3));
	}
	stopTicker() {
		this.tickTimer !== null && (window.clearInterval(this.tickTimer), this.tickTimer = null);
	}
	updateClock() {
		if (this.ensureDom(), !(this.timeEl instanceof HTMLTimeElement) || !(this.tooltipEl instanceof HTMLElement) || !n(this.hourHandEl) || !n(this.minuteHandEl) || !n(this.secondHandEl)) return;
		let e = /* @__PURE__ */ new Date(), t = `${String(e.getHours()).padStart(2, "0")}:${String(e.getMinutes()).padStart(2, "0")}:${String(e.getSeconds()).padStart(2, "0")}`, r = e.toLocaleDateString();
		this.timeEl.textContent = t, this.timeEl.dateTime = e.toISOString(), this.tooltipEl.textContent = r, this.style.setProperty("--tp-clock-size", this.size), this.setAttribute("data-type", this.type), this.tooltipEl.setAttribute("anchor", this.type === "analogic" ? `#${this.analogicAnchorId}` : `#${this.digitalAnchorId}`);
		let i = e.getHours() % 12 * 30 + e.getMinutes() * .5, a = e.getMinutes() * 6 + e.getSeconds() * .1, o = e.getSeconds() * 6;
		this.hourHandEl.setAttribute("transform", `rotate(${String(i)} 50 50)`), this.minuteHandEl.setAttribute("transform", `rotate(${String(a)} 50 50)`), this.secondHandEl.setAttribute("transform", `rotate(${String(o)} 50 50)`);
	}
};
customElements.get("tp-clock") || customElements.define("tp-clock", r);
//#endregion
export { r as t };

//# sourceMappingURL=clock.js.map