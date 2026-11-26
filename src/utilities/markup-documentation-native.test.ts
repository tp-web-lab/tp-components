import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import { dedent } from "./code.js";
import {
	htmlToMarkup,
	type MarkupLanguage,
	markupLanguageFromPath,
	markupToHtml,
} from "./markup-conversion.js";
import { unexpectedNativeFallbacks } from "./markup-native-policy.js";

const holder = document.createElement("template");
holder.innerHTML = readFileSync(
	"public/docs/components/markup-converter/examples/examples.html",
	"utf8",
);
const cases = [
	...(holder.content
		.querySelector("template")
		?.content.querySelectorAll("[role=example]") ?? []),
].map((example) => {
	const converter = example.querySelector("tp-markup-converter");
	const script = example.querySelector("script");
	const file = converter?.getAttribute("src");
	const javascript = !converter
		? script?.textContent?.match(/element2.textContent = (".*");/)
		: undefined;
	return {
		name: example.getAttribute("label") ?? "",
		base: new URL(file || "/examples.html", "http://localhost:4173/").href,
		language: file
			? markupLanguageFromPath(file)
			: javascript
				? ("markdown" as const)
				: ((script?.type.slice(3) ?? "html") as MarkupLanguage),
		source: file
			? readFileSync(`public${file}`, "utf8")
			: javascript
				? (JSON.parse(javascript[1] ?? '""') as string)
				: dedent(script?.textContent ?? ""),
	};
});

afterEach(() => vi.unstubAllGlobals());

it("audits every documentation example", () => {
	expect(cases).toHaveLength(31);
	for (const example of cases)
		expect(unexpectedNativeFallbacks(example.name, "html", "")).toEqual([]);
});

// Docutils is exercised by the browser audit, including these two RST sources.
it.each(cases.filter((example) => example.language !== "restructuredtext"))(
	"uses native syntax wherever representable: $name",
	async (example) => {
		vi.stubGlobal(
			"fetch",
			async (url: string | URL) =>
				new Response(
					readFileSync(
						`public${new URL(String(url), example.base).pathname}`,
						"utf8",
					),
				),
		);
		const html = await markupToHtml(
			example.source,
			example.language,
			example.base,
		);
		for (const language of [
			"asciidoc",
			"latex",
			"markdown",
			"restructuredtext",
		] as const) {
			if (language === example.language) continue;
			const source = htmlToMarkup(html, language);
			expect(
				unexpectedNativeFallbacks(example.name, language, source),
				`${example.name} → ${language}\n${source}`,
			).toEqual([]);
		}
	},
);

it("uses native LaTeX headings and preserves literal anchor identifiers", async () => {
	const source = htmlToMarkup(
		'<h1 id="_definition-1">Definition</h1><h2 id="results">Results</h2>',
		"latex",
	);
	expect(source).toContain("\\chapter*");
	expect(source).toContain("\\section*");
	expect(source).toContain("\\hypertarget");
	expect(source).not.toMatch(/\\wc|\\webcomponent/);
	const root = document.createElement("div");
	root.innerHTML = await markupToHtml(source, "latex", document.baseURI);
	expect(
		root.querySelector('[id="_definition-1"]')?.textContent?.normalize("NFKC"),
	).toBe("Definition");
});

it.each(["markdown", "asciidoc"] as const)(
	"preserves underlining using native %s spans",
	async (language) => {
		const source = htmlToMarkup("<p>Keep <u>underlining</u>.</p>", language);
		const root = document.createElement("div");
		root.innerHTML = await markupToHtml(source, language, document.baseURI);
		expect(root.querySelector(".underline")?.textContent).toBe("underlining");
	},
);

it.each(["asciidoc", "latex"] as const)(
	"uses native %s image figures with an unchanged caption",
	async (language) => {
		const source = htmlToMarkup(
			'<figure><img src="https://example.org/image.svg" alt="Image" width="120"><figcaption>A figure</figcaption></figure>',
			language,
		);
		expect(source).toContain(
			language === "latex" ? "\\begin{figure}" : "image::",
		);
		const root = document.createElement("div");
		root.innerHTML = await markupToHtml(source, language, document.baseURI);
		expect(
			root.querySelector("figcaption")?.textContent?.normalize("NFKC").trim(),
		).toBe("A figure");
	},
);

it("renders a headerless Markdown table without inventing cells", async () => {
	const source = htmlToMarkup(
		"<table><tbody><tr><td>A</td><td>B</td></tr><tr><td>C</td><td>D</td></tr></tbody></table>",
		"markdown",
	);
	expect(source).not.toContain(":::");
	const root = document.createElement("div");
	root.innerHTML = await markupToHtml(
		source,
		"markdown",
		"http://localhost:4173/",
	);
	expect(root.querySelectorAll("th")).toHaveLength(0);
	expect(root.querySelectorAll("tr")).toHaveLength(2);
	expect(
		[...root.querySelectorAll("td")].map((cell) => cell.textContent),
	).toEqual(["A", "B", "C", "D"]);
});

