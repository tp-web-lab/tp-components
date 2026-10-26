import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { speechSequence, visibleSpeechText } from "./speech-sequence.js";
import { TpTextToSpeech } from "./text-to-speech.js";

class Utterance extends EventTarget {
	voice: SpeechSynthesisVoice | null = null;
	lang = "";
	constructor(public text: string) {
		super();
	}
}
const voices = [
	{ name: "Daniel", lang: "en-GB" },
	{ name: "Kate", lang: "en-GB" },
	{ name: "Amélie", lang: "fr-FR" },
] as SpeechSynthesisVoice[];
const synthesis = {
	speak: vi.fn(),
	cancel: vi.fn(),
	pause: vi.fn(),
	resume: vi.fn(),
	getVoices: vi.fn(() => voices),
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
};
const current = (): Utterance => synthesis.speak.mock.calls.at(-1)?.[0];
async function mount(text: string) {
	const reader = new TpTextToSpeech();
	reader.setAttribute("lang", "en-GB");
	reader.setAttribute("voice", "Daniel");
	reader.setAttribute("value", text);
	reader.setAttribute("show-text", "");
	document.body.append(reader);
	for (let i = 0; i < 8; i++) await Promise.resolve();
	return reader;
}
beforeEach(() => {
	vi.useFakeTimers();
	vi.clearAllMocks();
	synthesis.getVoices.mockReturnValue(voices);
	vi.stubGlobal("speechSynthesis", synthesis);
	vi.stubGlobal("SpeechSynthesisUtterance", Utterance);
});
afterEach(() => {
	document.body.replaceChildren();
	vi.useRealTimers();
	vi.unstubAllGlobals();
});
it("parses names with spaces and preserves source offsets and explicit pauses", () => {
	const source =
		"A\n[voice=Microsoft Sonia Online] [pause=250] B\n[voice=default] C";
	expect(speechSequence(source, 800)).toEqual([
		{ text: "A", offset: 0 },
		{ pause: 250, explicit: true },
		{ text: "B", offset: source.indexOf("B"), voice: "Microsoft Sonia Online" },
		{ pause: 800, explicit: false },
		{ text: "C", offset: source.lastIndexOf("C"), voice: "default" },
	]);
	expect(visibleSpeechText(source)).toBe("A\n  B\n C");
	expect(visibleSpeechText("[voice=] [voice=   ] [voice=broken")).toBe(
		"[voice=] [voice=   ] [voice=broken",
	);
});
it("switches voices, keeps them across pauses and falls back to the component voice", async () => {
	const reader = await mount(
		"Hello [voice=kAtE] Hi [pause=200] Again [voice=Missing] Fallback [voice=Amélie] Bonjour [voice=default] Goodbye",
	);
	expect(reader.querySelector('[data-role="text"]')?.textContent).toBe(
		"Hello  Hi  Again  Fallback  Bonjour  Goodbye",
	);
	await reader.speak();
	expect(current().voice).toBe(voices[0]);
	current().dispatchEvent(new Event("end"));
	expect(current().voice).toBe(voices[1]);
	current().dispatchEvent(new Event("end"));
	vi.advanceTimersByTime(200);
	expect(current().text).toBe("Again");
	expect(current().voice).toBe(voices[1]);
	current().dispatchEvent(new Event("end"));
	expect(current().voice).toBe(voices[0]);
	current().dispatchEvent(new Event("end"));
	expect(current().voice).toBe(voices[2]);
	expect(current().lang).toBe("fr-FR");
	current().dispatchEvent(new Event("end"));
	expect(current().voice).toBe(voices[0]);
	reader.stop();
	await reader.speak();
	expect(current().text).toBe("Hello");
	expect(current().voice).toBe(voices[0]);
	expect(reader.voice).toBe("Daniel");
});
it("falls back to the browser if the voice catalogue stays empty", async () => {
	synthesis.getVoices.mockReturnValue([]);
	const reader = await mount("[voice=Unknown] Hello");
	const speaking = reader.speak();
	await vi.advanceTimersByTimeAsync(1000);
	await speaking;
	expect(current().text).toBe("Hello");
	expect(current().voice).toBeNull();
	expect(synthesis.removeEventListener).toHaveBeenCalledWith(
		"voiceschanged",
		expect.any(Function),
	);
});
it("does not start after Stop while waiting for voices", async () => {
	synthesis.getVoices.mockReturnValue([]);
	const reader = await mount("[voice=Kate] Hello");
	const speaking = reader.speak();
	reader.stop();
	await vi.advanceTimersByTimeAsync(1000);
	await speaking;
	expect(synthesis.speak).not.toHaveBeenCalled();
});
