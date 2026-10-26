import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
	speechSequence,
	spokenSpeechText,
	visibleSpeechText,
} from "./speech-sequence.js";
import { TpTextToSpeech } from "./text-to-speech.js";

class Utterance extends EventTarget {
	constructor(public text: string) {
		super();
	}
}
const synthesis = {
	speak: vi.fn(),
	cancel: vi.fn(),
	pause: vi.fn(),
	resume: vi.fn(),
	getVoices: () => [],
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
};
async function mount(text: string, pause = 800) {
	const reader = new TpTextToSpeech();
	reader.setAttribute("value", text);
	reader.setAttribute("show-text", "");
	reader.pauseBetweenLines = pause;
	document.body.append(reader);
	for (let i = 0; i < 8; i++) await Promise.resolve();
	return reader;
}
function current(): Utterance {
	return synthesis.speak.mock.calls.at(-1)?.[0];
}
function finish() {
	current().dispatchEvent(new Event("end"));
}
beforeEach(() => {
	vi.useFakeTimers();
	vi.clearAllMocks();
	vi.stubGlobal("SpeechSynthesisUtterance", Utterance);
	vi.stubGlobal("speechSynthesis", synthesis);
});
afterEach(() => {
	document.body.replaceChildren();
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

it("preserves ordinary text as a single utterance without configured pauses", () => {
	expect(speechSequence("A. Hello.\nB. Goodbye.", 0)).toEqual([
		{ text: "A. Hello.\nB. Goodbye.", offset: 0 },
	]);
});
it("ignores blank lines and replaces a line pause with an explicit pause", () => {
	const text =
		"A. First. [pause=1500]\r\n\r\n  B. Second.\n[pause=0]\nC. Last.\n";
	expect(speechSequence(text, 800).filter((s) => "pause" in s)).toEqual([
		{ pause: 1500, explicit: true },
		{ pause: 0, explicit: true },
	]);
	expect(visibleSpeechText(text)).not.toContain("[pause=");
});
it("retains invalid commands as literal text", () => {
	const text = "[pause=-1] [pause=x] [pause=2147483648]";
	expect(visibleSpeechText(text)).toBe(text);
	expect(speechSequence(text, 0)).toEqual([{ text, offset: 0 }]);
});
it("uses source offsets even after commands and indentation", () => {
	const text = "Hello [pause=100] world.\n  Goodbye.";
	expect(speechSequence(text, 800).filter((s) => "text" in s)).toEqual([
		{ text: "Hello", offset: 0 },
		{ text: "world.", offset: text.indexOf("world.") },
		{ text: "Goodbye.", offset: text.indexOf("Goodbye.") },
	]);
});
it("waits the requested intervals and emits one start/end pair for the entire reading", async () => {
	const reader = await mount("Look. [pause=1500]\nA. A box.\n\nB. A train.");
	const start = vi.fn(),
		end = vi.fn();
	reader.addEventListener("tp-text-to-speech-start", start);
	reader.addEventListener("tp-text-to-speech-end", end);
	expect(reader.querySelector('[data-role="text"]')?.textContent).toBe(
		"Look. \nA. A box.\n\nB. A train.",
	);
	await reader.speak();
	current().dispatchEvent(new Event("start"));
	expect(current().text).toBe("Look.");
	finish();
	vi.advanceTimersByTime(1499);
	expect(synthesis.speak).toHaveBeenCalledTimes(1);
	vi.advanceTimersByTime(1);
	expect(current().text).toBe("A. A box.");
	current().dispatchEvent(new Event("start"));
	finish();
	vi.advanceTimersByTime(799);
	expect(synthesis.speak).toHaveBeenCalledTimes(2);
	vi.advanceTimersByTime(1);
	expect(current().text).toBe("B. A train.");
	current().dispatchEvent(new Event("start"));
	finish();
	expect(start).toHaveBeenCalledTimes(1);
	expect(end).toHaveBeenCalledTimes(1);
	expect(reader.dataset.state).toBe("idle");
});
it("supports inline, leading and trailing pauses without a line attribute", async () => {
	const reader = await mount("[pause=100] A [pause=300] box [pause=200]", 0);
	await reader.speak();
	expect(synthesis.speak).not.toHaveBeenCalled();
	vi.advanceTimersByTime(100);
	expect(current().text).toBe("A");
	finish();
	vi.advanceTimersByTime(300);
	expect(current().text).toBe("box");
	finish();
	expect(reader.dataset.state).toBe("speaking");
	vi.advanceTimersByTime(200);
	expect(reader.dataset.state).toBe("idle");
});
it("freezes remaining silence and resumes it without skipping text", async () => {
	const reader = await mount("A\nB");
	await reader.speak();
	finish();
	vi.advanceTimersByTime(300);
	reader.pause();
	expect(reader.dataset.state).toBe("paused");
	vi.advanceTimersByTime(5000);
	expect(synthesis.speak).toHaveBeenCalledTimes(1);
	reader.resume();
	vi.advanceTimersByTime(499);
	expect(synthesis.speak).toHaveBeenCalledTimes(1);
	vi.advanceTimersByTime(1);
	expect(current().text).toBe("B");
});
it.each(["stop", "remove", "source", "attribute", "lite"])(
	"cancels pending silence on %s",
	async (action) => {
		const reader = await mount("A\nB");
		await reader.speak();
		const old = current();
		finish();
		if (action === "stop") reader.stop();
		if (action === "remove") reader.remove();
		if (action === "source") reader.setAttribute("value", "Changed");
		if (action === "attribute") reader.pauseBetweenLines = 200;
		if (action === "lite") {
			reader.setAttribute("lite", "");
			await reader.speak();
			finish();
			reader
				.querySelector<HTMLElement>('[data-action="toggle-speech"]')
				?.click();
		}
		const count = synthesis.speak.mock.calls.length;
		old.dispatchEvent(new Event("end"));
		vi.advanceTimersByTime(5000);
		expect(synthesis.speak).toHaveBeenCalledTimes(count);
	},
);
it("restarting discards old delayed segments", async () => {
	const reader = await mount("A\nB");
	await reader.speak();
	finish();
	await reader.speak();
	vi.advanceTimersByTime(2000);
	expect(synthesis.speak).toHaveBeenCalledTimes(2);
	expect(current().text).toBe("A");
});
it.each(["-1", "NaN", "1.5", "2147483648"])(
	"ignores invalid line durations %s",
	async (value) => {
		const reader = await mount("A\nB");
		reader.setAttribute("pause-between-lines", value);
		expect(reader.pauseBetweenLines).toBe(0);
		await reader.speak();
		expect(current().text).toBe("A\nB");
	},
);

it("hides transcript passages while retaining spoken text and source offsets", async () => {
	const source = "Listen. [hide-text]A secret.[pause=200][show-text]Answer.";
	const reader = await mount(source, 0);
	expect(reader.querySelector('[data-role="text"]')?.textContent).toBe(
		"Listen. Answer.",
	);
	const start = vi.fn();
	reader.addEventListener("tp-text-to-speech-start", start);
	await reader.speak();
	current().dispatchEvent(new Event("start"));
	expect(start.mock.calls[0]?.[0].detail.text).toBe("Listen. A secret.Answer.");
	expect(current().text).toBe("Listen.");
	finish();
	expect(current().text).toBe("A secret.");
	finish();
	vi.advanceTimersByTime(200);
	expect(current().text).toBe("Answer.");
	expect(
		speechSequence(source, 0)
			.filter((step) => "text" in step)
			.map((step) => step.offset),
	).toEqual([0, source.indexOf("A secret."), source.indexOf("Answer.")]);
});
it("handles repeated visibility commands, hidden endings and malformed commands", () => {
	expect(
		visibleSpeechText(
			"A[hide-text]B[hide-text]C[show-text]D[show-text]E[hide-text]F",
		),
	).toBe("ADE");
	expect(
		visibleSpeechText("[hide-text][voice=Daniel]A[pause=100][show-text]B"),
	).toBe("B");
	expect(visibleSpeechText("[hide-text=x] [show-text")).toBe(
		"[hide-text=x] [show-text",
	);
	expect(
		speechSequence("[hide-text]A[show-text]B", 800).filter(
			(step) => "pause" in step,
		),
	).toEqual([]);
});
it("reads fully hidden text and keeps the global show-text attribute authoritative", async () => {
	const reader = await mount("[hide-text]Hidden", 0);
	expect(reader.querySelector('[data-role="text"]')?.textContent).toBe("");
	await reader.speak();
	expect(current().text).toBe("Hidden");
	reader.setAttribute("value", "[show-text]Visible only when enabled");
	for (let i = 0; i < 8; i++) await Promise.resolve();
	reader.removeAttribute("show-text");
	expect(
		reader.querySelector('[data-role="text"]')?.hasAttribute("hidden"),
	).toBe(true);
	reader.setAttribute("show-text", "");
	expect(reader.querySelector('[data-role="text"]')?.textContent).toBe(
		"Visible only when enabled",
	);
});

it("keeps speech and display controls independent and reports only spoken text", async () => {
	const source =
		"[speech-off]Instructions.[speech-on][hide-text]Listen.[speech-off][show-text]Question?";
	const reader = await mount(source, 0);
	expect(reader.querySelector('[data-role="text"]')?.textContent).toBe(
		"Instructions.Question?",
	);
	expect(spokenSpeechText(source)).toBe("Listen.");
	const start = vi.fn(),
		end = vi.fn();
	reader.addEventListener("tp-text-to-speech-start", start);
	reader.addEventListener("tp-text-to-speech-end", end);
	await reader.speak();
	expect(current().text).toBe("Listen.");
	current().dispatchEvent(new Event("start"));
	finish();
	expect(synthesis.speak).toHaveBeenCalledTimes(1);
	expect(start.mock.calls[0]?.[0].detail.text).toBe("Listen.");
	expect(end.mock.calls[0]?.[0].detail.text).toBe("Listen.");
});
it("ignores pauses in disabled speech while retaining voices and raw offsets", () => {
	const source =
		"A[pause=50][speech-off]Ignore.\n[pause=900][voice=Kate][speech-on]B";
	expect(speechSequence(source, 800)).toEqual([
		{ text: "A", offset: 0 },
		{ pause: 50, explicit: true },
		{ text: "B", offset: source.lastIndexOf("B"), voice: "Kate" },
	]);
	expect(
		spokenSpeechText("A[speech-off]B[speech-off]C[speech-on]D[speech-on]E"),
	).toBe("ADE");
	expect(visibleSpeechText("A[speech-off]B[speech-on]C")).toBe("ABC");
	expect(spokenSpeechText("[speech-off=x] [speech-on")).toBe(
		"[speech-off=x] [speech-on",
	);
});
it("does not speak fully disabled text and resets speech state for each reading", async () => {
	const reader = await mount("[speech-off]Read silently.", 0);
	const start = vi.fn();
	reader.addEventListener("tp-text-to-speech-start", start);
	await reader.speak();
	expect(synthesis.speak).not.toHaveBeenCalled();
	expect(start).not.toHaveBeenCalled();
	reader.setAttribute("value", "Hello.[speech-off]Silent.");
	for (let i = 0; i < 8; i++) await Promise.resolve();
	await reader.speak();
	finish();
	await reader.speak();
	expect(synthesis.speak).toHaveBeenCalledTimes(2);
	expect(current().text).toBe("Hello.");
});
