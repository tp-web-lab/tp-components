/** Formats keyboard prose while preserving code examples and existing key markup. */
export function formatHelpKeyboard(source: string): string {
	const named =
		"Arrow (?:Up|Down|Left|Right)|Mod|Ctrl|Control|Shift|AltGr|Alt|Meta|Command|Cmd|Option|Escape|Esc|Enter|Return|Tab|Space|Backspace|Delete|Insert|Home|End|PageUp|PageDown|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|F(?:1[0-2]|[1-9])";
	const token = `(?:${named}|[A-Za-z0-9?+−-])`;
	const chord = new RegExp(
		`\\b(?:${named})(?:\\+${token})+(?![A-Za-z0-9])`,
		"g",
	);
	const key = new RegExp(
		`\\b(?:${named}|Down|Up|Left|Right)(?:\\+${token})*(?![A-Za-z0-9])`,
		"g",
	);
	const wrap = (value: string) =>
		value
			.split(/\+(?!$)/)
			.map((k) => `<kbd>${k}</kbd>`)
			.join("+");
	let keyboard = false;
	let fence = "";
	return source
		.split("\n")
		.map((line) => {
			const marker = line.match(/^\s*(```|~~~)/)?.[1];
			if (marker) {
				fence = fence ? "" : marker;
				return line;
			}
			if (fence) return line;
			if (/^#{2,4} /.test(line)) keyboard = /^#### Keyboard/.test(line);
			if (keyboard)
				line = line.replace(/`([^`]+)`/g, (whole, value: string) =>
					new RegExp(`^${token}(?:[+ ]${token})*$`).test(value)
						? wrap(value.replace(/ /g, "+"))
						: whole,
				);

			// Protect inserted keys, author code and HTML attributes from subsequent passes.
			return line
				.split(/(<kbd\b[^>]*>[\s\S]*?<\/kbd>|`[^`]*`|<[^>]+>)/g)
				.map((part, index) => {
					if (index % 2) return part;
					if (keyboard) {
						part = part.replace(key, wrap);
						part = part.replace(
							/(^\|\s*|\/\s*)([A-Z0-9?])(?=\s*(?:[|/,]|on\b|to\b|$))/g,
							"$1<kbd>$2</kbd>",
						);
					}
					if (!keyboard) part = part.replace(chord, wrap);
					return part.replace(
						/\b(type|press) (\?)(?=[ .;])/g,
						"$1 <kbd>$2</kbd>",
					);
				})
				.join("");
		})
		.join("\n");
}
