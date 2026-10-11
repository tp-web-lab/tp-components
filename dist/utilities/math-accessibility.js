//#region src/utilities/math-accessibility.ts
function e(e) {
	for (let t of e.querySelectorAll("mjx-container > svg[role=\"img\"]")) {
		if (t.hasAttribute("aria-label") || t.hasAttribute("aria-labelledby")) continue;
		let e = t.parentElement?.closest("[aria-label]")?.getAttribute("aria-label") || t.querySelector("[data-semantic-speech]")?.getAttribute("data-semantic-speech") || t.querySelector("[data-mml-node=\"math\"][data-latex]")?.getAttribute("data-latex");
		e && t.setAttribute("aria-label", e);
	}
}
//#endregion
export { e as labelMathSvg };

//# sourceMappingURL=math-accessibility.js.map