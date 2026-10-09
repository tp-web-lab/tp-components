/**
 * @module components/speech-to-text
 * @summary Transcribes microphone speech using browser speech recognition.
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
/**
 * @tp-dependency tp-stack
 * @summary Vertical stack layout component.
 */
/**
 * @tp-dependency tp-textfield
 * @summary Single-line and automatically growing multiline text field.
 */
// tp-docgen:dependencies:end

import speechControlsStyle from "../../utilities/speech-controls.css?inline";
import { TpBase } from "../base/base.js";
import "../button-group/button-group.js";
import "../button/button.js";
import "../stack/stack.js";
import "../textfield/textfield.js";
import type {
	RecognitionConstructor,
	RecognitionEngine,
	RecognitionErrorEvent,
	RecognitionResultEvent,
} from "./speech-recognition.types.js";

/**
 * @tagname tp-speech-to-text
 * @summary transcribes microphone speech into editable text using the Web Speech API.
 * @attr {string} value = "" - Final transcript, editable without microphone access.
 * @attr {boolean} continuous = false - Requests multiple recognition results in one session.
 * @attr {boolean} interim-results = false - Displays provisional recognition separately from the final transcript.
 * @attr {boolean} disabled = false - Disables editing and recognition and stops any active session.
 * @event tp-speech-to-text-start Emitted when recognition starts listening.
 * @eventdetail tp-speech-to-text-start { value: string }
 * @event tp-speech-to-text-result Emitted when recognition updates its transcript.
 * @eventdetail tp-speech-to-text-result { value: string; interim: string }
 * @event tp-speech-to-text-end Emitted when recognition ends or is aborted.
 * @eventdetail tp-speech-to-text-end { value: string }
 * @event tp-speech-to-text-error Emitted when recognition fails or is unavailable.
 * @eventdetail tp-speech-to-text-error { error: string }
 * @accessibility Uses labelled native controls through tp-button and tp-textfield, with a polite status region and a keyboard-editable transcript.
 * @accessibilityresponsibility Explain microphone permission and possible remote audio processing; never require speech as the only input method.
 * @keyboard {Tab / Shift+Tab} Moves between playback controls and the transcript field.
 * @keyboard {Enter / Space} Activates a focused button.
 * @example
 * <tp-speech-to-text lang="en-US" interim-results></tp-speech-to-text>
 */
export class TpSpeechToText extends TpBase {
	/** Attributes affecting recognition configuration, editing and the transcript. */
	public static get observedAttributes(): string[] {
		return [
			...TpBase.observedAttributes,
			"value",
			"continuous",
			"interim-results",
			"disabled",
		];
	}
	/** The recognition session owned by this component, never a shared global session. */
	private recognition: RecognitionEngine | null = null;
	/** Final text preceding the current recognition session. */
	private sessionPrefix = "";
	/** Current provisional recognition, not committed to value. */
	private interim = "";
	/** Prevents recursive updates when recognition writes its final transcript. */
	private writingResult = false;
	/** Current status retained across UI refreshes. */
	private status = "Ready.";
	/** Current lifecycle state, including pending permission and finalization. */
	private state: "idle" | "starting" | "listening" | "stopping" = "idle";

	/** Final transcript, also usable as an initial value. */
	public get value(): string {
		return this.getAttribute("value") ?? "";
	}
	/** Replaces the final transcript and cancels any in-flight dictation. */
	public set value(value: string) {
		this.setStringAttribute("value", value);
	}
	/** Whether the browser should continue after the first result. */
	public get continuous(): boolean {
		return this.hasAttribute("continuous");
	}
	/** Configures continuous recognition for the next session. */
	public set continuous(value: boolean) {
		this.setBooleanAttribute("continuous", value);
	}
	/** Whether provisional hypotheses are displayed. */
	public get interimResults(): boolean {
		return this.hasAttribute("interim-results");
	}
	/** Configures provisional recognition for the next session. */
	public set interimResults(value: boolean) {
		this.setBooleanAttribute("interim-results", value);
	}
	/** Whether all user input is disabled. */
	public get disabled(): boolean {
		return this.hasAttribute("disabled");
	}
	/** Disables input and aborts active recognition. */
	public set disabled(value: boolean) {
		this.setBooleanAttribute("disabled", value);
	}

