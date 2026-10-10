import { qu as e } from "./lib/typescript/typescript.js";
import "./chronometer.js";
//#region src/components/loto/loto.css?inline
var t = ".tp-loto{--tp-game-cell-size:3.25rem;box-sizing:border-box;background:#f9f9f9;border:1px solid #e0e0e0;border-radius:8px;width:auto;max-width:100%;margin:1rem 0;padding:1rem;font-family:system-ui,-apple-system,sans-serif;display:flow-root;overflow-x:auto}.tp-loto *,.tp-loto :before,.tp-loto :after{box-sizing:border-box}.tp-loto-header,.tp-loto-controls,.tp-loto-draw,.tp-loto-history{align-items:center;display:flex}.tp-loto-header{justify-content:space-between;gap:1rem;margin-block-end:1rem}.tp-loto-title{color:#333;font-size:1.25rem;font-weight:700}.tp-loto-controls{gap:.5rem}.tp-loto-chronometer>tp-icon-button{display:none}.tp-loto-tickets{gap:1rem;display:grid}.tp-loto-ticket{inline-size:calc(9 * var(--tp-game-cell-size));border-block-start:2px solid #334155;border-inline-start:2px solid #334155;max-inline-size:100%;display:block;overflow:auto}.tp-loto-ticket>[role=row]{grid-template-columns:repeat(9, var(--tp-game-cell-size));display:grid}.tp-loto-cell{width:var(--tp-game-cell-size);height:var(--tp-game-cell-size);color:#172033;background:#fff;border-block-end:2px solid #334155;border-inline-end:2px solid #334155;place-items:center;font-size:1.25rem;font-weight:700;display:grid}.tp-loto-cell.empty{background:#dbe3ec}.tp-loto-cell.drawn{background:var(--tp-green,#198754);color:#fff}.tp-loto-draw{gap:1rem;margin-block-start:1rem}.tp-loto-draw-button{color:#fff;min-height:2.5rem;font:inherit;cursor:pointer;background:#0b63ce;border:0;border-radius:4px;padding:0 1rem;font-weight:700}.tp-loto-draw-button:disabled{cursor:not-allowed;opacity:.55}.tp-loto-current{color:#172033;flex:0 0 3.5rem;place-items:center;width:3.5rem;height:3.5rem;font-weight:800;display:grid}.tp-loto-ball{flex:0 0 2.75rem;width:2.75rem;height:2.75rem;display:block}.tp-loto-history{width:calc(9 * var(--tp-game-cell-size));max-width:100%;margin:1rem 0 0;padding:0}.tp-loto-history>.tp-loto-ball{flex:0 0 2.75rem}.tp-loto-status{color:#0c5460;text-align:center;background:#d1ecf1;border-radius:4px;margin-block-start:1rem;padding:.6rem;font-weight:700}.tp-loto-status.completed{color:#155724;background:#d4edda}", n = class n extends e {
	static styleId = "tp-loto-styles";
	tickets = [];
	drawPile = [];
	drawnNumbers = [];
	chronometerStarted = !1;
	completed = !1;
	rendered = !1;
	static get observedAttributes() {
		return [...e.observedAttributes, "cards"];
	}
	get cards() {
		let e = Number.parseInt(this.getAttribute("cards") ?? "1", 10);
		return Number.isInteger(e) && e >= 1 && e <= 4 ? e : 1;
	}
	set cards(e) {
		let t = Math.min(4, Math.max(1, Math.trunc(e)));
		this.setAttribute("cards", String(t));
	}
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(n.styleId, t), this.classList.add("tp-loto"), this.rendered ||= (this.renderShell(), this.reset(), !0);
	}
	attributeChangedCallback(e, t, n) {
		e === "cards" && this.rendered && t !== n && this.reset();
	}
	reset() {
		let e = this.tickets.map((e) => e.flat().join(",")), t = /* @__PURE__ */ new Set();
		this.tickets = Array.from({ length: this.cards }, (n, r) => {
			let i, a;
			do
				i = this.createTicket(), a = i.flat().join(",");
			while (a === e[r] || t.has(a));
			return t.add(a), i;
		}), this.drawPile = this.shuffle(Array.from({ length: 90 }, (e, t) => t + 1)), this.drawnNumbers = [], this.chronometerStarted = !1, this.completed = !1, this.chronometer?.stop(), this.renderGame(), this.dispatchEvent(new CustomEvent("tp-loto-reset", { bubbles: !0 }));
	}
	draw() {
		if (this.completed) return null;
		let e = this.drawPile.pop();
		return e === void 0 ? null : (this.chronometerStarted ||= (this.chronometer?.play(), !0), this.drawnNumbers.push(e), this.completed = this.ticketNumbers.every((e) => this.drawnNumbers.includes(e)), this.completed && this.chronometer?.pause(), this.renderGame(), this.dispatchEvent(new CustomEvent("tp-loto-draw", {
			bubbles: !0,
			detail: { number: e }
		})), this.completed && this.dispatchEvent(new CustomEvent("tp-loto-win", { bubbles: !0 })), e);
	}
	get chronometer() {
		return this.querySelector(".tp-loto-chronometer");
	}
	get ticketNumbers() {
		return this.tickets.flat(2).filter((e) => e !== null);
	}
	renderShell() {
		this.innerHTML = "\n      <div class=\"tp-loto-header\">\n        <div class=\"tp-loto-title\">Loto</div>\n        <div class=\"tp-loto-controls\">\n          <tp-icon-button class=\"tp-loto-reset\" name=\"refresh\" label=\"New loto game\"></tp-icon-button>\n          <tp-chronometer class=\"tp-loto-chronometer\"></tp-chronometer>\n        </div>\n      </div>\n      <div class=\"tp-loto-tickets\"></div>\n      <div class=\"tp-loto-draw\">\n        <button class=\"tp-loto-draw-button\" type=\"button\">Draw a number</button>\n        <output class=\"tp-loto-current\" aria-live=\"polite\"></output>\n      </div>\n      <tp-switcher class=\"tp-loto-history\" role=\"list\" gap=\"0.4rem\" aria-label=\"Drawn numbers\"></tp-switcher>\n      <div class=\"tp-loto-status\" role=\"status\"></div>\n    ", this.querySelector(".tp-loto-reset")?.addEventListener("click", () => this.reset()), this.querySelector(".tp-loto-draw-button")?.addEventListener("click", () => this.draw());
	}
	renderGame() {
		let e = new Set(this.drawnNumbers), t = this.querySelector(".tp-loto-tickets");
		t && (t.innerHTML = this.tickets.map((t, n) => `
        <div class="tp-loto-ticket" role="grid" aria-label="Loto ticket ${n + 1}">
          ${t.map((t, n) => `
            <div role="row" aria-rowindex="${n + 1}">
              ${t.map((t, n) => `
                <div
                  class="tp-loto-cell${t === null ? " empty" : ""}${t !== null && e.has(t) ? " drawn" : ""}"
                  role="gridcell"
                  aria-colindex="${n + 1}"
                  ${t !== null && e.has(t) ? "aria-label=\"" + t + ", drawn\"" : ""}
                >${t ?? ""}</div>
              `).join("")}
            </div>
          `).join("")}
        </div>
      `).join(""));
		let n = this.querySelector(".tp-loto-current");
		if (n) {
			let e = this.drawnNumbers.at(-1);
			n.innerHTML = e === void 0 ? "—" : `<tp-icon name="${e}" library="numbers" size="3.5rem"></tp-icon>`;
		}
		let r = this.querySelector(".tp-loto-history");
		r && (r.innerHTML = this.drawnNumbers.map((e) => `
          <span class="tp-loto-ball" role="listitem" aria-label="${e}">
            <tp-icon name="${e}" library="numbers" size="2.75rem"></tp-icon>
          </span>
        `).join(""));
		let i = this.querySelector(".tp-loto-draw-button");
		i && (i.disabled = this.completed || this.drawPile.length === 0);
		let a = this.querySelector(".tp-loto-status");
		if (a) {
			let t = this.ticketNumbers.filter((t) => e.has(t)).length;
			a.textContent = this.completed ? "Loto completed" : `${t} / ${15 * this.cards} ticket numbers drawn`, a.classList.toggle("completed", this.completed);
		}
	}
	createTicket() {
		let e;
		do
			e = Array.from({ length: 3 }, () => {
				let e = this.shuffle(Array.from({ length: 9 }, (e, t) => t)).slice(0, 5);
				return Array.from({ length: 9 }, (t, n) => e.includes(n));
			});
		while (Array.from({ length: 9 }, (t, n) => e.some((e) => e[n])).some((e) => !e));
		let t = Array.from({ length: 3 }, () => Array(9).fill(null));
		for (let n = 0; n < 9; n += 1) {
			let r = [
				0,
				1,
				2
			].filter((t) => e[t]?.[n]), i = n === 0 ? 1 : n * 10, a = n === 8 ? 90 : n * 10 + 9, o = this.shuffle(Array.from({ length: a - i + 1 }, (e, t) => i + t)).slice(0, r.length).sort((e, t) => e - t);
			r.forEach((e, r) => {
				t[e] && (t[e][n] = o[r] ?? null);
			});
		}
		return t;
	}
	shuffle(e) {
		for (let t = e.length - 1; t > 0; --t) {
			let n = Math.floor(Math.random() * (t + 1));
			[e[t], e[n]] = [e[n], e[t]];
		}
		return e;
	}
};
customElements.get("tp-loto") || customElements.define("tp-loto", n);
//#endregion
export { n as t };

//# sourceMappingURL=loto.js.map