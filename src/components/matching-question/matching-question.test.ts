import { afterEach, describe, expect, it, vi } from "vitest";
import type { TpMatching } from "../matching/matching.js";
import { TpMatchingQuestion } from "./matching-question.js";

/** Builds the same two-list definition as an author supplies in Form. */
function fixture(attributes = ""): TpMatchingQuestion {
	const element = new TpMatchingQuestion();
	if (attributes) element.setAttribute(attributes, "");
	element.innerHTML =
		"<dl><dt>Title</dt><dd>Translations</dd><dt>Prompt</dt><dd>Match the words.</dd><dt>Form</dt><dd><ul><li>Hello</li><li>Thanks</li><li>Goodbye</li></ul><ol><li>Bonjour</li><li>Merci</li><li>Au revoir</li></ol></dd><dt>Feedback</dt><dd><strong>Think about greetings.</strong></dd><dt>Solution</dt><dd>Hello means Bonjour.</dd></dl>";
	document.body.append(element);
	return element;
}
/** Resolves the reused widget with a helpful failure message. */
function widget(element: TpMatchingQuestion): TpMatching {
	const result = element.querySelector<TpMatching>("tp-matching");
	if (!result) throw new Error("Missing matching widget");
	return result;
}
/** Activates an inherited question action. */
function action(element: TpMatchingQuestion, name: string): void {
	const button = element.querySelector<HTMLElement>(`[data-action="${name}"]`);
	if (!button) throw new Error("Missing action");
	button.click();
}
/** Invokes a protected extension hook without weakening TypeScript checks. */
function invoke<T>(
	element: TpMatchingQuestion,
	method: string,
	...args: unknown[]
): T {
	const callback = Reflect.get(element, method) as (...values: unknown[]) => T;
	return callback.apply(element, args);
}
/** Gives reused tab/markdown components time to initialize. */
async function settle(): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, 30));
}
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe("tp-matching-question", () => {
	it("shows closable selection help and preserves dismissal and answers on reconnect", async () => {
		const question = fixture();
		await settle();
		const help = question.querySelector(
			"tp-callout[data-tp-matching-question-help]",
		);
		expect(help?.getAttribute("variant")).toBe("info");
		expect(help?.hasAttribute("closable")).toBe(true);
		expect(help?.textContent).toContain("Mouse:");
		expect(help?.textContent).toContain("Keyboard:");
		expect(help?.textContent).toContain("Shift+Tab");
		expect(help?.parentElement).toBe(
			question.querySelector("[data-tp-question-feedback-output]"),
		);
		expect(
			question.querySelector(
				"[data-tp-question-form-content] [data-tp-matching-question-help]",
			),
		).toBeNull();
		widget(question).value = [{ left: 1, right: 1 }];
		const value = widget(question).value;
		help?.querySelector<HTMLElement>("[data-tp-callout-close]")?.click();
		expect(help?.hasAttribute("hidden")).toBe(true);
		expect(widget(question).value).toEqual(value);
		question.remove();
		document.body.append(question);
		await settle();
		expect(
			question.querySelectorAll("[data-tp-matching-question-help]"),
		).toHaveLength(1);
		expect(help?.hasAttribute("hidden")).toBe(true);
		expect(widget(question).value).toEqual(value);
		action(question, "reset");
		expect(help?.hasAttribute("hidden")).toBe(true);
	});
	it("retains the same help when external source content replaces the lists", async () => {
		const question = fixture();
		const help = question.querySelector("[data-tp-matching-question-help]");
		const data = { prompt: "Match.", markup: "none", form: [["A"], ["B"]] };
		await invoke<Promise<void>>(question, "onSrcReady", data);
		expect(help?.parentElement).toBe(
			question.querySelector("[data-tp-question-feedback-output]"),
		);
		expect(
			question.querySelector(
				"[data-tp-question-form-content] [data-tp-matching-question-help]",
			),
		).toBeNull();
		expect(help?.hasAttribute("hidden")).toBe(false);
		help?.querySelector<HTMLElement>("[data-tp-callout-close]")?.click();
		await invoke<Promise<void>>(question, "onSrcReady", data);
		expect(question.querySelector("[data-tp-matching-question-help]")).toBe(
			help,
		);
		expect(help?.hasAttribute("hidden")).toBe(true);
	});

	it("grades complete multi-list groups and preserves titled author columns", async () => {
		const question = new TpMatchingQuestion();
		question.innerHTML =
			"<dl><dt>Form</dt><dd><dl><dt>Base</dt><dd><ul><li>be</li><li>have</li></ul></dd><dt>Past</dt><dd><ul><li>was</li><li>had</li></ul></dd><dt>Participle</dt><dd><ul><li>been</li><li>had</li></ul></dd><dt>French</dt><dd><ul><li>être</li><li>avoir</li></ul></dd></dl></dd></dl>";
		document.body.append(question);
		await settle();
		expect(widget(question).columnCount).toBe(4);
		widget(question).value = [
			{ items: [1, 1, null, 1] },
			{ items: [2, 2, 2, 2] },
		];
		action(question, "submit");
		expect(question.textContent).toContain("Associate every item");
		widget(question).value = [{ items: [1, 1, 2, 1] }, { items: [2, 2, 1, 2] }];
		action(question, "submit");
		await settle();
		expect(question.textContent).toContain("0/2");
		widget(question).value = [{ items: [1, 1, 1, 1] }, { items: [2, 2, 2, 2] }];
		action(question, "submit");
		await settle();
		expect(question.textContent).toContain("all groups are correct");
		action(question, "reset");
		expect(widget(question).value).toEqual([]);
		await invoke<Promise<void>>(question, "onSrcReady", {
			prompt: "Match.",
			markup: "none",
			headers: ["Base", "Past", "Participle", "French"],
			form: [["be"], ["was"], ["been"], ["être"]],
		});
		expect(widget(question).querySelectorAll("h3")).toHaveLength(4);
		expect(widget(question).itemCount).toBe(1);
		vi.spyOn(console, "error").mockImplementation(() => undefined);
		await invoke<Promise<void>>(question, "onSrcReady", {
			prompt: "Match.",
			headers: ["Missing"],
			form: [["be"], ["was"], ["been"]],
		});
		expect(question.textContent).toContain("one header per list");
	});
	it("accepts the neutral wrapper generated by an AsciiDoc open block", () => {
		const question = new TpMatchingQuestion();
		question.innerHTML =
			"<dl><dt>Form</dt><dd><div><ul><li>A</li></ul><ol><li>B</li></ol></div></dd></dl>";
		document.body.append(question);
		expect(
			widget(question).querySelectorAll(".tp-matching-controls"),
		).toHaveLength(2);
	});
	it("wraps author lists, validates completion and grades original ranks", async () => {
		const question = fixture();
		await settle();
		expect(question.getAttribute("data-source")).toContain("<dt>Form</dt>");
		expect(question.getAttribute("data-source")).not.toContain(
			"tp-matching-controls",
		);
		const submit = vi.fn();
		question.addEventListener("tp-question-submit", submit);
		action(question, "submit");
		expect(question.textContent).toContain("Associate every item");
		expect(submit).not.toHaveBeenCalled();
		widget(question).value = [
			{ left: 1, right: 1 },
			{ left: 2, right: 3 },
			{ left: 3, right: 2 },
		];
		action(question, "submit");
		await settle();
		expect(question.textContent).toContain("1/3");
		expect(question.textContent).toContain("Some pairs do not match");
		expect(
			question.querySelector("[data-tp-question-feedback-content]")
				?.textContent ?? question.textContent,
		).toContain("Think about greetings.");
		expect(submit.mock.calls[0]?.[0].detail.value).toEqual(
			widget(question).value,
		);
		action(question, "submit");
		expect(question.textContent).toContain("No change");
		widget(question).value = [
			{ left: 1, right: 1 },
			{ left: 2, right: 2 },
			{ left: 3, right: 3 },
		];
		action(question, "submit");
		await settle();
		expect(question.textContent).toContain("3/3");
		expect(question.textContent).toContain("Well done, all pairs are correct!");
		const output = invoke<HTMLElement>(
			question,
			"submitMessage",
			widget(question).value,
		);
		expect(output.textContent).not.toContain("Think about greetings.");
	});
	it("always reshuffles on reset and preserves the widget on reconnect", () => {
		const question = fixture();
		const matching = widget(question);
		matching.value = [{ left: 1, right: 1 }];
		vi.spyOn(Math, "random").mockReturnValue(0);
		action(question, "reset");
		expect(matching.value).toEqual([]);
		expect(matching.querySelector("ul > li")?.textContent).toContain("Thanks");
		vi.mocked(Math.random).mockReturnValue(0.999);
		action(question, "reset");
		expect(matching.querySelector("ul > li")?.textContent).toContain("Hello");
		action(question, "reset");
		question.remove();
		document.body.append(question);
		expect(question.querySelectorAll("tp-matching")).toHaveLength(1);
		expect(widget(question)).toBe(matching);
	});
	it("rejects missing, duplicate and malformed pairs and invalid lists", () => {
		const question = fixture();
		for (const value of [
			null,
			[{ left: 1, right: 1 }],
			[{ left: 1, right: 1 }, { left: 2, right: 2 }, null],
			[
				{ left: 0, right: 1 },
				{ left: 2, right: 2 },
				{ left: 3, right: 3 },
			],
			[
				{ left: 1, right: 1 },
				{ left: 1, right: 2 },
				{ left: 3, right: 3 },
			],
			[
				{ left: 1, right: 1 },
				{ left: 2, right: 1 },
				{ left: 3, right: 3 },
			],
		])
			expect(invoke(question, "validateSubmit", value)).toBeTruthy();
		widget(question).querySelector("ol > li")?.remove();
		expect(invoke(question, "validateSubmit", [])).toContain("same number");
		widget(question).remove();
		expect(invoke(question, "validateSubmit", [])).toContain("two nonempty");
	});
	it("accepts an explicitly authored tp-matching and uses general feedback only for wrong answers", async () => {
		const question = new TpMatchingQuestion();
		question.innerHTML =
			"<dl><dt>Form</dt><dd><tp-matching><ul><li>A</li><li>B</li></ul><ol><li>C</li><li>D</li></ol></tp-matching></dd></dl>";
		document.body.append(question);
		await settle();
		expect(question.querySelectorAll("tp-matching")).toHaveLength(1);
		const wrong = invoke<HTMLElement>(question, "submitMessage", [
			{ left: 1, right: 2 },
			{ left: 2, right: 1 },
		]);
		expect(wrong.textContent).toContain("0/2");
	});
	it("loads validated external questions with plain or HTML content", async () => {
		const data = {
			title: "External",
			prompt: "Match.",
			markup: "none",
			form: [
				["<b>A</b>", "B"],
				["C", "D"],
			],
			feedback: "Hint from JSON",
			solution: "A goes with C.",
		};
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: true, json: async () => data }),
		);
		const question = new TpMatchingQuestion();
		question.setAttribute("src", "/matching.json");
		document.body.append(question);
		await vi.waitFor(() =>
			expect(question.querySelector("tp-matching")).not.toBeNull(),
		);
		expect(widget(question).textContent).toContain("<b>A</b>");
		expect(widget(question).querySelector("b")).toBeNull();
		const result = invoke<HTMLElement>(question, "submitMessage", [
			{ left: 1, right: 2 },
			{ left: 2, right: 1 },
		]);
		expect(result.textContent).toContain("Hint from JSON");
		await invoke<Promise<void>>(question, "onSrcReady", {
			prompt: "Match.",
			markup: "html",
			form: [["<b>A</b>"], ["C"]],
		});
		expect(widget(question).querySelector("b")?.textContent).toBe("A");
		await invoke<Promise<void>>(question, "onSrcReady", {
			prompt: "Match.",
			form: [["A"], ["C"]],
		});
		expect(widget(question).querySelector("tp-markdown")).not.toBeNull();
	});
	it("reports source schema and fetch errors and ignores detached successful responses", async () => {
		vi.spyOn(console, "error").mockImplementation(() => undefined);
		const question = fixture();
		await invoke<Promise<void>>(question, "onSrcReady", {
			prompt: "Match.",
			form: [["A"], ["B", "C"]],
		});
		expect(question.textContent).toContain("Invalid matching question");
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: false, status: 404 }),
		);
		question.setAttribute("src", "/missing.json");
		await invoke<Promise<void>>(question, "loadSrc");
		expect(question.textContent).toContain("Failed to load");
		let finish: (value: object) => void = () => undefined;
		const response = new Promise<object>((resolve) => {
			finish = resolve;
		});
		vi.stubGlobal("fetch", vi.fn().mockReturnValue(response));
		const pending = invoke<Promise<void>>(question, "loadSrc");
		question.remove();
		finish({
			ok: true,
			json: async () => ({ prompt: "Later", form: [["A"], ["B"]] }),
		});
		await pending;
		expect(question.querySelector("tp-matching")).toBeNull();
		await invoke<Promise<void>>(new TpMatchingQuestion(), "onSrcReady", {
			prompt: "Match.",
			form: [["A"], ["B"]],
		});
	});
});

