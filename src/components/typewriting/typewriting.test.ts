import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { TpTypewriting } from "./typewriting.js";

/** Mutable reduced-motion preference used by lifecycle tests. */
let reduced = false;
/** Motion change event target shared with the mocked media query. */
let media: EventTarget;
/** Creates an animated fixture with preserved author markup. */
function fixture(content = "A👨‍👩‍👧‍👦é", attributes = ""): TpTypewriting {
	const parent = document.createElement("div");
	parent.innerHTML = `<tp-typewriting ${attributes}>${content}</tp-typewriting>`;
	const element = parent.firstElementChild;
	if (!(element instanceof TpTypewriting)) throw new Error("Missing component");
	document.body.append(element);
	return element;
}
/** Counts fragments not yet visually revealed. */
function pending(element: TpTypewriting): number {
	return element.querySelectorAll("[data-pending]").length;
}
beforeEach(() => {
	vi.useFakeTimers();
	reduced = false;
	media = new EventTarget();
	vi.stubGlobal("matchMedia", () => ({
		get matches() {
			return reduced;
		},
		addEventListener: media.addEventListener.bind(media),
		removeEventListener: media.removeEventListener.bind(media),
	}));
});
afterEach(() => {
	document.body.replaceChildren();
	vi.useRealTimers();
	vi.unstubAllGlobals();
});
it("reveals Unicode graphemes after delay, preserves text and restores focus settings", async () => {
	const element = fixture();
	expect(element.speed).toBe(20);
	expect(element.delay).toBe(0);
	expect(element.word).toBe(false);
	expect(element.loop).toBe(false);
	element.delay = 100;
	await vi.advanceTimersByTimeAsync(1);
	expect(pending(element)).toBe(3);
	expect(element.textContent).toBe("A👨‍👩‍👧‍👦é");
	expect(element.tabIndex).toBe(0);
	await vi.advanceTimersByTimeAsync(100);
	expect(pending(element)).toBe(2);
	await vi.advanceTimersByTimeAsync(100);
	expect(pending(element)).toBe(0);
	expect(element.hasAttribute("tabindex")).toBe(false);
});
it("supports word mode, punctuation, repetition, boolean presence and pointer interruption", async () => {
	const element = fixture("Hello, world!", 'tabindex="2"');
	element.word = true;
	element.loop = true;
	element.speed = 100;
	element.delay = 20;
	expect(element.word).toBe(true);
	expect(element.loop).toBe(true);
	await vi.advanceTimersByTimeAsync(1);
	expect(element.querySelectorAll("span")).toHaveLength(2);
	await vi.advanceTimersByTimeAsync(30);
	expect(pending(element)).toBe(0);
	await vi.advanceTimersByTimeAsync(20);
	expect(pending(element)).toBe(1);
	element.dispatchEvent(new Event("pointerdown"));
	await vi.advanceTimersByTimeAsync(200);
	expect(pending(element)).toBe(0);
	expect(element.tabIndex).toBe(2);
	element.word = false;
	element.loop = false;
	element.setAttribute("word", "false");
	expect(element.word).toBe(true);
});
it("preserves markup, excludes controls and restarts when author content changes", async () => {
	const element = fixture(
		'<strong>Hi</strong><button>Keep</button><script type="tp/txt">Not displayed</script>',
	);
	const strong = element.querySelector("strong");
	await vi.advanceTimersByTimeAsync(1);
	expect(element.querySelector("button span")).toBeNull();
	expect(element.querySelector("script span")).toBeNull();
	expect(element.querySelector("strong")).toBe(strong);
	element.append("New");
	await vi.advanceTimersByTimeAsync(2);
	expect(element.querySelectorAll("[data-tp-typewriting-unit]")).toHaveLength(
		5,
	);
	element.dispatchEvent(new FocusEvent("focusin"));
	expect(pending(element)).toBe(0);
	element.remove();
	expect(element.querySelector("strong")).toBe(strong);
	expect(element.querySelector("span")).toBeNull();
	document.body.append(element);
	await vi.advanceTimersByTimeAsync(2);
	expect(pending(element)).toBeGreaterThan(0);
});
it("respects reduced motion dynamically and handles zero speed, empty input and invalid timings", async () => {
	reduced = true;
	const element = fixture("Hello");
	await vi.advanceTimersByTimeAsync(1);
	expect(element.querySelector("span")).toBeNull();
	reduced = false;
	media.dispatchEvent(new Event("change"));
	await vi.advanceTimersByTimeAsync(1);
	expect(pending(element)).toBeGreaterThan(0);
	reduced = true;
	media.dispatchEvent(new Event("change"));
	await vi.advanceTimersByTimeAsync(1);
	expect(pending(element)).toBe(0);
	element.speed = 0;
	reduced = false;
	await vi.advanceTimersByTimeAsync(1);
	expect(pending(element)).toBe(5);
	await vi.advanceTimersByTimeAsync(1000);
	expect(pending(element)).toBe(5);
	for (const value of ["", "-1", "NaN", "Infinity"]) {
		element.setAttribute("speed", value);
		element.setAttribute("delay", value);
		expect(element.speed).toBe(20);
		expect(element.delay).toBe(0);
	}
	element.speed = 9999999999;
	expect(element.speed).toBe(2147483647);
	fixture(" ");
	await vi.advanceTimersByTimeAsync(1);
});
it("cancels deferred initialization on disconnect and tolerates missing matchMedia", async () => {
	vi.stubGlobal("matchMedia", undefined);
	const element = fixture("Text", 'tabindex="0"');
	element.remove();
	element.speed = 20;
	await vi.advanceTimersByTimeAsync(50);
	expect(element.querySelector("span")).toBeNull();
	document.body.append(element);
	element.focus();
	await vi.advanceTimersByTimeAsync(1);
	expect(element.querySelector("span")).toBeNull();
});

