import { afterEach, describe, expect, it } from "vitest";
import { required } from "../../test-helpers/required.js";
import "./question.js";
import "../single-choice-question/single-choice-question.js";
import "../multi-choice-question/multi-choice-question.js";

/** Creates a question using the same list-based form in each subclass. */
function createQuestion(tag: string): HTMLElement {
	const question = document.createElement(tag);
	question.setAttribute("answer", "1");
	question.innerHTML =
		"<dl><dt>Prompt</dt><dd>Choose an answer.</dd><dt>Form</dt><dd><ul><li>First</li><li>Second</li></ul></dd><dt>Solution</dt><dd>First</dd></dl>";
	document.body.append(question);
	return question;
}

afterEach(() => document.body.replaceChildren());

describe.each([
	"tp-question",
	"tp-single-choice-question",
	"tp-multi-choice-question",
])("%s panel controls", (tag) => {
	it("starts with both panels visible and exposes native toggle states", () => {
		const question = createQuestion(tag);
		const header = required(
			question.querySelector("[data-tp-question-prompt-header]"),
		);
		expect(
			header.querySelector("[data-tp-question-prompt-label]")?.textContent,
		).toBe("Prompt");
		for (const name of ["input", "output"]) {
			const button = required(
				header.querySelector(`tp-icon-button[name="${name}"]`),
			);
			const native = required(button.querySelector("button"));
			expect(native.getAttribute("aria-pressed")).toBe("true");
			const panel = required(
				document.getElementById(native.getAttribute("aria-controls") ?? ""),
			);
			expect(panel.hidden).toBe(false);
		}
	});

	it("hides output without destroying its tabs, then restores it", () => {
		const question = createQuestion(tag);
		const button = required(
			question.querySelector<HTMLElement>('[data-panel-toggle="output"]'),
		);
		const panel = required(
			question.querySelector<HTMLElement>("[data-tp-question-feedback-panel]"),
		);
		const tabs = required(panel.querySelector("tp-tabs"));
		button.click();
		expect(panel.hidden).toBe(true);
		expect(button.querySelector("button")?.getAttribute("aria-pressed")).toBe(
			"false",
		);
		button.click();
		expect(panel.hidden).toBe(false);
		expect(panel.querySelector("tp-tabs")).toBe(tabs);
	});

	it("retains form nodes and prevents hiding the last visible panel", () => {
		const question = createQuestion(tag);
		const input = required(
			question.querySelector<HTMLElement>('[data-panel-toggle="input"]'),
		);
		const output = required(
			question.querySelector<HTMLElement>('[data-panel-toggle="output"]'),
		);
		const form = required(
			question.querySelector<HTMLElement>("[data-tp-question-form-panel]"),
		);
		const content = form.innerHTML;
		input.click();
		expect(form.hidden).toBe(true);
		output.click();
		expect(output.getAttribute("aria-pressed")).toBe("true");
		input.click();
		expect(form.hidden).toBe(false);
		expect(form.innerHTML).toBe(content);
	});

	it("removes listeners on disconnect and does not duplicate controls on reconnect", () => {
		const question = createQuestion(tag);
		const button = required(
			question.querySelector<HTMLElement>('[data-panel-toggle="output"]'),
		);
		question.remove();
		button.click();
		expect(button.getAttribute("aria-pressed")).toBe("true");
		document.body.append(question);
		expect(question.querySelectorAll("[data-panel-toggle]")).toHaveLength(2);
		button.click();
		expect(button.getAttribute("aria-pressed")).toBe("false");
	});
});

it("assigns different panel identifiers to multiple questions", () => {
	createQuestion("tp-question");
	createQuestion("tp-question");
	const ids = Array.from(document.querySelectorAll("[data-panel-toggle]")).map(
		(button) => button.getAttribute("aria-controls"),
	);
	expect(new Set(ids).size).toBe(4);
});
