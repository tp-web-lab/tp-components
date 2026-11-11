/**
 * @module components/audio-playlist
 * @summary Plays a list of audio tracks sequentially or in shuffled order.
 */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-button-group
 * @summary Button group component for organizing multiple buttons.
 */
// tp-docgen:dependencies:end

import { resolveComponentSourceUrl } from "../../utilities/source-url.js";
import { TpBase } from "../base/base.js";
import "../icon-button/icon-button.js";
import "../button-group/button-group.js";
import "../typewriting/typewriting.js";
import style from "./audio-playlist.css?inline";

/**
 * The custom `<tp-audio-playlist>` element provides an audio playlist with playback controls and an elapsed-time seek bar.
 *
 * @summary Provides an audio playlist with playback controls and an elapsed-time seek bar.
 * @tagname tp-audio-playlist
 * @attr {boolean} random = false - Shuffle tracks without repetition; changing this attribute preserves the current track.
 * @attr {string} src = "" - HTML file containing a ul or ol playlist; overrides inline content. Track URLs resolve relative to the file.
 * @example
 * <tp-audio-playlist>
 * <ol>
 * <li>
 * <a href="/docs/components/audio-playlist/examples/track-1.wav">Morning melody</a>
 * </li>
 * <li>
 * <a href="/docs/components/audio-playlist/examples/track-2.wav">Evening melody</a>
 * </li>
 * </ol>
 * </tp-audio-playlist>
 *  @accessibility Preserves list semantics and keyboard-operable track links, marks the current track with aria-current, and announces status changes.
 * @accessibilityresponsibility Supply meaningful track titles and transcripts for spoken content.
 */
