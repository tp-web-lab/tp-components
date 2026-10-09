//#region ../../../../../../@tp/tp-markdown/dist/chunks/cryptarithm-ui.js
function e(e) {
	return e.trim().toUpperCase().replace(/\s+/g, " ").replace(/\s*\+\s*/g, " + ").replace(/\s*=\s*/g, " = ");
}
function t(e) {
	return e.trim().replace(/\s+/g, " ").replace(/\s*\+\s*/g, " + ").replace(/\s*=\s*/g, " = ");
}
function n(t) {
	let [n, r, i] = e(t).split("=").map((e) => e?.trim() ?? "");
	if (!n || !r || i !== void 0) throw Error("Cryptarithm equation must contain exactly one = sign");
	let a = n.split("+").map((e) => e.trim());
	if (a.length < 2 || a.some((e) => !/^[A-Z]+$/.test(e))) throw Error("Cryptarithm equation must be an addition of letter words");
	if (!/^[A-Z]+$/.test(r)) throw Error("Cryptarithm result must be a letter word");
	return {
		addends: a,
		result: r
	};
}
function r(e) {
	let t = "", n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e.charAt(r);
		if (!/\d/.test(i)) throw Error("Cryptarithm solution must be an addition of numbers");
		t += i, e.charAt(r + 1) === "!" && (n.push(t.length - 1), r += 1);
	}
	return {
		digits: t,
		initialIndexes: n
	};
}
function i(e) {
	let [n, i, a] = t(e).split("=").map((e) => e?.trim() ?? "");
	if (!n || !i || a !== void 0) throw Error("Cryptarithm solution must contain exactly one = sign");
	let o = n.split("+").map((e) => r(e.trim()));
	if (o.length < 2) throw Error("Cryptarithm solution must be an addition of numbers");
	return {
		addends: o,
		result: r(i)
	};
}
function a(e) {
	let t = e.split("\n").map((e) => e.trimEnd()).filter((e) => e.trim().length > 0), n = "", r = "", i = null;
	for (let e of t) {
		let t = e.trim(), a = /^(equation|solution)\s*:\s*(.+)$/i.exec(t);
		if (!a) {
			let e = /^(equation|solution)\s*$/i.exec(t), a = /^:\s*(.+)$/i.exec(t);
			if (e) {
				i = e[1]?.toLowerCase() ?? null;
				continue;
			}
			if (a && i) {
				let e = a[1]?.trim() ?? "";
				i === "equation" ? n = e : r = e, i = null;
				continue;
			}
			throw Error("Cryptarithm blocks must use either \"equation: ...\" / \"solution: ...\" lines or definition-list pairs");
		}
		let o = a[1]?.toLowerCase(), s = a[2]?.trim() ?? "";
		o === "equation" ? n = s : o === "solution" && (r = s), i = null;
	}
	if (n === "" || r === "") throw Error("Cryptarithm blocks require both equation and solution");
	return {
		equation: n,
		solution: r
	};
}
function o(r, a) {
	let o = n(r), s = i(a);
	if (o.addends.length !== s.addends.length) throw Error("Cryptarithm solution must have the same number of addends as the equation");
	let c = {}, l = /* @__PURE__ */ new Map(), u = [], d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set();
	for (let e = 0; e < o.addends.length; e++) {
		let t = o.addends[e] ?? "", n = s.addends[e];
		if (!n) throw Error("Cryptarithm solution must have the same number of addends as the equation");
		if (t.length !== n.digits.length) throw Error("Each solution addend must match the corresponding word length");
		for (let e = 0; e < t.length; e++) {
			let r = t.charAt(e), i = n.digits.charAt(e), a = c[r], o = l.get(i);
			if (a && a !== i) throw Error(`Letter ${r} maps to inconsistent digits`);
			if (o && o !== r) throw Error(`Digit ${i} is reused by both ${o} and ${r}`);
			c[r] = i, l.set(i, r), d.has(r) || (d.add(r), u.push(r)), n.initialIndexes.includes(e) && f.add(r);
		}
	}
	if (o.result.length !== s.result.digits.length) throw Error("The solution result must match the result word length");
	for (let e = 0; e < o.result.length; e++) {
		let t = o.result.charAt(e), n = s.result.digits.charAt(e), r = c[t], i = l.get(n);
		if (r && r !== n) throw Error(`Letter ${t} maps to inconsistent digits`);
		if (i && i !== t) throw Error(`Digit ${n} is reused by both ${i} and ${t}`);
		c[t] = n, l.set(n, t), d.has(t) || (d.add(t), u.push(t)), s.result.initialIndexes.includes(e) && f.add(t);
	}
	if (u.length > 10) throw Error("Cryptarithm puzzles can use at most 10 distinct letters");
	let p = [.../* @__PURE__ */ new Set([...o.addends.map((e) => e.charAt(0)), o.result.charAt(0)])];
	if (p.some((e) => c[e] === "0")) throw Error("Leading letters cannot map to 0");
	if (s.addends.reduce((e, t) => e + BigInt(t.digits), 0n) !== BigInt(s.result.digits)) throw Error("Cryptarithm solution does not satisfy the equation");
	return {
		equation: e(r),
		solution: t(a),
		addends: o.addends,
		result: o.result,
		solutionAddends: s.addends.map((e) => e.digits),
		solutionResult: s.result.digits,
		letters: u,
		leadingLetters: p,
		solutionByLetter: c,
		initialLetters: u.filter((e) => f.has(e))
	};
}
var s = "tp-md-cryptarithm-styles", c = "\n.tp-cryptarithm {\n  box-sizing: border-box;\n  display: block;\n  font-family: system-ui, -apple-system, sans-serif;\n  max-width: 760px;\n  margin: 1rem 0;\n  padding: 1rem;\n  background: #f9f9fb;\n  border-radius: 8px;\n  border: 1px solid #e0e0e0;\n}\n\n.tp-cryptarithm *,\n.tp-cryptarithm *::before,\n.tp-cryptarithm *::after {\n  box-sizing: border-box;\n}\n\n.tp-cryptarithm-container {\n  display: grid;\n  gap: 1rem;\n}\n\n.tp-cryptarithm-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 0.5rem;\n  flex-wrap: wrap;\n}\n\n.tp-cryptarithm-title {\n  font-size: 1.25rem;\n  font-weight: 700;\n  color: #223;\n}\n\n.tp-cryptarithm-controls {\n  display: flex;\n  gap: 0.5rem;\n  align-items: center;\n  flex-wrap: nowrap;\n  max-width: 100%;\n  overflow-x: auto;\n}\n\n.tp-cryptarithm-controls > * {\n  flex: 0 0 auto;\n}\n\n.tp-cryptarithm button {\n  appearance: none;\n  height: 2.25rem;\n  padding: 0 0.9rem;\n  background: #0b63ce;\n  color: white;\n  border: 0;\n  border-radius: 4px;\n  cursor: pointer;\n  font: inherit;\n}\n\n.tp-cryptarithm button:disabled {\n  background: #c3c7cf;\n  cursor: not-allowed;\n}\n\n.tp-cryptarithm select {\n  width: auto;\n  min-width: 0;\n  max-width: none;\n  height: 2.25rem;\n  padding: 0 0.7rem;\n  border: 1px solid #c7d2e0;\n  border-radius: 4px;\n  background: white;\n  color: #223;\n  font: inherit;\n}\n\n.tp-cryptarithm-board {\n  display: grid;\n  gap: 1rem;\n}\n\n.tp-cryptarithm-equation {\n  display: grid;\n  gap: 0.2rem;\n  justify-content: start;\n}\n\n.tp-cryptarithm-equation-row {\n  display: grid;\n  grid-template-columns: 1.5rem repeat(var(--tp-cryptarithm-cols), minmax(2.4rem, 1fr));\n  gap: 0.3rem;\n  align-items: stretch;\n}\n\n.tp-cryptarithm-operator {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font: 700 1.2rem/1 ui-monospace, SFMono-Regular, Menlo, monospace;\n  color: #334155;\n}\n\n.tp-cryptarithm-char,\n.tp-cryptarithm-spacer {\n  min-height: 3.2rem;\n}\n\n.tp-cryptarithm-char {\n  display: grid;\n  grid-template-rows: 1fr 1fr;\n  border: 1px solid #cbd5e1;\n  border-radius: 6px;\n  overflow: hidden;\n  background: white;\n}\n\n.tp-cryptarithm-char.current-letter {\n  box-shadow: inset 0 0 0 2px #0b63ce;\n}\n\n.tp-cryptarithm-char-symbol,\n.tp-cryptarithm-char-digit {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;\n}\n\n.tp-cryptarithm-char-symbol {\n  background: #eef4ff;\n  font-weight: 700;\n  color: #1e3a8a;\n}\n\n.tp-cryptarithm-char-digit {\n  color: #1f2937;\n  font-weight: 600;\n}\n\n.tp-cryptarithm-result-separator {\n  height: 0;\n  border-top: 2px solid #334155;\n  margin: 0.15rem 0 0.2rem 1.8rem;\n}\n\n.tp-cryptarithm-preview {\n  padding: 0.65rem 0.8rem;\n  border-radius: 6px;\n  background: #eef4ff;\n  color: #1e3a8a;\n  font: 600 1rem/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;\n}\n\n.tp-cryptarithm-assignments {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.65rem;\n  align-items: flex-start;\n}\n\n.tp-cryptarithm-assignment {\n  display: grid;\n  grid-template-rows: 1rem 2.4rem;\n  flex: 0 0 72px;\n  width: 72px;\n  gap: 0.35rem;\n  padding: 0.65rem;\n  border: 1px solid #d6deea;\n  border-radius: 6px;\n  background: white;\n  align-content: start;\n}\n\n.tp-cryptarithm-assignment.current-letter {\n  border-color: #0b63ce;\n  box-shadow: inset 0 0 0 1px #0b63ce;\n}\n\n.tp-cryptarithm-assignment.initial {\n  background: #dbe7ff;\n  border-color: #bfd3fb;\n}\n\n.tp-cryptarithm-assignment.incorrect {\n  background: #ffebee;\n  border-color: #f3b0b7;\n}\n\n.tp-cryptarithm-assignment-label {\n  font: 700 1rem/1 ui-monospace, SFMono-Regular, Menlo, monospace;\n  color: #1f2937;\n  text-align: center;\n}\n\n.tp-cryptarithm-assignment-input {\n  width: 100%;\n  height: 2.4rem;\n  border: 1px solid #cbd5e1;\n  border-radius: 4px;\n  outline: none;\n  text-align: center;\n  font: 700 1.1rem/1 ui-monospace, SFMono-Regular, Menlo, monospace;\n  color: #111827;\n}\n\n.tp-cryptarithm-assignment.initial .tp-cryptarithm-assignment-input {\n  background: #f4f8ff;\n  color: #1d4f91;\n  font-weight: 800;\n}\n\n.tp-cryptarithm-assignment-input:focus {\n  border-color: #0b63ce;\n  box-shadow: 0 0 0 2px rgba(11, 99, 206, 0.18);\n}\n\n.tp-cryptarithm-status {\n  padding: 0.75rem;\n  border-radius: 4px;\n  text-align: center;\n  font-weight: 500;\n  min-height: 1.5rem;\n}\n\n.tp-cryptarithm-status.success {\n  background: #d4edda;\n  color: #155724;\n}\n\n.tp-cryptarithm-status.info {\n  background: #dbeafe;\n  color: #1e3a8a;\n}\n\n.tp-cryptarithm-error {\n  padding: 1rem;\n  background: #f8d7da;\n  color: #721c24;\n  border: 1px solid #f5c6cb;\n  border-radius: 4px;\n}\n";
function l() {
	return "\n    <div class=\"tp-cryptarithm-container\">\n      <div class=\"tp-cryptarithm-header\">\n        <div class=\"tp-cryptarithm-title\">Cryptarithm</div>\n        <div class=\"tp-cryptarithm-controls\">\n          <button class=\"tp-cryptarithm-undo\" disabled>Undo</button>\n          <button class=\"tp-cryptarithm-redo\" disabled>Redo</button>\n          <select class=\"tp-cryptarithm-assist\">\n            <option value=\"\">Assist…</option>\n            <option value=\"reset-game\">Reset the game</option>\n            <option value=\"show-incorrect\">Show all incorrect letters</option>\n            <option value=\"clear-incorrect\">Clear the incorrect letters</option>\n            <option value=\"show-letter\">Show the letter</option>\n            <option value=\"show-solution\">Show the solution</option>\n          </select>\n        </div>\n      </div>\n\n      <div class=\"tp-cryptarithm-board\"></div>\n      <div class=\"tp-cryptarithm-status\"></div>\n    </div>\n  ";
}
//#endregion
export { s as a, o as i, c as n, l as r, a as t };