	/** Builds library controls using the shared speech-control styles, loaded once. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-speech-controls-styles", speechControlsStyle);
		this.innerHTML = `<tp-stack>
      <tp-button-group class="tp-speech-controls" role="group" aria-label="Speech recognition controls">
        <tp-button size="s" data-action="start">Start</tp-button>
        <tp-button size="s" data-action="stop">Stop</tp-button>
        <tp-button size="s" data-action="clear">Clear</tp-button>
        <span class="tp-speech-status" data-role="status" role="status" aria-live="polite"></span>
      </tp-button-group>
      <tp-textfield multiline label="Transcript" data-role="transcript"></tp-textfield>
      <p data-role="interim" aria-label="Provisional transcript" hidden></p>
    </tp-stack>`;
		for (const action of ["start", "stop", "clear"] as const) {
			this.querySelector(`[data-action="${action}"]`)?.addEventListener(
				"click",
				() => this[action](),
			);
		}
		this.querySelector("tp-textfield")?.addEventListener("input", this.onInput);
		this.updateUI();
	}
	/** Aborts before applying author edits or recognition setting changes. */
	protected attributeChangedCallback(name: string): void {
		if (this.writingResult) return;
		if (
			name === "value" ||
			name === "lang" ||
			name === "continuous" ||
			name === "interim-results" ||
			this.disabled
		)
			this.abort();
		if (this.isConnected) this.updateUI();
	}
	/** Releases the microphone and detaches all recognition listeners. */
	public disconnectedCallback(): void {
		this.abort();
	}

