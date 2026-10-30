/**
 * @module components/audio-recorder
 * @summary Records microphone audio locally for replay and download.
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-button-group
 * @summary Button group component for organizing multiple buttons.
 */
// tp-docgen:dependencies:end

import { TpBase } from "../base/base.js";
import { AudioTranscript } from "./transcript.js";
import "../button/button.js";
import type { TpButton } from "../button/button.js";
import "../button-group/button-group.js";
import speechControlsStyle from "../../utilities/speech-controls.css?inline";
import style from "./audio-recorder.css?inline";

/**
 * Local microphone recorder with playback and download.
 * @attr {string} legend = "Audio recorder" - Caption of the fieldset surrounding the controls.
 * @attr {string} transcript = "" - Safari only (temporary): CSS selector of the element receiving recognized speech; fields receive their value, other elements receive text.
 * @tagname tp-audio-recorder
 * @event tp-audio-recorded Emitted when a recording is ready.
 * @eventdetail tp-audio-recorded { blob: Blob }
 * @example
 * <tp-audio-recorder></tp-audio-recorder>
 * @accessibility Groups recording controls in a native fieldset with a legend; Record, Stop and Clear use labelled buttons whose disabled state follows recording availability.
 * @accessibility Exposes recording and transcription messages through status regions and provides labelled native audio playback controls and a download link.
 * @accessibilityresponsibility Provide a meaningful legend and an alternative response method when microphone recording is unavailable or unsuitable; review any automatic transcript before using it as an equivalent text alternative.
 */
