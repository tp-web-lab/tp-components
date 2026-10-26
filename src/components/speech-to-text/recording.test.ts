import { afterEach, beforeEach, expect, it, vi } from "vitest";
import "./speech-to-text.js";

class Recognition extends EventTarget {
	static current: Recognition;
	start = vi.fn();
	stop = vi.fn();
	abort = vi.fn();
	constructor() {
		super();
		Recognition.current = this;
	}
}
class Recorder {
	static current: Recorder;
	state = "inactive";
	mimeType = "audio/webm";
	ondataavailable?: (e: { data: Blob }) => void;
	onstop?: () => void;
	constructor() {
		Recorder.current = this;
	}
	start() {
		this.state = "recording";
	}
	stop() {
		this.state = "inactive";
		this.ondataavailable?.({ data: new Blob(["audio"]) });
		this.onstop?.();
	}
}
const stopTrack = vi.fn();
const getUserMedia = vi.fn();
const stream = { getTracks: () => [{ stop: stopTrack }] };
beforeEach(() => {
	vi.stubGlobal("SpeechRecognition", Recognition);
	vi.stubGlobal("MediaRecorder", Recorder);
	getUserMedia.mockReset().mockResolvedValue(stream);
	stopTrack.mockClear();
	vi.stubGlobal("navigator", {
		userAgent:
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
		mediaDevices: { getUserMedia },
	});
	vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
	vi.stubGlobal(
		"URL",
		class extends URL {
			static createObjectURL = vi.fn(() => "blob:test");
			static revokeObjectURL = vi.fn();
		},
	);
});
afterEach(() => {
	document.body.replaceChildren();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});
const flush = async () => {
	await Promise.resolve();
	await Promise.resolve();
};
function mount() {
	const element = document.createElement("tp-speech-to-text");
	element.record = true;
	document.body.append(element);
	return element;
}
it("starts recognition first and preserves its final text with a playable recording", async () => {
	const e = mount();
	e.start();
	expect(getUserMedia).not.toHaveBeenCalled();
	Recognition.current.dispatchEvent(new Event("start"));
	await flush();
	expect(Recorder.current.state).toBe("recording");
	Recognition.current.dispatchEvent(
		Object.assign(new Event("result"), {
			results: [{ isFinal: true, 0: { transcript: "Hello" } }],
		}),
	);
	expect(e.value).toBe("Hello");
	e.stop();
	Recognition.current.dispatchEvent(
		Object.assign(new Event("result"), {
			results: [{ isFinal: true, 0: { transcript: "Hello world" } }],
		}),
	);
	Recognition.current.dispatchEvent(new Event("end"));
	expect(e.value).toBe("Hello world");
	expect(e.querySelector("audio")?.src).toBe("blob:test");
	expect(e.querySelector("audio")?.hidden).toBe(false);
	expect(stopTrack).toHaveBeenCalled();
	e.clear();
	expect(e.value).toBe("");
	expect(e.querySelector("audio")?.hidden).toBe(true);
	expect(
		e.querySelector('[data-action="clear"]')?.hasAttribute("disabled"),
	).toBe(true);
});
it("cancels audio permission arriving after recognition has ended", async () => {
	let resolve: (value: typeof stream) => void = () => {};
	getUserMedia.mockImplementation(
		() =>
			new Promise((r) => {
				resolve = r;
			}),
	);
	const e = mount();
	e.start();
	Recognition.current.dispatchEvent(new Event("start"));
	Recognition.current.dispatchEvent(new Event("end"));
	resolve(stream);
	await flush();
	expect(stopTrack).toHaveBeenCalled();
	expect(e.querySelector("audio")?.hidden).toBe(true);
	expect(
		e.querySelector('[data-action="clear"]')?.hasAttribute("disabled"),
	).toBe(true);
});
it("keeps recognition working when audio capture permission is denied", async () => {
	getUserMedia.mockRejectedValue(new Error("denied"));
	const e = mount();
	e.start();
	Recognition.current.dispatchEvent(new Event("start"));
	await flush();
	Recognition.current.dispatchEvent(
		Object.assign(new Event("result"), {
			results: [{ isFinal: true, 0: { transcript: "Still transcribed" } }],
		}),
	);
	expect(e.value).toBe("Still transcribed");
	expect(e.textContent).toContain("permission declined");
});

it("enables Clear for an audio-only result arriving after recognition ends", async () => {
	const e = mount();
	const disabled = () =>
		e.querySelector('[data-action="clear"]')?.hasAttribute("disabled");
	expect(disabled()).toBe(true);
	e.start();
	Recognition.current.dispatchEvent(new Event("start"));
	await flush();
	const recorder = Recorder.current;
	vi.spyOn(recorder, "stop").mockImplementation(() => {
		recorder.state = "inactive";
	});
	Recognition.current.dispatchEvent(new Event("end"));
	expect(e.value).toBe("");
	expect(disabled()).toBe(true);
	recorder.ondataavailable?.({ data: new Blob(["audio"]) });
	recorder.onstop?.();
	expect(disabled()).toBe(false);
	e.querySelector<HTMLElement>('[data-action="clear"]')?.click();
	expect(e.querySelector("audio")?.hasAttribute("src")).toBe(false);
	expect(disabled()).toBe(true);
});

it("warns on Chrome and keeps transcription without requesting audio capture", () => {
	vi.stubGlobal("navigator", {
		userAgent: "Mozilla/5.0 AppleWebKit/537.36 Chrome/130.0 Safari/537.36",
		mediaDevices: { getUserMedia },
	});
	const e = mount();
	expect(e.querySelector("tp-audio-recorder")).toBeNull();
	expect(
		e.querySelector<HTMLElement>('[data-role="recording-warning"]')?.hidden,
	).toBe(false);
	e.start();
	Recognition.current.dispatchEvent(new Event("start"));
	Recognition.current.dispatchEvent(
		Object.assign(new Event("result"), {
			results: [{ isFinal: true, 0: { transcript: "Still transcribed" } }],
		}),
	);
	expect(e.value).toBe("Still transcribed");
	expect(getUserMedia).not.toHaveBeenCalled();
	e.record = false;
	expect(
		e.querySelector<HTMLElement>('[data-role="recording-warning"]')?.hidden,
	).toBe(true);
});
