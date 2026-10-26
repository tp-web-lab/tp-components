import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import { renderMarkdownToHtml } from "../markdown/markdown.js";
import "./exercise.js";
import "../single-choice-question/single-choice-question.js";

const source = readFileSync(
	"src/components/exercise/fixtures/conversation.md",
	"utf8",
);
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
});
it("renders all three nested Markdown questions with four choices and usable feedback", async () => {
	vi.spyOn(Math, "random").mockReturnValue(0);
	const html = await renderMarkdownToHtml(
		source.replace('answer="3"', 'answer="3" random'),
	);
	document.body.innerHTML = html;
	await new Promise((resolve) => setTimeout(resolve, 0));
	const exercise = document.querySelector("tp-exercise");
	expect(exercise?.querySelector("[data-tp-exercise-title]")?.textContent).toBe(
		"Conversation",
	);
	const questions = Array.from(
		exercise?.querySelectorAll("ol > li > tp-single-choice-question") ?? [],
	);
	expect(questions).toHaveLength(3);
	expect(
		exercise?.querySelector("tp-text-to-speech script")?.textContent,
	).toContain("[voice=Samantha]");
	for (const question of questions) {
		expect(question.querySelector("pre > code")).toBeNull();
		expect(
			question.querySelectorAll('tp-radio-list input[type="radio"]'),
		).toHaveLength(4);
		const correctText = [
			"Presentation equipment is faulty.",
			"It has enough seats.",
			"Revise the invitation.",
		][questions.indexOf(question)];
		const choice = Array.from(
			question.querySelectorAll<HTMLLIElement>("tp-radio-list li"),
		)
			.find((item) => item.textContent?.trim() === correctText)
			?.querySelector<HTMLInputElement>("input");
		choice?.click();
		question.querySelector<HTMLElement>('[data-action="submit"]')?.click();
		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(
			question.querySelector("[data-tp-question-feedback-output]")?.textContent,
		).toContain("1/1");
		expect(
			question.querySelector("[data-tp-question-feedback-output]")?.textContent,
		).toContain("Correct.");
	}
});

it("renders nested exercises in a Markdown question list", async () => {
	const html = await renderMarkdownToHtml(`::: tp-exercise {open}
Title
: Parent exercise

Context
: Shared context.

Questions
:
  1.
     :::: tp-exercise {open}
     Title
     : Child exercise

     Context
     : Specific context.

     Questions
     :
       1.
          ::::: tp-single-choice-question {answer="1"}
          Title
          : Nested choice

          Prompt
          : Select blue.

          Form
          :
            - Blue
            - Red

          Feedback
          :
            - Correct.
            - Try again.
          :::::
     ::::
:::`);
	document.body.innerHTML = html;
	await new Promise((resolve) => setTimeout(resolve, 0));
	const exercises = document.querySelectorAll("tp-exercise");
	expect(exercises).toHaveLength(2);
	for (const [index, exercise] of Array.from(exercises).entries()) {
		expect(
			exercise
				.querySelector(":scope > details > summary > [data-tp-exercise-title]")
				?.textContent?.trim(),
		).toBe(index === 0 ? "Parent exercise" : "Child exercise");
	}
	const question = exercises[1]?.querySelector("tp-single-choice-question");
	expect(question?.querySelectorAll('input[type="radio"]')).toHaveLength(2);
	question?.querySelector<HTMLInputElement>('input[type="radio"]')?.click();
	question?.querySelector<HTMLElement>('[data-action="submit"]')?.click();
	expect(
		question?.querySelector("[data-tp-question-feedback-output]")?.textContent,
	).toContain("Correct.");
});
