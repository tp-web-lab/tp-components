import { afterEach, describe, expect, it, vi } from "vitest";

import "./multi-choice-question.js";
import { MultiChoiceQuestionSrcSchema } from "../question/question-src-schema.js";

async function flush(): Promise<void> {
	await Promise.resolve();
	await new Promise((resolve) => window.setTimeout(resolve, 0));
	await Promise.resolve();
}

afterEach(() => {
	document.body.innerHTML = "";
	vi.restoreAllMocks();
});

describe("tp-multi-choice-question feedback", () => {
	it("preserves the authored form list in the help source", async () => {
		document.body.innerHTML = `
      <tp-multi-choice-question answer="1,3">
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
              <li>Feedback A</li>
              <li>Feedback B</li>
              <li>Feedback C</li>
            </ul>
          </dd>
          <dt>Solution</dt><dd>A and C</dd>
        </dl>
      </tp-multi-choice-question>
    `;
		await flush();

		const question = document.querySelector(
			"tp-multi-choice-question",
		) as HTMLElement;
		const source = question.getAttribute("data-source") ?? "";

		expect(question.querySelector("tp-checkbox-list")).not.toBeNull();
		expect(source).toContain("<ul>");
		expect(source).toContain("<li>A</li>");
		expect(source).not.toContain("tp-checkbox-list");
		expect(source).not.toContain("data-choice-list");
	});

	it("shows attempt score and feedback for each selected choice", async () => {
		document.body.innerHTML = `
      <tp-multi-choice-question answer="1,3">
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
              <li>Feedback A</li>
              <li>Feedback B</li>
              <li>Feedback C</li>
            </ul>
          </dd>
          <dt>Solution</dt><dd>A and C</dd>
        </dl>
      </tp-multi-choice-question>
    `;
		await flush();

		const question = document.querySelector(
			"tp-multi-choice-question",
		) as HTMLElement;
		const widget = question.querySelector("tp-checkbox-list") as HTMLElement;
		widget.setAttribute("value", "1,2");

		const submitButton = question.querySelector(
			'tp-icon-button[data-action="submit"]',
		);
		submitButton?.dispatchEvent(new Event("click"));
		await flush();

		const feedback = question.querySelector(
			"[data-tp-question-feedback-output]",
		);
		const text = feedback?.textContent ?? "";
		expect(text).toContain("1/3");
		expect(text).toContain("Feedback A");
		expect(text).toContain("Feedback B");
	});

	it("shows only score line even when feedback list is missing", async () => {
		document.body.innerHTML = `
      <tp-multi-choice-question answer="1,3">
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
          <dd></dd>
          <dt>Solution</dt><dd>A and C</dd>
        </dl>
      </tp-multi-choice-question>
    `;
		await flush();

		const question = document.querySelector(
			"tp-multi-choice-question",
		) as HTMLElement;
		const widget = question.querySelector("tp-checkbox-list") as HTMLElement;
		widget.setAttribute("value", "2");

		const submitButton = question.querySelector(
			'tp-icon-button[data-action="submit"]',
		);
		submitButton?.dispatchEvent(new Event("click"));
		await flush();

		const feedback = question.querySelector(
			"[data-tp-question-feedback-output]",
		);
		const text = feedback?.textContent ?? "";
		expect(text).toContain("0/3");
	});

	it("preserves web components inside HTML feedback items", async () => {
		document.body.innerHTML = `
      <tp-multi-choice-question answer="1,3">
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
              <li>Feedback A</li>
              <li>Flag B <tp-icon name="fr" library="flags"></tp-icon></li>
              <li>Feedback C</li>
            </ul>
          </dd>
          <dt>Solution</dt><dd>A and C</dd>
        </dl>
      </tp-multi-choice-question>
    `;
		await flush();

		const question = document.querySelector(
			"tp-multi-choice-question",
		) as HTMLElement;
		const widget = question.querySelector("tp-checkbox-list") as HTMLElement;
		widget.setAttribute("value", "1,2");

		const submitButton = question.querySelector(
			'tp-icon-button[data-action="submit"]',
		);
		submitButton?.dispatchEvent(new Event("click"));
		await flush();
		await flush();

		const feedback = question.querySelector(
			"[data-tp-question-feedback-output]",
		);
		const icon = feedback?.querySelector('tp-icon[name="fr"][library="flags"]');
		expect(icon).not.toBeNull();
	});

	it("passes authoring attributes to the checkbox list and supports property setters", async () => {
		document.body.innerHTML = `
      <tp-multi-choice-question answer="1" name="topics" orientation="horizontal" value="2">
        <dl><dt>Title</dt><dd>Question</dd><dt>Form</dt><dd><ol><li>A</li><li>B</li></ol></dd></dl>
      </tp-multi-choice-question>`;
		await flush();

		const question = document.querySelector(
			"tp-multi-choice-question",
		) as HTMLElement & {
			answer: string;
			random: boolean;
			name: string;
			orientation: string;
			value: string;
		};
		const widget = question.querySelector("tp-checkbox-list") as HTMLElement;
		expect(widget.getAttribute("name")).toBe("topics");
		expect(widget.getAttribute("orientation")).toBe("horizontal");
		expect(widget.getAttribute("value")).toBe("2");

		question.answer = "2";
		question.random = true;
		question.name = "updated";
		question.orientation = "vertical";
		question.value = "1";
		expect(question.answer).toBe("2");
		expect(question.random).toBe(true);
		expect(question.getAttribute("name")).toBe("updated");
		expect(question.getAttribute("orientation")).toBe("vertical");
		expect(question.getAttribute("value")).toBe("1");
	});

	it("shows an authoring error when the Form section has no list", async () => {
		document.body.innerHTML = `
      <tp-multi-choice-question answer="1">
        <dl><dt>Title</dt><dd>Question</dd><dt>Form</dt><dd>Missing list</dd></dl>
      </tp-multi-choice-question>`;
		await flush();

		expect(document.body.textContent).toContain("requires a <ul> or <ol> list");
	});

	it("validates empty submissions and celebrates the exact correct selection", async () => {
		document.body.innerHTML = `
      <tp-multi-choice-question answer="1,3">
        <dl><dt>Title</dt><dd>Question</dd><dt>Form</dt><dd><ul><li>A</li><li>B</li><li>C</li></ul></dd>
        <dt>Solution</dt><dd>A and C</dd></dl>
      </tp-multi-choice-question>`;
		await flush();

		const question = document.querySelector(
			"tp-multi-choice-question",
		) as HTMLElement;
		const widget = question.querySelector("tp-checkbox-list") as HTMLElement;
		const submit = question.querySelector(
			'tp-icon-button[data-action="submit"]',
		);
		const validation = question as HTMLElement & {
			validateSubmit(value: unknown): string | null;
		};
		expect(validation.validateSubmit("")).toBeNull();
		expect(validation.validateSubmit(null)).toBeNull();
		submit?.dispatchEvent(new Event("click"));
		await flush();
		expect(
			question.querySelector("[data-tp-question-feedback-output]")?.textContent,
		).toContain("1/3");

		widget.setAttribute("value", "3,1");
		submit?.dispatchEvent(new Event("click"));
		await flush();
		const feedback = question.querySelector(
			"[data-tp-question-feedback-output]",
		);
		expect(feedback?.textContent).toContain("2/2");
		expect(feedback?.textContent).toContain("bonne réponse");
		const solutionTab = Array.from(
			question.querySelectorAll('tp-tabs [role="tab"]'),
		).find((tab) => tab.textContent === "Solution");
		expect(solutionTab?.hasAttribute("disabled")).toBe(false);
	});

	it("loads HTML source data, applies attributes, and keeps item-specific feedback", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({
					title: "<strong>Topics</strong>",
					prompt: "<em>Choose</em>",
					form: ["<b>A</b>", "B", "C"],
					feedback: ["Good A", "Wrong B", "Good C"],
					solution: "<u>A and C</u>",
					markup: "html",
					attributes: {
						answer: [1, 3],
						name: "topics",
						orientation: "horizontal",
						value: "2",
					},
				}),
			}),
		);
		document.body.innerHTML =
			'<tp-multi-choice-question src="/question.json"></tp-multi-choice-question>';
		await flush();
		await flush();

		const question = document.querySelector(
			"tp-multi-choice-question",
		) as HTMLElement;
		const widget = question.querySelector("tp-checkbox-list") as HTMLElement;
		expect(
			question.querySelector("[data-tp-question-prompt-content] em"),
		).not.toBeNull();
		expect(widget.querySelector("b")).not.toBeNull();
		expect(widget.getAttribute("name")).toBe("topics");
		expect(widget.getAttribute("orientation")).toBe("horizontal");
		widget.setAttribute("value", "2");
		question
			.querySelector('tp-icon-button[data-action="submit"]')
			?.dispatchEvent(new Event("click"));
		await flush();
		expect(
			question.querySelector("[data-tp-question-feedback-output]")?.textContent,
		).toContain("Wrong B");
	});

	it("reports malformed and out-of-range source answers", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce({ ok: true, json: async () => ({ title: 42 }) })
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					prompt: "Choose",
					form: ["A", "B"],
					attributes: { answer: "1,3" },
				}),
			});
		vi.stubGlobal("fetch", fetchMock);
		document.body.innerHTML = `
      <tp-multi-choice-question src="/invalid.json"></tp-multi-choice-question>
      <tp-multi-choice-question src="/range.json"></tp-multi-choice-question>`;
		await flush();
		await flush();

		expect(document.body.textContent).toContain("Invalid question file");
		expect(document.body.textContent).toContain("exceed form items count");
	});

	it("randomizes items deterministically and clears the selection", async () => {
		vi.spyOn(Math, "random").mockReturnValue(0);
		document.body.innerHTML = `
      <tp-multi-choice-question answer="1"><dl><dt>Title</dt><dd>Question</dd>
      <dt>Form</dt><dd><ul><li>A</li><li>B</li><li>C</li></ul></dd></dl></tp-multi-choice-question>`;
		await flush();
		const question = document.querySelector(
			"tp-multi-choice-question",
		) as HTMLElement & { randomize(): void };
		const widget = question.querySelector("tp-checkbox-list") as HTMLElement;
		widget.setAttribute("value", "1");
		question.randomize();

		expect(
			Array.from(widget.querySelectorAll("li")).map((item) => item.textContent),
		).toEqual(["B", "C", "A"]);
		expect(widget.getAttribute("value")).toBe("");
	});

	it("keeps an existing checkbox widget and safely ignores non-randomizable states", async () => {
		const detached = document.createElement(
			"tp-multi-choice-question",
		) as HTMLElement & {
			randomize(): void;
		};
		expect(() => detached.randomize()).not.toThrow();

		document.body.innerHTML = `
      <tp-multi-choice-question><dl><dt>Title</dt><dd>Question</dd><dt>Form</dt><dd>
        <tp-checkbox-list><ul><li>Only</li></ul></tp-checkbox-list>
      </dd></dl></tp-multi-choice-question>`;
		await flush();
		const question = document.querySelector(
			"tp-multi-choice-question",
		) as HTMLElement & {
			randomize(): void;
		};
		expect(question.querySelectorAll("tp-checkbox-list")).toHaveLength(1);
		expect(() => question.randomize()).not.toThrow();
	});

	it.each([
		["none", "<b>A</b>", false],
		["markdown", "**A**", true],
	])(
		"renders source items using %s markup",
		async (markup, item, expectsStrong) => {
			vi.stubGlobal(
				"fetch",
				vi.fn().mockResolvedValue({
					ok: true,
					json: async () => ({
						prompt: "Choose",
						form: [item, "B"],
						markup,
						attributes: { answer: "1" },
					}),
				}),
			);
			document.body.innerHTML =
				'<tp-multi-choice-question src="/markup.json"></tp-multi-choice-question>';
			await flush();
			await flush();

			const question = document.querySelector(
				"tp-multi-choice-question",
			) as HTMLElement;
			expect(
				question.querySelector("tp-checkbox-list li")?.textContent,
			).toContain(markup === "none" ? "<b>A</b>" : "A");
			expect(question.querySelector("tp-checkbox-list strong") !== null).toBe(
				expectsStrong,
			);
		},
	);
});

it("accepts no selected answers as a correct answer and unlocks the solution", async () => {
	document.body.innerHTML =
		'<tp-multi-choice-question answer=""><dl><dt>Form</dt><dd><ul><li>A</li><li>B</li></ul></dd><dt>Solution</dt><dd>Neither</dd></dl></tp-multi-choice-question>';
	await flush();
	const question = document.querySelector("tp-multi-choice-question");
	question?.querySelector<HTMLElement>('[data-action="submit"]')?.click();
	await flush();
	expect(
		question?.querySelector("[data-tp-question-feedback-output]")?.textContent,
	).toContain("2/2");
	expect(
		question?.querySelector("[data-tp-question-feedback-output]")?.textContent,
	).toContain("bonne réponse");
	const solution = Array.from(
		question?.querySelectorAll('[role="tab"]') ?? [],
	).find((tab) => tab.textContent === "Solution");
	expect(solution?.hasAttribute("disabled")).toBe(false);
});

it.each(["", []])(
	"accepts an empty correct answer in external JSON: %j",
	(answer) => {
		expect(
			MultiChoiceQuestionSrcSchema.safeParse({
				prompt: "Choose",
				form: ["A", "B"],
				attributes: { answer },
			}).success,
		).toBe(true);
	},
);
