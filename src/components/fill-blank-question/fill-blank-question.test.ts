import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderAsciidocToHtml } from "../asciidoc/asciidoc.js";
import { renderMarkdownToHtml } from "../markdown/markdown.js";
import "./fill-blank-question.js";

async function flush(): Promise<void> {
	await Promise.resolve();
	await new Promise((resolve) => window.setTimeout(resolve, 0));
	await Promise.resolve();
}

describe("tp-fill-blank-question", () => {
	it.each([
		"Complete the sentence.",
		"<strong>Write the capital.</strong>",
		"",
	])("shows a case-sensitive notice after any prompt: %s", (promptText) => {
		const question = document.createElement("tp-fill-blank-question");
		question.caseSensitive = true;
		question.innerHTML = `<dl><dt>Prompt</dt><dd>${promptText}</dd></dl>`;
		document.body.append(question);
		const prompt = question.querySelector("[data-tp-question-prompt-content]");
		expect(prompt?.innerHTML).toBe(promptText);
		expect(prompt?.nextElementSibling?.localName).toBe("tp-callout");
		expect(prompt?.nextElementSibling?.getAttribute("variant")).toBe("warning");
		expect(prompt?.nextElementSibling?.textContent).toContain(
			"Answers are case-sensitive",
		);
		question.remove();
		document.body.append(question);
		expect(
			question.querySelectorAll("[data-tp-case-sensitive-notice]"),
		).toHaveLength(1);
		question.caseSensitive = false;
		expect(
			question.querySelector("[data-tp-case-sensitive-notice]"),
		).toBeNull();
		question.setAttribute("case-sensitive", "false");
		expect(prompt?.nextElementSibling?.textContent).toContain(
			"Answers are case-sensitive",
		);
	});
	it.each([false, true])(
		"combines general and per-blank feedback with case-sensitive=%s",
		async (sensitive) => {
			const question = document.createElement("tp-fill-blank-question");
			question.setAttribute("answer", "Paris");
			question.caseSensitive = sensitive;
			expect(question.caseSensitive).toBe(sensitive);
			question.innerHTML = `<dl><dt>Form</dt><dd><tp-textfield name="capital" label="Capital" clearable></tp-textfield></dd>
		<dt>Feedback</dt><dd><p>Check the <strong>spelling</strong>.</p><ul><li>Remember the capital of France.</li></ul></dd></dl>`;
			document.body.append(question);
			await flush();
			const field = question.querySelector("tp-textfield");
			if (!field) throw new Error("Expected a field");
			const submit = question.querySelector(
				'tp-icon-button[data-action="submit"]',
			);
			field.value = "Oslo";
			submit?.dispatchEvent(new Event("click"));
			await flush();
			const output = question.querySelector(
				"[data-tp-question-feedback-output]",
			);
			expect(output?.textContent).toContain("Check the spelling.");
			expect(output?.querySelector("strong")?.textContent).toBe("spelling");
			expect(output?.textContent).toContain("Remember the capital of France.");
			field.value = "paris";
			submit?.dispatchEvent(new Event("click"));
			await flush();
			expect(
				output?.textContent?.includes("Congratulations, correct answer!"),
			).toBe(!sensitive);
			expect(
				output?.querySelector("[data-tp-question-feedback-list]") !== null,
			).toBe(sensitive);
			field.value = "Paris";
			submit?.dispatchEvent(new Event("click"));
			await flush();
			expect(output?.textContent).toContain(
				"🎉 Congratulations, correct answer!",
			);
			expect(
				output?.querySelector('tp-badge[variant="success"]')?.textContent,
			).toBe("1/1");
			expect(output?.textContent).not.toContain("Check the spelling.");
			question.setAttribute("case-sensitive", "false");
			expect(question.caseSensitive).toBe(true);
			question.caseSensitive = false;
			expect(question.hasAttribute("case-sensitive")).toBe(false);
		},
	);
	it.each(["md", "adoc"])(
		"renders a tp-textfield from the %s documentation example",
		async (extension) => {
			const source = readFileSync(
				`public/docs/components/fill-blank-question/examples/examples.${extension}`,
				"utf8",
			);
			const render =
				extension === "md" ? renderMarkdownToHtml : renderAsciidocToHtml;
			const outer = document.createElement("div");
			outer.innerHTML = await render(source);
			const inline = outer.querySelector("script")?.textContent;
			if (!inline) throw new Error("Expected viewer source");
			document.body.innerHTML = await render(inline);
			await flush();
			const field = document.querySelector(
				'tp-fill-blank-question tp-textfield[name="france"]',
			);
			expect(field?.hasAttribute("label")).toBe(false);
			expect(field?.querySelector("input")?.placeholder).toBe("City name");
			expect(field?.querySelector("input")?.getAttribute("aria-label")).toBe(
				"Capital of France",
			);
			expect(field?.querySelector("input")?.name).toBe("france");
		},
	);
	it("renders the documented introduction as an answerable question", async () => {
		const markdown = readFileSync(
			"public/docs/components/fill-blank-question/index.md",
			"utf8",
		);
		const example = markdown
			.split("## Usage")[0]
			?.match(
				/^<tp-fill-blank-question\b[^>]*>[\s\S]*?<\/tp-fill-blank-question>/m,
			)?.[0];
		if (!example) throw new Error("Expected a direct introductory question");
		document.body.innerHTML = example;
		await flush();
		const question = document.querySelector("tp-fill-blank-question");
		expect(question?.hasAttribute("answer")).toBe(false);
		expect(question?.caseSensitive).toBe(true);
		expect(
			question?.querySelector("[data-tp-question-prompt-content]")
				?.nextElementSibling?.textContent,
		).toBe(
			"Answers are case-sensitive: uppercase and lowercase letters must match.",
		);
		expect(
			question?.querySelector("[data-tp-question-form-content]")?.textContent,
		).toContain("The capital of France is");
		const input = question?.querySelector("input");
		if (!input) throw new Error("Expected an answer field");
		expect(question?.querySelector("tp-textfield label")).toBeNull();
		expect(input.placeholder).toBe("Capital");
		expect(input.getAttribute("aria-label")).toBe("Capital of France");
		expect(input.name).toBe("france-capital");
		expect(
			question?.querySelector("tp-textfield")?.hasAttribute("clearable"),
		).toBe(true);
		input.value = "Paris";
		const secondInput = question?.querySelector<HTMLInputElement>(
			'input[name="italy-capital"]',
		);
		if (!secondInput) throw new Error("Expected a second answer field");
		secondInput.value = "Rome";
		question
			?.querySelector('tp-icon-button[data-action="submit"]')
			?.dispatchEvent(new Event("click"));
		await flush();
		expect(
			question?.querySelector("[data-tp-question-feedback-output]")
				?.textContent,
		).toContain("Congratulations, correct answer!");
		expect(
			question?.querySelector("[data-tp-question-solution-content]")
				?.textContent,
		).toBe("The capital of France is Paris. The capital of Italy is Rome.");
	});
	let el: HTMLElement;

	beforeEach(() => {
		el = document.createElement("tp-fill-blank-question");
		document.body.innerHTML = "";
		vi.restoreAllMocks();
	});

	afterEach(() => {
		document.body.innerHTML = "";
	});

	describe("attribute: answer", () => {
		it("should parse comma-separated answers", () => {
			el.setAttribute("answer", "went,forgave,become");
			expect(el.getAttribute("answer")).toBe("went,forgave,become");
		});
	});

	describe("auto-wrap: ensureFillBlank", () => {
		it("preserves the original form content in the help source before wrapping it in tp-fill-blank", () => {
			el.innerHTML = `
        <dl>
          <dt>Title</dt><dd>Test</dd>
          <dt>Form</dt>
          <dd>
            <p>
              Yesterday, I <input name="blank1" placeholder="go"> to school,
              then I <input name="blank2" placeholder="forgive"> my friend.
            </p>
          </dd>
        </dl>
      `;
			document.body.append(el);

			const source = el.getAttribute("data-source") ?? "";

			expect(el.querySelector("tp-fill-blank")).not.toBeNull();
			expect(source).toContain("<dt>Form</dt>");
			expect(source).toContain(
				'<input name="blank1" placeholder="go"></input>',
			);
			expect(source).toContain(
				'<input name="blank2" placeholder="forgive"></input>',
			);
			expect(source).not.toContain("<tp-fill-blank>");
			expect(source).not.toContain("<tp-fill-blank ");
			expect(source).not.toContain("data-tp-fill-blank");
			el.remove();
		});

		it("should wrap inputs in tp-fill-blank if not already wrapped", () => {
			el.innerHTML = `
        <dl>
          <dt>Title</dt><dd>Test</dd>
          <dt>Form</dt><dd>
            <input name="blank1" placeholder="answer1">
            <input name="blank2" placeholder="answer2">
          </dd>
        </dl>
      `;
			document.body.append(el);
			const fillBlank = el.querySelector("tp-fill-blank");
			expect(fillBlank).toBeTruthy();
			expect(fillBlank?.querySelectorAll("input").length).toBe(2);
			el.remove();
		});

		it("should show error if no inputs/selects in Form", async () => {
			el.innerHTML = `
        <dl>
          <dt>Title</dt><dd>Test</dd>
          <dt>Form</dt><dd>
            <p>No inputs here</p>
          </dd>
        </dl>
      `;
			document.body.append(el);
			await new Promise((resolve) => setTimeout(resolve, 10));
			// Get the Form dd (second dd in the list)
			expect(el.textContent).toContain("ERROR");
			expect(el.textContent).toContain("input");
			el.remove();
		});

		it("should reuse existing tp-fill-blank", () => {
			el.innerHTML = `
        <dl>
          <dt>Title</dt><dd>Test</dd>
          <dt>Form</dt><dd>
            <tp-fill-blank>
              <input name="blank1">
            </tp-fill-blank>
          </dd>
        </dl>
      `;
			document.body.append(el);
			const fillBlanks = el.querySelectorAll("tp-fill-blank");
			expect(fillBlanks.length).toBe(1);
			el.remove();
		});
	});

	describe("submission", () => {
		it("should validate submitted answers", () => {
			el.setAttribute("answer", "went,forgave");
			el.innerHTML = `
        <dl>
          <dt>Title</dt><dd>Test</dd>
          <dt>Form</dt><dd>
            <input name="blank1" placeholder="go">
            <input name="blank2" placeholder="forgive">
          </dd>
        </dl>
      `;
			document.body.append(el);
			const inputs = el.querySelectorAll(
				"input",
			) as NodeListOf<HTMLInputElement>;
			if (inputs[0] && inputs[1]) {
				inputs[0].value = "went";
				inputs[1].value = "forgave";
			}
			el.remove();
		});

		it("shows score and specific feedback for wrong blanks", async () => {
			el.setAttribute("answer", "went,forgave");
			el.innerHTML = `
        <dl>
          <dt>Title</dt><dd>Test</dd>
          <dt>Form</dt><dd>
            <input name="blank1" placeholder="go">
            <input name="blank2" placeholder="forgive">
          </dd>
          <dt>Feedback</dt><dd>
            <ul>
              <li>First blank hint</li>
              <li>Second blank hint</li>
            </ul>
          </dd>
          <dt>Solution</dt><dd>done</dd>
        </dl>
      `;
			document.body.append(el);
			await Promise.resolve();

			const inputs = el.querySelectorAll(
				"input",
			) as NodeListOf<HTMLInputElement>;
			if (inputs[0] && inputs[1]) {
				inputs[0].value = "went";
				inputs[1].value = "wrong";
			}

			const submitButton = el.querySelector(
				'tp-icon-button[data-action="submit"]',
			);
			submitButton?.dispatchEvent(new Event("click"));
			await Promise.resolve();

			const feedback = el.querySelector("[data-tp-question-feedback-output]");
			const text = feedback?.textContent ?? "";
			expect(text).toContain("1/2");
			expect(
				feedback?.querySelector('tp-badge[variant="danger"]')?.textContent,
			).toBe("1/2");
			expect(text).toContain("Second blank hint");
			el.remove();
		});

		it("scores against current blank count when answer attribute has extra values", async () => {
			el.setAttribute("answer", "went,forgave,become,extra");
			el.innerHTML = `
        <dl>
          <dt>Title</dt><dd>Test</dd>
          <dt>Form</dt><dd>
            <input name="blank1" placeholder="go">
            <input name="blank2" placeholder="forgive">
          </dd>
          <dt>Feedback</dt><dd></dd>
          <dt>Solution</dt><dd>done</dd>
        </dl>
      `;
			document.body.append(el);
			await Promise.resolve();

			const inputs = el.querySelectorAll(
				"input",
			) as NodeListOf<HTMLInputElement>;
			if (inputs[0] && inputs[1]) {
				inputs[0].value = "went";
				inputs[1].value = "wrong";
			}

			const submitButton = el.querySelector(
				'tp-icon-button[data-action="submit"]',
			);
			submitButton?.dispatchEvent(new Event("click"));
			await Promise.resolve();

			const feedback = el.querySelector("[data-tp-question-feedback-output]");
			const text = feedback?.textContent ?? "";
			expect(text).toContain("1/2");
			expect(text).not.toContain("/4");
			el.remove();
		});

		it("loads blanks, answers, and feedback from src JSON", async () => {
			vi.stubGlobal(
				"fetch",
				vi.fn().mockResolvedValue({
					ok: true,
					json: async () => ({
						title: "Verbs",
						prompt: "Complete the sentence.",
						form: '<p>I <input name="blank1" placeholder="go"> there and <input name="blank2" placeholder="forgive"> him.</p>',
						feedback: ["First blank hint", "Second blank hint"],
						solution: "went, forgave",
						markup: "html",
						attributes: { answer: ["went", "forgave"] },
					}),
				}),
			);

			document.body.innerHTML =
				'<tp-fill-blank-question src="/fill-blank.json"></tp-fill-blank-question>';
			await flush();
			await flush();

			const question = document.querySelector(
				"tp-fill-blank-question",
			) as HTMLElement;
			const prompt = question.querySelector(
				"[data-tp-question-prompt-content]",
			);
			expect(prompt?.textContent).toContain("Complete the sentence.");
			const fillBlank = question.querySelector("tp-fill-blank");
			expect(fillBlank).not.toBeNull();

			const inputs = question.querySelectorAll(
				"input",
			) as NodeListOf<HTMLInputElement>;
			expect(inputs).toHaveLength(2);
			if (inputs[0] && inputs[1]) {
				inputs[0].value = "went";
				inputs[1].value = "wrong";
			}

			const submitButton = question.querySelector(
				'tp-icon-button[data-action="submit"]',
			);
			submitButton?.dispatchEvent(new Event("click"));
			await flush();

			const feedback = question.querySelector(
				"[data-tp-question-feedback-output]",
			);
			const text = feedback?.textContent ?? "";
			expect(text).toContain("1/2");
			expect(text).toContain("Second blank hint");
		});

		it("rejects an incomplete answer before recording an attempt", async () => {
			const detached = document.createElement(
				"tp-fill-blank-question",
			) as unknown as HTMLElement & {
				validateSubmit(value: unknown): string | null;
			};
			expect(detached.validateSubmit("")).toBe("Please fill in all blanks.");

			el.setAttribute("answer", "went,forgave");
			el.innerHTML = `
        <dl><dt>Title</dt><dd>Test</dd><dt>Form</dt><dd>
          <input name="first"><input name="second">
        </dd><dt>Feedback</dt><dd>Review the verbs.</dd><dt>Solution</dt><dd>done</dd></dl>`;
			document.body.append(el);
			await flush();

			const question = el as HTMLElement & {
				validateSubmit(value: unknown): string | null;
			};
			expect(question.validateSubmit("went,")).toBe(
				"Please fill in all blanks.",
			);
		});

		it("recognizes case-insensitive correct answers and exposes the solution", async () => {
			el.setAttribute("answer", "Went,Forgave");
			el.innerHTML = `
        <dl><dt>Title</dt><dd>Test</dd><dt>Form</dt><dd>
          <input name="first"><input name="second">
        </dd><dt>Solution</dt><dd>done</dd></dl>`;
			document.body.append(el);
			await flush();

			const inputs = el.querySelectorAll("input");
			(inputs[0] as HTMLInputElement).value = "went";
			(inputs[1] as HTMLInputElement).value = "forgave";
			el.querySelector('tp-icon-button[data-action="submit"]')?.dispatchEvent(
				new Event("click"),
			);
			await flush();

			const feedback = el.querySelector("[data-tp-question-feedback-output]");
			expect(feedback?.textContent).toContain(
				"Congratulations, correct answer!",
			);
			expect(
				feedback?.querySelector('tp-badge[variant="success"]')?.textContent,
			).toBe("2/2");
			const solutionTab = Array.from(
				el.querySelectorAll('tp-tabs [role="tab"]'),
			).find((tab) => tab.textContent === "Solution");
			expect(solutionTab?.hasAttribute("disabled")).toBe(false);
		});

		it("reports invalid src data and mismatched answer counts", async () => {
			const fetchMock = vi
				.fn()
				.mockResolvedValueOnce({ ok: true, json: async () => ({ title: 42 }) })
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({
						title: "Question",
						prompt: "Complete",
						form: '<input name="only">',
						attributes: { answer: ["one", "two"] },
					}),
				});
			vi.stubGlobal("fetch", fetchMock);

			document.body.innerHTML = `
        <tp-fill-blank-question src="/invalid.json"></tp-fill-blank-question>
        <tp-fill-blank-question src="/mismatch.json"></tp-fill-blank-question>`;
			await flush();
			await flush();

			expect(document.body.textContent).toContain("Invalid question file");
			expect(document.body.textContent).toContain("does not match blank count");
		});

		it("accepts a comma-separated source answer with default markdown and no feedback", async () => {
			vi.stubGlobal(
				"fetch",
				vi.fn().mockResolvedValue({
					ok: true,
					json: async () => ({
						prompt: "Complete **this** sentence.",
						form: 'I <input name="verb"> there.',
						attributes: { answer: "went" },
					}),
				}),
			);
			document.body.innerHTML =
				'<tp-fill-blank-question src="/markdown.json"></tp-fill-blank-question>';
			await flush();
			await flush();

			const question = document.querySelector(
				"tp-fill-blank-question",
			) as HTMLElement;
			expect(
				question.querySelector("[data-tp-question-prompt-content] strong"),
			).not.toBeNull();
			expect(question.querySelector("tp-fill-blank input")).not.toBeNull();
			expect(question.textContent).not.toContain("Invalid question file");
		});
	});
});
