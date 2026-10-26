import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./audio-recorder.js";

class RecorderMock {
	static instances: RecorderMock[] = [];
	state = "inactive";
	mimeType = "audio/webm";
	ondataavailable: ((e: { data: Blob }) => void) | null = null;
	onstop: (() => void) | null = null;
	onerror: (() => void) | null = null;
	constructor() {
		RecorderMock.instances.push(this);
	}
	start() {
		this.state = "recording";
	}
	stop() {
		this.state = "inactive";
		this.ondataavailable?.({ data: new Blob(["voice"]) });
		this.onstop?.();
	}
}
const flush = async () => {
	await Promise.resolve();
	await Promise.resolve();
};
function click(host: HTMLElement, label: string) {
	const b = Array.from(host.querySelectorAll("tp-button")).find(
		(b) => b.textContent?.trim() === label,
	);
	expect(b).toBeTruthy();
	b?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}
describe("audio recorder lifecycle", () => {
	const stop = vi.fn();
	const stream = { getTracks: () => [{ stop }] } as unknown as MediaStream;
	let getUserMedia = vi.fn();
	beforeEach(() => {
		RecorderMock.instances = [];
		stop.mockClear();
		getUserMedia = vi.fn().mockResolvedValue(stream);
		vi.stubGlobal("MediaRecorder", RecorderMock);
		vi.stubGlobal("navigator", {
			userAgent:
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
			mediaDevices: { getUserMedia },
		});
		vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
		vi.stubGlobal(
			"URL",
			class extends URL {
				static createObjectURL = vi.fn(() => "blob:recording");
				static revokeObjectURL = vi.fn();
			},
		);
	});
	afterEach(() => {
		document.body.replaceChildren();
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});
	function mount() {
		const host = document.createElement("tp-audio-recorder");
		document.body.append(host);
		return host;
	}
	it("requests permission only on Record, emits the blob and clears download", async () => {
		const host = mount();
		expect(getUserMedia).not.toHaveBeenCalled();
		const event = vi.fn();
		host.addEventListener("tp-audio-recorded", event);
		click(host, "Record");
		await flush();
		expect(getUserMedia).toHaveBeenCalledWith({ audio: true });
		click(host, "Stop");
		expect(stop).toHaveBeenCalled();
		expect(event).toHaveBeenCalledTimes(1);
		expect(host.querySelector("audio")?.getAttribute("src")).toBe(
			"blob:recording",
		);
		expect(host.querySelector("a")?.download).toBe("recording.webm");
		click(host, "Clear");
		expect(host.querySelector("a")?.hidden).toBe(true);
		expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:recording");
	});
	it("coordinates transcription with recording and keeps final results after Stop", async () => {
		class Recognition extends EventTarget {
			static current: Recognition;
			lang = "";
			continuous = false;
			interimResults = false;
			start = vi.fn();
			stop = vi.fn();
			abort = vi.fn();
			constructor() {
				super();
				Recognition.current = this;
			}
			result(text: string) {
				this.dispatchEvent(
					Object.assign(new Event("result"), {
						results: [{ isFinal: true, 0: { transcript: text } }],
					}),
				);
			}
		}
		vi.stubGlobal("SpeechRecognition", Recognition);
		const field = document.createElement("textarea");
		field.id = "transcribed-answer";
		document.body.append(field);
		const host = mount();
		host.setAttribute("transcript", "#transcribed-answer");
		click(host, "Record");
		await flush();
		Recognition.current.result("first");
		expect(field.value).toBe("first");
		click(host, "Stop");
		expect(Recognition.current.stop).toHaveBeenCalledOnce();
		Recognition.current.result("final words");
		expect(field.value).toBe("final words");
		click(host, "Clear");
		Recognition.current.result("late");
		expect(field.value).toBe("");
		click(host, "Record");
		await flush();
		host.removeAttribute("transcript");
		Recognition.current.result("after removal");
		expect(field.value).toBe("");
	});

	it("keeps recording available on Chrome while showing the Safari-only transcription warning", async () => {
		vi.stubGlobal("navigator", {
			userAgent: "Mozilla/5.0 AppleWebKit/537.36 Chrome/130.0 Safari/537.36",
			mediaDevices: { getUserMedia },
		});
		const host = mount();
		host.setAttribute("transcript", "#answer");
		expect(host.textContent).toContain("only in Safari");
		click(host, "Record");
		await flush();
		click(host, "Stop");
		expect(host.querySelector("audio")?.hidden).toBe(false);
		expect(host.textContent).toContain("only in Safari");
		host.removeAttribute("transcript");
		expect(host.textContent).not.toContain("only in Safari");
	});
	it("makes denial recoverable", async () => {
		getUserMedia.mockRejectedValueOnce(new Error("denied"));
		const host = mount();
		click(host, "Record");
		await flush();
		expect(host.textContent).toContain("permission declined");
		click(host, "Record");
		await flush();
		expect(RecorderMock.instances).toHaveLength(1);
	});
	it("releases an active microphone and object URL on removal", async () => {
		const host = mount();
		click(host, "Record");
		await flush();
		host.remove();
		expect(stop).toHaveBeenCalled();
		expect(RecorderMock.instances[0]?.state).toBe("inactive");
		expect(host.querySelector("a")?.hidden).toBe(true);
	});
	it("discards permission granted after navigation without starting capture", async () => {
		let resolve: ((value: MediaStream) => void) | undefined;
		getUserMedia.mockImplementation(
			() =>
				new Promise<MediaStream>((r) => {
					resolve = r;
				}),
		);
		const host = mount();
		click(host, "Record");
		host.remove();
		resolve?.(stream);
		await flush();
		expect(stop).toHaveBeenCalled();
		expect(RecorderMock.instances).toHaveLength(0);
	});
});
