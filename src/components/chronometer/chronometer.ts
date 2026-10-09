/**
 * @module components/chronometer
 * @summary Chronometer component with play, pause and stop controls.
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

import style from "./chronometer.css?inline";

import "../icon-button/icon-button.js";
import "../icon/icon.js";

import { TpBase } from "../base/base.js";

/**
 * Chronometer component.
 *
 * @tagname tp-chronometer
 * @attr {string} size = "1rem" - Icon and text size.
 * @cssprop --tp-chronometer-size Icon and text size.
 * @example
 * <tp-chronometer></tp-chronometer>
 */
export class TpChronometer extends TpBase {
	private static readonly styleId = "tp-chronometer-styles";

	private tickTimer: number | null = null;
	private startedAtMs: number | null = null;
	private elapsedMs = 0;

	private displayEl: HTMLSpanElement | null = null;

	/**
	 * Returns the list of attributes observed by the component.
	 *
	 * @summary Returns the observed attributes.
	 */
	public static get observedAttributes(): string[] {
		return ["size"];
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
	 * Initializes the chronometer when the element is connected.
	 *
	 * @summary Connects the chronometer component.
	 * @internal
	 */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpChronometer.styleId, style);
		this.ensureDom();
		this.updateDisplay();
	}

	/**
	 * Refreshes the chronometer after an observed attribute change.
	 *
	 * @summary Handles observed attribute changes.
	 * @internal
	 */
	protected attributeChangedCallback(): void {
		if (!this.isConnected) {
			return;
		}

		this.updateDisplay();
	}

	/**
	 * Stops active ticking when the element is disconnected.
	 *
	 * @summary Disconnects the chronometer component.
	 * @internal
	 */
	public disconnectedCallback(): void {
		this.stopTicking();
	}

	/**
	 * Creates and caches the internal chronometer UI.
	 *
	 * @summary Ensures the internal chronometer DOM exists.
	 */
	private ensureDom(): void {
		if (this.displayEl instanceof HTMLSpanElement) {
			return;
		}

		const display = document.createElement("span");
		display.setAttribute("data-tp-chronometer-display", "");

		const timerIcon = document.createElement("tp-icon");
		timerIcon.setAttribute("name", "timer");
		timerIcon.setAttribute("data-tp-chronometer-icon", "");

		const playButton = document.createElement("tp-icon-button");
		playButton.setAttribute("name", "play");
		playButton.setAttribute("label", "Start chronometer");
		playButton.addEventListener("click", () => {
			this.play();
		});

		const pauseButton = document.createElement("tp-icon-button");
		pauseButton.setAttribute("name", "pause");
		pauseButton.setAttribute("label", "Pause chronometer");
		pauseButton.addEventListener("click", () => {
			this.pause();
		});

		const stopButton = document.createElement("tp-icon-button");
		stopButton.setAttribute("name", "stop");
		stopButton.setAttribute("label", "Stop chronometer");
		stopButton.addEventListener("click", () => {
			this.stop();
		});

		this.replaceChildren(
			timerIcon,
			display,
			playButton,
			pauseButton,
			stopButton,
		);
		this.displayEl = display;
	}

	/**
	 * Starts time accumulation and periodic display refresh.
	 *
	 * @summary Starts the chronometer.
	 */
	public play(): void {
		if (this.startedAtMs !== null) {
			return;
		}

		this.startedAtMs = Date.now() - this.elapsedMs;
		this.tickTimer = window.setInterval(() => {
			this.updateDisplay();
		}, 100);
	}

	/**
	 * Pauses time accumulation while preserving the elapsed value.
	 *
	 * @summary Pauses the chronometer.
	 */
	public pause(): void {
		if (this.startedAtMs === null) {
			return;
		}

		this.elapsedMs = Date.now() - this.startedAtMs;
		this.startedAtMs = null;
		this.stopTicking();
		this.updateDisplay();
	}

	/**
	 * Stops the chronometer and resets the elapsed value to zero.
	 *
	 * @summary Stops and resets the chronometer.
	 */
	public stop(): void {
		this.startedAtMs = null;
		this.elapsedMs = 0;
		this.stopTicking();
		this.updateDisplay();
	}

	/**
	 * Stops the active refresh interval.
	 *
	 * @summary Stops the chronometer refresh ticker.
	 */
	private stopTicking(): void {
		if (this.tickTimer === null) {
			return;
		}

		window.clearInterval(this.tickTimer);
		this.tickTimer = null;
	}

	/**
	 * Refreshes the formatted elapsed time.
	 *
	 * @summary Updates the chronometer UI state.
	 */
	private updateDisplay(): void {
		this.ensureDom();
		if (!(this.displayEl instanceof HTMLSpanElement)) {
			return;
		}

		const effectiveElapsedMs =
			this.startedAtMs === null
				? this.elapsedMs
				: Date.now() - this.startedAtMs;

		const totalCentiseconds = Math.floor(effectiveElapsedMs / 10);
		const minutes = Math.floor(totalCentiseconds / 6000);
		const seconds = Math.floor((totalCentiseconds % 6000) / 100);
		const centiseconds = totalCentiseconds % 100;

		this.displayEl.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;

		this.style.setProperty("--tp-chronometer-size", this.size);
	}
}

if (!customElements.get("tp-chronometer")) {
	customElements.define("tp-chronometer", TpChronometer);
}

declare global {
	interface HTMLElementTagNameMap {
		"tp-chronometer": TpChronometer;
	}
}