export class TpAudioPlaylist extends TpBase {
	public static override get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "random", "src"];
	}
	private audio: HTMLAudioElement | null = null;
	private status: HTMLElement | null = null;
	private transport: HTMLElement | null = null;
	private playback: HTMLElement | null = null;
	private muteButton: HTMLElement | null = null;
	private position: HTMLInputElement | null = null;
	private volumeControl: HTMLInputElement | null = null;
	private timeLabel: HTMLElement | null = null;
	private trackTitle: HTMLElement | null = null;
	private modes: HTMLElement[] = [];
	private previous: HTMLElement | null = null;
	private next: HTMLElement | null = null;
	private tracks: HTMLAnchorElement[] = [];
	private order: HTMLAnchorElement[] = [];
	private current: HTMLAnchorElement | null = null;
	private generation = 0;
	private remoteList: HTMLElement | null = null;
	private request: AbortController | null = null;
	private sourceGeneration = 0;
	private loading = false;
	private hiddenLists = new Map<HTMLElement, HTMLElement["hidden"]>();
	private observer = new MutationObserver((records) => {
		if (
			records.some((record) => {
				const target =
					record.target instanceof Element
						? record.target
						: record.target.parentElement;
				return (
					!!target?.closest("ul, ol") ||
					(record.target === this &&
						[...record.addedNodes, ...record.removedNodes].some(
							(node) => node instanceof Element && node.matches("ul, ol"),
						))
				);
			})
		) {
			this.syncInlineVisibility();
			this.refresh();
		}
	});
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}
	public set src(value: string) {
		this.setAttribute("src", value);
	}
	private syncInlineVisibility(): void {
		for (const list of this.querySelectorAll<HTMLElement>(
			":scope > ul, :scope > ol",
		)) {
			if (list === this.remoteList) continue;
			if (this.src.trim()) {
				if (!this.hiddenLists.has(list))
					this.hiddenLists.set(list, list.hidden);
				list.hidden = true;
			}
		}
		if (!this.src.trim()) {
			for (const [list, hidden] of this.hiddenLists) list.hidden = hidden;
			this.hiddenLists.clear();
		}
	}
	private async loadSource(): Promise<void> {
		this.request?.abort();
		const generation = ++this.sourceGeneration;
		this.remoteList?.remove();
		this.remoteList = null;
		this.loading = false;
		this.syncInlineVisibility();
		if (!this.src.trim()) {
			this.refresh();
			return;
		}
		this.tracks = [];
		this.order = [];
		this.select(null, false);
		this.loading = true;
		this.message("Loading playlist…");
		const controller = new AbortController();
		this.request = controller;
		try {
			const url = resolveComponentSourceUrl(this, this.src.trim());
			const response = await fetch(url.href, { signal: controller.signal });
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const text = await response.text();
			if (generation !== this.sourceGeneration || !this.isConnected) return;
			const document = new DOMParser().parseFromString(text, "text/html");
			const source = document.querySelector("ul, ol");
			if (!source) throw new Error("Expected a ul or ol list");
			const list = this.ownerDocument.createElement(source.localName);
			for (const item of source.querySelectorAll(":scope > li")) {
				const link = item.querySelector("a[href]");
				const href = link?.getAttribute("href")?.trim();
				if (!href) continue;
				const trackUrl = new URL(href, response.url || url.href);
				if (!["http:", "https:", "file:", "blob:"].includes(trackUrl.protocol))
					continue;
				const li = this.ownerDocument.createElement("li");
				const a = this.ownerDocument.createElement("a");
				a.href = trackUrl.href;
				a.textContent = link?.textContent?.trim() || "Audio track";
				li.append(a);
				list.append(li);
			}
			this.remoteList = list;
			this.loading = false;
			this.append(list);
			this.refresh();
		} catch {
			if (generation !== this.sourceGeneration || !this.isConnected) return;
			this.loading = false;
			this.message(
				"Unable to load playlist. Check src and provide an HTML ul or ol list.",
			);
		}
	}

	private onClick = (event: MouseEvent): void => {
		const target =
			event.target instanceof Element ? event.target.closest("a") : null;
		if (!(target instanceof HTMLAnchorElement) || !this.tracks.includes(target))
			return;
		if (
			event.button !== 0 ||
			event.ctrlKey ||
			event.metaKey ||
			event.shiftKey ||
			event.altKey
		)
			return;
		event.preventDefault();
		this.select(target, true);
	};
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-audio-playlist-styles", style);
		if (!this.audio) this.render();
		void this.loadSource();
		this.addEventListener("click", this.onClick);
		this.observer.observe(this, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: true,
			attributeFilter: ["href"],
		});
	}
	public disconnectedCallback(): void {
		this.sourceGeneration++;
		this.request?.abort();
		this.observer.disconnect();
		this.removeEventListener("click", this.onClick);
		this.generation++;
		this.audio?.pause();
	}
	protected attributeChangedCallback(name: string): void {
		if (name === "src" && this.audio && this.isConnected)
			void this.loadSource();
		if (name === "random" && this.audio) {
			this.reorder();
			this.update();
		}
	}
	private render(): void {
		const controls = document.createElement("div");
		controls.className = "tp-audio-playlist-controls";
		const group = document.createElement("tp-button-group");
		group.dataset.helpGroup = "Playlist";
		group.setAttribute("stretch", "");
		for (const [label, random] of [
			["Play", false],
			["Random", true],
		] as const) {
			const mode = document.createElement("tp-icon-button");
			mode.setAttribute("label", label);
			mode.setAttribute("name", random ? "shuffle" : "play");
			mode.dataset.helpDescription = random
				? "Start a new shuffled playlist without repeating tracks."
				: "Start the playlist from the first track in list order.";
			mode.addEventListener("click", () => {
				if (!this.tracks.length) return;
				this.current = null;
				this.toggleAttribute("random", random);
				this.reorder();
				this.select(this.order[0] ?? null, true);
			});
			this.modes.push(mode);
			group.append(mode);
		}
		const button = (label: string, offset: number): HTMLElement => {
			const element = document.createElement("tp-icon-button");
			element.setAttribute("label", label);
			element.setAttribute("name", offset < 0 ? "previous" : "next");
			element.dataset.helpDescription = `Play the ${label.toLowerCase()} track in the current order.`;
			element.addEventListener("click", () => this.move(offset));
			group.append(element);
			return element;
		};
		this.previous = button("Previous", -1);
		this.next = button("Next", 1);
		const [play, random] = this.modes;
		if (play && random)
			group.replaceChildren(this.previous, play, this.next, random);
		this.audio = document.createElement("audio");
		this.audio.controls = false;
		this.audio.hidden = true;
		this.audio.preload = "metadata";
		this.audio.setAttribute("aria-label", "Playlist audio");
		this.audio.addEventListener("ended", () => {
			if (
				this.order.indexOf(this.current as HTMLAnchorElement) <
				this.order.length - 1
			)
				this.move(1);
			else this.message("Playlist finished. Select a track to play again.");
		});
		this.audio.addEventListener("error", () =>
			this.message(
				"Unable to load this track. Select another track or try again.",
			),
		);
		this.status = document.createElement("p");
		this.status.setAttribute("role", "status");
		this.trackTitle = document.createElement("tp-typewriting");
		this.trackTitle.setAttribute("loop", "");
		this.trackTitle.setAttribute("delay", "1500");
		controls.append(
			group,
			this.audio,
			this.renderTransport(),
			this.trackTitle,
			this.status,
		);
		this.prepend(controls);
	}
	private renderTransport(): HTMLElement {
		const transport = document.createElement("div");
		transport.className = "tp-audio-playlist-transport";
		transport.dataset.helpGroup = "Audio player";
		this.transport = transport;
		const playback = document.createElement("tp-icon-button");
		this.playback = playback;
		playback.dataset.helpDescription = "Pause or resume the current track.";
		playback.addEventListener("click", () => {
			if (!this.audio || !this.current) return;
			if (!this.audio.paused) this.audio.pause();
			else {
				const generation = this.generation;
				void this.audio.play().catch(() => {
					if (generation === this.generation && this.isConnected)
						this.message("Playback could not start. Try again.");
				});
			}
		});
		this.timeLabel = document.createElement("span");
		this.timeLabel.className = "tp-audio-playlist-time";
		const position = document.createElement("input");
		position.type = "range";
		position.min = "0";
		position.max = "100";
		position.step = "0.1";
		position.value = "0";
		position.className = "tp-audio-playlist-position";
		position.setAttribute("aria-label", "Playback position");
		position.addEventListener("input", () => {
			if (!this.audio || position.disabled) return;
			this.audio.currentTime = Number(position.value);
			this.updateTransport();
		});
		this.position = position;
		const mute = document.createElement("tp-icon-button");
		mute.dataset.helpDescription = "Mute or restore the sound.";
		mute.addEventListener("click", () => {
			if (this.audio) this.audio.muted = !this.audio.muted;
			this.updateTransport();
		});
		this.muteButton = mute;
		const volume = document.createElement("input");
		volume.type = "range";
		volume.min = "0";
		volume.max = "1";
		volume.step = "0.05";
		volume.value = "1";
		volume.className = "tp-audio-playlist-volume";
		volume.setAttribute("aria-label", "Volume");
		volume.addEventListener("input", () => {
			if (!this.audio) return;
			this.audio.volume = Number(volume.value);
			this.audio.muted = false;
			this.updateTransport();
		});
		this.volumeControl = volume;
		for (const event of [
			"timeupdate",
			"loadedmetadata",
			"durationchange",
			"emptied",
			"play",
			"pause",
			"ended",
			"volumechange",
		])
			this.audio?.addEventListener(event, () => this.updateTransport());
		transport.append(playback, this.timeLabel, position, mute, volume);
		return transport;
	}
	private updateTransport(): void {
		const audio = this.audio;
		if (!audio || !this.position) return;
		const duration =
			Number.isFinite(audio.duration) && audio.duration > 0
				? audio.duration
				: 0;
		const time = duration
			? Math.max(0, Math.min(audio.currentTime, duration))
			: 0;
		const format = (seconds: number): string =>
			`${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
		this.position.disabled = !duration || !this.current;
		this.position.max = String(duration || 100);
		this.position.value = String(time);
		this.position.style.setProperty(
			"--tp-audio-playlist-progress",
			`${duration ? (time / duration) * 100 : 0}%`,
		);
		this.position.setAttribute(
			"aria-valuetext",
			`${format(time)} / ${duration ? format(duration) : "--:--"}`,
		);
		if (this.timeLabel)
			this.timeLabel.textContent = `${format(time)} / ${duration ? format(duration) : "--:--"}`;
		this.playback?.setAttribute("name", audio.paused ? "play" : "pause");
		this.playback?.setAttribute("label", audio.paused ? "Resume" : "Pause");
		this.playback?.toggleAttribute("disabled", !this.current);
		this.muteButton?.setAttribute(
			"name",
			audio.muted || !audio.volume ? "volume-off" : "volume-high",
		);
		this.muteButton?.setAttribute("label", audio.muted ? "Unmute" : "Mute");
		if (this.volumeControl) {
			this.volumeControl.value = String(audio.muted ? 0 : audio.volume);
			this.volumeControl.style.setProperty(
				"--tp-audio-playlist-progress",
				`${audio.muted ? 0 : audio.volume * 100}%`,
			);
		}
		if (this.transport) this.transport.hidden = !this.current;
	}

	private refresh(): void {
		if (this.loading) return;
		const list = this.src.trim()
			? this.remoteList
			: this.querySelector(":scope > ul, :scope > ol");
		if (this.src.trim() && !list) return;
		const tracks = list
			? Array.from(
					list.querySelectorAll<HTMLAnchorElement>(":scope > li a[href]"),
				)
					.filter((a) => a.getAttribute("href")?.trim())
					.filter(
						(a, i, all) =>
							all.findIndex((b) => b.closest("li") === a.closest("li")) === i,
					)
			: [];
		const changed =
			tracks.length !== this.tracks.length ||
			tracks.some((a, i) => a !== this.tracks[i]);
		for (const old of this.tracks)
			if (!tracks.includes(old)) old.removeAttribute("aria-current");
		this.tracks = tracks;
		if (changed) this.reorder();
		if (!this.current || !tracks.includes(this.current))
			this.select(this.order[0] ?? null, false);
		else if (this.audio?.getAttribute("src") !== this.current.href)
			this.select(this.current, false);
		this.update();
	}
	private reorder(): void {
		this.order = [...this.tracks];
		if (this.hasAttribute("random")) {
			for (let i = this.order.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				const a = this.order[i];
				const b = this.order[j];
				if (a && b) {
					this.order[i] = b;
					this.order[j] = a;
				}
			}
			if (this.current && this.order.includes(this.current))
				this.order = [
					this.current,
					...this.order.filter((a) => a !== this.current),
				];
		}
	}
	private move(offset: number): void {
		const index = this.current ? this.order.indexOf(this.current) : -1;
		const track = this.order[index + offset];
		if (track) this.select(track, true);
	}
	private select(track: HTMLAnchorElement | null, play: boolean): void {
		if (!this.audio) return;
		const generation = ++this.generation;
		this.audio.pause();
		// Empty the previous resource before assigning the next one so native
		// controls discard its duration, buffered ranges and seek position.
		this.audio.removeAttribute("src");
		this.audio.load();
		this.audio.currentTime = 0;
		this.current = track;
		if (track) {
			this.audio.src = track.href;
			this.message("");
		} else {
			this.audio.removeAttribute("src");
			this.message("No audio tracks. Add a list of links to audio files.");
		}
		this.audio.load();
		this.update();
		if (play && track)
			void this.audio.play().catch(() => {
				if (generation === this.generation && this.isConnected)
					this.message("Playback could not start. Use Resume to retry.");
			});
	}
	private message(text: string): void {
		if (this.status && this.status.textContent !== text) {
			this.status.textContent = text;
			this.status.hidden = !text;
		}
	}
	private update(): void {
		for (const track of this.tracks) {
			if (track === this.current) track.setAttribute("aria-current", "true");
			else track.removeAttribute("aria-current");
		}
		const title = this.current
			? `${this.tracks.indexOf(this.current) + 1}. ${this.current.textContent?.trim() || "Audio track"}`
			: "";
		if (this.trackTitle && this.trackTitle.textContent !== title)
			this.trackTitle.textContent = title;
		for (const [index, mode] of this.modes.entries()) {
			mode.toggleAttribute("disabled", !this.tracks.length);
			mode.setAttribute(
				"variant",
				this.hasAttribute("random") === (index === 1) ? "brand" : "neutral",
			);
		}
		const index = this.current ? this.order.indexOf(this.current) : -1;
		this.previous?.toggleAttribute("disabled", index <= 0);
		this.next?.toggleAttribute(
			"disabled",
			index < 0 || index >= this.order.length - 1,
		);
		this.updateTransport();
	}
}
if (!customElements.get("tp-audio-playlist"))
	customElements.define("tp-audio-playlist", TpAudioPlaylist);
