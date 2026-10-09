/**
 * @module components/alarm
 * @summary Alarm component with stop control and optional ring.
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

import style from "./alarm.css?inline";

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
 * Alarm component.
 *
 * The alarm triggers when local time matches the `time` attribute.
 *
 * @tagname tp-alarm
 * @attr {string} time = "07:00" - Alarm time in `HH:MM` or `HH:MM:SS`.
 * @attr {string} size = "1rem" - Icon and text size.
 * @attr {boolean} silent = false - Disables sound playback.
 * @cssprop --tp-alarm-size Icon and text size.
 * @event tp-alarm-trigger Emitted when the alarm is triggered.
 * @eventdetail tp-alarm-trigger void
 * @example
 * <tp-alarm></tp-alarm>
 */
export class TpAlarm extends TpBase {
	private static readonly styleId = "tp-alarm-styles";
	private static readonly ringCount = 10;
	private static readonly ringGapMs = 420;

	private checkTimer: number | null = null;
	private ringTimeouts: number[] = [];
	private displayEl: HTMLSpanElement | null = null;
	private timeInputEl: HTMLInputElement | null = null;
	private alarmIconEl: HTMLElement | null = null;
	private lastTriggerKey = "";

	/**
	 * Returns the list of attributes observed by the component.
	 *
	 * @summary Returns the observed attributes.
	 */
	public static get observedAttributes(): string[] {
		return ["time", "size", "silent"];
	}

	/**
	 * Returns the configured alarm time.
	 *
	 * @summary Returns the configured alarm time string.
	 */
	public get time(): string {
		return this.getStringAttribute("time", "07:00");
	}

	/**
	 * Updates the configured alarm time.
	 *
	 * @summary Sets the alarm time string.
	 * @param value Time value to apply.
	 */
	public set time(value: string) {
		this.setStringAttribute("time", value);
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
	 * Initializes the alarm when the element is connected.
	 *
	 * @summary Connects the alarm component.
	 * @internal
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpAlarm.styleId, style);
		this.ensureDom();
		this.startChecking();
		this.updateDisplay();
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

		if (name === "time") {
			this.lastTriggerKey = "";
		}

