/** Content and layout invariants for the newly supported package examples. */
export function packageConversionErrors(
	before: Element,
	after: Element,
	name: string,
): string[] {
	const errors: string[] = [];
	const equal = (a: unknown, b: unknown, label: string) => {
		if (JSON.stringify(a) !== JSON.stringify(b))
			errors.push(`${label}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`);
	};
	if (name === "arrayTabularx") {
		const cells = (root: Element) =>
			[...root.querySelectorAll<HTMLTableCellElement>("td,th")].map((cell) => ({
				text: [...cell.childNodes]
					.map((node) =>
						node instanceof Element && node.localName === "br"
							? " "
							: node.textContent,
					)
					.join("")
					.normalize("NFKC")
					.replace(/\u200b/g, "")
					.replace(/\s+/g, " ")
					.trim(),
				br: cell.querySelectorAll("br").length,
				rows: cell.rowSpan,
				columns: cell.colSpan,
				horizontal: cell.style.textAlign || "left",
				vertical: cell.style.verticalAlign || "top",
				borders: ["top", "bottom", "left", "right"].map((side) =>
					cell.style.getPropertyValue(`border-${side}`),
				),
			}));
		equal(cells(before), cells(after), "table cells");
		const widths = (root: Element) =>
			[...root.querySelectorAll("col")].map(
				(col) =>
					col.getAttribute("data-tp-column-width") ||
					(col as HTMLElement).style.width,
			);
		equal(widths(before), widths(after), "column widths");
		equal(
			before.querySelectorAll("strong").length,
			after.querySelectorAll("strong").length,
			"bold cells",
		);
	}
	if (name === "csquotes") {
		const text = (root: Element) => {
			const clone = root.cloneNode(true) as Element;
			for (const block of clone.querySelectorAll("p,blockquote,div")) {
				block.prepend(" ");
				block.append(" ");
			}
			return clone.textContent
				?.normalize("NFKC")
				.replace(/\u200b/g, "")
				.replace(/\s+/g, " ")
				.trim();
		};
		equal(text(before), text(after), "quotation text and punctuation");
		equal(
			[...before.querySelectorAll("blockquote strong")].map(text),
			[...after.querySelectorAll("blockquote strong")].map(text),
			"quotation emphasis",
		);
		equal(
			before.querySelectorAll("blockquote").length,
			after.querySelectorAll("blockquote").length,
			"block quotations",
		);
	}
	return errors;
}
