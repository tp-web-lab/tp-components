import { dt as e } from "./lib/typescript/typescript.js";
//#region ../../../../../../@tp/tp-markdown/dist/markdown/extensions/crossword/index.js
var t = "tp-md-crossword-styles", n = "\n.tp-crossword {\n  box-sizing: border-box;\n  display: block;\n  font-family: system-ui, -apple-system, sans-serif;\n  max-width: 980px;\n  margin: 1rem 0;\n  padding: 1rem;\n  background: #f9f9fb;\n  border-radius: 8px;\n  border: 1px solid #e0e0e0;\n}\n\n.tp-crossword *,\n.tp-crossword *::before,\n.tp-crossword *::after {\n  box-sizing: border-box;\n}\n\n.tp-crossword-container {\n  display: grid;\n  gap: 1rem;\n}\n\n.tp-crossword-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n\n.tp-crossword-title {\n  font-size: 1.25rem;\n  font-weight: 700;\n}\n\n.tp-crossword-controls {\n  display: flex;\n  gap: 0.5rem;\n  flex-wrap: nowrap;\n  align-items: center;\n  max-width: 100%;\n  overflow-x: auto;\n}\n\n.tp-crossword-controls > * {\n  flex: 0 0 auto;\n}\n\n.tp-crossword button {\n  appearance: none;\n  height: 2.25rem;\n  padding: 0 0.9rem;\n  border: 0;\n  border-radius: 4px;\n  background: #0b63ce;\n  color: white;\n  cursor: pointer;\n  box-sizing: border-box;\n}\n\n.tp-crossword button:disabled {\n  background: #c3c7cf;\n  cursor: not-allowed;\n}\n\n.tp-crossword select {\n  width: auto;\n  min-width: 0;\n  max-width: none;\n  height: 2.25rem;\n  padding: 0 0.7rem;\n  border: 1px solid #c7d2e0;\n  border-radius: 4px;\n  background: white;\n  color: #223;\n  font: inherit;\n  box-sizing: border-box;\n}\n\n.tp-crossword-board-wrap {\n  overflow-x: auto;\n}\n\n.tp-crossword-table {\n  border-collapse: collapse;\n  margin: 0 auto;\n}\n\n.tp-crossword-corner,\n.tp-crossword-col-label,\n.tp-crossword-row-label {\n  padding: 0.25rem 0.4rem;\n  text-align: center;\n  font-size: 0.85rem;\n  color: #4a5568;\n  background: #eef2f8;\n}\n\n.tp-crossword-mode-toggle {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 1.8rem;\n  height: 1.8rem;\n  border: 1px solid #c7d2e0;\n  border-radius: 4px;\n  background: #fff;\n  color: #1f2d3d;\n  cursor: pointer;\n  font: 700 1rem/1 system-ui, -apple-system, sans-serif;\n  line-height: 1;\n  padding: 0;\n}\n\n.tp-crossword-mode-toggle:hover {\n  background: #f0f6ff;\n}\n\n.tp-crossword-cell {\n  width: 2rem;\n  height: 2rem;\n  min-width: 2rem;\n  min-height: 2rem;\n  padding: 0;\n  border: 1px solid #b9c3d2;\n  background: #fff;\n}\n\n.tp-crossword-cell.black {\n  background: #222;\n}\n\n.tp-crossword-cell.silent-black {\n  background: #fff;\n}\n\n.tp-crossword-cell.initial .tp-crossword-input {\n  background: #dbe7ff;\n  color: #1d4f91;\n  font-weight: 800;\n}\n\n.tp-crossword-cell.initial.current-word-primary .tp-crossword-input,\n.tp-crossword-cell.initial.current-word-secondary .tp-crossword-input {\n  background: #cfe0ff;\n}\n\n.tp-crossword-cell.incorrect .tp-crossword-input {\n  background: #ffebee;\n  color: #c62828;\n}\n\n.tp-crossword-cell.current-word-primary .tp-crossword-input {\n  background: #dbeafe;\n}\n\n.tp-crossword-cell.current-word-secondary .tp-crossword-input {\n  background: #eef4ff;\n}\n\n.tp-crossword-cell.current-cell {\n  box-shadow: inset 0 0 0 2px #0b63ce;\n}\n\n.tp-crossword-input {\n  width: 100%;\n  height: 100%;\n  border: none;\n  outline: none;\n  text-align: center;\n  text-transform: uppercase;\n  font: 700 1rem/1 system-ui, -apple-system, sans-serif;\n  color: #111;\n  background: transparent;\n  padding: 0;\n}\n\n.tp-crossword-input:focus {\n  outline: 2px solid #0b63ce;\n  outline-offset: -2px;\n}\n\n.tp-crossword-clues {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 1rem;\n}\n\n.tp-crossword-current-clues {\n  display: grid;\n  gap: 0.35rem;\n}\n\n.tp-crossword-current-clue {\n  padding: 0.4rem 0.55rem;\n  border-radius: 4px;\n}\n\n.tp-crossword-current-clue.primary {\n  background: #dbeafe;\n}\n\n.tp-crossword-current-clue.secondary {\n  background: #eef4ff;\n}\n\n.tp-crossword-clues h4 {\n  margin: 0 0 0.5rem;\n}\n\n.tp-crossword-clue-list {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n.tp-crossword-clue-list li {\n  display: flex;\n  gap: 0.45rem;\n  align-items: baseline;\n  margin: 0.2rem 0;\n  padding: 0.15rem 0.3rem;\n  border-radius: 4px;\n}\n\n.tp-crossword-clue-label {\n  min-width: 2.2rem;\n  font-weight: 700;\n  color: #23344d;\n}\n\n.tp-crossword-clue-part {\n  border-radius: 3px;\n  padding: 0.05rem 0.2rem;\n}\n\n.tp-crossword-clue-label.active-primary,\n.tp-crossword-clue-part.active-primary {\n  background: #dbeafe;\n}\n\n.tp-crossword-clue-label.active-secondary,\n.tp-crossword-clue-part.active-secondary {\n  background: #eef4ff;\n}\n\n.tp-crossword-status {\n  padding: 0.65rem;\n  border-radius: 4px;\n  text-align: center;\n  font-weight: 500;\n}\n\n.tp-crossword-status.success {\n  background: #d4edda;\n  color: #155724;\n}\n\n.tp-crossword-status.info {\n  background: #dbeafe;\n  color: #1e3a8a;\n}\n", r = "__tp_crossword_installed";
function i(e, t) {
	return e.attrs?.some(([e]) => e === t) ?? !1;
}
function a(e) {
	let t = e.trim();
	if (/^(?:[a-z]\.|[A-Z]\.|\d+\.)\s/m.test(t)) return t;
	let n = {
		solution: [],
		across: [],
		down: []
	}, r = null, i = null;
	for (let t of e.split("\n")) {
		let e = t.trim();
		if (e === "") continue;
		let a = /^(solution|across|down|horizontal|vertical)\s*:\s*(.*)$/i.exec(e);
		if (a) {
			let e = (a[1] ?? "").toLowerCase(), t = e === "horizontal" ? "across" : e === "vertical" ? "down" : e;
			i = t, r = null;
			let o = a[2]?.trim() ?? "";
			o !== "" && n[t].push(o);
			continue;
		}
		let o = /^(solution|across|down|horizontal|vertical)\s*$/i.exec(e);
		if (o) {
			let e = (o[1] ?? "").toLowerCase();
			r = e === "horizontal" ? "across" : e === "vertical" ? "down" : e, i = null;
			continue;
		}
		let s = /^:\s*(.*)$/.exec(e);
		if (s && r) {
			i = r, r = null;
			let e = s[1]?.trim() ?? "";
			e !== "" && n[i].push(e);
			continue;
		}
		let c = /^[-*+]\s+(.+)$/.exec(e);
		if (c && i) {
			n[i].push(c[1]?.trim() ?? "");
			continue;
		}
		throw Error("Crossword fenced blocks must use either compact row/clue syntax or solution/across/down definition lists");
	}
	if (n.solution.length === 0) throw Error("Crossword definition-list fences require a non-empty solution section");
	let a = [];
	return n.solution.forEach((e, t) => {
		a.push(`${String.fromCharCode(97 + t)}. ${e}`);
	}), n.across.forEach((e, t) => {
		a.push(`${String.fromCharCode(65 + t)}. ${e}`);
	}), n.down.forEach((e, t) => {
		a.push(`${t + 1}. ${e}`);
	}), a.join("\n");
}
function o(o) {
	if (o[r]) return;
	o[r] = !0, e(t, n);
	let s = o.renderer.rules.fence;
	o.renderer.rules.fence = function(e, t, n, r, o) {
		let c = e[t];
		return c ? (c.info || "").trim().startsWith("crossword") ? `<div class="tp-crossword" data-crossword-puzzle="${a(c.content).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")}" data-crossword-silent="${i(c, "silent") ? "true" : "false"}"></div>` : s ? s.call(this, e, t, n, r, o) : "" : "";
	};
}
//#endregion
export { o as crosswordExtension, o as default };

