import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { required } from "../../test-helpers/required.js";
import "./multi-choice-question.js";

/** Loads the actual documentation source without executing its MathJax scripts. */
const source = readFileSync(
	"public/docs/components/multi-choice-question/examples/examples.html",
	"utf8",
);

/** Connects a named question and waits for its checkbox list. */
async function mount(label: string): Promise<HTMLElement> {
	const root = document.createElement("template");
	root.innerHTML = source;
	const content = required(root.content.querySelector("template")).content;
	const example = required(content.querySelector(`[label="${label}"]`));
	const question = required(example.querySelector("tp-multi-choice-question"));
	document.body.append(question);
	await new Promise((resolve) => window.setTimeout(resolve, 0));
	return question;
}

/** Submits the supplied checkbox positions through the question controls. */
async function submit(question: HTMLElement, value: string): Promise<string> {
	required(question.querySelector("tp-checkbox-list")).setAttribute(
		"value",
		value,
	);
	required(
		question.querySelector<HTMLElement>('[data-action="submit"]'),
	).click();
	await new Promise((resolve) => window.setTimeout(resolve, 0));
	return (
		required(question.querySelector("[data-tp-question-feedback-output]"))
			.textContent ?? ""
	);
}

/** Resolves displayed positions after shuffling without relying on their order. */
function choiceValues(
	question: HTMLElement,
	matches: (item: Element) => boolean,
): string {
	return Array.from(question.querySelectorAll("tp-checkbox-list li"))
		.flatMap((item, index) => (matches(item) ? [String(index + 1)] : []))
		.join(",");
}

afterEach(() => document.body.replaceChildren());

describe("multi-choice documentation", () => {
	it("keeps Markdown logos content-free with accessible labels", () => {
		const markdown = required(
			readFileSync(
				"public/docs/components/multi-choice-question/examples/examples.md",
				"utf8",
			).split('label="Markup languages"')[1],
		);
		expect(markdown.match(/:tp-icon:\{/g)).toHaveLength(12);
		expect(markdown.match(/aria-label="[^"]+"/g)).toHaveLength(6);
		expect(markdown).not.toContain(":tp-icon:`");
	});
	it("uses native inline RST icon roles with accessible labels", () => {
		const rst = required(
			readFileSync(
				"public/docs/components/multi-choice-question/examples/examples.rst",
				"utf8",
			).split(".. example:: Markup languages")[1],
		);
		expect(
			rst.match(/\.\. role:: inline-tp-icon-\d+\(tp-icon\)/g),
		).toHaveLength(6);
		expect(rst).not.toContain("- .. tp-icon::");
		expect(rst.match(/:aria-label:/g)).toHaveLength(6);
		expect(rst).not.toContain(":logo-");
	});
	it("keeps Basic usage, grouped Attributes and three complementary examples", () => {
		expect(source.match(/role="example"/g)).toHaveLength(5);
		expect(source).toContain('label="Attributes"');
		expect(source).not.toContain('label="Attribute:');
		expect(source).not.toContain("Additional usage");
		expect(source).toContain("mathjax@4/tex-svg.js");
		const root = document.createElement("template");
		root.innerHTML = source;
		const content = required(root.content.querySelector("template")).content;
		expect(
			content.querySelectorAll(
				'[role="example"]:not([label^="Attribute:"]) tp-multi-choice-question[random]',
			),
		).toHaveLength(3);
	});
	it("includes JavaScript and Less and accepts all three styling languages", async () => {
		const question = await mount("Basic usage");
		const items = Array.from(question.querySelectorAll("tp-checkbox-list li"));
		expect(items.map((item) => item.textContent?.trim()).sort()).toEqual([
			"CSS",
			"HTML",
			"JavaScript",
			"Less",
			"Sass",
		]);
		const values = choiceValues(question, (item) =>
			["CSS", "Sass", "Less"].includes(item.textContent?.trim() ?? ""),
		);
		expect(await submit(question, values)).toContain("3/3");
	});
	it("accepts the two equivalent derivatives among five formulas", async () => {
		const question = await mount("Derivatives of tan(x)");
		expect(question.querySelectorAll("tp-checkbox-list li")).toHaveLength(5);
		const values = choiceValues(
			question,
			(item) =>
				item.textContent?.includes("\\frac{1}{\\cos^2(x)}") === true ||
				item.textContent?.includes("1 + \\tan^2(x)") === true,
		);
		expect(await submit(question, values)).toContain("2/2");
	});
	it("rejects the minus-sign distractor", async () => {
		const question = await mount("Derivatives of tan(x)");
		const values = choiceValues(
			question,
			(item) =>
				item.textContent?.includes("\\frac{1}{\\cos^2(x)}") === true ||
				item.textContent?.includes("1 - \\tan^2(x)") === true,
		);
		const feedback = await submit(question, values);
		expect(feedback).not.toContain("2/2");
		expect(feedback).toContain("plus sign");
	});
	it("uses six library icons and accepts HTML, Markdown and AsciiDoc", async () => {
		const question = await mount("Markup languages");
		expect(question.getAttribute("orientation")).toBe("horizontal");
		expect(
			question.querySelector("tp-checkbox-list")?.getAttribute("orientation"),
		).toBe("horizontal");
		expect(
			question.querySelectorAll(
				'tp-checkbox-list tp-icon[library="languages"][size="2em"]',
			),
		).toHaveLength(6);
		const values = choiceValues(question, (item) =>
			["file_type_html", "file_type_markdown", "file_type_asciidoc"].includes(
				item.querySelector("tp-icon")?.getAttribute("name") ?? "",
			),
		);
		expect(await submit(question, values)).toContain("3/3");
	});
	it("does not reinterpret Correct. as a Markdown list in logo feedback", async () => {
		const question = await mount("Markup languages");
		const values = choiceValues(
			question,
			(item) =>
				item.querySelector("tp-icon")?.getAttribute("name") ===
				"file_type_html",
		);
		expect(await submit(question, values)).toContain("Correct. HTML marks up");
		const output = required(
			question.querySelector("[data-tp-question-feedback-output]"),
		);
		expect(output.querySelector("tp-markdown")).toBeNull();
		expect(
			output.querySelectorAll("[data-tp-question-feedback-list] > li"),
		).toHaveLength(1);
		expect(output.querySelector("li ul, li ol")).toBeNull();
	});
});
