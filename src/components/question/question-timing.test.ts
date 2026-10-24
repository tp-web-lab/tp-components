import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TpQuestion } from "./question.js";
import "../single-choice-question/single-choice-question.js";
import type { TpTimer } from "../timer/timer.js";
import { questionTimingSeconds } from "./question-timing.js";

function mount(timing = "00:00:02", tag = "tp-question") {
	const q = document.createElement(tag);
	q.setAttribute("timing", timing);
	q.innerHTML =
		'<dl><dt>Title</dt><dd>Timed task</dd><dt>Prompt</dt><dd>Give an answer.</dd><dt>Form</dt><dd><input value="kept"></dd><dt>Solution</dt><dd>Example.</dd></dl>';
	document.body.append(q);
	return q;
}
function action(q: HTMLElement, name: string) {
	const b = Array.from(q.querySelectorAll("tp-mask tp-button")).find(
		(b) => b.textContent?.trim() === name,
	);
	expect(b).toBeTruthy();
	b?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}
const layout = (q: HTMLElement) =>
	q.querySelector<HTMLElement>("[data-tp-question-layout]");
describe("question timing", () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => {
		document.body.replaceChildren();
		vi.useRealTimers();
	});
	it.each([
		"",
		"00:00:00",
		"1:00:00",
		"00:60:00",
		"00:00:60",
		"-1:00:00",
		" 00:01:00",
		"00:01:00 ",
		"00:01:00\n",
	])("ignores invalid or zero duration %s", (value) => {
		const q = mount(value);
		expect(q.querySelector("tp-timer")).toBeNull();
		expect(q.querySelector("tp-mask")).toBeNull();
	});
	it("parses hours without treating minutes or seconds as unrestricted numbers", () => {
		expect(questionTimingSeconds("12:34:56")).toBe(45296);
	});
	it("waits for Start, expires once, then Continue reveals unchanged answers", () => {
		const q = mount();
		expect(
			q.querySelector("summary tp-timer")?.hasAttribute("no-controls"),
		).toBe(true);
		expect(q.querySelector("tp-mask")?.textContent).toContain(
			"Time-limited question: this section will close in 00:00:02",
		);
		vi.advanceTimersByTime(5000);
		expect(q.querySelector("[data-tp-timer-display]")?.textContent).toBe(
			"00:00:02",
		);
		q.setAttribute("open", "");
		expect(layout(q)?.style.display).toBe("none");
		action(q, "Start");
		expect(layout(q)?.style.display).toBe("");
		vi.advanceTimersByTime(1000);
		expect(q.querySelector("[data-tp-timer-display]")?.textContent).toBe(
			"00:00:01",
		);
		vi.advanceTimersByTime(1000);
		expect(layout(q)?.style.display).toBe("none");
		expect(q.querySelector("tp-mask")?.textContent).toBe(
			"Time limit has expired.Continue",
		);
		action(q, "Continue");
		expect(layout(q)?.style.display).toBe("");
		expect(layout(q)?.querySelector("input")?.value).toBe("kept");
		vi.advanceTimersByTime(10000);
		expect(layout(q)?.style.display).toBe("");
		expect(q.querySelector("[data-tp-timer-display]")?.textContent).toBe(
			"00:00:00",
		);
	});
	it("closing and reopening does not reset or pause the running limit", () => {
		const q = mount();
		q.setAttribute("open", "");
		action(q, "Start");
		q.removeAttribute("open");
		vi.advanceTimersByTime(3000);
		q.setAttribute("open", "");
		expect(layout(q)?.style.display).toBe("none");
		expect(q.querySelector("tp-mask")?.textContent).toContain("expired");
	});
	it("changing or removing timing resets the gate and cancels the old deadline", () => {
		const q = mount();
		action(q, "Start");
		q.setAttribute("timing", "00:01:00");
		expect(q.querySelector("[data-tp-timer-display]")?.textContent).toBe(
			"00:01:00",
		);
		expect(layout(q)?.style.display).toBe("none");
		q.removeAttribute("timing");
		expect(q.querySelector("tp-timer")).toBeNull();
		expect(layout(q)?.style.display).toBe("");
		vi.advanceTimersByTime(70000);
		expect(q.querySelector("tp-mask")).toBeNull();
	});
	it("releases resources when removed", () => {
		const q = mount();
		action(q, "Start");
		const timer = q.querySelector("tp-timer");
		const elapsed = vi.fn();
		timer?.addEventListener("tp-timer-elapsed", elapsed);
		q.remove();
		vi.advanceTimersByTime(10000);
		expect(elapsed).not.toHaveBeenCalled();
		expect(q.querySelector("tp-mask")).toBeNull();
	});
	it("is inherited by specialized questions", () => {
		const q = mount("00:00:02", "tp-single-choice-question");
		expect(q.querySelector("summary tp-timer")).not.toBeNull();
		expect(layout(q)?.style.display).toBe("none");
	});
	it("blocks solution clicks and keyboard navigation until Continue", () => {
		const q = mount();
		const tab = q.querySelector<HTMLElement>("[data-tp-question-solution-tab]");
		const panel = q.querySelector<HTMLElement>(
			"[data-tp-question-solution-content]",
		);
		const tabs = q.querySelector("tp-tabs");
		action(q, "Start");
		expect(tab?.getAttribute("aria-disabled")).toBe("true");
		expect(panel?.inert).toBe(true);
		expect(panel?.hasAttribute("data-tp-question-solution-locked")).toBe(true);
		tab?.click();
		expect(tabs?.getAttribute("selected")).toBe("0");
		const feedback = tabs?.querySelector('[role="tab"]');
		feedback?.dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
		);
		expect(tabs?.getAttribute("selected")).toBe("0");
		vi.advanceTimersByTime(2000);
		expect(tab?.hasAttribute("disabled")).toBe(true);
		action(q, "Continue");
		expect(tab?.hasAttribute("disabled")).toBe(false);
		expect(panel?.hasAttribute("data-tp-question-solution-locked")).toBe(false);
		tab?.click();
		expect(tabs?.getAttribute("selected")).toBe("1");
	});
	it("locks an already selected solution and restores access when timing is removed", () => {
		const q = mount("");
		const tab = q.querySelector<HTMLElement>("[data-tp-question-solution-tab]");
		tab?.click();
		q.setAttribute("timing", "00:01:00");
		expect(q.querySelector("tp-tabs")?.getAttribute("selected")).toBe("0");
		expect(tab?.hasAttribute("disabled")).toBe(true);
		q.removeAttribute("timing");
		expect(tab?.hasAttribute("disabled")).toBe(false);
		tab?.click();
		expect(q.querySelector("tp-tabs")?.getAttribute("selected")).toBe("1");
	});
	it("reflects the timing property", () => {
		const q = new TpQuestion();
		q.timing = "00:00:05";
		expect(q.getAttribute("timing")).toBe("00:00:05");
	});
	it("supports manual timer start and reset without changing ordinary timers", () => {
		const timer = document.createElement("tp-timer") as TpTimer;
		timer.setAttribute("manual", "");
		timer.setAttribute("silent", "");
		timer.duration = 2;
		document.body.append(timer);
		vi.advanceTimersByTime(4000);
		expect(timer.hasAttribute("data-elapsed")).toBe(false);
		timer.start();
		vi.advanceTimersByTime(2000);
		expect(timer.hasAttribute("data-elapsed")).toBe(true);
		timer.reset();
		expect(timer.hasAttribute("data-elapsed")).toBe(false);
		expect(timer.querySelector("[data-tp-timer-display]")?.textContent).toBe(
			"00:02",
		);
	});
});
