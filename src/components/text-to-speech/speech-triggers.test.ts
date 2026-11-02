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
async function mount(value: string) {
	const reader = new TpTextToSpeech();
	reader.setAttribute("value", value);
	reader.setAttribute("show-text", "");
	document.body.append(reader);
	for (let i = 0; i < 12; i++) await Promise.resolve();
	return reader;
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
it("keeps named trigger offsets while removing commands from transcript and speech", () => {
	const text = "A [trigger=clic] B [trigger=chapter:2]";
	expect(speechSequence(text, 0)).toEqual([
		{ text: "A", offset: 0 },
		{ trigger: "clic", offset: 2 },
		{ text: "B", offset: 17 },
		{ trigger: "chapter:2", offset: 19 },
	]);
	expect(visibleSpeechText(text)).toBe("A  B ");
	expect(spokenSpeechText(text)).toBe("A  B ");
	const invalid = "[trigger=] [trigger=two words] [trigger=broken";
	expect(visibleSpeechText(invalid)).toBe(invalid);
});
it("emits triggers only after preceding speech and explicit silence, once per encounter", async () => {
	const reader = await mount(
		"Before [pause=100] [trigger=clic] After [trigger=clic]",
	);
	const trigger = vi.fn();
	reader.addEventListener("tp-text-to-speech-trigger", trigger);
	await reader.speak();
	expect(trigger).not.toHaveBeenCalled();
	expect(current().text).toBe("Before");
	current().dispatchEvent(new Event("end"));
	vi.advanceTimersByTime(99);
	expect(trigger).not.toHaveBeenCalled();
	vi.advanceTimersByTime(1);
	expect(trigger.mock.calls[0]?.[0]?.detail).toEqual({
		name: "clic",
		offset: 19,
	});
	expect(current().text).toBe("After");
	current().dispatchEvent(new Event("end"));
	expect(trigger).toHaveBeenCalledTimes(2);
	expect(reader.dataset.state).toBe("idle");
});
it("stops reentrant playback immediately when a trigger navigates away", async () => {
	const reader = await mount("Before [trigger=clic] Never spoken");
	reader.addEventListener("tp-text-to-speech-trigger", () => reader.stop());
	await reader.speak();
	current().dispatchEvent(new Event("end"));
	expect(synthesis.speak).toHaveBeenCalledTimes(1);
	expect(reader.dataset.state).toBe("idle");
});
it("freezes at a trigger and continues at the following text on resume", async () => {
	const reader = await mount("Before [trigger=clic] After");
	reader.addEventListener("tp-text-to-speech-trigger", () => reader.pause(), {
		once: true,
	});
	await reader.speak();
	current().dispatchEvent(new Event("end"));
	expect(reader.dataset.state).toBe("paused");
	expect(synthesis.speak).toHaveBeenCalledTimes(1);
	reader.resume();
	expect(current().text).toBe("After");
});
it("suppresses triggers in speech-off passages but retains them in hidden passages", () => {
	const source =
		"[speech-off][trigger=ignored][speech-on][hide-text][trigger=clic][show-text]Hello";
	expect(speechSequence(source, 0).filter((x) => "trigger" in x)).toEqual([
		{ trigger: "clic", offset: source.indexOf("[trigger=clic]") },
	]);
});
it("supports trigger-only sources and cancels triggers queued after Stop", async () => {
	const reader = await mount("[trigger=clic][pause=100][trigger=clic]");
	const trigger = vi.fn();
	reader.addEventListener("tp-text-to-speech-trigger", trigger);
	await reader.speak();
	expect(trigger).toHaveBeenCalledTimes(1);
	reader.stop();
	vi.advanceTimersByTime(100);
	expect(trigger).toHaveBeenCalledTimes(1);
});
