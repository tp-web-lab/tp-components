/** Parses delimited text without interpreting cell contents as HTML. */
export function parseCsv(source: string, separator: string): string[][] {
	if (separator.length !== 1 || /["\r\n]/.test(separator))
		throw new Error(
			"separator must be one character other than a quote or line break.",
		);
	const text = source.replace(/^\uFEFF/, "");
	const rows: string[][] = [];
	let row: string[] = [];
	let field = "";
	let quoted = false;
	let closed = false;
	let active = false;
	for (let index = 0; index < text.length; index++) {
		const char = text[index];
		if (quoted) {
			if (char === '"') {
				if (text[index + 1] === '"') {
					field += '"';
					index++;
				} else {
					quoted = false;
					closed = true;
				}
			} else field += char;
			continue;
		}
		if (char === separator) {
			row.push(field);
			field = "";
			closed = false;
			active = true;
		} else if (char === "\r" || char === "\n") {
			if (active) rows.push([...row, field]);
			row = [];
			field = "";
			closed = false;
			active = false;
			if (char === "\r" && text[index + 1] === "\n") index++;
		} else if (closed) {
			if (char !== " " && char !== "\t")
				throw new Error("Unexpected text after a quoted CSV field.");
		} else if (char === '"') {
			if (field !== "")
				throw new Error("A quoted CSV field must start with a quote.");
			quoted = true;
			active = true;
		} else {
			field += char;
			active = true;
		}
	}
	if (quoted) throw new Error("Unclosed quoted CSV field.");
	if (active) rows.push([...row, field]);
	return rows;
}
