/**
 * @module components/timer
 * @summary Countdown timer with stop control and optional ring.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon
 * @summary SVG icon component with inline, URL, and registry sources.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
// tp-docgen:dependencies:end

import style from "./timer.css?inline";

import "../icon-button/icon-button.js";
import "../icon/icon.js";

import { TpBase } from "../base/base.js";

type AudioContextLike = {
	createOscillator(): OscillatorNode;
	createGain(): GainNode;
	destination: AudioDestinationNode;
	currentTime: number;
	resume(): Promise<void>;
	close(): Promise<void>;
};

/**
 * Countdown timer component.
 *
 * @tagname tp-timer
 * @attr {number} duration = 60 - Countdown duration in seconds.
 * @attr {string} size = "1rem" - Icon and text size.
 * @attr {boolean} silent = false - Disables sound playback.
 * @cssprop --tp-timer-size Icon and text size.
 * @event tp-timer-elapsed Emitted when the countdown reaches zero.
 * @eventdetail tp-timer-elapsed void
 * @example
 * <tp-timer></tp-timer>
 */
export class TpTimer extends TpBase {
	private static readonly styleId = "tp-timer-styles";
	private static readonly ringCount = 3;
	private static readonly ringGapMs = 420;

	private countdownTimer: number | null = null;
	private ringTimeouts: number[] = [];
	private endTimestampMs: number | null = null;
	private remainingMs = 0;
	private displayEl: HTMLSpanElement | null = null;
	private durationInputEl: HTMLInputElement | null = null;

	/**
	 * Returns the list of attributes observed by the component.
	 *
	 * @summary Returns the observed attributes.
	 */
	public static get observedAttributes(): string[] {
		return ["duration", "size", "silent"];
	}

	/**
	 * Returns the configured countdown duration in seconds.
	 *
	 * @summary Returns the configured countdown duration.
	 */
	public get duration(): number {
		const raw = this.getAttribute("duration") ?? "60";
		const parsed = Number(raw);
		if (!Number.isFinite(parsed) || parsed <= 0) {
			return 60;
		}

		return Math.round(parsed);
	}

	/**
	 * Updates the configured countdown duration in seconds.
	 *
	 * @summary Sets the countdown duration.
	 * @param value Duration to apply, in seconds.
	 */
	public set duration(value: number) {
		this.setAttribute("duration", String(Math.max(1, Math.round(value))));
	}

	/**
	 * Returns the configured component size.
	 *
	 * @summary Returns the configured size value.
	 */
	public get size(): string {
		return this.getStringAttribute("size", "1rem");
	}

	/**
	 * Updates the configured component size.
	 *
	 * @summary Sets the configured size value.
	 * @param value Size value to apply.
	 */
	public set size(value: string) {
		this.setStringAttribute("size", value.trim() === "" ? "1rem" : value);
	}

	/**
	 * Returns whether sound playback is disabled.
	 *
	 * @summary Returns the silent state.
	 */
	public get silent(): boolean {
		return this.getBooleanAttribute("silent");
	}

	/**
	 * Enables or disables sound playback.
	 *
	 * @summary Sets the silent state.
	 * @param value Silent state to apply.
	 */
	public set silent(value: boolean) {
		this.setBooleanAttribute("silent", value);
	}

	/**
	 * Initializes the timer when the element is connected.
	 *
	 * @summary Connects the timer component.
	 * @internal
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpTimer.styleId, style);
		this.ensureDom();
		this.resetCountdown();
		this.startCountdown();
	}

	/**
	 * Reacts to observed attribute changes.
	 *
	 * @summary Handles observed attribute changes.
	 * @param name Updated attribute name.
	 * @internal
	 */
	protected attributeChangedCallback(name: string): void {
		if (!this.isConnected) {
			return;
		}

		if (name === "silent" && this.silent) {
			this.stopRinging();
		}

		if (name === "duration") {
			this.resetCountdown();
			if (!this.hasAttribute("data-stopped")) {
				this.startCountdown();
			}
		}

		this.updateDisplay();
	}

	/**
	 * Stops active timers and ringing when the element is disconnected.
	 *
	 * @summary Disconnects the timer component.
	 * @internal
	 */
	public disconnectedCallback(): void {
		this.stopCountdown();
		this.stopRinging();
	}

	/**
	 * Creates and caches the internal timer UI.
	 *
	 * @summary Ensures the internal timer DOM exists.
	 */
	private ensureDom(): void {
		if (
			this.displayEl instanceof HTMLSpanElement &&
			this.durationInputEl instanceof HTMLInputElement
		) {
			return;
		}

		const durationInput = document.createElement("input");
		durationInput.type = "number";
		durationInput.min = "1";
		durationInput.step = "1";
		durationInput.setAttribute("data-tp-timer-duration", "");
		durationInput.setAttribute("aria-label", "Timer duration in seconds");
		durationInput.addEventListener("change", () => {
			const parsed = Number(durationInput.value);
			if (!Number.isFinite(parsed) || parsed <= 0) {
				durationInput.value = String(this.duration);
				return;
			}

			this.duration = Math.round(parsed);
		});

		const display = document.createElement("span");
		display.setAttribute("data-tp-timer-display", "");

		const timerIcon = document.createElement("tp-icon");
		timerIcon.setAttribute("name", "camera-timer");
		timerIcon.setAttribute("data-tp-timer-icon", "");

		const stopButton = document.createElement("tp-icon-button");
		stopButton.setAttribute("name", "stop");
		stopButton.setAttribute("label", "Stop timer");
		stopButton.addEventListener("click", () => {
			this.stopAndReset();
		});

		const playButton = document.createElement("tp-icon-button");
		playButton.setAttribute("name", "play");
		playButton.setAttribute("label", "Start timer");
		playButton.addEventListener("click", () => {
			this.startFromBeginning();
		});

		this.replaceChildren(
			timerIcon,
			durationInput,
			display,
			playButton,
			stopButton,
		);
		this.durationInputEl = durationInput;
		this.displayEl = display;
	}

