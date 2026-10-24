import { afterEach, expect, it, vi } from "vitest";
import { getBlankFields } from "../fill-blank/fields.js";
import type { TpFillBlank } from "../fill-blank/fill-blank.js";
import "./fill-blank-question.js";

const sentence = "The woman moves a box while her colleague checks a list.";
afterEach(() => {
	document.body.replaceChildren();
	vi.useRealTimers();
});
it.each([
	"<textarea></textarea>",
	'<tp-textfield multiline clearable rows="6"></tp-textfield>',
])("counts, submits and resets one multiline answer: %s", (control) => {
	document.body.innerHTML = `<tp-fill-blank-question open><dl><dt>Answers</dt><dd><ol><li>${sentence}</li></ol></dd><dt>Form</dt><dd>${control}</dd><dt>Solution</dt><dd>${sentence}</dd></dl></tp-fill-blank-question>`;
	const form = document.querySelector<TpFillBlank>("tp-fill-blank");
	if (!form) throw new Error("Missing form");
	const fields = getBlankFields(form);
	expect(fields).toHaveLength(1);
	const field = fields[0];
	if (!field) throw new Error("Missing field");
	const submit = document.querySelector<HTMLElement>('[data-action="submit"]');
	submit?.click();
	expect(document.body.textContent).toContain("Please fill in the blank.");
	const changed = vi.fn();
	form.addEventListener("tp-fill-blank-change", changed);
	field.value = sentence;
	field.dispatchEvent(new Event("input", { bubbles: true }));
	expect(changed).toHaveBeenCalled();
	expect(form.value.get(field.name)).toBe(sentence);
	submit?.click();
	expect(
		document.querySelector("[data-tp-question-feedback-output]")?.textContent,
	).toContain("1/1");
	form.reset();
	expect(field.value).toBe("");
});
it("keeps the timed solution locked after a correct submission", () => {
	vi.useFakeTimers();
	document.body.innerHTML = `<tp-fill-blank-question open timing="00:00:02"><dl><dt>Answers</dt><dd><ol><li>${sentence}</li></ol></dd><dt>Form</dt><dd><tp-textfield multiline></tp-textfield></dd><dt>Solution</dt><dd>${sentence}</dd></dl></tp-fill-blank-question>`;
	document.querySelector<HTMLElement>("tp-mask tp-button")?.click();
	const field = document.querySelector("textarea");
	if (!field) throw new Error("Missing textarea");
	field.value = sentence;
	document.querySelector<HTMLElement>('[data-action="submit"]')?.click();
	expect(
		document
			.querySelector("[data-tp-question-solution-tab]")
			?.hasAttribute("disabled"),
	).toBe(true);
	vi.advanceTimersByTime(2000);
	document.querySelector<HTMLElement>("tp-mask tp-button")?.click();
	expect(
		document
			.querySelector("[data-tp-question-solution-tab]")
			?.hasAttribute("disabled"),
	).toBe(false);
});
