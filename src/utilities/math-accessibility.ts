/** Gives MathJax SVGs a name when its runtime has not supplied one. */
export function labelMathSvg(root: ParentNode): void {
	for (const svg of root.querySelectorAll('mjx-container > svg[role="img"]')) {
		if (svg.hasAttribute("aria-label") || svg.hasAttribute("aria-labelledby"))
			continue;
		const label =
			svg.parentElement?.closest("[aria-label]")?.getAttribute("aria-label") ||
			svg
				.querySelector("[data-semantic-speech]")
				?.getAttribute("data-semantic-speech") ||
			svg
				.querySelector('[data-mml-node="math"][data-latex]')
				?.getAttribute("data-latex");
		if (label) svg.setAttribute("aria-label", label);
	}
}
