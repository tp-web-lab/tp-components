/** Resolve numbers without mounting components or adding presentation nodes. */
export function theoremNumbers(root: ParentNode): Map<Element, string> {
	const result = new Map<Element, string>(),
		counters = new Map<string, number>();
	let section = 0,
		subsection = 0;
	for (const node of root.querySelectorAll("h1,h2,h3,tp-theorem")) {
		if (node.localName === "h1" || node.localName === "h2") {
			section++;
			subsection = 0;
			continue;
		}
		if (node.localName === "h3") {
			subsection++;
			continue;
		}
		const type = node.getAttribute("type") || "theorem";
		const mode =
			node.getAttribute("numbering") ||
			(type === "proof" ? "none" : "document");
		let number = node.getAttribute("number") || "";
		if (!node.hasAttribute("number") && mode !== "none") {
			const prefix =
				mode === "section"
					? `${section}.`
					: mode === "subsection"
						? `${section}.${subsection}.`
						: "";
			const key = `${node.getAttribute("counter") || type}/${mode}/${prefix}`;
			const count = (counters.get(key) || 0) + 1;
			counters.set(key, count);
			number = prefix + count;
		}
		result.set(node, number);
	}
	return result;
}

/** Remove generated light-DOM decorations, leaving authored theorem content intact. */
export function stripTheoremPresentation(root: ParentNode): void {
	for (const element of root.querySelectorAll(
		"tp-theorem > [data-tp-theorem-generated]",
	)) {
		for (const heading of element.querySelectorAll(':scope > [slot="heading"]'))
			element.before(heading);
		element.remove();
	}
}
