import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { TpFile } from "../filesystem/filesystem.types.js";
import { TpJavascriptInterpreterQuestion } from "../javascript-interpreter-question/javascript-interpreter-question.js";
import { TpOCamlInterpreterQuestion } from "../ocaml-interpreter-question/ocaml-interpreter-question.js";
import { buildBrowserTestDocument } from "../playground/browser-test-document.js";
import type { TpExecutionDocument } from "../playground/playground.js";
import { TpPrologInterpreterQuestion } from "../prolog-interpreter-question/prolog-interpreter-question.js";
import { TpPythonInterpreterQuestion } from "../python-interpreter-question/python-interpreter-question.js";
import { TpSchemeInterpreterQuestion } from "../scheme-interpreter-question/scheme-interpreter-question.js";
import { TpTypescriptInterpreterQuestion } from "../typescript-interpreter-question/typescript-interpreter-question.js";
import type { QuestionInterpreter } from "./interpreter-question.js";

vi.mock("../playground/browser-test-document.js", () => ({
	buildBrowserTestDocument: vi.fn(async () => ({ html: "<p>Tests</p>" })),
}));
vi.mock("../javascript/javascript-engine.js", () => ({
	createJavascriptEngine: vi.fn(async () => ({
		execute: vi.fn(async () => "6"),
		dispose: vi.fn(),
	})),
}));
beforeEach(() =>
	vi.stubGlobal(
		"requestAnimationFrame",
		vi.fn(() => 0),
	),
);
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.clearAllMocks();
	vi.unstubAllGlobals();
});
const families = [
	["javascript", TpJavascriptInterpreterQuestion],
	["ocaml", TpOCamlInterpreterQuestion],
	["prolog", TpPrologInterpreterQuestion],
	["python", TpPythonInterpreterQuestion],
	["scheme", TpSchemeInterpreterQuestion],
	["typescript", TpTypescriptInterpreterQuestion],
] as const;
it.each(families)(
	"registers %s with its own simple interpreter",
	(language, Question) => {
		const question = new Question();
		question.src = "/program.txt";
		expect(question.getAttribute("src")).toBe("/program.txt");
		question.setAttribute("src", "/updated.txt");
		expect(question.src).toBe("/updated.txt");
		question.query = "query";
		question.setAttribute("value", "source");
		const factory = question as unknown as {
			createEditor(): QuestionInterpreter;
		};
		const interpreter = factory.createEditor();
		expect(interpreter.localName).toBe(`tp-${language}`);
		expect(interpreter.mode).toBe("simple");
		expect(interpreter.query).toBe("query");
		expect(interpreter.value).toBe("source");
		expect(question.shadowRoot).toBeNull();
		expect(Question.observedAttributes).toEqual(
			expect.arrayContaining(["src", "test", "query", "value"]),
		);
		expect(customElements.get(`tp-${language}-interpreter-question`)).toBe(
			Question,
		);
	},
);
it("uses current unsaved code and shares its scope with browser tests", async () => {
	const question = new TpJavascriptInterpreterQuestion();
	const control = document.createElement("tp-javascript");
	control.filename = "double.js";
	vi.spyOn(control, "getSource").mockResolvedValue(
		"function double(x) { return x * 2; }",
	);
	const adapter = question as unknown as {
		buildTests(
			control: QuestionInterpreter,
			file: TpFile,
		): Promise<TpExecutionDocument>;
	};
	await adapter.buildTests(control, {
		path: "/double.test.js",
		language: "javascript",
		content: "expect(double(3)).to.equal(6);",
	});
	const project = vi.mocked(buildBrowserTestDocument).mock.calls[0]?.[0];
	expect(project?.findFile("/double.js")?.content).toContain("return x * 2");
	expect(project?.findFile("/double.test.js")?.content).toBe(
		"function double(x) { return x * 2; }\n\nexpect(double(3)).to.equal(6);",
	);
});
function mount() {
	const question = new TpJavascriptInterpreterQuestion();
	question.open = true;
	question.innerHTML =
		'<dl><dt>Title</dt><dd>Double</dd><dt>Prompt</dt><dd>Edit and submit.</dd></dl><script type="tp/javascript">\n  function double(x) { return x + 1; }\n</script>';
	question.query = "double(3)";
	question.setAttribute("test", "/double.test.js");
	document.body.append(question);
	return question;
}
it("keeps inline source, submits repeatedly and resets the interpreter exactly once", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response("test source")),
	);
	const question = mount();
	const control = question.querySelector("tp-javascript");
	if (!control) throw Error("Missing interpreter");
	expect(control.value).toContain("function double(x)");
	vi.spyOn(control, "getSource").mockResolvedValue(
		"function double(x) { return x * 2; }",
	);
	const reset = vi.spyOn(control, "reset").mockResolvedValue();
	const action = (name: string) => {
		const button = question.querySelector<HTMLElement>(
			`[data-action="${name}"]`,
		);
		if (!button) throw Error(name);
		button.click();
	};
	action("submit");
	await vi.waitFor(() =>
		expect(buildBrowserTestDocument).toHaveBeenCalledTimes(1),
	);
	action("submit");
	await vi.waitFor(() =>
		expect(buildBrowserTestDocument).toHaveBeenCalledTimes(2),
	);
	action("reset");
	expect(reset).toHaveBeenCalledOnce();
	expect(question.querySelector("tp-iframe")).toBeNull();
});
it("does not execute tests before an external source is ready", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response("Not found", { status: 404 })),
	);
	const question = new TpJavascriptInterpreterQuestion();
	question.open = true;
	question.setAttribute("src", "/missing.js");
	question.setAttribute("test", "/double.test.js");
	document.body.append(question);
	question.querySelector<HTMLElement>('[data-action="submit"]')?.click();
	await vi.waitFor(() =>
		expect(question.querySelector('[role="alert"]')?.textContent).toBeTruthy(),
	);
	expect(buildBrowserTestDocument).not.toHaveBeenCalled();
});

