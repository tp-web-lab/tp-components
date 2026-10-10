import { Zu as e } from "./lib/typescript/typescript.js";
import "./chronometer.js";
//#region src/components/mastermind/mastermind.css?inline
var t = ".tp-mastermind{--tp-game-cell-size:3rem;box-sizing:border-box;background:#f9f9f9;border:1px solid #e0e0e0;border-radius:8px;max-width:600px;margin:1rem 0;padding:1rem;font-family:system-ui,-apple-system,sans-serif;display:flow-root}.tp-mastermind *,.tp-mastermind :before,.tp-mastermind :after{box-sizing:border-box}.tp-mastermind-container{gap:1rem;display:grid}.tp-mastermind-header,.tp-mastermind-controls,.tp-mastermind-header-actions,.tp-mastermind-palette,.tp-mastermind-pegs,.tp-mastermind-feedback{align-items:center;display:flex}.tp-mastermind-header{flex-wrap:wrap;justify-content:space-between;gap:.5rem}.tp-mastermind-title{color:#333;font-size:1.25rem;font-weight:700}.tp-mastermind-controls,.tp-mastermind-header-actions,.tp-mastermind-palette,.tp-mastermind-pegs,.tp-mastermind-feedback{gap:.5rem}.tp-mastermind-header-actions{flex-wrap:wrap;justify-content:flex-end}.tp-mastermind-chronometer>tp-icon-button{display:none}.tp-mastermind button{font:inherit}.tp-mastermind-check{color:#fff;cursor:pointer;background:#0b63ce;border:0;border-radius:4px;min-height:2.25rem;padding:0 .9rem}.tp-mastermind button:disabled{cursor:not-allowed;opacity:.55}.tp-mastermind-board{gap:.4rem;max-width:100%;display:grid;overflow-x:auto}.tp-mastermind-row{border-radius:6px;grid-template-columns:2rem max-content minmax(5rem,1fr) auto;align-items:center;gap:.6rem;width:max-content;min-width:100%;padding:.35rem;display:grid}.tp-mastermind-row.current{background:#e6f0ff}.tp-mastermind-attempt{color:#526071;text-align:center;font-weight:700}.tp-mastermind-peg,.tp-mastermind-color{width:var(--tp-game-cell-size);height:var(--tp-game-cell-size);flex:0 0 var(--tp-game-cell-size);background:#fff;border:3px solid #cbd5e1;border-radius:50%;padding:0}.tp-mastermind-peg.filled,.tp-mastermind-color{background:var(--tp-brand-fill-mid,var(--tp-brand-seed))}.tp-mastermind-peg:not(:disabled),.tp-mastermind-color{cursor:pointer}.tp-mastermind-color.selected{outline-offset:2px;outline:3px solid #111827}.tp-mastermind-feedback{min-width:5rem;font-weight:800}.tp-mastermind-feedback-exact{color:#111827}.tp-mastermind-feedback-misplaced{color:#64748b}.tp-mastermind-check{min-width:4.5rem}.tp-mastermind-row-action{justify-content:flex-end;min-width:4.5rem;display:flex}.tp-mastermind-status{color:#0c5460;text-align:center;background:#d1ecf1;border-radius:4px;min-height:1.5rem;padding:.75rem;font-weight:600}.tp-mastermind-status.won{color:#155724;background:#d4edda}.tp-mastermind-status.lost,.tp-mastermind-error{color:#721c24;background:#f8d7da}.tp-mastermind-error{border:1px solid #f5c6cb;border-radius:4px;padding:1rem;font-weight:600}", n = 0, r = [
	"red",
	"blue",
	"green",
	"yellow",
	"orange",
	"purple",
	"pink",
	"cyan"
], i = class i extends e {
	static styleId = "tp-mastermind-styles";
	solution = [];
	colors = [];
	maxAttempts = 10;
	guesses = [];
	feedback = [];
	currentAttempt = 0;
	outcome = "playing";
	selectedColor = "red";
	history = [];
	historyIndex = 0;
	chronometerStarted = !1;
	assistTriggerId = `tp-mastermind-assist-${++n}`;
	connectedCallback() {
		super.connectedCallback(), this.ensureGlobalStyle(i.styleId, t), this.classList.add("tp-mastermind");
		try {
			this.readConfiguration(), this.resetState(), this.render();
		} catch (e) {
			this.renderError(e instanceof Error ? e.message : String(e));
		}
	}
	readConfiguration() {
		if (this.colors = [...new Set(this.parseColors(this.getAttribute("colors") ?? "red blue green yellow orange purple", "colors"))], this.colors.length < 2) throw Error("Mastermind requires at least two available colors");
		if (this.solution = this.parseColors(this.getAttribute("solution") ?? "", "solution"), this.solution.length < 2 || this.solution.length > 8) throw Error("Mastermind solution must contain between 2 and 8 colors");
		if (this.solution.some((e) => !this.colors.includes(e))) throw Error("Every solution color must be included in the available colors");
		let e = Number.parseInt(this.getAttribute("attempts") ?? "10", 10);
		if (!Number.isInteger(e) || e < 1 || e > 20) throw Error("Mastermind attempts must be an integer between 1 and 20");
		this.maxAttempts = e, this.selectedColor = this.colors[0] ?? "red";
	}
	parseColors(e, t) {
		let n = e.toLowerCase().split(/[\s,]+/).filter((e) => e !== "");
		if (n.length === 0) throw Error(`Mastermind ${t} cannot be empty`);
		for (let e of n) if (!r.includes(e)) throw Error(`Unknown Mastermind color: ${e}`);
		return n;
	}
	resetState() {
		this.guesses = Array.from({ length: this.maxAttempts }, () => Array.from({ length: this.solution.length }, () => null)), this.feedback = Array.from({ length: this.maxAttempts }, () => null), this.currentAttempt = 0, this.outcome = "playing", this.history = [this.createSnapshot()], this.historyIndex = 0;
	}
	createSnapshot() {
		return {
			guesses: this.guesses.map((e) => [...e]),
			feedback: this.feedback.map((e) => e ? { ...e } : null),
			currentAttempt: this.currentAttempt,
			outcome: this.outcome,
			selectedColor: this.selectedColor
		};
	}
	restoreSnapshot(e) {
		this.guesses = e.guesses.map((e) => [...e]), this.feedback = e.feedback.map((e) => e ? { ...e } : null), this.currentAttempt = e.currentAttempt, this.outcome = e.outcome, this.selectedColor = e.selectedColor, this.render();
	}
	pushHistory() {
		this.history = this.history.slice(0, this.historyIndex + 1), this.history.push(this.createSnapshot()), this.historyIndex = this.history.length - 1;
	}
	render() {
		let e = this.guesses.map((e, t) => this.renderRow(e, t)).join(""), t = this.colors.map((e) => `
      <button
        class="tp-mastermind-color tp-${e}${e === this.selectedColor ? " selected" : ""}"
        type="button"
        data-color="${e}"
        aria-label="Select ${e}"
        aria-pressed="${e === this.selectedColor}"
      ></button>
    `).join("");
		this.querySelector(".tp-mastermind-container") || (this.innerHTML = `
      <div class="tp-mastermind-container">
        <div class="tp-mastermind-header">
          <div class="tp-mastermind-title">Mastermind</div>
          <div class="tp-mastermind-header-actions">
            <tp-icon-button class="tp-mastermind-new-game" name="refresh" label="Reset with another code"></tp-icon-button>
            <tp-chronometer class="tp-mastermind-chronometer"></tp-chronometer>
            <div class="tp-mastermind-controls"></div>
            <tp-icon-button id="${this.assistTriggerId}" class="tp-mastermind-assist-trigger" name="help" label="Mastermind assistance"></tp-icon-button>
            <tp-dropdown class="tp-mastermind-assist" anchor="#${this.assistTriggerId}" placement="bottom" outside-click>
              <ul>
                <li data-assist="reset-game">Reset the game</li>
                <li data-assist="show-peg">Show next peg</li>
                <li data-assist="show-solution">Show the solution</li>
              </ul>
            </tp-dropdown>
          </div>
        </div>
        <div class="tp-mastermind-palette" role="group" aria-label="Available colors"></div>
        <div class="tp-mastermind-board" role="group" aria-label="Mastermind board"></div>
        <div class="tp-mastermind-status" role="status"></div>
      </div>
    `, this.querySelector(".tp-mastermind-new-game")?.addEventListener("click", () => this.resetWithNewCode()), this.querySelector(".tp-mastermind-assist-trigger")?.addEventListener("click", () => {
			this.querySelector(".tp-mastermind-assist")?.toggle();
		}), this.querySelector(".tp-mastermind-assist")?.addEventListener("click", (e) => {
			let t = e.target.closest("[data-assist]");
			t && (this.applyAssist(t.dataset.assist ?? ""), this.querySelector(".tp-mastermind-assist")?.hide());
		}));
		let n = this.querySelector(".tp-mastermind-controls");
		n && (n.innerHTML = `
        <tp-icon-button class="tp-mastermind-undo" name="undo" label="Undo" ${this.historyIndex === 0 ? "disabled" : ""}></tp-icon-button>
        <tp-icon-button class="tp-mastermind-redo" name="redo" label="Redo" ${this.historyIndex >= this.history.length - 1 ? "disabled" : ""}></tp-icon-button>
      `);
		let r = this.querySelector(".tp-mastermind-palette");
		r && (r.innerHTML = t);
		let i = this.querySelector(".tp-mastermind-board");
		i && (i.innerHTML = e);
		let a = this.querySelector(".tp-mastermind-status");
		a && (a.className = `tp-mastermind-status ${this.outcome}`, a.textContent = this.statusText()), this.attachEventListeners();
	}
	renderRow(e, t) {
		let n = t === this.currentAttempt && this.outcome === "playing", r = e.map((e, r) => `
      <button
        class="tp-mastermind-peg${e ? ` filled tp-${e}` : ""}"
        type="button"
        data-row="${t}"
        data-col="${r}"
        ${n ? "" : "disabled"}
        aria-label="Attempt ${t + 1}, position ${r + 1}${e ? `: ${e}` : ""}"
      ></button>
    `).join(""), i = this.feedback[t], a = i ? `<span class="tp-mastermind-feedback-exact" title="Exact">● ${i.exact}</span><span class="tp-mastermind-feedback-misplaced" title="Misplaced">○ ${i.misplaced}</span>` : "<span aria-hidden=\"true\">—</span>", o = n ? "<button class=\"tp-mastermind-check\" type=\"button\">Play</button>" : "";
		return `
      <div class="tp-mastermind-row${n ? " current" : ""}">
        <span class="tp-mastermind-attempt">${t + 1}</span>
        <div class="tp-mastermind-pegs">${r}</div>
        <div class="tp-mastermind-feedback" role="group" aria-label="Feedback for attempt ${t + 1}">${a}</div>
        <div class="tp-mastermind-row-action">${o}</div>
      </div>
    `;
	}
	attachEventListeners() {
		this.querySelector(".tp-mastermind-undo")?.addEventListener("click", () => this.undo()), this.querySelector(".tp-mastermind-redo")?.addEventListener("click", () => this.redo()), this.querySelector(".tp-mastermind-check")?.addEventListener("click", () => this.checkGuess());
		for (let e of this.querySelectorAll(".tp-mastermind-color")) e.addEventListener("click", () => {
			let t = e.dataset.color;
			this.selectedColor = t;
			let n = this.guesses[this.currentAttempt]?.findIndex((e) => e === null) ?? -1;
			n >= 0 ? this.setPeg(n, t) : this.render();
		});
		for (let e of this.querySelectorAll(".tp-mastermind-peg")) e.addEventListener("click", () => {
			let t = Number.parseInt(e.dataset.row ?? "-1", 10), n = Number.parseInt(e.dataset.col ?? "-1", 10);
			t === this.currentAttempt && this.setPeg(n, this.selectedColor);
		});
	}
	setPeg(e, t) {
		let n = this.guesses[this.currentAttempt];
		!n || this.outcome !== "playing" || e < 0 || e >= n.length || (this.chronometerStarted ||= (this.querySelector(".tp-mastermind-chronometer")?.play(), !0), n[e] = t, this.pushHistory(), this.render());
	}
	checkGuess() {
		let e = this.guesses[this.currentAttempt];
		if (!e || e.some((e) => e === null)) {
			this.setStatusMessage("Complete the current guess first");
			return;
		}
		let t = this.scoreGuess(e);
		this.feedback[this.currentAttempt] = t, t.exact === this.solution.length ? this.outcome = "won" : this.currentAttempt >= this.maxAttempts - 1 ? this.outcome = "lost" : this.currentAttempt += 1, this.outcome !== "playing" && this.querySelector(".tp-mastermind-chronometer")?.pause(), this.pushHistory(), this.render();
	}
	scoreGuess(e) {
		let t = 0, n = [], r = [];
		for (let i = 0; i < this.solution.length; i += 1) if (e[i] === this.solution[i]) t += 1;
		else {
			let t = this.solution[i], a = e[i];
			t && n.push(t), a && r.push(a);
		}
		let i = 0;
		for (let e of r) {
			let t = n.indexOf(e);
			t >= 0 && (i += 1, n.splice(t, 1));
		}
		return {
			exact: t,
			misplaced: i
		};
	}
	undo() {
		if (this.historyIndex === 0) return;
		--this.historyIndex;
		let e = this.history[this.historyIndex];
		e && this.restoreSnapshot(e);
	}
	redo() {
		if (this.historyIndex >= this.history.length - 1) return;
		this.historyIndex += 1;
		let e = this.history[this.historyIndex];
		e && this.restoreSnapshot(e);
	}
	applyAssist(e) {
		if (e === "reset-game") {
			this.resetGame();
			return;
		}
		if (this.outcome === "playing") {
			if (e === "show-peg") {
				let e = this.guesses[this.currentAttempt], t = e?.findIndex((e) => e === null) ?? -1;
				e && t >= 0 && (e[t] = this.solution[t] ?? null);
			} else if (e === "show-solution") this.guesses[this.currentAttempt] = [...this.solution];
			else return;
			this.pushHistory(), this.render();
		}
	}
	resetGame() {
		this.querySelector(".tp-mastermind-chronometer")?.stop(), this.chronometerStarted = !1, this.resetState(), this.render();
	}
	resetWithNewCode() {
		let e = this.solution.join(" "), t;
		do
			t = Array.from({ length: this.solution.length }, () => this.colors[Math.floor(Math.random() * this.colors.length)]);
		while (t.join(" ") === e);
		this.solution = t, this.setAttribute("solution", t.join(" ")), this.resetGame();
	}
	statusText() {
		return this.outcome === "won" ? "✓ Code cracked!" : this.outcome === "lost" ? `No attempts left · Solution: ${this.solution.join(", ")}` : `Attempt ${this.currentAttempt + 1} of ${this.maxAttempts}`;
	}
	setStatusMessage(e) {
		let t = this.querySelector(".tp-mastermind-status");
		t && (t.textContent = e);
	}
	renderError(e) {
		this.innerHTML = `<div class="tp-mastermind-error">Error: ${e}</div>`;
	}
};
customElements.get("tp-mastermind") || customElements.define("tp-mastermind", i);
//#endregion
export { i as t };

//# sourceMappingURL=mastermind.js.map