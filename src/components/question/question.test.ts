import { afterEach, describe, expect, it } from "vitest";

import "../tabs/tabs.js";
import "./question.js";
import { TpQuestion } from "./question.js";

async function flush(): Promise<void> {
	await Promise.resolve();
}

describe("<tp-question>", () => {
	it("starts collapsed and synchronizes the boolean open attribute and disclosure", async () => {
		const question = new TpQuestion();
		question.innerHTML = "<dl><dt>Title</dt><dd>Question</dd></dl>";
		document.body.append(question);
		await flush();
		const details = question.querySelector("details");
		if (!details) throw new Error("Missing question disclosure");
		expect(details.open).toBe(false);
		question.setAttribute("open", "false");
		expect(details.open).toBe(true);
		question.removeAttribute("open");
		expect(details.open).toBe(false);
		question.open = true;
		expect(details.open).toBe(true);
		details.open = false;
		details.dispatchEvent(new Event("toggle"));
		expect(question.open).toBe(false);
		details.open = true;
		details.dispatchEvent(new Event("toggle"));
		expect(question.hasAttribute("open")).toBe(true);
	});

	it("honors open when present before connection", async () => {
		document.body.innerHTML =
			"<tp-question open><dl><dt>Title</dt><dd>Question</dd></dl></tp-question>";
		await flush();
		expect(document.querySelector("details")?.open).toBe(true);
	});
	it.each([
		"",
		"<dt>Solution</dt><dd>  </dd>",
		"<dt>Solution</dt><dd><p></p></dd>",
	])("warns when solution is absent or empty: %s", async (solution) => {
		document.body.innerHTML = `<tp-question><dl><dt>Prompt</dt><dd>Question</dd>${solution}</dl></tp-question>`;
		await flush();
		const panel = document.querySelector("[data-tp-question-solution-content]");
		expect(panel?.querySelector("tp-callout")?.getAttribute("variant")).toBe(
			"danger",
		);
		expect(panel?.textContent).toBe(
			"No solution is available for this question.",
		);
		expect(
			document
				.querySelector("[data-tp-question-solution-tab]")
				?.hasAttribute("disabled"),
		).toBe(false);
	});

	it("preserves a graphical solution without an absence notice", async () => {
		document.body.innerHTML =
			'<tp-question><dl><dt>Solution</dt><dd><svg aria-label="Solution diagram"></svg></dd></dl></tp-question>';
		await flush();
		expect(
			document.querySelector("[data-tp-question-solution-content] svg"),
		).not.toBeNull();
		expect(
			document.querySelector("[data-tp-question-missing-solution]"),
		).toBeNull();
	});

	it("replaces the absence notice with a loaded solution and restores it for an empty source", async () => {
		class SourceQuestion extends TpQuestion {
			/** Exposes the protected source update for this regression test. */
			setSolution(text: string): void {
				this.updateSrcSolution(text, "none");
			}
		}
		customElements.define("tp-question-solution-test", SourceQuestion);
		const element = document.createElement(
			"tp-question-solution-test",
		) as SourceQuestion;
		element.innerHTML = "<dl><dt>Prompt</dt><dd>Question</dd></dl>";
		document.body.append(element);
		await flush();
		element.setSolution("The answer is 42.");
		expect(
			element.querySelector("[data-tp-question-missing-solution]"),
		).toBeNull();
		expect(
			element.querySelector("[data-tp-question-solution-content]")?.textContent,
		).toBe("The answer is 42.");
		element.setSolution(" ");
		expect(
			element.querySelector("[data-tp-question-missing-solution]"),
		).not.toBeNull();
	});
	afterEach(() => {
		document.body.innerHTML = "";
		const styleEl = document.head.querySelector("#tp-question-styles");
		styleEl?.parentElement?.removeChild(styleEl);
	});

	it("extends TpBase", () => {
		const element = document.createElement("tp-question");

		expect(element).toBeInstanceOf(TpQuestion);
		expect(element).toBeInstanceOf(HTMLElement);
	});

	it("injects global style once", async () => {
		document.body.innerHTML = `
      <tp-question><dl><dt>Prompt</dt><dd>Q1</dd></dl></tp-question>
      <tp-question><dl><dt>Prompts</dt><dd>Q2</dd></dl></tp-question>
    `;
		await flush();

		expect(document.head.querySelectorAll("#tp-question-styles")).toHaveLength(
			1,
		);
	});

	it("normalizes source sections and adds default title", async () => {
		document.body.innerHTML = `
      <tp-question>
        <dl>
          <dt>Question</dt>
          <dd>What is 2 + 2?</dd>
          <dt>Forms</dt>
          <dd><tp-radio-list></tp-radio-list></dd>
        </dl>
      </tp-question>
    `;
		await flush();

		const element = document.querySelector("tp-question") as TpQuestion;
		const list = element.querySelector("details > dl[data-tp-question-source]");
		const headings = Array.from(
			list?.querySelectorAll(":scope > dt") ?? [],
		).map((node) => node.textContent?.trim() ?? "");

		expect(headings).toEqual([
			"Title",
			"Prompt",
			"Form",
			"Feedback",
			"Solution",
		]);
		expect(element.titleSection?.textContent?.trim()).toBe("Question");
	});

	it("renders details summary from title and builds tabs panel", async () => {
		document.body.innerHTML = `
      <tp-question>
        <dl>
          <dt>Title</dt>
          <dd>Arithmetic</dd>
          <dt>Prompt</dt>
          <dd><p>Compute 3 × 3.</p></dd>
          <dt>Form</dt>
          <dd><tp-fill-blank></tp-fill-blank></dd>
          <dt>Feedback</dt>
          <dd><p>Great job.</p></dd>
          <dt>Solution</dt>
          <dd><p>9</p></dd>
        </dl>
      </tp-question>
    `;
		await flush();

		const element = document.querySelector("tp-question") as TpQuestion;
		const summary = element.querySelector("details > summary");
		const panels = element.querySelector("[data-tp-question-panels]");
		const tabs = element.querySelector(
			"[data-tp-question-feedback-panel] tp-tabs",
		);
		const tabLabels = Array.from(
			tabs?.querySelectorAll('[role="tab"]') ?? [],
		).map((node) => node.textContent?.trim());

		expect(summary?.textContent?.trim()).toBe("Arithmetic");
		expect(summary?.querySelector("tp-icon")?.getAttribute("name")).toBe(
			"question",
		);
		expect(summary?.querySelector("tp-icon")?.getAttribute("library")).toBe(
			"components",
		);
		expect(summary?.querySelector("tp-icon")?.getAttribute("size")).toBe(
			"1.25em",
		);
		expect(
			summary?.querySelector("[data-tp-question-title]")?.textContent,
		).toBe("Arithmetic");
		expect(panels?.tagName).toBe("TP-SWITCHER");
		expect(panels?.getAttribute("threshold")).toBe("48rem");
		expect(
			element.querySelector("[data-tp-question-prompt] p")?.textContent,
		).toContain("3 × 3");
		expect(
			element.querySelector("[data-tp-question-form-content] tp-fill-blank"),
		).not.toBeNull();
		expect(tabLabels).toEqual(["Feedback", "Solution"]);
		expect(
			element.querySelector("[data-tp-question-feedback-output]")?.textContent,
		).toContain(
			"Feedback will only be provided once you have submitted an answer to the question.",
		);
		expect(
			element
				.querySelector("[data-tp-question-feedback-output] tp-callout")
				?.getAttribute("variant"),
		).toBe("warning");
	});

	it("renders reset and submit buttons with a message zone", async () => {
		document.body.innerHTML = `
      <tp-question>
        <dl>
          <dt>Prompt</dt>
          <dd>Pick one.</dd>
          <dt>Form</dt>
          <dd><tp-radio-list><ul><li>A</li></ul></tp-radio-list></dd>
          <dt>Feedback</dt>
          <dd>Ok</dd>
          <dt>Solution</dt>
          <dd>A</dd>
        </dl>
      </tp-question>
    `;
		await flush();

		const element = document.querySelector("tp-question") as TpQuestion;
		const resetButton = element.querySelector(
			'tp-icon-button[data-action="reset"]',
		);
		const submitButton = element.querySelector(
			'tp-icon-button[data-action="submit"]',
		);
		const message = element.querySelector("[data-tp-question-message]");

		expect(resetButton?.getAttribute("name")).toBe("refresh");
		expect(submitButton?.getAttribute("name")).toBe("play-arrow");
		expect(message).not.toBeNull();
	});

	it("renders submit feedback in feedback tab and activates feedback panel", async () => {
		document.body.innerHTML = `
      <tp-question>
        <dl>
          <dt>Prompt</dt>
          <dd>Pick one.</dd>
          <dt>Form</dt>
          <dd><input value="A"></dd>
          <dt>Feedback</dt>
          <dd><p>Think about <strong>encapsulation</strong> and reuse.</p></dd>
          <dt>Solution</dt>
          <dd>Solution text</dd>
        </dl>
      </tp-question>
    `;
		await flush();

		const element = document.querySelector("tp-question") as TpQuestion;
		const tabs = element.querySelector(
			"tp-tabs[data-tp-question-tabs]",
		) as HTMLElement & {
			selected?: number;
		};
		const solutionTab = element.querySelector(
			"[data-tp-question-solution-tab]",
		) as HTMLElement;
		expect(solutionTab.hasAttribute("disabled")).toBe(false);
		expect(solutionTab.getAttribute("role")).toBe("tab");
		expect(tabs.querySelectorAll('[role="tab"]')).toHaveLength(2);
		expect(tabs.querySelectorAll('[role="tabpanel"]')).toHaveLength(2);
		expect(tabs.querySelector("dl, dt, dd")).toBeNull();
		solutionTab.click();
		expect(solutionTab.getAttribute("aria-selected")).toBe("true");
		expect(
			tabs.querySelector("[data-tp-question-solution-content]")?.textContent,
		).toBe("Solution text");
		tabs.setAttribute("selected", "1");

		const submitButton = element.querySelector(
			'tp-icon-button[data-action="submit"]',
		);
		submitButton?.dispatchEvent(new Event("click"));
		await flush();

		const output = element.querySelector("[data-tp-question-feedback-output]");
		const leftMessage = element.querySelector("[data-tp-question-message]");
		expect(output?.textContent).toBe("Think about encapsulation and reuse.");
		expect(output?.querySelector("strong")?.textContent).toBe("encapsulation");
		expect(leftMessage?.textContent).toContain("submitted");
		expect(leftMessage?.querySelector("tp-badge")?.textContent).toBe("1");
		expect(tabs.getAttribute("selected")).toBe("0");
		const input = element.querySelector("input");
		if (!input) throw new Error("Expected the answer input");
		input.value = "B";
		submitButton?.dispatchEvent(new Event("click"));
		await flush();
		expect(output?.textContent).toBe("Think about encapsulation and reuse.");
		expect(
			element.querySelector("[data-tp-question-feedback-source]")?.textContent,
		).toBe("Think about encapsulation and reuse.");
	});

	it("shows danger callout when no specific feedback is provided", async () => {
		document.body.innerHTML = `
      <tp-question>
        <dl>
          <dt>Prompt</dt>
          <dd>Pick one.</dd>
          <dt>Form</dt>
          <dd><input value="A"></dd>
          <dt>Feedback</dt>
          <dd></dd>
          <dt>Solution</dt>
          <dd>A</dd>
        </dl>
      </tp-question>
    `;
		await flush();

		const element = document.querySelector("tp-question") as TpQuestion;
		const callout = element.querySelector(
			"[data-tp-question-feedback-output] tp-callout",
		);
		expect(callout?.getAttribute("variant")).toBe("danger");
		expect(callout?.textContent).toContain(
			"No specific feedback is available for this question.",
		);

		const submitButton = element.querySelector(
			'tp-icon-button[data-action="submit"]',
		);
		submitButton?.dispatchEvent(new Event("click"));
		await flush();

		const output = element.querySelector("[data-tp-question-feedback-output]");
		expect(output?.querySelector("tp-callout")?.getAttribute("variant")).toBe(
			"danger",
		);
		expect(output?.textContent).toContain("Submitted.");
	});
});
