/** @module components/markup-multi-slides/slide-playback */
import type { TpTextToSpeech } from "../text-to-speech/text-to-speech.js";

export type SlideAutoMode = "" | "notes" | "timing";
export type SlidePlaybackState = "stopped" | "playing" | "paused";
type AdvanceResult = "step" | "slide" | "end";

/** Coordinates one presentation's clock and current speaker notes. */
export class SlidePlayback {
	public state: SlidePlaybackState = "stopped";
	private mode: SlideAutoMode = "";
	private duration = 5000;
	private page: Element | null = null;
	private waitingPage: Element | null = null;
	private reader: TpTextToSpeech | null = null;
	private ready = false;
	private narrated = false;
	private timer: ReturnType<typeof setTimeout> | null = null;
	private remaining: number | null = null;
	private startedAt = 0;
	private commanding = false;

	constructor(
		private readonly advance: () => AdvanceResult,
		private readonly changed: () => void,
		private readonly restartNotes: () => void = () => {},
	) {}

	public configure(mode: SlideAutoMode, duration: number): void {
		if (mode === this.mode && duration === this.duration) return;
		this.stop();
		this.mode = mode;
		this.duration = duration;
	}

	public sync(
		page: Element | null,
		reader: TpTextToSpeech | null,
		ready: boolean,
	): void {
		if (page === this.waitingPage && page !== null) return;
		if (page !== this.page || reader !== this.reader) {
			this.releaseReader();
			this.clearTimer();
			this.remaining = null;
			this.narrated = false;
			this.page = page;
			this.waitingPage = null;
			this.reader = reader;
			this.listenReader(true);
		}
		this.ready = ready;
		this.run();
	}

	public play(): void {
		if (!this.mode) return;
		if (this.state === "playing") return;
		const paused = this.state === "paused";
		if (!paused && this.mode === "notes") this.restartNotes();
		this.state = "playing";
		this.changed();
		if (paused && this.reader?.dataset.state === "paused") this.reader.resume();
		else this.run();
	}

	public pause(): void {
		if (this.state !== "playing") return;
		this.state = "paused";
		if (this.timer !== null)
			this.remaining = Math.max(
				0,
				(this.remaining ?? this.duration) - (Date.now() - this.startedAt),
			);
		this.clearTimer();
		this.reader?.pause();
		this.changed();
	}

	public stop(): void {
		this.state = "stopped";
		this.clearTimer();
		this.remaining = null;
		this.narrated = false;
		this.commanding = true;
		if (
			this.reader?.dataset.state === "speaking" ||
			this.reader?.dataset.state === "paused"
		)
			this.reader.stop();
		this.commanding = false;
		this.changed();
	}

	public dispose(): void {
		this.stop();
		this.releaseReader();
		this.page = null;
		this.waitingPage = null;
	}

	private run(): void {
		if (
			!this.mode ||
			this.state !== "playing" ||
			!this.page ||
			!this.ready ||
			this.waitingPage ||
			this.timer !== null
		)
			return;
		if (this.mode === "notes" && this.reader && !this.narrated) {
			if (!this.reader.hasAttribute("data-tp-speech-ready")) return;
			this.narrated = true;
			this.commanding = true;
			const reader = this.reader;
			const playback = reader.speak();
			this.commanding = false;
			void playback.then(() => {
				if (
					reader === this.reader &&
					this.state === "playing" &&
					reader.dataset.state !== "speaking" &&
					reader.dataset.state !== "paused" &&
					this.timer === null
				)
					this.stop();
			});
			return;
		}
		if (this.mode === "notes" && this.reader?.dataset.state === "speaking")
			return;
		this.remaining ??= this.duration;
		this.startedAt = Date.now();
		this.timer = setTimeout(() => {
			this.timer = null;
			this.remaining = null;
			this.next();
		}, this.remaining);
	}

	private next(): void {
		if (this.state !== "playing") return;
		const result = this.advance();
		if (result === "end") {
			this.stop();
			return;
		}
		if (result === "slide") {
			this.waitingPage = this.page;
			this.releaseReader();
			this.clearTimer();
		} else if (
			this.mode === "timing" ||
			!this.reader ||
			this.reader.dataset.state === "idle"
		)
			this.run();
	}

	private clearTimer(): void {
		if (this.timer !== null) clearTimeout(this.timer);
		this.timer = null;
	}

	private releaseReader(): void {
		this.listenReader(false);
		if (
			this.reader?.dataset.state === "speaking" ||
			this.reader?.dataset.state === "paused"
		)
			this.reader.stop();
		this.reader = null;
	}

	private listenReader(add: boolean): void {
		const events: Record<string, EventListener> = {
			"tp-text-to-speech-trigger": this.trigger,
			"tp-text-to-speech-ready": this.readyReader,
			"tp-text-to-speech-end": this.endReader,
			"tp-text-to-speech-start": this.startReader,
			"tp-text-to-speech-pause": this.pauseReader,
			"tp-text-to-speech-resume": this.resumeReader,
			"tp-text-to-speech-stop": this.stopReader,
			"tp-text-to-speech-error": this.stopReader,
		};
		for (const [name, listener] of Object.entries(events)) {
			if (add) this.reader?.addEventListener(name, listener);
			else this.reader?.removeEventListener(name, listener);
		}
	}

	private trigger = (event: Event): void => {
		if (
			this.mode !== "notes" ||
			(event as CustomEvent<{ name: string }>).detail.name !== "clic"
		)
			return;
		if (this.state === "stopped" && this.reader?.dataset.state === "speaking")
			this.startReader();
		if (this.state === "playing") this.next();
	};
	private readyReader = (): void => {
		this.run();
	};
	private endReader = (): void => {
		if (this.mode === "notes") this.run();
	};
	private startReader = (): void => {
		if (this.mode !== "notes" || this.state === "paused") return;
		if (this.state === "stopped") this.restartNotes();
		this.narrated = true;
		this.state = "playing";
		this.changed();
	};
	private pauseReader = (): void => {
		if (this.mode === "notes") this.pause();
	};
	private resumeReader = (): void => {
		if (this.mode === "notes") this.play();
	};
	private stopReader = (): void => {
		if (this.mode === "notes" && !this.commanding) this.stop();
	};
}