it("forwards heading and grades only the item lists", async () => {
	const question = new TpMatchingQuestion();
	question.heading = true;
	question.innerHTML =
		"<dl><dt>Form</dt><dd><ul><li>English</li><li>French</li></ul><ul><li>Hello</li><li>Thanks</li><li>Bye</li></ul><ul><li>Bonjour</li><li>Merci</li><li>Salut</li></ul></dd></dl>";
	document.body.append(question);
	await settle();
	expect(widget(question).heading).toBe(true);
	expect(widget(question).columnCount).toBe(2);
	expect(widget(question).itemCount).toBe(3);
	widget(question).value = [
		{ left: 1, right: 1 },
		{ left: 2, right: 2 },
		{ left: 3, right: 3 },
	];
	action(question, "submit");
	await settle();
	expect(question.textContent).toContain("3/3");
});
it("accepts a first header array in a heading source without including it in grading", async () => {
	const question = new TpMatchingQuestion();
	question.heading = true;
	question.innerHTML = "<dl><dt>Form</dt><dd></dd></dl>";
	document.body.append(question);
	await settle();
	await invoke(question, "onSrcReady", {
		prompt: "Match",
		form: [
			["English", "French"],
			["Hello", "Thanks", "Bye"],
			["Bonjour", "Merci", "Salut"],
		],
	});
	expect(widget(question).heading).toBe(true);
	expect(widget(question).columnCount).toBe(2);
	expect(widget(question).itemCount).toBe(3);
});