it("loads a complete Markdown exercise and distinguishes self-assessment from grading", async () => {
	vi.doMock("../markdown/markdown.js", () => ({
		renderMarkdownFragment: async () => {
			const template = document.createElement("template");
			template.innerHTML = `<dl><dt>Title</dt><dd>External exercise</dd><dt>Prompt</dt><dd>Write double.</dd><dt>Program</dt><dd><pre><code>function double(x) { return x; }</code></pre></dd><dt>Query</dt><dd>double(3)</dd><dt>Solution</dt><dd>Multiply by two.</dd></dl>`;
			return template.content;
		},
	}));
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => ({ ok: true, text: async () => "exercise" })),
	);
	const question = new TpJavascriptInterpreterQuestion();
	question.src = "/exercises/double.md";
	document.body.append(question);
	await vi.waitFor(() =>
		expect(question.textContent).toContain("Write double."),
	);
	expect(question.getAttribute("query")).toBe("double(3)");
	expect(question.getAttribute("value")).toBe(
		"function double(x) { return x; }",
	);
	expect(question.textContent).toContain("External exercise");
	const adapter = question as unknown as { submitMessage(): HTMLElement };
	expect(adapter.submitMessage().textContent).toContain("No tests provided.");
});

it("gives Feedback precedence and freezes the interpreter source before fetching tests", async () => {
	let finish: ((response: Response) => void) | undefined;
	vi.stubGlobal(
		"fetch",
		vi.fn(
			() =>
				new Promise<Response>((resolve) => {
					finish = resolve;
				}),
		),
	);
	const question = mount();
	const feedback = question.querySelector("[data-tp-question-feedback-source]");
	if (!feedback) throw new Error("Missing feedback source");
	feedback.innerHTML =
		'<a href="https://example.test/feedback.test.js">Tests</a>';
	const control = question.querySelector("tp-javascript");
	if (!control) throw new Error("Missing interpreter");
	const source = vi
		.spyOn(control, "getSource")
		.mockResolvedValue("function double(x) { return x * 2; }");
	await question.submit();
	expect(fetch).toHaveBeenCalledWith(
		"https://example.test/feedback.test.js",
		expect.anything(),
	);
	source.mockResolvedValue("function double(x) { return 0; }");
	finish?.(new Response("expect(double(3)).to.equal(6);"));
	await vi.waitFor(() => expect(buildBrowserTestDocument).toHaveBeenCalled());
	const project = vi.mocked(buildBrowserTestDocument).mock.calls.at(-1)?.[0];
	expect(project?.findFile("/feedback.test.js")?.content).toContain(
		"return x * 2",
	);
	expect(project?.findFile("/feedback.test.js")?.content).not.toContain(
		"return 0",
	);
});