it("keeps nested animations independent and observes edits to text nodes", async () => {
	const element = fixture(
		'Outer<tp-typewriting speed="10">Inner</tp-typewriting>',
	);
	await vi.advanceTimersByTimeAsync(500);
	expect(pending(element)).toBe(0);
	const inner = element.querySelector("tp-typewriting");
	expect(inner?.querySelectorAll("[data-tp-typewriting-unit]")).toHaveLength(5);
	const text = element.querySelector("span")?.firstChild;
	if (!(text instanceof Text)) throw new Error("Missing text");
	text.data = "Changed";
	await vi.advanceTimersByTimeAsync(2);
	expect(pending(element)).toBeGreaterThan(0);
});

it("reveals more letters at a higher rate and supports fractional word rates", async () => {
	const slow = fixture("abcdef", 'speed="2"');
	const fast = fixture("abcdef", 'speed="4"');
	const words = fixture("One two three", 'speed="0.5" word');
	await vi.advanceTimersByTimeAsync(251);
	expect(pending(slow)).toBe(5);
	expect(pending(fast)).toBe(4);
	expect(pending(words)).toBe(2);
	await vi.advanceTimersByTimeAsync(1750);
	expect(pending(words)).toBe(1);
	slow.speed = 0;
	await vi.advanceTimersByTimeAsync(1000);
	expect(pending(slow)).toBe(6);
	slow.speed = 4;
	await vi.advanceTimersByTimeAsync(251);
	expect(pending(slow)).toBe(4);
});

it("accepts only the current speech owner and keeps reduced-motion text visible", async () => {
	const target = fixture("Hello world", 'loop speed="1000"');
	const owner = document.createElement("div");
	const stranger = document.createElement("div");
	target.attachSpeech(owner);
	await vi.advanceTimersByTimeAsync(10);
	expect(target.getSpeechText()).toBe("Hello world");
	target.beginSpeech(stranger);
	target.detachSpeech(stranger);
	target.beginSpeech(owner);
	target.revealSpeech(stranger, 0);
	expect(pending(target)).toBe(0);
	for (const index of [-1, 1000, NaN, 0.5]) target.revealSpeech(owner, index);
	expect(pending(target)).toBe(0);
	target.revealSpeech(owner, 0);
	expect(pending(target)).toBe(6);
	target.speed = 1;
	target.word = true;
	await vi.advanceTimersByTimeAsync(100);
	expect(pending(target)).toBe(6);
	target.endSpeech(stranger);
	expect(pending(target)).toBe(6);
	target.endSpeech(owner);
	expect(pending(target)).toBe(0);
	reduced = true;
	media.dispatchEvent(new Event("change"));
	await vi.advanceTimersByTimeAsync(1);
	target.beginSpeech(owner);
	target.revealSpeech(owner, 0);
	expect(pending(target)).toBe(0);
	target.detachSpeech(owner);
});
