/**
 * @module components/save-audio
 * @summary Downloads an anchored audio as MP3, OGG or WAV.
 */

// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-dropdown
 * @summary Dropdown menu component.
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

import { TpBase } from "../base/base.js";
import {
	isTpSizeType,
	isTpVariantType,
	type TpSizeType,
	type TpVariantType,
} from "../base/base.types.js";
import type { TpDropdown } from "../dropdown/dropdown.js";
import style from "./save-audio.css?inline";
import "../dropdown/dropdown.js";
import "../icon-button/icon-button.js";
import "../icon/icon.js";

export type TpSaveAudioFormat = "mp3" | "ogg" | "wav";

export interface AudioSaveTarget {
	saveAudio(format: TpSaveAudioFormat, filename: string): Promise<boolean>;
}

function isSaveAudioFormat(value: string): value is TpSaveAudioFormat {
	return value === "mp3" || value === "ogg" || value === "wav";
}

/**
 * Audio download controller with an embedded dropdown.
 *
 * @summary Saves audio from an associated component in several formats.
 * @tagname tp-save-audio
 * @attr {"mp3" | "ogg" | "wav"} format = "mp3" - Initially selected audio format.
 * @attr {string} anchor = "" - CSS selector of a component implementing saveAudio(format, filename).
 * @attr {string} name = "file-download" - Icon used by the trigger.
 * @attr {string} filename = "audio" - Download filename without its extension.
 * @attr {string} variant = "neutral" - Icon button variant.
 * @attr {string} size = "m" - Icon button size.
 * @attr {boolean} disabled = false - Disables the trigger.
 * @event tp-save-audio-save Emitted after an audio file has been saved.
 * @eventdetail tp-save-audio-save { format: "mp3" | "ogg" | "wav"; filename: string; anchor: string; target: Element }
 * @event tp-save-audio-error Emitted when the target cannot be exported.
 * @eventdetail tp-save-audio-error { format: "mp3" | "ogg" | "wav"; error: unknown; anchor: string }
 * @example
 * <p>Audio saving is reserved for a future integration. No audio provider is currently connected.</p>
 * <tp-save-audio disabled></tp-save-audio>
 */
export class TpSaveAudio extends TpBase {
	private static readonly styleId = "tp-save-audio-styles";
	private static nextId = 0;
	private dropdownEl: TpDropdown | null = null;
	public target: AudioSaveTarget | null = null;
	private saving = false;
	public get format(): TpSaveAudioFormat {
		const value = this.getAttribute("format") ?? "mp3";
		return isSaveAudioFormat(value) ? value : "mp3";
	}
	public set format(value: TpSaveAudioFormat) {
		this.setAttribute("format", value);
	}

	public static get observedAttributes(): string[] {
		return [
			"format",
			"anchor",
			"name",
			"filename",
			"variant",
			"size",
			"disabled",
		];
	}

