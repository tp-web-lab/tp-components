import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import "./single-choice-question.js";
import type { TpSingleChoiceQuestion } from "./single-choice-question.js";

async function flush(): Promise<void> {
	await Promise.resolve();
	await new Promise((resolve) => window.setTimeout(resolve, 0));
	await Promise.resolve();
}

beforeEach(() => {
	document.body.innerHTML = "";
	vi.restoreAllMocks();
});

afterEach(() => {
	document.body.innerHTML = "";
});

describe("tp-single-choice-question feedback", () => {
	it("preserves the original form list in the help source before wrapping it in tp-radio-list", async () => {
		document.body.innerHTML = `
      <tp-single-choice-question answer="1" random>
        <dl>
          <dt>Title</dt><dd>Capital of France</dd>
          <dt>Prompt</dt><dd>What is the capital of France?</dd>
          <dt>Form</dt>
          <dd>
            <ul data-choice-list="tp-md-choice-list-1">
              <li>Paris</li>
              <li>London</li>
              <li>Berlin</li>
            </ul>
          </dd>
          <dt>Feedback</dt>
          <dd>
            <ul data-choice-list="tp-md-choice-list-2">
              <li>Paris is indeed the capital of France.</li>
              <li>London is the capital of Great Britain.</li>
              <li>Berlin is the capital of Germany.</li>
            </ul>
          </dd>
          <dt>Solution</dt><dd>Paris is the capital of France.</dd>
        </dl>
      </tp-single-choice-question>
    `;
		await flush();

		const question = document.querySelector(
			"tp-single-choice-question",
		) as HTMLElement;
		const source = question.getAttribute("data-source") ?? "";

		expect(question.querySelector("tp-radio-list")).not.toBeNull();
		expect(source).toContain("<dt>Form</dt>");
		expect(source).toContain("<ul>");
		expect(source).toContain("<li>Paris</li>");
		expect(source).not.toContain("data-choice-list");
		expect(source).not.toContain("<tp-radio-list");
		expect(source).not.toContain("data-tp-radio-list");
	});

	it("shows 0/1 score and specific feedback for a wrong selected item", async () => {
		document.body.innerHTML = `
      <tp-single-choice-question answer="2">
        <dl>
          <dt>Title</dt><dd>Question</dd>
          <dt>Prompt</dt><dd>Choose.</dd>
          <dt>Form</dt>
          <dd>
            <ul>
              <li>A</li>
              <li>B</li>
              <li>C</li>
            </ul>
          </dd>
          <dt>Feedback</dt>
          <dd>
            <ul>
              <li><strong>Indice A</strong></li>
              <li>Indice B</li>
              <li>Indice C</li>
            </ul>
          </dd>
          <dt>Solution</dt><dd>B</dd>
        </dl>
      </tp-single-choice-question>
    `;
		await flush();

		const question = document.querySelector(
			"tp-single-choice-question",
		) as HTMLElement;
		const widget = question.querySelector("tp-radio-list") as HTMLElement & {
			value?: string;
		};
		widget.setAttribute("value", "1");

		const submitButton = question.querySelector(
			'tp-icon-button[data-action="submit"]',
		);
		submitButton?.dispatchEvent(new Event("click"));
		await flush();

		const feedback = question.querySelector(
			"[data-tp-question-feedback-output]",
		);
		const text = feedback?.textContent ?? "";
		expect(text).toContain("0/1");
		expect(text).toContain("Indice A");
		expect(feedback?.querySelector("strong")?.textContent).toBe("Indice A");
		expect(text).not.toContain("<strong>");
	});

	it("renders src content as plain text when markup is none", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({
					title: "Question <strong>1</strong>",
					prompt: "<strong>Choose.</strong>",
					form: ["<em>A</em>", "B"],
					feedback: ["<span>Feedback A</span>", "Feedback B"],
					solution: "<u>Solution</u>",
					markup: "none",
					attributes: { answer: "2" },
				}),
			}),
		);

		document.body.innerHTML =
			'<tp-single-choice-question src="/question.json"></tp-single-choice-question>';
		await flush();
		await flush();

		const question = document.querySelector(
			"tp-single-choice-question",
		) as HTMLElement;
		const prompt = question.querySelector("[data-tp-question-prompt-content]");
		expect(
			question.querySelector("summary tp-icon")?.getAttribute("name"),
		).toBe("single-choice-question");
		expect(prompt?.querySelector("strong")).toBeNull();
		expect(prompt?.querySelector("tp-markdown")).toBeNull();
		expect(prompt?.textContent).toContain("<strong>Choose.</strong>");

		const firstItem = question.querySelector("tp-radio-list li");
		expect(firstItem?.querySelector("em")).toBeNull();
		expect(firstItem?.querySelector("tp-markdown")).toBeNull();
		expect(firstItem?.textContent).toContain("<em>A</em>");

		const widget = question.querySelector("tp-radio-list") as HTMLElement;
		widget.setAttribute("value", "1");
		question
			.querySelector('tp-icon-button[data-action="submit"]')
			?.dispatchEvent(new Event("click"));
		await flush();
		await flush();

		const feedback = question.querySelector(
			"[data-tp-question-feedback-output]",
		);
		expect(feedback?.querySelector("tp-markdown")).toBeNull();
		expect(feedback?.textContent).toContain("<span>Feedback A</span>");
	});

	it("renders src content as HTML when markup is html", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({
					title: "Question <strong>1</strong>",
					prompt: "<strong>Choose.</strong>",
					form: ["<em>A</em>", "B"],
					feedback: ["<span>Feedback A</span>", "Feedback B"],
					solution: "<u>Solution</u>",
					markup: "html",
					attributes: { answer: "2" },
				}),
			}),
		);

		document.body.innerHTML =
			'<tp-single-choice-question src="/question.json"></tp-single-choice-question>';
		await flush();
		await flush();

		const question = document.querySelector(
			"tp-single-choice-question",
		) as HTMLElement;
		const prompt = question.querySelector("[data-tp-question-prompt-content]");
		expect(prompt?.querySelector("strong")).not.toBeNull();

		const firstItem = question.querySelector("tp-radio-list li");
		expect(firstItem?.querySelector("em")).not.toBeNull();

		const widget = question.querySelector("tp-radio-list") as HTMLElement;
		widget.setAttribute("value", "1");
		question
			.querySelector('tp-icon-button[data-action="submit"]')
			?.dispatchEvent(new Event("click"));
		await flush();
		await flush();

		const feedback = question.querySelector(
			"[data-tp-question-feedback-output]",
		);
		expect(feedback?.querySelector("span")).not.toBeNull();
	});

	it("shows src form items with default markdown markup", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({
					title: "Capital France",
					prompt: "What is the capital of France?",
					form: ["Paris", "London", "Berlin", "Rome", "Madrid"],
					feedback: [
						"Paris is indeed the capital of France.",
						"London is the capital of Great Britain.",
						"Berlin is the capital of Germany.",
						"Rome is the capital of Italy.",
						"Madrid is the capital of Spain.",
					],
					solution: "Paris is the capital of France.",
					attributes: { answer: "1", random: true },
				}),
			}),
		);

		document.body.innerHTML =
			'<tp-single-choice-question src="/question.json"></tp-single-choice-question>';
		await flush();
		await flush();

		const question = document.querySelector(
			"tp-single-choice-question",
		) as HTMLElement;
		const items = Array.from(question.querySelectorAll("tp-radio-list li"));
		expect(items).toHaveLength(5);
		expect(
			items.map((item) => item.textContent?.replace(/\s+/g, " ").trim()),
		).toEqual(
			expect.arrayContaining(["Paris", "London", "Berlin", "Rome", "Madrid"]),
		);
	});

	it("passes authoring attributes to the radio list and supports property setters", async () => {
		document.body.innerHTML = `
      <tp-single-choice-question answer="1" name="capital" orientation="horizontal" value="2">
        <dl><dt>Title</dt><dd>Question</dd><dt>Form</dt><dd><ol><li>A</li><li>B</li></ol></dd></dl>
      </tp-single-choice-question>`;
		await flush();

		const question = document.querySelector(
			"tp-single-choice-question",
		) as HTMLElement & {
			answer: number;
			random: boolean;
			name: string;
			orientation: string;
			value: string;
		};
		const widget = question.querySelector("tp-radio-list") as HTMLElement;
		expect(widget.getAttribute("name")).toBe("capital");
		expect(widget.getAttribute("orientation")).toBe("horizontal");
		expect(widget.getAttribute("value")).toBe("2");

		question.answer = 2;
		question.random = true;
		question.name = "updated";
		question.orientation = "vertical";
		question.value = "1";
		expect(question.answer).toBe(2);
		expect(question.random).toBe(true);
		expect(question.getAttribute("name")).toBe("updated");
		expect(question.getAttribute("orientation")).toBe("vertical");
		expect(question.getAttribute("value")).toBe("1");
	});

	it("shows an authoring error when the Form section has no list", async () => {
		document.body.innerHTML = `
      <tp-single-choice-question answer="1">
        <dl><dt>Title</dt><dd>Question</dd><dt>Form</dt><dd>Missing list</dd></dl>
      </tp-single-choice-question>`;
		await flush();

		expect(document.body.textContent).toContain("requires a <ul> or <ol> list");
	});

	it("validates empty submissions and unlocks the solution for the correct answer", async () => {
		document.body.innerHTML = `
      <tp-single-choice-question answer="2"><dl><dt>Title</dt><dd>Question</dd>
      <dt>Form</dt><dd><ul><li>A</li><li>B</li><li>C</li></ul></dd>
      <dt>Solution</dt><dd>B</dd></dl></tp-single-choice-question>`;
		await flush();

		const question = document.querySelector(
			"tp-single-choice-question",
		) as HTMLElement;
		const widget = question.querySelector("tp-radio-list") as HTMLElement;
		const submit = question.querySelector(
			'tp-icon-button[data-action="submit"]',
		);
		const validation = question as HTMLElement & {
			validateSubmit(value: unknown): string | null;
		};
		expect(validation.validateSubmit("")).toBe("Please select an item.");
		expect(validation.validateSubmit("0")).toBe("Please select an item.");

		widget.setAttribute("value", "2");
		submit?.dispatchEvent(new Event("click"));
		await flush();
		const feedback = question.querySelector(
			"[data-tp-question-feedback-output]",
		);
		expect(feedback?.textContent).toContain("1/1");
		expect(feedback?.textContent).toContain("right answer");
		const solutionTab = Array.from(
			question.querySelectorAll('tp-tabs [role="tab"]'),
		).find((tab) => tab.textContent === "Solution");
		expect(solutionTab?.hasAttribute("disabled")).toBe(false);
	});

	it("loads all source attributes and rejects an out-of-range answer", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					title: "Question",
					prompt: "Choose",
					form: ["A", "B"],
					feedback: ["FA", "FB"],
					solution: "B",
					attributes: {
						answer: "2",
						name: "choice",
						orientation: "horizontal",
						value: "1",
					},
				}),
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					prompt: "Choose",
					form: ["A", "B"],
					attributes: { answer: "3" },
				}),
			});
		vi.stubGlobal("fetch", fetchMock);
		document.body.innerHTML = `
      <tp-single-choice-question src="/valid.json"></tp-single-choice-question>
      <tp-single-choice-question src="/range.json"></tp-single-choice-question>`;
		await flush();
		await flush();

		const valid = document.querySelector(
			"tp-single-choice-question",
		) as HTMLElement;
		const widget = valid.querySelector("tp-radio-list") as HTMLElement;
		expect(widget.getAttribute("name")).toBe("choice");
		expect(widget.getAttribute("orientation")).toBe("horizontal");
		expect(widget.getAttribute("value")).toBe("1");
		expect(document.body.textContent).toContain("exceeds form items count");
	});

	it("randomizes items deterministically and clears the selection", async () => {
		vi.spyOn(Math, "random").mockReturnValue(0);
		document.body.innerHTML = `
      <tp-single-choice-question answer="1"><dl><dt>Title</dt><dd>Question</dd>
      <dt>Form</dt><dd><ul><li>A</li><li>B</li><li>C</li></ul></dd></dl></tp-single-choice-question>`;
		await flush();
		const question = document.querySelector(
			"tp-single-choice-question",
		) as HTMLElement & { randomize(): void };
		const widget = question.querySelector("tp-radio-list") as HTMLElement;
		widget.setAttribute("value", "1");
		question.randomize();

		expect(
			Array.from(widget.querySelectorAll("li")).map((item) => item.textContent),
		).toEqual(["B", "C", "A"]);
		expect(widget.getAttribute("value")).toBe("");
	});

	it("keeps an existing radio widget and safely ignores non-randomizable states", async () => {
		const detached = document.createElement(
			"tp-single-choice-question",
		) as TpSingleChoiceQuestion & {
			randomize(): void;
		};
		expect(() => detached.randomize()).not.toThrow();

		document.body.innerHTML = `
      <tp-single-choice-question><dl><dt>Title</dt><dd>Question</dd><dt>Form</dt><dd>
        <tp-radio-list><ul><li>Only</li></ul></tp-radio-list>
      </dd></dl></tp-single-choice-question>`;
		await flush();
		const question = document.querySelector(
			"tp-single-choice-question",
		) as TpSingleChoiceQuestion & {
			randomize(): void;
		};
		expect(question.answer).toBe(0);
		expect(question.name).toBe("");
		expect(question.orientation).toBe("");
		expect(question.value).toBe("");
		expect(question.querySelectorAll("tp-radio-list")).toHaveLength(1);
		expect(() => question.randomize()).not.toThrow();
	});

	it("randomizes again when the user resets a random question", async () => {
		vi.spyOn(Math, "random").mockReturnValue(0);
		document.body.innerHTML = `
      <tp-single-choice-question answer="1" random><dl><dt>Title</dt><dd>Question</dd>
      <dt>Form</dt><dd><ul><li>A</li><li>B</li><li>C</li></ul></dd></dl></tp-single-choice-question>`;
		await flush();
		const question = document.querySelector(
			"tp-single-choice-question",
		) as HTMLElement;
		const before = Array.from(
			question.querySelectorAll("tp-radio-list li"),
		).map((item) => item.textContent);
		question
			.querySelector('tp-icon-button[data-action="reset"]')
			?.dispatchEvent(new Event("click"));
		await flush();
		const after = Array.from(question.querySelectorAll("tp-radio-list li")).map(
			(item) => item.textContent,
		);
		expect(after).not.toEqual(before);
	});
});
