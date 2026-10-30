/** @module components/slope-simulator */
// tp-docgen:dependencies:start
/**
 * @tp-dependency tp-badge
 * @summary Badge component for compact status labels.
 */
/**
 * @tp-dependency tp-base
 * @summary Shared base class for tp-* components.
 */
/**
 * @tp-dependency tp-button
 * @summary Button component that supports native button and link rendering.
 */
/**
 * @tp-dependency tp-code-editor
 * @summary CodeMirror-based code editor component.
 */
/**
 * @tp-dependency tp-icon-button
 * @summary Accessible icon button component.
 */
/**
 * @tp-dependency tp-numberfield
 * @summary Numeric field with an optional native range slider.
 */
/**
 * @tp-dependency tp-radio-list
 * @summary Transforms a list into a group of radio buttons.
 */
// tp-docgen:dependencies:end

import { TpDeclarativeTextSource } from "../../utilities/declarative-text-source.js";
import {
	type NormalizedProfile,
	parseProfiles,
	type TpSlopeProfiles,
} from "./profiles.js";

export type { TpSlopeProfile, TpSlopeProfiles } from "./profiles.js";

import { TpBase } from "../base/base.js";
import "../numberfield/numberfield.js";
import "../radio-list/radio-list.js";
import "../button/button.js";
import "../badge/badge.js";
import "../code-editor/code-editor.js";
import "../icon-button/icon-button.js";
import "../graph-geometry/geometry-actions.js";
import {
	chooseSaveTarget,
	saveBlob,
	type TpSaveTarget,
} from "../../utilities/save-file.js";
import type { TpDropdown } from "../dropdown/dropdown.js";
import { choosePlaygroundFile } from "../playground/playground-local-file.js";
import { advance, profiles, sample, type Terrain } from "./motion.js";
import style from "./slope-simulator.css?inline";

/**
 * @summary Explore how uphill and downhill gradients change the effort needed to move a point.
 * @tagname tp-slope-simulator
 * @attr {string} src = "" - JSON file containing cycling profiles; takes precedence over the inline script.
 * @attr {number} speed-base = 30 - Fictional flat-ground speed in km/h; a positive attribute overrides the optional JSON speed-base.
 * @event tp-slope-simulator-error Fired when a profile source fails validation or loading; detail contains message.
 * @keyboard ArrowLeft / ArrowRight Move the focused point with slope-dependent effort.
 * @keyboard Escape End the current drag.
 * @keyboard F1 Toggle the toolbar while editing profile JSON.
 * @example
 * <tp-slope-simulator></tp-slope-simulator>
 * @accessibility Represents each movable point as a labelled horizontal slider with current value and descriptive value text; Left and Right arrows provide a keyboard alternative to dragging.
 * @accessibility Hides decorative route SVGs, labels the profile editor and controls, exposes the grid toggle state with aria-pressed and reports source failures in an alert region.
 * @accessibilityresponsibility Provide clear profile labels and units, and a textual explanation of the route and effort relationship so the lesson does not depend only on the visual curve.
 */
