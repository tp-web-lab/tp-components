import { afterEach, expect, it, vi } from "vitest";
import type { TpBlank } from "../blank/blank.js";
import "./fill-blank-question.js";
import { getBlankFields } from "../fill-blank/fields.js";

vi.mock("./math-checker.js", () => ({
	createMathChecker: () => (value: string, expected: string) =>
		value === expected,
}));
afterEach(() => document.body.replaceChildren());
function required<T>(value: T | null | undefined): T {
	if (value == null) throw new Error("Missing test control");
	return value;
}
function setup() {
	document.body.innerHTML = `<tp-fill-blank-question partial><dl><dt>Answers</dt><dd><ol><li>Paris</li><li>2x</li><li>42</li><li>2026-10-16</li><li>12:30</li></ol></dd><dt>Form</dt><dd><tp-blank name="city" closed></tp-blank><tp-blank name="formula" type="math" mathlive></tp-blank><tp-blank name="count" type="number" min="0" step="1"></tp-blank><tp-blank name="day" type="date"></tp-blank><tp-blank name="hour" type="time"></tp-blank></dd></dl></tp-fill-blank-question>`;
	const question = required(document.querySelector("tp-fill-blank-question"));
	const form = required(question.querySelector("tp-fill-blank"));
	return { question, form, blanks: [...form.querySelectorAll("tp-blank")] };
}
it("defaults to mixed, hides open solutions from the bank, and grades all five field types", async () => {
	const { question, form, blanks } = setup();
	expect(question.mode).toBe("mixed");
	expect(getBlankFields(form)).toHaveLength(5);
	expect(form.querySelector("tp-mathfield[mathlive]")).not.toBeNull();
	expect(
		form.querySelector('tp-numberfield[min="0"][step="1"]'),
	).not.toBeNull();
	expect(form.querySelector("tp-datefield")).not.toBeNull();
	expect(form.querySelector("tp-timefield")).not.toBeNull();
	const choices = question.querySelectorAll<HTMLElement>(
		"tp-button[data-tp-closed-item]",
	);
	expect(choices).toHaveLength(1);
	required(choices[0]).click();
	required(blanks[0]).click();
	required(blanks[1]).value = "2x";
	required(blanks[2]).value = "42.0";
	required(blanks[3]).value = "2026-10-16";
	required(blanks[4]).value = "12:30";
	expect([...form.value.keys()]).toEqual([
		"city",
		"formula",
		"count",
		"day",
		"hour",
	]);
	question.querySelector<HTMLElement>('[data-action="submit"]')?.click();
	await vi.waitFor(() =>
		expect(
			question.querySelector("[data-tp-question-feedback-output]")?.textContent,
		).toContain("5/5"),
	);
	expect(
		form.querySelectorAll('[data-tp-blank-result="success"]'),
	).toHaveLength(5);
	question.querySelector<HTMLElement>('[data-action="reset"]')?.click();
	expect(blanks.map((b) => b.value)).toEqual(["", "", "", "", ""]);
});
it("overrides local choices reversibly and rebuilds on local attribute changes", () => {
	const { question, form, blanks } = setup();
	question.mode = "closed";
	expect(
		form.querySelectorAll(
			"tp-mathfield,tp-numberfield,tp-datefield,tp-timefield,tp-textfield",
		),
	).toHaveLength(0);
	expect(
		question.querySelectorAll("tp-button[data-tp-closed-item]"),
	).toHaveLength(5);
	question.mode = "opened";
	expect(question.querySelector("[data-tp-closed-bank]")).toBeNull();
	expect(form.querySelectorAll("tp-textfield")).toHaveLength(2); // text blank plus math source
	expect(required(blanks[0]).closed).toBe(true);
	question.removeAttribute("mode");
	expect(
		question.querySelectorAll("tp-button[data-tp-closed-item]"),
	).toHaveLength(1);
	required(blanks[2]).closed = true;
	expect(
		question.querySelectorAll("tp-button[data-tp-closed-item]"),
	).toHaveLength(2);
	expect(required(blanks[2]).querySelector("tp-numberfield")).toBeNull();
	required(blanks[2]).closed = false;
	expect(required(blanks[2]).querySelector("tp-numberfield")).not.toBeNull();
	expect([...form.querySelectorAll("tp-blank")]).toEqual(blanks);
});
it("forwards live field attributes, preserves typing and does not intercept Backspace", () => {
	const { blanks } = setup();
	const blank = required(blanks[2]);
	blank.setAttribute("max", "100");
	expect(blank.querySelector("tp-numberfield")?.getAttribute("max")).toBe(
		"100",
	);
	blank.removeAttribute("max");
	expect(blank.querySelector("tp-numberfield")?.hasAttribute("max")).toBe(
		false,
	);
	blank.value = "42";
	const key = new KeyboardEvent("keydown", {
		key: "Backspace",
		bubbles: true,
		cancelable: true,
	});
	required(blank.querySelector("input")).dispatchEvent(key);
	expect(key.defaultPrevented).toBe(false);
	expect(blank.value).toBe("42");
	blank.type = "text";
	expect(blank.querySelector("tp-textfield")?.value).toBe("42");
});

it("defaults invalid modes to mixed independently of question expansion", async () => {
	const question = document.createElement("tp-question");
	question.innerHTML =
		"<dl><dt>Form</dt><dd><tp-blank closed></tp-blank><tp-blank></tp-blank></dd></dl>";
	document.body.append(question);
	const blanks = [...question.querySelectorAll<TpBlank>("tp-blank")];
	for (const mode of ["", "invalid", "all", "none"]) {
		question.setAttribute("mode", mode);
		expect(question.mode).toBe("mixed");
		expect(blanks.map((blank) => blank.effectiveClosed)).toEqual([true, false]);
	}
	question.mode = "opened";
	await Promise.resolve();
	expect(blanks.every((blank) => blank.querySelector("tp-textfield"))).toBe(
		true,
	);
	question.open = true;
	expect(question.mode).toBe("opened");
	question.mode = "closed";
	await Promise.resolve();
	expect(blanks.every((blank) => !blank.querySelector("tp-textfield"))).toBe(
		true,
	);
	expect(question.open).toBe(true);
	question.removeAttribute("mode");
	await Promise.resolve();
	expect(question.mode).toBe("mixed");
	expect(blanks.map((blank) => blank.closed)).toEqual([true, false]);
});
