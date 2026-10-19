import { readFileSync } from "node:fs";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { stubMathJaxRuntime } from "../../test-helpers/mathjax.js";
import { getBlankFields } from "../fill-blank/fields.js";
import { renderMarkdownToHtml } from "../markdown/markdown.js";
import type { TpTextfield } from "../textfield/textfield.js";
import "./fill-blank-question.js";

const { loaded } = vi.hoisted(() => ({ loaded: vi.fn() }));
vi.mock("./math-checker.js", async (original) => {
	loaded();
	return original();
});
beforeEach(() => stubMathJaxRuntime());
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});
function submit() {
	document.querySelector<HTMLElement>('[data-action="submit"]')?.click();
}
function output() {
	return document.querySelector("[data-tp-question-feedback-output]")
		?.textContent;
}

it("keeps text-only grading independent of Cortex and matches complete regex answers", async () => {
	document.body.innerHTML = `<tp-fill-blank-question partial><dl><dt>Answers</dt><dd><ol><li>dérivée seconde</li><li>croissante</li></ol></dd><dt>Form</dt><dd><tp-textfield regexp="(?:dérivée seconde|seconde dérivée)"></tp-textfield><tp-blank></tp-blank></dd></dl></tp-fill-blank-question>`;
	const fields = Array.from(
		document.querySelectorAll<TpTextfield>("tp-fill-blank tp-textfield"),
	);
	expect(fields).toHaveLength(2);
	if (!fields[0] || !fields[1]) throw new Error("Missing text fields");
	fields[0].value = " Seconde Dérivée ";
	fields[1].value = "croissante";
	submit();
	expect(output()).toContain("2/2");
	expect(output()).toContain(
		"Answer 1: correct; an accepted wording variant was recognized.",
	);
	expect(
		document.querySelector('[data-tp-expected-answer="1"]')?.textContent,
	).toBe("Expected answer: dérivée seconde");
	fields[0].value = " DÉRIVÉE SECONDE ";
	submit();
	expect(output()).toContain("2/2");
	expect(document.querySelector("[data-tp-text-variant]")).toBeNull();
	expect(document.querySelector("[data-tp-expected-answer]")).toBeNull();
	expect(loaded).not.toHaveBeenCalled();
	fields[0].value = "pas une seconde dérivée";
	fields[1].value = "décroissante";
	submit();
	expect(output()).toContain("0/2");
	expect(document.querySelector("[data-tp-text-variant]")).toBeNull();
	expect(document.querySelector("[data-tp-expected-answer]")).toBeNull();
});

it("grades the 19 general.md answers with mixed fields and a lazy math engine", async () => {
	const source = readFileSync("public/docs/exercises/general.md", "utf8");
	document.body.innerHTML = await renderMarkdownToHtml(source);
	const question = document.querySelector("tp-fill-blank-question");
	expect(question).not.toBeNull();
	expect(question?.querySelectorAll("tp-mathfield")).toHaveLength(12);
	expect(question?.querySelectorAll("tp-mathfield[mathlive]")).toHaveLength(12);
	expect(loaded).not.toHaveBeenCalled();
	const root = question?.querySelector("tp-fill-blank");
	if (!root) throw new Error("Missing form");
	const fields = getBlankFields(root);
	expect(fields).toHaveLength(19);
	const values = [
		String.raw`\frac{f(x)-f(a)}{x-a}`,
		String.raw`\frac{f(a+h)-f(a)}{h}`,
		"x",
		"a",
		"un nombre réel",
		"a",
		String.raw`a\in I`,
		"dérivée",
		"f'",
		"f''",
		"seconde dérivée",
		"f'(a)",
		"y-f(a)=f'(a)(x-a)",
		"f'(a)(x-a)+f(a)",
		"f'(a)h+f(a)",
		"approximation affine",
		"tangente",
		"décroissante",
		"croissante",
	];
	fields.forEach((field, index) => {
		field.value = values[index] ?? "";
	});
	submit();
	await vi.waitFor(() => expect(output()).toContain("19/19"));
	expect(
		document.querySelector('[data-tp-expected-answer="11"]')?.textContent,
	).toBe("Expected answer: dérivée seconde");
	expect(loaded).toHaveBeenCalledTimes(1);
	expect(
		root.querySelectorAll('[data-tp-blank-result="success"]'),
	).toHaveLength(19);
	if (!fields[2]) throw new Error("Missing variable field");
	fields[2].value = "X";
	submit();
	await vi.waitFor(() => expect(output()).toContain("18/19"));
	document.querySelector<HTMLElement>('[data-action="reset"]')?.click();
	expect(fields.every((field) => field.value === "")).toBe(true);
});

it("locks notation inside nested question content and restores standalone choice", () => {
	const question = document.createElement("tp-fill-blank-question");
	question.innerHTML =
		'<dl><dt>Answers</dt><dd><ol><li>x</li></ol></dd><dt>Form</dt><dd><div><tp-mathfield mode="asciimath"></tp-mathfield></div></dd></dl>';
	document.body.append(question);
	const field = question.querySelector("tp-mathfield");
	expect(field?.mode).toBe("latexmath");
	expect(
		field?.querySelector<HTMLButtonElement>("[data-tp-mathfield-mode-button]")
			?.disabled,
	).toBe(true);
	if (!field) throw new Error("Missing field");
	document.body.append(field);
	expect(field.mode).toBe("asciimath");
	expect(
		field.querySelector<HTMLButtonElement>("[data-tp-mathfield-mode-button]")
			?.disabled,
	).toBe(false);
});

