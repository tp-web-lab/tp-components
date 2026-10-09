import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import { renderAsciidocToHtml } from "../asciidoc/asciidoc.js";
import { renderMarkdownToHtml } from "../markdown/markdown.js";
import "./blank.js";
import "../fill-blank-question/fill-blank-question.js";

afterEach(() => document.body.replaceChildren());

it("preserves asynchronous math components in the dynamically loaded introduction", async () => {
	const source =
		readFileSync(
			"public/docs/components/fill-blank-question/index.md",
			"utf8",
		).split("## Usage")[0] ?? "";
	expect(source).not.toContain("data-mathjax-tex");
	expect(source).not.toContain("window.MathJax");
	const template = document.createElement("template");
	template.innerHTML = await renderMarkdownToHtml(source);
	const question = template.content.querySelector(
		"tp-fill-blank-question[closed]",
	);
	expect(question?.querySelectorAll("tp-math[value]")).toHaveLength(8);
	expect(question?.querySelector("tp-math[value]")?.getAttribute("value")).toBe(
		"\\mathbb{R}_{+}",
	);
	expect(template.content.querySelector("script[src*=mathjax]")).toBeNull();
});

it.each(["html", "md", "adoc", "rst"])(
	"offers Basic usage followed by the same four named exercises in %s",
	(extension) => {
		const source = readFileSync(
			`public/docs/components/fill-blank-question/examples/examples.${extension}`,
			"utf8",
		);
		const expression =
			extension === "html"
				? /role="example" label="([^"]+)"/g
				: extension === "md"
					? /``` example \{label="([^"]+)"\}/g
					: extension === "adoc"
						? /^\.([^\n]+)\n=====/gm
						: /\.\. example:: ([^\n]+)/g;
		expect([...source.matchAll(expression)].map((match) => match[1])).toEqual([
			"Basic usage",
			"Geography",
			"Irregular verbs",
			"Baltic capitals and flags",
			"Square root",
		]);
	},
);

it.each(["MathJax_SVG", "mjx-container"])(
	"keeps paragraph-wrapped %s answers inline without duplicate sources",
	(container) => {
		const formula = (label: string) =>
			`<p><span class="MathJax_Preview">${label}</span><${container === "mjx-container" ? "mjx-container" : 'span class="MathJax_SVG"'} aria-label="${label}"><svg viewBox="0 0 10 10"><path d="M0 0h10v10z" /></svg><span class="MJX_Assistive_MathML"><math>${label}</math></span></${container === "mjx-container" ? "mjx-container" : "span"}><script type="math/tex">${label}</script></p>`;
		document.body.innerHTML = `<tp-fill-blank-question closed><dl>
		<dt>Answers</dt><dd><ol><li>${formula("R+")}</li><li>${formula("R*+")}</li></ol></dd>
		<dt>Form</dt><dd><p>Defined on <tp-blank name="domain"></tp-blank> and differentiable on <tp-blank name="derivative"></tp-blank>.</p></dd>
		</dl></tp-fill-blank-question>`;
		const question = document.querySelector("tp-fill-blank-question");
		const fields = question?.querySelectorAll("tp-blank");
		const controller = question?.querySelector("tp-dragdrop");
		if (!question || !fields || !controller)
			throw new Error("Missing question controls");
		for (const [index, label] of ["R+", "R*+"].entries()) {
			const source = [
				...question.querySelectorAll("tp-button[data-tp-closed-item]"),
			].find(
				(button) =>
					button
						.querySelector(`svg`)
						?.parentElement?.getAttribute("aria-label") === label,
			);
			controller.dispatchEvent(
				new CustomEvent("tp-dragdrop-drop", {
					detail: { source, target: fields[index] },
				}),
			);
		}
		const reading = question.querySelector("[data-tp-closed-reading]");
		expect(reading?.querySelectorAll("p")).toHaveLength(1);
		expect(reading?.querySelectorAll("svg")).toHaveLength(2);
		expect(reading?.querySelectorAll("[data-tp-reading-math]")).toHaveLength(2);
		expect(
			reading?.querySelector("script, .MathJax_Preview, .MJX_Assistive_MathML"),
		).toBeNull();
		expect(reading?.textContent).toBe("Defined on  and differentiable on .");
	},
);

it("keeps the HTML square root example executable after example extraction", () => {
	const source = readFileSync(
		"public/docs/components/fill-blank-question/examples/examples.html",
		"utf8",
	);
	const documentSource = new DOMParser().parseFromString(source, "text/html");
	const template = documentSource.querySelector("tp-html-viewer > template");
	if (!(template instanceof HTMLTemplateElement))
		throw new Error("Missing source template");
	const example = template.content.querySelector('[label="Square root"]');
	expect(example?.querySelector(":scope > template")).toBeNull();
	expect(
		example?.querySelector("tp-markdown, tp-asciidoc, tp-restructuredtext"),
	).toBeNull();
	expect(example?.querySelector('script[type^="tp/"]')).toBeNull();
	expect(example?.querySelector("tp-fill-blank-question > dl")).not.toBeNull();
	expect(example?.querySelectorAll("tp-blank")).toHaveLength(3);
	expect(example?.querySelector('script[src*="mathjax"]')).not.toBeNull();
});

it("copies the rendered SVG into the reading after asynchronous formula rendering", async () => {
	document.body.innerHTML = `<tp-fill-blank-question closed><dl>
		<dt>Answers</dt><dd><ol><li><span data-formula>LaTeX source</span></li></ol></dd>
		<dt>Form</dt><dd>The domain is <tp-blank name="domain"></tp-blank>.</dd>
		</dl></tp-fill-blank-question>`;
	const question = document.querySelector("tp-fill-blank-question");
	const field = question?.querySelector("tp-blank");
	const controller = question?.querySelector("tp-dragdrop");
	if (!field || !controller) throw new Error("Missing question controls");
	const bankFormula = question?.querySelector("tp-button [data-formula]");
	if (!bankFormula) throw new Error("Missing bank formula");
	bankFormula.innerHTML =
		'<svg viewBox="0 0 20 20" aria-label="Rendered formula"><path d="M0 0h20v20z" /></svg>';
	controller.dispatchEvent(
		new CustomEvent("tp-dragdrop-drop", {
			detail: {
				source: question?.querySelector("tp-button[data-tp-closed-item]"),
				target: field,
			},
		}),
	);
	const formula = field.querySelector("[data-formula]");
	if (!formula) throw new Error("Missing formula");
	expect(formula.querySelector("svg path")).not.toBeNull();
	expect(
		question?.querySelector("[data-tp-closed-reading] svg path"),
	).not.toBeNull();
	formula.innerHTML =
		'<svg viewBox="0 0 20 20" aria-label="Nonnegative real numbers"><path d="M0 0h20v20z" /></svg>';
	const reading = question?.querySelector("[data-tp-closed-reading]");
	await vi.waitFor(() =>
		expect(reading?.querySelector("svg path")).not.toBeNull(),
	);
	expect(reading?.textContent).not.toContain("LaTeX source");
	expect(reading?.querySelector("[data-tp-blank-tools]")).toBeNull();
	expect(reading?.querySelector("svg")).not.toBe(formula.querySelector("svg"));
	field.clear();
	expect(reading?.querySelector("svg")).toBeNull();
});

it.each([
	["md", renderMarkdownToHtml],
	["adoc", renderAsciidocToHtml],
] as const)(
	"renders the closed square root example in %s",
	async (extension, render) => {
		const source = readFileSync(
			`public/docs/components/fill-blank-question/examples/examples.${extension}`,
			"utf8",
		);
		const start =
			extension === "md"
				? ":::: tp-fill-blank-question { closed"
				: "[tp-fill-blank-question%closed";
		const content = source.slice(
			source.indexOf(start, source.indexOf("Square root")),
		);
		const end = extension === "md" ? "\n::::" : "\n====";
		const body = content.slice(
			0,
			content.indexOf(end, content.indexOf("Answers")) + end.length,
		);
		const rendered = await render(
			extension === "md" ? `---\nextensions: [math]\n---\n${body}` : body,
		);
		expect((rendered.match(/<tp-blank\b/g) ?? []).length, rendered).toBe(3);
		document.body.innerHTML = rendered;
		const question = document.querySelector("tp-fill-blank-question");
		expect(question).not.toBeNull();
		expect(question?.querySelectorAll("tp-blank")).toHaveLength(3);
		expect(
			question?.querySelectorAll("tp-button[data-tp-closed-item]"),
		).toHaveLength(3);
	},
);

it("assigns the six text and colored flag answers of the English Baltic example", async () => {
	const source = readFileSync(
		"public/docs/components/fill-blank-question/index.md",
		"utf8",
	);
	const example = source
		.slice(source.indexOf("### Closed answers"))
		.match(/<template>([\s\S]*?)<\/template>/)?.[1];
	if (!example) throw new Error("Missing closed example");
	document.body.innerHTML = example;
	const question = document.querySelector("tp-fill-blank-question");
	const controller = question?.querySelector("tp-dragdrop");
	if (!question || !controller) throw new Error("Missing question controls");
	const fields = [...question.querySelectorAll("tp-blank")];
	expect(question.getAttribute("lang")).toBe("en");
	const reading = question.querySelector("[data-tp-closed-reading]");
	expect(reading?.closest("tp-callout")?.getAttribute("variant")).toBe(
		"neutral",
	);
	expect(reading?.textContent).toContain("Estonia has … as its capital");
	expect(fields).toHaveLength(6);
	expect(question.querySelector("tp-textfield")).toBeNull();
	for (const [index, label] of [
		"Tallinn",
		"Flag of Estonia",
		"Riga",
		"Flag of Latvia",
		"Vilnius",
		"Flag of Lithuania",
	].entries()) {
		const answer = question.querySelector(
			`tp-button[data-tp-closed-item][aria-label="${label}"]`,
		);
		expect(answer).not.toBeNull();
		controller.dispatchEvent(
			new CustomEvent("tp-dragdrop-drop", {
				detail: { source: answer, target: fields[index] },
			}),
		);
		expect(fields[index]?.value).toBe(String(index + 1));
	}
	for (const [index, flag, color] of [
		[1, "ee", "#4891D9"],
		[3, "lv", "#9E3039"],
		[5, "lt", "#FDB913"],
	] as const) {
		expect(
			fields[index]
				?.querySelector(':scope > tp-icon[library="flags"]')
				?.getAttribute("name"),
		).toBe(flag);
		await vi.waitFor(() => {
			expect(
				fields[index]?.querySelector(`:scope > tp-icon svg [fill="${color}"]`),
			).not.toBeNull();
		});
	}
	expect(reading?.textContent).toContain("Estonia has Tallinn as its capital");
	expect(reading?.querySelectorAll('tp-icon[library="flags"]')).toHaveLength(3);
	expect(reading?.querySelector("tp-blank, tp-textfield, button")).toBeNull();
	expect(reading?.textContent).not.toContain("assigned to");
	question
		.querySelector('[data-action="submit"]')
		?.dispatchEvent(new Event("click"));
	expect(
		question.querySelector("[data-tp-question-feedback-output]")?.textContent,
	).toContain("Congratulations, correct answer!");
	fields[0]?.clear();
	expect(reading?.textContent).toContain("Estonia has … as its capital");
	expect(reading?.textContent).toContain("Latvia has Riga as its capital");
});

it("declares the equivalent reStructuredText directive without requiring Pyodide in unit tests", () => {
	const source = readFileSync(
		"public/docs/components/blank/examples/examples.rst",
		"utf8",
	);
	expect(source).toContain(".. tp-blank::");
	expect(source).toContain(":name: result");
	expect(source).toContain(":placeholder: Choose an answer");
	expect(source).toContain(":aria-label: Expected result");
});

it.each([
	["md", renderMarkdownToHtml],
	["adoc", renderAsciidocToHtml],
] as const)(
	"renders the %s example with the library markup parser",
	async (extension, render) => {
		const source = readFileSync(
			`public/docs/components/blank/examples/examples.${extension}`,
			"utf8",
		);
		const outer = document.createElement("div");
		outer.innerHTML = await render(source);
		const inline = outer.querySelector("script")?.textContent;
		if (!inline) throw new Error("Missing viewer script");
		document.body.innerHTML = await render(inline);
		const blank = document.querySelector('tp-blank[name="result"]');
		expect(blank?.getAttribute("name")).toBe("result");
		expect(blank?.getAttribute("aria-label")).toBe("Expected result");
	},
);

it("scores all documented rich answers and clears images on reset", () => {
	const source = readFileSync("public/docs/components/blank/index.md", "utf8");
	const example = source
		.split("## Usage")[0]
		?.match(
			/^<tp-fill-blank-question\b[^>]*>[\s\S]*?<\/tp-fill-blank-question>/m,
		)?.[0];
	if (!example) throw new Error("Missing introduction");
	document.body.innerHTML = example;
	const question = document.querySelector("tp-fill-blank-question");
	const controller = question?.querySelector("tp-dragdrop");
	if (!question || !controller) throw new Error("Missing closed question");
	const fields = [...question.querySelectorAll("tp-blank")];
	for (const [index, label] of [
		"Paris",
		"Triangle",
		"tp-components logo",
	].entries()) {
		const source = question.querySelector(
			`tp-button[data-tp-closed-item][aria-label="${label}"]`,
		);
		controller.dispatchEvent(
			new CustomEvent("tp-dragdrop-drop", {
				detail: { source, target: fields[index] },
			}),
		);
		expect(fields[index]?.value).toBe(String(index + 1));
	}
	expect(fields[1]?.querySelector("svg")).not.toBeNull();
	expect(fields[2]?.querySelector("img")).not.toBeNull();
	question
		.querySelector('[data-action="submit"]')
		?.dispatchEvent(new Event("click"));
	expect(
		question.querySelector("[data-tp-question-feedback-output]")?.textContent,
	).toContain("Congratulations, correct answer!");
	question
		.querySelector('[data-action="reset"]')
		?.dispatchEvent(new Event("click"));
	expect(fields.map((field) => field.value)).toEqual(["", "", ""]);
	expect(fields[2]?.querySelector("img")).toBeNull();
});
