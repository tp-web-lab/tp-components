import { afterEach, expect, it, vi } from "vitest";
import type { TpBlank } from "../blank/blank.js";
import type { TpTextfield } from "../textfield/textfield.js";
import "./fill-blank-question.js";

afterEach(() => document.body.replaceChildren());

it.each(["opened", "mixed", "closed"] as const)(
	"keeps one live reading through %s mode, grading, reset and mode switches",
	async (mode) => {
		document.body.innerHTML = `<tp-fill-blank-question mode="${mode}" partial><dl><dt>Answers</dt><dd><ol><li>Paris</li><li>42</li></ol></dd><dt>Form</dt><dd><p>City: <tp-blank name="city" clearable></tp-blank>. Number: <tp-blank name="count" type="number"></tp-blank>.</p></dd></dl></tp-fill-blank-question>`;
		const question = document.querySelector("tp-fill-blank-question");
		const city = question?.querySelector<TpBlank>('tp-blank[name="city"]');
		const count = question?.querySelector<TpBlank>('tp-blank[name="count"]');
		if (!question || !city || !count) throw new Error("Missing controls");
		const readings = () =>
			question.querySelectorAll("[data-tp-closed-reading]");
		const reading = () => readings()[0];
		expect(readings()).toHaveLength(1);
		expect(reading()?.textContent).toBe("City: …. Number: ….");
		if (mode !== "closed") {
			const input = city.querySelector("input");
			if (!input) throw new Error("Missing editable field");
			input.value = "Paris";
			input.dispatchEvent(new Event("input", { bubbles: true }));
			count.value = "42";
			count.dispatchEvent(new Event("change", { bubbles: true }));
			expect(reading()?.textContent).toBe("City: Paris. Number: 42.");
			expect(
				reading()?.querySelector(
					"input,tp-blank,tp-textfield,tp-numberfield,button",
				),
			).toBeNull();
			question.querySelector<HTMLElement>('[data-action="submit"]')?.click();
			await vi.waitFor(() =>
				expect(
					reading()?.querySelectorAll('[data-tp-reading-result="success"]'),
				).toHaveLength(2),
			);
			city.clear();
			expect(reading()?.textContent).toBe("City: …. Number: 42.");
		}
		for (const next of ["closed", "opened", "mixed"] as const) {
			question.mode = next;
			expect(readings()).toHaveLength(1);
		}
		question.querySelector<HTMLElement>('[data-action="reset"]')?.click();
		expect(reading()?.textContent).toBe("City: …. Number: ….");
		question.remove();
		expect(question.querySelector("[data-tp-closed-reading]")).toBeNull();
		document.body.append(question);
		expect(readings()).toHaveLength(1);
	},
);

it("removes controls from legacy direct fields in the reading", () => {
	document.body.innerHTML = `<tp-fill-blank-question mode="opened"><dl><dt>Answers</dt><dd><ol><li>Paris</li></ol></dd><dt>Form</dt><dd>City: <tp-textfield clearable></tp-textfield>.</dd></dl></tp-fill-blank-question>`;
	const field = document.querySelector<TpTextfield>(
		"tp-fill-blank tp-textfield",
	);
	if (!field) throw new Error("Missing field");
	field.value = "Paris";
	field
		.querySelector("input")
		?.dispatchEvent(new Event("input", { bubbles: true }));
	const reading = document.querySelector("[data-tp-closed-reading]");
	expect(reading?.textContent).toBe("City: Paris.");
	expect(reading?.querySelector("tp-textfield,input,button")).toBeNull();
});
