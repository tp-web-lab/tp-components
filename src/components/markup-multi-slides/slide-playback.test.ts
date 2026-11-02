import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { TpTextToSpeech } from "../text-to-speech/text-to-speech.js";
import { SlidePlayback } from "./slide-playback.js";

function reader() {
	const element = document.createElement("div");
	element.setAttribute("data-tp-speech-ready", "");
	element.dataset.state = "idle";
	return Object.assign(element, {
		speak: vi.fn(async () => {
			element.dataset.state = "speaking";
		}),
		pause: vi.fn(() => {
			element.dataset.state = "paused";
		}),
		resume: vi.fn(() => {
			element.dataset.state = "speaking";
		}),
		stop: vi.fn(() => {
			element.dataset.state = "idle";
		}),
	}) as unknown as TpTextToSpeech;
}
function cue(r: TpTextToSpeech, name = "clic") {
	r.dispatchEvent(
		new CustomEvent("tp-text-to-speech-trigger", {
			detail: { name, offset: 0 },
		}),
	);
}
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());
it("does nothing in manual mode and waits for explicit Play in enabled modes", () => {
	const next = vi.fn(() => "step" as const);
	const c = new SlidePlayback(next, vi.fn());
	c.sync(document.createElement("div"), null, true);
	c.play();
	vi.advanceTimersByTime(10000);
	expect(next).not.toHaveBeenCalled();
	c.configure("timing", 5000);
	vi.advanceTimersByTime(10000);
	expect(next).not.toHaveBeenCalled();
	c.dispose();
});
it("ticks per step, preserves remaining time on Pause and does not reset on DOM sync", () => {
	const next = vi.fn(() => "step" as const);
	const c = new SlidePlayback(next, vi.fn());
	const page = document.createElement("div");
	c.configure("timing", 5000);
	c.sync(page, null, true);
	c.play();
	vi.advanceTimersByTime(2000);
	c.sync(page, null, true);
	c.pause();
	vi.advanceTimersByTime(20000);
	expect(next).not.toHaveBeenCalled();
	c.play();
	vi.advanceTimersByTime(2999);
	expect(next).not.toHaveBeenCalled();
	vi.advanceTimersByTime(1);
	expect(next).toHaveBeenCalledTimes(1);
	vi.advanceTimersByTime(5000);
	expect(next).toHaveBeenCalledTimes(2);
	c.dispose();
});
it("waits for the next rendered slide instead of running through loading content", () => {
	const next = vi.fn(() => "slide" as const);
	const c = new SlidePlayback(next, vi.fn());
	const p = document.createElement("div");
	c.configure("timing", 100);
	c.sync(p, null, true);
	c.play();
	vi.advanceTimersByTime(100);
	c.sync(p, null, true);
	vi.advanceTimersByTime(1000);
	expect(next).toHaveBeenCalledTimes(1);
	c.sync(document.createElement("div"), null, false);
	vi.advanceTimersByTime(1000);
	expect(next).toHaveBeenCalledTimes(1);
	c.sync(document.createElement("div"), null, true);
	vi.advanceTimersByTime(100);
	expect(next).toHaveBeenCalledTimes(2);
	c.dispose();
});
it("follows only current notes, ignores other trigger names and stops the old voice on page changes", async () => {
	const next = vi
		.fn<() => "step" | "slide">()
		.mockReturnValueOnce("step")
		.mockReturnValueOnce("slide")
		.mockReturnValue("step");
	const c = new SlidePlayback(next, vi.fn());
	const r = reader(),
		p = document.createElement("div");
	c.configure("notes", 5000);
	c.sync(p, r, true);
	c.play();
	await Promise.resolve();
	expect(r.speak).toHaveBeenCalledTimes(1);
	cue(r, "other");
	expect(next).not.toHaveBeenCalled();
	cue(r);
	expect(next).toHaveBeenCalledTimes(1);
	expect(r.stop).not.toHaveBeenCalled();
	cue(r);
	expect(r.stop).toHaveBeenCalledTimes(1);
	cue(r);
	expect(next).toHaveBeenCalledTimes(2);
	const r2 = reader();
	c.sync(document.createElement("div"), r2, true);
	expect(r2.speak).toHaveBeenCalledTimes(1);
	cue(r);
	expect(next).toHaveBeenCalledTimes(2);
	cue(r2);
	expect(next).toHaveBeenCalledTimes(3);
	c.dispose();
});
it("waits for external notes and falls back to timing after notes finish or are absent", async () => {
	const next = vi.fn(() => "step" as const);
	const c = new SlidePlayback(next, vi.fn());
	const r = reader();
	r.removeAttribute("data-tp-speech-ready");
	c.configure("notes", 200);
	c.sync(document.createElement("div"), r, true);
	c.play();
	vi.advanceTimersByTime(1000);
	expect(r.speak).not.toHaveBeenCalled();
	r.setAttribute("data-tp-speech-ready", "");
	r.dispatchEvent(new Event("tp-text-to-speech-ready"));
	await Promise.resolve();
	expect(r.speak).toHaveBeenCalledOnce();
	r.dataset.state = "idle";
	r.dispatchEvent(new Event("tp-text-to-speech-end"));
	vi.advanceTimersByTime(200);
	expect(next).toHaveBeenCalledOnce();
	c.stop();
	vi.advanceTimersByTime(2000);
	expect(next).toHaveBeenCalledOnce();
	c.sync(document.createElement("div"), null, true);
	c.play();
	vi.advanceTimersByTime(200);
	expect(next).toHaveBeenCalledTimes(2);
	c.dispose();
});
it("stops clocks and speech on mode changes, errors, teardown and the final slide", () => {
	const next = vi.fn(() => "end" as const);
	const c = new SlidePlayback(next, vi.fn());
	const r = reader();
	c.configure("notes", 100);
	c.sync(document.createElement("div"), r, true);
	c.play();
	r.dispatchEvent(new Event("tp-text-to-speech-error"));
	expect(c.state).toBe("stopped");
	cue(r);
	expect(next).not.toHaveBeenCalled();
	c.configure("timing", 100);
	c.play();
	vi.advanceTimersByTime(100);
	expect(c.state).toBe("stopped");
	c.play();
	c.configure("", 100);
	vi.advanceTimersByTime(1000);
	expect(next).toHaveBeenCalledOnce();
	c.dispose();
});

it("keeps a requested pause when the browser reports a delayed speech start", async () => {
	const c = new SlidePlayback(() => "step", vi.fn());
	const r = reader();
	c.configure("notes", 5000);
	c.sync(document.createElement("div"), r, true);
	c.play();
	c.pause();
	r.dispatchEvent(new Event("tp-text-to-speech-start"));
	expect(c.state).toBe("paused");
	c.dispose();
});

it("accepts a leading cue when the reader itself starts playback", () => {
	const next = vi.fn(() => "step" as const),
		restart = vi.fn();
	const c = new SlidePlayback(next, vi.fn(), restart),
		r = reader();
	c.configure("notes", 5000);
	c.sync(document.createElement("div"), r, true);
	r.dataset.state = "speaking";
	cue(r);
	expect(c.state).toBe("playing");
	expect(next).toHaveBeenCalledOnce();
	expect(restart).toHaveBeenCalledOnce();
	c.dispose();
});