export class TpSlopeSimulator extends TpBase {
	private ui?: HTMLDivElement;
	private source = new TpDeclarativeTextSource(this, {
		scriptTypes: ["tp/slope-simulator"],
		ignoreSelector: ".tp-slope-ui",
	});
	private available: NormalizedProfile[] = this.defaults();
	private originals: NormalizedProfile[] = [];
	private drafts: string[] = [];
	private static nextFileId = 0;
	private readonly fileId = `tp-slope-files-${TpSlopeSimulator.nextFileId++}`;
	private fileBusy = false;
	private fileRequest?: AbortController;
	private saveTargets = new Map<number, TpSaveTarget>();
	private token = 0;
	private abort?: AbortController;
	private programmatic = false;
	public static get observedAttributes(): string[] {
		return [...TpBase.observedAttributes, "src", "speed-base"];
	}
	/** External JSON source. Empty src restores inline profiles or defaults. */
	public get src(): string {
		return this.getAttribute("src") ?? "";
	}
	public set src(value: string) {
		this.setAttribute("src", value);
	}
	/** Effective fictional speed on flat ground, in km/h. */
	public get speedBase(): number {
		const value = Number(this.getAttribute("speed-base"));
		return Number.isFinite(value) && value > 0
			? value
			: (this.available[this.profile]?.speedBase ?? 30);
	}
	public set speedBase(value: number) {
		this.setAttribute("speed-base", String(value));
	}
	public attributeChangedCallback(
		name: string,
		old: string | null,
		value: string | null,
	): void {
		if (name === "speed-base" && old !== value) {
			this.update(0);
			this.update(1);
		}
		if (name === "src" && old !== value && this.isConnected && this.ui) {
			this.programmatic = false;
			this.watchSource();
		}
	}
	/** Replace profiles atomically. Returns false and emits an error for invalid data. */
	public setProfiles(data: TpSlopeProfiles | string): boolean {
		try {
			const next = parseProfiles(data);
			this.stopLoading();
			this.source.disconnect();
			this.programmatic = true;
			this.applyProfiles(next);
			return true;
		} catch (error) {
			this.reportError(error);
			return false;
		}
	}
	private defaults(): NormalizedProfile[] {
		return parseProfiles({
			profiles: profiles.map((p, i) => ({
				id: `default-${i + 1}`,
				name: p.name,
				points: p.points.map(([x, h]) => [
					Number((x * 100).toFixed(8)),
					Number((h * 100000).toFixed(8)),
				]),
			})),
		});
	}
	private stopLoading(): void {
		this.token++;
		this.abort?.abort();
		this.fileRequest?.abort();
	}
	private watchSource(): void {
		this.source.disconnect();
		this.source.observe(() => {
			void this.reloadProfiles();
		});
		void this.reloadProfiles();
	}
	private async reloadProfiles(): Promise<void> {
		this.stopLoading();
		const token = this.token;
		this.abort = new AbortController();
		try {
			const text = await this.source.read({ signal: this.abort.signal });
			if (token !== this.token) return;
			this.applyProfiles(
				this.src.trim() || text.trim() ? parseProfiles(text) : this.defaults(),
			);
		} catch (error) {
			if (token === this.token) this.reportError(error);
		}
	}
	private applyProfiles(next: NormalizedProfile[]): void {
		this.finish();
		this.available = next;
		this.originals = [...next];
		this.saveTargets.clear();
		this.drafts = next.map((p) => this.profileCode(p));
		this.profile = 0;
		this.positions[1] = 0.1;
		this.directions[1] = 1;
		this.refreshChoices();
		this.syncEditor();
		const alert = this.ui?.querySelector<HTMLElement>("[data-source-error]");
		if (alert) {
			alert.textContent = "";
			alert.hidden = true;
		}
		this.update(0);
		this.update(1);
	}
	private refreshChoices(): void {
		const old = this.ui?.querySelector("[data-profile-choices]");
		if (old) {
			const radio = document.createElement("tp-radio-list");
			radio.setAttribute("label", "Stage profile");
			radio.setAttribute("orientation", "horizontal");
			radio.setAttribute("value", String(this.profile + 1));
			const list = document.createElement("ul");
			for (const profile of this.available) {
				const item = document.createElement("li");
				item.textContent = profile.name;
				list.append(item);
			}
			radio.append(list);
			if (this.available.length === 1) {
				const label = document.createElement("p");
				label.textContent = `Stage profile: ${this.available[0]?.name}`;
				old.replaceChildren(label);
			} else old.replaceChildren(radio);
		}
	}
	private profileCode(profile: NormalizedProfile): string {
		const p = profile.source;
		return `{
${profile.speedBase === undefined ? "" : `  "speed-base": ${profile.speedBase},\n`}  "profiles": [{
    "id": ${JSON.stringify(p.id)},
    "name": ${JSON.stringify(p.name)},
    "points": [
${p.points.map((point) => `      ${JSON.stringify(point)}`).join(",\n")}
    ]
  }]
}`;
	}
	private syncEditor(): void {
		const editor = this.ui?.querySelector("tp-code-editor");
		if (editor) editor.setValue(this.drafts[this.profile] ?? "");
	}
	private editProfile(reset: boolean): void {
		const editor = this.ui?.querySelector("tp-code-editor");
		if (!editor) return;
		try {
			let next: NormalizedProfile | undefined;
			if (reset) next = this.originals[this.profile];
			else {
				const text = editor.getValue();
				this.drafts[this.profile] = text;
				const parsed = parseProfiles(text);
				if (parsed.length > 1) {
					this.stopLoading();
					this.source.disconnect();
					this.programmatic = true;
					this.applyProfiles(parsed);
					return;
				}
				next = parsed[0];
			}
			if (!next) return;
			if (
				this.available.some((p, i) => i !== this.profile && p.id === next?.id)
			)
				throw new Error(`Duplicate profile id: ${next.id}.`);
			this.stopLoading();
			this.source.disconnect();
			this.programmatic = true;
			this.finish();
			this.available[this.profile] = next;
			this.drafts[this.profile] = this.profileCode(next);
			this.positions[1] = 0.1;
			this.directions[1] = 1;
			this.refreshChoices();
			this.syncEditor();
			this.update(0);
			this.update(1);
			const alert = this.ui?.querySelector<HTMLElement>("[data-source-error]");
			if (alert) {
				alert.textContent = "";
				alert.hidden = true;
			}
		} catch (error) {
			this.reportError(error);
		}
	}