export class TpAudioRecorder extends TpBase {
	public static override get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "legend", "transcript"];
	}
	/** CSS selector for the transcript destination. */
	public get transcript(): string {
		return this.getAttribute("transcript") ?? "";
	}
	public set transcript(value: string) {
		this.setAttribute("transcript", value);
	}
	protected attributeChangedCallback(name: string): void {
		if (name === "legend") {
			const legend = this.querySelector(":scope > fieldset > legend");
			if (legend)
				legend.textContent = this.getAttribute("legend") ?? "Audio recorder";
			return;
		}
		if (name === "transcript" || name === "lang") this.transcription.abort();
	}
	private transcriptStatus: HTMLElement | null = null;
	private readonly transcription = new AudioTranscript(this, (message) => {
		if (this.transcriptStatus) {
			this.transcriptStatus.textContent = message;
			this.transcriptStatus.hidden = !message;
		}
	});
	private recorder: MediaRecorder | null = null;
	private stream: MediaStream | null = null;
	private generation = 0;
	private url: string | null = null;
	private pending = false;
	private recordButton: TpButton | null = null;
	private stopButton: TpButton | null = null;
	private clearButton: TpButton | null = null;
	private audio: HTMLAudioElement | null = null;
	private download: HTMLAnchorElement | null = null;
	private status: HTMLElement | null = null;
	private readonly onPageHide = () => this.release();

	protected override connectedCallback(): void {
		super.connectedCallback();
		if (!this.hasAttribute("tabindex")) this.tabIndex = 0;
		this.ensureGlobalStyle("tp-speech-controls-styles", speechControlsStyle);
		this.ensureGlobalStyle("tp-audio-recorder-styles", style);
		if (!this.status) this.render();
		this.transcription.checkBrowser();
		window.addEventListener("pagehide", this.onPageHide);
		this.update();
	}

	public disconnectedCallback(): void {
		window.removeEventListener("pagehide", this.onPageHide);
		this.release();
	}

	private render(): void {
		const controls = document.createElement("tp-button-group");
		controls.className = "tp-speech-controls";
		controls.dataset.helpGroup = "Recording";
		const button = (
			label: string,
			description: string,
			action: () => void,
		): TpButton => {
			const b = document.createElement("tp-button") as TpButton;
			b.textContent = label;
			b.dataset.helpDescription = description;
			b.addEventListener("click", action);
			controls.append(b);
			return b;
		};
		this.recordButton = button(
			"Record",
			"Capture a new response using your microphone.",
			() => void this.start(),
		);
		this.stopButton = button(
			"Stop",
			"Finish the recording and make it available for replay.",
			() => this.stop(),
		);
		this.clearButton = button(
			"Clear",
			"Remove the current recording and transcript.",
			() => this.clear(),
		);
		this.audio = document.createElement("audio");
		this.audio.controls = true;
		this.audio.hidden = true;
		this.audio.setAttribute("aria-label", "Your recording");
		this.download = document.createElement("a");
		this.download.textContent = "Download recording";
		this.download.hidden = true;
		this.status = document.createElement("p");
		this.status.setAttribute("role", "status");
		this.status.textContent =
			"Press Record to request microphone access. Recordings stay on this device. Optional transcription may use your browser’s online service. Download audio before leaving this page.";
		this.transcriptStatus = document.createElement("p");
		this.transcriptStatus.setAttribute("role", "status");
		this.transcriptStatus.hidden = true;
		const fieldset = document.createElement("fieldset");
		fieldset.className = "tp-speech-fieldset";
		fieldset.append(
			document.createElement("legend"),
			controls,
			this.audio,
			this.download,
			this.status,
			this.transcriptStatus,
		);
		this.replaceChildren(fieldset);
		this.attributeChangedCallback("legend");
	}

	private update(): void {
		const active = this.recorder !== null;
		this.recordButton?.toggleAttribute("disabled", active || this.pending);
		this.stopButton?.toggleAttribute("disabled", !active);
		this.clearButton?.toggleAttribute(
			"disabled",
			!this.url || active || this.pending,
		);
	}

	/** Starts local recording after an explicit action. */
	public async start(): Promise<void> {
		if (this.pending || this.recorder) return;
		this.transcription.abort();
		const generation = ++this.generation;
		this.pending = true;
		this.update();
		if (this.status)
			this.status.textContent = "Waiting for microphone permission…";
		try {
			if (
				!navigator.mediaDevices?.getUserMedia ||
				typeof MediaRecorder === "undefined"
			)
				throw new Error("unsupported");
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			if (generation !== this.generation || !this.isConnected) {
				stream.getTracks().forEach((t) => {
					t.stop();
				});
				return;
			}
			this.stream = stream;
			const recording = new MediaRecorder(stream);
			const chunks: BlobPart[] = [];
			recording.ondataavailable = (e) => {
				if (e.data.size) chunks.push(e.data);
			};
			recording.onstop = () => {
				stream.getTracks().forEach((t) => {
					t.stop();
				});
				if (generation !== this.generation) return;
				this.transcription.stop();
				this.recorder = null;
				this.stream = null;
				const blob = new Blob(chunks, {
					type: recording.mimeType || "audio/webm",
				});
				if (blob.size) {
					this.clear(false);
					this.url = URL.createObjectURL(blob);
					if (this.audio) {
						this.audio.src = this.url;
						this.audio.hidden = false;
					}
					if (this.download) {
						this.download.href = this.url;
						this.download.download = `recording.${blob.type.includes("mp4") ? "m4a" : blob.type.includes("ogg") ? "ogg" : "webm"}`;
						this.download.hidden = false;
					}
					if (this.status)
						this.status.textContent =
							"Recording ready. Listen back and download it before leaving this page.";
					this.dispatchEvent(
						new CustomEvent("tp-audio-recorded", {
							bubbles: true,
							detail: { blob },
						}),
					);
				} else if (this.status)
					this.status.textContent =
						"No audio was captured. Try recording again.";
				this.update();
			};
			recording.onerror = () => {
				if (generation !== this.generation) return;
				this.release();
				if (this.status)
					this.status.textContent =
						"Recording failed. Check your microphone and try again.";
			};
			this.audio?.pause();
			recording.start();
			this.recorder = recording;
			this.transcription.start();
			if (this.status)
				this.status.textContent =
					"Recording… Press Stop when you have finished.";
		} catch {
			if (generation !== this.generation) return;
			this.stream?.getTracks().forEach((t) => {
				t.stop();
			});
			this.stream = null;
			if (this.status)
				this.status.textContent =
					"Microphone unavailable or permission declined. Use localhost or HTTPS, check permission and try again. You can also practise aloud without recording.";
		} finally {
			if (generation === this.generation) {
				this.pending = false;
				this.update();
			}
		}
	}

	/** Finishes the recording or cancels a pending microphone request. */
	public stop(): void {
		if (this.pending) {
			++this.generation;
			this.pending = false;
			this.update();
		}
		this.transcription.stop();
		if (this.recorder?.state === "recording") this.recorder.stop();
		this.stream?.getTracks().forEach((t) => {
			t.stop();
		});
		this.stopButton?.setAttribute("disabled", "");
	}

	/** Removes the recording and optionally clears transcription. */
	public clear(cancelTranscript = true): void {
		if (cancelTranscript) this.transcription.clear();
		this.audio?.pause();
		this.audio?.removeAttribute("src");
		if (this.audio) this.audio.hidden = true;
		if (this.url) URL.revokeObjectURL(this.url);
		this.url = null;
		this.download?.removeAttribute("href");
		if (this.download) this.download.hidden = true;
		if (this.status)
			this.status.textContent = "Recording cleared. Press Record to try again.";
		this.update();
	}

	private release(): void {
		this.transcription.abort();
		++this.generation;
		this.pending = false;
		if (this.recorder?.state === "recording") this.recorder.stop();
		this.recorder = null;
		this.stream?.getTracks().forEach((t) => {
			t.stop();
		});
		this.stream = null;
		this.clear(false);
	}
}
if (!customElements.get("tp-audio-recorder"))
	customElements.define("tp-audio-recorder", TpAudioRecorder);
