import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { afterEach, expect, it, vi } from "vitest";

// Execute the actual documentation helper without adding public/ to TS rootDir.
const helperSource = readFileSync(
	"public/docs/components/text-to-speech/examples/voice-comparison.js",
	"utf8",
).replace("export function", "function");
const setupVoiceComparison = runInNewContext(
	`${helperSource}\nsetupVoiceComparison;`,
	{ document },
) as () => void;

afterEach(() => {
	window.dispatchEvent(new Event("pagehide"));
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});

it("filters voices by language and applies selections without playing", () => {
	const synthesis = new EventTarget();
	const getVoices = vi.fn(() => [
		{
			name: "English voice",
			lang: "en-US",
			voiceURI: "english",
			localService: true,
		},
		{
			name: "British voice",
			lang: "en-GB",
			voiceURI: "british",
			localService: true,
		},
	]);
	Object.assign(synthesis, { getVoices });
	vi.stubGlobal("speechSynthesis", synthesis);
	document.body.innerHTML =
		'<tp-text-to-speech id="voice-comparison" lang="en-US"></tp-text-to-speech>';
	const speech = document.querySelector("tp-text-to-speech");
	const stop = vi.fn();
	const speak = vi.fn();
	Object.assign(speech ?? {}, { stop, speak });
	setupVoiceComparison();
	setupVoiceComparison();
	expect(document.querySelectorAll("select")).toHaveLength(2);
	const select = document.querySelector<HTMLSelectElement>(
		'[data-role="speech-voice"]',
	);
	const language = document.querySelector<HTMLSelectElement>(
		'[data-role="speech-language"]',
	);
	if (!language) throw new Error("Expected a language selector");
	if (!select) throw new Error("Expected a voice selector");
	expect(select.options).toHaveLength(2);
	select.value = "english";
	select.dispatchEvent(new Event("change"));
	expect(speech?.getAttribute("voice")).toBe("English voice");
	expect(speech?.getAttribute("lang")).toBe("en-US");
	select.value = "";
	select.dispatchEvent(new Event("change"));
	expect(speech?.hasAttribute("voice")).toBe(false);
	expect(speech?.getAttribute("lang")).toBe("en-US");
	expect(stop).toHaveBeenCalledTimes(2);
	language.value = "en-GB";
	language.dispatchEvent(new Event("change"));
	expect(speech?.getAttribute("lang")).toBe("en-GB");
	expect(speech?.getAttribute("value")).toContain("Welcome");
	expect(Array.from(select.options).map((option) => option.value)).toEqual([
		"",
		"british",
	]);
	select.value = "british";
	select.dispatchEvent(new Event("change"));
	expect(speech?.getAttribute("voice")).toBe("British voice");
	const text = document.querySelector("textarea");
	if (!text) throw new Error("Expected editable sample text");
	text.value = "Bonjour Albert";
	text.dispatchEvent(new Event("input"));
	expect(speech?.getAttribute("value")).toBe("Bonjour Albert");
	expect(speak).not.toHaveBeenCalled();
	synthesis.dispatchEvent(new Event("voiceschanged"));
	expect(getVoices).toHaveBeenCalledTimes(2);
	expect(language.value).toBe("en-GB");
	window.dispatchEvent(new Event("pagehide"));
	synthesis.dispatchEvent(new Event("voiceschanged"));
	expect(getVoices).toHaveBeenCalledTimes(2);
});

it.each([
	["en", ["en", "en-GB", "en-US"]],
	["en-US", ["en-GB", "en-US"]],
	["fr", ["fr", "fr-CA", "fr-FR"]],
	["fr-CA", ["fr-CA", "fr-FR"]],
	["FR", ["FR", "fr-CA", "fr-FR"]],
	["de-DE", ["de-AT", "de-DE"]],
])(
	"restricts locales to the initial %s family, including late voices",
	(initial, expected) => {
		const synthesis = new EventTarget();
		const getVoices = vi.fn((): { lang: string }[] => []);
		Object.assign(synthesis, { getVoices });
		vi.stubGlobal("speechSynthesis", synthesis);
		const speech = document.createElement("tp-text-to-speech");
		speech.id = "voice-comparison";
		speech.setAttribute("lang", initial);
		document.body.append(speech);
		setupVoiceComparison();
		const language = document.querySelector<HTMLSelectElement>(
			'[data-role="speech-language"]',
		);
		if (!language) throw new Error("Expected a language selector");
		expect(Array.from(language.options, (option) => option.value)).toEqual([
			initial,
		]);
		getVoices.mockReturnValue(
			["en-US", "en-GB", "fr-FR", "fr-CA", "de-DE", "de-AT", "eng-US"].map(
				(lang) => ({ lang }),
			),
		);
		synthesis.dispatchEvent(new Event("voiceschanged"));
		expect(Array.from(language.options, (option) => option.value)).toEqual(
			expected,
		);
		expect(language.value).toBe(initial);
	},
);

it("reports unavailable speech synthesis", () => {
	vi.stubGlobal("speechSynthesis", undefined);
	document.body.innerHTML =
		'<tp-text-to-speech id="voice-comparison"></tp-text-to-speech>';
	setupVoiceComparison();
	expect(document.querySelector("select")?.disabled).toBe(true);
	expect(document.querySelector('[role="status"]')?.textContent).toContain(
		"unavailable",
	);
});
