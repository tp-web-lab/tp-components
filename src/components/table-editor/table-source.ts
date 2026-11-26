/** Loads markup as an inert table; no component runtimes or source scripts execute. */
export async function loadTableSource(
	url: URL,
	signal: AbortSignal,
): Promise<HTMLTableElement> {
	const extension = url.pathname.split(".").pop()?.toLowerCase();
	if (
		![
			"html",
			"htm",
			"md",
			"markdown",
			"adoc",
			"asciidoc",
			"tex",
			"latex",
			"rst",
			"rest",
			"csv",
			"json",
			"xlsx",
		].includes(extension ?? "")
	)
		throw new Error(
			"Unsupported table file extension. Use html, md, adoc, tex, latex, rst, csv, json or xlsx.",
		);
	const response = await fetch(url.href, { signal });
	if (!response.ok)
		throw new Error(`Unable to load table (${response.status}).`);
	const source =
		extension === "xlsx" ? await response.arrayBuffer() : await response.text();
	signal.throwIfAborted();
	return parseTableSource(source, url, signal);
}

export async function parseTableSource(
	source: string | ArrayBuffer,
	url: URL,
	signal: AbortSignal,
): Promise<HTMLTableElement> {
	const extension = url.pathname.split(".").pop()?.toLowerCase();
	if (
		![
			"html",
			"htm",
			"md",
			"markdown",
			"adoc",
			"asciidoc",
			"tex",
			"latex",
			"rst",
			"rest",
			"csv",
			"json",
			"xlsx",
		].includes(extension ?? "")
	)
		throw new Error(
			"Unsupported table file extension. Use html, md, adoc, tex, latex, rst, csv, json or xlsx.",
		);
	if (["csv", "json", "xlsx"].includes(extension ?? "")) {
		const { spreadsheetTable } = await import("./table-source-spreadsheet.js");
		const table = await spreadsheetTable(source, extension ?? "");
		signal.throwIfAborted();
		return table;
	}
	if (typeof source !== "string")
		throw new Error("Markup files must contain text.");
	let html = source;
	switch (extension) {
		case "md":
		case "markdown": {
			const { renderMarkdownToHtml } = await import(
				"../../utilities/markdown-source.js"
			);
			html = await renderMarkdownToHtml(source, url.href);
			break;
		}
		case "adoc":
		case "asciidoc": {
			const { renderAsciidocToHtml } = await import("../asciidoc/asciidoc.js");
			html = await renderAsciidocToHtml(source, url);
			break;
		}
		case "rst":
		case "rest": {
			const { renderRestructuredTextToHtml } = await import(
				"../restructuredtext/restructuredtext.js"
			);
			html = await renderRestructuredTextToHtml(source);
			break;
		}
		case "tex":
		case "latex": {
			const { renderLatexToFragment } = await import("@tp/tp-latex");
			const holder = document.createElement("div");
			holder.append(renderLatexToFragment(source));
			html = holder.innerHTML;
			break;
		}
	}
	signal.throwIfAborted();
	const parsed = new DOMParser().parseFromString(html, "text/html");
	const tables = parsed.body.querySelectorAll("table");
	const table = tables[0];
	if (
		tables.length !== 1 ||
		!table?.rows.length ||
		!table.querySelector("td,th")
	)
		throw new Error("The file must contain exactly one nonempty table.");
	const figureCaption = table.closest("figure")?.querySelector("figcaption");
	if (figureCaption && !table.caption) {
		table.createCaption().textContent = figureCaption.textContent;
		figureCaption.remove();
	}
	// Captions and renderer wrappers are allowed; unrelated document content is not.
	const remainder = parsed.body.cloneNode(true) as HTMLElement;
	for (const node of remainder.querySelectorAll("table,style,link"))
		node.remove();
	if (
		remainder.textContent?.trim() ||
		remainder.querySelector("img,video,audio,iframe,script")
	)
		throw new Error("The file must contain only a table and its caption.");
	if (
		table.rows.length > 100 ||
		Array.from(table.rows).some(
			(row) =>
				Array.from(row.cells).reduce((n, cell) => n + cell.colSpan, 0) > 30,
		)
	)
		throw new Error("A table supports at most 100 rows and 30 columns.");
	for (const cell of table.querySelectorAll<HTMLTableCellElement>("td,th")) {
		const math = cell.querySelector("tp-math");
		if (!math || cell.querySelectorAll("tp-math").length !== 1) continue;
		const rest = cell.cloneNode(true) as HTMLElement;
		rest.querySelector("tp-math")?.remove();
		if (rest.textContent?.trim()) continue;
		const value =
			math.getAttribute("value") ??
			math.querySelector("script")?.textContent ??
			math.textContent ??
			"";
		cell.dataset.type = "math";
		cell.dataset.mathMode =
			math.getAttribute("mode") === "asciimath" ? "asciimath" : "latexmath";
		cell.textContent = value;
	}
	return table;
}
