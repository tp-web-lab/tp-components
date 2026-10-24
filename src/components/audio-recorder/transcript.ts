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
	start(): void {
		this.abort();
		this.report("");
		const selector = this.host.getAttribute("transcript")?.trim();
		if (!selector) return;
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
			engine.interimResults = false;
			const lang = this.host.closest("[lang]")?.getAttribute("lang")?.trim();
			if (lang) engine.lang = lang;
			engine.addEventListener("result", (event) => {
				if (
					this.engine !== engine ||
					!target.isConnected ||
					!this.host.isConnected
				)
					return;
				const results = (event as RecognitionResultEvent).results;
				const parts: string[] = [];
				for (let i = 0; i < results.length; i++) {
					const result = results[i];
					if (result?.isFinal) parts.push(result[0]?.transcript.trim() ?? "");
				}
				const value = parts.filter(Boolean).join(" ");
				if (!value) return;
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
				this.engine = null;
				this.report("Transcription ended. You can review and edit the text.");
			});
			engine.start();
			this.report(
				"Transcribing speech. Your browser may use an online recognition service.",
			);
		} catch {
			this.abort();
			this.report("Transcription could not start. You can type your answer.");
		}
	}
	stop(): void {
		if (this.stopping) return;
		this.stopping = true;
		try {
			this.engine?.stop();
		} catch {
			this.abort();
		}
	}
	abort(): void {
		this.report("");
		const engine = this.engine;
		this.engine = null;
		try {
			engine?.abort();
		} catch {
			/* Already ended. */
		}
	}
}
