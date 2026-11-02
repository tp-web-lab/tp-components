import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { speechSequence, visibleSpeechText } from "./speech-sequence.js";
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
const gaps = (
	text: string,
	line = 0,
	settings = { comma: 200, semicolon: 400, colon: 300, sentence: 600 },
) =>
	speechSequence(text, line, settings)
		.filter((x) => "pause" in x)
		.map((x) => x.pause);
async function mount(text: string) {
	const r = new TpTextToSpeech();
	r.setAttribute("value", text);
	r.setAttribute("show-text", "");
	document.body.append(r);
	for (let i = 0; i < 12; i++) await Promise.resolve();
	return r;
}
const current = (): Utterance => synthesis.speak.mock.calls.at(-1)?.[0];
beforeEach(() => {
	vi.useFakeTimers();
	vi.clearAllMocks();
	vi.stubGlobal("speechSynthesis", synthesis);
	vi.stubGlobal("SpeechSynthesisUtterance", Utterance);
});
afterEach(() => {
	document.body.replaceChildren();
	vi.useRealTimers();
	vi.unstubAllGlobals();
});
it("adds independent punctuation gaps while retaining punctuation and source offsets", () => {
	const text = "Bonjour, voici : une idée; oui ! Vraiment ? Fin.";
	expect(gaps(text)).toEqual([200, 300, 400, 600, 600, 600]);
	const words = speechSequence(text, 0, {
		comma: 200,
		semicolon: 400,
		colon: 300,
		sentence: 600,
	}).filter((x) => "text" in x);
	expect(words.map((x) => x.text)).toEqual([
		"Bonjour,",
		"voici :",
		"une idée;",
		"oui !",
		"Vraiment ?",
		"Fin.",
	]);
	for (const step of words)
		expect(text.slice(step.offset, step.offset + step.text.length)).toBe(
			step.text,
		);
	expect(visibleSpeechText(text)).toBe(text);
});
it("coalesces punctuation clusters, preserves closing quotes and avoids decimals, times and URL internals", () => {
	expect(gaps("« Oui ! » Ensuite… Vraiment?! Fin...")).toEqual([
		600, 600, 600, 600,
	]);
	expect(gaps("3,14 3.14 12:30 https://example.test/a;b,c")).toEqual([]);
	expect(
		gaps("« Oui ! » Ensuite", 0, {
			comma: 0,
			semicolon: 0,
			colon: 0,
			sentence: 600,
		}),
	).toEqual([600]);
});
it("lets explicit pauses, including zero, override automatic punctuation and line gaps", () => {
	expect(gaps("Oui. [pause=50] Non. [pause=0] Fin.", 800)).toEqual([
		50, 0, 600,
	]);
	expect(gaps("Oui.\nSuite.", 800)).toEqual([800, 600]);
	expect(gaps("Oui.[voice=Kate][hide-text][pause=0]Non.")).toEqual([0, 600]);
});
it("preserves voices, cue ordering and disabled speech across punctuation splits", () => {
	const text =
		"[voice=Kate]Oui, suite. [trigger=clic][speech-off]Non, non.[speech-on]Fin.";
	const steps = speechSequence(text, 0, { comma: 200, sentence: 600 });
	expect(
		steps.filter((x) => "text" in x).map((x) => [x.text, x.voice]),
	).toEqual([
		["Oui,", "Kate"],
		["suite.", "Kate"],
		["Fin.", "Kate"],
	]);
	const cue = steps.findIndex((x) => "trigger" in x);
	expect(steps[cue - 1]).toEqual({ pause: 600, explicit: false });
});
it.each(["A\n\nB", "A\r\n \t\r\nB", "A\n  \nB"])(
	"adds one blank-line gap in %j without pausing ordinary line wrapping",
	(text) => {
		expect(
			speechSequence(text, 0, { blankLine: 900 }).filter((x) => "pause" in x),
		).toEqual([{ pause: 900, explicit: false }]);
		expect(
			speechSequence("A\nB", 0, { blankLine: 900 }).filter((x) => "pause" in x),
		).toEqual([]);
	},
);
it("accumulates blank lines, merges coincident automatic gaps and ignores leading/trailing blank lines", () => {
	expect(
		speechSequence("\n\nA\n\n\nB\n\n", 0, { blankLine: 500 }).filter(
			(x) => "pause" in x,
		),
	).toEqual([{ pause: 1000, explicit: false }]);
	expect(
		speechSequence("A.\n\nB", 300, { blankLine: 900, sentence: 600 }).filter(
			(x) => "pause" in x,
		),
	).toEqual([{ pause: 900, explicit: false }]);
	expect(
		speechSequence("A.\n\n[pause=0]B", 300, {
			blankLine: 900,
			sentence: 600,
		}).filter((x) => "pause" in x),
	).toEqual([{ pause: 0, explicit: true }]);
	expect(
		speechSequence("A[speech-off]\n\nHidden[speech-on]B", 0, {
			blankLine: 900,
		}).filter((x) => "pause" in x),
	).toEqual([]);
});
it("waits before a cue, freezes the remaining gap and cancels queued punctuation on Stop", async () => {
	const r = await mount("Oui. [trigger=clic] Suite, fin.");
	r.pauseAfterSentence = 600;
	r.pauseAfterComma = 200;
	const cue = vi.fn();
	r.addEventListener("tp-text-to-speech-trigger", cue);
	await r.speak();
	expect(current().text).toBe("Oui.");
	current().dispatchEvent(new Event("end"));
	vi.advanceTimersByTime(200);
	r.pause();
	vi.advanceTimersByTime(5000);
	expect(cue).not.toHaveBeenCalled();
	r.resume();
	vi.advanceTimersByTime(399);
	expect(cue).not.toHaveBeenCalled();
	vi.advanceTimersByTime(1);
	expect(cue).toHaveBeenCalledOnce();
	expect(current().text).toBe("Suite,");
	current().dispatchEvent(new Event("end"));
	r.stop();
	vi.advanceTimersByTime(2000);
	expect(synthesis.speak).toHaveBeenCalledTimes(2);
});
it("waits for the final punctuation pause before reporting completion and leaves source text intact", async () => {
	const r = await mount("Fin.");
	r.pauseAfterSentence = 600;
	const end = vi.fn();
	r.addEventListener("tp-text-to-speech-end", end);
	await r.speak();
	current().dispatchEvent(new Event("end"));
	vi.advanceTimersByTime(599);
	expect(end).not.toHaveBeenCalled();
	vi.advanceTimersByTime(1);
	expect(end).toHaveBeenCalledOnce();
	expect(r.getAttribute("value")).toBe("Fin.");
	expect(r.querySelector("[data-role=text]")?.textContent).toBe("Fin.");
});
it("uses default gaps, supports overrides, validates durations and stops active reading on configuration changes", async () => {
	const r = await mount("A, B.");
	for (const [attribute, property, defaultValue] of [
		["pause-after-comma", "pauseAfterComma", 200],
		["pause-after-semicolon", "pauseAfterSemicolon", 400],
		["pause-after-colon", "pauseAfterColon", 400],
		["pause-after-sentence", "pauseAfterSentence", 600],
		["pause-per-blank-line", "pausePerBlankLine", 1000],
	] as const) {
		expect(r[property]).toBe(defaultValue);
		r[property] = 0;
		expect(r[property]).toBe(0);
		r[property] = 125;
		expect(r.getAttribute(attribute)).toBe("125");
		for (const value of ["-1", "1.5", "x", "2147483648"]) {
			r.setAttribute(attribute, value);
			expect(r[property]).toBe(0);
		}
		r.removeAttribute(attribute);
		expect(r[property]).toBe(defaultValue);
	}
	await r.speak();
	r.pausePerBlankLine = 900;
	expect(r.dataset.state).toBe("idle");
});

