import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { TpExercise } from "./exercise.js";

function mount(timing = "") {
	const exercise = new TpExercise();
	exercise.timing = timing;
	exercise.innerHTML = `<dl><dt>Context</dt><dd><strong>Shared context</strong></dd><dt>Questions</dt><dd><ol><li><tp-question open="input"><dl><dt>Title</dt><dd>First</dd><dt>Prompt</dt><dd>A prompt</dd><dt>Form</dt><dd><input value="answer"></dd></dl></tp-question></li><li><tp-question><dl><dt>Title</dt><dd>Second</dd></dl></tp-question></li></ol></dd></dl>`;
	document.body.append(exercise);
	return exercise;
}
function action(exercise: TpExercise, label: string) {
	const button = [
		...exercise.querySelectorAll(":scope > details > tp-mask tp-button"),
	].find((b) => b.textContent?.trim() === label);
	expect(button).toBeTruthy();
	(button as HTMLElement).click();
}
function layout(exercise: TpExercise) {
	return exercise.querySelector<HTMLElement>(
		":scope > details > [data-tp-exercise-layout]",
	);
}
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
	document.body.replaceChildren();
	vi.useRealTimers();
});
it("preserves the context, ordered questions and independent submission", () => {
	const e = mount();
	expect(
		e.querySelector("[data-tp-exercise-header] tp-icon")?.getAttribute("name"),
	).toBe("exercise");
	expect(e.querySelector("dd strong")?.textContent).toBe("Shared context");
	expect(e.querySelectorAll("ol > li > tp-question")).toHaveLength(2);
	expect(e.querySelector("[data-tp-exercise-title]")?.textContent).toBe(
		"Exercise",
	);
	expect(e.querySelector(":scope > details > tp-mask")).toBeNull();
	const question = e.querySelector("tp-question");
	const input = question?.querySelector("input");
	e.open = true;
	expect(e.querySelector<HTMLDetailsElement>(":scope > details")?.open).toBe(
		true,
	);
	e.open = false;
	expect(e.querySelector<HTMLDetailsElement>(":scope > details")?.open).toBe(
		false,
	);
	expect(e.querySelector("[data-tp-exercise-title]")?.textContent).toBe(
		"Exercise",
	);
	expect(e.querySelector<HTMLInputElement>("tp-question input")).toBe(input);
	expect(e.querySelector<HTMLInputElement>("tp-question input")?.value).toBe(
		"answer",
	);
});
it.each(["", "00:00:00", "00:61:00", "1:00:00", "bad"])(
	"does not gate invalid or absent timing %s",
	(timing) => {
		const e = mount(timing);
		expect(e.querySelector("[data-tp-exercise-timer]")).toBeNull();
		expect(e.querySelector(":scope > details > tp-mask")).toBeNull();
	},
);
it("gates all content, starts once and preserves answers after expiry", () => {
	const e = mount("00:00:02");
	const input = e.querySelector<HTMLInputElement>("tp-question input");
	expect(layout(e)?.style.display).toBe("none");
	vi.advanceTimersByTime(3000);
	expect(e.querySelector("[data-tp-exercise-timer]")?.textContent).toContain(
		"00:00:02",
	);
	action(e, "Start");
	expect(layout(e)?.style.display).toBe("");
	vi.advanceTimersByTime(2000);
	expect(layout(e)?.style.display).toBe("none");
	action(e, "Continue");
	expect(layout(e)?.style.display).toBe("");
	expect(e.querySelector<HTMLInputElement>("tp-question input")).toBe(input);
	expect(input?.value).toBe("answer");
	vi.advanceTimersByTime(4000);
	expect(layout(e)?.style.display).toBe("");
});
it("reconfigures and removes the timer without replacing questions", () => {
	const e = mount("00:00:02");
	const question = e.querySelector("tp-question");
	action(e, "Start");
	e.timing = "00:01:00";
	expect(layout(e)?.style.display).toBe("none");
	e.removeAttribute("timing");
	expect(layout(e)?.style.display).toBe("");
	expect(e.querySelector("[data-tp-exercise-timer]")).toBeNull();
	expect(e.querySelector("tp-question")).toBe(question);
});
it("disposes on removal and initializes exactly one timer on reconnection", () => {
	const e = mount("00:00:02");
	action(e, "Start");
	const elapsed = vi.fn();
	e.addEventListener("tp-timer-elapsed", elapsed);
	e.remove();
	vi.advanceTimersByTime(3000);
	expect(elapsed).not.toHaveBeenCalled();
	document.body.append(e);
	expect(e.querySelectorAll("[data-tp-exercise-header]")).toHaveLength(1);
	expect(e.querySelectorAll("[data-tp-exercise-timer]")).toHaveLength(1);
	expect(e.querySelector<HTMLInputElement>("tp-question input")?.value).toBe(
		"answer",
	);
});
it("accepts source children appended after connection", async () => {
	const e = new TpExercise();
	document.body.append(e);
	e.innerHTML =
		"<dl><dt>Context</dt><dd>Late content</dd><dt>Questions</dt><dd><ol><li>Question</li></ol></dd></dl>";
	await Promise.resolve();
	expect(layout(e)?.textContent).toContain("Late content");
});

