import { a as e, i as t, n, r } from "./cryptarithm-ui.js";
//#region ../../../../../../@tp/tp-markdown/dist/markdown/renderers/cryptarithm.js
var i = class {
	onChange;
	puzzle = null;
	boardElement = null;
	assignments = {};
	history = [];
	historyIndex = 0;
	showingIncorrect = !1;
	activeLetter = null;
	constructor(e = {}) {
		this.onChange = e.onChange;
	}
	initialize(e, n) {
		this.puzzle = t(e, n), this.assignments = a(this.getInitialAssignments()), this.history = [a(this.assignments)], this.historyIndex = 0, this.showingIncorrect = !1, this.activeLetter = this.getFirstEditableLetter();
	}
	renderBoard(e) {
		this.boardElement = e, this.rerenderBoard(!1);
	}
	canUndo() {
		return this.historyIndex > 0;
	}
	canRedo() {
		return this.historyIndex < this.history.length - 1;
	}
	undo() {
		this.canUndo() && (--this.historyIndex, this.assignments = a(this.history[this.historyIndex]), this.rerenderBoard(!0), this.onChange?.());
	}
	redo() {
		this.canRedo() && (this.historyIndex += 1, this.assignments = a(this.history[this.historyIndex]), this.rerenderBoard(!0), this.onChange?.());
	}
	resetGame() {
		return this.puzzle ? (this.assignments = a(this.getInitialAssignments()), this.history = [a(this.assignments)], this.historyIndex = 0, this.showingIncorrect = !1, this.activeLetter = this.getFirstEditableLetter(), this.rerenderBoard(!1), this.onChange?.(), !0) : !1;
	}
	getActiveLetter() {
		return this.activeLetter;
	}
	setActiveLetter(e, t = !1) {
		this.activeLetter !== e && (this.activeLetter = e, this.showingIncorrect &&= !1, this.rerenderBoard(t), this.onChange?.());
	}
	setAssignment(e, t) {
		if (!this.puzzle || !this.puzzle.letters.includes(e) || this.puzzle.initialLetters.includes(e)) return !1;
		let n = t === "" ? "" : t.charAt(t.length - 1);
		if (n !== "" && !/^\d$/.test(n) || (this.assignments[e] ?? "") === n) return !1;
		let r = a(this.assignments);
		return n === "" ? delete r[e] : r[e] = n, this.assignments = r, this.pushHistory(r), this.rerenderBoard(!0), this.onChange?.(), !0;
	}
	showIncorrectAssignments() {
		return this.showingIncorrect = !0, this.rerenderBoard(!1), this.onChange?.(), this.countIncorrectLetters() > 0;
	}
	hideIncorrectAssignments() {
		return this.showingIncorrect ? (this.showingIncorrect = !1, this.rerenderBoard(!1), this.onChange?.(), !0) : !1;
	}
	isShowingIncorrectAssignments() {
		return this.showingIncorrect;
	}
	clearIncorrectAssignments() {
		let e = this.puzzle;
		if (!e) return !1;
		let t = a(this.assignments), n = !1;
		for (let r of e.letters) {
			let i = t[r];
			if (i !== void 0 && i !== e.solutionByLetter[r]) {
				if (e.initialLetters.includes(r)) continue;
				delete t[r], n = !0;
			}
		}
		return n ? (this.assignments = t, this.pushHistory(t), this.showingIncorrect = !1, this.rerenderBoard(!0), this.onChange?.(), !0) : !1;
	}
	showLetter(e = this.activeLetter) {
		let t = this.puzzle;
		if (!t) return !1;
		let n = e && t.letters.includes(e) && !t.initialLetters.includes(e) ? e : t.letters.find((e) => !t.initialLetters.includes(e) && this.assignments[e] !== t.solutionByLetter[e]) ?? null;
		return n ? this.setAssignment(n, t.solutionByLetter[n] ?? "") : !1;
	}
	showSolution() {
		let e = this.puzzle;
		if (!e) return !1;
		let t = {
			...a(this.getInitialAssignments()),
			...a(e.solutionByLetter)
		};
		return o(this.assignments, t, e.letters) ? !1 : (this.assignments = t, this.pushHistory(t), this.showingIncorrect = !1, this.rerenderBoard(!1), this.onChange?.(), !0);
	}
	countEmptyLetters() {
		let e = this.puzzle;
		return e ? e.letters.filter((t) => !e.initialLetters.includes(t) && (this.assignments[t] ?? "") === "").length : 0;
	}
	countIncorrectLetters() {
		let e = this.puzzle;
		return e ? e.letters.filter((t) => {
			let n = this.assignments[t];
			return !e.initialLetters.includes(t) && n !== void 0 && n !== "" && n !== e.solutionByLetter[t];
		}).length : 0;
	}
	getValidation() {
		let e = this.puzzle;
		if (!e) return {
			isComplete: !1,
			isSolved: !1,
			hasDuplicateDigits: !1,
			hasLeadingZero: !1,
			equationMatches: !1
		};
		let t = e.letters.map((e) => this.assignments[e] ?? "").filter((e) => e !== ""), n = new Set(t).size !== t.length, r = e.leadingLetters.some((e) => this.assignments[e] === "0"), i = e.letters.every((e) => (this.assignments[e] ?? "") !== ""), a = i && !r && e.addends.reduce((e, t) => e + BigInt(this.resolveTerm(t)), 0n) === BigInt(this.resolveTerm(e.result));
		return {
			isComplete: i,
			isSolved: i && !n && !r && a && e.letters.every((t) => this.assignments[t] === e.solutionByLetter[t]),
			hasDuplicateDigits: n,
			hasLeadingZero: r,
			equationMatches: a
		};
	}
	rerenderBoard(e) {
		let t = this.puzzle, n = this.boardElement;
		if (!t || !n) return;
		let r = Math.max(t.result.length, ...t.addends.map((e) => e.length)), i = t.addends.map((e, t) => this.renderEquationRow(e, r, t === 0 ? "" : "+")), a = this.renderEquationRow(t.result, r, "="), o = `${t.addends.map((e) => this.resolveTerm(e, "_")).join(" + ")} = ${this.resolveTerm(t.result, "_")}`, c = t.letters.map((e) => {
			let n = this.assignments[e] ?? "", r = ["tp-cryptarithm-assignment"];
			return this.activeLetter === e && r.push("current-letter"), t.initialLetters.includes(e) && r.push("initial"), this.showingIncorrect && n !== "" && n !== t.solutionByLetter[e] && r.push("incorrect"), `
          <label class="${r.join(" ")}">
            <span class="tp-cryptarithm-assignment-label">${e}</span>
            <input
              class="tp-cryptarithm-assignment-input"
              type="text"
              inputmode="numeric"
              maxlength="1"
              data-letter="${e}"
              value="${s(n)}"
              ${t.initialLetters.includes(e) ? "readonly" : ""}
              aria-label="Digit for ${e}"
            >
          </label>
        `;
		}).join("");
		n.innerHTML = `
      <div class="tp-cryptarithm-equation" style="--tp-cryptarithm-cols: ${r};">
        ${i.join("")}
        <div class="tp-cryptarithm-result-separator"></div>
        ${a}
      </div>
      <div class="tp-cryptarithm-preview">${s(o)}</div>
      <div class="tp-cryptarithm-assignments">${c}</div>
    `;
		for (let e of n.querySelectorAll(".tp-cryptarithm-assignment-input")) e.addEventListener("focus", () => {
			let t = e.dataset.letter ?? null;
			this.setActiveLetter(t, !0);
		}), e.addEventListener("click", () => {
			let t = e.dataset.letter ?? null;
			this.setActiveLetter(t, !0);
		}), e.addEventListener("input", () => {
			let n = e.dataset.letter ?? "";
			if (t.initialLetters.includes(n)) {
				e.value = this.assignments[n] ?? "";
				return;
			}
			let r = e.value.trim(), i = r === "" ? "" : r.charAt(r.length - 1);
			if (!/^\d?$/.test(i)) {
				e.value = "", this.setAssignment(n, "");
				return;
			}
			this.setAssignment(n, i);
		}), e.addEventListener("keydown", (n) => {
			let r = e.dataset.letter ?? "", i = t.letters.indexOf(r);
			if (n.key === "ArrowLeft" || n.key === "ArrowUp") {
				n.preventDefault();
				let e = t.letters.at((i - 1 + t.letters.length) % t.letters.length) ?? null;
				this.setActiveLetter(e, !0);
			} else if (n.key === "ArrowRight" || n.key === "ArrowDown") {
				n.preventDefault();
				let e = t.letters.at((i + 1) % t.letters.length) ?? null;
				this.setActiveLetter(e, !0);
			} else n.key === "Delete" && (n.preventDefault(), this.setAssignment(r, ""));
		});
		if (e && this.activeLetter) {
			let e = n.querySelector(`.tp-cryptarithm-assignment-input[data-letter="${this.activeLetter}"]`);
			e?.focus(), e && e.value !== "" && e.select();
		}
	}
	renderEquationRow(e, t, n) {
		let r = t - e.length, i = Array.from({ length: r }, () => "<div class=\"tp-cryptarithm-spacer\"></div>").join(""), a = e.split("").map((e) => {
			let t = this.assignments[e] ?? "", n = ["tp-cryptarithm-char"];
			return e === this.activeLetter && n.push("current-letter"), `
          <div class="${n.join(" ")}">
            <span class="tp-cryptarithm-char-symbol">${e}</span>
            <span class="tp-cryptarithm-char-digit">${s(t || " ")}</span>
          </div>
        `;
		}).join("");
		return `
      <div class="tp-cryptarithm-equation-row">
        <span class="tp-cryptarithm-operator">${s(n)}</span>
        ${i}
        ${a}
      </div>
    `;
	}
	resolveTerm(e, t = "") {
		return e.split("").map((e) => this.assignments[e] ?? t).join("");
	}
	pushHistory(e) {
		this.history = this.history.slice(0, this.historyIndex + 1), this.history.push(a(e)), this.historyIndex = this.history.length - 1;
	}
	getInitialAssignments() {
		let e = this.puzzle;
		if (!e) return {};
		let t = {};
		for (let n of e.initialLetters) {
			let r = e.solutionByLetter[n];
			r !== void 0 && (t[n] = r);
		}
		return t;
	}
	getFirstEditableLetter() {
		let e = this.puzzle;
		return e ? e.letters.find((t) => !e.initialLetters.includes(t)) ?? e.letters[0] ?? null : null;
	}
};
function a(e) {
	return { ...e ?? {} };
}
function o(e, t, n) {
	return n.every((n) => (e[n] ?? "") === (t[n] ?? ""));
}
function s(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
}
var c = {
	id: "cryptarithm",
	async render(e) {
		let t = e.querySelectorAll(".tp-cryptarithm[data-cryptarithm-equation][data-cryptarithm-solution]");
		for (let e of t) {
			if (!(e instanceof HTMLElement)) continue;
			let t = e.getAttribute("data-cryptarithm-equation"), n = e.getAttribute("data-cryptarithm-solution");
			if (!(!t || !n)) try {
				u(), e.innerHTML = r();
				let a = e.querySelector(".tp-cryptarithm-board"), o = e.querySelector(".tp-cryptarithm-status"), s = e.querySelector(".tp-cryptarithm-undo"), c = e.querySelector(".tp-cryptarithm-redo"), d = e.querySelector(".tp-cryptarithm-assist"), f = new i({ onChange: () => l(f, o, s, c) });
				f.initialize(t, n), f.renderBoard(a), s.addEventListener("click", () => {
					f.undo(), l(f, o, s, c);
				}), c.addEventListener("click", () => {
					f.redo(), l(f, o, s, c);
				}), d.addEventListener("change", () => {
					switch (d.value) {
						case "reset-game":
							f.resetGame();
							break;
						case "show-incorrect":
							f.showIncorrectAssignments();
							break;
						case "clear-incorrect":
							f.clearIncorrectAssignments();
							break;
						case "show-letter":
							f.showLetter();
							break;
						case "show-solution":
							f.showSolution();
							break;
						default: break;
					}
					d.value = "", l(f, o, s, c);
				});
				for (let e of [s, c]) e.addEventListener("mousedown", (e) => {
					e.preventDefault();
				});
				l(f, o, s, c);
			} catch (t) {
				console.error("Failed to initialize cryptarithm:", t), e.innerHTML = `<div class="tp-cryptarithm-error">Error: ${t instanceof Error ? t.message : String(t)}</div>`;
			}
		}
	}
};
function l(e, t, n, r) {
	let i = e.getValidation();
	if (n.disabled = !e.canUndo(), r.disabled = !e.canRedo(), t.className = "tp-cryptarithm-status", i.isSolved) {
		t.textContent = "✓ Solved!", t.classList.add("success");
		return;
	}
	let a = [], o = e.countEmptyLetters(), s = e.countIncorrectLetters();
	e.isShowingIncorrectAssignments() && s > 0 ? a.push(`${s} incorrect letter${s === 1 ? "" : "s"} shown`) : a.push(`${o} empty letter${o === 1 ? "" : "s"}`), i.hasDuplicateDigits && a.push("duplicate digits"), i.hasLeadingZero && a.push("leading digit cannot be 0"), i.isComplete && !i.equationMatches && a.push("equation mismatch"), t.textContent = a.join(" · "), t.classList.add("info");
}
function u() {
	if (document.getElementById("tp-md-cryptarithm-styles")) return;
	let t = document.createElement("style");
	t.id = e, t.textContent = n, document.head.appendChild(t);
}
//#endregion
export { c as default };