	/**
	 * Starts the active countdown interval.
	 *
	 * @summary Starts the countdown loop.
	 */
	private startCountdown(): void {
		this.stopCountdown();
		this.removeAttribute("data-stopped");
		this.endTimestampMs = Date.now() + this.remainingMs;
		this.countdownTimer = window.setInterval(() => {
			this.tickCountdown();
		}, 200);
	}

	/**
	 * Stops the active countdown interval.
	 *
	 * @summary Stops the countdown loop.
	 */
	private stopCountdown(): void {
		if (this.countdownTimer === null) {
			return;
		}

		window.clearInterval(this.countdownTimer);
		this.countdownTimer = null;
	}

	/**
	 * Advances the countdown and emits the elapsed event when it reaches zero.
	 *
	 * @summary Updates the countdown state on each tick.
	 */
	private tickCountdown(): void {
		if (this.endTimestampMs === null) {
			return;
		}

		const nextRemaining = Math.max(0, this.endTimestampMs - Date.now());
		this.remainingMs = nextRemaining;
		this.updateDisplay();

		if (nextRemaining > 0) {
			return;
		}

		this.stopCountdown();
		this.setAttribute("data-elapsed", "");
		this.dispatchEvent(new CustomEvent("tp-timer-elapsed", { bubbles: true }));
		this.startRinging();
	}

	/**
	 * Resets the countdown to its full configured duration.
	 *
	 * @summary Resets the countdown state.
	 */
	private resetCountdown(): void {
		this.stopRinging();
		this.removeAttribute("data-elapsed");
		this.remainingMs = this.duration * 1000;
		this.endTimestampMs = null;
		this.updateDisplay();
	}

	/**
	 * Stops the countdown and resets the timer immediately.
	 *
	 * @summary Stops and resets the timer.
	 */
	private stopAndReset(): void {
		this.stopCountdown();
		this.resetCountdown();
		this.setAttribute("data-stopped", "");
	}

	/**
	 * Restarts the timer from the configured duration.
	 *
	 * @summary Starts a new countdown from the beginning.
	 */
	private startFromBeginning(): void {
		this.resetCountdown();
		this.startCountdown();
	}

	/**
	 * Schedules the ringing sequence that plays after the countdown elapses.
	 *
	 * @summary Starts the elapsed ringing sequence.
	 */
	private startRinging(): void {
		if (this.silent) {
			return;
		}

		this.stopRinging();
		for (let index = 0; index < TpTimer.ringCount; index += 1) {
			const timeoutId = window.setTimeout(() => {
				this.playBell();
			}, index * TpTimer.ringGapMs);
			this.ringTimeouts.push(timeoutId);
		}
	}

	/**
	 * Cancels every scheduled ring timeout.
	 *
	 * @summary Stops any pending ringing sequence.
	 */
	private stopRinging(): void {
		if (this.ringTimeouts.length === 0) {
			return;
		}

		for (const timeoutId of this.ringTimeouts) {
			window.clearTimeout(timeoutId);
		}

		this.ringTimeouts = [];
	}

	/**
	 * Plays one short bell tone through the Web Audio API.
	 *
	 * @summary Plays a single timer bell tone.
	 */
	private playBell(): void {
		const AudioContextCtor =
			globalThis.AudioContext ??
			(
				globalThis as typeof globalThis & {
					webkitAudioContext?: typeof AudioContext;
				}
			).webkitAudioContext;

		if (!AudioContextCtor) {
			return;
		}

		const context = new AudioContextCtor() as AudioContextLike;
		const oscillator = context.createOscillator();
		const gainNode = context.createGain();

		oscillator.type = "triangle";
		oscillator.frequency.value = 1020;

		oscillator.connect(gainNode);
		gainNode.connect(context.destination);

		const startAt = context.currentTime;
		gainNode.gain.setValueAtTime(0.001, startAt);
		gainNode.gain.linearRampToValueAtTime(0.25, startAt + 0.02);
		gainNode.gain.exponentialRampToValueAtTime(0.001, startAt + 0.3);
		oscillator.onended = () => {
			void context.close();
		};
		void context.resume();
		oscillator.start();
		oscillator.stop(startAt + 0.3);
	}

	/**
	 * Refreshes the displayed time and input value.
	 *
	 * @summary Updates the timer UI state.
	 */
	private updateDisplay(): void {
		this.ensureDom();
		if (
			!(this.displayEl instanceof HTMLSpanElement) ||
			!(this.durationInputEl instanceof HTMLInputElement)
		) {
			return;
		}

		const totalSeconds = Math.ceil(this.remainingMs / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		const timeText = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

		this.displayEl.textContent = timeText;
		this.durationInputEl.value = String(this.duration);
		this.style.setProperty("--tp-timer-size", this.size);
	}
}

if (!customElements.get("tp-timer")) {
	customElements.define("tp-timer", TpTimer);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-timer": TpTimer;
	}
}
