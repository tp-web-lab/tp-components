import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { TpTimer } from "./timer.js";

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
	document.body.replaceChildren();
	vi.useRealTimers();
});
it("tracks elapsed proportions, completion and reset for embedded timers", () => {
	const timer = new TpTimer();
	timer.duration = 10;
	timer.setAttribute("manual", "");
	timer.setAttribute("no-controls", "");
	timer.silent = true;
	document.body.append(timer);
	const progress = () =>
		Number.parseFloat(timer.style.getPropertyValue("--tp-timer-progress"));
	expect(progress()).toBe(0);
	vi.advanceTimersByTime(5000);
	expect(progress()).toBe(0);
	timer.start();
	vi.advanceTimersByTime(5000);
	expect(progress()).toBe(50);
	vi.advanceTimersByTime(5000);
	expect(progress()).toBe(100);
	expect(timer.hasAttribute("data-elapsed")).toBe(true);
	timer.reset();
	expect(progress()).toBe(0);
	expect(timer.hasAttribute("data-elapsed")).toBe(false);
	timer.start();
	vi.advanceTimersByTime(2000);
	expect(progress()).toBeCloseTo(20);
	timer.duration = 20;
	expect(progress()).toBe(0);
	vi.advanceTimersByTime(5000);
	expect(progress()).toBe(25);
	timer.remove();
	vi.advanceTimersByTime(5000);
	expect(progress()).toBe(25);
});