it("accepts nonbreaking whitespace in blank lines and before French closing quotes", () => {
	expect(
		speechSequence("A\n\u00a0\nB", 0, { blankLine: 900 }).filter(
			(step) => "pause" in step,
		),
	).toEqual([{ pause: 900, explicit: false }]);
	expect(
		speechSequence("« Oui !\u202f» Après.", 0, { sentence: 600 })
			.filter((step) => "text" in step)
			.map((step) => step.text),
	).toEqual(["« Oui !\u202f»", "Après."]);
});

it("applies default pauses to unconfigured narration", async () => {
	const r = await mount("A, B; C: D.\n\nE!");
	await r.speak();
	for (const [text, duration, next] of [
		["A,", 200, "B;"],
		["B;", 400, "C:"],
		["C:", 400, "D."],
		["D.", 1000, "E!"],
	] as const) {
		expect(current().text).toBe(text);
		current().dispatchEvent(new Event("end"));
		vi.advanceTimersByTime(duration - 1);
		expect(current().text).toBe(text);
		vi.advanceTimersByTime(1);
		expect(current().text).toBe(next);
	}
	const end = vi.fn();
	r.addEventListener("tp-text-to-speech-end", end);
	current().dispatchEvent(new Event("end"));
	vi.advanceTimersByTime(599);
	expect(end).not.toHaveBeenCalled();
	vi.advanceTimersByTime(1);
	expect(end).toHaveBeenCalledOnce();
});
