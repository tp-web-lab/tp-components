import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { TpTextToSpeech } from "../text-to-speech/text-to-speech.js";
import { TpSlideNote } from "./slide-note.js";
import "../asciidoc-multi-slides/asciidoc-multi-slides.js";
import "../asciidoc/asciidoc.js";
import "../markdown/markdown.js";
import "../restructuredtext/restructuredtext.js";
import "../html-multi-slides/html-multi-slides.js";
import "../markdown-multi-slides/markdown-multi-slides.js";
import "../restructuredtext-multi-slides/restructuredtext-multi-slides.js";

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
	getVoices: () => [{ name: "French voice", lang: "fr-FR" }],
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
};
async function settle() {
	for (let i = 0; i < 20; i++) await Promise.resolve();
}
beforeEach(() => {
	vi.stubGlobal("speechSynthesis", synthesis);
	vi.stubGlobal("SpeechSynthesisUtterance", Utterance);
	vi.clearAllMocks();
});
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});
it("preserves inline scripts, inherits speech settings and retains disclosure state across renders", async () => {
	document.body.innerHTML = `<tp-slide-note lang="fr" legend="Notes du conférencier" show-text rate="1.2" pause-after-sentence="0"><script type="tp/txt">Bonjour. [trigger=clic] Suite.</script></tp-slide-note>`;
	const note = document.querySelector("tp-slide-note");
	if (!note) throw new Error("Missing note");
	await settle();
	expect(note).toBeInstanceOf(TpTextToSpeech);
	expect(note.querySelector("summary")?.textContent).toBe(
		"Notes du conférencier",
	);
	expect(note.querySelector("details")?.open).toBe(false);
	expect(note.querySelector('[data-role="text"]')?.textContent).toBe(
		"Bonjour.  Suite.",
	);
	expect(note.rate).toBe(1.2);
	expect(note.pauseAfterComma).toBe(200);
	note.open = true;
	note.lite = true;
	expect(note.querySelector("details")?.open).toBe(true);
	note.lite = false;
	note.setAttribute("legend", "Updated notes");
	expect(note.querySelector("summary")?.textContent).toBe("Updated notes");
	expect(note.querySelector("legend")?.textContent).toBe("Updated notes");
	expect(
		note.querySelector("legend")?.classList.contains("tp-visually-hidden"),
	).toBe(true);
	note.setAttribute("voice", "French voice");
	expect(
		note
			.querySelector('li[data-voice="French voice"]')
			?.getAttribute("aria-current"),
	).toBe("true");
	const cue = vi.fn();
	note.addEventListener("tp-text-to-speech-trigger", cue);
	await note.speak();
	expect(synthesis.speak.mock.calls.at(-1)?.[0].text).toBe("Bonjour.");
	synthesis.speak.mock.calls.at(-1)?.[0].dispatchEvent(new Event("end"));
	expect(cue).toHaveBeenCalledOnce();
	expect(synthesis.speak.mock.calls.at(-1)?.[0].text).toBe("Suite.");
	note.querySelector("details")?.removeAttribute("open");
	note.querySelector("details")?.dispatchEvent(new Event("toggle"));
	expect(note.open).toBe(false);
	expect(note.dataset.state).toBe("speaking");
	note.remove();
	expect(synthesis.cancel).toHaveBeenCalled();
});
it("loads relative files in their slide context and accepts a later inline script", async () => {
	const fetcher = vi
		.spyOn(globalThis, "fetch")
		.mockImplementation(async () => new Response("External notes"));
	document.body.innerHTML =
		'<div data-tp-source="/talk/slides/"><tp-slide-note src="../notes/one.txt" show-text></tp-slide-note></div>';
	await settle();
	expect(String(fetcher.mock.calls[0]?.[0])).toMatch(/\/talk\/notes\/one.txt$/);
	const note = document.querySelector("tp-slide-note");
	await vi.waitFor(() =>
		expect(note?.querySelector('[data-role="text"]')?.textContent).toBe(
			"External notes",
		),
	);
	const late = new TpSlideNote();
	document.body.append(late);
	await settle();
	const script = document.createElement("script");
	script.type = "tp/txt";
	script.textContent = "Late notes";
	late.append(script);
	await settle();
	expect(late.querySelector('[data-role="text"]')?.textContent).toBe(
		"Late notes",
	);
});
it("docks above the mode menu and remeasures when the menu height changes", async () => {
	const deck = document.createElement("div");
	deck.className = "tp-markup-multi-slides-host";
	const menu = document.createElement("nav");
	menu.setAttribute("data-slide-mode-menu", "");
	let top = 700;
	vi.spyOn(menu, "getBoundingClientRect").mockImplementation(
		() => ({ top }) as DOMRect,
	);
	document.body.append(deck, menu);
	const note = new TpSlideNote();
	note.value = "Notes";
	deck.append(note);
	await vi.waitFor(() =>
		expect(note.style.getPropertyValue("--tp-slide-note-anchor-bottom")).toBe(
			`${window.innerHeight - top}px`,
		),
	);
	expect(note.classList.contains("tp-slide-note-docked")).toBe(true);
	top = 650;
	window.dispatchEvent(new Event("resize"));
	await vi.waitFor(() =>
		expect(note.style.getPropertyValue("--tp-slide-note-anchor-bottom")).toBe(
			`${window.innerHeight - top}px`,
		),
	);
});
it.each([
	"tp-html-multi-slides",
	"tp-markdown-multi-slides",
	"tp-asciidoc-multi-slides",
	"tp-restructuredtext-multi-slides",
] as const)("uses a slide note for automatic cues in %s", async (tag) => {
	vi.spyOn(globalThis, "fetch").mockResolvedValue(
		new Response("", { status: 404 }),
	);
	const deck = document.createElement(tag);
	deck.auto = "notes";
	document.body.append(deck);
	await settle();
	deck.innerHTML =
		'<div class="tp-markup-multi-pages-content"><div><p data-slide-step="1">Reveal</p><tp-slide-note value="Notes"></tp-slide-note></div></div>';
	await settle();
	const note = deck.querySelector("tp-slide-note");
	if (!note) throw new Error("Missing note");
	const initializeProgress = Reflect.get(deck, "syncProgress") as () => void;
	initializeProgress.call(deck);
	expect(
		deck
			.querySelector('[data-slide-step="1"]')
			?.hasAttribute("data-slide-fragment-hidden"),
	).toBe(true);
	const speak = vi.spyOn(note, "speak").mockResolvedValue();
	deck.playAuto();
	expect(speak).toHaveBeenCalledOnce();
	note.dispatchEvent(
		new CustomEvent("tp-text-to-speech-trigger", {
			detail: { name: "clic", offset: 0 },
			bubbles: true,
		}),
	);
	expect(
		deck
			.querySelector('[data-slide-step="1"]')
			?.hasAttribute("data-slide-fragment-hidden"),
	).toBe(false);
	deck.stopAuto();
});
