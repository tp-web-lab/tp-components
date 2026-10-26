import { isSafariBrowser } from "../../utilities/safari-browser.js";
import type {
	RecognitionConstructor,
	RecognitionEngine,
	RecognitionErrorEvent,
	RecognitionResultEvent,
} from "../speech-to-text/speech-recognition.types.js";

/** One optional transcription session; recording remains independent of recognition. */
export class AudioTranscript {
	private engine: RecognitionEngine | null = null;
	private stopping = false;
	constructor(
		private readonly host: HTMLElement,
		private readonly report: (message: string) => void,
	) {}
	/** Explains the temporary Safari-only policy without blocking audio recording. */
	checkBrowser(): boolean {
		if (!this.host.getAttribute("transcript")?.trim() || isSafariBrowser())
			return true;
		this.report(
			"Transcription during recording is temporarily available only in Safari. Audio recording remains available; you can type your answer.",
		);
		return false;
	}
	start(): void {
		this.abort();
		this.report("");
		const selector = this.host.getAttribute("transcript")?.trim();
		if (!selector || !this.checkBrowser()) return;
		let target: Element | null;
		try {
			target = this.host.ownerDocument.querySelector(selector);
		} catch {
			this.report("Invalid transcript selector. Recording is still available.");
			return;
		}
		if (!target || target.contains(this.host) || this.host.contains(target)) {
			this.report(
				"Transcript target unavailable. Recording is still available.",
			);
			return;
		}
		const scope = this.host.ownerDocument.defaultView as
			| (Window & {
					SpeechRecognition?: RecognitionConstructor;
					webkitSpeechRecognition?: RecognitionConstructor;
			  })
			| null;
		const Constructor =
			scope?.SpeechRecognition ?? scope?.webkitSpeechRecognition;
		if (!Constructor) {
			this.report(
				"Speech recognition is unavailable in this browser. You can type your answer.",
			);
			return;
		}
		try {
			const engine = new Constructor();
			this.engine = engine;
			this.stopping = false;
			engine.continuous = true;
			engine.interimResults = true;
			let prefix = "";
			let finalText = "";
			const lang = this.host.closest("[lang]")?.getAttribute("lang")?.trim();
			if (lang) engine.lang = lang;
			engine.addEventListener("start", () => {
				if (this.engine === engine && !this.stopping)
					this.report("Listening… You can speak now.");
			});
			engine.addEventListener("result", (event) => {
				if (
					this.engine !== engine ||
					!target.isConnected ||
					!this.host.isConnected
				)
					return;
				const results = (event as RecognitionResultEvent).results;
				const parts: string[] = [];
				const provisional: string[] = [];
				for (let i = 0; i < results.length; i++) {
					const result = results[i];
					if (result)
						(result.isFinal ? parts : provisional).push(
							result[0]?.transcript.trim() ?? "",
						);
				}
				finalText = parts.filter(Boolean).join(" ");
				const interim = provisional.filter(Boolean).join(" ");
				if (interim) this.report(`Recognizing (provisional): ${interim}`);
				else if (!this.stopping) this.report("Listening… You can speak now.");
				if (!finalText) return;
				const value = [prefix, finalText].filter(Boolean).join(" ");
				if ("value" in target && typeof target.value === "string")
					target.value = value;
				else target.textContent = value;
				target.dispatchEvent(
					new Event("input", { bubbles: true, composed: true }),
				);
				target.dispatchEvent(
					new Event("change", { bubbles: true, composed: true }),
				);
			});
			engine.addEventListener("error", (event) => {
				if (this.engine !== engine) return;
				this.abort();
				this.report(
					`Transcription failed (${(event as RecognitionErrorEvent).error}). Recording is still available; you can type your answer.`,
				);
			});
			engine.addEventListener("end", () => {
				if (this.engine !== engine) return;
				if (
					!this.stopping &&
					finalText &&
					this.host.isConnected &&
					target.isConnected
				) {
					prefix = [prefix, finalText].filter(Boolean).join(" ");
					finalText = "";
					try {
						this.report(
							"Resuming recognition… Wait for Listening before speaking.",
						);
						engine.start();
						return;
					} catch {
						// Preserve finalized text and report that recognition has ended.
					}
				}
				this.engine = null;
				this.report(
					this.stopping
						? "Transcription ended. You can review and edit the text."
						: "Recognition ended before recording stopped. Stop and record again to continue transcribing.",
				);
			});
			engine.start();
			this.report(
				"Starting recognition… Wait for Listening before speaking. Your browser may use an online recognition service.",
			);
		} catch {
			this.abort();
			this.report("Transcription could not start. You can type your answer.");
		}
	}
	/** Clears the configured destination and ignores late recognition results. */
	clear(): void {
		this.abort();
		const selector = this.host.getAttribute("transcript")?.trim();
		if (!selector) return;
		let target: Element | null;
		try {
			target = this.host.ownerDocument.querySelector(selector);
		} catch {
			return;
		}
		if (!target || target.contains(this.host) || this.host.contains(target))
			return;
		if ("value" in target && typeof target.value === "string")
			target.value = "";
		else target.textContent = "";
		target.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
		target.dispatchEvent(
			new Event("change", { bubbles: true, composed: true }),
		);
	}
	stop(): void {
		if (this.stopping) return;
		this.stopping = true;
		try {
			if (this.engine) {
				this.report("Finishing transcription…");
				this.engine.stop();
			}
		} catch {
			this.abort();
		}
	}
	abort(): void {
		this.report("");
		this.checkBrowser();
		const engine = this.engine;
		this.engine = null;
		try {
			engine?.abort();
		} catch {
			/* Already ended. */
		}
	}
}
