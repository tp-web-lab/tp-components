import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import "./question.js";
import "../fill-blank-question/fill-blank-question.js";

afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

it.each([
	[
		"html",
		"<tp-question><dl><dt>Title</dt><dd>Loaded title</dd><dt>Prompt</dt><dd>Loaded prompt</dd></dl></tp-question>",
	],
	["MD?version=1#part", "Title\n: Loaded title\n\nPrompt\n: Loaded prompt"],
	["rst", "Title\n  Loaded title\n\nPrompt\n  Loaded prompt\n"],
	["adoc", "Title:: Loaded title\n\nPrompt:: Loaded prompt"],
])("routes %s through its format parser", async (extension, source) => {
	if (extension === "rst") {
		const rst = await import("../restructuredtext/restructuredtext.js");
		vi.spyOn(rst, "renderRestructuredTextToHtml").mockResolvedValue(
			'<dl class="simple"><dt>Title</dt><dd><p>Loaded title</p></dd><dt>Prompt</dt><dd><p>Loaded prompt</p></dd></dl>',
		);
	}
	const fetcher = vi.fn().mockResolvedValue(new Response(source));
	vi.stubGlobal("fetch", fetcher);
	document.body.innerHTML = `<tp-question open src="/questions/example.${extension}"></tp-question>`;
	await vi.waitFor(() =>
		expect(
			document.querySelector("[data-tp-question-prompt-content]")?.textContent,
		).toContain("Loaded prompt"),
	);
	expect(
		document.querySelector("[data-tp-question-title]")?.textContent,
	).toContain("Loaded title");
	expect(document.querySelectorAll("tp-question")).toHaveLength(1);
	expect(fetcher).toHaveBeenCalledTimes(1);
});

it("preserves JSON loading", async () => {
	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue(
			new Response(
				JSON.stringify({
					title: "JSON title",
					prompt: "JSON prompt",
					markup: "none",
				}),
			),
		),
	);
	document.body.innerHTML = '<tp-question src="/question.json"></tp-question>';
	await vi.waitFor(() =>
		expect(
			document.querySelector("[data-tp-question-title]")?.textContent,
		).toBe("JSON title"),
	);
	expect(
		document.querySelector("[data-tp-question-prompt-content]")?.textContent,
	).toBe("JSON prompt");
});

it("initializes and grades external blanks with the host mode and a live reading", async () => {
	vi.stubGlobal(
		"fetch",
		vi
			.fn()
			.mockResolvedValue(
				new Response(
					"<tp-fill-blank-question><dl><dt>Answers</dt><dd><ol><li>Paris</li></ol></dd><dt>Form</dt><dd>Capital: <tp-blank></tp-blank></dd></dl></tp-fill-blank-question>",
				),
			),
	);
	document.body.innerHTML =
		'<tp-fill-blank-question mode="opened" partial src="/exercise.html"></tp-fill-blank-question>';
	await vi.waitFor(() =>
		expect(document.querySelector("tp-textfield[clearable]")).not.toBeNull(),
	);
	const question = document.querySelector("tp-fill-blank-question");
	const input = question?.querySelector("input");
	if (!question || !input) throw new Error("Missing loaded form");
	input.value = "Paris";
	input.dispatchEvent(new Event("input", { bubbles: true }));
	expect(
		question.querySelector("[data-tp-closed-reading]")?.textContent,
	).toContain("Paris");
	question.querySelector<HTMLElement>('[data-action="submit"]')?.click();
	await vi.waitFor(() =>
		expect(
			question.querySelector('[data-tp-blank-result="success"]'),
		).not.toBeNull(),
	);
	question.mode = "closed";
	expect(question.querySelectorAll("[data-tp-closed-bank]")).toHaveLength(1);
});

it("ignores stale responses after src changes and reports unsupported formats", async () => {
	let finish: ((response: Response) => void) | undefined;
	vi.stubGlobal(
		"fetch",
		vi
			.fn()
			.mockImplementationOnce(
				() =>
					new Promise<Response>((resolve) => {
						finish = resolve;
					}),
			)
			.mockResolvedValue(
				new Response("<dl><dt>Prompt</dt><dd>Latest prompt</dd></dl>"),
			),
	);
	document.body.innerHTML = '<tp-question src="/old.html"></tp-question>';
	const question = document.querySelector("tp-question");
	question?.setAttribute("src", "/new.html");
	await vi.waitFor(() =>
		expect(question?.textContent).toContain("Latest prompt"),
	);
	finish?.(new Response("<dl><dt>Prompt</dt><dd>Old prompt</dd></dl>"));
	await new Promise((resolve) => setTimeout(resolve, 0));
	expect(question?.textContent).not.toContain("Old prompt");
	vi.spyOn(console, "error").mockImplementation(() => {});
	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue(new Response("unsupported")),
	);
	question?.setAttribute("src", "/unknown.txt");
	await vi.waitFor(() =>
		expect(question?.textContent).toContain("Unsupported question extension"),
	);
});

it("loads the complete general.md exercise without nesting questions", async () => {
	const source = readFileSync("public/docs/exercises/general.md", "utf8");
	vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(source)));
	document.body.innerHTML =
		'<tp-fill-blank-question mode="opened" partial src="/docs/exercises/general.md"></tp-fill-blank-question>';
	await vi.waitFor(() =>
		expect(document.querySelectorAll("tp-blank")).toHaveLength(19),
	);
	expect(document.querySelectorAll("tp-fill-blank-question")).toHaveLength(1);
	expect(
		document.querySelectorAll("tp-mathfield[mathlive][clearable]"),
	).toHaveLength(12);
	expect(document.querySelectorAll("[data-tp-closed-reading]")).toHaveLength(1);
});
