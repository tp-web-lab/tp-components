/**
 * @module components/text-to-speech
 * @summary Reads textual component content aloud with the Web Speech API.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button-group
 * @summary Button group component for organizing multiple buttons.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Displays an anchored dropdown menu.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-typewriting
 * @summary progressively reveals text one letter or one word at a time.
 */
// tp-docgen:dependencies:end

import { TpDeclarativeTextSource } from "../../utilities/declarative-text-source.js";
import speechControlsStyle from "../../utilities/speech-controls.css?inline";
import { readSpeechText } from "../../utilities/speech-text.js";
import { TpBase } from "../base/base.js";
import "../button-group/button-group.js";
import type { TpDropdown } from "../dropdown/dropdown.js";
import "../dropdown/dropdown.js";
import "../icon-button/icon-button.js";
import type { TpTypewriting } from "../typewriting/typewriting.js";
import "../typewriting/typewriting.js";
import style from "./text-to-speech.css?inline";

type SpeechState = "idle" | "speaking" | "paused";
type SpeechGlobals = {
	speechSynthesis?: SpeechSynthesis;
	SpeechSynthesisUtterance?: typeof SpeechSynthesisUtterance;
};

/**
 * @tagname tp-text-to-speech
 * @summary Reads inline or external text aloud with browser speech synthesis.
 * @attr {string} src = "" - Text file loaded relative to the containing document.
 * @attr {string} value = "" - Text supplied directly as an attribute.
 * @attr {string} for = "" - ID of an element supplying readable text; overrides local sources and synchronizes word boundaries when the target is tp-typewriting.
 * @attr {boolean} show-text = false - Displays the source text alongside the playback controls.
 * @attr {boolean} lite = false - Replaces playback controls with a single speak/stop icon button.
 * @attr {string} voice = "" - Preferred installed voice name or language tag.
 * @attr {number} rate = 1 - Speech rate from 0.1 to 10.
 * @attr {number} pitch = 1 - Speech pitch from 0 to 2.
 * @attr {number} volume = 1 - Speech volume from 0 to 1.
 * @attr {boolean} autoplay = false - Starts reading after the source is loaded when browser policy permits it.
 * @event tp-text-to-speech-start Emitted when speech starts.
 * @eventdetail tp-text-to-speech-start { text: string }
 * @event tp-text-to-speech-end Emitted when speech ends or is stopped.
 * @eventdetail tp-text-to-speech-end { text: string }
 * @event tp-text-to-speech-error Emitted when loading or speech synthesis fails.
 * @eventdetail tp-text-to-speech-error { error: string }
 * @accessibility Uses labelled tp-button controls and announces its current state through a polite status region.
 * @accessibilityresponsibility Do not use synthesized speech as the only way to provide information; retain equivalent visible text.
 * @keyboard {Enter / Space} Activates the native button inside each tp-button control.
 * @example
 * <tp-text-to-speech lang="en" show-text>
 *   <script type="tp/txt">Welcome to tp-components.</script>
 * </tp-text-to-speech>
 */
export class TpTextToSpeech extends TpBase {
	/** Counter ensuring that each settings trigger has a distinct anchor. */
	private static settingsSequence = 0;
	/** Stable identifier shared by the settings trigger and its dropdown. */
	private readonly settingsId =
		`tp-speech-settings-${++TpTextToSpeech.settingsSequence}`;
	/** Speech engine observed while the component is connected. */
	private observedSynthesis: SpeechSynthesis | undefined;
	/** Refreshes compatible voices when the browser publishes its voice catalogue. */
	private readonly onVoicesChanged = (): void => {
		this.refreshVoiceMenu();
	};
	/** Attributes whose changes can update the source, rendering or speech. */
	public static get observedAttributes(): string[] {
		return [
			...TpBase.observedAttributes,
			"src",
			"for",
			"value",
			"show-text",
			"lite",
			"voice",
			"rate",
			"pitch",
			"volume",
			"autoplay",
		];
	}

