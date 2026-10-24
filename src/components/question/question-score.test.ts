import { afterEach, expect, it } from "vitest";
import { TpQuestion } from "./question.js";
import "../fill-blank-question/fill-blank-question.js";

afterEach(() => document.body.replaceChildren());
function mount(attribute = "") {
	document.body.innerHTML = `<tp-fill-blank-question ${attribute}><dl><dt>Answers</dt><dd><ol><li>blue</li></ol></dd><dt>Form</dt><dd><tp-textfield></tp-textfield></dd></dl></tp-fill-blank-question>`;
	const host = document.querySelector<TpQuestion>("tp-fill-blank-question");
	const field = document.querySelector("tp-textfield");
	if (!host || !field) throw new Error("Missing question");
	field.value = "blue";
	host.querySelector<HTMLElement>('[data-action="submit"]')?.click();
	return host;
}
it("hides numerical scores by default while retaining correction", () => {
	const host = mount();
	expect(host.score).toBe(false);
	expect(
		host.querySelector<HTMLElement>("[data-tp-question-score]")?.hidden,
	).toBe(true);
	expect(
		host.querySelector("[data-tp-question-feedback-output]")?.textContent,
	).toContain("Congratulations");
});
it.each(["score", 'score="false"'])(
	"enables scores with boolean presence: %s",
	(attribute) => {
		const host = mount(attribute);
		const score = host.querySelector<HTMLElement>("[data-tp-question-score]");
		expect(score?.hidden).toBe(false);
		expect(score?.textContent).toBe("1/1");
	},
);
it("updates existing feedback dynamically and preserves the answer", () => {
	const host = mount();
	host.score = true;
	expect(host.hasAttribute("score")).toBe(true);
	expect(
		host.querySelector<HTMLElement>("[data-tp-question-score]")?.hidden,
	).toBe(false);
	host.score = false;
	expect(host.hasAttribute("score")).toBe(false);
	expect(
		host.querySelector<HTMLElement>("[data-tp-question-score]")?.hidden,
	).toBe(true);
	expect(host.querySelector("tp-textfield")?.value).toBe("blue");
});
it("does not override a nested question's score policy", () => {
	const inner = mount("score");
	const outer = new TpQuestion();
	document.body.append(outer);
	outer.append(inner);
	outer.score = true;
	outer.score = false;
	expect(inner.score).toBe(true);
	expect(
		inner.querySelector<HTMLElement>("[data-tp-question-score]")?.hidden,
	).toBe(false);
});