it("reports the wrong second quotient as false and the expected a as correct", async () => {
	document.body.innerHTML = await renderMarkdownToHtml(
		readFileSync("public/docs/exercises/general.md", "utf8"),
	);
	const root = document.querySelector("tp-fill-blank");
	if (!root) throw new Error("Missing form");
	const fields = getBlankFields(root);
	const quotient = fields[1];
	const variable = fields[3];
	if (!quotient || !variable) throw new Error("Missing answers");
	quotient.value = String.raw`\frac{f(x)-f(a)}{x-a}`;
	submit();
	await vi.waitFor(() =>
		expect(quotient.getAttribute("data-tp-blank-result")).toBe("danger"),
	);
	variable.value = "a";
	submit();
	await vi.waitFor(() =>
		expect(variable.getAttribute("data-tp-blank-result")).toBe("success"),
	);
	expect(output()).not.toContain("could not be verified");
	expect(quotient.getAttribute("data-tp-blank-result")).toBe("danger");
	// A truly unverified expression must identify its own blank, not implicate a.
	quotient.value = String.raw`\frac{`;
	submit();
	await vi.waitFor(() =>
		expect(
			root
				.closest("tp-fill-blank-question")
				?.querySelector('[data-tp-unverified-answer="2"]'),
		).not.toBeNull(),
	);
	expect(variable.getAttribute("data-tp-blank-result")).toBe("success");
	expect(document.querySelector('[data-tp-unverified-answer="4"]')).toBeNull();
});

it.each([
	[String.raw`\frac{f(x) - f(a)}{-(a-x)}`, "simplification"],
	[String.raw`\frac{f(x) - f(a)}{x-a}`, null],
])(
	"explains a transformed correct answer, but not presentation differences: %s",
	async (answer, stage) => {
		document.body.innerHTML = String.raw`<tp-fill-blank-question partial><dl><dt>Answers</dt><dd><ol><li><tp-math>\displaystyle\frac{f(x)-f(a)}{x-a}</tp-math></li></ol></dd><dt>Form</dt><dd><tp-blank type="math"></tp-blank></dd></dl></tp-fill-blank-question>`;
		const field = document.querySelector("tp-mathfield");
		if (!field) throw new Error("Missing math field");
		field.value = answer;
		submit();
		await vi.waitFor(() =>
			expect(output()).toContain("Congratulations, correct answer!"),
		);
		const notice = document.querySelector("[data-tp-math-transformation]");
		if (stage) {
			expect(notice?.getAttribute("data-tp-math-transformation")).toBe(stage);
			expect(notice?.textContent).toBe(
				"Answer 1: correct after algebraic simplification or rearrangement.",
			);
			const expected = document.querySelector('[data-tp-expected-answer="1"]');
			expect(expected?.textContent).toContain("Expected answer:");
			expect(expected?.querySelector("tp-math")?.getAttribute("value")).toBe(
				String.raw`\displaystyle\frac{f(x)-f(a)}{x-a}`,
			);
			expect(customElements.get("tp-math")).toBeDefined();
		} else {
			expect(notice).toBeNull();
			expect(document.querySelector("[data-tp-expected-answer]")).toBeNull();
		}
	},
);

it("shows the expected formula after normalization of a difference quotient", async () => {
	document.body.innerHTML = String.raw`<tp-fill-blank-question partial><dl><dt>Answers</dt><dd><ol><li><tp-math>\frac{f(a+h)-f(a)}{h}</tp-math></li></ol></dd><dt>Form</dt><dd><tp-blank type="math"></tp-blank></dd></dl></tp-fill-blank-question>`;
	const field = document.querySelector("tp-mathfield");
	if (!field) throw new Error("Missing math field");
	field.value = String.raw`\frac{f(a) - f(a+h)}{-h}`;
	submit();
	await vi.waitFor(() =>
		expect(output()).toContain("Congratulations, correct answer!"),
	);
	expect(
		document
			.querySelector("[data-tp-math-transformation]")
			?.getAttribute("data-tp-math-transformation"),
	).toBe("normalization");
	const expected = document.querySelector('[data-tp-expected-answer="1"]');
	expect(expected?.textContent).toContain("Expected answer:");
	expect(expected?.querySelector("tp-math")?.getAttribute("value")).toBe(
		String.raw`\frac{f(a+h)-f(a)}{h}`,
	);
});

it("reads regexp changes and reports invalid author rules without grading", () => {
	document.body.innerHTML = `<tp-fill-blank-question><dl><dt>Answers</dt><dd><ol><li>colour</li></ol></dd><dt>Form</dt><dd><tp-textfield regexp="colou?r"></tp-textfield></dd></dl></tp-fill-blank-question>`;
	const field = document.querySelector("tp-textfield");
	const question = document.querySelector("tp-fill-blank-question");
	if (!field || !question) throw new Error("Missing field or question");
	expect(field.regexp).toBe("colou?r");
	field.value = " COLOR ";
	submit();
	expect(output()).toContain("Congratulations");
	question.caseSensitive = true;
	field.value = "Color";
	submit();
	expect(output()).not.toContain("Congratulations");
	field.regexp = "[";
	expect(field.getAttribute("regexp")).toBe("[");
	const graded = vi.fn();
	question.addEventListener("tp-question-submit", graded);
	submit();
	expect(question.textContent).toContain("Invalid answer pattern");
	expect(graded).not.toHaveBeenCalled();
	field.removeAttribute("regexp");
	expect(field.regexp).toBe("");
	field.value = "colour";
	submit();
	expect(output()).toContain("Congratulations");
});