	public get anchor(): string {
		return this.getAttribute("anchor") ?? "";
	}
	public set anchor(value: string) {
		this.setAttribute("anchor", value);
	}
	public get name(): string {
		return this.getAttribute("name")?.trim() || "file-download";
	}
	public set name(value: string) {
		this.setAttribute("name", value);
	}
	public get filename(): string {
		return this.getAttribute("filename")?.trim() || "audio";
	}
	public set filename(value: string) {
		this.setAttribute("filename", value);
	}
	public get variant(): TpVariantType {
		const value = this.getAttribute("variant") ?? "neutral";
		return isTpVariantType(value) ? value : "neutral";
	}
	public set variant(value: TpVariantType) {
		this.setAttribute("variant", value);
	}
	public get size(): TpSizeType {
		const value = this.getAttribute("size") ?? "m";
		return isTpSizeType(value) ? value : "m";
	}
	public set size(value: TpSizeType) {
		this.setAttribute("size", value);
	}
	public get disabled(): boolean {
		return this.hasAttribute("disabled");
	}
	public set disabled(value: boolean) {
		this.toggleAttribute("disabled", value);
	}

	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle(TpSaveAudio.styleId, style);
		this.ensureControl();
	}

	protected attributeChangedCallback(): void {
		if (this.isConnected) this.ensureControl();
	}

	public async save(format: TpSaveAudioFormat = this.format): Promise<void> {
		if (this.disabled || this.saving) return;
		if (!isSaveAudioFormat(format))
			throw new TypeError(`Unsupported audio format: ${format}`);
		this.saving = true;
		this.ensureControl();
		this.dropdownEl?.hide();
		try {
			const target = this.target ?? this.resolveTarget();
			if (
				!target ||
				!("saveAudio" in target) ||
				typeof target.saveAudio !== "function"
			)
				throw new TypeError(
					"The audio target must implement saveAudio(format, filename).",
				);
			const saved = await target.saveAudio(format, this.safeFilename());
			if (!saved) return;
			this.format = format;
			this.dispatchEvent(
				new CustomEvent("tp-save-audio-save", {
					bubbles: true,
					composed: true,
					detail: {
						format,
						filename: `${this.safeFilename()}.${format}`,
						anchor: this.anchor,
						target,
					},
				}),
			);
		} catch (error) {
			this.dispatchEvent(
				new CustomEvent("tp-save-audio-error", {
					bubbles: true,
					composed: true,
					detail: { format, error, anchor: this.anchor },
				}),
			);
			throw error;
		} finally {
			this.saving = false;
			this.ensureControl();
		}
	}

	private ensureControl(): void {
		let trigger = this.querySelector<HTMLElement>(":scope > tp-icon-button");
		if (!trigger) {
			trigger = document.createElement("tp-icon-button");
			this.prepend(trigger);
		}
		if (trigger.id === "") {
			TpSaveAudio.nextId += 1;
			trigger.id = `tp-save-audio-trigger-${TpSaveAudio.nextId}`;
		}
		trigger.setAttribute("name", this.name);
		trigger.setAttribute("label", "Save audio");
		trigger.setAttribute(
			"data-help-description",
			"Choose MP3, OGG or WAV and save the audio file.",
		);
		trigger.setAttribute("aria-haspopup", "menu");
		trigger.setAttribute("variant", this.variant);
		trigger.setAttribute("size", this.size);
		trigger.toggleAttribute("disabled", this.disabled || this.saving);
		trigger.removeEventListener("click", this.handleTriggerClick);
		trigger.addEventListener("click", this.handleTriggerClick);
		let dropdown = this.querySelector<TpDropdown>(":scope > tp-dropdown");
		if (!(dropdown instanceof HTMLElement)) {
			dropdown = document.createElement("tp-dropdown") as TpDropdown;
			this.append(dropdown);
		}
		dropdown.setAttribute("anchor", `#${trigger.id}`);
		dropdown.setAttribute("placement", "bottom");
		dropdown.setAttribute("outside-click", "");
		if (!dropdown.querySelector("[data-format]")) {
			const menu = document.createElement("ul");
			menu.setAttribute("role", "menu");
			for (const format of ["mp3", "ogg", "wav"] as const) {
				const item = document.createElement("li");
				item.dataset.format = format;
				item.setAttribute("role", "menuitem");
				item.tabIndex = 0;
				const check = document.createElement("tp-icon");
				check.setAttribute("name", "check");
				check.setAttribute("aria-hidden", "true");
				const label = document.createElement("span");
				label.textContent = format.toUpperCase();
				item.append(check, label);
				item.addEventListener("click", () => {
					void this.save(format).catch(() => undefined);
				});
				item.addEventListener("keydown", (event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						void this.save(format).catch(() => undefined);
					}
				});
				menu.append(item);
			}
			dropdown.append(menu);
		}
		dropdown.id ||= `${trigger.id}-menu`;
		trigger.setAttribute("aria-controls", dropdown.id);
		trigger.setAttribute("aria-expanded", String(dropdown.open));
		dropdown.addEventListener("tp-dropdown-toggle", this.syncExpanded);
		this.dropdownEl = dropdown;
		this.syncCurrentFormat();
	}

	private readonly syncExpanded = (): void => {
		this.querySelector(":scope > tp-icon-button")?.setAttribute(
			"aria-expanded",
			String(this.dropdownEl?.open ?? false),
		);
	};
	private syncCurrentFormat(): void {
		for (const item of this.querySelectorAll<HTMLElement>("[data-format]")) {
			if (item.dataset.format === this.format)
				item.setAttribute("aria-current", "true");
			else item.removeAttribute("aria-current");
		}
	}

	private readonly handleTriggerClick = (): void => {
		if (!this.disabled && !this.saving) this.dropdownEl?.toggle();
	};

	private resolveTarget(): Element | null {
		if (this.anchor.trim() === "") return null;
		try {
			return this.ownerDocument.querySelector(this.anchor);
		} catch {
			return null;
		}
	}

	private safeFilename(): string {
		return (
			this.filename
				.replace(/\.(mp3|ogg|wav)$/i, "")
				.replace(/[^a-z0-9._-]+/gi, "-")
				.replace(/^-+|-+$/g, "") || "audio"
		);
	}
}

if (!customElements.get("tp-save-audio"))
	customElements.define("tp-save-audio", TpSaveAudio);

declare global {
	interface HTMLElementTagNameMap {
		"tp-save-audio": TpSaveAudio;
	}
}