	/** Starts recognition after an explicit user action; never retries automatically. */
	public start(): void {
		if (this.disabled || this.recognition || !this.isConnected) return;
		const Constructor = this.recognitionConstructor();
		if (!Constructor) {
			this.fail("Speech recognition is unavailable in this browser.");
			return;
		}
		try {
			const engine = new Constructor();
			this.recognition = engine;
			this.sessionPrefix = this.value.trim();
			this.interim = "";
			const language = this.closest("[lang]")?.getAttribute("lang")?.trim();
			if (language) engine.lang = language;
			engine.continuous = this.continuous;
			engine.interimResults = this.interimResults;
			engine.addEventListener("start", this.onStart);
			engine.addEventListener("result", this.onResult);
			engine.addEventListener("error", this.onError);
			engine.addEventListener("end", this.onEnd);
			this.state = "starting";
			this.status = "Waiting for microphone permission…";
			this.updateUI();
			engine.start();
		} catch (error) {
			this.fail(error instanceof Error ? error.message : String(error));
		}
	}
	/** Stops listening while allowing the browser to deliver a final result. */
	public stop(): void {
		if (!this.recognition || this.state === "stopping") return;
		this.state = "stopping";
		this.status = "Finishing transcription…";
		this.updateUI();
		try {
			this.recognition.stop();
		} catch (error) {
			this.fail(error instanceof Error ? error.message : String(error));
		}
	}
	/** Cancels recognition, discarding provisional text but retaining final text. */
	public abort(): void {
		const engine = this.release();
		if (!engine) return;
		try {
			engine.abort();
		} catch {
			/* The browser may already have ended the session. */
		}
		this.status = "Stopped.";
		this.updateUI();
		this.emit("end", { value: this.value });
	}
	/** Clears the transcript after cancelling active recognition. */
	public clear(): void {
		if (this.disabled) return;
		this.abort();
		this.value = "";
		this.interim = "";
		this.status = "Ready.";
		this.updateUI();
	}
	/** Resolves the standard API or the browser-prefixed implementation. */
	private recognitionConstructor(): RecognitionConstructor | undefined {
		const scope = this.ownerDocument.defaultView as
			| (Window & {
					SpeechRecognition?: RecognitionConstructor;
					webkitSpeechRecognition?: RecognitionConstructor;
			  })
			| null;
		return scope?.SpeechRecognition ?? scope?.webkitSpeechRecognition;
	}
	/** Handles real listening, distinct from requesting microphone permission. */
	private readonly onStart = (): void => {
		if (this.state !== "stopping") {
			this.state = "listening";
			this.status = "Listening…";
		}
		this.updateUI();
		this.emit("start", { value: this.value });
	};
	/** Rebuilds cumulative results to avoid duplication when interim results change. */
	private readonly onResult = (event: Event): void => {
		const results = (event as RecognitionResultEvent).results;
		const final = [this.sessionPrefix];
		const interim: string[] = [];
		for (let index = 0; index < results.length; index += 1) {
			const result = results[index];
			if (!result) continue;
			const text = result[0]?.transcript.trim() ?? "";
			(result.isFinal ? final : interim).push(text);
		}
		this.writingResult = true;
		this.value = final.filter(Boolean).join(" ");
		this.writingResult = false;
		this.interim = this.interimResults ? interim.filter(Boolean).join(" ") : "";
		this.updateUI();
		this.emit("result", { value: this.value, interim: this.interim });
	};
	/** Preserves the browser's error code for permission and service diagnostics. */
	private readonly onError = (event: Event): void => {
		this.fail((event as RecognitionErrorEvent).error);
	};
	/** Ends the session without automatically opening the microphone again. */
	private readonly onEnd = (): void => {
		this.release();
		this.status = "Ready.";
		this.updateUI();
		this.emit("end", { value: this.value });
	};
	/** Keeps manually edited text authoritative over pending recognition results. */
	private readonly onInput = (): void => {
		const field = this.querySelector("tp-textfield");
		if (field) this.value = field.value;
	};
	/** Detaches recognition callbacks before cancellation to ignore stale events. */
	private release(): RecognitionEngine | null {
		const engine = this.recognition;
		this.recognition = null;
		engine?.removeEventListener("start", this.onStart);
		engine?.removeEventListener("result", this.onResult);
		engine?.removeEventListener("error", this.onError);
		engine?.removeEventListener("end", this.onEnd);
		this.state = "idle";
		this.interim = "";
		return engine;
	}
	/** Reports failures without removing the keyboard input alternative. */
	private fail(error: string): void {
		this.abort();
		this.status = `Error: ${error}`;
		this.updateUI();
		this.emit("error", { error });
	}
	/** Synchronizes existing controls without replacing focused elements. */
	private updateUI(): void {
		const supported = Boolean(this.recognitionConstructor());
		const field = this.querySelector("tp-textfield");
		if (field) {
			field.value = this.value;
			field.disabled = this.disabled;
		}
		this.querySelector('[data-action="start"]')?.toggleAttribute(
			"disabled",
			this.disabled || !supported || this.state !== "idle",
		);
		this.querySelector('[data-action="stop"]')?.toggleAttribute(
			"disabled",
			this.disabled || this.state === "idle" || this.state === "stopping",
		);
		this.querySelector('[data-action="clear"]')?.toggleAttribute(
			"disabled",
			this.disabled || (this.value === "" && this.state === "idle"),
		);
		const status = this.querySelector('[data-role="status"]');
		if (status)
			status.textContent = supported
				? this.status
				: "Speech recognition is unavailable. You can type your transcript.";
		const interim = this.querySelector<HTMLElement>('[data-role="interim"]');
		if (interim) {
			interim.textContent = this.interim;
			interim.hidden = this.interim === "";
		}
		this.dataset.state = this.state;
	}
	/** Emits component-scoped events without suppressing native editing events. */
	private emit(suffix: string, detail: object): void {
		this.dispatchEvent(
			new CustomEvent(`tp-speech-to-text-${suffix}`, { detail, bubbles: true }),
		);
	}
}

// Guard repeated module evaluation during development.
if (!customElements.get("tp-speech-to-text"))
	customElements.define("tp-speech-to-text", TpSpeechToText);

// Expose the concrete element type to TypeScript DOM callers.
declare global {
	interface HTMLElementTagNameMap {
		"tp-speech-to-text": TpSpeechToText;
	}
}
