import { type BibtexEntry, parseBibtex } from "@tp/tp-latex";

export { type BibtexEntry, parseBibtex } from "@tp/tp-latex";
export type BibtexInput = "bibtex" | "clsjson";
export type BibtexFormat = "tp-biblio" | "latex";

const escapeHtml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
/** Convert common TeX text commands without executing arbitrary LaTeX or HTML. */
export function bibtexText(value: string): string {
	const accents: Record<string, string> = {
		"'": "\u0301",
		"`": "\u0300",
		'"': "\u0308",
		"^": "\u0302",
		"~": "\u0303",
		"=": "\u0304",
		".": "\u0307",
		c: "\u0327",
		v: "\u030c",
		u: "\u0306",
		H: "\u030b",
	};
	return value
		.replace(
			/\\(["'`^~=.]|[cvuH])\s*\{?([a-zA-Z])\}?/g,
			(_m, a: string, c: string) => (c + (accents[a] ?? "")).normalize("NFC"),
		)
		.replace(/\\(?:TeX|LaTeX)\b/g, (m) => m.slice(1))
		.replace(
			/\\(?:emph|textit|textbf|textrm|textsuperscript)\s*\{([^{}]*)\}/g,
			"$1",
		)
		.replace(/\\([&%_$#{}])/g, "$1")
		.replace(/[{}]/g, "")
		.replace(/~/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}
const escapeLatex = (value: string) =>
	value.replace(
		/[\\{}%&#_$~^]/g,
		(c) =>
			({
				"\\": "\\textbackslash{}",
				"~": "\\textasciitilde{}",
				"^": "\\textasciicircum{}",
			})[c] ?? `\\${c}`,
	);

/** Produce readable bibliography source. No output is inserted or executed. */
export function bibtexToCode(
	source: string,
	format: BibtexFormat = "tp-biblio",
	input: BibtexInput = "bibtex",
): string {
	const entries =
		input === "clsjson" ? parseCslJson(source) : parseBibtex(source);
	if (!entries.length) return "";
	const blocks = entries.map(({ key, fields }) => {
		const parts: string[] = [];
		const used = new Set(["crossref"]);
		const add = (name: string, emphasis = false) => {
			const original = fields[name];
			const value =
				original === undefined
					? undefined
					: input === "clsjson" && format === "latex"
						? escapeLatex(original)
						: original;
			used.add(name);
			if (value)
				parts.push(
					format === "latex"
						? emphasis
							? `\\emph{${value}}`
							: value
						: emphasis
							? `<em>${escapeHtml(input === "clsjson" ? value : bibtexText(value))}</em>`
							: escapeHtml(input === "clsjson" ? value : bibtexText(value)),
				);
		};
		add("author");
		if (!fields.author) add("editor");
		add("title", true);
		add("booktitle", true);
		add("journal", true);
		for (const name of [
			"edition",
			"volume",
			"number",
			"pages",
			"publisher",
			"organization",
			"institution",
			"school",
			"address",
			"month",
			"year",
			"note",
			"doi",
			"url",
			"isbn",
			"issn",
		])
			add(name);
		for (const name of Object.keys(fields).sort())
			if (!used.has(name)) add(name);
		if (format === "latex")
			return `  \\bibitem{${key}}\n  ${parts.join(",\n  ")}.`;
		return `<tp-biblio ref="${escapeHtml(key)}" title="${escapeHtml(input === "clsjson" ? (fields.title ?? key) : bibtexText(fields.title ?? key))}">\n  <p>${parts.join(", ")}.</p>\n</tp-biblio>`;
	});
	return format === "latex"
		? `\\begin{thebibliography}{${"9".repeat(Math.max(2, String(entries.length).length))}}\n\n${blocks.join("\n\n")}\n\n\\end{thebibliography}`
		: blocks.join("\n\n");
}

/** Read CSL-JSON reference records. Plain text fields are escaped for the TeX output. */
export function parseCslJson(source: string): BibtexEntry[] {
	if (!source.trim()) return [];
	const data: unknown = JSON.parse(source);
	const records = Array.isArray(data) ? data : [data];
	const keys = new Set<string>();
	return records.map((raw: unknown) => {
		if (!raw || typeof raw !== "object" || Array.isArray(raw))
			throw new SyntaxError("Expected a CSL-JSON record.");
		const item = raw as Record<string, unknown>;
		const key = String(item.id ?? "");
		if (!/^[\w:./+-]+$/.test(key))
			throw new SyntaxError(
				"CSL-JSON requires an id usable as a bibliography key.",
			);
		if (keys.has(key)) throw new SyntaxError(`Duplicate key ${key}.`);
		keys.add(key);
		const fields: Record<string, string> = Object.create(null);
		const mapping: Record<string, string> = {
			title: "title",
			"container-title": "journal",
			publisher: "publisher",
			"publisher-place": "address",
			edition: "edition",
			volume: "volume",
			issue: "number",
			page: "pages",
			DOI: "doi",
			URL: "url",
			ISBN: "isbn",
			ISSN: "issn",
			note: "note",
		};
		for (const [from, to] of Object.entries(mapping)) {
			const value = item[from];
			if (value !== undefined) {
				if (typeof value !== "string" && typeof value !== "number")
					throw new SyntaxError(`Invalid CSL-JSON field ${from}.`);
				fields[to] = String(value);
			}
		}
		for (const role of ["author", "editor"]) {
			const names = item[role];
			if (names === undefined) continue;
			if (!Array.isArray(names))
				throw new SyntaxError(`Invalid CSL-JSON ${role}.`);
			fields[role] = names
				.map((name: unknown) => {
					if (!name || typeof name !== "object" || Array.isArray(name))
						throw new SyntaxError("Invalid CSL-JSON name.");
					const n = name as Record<string, unknown>;
					const parts = n.literal
						? [n.literal]
						: [
								n.given,
								n["dropping-particle"],
								n["non-dropping-particle"],
								n.family,
								n.suffix,
							];
					if (
						parts.some((part) => part !== undefined && typeof part !== "string")
					)
						throw new SyntaxError("Invalid CSL-JSON name text.");
					return parts.filter(Boolean).join(" ");
				})
				.join(" and ");
		}
		const issued = item.issued;
		if (issued && typeof issued === "object") {
			const date = issued as Record<string, unknown>;
			const parts = date["date-parts"];
			if (Array.isArray(parts) && Array.isArray(parts[0]))
				fields.year = parts[0].map(String).join("-");
			else if (typeof date.literal === "string") fields.year = date.literal;
		}
		return {
			key,
			type: typeof item.type === "string" ? item.type : "misc",
			fields,
		};
	});
}