	private async profileFileAction(
		action: "load" | "save" | "save-as",
	): Promise<void> {
		if (this.fileBusy) return;
		const editor = this.ui?.querySelector("tp-code-editor");
		if (!editor) return;
		this.fileBusy = true;
		this.syncFileButtons();
		const token = this.token;
		const selected = this.profile;
		const draft = editor.getValue();
		try {
			if (action === "load") {
				const controller = new AbortController();
				this.fileRequest = controller;
				const file = await choosePlaygroundFile(
					this,
					".json,application/json",
					controller.signal,
				);
				if (!file) return;
				const text = await file.text();
				if (
					controller.signal.aborted ||
					!this.isConnected ||
					token !== this.token ||
					selected !== this.profile ||
					draft !== editor.getValue()
				)
					return;
				this.setProfiles(text);
			} else {
				const id = this.available[selected]?.id ?? "profile";
				const filename = id.replace(/[^a-zA-Z0-9_-]/g, "-") || "profile";
				const target =
					(action === "save" && this.saveTargets.get(selected)) ||
					(await chooseSaveTarget({
						suggestedName: `${filename}.json`,
						description: "Cycling profile",
						mimeType: "application/json",
						extension: ".json",
					}));
				if (
					!target ||
					!this.isConnected ||
					token !== this.token ||
					selected !== this.profile
				)
					return;
				await saveBlob(
					new Blob([draft], { type: "application/json;charset=utf-8" }),
					target,
				);
				if (token === this.token) this.saveTargets.set(selected, target);
			}
		} catch (error) {
			if (this.isConnected && token === this.token) this.reportError(error);
		} finally {
			this.fileBusy = false;
			this.syncFileButtons();
		}
	}
	private syncFileButtons(): void {
		for (const item of this.ui?.querySelectorAll<HTMLElement>(
			"[data-profile-file]",
		) ?? []) {
			item.toggleAttribute("disabled", this.fileBusy);
			item.setAttribute("aria-disabled", String(this.fileBusy));
		}
	}

