import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { RecognitionEngine } from "./speech-recognition.types.js";
import "./speech-to-text.js";

/** Browser mock: no microphone access, network service or audio recording. */
class RecognitionMock extends EventTarget implements RecognitionEngine {
	/** Browser default language before configuration. */
	lang = "";
	/** Single-result default. */
	continuous = false;
	/** Final-only default. */
	interimResults = false;
	/** Starts permission request. */
	start = vi.fn();
	/** Requests finalization. */
	stop = vi.fn();
	/** Cancels recording. */
	abort = vi.fn();
	/** Captured engines for lifecycle assertions. */
	static instances: RecognitionMock[] = [];
	/** Registers this mock instance. */
	constructor() {
		super();
		RecognitionMock.instances.push(this);
	}
}

/** Creates a component with an inherited French language. */
function mount() {
	const parent = document.createElement("section");
	parent.lang = "fr-FR";
	const element = document.createElement("tp-speech-to-text");
	parent.append(element);
	document.body.append(parent);
	return element;
}
/** Returns the last constructed recognition engine. */
function engine(): RecognitionMock {
	const result = RecognitionMock.instances.at(-1);
	if (!result) throw new Error("Expected a recognition engine");
	return result;
}
/** Dispatches a cumulative browser recognition result. */
function result(parts: [string, boolean][]): void {
	engine().dispatchEvent(
		Object.assign(new Event("result"), {
			results: parts.map(([transcript, isFinal]) => ({
				0: { transcript },
				isFinal,
			})),
		}),
	);
}

beforeEach(() => {
	RecognitionMock.instances = [];
	vi.stubGlobal("SpeechRecognition", RecognitionMock);
	vi.stubGlobal("webkitSpeechRecognition", undefined);
});
afterEach(() => {
	document.body.replaceChildren();
	vi.unstubAllGlobals();
});

it("has no automatic recording and supports editable input when unsupported", () => {
	vi.stubGlobal("SpeechRecognition", undefined);
	const element = mount();
	expect(RecognitionMock.instances).toHaveLength(0);
	expect(
		Array.from(element.querySelectorAll("tp-button"), (button) =>
			button.getAttribute("size"),
		),
	).toEqual(["s", "s", "s"]);
	expect(
		element
			.querySelector("tp-button-group")
			?.classList.contains("tp-speech-controls"),
	).toBe(true);
	expect(
		element
			.querySelector('[role="status"]')
			?.classList.contains("tp-speech-status"),
	).toBe(true);
	expect(document.querySelectorAll("#tp-speech-controls-styles")).toHaveLength(
		1,
	);
	expect(
		element.querySelector('[data-action="start"]')?.hasAttribute("disabled"),
	).toBe(true);
	expect(element.querySelector('[role="status"]')?.textContent).toContain(
		"unavailable",
	);
	const errors = vi.fn();
	element.addEventListener("tp-speech-to-text-error", errors);
	element.start();
	expect(errors).toHaveBeenCalledOnce();
	const field = element.querySelector("tp-textfield");
	if (!field) throw new Error("Expected transcript field");
	field.value = "Typed text";
	field.dispatchEvent(new Event("input", { bubbles: true }));
	expect(element.value).toBe("Typed text");
	element.stop();
	element.abort();
});

it("starts explicitly, preserves lang and commits cumulative final results without duplication", () => {
	const element = mount();
	element.value = "Préface";
	element.continuous = true;
	element.interimResults = true;
	const started = vi.fn();
	const received = vi.fn();
	element.addEventListener("tp-speech-to-text-start", started);
	element.addEventListener("tp-speech-to-text-result", received);
	element.querySelector<HTMLElement>('[data-action="start"]')?.click();
	element.start();
	expect(RecognitionMock.instances).toHaveLength(1);
	expect(engine()).toMatchObject({
		lang: "fr-FR",
		continuous: true,
		interimResults: true,
	});
	engine().dispatchEvent(new Event("start"));
	expect(started).toHaveBeenCalledOnce();
	expect(element.dataset.state).toBe("listening");
	result([
		["Bonjour", true],
		["le", false],
	]);
	expect(element.value).toBe("Préface Bonjour");
	expect(element.querySelector('[data-role="interim"]')?.textContent).toBe(
		"le",
	);
	result([
		["Bonjour", true],
		["le monde", true],
	]);
	expect(element.value).toBe("Préface Bonjour le monde");
	expect(received).toHaveBeenCalledTimes(2);
	element.querySelector<HTMLElement>('[data-action="stop"]')?.click();
	element.stop();
	expect(engine().stop).toHaveBeenCalledOnce();
	expect(element.dataset.state).toBe("stopping");
	engine().dispatchEvent(new Event("end"));
	expect(element.dataset.state).toBe("idle");
	element.start();
	result([["Encore", true]]);
	expect(element.value).toBe("Préface Bonjour le monde Encore");
	element.querySelector<HTMLElement>('[data-action="clear"]')?.click();
	expect(element.value).toBe("");
	expect(engine().abort).toHaveBeenCalledOnce();
});

it("uses the prefixed API, ignores interim text by default and aborts for configuration changes", () => {
	vi.stubGlobal("SpeechRecognition", undefined);
	vi.stubGlobal("webkitSpeechRecognition", RecognitionMock);
	const element = mount();
	expect(element.continuous).toBe(false);
	expect(element.interimResults).toBe(false);
	element.lang = "en-GB";
	element.start();
	expect(engine().lang).toBe("en-GB");
	result([["Maybe", false]]);
	expect(element.value).toBe("");
	expect(element.querySelector('[data-role="interim"]')?.textContent).toBe("");
	element.continuous = true;
	expect(engine().abort).toHaveBeenCalledOnce();
	element.continuous = false;
	element.interimResults = false;
	element.start();
	element.value = "Manual edit";
	result([["Stale", true]]);
	expect(element.value).toBe("Manual edit");
});

it("disables editing, cancels on disconnection and reconnects without restarting", () => {
	const element = mount();
	element.start();
	element.disabled = true;
	expect(engine().abort).toHaveBeenCalledOnce();
	expect(element.querySelector("tp-textfield")?.disabled).toBe(true);
	element.start();
	element.clear();
	expect(RecognitionMock.instances).toHaveLength(1);
	element.disabled = false;
	element.start();
	const last = engine();
	element.remove();
	expect(last.abort).toHaveBeenCalledOnce();
	element.start();
	expect(RecognitionMock.instances).toHaveLength(2);
	document.body.append(element);
	expect(element.dataset.state).toBe("idle");
});

it("reports browser errors and synchronous start or stop failures", () => {
	const element = mount();
	element.start();
	engine().dispatchEvent(
		Object.assign(new Event("error"), { error: "not-allowed" }),
	);
	expect(element.querySelector('[role="status"]')?.textContent).toContain(
		"not-allowed",
	);
	engine().dispatchEvent(new Event("end"));
	expect(element.querySelector('[role="status"]')?.textContent).toContain(
		"not-allowed",
	);
	element.start();
	engine().stop.mockImplementation(() => {
		throw new Error("Stop failed");
	});
	element.stop();
	expect(element.querySelector('[role="status"]')?.textContent).toContain(
		"Stop failed",
	);
	class Failing extends RecognitionMock {
		override start = vi.fn(() => {
			throw new Error("Start failed");
		});
	}
	vi.stubGlobal("SpeechRecognition", Failing);
	element.start();
	expect(element.querySelector('[role="status"]')?.textContent).toContain(
		"Start failed",
	);
});