	/** Shared reader for `src`, `value`, script and direct-text sources. */
	private readonly source = new TpDeclarativeTextSource(this, {
		scriptTypes: ["tp/txt", "tp/text-to-speech"],
		textContentFallback: true,
		ignoreSelector: "[data-tp-speech-ui]",
	});
	/** Text currently available to the speech engine. */
	private text = "";
	/** Strong reference retained while the browser is speaking. */
	private utterance: SpeechSynthesisUtterance | null = null;
	/** Sequence used to discard stale asynchronous loads. */
	private updateToken = 0;
	/** Linked visual text, controlled only while this component owns it. */
	private linkedTypewriting: TpTypewriting | null = null;
	/** Document element supplying the current reading, whether animated or static. */
	private linkedTarget: Element | null = null;
	/** Stops a reading when the linked author text changes. Visual reveal attributes are ignored. */
	private readonly linkedObserver = new MutationObserver(() => {
		if (
			this.linkedTarget &&
			(!this.linkedTarget.isConnected || this.readLinkedText() !== this.text)
		)
			void this.updateText();
	});
	/** ID of any document element supplying the speech text. */
	public get htmlFor(): string {
		return this.getAttribute("for") ?? "";
	}
	/** Changes the linked text source. */
	public set htmlFor(value: string) {
		this.setStringAttribute("for", value);
	}
	/** Resolves the reference without interpreting the ID as a CSS selector. */
	private resolveTarget(): Element | null {
		const target = this.htmlFor
			? this.ownerDocument.getElementById(this.htmlFor)
			: null;
		// The loader and static imports can evaluate the module under different URLs.
		// Only the constructor registered in the target's realm defines its identity.
		const registered =
			this.ownerDocument.defaultView?.customElements.get("tp-typewriting");
		const next =
			target?.localName === "tp-typewriting" &&
			registered &&
			target instanceof registered
				? (target as TpTypewriting)
				: null;
		if (target !== this.linkedTarget) {
			this.stop();
			this.linkedObserver.disconnect();
			this.linkedTypewriting?.detachSpeech(this);
			this.linkedTypewriting = next;
			this.linkedTarget = target;
			next?.attachSpeech(this);
			if (target && target !== this)
				this.linkedObserver.observe(target, {
					childList: true,
					subtree: true,
					characterData: true,
					attributes: true,
					attributeFilter: ["hidden", "aria-hidden", "style", "class"],
				});
		}
		if (this.htmlFor && !target)
			throw new Error(`No element found with id "${this.htmlFor}".`);
		if (target === this)
			throw new Error("The speech component cannot reference itself.");
		return target;
	}
	/** Preserves exact speech offsets for typewriting, and extracts readable text otherwise. */
	private readLinkedText(): string {
		return (
			this.linkedTypewriting?.getSpeechText() ??
			(this.linkedTarget ? readSpeechText(this.linkedTarget) : "")
		);
	}