	private reportError(error: unknown): void {
		const message = error instanceof Error ? error.message : String(error);
		const alert = this.ui?.querySelector<HTMLElement>("[data-source-error]");
		if (alert) {
			alert.textContent = message;
			alert.hidden = false;
		}
		this.dispatchEvent(
			new CustomEvent("tp-slope-simulator-error", {
				bubbles: true,
				detail: { message },
			}),
		);
	}
	private moving = [false, false];
	private idleTimers: (ReturnType<typeof setTimeout> | undefined)[] = [];
	private gridVisible = false;
	private slope = 0;
	private profile = 0;
	private positions = [0.1, 0.1];
	private directions = [1, 1];
	private drag?: { id: number; x: number; track: number; target: HTMLElement };
	protected override connectedCallback(): void {
		super.connectedCallback();
		this.ensureGlobalStyle("tp-slope-simulator-style", style);
		this.source.capture();
		if (this.ui) {
			if (!this.programmatic) this.watchSource();
			return;
		}
		this.ui = document.createElement("div");
		this.ui.className = "tp-slope-ui";
		this.ui.innerHTML = `<section><h3>Constant slope</h3>
   <tp-numberfield label="Slope (%)" min="-20" max="20" step="1" value="0" range clearable></tp-numberfield>
   <p>Drag the point horizontally, or focus it and press ← / →. Uphill takes more effort; downhill takes less. Release and grab again to continue.</p>
   ${this.board(0, "Point on constant slope")}</section>
   <section><div class="tp-slope-stage-heading"><h3>Cycling stage</h3><tp-icon-button library="geometry" name="grid" label="Grid" title="Show or hide distance and elevation grid" aria-pressed="false" data-profile-grid></tp-icon-button></div>
   <div data-profile-choices></div>
   <p data-elevation-note></p>
   ${this.board(1, "Point on cycling stage")}
   <p role="alert" data-source-error hidden></p>
   <details class="tp-slope-editor-details">
   <summary>Profile code</summary>
   <p>Point: [distance in km, height in m], −20% ≤ slope ≤ +20%.</p>
   <div class="tp-slope-editor-actions"><div class="tp-slope-file-menu"><tp-icon-button id="${this.fileId}" name="file-outline" label="Profile files (.json)" aria-haspopup="menu" data-profile-files></tp-icon-button><tp-dropdown anchor="#${this.fileId}" outside-click data-profile-menu><ul><li data-profile-file="load">Load (.json)</li><li data-profile-file="save">Save (.json)</li><li data-profile-file="save-as">Save as (.json)</li></ul></tp-dropdown></div><tp-icon-button library="tp" name="keyboard-f1" label="F1 — Toggle editor toolbar" title="Toggle editor toolbar (F1)" data-profile-toolbar></tp-icon-button><tp-icon-button name="refresh" label="Restore original profile" data-profile-reset></tp-icon-button><tp-icon-button name="play" label="Apply profile" data-profile-play></tp-icon-button></div>
   <tp-code-editor language="json" line-numbers word-wrap aria-label="Cycling stage profile JSON"></tp-code-editor>
   </details>
   </section>`;
		this.append(this.ui);
		this.ui.addEventListener("input", (event) => {
			const field = (event.target as Element).closest("tp-numberfield");
			if (!field) return;
			this.stopSpeed(0);
			this.slope = Number(field.value) || 0;
			this.update(0);
		});
		this.ui.addEventListener("tp-radio-list-change", () => {
			this.drafts[this.profile] =
				this.ui?.querySelector("tp-code-editor")?.getValue() ?? "";
			this.finish();
			this.profile =
				Number(this.ui?.querySelector("tp-radio-list")?.value ?? 1) - 1;
			this.positions[1] = 0.1;
			this.directions[1] = 1;
			this.update(0);
			this.update(1);
			this.syncEditor();
		});
		this.ui.addEventListener("click", (event) => {
			const target = event.target as Element;
			if (target.closest("[data-profile-grid]")) {
				this.gridVisible = !this.gridVisible;
				this.update(0);
				this.update(1);
				return;
			}
			if (target.closest("[data-profile-files]")) {
				this.ui?.querySelector<TpDropdown>("tp-dropdown")?.toggle();
				return;
			}
			if (target.closest("[data-profile-toolbar]")) {
				const editor = this.ui?.querySelector("tp-code-editor");
				if (editor) editor.toolbar = !editor.toolbar;
				return;
			}
			if (target.closest("[data-profile-play]")) {
				this.editProfile(false);
				return;
			}
			if (target.closest("[data-profile-reset]")) {
				this.editProfile(true);
				return;
			}
			const reset = (event.target as Element).closest<HTMLElement>(
				"[data-reset]",
			);
			if (!reset) return;
			this.finish();
			const track = Number(reset.dataset.reset);
			this.positions[track] = 0.1;
			this.directions[track] = 1;
			this.update(track);
		});
		for (const item of this.ui.querySelectorAll<HTMLElement>(
			"[data-profile-file]",
		)) {
			const activate = () => {
				if (item.getAttribute("aria-disabled") !== "true")
					void this.profileFileAction(
						item.dataset.profileFile as "load" | "save" | "save-as",
					);
			};
			item.addEventListener("click", activate);
			item.addEventListener("keydown", (event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					activate();
				}
			});
		}
		this.ui.addEventListener("keydown", this.key);
		this.ui.addEventListener("keyup", (event) => {
			if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
			const point = (event.target as Element).closest<HTMLElement>(
				"[data-track]",
			);
			if (point) this.stopSpeed(Number(point.dataset.track));
		});
		this.ui.addEventListener("focusout", (event) => {
			const point = (event.target as Element).closest<HTMLElement>(
				"[data-track]",
			);
			if (point) this.stopSpeed(Number(point.dataset.track));
		});
		this.ui.addEventListener("pointerdown", this.down);
		this.ui.addEventListener("pointermove", this.move);
		this.ui.addEventListener("pointerup", this.end);
		this.ui.addEventListener("pointercancel", this.end);
		this.ui.addEventListener("lostpointercapture", this.end);
		this.update(0);
		this.applyProfiles(this.available);
		if (!this.programmatic) this.watchSource();
	}
	protected disconnectedCallback(): void {
		this.stopLoading();
		this.source.disconnect();
		this.finish();
	}
	private board(track: number, label: string): string {
		return `<p class="tp-slope-speed-note" data-speed-note="${track}"></p>
   <div class="tp-slope-grade"><tp-badge size="xxl" variant="brand" data-grade="${track}"></tp-badge></div>
   <div class="tp-slope-board" data-board="${track}"><svg viewBox="0 0 1000 300" aria-hidden="true"><g class="tp-slope-grid"/><path class="tp-slope-area"/><path class="tp-slope-route"/></svg>
   <button type="button" class="tp-slope-point" data-track="${track}" role="slider" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-orientation="horizontal"></button></div>
   <div class="tp-slope-footer"><span data-status="${track}"></span><tp-button data-reset="${track}">Restart</tp-button></div>`;
	}
	private terrain(track: number): Terrain {
		return track === 0
			? [
					[0, -this.slope / 200],
					[1, this.slope / 200],
				]
			: ((this.available[this.profile] ?? this.available[0])?.points ?? [
					[0, 0],
					[1, 0],
				]);
	}
	private update(track: number): void {
		const board = this.ui?.querySelector<HTMLElement>(
			`[data-board="${track}"]`,
		);
		if (!board) return;
		const speedNote = this.ui?.querySelector(`[data-speed-note="${track}"]`);
		if (speedNote)
			speedNote.textContent = `Fictional speed calculated at constant effort, based on ${this.speedBase} km/h on flat ground (0% slope).`;
		const gridded = track === 1 && this.gridVisible;
		board
			.querySelector("svg")
			?.setAttribute("viewBox", gridded ? "-65 -10 1080 350" : "0 0 1000 300");
		const points = this.terrain(track);
		const position = this.positions[track] ?? 0.1;
		const direction = this.directions[track] ?? 1;
		const current = sample(points, position, direction);
		const highest = points.reduce((max, p) => Math.max(max, p[1]), 0);
		const scale = highest > 0 ? 230 / highest : 1912;
		const y = (altitude: number) =>
			track === 0 ? 150 - altitude * 956 : 260 - altitude * scale;
		if (track === 1) {
			const note = this.ui?.querySelector("[data-elevation-note]");
			if (note)
				note.textContent = `Elevation display scale ×${(scale / 956).toFixed(2)}. Effort uses the actual slope (maximum ±20%).`;
		}
		if (track === 1) {
			this.ui
				?.querySelector("[data-profile-grid]")
				?.setAttribute("aria-pressed", String(this.gridVisible));
			const grid = board.querySelector(".tp-slope-grid");
			if (grid) grid.innerHTML = gridded ? this.renderGrid() : "";
		}
		const path = points
			.map(([x, h], i) => `${i ? "L" : "M"}${22 + x * 956},${y(h)}`)
			.join(" ");
		board.querySelector(".tp-slope-route")?.setAttribute("d", path);
		board
			.querySelector(".tp-slope-area")
			?.setAttribute("d", `${path} L978,290 L22,290 Z`);
		const point = board.querySelector<HTMLElement>(".tp-slope-point");
		const grade = Math.round(current.grade * direction * 10) / 10;
		const signedGrade = `${grade > 0 ? "+" : grade < 0 ? "−" : ""}${Math.abs(grade).toFixed(1)}`;
		const badge = this.ui?.querySelector(`[data-grade="${track}"]`);
		const speed = this.moving[track]
			? this.speedBase / 4 ** ((current.grade * direction) / 20)
			: 0;
		if (badge)
			badge.textContent = `${signedGrade} % — ${speed.toFixed(1)} km/h`;
		const text = `${(position * 100).toFixed(1)}% of route · ${signedGrade}% slope ${direction > 0 ? "→" : "←"} · ${grade > 0 ? "Uphill" : grade < 0 ? "Downhill" : "Flat"}`;
		if (point) {
			point.style.left = `${((22 + position * 956 + (gridded ? 65 : 0)) / (gridded ? 1080 : 1000)) * 100}%`;
			point.style.top = `${((y(current.altitude) + (gridded ? 10 : 0)) / (gridded ? 350 : 300)) * 100}%`;
			point.setAttribute("aria-valuenow", (position * 100).toFixed(1));
			point.setAttribute("aria-valuetext", text);
		}
		const status = this.ui?.querySelector(`[data-status="${track}"]`);
		if (status) status.textContent = text;
	}
	/** Grid coordinates use the original kilometres and absolute elevations. */
	private renderGrid(): string {
		const source = this.available[this.profile]?.source.points;
		const first = source?.[0];
		const last = source?.at(-1);
		if (!source || !first || !last) return "";
		const low = Math.min(...source.map((p) => p[1]));
		const high = Math.max(...source.map((p) => p[1]));
		const top = high > low ? high : low + 100;
		const ticks = (min: number, max: number, count: number): number[] => {
			const raw = (max - min) / count;
			const power = 10 ** Math.floor(Math.log10(raw));
			const step =
				(raw / power <= 1
					? 1
					: raw / power <= 2
						? 2
						: raw / power <= 5
							? 5
							: 10) * power;
			const values: number[] = [];
			for (let i = Math.ceil(min / step); i <= Math.floor(max / step); i++) {
				values.push(Number((i * step).toPrecision(12)));
			}
			return values;
		};
		const x = (km: number) =>
			22 + ((km - first[0]) / (last[0] - first[0])) * 956;
		const y = (m: number) => 260 - ((m - low) / (top - low)) * 230;
		return `<path class="tp-slope-axes" d="M22,30 V260 H978"/>
			<text x="22" y="12">Height (m)</text><text x="978" y="322" text-anchor="end">Distance (km)</text>
			${ticks(first[0], last[0], 6)
				.map(
					(km) =>
						`<path d="M${x(km)},30 V260"/><text x="${x(km)}" y="285" text-anchor="middle">${km}</text>`,
				)
				.join("")}
			${ticks(low, top, 4)
				.map(
					(m) =>
						`<path d="M22,${y(m)} H978"/><text x="12" y="${y(m)}" text-anchor="end" dominant-baseline="middle">${m}</text>`,
				)
				.join("")}`;
	}
	private stopSpeed(track: number): void {
		clearTimeout(this.idleTimers[track]);
		this.idleTimers[track] = undefined;
		this.moving[track] = false;
		this.update(track);
	}
	private travel(track: number, effort: number): void {
		if (!effort) return;
		const previous = this.positions[track] ?? 0.1;
		this.directions[track] = Math.sign(effort);
		this.positions[track] = advance(
			this.terrain(track),
			this.positions[track] ?? 0.1,
			effort,
		);
		this.moving[track] = this.positions[track] !== previous;
		clearTimeout(this.idleTimers[track]);
		this.idleTimers[track] = setTimeout(() => this.stopSpeed(track), 600);
		this.update(track);
	}
	private key = (event: KeyboardEvent): void => {
		if (event.key === "Escape") {
			this.finish();
			return;
		}
		const point = (event.target as Element).closest<HTMLElement>(
			"[data-track]",
		);
		if (
			!point ||
			!["ArrowLeft", "ArrowRight"].includes(event.key) ||
			event.ctrlKey ||
			event.metaKey ||
			event.altKey
		)
			return;
		event.preventDefault();
		this.travel(
			Number(point.dataset.track),
			event.key === "ArrowRight" ? 0.01 : -0.01,
		);
	};
	private down = (event: PointerEvent): void => {
		const point = (event.target as Element).closest<HTMLElement>(
			"[data-track]",
		);
		if (!point || event.button !== 0 || this.drag) return;
		event.preventDefault();
		point.focus();
		point.setPointerCapture(event.pointerId);
		this.drag = {
			id: event.pointerId,
			x: event.clientX,
			track: Number(point.dataset.track),
			target: point,
		};
	};
	private move = (event: PointerEvent): void => {
		const drag = this.drag;
		if (!drag || drag.id !== event.pointerId) return;
		const width = drag.target.parentElement?.getBoundingClientRect().width ?? 0;
		if (width > 0)
			this.travel(
				drag.track,
				(event.clientX - drag.x) /
					(width *
						(956 / (drag.track === 1 && this.gridVisible ? 1080 : 1000))),
			);
		drag.x = event.clientX;
	};
	private end = (event: PointerEvent): void => {
		if (this.drag?.id === event.pointerId) this.finish();
	};
	private finish(): void {
		this.stopSpeed(0);
		this.stopSpeed(1);
		const drag = this.drag;
		this.drag = undefined;
		if (drag?.target.hasPointerCapture(drag.id))
			drag.target.releasePointerCapture(drag.id);
	}
}
if (!customElements.get("tp-slope-simulator"))
	customElements.define("tp-slope-simulator", TpSlopeSimulator);
declare global {
	interface HTMLElementTagNameMap {
		"tp-slope-simulator": TpSlopeSimulator;
	}
}