it.each(["markdown", "asciidoc"] as const)(
	"keeps merged cells and individual alignment native in %s",
	async (language) => {
		const html =
			'<table><thead><tr><th>A</th><th>B</th></tr></thead><tbody><tr><td rowspan="2" style="vertical-align:middle">Group</td><td style="text-align:right;vertical-align:bottom">20</td></tr><tr><td><strong>Rich</strong> cell</td></tr></tbody></table>';
		const source = htmlToMarkup(html, language);
		expect(source).not.toMatch(/::: table|\[table[,\]]/);
		const root = document.createElement("div");
		root.innerHTML = await markupToHtml(
			source,
			language,
			"http://localhost:4173/",
		);
		expect(root.querySelector('td[rowspan="2"]')?.textContent).toContain(
			"Group",
		);
		const value = [...root.querySelectorAll("td")].find(
			(cell) => cell.textContent?.trim() === "20",
		);
		expect(
			value?.style.textAlign ||
				(value?.classList.contains("halign-right") ? "right" : ""),
		).toBe("right");
		expect(
			value?.style.verticalAlign ||
				(value?.classList.contains("valign-bottom") ? "bottom" : ""),
		).toBe("bottom");
		expect(root.querySelector("strong")?.textContent).toBe("Rich");
	},
);

it("emits adjacent native RST targets for heading aliases", () => {
	const source = htmlToMarkup(
		'<h1 id="title"><span id="alias"></span>Title</h1>',
		"restructuredtext",
	);
	expect(source).toContain(".. _alias:\n.. _title:");
	expect(source).not.toContain("span::");
	expect(source).toContain("Title\n=====");
});

it.each(["asciidoc", "latex"] as const)(
	"round-trips native numbered listings in %s",
	async (language) => {
		const source = htmlToMarkup(
			'<tp-code-editor readonly line-numbers line-number-start="20" language="javascript" value="const x = &quot;&lt;tag&gt;&quot;;&#10;console.log(x);"></tp-code-editor>',
			language,
		);
		expect(source).not.toMatch(/tp-code-editor|wcTpCodeEditor/);
		expect(source).toContain(
			language === "latex" ? "firstnumber=20" : "linenums,start=20",
		);
		const root = document.createElement("div");
		root.innerHTML = await markupToHtml(
			source,
			language,
			"http://localhost:4173/",
		);
		expect(
			root.querySelector("tp-code-editor")?.getAttribute("line-number-start"),
		).toBe("20");
		expect(root.querySelector("tp-code-editor")?.getAttribute("value")).toBe(
			'const x = "<tag>";\nconsole.log(x);',
		);
	},
);

it("preserves relative AsciiDoc columns in a native table", async () => {
	const source = htmlToMarkup(
		'<table><colgroup><col style="width:25%"><col style="width:75%"></colgroup><tbody><tr><td>A</td><td>B</td></tr></tbody></table>',
		"asciidoc",
	);
	expect(source).toContain('cols="<25,<75"');
	expect(source).toContain("|===");
	const root = document.createElement("div");
	root.innerHTML = await markupToHtml(
		source,
		"asciidoc",
		"http://localhost:4173/",
	);
	expect(
		[...root.querySelectorAll("col")].map(
			(col) => col.style.width || col.getAttribute("width"),
		),
	).toEqual(["25%", "75%"]);
});

it.each(["left", "center", "right"])(
	"uses native RST for %s alignment with every vertical position",
	(horizontal) => {
		for (const vertical of ["top", "middle", "bottom"]) {
			const source = htmlToMarkup(
				`<table><tbody><tr><td style="text-align:${horizontal};vertical-align:${vertical}">A</td><td>B</td></tr></tbody></table>`,
				"restructuredtext",
			);
			expect(source).toContain(".. list-table::");
			expect(source).not.toContain("html-table");
			if (horizontal !== "left" || vertical !== "top")
				expect(source).toContain(`1,1=${horizontal}/${vertical}`);
		}
	},
);
it("keeps merged multiline rich cells in an RST grid table", () => {
	const source = htmlToMarkup(
		'<table><tbody><tr><td rowspan="2" style="vertical-align:middle">Group</td><td style="text-align:right">20</td></tr><tr><td><strong>Rich</strong><br>cell</td></tr></tbody></table>',
		"restructuredtext",
	);
	expect(source).toContain(".. table::");
	expect(source).not.toContain("html-table");
	expect(source).toContain("1,1=left/middle");
	expect(source).toContain("| **Rich**");
});