	/** External text source URL. */
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}
	/** Updates the external text source URL. */
	public set src(value: string) {
		this.setStringAttribute("src", value);
	}
	/** Text supplied directly through the `value` attribute. */
	public get value(): string {
		return this.getAttribute("value") ?? "";
	}
	/** Updates the text supplied through the `value` attribute. */
	public set value(value: string) {
		this.setStringAttribute("value", value);
	}
	/** Whether the source text is rendered visibly. */
	public get showText(): boolean {
		return this.hasAttribute("show-text");
	}
	/** Shows or hides the visible source text. */
	public set showText(value: boolean) {
		this.setBooleanAttribute("show-text", value);
	}

	/** Whether only the compact speak/stop control is displayed. */
	public get lite(): boolean {
		return this.hasAttribute("lite");
	}
	/** Enables or disables the compact playback control. */
	public set lite(value: boolean) {
		this.setBooleanAttribute("lite", value);
	}
	/** Preferred installed voice name or language tag. */
	public get voice(): string {
		return this.getAttribute("voice") ?? "";
	}
	/** Updates the preferred voice. */
	public set voice(value: string) {
		this.setStringAttribute("voice", value);
	}
	/** Speech rate constrained to the Web Speech API range. */
	public get rate(): number {
		return this.numberAttribute("rate", 1, 0.1, 10);
	}
	/** Updates the speech rate. */
	public set rate(value: number) {
		this.setAttribute("rate", String(value));
	}
	/** Speech pitch constrained to the Web Speech API range. */
	public get pitch(): number {
		return this.numberAttribute("pitch", 1, 0, 2);
	}
	/** Updates the speech pitch. */
	public set pitch(value: number) {
		this.setAttribute("pitch", String(value));
	}
	/** Speech volume constrained to the Web Speech API range. */
	public get volume(): number {
		return this.numberAttribute("volume", 1, 0, 1);
	}
	/** Updates the speech volume. */
	public set volume(value: number) {
		this.setAttribute("volume", String(value));
	}
	/** Whether speech starts automatically after loading. */
	public get autoplay(): boolean {
		return this.hasAttribute("autoplay");
	}
	/** Enables or disables automatic speech. */
	public set autoplay(value: boolean) {
		this.setBooleanAttribute("autoplay", value);
	}

	/** Initializes shared styles, source observation and rendering when connected. */
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-text-to-speech-styles", style);
		this.ensureGlobalStyle("tp-speech-controls-styles", speechControlsStyle);
		this.classList.add("tp-text-to-speech");
		this.observedSynthesis = this.getSpeechGlobals().speechSynthesis;
		this.observedSynthesis?.addEventListener(
			"voiceschanged",
			this.onVoicesChanged,
		);
		this.source.observe(() => {
			void this.updateText();
		});
		void this.updateText();
	}

	/** Reacts to source and visible-text attribute changes after connection. */
	protected attributeChangedCallback(name: string): void {
		if (!this.isConnected) return;
		if (name === "src" || name === "value" || name === "for")
			void this.updateText();
		if (name === "show-text") this.render();
		if (name === "lite") {
			this.stop();
			this.render();
		}
		if (name === "lang" || name === "voice") this.refreshVoiceMenu();
	}

	/** Releases source observation and speech synthesis when disconnected. */
	public disconnectedCallback(): void {
		this.source.disconnect();
		this.observedSynthesis?.removeEventListener(
			"voiceschanged",
			this.onVoicesChanged,
		);
		this.observedSynthesis = undefined;
		this.stop();
		this.linkedObserver.disconnect();
		this.linkedTypewriting?.detachSpeech(this);
		this.linkedTypewriting = null;
		this.linkedTarget = null;
		this.updateToken += 1;
	}

	/** Uses the browser's voice for the language unless a voice is explicitly requested. */
	public async speak(): Promise<void> {
		try {
			const target = this.resolveTarget();
			if (target) this.text = this.readLinkedText();
		} catch (error) {
			this.stop();
			this.reportError(error instanceof Error ? error.message : String(error));
			return;
		}
		const globals = this.getSpeechGlobals();
		const synthesis = globals.speechSynthesis;
		const Utterance = globals.SpeechSynthesisUtterance;
		if (synthesis === undefined || Utterance === undefined || this.text === "")
			return;
		this.stop();
		const utterance = new Utterance(this.text);
		this.utterance = utterance;
		const language = this.closest("[lang]")?.getAttribute("lang")?.trim();
		if (language) utterance.lang = language;
		utterance.rate = this.rate;
		utterance.pitch = this.pitch;
		utterance.volume = this.volume;
		if (this.voice.trim() !== "") {
			const voice = await this.selectVoice(synthesis);
			if (voice !== null) utterance.voice = voice;
		}
		if (this.utterance !== utterance) return;
		this.linkedTypewriting?.beginSpeech(this);
		utterance.addEventListener("start", () => {
			if (this.utterance !== utterance) return;
			this.setState("speaking");
			this.emit("tp-text-to-speech-start", { text: this.text });
		});
		utterance.addEventListener("boundary", (event) => {
			if (
				this.utterance !== utterance ||
				this.dataset.state === "paused" ||
				event.name === "sentence"
			)
				return;
			this.linkedTypewriting?.revealSpeech(this, event.charIndex);
		});
		utterance.addEventListener("end", () => {
			if (this.utterance !== utterance) return;
			if (this.utterance === utterance) this.utterance = null;
			this.linkedTypewriting?.endSpeech(this);
			this.setState("idle");
			this.emit("tp-text-to-speech-end", { text: this.text });
		});
		utterance.addEventListener("error", (event) => {
			if (this.utterance !== utterance) return;
			if (this.utterance === utterance) this.utterance = null;
			this.linkedTypewriting?.endSpeech(this);
			this.setState("idle");
			this.reportError(event.error || "Speech synthesis failed.");
		});
		this.utterance = utterance;
		this.setState("speaking");
		synthesis.speak(utterance);
	}

	/** Pauses the current reading. */
	public pause(): void {
		const synthesis = this.getSpeechGlobals().speechSynthesis;
		if (synthesis?.speaking !== true) return;
		synthesis.pause();
		this.setState("paused");
	}

	/** Resumes a paused reading. */
	public resume(): void {
		const synthesis = this.getSpeechGlobals().speechSynthesis;
		if (synthesis?.paused !== true) return;
		synthesis.resume();
		this.setState("speaking");
	}

	/** Stops the current reading. */
	public stop(): void {
		this.utterance = null;
		this.getSpeechGlobals().speechSynthesis?.cancel();
		this.linkedTypewriting?.endSpeech(this);
		if (this.isConnected) this.setState("idle");
	}

	/** Returns text from the highest-priority declarative source. */
	private async getText(): Promise<string> {
		const target = this.resolveTarget();
		if (target) return this.readLinkedText();
		return (await this.source.read({ cache: "no-store" })).trim();
	}

	/** Refreshes component state after resolving its current text. */
	private async updateText(): Promise<void> {
		if (this.utterance) this.stop();
		const token = ++this.updateToken;
		try {
			const text = await this.getText();
			if (token !== this.updateToken) return;
			this.text = text;
			this.render();
			if (this.autoplay) void this.speak();
		} catch (error) {
			if (token !== this.updateToken) return;
			this.text = "";
			this.render();
			this.reportError(error instanceof Error ? error.message : String(error));
		}
	}

	/** Renders visible text, playback controls and the status region. */
	private render(): void {
		// Initial attribute callbacks may render before connectedCallback during upgrade.
		// Preserve author content before replacing the light DOM in every render path.
		this.source.capture();
		const globals = this.getSpeechGlobals();
		const supported =
			globals.speechSynthesis !== undefined &&
			globals.SpeechSynthesisUtterance !== undefined;
		this.innerHTML = `
      <p data-tp-speech-ui class="tp-text-to-speech-text" data-role="text"${this.showText ? "" : " hidden"}></p>
      ${
				this.lite
					? `
      <tp-icon-button data-tp-speech-ui data-action="toggle-speech" name="speakerphone" library="tp" label="Speak"></tp-icon-button>
      <span data-tp-speech-ui class="tp-visually-hidden" data-role="status" role="status" aria-live="polite"></span>`
					: `
      <tp-button-group data-tp-speech-ui class="tp-text-to-speech-controls tp-speech-controls" role="group" aria-label="Text-to-speech controls">
        <tp-icon-button id="${this.settingsId}" name="settings" library="tp" label="Speech voice settings" aria-haspopup="menu" aria-expanded="false" aria-controls="${this.settingsId}-menu"></tp-icon-button>
        <tp-button size="s" data-action="speak">Speak</tp-button>
        <tp-button size="s" data-action="pause">Pause</tp-button>
        <tp-button size="s" data-action="resume">Resume</tp-button>
        <tp-button size="s" data-action="stop">Stop</tp-button>
        <span data-tp-speech-ui class="tp-text-to-speech-status tp-speech-status" data-role="status" role="status" aria-live="polite"></span>
      </tp-button-group>
      <tp-dropdown data-tp-speech-ui id="${this.settingsId}-menu" anchor="#${this.settingsId}" outside-click><ul aria-label="Speech voice"></ul></tp-dropdown>`
			}`;
		const textElement = this.querySelector('[data-role="text"]');
		if (textElement !== null) textElement.textContent = this.text;
		const liteButton = this.querySelector<HTMLElement>(
			'[data-action="toggle-speech"]',
		);
		liteButton?.toggleAttribute("disabled", !supported || this.text === "");
		liteButton?.addEventListener("click", () => {
			if (!supported || this.text === "") return;
			if (this.utterance) this.stop();
			else void this.speak();
		});
		const trigger = this.querySelector(
			`tp-icon-button[id="${this.settingsId}"]`,
		);
		const dropdown = this.querySelector<TpDropdown>("tp-dropdown");
		trigger?.toggleAttribute("disabled", !supported);
		trigger?.addEventListener("click", () => {
			if (supported) dropdown?.toggle();
		});
		dropdown?.addEventListener("tp-dropdown-toggle", () => {
			trigger?.setAttribute("aria-expanded", String(dropdown.open));
		});
		this.refreshVoiceMenu();
		for (const button of this.querySelectorAll<HTMLElement>("tp-button"))
			button.toggleAttribute("disabled", !supported || this.text === "");
		for (const action of ["speak", "pause", "resume", "stop"] as const) {
			this.querySelector(`[data-action="${action}"]`)?.addEventListener(
				"click",
				() => {
					void this[action]();
				},
			);
		}
		this.setState(
			this.utterance
				? this.dataset.state === "paused"
					? "paused"
					: "speaking"
				: "idle",
			supported
				? undefined
				: "Speech synthesis is unavailable in this browser.",
		);
	}

	/** Lists voices in the lang family without changing the author's language. */
	private refreshVoiceMenu(): void {
		const menu = this.querySelector("tp-dropdown > ul");
		if (!menu) return;
		const language =
			this.closest("[lang]")?.getAttribute("lang")?.trim() ||
			this.ownerDocument.defaultView?.navigator.language ||
			"en";
		const family = language.split("-")[0]?.toLowerCase();
		const voices = (this.getSpeechGlobals().speechSynthesis?.getVoices() ?? [])
			.filter((voice) => voice.lang.split("-")[0]?.toLowerCase() === family)
			.sort(
				(left, right) =>
					left.name.localeCompare(right.name) ||
					left.lang.localeCompare(right.lang),
			);
		const options = [
			{ name: "", label: "Automatic (browser default)" },
			...voices.map((voice) => ({
				name: voice.name,
				label: `${voice.name} (${voice.lang})`,
			})),
		];
		const items = options.map((option) => {
			const item = this.ownerDocument.createElement("li");
			item.textContent = option.label;
			item.dataset.voice = option.name;
			if (option.name.toLowerCase() === this.voice.trim().toLowerCase())
				item.setAttribute("aria-current", "true");
			item.addEventListener("click", () => {
				this.stop();
				this.voice = option.name;
				this.querySelector<TpDropdown>("tp-dropdown")?.hide();
				this.querySelector("tp-icon-button")?.querySelector("button")?.focus();
			});
			return item;
		});
		menu.replaceChildren(...items);
	}

	/** Updates the machine-readable state and its announced message. */
	private setState(state: SpeechState, message?: string): void {
		this.dataset.state = state;
		const liteButton = this.querySelector('[data-action="toggle-speech"]');
		liteButton?.setAttribute(
			"name",
			state === "idle" ? "speakerphone" : "speakerphone-off",
		);
		liteButton?.setAttribute("label", state === "idle" ? "Speak" : "Stop");
		const status = this.querySelector<HTMLElement>('[data-role="status"]');
		if (status !== null)
			status.textContent =
				message ??
				{ idle: "Ready.", speaking: "Speaking.", paused: "Paused." }[state];
	}

	/** Resolves an explicit voice name or locale, otherwise leaves the browser default. */
	private async selectVoice(
		synthesis: SpeechSynthesis,
	): Promise<SpeechSynthesisVoice | null> {
		const voices = await this.loadVoices(synthesis);
		const requested = this.voice.trim().toLowerCase();
		return (
			voices.find((voice) => voice.name.toLowerCase() === requested) ??
			voices.find((voice) => voice.lang.toLowerCase() === requested) ??
			null
		);
	}

	/** Waits for browsers that populate their voice list asynchronously. */
	private async loadVoices(
		synthesis: SpeechSynthesis,
	): Promise<SpeechSynthesisVoice[]> {
		const available = synthesis.getVoices();
		if (available.length > 0) return available;
		return await new Promise((resolve) => {
			const handleVoicesChanged = (): void => {
				const voices = synthesis.getVoices();
				if (voices.length === 0) return;
				synthesis.removeEventListener("voiceschanged", handleVoicesChanged);
				resolve(voices);
			};
			synthesis.addEventListener("voiceschanged", handleVoicesChanged);
		});
	}

	/** Uses the window that owns the component and its user activation. */
	private getSpeechGlobals(): SpeechGlobals {
		return (this.ownerDocument.defaultView ?? globalThis) as SpeechGlobals;
	}

	/** Reads a finite numeric attribute within an accepted range. */
	private numberAttribute(
		name: string,
		fallback: number,
		minimum: number,
		maximum: number,
	): number {
		const attribute = this.getAttribute(name);
		if (attribute === null || attribute.trim() === "") return fallback;
		const value = Number(attribute);
		return Number.isFinite(value) && value >= minimum && value <= maximum
			? value
			: fallback;
	}

	/** Displays and emits a component error. */
	private reportError(error: string): void {
		this.setState("idle", `Error: ${error}`);
		this.emit("tp-text-to-speech-error", { error });
	}

	/** Emits a bubbling component event. */
	private emit(name: string, detail: object): void {
		this.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
	}
}

// Guard registration so repeated imports and development reloads do not redefine the tag.
if (!customElements.get("tp-text-to-speech"))
	customElements.define("tp-text-to-speech", TpTextToSpeech);

// Teach TypeScript which concrete class document.createElement() returns for this tag.
declare global {
	interface HTMLElementTagNameMap {
		"tp-text-to-speech": TpTextToSpeech;
	}
}