		this.updateDisplay();
	}

	/**
	 * Stops timers and ringing when the element is disconnected.
	 *
	 * @summary Disconnects the alarm component.
	 * @internal
	 */
	public disconnectedCallback(): void {
		this.stopChecking();
		this.stopRinging();
	}

	/**
	 * Creates and caches the internal alarm UI.
	 *
	 * @summary Ensures the internal alarm DOM exists.
	 */
	private ensureDom(): void {
		if (
			this.displayEl instanceof HTMLSpanElement &&
			this.timeInputEl instanceof HTMLInputElement &&
			this.alarmIconEl instanceof HTMLElement
		) {
			return;
		}

		const timeInput = document.createElement("input");
		timeInput.type = "time";
		timeInput.step = "1";
		timeInput.setAttribute("data-tp-alarm-time", "");
		timeInput.setAttribute("aria-label", "Alarm time");
		timeInput.addEventListener("change", () => {
			const value = timeInput.value.trim();
			if (value === "") {
				return;
			}

			this.time = value.length === 5 ? `${value}:00` : value;
			this.clearAlert(false);
			this.removeAttribute("data-stopped");
			this.updateDisplay();
		});

		const display = document.createElement("span");
		display.setAttribute("data-tp-alarm-display", "");

		const alarmIcon = document.createElement("tp-icon");
		alarmIcon.setAttribute("name", "notifications");
		alarmIcon.setAttribute("data-tp-alarm-icon", "");
		alarmIcon.setAttribute("size", this.size);

		const stopButton = document.createElement("tp-icon-button");
		stopButton.setAttribute("name", "stop");
		stopButton.setAttribute("label", "Stop alarm");
		stopButton.addEventListener("click", () => {
			this.stopAlarm();
		});

		const playButton = document.createElement("tp-icon-button");
		playButton.setAttribute("name", "play");
		playButton.setAttribute("label", "Start alarm");
		playButton.addEventListener("click", () => {
			this.startAlarm();
		});

		this.replaceChildren(alarmIcon, timeInput, display, playButton, stopButton);
		this.alarmIconEl = alarmIcon;
		this.timeInputEl = timeInput;
		this.displayEl = display;
	}

	/**
	 * Starts periodic alarm-time checks.
	 *
	 * @summary Starts the alarm polling loop.
	 */
	private startChecking(): void {
		this.stopChecking();
		this.checkTimer = window.setInterval(() => {
			this.checkAlarm();
		}, 250);
	}

	/**
	 * Stops periodic alarm-time checks.
	 *
	 * @summary Stops the alarm polling loop.
	 */
	private stopChecking(): void {
		if (this.checkTimer === null) {
			return;
		}

		window.clearInterval(this.checkTimer);
		this.checkTimer = null;
	}

	/**
	 * Compares the current time to the configured alarm time.
	 *
	 * @summary Checks whether the alarm should trigger.
	 */
	private checkAlarm(): void {
		const target = this.parseAlarmTime(this.time);
		if (target === null) {
			this.setAttribute("data-invalid", "");
			return;
		}

		this.removeAttribute("data-invalid");
		const now = new Date();
		const key = `${String(now.getFullYear())}-${String(now.getMonth())}-${String(now.getDate())}`;

		if (this.lastTriggerKey === key) {
			return;
		}

		if (
			now.getHours() === target.hours &&
			now.getMinutes() === target.minutes &&
			now.getSeconds() === target.seconds
		) {
			this.lastTriggerKey = key;
			this.triggerAlarm();
		}
	}

	/**
	 * Marks the alarm as active and schedules ringing.
	 *
	 * @summary Triggers the alarm state and audio feedback.
	 */
	private triggerAlarm(): void {
		this.removeAttribute("data-stopped");
		this.setAttribute("data-alert", "");
		this.dispatchEvent(new CustomEvent("tp-alarm-trigger", { bubbles: true }));

		if (this.silent) {
			return;
		}

		this.stopRinging();
		for (let index = 0; index < TpAlarm.ringCount; index += 1) {
			const timeoutId = window.setTimeout(() => {
				this.playBell();
			}, index * TpAlarm.ringGapMs);
			this.ringTimeouts.push(timeoutId);
		}
	}

	/**
	 * Starts alarm monitoring after a manual resume.
	 *
	 * @summary Restarts alarm monitoring.
	 */
	private startAlarm(): void {
		this.removeAttribute("data-stopped");
		this.startChecking();
	}

	/**
	 * Stops alarm monitoring and clears any active alert.
	 *
	 * @summary Stops the alarm and clears its active state.
	 */
	private stopAlarm(): void {
		this.stopChecking();
		this.clearAlert();
	}

	/**
	 * Clears the current alert state and optionally marks the alarm as stopped.
	 *
	 * @summary Clears the active alert state.
	 * @param markStopped Whether to add the stopped state marker.
	 */
	private clearAlert(markStopped = true): void {
		this.removeAttribute("data-alert");
		this.stopRinging();
		if (markStopped) {
			this.setAttribute("data-stopped", "");
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
	 * Plays a short bell tone through the Web Audio API.
	 *
	 * @summary Plays one alarm bell tone.
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

		oscillator.type = "sine";
		oscillator.frequency.value = 1240;

		oscillator.connect(gainNode);
		gainNode.connect(context.destination);

		const startAt = context.currentTime;
		gainNode.gain.setValueAtTime(0.001, startAt);
		gainNode.gain.linearRampToValueAtTime(0.28, startAt + 0.02);
		gainNode.gain.exponentialRampToValueAtTime(0.001, startAt + 0.3);
		oscillator.onended = () => {
			void context.close();
		};
		void context.resume();
		oscillator.start();
		oscillator.stop(startAt + 0.3);
	}

	/**
	 * Parses a clock time formatted as `HH:MM` or `HH:MM:SS`.
	 *
	 * @summary Parses the configured alarm time.
	 * @param value Raw time string to parse.
	 * @returns Parsed time parts or `null` when the value is invalid.
	 */
	private parseAlarmTime(
		value: string,
	): { hours: number; minutes: number; seconds: number } | null {
		const match = value.trim().match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
		if (match === null) {
			return null;
		}

		const hours = Number(match[1]);
		const minutes = Number(match[2]);
		const seconds = Number(match[3] ?? "00");
		if (
			hours < 0 ||
			hours > 23 ||
			minutes < 0 ||
			minutes > 59 ||
			seconds < 0 ||
			seconds > 59
		) {
			return null;
		}

		return { hours, minutes, seconds };
	}

	/**
	 * Refreshes the displayed time and icon size.
	 *
	 * @summary Updates the alarm UI state.
	 */
	private updateDisplay(): void {
		this.ensureDom();
		if (
			!(this.displayEl instanceof HTMLSpanElement) ||
			!(this.timeInputEl instanceof HTMLInputElement)
		) {
			return;
		}

		this.timeInputEl.value = this.time;
		this.displayEl.textContent = this.time;
		this.alarmIconEl?.setAttribute("size", this.size);
		this.style.setProperty("--tp-alarm-size", this.size);
	}
}

if (!customElements.get("tp-alarm")) {
	customElements.define("tp-alarm", TpAlarm);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-alarm": TpAlarm;
	}
}