it("moves the rich Title into the summary without recreating it or using a nested question title", () => {
	const e = new TpExercise();
	e.open = true;
	e.innerHTML =
		"<dl><dt>Title</dt><dd><em>Conversation</em></dd><dt>Context</dt><dd>Listen.</dd><dt>Questions</dt><dd><tp-question><dl><dt>Title</dt><dd>First question</dd></dl></tp-question></dd></dl>";
	const title = e.querySelector("em");
	document.body.append(e);
	expect(
		e.querySelector(":scope > details > summary [data-tp-exercise-title] em"),
	).toBe(title);
	expect(e.querySelector<HTMLDetailsElement>(":scope > details")?.open).toBe(
		true,
	);
	expect(
		e.querySelector("[data-tp-exercise-layout] > dl > dt")?.textContent,
	).toBe("Context");
	e.remove();
	document.body.append(e);
	expect(e.querySelectorAll(":scope > details")).toHaveLength(1);
	expect(e.querySelector(":scope > details > summary em")).toBe(title);
});

it("keeps nested exercises, disclosure states and countdowns independent", () => {
	const parent = new TpExercise();
	parent.open = true;
	parent.timing = "00:00:05";
	parent.innerHTML =
		'<dl><dt>Title</dt><dd>Parent</dd><dt>Context</dt><dd>Shared context</dd><dt>Questions</dt><dd><ol><li><tp-question><dl><dt>Title</dt><dd>Standalone question</dd></dl></tp-question></li><li><tp-exercise open timing="00:00:02"><dl><dt>Title</dt><dd>Child</dd><dt>Context</dt><dd>Specific context</dd><dt>Questions</dt><dd><ol><li><tp-question open="input"><dl><dt>Title</dt><dd>Nested question</dd><dt>Form</dt><dd><input value="kept"></dd></dl></tp-question></li></ol></dd></dl></tp-exercise></li></ol></dd></dl>';
	document.body.append(parent);
	const child = parent.querySelector("tp-exercise");
	expect(child).toBeInstanceOf(TpExercise);
	if (!child) throw new Error("Missing nested exercise");
	const input = child.querySelector<HTMLInputElement>("tp-question input");
	expect(
		parent.querySelector(":scope > details > summary")?.textContent,
	).toContain("Parent");
	expect(
		child.querySelector(":scope > details > summary")?.textContent,
	).toContain("Child");
	action(parent, "Start");
	expect(layout(parent)?.style.display).toBe("");
	expect(layout(child)?.style.display).toBe("none");
	action(child, "Start");
	parent.open = false;
	expect(
		child.querySelector<HTMLDetailsElement>(":scope > details")?.open,
	).toBe(true);
	parent.open = true;
	vi.advanceTimersByTime(2000);
	expect(layout(child)?.style.display).toBe("none");
	expect(layout(parent)?.style.display).toBe("");
	action(child, "Continue");
	vi.advanceTimersByTime(3000);
	expect(layout(parent)?.style.display).toBe("none");
	expect(layout(child)?.style.display).toBe("");
	action(parent, "Continue");
	expect(child.querySelector<HTMLInputElement>("tp-question input")).toBe(
		input,
	);
	expect(input?.value).toBe("kept");
	expect(parent.querySelectorAll("tp-question")).toHaveLength(2);
});
