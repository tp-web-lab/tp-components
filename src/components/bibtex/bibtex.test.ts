import { renderLatexToFragment } from "@tp/tp-latex";
import { afterEach, expect, it, vi } from "vitest";
import { htmlToMarkup } from "../../utilities/markup-conversion.js";
import { bibtexToCode, parseBibtex } from "./bibtex-conversion.js";

vi.mock("../code-editor/code-editor.js", () => {
	class Editor extends HTMLElement {
		value = "";
	}
	if (!customElements.get("tp-code-editor"))
		customElements.define("tp-code-editor", Editor);
	return {};
});

import "./bibtex.js";

const source = String.raw`@book{knuth1984, author={Donald E. Knuth}, title={The \TeX book}, publisher={Addison-Wesley}, year=1984}`;
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
it("produces escaped tp-biblio source and standard LaTeX", () => {
	expect(bibtexToCode(source)).toContain(
		'<tp-biblio ref="knuth1984" title="The TeX book">',
	);
	expect(bibtexToCode(source)).toContain("<em>The TeX book</em>");
	expect(bibtexToCode(source, "latex")).toContain(
		String.raw`\emph{The \TeX book}`,
	);
	expect(bibtexToCode(source, "latex")).toContain(
		String.raw`\bibitem{knuth1984}`,
	);
	expect(
		bibtexToCode("@misc{x,title={<img src=x onerror=alert(1)>}}"),
	).toContain("&lt;img");
});
it("parses nested braces, quoted values, macros, concatenation and crossref", () => {
	const entries = parseBibtex(String.raw`% comment
 @string{press = "Example" # " Press"}
 @comment{ignored {nested}}
 @preamble{"ignored"}
 @book(parent, publisher=press, year=2026)
 @inbook{child, title="A {protected} title", author={Garc{\'i}a}, crossref={parent}}`);
	expect(entries[1]?.fields.publisher).toBe("Example Press");
	expect(entries[1]?.fields.year).toBe("2026");
	expect(
		bibtexToCode(String.raw`@book{x,author={Garc{\'i}a},title={Test}}`),
	).toContain("García");
});
it.each([
	"@book{x,title={Unclosed}",
	"@book{x,title=unknown}",
	"@book{x,title={A},title={B}}",
	"@book{x} @book{x}",
	"@book{x,crossref={missing}}",
	"@book{x,crossref={y}} @book{y,crossref={x}}",
])("rejects invalid BibTeX: %s", (input) =>
	expect(() => parseBibtex(input)).toThrow(),
);
it("renders in Light DOM and exposes updated code through getCode", async () => {
	const element = document.createElement("tp-bibtex");
	const script = document.createElement("script");
	script.type = "tp/bibtex";
	script.textContent = source;
	element.append(script);
	document.body.append(element);
	await element.refresh();
	expect(element.shadowRoot).toBeNull();
	expect(htmlToMarkup(element.outerHTML, "html")).not.toContain(
		"tp-code-editor",
	);
	expect(htmlToMarkup(element.outerHTML, "html")).toContain("tp/bibtex");
	expect(element.getCode()).toBe(bibtexToCode(source));
	expect(element.querySelector("tp-code-editor")?.value).toBe(
		element.getCode(),
	);
	element.out = "latex";
	await element.refresh();
	expect(element.getCode()).toContain("\\begin{thebibliography}");
	script.textContent = "@misc{new,title={Updated}}";
	await vi.waitFor(() => expect(element.getCode()).toContain("\\bibitem{new}"));
});
it("loads src before inline content and reports HTTP failures without stale output", async () => {
	const fetcher = vi
		.fn()
		.mockImplementation(() => Promise.resolve(new Response(source)));
	vi.stubGlobal("fetch", fetcher);
	const element = document.createElement("tp-bibtex");
	element.src = "/references.bib";
	document.body.append(element);
	await element.refresh();
	expect(element.getCode()).toContain("knuth1984");
	const error = vi.fn();
	element.addEventListener("tp-bibtex-error", error);
	fetcher.mockImplementation(() =>
		Promise.resolve(new Response("", { status: 404 })),
	);
	await element.refresh();
	expect(element.getCode()).toBe("");
	expect(error).toHaveBeenCalledOnce();
	expect(element.querySelector('[role="alert"]')?.textContent).toContain("404");
});
it("ignores a stale response after switching sources", async () => {
	let resolveFirst: (response: Response) => void = () => {};
	vi.stubGlobal(
		"fetch",
		vi
			.fn()
			.mockImplementationOnce(
				() =>
					new Promise<Response>((resolve) => {
						resolveFirst = resolve;
					}),
			)
			.mockResolvedValue(new Response("@book{second,title={Second}}")),
	);
	const element = document.createElement("tp-bibtex");
	element.src = "/first.bib";
	const first = element.refresh();
	element.src = "/second.bib";
	await element.refresh();
	resolveFirst(new Response(source));
	await first;
	expect(element.getCode()).toContain('ref="second"');
	expect(element.getCode()).not.toContain("knuth1984");
});

it("converts CSL-JSON input to each output without treating text as TeX or HTML", async () => {
	const source = JSON.stringify([
		{
			id: "lamport1994",
			type: "book",
			author: [{ given: "Leslie", family: "Lamport" }],
			title: "LaTeX & <Documents>",
			publisher: "Addison-Wesley",
			issued: { "date-parts": [[1994]] },
		},
	]);
	expect(bibtexToCode(source, "tp-biblio", "clsjson")).toContain(
		"LaTeX &amp; &lt;Documents&gt;",
	);
	expect(bibtexToCode(source, "latex", "clsjson")).toContain(
		String.raw`LaTeX \& <Documents>`,
	);
	const element = document.createElement("tp-bibtex");
	element.in = "clsjson";
	element.out = "latex";
	const script = document.createElement("script");
	script.type = "tp/clsjson";
	script.textContent = source;
	element.append(script);
	document.body.append(element);
	await element.refresh();
	expect(element.getCode()).toContain(String.raw`\bibitem{lamport1994}`);
	expect(element.getCode()).toContain("Leslie Lamport");
});
it("rejects malformed CSL-JSON records and duplicate identifiers", () => {
	for (const source of [
		"{bad",
		"[{}]",
		'[{"id":"x"},{"id":"x"}]',
		'[{"id":"x","author":"not an array"}]',
	])
		expect(() => bibtexToCode(source, "tp-biblio", "clsjson")).toThrow();
});

it.each(["bibtex", "clsjson"] as const)(
	"renders the generated %s bibliography through tp-latex",
	(input) => {
		const data =
			input === "bibtex"
				? source
				: JSON.stringify([
						{
							id: "knuth1984",
							type: "book",
							author: [{ literal: "Donald E. Knuth" }],
							title: "The TeX book",
							publisher: "Addison-Wesley",
							issued: { "date-parts": [[1984]] },
						},
					]);
		const code = bibtexToCode(data, "latex", input);
		const rendered = renderLatexToFragment(
			String.raw`See \cite{knuth1984}.` + code,
		);
		expect(rendered.querySelectorAll("dd")).toHaveLength(1);
		expect(rendered.querySelector("dd em")?.textContent).toMatch(/TeX.*book/);
		expect(rendered.textContent).toMatch(/Addison[-‐]Wesley/);
		expect(rendered.querySelector("a")?.textContent).toBe("1");
		expect(rendered.querySelector("section [style]")).toBeNull();
	},
);
