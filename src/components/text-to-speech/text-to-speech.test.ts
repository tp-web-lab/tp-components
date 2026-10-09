import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TpDropdown } from "../dropdown/dropdown.js";

class UtteranceMock extends EventTarget {
	public lang = "";
	public rate = 1;
	public pitch = 1;
	public volume = 1;
	public voice: SpeechSynthesisVoice | null = null;
	public constructor(public text: string) {
		super();
	}
}

const voices = [
	{ name: "Demo voice", lang: "en-US" },
	{ name: "Voix française", lang: "fr-FR" },
] as SpeechSynthesisVoice[];
const synthesis = {
	speaking: false,
	pending: false,
	paused: false,
	cancel: vi.fn(),
	pause: vi.fn(),
	resume: vi.fn(),
	speak: vi.fn(),
	getVoices: vi.fn(() => voices),
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
};

await import("./text-to-speech.js");

const settle = async (): Promise<void> => {
	await Promise.resolve();
	await Promise.resolve();
	await Promise.resolve();
	await Promise.resolve();
	await new Promise((resolve) => setTimeout(resolve, 0));
};

describe("<tp-text-to-speech>", () => {
	it("reads ordinary document elements without changing their content or including controls", async () => {
		document.body.innerHTML =
			'<article id="article"><h2>A title</h2><p>Hello <strong>world</strong>.<br>Next line.</p><p hidden>Hidden</p><p style="display:none">Invisible</p><span aria-hidden="true">Decorative</span><button>Ignore button</button><script>ignoreScript()</script><tp-text-to-speech for="article" value="Ignored" show-text></tp-text-to-speech></article>';
		const reader = document.querySelector("tp-text-to-speech");
		const strong = document.querySelector("strong");
		if (!reader) throw new Error("Missing reader");
		await settle();
		await reader.speak();
		const text = synthesis.speak.mock.calls.at(-1)?.[0].text as string;
		expect(text).toContain("A title");
		expect(text).toContain("Hello world.\nNext line.");
		expect(text).not.toMatch(
			/Hidden|Invisible|Decorative|Ignore|Speak|Ready|ignoreScript/,
		);
		expect(document.querySelector("strong")).toBe(strong);
		expect(document.querySelector("[data-tp-typewriting-unit]")).toBeNull();
		if (strong) strong.textContent = "everyone";
		await settle();
		expect(reader.dataset.state).toBe("idle");
		await reader.speak();
		expect(synthesis.speak.mock.calls.at(-1)?.[0].text).toContain(
			"Hello everyone.",
		);
		reader.id = "self";
		reader.htmlFor = "self";
		await settle();
		expect(reader.querySelector('[role="status"]')?.textContent).toContain(
			"cannot reference itself",
		);
		reader.htmlFor = "";
		await settle();
		await reader.speak();
		expect(synthesis.speak.mock.calls.at(-1)?.[0].text).toBe("Ignored");
	});
	it("resolves the registered target when its module is evaluated again", async () => {
		const registered = customElements.get("tp-typewriting");
		vi.resetModules();
		const { TpTypewriting: ReloadedTarget } = await import(
			"../typewriting/typewriting.js"
		);
		const { TpTextToSpeech: ReloadedReader } = await import(
			"./text-to-speech.js"
		);
		expect(ReloadedTarget).not.toBe(registered);
		customElements.define("tp-speech-reloaded-test", ReloadedReader);
		const target = document.createElement("tp-typewriting");
		target.id = "registered-reading";
		target.textContent = "Registered text";
		const reader = document.createElement("tp-speech-reloaded-test");
		reader.setAttribute("for", target.id);
		reader.setAttribute("show-text", "");
		document.body.append(target, reader);
		await settle();
		expect(reader.querySelector('[data-role="text"]')?.textContent).toBe(
			"Registered text",
		);
		expect(reader.querySelector('[role="status"]')?.textContent).toBe("Ready.");
		if (!(reader instanceof ReloadedReader))
			throw new Error("Missing reloaded reader");
		await reader.speak();
		expect(synthesis.speak.mock.calls.at(-1)?.[0].text).toBe("Registered text");
		reader.remove();
		target.remove();
	});
	/** Emits a browser-style word boundary using UTF-16 offsets. */
	function boundary(
		utterance: UtteranceMock,
		charIndex: number,
		name = "word",
	): void {
		utterance.dispatchEvent(
			Object.assign(new Event("boundary"), { charIndex, name }),
		);
	}
	it("synchronizes linked formatted text, pause/resume, stop and stale utterances", async () => {
		document.body.innerHTML =
			'<tp-typewriting id="reading" speed="1000" loop><p>Hello <strong>world</strong> again.</p></tp-typewriting><tp-text-to-speech for="reading" value="Ignored"></tp-text-to-speech>';
		const reader = document.querySelector("tp-text-to-speech");
		const target = document.querySelector("tp-typewriting");
		if (!reader || !target) throw new Error("Missing fixture");
		await settle();
		expect(reader.htmlFor).toBe("reading");
		expect(target.querySelector("[data-pending]")).toBeNull();
		await reader.speak();
		const utterance = synthesis.speak.mock.calls[0]?.[0] as UtteranceMock;
		expect(utterance.text).toBe("Hello world again.");
		expect(target.querySelector("[data-pending]")).toBeNull();
		boundary(utterance, 0, "sentence");
		expect(target.querySelector("[data-pending]")).toBeNull();
		boundary(utterance, 0);
		expect(target.querySelectorAll("[data-pending]")).toHaveLength(13);
		synthesis.speaking = true;
		reader.pause();
		boundary(utterance, 6);
		expect(target.querySelectorAll("[data-pending]")).toHaveLength(13);
		synthesis.paused = true;
		reader.resume();
		boundary(utterance, 6);
		expect(target.querySelectorAll("strong [data-pending]")).toHaveLength(0);
		expect(target.querySelectorAll("[data-pending]")).toHaveLength(7);
		reader.stop();
		expect(target.querySelector("[data-pending]")).toBeNull();
		boundary(utterance, 0);
		utterance.dispatchEvent(new Event("start"));
		expect(reader.dataset.state).toBe("idle");
		await reader.speak();
		const next = synthesis.speak.mock.calls[1]?.[0] as UtteranceMock;
		boundary(next, 0);
		target.dispatchEvent(new Event("pointerdown"));
		boundary(next, 6);
		expect(target.querySelector("[data-pending]")).toBeNull();
		next.dispatchEvent(new Event("end"));
		expect(reader.dataset.state).toBe("idle");
	});
	it("keeps text readable without boundaries and handles content changes, errors and retargeting", async () => {
		document.body.innerHTML =
			'<tp-typewriting id="one"><p>A <strong>😀 word</strong></p><p>Next</p><button>Ignore</button></tp-typewriting><tp-typewriting id="two">Second</tp-typewriting><tp-text-to-speech for="one"></tp-text-to-speech>';
		const reader = document.querySelector("tp-text-to-speech");
		const target = document.querySelector("tp-typewriting");
		if (!reader || !target) throw new Error("Missing fixture");
		await settle();
		await reader.speak();
		const utterance = synthesis.speak.mock.calls[0]?.[0] as UtteranceMock;
		expect(utterance.text).toBe("A 😀 word\nNext");
		expect(target.querySelector("[data-pending]")).toBeNull();
		boundary(utterance, 5);
		expect(target.querySelectorAll("strong [data-pending]")).toHaveLength(0);
		utterance.dispatchEvent(new ErrorEvent("error", { error: "network" }));
		expect(target.querySelector("[data-pending]")).toBeNull();
		await reader.speak();
		target.append("Changed");
		await settle();
		expect(reader.dataset.state).toBe("idle");
		reader.htmlFor = "two";
		await settle();
		await reader.speak();
		expect(synthesis.speak.mock.calls.at(-1)?.[0].text).toBe("Second");
		reader.htmlFor = "missing";
		await settle();
		expect(reader.querySelector('[role="status"]')?.textContent).toContain(
			"No element",
		);
		await reader.speak();
		reader.htmlFor = "";
		reader.value = "Local";
		await settle();
		await reader.speak();
		expect(synthesis.speak.mock.calls.at(-1)?.[0].text).toBe("Local");
		reader.remove();
	});
	it("uses a single labelled icon to speak and stop in lite mode", async () => {
		const element = document.createElement("tp-text-to-speech");
		expect(element.lite).toBe(false);
		element.lite = true;
		element.value = "Compact speech";
		document.body.append(element);
		await settle();
		expect(element.querySelectorAll("tp-icon-button")).toHaveLength(1);
		expect(element.querySelector("tp-button, tp-dropdown")).toBeNull();
		const button = element.querySelector<HTMLElement>(
			'[data-action="toggle-speech"]',
		);
		expect(button?.getAttribute("name")).toBe("speakerphone");
		expect(button?.getAttribute("label")).toBe("Speak");
		button?.click();
		expect(synthesis.speak).toHaveBeenCalledOnce();
		expect(button?.getAttribute("name")).toBe("speakerphone-off");
		expect(button?.getAttribute("label")).toBe("Stop");
		button?.click();
		expect(element.dataset.state).toBe("idle");
		expect(button?.getAttribute("name")).toBe("speakerphone");
		button?.click();
		const utterance = synthesis.speak.mock.calls[1]?.[0] as UtteranceMock;
		utterance.dispatchEvent(new Event("end"));
		expect(button?.getAttribute("label")).toBe("Speak");
		element.showText = true;
		expect(element.querySelector('[data-role="text"]')?.textContent).toBe(
			"Compact speech",
		);
		element.lite = false;
		expect(element.hasAttribute("lite")).toBe(false);
		expect(element.querySelectorAll("tp-button")).toHaveLength(4);
	});

	it("disables lite playback with an empty source or an unavailable API", async () => {
		const element = document.createElement("tp-text-to-speech");
		element.setAttribute("lite", "false");
		document.body.append(element);
		await settle();
		expect(element.lite).toBe(true);
		expect(
			element.querySelector("tp-icon-button")?.hasAttribute("disabled"),
		).toBe(true);
		element.querySelector<HTMLElement>("tp-icon-button")?.click();
		expect(synthesis.speak).not.toHaveBeenCalled();
		vi.stubGlobal("speechSynthesis", undefined);
		element.value = "Unavailable";
		await settle();
		expect(
			element.querySelector("tp-icon-button")?.hasAttribute("disabled"),
		).toBe(true);
		expect(element.querySelector('[role="status"]')?.textContent).toContain(
			"unavailable",
		);
	});
	it("preserves the introductory script when an already connected element is upgraded", async () => {
		document.body.innerHTML = `<tp-speech-upgrade-test lang="en-US" show-text>
		  <script type="tp/txt">Welcome to tp-components. This example uses the browser speech synthesis service.</script>
		</tp-speech-upgrade-test>`;
		const Base = customElements.get("tp-text-to-speech");
		if (!Base)
			throw new Error("Expected the speech component to be registered");
		customElements.define("tp-speech-upgrade-test", class extends Base {});
		await settle();
		const element = document.querySelector("tp-speech-upgrade-test");
		expect(element?.querySelector('[data-role="text"]')?.textContent).toBe(
			"Welcome to tp-components. This example uses the browser speech synthesis service.",
		);
		expect(
			element?.querySelector('[data-role="text"]')?.hasAttribute("hidden"),
		).toBe(false);
		element?.querySelector<HTMLElement>('[data-action="speak"]')?.click();
		await settle();
		expect(synthesis.speak.mock.calls[0]?.[0]).toMatchObject({
			text: "Welcome to tp-components. This example uses the browser speech synthesis service.",
		});
	});
	it("never reads generated controls as source and still accepts late author content", async () => {
		const element = document.createElement("tp-text-to-speech");
		element.lang = "en";
		element.showText = true;
		document.body.append(element);
		await settle();
		expect(element.querySelector('[data-role="text"]')?.textContent).toBe("");
		await element.speak();
		expect(synthesis.speak).not.toHaveBeenCalled();
		const script = document.createElement("script");
		script.type = "tp/txt";
		script.textContent = "Only the author text.";
		element.append(script);
		await settle();
		expect(element.querySelector('[data-role="text"]')?.textContent).toBe(
			"Only the author text.",
		);
		await element.speak();
		expect(synthesis.speak.mock.calls[0]?.[0]).toMatchObject({
			text: "Only the author text.",
		});
	});

	it("does not replace a cleared value with the generated interface", async () => {
		const element = document.createElement("tp-text-to-speech");
		element.value = "Initial text";
		document.body.append(element);
		await settle();
		element.value = "";
		await settle();
		expect(element.querySelector('[data-role="text"]')?.textContent).toBe("");
	});
	beforeEach(() => {
		vi.stubGlobal("SpeechSynthesisUtterance", UtteranceMock);
		vi.stubGlobal("speechSynthesis", synthesis);
		document.head.replaceChildren();
		document.body.replaceChildren();
		Object.assign(synthesis, {
			speaking: false,
			pending: false,
			paused: false,
		});
		vi.clearAllMocks();
		synthesis.getVoices.mockReturnValue(voices);
	});

	afterEach(() => vi.unstubAllGlobals());

	it("loads an inline script, renders tp-button controls and speaks", async () => {
		const element = document.createElement("tp-text-to-speech");
		element.setAttribute("lang", "en-US");
		element.setAttribute("voice", "Demo voice");
		element.setAttribute("rate", "1.5");
		element.setAttribute("pitch", "1.2");
		element.setAttribute("volume", "0.8");
		element.innerHTML = '<script type="tp/txt">  Hello library. </script>';
		document.body.append(element);
		await settle();

		expect(element.querySelector('[data-role="text"]')?.textContent).toBe(
			"Hello library.",
		);
		expect(element.querySelector("tp-button-group")).not.toBeNull();
		expect(element.querySelectorAll("tp-button")).toHaveLength(4);
		const status = element.querySelector('[data-role="status"]');
		expect(status?.parentElement).toBe(
			element.querySelector("tp-button-group"),
		);
		expect(status?.previousElementSibling?.getAttribute("data-action")).toBe(
			"stop",
		);
		expect(status?.getAttribute("aria-live")).toBe("polite");
		element.querySelector<HTMLElement>('[data-action="speak"]')?.click();
		await settle();
		expect(synthesis.cancel).toHaveBeenCalledOnce();
		const utterance = synthesis.speak.mock
			.calls[0]?.[0] as unknown as UtteranceMock;
		expect(utterance).toMatchObject({
			text: "Hello library.",
			lang: "en-US",
			rate: 1.5,
			pitch: 1.2,
			volume: 0.8,
			voice: voices[0],
		});
		utterance.dispatchEvent(new Event("start"));
		expect(element.dataset.state).toBe("speaking");
		utterance.dispatchEvent(new Event("end"));
		expect(element.dataset.state).toBe("idle");
	});

	it("pauses, resumes, stops and reports synthesis errors", async () => {
		const element = document.createElement("tp-text-to-speech");
		element.textContent = "Read me";
		document.body.append(element);
		await settle();
		expect(element).toMatchObject({ rate: 1, pitch: 1, volume: 1 });
		await element.speak();
		const utterance = synthesis.speak.mock
			.calls[0]?.[0] as unknown as UtteranceMock;
		expect(utterance).toMatchObject({ rate: 1, pitch: 1, volume: 1 });

		synthesis.speaking = true;
		element.querySelector<HTMLElement>('[data-action="pause"]')?.click();
		expect(synthesis.pause).toHaveBeenCalled();
		synthesis.paused = true;
		element.querySelector<HTMLElement>('[data-action="resume"]')?.click();
		expect(synthesis.resume).toHaveBeenCalled();
		utterance.dispatchEvent(new ErrorEvent("error", { error: "network" }));
		expect(element.querySelector('[role="status"]')?.textContent).toContain(
			"network",
		);
		element.querySelector<HTMLElement>('[data-action="stop"]')?.click();
		synthesis.speaking = false;
		synthesis.paused = false;
		element.pause();
		element.resume();
		expect(element.dataset.state).toBe("idle");
	});

	it("loads src, supports autoplay and reports fetch failures", async () => {
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValueOnce({ ok: true, text: async () => "External text" })
				.mockResolvedValueOnce({ ok: false, status: 404 }),
		);
		const element = document.createElement("tp-text-to-speech");
		element.setAttribute("autoplay", "");
		element.setAttribute("src", "speech.txt");
		document.body.append(element);
		await settle();
		expect(synthesis.speak).toHaveBeenCalledOnce();
		element.setAttribute("src", "missing.txt");
		await settle();
		expect(element.querySelector('[role="status"]')?.textContent).toContain(
			"404",
		);
	});

	it("reads value and gives src precedence over it", async () => {
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValue({ ok: true, text: async () => "External text" }),
		);
		const element = document.createElement("tp-text-to-speech");
		element.value = "Attribute text";
		document.body.append(element);
		await settle();
		expect(element.querySelector('[data-role="text"]')?.textContent).toBe(
			"Attribute text",
		);

		element.src = "speech.txt";
		await settle();
		expect(element.querySelector('[data-role="text"]')?.textContent).toBe(
			"External text",
		);
	});

	it("hides source text by default and displays it with show-text", async () => {
		const element = document.createElement("tp-text-to-speech");
		element.value = "Optional visible text";
		document.body.append(element);
		await settle();
		expect(
			element.querySelector('[data-role="text"]')?.hasAttribute("hidden"),
		).toBe(true);

		element.showText = true;
		expect(
			element.querySelector('[data-role="text"]')?.hasAttribute("hidden"),
		).toBe(false);
		expect(element.querySelector('[data-role="text"]')?.textContent).toBe(
			"Optional visible text",
		);

		element.showText = false;
		expect(
			element.querySelector('[data-role="text"]')?.hasAttribute("hidden"),
		).toBe(true);
	});

	it("handles late parser content and unavailable speech synthesis", async () => {
		vi.stubGlobal("speechSynthesis", undefined);
		vi.stubGlobal("SpeechSynthesisUtterance", undefined);
		const element = document.createElement("tp-text-to-speech");
		document.body.append(element);
		element.innerHTML = '<script type="tp/text-to-speech">Late text</script>';
		await settle();
		expect(element.querySelector('[role="status"]')?.textContent).toContain(
			"unavailable",
		);
		expect(
			Array.from(element.querySelectorAll("tp-button")).every((button) =>
				button.hasAttribute("disabled"),
			),
		).toBe(true);
		await element.speak();
	});

	it("reflects properties, validates numeric ranges and selects a voice by language", async () => {
		const element = document.createElement("tp-text-to-speech");
		element.src = "";
		element.voice = "fr-fr";
		element.rate = 20;
		element.pitch = -1;
		element.volume = 2;
		element.autoplay = true;
		element.value = "Bonjour";
		expect(element).toMatchObject({
			src: "",
			value: "Bonjour",
			voice: "fr-fr",
			rate: 1,
			pitch: 1,
			volume: 1,
			autoplay: true,
		});
		element.autoplay = false;
		document.body.append(element);
		await settle();
		await element.speak();
		expect(
			(
				synthesis.speak.mock.calls[0]?.[0] as unknown as
					| UtteranceMock
					| undefined
			)?.voice,
		).toBe(voices[1]);
		element.voice = "unknown";
		await element.speak();
		expect(
			(
				synthesis.speak.mock.calls[1]?.[0] as unknown as
					| UtteranceMock
					| undefined
			)?.voice,
		).toBeNull();
		element.voice = "";
		await element.speak();
		expect(
			(
				synthesis.speak.mock.calls[2]?.[0] as unknown as
					| UtteranceMock
					| undefined
			)?.voice,
		).toBeNull();
	});

	it("lets the browser select its default voice without waiting for a voice list", async () => {
		synthesis.getVoices.mockReturnValue([]);
		const parent = document.createElement("section");
		parent.lang = "en-US";
		const element = document.createElement("tp-text-to-speech");
		element.value = "Hello";
		parent.append(element);
		document.body.append(parent);
		await settle();
		synthesis.getVoices.mockClear();
		await element.speak();
		expect(synthesis.getVoices).not.toHaveBeenCalled();
		expect(synthesis.speak.mock.calls[0]?.[0]).toMatchObject({
			lang: "en-US",
			voice: null,
			pitch: 1,
			rate: 1,
			volume: 1,
		});
		element.lang = "fr-FR";
		await element.speak();
		expect(synthesis.speak.mock.calls[1]?.[0]).toMatchObject({
			lang: "fr-FR",
			voice: null,
		});
	});

	it("keeps the default voice when an explicit request cannot be found", async () => {
		const element = document.createElement("tp-text-to-speech");
		element.lang = "en-US";
		element.voice = "Missing voice";
		element.value = "Hello";
		document.body.append(element);
		await settle();
		await element.speak();
		expect(synthesis.speak.mock.calls[0]?.[0]).toMatchObject({
			lang: "en-US",
			voice: null,
		});
	});

	it("waits for asynchronously installed voices before speaking", async () => {
		let voicesChanged: EventListener | undefined;
		synthesis.addEventListener.mockImplementation((_name, listener) => {
			voicesChanged = listener as EventListener;
		});
		const element = document.createElement("tp-text-to-speech");
		element.lang = "fr-FR";
		element.voice = "Voix française";
		element.value = "Bonjour";
		document.body.append(element);
		await settle();

		synthesis.getVoices.mockReturnValueOnce([]).mockReturnValue(voices);
		const speaking = element.speak();
		expect(synthesis.speak).not.toHaveBeenCalled();
		voicesChanged?.(new Event("voiceschanged"));
		await speaking;

		expect(synthesis.removeEventListener).toHaveBeenCalledWith(
			"voiceschanged",
			expect.any(Function),
		);
		expect(
			(
				synthesis.speak.mock.calls[0]?.[0] as unknown as
					| UtteranceMock
					| undefined
			)?.voice,
		).toBe(voices[1]);
	});

	it("cleans up when disconnected and exposes its public metadata", async () => {
		const element = document.createElement("tp-text-to-speech");
		element.textContent = "Cleanup";
		document.body.append(element);
		await settle();
		expect(customElements.get("tp-text-to-speech")).toBeDefined();
		expect(
			(
				element.constructor as typeof HTMLElement & {
					observedAttributes: string[];
				}
			).observedAttributes,
		).toEqual(
			expect.arrayContaining(["dir", "lang", "src", "value", "show-text"]),
		);
		element.remove();
		expect(synthesis.cancel).toHaveBeenCalled();
	});

	it("offers compatible voices through settings without changing lang or autoplay", async () => {
		const element = document.createElement("tp-text-to-speech");
		element.lang = "en";
		element.value = "Hello";
		document.body.append(element);
		await settle();
		const trigger = element.querySelector("tp-icon-button");
		const dropdown = element.querySelector<TpDropdown>("tp-dropdown");
		expect(trigger?.getAttribute("name")).toBe("settings");
		expect(trigger?.getAttribute("library")).toBe("tp");
		expect(element.querySelector("tp-button-group")?.firstElementChild).toBe(
			trigger,
		);
		expect(dropdown?.anchor).toBe(`#${trigger?.id}`);
		expect(
			Array.from(
				element.querySelectorAll("[data-voice]"),
				(item) => (item as HTMLElement).dataset.voice,
			),
		).toEqual(["", "Demo voice"]);
		trigger?.click();
		expect(dropdown?.open).toBe(true);
		expect(trigger?.getAttribute("aria-expanded")).toBe("true");
		element.querySelector<HTMLElement>('[data-voice="Demo voice"]')?.click();
		expect(element.lang).toBe("en");
		expect(element.voice).toBe("Demo voice");
		expect(dropdown?.open).toBe(false);
		expect(synthesis.speak).not.toHaveBeenCalled();
		await element.speak();
		expect(synthesis.speak.mock.calls[0]?.[0]).toMatchObject({
			lang: "en",
			voice: voices[0],
		});
		element.querySelector<HTMLElement>('[data-voice=""]')?.click();
		expect(element.voice).toBe("");
		expect(element.lang).toBe("en");
		await element.speak();
		expect(synthesis.speak.mock.calls[1]?.[0]).toMatchObject({
			lang: "en",
			voice: null,
		});
		element.lang = "fr";
		expect(
			Array.from(
				element.querySelectorAll("[data-voice]"),
				(item) => (item as HTMLElement).dataset.voice,
			),
		).toEqual(["", "Voix française"]);
		const listener = synthesis.addEventListener.mock.calls.find(
			([name]) => name === "voiceschanged",
		)?.[1] as EventListener | undefined;
		synthesis.getVoices.mockReturnValue([
			...voices,
			{ name: "Canadian", lang: "fr-CA" } as SpeechSynthesisVoice,
		]);
		listener?.(new Event("voiceschanged"));
		expect(
			Array.from(
				element.querySelectorAll("[data-voice]"),
				(item) => (item as HTMLElement).dataset.voice,
			),
		).toEqual(["", "Canadian", "Voix française"]);
		element.remove();
		expect(synthesis.removeEventListener).toHaveBeenCalledWith(
			"voiceschanged",
			listener,
		);
	});
});
